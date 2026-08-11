import { access, mkdir, mkdtemp, rm, stat } from "node:fs/promises";
import os from "node:os";
import path from "node:path";
import { pathToFileURL } from "node:url";
import { LibreOfficeConversionError, type ConversionDiagnostics } from "./diagnostics";
import { readLibreOfficeVersion, resolveLibreOfficeExecutable, runLibreOffice } from "./libreoffice";

const DEFAULT_TIMEOUT_MS = 120_000;

export type ConvertDocxOptions = {
  inputPath: string;
  outputDirectory: string;
  libreOfficePath?: string;
  timeoutMs?: number;
};

export type ConversionResult = ConversionDiagnostics & {
  success: true;
  outputBytes: number;
};

async function fileExists(filePath: string) {
  return access(filePath).then(() => true).catch(() => false);
}

export async function validateConversionRequest(inputPath: string, outputDirectory: string) {
  const resolvedInput = path.resolve(inputPath);
  const resolvedOutputDirectory = path.resolve(outputDirectory);
  if (path.extname(resolvedInput).toLowerCase() !== ".docx") {
    throw new Error("Input must be a .docx file.");
  }
  let inputStats;
  try {
    inputStats = await stat(resolvedInput);
  } catch {
    throw new Error(`Input file does not exist: ${resolvedInput}`);
  }
  if (!inputStats.isFile()) throw new Error(`Input path is not a file: ${resolvedInput}`);
  await mkdir(resolvedOutputDirectory, { recursive: true });
  const outputPath = path.join(resolvedOutputDirectory, `${path.basename(resolvedInput, path.extname(resolvedInput))}.pdf`);
  if (await fileExists(outputPath)) {
    throw new Error(`Refusing to overwrite an existing output PDF: ${outputPath}`);
  }
  return { inputPath: resolvedInput, outputDirectory: resolvedOutputDirectory, outputPath };
}

function baseDiagnostics(inputPath: string, outputPath: string, libreOfficePath: string, libreOfficeVersion: string, durationMs: number): ConversionDiagnostics {
  return {
    success: false,
    inputPath,
    inputFilename: path.basename(inputPath),
    outputPath,
    outputFilename: path.basename(outputPath),
    libreOfficePath,
    libreOfficeVersion,
    durationMs,
    warnings: [],
  };
}

export async function convertDocxToPdf(options: ConvertDocxOptions): Promise<ConversionResult> {
  const request = await validateConversionRequest(options.inputPath, options.outputDirectory);
  const startedAt = performance.now();
  const executable = await resolveLibreOfficeExecutable({ executablePath: options.libreOfficePath });
  const version = await readLibreOfficeVersion(executable);
  const profileDirectory = await mkdtemp(path.join(os.tmpdir(), "docsprinthub-lo-profile-"));
  const timeoutMs = options.timeoutMs ?? DEFAULT_TIMEOUT_MS;
  let diagnostics = baseDiagnostics(request.inputPath, request.outputPath, executable, version, 0);

  try {
    const process = await runLibreOffice(executable, [
      "--headless",
      "--nologo",
      "--nodefault",
      "--nofirststartwizard",
      "--norestore",
      `-env:UserInstallation=${pathToFileURL(profileDirectory).href}`,
      "--convert-to",
      "pdf:writer_pdf_Export",
      "--outdir",
      request.outputDirectory,
      request.inputPath,
    ], timeoutMs);
    diagnostics = {
      ...diagnostics,
      durationMs: Math.round(performance.now() - startedAt),
      process,
      warnings: process.stderr.trim() ? ["LibreOffice emitted stderr; inspect process.stderr for details."] : [],
    };
    if (process.timedOut) {
      throw new LibreOfficeConversionError(`LibreOffice conversion timed out after ${timeoutMs}ms.`, diagnostics);
    }
    if (process.exitCode !== 0) {
      throw new LibreOfficeConversionError(`LibreOffice conversion failed with exit code ${String(process.exitCode)}.`, diagnostics);
    }
    if (!await fileExists(request.outputPath)) {
      throw new LibreOfficeConversionError("LibreOffice exited successfully but did not create the expected PDF.", diagnostics);
    }
    const outputStats = await stat(request.outputPath);
    if (!outputStats.isFile() || outputStats.size === 0) {
      throw new LibreOfficeConversionError("LibreOffice produced an empty or invalid output file.", diagnostics);
    }
    return {
      ...diagnostics,
      success: true,
      outputBytes: outputStats.size,
      durationMs: Math.round(performance.now() - startedAt),
    };
  } finally {
    await rm(profileDirectory, { recursive: true, force: true, maxRetries: 3, retryDelay: 250 });
  }
}
