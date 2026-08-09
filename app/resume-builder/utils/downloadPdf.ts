"use client";

import { toPng } from "html-to-image";
import jsPDF from "jspdf";
import { trackDownload } from "@/app/lib/analytics/client";

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

async function captureA4Page(page: HTMLElement): Promise<string> {
  await waitForRender();

  if (!page.offsetWidth || !page.offsetHeight) {
    throw new Error("Resume page has no visible size.");
  }

  // Capture the exact element shown in the preview. This intentionally uses
  // the same renderer as the working image export, avoiding an off-screen
  // clone whose layout can differ from the visible A4 page.
  return toPng(page, {
    pixelRatio: CAPTURE_SCALE,
    cacheBust: true,
    backgroundColor: "#ffffff",
    style: {
      margin: "0",
      padding: "0",
      transform: "none",
      overflow: "hidden",
    },
  });
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
      const image = await captureA4Page(page);

      if (index > 0) {
        pdf.addPage("a4", "portrait");
      }

      // Each resume preview is already a fixed A4 page.  Placing the capture
      // at exactly 210 x 297 mm prevents long pages from being scaled beyond
      // the printable area or creating an incorrectly sized PDF page.
      pdf.addImage(
        image,
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
    trackDownload("/resume-builder", "resume_builder", "pdf");
  } finally {
    afterDownload?.();
  }
}
