"use client";

import html2canvas from "html2canvas";
import jsPDF from "jspdf";

type DownloadPDFOptions = {
  filename?: string;
  beforeDownload?: () => void;
  afterDownload?: () => void;
};

const A4_WIDTH_MM = 210;
const A4_HEIGHT_MM = 297;
const CAPTURE_SCALE = 2;

async function waitForRender() {
  await document.fonts.ready;

  await new Promise<void>((resolve) =>
    requestAnimationFrame(() => resolve()),
  );

  await new Promise<void>((resolve) =>
    requestAnimationFrame(() => resolve()),
  );
}

function getPages(): HTMLElement[] {
  return Array.from(
    document.querySelectorAll(".document-page"),
  ) as HTMLElement[];
}

async function captureA4Page(page: HTMLElement): Promise<HTMLCanvasElement> {
  const exportSurface = document.createElement("div");
  const pageClone = page.cloneNode(true) as HTMLElement;

  // html2canvas recreates the original flex container. On a narrow preview it
  // can shrink the cloned page while retaining a larger canvas, which leaves a
  // blank strip on the right and shifts content vertically. Capture an
  // independent, fixed-size copy instead.
  exportSurface.style.cssText = [
    "position: fixed",
    "left: -100000px",
    "top: 0",
    "width: 210mm",
    "height: 297mm",
    "overflow: hidden",
    "pointer-events: none",
  ].join(";");

  pageClone.style.width = "210mm";
  pageClone.style.minWidth = "210mm";
  pageClone.style.maxWidth = "210mm";
  pageClone.style.height = "297mm";
  pageClone.style.minHeight = "297mm";
  pageClone.style.maxHeight = "297mm";
  pageClone.style.flex = "0 0 210mm";
  pageClone.style.flexShrink = "0";
  pageClone.style.margin = "0";

  exportSurface.append(pageClone);
  document.body.append(exportSurface);

  try {
    await waitForRender();

    const width = pageClone.offsetWidth;
    const height = pageClone.offsetHeight;

    if (!width || !height) {
      throw new Error("Resume page has no visible size.");
    }

    return await html2canvas(pageClone, {
      scale: CAPTURE_SCALE,
      width,
      height,
      windowWidth: width,
      windowHeight: height,
      useCORS: true,
      allowTaint: true,
      backgroundColor: "#ffffff",
      logging: false,
      scrollX: 0,
      scrollY: 0,
    });
  } finally {
    exportSurface.remove();
  }
}

export async function downloadResumePDF({
  filename = "Resume.pdf",
  beforeDownload,
  afterDownload,
}: DownloadPDFOptions = {}) {
  beforeDownload?.();

  try {
    await waitForRender();

    const pages = getPages();
    if (!pages.length) {
      throw new Error("No resume pages found.");
    }

    const pdf = new jsPDF({
      orientation: "portrait",
      unit: "mm",
      format: "a4",
      compress: true,
    });

    for (const [index, page] of pages.entries()) {
      const canvas = await captureA4Page(page);

      if (index > 0) {
        pdf.addPage("a4", "portrait");
      }

      // Each resume preview is already a fixed A4 page.  Placing the capture
      // at exactly 210 x 297 mm prevents long pages from being scaled beyond
      // the printable area or creating an incorrectly sized PDF page.
      pdf.addImage(
        canvas.toDataURL("image/png"),
        "PNG",
        0,
        0,
        A4_WIDTH_MM,
        A4_HEIGHT_MM,
        undefined,
        "FAST",
      );
    }

    pdf.setProperties({
      title: filename,
      subject: "Resume",
      author: "DocSprintHub",
      creator: "DocSprintHub Resume Builder",
    });

    pdf.save(filename);
  } finally {
    afterDownload?.();
  }
}
