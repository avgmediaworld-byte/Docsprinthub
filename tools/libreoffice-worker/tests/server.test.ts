import assert from "node:assert/strict";
import { request } from "node:http";
import { readdir, readFile, writeFile } from "node:fs/promises";
import os from "node:os";
import path from "node:path";
import { randomUUID } from "node:crypto";
import { createConversionServer, optionsFromEnvironment, parseMultipartDocx } from "../src/server";
import { convertDocxToPdf } from "../src/converter";
import { LibreOfficeConversionError } from "../src/diagnostics";
import { isLibreOfficeAvailable } from "../src/libreoffice";
import { issueConversionTicket, verifyConversionTicket } from "../src/ticket";

const TEST_SECRET = "test-conversion-ticket-secret-with-at-least-32-characters";
const TEST_ORIGIN = "https://docsprinthub.vercel.app";

function multipart(filename: string, data: Buffer, boundary = "docsprinthub-poc-boundary") {
  return {
    contentType: `multipart/form-data; boundary=${boundary}`,
    body: Buffer.concat([
      Buffer.from(`--${boundary}\r\nContent-Disposition: form-data; name="file"; filename="${filename}"\r\nContent-Type: application/vnd.openxmlformats-officedocument.wordprocessingml.document\r\n\r\n`),
      data,
      Buffer.from(`\r\n--${boundary}--\r\n`),
    ]),
  };
}

async function call(baseUrl: string, method: string, endpoint: string, headers: Record<string, string> = {}, body?: Buffer) {
  const url = new URL(endpoint, baseUrl);
  return new Promise<{ statusCode: number; headers: Record<string, string | string[] | undefined>; body: Buffer }>((resolve, reject) => {
    const client = request(url, { method, headers: { ...headers, ...(body ? { "Content-Length": String(body.length) } : {}) } }, (response) => {
      const chunks: Buffer[] = [];
      response.on("data", (chunk: Buffer) => chunks.push(chunk));
      response.on("end", () => resolve({ statusCode: response.statusCode ?? 0, headers: response.headers, body: Buffer.concat(chunks) }));
    });
    client.once("error", reject);
    if (body) client.write(body);
    client.end();
  });
}

async function temporaryEntries(prefix: string) {
  const entries = await readdir(os.tmpdir(), { withFileTypes: true });
  return new Set(entries.filter((entry) => entry.isDirectory() && entry.name.startsWith(prefix)).map((entry) => entry.name));
}

function ticketFor(filename: string, size: number, overrides: Partial<Parameters<typeof issueConversionTicket>[0]> = {}) {
  const issuedAt = Math.floor(Date.now() / 1000);
  return issueConversionTicket({
    v: 1,
    conversion: "docx-to-pdf",
    iat: issuedAt,
    exp: issuedAt + 60,
    maxBytes: 25 * 1024 * 1024,
    declaredBytes: size,
    ticketId: randomUUID(),
    filename,
    ...overrides,
  }, TEST_SECRET);
}

const fakeConverter: typeof convertDocxToPdf = async ({ inputPath, outputDirectory }) => {
  const outputPath = path.join(outputDirectory, "upload.pdf");
  await writeFile(outputPath, Buffer.from("%PDF-1.4\nmock\n%%EOF\n"));
  return {
    success: true,
    inputPath,
    inputFilename: path.basename(inputPath),
    outputPath,
    outputFilename: path.basename(outputPath),
    libreOfficePath: "fake-soffice",
    libreOfficeVersion: "fake-version",
    durationMs: 1,
    outputBytes: 20,
    warnings: [],
  };
};

async function testNoLibreOfficeUnitPaths() {
  assert.deepEqual(optionsFromEnvironment({}), {
    host: "0.0.0.0",
    port: 3030,
    maxDocxBytes: 25 * 1024 * 1024,
    conversionTimeoutMs: 120_000,
    maxConcurrentConversions: 2,
  });
  assert.deepEqual(optionsFromEnvironment({
    PORT: "4040",
    MAX_UPLOAD_BYTES: "1024",
    CONVERSION_TIMEOUT_MS: "4000",
    MAX_CONCURRENT_CONVERSIONS: "3",
  }), {
    host: "0.0.0.0",
    port: 4040,
    maxDocxBytes: 1024,
    conversionTimeoutMs: 4000,
    maxConcurrentConversions: 3,
  });
  const payload = multipart("sample.docx", Buffer.from("unit fixture"));
  const parsed = parseMultipartDocx(payload.contentType, payload.body);
  assert.equal(parsed.filename, "sample.docx");
  assert.equal(parsed.data.toString(), "unit fixture");
  assert.throws(() => parseMultipartDocx("application/json", Buffer.from("{}")), /multipart/);

  const signed = ticketFor("sample.docx", Buffer.byteLength("unit fixture"));
  assert.equal(verifyConversionTicket(signed, TEST_SECRET).filename, "sample.docx");
  assert.throws(() => verifyConversionTicket("not-a-ticket", TEST_SECRET));
  assert.throws(() => verifyConversionTicket(ticketFor("sample.docx", 1, { exp: 1 }), TEST_SECRET));
  assert.throws(() => verifyConversionTicket(ticketFor("sample.docx", 1, { conversion: "pdf-to-docx" as "docx-to-pdf" }), TEST_SECRET));

  const service = createConversionServer({
    host: "127.0.0.1",
    port: 0,
    maxDocxBytes: 25 * 1024 * 1024,
    maxConcurrentConversions: 1,
    conversionTicketSecret: TEST_SECRET,
    allowedOrigins: [TEST_ORIGIN],
    converter: fakeConverter,
  });
  const address = await service.listen();
  try {
    assert.equal("conversionTicketSecret" in service.options, false, "server configuration logs must not include secrets");
    const baseUrl = `http://${address.host}:${address.port}`;
    const origin = { Origin: TEST_ORIGIN };
    const missingTicket = await call(baseUrl, "POST", "/convert/docx-to-pdf", { "Content-Type": payload.contentType, ...origin }, payload.body);
    assert.equal(missingTicket.statusCode, 401);
    const invalidTicket = await call(baseUrl, "POST", "/convert/docx-to-pdf", { "Content-Type": payload.contentType, "X-Conversion-Ticket": "invalid", ...origin }, payload.body);
    assert.equal(invalidTicket.statusCode, 401);
    const expiredTicket = await call(baseUrl, "POST", "/convert/docx-to-pdf", { "Content-Type": payload.contentType, "X-Conversion-Ticket": ticketFor("sample.docx", Buffer.byteLength("unit fixture"), { exp: 1 }), ...origin }, payload.body);
    assert.equal(expiredTicket.statusCode, 401);
    const wrongTypeTicket = await call(baseUrl, "POST", "/convert/docx-to-pdf", { "Content-Type": payload.contentType, "X-Conversion-Ticket": ticketFor("sample.docx", Buffer.byteLength("unit fixture"), { conversion: "pdf-to-docx" as "docx-to-pdf" }), ...origin }, payload.body);
    assert.equal(wrongTypeTicket.statusCode, 401);

    const logs: string[] = [];
    const originalInfo = console.info;
    console.info = (...values: unknown[]) => logs.push(values.map(String).join(" "));
    let successful;
    try {
      successful = await call(baseUrl, "POST", "/convert/docx-to-pdf", { "Content-Type": payload.contentType, "X-Conversion-Ticket": signed, ...origin }, payload.body);
    } finally {
      console.info = originalInfo;
    }
    assert.equal(successful.statusCode, 200);
    assert.equal(successful.headers["content-type"], "application/pdf");
    assert.equal(successful.headers["cache-control"], "no-store, max-age=0");
    assert.equal(successful.headers["access-control-allow-origin"], TEST_ORIGIN);
    assert.equal(successful.body.subarray(0, 5).toString("ascii"), "%PDF-");
    assert.ok(logs.every((log) => !log.includes(signed) && !log.includes(TEST_SECRET)), "tickets and secrets must not be logged");

    const replay = await call(baseUrl, "POST", "/convert/docx-to-pdf", { "Content-Type": payload.contentType, "X-Conversion-Ticket": signed, ...origin }, payload.body);
    assert.equal(replay.statusCode, 401);
    const disallowedOrigin = await call(baseUrl, "POST", "/convert/docx-to-pdf", { "Content-Type": payload.contentType, Origin: "https://example.invalid", "X-Conversion-Ticket": ticketFor("sample.docx", Buffer.byteLength("unit fixture")) }, payload.body);
    assert.equal(disallowedOrigin.statusCode, 403);
    assert.equal(disallowedOrigin.headers["access-control-allow-origin"], undefined);
    const preflight = await call(baseUrl, "OPTIONS", "/convert/docx-to-pdf", {
      Origin: TEST_ORIGIN,
      "Access-Control-Request-Method": "POST",
      "Access-Control-Request-Headers": "content-type,x-conversion-ticket",
    });
    assert.equal(preflight.statusCode, 204);
    assert.equal(preflight.headers["access-control-allow-origin"], TEST_ORIGIN);

  } finally {
    await service.close();
  }

  const sizeLimited = createConversionServer({
    host: "127.0.0.1",
    port: 0,
    maxDocxBytes: 16,
    conversionTicketSecret: TEST_SECRET,
    allowedOrigins: [TEST_ORIGIN],
    converter: fakeConverter,
  });
  const sizeLimitedAddress = await sizeLimited.listen();
  try {
    const largeUpload = multipart("large.docx", Buffer.alloc(32));
    const response = await call(`http://${sizeLimitedAddress.host}:${sizeLimitedAddress.port}`, "POST", "/convert/docx-to-pdf", {
      "Content-Type": largeUpload.contentType,
      "X-Conversion-Ticket": ticketFor("large.docx", 16, { maxBytes: 16 }),
      Origin: TEST_ORIGIN,
    }, largeUpload.body);
    assert.equal(response.statusCode, 413);
  } finally {
    await sizeLimited.close();
  }

  const failing = createConversionServer({
    host: "127.0.0.1",
    port: 0,
    conversionTicketSecret: TEST_SECRET,
    allowedOrigins: [TEST_ORIGIN],
    converter: async ({ inputPath, outputDirectory }) => {
      const outputPath = path.join(outputDirectory, "upload.pdf");
      throw new LibreOfficeConversionError("private LibreOffice stderr and filesystem diagnostics", {
        success: false,
        inputPath,
        inputFilename: path.basename(inputPath),
        outputPath,
        outputFilename: path.basename(outputPath),
        libreOfficePath: "private-path",
        libreOfficeVersion: "private-version",
        durationMs: 1,
        warnings: [],
      });
    },
  });
  const failingAddress = await failing.listen();
  try {
    const failed = await call(`http://${failingAddress.host}:${failingAddress.port}`, "POST", "/convert/docx-to-pdf", {
      "Content-Type": payload.contentType,
      "X-Conversion-Ticket": ticketFor("sample.docx", Buffer.byteLength("unit fixture")),
      Origin: TEST_ORIGIN,
    }, payload.body);
    assert.equal(failed.statusCode, 422);
    assert.doesNotMatch(failed.body.toString(), /private LibreOffice|private-path|private-version/i);
  } finally {
    await failing.close();
  }
}

async function testOptionalLibreOfficeIntegration() {
  const pbsbFixture = process.env.LO_WORKER_PBSB_FIXTURE;
  const biodataFixture = process.env.LO_WORKER_BIODATA_FIXTURE;
  if (!pbsbFixture || !biodataFixture || !await isLibreOfficeAvailable()) {
    console.log("HTTP integration test skipped: set both LO_WORKER_PBSB_FIXTURE and LO_WORKER_BIODATA_FIXTURE with LibreOffice available.");
    return;
  }
  const [pbsb, biodata] = await Promise.all([readFile(pbsbFixture), readFile(biodataFixture)]);
  const profileBefore = await temporaryEntries("docsprinthub-lo-profile-");
  const jobBefore = await temporaryEntries("docsprinthub-lo-http-");
  const service = createConversionServer({ host: "127.0.0.1", port: 0, maxConcurrentConversions: 2, conversionTicketSecret: TEST_SECRET, allowedOrigins: [TEST_ORIGIN] });
  const address = await service.listen();
  const baseUrl = `http://${address.host}:${address.port}`;
  try {
    const health = await call(baseUrl, "GET", "/health");
    assert.equal(health.statusCode, 200);
    assert.equal(JSON.parse(health.body.toString()).libreOffice.available, true);

    const startedAt = performance.now();
    const [pbsbResponse, biodataResponse] = await Promise.all([
      (() => { const form = multipart(path.basename(pbsbFixture), pbsb, "pbsb-boundary"); return call(baseUrl, "POST", "/convert/docx-to-pdf", { "Content-Type": form.contentType, "X-Conversion-Ticket": ticketFor(path.basename(pbsbFixture), pbsb.length), Origin: TEST_ORIGIN }, form.body); })(),
      (() => { const form = multipart(path.basename(biodataFixture), biodata, "biodata-boundary"); return call(baseUrl, "POST", "/convert/docx-to-pdf", { "Content-Type": form.contentType, "X-Conversion-Ticket": ticketFor(path.basename(biodataFixture), biodata.length, { ticketId: "c3fed6e3-8cbd-4e48-9307-188132342f0b" }), Origin: TEST_ORIGIN }, form.body); })(),
    ]);
    const concurrentDurationMs = Math.round(performance.now() - startedAt);
    for (const response of [pbsbResponse, biodataResponse]) {
      assert.equal(response.statusCode, 200);
      assert.equal(response.headers["content-type"], "application/pdf");
      assert.equal(response.body.subarray(0, 5).toString("ascii"), "%PDF-");
      assert.ok(Number(response.headers["x-output-bytes"]) > 0);
    }
    console.log(`Concurrent HTTP conversions passed in ${concurrentDurationMs}ms.`);
  } finally {
    await service.close();
  }
  assert.deepEqual(await temporaryEntries("docsprinthub-lo-profile-"), profileBefore, "worker profiles must be cleaned");
  assert.deepEqual(await temporaryEntries("docsprinthub-lo-http-"), jobBefore, "HTTP job directories must be cleaned");

  const limited = createConversionServer({ host: "127.0.0.1", port: 0, maxConcurrentConversions: 1, conversionTicketSecret: TEST_SECRET, allowedOrigins: [TEST_ORIGIN] });
  const limitedAddress = await limited.listen();
  try {
    const baseUrl = `http://${limitedAddress.host}:${limitedAddress.port}`;
    const first = multipart(path.basename(pbsbFixture), pbsb, "limit-one");
    const second = multipart(path.basename(biodataFixture), biodata, "limit-two");
    const responses = await Promise.all([
      call(baseUrl, "POST", "/convert/docx-to-pdf", { "Content-Type": first.contentType, "X-Conversion-Ticket": ticketFor(path.basename(pbsbFixture), pbsb.length, { ticketId: "2f11eb6e-f9ce-41bc-85b1-5f4a894fdc37" }), Origin: TEST_ORIGIN }, first.body),
      call(baseUrl, "POST", "/convert/docx-to-pdf", { "Content-Type": second.contentType, "X-Conversion-Ticket": ticketFor(path.basename(biodataFixture), biodata.length, { ticketId: "e7d1261c-a4e1-43e9-a7a4-56b313eb561a" }), Origin: TEST_ORIGIN }, second.body),
    ]);
    assert.ok(responses.some((response) => response.statusCode === 200));
    assert.ok(responses.some((response) => response.statusCode === 429));
    console.log("Concurrency-limit response verified.");
  } finally {
    await limited.close();
  }
}

async function main() {
  await testNoLibreOfficeUnitPaths();
  await testOptionalLibreOfficeIntegration();
  console.log("HTTP server tests passed.");
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
