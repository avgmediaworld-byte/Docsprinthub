import { createServer, type IncomingMessage, type Server, type ServerResponse } from "node:http";
import { mkdir, mkdtemp, readFile, rm, writeFile } from "node:fs/promises";
import os from "node:os";
import path from "node:path";
import { randomUUID } from "node:crypto";
import { convertDocxToPdf } from "./converter";
import { LibreOfficeConversionError } from "./diagnostics";
import { activeLibreOfficeProcessCount, readLibreOfficeVersion, resolveLibreOfficeExecutable, stopActiveLibreOfficeProcesses } from "./libreoffice";
import { ConversionTicketError, type ConversionTicketPayload, verifyConversionTicket } from "./ticket";

const DEFAULT_MAX_DOCX_BYTES = 25 * 1024 * 1024;
const DEFAULT_TIMEOUT_MS = 120_000;
const DEFAULT_MAX_CONCURRENT = 2;
const MULTIPART_OVERHEAD_BYTES = 1024 * 1024;

export type ConversionServerOptions = {
  host?: string;
  port?: number;
  maxDocxBytes?: number;
  conversionTimeoutMs?: number;
  maxConcurrentConversions?: number;
  conversionTicketSecret?: string;
  allowedOrigins?: string[];
  converter?: typeof convertDocxToPdf;
};

export type ResolvedConversionServerOptions = Required<Pick<ConversionServerOptions, "host" | "port" | "maxDocxBytes" | "conversionTimeoutMs" | "maxConcurrentConversions">>;

class HttpProblem extends Error {
  constructor(public readonly statusCode: number, message: string) {
    super(message);
    this.name = "HttpProblem";
  }
}

class ConversionLimiter {
  private active = 0;

  constructor(private readonly maximum: number) {}

  tryAcquire() {
    if (this.active >= this.maximum) return false;
    this.active += 1;
    return true;
  }

  release() {
    this.active = Math.max(0, this.active - 1);
  }

  get count() {
    return this.active;
  }
}

class UsedTicketCache {
  private readonly ticketExpirations = new Map<string, number>();

  consume(ticket: ConversionTicketPayload, nowSeconds: number) {
    for (const [ticketId, expiresAt] of this.ticketExpirations) {
      if (expiresAt <= nowSeconds) this.ticketExpirations.delete(ticketId);
    }
    if (this.ticketExpirations.has(ticket.ticketId)) return false;
    // The cache is deliberately bounded. This is defense in depth for one
    // worker instance; durable, cross-instance replay prevention would need a
    // shared store and is not introduced by this POC.
    if (this.ticketExpirations.size >= 10_000) {
      const oldest = this.ticketExpirations.keys().next().value;
      if (oldest) this.ticketExpirations.delete(oldest);
    }
    this.ticketExpirations.set(ticket.ticketId, ticket.exp);
    return true;
  }
}

function positiveInteger(value: string | undefined, fallback: number) {
  const parsed = Number(value);
  return Number.isInteger(parsed) && parsed > 0 ? parsed : fallback;
}

export function optionsFromEnvironment(environment = process.env): ResolvedConversionServerOptions {
  return {
    host: environment.HOST || environment.LO_WORKER_HOST || "0.0.0.0",
    port: positiveInteger(environment.PORT || environment.LO_WORKER_PORT, 3030),
    maxDocxBytes: positiveInteger(environment.MAX_UPLOAD_BYTES || environment.LO_WORKER_MAX_DOCX_BYTES, DEFAULT_MAX_DOCX_BYTES),
    conversionTimeoutMs: positiveInteger(environment.CONVERSION_TIMEOUT_MS || environment.LO_WORKER_TIMEOUT_MS, DEFAULT_TIMEOUT_MS),
    maxConcurrentConversions: positiveInteger(environment.MAX_CONCURRENT_CONVERSIONS || environment.LO_WORKER_MAX_CONCURRENT, DEFAULT_MAX_CONCURRENT),
  };
}

function resolveOptions(options: ConversionServerOptions = {}): ResolvedConversionServerOptions {
  const defaults = optionsFromEnvironment();
  const resolved: ResolvedConversionServerOptions = {
    host: options.host ?? defaults.host,
    port: options.port ?? defaults.port,
    maxDocxBytes: options.maxDocxBytes ?? defaults.maxDocxBytes,
    conversionTimeoutMs: options.conversionTimeoutMs ?? defaults.conversionTimeoutMs,
    maxConcurrentConversions: options.maxConcurrentConversions ?? defaults.maxConcurrentConversions,
  };
  if (resolved.maxDocxBytes <= 0 || resolved.conversionTimeoutMs <= 0 || resolved.maxConcurrentConversions <= 0) {
    throw new Error("Server limits must be positive integers.");
  }
  return resolved;
}

function sendJson(response: ServerResponse, statusCode: number, body: Record<string, unknown>, headers: Record<string, string | number> = {}) {
  const payload = Buffer.from(JSON.stringify(body));
  response.writeHead(statusCode, { ...headers, "Content-Type": "application/json; charset=utf-8", "Content-Length": payload.length, "Cache-Control": "no-store, max-age=0" });
  response.end(payload);
}

function parseAllowedOrigins(origins = process.env.ALLOWED_ORIGINS) {
  return new Set((origins ?? "").split(",").flatMap((value) => {
    try {
      const origin = new URL(value.trim()).origin;
      return origin === "null" ? [] : [origin];
    } catch {
      return [];
    }
  }));
}

function corsHeaders(request: IncomingMessage, allowedOrigins: Set<string>): Record<string, string> | null {
  const origin = request.headers.origin;
  if (!origin) return {};
  if (!allowedOrigins.has(origin)) return null;
  return {
    "Access-Control-Allow-Origin": origin,
    "Access-Control-Allow-Methods": "POST, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type, X-Conversion-Ticket",
    "Access-Control-Expose-Headers": "Content-Disposition, Content-Length, Content-Type, X-Conversion-Id, X-Conversion-Duration-Ms, X-Input-Bytes, X-Output-Bytes",
    "Access-Control-Max-Age": "600",
    Vary: "Origin",
  };
}

function headerValue(value: string) {
  return value.replace(/[\r\n]/g, " ");
}

function safeClientFilename(filename: string) {
  // Browsers can send either POSIX or Windows separators regardless of the
  // server operating system. Keep only the final client-provided name.
  return path.basename(path.win32.basename(filename)).replace(/[\r\n]/g, " ");
}

async function readRequestBody(request: IncomingMessage, maximumBytes: number) {
  const declaredLength = Number(request.headers["content-length"]);
  if (Number.isFinite(declaredLength) && declaredLength > maximumBytes) {
    request.resume();
    throw new HttpProblem(413, `Upload exceeds the ${maximumBytes}-byte request limit.`);
  }
  return new Promise<Buffer>((resolve, reject) => {
    const chunks: Buffer[] = [];
    let size = 0;
    request.on("data", (chunk: Buffer) => {
      size += chunk.length;
      if (size > maximumBytes) {
        request.resume();
        reject(new HttpProblem(413, `Upload exceeds the ${maximumBytes}-byte request limit.`));
        return;
      }
      chunks.push(chunk);
    });
    request.once("end", () => resolve(Buffer.concat(chunks)));
    request.once("error", reject);
  });
}

export type MultipartUpload = { filename: string; data: Buffer };

/** Minimal single-file multipart parser for the local POC. */
export function parseMultipartDocx(contentType: string | undefined, body: Buffer): MultipartUpload {
  const boundaryMatch = contentType?.match(/multipart\/form-data\s*;\s*boundary=(?:"([^"]+)"|([^;\s]+))/i);
  const boundary = boundaryMatch?.[1] ?? boundaryMatch?.[2];
  if (!boundary) throw new HttpProblem(415, "Content-Type must be multipart/form-data with a boundary.");

  const marker = Buffer.from(`--${boundary}`);
  const nextMarker = Buffer.from(`\r\n--${boundary}`);
  let cursor = body.indexOf(marker);
  while (cursor >= 0) {
    cursor += marker.length;
    if (body.subarray(cursor, cursor + 2).equals(Buffer.from("--"))) break;
    if (!body.subarray(cursor, cursor + 2).equals(Buffer.from("\r\n"))) break;
    cursor += 2;
    const headersEnd = body.indexOf(Buffer.from("\r\n\r\n"), cursor);
    if (headersEnd < 0) break;
    const headers = body.toString("utf8", cursor, headersEnd);
    const contentStart = headersEnd + 4;
    const contentEnd = body.indexOf(nextMarker, contentStart);
    if (contentEnd < 0) break;
    const disposition = headers.match(/content-disposition:\s*form-data;[^\r\n]*/i)?.[0] ?? "";
    const fieldName = disposition.match(/\bname="([^"]+)"/i)?.[1];
    const filename = disposition.match(/\bfilename="([^"]*)"/i)?.[1];
    if (fieldName === "file" && filename) {
      const normalizedFilename = safeClientFilename(filename);
      if (path.extname(normalizedFilename).toLowerCase() !== ".docx") {
        throw new HttpProblem(415, "Uploaded file must have a .docx filename.");
      }
      return { filename: normalizedFilename, data: body.subarray(contentStart, contentEnd) };
    }
    cursor = contentEnd + 2;
  }
  throw new HttpProblem(400, "Multipart form must contain one DOCX file in the 'file' field.");
}

function wait(milliseconds: number) {
  return new Promise<void>((resolve) => setTimeout(resolve, milliseconds));
}

export type LocalConversionService = {
  readonly server: Server;
  readonly options: ResolvedConversionServerOptions;
  listen: () => Promise<{ host: string; port: number }>;
  close: (graceMs?: number) => Promise<void>;
  activeConversions: () => number;
};

export function createConversionServer(options: ConversionServerOptions = {}): LocalConversionService {
  const resolved = resolveOptions(options);
  const limiter = new ConversionLimiter(resolved.maxConcurrentConversions);
  const usedTickets = new UsedTicketCache();
  const allowedOrigins = new Set(options.allowedOrigins ?? parseAllowedOrigins());
  const ticketSecret = options.conversionTicketSecret ?? process.env.CONVERSION_TICKET_SECRET;
  const converter = options.converter ?? convertDocxToPdf;
  let closing = false;

  const server = createServer((request, response) => {
    void route(request, response).catch((error) => {
      if (!response.headersSent) sendJson(response, 500, { error: "internal_error", message: "Unexpected service error." });
      console.error(JSON.stringify({ event: "conversion_service_unhandled_error", message: error instanceof Error ? error.message : String(error) }));
    });
  });

  async function route(request: IncomingMessage, response: ServerResponse) {
    const method = request.method ?? "GET";
    const pathname = new URL(request.url ?? "/", "http://localhost").pathname;
    if (method === "GET" && pathname === "/health") {
      const startedAt = performance.now();
      try {
        const executable = await resolveLibreOfficeExecutable();
        const version = await readLibreOfficeVersion(executable);
        sendJson(response, 200, { status: "ok", libreOffice: { available: true, version }, activeConversions: limiter.count, durationMs: Math.round(performance.now() - startedAt) });
      } catch {
        sendJson(response, 503, { status: "degraded", libreOffice: { available: false, version: null }, activeConversions: limiter.count, message: "LibreOffice is unavailable. Configure LIBREOFFICE_PATH or install LibreOffice." });
      }
      return;
    }
    if (pathname !== "/convert/docx-to-pdf") {
      sendJson(response, 404, { error: "not_found" });
      return;
    }
    const cors = corsHeaders(request, allowedOrigins);
    if (cors === null) {
      sendJson(response, 403, { error: "origin_not_allowed", message: "This conversion request is not allowed." });
      return;
    }
    if (method === "OPTIONS") {
      response.writeHead(204, { ...cors, "Cache-Control": "no-store, max-age=0" });
      response.end();
      return;
    }
    if (method !== "POST") {
      sendJson(response, 404, { error: "not_found" }, cors);
      return;
    }
    if (closing) {
      sendJson(response, 503, { error: "service_shutting_down" }, cors);
      return;
    }
    if (!ticketSecret || ticketSecret.length < 32) {
      sendJson(response, 503, { error: "service_unavailable", message: "The document conversion service is temporarily unavailable." }, cors);
      console.error(JSON.stringify({ event: "conversion_ticket_configuration_missing" }));
      return;
    }

    let ticket: ConversionTicketPayload;
    try {
      ticket = verifyConversionTicket(request.headers["x-conversion-ticket"], ticketSecret);
      if (ticket.maxBytes > resolved.maxDocxBytes || !usedTickets.consume(ticket, Math.floor(Date.now() / 1000))) {
        throw new ConversionTicketError();
      }
    } catch (error) {
      const statusCode = error instanceof ConversionTicketError ? 401 : 500;
      const message = statusCode === 401 ? "A valid conversion ticket is required." : "The document conversion service is temporarily unavailable.";
      sendJson(response, statusCode, { error: statusCode === 401 ? "unauthorized" : "service_unavailable", message }, cors);
      return;
    }

    if (!limiter.tryAcquire()) {
      response.setHeader("Retry-After", "1");
      sendJson(response, 429, { error: "conversion_capacity_reached", message: "The conversion service is currently busy. Retry shortly." }, cors);
      return;
    }

    const jobId = randomUUID();
    const startedAt = performance.now();
    let jobDirectory: string | undefined;
    try {
      const upload = parseMultipartDocx(request.headers["content-type"], await readRequestBody(request, resolved.maxDocxBytes + MULTIPART_OVERHEAD_BYTES));
      if (upload.data.length > resolved.maxDocxBytes) {
        throw new HttpProblem(413, `DOCX exceeds the ${resolved.maxDocxBytes}-byte upload limit.`);
      }
      if (upload.data.length > ticket.maxBytes || upload.data.length !== ticket.declaredBytes || upload.filename !== ticket.filename) {
        throw new HttpProblem(401, "The conversion ticket does not match this DOCX upload.");
      }
      jobDirectory = await mkdtemp(path.join(os.tmpdir(), "docsprinthub-lo-http-"));
      const inputDirectory = path.join(jobDirectory, "input");
      const outputDirectory = path.join(jobDirectory, "output");
      await mkdir(inputDirectory, { recursive: true });
      await mkdir(outputDirectory, { recursive: true });
      const inputPath = path.join(inputDirectory, "upload.docx");
      await writeFile(inputPath, upload.data);
      const conversion = await converter({ inputPath, outputDirectory, timeoutMs: resolved.conversionTimeoutMs });
      const pdf = await readFile(conversion.outputPath);
      const outputFilename = `${path.basename(upload.filename, path.extname(upload.filename))}.pdf`;
      // The response is fully buffered at this point, so remove every on-disk
      // request artifact before exposing a successful result. Apart from
      // making cleanup deterministic for callers, this avoids leaving a job
      // directory behind if the client disconnects while receiving the PDF.
      await rm(jobDirectory, { recursive: true, force: true, maxRetries: 3, retryDelay: 250 });
      jobDirectory = undefined;
      response.writeHead(200, {
        ...cors,
        "Content-Type": "application/pdf",
        "Content-Disposition": `attachment; filename="${headerValue(outputFilename)}"`,
        "Content-Length": pdf.length,
        "Cache-Control": "no-store, max-age=0",
        "X-Conversion-Id": jobId,
        "X-Conversion-Duration-Ms": String(conversion.durationMs),
        "X-Input-Bytes": String(upload.data.length),
        "X-Output-Bytes": String(pdf.length),
        "X-LibreOffice-Version": headerValue(conversion.libreOfficeVersion),
      });
      response.end(pdf);
      console.info(JSON.stringify({ event: "docx_to_pdf_completed", jobId, inputFilename: upload.filename, inputBytes: upload.data.length, outputBytes: pdf.length, durationMs: conversion.durationMs, libreOfficeVersion: conversion.libreOfficeVersion, success: true }));
    } catch (error) {
      const statusCode = error instanceof HttpProblem ? error.statusCode : error instanceof LibreOfficeConversionError ? 422 : 500;
      const message = error instanceof HttpProblem
        ? error.message
        : error instanceof LibreOfficeConversionError
          ? "The DOCX could not be converted. Confirm it opens correctly in Word and try again."
          : "The document conversion failed unexpectedly. Please try again.";
      if (!response.headersSent) sendJson(response, statusCode, { error: statusCode === 422 ? "conversion_failed" : "request_failed", message, jobId }, cors);
      console.warn(JSON.stringify({ event: "docx_to_pdf_failed", jobId, statusCode, durationMs: Math.round(performance.now() - startedAt), message, success: false }));
    } finally {
      if (jobDirectory) await rm(jobDirectory, { recursive: true, force: true, maxRetries: 3, retryDelay: 250 });
      limiter.release();
    }
  }

  return {
    server,
    options: resolved,
    activeConversions: () => limiter.count,
    listen: () => new Promise((resolve, reject) => {
      const onError = (error: Error) => { server.off("listening", onListening); reject(error); };
      const onListening = () => {
        server.off("error", onError);
        const address = server.address();
        if (!address || typeof address === "string") return reject(new Error("Server did not expose a TCP address."));
        resolve({ host: resolved.host, port: address.port });
      };
      server.once("error", onError);
      server.once("listening", onListening);
      server.listen(resolved.port, resolved.host);
    }),
    close: async (graceMs = 5_000) => {
      closing = true;
      const closed = new Promise<void>((resolve, reject) => {
        server.close((error) => {
          if (error && (error as NodeJS.ErrnoException).code !== "ERR_SERVER_NOT_RUNNING") reject(error);
          else resolve();
        });
      });
      const deadline = Date.now() + graceMs;
      while (limiter.count > 0 && Date.now() < deadline) await wait(25);
      if (limiter.count > 0) stopActiveLibreOfficeProcesses();
      await closed;
    },
  };
}

async function main() {
  const service = createConversionServer();
  const address = await service.listen();
  console.log(JSON.stringify({ event: "conversion_service_started", ...address, options: service.options }));
  let stopping = false;
  const shutdown = async () => {
    if (stopping) return;
    stopping = true;
    await service.close();
    console.log(JSON.stringify({ event: "conversion_service_stopped", activeLibreOfficeProcesses: activeLibreOfficeProcessCount() }));
  };
  const handleShutdownSignal = () => {
    void shutdown().catch((error) => {
      console.error(JSON.stringify({ event: "conversion_service_shutdown_failed", message: error instanceof Error ? error.message : String(error) }));
      process.exitCode = 1;
    });
  };
  process.once("SIGINT", handleShutdownSignal);
  process.once("SIGTERM", handleShutdownSignal);
}

if (require.main === module) void main();
