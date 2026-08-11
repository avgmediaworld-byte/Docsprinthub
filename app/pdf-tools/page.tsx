"use client";

import Link from "next/link";
import Image from "next/image";
import { ChangeEvent, DragEvent, useEffect, useLayoutEffect, useMemo, useRef, useState } from "react";
import type { ClipboardEvent as ReactClipboardEvent } from "react";
import JSZip from "jszip";
import jsPDF from "jspdf";
import { Check, ClipboardPaste, Copy, Redo2, Scissors, Trash2, Undo2 } from "lucide-react";
import { degrees, PDFDocument, PDFFont, rgb, StandardFonts } from "pdf-lib";
import type { PDFDocumentLoadingTask, PDFDocumentProxy, PDFPageProxy, PDFWorker, RenderTask } from "pdfjs-dist";
import { trackDownload, trackToolSelection } from "@/app/lib/analytics/client";

type Tool =
  | "merge"
  | "split"
  | "extract"
  | "delete"
  | "reorder"
  | "rotate"
  | "pdfToImage"
  | "imageToPdf"
  | "wordToPdf"
  | "powerpointToPdf"
  | "excelToPdf"
  | "pdfToPowerpoint"
  | "watermark"
  | "pageNumbers"
  | "crop"
  | "optimize"
  | "resizeDecrease"
  | "resizeIncrease"
  | "metadata"
  | "textEdit"
  | "protect"
  | "unlock"
  | "word"
  | "excel"
  | "ocr";

type ToolOption = { id: Tool; title: string; description: string };
type ToolMenu = "convert" | "organize" | "edit" | "security" | "resize";
type MetadataFields = { title: string; author: string; subject: string; keywords: string };
type PdfColor = { red: number; green: number; blue: number };
type FontPreset = "auto" | "arial" | "helvetica" | "timesNewRoman" | "georgia" | "verdana" | "tahoma" | "courierNew" | "trebuchetMs" | "devanagari";
type TextAlignment = "left" | "center" | "right";
type EditableTextRun = {
  id: string;
  pageIndex: number;
  original: string;
  value: string;
  x: number;
  y: number;
  width: number;
  height: number;
  fontSize: number;
  originalFontSize: number;
  fontName: string;
  fontFamily: string;
  fontPreset: FontPreset;
  originalFontPreset: FontPreset;
  isBold: boolean;
  originalIsBold: boolean;
  isItalic: boolean;
  originalIsItalic: boolean;
  isUnderline: boolean;
  originalIsUnderline: boolean;
  alignment: TextAlignment;
  originalAlignment: TextAlignment;
  matchOriginal: boolean;
  textColor: PdfColor;
  originalTextColor: PdfColor;
  backgroundColor: PdfColor;
  originalBackgroundColor: PdfColor;
};
type TextRunEditSnapshot = Pick<EditableTextRun, "value" | "fontPreset" | "fontSize" | "isBold" | "isItalic" | "isUnderline" | "alignment" | "matchOriginal" | "textColor" | "backgroundColor">;
type TextEditHistory = { runId: string | null; snapshots: TextRunEditSnapshot[]; position: number };
type ToolbarPosition = { runId: string | null; left: number };
type TextInputSelection = { start: number; end: number; text: string };
type EditablePdfPage = {
  pageIndex: number;
  width: number;
  height: number;
};
type RenderedPdfPage = { blob: Blob; bytes: Uint8Array; width: number; height: number };
type PdfTextContent = Awaited<ReturnType<PDFPageProxy["getTextContent"]>>;
type EditorPageSurface = ImageBitmap | HTMLCanvasElement;
type PdfEditorCapabilities = {
  worker: boolean;
  readableStream: boolean;
  streamReader: boolean;
  asyncTextIteration: boolean;
  canvas: boolean;
};
type EditorPageFailure = {
  message: string;
  automaticRetryUsed: boolean;
  retrying: boolean;
};
type EditorPdfSession = {
  id: number;
  cancelled: boolean;
  loadingTask: PDFDocumentLoadingTask | null;
  pdf: PDFDocumentProxy | null;
  worker: PDFWorker | null;
  pageCount: number;
  renderTasks: Set<RenderTask>;
  surfaces: Map<number, EditorPageSurface>;
  queuedPages: number[];
  queuedPageIndexes: Set<number>;
  renderingPageIndexes: Set<number>;
  queueRunning: boolean;
  backgroundTimer: number | null;
  pageFailures: Map<number, EditorPageFailure>;
  pageRetryTimers: Map<number, number>;
  cleanupPromise: Promise<void> | null;
  capabilities: PdfEditorCapabilities | null;
  pdfjsVersion: string | null;
};

const toolOptions: ToolOption[] = [
  { id: "merge", title: "Merge PDFs", description: "Combine multiple PDF files." },
  { id: "split", title: "Split PDF", description: "Download selected pages as separate PDFs." },
  { id: "extract", title: "Extract pages", description: "Make a new PDF from chosen pages." },
  { id: "delete", title: "Delete pages", description: "Remove unwanted pages from a PDF." },
  { id: "reorder", title: "Reorder pages", description: "Set the exact page sequence you need." },
  { id: "rotate", title: "Rotate pages", description: "Turn selected pages clockwise." },
  { id: "pdfToImage", title: "PDF to JPG / PNG", description: "Convert PDF pages into image files." },
  { id: "imageToPdf", title: "JPG / PNG to PDF", description: "Create a PDF from photos or images." },
  { id: "wordToPdf", title: "Word to PDF", description: "Convert a DOCX document to a readable PDF." },
  { id: "powerpointToPdf", title: "PowerPoint to PDF", description: "Convert PPTX slide text to a PDF." },
  { id: "excelToPdf", title: "Excel to PDF", description: "Convert XLSX or XLS workbook data to a PDF." },
  { id: "pdfToPowerpoint", title: "PDF to PowerPoint", description: "Convert every PDF page into a PowerPoint slide." },
  { id: "watermark", title: "Add watermark", description: "Place watermark text on selected pages." },
  { id: "pageNumbers", title: "Add page numbers", description: "Add page numbering at the bottom." },
  { id: "crop", title: "Crop margins", description: "Trim equal margins from every selected page." },
  { id: "optimize", title: "Compress PDF", description: "Reduce file size with optimized page images." },
  { id: "resizeDecrease", title: "Size decrease", description: "Reduce every PDF page to a custom proportional size." },
  { id: "resizeIncrease", title: "Size increase", description: "Increase every PDF page to a custom proportional size." },
  { id: "metadata", title: "Edit metadata", description: "Change title, author, subject and keywords." },
  { id: "textEdit", title: "Edit PDF text", description: "Correct selectable PDF text and save the updated PDF." },
  { id: "protect", title: "Protect PDF", description: "Add password and document permissions." },
  { id: "unlock", title: "Unlock PDF", description: "Remove a known password into a visual PDF copy." },
  { id: "word", title: "PDF to Word", description: "Export selectable PDF text as a DOCX file." },
  { id: "excel", title: "PDF to Excel", description: "Export extracted text into an XLSX sheet." },
  { id: "ocr", title: "OCR scanned file", description: "Read text from a scanned PDF, JPG or PNG." },
];

const convertToPdfTools: Tool[] = ["imageToPdf", "wordToPdf", "powerpointToPdf", "excelToPdf"];
const convertFromPdfTools: Tool[] = ["pdfToImage", "word", "excel", "pdfToPowerpoint"];

const toolMenus: Array<{ id: ToolMenu; label: string; tools: Tool[] }> = [
  { id: "convert", label: "Convert", tools: [] },
  { id: "organize", label: "Organize", tools: ["extract", "delete", "reorder", "rotate", "crop"] },
  { id: "edit", label: "Edit PDF", tools: ["watermark", "pageNumbers", "textEdit", "metadata"] },
  { id: "security", label: "Protect", tools: ["protect", "unlock"] },
  { id: "resize", label: "PDF Resizer", tools: ["resizeDecrease", "resizeIncrease"] },
];

const pageTools = new Set<Tool>([
  "split",
  "extract",
  "delete",
  "reorder",
  "rotate",
  "watermark",
  "pageNumbers",
  "crop",
]);

function formatBytes(size: number) {
  return size < 1024 * 1024 ? `${Math.max(1, Math.round(size / 1024))} KB` : `${(size / (1024 * 1024)).toFixed(1)} MB`;
}

function outputName(fileName: string, suffix: string, extension = "pdf") {
  const nameWithoutExtension = fileName.replace(/\.[^.]+$/i, "");
  return `${nameWithoutExtension}-${suffix}.${extension}`;
}

function copyBytes(bytes: Uint8Array) {
  const copied = new Uint8Array(bytes.byteLength);
  copied.set(bytes);
  return copied;
}

const defaultTextColor: PdfColor = { red: 0, green: 0, blue: 0 };
const defaultBackgroundColor: PdfColor = { red: 255, green: 255, blue: 255 };
const PDF_EDITOR_INITIAL_STAGE_TIMEOUT_MS = 15_000;
const PDF_EDITOR_BACKGROUND_STAGE_TIMEOUT_MS = 25_000;
const PDF_EDITOR_MAX_CANVAS_PIXELS = 4_000_000;
const PDF_EDITOR_MAX_CANVAS_EDGE = 2_048;
const PDF_EDITOR_MAX_APPEARANCE_SAMPLE_PIXELS = 12_288;
const devanagariCharacters = /[\u0900-\u097F\uA8E0-\uA8FF]/u;
let devanagariFontBytesPromise: Promise<Uint8Array> | null = null;

function hasDevanagari(text: string) {
  return devanagariCharacters.test(text);
}

function splitTextByWritingSystem(text: string) {
  const segments: Array<{ text: string; devanagari: boolean }> = [];
  for (const character of Array.from(text)) {
    const devanagari = devanagariCharacters.test(character) || character === "\u200C" || character === "\u200D" || (/\s/u.test(character) && segments.at(-1)?.devanagari === true);
    const previous = segments.at(-1);
    if (previous && previous.devanagari === devanagari) previous.text += character;
    else segments.push({ text: character, devanagari });
  }
  return segments;
}

function usesDevanagariFont(run: Pick<EditableTextRun, "original" | "value" | "fontPreset">) {
  return run.fontPreset === "devanagari" || hasDevanagari(run.original) || hasDevanagari(run.value);
}

function editorPreviewFont(run: EditableTextRun) {
  if (usesDevanagariFont(run)) return '"DocSprint Hindi", "Noto Sans Devanagari", Mangal, "Nirmala UI", sans-serif';
  if (run.fontPreset === "arial") return "Arial, Helvetica, sans-serif";
  if (run.fontPreset === "helvetica") return "Helvetica, Arial, sans-serif";
  if (run.fontPreset === "timesNewRoman") return '"Times New Roman", Times, serif';
  if (run.fontPreset === "georgia") return "Georgia, 'Times New Roman', serif";
  if (run.fontPreset === "verdana") return "Verdana, Arial, sans-serif";
  if (run.fontPreset === "tahoma") return "Tahoma, Arial, sans-serif";
  if (run.fontPreset === "courierNew") return '"Courier New", Courier, monospace';
  if (run.fontPreset === "trebuchetMs") return '"Trebuchet MS", Arial, sans-serif';
  return run.fontFamily;
}

async function loadDevanagariFontBytes() {
  if (!devanagariFontBytesPromise) {
    devanagariFontBytesPromise = fetch("/fonts/NotoSansDevanagari-Regular.ttf").then(async (response) => {
      if (!response.ok) throw new Error("The Hindi font could not be loaded. Please try saving again.");
      return new Uint8Array(await response.arrayBuffer());
    });
  }
  return devanagariFontBytesPromise;
}

function clampColorChannel(value: number) {
  return Math.max(0, Math.min(255, Math.round(value)));
}

function cssColor(color: PdfColor) {
  return `rgb(${color.red}, ${color.green}, ${color.blue})`;
}

function pdfColor(color: PdfColor) {
  return rgb(color.red / 255, color.green / 255, color.blue / 255);
}

function colorToHex(color: PdfColor) {
  return `#${[color.red, color.green, color.blue].map((channel) => clampColorChannel(channel).toString(16).padStart(2, "0")).join("")}`;
}

function hexToColor(value: string, fallback: PdfColor) {
  const match = /^#([0-9a-f]{6})$/i.exec(value);
  if (!match) return fallback;
  return {
    red: Number.parseInt(match[1].slice(0, 2), 16),
    green: Number.parseInt(match[1].slice(2, 4), 16),
    blue: Number.parseInt(match[1].slice(4, 6), 16),
  };
}

function colorsMatch(first: PdfColor, second: PdfColor) {
  return first.red === second.red && first.green === second.green && first.blue === second.blue;
}

function isBoldFontDescriptor(descriptor: string) {
  return /bold|black|semi.?bold|demi/.test(descriptor);
}

function isItalicFontDescriptor(descriptor: string) {
  return /italic|oblique/.test(descriptor);
}

function textRunEditSnapshot(run: EditableTextRun): TextRunEditSnapshot {
  return {
    value: run.value,
    fontPreset: run.fontPreset,
    fontSize: run.fontSize,
    isBold: run.isBold,
    isItalic: run.isItalic,
    isUnderline: run.isUnderline,
    alignment: run.alignment,
    matchOriginal: run.matchOriginal,
    textColor: run.textColor,
    backgroundColor: run.backgroundColor,
  };
}

function originalTextRunSnapshot(run: EditableTextRun): TextRunEditSnapshot {
  return {
    value: run.original,
    fontPreset: run.originalFontPreset,
    fontSize: run.originalFontSize,
    isBold: run.originalIsBold,
    isItalic: run.originalIsItalic,
    isUnderline: run.originalIsUnderline,
    alignment: run.originalAlignment,
    matchOriginal: true,
    textColor: run.originalTextColor,
    backgroundColor: run.originalBackgroundColor,
  };
}

function snapshotsMatch(first: TextRunEditSnapshot, second: TextRunEditSnapshot) {
  return first.value === second.value
    && first.fontPreset === second.fontPreset
    && first.fontSize === second.fontSize
    && first.isBold === second.isBold
    && first.isItalic === second.isItalic
    && first.isUnderline === second.isUnderline
    && first.alignment === second.alignment
    && first.matchOriginal === second.matchOriginal
    && colorsMatch(first.textColor, second.textColor)
    && colorsMatch(first.backgroundColor, second.backgroundColor);
}

function textRunHasChanges(run: EditableTextRun) {
  const current = textRunEditSnapshot(run);
  const original = originalTextRunSnapshot(run);
  return current.value !== original.value
    || current.fontPreset !== original.fontPreset
    || current.fontSize !== original.fontSize
    || current.isBold !== original.isBold
    || current.isItalic !== original.isItalic
    || current.isUnderline !== original.isUnderline
    || current.alignment !== original.alignment
    || !colorsMatch(current.textColor, original.textColor)
    || !colorsMatch(current.backgroundColor, original.backgroundColor);
}

function colorDistance(first: PdfColor, second: PdfColor) {
  return Math.abs(first.red - second.red) + Math.abs(first.green - second.green) + Math.abs(first.blue - second.blue);
}

function sampleRunAppearanceFromPreview(
  previewCanvas: HTMLCanvasElement,
  page: Pick<EditablePdfPage, "width" | "height">,
  run: Pick<EditableTextRun, "x" | "y" | "width" | "height">,
): Pick<EditableTextRun, "textColor" | "backgroundColor"> | null {
  if (!page.width || !page.height || !previewCanvas.width || !previewCanvas.height) return null;

  const sourceLeft = Math.max(0, (run.x / page.width) * previewCanvas.width);
  const sourceTop = Math.max(0, ((page.height - run.y - run.height) / page.height) * previewCanvas.height);
  const sourceWidth = Math.min(previewCanvas.width - sourceLeft, Math.max(1, (run.width / page.width) * previewCanvas.width));
  const sourceHeight = Math.min(previewCanvas.height - sourceTop, Math.max(1, (run.height / page.height) * previewCanvas.height));
  if (!sourceWidth || !sourceHeight) return null;

  const sampleScale = Math.min(1, Math.sqrt(PDF_EDITOR_MAX_APPEARANCE_SAMPLE_PIXELS / (sourceWidth * sourceHeight)));
  const sampleCanvas = document.createElement("canvas");
  sampleCanvas.width = Math.max(1, Math.floor(sourceWidth * sampleScale));
  sampleCanvas.height = Math.max(1, Math.floor(sourceHeight * sampleScale));
  const sampleContext = sampleCanvas.getContext("2d", { willReadFrequently: true });
  if (!sampleContext) return null;

  let data: Uint8ClampedArray;
  try {
    sampleContext.drawImage(previewCanvas, sourceLeft, sourceTop, sourceWidth, sourceHeight, 0, 0, sampleCanvas.width, sampleCanvas.height);
    data = sampleContext.getImageData(0, 0, sampleCanvas.width, sampleCanvas.height).data;
  } catch {
    sampleCanvas.width = 0;
    sampleCanvas.height = 0;
    return null;
  }
  const colorBuckets = new Map<string, { count: number; red: number; green: number; blue: number }>();
  for (let index = 0; index < data.length; index += 4) {
    if (data[index + 3] < 32) continue;
    const red = data[index];
    const green = data[index + 1];
    const blue = data[index + 2];
    const key = `${red >> 4}-${green >> 4}-${blue >> 4}`;
    const bucket = colorBuckets.get(key) ?? { count: 0, red: 0, green: 0, blue: 0 };
    bucket.count += 1;
    bucket.red += red;
    bucket.green += green;
    bucket.blue += blue;
    colorBuckets.set(key, bucket);
  }

  const sampled = [...colorBuckets.values()].map((bucket) => ({
    count: bucket.count,
    color: {
      red: clampColorChannel(bucket.red / bucket.count),
      green: clampColorChannel(bucket.green / bucket.count),
      blue: clampColorChannel(bucket.blue / bucket.count),
    },
  }));
  const backgroundColor = sampled.sort((first, second) => second.count - first.count)[0]?.color ?? defaultBackgroundColor;
  const textColor = sampled.reduce<{ color: PdfColor; score: number } | null>((best, candidate) => {
    const score = candidate.count * colorDistance(candidate.color, backgroundColor);
    return !best || score > best.score ? { color: candidate.color, score } : best;
  }, null)?.color ?? defaultTextColor;

  sampleCanvas.width = 0;
  sampleCanvas.height = 0;
  return { textColor: colorDistance(textColor, backgroundColor) < 24 ? defaultTextColor : textColor, backgroundColor };
}

function createEditorPdfSession(id: number): EditorPdfSession {
  return {
    id,
    cancelled: false,
    loadingTask: null,
    pdf: null,
    worker: null,
    pageCount: 0,
    renderTasks: new Set(),
    surfaces: new Map(),
    queuedPages: [],
    queuedPageIndexes: new Set(),
    renderingPageIndexes: new Set(),
    queueRunning: false,
    backgroundTimer: null,
    pageFailures: new Map(),
    pageRetryTimers: new Map(),
    cleanupPromise: null,
    capabilities: null,
    pdfjsVersion: null,
  };
}

function releaseEditorPageSurface(surface: EditorPageSurface) {
  if (typeof ImageBitmap !== "undefined" && surface instanceof ImageBitmap) {
    surface.close();
    return;
  }
  const canvas = surface as HTMLCanvasElement;
  canvas.width = 0;
  canvas.height = 0;
}

async function destroyEditorPdfSession(session: EditorPdfSession) {
  if (session.cleanupPromise) return session.cleanupPromise;

  session.cancelled = true;
  if (session.backgroundTimer !== null) window.clearTimeout(session.backgroundTimer);
  session.backgroundTimer = null;
  session.pageRetryTimers.forEach((timer) => window.clearTimeout(timer));
  session.pageRetryTimers.clear();
  session.pageFailures.clear();
  session.queuedPages = [];
  session.queuedPageIndexes.clear();
  session.renderTasks.forEach((task) => task.cancel());
  session.renderTasks.clear();
  session.surfaces.forEach(releaseEditorPageSurface);
  session.surfaces.clear();

  const loadingTask = session.loadingTask;
  const worker = session.worker;
  session.loadingTask = null;
  session.pdf = null;
  session.worker = null;
  session.cleanupPromise = (async () => {
    if (loadingTask) await loadingTask.destroy().catch(() => undefined);
    else await worker?.destroy();
  })();
  return session.cleanupPromise;
}

function withPdfEditorWatchdog<T>(promise: Promise<T>, stage: string, timeoutMs: number) {
  return new Promise<T>((resolve, reject) => {
    const timeout = window.setTimeout(() => {
      reject(new Error(`${stage} took too long. Check that your browser allows PDF workers, then retry.`));
    }, timeoutMs);
    void promise.then(
      (value) => {
        window.clearTimeout(timeout);
        resolve(value);
      },
      (reason) => {
        window.clearTimeout(timeout);
        reject(reason);
      },
    );
  });
}

function isPdfEditorWatchdogTimeout(error: unknown) {
  const message = error instanceof Error ? error.message : String(error);
  return /\btook too long\b/i.test(message);
}

function isPdfEditorCancellation(session: EditorPdfSession, error: unknown) {
  if (session.cancelled) return true;
  const message = error instanceof Error ? error.message : String(error);
  return /abort|cancel|destroyed|worker was terminated/i.test(message);
}

function editorRenderViewport(page: PDFPageProxy) {
  const originalViewport = page.getViewport({ scale: 1 });
  const maxScale = Math.min(
    1.5,
    PDF_EDITOR_MAX_CANVAS_EDGE / originalViewport.width,
    PDF_EDITOR_MAX_CANVAS_EDGE / originalViewport.height,
    Math.sqrt(PDF_EDITOR_MAX_CANVAS_PIXELS / (originalViewport.width * originalViewport.height)),
  );
  if (!Number.isFinite(maxScale) || maxScale < 0.1) {
    throw new Error("This PDF page is too large to preview safely in the browser.");
  }
  return { originalViewport, viewport: page.getViewport({ scale: maxScale }) };
}

function downloadBlob(blob: Blob, fileName: string) {
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = fileName;
  document.body.appendChild(link);
  link.click();
  link.remove();
  const format = blob.type.includes("pdf") ? "pdf" : blob.type.includes("zip") ? "zip" : blob.type.includes("wordprocessingml") ? "docx" : blob.type.includes("spreadsheetml") ? "xlsx" : blob.type.includes("text/plain") ? "txt" : "file";
  window.dispatchEvent(new CustomEvent("dsh:pdf-download", { detail: { format } }));
  window.setTimeout(() => URL.revokeObjectURL(url), 500);
}

function downloadPdf(bytes: Uint8Array, fileName: string) {
  downloadBlob(new Blob([copyBytes(bytes).buffer], { type: "application/pdf" }), fileName);
}

function parsePageSelection(value: string, pageCount: number, preserveInputOrder = false) {
  if (!value.trim()) return Array.from({ length: pageCount }, (_, index) => index);

  const selected: number[] = [];
  const included = new Set<number>();
  for (const part of value.split(",")) {
    const match = part.trim().match(/^(\d+)(?:\s*-\s*(\d+))?$/);
    if (!match) throw new Error("Use page numbers like 1, 3-5 or 2,4,6.");

    const start = Number(match[1]);
    const end = Number(match[2] ?? match[1]);
    if (start < 1 || end < start || end > pageCount) throw new Error(`Choose pages between 1 and ${pageCount}.`);

    for (let page = start; page <= end; page += 1) {
      if (!included.has(page - 1)) {
        included.add(page - 1);
        selected.push(page - 1);
      }
    }
  }
  return preserveInputOrder ? selected : selected.sort((first, second) => first - second);
}

async function openPdf(file: File) {
  return PDFDocument.load(await file.arrayBuffer());
}

async function selectedCopy(sourcePdf: PDFDocument, pageIndexes: number[]) {
  const nextPdf = await PDFDocument.create();
  const pages = await nextPdf.copyPages(sourcePdf, pageIndexes);
  pages.forEach((page) => nextPdf.addPage(page));
  return nextPdf;
}

function canvasToBlob(canvas: HTMLCanvasElement, type: "image/png" | "image/jpeg", quality?: number) {
  return new Promise<Blob>((resolve, reject) => {
    canvas.toBlob((blob) => (blob ? resolve(blob) : reject(new Error("The image could not be created."))), type, quality);
  });
}

async function loadPdfJs() {
  const pdfjs = await import("pdfjs-dist/legacy/build/pdf.mjs");

  // PDF.js renders pages inside a Web Worker. Bundling the worker with the
  // same client module gives every PDF-rendering tool a usable browser URL.
  if (!pdfjs.GlobalWorkerOptions.workerSrc) {
    pdfjs.GlobalWorkerOptions.workerSrc = new URL(
      "pdfjs-dist/legacy/build/pdf.worker.min.mjs",
      import.meta.url,
    ).toString();
  }

  return pdfjs;
}

function getPdfEditorCapabilities(): PdfEditorCapabilities {
  const readableStream = typeof ReadableStream === "function";
  const streamPrototype = readableStream ? ReadableStream.prototype : null;
  const streamReader = typeof streamPrototype?.getReader === "function";
  const asyncIterator = streamReader
    && typeof Symbol === "function"
    && typeof Symbol.asyncIterator === "symbol"
    ? (streamPrototype as unknown as { [key: symbol]: unknown })[Symbol.asyncIterator]
    : undefined;
  const asyncTextIteration = typeof asyncIterator === "function";
  const canvas = typeof document !== "undefined" && (() => {
    const element = document.createElement("canvas");
    return typeof element.getContext === "function" && element.getContext("2d") !== null;
  })();

  return {
    worker: typeof Worker === "function",
    readableStream,
    streamReader,
    asyncTextIteration,
    canvas,
  };
}

function unsupportedPdfEditorCapabilitiesMessage(capabilities: PdfEditorCapabilities) {
  const missing: string[] = [];
  if (!capabilities.worker) missing.push("Web Workers");
  if (!capabilities.readableStream) missing.push("ReadableStream");
  else if (!capabilities.streamReader) missing.push("ReadableStream.getReader()");
  if (!capabilities.canvas) missing.push("Canvas");
  if (!missing.length) return "";
  return `This browser cannot run the PDF text editor because ${missing.join(", ")} ${missing.length === 1 ? "is" : "are"} unavailable. Enable these browser features or use a supported browser, then retry.`;
}

function logPdfEditorDiagnostic(
  stage: string,
  capabilities: PdfEditorCapabilities,
  pdfjsVersion: string | null,
  error?: unknown,
) {
  const diagnostic = {
    stage,
    pdfjsVersion,
    capabilities,
    userAgent: typeof navigator === "undefined" ? "unavailable" : navigator.userAgent,
    ...(error ? {
      error: {
        name: error instanceof Error ? error.name : typeof error,
        message: error instanceof Error ? error.message : String(error),
      },
    } : {}),
  };
  console.info("[DocSprintHub PDF editor]", diagnostic);
}

function isPdfTextStreamAsyncIterationError(error: unknown) {
  const message = error instanceof Error ? error.message : String(error);
  return /\bnot async iterable\b/i.test(message);
}

async function cancelEditorPdfTextStream(stream: ReturnType<PDFPageProxy["streamTextContent"]> | null, reason: unknown) {
  if (!stream) return;
  const error = reason instanceof Error ? reason : new Error(String(reason));
  await stream.cancel(error).catch(() => undefined);
}

async function readEditorPdfTextContentWithReader(page: PDFPageProxy): Promise<PdfTextContent> {
  const reader = page.streamTextContent().getReader();
  const textContent: PdfTextContent = {
    items: [],
    styles: Object.create(null),
    lang: null,
  };

  try {
    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      if (!value) continue;
      textContent.lang ??= value.lang;
      Object.assign(textContent.styles, value.styles);
      textContent.items.push(...value.items);
    }
  } catch (error) {
    await reader.cancel(error instanceof Error ? error : new Error(String(error))).catch(() => undefined);
    throw error;
  } finally {
    reader.releaseLock();
  }

  return textContent;
}

async function readEditorPdfTextContent(
  page: PDFPageProxy,
  capabilities: PdfEditorCapabilities,
  pdfjsVersion: string | null,
): Promise<PdfTextContent> {
  if (!capabilities.asyncTextIteration) {
    logPdfEditorDiagnostic("text-stream-reader-fallback", capabilities, pdfjsVersion);
    return readEditorPdfTextContentWithReader(page);
  }

  let publicTextStream: ReturnType<PDFPageProxy["streamTextContent"]> | null = null;
  const originalStreamTextContent = page.streamTextContent;
  page.streamTextContent = ((params) => {
    const stream = originalStreamTextContent.call(page, params);
    publicTextStream = stream;
    return stream;
  }) as PDFPageProxy["streamTextContent"];

  try {
    return await page.getTextContent();
  } catch (error) {
    if (!isPdfTextStreamAsyncIterationError(error)) throw error;

    // PDF.js creates the stream inside getTextContent(). Capture and cancel it
    // before the one reader-based retry so a partially-started stream cannot
    // keep the worker waiting in browsers with incomplete stream support.
    await cancelEditorPdfTextStream(publicTextStream, error);
    page.cleanup();
    logPdfEditorDiagnostic("text-stream-reader-retry", capabilities, pdfjsVersion, error);
    try {
      return await readEditorPdfTextContentWithReader(page);
    } catch (fallbackError) {
      logPdfEditorDiagnostic("text-stream-reader-fallback-failed", capabilities, pdfjsVersion, fallbackError);
      throw new Error("This browser could not read the PDF text stream. Retry or choose another PDF.");
    }
  } finally {
    page.streamTextContent = originalStreamTextContent;
  }
}

async function readPdfTextContent(page: PDFPageProxy): Promise<PdfTextContent> {
  const reader = page.streamTextContent().getReader();
  const textContent: PdfTextContent = {
    items: [],
    styles: Object.create(null),
    lang: null,
  };

  try {
    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      if (!value) continue;
      textContent.lang ??= value.lang;
      Object.assign(textContent.styles, value.styles);
      textContent.items.push(...value.items);
    }
  } finally {
    reader.releaseLock();
  }

  return textContent;
}

function fileKey(file: File) {
  return `${file.name}-${file.size}-${file.lastModified}`;
}

function imageDataUrl(file: File) {
  return new Promise<string>((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(typeof reader.result === "string" ? reader.result : "");
    reader.onerror = () => reject(new Error("The image preview could not be created."));
    reader.readAsDataURL(file);
  });
}

async function renderPdfThumbnail(file: File) {
  const pdfjs = await loadPdfJs();
  const loadingTask = pdfjs.getDocument({ data: new Uint8Array(await file.arrayBuffer()) });
  const pdf = await loadingTask.promise;

  try {
    const page = await pdf.getPage(1);
    const viewport = page.getViewport({ scale: 0.28 });
    const canvas = document.createElement("canvas");
    canvas.width = Math.ceil(viewport.width);
    canvas.height = Math.ceil(viewport.height);
    const context = canvas.getContext("2d");
    if (!context) throw new Error("The browser canvas could not be started.");
    await page.render({ canvas, canvasContext: context, viewport }).promise;
    return canvas.toDataURL("image/png");
  } finally {
    await pdf.cleanup();
  }
}

async function renderPdfPagesFromBytes(
  sourceBytes: Uint8Array,
  password = "",
  imageType: "image/png" | "image/jpeg" = "image/png",
  scale = 1.75,
  jpegQuality = 0.92,
) {
  const pdfjs = await loadPdfJs();
  const loadingTask = pdfjs.getDocument({ data: copyBytes(sourceBytes), password: password || undefined });
  const pdf = await loadingTask.promise;
  const pages: RenderedPdfPage[] = [];

  try {
    for (let number = 1; number <= pdf.numPages; number += 1) {
      const page = await pdf.getPage(number);
      const originalViewport = page.getViewport({ scale: 1 });
      const viewport = page.getViewport({ scale });
      const canvas = document.createElement("canvas");
      canvas.width = Math.ceil(viewport.width);
      canvas.height = Math.ceil(viewport.height);
      const context = canvas.getContext("2d");
    if (!context) throw new Error("The browser canvas could not be started.");
      await page.render({ canvas, canvasContext: context, viewport }).promise;
      const blob = await canvasToBlob(canvas, imageType, imageType === "image/jpeg" ? jpegQuality : undefined);
      pages.push({ blob, bytes: new Uint8Array(await blob.arrayBuffer()), width: originalViewport.width, height: originalViewport.height });
    }
  } finally {
    await pdf.cleanup();
  }

  return pages;
}

async function renderPdfPages(
  file: File,
  password = "",
  imageType: "image/png" | "image/jpeg" = "image/png",
  scale = 1.75,
  jpegQuality = 0.92,
) {
  return renderPdfPagesFromBytes(new Uint8Array(await file.arrayBuffer()), password, imageType, scale, jpegQuality);
}

async function extractPdfText(file: File, password = "") {
  const pdfjs = await loadPdfJs();
  const loadingTask = pdfjs.getDocument({ data: new Uint8Array(await file.arrayBuffer()), password: password || undefined });
  const pdf = await loadingTask.promise;
  const textPages: string[] = [];
  try {
    for (let number = 1; number <= pdf.numPages; number += 1) {
      const content = await readPdfTextContent(await pdf.getPage(number));
      textPages.push(content.items.map((item) => ("str" in item ? item.str : "")).join(" ").replace(/\s+/g, " ").trim());
    }
  } finally {
    await pdf.cleanup();
  }
  return textPages;
}

function editableTextRunsFromContent(pageIndex: number, content: PdfTextContent) {
  const pageRuns: EditableTextRun[] = [];
  content.items.forEach((item, itemIndex) => {
    if (!("str" in item) || !item.str.trim()) return;

    const [a, b, c, d, x, y] = item.transform;
    const style = content.styles[item.fontName];
    // Rotated and skewed text cannot be safely covered by a rectangular
    // correction layer, so it is intentionally excluded from this editor.
    if (Math.abs(b) > 0.01 || Math.abs(c) > 0.01) return;

    const fontSize = Math.max(4, Math.round(Math.abs(d || a || item.height || 12) * 10) / 10);
    const fontDescriptor = `${item.fontName} ${style?.fontFamily ?? ""}`.toLowerCase();
    pageRuns.push({
      id: `${pageIndex}-${itemIndex}`,
      pageIndex,
      original: item.str,
      value: item.str,
      x,
      y,
      width: Math.max(1, item.width),
      height: Math.max(fontSize, item.height || fontSize),
      fontSize,
      originalFontSize: fontSize,
      fontName: item.fontName,
      fontFamily: style?.fontFamily || item.fontName,
      fontPreset: "auto",
      originalFontPreset: "auto",
      isBold: isBoldFontDescriptor(fontDescriptor),
      originalIsBold: isBoldFontDescriptor(fontDescriptor),
      isItalic: isItalicFontDescriptor(fontDescriptor),
      originalIsItalic: isItalicFontDescriptor(fontDescriptor),
      isUnderline: false,
      originalIsUnderline: false,
      alignment: "left",
      originalAlignment: "left",
      matchOriginal: true,
      textColor: defaultTextColor,
      originalTextColor: defaultTextColor,
      backgroundColor: defaultBackgroundColor,
      originalBackgroundColor: defaultBackgroundColor,
    });
  });
  return pageRuns;
}

async function renderEditorPageSurface(page: PDFPageProxy, session: EditorPdfSession, timeoutMs: number) {
  const { originalViewport, viewport } = editorRenderViewport(page);
  const canvas = document.createElement("canvas");
  canvas.width = Math.ceil(viewport.width);
  canvas.height = Math.ceil(viewport.height);
  const context = canvas.getContext("2d");
  if (!context) {
    canvas.width = 0;
    canvas.height = 0;
    throw new Error("The browser canvas could not be started.");
  }

  const renderTask = page.render({ canvas, canvasContext: context, viewport, background: "white" });
  session.renderTasks.add(renderTask);
  try {
    await withPdfEditorWatchdog(renderTask.promise, "Rendering the PDF page", timeoutMs);
    if (session.cancelled) throw new Error("PDF editor loading was cancelled.");
    if (typeof window.createImageBitmap === "function") {
      const bitmap = await withPdfEditorWatchdog(window.createImageBitmap(canvas), "Preparing the PDF preview", timeoutMs);
      canvas.width = 0;
      canvas.height = 0;
      return { surface: bitmap as EditorPageSurface, width: originalViewport.width, height: originalViewport.height };
    }
    return { surface: canvas as EditorPageSurface, width: originalViewport.width, height: originalViewport.height };
  } catch (error) {
    renderTask.cancel();
    canvas.width = 0;
    canvas.height = 0;
    throw error;
  } finally {
    session.renderTasks.delete(renderTask);
  }
}

function matchingStandardFont(run: EditableTextRun) {
  const descriptor = run.fontPreset === "auto" ? `${run.fontName} ${run.fontFamily}`.toLowerCase() : run.fontPreset;
  const isBold = run.isBold || isBoldFontDescriptor(descriptor);
  const isItalic = run.isItalic || isItalicFontDescriptor(descriptor);

  if (/courier|mono/.test(descriptor)) {
    if (isBold && isItalic) return StandardFonts.CourierBoldOblique;
    if (isBold) return StandardFonts.CourierBold;
    if (isItalic) return StandardFonts.CourierOblique;
    return StandardFonts.Courier;
  }

  if (/times|serif|georgia|cambria|garamond|palatino|bookman/.test(descriptor)) {
    if (isBold && isItalic) return StandardFonts.TimesRomanBoldItalic;
    if (isBold) return StandardFonts.TimesRomanBold;
    if (isItalic) return StandardFonts.TimesRomanItalic;
    return StandardFonts.TimesRoman;
  }

  if (isBold && isItalic) return StandardFonts.HelveticaBoldOblique;
  if (isBold) return StandardFonts.HelveticaBold;
  if (isItalic) return StandardFonts.HelveticaOblique;
  return StandardFonts.Helvetica;
}

type TextPdfPage = { title: string; paragraphs: string[] };

function xmlParagraphs(xml: string) {
  const document = new DOMParser().parseFromString(xml, "application/xml");
  if (document.querySelector("parsererror")) throw new Error("The Office document could not be read.");

  const paragraphs = Array.from(document.getElementsByTagNameNS("*", "p"));
  return paragraphs
    .map((paragraph) => Array.from(paragraph.getElementsByTagNameNS("*", "t")).map((node) => node.textContent ?? "").join("").replace(/\s+/g, " ").trim())
    .filter(Boolean);
}

async function officeArchive(file: File) {
  try {
    return await JSZip.loadAsync(await file.arrayBuffer());
  } catch {
    throw new Error("This file could not be opened. Use a modern Office file format.");
  }
}

async function docxPages(file: File): Promise<TextPdfPage[]> {
  const archive = await officeArchive(file);
  const documentXml = archive.file("word/document.xml");
  if (!documentXml) throw new Error("Use a .docx Word document.");
  const paragraphs = xmlParagraphs(await documentXml.async("text"));
  if (!paragraphs.length) throw new Error("No readable text was found in this Word document.");
  return [{ title: file.name.replace(/\.docx$/i, ""), paragraphs }];
}

async function powerpointPages(file: File): Promise<TextPdfPage[]> {
  const archive = await officeArchive(file);
  const slideFiles = Object.keys(archive.files)
    .filter((path) => /^ppt\/slides\/slide\d+\.xml$/i.test(path))
    .sort((first, second) => Number(first.match(/slide(\d+)\.xml/i)?.[1]) - Number(second.match(/slide(\d+)\.xml/i)?.[1]));
  if (!slideFiles.length) throw new Error("Use a .pptx PowerPoint presentation.");

  const pages = await Promise.all(slideFiles.map(async (path, index) => ({
    title: `Slide ${index + 1}`,
    paragraphs: xmlParagraphs(await archive.files[path].async("text")),
  })));
  if (!pages.some((page) => page.paragraphs.length)) throw new Error("No readable slide text was found in this presentation.");
  return pages;
}

async function excelPages(file: File): Promise<TextPdfPage[]> {
  const XLSX = await import("xlsx");
  let workbook: ReturnType<typeof XLSX.read>;
  try {
    workbook = XLSX.read(await file.arrayBuffer(), { type: "array" });
  } catch {
    throw new Error("This spreadsheet could not be read. Use an .xlsx or .xls file.");
  }

  const pages = workbook.SheetNames.map((sheetName) => {
    const rows = XLSX.utils.sheet_to_json<string[]>(workbook.Sheets[sheetName], { header: 1, defval: "" });
    return {
      title: sheetName,
      paragraphs: rows.map((row) => row.map((cell) => String(cell).trim()).join(" | ").replace(/(?: \| )+$/g, "")).filter(Boolean),
    };
  });
  if (!pages.some((page) => page.paragraphs.length)) throw new Error("No readable cells were found in this spreadsheet.");
  return pages;
}

function downloadTextPdf(pages: TextPdfPage[], fileName: string, orientation: "portrait" | "landscape" = "portrait") {
  const pdf = new jsPDF({ orientation, unit: "pt", format: "a4", compress: true });
  const margin = 42;
  const pageWidth = pdf.internal.pageSize.getWidth();
  const pageHeight = pdf.internal.pageSize.getHeight();
  const lineHeight = 16;
  let isFirstPage = true;

  for (const page of pages) {
    if (!isFirstPage) pdf.addPage();
    isFirstPage = false;
    let y = margin;
    const drawTitle = (continued = false) => {
      pdf.setFont("helvetica", "bold");
      pdf.setFontSize(16);
      pdf.text(continued ? `${page.title} (continued)` : page.title, margin, y);
      y += 28;
      pdf.setDrawColor(191, 219, 254);
      pdf.line(margin, y - 10, pageWidth - margin, y - 10);
      pdf.setFont("helvetica", "normal");
      pdf.setFontSize(10.5);
    };

    drawTitle();
    for (const paragraph of page.paragraphs) {
      const lines = pdf.splitTextToSize(paragraph, pageWidth - margin * 2) as string[];
      if (y + lines.length * lineHeight > pageHeight - margin) {
        pdf.addPage();
        y = margin;
        drawTitle(true);
      }
      pdf.text(lines, margin, y);
      y += lines.length * lineHeight + 7;
    }
  }

  downloadBlob(pdf.output("blob"), fileName);
}

function blobDataUrl(blob: Blob) {
  return new Promise<string>((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(typeof reader.result === "string" ? reader.result : "");
    reader.onerror = () => reject(new Error("The slide image could not be prepared."));
    reader.readAsDataURL(blob);
  });
}

function ProgressMeter({ title, message, progress }: { title: string; message: string; progress: number }) {
  const displayedProgress = Math.round(Math.max(0, Math.min(100, progress)));
  return <div className="w-full rounded-xl border border-blue-200 bg-white p-4 text-left shadow-sm">
    <div className="flex items-center justify-between gap-3"><p className="text-sm font-bold text-blue-950">{title}</p><span className="shrink-0 text-xs font-bold text-blue-700">Progress: {displayedProgress}%</span></div>
    <div role="progressbar" aria-label={title} aria-valuemin={0} aria-valuemax={100} aria-valuenow={displayedProgress} className="mt-3 h-2 overflow-hidden rounded-full bg-blue-100"><div className="h-full rounded-full bg-blue-600" style={{ width: `${Math.max(0, Math.min(100, progress))}%` }} /></div>
    <p className="mt-2 text-xs leading-5 text-slate-600">{message}</p>
  </div>;
}

function yieldToBrowser() {
  return new Promise<void>((resolve) => requestAnimationFrame(() => resolve()));
}

export default function PdfToolsPage() {
  const [activeTool, setActiveTool] = useState<Tool>("merge");
  const [openMenu, setOpenMenu] = useState<ToolMenu | null>(null);
  const [files, setFiles] = useState<File[]>([]);
  const [thumbnails, setThumbnails] = useState<Record<string, string>>({});
  const [pageSelection, setPageSelection] = useState("");
  const [rotation, setRotation] = useState(90);
  const [imageFormat, setImageFormat] = useState<"png" | "jpg">("png");
  const [compressionLevel, setCompressionLevel] = useState<"high" | "balanced" | "small">("balanced");
  const [resizePercentage, setResizePercentage] = useState(75);
  const [watermark, setWatermark] = useState("CONFIDENTIAL");
  const [cropMargin, setCropMargin] = useState(18);
  const [metadata, setMetadata] = useState<MetadataFields>({ title: "", author: "", subject: "", keywords: "" });
  const [editableTextRuns, setEditableTextRuns] = useState<EditableTextRun[]>([]);
  const [editablePdfPages, setEditablePdfPages] = useState<EditablePdfPage[]>([]);
  const [editorPageCount, setEditorPageCount] = useState(0);
  const [editorPageFailures, setEditorPageFailures] = useState<Record<number, EditorPageFailure>>({});
  const [editorLoadingMessage, setEditorLoadingMessage] = useState("");
  const [editorLoadError, setEditorLoadError] = useState("");
  const [editorReloadToken, setEditorReloadToken] = useState(0);
  const [selectedTextRunId, setSelectedTextRunId] = useState<string | null>(null);
  const [textEditHistory, setTextEditHistory] = useState<TextEditHistory>({ runId: null, snapshots: [], position: -1 });
  const [toolbarPosition, setToolbarPosition] = useState<ToolbarPosition>({ runId: null, left: 0 });
  const [textEditorQuery, setTextEditorQuery] = useState("");
  const [isTextEditorLoading, setIsTextEditorLoading] = useState(false);
  const [password, setPassword] = useState("");
  const [ownerPassword, setOwnerPassword] = useState("");
  const [ocrLanguage, setOcrLanguage] = useState<"eng" | "hin">("eng");
  const [status, setStatus] = useState("");
  const [error, setError] = useState("");
  const [isWorking, setIsWorking] = useState(false);
  const [isPreparingFiles, setIsPreparingFiles] = useState(false);
  const [progressPercent, setProgressPercent] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const [draggedFileIndex, setDraggedFileIndex] = useState<number | null>(null);
  const externalDragDepth = useRef(0);
  const toolMenuRef = useRef<HTMLElement | null>(null);
  const workingEditorPdfBytes = useRef<Uint8Array | null>(null);
  const editorPdfSessionRef = useRef<EditorPdfSession | null>(null);
  const editorSessionIdRef = useRef(0);
  const editorPreviewCanvasRefs = useRef<Record<number, HTMLCanvasElement | null>>({});
  const pendingEditorScrollPageRef = useRef<number | null>(null);
  const editorPageRefs = useRef<Record<number, HTMLElement | null>>({});
  const editorCanvasRefs = useRef<Record<number, HTMLDivElement | null>>({});
  const activeTextEditorRef = useRef<HTMLDivElement | null>(null);
  const activeTextInputRef = useRef<HTMLInputElement | null>(null);
  const activeToolbarRef = useRef<HTMLDivElement | null>(null);

  const activeDetails = toolOptions.find((tool) => tool.id === activeTool) ?? toolOptions[0];
  const usesConvertLayout = ["pdfToImage", "imageToPdf", "word", "excel", "ocr", "wordToPdf", "excelToPdf", "powerpointToPdf", "pdfToPowerpoint"].includes(activeTool);
  const usesResizeLayout = activeTool === "resizeDecrease" || activeTool === "resizeIncrease";
  const usesLargeUploadPanel = activeTool === "merge" || activeTool === "split" || activeTool === "optimize" || usesConvertLayout || usesResizeLayout;
  const usesTallActionSidebar = activeTool === "split" || activeTool === "optimize";
  const usesCenteredActionSidebar = usesTallActionSidebar || usesConvertLayout || usesResizeLayout;
  // Resize uses the same calculated minimum height as its action sidebar.
  // This keeps Size increase and Size decrease at the same panel height.
  const uploadPanelMinHeight = usesResizeLayout || usesConvertLayout
      ? "calc(100vh - 10rem)"
      : usesLargeUploadPanel
        ? "19rem"
        : undefined;
  // The dashed drop zone has a 2px border on both sides. Keep its inner
  // centering wrapper 3px shorter so its rendered outer size matches sidebar.
  const uploadPanelInnerMinHeight = usesResizeLayout ? "calc(100vh - 10rem - 3px)" : uploadPanelMinHeight;
  // Selection panels and their sidebars share the same height and top edge.
  const actionSidebarMinHeight = usesResizeLayout || usesConvertLayout
      ? "calc(100vh - 10rem)"
      : usesLargeUploadPanel && !usesTallActionSidebar
        ? "19rem"
        : undefined;
  const isImageInput = activeTool === "imageToPdf";
  const allowsMultiple = activeTool === "merge" || isImageInput || activeTool === "pdfToImage";
  const needsPages = pageTools.has(activeTool);
  const acceptsPdfOrImage = activeTool === "ocr";
  const selectedTextRun = useMemo(() => editableTextRuns.find((run) => run.id === selectedTextRunId) ?? null, [editableTextRuns, selectedTextRunId]);
  const visibleTextRuns = useMemo(() => {
    const query = textEditorQuery.trim().toLowerCase();
    return query ? editableTextRuns.filter((run) => run.original.toLowerCase().includes(query) || run.value.toLowerCase().includes(query)) : editableTextRuns;
  }, [editableTextRuns, textEditorQuery]);
  const matchingTextRunIds = useMemo(() => new Set(visibleTextRuns.map((run) => run.id)), [visibleTextRuns]);
  const changedTextRuns = useMemo(() => editableTextRuns.filter(textRunHasChanges), [editableTextRuns]);
  const textChangeCount = changedTextRuns.length;

  useLayoutEffect(() => {
    if (!selectedTextRun) return;
    const container = editorCanvasRefs.current[selectedTextRun.pageIndex];
    const editor = activeTextEditorRef.current;
    const toolbar = activeToolbarRef.current;
    if (!container || !editor || !toolbar) return;

    const positionToolbar = () => {
      const containerRect = container.getBoundingClientRect();
      const editorRect = editor.getBoundingClientRect();
      const toolbarWidth = toolbar.getBoundingClientRect().width;
      const editorLeft = editorRect.left - containerRect.left;
      const maximumLeft = Math.max(0, containerRect.width - toolbarWidth - 1);
      const toolbarLeft = toolbarWidth >= containerRect.width
        ? Math.max(0, (containerRect.width - toolbarWidth) / 2)
        : Math.min(Math.max(editorLeft, 0), maximumLeft);
      const relativeLeft = toolbarLeft - editorLeft;

      setToolbarPosition((current) => current.runId === selectedTextRun.id && Math.abs(current.left - relativeLeft) < 0.5
        ? current
        : { runId: selectedTextRun.id, left: relativeLeft });
    };

    positionToolbar();
    const resizeObserver = new ResizeObserver(positionToolbar);
    resizeObserver.observe(container);
    resizeObserver.observe(toolbar);
    return () => resizeObserver.disconnect();
  }, [selectedTextRun?.id, selectedTextRun?.pageIndex]);

  useEffect(() => {
    if (activeTool === "textEdit") return;
    let cancelled = false;

    if (!files.length) {
      setIsPreparingFiles(false);
      return;
    }

    Promise.all(files.map(async (file) => {
      try {
        const preview = file.type.startsWith("image/") ? await imageDataUrl(file) : await renderPdfThumbnail(file);
        return [fileKey(file), preview] as const;
      } catch {
        return [fileKey(file), ""] as const;
      }
    })).then((items) => {
      if (!cancelled) {
        setThumbnails(Object.fromEntries(items));
        setIsPreparingFiles(false);
      }
    });

    return () => {
      cancelled = true;
    };
  }, [activeTool, files]);

  useEffect(() => {
    if (activeTool === "textEdit" || (!isPreparingFiles && !isWorking)) return;

    const progressLimit = 99;
    const timer = window.setInterval(() => {
      setProgressPercent((current) => current >= progressLimit ? current : Math.min(progressLimit, current + (progressLimit - current) * 0.018));
    }, 120);

    return () => window.clearInterval(timer);
  }, [activeTool, isPreparingFiles, isWorking]);

  useEffect(() => {
    if (activeTool !== "metadata" || !files[0]) return;
    let cancelled = false;

    openPdf(files[0]).then((pdf) => {
      if (cancelled) return;
      setMetadata({
        title: pdf.getTitle() ?? "",
        author: pdf.getAuthor() ?? "",
        subject: pdf.getSubject() ?? "",
        keywords: pdf.getKeywords() ?? "",
      });
    }).catch(() => {
      if (!cancelled) setMetadata({ title: "", author: "", subject: "", keywords: "" });
    });

    return () => {
      cancelled = true;
    };
  }, [activeTool, files]);

  function isCurrentEditorSession(session: EditorPdfSession) {
    return editorPdfSessionRef.current === session && !session.cancelled;
  }

  function clearEditorPreviewCanvases() {
    Object.values(editorPreviewCanvasRefs.current).forEach((canvas) => {
      if (!canvas) return;
      canvas.width = 0;
      canvas.height = 0;
    });
    editorPreviewCanvasRefs.current = {};
    editorPageRefs.current = {};
    editorCanvasRefs.current = {};
  }

  function cancelEditorSession() {
    const session = editorPdfSessionRef.current;
    editorPdfSessionRef.current = null;
    pendingEditorScrollPageRef.current = null;
    clearEditorPreviewCanvases();
    if (session) void destroyEditorPdfSession(session);
  }

  function paintEditorPagePreview(pageIndex: number, canvas: HTMLCanvasElement | null) {
    if (!canvas) return;
    const surface = editorPdfSessionRef.current?.surfaces.get(pageIndex);
    if (!surface) return;
    const context = canvas.getContext("2d");
    if (!context) return;
    canvas.width = surface.width;
    canvas.height = surface.height;
    context.drawImage(surface, 0, 0);
  }

  function setEditorPreviewCanvas(pageIndex: number, canvas: HTMLCanvasElement | null) {
    editorPreviewCanvasRefs.current[pageIndex] = canvas;
    paintEditorPagePreview(pageIndex, canvas);
  }

  function publishEditorPage(
    session: EditorPdfSession,
    page: EditablePdfPage,
    runs: EditableTextRun[],
    surface: EditorPageSurface,
    initial = false,
  ) {
    if (!isCurrentEditorSession(session)) {
      releaseEditorPageSurface(surface);
      return;
    }
    const retryTimer = session.pageRetryTimers.get(page.pageIndex);
    if (retryTimer !== undefined) window.clearTimeout(retryTimer);
    session.pageRetryTimers.delete(page.pageIndex);
    session.pageFailures.delete(page.pageIndex);
    setEditorPageFailures((current) => {
      if (!(page.pageIndex in current)) return current;
      const { [page.pageIndex]: _removed, ...remaining } = current;
      return remaining;
    });
    session.surfaces.set(page.pageIndex, surface);
    setEditablePdfPages((current) => current.some((item) => item.pageIndex === page.pageIndex)
      ? current
      : [...current, page].sort((first, second) => first.pageIndex - second.pageIndex));
    if (initial) {
      setEditableTextRuns(runs);
      setSelectedTextRunId(runs[0]?.id ?? null);
      setTextEditHistory(runs[0]
        ? { runId: runs[0].id, snapshots: [textRunEditSnapshot(runs[0])], position: 0 }
        : { runId: null, snapshots: [], position: -1 });
    } else {
      setEditableTextRuns((current) => [...current, ...runs]);
    }

    if (pendingEditorScrollPageRef.current === page.pageIndex) {
      requestAnimationFrame(() => {
        editorPageRefs.current[page.pageIndex]?.scrollIntoView({ behavior: "smooth", block: "start" });
        pendingEditorScrollPageRef.current = null;
      });
    }
  }

  async function prepareEditorPage(session: EditorPdfSession, pageIndex: number, timeoutMs: number) {
    const pdf = session.pdf;
    const capabilities = session.capabilities;
    if (!pdf || !capabilities || session.cancelled) throw new Error("PDF editor loading was cancelled.");
    const page = await withPdfEditorWatchdog(pdf.getPage(pageIndex + 1), `Opening page ${pageIndex + 1}`, timeoutMs);
    try {
      const content = await withPdfEditorWatchdog(readEditorPdfTextContent(page, capabilities, session.pdfjsVersion), `Reading text on page ${pageIndex + 1}`, timeoutMs);
      if (session.cancelled) throw new Error("PDF editor loading was cancelled.");
      const runs = editableTextRunsFromContent(pageIndex, content);
      const preview = await renderEditorPageSurface(page, session, timeoutMs);
      return {
        page: { pageIndex, width: preview.width, height: preview.height },
        runs,
        surface: preview.surface,
      };
    } finally {
      page.cleanup();
    }
  }

  function scheduleNextBackgroundEditorPage(session: EditorPdfSession) {
    if (!isCurrentEditorSession(session) || session.backgroundTimer !== null || !session.pageCount) return;
    const nextPageIndex = Array.from({ length: session.pageCount }, (_, index) => index).find((index) => !session.surfaces.has(index)
      && !session.queuedPageIndexes.has(index) && !session.renderingPageIndexes.has(index) && !session.pageFailures.has(index));
    if (nextPageIndex === undefined) return;

    session.backgroundTimer = window.setTimeout(() => {
      session.backgroundTimer = null;
      requestEditorPage(nextPageIndex);
    }, 400);
  }

  function scheduleTimedOutEditorPageRetry(session: EditorPdfSession, pageIndex: number) {
    if (session.pageRetryTimers.has(pageIndex)) return;
    const timer = window.setTimeout(() => {
      session.pageRetryTimers.delete(pageIndex);
      if (!isCurrentEditorSession(session) || !session.pageFailures.get(pageIndex)?.retrying) return;
      requestEditorPage(pageIndex, true);
    }, 750);
    session.pageRetryTimers.set(pageIndex, timer);
  }

  function recordEditorPageFailure(session: EditorPdfSession, pageIndex: number, caughtError: unknown) {
    const previousFailure = session.pageFailures.get(pageIndex);
    const timedOut = isPdfEditorWatchdogTimeout(caughtError);
    const retrying = timedOut && !previousFailure?.automaticRetryUsed;
    const failure: EditorPageFailure = {
      message: retrying
        ? `Page ${pageIndex + 1} is taking longer than expected. Retrying it once in the background.`
        : `Page ${pageIndex + 1} could not be prepared. Retry that page to try again.`,
      automaticRetryUsed: previousFailure?.automaticRetryUsed === true || retrying,
      retrying,
    };
    session.pageFailures.set(pageIndex, failure);
    setEditorPageFailures((current) => ({ ...current, [pageIndex]: failure }));
    if (retrying) scheduleTimedOutEditorPageRetry(session, pageIndex);
  }

  async function drainEditorPageQueue(session: EditorPdfSession) {
    if (session.queueRunning) return;
    session.queueRunning = true;
    try {
      while (isCurrentEditorSession(session) && session.queuedPages.length) {
        const pageIndex = session.queuedPages.shift();
        if (pageIndex === undefined) continue;
        session.queuedPageIndexes.delete(pageIndex);
        if (session.surfaces.has(pageIndex)) continue;
        session.renderingPageIndexes.add(pageIndex);
        try {
          const prepared = await prepareEditorPage(session, pageIndex, PDF_EDITOR_BACKGROUND_STAGE_TIMEOUT_MS);
          publishEditorPage(session, prepared.page, prepared.runs, prepared.surface);
        } catch (caughtError) {
          if (!isPdfEditorCancellation(session, caughtError) && isCurrentEditorSession(session)) {
            logPdfEditorDiagnostic(`background-page-${pageIndex + 1}`, session.capabilities ?? getPdfEditorCapabilities(), session.pdfjsVersion, caughtError);
            recordEditorPageFailure(session, pageIndex, caughtError);
          }
        } finally {
          session.renderingPageIndexes.delete(pageIndex);
        }
        await yieldToBrowser();
      }
    } finally {
      session.queueRunning = false;
      scheduleNextBackgroundEditorPage(session);
    }
  }

  function requestEditorPage(pageIndex: number, priority = false) {
    const session = editorPdfSessionRef.current;
    if (!session || !isCurrentEditorSession(session) || pageIndex < 0 || pageIndex >= session.pageCount || session.surfaces.has(pageIndex)
      || session.queuedPageIndexes.has(pageIndex) || session.renderingPageIndexes.has(pageIndex)) return;
    session.queuedPageIndexes.add(pageIndex);
    if (priority) session.queuedPages.unshift(pageIndex);
    else session.queuedPages.push(pageIndex);
    void drainEditorPageQueue(session);
  }

  function retryEditorPage(pageIndex: number) {
    const session = editorPdfSessionRef.current;
    const failure = session?.pageFailures.get(pageIndex);
    if (!session || !failure || failure.retrying || !isCurrentEditorSession(session)) return;
    const retryingFailure = { ...failure, retrying: true, message: `Retrying page ${pageIndex + 1}.` };
    session.pageFailures.set(pageIndex, retryingFailure);
    setEditorPageFailures((current) => ({ ...current, [pageIndex]: retryingFailure }));
    requestEditorPage(pageIndex, true);
  }

  useEffect(() => {
    if (activeTool !== "textEdit" || !files[0]) return;

    const sourceFile = files[0];
    const session = createEditorPdfSession(++editorSessionIdRef.current);
    editorPdfSessionRef.current = session;

    async function loadInitialEditorPage() {
      let loadingStage = "Checking browser compatibility";
      try {
        const capabilities = getPdfEditorCapabilities();
        session.capabilities = capabilities;
        logPdfEditorDiagnostic("capability-check", capabilities, null);
        const compatibilityMessage = unsupportedPdfEditorCapabilitiesMessage(capabilities);
        if (compatibilityMessage) throw new Error(compatibilityMessage);

        loadingStage = "Reading the selected file";
        const sourceBytes = workingEditorPdfBytes.current ?? new Uint8Array(await withPdfEditorWatchdog(sourceFile.arrayBuffer(), "Reading the selected file", PDF_EDITOR_INITIAL_STAGE_TIMEOUT_MS));
        if (!isCurrentEditorSession(session)) return;
        workingEditorPdfBytes.current = sourceBytes;
        setProgressPercent(10);
        setEditorLoadingMessage("File read. Starting the PDF.js worker.");

        loadingStage = "Loading PDF.js";
        const pdfjs = await withPdfEditorWatchdog(loadPdfJs(), "Loading PDF.js", PDF_EDITOR_INITIAL_STAGE_TIMEOUT_MS);
        if (!isCurrentEditorSession(session)) return;
        session.pdfjsVersion = pdfjs.version;
        logPdfEditorDiagnostic("pdfjs-ready", capabilities, session.pdfjsVersion);
        setProgressPercent(20);
        loadingStage = "Starting the PDF.js worker";
        const worker = new pdfjs.PDFWorker();
        session.worker = worker;
        await withPdfEditorWatchdog(worker.promise, "Starting the PDF.js worker", PDF_EDITOR_INITIAL_STAGE_TIMEOUT_MS);
        if (!isCurrentEditorSession(session)) return;

        loadingStage = "Opening the PDF";
        const loadingTask = pdfjs.getDocument({ data: copyBytes(sourceBytes), worker });
        session.loadingTask = loadingTask;
        const pdf = await withPdfEditorWatchdog(loadingTask.promise, "Opening the PDF", PDF_EDITOR_INITIAL_STAGE_TIMEOUT_MS);
        if (!isCurrentEditorSession(session)) return;
        session.pdf = pdf;
        session.pageCount = pdf.numPages;
        setEditorPageCount(pdf.numPages);
        setProgressPercent(30);
        setEditorLoadingMessage(`PDF opened. Reading text on page 1 of ${pdf.numPages}.`);

        loadingStage = "Opening page 1";
        const firstPage = await withPdfEditorWatchdog(pdf.getPage(1), "Opening page 1", PDF_EDITOR_INITIAL_STAGE_TIMEOUT_MS);
        let prepared: { page: EditablePdfPage; runs: EditableTextRun[]; surface: EditorPageSurface } | null = null;
        try {
          loadingStage = "Reading text on page 1";
          const content = await withPdfEditorWatchdog(readEditorPdfTextContent(firstPage, capabilities, session.pdfjsVersion), "Reading text on page 1", PDF_EDITOR_INITIAL_STAGE_TIMEOUT_MS);
          if (!isCurrentEditorSession(session)) return;
          setProgressPercent(50);
          setEditorLoadingMessage("First-page text is ready. Rendering its preview.");
          loadingStage = "Rendering page 1";
          const preview = await renderEditorPageSurface(firstPage, session, PDF_EDITOR_INITIAL_STAGE_TIMEOUT_MS);
          prepared = { page: { pageIndex: 0, width: preview.width, height: preview.height }, runs: editableTextRunsFromContent(0, content), surface: preview.surface };
        } finally {
          firstPage.cleanup();
        }
        if (!prepared || !isCurrentEditorSession(session)) {
          if (prepared?.surface) releaseEditorPageSurface(prepared.surface);
          return;
        }

        setProgressPercent(70);
        setEditorLoadingMessage("First-page preview is ready. Opening your editor.");
        publishEditorPage(session, prepared.page, prepared.runs, prepared.surface, true);
        setProgressPercent(100);
        setEditorLoadingMessage("");
        setIsTextEditorLoading(false);
        setIsPreparingFiles(false);
        scheduleNextBackgroundEditorPage(session);
      } catch (caughtError) {
        if (isPdfEditorCancellation(session, caughtError) || !isCurrentEditorSession(session)) return;
        logPdfEditorDiagnostic(loadingStage, session.capabilities ?? getPdfEditorCapabilities(), session.pdfjsVersion, caughtError);
        const rawMessage = caughtError instanceof Error ? caughtError.message : "The PDF text editor could not be opened.";
        const message = /worker|fake worker|import/i.test(rawMessage)
          ? "The PDF worker could not start. Check browser extensions or security settings, then retry."
          : rawMessage;
        setEditorLoadError(message);
        setIsTextEditorLoading(false);
        setIsPreparingFiles(false);
        if (editorPdfSessionRef.current === session) editorPdfSessionRef.current = null;
        void destroyEditorPdfSession(session);
      }
    }

    void loadInitialEditorPage();
    return () => {
      if (editorPdfSessionRef.current === session) editorPdfSessionRef.current = null;
      void destroyEditorPdfSession(session);
    };
    // The lifecycle is deliberately restarted only for a file, tool, or explicit retry.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeTool, editorReloadToken, files]);

  useEffect(() => () => {
    const session = editorPdfSessionRef.current;
    editorPdfSessionRef.current = null;
    if (session) void destroyEditorPdfSession(session);
  }, []);

  useEffect(() => {
    const reportDownload = (event: Event) => {
      const format = event instanceof CustomEvent && typeof event.detail?.format === "string" ? event.detail.format : "file";
      trackDownload("/pdf-tools", "pdf_tools", format, undefined, activeTool);
    };
    window.addEventListener("dsh:pdf-download", reportDownload);
    return () => window.removeEventListener("dsh:pdf-download", reportDownload);
  }, [activeTool]);

  useEffect(() => {
    if (!openMenu) return;

    const closeOnOutsidePointerDown = (event: PointerEvent) => {
      if (toolMenuRef.current?.contains(event.target as Node)) return;
      setOpenMenu(null);
    };
    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") setOpenMenu(null);
    };

    document.addEventListener("pointerdown", closeOnOutsidePointerDown, true);
    document.addEventListener("keydown", closeOnEscape);
    return () => {
      document.removeEventListener("pointerdown", closeOnOutsidePointerDown, true);
      document.removeEventListener("keydown", closeOnEscape);
    };
  }, [openMenu]);

  useEffect(() => {
    if (!selectedTextRunId) return;

    const finishOnOutsidePointerDown = (event: PointerEvent) => {
      if (activeTextEditorRef.current?.contains(event.target as Node)) return;
      setSelectedTextRunId(null);
    };
    const handleEditorKeyboardShortcut = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        event.preventDefault();
        setSelectedTextRunId(null);
        return;
      }
      if ((!event.ctrlKey && !event.metaKey) || document.activeElement !== activeTextInputRef.current) return;
      const key = event.key.toLowerCase();
      if (key === "z") {
        event.preventDefault();
        if (event.shiftKey) redoTextRunEdit(selectedTextRunId);
        else undoTextRunEdit(selectedTextRunId);
      } else if (key === "y") {
        event.preventDefault();
        redoTextRunEdit(selectedTextRunId);
      }
    };

    document.addEventListener("pointerdown", finishOnOutsidePointerDown, true);
    document.addEventListener("keydown", handleEditorKeyboardShortcut);
    return () => {
      document.removeEventListener("pointerdown", finishOnOutsidePointerDown, true);
      document.removeEventListener("keydown", handleEditorKeyboardShortcut);
    };
  }, [selectedTextRunId, textEditHistory]);

  function toggleMenu(menu: ToolMenu) {
    setOpenMenu((current) => current === menu ? null : menu);
  }

  function selectTool(tool: Tool) {
    if (tool === activeTool) return;
    cancelEditorSession();
    trackToolSelection("/pdf-tools", "pdf_tools", tool);
    setActiveTool(tool);
    if (tool === "resizeDecrease") setResizePercentage(75);
    if (tool === "resizeIncrease") setResizePercentage(125);
    setOpenMenu(null);
    setFiles([]);
    setThumbnails({});
    setDraggedFileIndex(null);
    setEditableTextRuns([]);
    setEditablePdfPages([]);
    setEditorPageCount(0);
    setEditorLoadingMessage("");
    setEditorLoadError("");
    setSelectedTextRunId(null);
    setTextEditHistory({ runId: null, snapshots: [], position: -1 });
    setTextEditorQuery("");
    setIsTextEditorLoading(false);
    setIsPreparingFiles(false);
    setProgressPercent(0);
    workingEditorPdfBytes.current = null;
    externalDragDepth.current = 0;
    setIsDragging(false);
    setError("");
    setStatus("");
  }

  function startTextRunEdit(id: string) {
    const run = editableTextRuns.find((item) => item.id === id);
    if (!run) return;
    let editableRun = run;
    const page = editablePdfPages.find((item) => item.pageIndex === run.pageIndex);
    const previewCanvas = editorPreviewCanvasRefs.current[run.pageIndex];
    if (page && previewCanvas) {
      const appearance = sampleRunAppearanceFromPreview(previewCanvas, page, run);
      if (appearance) {
        editableRun = {
          ...run,
          ...appearance,
          originalTextColor: appearance.textColor,
          originalBackgroundColor: appearance.backgroundColor,
        };
        setEditableTextRuns((current) => current.map((item) => item.id === id ? {
          ...item,
          ...appearance,
          originalTextColor: appearance.textColor,
          originalBackgroundColor: appearance.backgroundColor,
        } : item));
      }
    }
    setSelectedTextRunId(id);
    setTextEditHistory({ runId: id, snapshots: [textRunEditSnapshot(editableRun)], position: 0 });
  }

  function updateTextRunState(id: string, updates: Partial<TextRunEditSnapshot>) {
    const run = editableTextRuns.find((item) => item.id === id);
    if (!run) return;
    const nextRun = { ...run, ...updates };
    const nextSnapshot = textRunEditSnapshot(nextRun);
    if (snapshotsMatch(textRunEditSnapshot(run), nextSnapshot)) return;

    setEditableTextRuns((current) => current.map((item) => item.id === id ? nextRun : item));
    setTextEditHistory((current) => {
      if (current.runId !== id || current.position < 0) {
        return { runId: id, snapshots: [textRunEditSnapshot(run), nextSnapshot], position: 1 };
      }
      if (snapshotsMatch(current.snapshots[current.position], nextSnapshot)) return current;
      return {
        runId: id,
        snapshots: [...current.snapshots.slice(0, current.position + 1), nextSnapshot],
        position: current.position + 1,
      };
    });
  }

  function updateTextRun(id: string, value: string) {
    updateTextRunState(id, { value });
  }

  function selectedInputText(id: string): TextInputSelection | null {
    const input = activeTextInputRef.current;
    const run = editableTextRuns.find((item) => item.id === id);
    if (!input || input.dataset.textRunId !== id || !run) return null;
    const start = Math.min(input.selectionStart ?? 0, run.value.length);
    const end = Math.min(input.selectionEnd ?? start, run.value.length);
    return { start, end, text: run.value.slice(start, end) };
  }

  function replaceSelectedInputText(id: string, replacement: string, selection = selectedInputText(id)) {
    const run = editableTextRuns.find((item) => item.id === id);
    if (!run || !selection) return false;
    const value = `${run.value.slice(0, selection.start)}${replacement}${run.value.slice(selection.end)}`;
    const cursorPosition = selection.start + replacement.length;
    updateTextRun(id, value);
    requestAnimationFrame(() => {
      const input = activeTextInputRef.current;
      if (!input || input.dataset.textRunId !== id) return;
      input.focus();
      input.setSelectionRange(cursorPosition, cursorPosition);
    });
    return true;
  }

  function handleInputCopy(event: ReactClipboardEvent<HTMLInputElement>, id: string) {
    const selection = selectedInputText(id);
    if (!selection?.text) return;
    event.clipboardData.setData("text/plain", selection.text);
    event.preventDefault();
  }

  function handleInputCut(event: ReactClipboardEvent<HTMLInputElement>, id: string) {
    const selection = selectedInputText(id);
    if (!selection?.text) return;
    event.clipboardData.setData("text/plain", selection.text);
    event.preventDefault();
    replaceSelectedInputText(id, "", selection);
  }

  function handleInputPaste(event: ReactClipboardEvent<HTMLInputElement>, id: string) {
    const pastedText = event.clipboardData.getData("text/plain");
    if (!pastedText) return;
    event.preventDefault();
    replaceSelectedInputText(id, pastedText);
  }

  async function copySelectedInputText(id: string) {
    const selection = selectedInputText(id);
    if (!selection?.text || !navigator.clipboard?.writeText) return false;
    try {
      await navigator.clipboard.writeText(selection.text);
      return true;
    } catch {
      return false;
    }
  }

  async function cutSelectedInputText(id: string) {
    const selection = selectedInputText(id);
    if (!selection?.text || !navigator.clipboard?.writeText) return;
    try {
      await navigator.clipboard.writeText(selection.text);
      replaceSelectedInputText(id, "", selection);
    } catch {
      // Clipboard permissions are handled by the browser; leave text unchanged if writing is denied.
    }
  }

  async function pasteIntoSelectedInput(id: string) {
    const selection = selectedInputText(id);
    if (!selection || !navigator.clipboard?.readText) return;
    try {
      const pastedText = await navigator.clipboard.readText();
      if (pastedText) replaceSelectedInputText(id, pastedText, selection);
    } catch {
      // Clipboard permissions are handled by the browser; leave text unchanged if reading is denied.
    }
  }

  function deleteTextRun(id: string) {
    const run = editableTextRuns.find((item) => item.id === id);
    if (run) updateTextRun(id, "");
  }

  function updateTextRunAppearance(id: string, updates: Partial<Pick<EditableTextRun, "fontPreset" | "fontSize" | "textColor" | "backgroundColor">>) {
    updateTextRunState(id, { ...updates, matchOriginal: false });
  }

  function updateTextRunFormatting(id: string, updates: Pick<TextRunEditSnapshot, "isBold" | "isItalic" | "isUnderline" | "alignment">) {
    updateTextRunState(id, { ...updates, matchOriginal: false });
  }

  function setMatchOriginal(id: string, enabled: boolean) {
    const run = editableTextRuns.find((item) => item.id === id);
    if (!run) return;
    updateTextRunState(id, enabled ? { ...originalTextRunSnapshot(run), value: run.value } : { matchOriginal: false });
  }

  function undoTextRunEdit(id: string) {
    if (textEditHistory.runId !== id || textEditHistory.position <= 0) return;
    const position = textEditHistory.position - 1;
    const snapshot = textEditHistory.snapshots[position];
    setEditableTextRuns((current) => current.map((run) => run.id === id ? { ...run, ...snapshot } : run));
    setTextEditHistory((current) => ({ ...current, position }));
  }

  function redoTextRunEdit(id: string) {
    if (textEditHistory.runId !== id || textEditHistory.position >= textEditHistory.snapshots.length - 1) return;
    const position = textEditHistory.position + 1;
    const snapshot = textEditHistory.snapshots[position];
    setEditableTextRuns((current) => current.map((run) => run.id === id ? { ...run, ...snapshot } : run));
    setTextEditHistory((current) => ({ ...current, position }));
  }

  function discardTextRunChange(id: string) {
    const run = editableTextRuns.find((item) => item.id === id);
    if (run) updateTextRunState(id, originalTextRunSnapshot(run));
  }

  function finishTextRunEdit() {
    setSelectedTextRunId(null);
  }

  function scrollToEditorPage(pageIndex: number) {
    if (editorPageFailures[pageIndex]) {
      retryEditorPage(pageIndex);
      return;
    }
    const page = editorPageRefs.current[pageIndex];
    if (page) {
      page.scrollIntoView({ behavior: "smooth", block: "start" });
      return;
    }
    pendingEditorScrollPageRef.current = pageIndex;
    requestEditorPage(pageIndex, true);
  }

  function clearSelectedFiles() {
    cancelEditorSession();
    setFiles([]);
    setThumbnails({});
    setEditableTextRuns([]);
    setEditablePdfPages([]);
    setEditorPageCount(0);
    setEditorPageFailures({});
    setEditorLoadingMessage("");
    setEditorLoadError("");
    setSelectedTextRunId(null);
    setTextEditHistory({ runId: null, snapshots: [], position: -1 });
    setIsTextEditorLoading(false);
    setIsPreparingFiles(false);
    workingEditorPdfBytes.current = null;
  }

  function completeSuccessfulDownload(message: string) {
    setProgressPercent(100);
    setStatus(message);
    clearSelectedFiles();
  }

  function removeFile(fileIndex: number) {
    if (activeTool === "textEdit") cancelEditorSession();
    setFiles((current) => current.filter((_, index) => index !== fileIndex));
    if (activeTool === "textEdit") {
      setEditableTextRuns([]);
      setEditablePdfPages([]);
      setEditorPageCount(0);
      setEditorPageFailures({});
      setEditorLoadingMessage("");
      setEditorLoadError("");
      setSelectedTextRunId(null);
      setTextEditHistory({ runId: null, snapshots: [], position: -1 });
      setIsTextEditorLoading(false);
      setIsPreparingFiles(false);
      workingEditorPdfBytes.current = null;
    }
  }

  function addFiles(added: File[]) {
    const isValid = (file: File) => {
      if (isImageInput) return ["image/jpeg", "image/png"].includes(file.type);
      if (activeTool === "wordToPdf") return /\.docx$/i.test(file.name);
      if (activeTool === "excelToPdf") return /\.(xlsx|xls)$/i.test(file.name);
      if (activeTool === "powerpointToPdf") return /\.pptx$/i.test(file.name);
      if (acceptsPdfOrImage) return file.type === "application/pdf" || ["image/jpeg", "image/png"].includes(file.type) || /\.(pdf|png|jpe?g)$/i.test(file.name);
      return file.type === "application/pdf" || file.name.toLowerCase().endsWith(".pdf");
    };
    const invalid = added.find((file) => !isValid(file));
    if (invalid) {
      setError(isImageInput ? "Please select JPG or PNG images only." : activeTool === "wordToPdf" ? "Please select a DOCX file." : activeTool === "excelToPdf" ? "Please select an XLSX or XLS file." : activeTool === "powerpointToPdf" ? "Please select a PPTX file." : "Please select a valid PDF file.");
    } else if (added.length) {
      if (activeTool === "textEdit") cancelEditorSession();
      setIsPreparingFiles(true);
      setProgressPercent(activeTool === "textEdit" ? 0 : 5);
      if (activeTool === "textEdit") {
        setIsTextEditorLoading(true);
        setEditableTextRuns([]);
        setEditablePdfPages([]);
        setEditorPageCount(0);
        setEditorPageFailures({});
        setEditorLoadingMessage("File selected. Preparing a local PDF editor.");
        setEditorLoadError("");
        setSelectedTextRunId(null);
        setTextEditHistory({ runId: null, snapshots: [], position: -1 });
        workingEditorPdfBytes.current = null;
      }
      setFiles((current) => (allowsMultiple ? [...current, ...added] : [added[0]]));
      setError("");
      setStatus("");
    }
  }

  function retryTextEditor() {
    if (!files[0] || activeTool !== "textEdit") return;
    cancelEditorSession();
    setEditableTextRuns([]);
    setEditablePdfPages([]);
    setEditorPageCount(0);
    setEditorPageFailures({});
    setSelectedTextRunId(null);
    setTextEditHistory({ runId: null, snapshots: [], position: -1 });
    setEditorLoadError("");
    setEditorLoadingMessage("Retrying the PDF editor locally.");
    setProgressPercent(0);
    setIsTextEditorLoading(true);
    setIsPreparingFiles(true);
    setEditorReloadToken((current) => current + 1);
  }

  function handleFiles(event: ChangeEvent<HTMLInputElement>) {
    addFiles(Array.from(event.target.files ?? []));
    event.target.value = "";
  }

  function handleDrop(event: DragEvent<HTMLDivElement>) {
    event.preventDefault();
    externalDragDepth.current = 0;
    setIsDragging(false);
    addFiles(Array.from(event.dataTransfer.files));
  }

  function moveFile(index: number, direction: -1 | 1) {
    setFiles((current) => {
      const target = index + direction;
      if (target < 0 || target >= current.length) return current;
      const next = [...current];
      [next[index], next[target]] = [next[target], next[index]];
      return next;
    });
  }

  function moveFileToIndex(targetIndex: number) {
    if (draggedFileIndex === null || draggedFileIndex === targetIndex) return;

    setFiles((current) => {
      const next = [...current];
      const [movedFile] = next.splice(draggedFileIndex, 1);
      next.splice(targetIndex, 0, movedFile);
      return next;
    });
    setDraggedFileIndex(null);
  }

  async function runTool() {
    setError("");
    setStatus("");
    if (!files.length) return setError("Please select a file first.");
    if (activeTool === "merge" && files.length < 2) return setError("Please select at least two PDFs to merge.");
    if (activeTool === "protect" && password.length < 4) return setError("Use a PDF password with at least four characters.");
    if (activeTool === "unlock" && !password) return setError("Enter the current PDF password.");
    if (activeTool === "textEdit" && isTextEditorLoading) return setError("Please wait for the PDF text editor to finish loading.");

    setIsWorking(true);
    setProgressPercent(5);
    await yieldToBrowser();
    try {
      if (activeTool === "merge") {
        const merged = await PDFDocument.create();
        for (const file of files) {
          const source = await openPdf(file);
          const pages = await merged.copyPages(source, source.getPageIndices());
          pages.forEach((page) => merged.addPage(page));
        }
        downloadPdf(await merged.save({ useObjectStreams: true }), "merged-document.pdf");
        completeSuccessfulDownload(`${files.length} PDFs were merged. Your download has started.`);
        return;
      }

      if (activeTool === "imageToPdf") {
        const pdf = await PDFDocument.create();
        for (const file of files) {
          const imageBytes = new Uint8Array(await file.arrayBuffer());
          const image = file.type === "image/png" ? await pdf.embedPng(imageBytes) : await pdf.embedJpg(imageBytes);
          const page = pdf.addPage([595.28, 841.89]);
          const scale = Math.min((page.getWidth() - 40) / image.width, (page.getHeight() - 40) / image.height, 1);
          const width = image.width * scale;
          const height = image.height * scale;
          page.drawImage(image, { x: (page.getWidth() - width) / 2, y: (page.getHeight() - height) / 2, width, height });
        }
        downloadPdf(await pdf.save({ useObjectStreams: true }), "images-to-pdf.pdf");
        completeSuccessfulDownload("An A4 PDF was created from the images. Your download has started.");
        return;
      }

      const sourceFile = files[0];

      if (activeTool === "wordToPdf") {
        downloadTextPdf(await docxPages(sourceFile), outputName(sourceFile.name, "converted"));
        completeSuccessfulDownload("Your Word document was converted to PDF. The download has started.");
        return;
      }

      if (activeTool === "excelToPdf") {
        downloadTextPdf(await excelPages(sourceFile), outputName(sourceFile.name, "converted"), "landscape");
        completeSuccessfulDownload("Your spreadsheet was converted to PDF. The download has started.");
        return;
      }

      if (activeTool === "powerpointToPdf") {
        downloadTextPdf(await powerpointPages(sourceFile), outputName(sourceFile.name, "converted"), "landscape");
        completeSuccessfulDownload("Your PowerPoint slides were converted to PDF. The download has started.");
        return;
      }

      if (activeTool === "pdfToPowerpoint") {
        const { default: PptxGenJS } = await import("pptxgenjs");
        const presentation = new PptxGenJS();
        presentation.layout = "LAYOUT_WIDE";
        presentation.author = "DocSprintHub";
        presentation.subject = "PDF to PowerPoint conversion";
        presentation.title = sourceFile.name.replace(/\.pdf$/i, "");
        const pages = await renderPdfPages(sourceFile, "", "image/png", 1.5);
        for (const page of pages) {
          const slide = presentation.addSlide();
          const ratio = page.width / page.height;
          const slideWidth = 13.333;
          const slideHeight = 7.5;
          const width = Math.min(slideWidth, slideHeight * ratio);
          const height = width / ratio;
          slide.addImage({ data: await blobDataUrl(page.blob), x: (slideWidth - width) / 2, y: (slideHeight - height) / 2, w: width, h: height });
        }
        const output = await presentation.write({ outputType: "blob", compression: true });
        if (!(output instanceof Blob)) throw new Error("The PowerPoint file could not be created.");
        downloadBlob(output, outputName(sourceFile.name, "slides", "pptx"));
        completeSuccessfulDownload("Your PDF pages were converted to PowerPoint slides. The download has started.");
        return;
      }

      if (activeTool === "pdfToImage") {
        const zip = new JSZip();
        let imageCount = 0;
        for (const file of files) {
          const pages = await renderPdfPages(file, "", imageFormat === "png" ? "image/png" : "image/jpeg");
          const filePrefix = file.name.replace(/\.[^.]+$/, "").replace(/[\\/:*?"<>|]/g, "_");
          pages.forEach((page, index) => zip.file(`${filePrefix}-page-${index + 1}.${imageFormat}`, page.blob));
          imageCount += pages.length;
        }
        downloadBlob(await zip.generateAsync({ type: "blob" }), files.length === 1 ? outputName(sourceFile.name, "images", "zip") : `converted-${imageFormat}-images.zip`);
        completeSuccessfulDownload(`${imageCount} images from ${files.length} PDFs are being downloaded as a ZIP file.`);
        return;
      }

      if (activeTool === "unlock") {
        const pages = await renderPdfPages(sourceFile, password, "image/png");
        const unlocked = await PDFDocument.create();
        for (const pageImage of pages) {
          const page = unlocked.addPage([pageImage.width, pageImage.height]);
          const image = await unlocked.embedPng(pageImage.bytes);
          page.drawImage(image, { x: 0, y: 0, width: pageImage.width, height: pageImage.height });
        }
        downloadPdf(await unlocked.save({ useObjectStreams: true }), outputName(sourceFile.name, "unlocked"));
        completeSuccessfulDownload("A password-free visual copy is downloading. Searchable text is not preserved in this copy.");
        return;
      }

      if (activeTool === "textEdit") {
        const changedRuns = changedTextRuns;
        if (!changedRuns.length) throw new Error("Select a text item and make a correction before saving.");

        const sourceBytes = workingEditorPdfBytes.current ? copyBytes(workingEditorPdfBytes.current) : new Uint8Array(await sourceFile.arrayBuffer());
        const textEditedPdf = await PDFDocument.load(sourceBytes);
        const embeddedFonts = new Map<StandardFonts, PDFFont>();
        let devanagariFont: PDFFont | null = null;
        const getFont = async (run: EditableTextRun, devanagari = false) => {
          if (devanagari) {
            if (devanagariFont) return devanagariFont;
            await import("regenerator-runtime/runtime.js");
            const { default: fontkit } = await import("@pdf-lib/fontkit");
            textEditedPdf.registerFontkit(fontkit);
            devanagariFont = await textEditedPdf.embedFont(await loadDevanagariFontBytes(), { subset: true });
            return devanagariFont;
          }
          const fontName = matchingStandardFont(run);
          const cached = embeddedFonts.get(fontName);
          if (cached) return cached;
          const font = await textEditedPdf.embedFont(fontName);
          embeddedFonts.set(fontName, font);
          return font;
        };

        for (const run of changedRuns) {
          const page = textEditedPdf.getPage(run.pageIndex);
          try {
            const fontSegments = await Promise.all(
              splitTextByWritingSystem(run.value).map(async (segment) => ({
                ...segment,
                font: await getFont(run, segment.devanagari),
              })),
            );
            const replacementWidth = fontSegments.reduce((width, segment) => width + segment.font.widthOfTextAtSize(segment.text, run.fontSize), 0);
            const coverWidth = Math.min(page.getWidth() - Math.max(0, run.x) + 1, Math.max(run.width, replacementWidth) + 4);
            page.drawRectangle({
              x: Math.max(0, run.x - 1),
              y: Math.max(0, run.y - run.height * 0.3),
              width: Math.max(1, coverWidth),
              height: Math.min(page.getHeight() - Math.max(0, run.y - run.height * 0.3), run.height * 1.25),
              color: pdfColor(run.backgroundColor),
            });
            const alignmentOffset = run.alignment === "center"
              ? (coverWidth - replacementWidth) / 2
              : run.alignment === "right"
                ? coverWidth - replacementWidth - 2
                : 0;
            let textX = Math.max(0, run.x + alignmentOffset);
            for (const segment of fontSegments) {
              page.drawText(segment.text, { x: textX, y: run.y, size: run.fontSize, font: segment.font, color: pdfColor(run.textColor) });
              textX += segment.font.widthOfTextAtSize(segment.text, run.fontSize);
            }
            if (run.isUnderline && replacementWidth > 0) {
              const underlineY = Math.max(0, run.y - Math.max(0.75, run.fontSize * 0.12));
              page.drawLine({
                start: { x: Math.max(0, run.x + alignmentOffset), y: underlineY },
                end: { x: Math.min(page.getWidth(), run.x + alignmentOffset + replacementWidth), y: underlineY },
                thickness: Math.max(0.5, run.fontSize / 16),
                color: pdfColor(run.textColor),
              });
            }
          } catch (caughtError) {
            const message = caughtError instanceof Error ? caughtError.message : "The replacement text could not be written.";
            throw new Error(`Could not update “${run.original}”: ${message}`);
          }
        }

        const savedBytes = await textEditedPdf.save({ useObjectStreams: true });
        workingEditorPdfBytes.current = copyBytes(savedBytes);
        setProgressPercent(80);
        downloadPdf(savedBytes, outputName(sourceFile.name, "text-corrected"));
        completeSuccessfulDownload(`${changedRuns.length} text correction${changedRuns.length === 1 ? "" : "s"} was saved and removed from the change history.`);
        return;
      }

      if (activeTool === "word" || activeTool === "excel") {
        const textPages = await extractPdfText(sourceFile);
        if (!textPages.some(Boolean)) throw new Error("No selectable text was found in the PDF. Use the OCR tool for scanned documents.");
        if (activeTool === "word") {
          const { Document, Packer, Paragraph } = await import("docx");
          const children = textPages.flatMap((text, index) => [new Paragraph({ text: `Page ${index + 1}` }), new Paragraph({ text: text || " " })]);
          const wordDocument = new Document({ sections: [{ children }] });
          downloadBlob(await Packer.toBlob(wordDocument), outputName(sourceFile.name, "text", "docx"));
          completeSuccessfulDownload("PDF text was exported to a Word file. Your download has started.");
        } else {
          const XLSX = await import("xlsx");
          const workbook = XLSX.utils.book_new();
          const sheet = XLSX.utils.aoa_to_sheet([["Page", "Extracted text"], ...textPages.map((text, index) => [index + 1, text])]);
          XLSX.utils.book_append_sheet(workbook, sheet, "PDF text");
          const bytes = XLSX.write(workbook, { bookType: "xlsx", type: "array" });
          downloadBlob(new Blob([bytes], { type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" }), outputName(sourceFile.name, "text", "xlsx"));
          completeSuccessfulDownload("PDF text was exported to an Excel file. Your download has started.");
        }
        return;
      }

      if (activeTool === "ocr") {
        const targets = sourceFile.type === "application/pdf" || sourceFile.name.toLowerCase().endsWith(".pdf")
          ? (await renderPdfPages(sourceFile)).map((page) => page.blob)
          : [sourceFile];
        const { createWorker } = await import("tesseract.js");
        const worker = await createWorker(ocrLanguage, 1, {
          logger: (message: { status?: string; progress?: number }) => {
            if (message.status) setStatus(`${message.status}${message.progress === undefined ? "" : ` ${Math.round(message.progress * 100)}%`}`);
          },
        });
        try {
          const output: string[] = [];
          for (const [index, target] of targets.entries()) {
            const result = await worker.recognize(target);
            output.push(`--- Page ${index + 1} ---\n${result.data.text.trim()}`);
          }
          downloadBlob(new Blob([output.join("\n\n")], { type: "text/plain;charset=utf-8" }), outputName(sourceFile.name, "ocr", "txt"));
          completeSuccessfulDownload("OCR text is ready. Your download has started.");
        } finally {
          await worker.terminate();
        }
        return;
      }

      if (activeTool === "protect") {
        const { PDFDocument: EncryptingPDFDocument } = await import("pdf-lib-plus-encrypt");
        const protectedPdf = await EncryptingPDFDocument.load(await sourceFile.arrayBuffer());
        await protectedPdf.encrypt({
          userPassword: password,
          ownerPassword: ownerPassword || password,
          permissions: { printing: "highResolution", modifying: false, copying: false, annotating: false, fillingForms: true, contentAccessibility: true, documentAssembly: false },
        });
        downloadPdf(await protectedPdf.save({ useObjectStreams: true }), outputName(sourceFile.name, "protected"));
        completeSuccessfulDownload("Your password-protected PDF is ready to download.");
        return;
      }

      if (activeTool === "optimize") {
        const profiles = {
          high: { scale: 1.8, quality: 0.94, label: "High quality" },
          balanced: { scale: 1.6, quality: 0.9, label: "Recommended high quality" },
          small: { scale: 1.1, quality: 0.68, label: "Smallest file" },
        } as const;
        const profile = profiles[compressionLevel];
        const pageImages = await renderPdfPages(sourceFile, "", "image/jpeg", profile.scale, profile.quality);
        const compressedPdf = await PDFDocument.create();
        for (const pageImage of pageImages) {
          const page = compressedPdf.addPage([pageImage.width, pageImage.height]);
          const image = await compressedPdf.embedJpg(pageImage.bytes);
          page.drawImage(image, { x: 0, y: 0, width: pageImage.width, height: pageImage.height });
        }
        const compressedBytes = await compressedPdf.save({ useObjectStreams: true });
        downloadPdf(compressedBytes, outputName(sourceFile.name, "compressed"));
        completeSuccessfulDownload(`Compressed from ${formatBytes(sourceFile.size)} to ${formatBytes(compressedBytes.byteLength)} (${profile.label}). Your download has started.`);
        return;
      }

      const sourcePdf = await openPdf(sourceFile);

      if (activeTool === "resizeDecrease" || activeTool === "resizeIncrease") {
        const isDecrease = activeTool === "resizeDecrease";
        if (!Number.isFinite(resizePercentage) || (isDecrease ? resizePercentage <= 0 || resizePercentage >= 100 : resizePercentage <= 100)) {
          throw new Error(isDecrease ? "Enter a custom size between 1% and 99%." : "Enter a custom size greater than 100%.");
        }
        const scale = resizePercentage / 100;
        sourcePdf.getPages().forEach((page) => page.scale(scale, scale));
        downloadPdf(await sourcePdf.save({ useObjectStreams: true }), outputName(sourceFile.name, isDecrease ? "page-size-decreased" : "page-size-increased"));
        completeSuccessfulDownload(`Every page was resized to ${resizePercentage}% while keeping its content proportional. Your download has started.`);
        return;
      }

      const pageIndexes = parsePageSelection(pageSelection, sourcePdf.getPageCount(), activeTool === "reorder");

      if (activeTool === "split") {
        const zip = new JSZip();
        for (const pageIndex of pageIndexes) {
          const singlePagePdf = await selectedCopy(sourcePdf, [pageIndex]);
          zip.file(`page-${pageIndex + 1}.pdf`, await singlePagePdf.save({ useObjectStreams: true }));
        }
        downloadBlob(await zip.generateAsync({ type: "blob" }), outputName(sourceFile.name, "split", "zip"));
        completeSuccessfulDownload(`${pageIndexes.length} separate PDFs are being downloaded as a ZIP file.`);
        return;
      }

      if (activeTool === "extract" || activeTool === "reorder") {
        const result = await selectedCopy(sourcePdf, pageIndexes);
        downloadPdf(await result.save({ useObjectStreams: true }), outputName(sourceFile.name, activeTool === "extract" ? "selected-pages" : "reordered"));
        completeSuccessfulDownload(activeTool === "extract" ? "The PDF with the selected pages is ready." : "The page order was updated. Your download has started.");
        return;
      }

      if (activeTool === "delete") {
        const deleted = new Set(pageIndexes);
        const remaining = sourcePdf.getPageIndices().filter((index) => !deleted.has(index));
        if (!remaining.length) throw new Error("You cannot delete every page. Keep at least one page.");
        const result = await selectedCopy(sourcePdf, remaining);
        downloadPdf(await result.save({ useObjectStreams: true }), outputName(sourceFile.name, "pages-removed"));
        completeSuccessfulDownload("The selected pages were removed. Your download has started.");
        return;
      }

      if (activeTool === "rotate") {
        pageIndexes.forEach((index) => {
          const page = sourcePdf.getPage(index);
          page.setRotation(degrees((page.getRotation().angle + rotation) % 360));
        });
        downloadPdf(await sourcePdf.save({ useObjectStreams: true }), outputName(sourceFile.name, "rotated"));
        completeSuccessfulDownload("The selected pages were rotated. Your download has started.");
        return;
      }

      if (activeTool === "watermark") {
        if (!watermark.trim()) throw new Error("Enter watermark text.");
        const font = await sourcePdf.embedFont(StandardFonts.HelveticaBold);
        pageIndexes.forEach((index) => {
          const page = sourcePdf.getPage(index);
          const fontSize = Math.max(22, Math.min(page.getWidth(), page.getHeight()) / 10);
          const textWidth = font.widthOfTextAtSize(watermark, fontSize);
          page.drawText(watermark, { x: (page.getWidth() - textWidth) / 2, y: page.getHeight() / 2, size: fontSize, font, color: rgb(0.75, 0.08, 0.08), opacity: 0.28, rotate: degrees(35) });
        });
        downloadPdf(await sourcePdf.save({ useObjectStreams: true }), outputName(sourceFile.name, "watermarked"));
        completeSuccessfulDownload("The watermark was added. Your download has started.");
        return;
      }

      if (activeTool === "pageNumbers") {
        const font = await sourcePdf.embedFont(StandardFonts.Helvetica);
        pageIndexes.forEach((index) => {
          const page = sourcePdf.getPage(index);
          const text = `${index + 1} / ${sourcePdf.getPageCount()}`;
          const fontSize = 10;
          page.drawText(text, { x: (page.getWidth() - font.widthOfTextAtSize(text, fontSize)) / 2, y: 16, size: fontSize, font, color: rgb(0.12, 0.12, 0.12) });
        });
        downloadPdf(await sourcePdf.save({ useObjectStreams: true }), outputName(sourceFile.name, "numbered"));
        completeSuccessfulDownload("Page numbers were added. Your download has started.");
        return;
      }

      if (activeTool === "crop") {
        if (cropMargin < 0) throw new Error("The crop margin must be zero or a positive number.");
        pageIndexes.forEach((index) => {
          const page = sourcePdf.getPage(index);
          const width = page.getWidth() - cropMargin * 2;
          const height = page.getHeight() - cropMargin * 2;
          if (width <= 0 || height <= 0) throw new Error("The crop margin is too large for this page.");
          page.setCropBox(cropMargin, cropMargin, width, height);
        });
        downloadPdf(await sourcePdf.save({ useObjectStreams: true }), outputName(sourceFile.name, "cropped"));
        completeSuccessfulDownload("The margins were cropped. Your download has started.");
        return;
      }

      if (activeTool === "metadata") {
        sourcePdf.setTitle(metadata.title.trim());
        sourcePdf.setAuthor(metadata.author.trim());
        sourcePdf.setSubject(metadata.subject.trim());
        sourcePdf.setKeywords(metadata.keywords.split(",").map((keyword) => keyword.trim()).filter(Boolean));
        sourcePdf.setModificationDate(new Date());
        downloadPdf(await sourcePdf.save({ useObjectStreams: true }), outputName(sourceFile.name, "metadata"));
        completeSuccessfulDownload("The PDF metadata was updated. Your download has started.");
        return;
      }

      downloadPdf(await sourcePdf.save({ useObjectStreams: true }), outputName(sourceFile.name, "optimized"));
      completeSuccessfulDownload("The PDF was optimized. The final size depends on its content.");
    } catch (caughtError) {
      const message = caughtError instanceof Error ? caughtError.message : "The PDF could not be processed.";
      setError(message.toLowerCase().includes("password") || message.toLowerCase().includes("encrypted") ? "Use the correct password for this protected PDF." : message);
    } finally {
      setIsWorking(false);
    }
  }

  const accept = isImageInput ? "image/jpeg,image/png,.jpg,.jpeg,.png" : activeTool === "wordToPdf" ? ".docx,application/vnd.openxmlformats-officedocument.wordprocessingml.document" : activeTool === "excelToPdf" ? ".xlsx,.xls,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet,application/vnd.ms-excel" : activeTool === "powerpointToPdf" ? ".pptx,application/vnd.openxmlformats-officedocument.presentationml.presentation" : acceptsPdfOrImage ? "application/pdf,image/jpeg,image/png,.pdf,.jpg,.jpeg,.png" : "application/pdf,.pdf";
  const uploadLabel = isImageInput ? "Choose JPG or PNG images" : activeTool === "wordToPdf" ? "Choose a DOCX file" : activeTool === "excelToPdf" ? "Choose an XLSX or XLS file" : activeTool === "powerpointToPdf" ? "Choose a PPTX file" : acceptsPdfOrImage ? "Choose a PDF, JPG, or PNG file" : activeTool === "merge" ? "Choose PDF files" : "Choose a PDF file";

  return (
    <main className="min-h-screen bg-slate-50 text-slate-900">
      <header className="border-b border-slate-300 bg-white">
        <div className="flex items-center px-5 py-3 sm:px-8">
          <Link href="/" className="inline-flex items-center gap-1">
            <Image src="/docsprinthub-logo.png" alt="DocSprintHub logo" width={38} height={38} className="h-9 w-9 object-contain" priority />
            <span className="text-3xl font-bold tracking-tight sm:text-4xl">DocSprint<span className="text-blue-600">Hub</span></span>
          </Link>
          <span className="ml-auto text-base font-bold text-slate-800">PDF Tools</span>
        </div>
      </header>

      {!(activeTool === "textEdit" && files.length) && <section className="border-b border-blue-100 bg-gradient-to-b from-blue-50 to-slate-50 px-5 py-7 text-center sm:px-4 sm:py-4">
        <h1 className="text-3xl font-bold tracking-tight text-slate-950 sm:text-4xl">PDF Tools</h1>
        <p className="mx-auto mt-3 max-w-3xl font-semibold text-base leading-7 text-slate-600 sm:text-lg">Merge, Convert, Organize, Protect & Edit PDF files Directly in Your Browser.</p>
      </section>}

      <nav ref={toolMenuRef} aria-label="PDF tool menu" className="border-b border-slate-200 bg-white shadow-sm">
        <div className={activeTool === "textEdit" && files.length ? "w-full px-4 py-3 sm:px-5" : "mx-auto max-w-7xl px-5 py-4 sm:px-8"}>
          <div className="flex flex-wrap gap-2" role="tablist" aria-label="Quick PDF tools">
            {(["merge", "split", "optimize"] as Tool[]).map((toolId) => {
              const tool = toolOptions.find((option) => option.id === toolId);
              if (!tool) return null;
              return <button key={tool.id} type="button" role="tab" aria-selected={activeTool === tool.id} onClick={() => selectTool(tool.id)} className={`rounded-lg px-4 py-2.5 text-sm font-bold transition ${activeTool === tool.id ? "bg-blue-600 text-white shadow-sm" : "bg-blue-50 text-blue-800 hover:bg-blue-100"}`}>{tool.title}</button>;
            })}
            {toolMenus.map((menu) => (
              <div key={menu.id} className="relative">
                <button type="button" aria-haspopup="menu" aria-expanded={openMenu === menu.id} onPointerDown={(event) => { if (event.button === 0) toggleMenu(menu.id); }} onClick={(event) => { if (event.detail === 0) toggleMenu(menu.id); }} className={`rounded-lg px-4 py-2.5 text-sm font-bold transition ${openMenu === menu.id ? "bg-slate-800 text-white shadow-sm" : "bg-slate-100 text-slate-700 hover:bg-blue-50 hover:text-blue-700"}`}>
                  {menu.label} {openMenu === menu.id ? "▲" : "▼"}
                </button>
                {openMenu === menu.id && (menu.id === "convert" ? <div role="menu" aria-label="Convert tools" className="absolute left-0 top-full z-20 mt-2 w-[29rem] max-w-[calc(100vw-2.5rem)] overflow-hidden rounded-xl border border-slate-200 bg-white shadow-xl">
                  <div className="grid grid-cols-2 divide-x divide-slate-200">
                    <section className="p-1.5"><h3 className="mx-1 mb-1 rounded-md bg-blue-700 px-2.5 py-1.5 text-xs font-extrabold uppercase tracking-wide text-white">Convert to PDF</h3>{convertToPdfTools.map((toolId) => { const tool = toolOptions.find((option) => option.id === toolId); return tool ? <button key={tool.id} type="button" role="menuitem" onClick={() => selectTool(tool.id)} className={`block w-full rounded-lg px-3 py-1.5 text-left text-sm font-semibold transition ${activeTool === tool.id ? "bg-blue-50 text-blue-800" : "text-slate-700 hover:bg-slate-100 hover:text-blue-700"}`}>{tool.title}</button> : null; })}</section>
                    <section className="p-1.5"><h3 className="mx-1 mb-1 rounded-md bg-blue-700 px-2.5 py-1.5 text-xs font-extrabold uppercase tracking-wide text-white">Convert from PDF</h3>{convertFromPdfTools.map((toolId) => { const tool = toolOptions.find((option) => option.id === toolId); return tool ? <button key={tool.id} type="button" role="menuitem" onClick={() => selectTool(tool.id)} className={`block w-full rounded-lg px-3 py-1.5 text-left text-sm font-semibold transition ${activeTool === tool.id ? "bg-blue-50 text-blue-800" : "text-slate-700 hover:bg-slate-100 hover:text-blue-700"}`}>{tool.title}</button> : null; })}</section>
                  </div>
                </div> : <div role="menu" aria-label={`${menu.label} tools`} className="absolute left-0 top-full z-20 mt-2 min-w-56 rounded-xl border border-slate-200 bg-white p-2 shadow-xl">
                  {menu.tools.map((toolId) => {
                    const tool = toolOptions.find((option) => option.id === toolId);
                    if (!tool) return null;
                    return <button key={tool.id} type="button" role="menuitem" onClick={() => selectTool(tool.id)} className={`block w-full rounded-lg px-3 py-2.5 text-left text-sm font-semibold transition ${activeTool === tool.id ? "bg-blue-50 text-blue-800" : "text-slate-700 hover:bg-slate-100 hover:text-slate-950"}`}>{tool.title}</button>;
                  })}
                </div>)}
              </div>
            ))}
          </div>
        </div>
      </nav>

      <section className={activeTool === "textEdit" && files.length ? "w-auto px-3 py-4 sm:px-5" : "w-full px-3 py-5 sm:px-5 sm:py-7"}>

        <section className={`relative min-w-0 bg-white ${activeTool === "textEdit" && files.length ? "" : "rounded-2xl border border-slate-200 p-5 shadow-sm sm:p-8"}`}>
          <div className={activeTool === "textEdit" ? "" : "grid min-w-0 grid-cols-[minmax(0,1fr)_20rem] gap-5"} style={activeTool === "textEdit" ? undefined : { display: "grid", gridTemplateColumns: "minmax(0, 1fr) 20rem", gap: "1.25rem" }}>
            <div className={activeTool === "textEdit" ? "" : "min-w-0"}>
          {!usesLargeUploadPanel && <><h2 data-no-translate className="text-2xl font-bold text-slate-950">{activeDetails.title}</h2><p data-no-translate className="mt-2 text-slate-600">{activeDetails.description}</p></>}

          {activeTool === "textEdit" && files.length ? <section className="mt-5 flex flex-wrap items-center justify-between gap-4 rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 shadow-sm">
            <div className="min-w-0"><p className="text-xs font-bold uppercase tracking-[0.14em] text-blue-700">Editing locally</p><p className="mt-1 truncate font-bold text-slate-900" title={files[0].name}>{files[0].name}</p><p data-no-translate className="mt-1 text-xs text-slate-600">{editorPageCount ? `${editablePdfPages.length} of ${editorPageCount} pages ready · ${formatBytes(files[0].size)}` : "Preparing PDF preview..."}</p></div>
            <div className="flex shrink-0 items-center gap-2"><label className="cursor-pointer rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-blue-700">Replace PDF<input className="sr-only" type="file" accept={accept} onChange={handleFiles} /></label><button type="button" onClick={clearSelectedFiles} className="rounded-lg px-3 py-2 text-sm font-bold text-blue-700 transition hover:bg-blue-50 hover:text-blue-900">Close</button></div>
            {isPreparingFiles && <div className="basis-full"><ProgressMeter title="Preparing your PDF" message={editorLoadingMessage || "Preparing the first editable page locally."} progress={progressPercent} /></div>}
          </section> : <div
            onDragEnter={(event) => {
              if (!Array.from(event.dataTransfer.types).includes("Files")) return;
              event.preventDefault();
              externalDragDepth.current += 1;
              setIsDragging(true);
            }}
            onDragOver={(event) => {
              if (!Array.from(event.dataTransfer.types).includes("Files")) return;
              event.preventDefault();
              event.dataTransfer.dropEffect = "copy";
            }}
            onDragLeave={(event) => {
              if (!Array.from(event.dataTransfer.types).includes("Files")) return;
              externalDragDepth.current = Math.max(0, externalDragDepth.current - 1);
              if (externalDragDepth.current === 0) setIsDragging(false);
            }}
            onDrop={handleDrop}
            style={uploadPanelMinHeight ? { minHeight: uploadPanelMinHeight } : undefined}
            className={`relative ${usesLargeUploadPanel ? "mt-0" : "mt-7"} rounded-2xl border-2 border-dashed transition ${isDragging ? "border-blue-600 bg-blue-100 ring-2 ring-blue-200" : "border-blue-200 bg-blue-50/70"}`}
          >
            {files.length === 0 ? (
                <div className="flex h-full flex-col items-center justify-center px-5 py-9 text-center" style={uploadPanelInnerMinHeight ? { minHeight: uploadPanelInnerMinHeight } : undefined}>
                <span data-no-translate className="text-lg font-bold text-slate-900">{isDragging ? "Drop files here" : uploadLabel}</span>
                <span className="mt-2 text-sm text-slate-600">{isDragging ? "Files will be added as soon as you drop them." : allowsMultiple ? "Drag and drop files, or use the select button. Multiple files are allowed." : "Drag and drop a file, or use the select button. A new file will replace the previous one."}</span>
                <label className="mt-4 cursor-pointer rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-blue-700">Select files<input className="sr-only" type="file" accept={accept} multiple={allowsMultiple} onChange={handleFiles} /></label>
              </div>
            ) : (
              <div className="p-4 sm:p-5">
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <div><h3 className="font-bold text-slate-900">Selected {files.length === 1 ? "file" : "files"}</h3><p className="mt-1 text-xs text-slate-600">{isDragging ? (allowsMultiple ? "Release to add these files." : "Release to replace the current file.") : "Preview files here, or add more files."}</p></div>
                  <div className="flex items-center gap-3"><label className="cursor-pointer rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-blue-700">Add files<input className="sr-only" type="file" accept={accept} multiple={allowsMultiple} onChange={handleFiles} /></label><button type="button" onClick={clearSelectedFiles} className="text-sm font-semibold text-blue-700 hover:text-blue-900">Clear all</button></div>
                </div>
                <div className="mt-4 grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
                  {files.map((file, index) => {
                    const thumbnail = thumbnails[fileKey(file)];
                    return (
                      <article
                        key={`${fileKey(file)}-${index}`}
                        draggable={allowsMultiple}
                        onDragStart={(event) => {
                          if (!allowsMultiple) return;
                          event.dataTransfer.effectAllowed = "move";
                          event.dataTransfer.setData("text/plain", String(index));
                          setDraggedFileIndex(index);
                        }}
                        onDragOver={(event) => {
                          if (!allowsMultiple || draggedFileIndex === null) return;
                          event.preventDefault();
                          event.stopPropagation();
                          event.dataTransfer.dropEffect = "move";
                        }}
                        onDrop={(event) => {
                          if (!allowsMultiple || draggedFileIndex === null) return;
                          event.preventDefault();
                          event.stopPropagation();
                          moveFileToIndex(index);
                        }}
                        onDragEnd={() => setDraggedFileIndex(null)}
                        className={`overflow-hidden rounded-xl border bg-white shadow-sm transition ${allowsMultiple ? "cursor-grab active:cursor-grabbing" : ""} ${draggedFileIndex === index ? "border-blue-500 opacity-50 ring-2 ring-blue-200" : "border-slate-200"}`}
                      >
                        <div className="flex h-32 items-center justify-center overflow-hidden border-b border-slate-200 bg-slate-100">
                          {thumbnail ? <img src={thumbnail} alt={`${file.name} preview`} className="h-full w-full object-contain" /> : <div className="text-center"><span className="mx-auto flex h-10 w-8 items-end justify-center rounded border border-slate-300 bg-white pb-1 text-[10px] font-bold text-blue-700">{file.type.startsWith("image/") ? "IMG" : "PDF"}</span><span className="mt-2 block text-xs font-medium text-slate-500">Preview loading...</span></div>}
                        </div>
                        <div className="p-3">
                          <p className="truncate text-sm font-semibold text-slate-900" title={file.name}>{allowsMultiple && `${index + 1}. `}{file.name}</p>
                          <p className="mt-1 text-xs text-slate-500">{formatBytes(file.size)}</p>
                          <div className="mt-3 flex flex-wrap items-center gap-1">
                            {allowsMultiple && <span className="mr-1 cursor-grab rounded-md bg-slate-100 px-2 py-1 text-xs font-semibold text-slate-500" title="Drag this card with your mouse to change its order">↕ Drag</span>}
                            {allowsMultiple && <><button type="button" disabled={index === 0} onClick={() => moveFile(index, -1)} className="rounded-md px-2 py-1 text-xs font-bold text-slate-600 hover:bg-blue-50 hover:text-blue-700 disabled:cursor-not-allowed disabled:opacity-30">Up</button><button type="button" disabled={index === files.length - 1} onClick={() => moveFile(index, 1)} className="rounded-md px-2 py-1 text-xs font-bold text-slate-600 hover:bg-blue-50 hover:text-blue-700 disabled:cursor-not-allowed disabled:opacity-30">Down</button></>}
                            <button type="button" onClick={() => removeFile(index)} className="rounded-md px-2 py-1 text-xs font-bold text-slate-600 hover:bg-red-50 hover:text-red-700">Remove</button>
                          </div>
                        </div>
                      </article>
                    );
                  })}
                </div>
                <p className="mt-4 text-center text-xs text-slate-500">{allowsMultiple ? "Drag cards with your mouse to set the merge order. You can also add new files by dragging them into this area." : "You can replace the file by dragging and dropping a new one into this area."}</p>
              </div>
            )}
            {isPreparingFiles && <div className="absolute inset-0 z-20 flex items-center justify-center rounded-2xl bg-white/90 p-5 backdrop-blur-[1px]"><div className="w-full max-w-md"><ProgressMeter title="Preparing selected file" message="Reading your file and creating a local preview. Large files can take a moment." progress={progressPercent} /></div></div>}
          </div>}

          {needsPages && <label className="mt-6 block"><span className="text-sm font-bold text-slate-800">{activeTool === "delete" ? "Pages to delete" : activeTool === "reorder" ? "New page order" : "Pages to process"}</span><input value={pageSelection} onChange={(event) => setPageSelection(event.target.value)} placeholder={activeTool === "reorder" ? "e.g. 3, 1, 2" : "All pages (or e.g. 1, 3-5)"} className="mt-2 w-full rounded-xl border border-slate-300 px-4 py-3 text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-blue-600 focus:ring-2 focus:ring-blue-100" /><span className="mt-2 block text-xs text-slate-500">Leave blank to select all pages.</span></label>}

          {activeTool === "rotate" && <label className="mt-5 block"><span className="text-sm font-bold text-slate-800">Rotate clockwise</span><select value={rotation} onChange={(event) => setRotation(Number(event.target.value))} className="mt-2 w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-slate-900 outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-100"><option value={90}>90 degrees</option><option value={180}>180 degrees</option><option value={270}>270 degrees</option></select></label>}
          {activeTool === "pdfToImage" && <label className="mt-5 block"><span className="text-sm font-bold text-slate-800">Image format</span><select value={imageFormat} onChange={(event) => setImageFormat(event.target.value as "png" | "jpg")} className="mt-2 w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-slate-900 outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-100"><option value="png">PNG (best quality)</option><option value="jpg">JPG (smaller files)</option></select></label>}
          {activeTool === "watermark" && <label className="mt-5 block"><span className="text-sm font-bold text-slate-800">Watermark text</span><input value={watermark} onChange={(event) => setWatermark(event.target.value)} className="mt-2 w-full rounded-xl border border-slate-300 px-4 py-3 text-slate-900 outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-100" /></label>}
          {activeTool === "crop" && <label className="mt-5 block"><span className="text-sm font-bold text-slate-800">Equal margin to crop (PDF points)</span><input type="number" min="0" value={cropMargin} onChange={(event) => setCropMargin(Number(event.target.value))} className="mt-2 w-full rounded-xl border border-slate-300 px-4 py-3 text-slate-900 outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-100" /></label>}
          {activeTool === "textEdit" && false && <section className="mt-6 rounded-2xl border border-slate-200 bg-slate-50 p-4 sm:p-5">
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div><h3 className="font-bold text-slate-950">Text correction editor</h3><p className="mt-1 text-sm leading-6 text-slate-600">Select a text item, correct it, then save. Its detected point size is retained automatically.</p></div>
              <span data-no-translate className="rounded-full bg-blue-100 px-3 py-1 text-xs font-bold text-blue-800">{isTextEditorLoading ? "Reading PDF text..." : `${editableTextRuns.length} editable text items`}</span>
            </div>
            {!isTextEditorLoading && editableTextRuns.length === 0 && <p className="mt-4 rounded-xl border border-amber-200 bg-amber-50 p-4 text-sm leading-6 text-amber-950">No straight, selectable text was found. Scanned PDFs need OCR first, and rotated text is not included in this editor.</p>}
            {!isTextEditorLoading && editableTextRuns.length > 0 && <>
              <div className="mt-5 flex flex-wrap items-center justify-between gap-3"><label className="min-w-60 flex-1"><span className="sr-only">Find text</span><input value={textEditorQuery} onChange={(event) => setTextEditorQuery(event.target.value)} placeholder="Find text in this PDF" className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-blue-600 focus:ring-2 focus:ring-blue-100" /></label><span data-no-translate className="text-sm font-semibold text-slate-600">{textChangeCount} change{textChangeCount === 1 ? "" : "s"} ready to save</span></div>
              <div className="mt-4 grid gap-4 lg:grid-cols-[minmax(0,1fr)_minmax(18rem,0.9fr)]">
                <div className="max-h-[28rem] overflow-y-auto rounded-xl border border-slate-200 bg-white p-2">
                  {visibleTextRuns.slice(0, 300).map((run) => <button key={run.id} type="button" onClick={() => setSelectedTextRunId(run.id)} className={`mb-1 flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-left transition last:mb-0 ${selectedTextRunId === run.id ? "bg-blue-600 text-white" : "text-slate-700 hover:bg-blue-50"}`}>
                    <span className={`shrink-0 rounded-md px-2 py-1 text-[11px] font-bold ${selectedTextRunId === run.id ? "bg-white/20 text-white" : "bg-slate-100 text-slate-600"}`}>P{run.pageIndex + 1} · {run.fontSize}pt</span><span className="min-w-0 truncate text-sm font-medium">{run.value || "(remove text)"}</span>
                  </button>)}
                  {visibleTextRuns.length > 300 && <p className="px-3 py-2 text-xs text-slate-500">Showing the first 300 matches. Use search to narrow the list.</p>}
                  {visibleTextRuns.length === 0 && <p className="p-4 text-sm text-slate-500">No text items match that search.</p>}
                </div>
                <div className="rounded-xl border border-slate-200 bg-white p-4">
                  {selectedTextRun ? <>
                    <p className="text-xs font-bold uppercase tracking-wide text-slate-500">Original text</p><p className="mt-1 break-words rounded-lg bg-slate-50 p-3 text-sm text-slate-700">{selectedTextRun!.original}</p>
                    <label className="mt-4 block"><span className="text-sm font-bold text-slate-800">Corrected text</span><textarea value={selectedTextRun!.value} onChange={(event) => updateTextRun(selectedTextRun!.id, event.target.value)} rows={4} className="mt-2 w-full resize-y rounded-xl border border-slate-300 px-4 py-3 text-slate-900 outline-none transition focus:border-blue-600 focus:ring-2 focus:ring-blue-100" /></label>
                    <div className="mt-3 flex flex-wrap items-center justify-between gap-2 text-xs text-slate-600"><span>Detected: {selectedTextRun!.fontFamily} · {selectedTextRun!.fontSize}pt</span><button type="button" onClick={() => updateTextRun(selectedTextRun!.id, selectedTextRun!.original)} disabled={selectedTextRun!.value === selectedTextRun!.original} className="font-bold text-blue-700 hover:text-blue-900 disabled:cursor-not-allowed disabled:opacity-40">Reset this text</button></div>
                  </> : <p className="text-sm text-slate-500">Select a text item from the list to edit it.</p>}
                </div>
              </div>
              <p className="mt-4 rounded-xl border border-blue-100 bg-blue-50 p-4 text-xs leading-5 text-blue-950">For a clean result, use this for short corrections on light document backgrounds. The saved PDF keeps the detected font size and matches the source&apos;s standard font style where possible. Exact custom embedded fonts, colour backgrounds, rotated text, scans and non-Latin text may need a dedicated desktop PDF editor.</p>
            </>}
          </section>}
          {activeTool === "textEdit" && <section className="mt-5">
            {isTextEditorLoading && <div className="flex min-h-80 items-center justify-center rounded-2xl border border-slate-200 bg-slate-50 p-6 text-center"><div><p className="text-lg font-bold text-slate-900">Opening your PDF editor...</p><p className="mt-2 text-sm text-slate-600">{editorLoadingMessage || "Preparing the first editable page."}</p></div></div>}
            {!isTextEditorLoading && editorLoadError && <div role="alert" className="mb-4 rounded-2xl border border-red-200 bg-red-50 p-5 text-sm leading-6 text-red-900"><p className="font-bold">The PDF editor could not finish loading.</p><p className="mt-1">{editorLoadError}</p><div className="mt-4 flex flex-wrap gap-2"><button type="button" onClick={retryTextEditor} className="rounded-lg bg-red-700 px-3 py-2 text-sm font-bold text-white transition hover:bg-red-800">Retry</button><button type="button" onClick={clearSelectedFiles} className="rounded-lg border border-red-300 bg-white px-3 py-2 text-sm font-bold text-red-800 transition hover:bg-red-100">Choose another PDF</button></div></div>}
            {!isTextEditorLoading && files.length > 0 && editablePdfPages.length === 0 && !editorLoadError && <p className="rounded-2xl border border-amber-200 bg-amber-50 p-5 text-sm leading-6 text-amber-950">The PDF opened but no page preview is available yet. Retry the editor or choose another PDF.</p>}
            {!isTextEditorLoading && files.length > 0 && editablePdfPages.length > 0 && <div className="grid min-w-0 gap-4 xl:grid-cols-[minmax(0,1fr)_22rem]">
              <section aria-label="PDF page editor" className="min-w-0 overflow-hidden rounded-2xl border border-slate-200 bg-slate-100 shadow-sm">
                <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-200 bg-white px-4 py-3"><div><h3 className="font-bold text-slate-950">PDF pages</h3><p className="mt-1 text-xs text-slate-600">Click a line to edit it directly. Its appearance is sampled only when you begin editing it.</p></div><span data-no-translate className="rounded-full bg-blue-100 px-3 py-1 text-xs font-bold text-blue-800">{editablePdfPages.length} of {editorPageCount} pages ready - {editableTextRuns.length} text items</span></div>
                {editablePdfPages.length < editorPageCount && <p role="status" className="border-b border-slate-200 bg-blue-50 px-4 py-2 text-xs text-blue-900">Remaining pages are loading in the background. Select a page number to prioritize it.</p>}
                {Object.entries(editorPageFailures).map(([pageIndex, failure]) => <p key={pageIndex} role="status" className="border-b border-amber-200 bg-amber-50 px-4 py-2 text-xs text-amber-950">{failure.message}{!failure.retrying && <button type="button" onClick={() => retryEditorPage(Number(pageIndex))} className="ml-2 font-bold text-blue-800 underline hover:text-blue-950">Retry page {Number(pageIndex) + 1}</button>}</p>)}
                {editableTextRuns.length === 0 && <p className="border-b border-amber-200 bg-amber-50 px-4 py-2 text-xs text-amber-950">No straight, selectable text was found on the loaded pages. Scanned PDFs need OCR first, and rotated text is not included in this editor.</p>}
                <div className="max-h-[calc(100vh-15.5rem)] min-h-[34rem] overflow-y-auto overscroll-contain p-3 sm:p-5">
                  {editablePdfPages.map((page) => <article key={page.pageIndex} ref={(element) => { editorPageRefs.current[page.pageIndex] = element; }} className="mx-auto mb-8 w-full max-w-[58rem] scroll-mt-5 last:mb-0">
                    <div ref={(element) => { editorCanvasRefs.current[page.pageIndex] = element; }} className="relative rounded-lg bg-white shadow-md [container-type:inline-size]">
                      <canvas ref={(element) => setEditorPreviewCanvas(page.pageIndex, element)} aria-label={`PDF page ${page.pageIndex + 1}`} role="img" className="block h-auto w-full select-none rounded-lg" />
                      <div className="absolute inset-0">
                        {editableTextRuns.filter((run) => run.pageIndex === page.pageIndex).map((run) => {
                          const isSelected = selectedTextRunId === run.id;
                          const isSearchMatch = textEditorQuery.trim().length > 0 && matchingTextRunIds.has(run.id);
                          const isChanged = textRunHasChanges(run);
                          const previewFontFamily = editorPreviewFont(run);
                          const left = Math.max(0, (run.x / page.width) * 100);
                          const top = Math.max(0, ((page.height - run.y - run.height) / page.height) * 100);
                          const width = Math.min(100 - left, Math.max((run.width / page.width) * 100, 0.75));
                          const height = Math.min(100 - top, Math.max((run.height / page.height) * 100, 0.75));
                          const estimatedReplacementWidth = Math.max(run.width, (run.value.length + 0.45) * run.fontSize * 0.62);
                          const previewWidth = isSelected || isChanged ? Math.min(100 - left, Math.max(width, (estimatedReplacementWidth / page.width) * 100)) : width;
                          const runStyle = { left: `${left}%`, top: `${top}%`, width: `${previewWidth}%`, height: `${height}%` };
                          return <div key={run.id} ref={isSelected ? activeTextEditorRef : undefined} className="absolute" style={runStyle}>
                            {isSelected && <input ref={activeTextInputRef} data-text-run-id={run.id} aria-label={`Edit page ${run.pageIndex + 1} text`} lang={usesDevanagariFont(run) ? "hi" : undefined} autoFocus value={run.value} onInput={(event) => updateTextRun(run.id, event.currentTarget.value)} onCopy={(event) => handleInputCopy(event, run.id)} onCut={(event) => handleInputCut(event, run.id)} onPaste={(event) => handleInputPaste(event, run.id)} onKeyDown={(event) => { if (event.key === "Enter" || event.key === "Escape") { event.preventDefault(); finishTextRunEdit(); return; } if (event.ctrlKey || event.metaKey) { const key = event.key.toLowerCase(); if (key === "x") { event.preventDefault(); void cutSelectedInputText(run.id); } else if (key === "c") { event.preventDefault(); void copySelectedInputText(run.id); } else if (key === "v") { event.preventDefault(); void pasteIntoSelectedInput(run.id); } } }} className="absolute inset-0 z-20 min-w-0 rounded-sm border-0 px-0 outline-none ring-2 ring-blue-600" style={{ backgroundColor: cssColor(run.backgroundColor), color: cssColor(run.textColor), fontFamily: previewFontFamily, fontSize: `${Math.max(0.7, (run.fontSize / page.width) * 100)}cqw`, fontWeight: run.isBold ? 700 : 400, fontStyle: run.isItalic ? "italic" : "normal", textDecoration: run.isUnderline ? "underline" : "none", textAlign: run.alignment, lineHeight: 1.1 }} />}
                            {!isSelected && isChanged && <input aria-hidden="true" readOnly tabIndex={-1} value={run.value} className="pointer-events-none absolute inset-0 z-[1] min-w-0 rounded-sm border-0 px-0 outline-none" style={{ backgroundColor: cssColor(run.backgroundColor), color: cssColor(run.textColor), fontFamily: previewFontFamily, fontSize: `${Math.max(0.7, (run.fontSize / page.width) * 100)}cqw`, fontWeight: run.isBold ? 700 : 400, fontStyle: run.isItalic ? "italic" : "normal", textDecoration: run.isUnderline ? "underline" : "none", textAlign: run.alignment, lineHeight: 1.1 }} />}
                            <button type="button" aria-label={`Edit page ${run.pageIndex + 1} text: ${run.value || run.original}`} title={`Click to edit: ${run.value || run.original}`} onClick={() => startTextRunEdit(run.id)} className={`absolute inset-0 z-10 cursor-text appearance-none rounded-sm border-0 bg-transparent p-0 text-transparent outline-none transition focus:ring-2 focus:ring-blue-300 ${isSelected ? "pointer-events-none" : isSearchMatch ? "bg-amber-300/20 ring-1 ring-amber-500" : "hover:bg-blue-300/15 hover:ring-1 hover:ring-blue-500"}`} style={{ appearance: "none", WebkitAppearance: "none", MozAppearance: "none", backgroundColor: "transparent", backgroundImage: "none", border: 0, boxShadow: "none" }} />
                            {isSelected && <div ref={activeToolbarRef} role="toolbar" aria-label="PDF text formatting controls" className="absolute z-30 box-border w-max max-w-[100cqw] rounded-lg border border-slate-300 bg-slate-200/90 shadow-sm shadow-slate-900/10" style={{ left: toolbarPosition.runId === run.id ? `${toolbarPosition.left}px` : "0", top: "calc(100% + 8px)" }}>
                              <div className="flex flex-wrap items-center gap-1 p-1.5 text-xs text-slate-700">
                                <label className="shrink-0"><span className="sr-only">Font</span><select aria-label="Font" value={run.fontPreset} onChange={(event) => updateTextRunAppearance(run.id, { fontPreset: event.target.value as FontPreset })} className="w-28 rounded border border-slate-300 bg-white px-1.5 py-1 text-xs text-slate-800 outline-none focus:border-blue-600"><option value="auto">Auto detected</option><option value="arial">Arial</option><option value="helvetica">Helvetica</option><option value="timesNewRoman">Times New Roman</option><option value="georgia">Georgia</option><option value="verdana">Verdana</option><option value="tahoma">Tahoma</option><option value="courierNew">Courier New</option><option value="trebuchetMs">Trebuchet MS</option></select></label>
                                <label className="shrink-0"><span className="sr-only">Font size in points</span><input aria-label="Font size in points" type="number" min="4" max="96" step="0.1" value={run.fontSize} onChange={(event) => updateTextRunAppearance(run.id, { fontSize: Math.max(4, Math.min(96, Number(event.target.value) || run.fontSize)) })} className="w-14 rounded border border-slate-300 px-1.5 py-1 text-xs text-slate-800 outline-none focus:border-blue-600" /></label>
                                <span className="flex shrink-0 items-center gap-1"><button type="button" aria-label="Bold" aria-pressed={run.isBold} onClick={() => updateTextRunFormatting(run.id, { isBold: !run.isBold, isItalic: run.isItalic, isUnderline: run.isUnderline, alignment: run.alignment })} className={`rounded px-1.5 py-1 font-bold ${run.isBold ? "bg-blue-100 text-blue-800" : "hover:bg-slate-100"}`}>B</button><button type="button" aria-label="Italic" aria-pressed={run.isItalic} onClick={() => updateTextRunFormatting(run.id, { isBold: run.isBold, isItalic: !run.isItalic, isUnderline: run.isUnderline, alignment: run.alignment })} className={`rounded px-1.5 py-1 italic ${run.isItalic ? "bg-blue-100 text-blue-800" : "hover:bg-slate-100"}`}>I</button><button type="button" aria-label="Underline" aria-pressed={run.isUnderline} onClick={() => updateTextRunFormatting(run.id, { isBold: run.isBold, isItalic: run.isItalic, isUnderline: !run.isUnderline, alignment: run.alignment })} className={`rounded px-1.5 py-1 underline ${run.isUnderline ? "bg-blue-100 text-blue-800" : "hover:bg-slate-100"}`}>U</button></span>
                                <label className="shrink-0"><span className="sr-only">Text alignment</span><select aria-label="Text alignment" value={run.alignment} onChange={(event) => updateTextRunFormatting(run.id, { isBold: run.isBold, isItalic: run.isItalic, isUnderline: run.isUnderline, alignment: event.target.value as TextAlignment })} className="w-20 rounded border border-slate-300 bg-white px-1.5 py-1 text-xs text-slate-800 outline-none focus:border-blue-600"><option value="left">Left</option><option value="center">Center</option><option value="right">Right</option></select></label>
                                <label className="flex shrink-0 items-center gap-1 whitespace-nowrap rounded border border-slate-300 bg-white px-1.5 py-0.5 font-medium"><span>Text</span><input aria-label="Text colour" type="color" value={colorToHex(run.textColor)} onChange={(event) => updateTextRunAppearance(run.id, { textColor: hexToColor(event.target.value, run.textColor) })} className="h-5 w-5 cursor-pointer border-0 bg-transparent p-0" /></label>
                                <label className="flex shrink-0 items-center gap-1 whitespace-nowrap rounded border border-slate-300 bg-white px-1.5 py-0.5 font-medium"><span>BG</span><input aria-label="Background colour" type="color" value={colorToHex(run.backgroundColor)} onChange={(event) => updateTextRunAppearance(run.id, { backgroundColor: hexToColor(event.target.value, run.backgroundColor) })} className="h-5 w-5 cursor-pointer border-0 bg-transparent p-0" /></label>
                                <button type="button" aria-label="Cut" title="Cut" onPointerDown={(event) => event.preventDefault()} onClick={() => { void cutSelectedInputText(run.id); }} className="shrink-0 rounded p-1.5 text-slate-700 hover:bg-slate-100 hover:text-slate-950"><Scissors aria-hidden="true" className="h-3.5 w-3.5" /></button>
                                <button type="button" aria-label="Copy" title="Copy" onPointerDown={(event) => event.preventDefault()} onClick={() => { void copySelectedInputText(run.id); }} className="shrink-0 rounded p-1.5 text-slate-700 hover:bg-slate-100 hover:text-slate-950"><Copy aria-hidden="true" className="h-3.5 w-3.5" /></button>
                                <button type="button" aria-label="Paste" title="Paste" onPointerDown={(event) => event.preventDefault()} onClick={() => { void pasteIntoSelectedInput(run.id); }} className="shrink-0 rounded p-1.5 text-slate-700 hover:bg-slate-100 hover:text-slate-950"><ClipboardPaste aria-hidden="true" className="h-3.5 w-3.5" /></button>
                                <button type="button" aria-label="Delete" title="Delete" onPointerDown={(event) => event.preventDefault()} onClick={() => deleteTextRun(run.id)} disabled={!run.value} className="shrink-0 rounded p-1.5 text-slate-700 hover:bg-slate-100 hover:text-slate-950 disabled:cursor-not-allowed disabled:text-slate-400 disabled:opacity-40"><Trash2 aria-hidden="true" className="h-3.5 w-3.5" /></button>
                                <button type="button" aria-label="Undo" title="Undo" onPointerDown={(event) => event.preventDefault()} onClick={() => undoTextRunEdit(run.id)} disabled={textEditHistory.runId !== run.id || textEditHistory.position <= 0} className="shrink-0 rounded p-1.5 text-slate-700 hover:bg-slate-100 hover:text-slate-950 disabled:cursor-not-allowed disabled:text-slate-400 disabled:opacity-40"><Undo2 aria-hidden="true" className="h-3.5 w-3.5" /></button>
                                <button type="button" aria-label="Redo" title="Redo" onPointerDown={(event) => event.preventDefault()} onClick={() => redoTextRunEdit(run.id)} disabled={textEditHistory.runId !== run.id || textEditHistory.position >= textEditHistory.snapshots.length - 1} className="shrink-0 rounded p-1.5 text-slate-700 hover:bg-slate-100 hover:text-slate-950 disabled:cursor-not-allowed disabled:text-slate-400 disabled:opacity-40"><Redo2 aria-hidden="true" className="h-3.5 w-3.5" /></button>
                                <button type="button" onClick={finishTextRunEdit} className="shrink-0 rounded bg-blue-600 px-2 py-1 font-bold text-white hover:bg-blue-700">Done</button>
                                <button type="button" aria-label="Match Original" title="Match Original" aria-pressed={run.matchOriginal} onPointerDown={(event) => event.preventDefault()} onClick={() => setMatchOriginal(run.id, !run.matchOriginal)} className={`shrink-0 rounded p-1.5 ${run.matchOriginal ? "bg-blue-100 text-blue-800" : "border border-slate-300 text-slate-700 hover:bg-slate-50 hover:text-slate-950"}`}><Check aria-hidden="true" className="h-3.5 w-3.5" /></button>
                              </div>
                            </div>}
                          </div>;
                        })}
                      </div>
                    </div>
                    <p className="mt-2 text-center text-xs font-bold text-slate-500">Page {page.pageIndex + 1} of {editorPageCount}</p>
                  </article>)}
                </div>
              </section>

              <aside className="min-w-0 self-start xl:sticky xl:top-4">
                <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
                  <div className="border-b border-slate-200 px-4 py-4"><div className="flex items-center justify-between gap-3"><div><h3 className="font-bold text-slate-950">Edit and changes</h3><p className="mt-1 text-xs text-slate-600">Changes stay here until you save.</p></div><span data-no-translate className="rounded-full bg-blue-100 px-3 py-1 text-xs font-bold text-blue-800">{textChangeCount}</span></div><label className="mt-4 block"><span className="sr-only">Find text</span><input value={textEditorQuery} onChange={(event) => setTextEditorQuery(event.target.value)} placeholder="Find text in this PDF" className="w-full rounded-xl border border-slate-300 px-3 py-2.5 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-blue-600 focus:ring-2 focus:ring-blue-100" /></label>{textEditorQuery.trim() && <p data-no-translate className="mt-2 text-xs font-semibold text-slate-600">{visibleTextRuns.length} matching text item{visibleTextRuns.length === 1 ? "" : "s"}</p>}<div className="mt-3 flex flex-wrap gap-1">{Array.from({ length: editorPageCount }, (_, pageIndex) => <button key={pageIndex} type="button" onClick={() => scrollToEditorPage(pageIndex)} className={`rounded-md px-2 py-1 text-xs font-bold transition ${editablePdfPages.some((page) => page.pageIndex === pageIndex) ? "bg-slate-100 text-slate-700 hover:bg-blue-100 hover:text-blue-800" : "bg-blue-50 text-blue-700 hover:bg-blue-100"}`}>P{pageIndex + 1}</button>)}</div></div>
                  <div className="border-t border-slate-200 bg-blue-50/50 p-4">
                    {selectedTextRun ? <><p className="text-xs font-bold uppercase tracking-wide text-blue-800">Editing on page {selectedTextRun.pageIndex + 1}</p><p className="mt-1 text-sm leading-5 text-slate-600">Use the floating editor on the PDF itself. Font, size, text colour and background can be corrected there.</p><button type="button" onClick={() => setSelectedTextRunId(null)} className="mt-3 rounded-md border border-blue-200 bg-white px-3 py-1.5 text-xs font-bold text-blue-700 hover:bg-blue-50">Close editor</button></> : <p className="text-sm leading-6 text-slate-500">Click any text directly in the PDF. Its editor will open beside that line.</p>}
                  </div>
                  <div className="border-t border-slate-200 bg-slate-50 p-4"><div className="flex items-center justify-between gap-2"><p className="text-sm font-bold text-slate-800">Change history</p><span data-no-translate className="text-xs font-semibold text-slate-500">{textChangeCount} pending</span></div>{changedTextRuns.length ? <div className="mt-3 space-y-2">{changedTextRuns.map((run) => <article key={run.id} className="rounded-lg border border-blue-100 bg-white p-3"><div className="flex items-start justify-between gap-2"><button type="button" onClick={() => { startTextRunEdit(run.id); scrollToEditorPage(run.pageIndex); }} className="min-w-0 text-left text-sm font-semibold text-blue-800 hover:text-blue-950"><span className="block text-[11px] uppercase tracking-wide text-slate-500">Page {run.pageIndex + 1}</span><span className="block truncate text-slate-500 line-through">{run.original}</span><span className="block truncate text-slate-900">{run.value || "(removed)"}</span></button><button type="button" onClick={() => discardTextRunChange(run.id)} className="shrink-0 text-xs font-bold text-slate-500 hover:text-red-700">Remove</button></div></article>)}</div> : <p className="mt-2 text-sm leading-5 text-slate-500">No unsaved changes. Saved changes disappear from this list.</p>}</div>
                  <div className="border-t border-slate-200 p-4">{error && <p role="alert" className="mb-3 rounded-xl bg-red-50 p-3 text-sm font-medium text-red-800">{error}</p>}{status && <p role="status" className="mb-3 rounded-xl bg-emerald-50 p-3 text-sm font-medium text-emerald-800">{status}</p>}{isWorking && <div className="mb-3"><ProgressMeter title="Saving your PDF" message="Processing your changes securely in your browser. Download will start automatically." progress={progressPercent} /></div>}<button data-no-translate type="button" onClick={runTool} disabled={isWorking || isPreparingFiles || textChangeCount === 0} className="w-full rounded-xl bg-blue-600 px-4 py-3 font-bold text-white shadow-sm transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:bg-blue-300">{isWorking ? "Saving PDF..." : "Save PDF and download"}</button><p className="mt-2 text-center text-xs leading-5 text-slate-500">After save, the change history is cleared.</p></div>
                </section>
              </aside>
            </div>}
          </section>}
          {activeTool === "metadata" && <div className="mt-5"><p className="mb-4 rounded-xl border border-blue-100 bg-blue-50 p-4 text-sm leading-6 text-blue-950">Existing metadata is loaded automatically. Edit any value, or clear a field to remove it, then save the corrected PDF.</p><div className="grid gap-4 sm:grid-cols-2">{(["title", "author", "subject", "keywords"] as const).map((field) => <label key={field} className="block"><span className="text-sm font-bold capitalize text-slate-800">{field}</span><input value={metadata[field]} onChange={(event) => setMetadata((current) => ({ ...current, [field]: event.target.value }))} placeholder={field === "keywords" ? "resume, job, profile" : `PDF ${field}`} className="mt-2 w-full rounded-xl border border-slate-300 px-4 py-3 text-slate-900 outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-100" /></label>)}</div></div>}
          {(activeTool === "protect" || activeTool === "unlock") && <div className="mt-5 grid gap-4 sm:grid-cols-2"><label className="block"><span className="text-sm font-bold text-slate-800">{activeTool === "unlock" ? "Current PDF password" : "Open password"}</span><input type="password" value={password} onChange={(event) => setPassword(event.target.value)} className="mt-2 w-full rounded-xl border border-slate-300 px-4 py-3 text-slate-900 outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-100" /></label>{activeTool === "protect" && <label className="block"><span className="text-sm font-bold text-slate-800">Owner password (optional)</span><input type="password" value={ownerPassword} onChange={(event) => setOwnerPassword(event.target.value)} className="mt-2 w-full rounded-xl border border-slate-300 px-4 py-3 text-slate-900 outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-100" /></label>}</div>}
          {activeTool === "ocr" && <label className="mt-5 block"><span className="text-sm font-bold text-slate-800">OCR language</span><select value={ocrLanguage} onChange={(event) => setOcrLanguage(event.target.value as "eng" | "hin")} className="mt-2 w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-slate-900 outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-100"><option value="eng">English</option><option value="hin">Hindi</option></select><span className="mt-2 block text-xs text-slate-500">Language data may download the first time you use OCR.</span></label>}
          {activeTool === "optimize" && <>
            <label className="mt-5 block"><span className="text-sm font-bold text-slate-800">Compression level</span><select value={compressionLevel} onChange={(event) => setCompressionLevel(event.target.value as "high" | "balanced" | "small")} className="mt-2 w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-slate-900 outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-100"><option value="high">High quality — larger file</option><option value="balanced">Recommended — high quality</option><option value="small">Smallest file — lower quality</option></select></label>
            <details className="mt-4 rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-700" open={compressionLevel === "small"}>
              <summary className="cursor-pointer font-semibold text-slate-800">Compression output note</summary>
              <p className="mt-2 leading-6">Compression converts page images to optimized JPGs. It can reduce file size, but the result is a visual PDF and does not preserve the original searchable text.</p>
            </details>
          </>}
          {activeTool === "unlock" && <p className="mt-6 rounded-xl border border-amber-200 bg-amber-50 p-4 text-sm leading-6 text-amber-950">The unlock copy recreates pages as a high-quality visual PDF. A password is required, and searchable text is not preserved.</p>}

            </div>
            {activeTool !== "textEdit" && <aside className={`sticky top-5 flex min-h-[calc(100vh-10rem)] flex-col rounded-2xl border border-slate-200 bg-slate-50 p-5 shadow-sm max-[480px]:static max-[480px]:min-h-0 max-[480px]:p-4 ${usesTallActionSidebar ? "self-stretch" : "self-start"}`} style={actionSidebarMinHeight ? { minHeight: actionSidebarMinHeight } : undefined}>
              <div className={usesCenteredActionSidebar ? "text-center" : undefined}>
                <h3 data-no-translate className="text-lg font-bold text-slate-950">{activeDetails.title}</h3>
                <p data-no-translate className="mt-1 text-sm leading-5 text-slate-600">{usesCenteredActionSidebar ? activeDetails.description : "Choose files and options on the left, then download your result here."}</p>
                <p data-no-translate className="mt-4 rounded-lg bg-white px-3 py-2 text-xs font-semibold text-slate-600">Choose file(s) before downloading</p>
                {usesResizeLayout && <section className="mt-5 border-t border-slate-200 pt-4 text-left">
                  <h4 className="text-sm font-bold text-slate-800">Custom page size</h4>
                  <p className="mt-1 text-xs leading-5 text-slate-600">Content and page dimensions resize together, so the PDF&apos;s proportions stay unchanged.</p>
                  <label className="mt-3 block"><span className="text-sm font-bold text-slate-800">Target page size (%)</span><input type="number" min={activeTool === "resizeDecrease" ? 1 : 101} max={activeTool === "resizeDecrease" ? 99 : 400} step="1" value={resizePercentage} onChange={(event) => setResizePercentage(Number(event.target.value))} className="mt-2 w-full rounded-xl border border-slate-300 bg-white px-3 py-2.5 text-slate-900 outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-100" /><span className="mt-2 block text-xs leading-5 text-slate-500">{activeTool === "resizeDecrease" ? "Choose any custom size from 1% to 99% of the original page." : "Choose any custom size above 100% of the original page."}</span></label>
                </section>}
              </div>
              <div className="mt-auto">{error && <p role="alert" className="mb-3 rounded-xl bg-red-50 p-3 text-sm font-medium text-red-800">{error}</p>}{status && <p role="status" className="mb-3 rounded-xl bg-emerald-50 p-3 text-sm font-medium text-emerald-800">{status}</p>}{isWorking && <div className="mb-3"><ProgressMeter title="Processing your file" message="Your result is being created securely in your browser. Download will start automatically." progress={progressPercent} /></div>}<button data-no-translate type="button" onClick={runTool} disabled={isWorking || isPreparingFiles} className="w-full rounded-xl bg-blue-600 px-4 py-3 font-bold text-white shadow-sm transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:bg-blue-300">{isWorking ? "Processing..." : `${activeDetails.title} and download`}</button><p className="mt-3 text-center text-xs leading-5 text-slate-500">Files are processed locally in your browser.</p></div>
            </aside>}
          </div>
        </section>
      </section>
    </main>
  );
}
