import { toJpeg } from "html-to-image";
import JSZip from "jszip";
import { saveAs } from "file-saver";

type DownloadImageOptions = {
  filename?: string;
  beforeDownload?: () => void;
  afterDownload?: () => void;
};

async function capturePage(page: HTMLElement): Promise<Blob> {
  await document.fonts.ready;

  // Allow the browser to finish one render frame.
  await new Promise<void>((resolve) =>
    requestAnimationFrame(() => resolve())
  );

  const dataUrl = await toJpeg(page, {
    quality: 1,
    pixelRatio: 2,
    cacheBust: true,
    backgroundColor: "#ffffff",

    style: {
      margin: "0",
      padding: "0",
      transform: "none",
      zoom: "1",
      overflow: "hidden",
    },
  });

  const response = await fetch(dataUrl);

  return await response.blob();
}

export async function downloadResumeImage({
  filename = "Resume",
  beforeDownload,
  afterDownload,
}: DownloadImageOptions = {}) {
  beforeDownload?.();

  try {
    const pages = Array.from(
      document.querySelectorAll(".document-page")
    ) as HTMLElement[];

    if (!pages.length) {
      throw new Error("No resume pages found.");
    }

    // ------------------------
    // Single Page
    // ------------------------

    if (pages.length === 1) {
      const blob = await capturePage(pages[0]);

      saveAs(blob, `${filename}.jpg`);

      return;
    }

    // ------------------------
    // Multiple Pages
    // ------------------------

    const zip = new JSZip();

    for (let i = 0; i < pages.length; i++) {
      const blob = await capturePage(pages[i]);

      zip.file(
        `${filename}-Page-${i + 1}.jpg`,
        blob
      );
    }

    const zipBlob = await zip.generateAsync({
      type: "blob",
    });

    saveAs(zipBlob, `${filename}-Images.zip`);
  } catch (err) {
    console.error(err);

    alert("Unable to export image.");
  } finally {
    afterDownload?.();
  }
}
