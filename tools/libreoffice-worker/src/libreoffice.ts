import { constants } from "node:fs";
import { access } from "node:fs/promises";
import path from "node:path";
import { spawn, type ChildProcess } from "node:child_process";
import type { ProcessCapture } from "./diagnostics";

const WINDOWS_DEFAULT = "C:\\Program Files\\LibreOffice\\program\\soffice.exe";
const MAX_CAPTURED_OUTPUT = 128 * 1024;
const activeProcesses = new Set<ChildProcess>();

export type LibreOfficeExecutableOptions = {
  executablePath?: string;
  environmentPath?: string;
};

function hasPathComponent(candidate: string) {
  return path.isAbsolute(candidate) || candidate.includes("/") || candidate.includes("\\");
}

async function resolveCandidate(candidate: string) {
  if (hasPathComponent(candidate)) {
    const resolved = path.resolve(candidate);
    await access(resolved, constants.X_OK);
    return resolved;
  }

  // On Linux, LibreOffice is normally launched as `soffice` from PATH. Do not
  // turn that command name into a path relative to the worker's current directory.
  const searchDirectories = (process.env.PATH ?? "").split(path.delimiter).filter(Boolean);
  const executableNames = process.platform === "win32"
    ? [candidate, `${candidate}.com`, `${candidate}.exe`]
    : [candidate];
  for (const directory of searchDirectories) {
    for (const executableName of executableNames) {
      const resolved = path.join(directory, executableName);
      try {
        await access(resolved, constants.X_OK);
        return resolved;
      } catch {
        // Keep searching PATH for a usable command.
      }
    }
  }
  throw new Error(`Executable was not found: ${candidate}`);
}

export async function resolveLibreOfficeExecutable(options: LibreOfficeExecutableOptions = {}) {
  const environmentPath = options.environmentPath ?? process.env.LIBREOFFICE_PATH;
  const candidates = [
    options.executablePath,
    environmentPath,
    process.platform === "win32" ? WINDOWS_DEFAULT : "soffice",
  ].filter((candidate): candidate is string => Boolean(candidate));

  for (const candidate of [...new Set(candidates)]) {
    try {
      const resolvedCandidate = await resolveCandidate(candidate);
      // LibreOffice's Windows console host waits for the conversion process and
      // preserves stdout/stderr. The GUI `.exe` can detach `soffice.bin`, which
      // leaves a child-process caller waiting on inherited streams.
      if (process.platform === "win32" && path.extname(resolvedCandidate).toLowerCase() === ".exe") {
        const consoleHost = path.join(path.dirname(resolvedCandidate), `${path.basename(resolvedCandidate, ".exe")}.com`);
        try {
          await access(consoleHost, constants.X_OK);
          return consoleHost;
        } catch {
          // Older installs may not provide the console host; use the configured executable.
        }
      }
      return resolvedCandidate;
    } catch {
      // The next configured/default candidate may still be valid.
    }
  }

  const configurationHint = process.platform === "win32"
    ? `Set LIBREOFFICE_PATH to soffice.exe. Checked the Windows default: ${WINDOWS_DEFAULT}`
    : "Set LIBREOFFICE_PATH to the soffice executable or install LibreOffice so `soffice` is available on PATH.";
  throw new Error(`LibreOffice could not be found. ${configurationHint}`);
}

function collect(stream: NodeJS.ReadableStream | null) {
  let value = "";
  let truncated = false;
  stream?.on("data", (chunk: Buffer | string) => {
    const next = Buffer.isBuffer(chunk) ? chunk.toString("utf8") : chunk;
    const available = MAX_CAPTURED_OUTPUT - Buffer.byteLength(value, "utf8");
    if (available <= 0) {
      truncated = true;
      return;
    }
    if (Buffer.byteLength(next, "utf8") > available) {
      value += Buffer.from(next).subarray(0, available).toString("utf8");
      truncated = true;
      return;
    }
    value += next;
  });
  return { value: () => value, truncated: () => truncated };
}

export async function runLibreOffice(executable: string, argumentsList: string[], timeoutMs: number): Promise<ProcessCapture> {
  return new Promise((resolve, reject) => {
    let settled = false;
    let timedOut = false;
    const child = spawn(executable, argumentsList, { windowsHide: true, stdio: ["ignore", "pipe", "pipe"] });
    activeProcesses.add(child);
    const stdout = collect(child.stdout);
    const stderr = collect(child.stderr);
    const timeout = setTimeout(() => {
      timedOut = true;
      child.kill();
    }, timeoutMs);
    const finish = (value: ProcessCapture) => {
      if (settled) return;
      settled = true;
      clearTimeout(timeout);
      activeProcesses.delete(child);
      resolve(value);
    };
    child.once("error", (error) => {
      if (settled) return;
      settled = true;
      clearTimeout(timeout);
      activeProcesses.delete(child);
      reject(error);
    });
    child.once("close", (exitCode, signal) => {
      finish({
        stdout: stdout.value(),
        stderr: stderr.value(),
        stdoutTruncated: stdout.truncated(),
        stderrTruncated: stderr.truncated(),
        exitCode,
        signal,
        timedOut,
      });
    });
  });
}

/** Stops only LibreOffice children spawned by this worker process. */
export function stopActiveLibreOfficeProcesses() {
  for (const child of activeProcesses) {
    if (!child.killed) child.kill();
  }
}

export function activeLibreOfficeProcessCount() {
  return activeProcesses.size;
}

export async function readLibreOfficeVersion(executable: string) {
  const result = await runLibreOffice(executable, ["--version"], 15_000);
  if (result.timedOut || result.exitCode !== 0) {
    throw new Error(`LibreOffice version check failed (exit ${String(result.exitCode)}).`);
  }
  return result.stdout.trim() || result.stderr.trim() || "LibreOffice version not reported";
}

export async function isLibreOfficeAvailable() {
  try {
    const executable = await resolveLibreOfficeExecutable();
    await readLibreOfficeVersion(executable);
    return true;
  } catch {
    return false;
  }
}
