"use client";

import { useEffect, useRef, useState, type CSSProperties } from "react";
import type { TemplateRegistryItem } from "../data/templateList";
import type { AcademicTemplateData } from "../templates/academic/AcademicFrame";
import AcademicTemplatePreview, { isAcademicTemplate } from "../templates/academic/AcademicTemplatePreview";

interface CoverThumbnailProps {
  template: TemplateRegistryItem;
}

type ThumbnailStyle = "ribbon" | "organic" | "editorial" | "midnight" | "paper";

const CATEGORY_LABELS: Record<TemplateRegistryItem["category"], string> = {
  academic: "ACADEMIC SERIES",
  corporate: "BUSINESS REPORT",
  school: "SCHOOL PROJECT",
  technology: "DIGITAL EDITION",
  creative: "CREATIVE STUDIO",
  minimal: "MINIMAL EDITION",
  premium: "PREMIUM COLLECTION",
  gradient: "GRADIENT EDITION",
  glass: "GLASS EDITION",
  dark: "DARK EDITION",
  magazine: "EDITORIAL EDITION",
};

const contentLayer: CSSProperties = { position: "relative", zIndex: 2 };
const eyebrowStyle: CSSProperties = { fontSize: "clamp(8px, 0.75vw, 12px)" };
const titleStyle: CSSProperties = { fontSize: "clamp(25px, 3vw, 46px)" };
const copyStyle: CSSProperties = { fontSize: "clamp(8px, 0.82vw, 13px)" };
const A4_WIDTH = 794;
const A4_HEIGHT = 1123;
const THUMBNAIL_DATA: AcademicTemplateData = {
  institute: "DocSprintHub University",
  title: "PROJECT REPORT",
  subtitle: "ON",
  topic: "Artificial Intelligence Based System",
  course: "Bachelor of Computer Applications",
  author: "Student Name",
  rollNumber: "BCA-2026-001",
  guide: "Dr. A. Sharma",
  session: "Academic Session 2026–27",
  logoUrl: "",
};

function hash(value: string) {
  return Array.from(value).reduce((total, character) => total + character.charCodeAt(0), 0);
}

function getStyle(template: TemplateRegistryItem): ThumbnailStyle {
  const variants: ThumbnailStyle[] = ["ribbon", "organic", "editorial", "midnight", "paper"];
  return variants[hash(template.id) % variants.length];
}

function labelFor(template: TemplateRegistryItem) {
  return template.name.replace(/\s+(cover|template|page)$/i, "").toUpperCase();
}

function LiveA4Thumbnail({ templateId }: { templateId: string }) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [scale, setScale] = useState(0.3);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const updateScale = () => {
      const { width } = container.getBoundingClientRect();
      setScale(Math.max(width / A4_WIDTH, 0.01));
    };

    updateScale();
    const observer = new ResizeObserver(updateScale);
    observer.observe(container);
    return () => observer.disconnect();
  }, []);

  return (
    <div ref={containerRef} className="h-full w-full overflow-hidden bg-white">
      <div style={{ height: A4_HEIGHT, transform: `scale(${scale})`, transformOrigin: "top left", width: A4_WIDTH }}>
        <AcademicTemplatePreview templateId={templateId} data={THUMBNAIL_DATA} thumbnail />
      </div>
    </div>
  );
}

function OrganicThumbnail({ eyebrow, label }: { eyebrow: string; label: string }) {
  return (
    <div className="relative h-full overflow-hidden bg-[#fffafd] px-[11%] py-[13%] text-center text-slate-950">
      <div className="absolute -left-[18%] -top-[12%] h-[42%] w-[66%] rounded-[48%] bg-pink-200" />
      <div className="absolute right-[-25%] top-[-8%] h-[34%] w-[72%] rounded-[46%] bg-fuchsia-200" />
      <div className="absolute -bottom-[12%] left-[-19%] h-[34%] w-[71%] rounded-[50%] bg-pink-200" />
      <div className="absolute -bottom-[7%] right-[-24%] h-[41%] w-[64%] rounded-[47%] bg-rose-200" />
      <p style={{ ...contentLayer, ...eyebrowStyle }} className="mt-[21%] font-bold tracking-[0.05em]">{eyebrow}</p>
      <h3 style={{ ...contentLayer, ...titleStyle }} className="mt-[15%] font-serif font-black leading-[0.88] tracking-[-0.06em]">{label}</h3>
      <div style={{ ...contentLayer, ...copyStyle }} className="mx-auto mt-[16%] border-y-2 border-pink-300 px-2 py-2 font-bold tracking-[0.08em] text-pink-500">PROJECT PORTFOLIO</div>
      <p style={{ ...contentLayer, ...copyStyle }} className="mt-[15%] font-semibold leading-tight">Prepared by<br />DocSprintHub</p>
    </div>
  );
}

function EditorialThumbnail({ label }: { label: string }) {
  return (
    <div className="relative h-full overflow-hidden bg-[#f8f7f5] px-[12%] py-[11%] text-zinc-900">
      <p style={{ ...contentLayer, fontSize: "clamp(7px, 0.65vw, 10px)" }} className="ml-auto w-[40%] text-center font-black leading-[0.9] tracking-[-0.05em]">DESIGN<br />STUDIO<br />EDITION</p>
      <div className="absolute left-[8%] top-[45%] h-px w-[84%] bg-zinc-300" />
      <h3 style={{ ...contentLayer, fontSize: "clamp(28px, 3.6vw, 54px)" }} className="mt-[43%] text-center font-sans font-black leading-none tracking-[-0.08em]">{label}</h3>
      <div style={{ fontSize: "clamp(7px, 0.62vw, 10px)" }} className="absolute bottom-[12%] left-[12%] font-bold leading-[1.1] tracking-[0.08em]">DOCUMENT<br />DESIGN<br />2026</div>
      <div style={{ fontSize: "clamp(7px, 0.62vw, 10px)" }} className="absolute bottom-[12%] right-[12%] text-right font-bold leading-[1.1] tracking-[0.08em]">A4<br />PRINT<br />READY</div>
    </div>
  );
}

function MidnightThumbnail({ eyebrow, label }: { eyebrow: string; label: string }) {
  return (
    <div className="relative h-full overflow-hidden bg-slate-950 px-[11%] py-[12%] text-white">
      <div className="absolute -right-[21%] -top-[8%] h-[49%] w-[78%] rounded-full border-[18px] border-cyan-300/30" />
      <div className="absolute bottom-[-12%] left-[-23%] h-[46%] w-[88%] rounded-full bg-indigo-600/80 blur-[1px]" />
      <p style={{ ...contentLayer, ...eyebrowStyle }} className="font-bold tracking-[0.22em] text-cyan-200">{eyebrow}</p>
      <h3 style={{ ...contentLayer, ...titleStyle }} className="mt-[35%] font-black leading-[0.92] tracking-[-0.07em]">{label}</h3>
      <p style={{ ...contentLayer, ...copyStyle }} className="mt-[10%] w-[72%] font-medium leading-tight text-slate-300">A clean, confident cover for your next important submission.</p>
      <div style={{ ...contentLayer, fontSize: "clamp(7px, 0.7vw, 11px)" }} className="absolute bottom-[12%] left-[11%] right-[11%] border-t border-white/30 pt-3 font-bold tracking-[0.14em] text-cyan-100">DOCSPRINTHUB · 2026</div>
    </div>
  );
}

function PaperThumbnail({ label }: { label: string }) {
  return (
    <div className="relative h-full overflow-hidden bg-[#fffefa] px-[11%] py-[12%] text-[#23405d]">
      <div className="absolute -left-[27%] -top-[16%] h-[40%] w-[104%] rotate-[-20deg] border-b-[16px] border-[#0c72b8]" />
      <div className="absolute -right-[24%] bottom-[-15%] h-[44%] w-[106%] rotate-[-20deg] border-t-[18px] border-[#10397a]" />
      <div className="absolute -left-[10%] top-[2%] h-[23%] w-[84%] rotate-[-20deg] border-b-2 border-sky-300/80" />
      <p style={{ ...contentLayer, ...eyebrowStyle }} className="mt-[34%] text-center font-semibold tracking-[0.18em]">2026 — 2027</p>
      <h3 style={{ ...contentLayer, fontSize: "clamp(26px, 3.4vw, 50px)" }} className="mt-[15%] text-center font-serif font-bold leading-none tracking-[-0.05em]">{label}</h3>
      <div style={{ ...contentLayer, ...copyStyle }} className="mx-auto mt-[13%] w-fit rounded-full border-2 border-sky-400 px-3 py-1 font-semibold">DocSprintHub</div>
    </div>
  );
}

function RibbonThumbnail({ eyebrow, label }: { eyebrow: string; label: string }) {
  return (
    <div className="relative h-full overflow-hidden bg-white px-[11%] py-[12%] text-[#15486c]">
      <div className="absolute -left-[34%] -top-[19%] h-[45%] w-[112%] rotate-[-22deg] bg-gradient-to-r from-blue-950 via-blue-600 to-sky-300" />
      <div className="absolute -left-[31%] -top-[7%] h-[34%] w-[108%] rotate-[-22deg] border-b-[3px] border-white/80" />
      <div className="absolute -right-[28%] -bottom-[13%] h-[43%] w-[112%] rotate-[-22deg] bg-gradient-to-r from-sky-300 via-blue-600 to-blue-950" />
      <div className="absolute -right-[23%] -bottom-[1%] h-[33%] w-[104%] rotate-[-22deg] border-t-[3px] border-white/80" />
      <p style={{ ...contentLayer, ...eyebrowStyle }} className="mt-[32%] text-center font-semibold tracking-[0.15em]">{eyebrow}</p>
      <h3 style={{ ...contentLayer, fontSize: "clamp(24px, 3.2vw, 46px)" }} className="mt-[15%] text-center font-serif font-bold leading-none tracking-[-0.07em]">{label}</h3>
      <p style={{ ...contentLayer, ...copyStyle }} className="mx-auto mt-[15%] w-fit rounded-full border-2 border-sky-400 px-3 py-1 font-medium">DOCSPRINTHUB</p>
    </div>
  );
}

export default function CoverThumbnail({ template }: CoverThumbnailProps) {
  if (isAcademicTemplate(template.id)) {
    return <LiveA4Thumbnail templateId={template.id} />;
  }

  const thumbnailStyle = getStyle(template);
  const label = labelFor(template);
  const eyebrow = CATEGORY_LABELS[template.category] ?? "DOCSPRINTHUB";

  switch (thumbnailStyle) {
    case "organic": return <OrganicThumbnail eyebrow={eyebrow} label={label} />;
    case "editorial": return <EditorialThumbnail label={label} />;
    case "midnight": return <MidnightThumbnail eyebrow={eyebrow} label={label} />;
    case "paper": return <PaperThumbnail label={label} />;
    case "ribbon":
    default: return <RibbonThumbnail eyebrow={eyebrow} label={label} />;
  }
}
