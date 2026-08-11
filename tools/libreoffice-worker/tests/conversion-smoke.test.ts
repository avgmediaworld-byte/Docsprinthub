import assert from "node:assert/strict";
import { mkdtemp, rm, writeFile } from "node:fs/promises";
import os from "node:os";
import path from "node:path";
import { convertDocxToPdf, validateConversionRequest } from "../src/converter";
import { isLibreOfficeAvailable } from "../src/libreoffice";

async function testValidation() {
  const directory = await mkdtemp(path.join(os.tmpdir(), "docsprinthub-lo-worker-test-"));
  try {
    const docx = path.join(directory, "input.docx");
    await writeFile(docx, Buffer.from("validation fixture"));
    const request = await validateConversionRequest(docx, path.join(directory, "output"));
    assert.equal(request.outputPath, path.join(directory, "output", "input.pdf"));
    await assert.rejects(() => validateConversionRequest(path.join(directory, "input.txt"), directory), /\.docx/);
  } finally {
    await rm(directory, { recursive: true, force: true });
  }
}

async function testOptionalIntegration() {
  const fixture = process.env.LO_WORKER_FIXTURE;
  if (!fixture || !await isLibreOfficeAvailable()) {
    console.log("LibreOffice integration test skipped: set LO_WORKER_FIXTURE and install/configure LibreOffice to run it.");
    return;
  }
  const outputDirectory = await mkdtemp(path.join(os.tmpdir(), "docsprinthub-lo-worker-output-"));
  try {
    const result = await convertDocxToPdf({ inputPath: fixture, outputDirectory });
    assert.equal(result.success, true);
    assert.ok(result.outputBytes > 0);
  } finally {
    await rm(outputDirectory, { recursive: true, force: true });
  }
}

async function main() {
  await testValidation();
  await testOptionalIntegration();
  console.log("LibreOffice worker smoke test passed.");
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
