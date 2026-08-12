import { createHmac, randomUUID } from "node:crypto";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

const MAX_DOCX_BYTES = 25 * 1024 * 1024;
const TICKET_LIFETIME_SECONDS = 5 * 60;
const MAX_METADATA_BYTES = 32 * 1024;
const DOCX_MIME_TYPES = new Set([
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  "application/octet-stream",
]);

type ConversionTicketPayload = {
  v: 1;
  conversion: "docx-to-pdf";
  iat: number;
  exp: number;
  maxBytes: number;
  declaredBytes: number;
  ticketId: string;
  filename: string;
};

function response(message: string, status: number) {
  return Response.json(
    { message },
    { status, headers: { "Cache-Control": "no-store, max-age=0" } },
  );
}

function hasSameOrigin(request: Request) {
  const origin = request.headers.get("origin");
  if (!origin) return true;

  try {
    const originUrl = new URL(origin);
    const host = request.headers.get("x-forwarded-host") ?? request.headers.get("host");
    return Boolean(host) && originUrl.host === host;
  } catch {
    return false;
  }
}

function configuredWorkerUrl() {
  const configuredUrl = process.env.LIBREOFFICE_WORKER_URL?.trim();
  if (!configuredUrl) return null;

  try {
    const workerUrl = new URL(configuredUrl);
    const localDevelopmentUrl = workerUrl.protocol === "http:" && process.env.NODE_ENV !== "production";
    if (workerUrl.protocol !== "https:" && !localDevelopmentUrl) return null;
    return workerUrl.origin;
  } catch {
    return null;
  }
}

function configuredTicketSecret() {
  const secret = process.env.CONVERSION_TICKET_SECRET?.trim();
  // A short secret makes an otherwise sound HMAC construction easy to guess.
  return secret && secret.length >= 32 ? secret : null;
}

function validDocxFilename(filename: unknown): filename is string {
  return typeof filename === "string"
    && filename.length > 5
    && filename.length <= 255
    && /\.docx$/i.test(filename)
    && !/[\\/\r\n\0]/.test(filename);
}

function validDocxMimeType(mimeType: unknown): mimeType is string {
  return typeof mimeType === "string" && DOCX_MIME_TYPES.has(mimeType.toLowerCase());
}

function validSize(size: unknown): size is number {
  return typeof size === "number" && Number.isSafeInteger(size) && size > 0 && size <= MAX_DOCX_BYTES;
}

function createTicket(payload: ConversionTicketPayload, secret: string) {
  const encodedPayload = Buffer.from(JSON.stringify(payload), "utf8").toString("base64url");
  const signedPart = `v1.${encodedPayload}`;
  const signature = createHmac("sha256", secret).update(signedPart).digest("base64url");
  return `${signedPart}.${signature}`;
}

export async function POST(request: Request) {
  if (!hasSameOrigin(request)) return response("This conversion request is not allowed.", 403);
  if (!request.headers.get("content-type")?.toLowerCase().startsWith("application/json")) {
    return response("Conversion metadata must be JSON.", 415);
  }

  const contentLength = Number(request.headers.get("content-length"));
  if (Number.isFinite(contentLength) && contentLength > MAX_METADATA_BYTES) {
    return response("Conversion metadata is too large.", 413);
  }

  const workerUrl = configuredWorkerUrl();
  const secret = configuredTicketSecret();
  if (!workerUrl || !secret) {
    return response("The document conversion service is temporarily unavailable. Please try again shortly.", 503);
  }

  let metadata: unknown;
  try {
    metadata = await request.json();
  } catch {
    return response("Conversion metadata must be valid JSON.", 400);
  }
  if (!metadata || typeof metadata !== "object" || Array.isArray(metadata)) {
    return response("Please select a valid DOCX file.", 400);
  }

  const { filename, mimeType, size } = metadata as Record<string, unknown>;
  if (!validDocxFilename(filename) || !validDocxMimeType(mimeType)) {
    return response("Please select a valid DOCX file.", 415);
  }
  if (!validSize(size)) {
    if (size === 0) return response("The DOCX file is empty.", 400);
    if (typeof size === "number" && Number.isSafeInteger(size) && size > MAX_DOCX_BYTES) {
      return response("The DOCX file is larger than the 25 MiB conversion limit.", 413);
    }
    return response("Please select a valid DOCX file.", 400);
  }

  const issuedAt = Math.floor(Date.now() / 1000);
  const expiresAt = issuedAt + TICKET_LIFETIME_SECONDS;
  const ticket = createTicket({
    v: 1,
    conversion: "docx-to-pdf",
    iat: issuedAt,
    exp: expiresAt,
    maxBytes: MAX_DOCX_BYTES,
    declaredBytes: size,
    ticketId: randomUUID(),
    filename,
  }, secret);

  return Response.json(
    { ticket, expiresAt: new Date(expiresAt * 1000).toISOString(), workerUrl },
    { headers: { "Cache-Control": "no-store, max-age=0" } },
  );
}
