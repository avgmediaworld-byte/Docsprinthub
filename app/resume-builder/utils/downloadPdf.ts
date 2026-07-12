"use client";

import html2canvas from "html2canvas";
import jsPDF from "jspdf";

type DownloadPDFOptions = {
  filename?: string;
  beforeDownload?: () => void;
  afterDownload?: () => void;
};

const PDF_WIDTH = 210;
const PDF_HEIGHT = 297;


const PDF_OPTIONS = {
  margin: [5, 5, 5, 5],

  filename: "Resume.pdf",

  image: {
    type: "jpeg",
    quality: 1,
  },

  html2canvas: {
    scale: 2,
    useCORS: true,
    backgroundColor: "#ffffff",
    logging: false,
    allowTaint: true,
    imageTimeout: 0,
    scrollX: 0,
    scrollY: 0,
  },

  jsPDF: {
    unit: "mm",
    format: "a4",
    orientation: "portrait",
    compress: true,
  },

  pagebreak: {
    mode: ["css", "legacy"],
    avoid: [".avoid-break"],
  },
};

async function waitForRender() {
  await document.fonts.ready;

  await new Promise<void>((resolve) =>
    requestAnimationFrame(() => resolve())
  );

  await new Promise<void>((resolve) =>
    requestAnimationFrame(() => resolve())
  );
}

  function getPages(): HTMLElement[] {
    return Array.from(
      document.querySelectorAll(".document-page")
    ) as HTMLElement[];
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
});

for (let i = 0; i < pages.length; i++) {
  const page = pages[i];

  console.log(`Rendering Page ${i + 1}`);

const canvas = await html2canvas(page, {
  scale: window.devicePixelRatio > 1 ? 2 : 3,
  useCORS: true,
  allowTaint: true,
  backgroundColor: "#ffffff",
  logging: false,
  scrollX: 0,
  scrollY: 0,
  windowWidth: page.scrollWidth,
  windowHeight: page.scrollHeight,
});

  console.log(
    `Canvas ${i + 1}:`,
    canvas.width,
    canvas.height
  );

  const imgData = canvas.toDataURL("image/png");

    const imgWidth = PDF_WIDTH;

    const imgHeight =
      (canvas.height * imgWidth) / canvas.width;

    if (i > 0) {
      pdf.addPage();
    }

    pdf.addImage(
      imgData,
      "PNG",
      0,
      0,
      imgWidth,
      imgHeight,
      undefined,
      "FAST"
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