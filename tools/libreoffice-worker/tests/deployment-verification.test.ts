import assert from "node:assert/strict";
import { readdir, readFile } from "node:fs/promises";
import { request } from "node:http";
import os from "node:os";
import path from "node:path";
import { createConversionServer } from "../src/server";

function multipart(filename: string, data: Buffer, boundary = "deployment-verification-boundary") {
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

async function main() {
  const service = createConversionServer({ host: "127.0.0.1", port: 0 });
  const address = await service.listen();
  const baseUrl = `http://${address.host}:${address.port}`;
  try {
    const health = await call(baseUrl, "GET", "/health");
    assert.ok([200, 503].includes(health.statusCode), "health must report availability or degradation");
    const healthBody = JSON.parse(health.body.toString()) as { status: string; libreOffice: { available: boolean; version: string | null; path?: string } };
    assert.equal(typeof healthBody.status, "string");
    assert.equal(typeof healthBody.libreOffice.available, "boolean");
    assert.equal("path" in healthBody.libreOffice, false, "health responses must not expose an executable path");

    const fixturePath = process.env.LO_WORKER_DEPLOYMENT_FIXTURE;
    if (!healthBody.libreOffice.available || !fixturePath) {
      console.log("Deployment conversion verification skipped: LibreOffice is unavailable or LO_WORKER_DEPLOYMENT_FIXTURE is not set.");
      return;
    }

    const [fixture, profileBefore, jobBefore] = await Promise.all([
      readFile(fixturePath),
      temporaryEntries("docsprinthub-lo-profile-"),
      temporaryEntries("docsprinthub-lo-http-"),
    ]);
    const upload = multipart(path.basename(fixturePath), fixture);
    const startedAt = performance.now();
    const response = await call(baseUrl, "POST", "/convert/docx-to-pdf", { "Content-Type": upload.contentType }, upload.body);
    const durationMs = Math.round(performance.now() - startedAt);
    assert.equal(response.statusCode, 200);
    assert.equal(response.headers["content-type"], "application/pdf");
    assert.equal(response.body.subarray(0, 5).toString("ascii"), "%PDF-");
    assert.ok(Number(response.headers["x-output-bytes"]) > 0);
    assert.deepEqual(await temporaryEntries("docsprinthub-lo-profile-"), profileBefore, "LibreOffice profiles must be cleaned after deployment verification");
    assert.deepEqual(await temporaryEntries("docsprinthub-lo-http-"), jobBefore, "HTTP job directories must be cleaned after deployment verification");
    console.log(`Deployment DOCX-to-PDF verification passed in ${durationMs}ms.`);
  } finally {
    await service.close();
  }
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
