import assert from "node:assert/strict";
import { request } from "node:http";
import { readdir, readFile } from "node:fs/promises";
import os from "node:os";
import path from "node:path";
import { createConversionServer, optionsFromEnvironment, parseMultipartDocx } from "../src/server";
import { isLibreOfficeAvailable } from "../src/libreoffice";

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

  const service = createConversionServer({ host: "127.0.0.1", port: 0, maxDocxBytes: 16, maxConcurrentConversions: 1 });
  const address = await service.listen();
  try {
    const largeUpload = multipart("large.docx", Buffer.alloc(32));
    const response = await call(`http://${address.host}:${address.port}`, "POST", "/convert/docx-to-pdf", { "Content-Type": largeUpload.contentType }, largeUpload.body);
    assert.equal(response.statusCode, 413);
  } finally {
    await service.close();
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
  const service = createConversionServer({ host: "127.0.0.1", port: 0, maxConcurrentConversions: 2 });
  const address = await service.listen();
  const baseUrl = `http://${address.host}:${address.port}`;
  try {
    const health = await call(baseUrl, "GET", "/health");
    assert.equal(health.statusCode, 200);
    assert.equal(JSON.parse(health.body.toString()).libreOffice.available, true);

    const startedAt = performance.now();
    const [pbsbResponse, biodataResponse] = await Promise.all([
      (() => { const form = multipart(path.basename(pbsbFixture), pbsb, "pbsb-boundary"); return call(baseUrl, "POST", "/convert/docx-to-pdf", { "Content-Type": form.contentType }, form.body); })(),
      (() => { const form = multipart(path.basename(biodataFixture), biodata, "biodata-boundary"); return call(baseUrl, "POST", "/convert/docx-to-pdf", { "Content-Type": form.contentType }, form.body); })(),
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

  const limited = createConversionServer({ host: "127.0.0.1", port: 0, maxConcurrentConversions: 1 });
  const limitedAddress = await limited.listen();
  try {
    const baseUrl = `http://${limitedAddress.host}:${limitedAddress.port}`;
    const first = multipart(path.basename(pbsbFixture), pbsb, "limit-one");
    const second = multipart(path.basename(biodataFixture), biodata, "limit-two");
    const responses = await Promise.all([
      call(baseUrl, "POST", "/convert/docx-to-pdf", { "Content-Type": first.contentType }, first.body),
      call(baseUrl, "POST", "/convert/docx-to-pdf", { "Content-Type": second.contentType }, second.body),
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
