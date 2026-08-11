export type ProcessCapture = {
  stdout: string;
  stderr: string;
  stdoutTruncated: boolean;
  stderrTruncated: boolean;
  exitCode: number | null;
  signal: NodeJS.Signals | null;
  timedOut: boolean;
};

export type ConversionDiagnostics = {
  success: boolean;
  inputPath: string;
  inputFilename: string;
  outputPath: string;
  outputFilename: string;
  libreOfficePath: string;
  libreOfficeVersion: string;
  durationMs: number;
  outputBytes?: number;
  process?: ProcessCapture;
  warnings: string[];
};

export class LibreOfficeConversionError extends Error {
  constructor(message: string, public readonly diagnostics: ConversionDiagnostics) {
    super(message);
    this.name = "LibreOfficeConversionError";
  }
}

export function toPrintableDiagnostics(diagnostics: ConversionDiagnostics) {
  return {
    ...diagnostics,
    outputBytes: diagnostics.outputBytes ?? null,
  };
}
