"use client";

import Link from "next/link";
import Image from "next/image";
import { ChangeEvent, DragEvent, useEffect, useMemo, useState } from "react";
import JSZip from "jszip";
import { degrees, PDFDocument, rgb, StandardFonts } from "pdf-lib";
import { LanguageSelector } from "../components/LanguageProvider";

type Tool =
  | "merge"
  | "split"
  | "extract"
  | "delete"
  | "reorder"
  | "rotate"
  | "pdfToImage"
  | "imageToPdf"
  | "watermark"
  | "pageNumbers"
  | "crop"
  | "optimize"
  | "metadata"
  | "protect"
  | "unlock"
  | "word"
  | "excel"
  | "ocr";

type ToolOption = { id: Tool; title: string; description: string };
type ToolMenu = "convert" | "organize" | "edit" | "security";

const toolOptions: ToolOption[] = [
  { id: "merge", title: "Merge PDFs", description: "Combine multiple PDF files." },
  { id: "split", title: "Split PDF", description: "Download selected pages as separate PDFs." },
  { id: "extract", title: "Extract pages", description: "Make a new PDF from chosen pages." },
  { id: "delete", title: "Delete pages", description: "Remove unwanted pages from a PDF." },
  { id: "reorder", title: "Reorder pages", description: "Set the exact page sequence you need." },
  { id: "rotate", title: "Rotate pages", description: "Turn selected pages clockwise." },
  { id: "pdfToImage", title: "PDF to JPG / PNG", description: "Convert PDF pages into image files." },
  { id: "imageToPdf", title: "JPG / PNG to PDF", description: "Create a PDF from photos or images." },
  { id: "watermark", title: "Add watermark", description: "Place watermark text on selected pages." },
  { id: "pageNumbers", title: "Add page numbers", description: "Add page numbering at the bottom." },
  { id: "crop", title: "Crop margins", description: "Trim equal margins from every selected page." },
  { id: "optimize", title: "Compress PDF", description: "Reduce file size with optimized page images." },
  { id: "metadata", title: "Edit metadata", description: "Change title, author, subject and keywords." },
  { id: "protect", title: "Protect PDF", description: "Add password and document permissions." },
  { id: "unlock", title: "Unlock PDF", description: "Remove a known password into a visual PDF copy." },
  { id: "word", title: "PDF to Word", description: "Export selectable PDF text as a DOCX file." },
  { id: "excel", title: "PDF to Excel", description: "Export extracted text into an XLSX sheet." },
  { id: "ocr", title: "OCR scanned file", description: "Read text from a scanned PDF, JPG or PNG." },
];

const toolMenus: Array<{ id: ToolMenu; label: string; tools: Tool[] }> = [
  { id: "convert", label: "Convert", tools: ["pdfToImage", "imageToPdf", "word", "excel", "ocr"] },
  { id: "organize", label: "Organize", tools: ["extract", "delete", "reorder", "rotate", "crop"] },
  { id: "edit", label: "Edit PDF", tools: ["watermark", "pageNumbers", "metadata"] },
  { id: "security", label: "Protect", tools: ["protect", "unlock"] },
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

function downloadBlob(blob: Blob, fileName: string) {
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = fileName;
  document.body.appendChild(link);
  link.click();
  link.remove();
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

async function renderPdfPages(
  file: File,
  password = "",
  imageType: "image/png" | "image/jpeg" = "image/png",
  scale = 1.75,
  jpegQuality = 0.92,
) {
  const pdfjs = await loadPdfJs();
  const loadingTask = pdfjs.getDocument({ data: new Uint8Array(await file.arrayBuffer()), password: password || undefined });
  const pdf = await loadingTask.promise;
  const pages: Array<{ blob: Blob; bytes: Uint8Array; width: number; height: number }> = [];

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

async function extractPdfText(file: File, password = "") {
  const pdfjs = await loadPdfJs();
  const loadingTask = pdfjs.getDocument({ data: new Uint8Array(await file.arrayBuffer()), password: password || undefined });
  const pdf = await loadingTask.promise;
  const textPages: string[] = [];
  try {
    for (let number = 1; number <= pdf.numPages; number += 1) {
      const content = await (await pdf.getPage(number)).getTextContent();
      textPages.push(content.items.map((item) => ("str" in item ? item.str : "")).join(" ").replace(/\s+/g, " ").trim());
    }
  } finally {
    await pdf.cleanup();
  }
  return textPages;
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
  const [watermark, setWatermark] = useState("CONFIDENTIAL");
  const [cropMargin, setCropMargin] = useState(18);
  const [metadata, setMetadata] = useState({ title: "", author: "", subject: "", keywords: "" });
  const [password, setPassword] = useState("");
  const [ownerPassword, setOwnerPassword] = useState("");
  const [ocrLanguage, setOcrLanguage] = useState<"eng" | "hin">("eng");
  const [status, setStatus] = useState("");
  const [error, setError] = useState("");
  const [isWorking, setIsWorking] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [draggedFileIndex, setDraggedFileIndex] = useState<number | null>(null);

  const activeDetails = useMemo(() => toolOptions.find((tool) => tool.id === activeTool) ?? toolOptions[0], [activeTool]);
  const isImageInput = activeTool === "imageToPdf";
  const allowsMultiple = activeTool === "merge" || isImageInput || activeTool === "pdfToImage";
  const needsPages = pageTools.has(activeTool);
  const acceptsPdfOrImage = activeTool === "ocr";

  useEffect(() => {
    let cancelled = false;

    Promise.all(files.map(async (file) => {
      try {
        const preview = file.type.startsWith("image/") ? await imageDataUrl(file) : await renderPdfThumbnail(file);
        return [fileKey(file), preview] as const;
      } catch {
        return [fileKey(file), ""] as const;
      }
    })).then((items) => {
      if (!cancelled) setThumbnails(Object.fromEntries(items));
    });

    return () => {
      cancelled = true;
    };
  }, [files]);

  function selectTool(tool: Tool) {
    if (tool === activeTool) return;
    setActiveTool(tool);
    setOpenMenu(null);
    setFiles([]);
    setThumbnails({});
    setDraggedFileIndex(null);
    setError("");
    setStatus("");
  }

  function addFiles(added: File[]) {
    const isValid = (file: File) => {
      if (isImageInput) return ["image/jpeg", "image/png"].includes(file.type);
      if (acceptsPdfOrImage) return file.type === "application/pdf" || ["image/jpeg", "image/png"].includes(file.type) || /\.(pdf|png|jpe?g)$/i.test(file.name);
      return file.type === "application/pdf" || file.name.toLowerCase().endsWith(".pdf");
    };
    const invalid = added.find((file) => !isValid(file));
    if (invalid) {
      setError(isImageInput ? "Please select JPG or PNG images only." : "Please select a valid PDF file.");
    } else if (added.length) {
      setFiles((current) => (allowsMultiple ? [...current, ...added] : [added[0]]));
      setError("");
      setStatus("");
    }
  }

  function handleFiles(event: ChangeEvent<HTMLInputElement>) {
    addFiles(Array.from(event.target.files ?? []));
    event.target.value = "";
  }

  function handleDrop(event: DragEvent<HTMLDivElement>) {
    event.preventDefault();
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

    setIsWorking(true);
    try {
      if (activeTool === "merge") {
        const merged = await PDFDocument.create();
        for (const file of files) {
          const source = await openPdf(file);
          const pages = await merged.copyPages(source, source.getPageIndices());
          pages.forEach((page) => merged.addPage(page));
        }
        downloadPdf(await merged.save({ useObjectStreams: true }), "merged-document.pdf");
        setStatus(`${files.length} PDFs were merged. Your download has started.`);
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
        setStatus("An A4 PDF was created from the images. Your download has started.");
        return;
      }

      const sourceFile = files[0];

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
        setStatus(`${imageCount} images from ${files.length} PDFs are being downloaded as a ZIP file.`);
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
        setStatus("A password-free visual copy is downloading. Searchable text is not preserved in this copy.");
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
          setStatus("PDF text was exported to a Word file. Your download has started.");
        } else {
          const XLSX = await import("xlsx");
          const workbook = XLSX.utils.book_new();
          const sheet = XLSX.utils.aoa_to_sheet([["Page", "Extracted text"], ...textPages.map((text, index) => [index + 1, text])]);
          XLSX.utils.book_append_sheet(workbook, sheet, "PDF text");
          const bytes = XLSX.write(workbook, { bookType: "xlsx", type: "array" });
          downloadBlob(new Blob([bytes], { type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" }), outputName(sourceFile.name, "text", "xlsx"));
          setStatus("PDF text was exported to an Excel file. Your download has started.");
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
          setStatus("OCR text is ready. Your download has started.");
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
        setStatus("Your password-protected PDF is ready to download.");
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
        setStatus(`Compressed from ${formatBytes(sourceFile.size)} to ${formatBytes(compressedBytes.byteLength)} (${profile.label}). Your download has started.`);
        return;
      }

      const sourcePdf = await openPdf(sourceFile);
      const pageIndexes = parsePageSelection(pageSelection, sourcePdf.getPageCount(), activeTool === "reorder");

      if (activeTool === "split") {
        const zip = new JSZip();
        for (const pageIndex of pageIndexes) {
          const singlePagePdf = await selectedCopy(sourcePdf, [pageIndex]);
          zip.file(`page-${pageIndex + 1}.pdf`, await singlePagePdf.save({ useObjectStreams: true }));
        }
        downloadBlob(await zip.generateAsync({ type: "blob" }), outputName(sourceFile.name, "split", "zip"));
        setStatus(`${pageIndexes.length} separate PDFs are being downloaded as a ZIP file.`);
        return;
      }

      if (activeTool === "extract" || activeTool === "reorder") {
        const result = await selectedCopy(sourcePdf, pageIndexes);
        downloadPdf(await result.save({ useObjectStreams: true }), outputName(sourceFile.name, activeTool === "extract" ? "selected-pages" : "reordered"));
        setStatus(activeTool === "extract" ? "The PDF with the selected pages is ready." : "The page order was updated. Your download has started.");
        return;
      }

      if (activeTool === "delete") {
        const deleted = new Set(pageIndexes);
        const remaining = sourcePdf.getPageIndices().filter((index) => !deleted.has(index));
        if (!remaining.length) throw new Error("You cannot delete every page. Keep at least one page.");
        const result = await selectedCopy(sourcePdf, remaining);
        downloadPdf(await result.save({ useObjectStreams: true }), outputName(sourceFile.name, "pages-removed"));
        setStatus("The selected pages were removed. Your download has started.");
        return;
      }

      if (activeTool === "rotate") {
        pageIndexes.forEach((index) => {
          const page = sourcePdf.getPage(index);
          page.setRotation(degrees((page.getRotation().angle + rotation) % 360));
        });
        downloadPdf(await sourcePdf.save({ useObjectStreams: true }), outputName(sourceFile.name, "rotated"));
        setStatus("The selected pages were rotated. Your download has started.");
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
        setStatus("The watermark was added. Your download has started.");
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
        setStatus("Page numbers were added. Your download has started.");
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
        setStatus("The margins were cropped. Your download has started.");
        return;
      }

      if (activeTool === "metadata") {
        if (metadata.title) sourcePdf.setTitle(metadata.title);
        if (metadata.author) sourcePdf.setAuthor(metadata.author);
        if (metadata.subject) sourcePdf.setSubject(metadata.subject);
        if (metadata.keywords) sourcePdf.setKeywords(metadata.keywords.split(",").map((keyword) => keyword.trim()).filter(Boolean));
        downloadPdf(await sourcePdf.save({ useObjectStreams: true }), outputName(sourceFile.name, "metadata"));
        setStatus("The PDF metadata was updated. Your download has started.");
        return;
      }

      downloadPdf(await sourcePdf.save({ useObjectStreams: true }), outputName(sourceFile.name, "optimized"));
      setStatus("The PDF was optimized. The final size depends on its content.");
    } catch (caughtError) {
      const message = caughtError instanceof Error ? caughtError.message : "The PDF could not be processed.";
      setError(message.toLowerCase().includes("password") || message.toLowerCase().includes("encrypted") ? "Use the correct password for this protected PDF." : message);
    } finally {
      setIsWorking(false);
    }
  }

  const accept = isImageInput ? "image/jpeg,image/png,.jpg,.jpeg,.png" : acceptsPdfOrImage ? "application/pdf,image/jpeg,image/png,.pdf,.jpg,.jpeg,.png" : "application/pdf,.pdf";
  const uploadLabel = isImageInput ? "Choose JPG or PNG images" : acceptsPdfOrImage ? "Choose a PDF, JPG, or PNG file" : activeTool === "merge" ? "Choose PDF files" : "Choose a PDF file";

  return (
    <main className="min-h-screen bg-slate-50 text-slate-900">
      <header className="border-b border-slate-200 bg-white">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-5 py-4 sm:px-8">
          <div className="flex items-center gap-5"><LanguageSelector variant="light" /><Link href="/" className="inline-flex items-center gap-2 text-2xl font-bold tracking-tight sm:text-3xl"><Image src="/docsprinthub-logo.png" alt="DocSprintHub logo" width={38} height={38} className="h-9 w-9 object-contain" priority />DocSprint<span className="text-blue-600">Hub</span></Link></div>
          <Link href="/resume-builder" className="rounded-xl bg-blue-600 px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-blue-700 sm:px-5">Resume Builder</Link>
        </div>
      </header>

      <section className="border-b border-blue-100 bg-gradient-to-b from-blue-50 to-slate-50 px-5 py-7 text-center sm:px-4 sm:py-4">
        <p className="text-sm font-bold uppercase tracking-[0.2em] text-blue-700">DocSprintHub</p>
        <h1 className="mt-2 text-4xl font-bold tracking-tight text-slate-950 sm:text-5xl">PDF Tools</h1>
        <p className="mx-auto mt-3 max-w-3xl font-semibold text-base leading-7 text-slate-600 sm:text-lg">Merge, Convert, Organize, Protect & Edit PDF files Directly in Your Browser.</p>
      </section>

      <nav aria-label="PDF tool menu" className="border-b border-slate-200 bg-white shadow-sm">
        <div className="mx-auto max-w-7xl px-5 py-4 sm:px-8">
          <div className="flex flex-wrap gap-2" role="tablist" aria-label="Quick PDF tools">
            {(["merge", "split", "optimize"] as Tool[]).map((toolId) => {
              const tool = toolOptions.find((option) => option.id === toolId);
              if (!tool) return null;
              return <button key={tool.id} type="button" role="tab" aria-selected={activeTool === tool.id} onClick={() => selectTool(tool.id)} className={`rounded-lg px-4 py-2.5 text-sm font-bold transition ${activeTool === tool.id ? "bg-blue-600 text-white shadow-sm" : "bg-blue-50 text-blue-800 hover:bg-blue-100"}`}>{tool.title}</button>;
            })}
            {toolMenus.map((menu) => (
              <div key={menu.id} className="relative">
                <button type="button" aria-haspopup="menu" aria-expanded={openMenu === menu.id} onClick={() => setOpenMenu((current) => current === menu.id ? null : menu.id)} className={`rounded-lg px-4 py-2.5 text-sm font-bold transition ${openMenu === menu.id ? "bg-slate-800 text-white shadow-sm" : "bg-slate-100 text-slate-700 hover:bg-blue-50 hover:text-blue-700"}`}>
                  {menu.label} {openMenu === menu.id ? "▲" : "▼"}
                </button>
                {openMenu === menu.id && <div role="menu" aria-label={`${menu.label} tools`} className="absolute left-0 top-full z-20 mt-2 min-w-56 rounded-xl border border-slate-200 bg-white p-2 shadow-xl">
                  {menu.tools.map((toolId) => {
                    const tool = toolOptions.find((option) => option.id === toolId);
                    if (!tool) return null;
                    return <button key={tool.id} type="button" role="menuitem" onClick={() => selectTool(tool.id)} className={`block w-full rounded-lg px-3 py-2.5 text-left text-sm font-semibold transition ${activeTool === tool.id ? "bg-blue-50 text-blue-800" : "text-slate-700 hover:bg-slate-100 hover:text-slate-950"}`}>{tool.title}</button>;
                  })}
                </div>}
              </div>
            ))}
          </div>
        </div>
      </nav>

      <section className="mx-auto max-w-7xl px-5 py-7 sm:px-8 sm:py-9">

        <section className="min-w-0 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-8">
          <h2 className="text-2xl font-bold text-slate-950">{activeDetails.title}</h2>
          <p className="mt-2 text-slate-600">{activeDetails.description}</p>

          <div
            onDragEnter={(event) => { event.preventDefault(); if (Array.from(event.dataTransfer.types).includes("Files")) setIsDragging(true); }}
            onDragOver={(event) => event.preventDefault()}
            onDragLeave={(event) => { if (event.currentTarget === event.target) setIsDragging(false); }}
            onDrop={handleDrop}
            className={`relative mt-7 rounded-2xl border-2 border-dashed transition ${isDragging ? "border-blue-600 bg-blue-100 ring-2 ring-blue-200" : "border-blue-200 bg-blue-50/70"}`}
          >
            {files.length === 0 ? (
              <div className="flex flex-col items-center justify-center px-5 py-9 text-center">
                <span className="text-lg font-bold text-slate-900">{isDragging ? "Drop files here" : uploadLabel}</span>
                <span className="mt-2 text-sm text-slate-600">{isDragging ? "Files will be added as soon as you drop them." : allowsMultiple ? "Drag and drop files, or use the select button. Multiple files are allowed." : "Drag and drop a file, or use the select button. A new file will replace the previous one."}</span>
                <label className="mt-4 cursor-pointer rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-blue-700">Select files<input className="sr-only" type="file" accept={accept} multiple={allowsMultiple} onChange={handleFiles} /></label>
              </div>
            ) : (
              <div className="p-4 sm:p-5">
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <div><h3 className="font-bold text-slate-900">Selected {files.length === 1 ? "file" : "files"}</h3><p className="mt-1 text-xs text-slate-600">Preview files here, or add more files.</p></div>
                  <div className="flex items-center gap-3"><label className="cursor-pointer rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-blue-700">Add files<input className="sr-only" type="file" accept={accept} multiple={allowsMultiple} onChange={handleFiles} /></label><button type="button" onClick={() => setFiles([])} className="text-sm font-semibold text-blue-700 hover:text-blue-900">Clear all</button></div>
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
                          if (!allowsMultiple) return;
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
                            <button type="button" onClick={() => setFiles((current) => current.filter((_, fileIndex) => fileIndex !== index))} className="rounded-md px-2 py-1 text-xs font-bold text-slate-600 hover:bg-red-50 hover:text-red-700">Remove</button>
                          </div>
                        </div>
                      </article>
                    );
                  })}
                </div>
                <p className="mt-4 text-center text-xs text-slate-500">{allowsMultiple ? "Drag cards with your mouse to set the merge order. You can also add new files by dragging them into this area." : "You can replace the file by dragging and dropping a new one into this area."}</p>
              </div>
            )}
            {isDragging && files.length > 0 && <div className="pointer-events-none absolute inset-0 z-10 flex items-center justify-center rounded-2xl bg-blue-100/95 text-center text-lg font-bold text-blue-800">Drop files here</div>}
          </div>

          {needsPages && <label className="mt-6 block"><span className="text-sm font-bold text-slate-800">{activeTool === "delete" ? "Pages to delete" : activeTool === "reorder" ? "New page order" : "Pages to process"}</span><input value={pageSelection} onChange={(event) => setPageSelection(event.target.value)} placeholder={activeTool === "reorder" ? "e.g. 3, 1, 2" : "All pages (or e.g. 1, 3-5)"} className="mt-2 w-full rounded-xl border border-slate-300 px-4 py-3 text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-blue-600 focus:ring-2 focus:ring-blue-100" /><span className="mt-2 block text-xs text-slate-500">Leave blank to select all pages.</span></label>}

          {activeTool === "rotate" && <label className="mt-5 block"><span className="text-sm font-bold text-slate-800">Rotate clockwise</span><select value={rotation} onChange={(event) => setRotation(Number(event.target.value))} className="mt-2 w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-slate-900 outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-100"><option value={90}>90 degrees</option><option value={180}>180 degrees</option><option value={270}>270 degrees</option></select></label>}
          {activeTool === "pdfToImage" && <label className="mt-5 block"><span className="text-sm font-bold text-slate-800">Image format</span><select value={imageFormat} onChange={(event) => setImageFormat(event.target.value as "png" | "jpg")} className="mt-2 w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-slate-900 outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-100"><option value="png">PNG (best quality)</option><option value="jpg">JPG (smaller files)</option></select></label>}
          {activeTool === "watermark" && <label className="mt-5 block"><span className="text-sm font-bold text-slate-800">Watermark text</span><input value={watermark} onChange={(event) => setWatermark(event.target.value)} className="mt-2 w-full rounded-xl border border-slate-300 px-4 py-3 text-slate-900 outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-100" /></label>}
          {activeTool === "crop" && <label className="mt-5 block"><span className="text-sm font-bold text-slate-800">Equal margin to crop (PDF points)</span><input type="number" min="0" value={cropMargin} onChange={(event) => setCropMargin(Number(event.target.value))} className="mt-2 w-full rounded-xl border border-slate-300 px-4 py-3 text-slate-900 outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-100" /></label>}
          {activeTool === "metadata" && <div className="mt-5 grid gap-4 sm:grid-cols-2">{(["title", "author", "subject", "keywords"] as const).map((field) => <label key={field} className="block"><span className="text-sm font-bold capitalize text-slate-800">{field}</span><input value={metadata[field]} onChange={(event) => setMetadata((current) => ({ ...current, [field]: event.target.value }))} placeholder={field === "keywords" ? "resume, job, profile" : `PDF ${field}`} className="mt-2 w-full rounded-xl border border-slate-300 px-4 py-3 text-slate-900 outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-100" /></label>)}</div>}
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

          {error && <p role="alert" className="mt-5 rounded-xl bg-red-50 p-4 text-sm font-medium text-red-800">{error}</p>}
          {status && <p role="status" className="mt-5 rounded-xl bg-emerald-50 p-4 text-sm font-medium text-emerald-800">{status}</p>}
          <button type="button" onClick={runTool} disabled={isWorking} className="mt-7 w-full rounded-xl bg-blue-600 px-5 py-3.5 font-bold text-white shadow-sm transition hover:bg-blue-700 disabled:cursor-wait disabled:bg-blue-400">{isWorking ? "Processing..." : `${activeDetails.title} and download`}</button>
          <p className="mt-4 text-center text-xs leading-5 text-slate-500">Files are processed locally in your browser. The OCR language pack may download on first use.</p>
        </section>
      </section>
    </main>
  );
}
