"use client";

import type { ChangeEvent, RefObject } from "react";
import { useRef, useState } from "react";
import { toJpeg, toPng } from "html-to-image";
import jsPDF from "jspdf";
import { trackDownload } from "@/app/lib/analytics/client";

export type TemplateMode = "academic" | "modern" | "minimal";

interface UseCoverPageState {
  template: TemplateMode;
  selectedTemplateId: string;
  title: string;
  subtitle: string;
  topic: string;
  course: string;
  author: string;
  rollNumber: string;
  guide: string;
  institute: string;
  session: string;
  logo: File | null;
  logoUrl: string;
  isExporting: boolean;
  error: string;
  pageRef: RefObject<HTMLDivElement | null>;
}

interface UseCoverPageActions {
  setTemplate: (value: TemplateMode) => void;
  setTitle: (value: string) => void;
  setSubtitle: (value: string) => void;
  setTopic: (value: string) => void;
  setCourse: (value: string) => void;
  setAuthor: (value: string) => void;
  setRollNumber: (value: string) => void;
  setGuide: (value: string) => void;
  setInstitute: (value: string) => void;
  setSession: (value: string) => void;
  uploadLogo: (event: ChangeEvent<HTMLInputElement>) => void;
  exportFile: (format: "pdf" | "jpg") => Promise<void>;
  handleSelectGalleryTemplate: (id: string) => void;
  reset: () => void;
}

export default function useCoverPage(initialTemplateId = ""): UseCoverPageState & UseCoverPageActions {
  const [template, setTemplate] = useState<TemplateMode>("academic");
  const [selectedTemplateId, setSelectedTemplateId] = useState(initialTemplateId);
  const [title, setTitle] = useState("PROJECT REPORT");
  const [subtitle, setSubtitle] = useState("ON");
  const [topic, setTopic] = useState("Your Project Title Here");
  const [course, setCourse] = useState("Bachelor of Computer Applications");
  const [author, setAuthor] = useState("Your Name");
  const [rollNumber, setRollNumber] = useState("Roll No. 0000");
  const [guide, setGuide] = useState("Guide / Faculty Name");
  const [institute, setInstitute] = useState("Your College or Institute Name");
  const [session, setSession] = useState("Academic Session 2026–27");
  const [logo, setLogo] = useState<File | null>(null);
  const [logoUrl, setLogoUrl] = useState("");
  const [isExporting, setIsExporting] = useState(false);
  const [error, setError] = useState("");
  const pageRef = useRef<HTMLDivElement | null>(null);

  function uploadLogo(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0] ?? null;
    if (file && !["image/png", "image/jpeg"].includes(file.type)) {
      setError("Please select a PNG or JPG logo.");
      return;
    }

    if (file) {
      const reader = new FileReader();
      reader.onload = () => setLogoUrl(typeof reader.result === "string" ? reader.result : "");
      reader.readAsDataURL(file);
      setLogo(file);
      setError("");
    } else {
      setLogo(null);
      setLogoUrl("");
    }

    event.target.value = "";
  }

  async function waitForRender() {
    await document.fonts.ready;
    await new Promise<void>((resolve) => requestAnimationFrame(() => resolve()));
    await new Promise<void>((resolve) => requestAnimationFrame(() => resolve()));
  }

  async function captureA4(element: HTMLElement, format: "jpeg" | "png") {
    await waitForRender();

    if (!element.offsetWidth || !element.offsetHeight) {
      throw new Error("Cover page has no visible size.");
    }

    const options = {
      pixelRatio: 2,
      cacheBust: true,
      backgroundColor: "#ffffff",
      style: {
        margin: "0",
        padding: "0",
        transform: "none",
        overflow: "hidden",
      },
    };

    // Export the visible A4 element directly so PDF, JPG, and print keep the
    // same layout instead of reflowing an off-screen cloned page.
    return format === "jpeg"
      ? toJpeg(element, { ...options, quality: 0.95 })
      : toPng(element, options);
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

  async function exportFile(format: "pdf" | "jpg") {
    if (!pageRef.current) return;
    setIsExporting(true);
    setError("");

    try {
      if (format === "jpg") {
        const image = await captureA4(pageRef.current, "jpeg");
        const blob = await fetch(image).then((response) => response.blob());
        downloadBlob(blob, "cover-page-a4.jpg");
      } else {
        const image = await captureA4(pageRef.current, "png");
        const pdf = new jsPDF({ orientation: "portrait", unit: "mm", format: "a4", compress: true });
        pdf.addImage(image, "PNG", 0, 0, 210, 297, undefined, "FAST");
        pdf.setProperties({ title: title || "Cover Page", author: "DocSprintHub", subject: "A4 Cover Page" });
        pdf.save("cover-page-a4.pdf");
      }
      trackDownload("/cover-page-generator", "cover_page_generator", format, selectedTemplateId || undefined);
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : "The file could not be exported.");
    } finally {
      setIsExporting(false);
    }
  }

  function resolveTemplateTypeFromId(id: string): TemplateMode {
    if (/minimal|editorial|clean|white|soft|luxury|elegant|simple/i.test(id)) {
      return "minimal";
    }
    if (/modern|studio|creative|tech|business|professional|premium|magazine|portfolio|glass|dark|gradient|cyber|ai|digital|innovation/i.test(id)) {
      return "modern";
    }
    return "academic";
  }

  function handleSelectGalleryTemplate(id: string) {
    setSelectedTemplateId(id);
    setTemplate(resolveTemplateTypeFromId(id));
    window.requestAnimationFrame(() => {
      document.getElementById("cover-page-editor")?.scrollIntoView({ behavior: "smooth", block: "start" });
    });
  }

  function reset() {
    setTemplate("academic");
    setSelectedTemplateId(initialTemplateId);
    setTitle("PROJECT REPORT");
    setSubtitle("ON");
    setTopic("Your Project Title Here");
    setCourse("Bachelor of Computer Applications");
    setAuthor("Your Name");
    setRollNumber("Roll No. 0000");
    setGuide("Guide / Faculty Name");
    setInstitute("Your College or Institute Name");
    setSession("Academic Session 2026–27");
    setLogo(null);
    setLogoUrl("");
    setError("");
  }

  return {
    template,
    selectedTemplateId,
    title,
    subtitle,
    topic,
    course,
    author,
    rollNumber,
    guide,
    institute,
    session,
    logo,
    logoUrl,
    isExporting,
    error,
    pageRef,
    setTemplate,
    setTitle,
    setSubtitle,
    setTopic,
    setCourse,
    setAuthor,
    setRollNumber,
    setGuide,
    setInstitute,
    setSession,
    uploadLogo,
    exportFile,
    handleSelectGalleryTemplate,
    reset,
  };
}
