"use client";

import Image from "next/image";
export type AcademicTemplateVariant =
  | "classic"
  | "commerce"
  | "computer"
  | "education"
  | "elegant"
  | "engineering"
  | "law"
  | "medical"
  | "minimal"
  | "modern"
  | "premium"
  | "research"
  | "science"
  | "thesis"
  | "university";

export interface AcademicTemplateData {
  institute: string;
  title: string;
  subtitle: string;
  topic: string;
  course: string;
  author: string;
  rollNumber: string;
  guide: string;
  session: string;
  logoUrl: string;
}

export interface AcademicTheme {
  primary: string;
  secondary: string;
  accent: string;
  background: string;
  text: string;
  border: string;
  highlight: string;
}

interface AcademicFrameProps {
  data: AcademicTemplateData;
  variant?: AcademicTemplateVariant;
  theme?: Partial<AcademicTheme>;
  thumbnail?: boolean;
}

const DEFAULT_THEME: AcademicTheme = {
  primary: "#1f2937",
  secondary: "#eff6ff",
  accent: "#2563eb",
  background: "#ffffff",
  text: "#0f172a",
  border: "#cbd5e1",
  highlight: "#f8fafc",
};

const VARIANT_THEMES: Record<AcademicTemplateVariant, AcademicTheme> = {
  classic: {
    primary: "#1f2937",
    secondary: "#eef2ff",
    accent: "#2563eb",
    background: "#ffffff",
    text: "#0f172a",
    border: "#cbd5e1",
    highlight: "#f8fafc",
  },
  commerce: {
    primary: "#4b0082",
    secondary: "#faf5ff",
    accent: "#f59e0b",
    background: "#ffffff",
    text: "#111827",
    border: "#fde68a",
    highlight: "#fffbeb",
  },
  computer: {
    primary: "#0f172a",
    secondary: "#dbfafe",
    accent: "#22d3ee",
    background: "#ffffff",
    text: "#0f172a",
    border: "#bae6fd",
    highlight: "#eff6ff",
  },
  education: {
    primary: "#065f46",
    secondary: "#d1fae5",
    accent: "#16a34a",
    background: "#ffffff",
    text: "#064e3b",
    border: "#86efac",
    highlight: "#ecfccb",
  },
  elegant: {
    primary: "#3730a3",
    secondary: "#eef2ff",
    accent: "#a855f7",
    background: "#f8fafc",
    text: "#111827",
    border: "#c7d2fe",
    highlight: "#eef2ff",
  },
  engineering: {
    primary: "#0f172a",
    secondary: "#dbeafe",
    accent: "#0ea5e9",
    background: "#ffffff",
    text: "#0f172a",
    border: "#bfdbfe",
    highlight: "#eff6ff",
  },
  law: {
    primary: "#111827",
    secondary: "#f8fafc",
    accent: "#475569",
    background: "#ffffff",
    text: "#111827",
    border: "#cbd5e1",
    highlight: "#f1f5f9",
  },
  medical: {
    primary: "#0f4c3c",
    secondary: "#d9f99d",
    accent: "#0f766e",
    background: "#ffffff",
    text: "#064e3b",
    border: "#a7f3d0",
    highlight: "#ecfdf5",
  },
  minimal: {
    primary: "#111827",
    secondary: "#f8fafc",
    accent: "#64748b",
    background: "#ffffff",
    text: "#0f172a",
    border: "#e2e8f0",
    highlight: "#f1f5f9",
  },
  modern: {
    primary: "#111827",
    secondary: "#eef2ff",
    accent: "#8b5cf6",
    background: "#ffffff",
    text: "#111827",
    border: "#c7d2fe",
    highlight: "#e0e7ff",
  },
  premium: {
    primary: "#111827",
    secondary: "#fef3c7",
    accent: "#eab308",
    background: "#ffffff",
    text: "#111827",
    border: "#fde68a",
    highlight: "#fffbeb",
  },
  research: {
    primary: "#1f2937",
    secondary: "#eff6ff",
    accent: "#2563eb",
    background: "#ffffff",
    text: "#0f172a",
    border: "#cbd5e1",
    highlight: "#eff6ff",
  },
  science: {
    primary: "#0f172a",
    secondary: "#e0f2fe",
    accent: "#0284c7",
    background: "#ffffff",
    text: "#0f172a",
    border: "#bae6fd",
    highlight: "#dbeafe",
  },
  thesis: {
    primary: "#1f2937",
    secondary: "#f8fafc",
    accent: "#4338ca",
    background: "#ffffff",
    text: "#0f172a",
    border: "#e0e7ff",
    highlight: "#ede9fe",
  },
  university: {
    primary: "#0f172a",
    secondary: "#eff6ff",
    accent: "#2563eb",
    background: "#ffffff",
    text: "#0f172a",
    border: "#c7d2fe",
    highlight: "#e0e7ff",
  },
};

function getTheme(variant: AcademicTemplateVariant = "classic", theme?: Partial<AcademicTheme>) {
  return { ...DEFAULT_THEME, ...VARIANT_THEMES[variant], ...theme };
}

function Decoration({ variant, colors }: { variant: AcademicTemplateVariant; colors: AcademicTheme }) {
  switch (variant) {
    case "commerce":
      return (
        <>
          <div className="absolute -right-32 top-16 h-56 w-56 rounded-full opacity-80" style={{ backgroundColor: colors.accent }} />
          <div className="absolute -left-24 bottom-20 h-64 w-64 rounded-full opacity-40" style={{ backgroundColor: colors.secondary }} />
        </>
      );
    case "computer":
      return (
        <>
          <div className="absolute right-0 top-1/2 h-56 w-72 -translate-y-1/2 rounded-l-[96px] opacity-25" style={{ backgroundColor: colors.accent }} />
          <div className="absolute left-0 bottom-0 h-24 w-full opacity-40" style={{ backgroundColor: colors.secondary }} />
        </>
      );
    case "education":
      return (
        <>
          <div className="absolute left-10 top-10 h-28 w-28 rounded-full opacity-45" style={{ backgroundColor: colors.accent }} />
          <div className="absolute right-10 bottom-16 h-40 w-40 rounded-full opacity-20" style={{ backgroundColor: colors.secondary }} />
        </>
      );
    case "elegant":
      return (
        <>
          <div className="absolute inset-x-0 top-0 h-24 opacity-30" style={{ backgroundImage: `linear-gradient(90deg, ${colors.accent}, transparent)` }} />
          <div className="absolute right-0 bottom-0 h-36 w-36 rounded-full opacity-15" style={{ backgroundColor: colors.accent }} />
        </>
      );
    case "engineering":
      return (
        <>
          <div className="absolute right-10 top-20 h-72 w-72 rounded-full opacity-20" style={{ backgroundColor: colors.secondary }} />
          <div className="absolute left-0 top-0 h-full w-2 opacity-50" style={{ backgroundColor: colors.accent }} />
        </>
      );
    case "law":
      return (
        <>
          <div className="absolute left-0 top-0 h-16 w-full opacity-20" style={{ backgroundColor: colors.accent }} />
          <div className="absolute right-0 bottom-0 h-44 w-44 rounded-tl-[120px] opacity-15" style={{ backgroundColor: colors.secondary }} />
        </>
      );
    case "medical":
      return (
        <>
          <div className="absolute left-0 bottom-0 h-48 w-48 rounded-full opacity-25" style={{ backgroundColor: colors.accent }} />
          <div className="absolute right-10 top-12 h-40 w-40 rounded-full opacity-20" style={{ backgroundColor: colors.secondary }} />
        </>
      );
    case "minimal":
      return (
        <>
          <div className="absolute left-6 top-10 h-20 w-20 rounded-full opacity-80" style={{ backgroundColor: colors.accent }} />
          <div className="absolute right-6 bottom-16 h-24 w-24 rounded-full opacity-40" style={{ backgroundColor: colors.secondary }} />
        </>
      );
    case "modern":
      return (
        <>
          <div className="absolute inset-x-0 top-0 h-40 opacity-30" style={{ backgroundImage: `linear-gradient(135deg, ${colors.accent}, ${colors.secondary})` }} />
          <div className="absolute right-0 bottom-0 h-48 w-48 rounded-full opacity-20" style={{ backgroundColor: colors.primary }} />
        </>
      );
    case "premium":
      return (
        <>
          <div className="absolute inset-x-0 top-0 h-24 opacity-30" style={{ backgroundColor: colors.accent }} />
          <div className="absolute left-0 bottom-0 h-52 w-52 rounded-tr-[120px] opacity-30" style={{ backgroundColor: colors.secondary }} />
        </>
      );
    case "research":
    case "science":
    case "thesis":
    case "university":
      return (
        <>
          <div className="absolute right-0 top-0 h-56 w-56 rounded-full opacity-20" style={{ backgroundColor: colors.secondary }} />
          <div className="absolute left-0 bottom-0 h-48 w-48 rounded-full opacity-20" style={{ backgroundColor: colors.accent }} />
        </>
      );
    case "classic":
    default:
      return (
        <>
          <div className="absolute left-0 top-0 h-32 w-32 rounded-full opacity-30" style={{ backgroundColor: colors.accent }} />
          <div className="absolute right-0 bottom-0 h-36 w-36 rounded-full opacity-15" style={{ backgroundColor: colors.secondary }} />
        </>
      );
  }
}

function InfoPanel({ label, value, note, colors }: { label: string; value: string; note?: string; colors: AcademicTheme }) {
  return (
    <div className="rounded-3xl border p-6" style={{ borderColor: colors.border, backgroundColor: colors.highlight }}>
      <p className="text-xs uppercase tracking-[0.24em] text-slate-500">{label}</p>
      <p className="mt-4 text-xl font-semibold" style={{ color: colors.text }}>{value}</p>
      {note ? <p className="mt-2 text-sm text-slate-500">{note}</p> : null}
    </div>
  );
}

export default function AcademicFrame({
  data,
  variant = "classic",
  theme,
  thumbnail = false,
}: AcademicFrameProps) {
  const colors = getTheme(variant, theme);
  const hasLogo = Boolean(data.logoUrl?.trim());

  return (
  <div
    className={
      thumbnail
        ? "relative h-[297mm] w-[210mm] overflow-hidden rounded-[32px] border"
        : "relative min-h-[297mm] w-full overflow-hidden rounded-[32px] border shadow-xl"
    } style={{ backgroundColor: colors.background, color: colors.text, borderColor: colors.border }}>
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <Decoration variant={variant} colors={colors} />
      </div>

      <div className="relative z-10 flex min-h-full flex-col justify-between gap-8 p-8">
        <header className="flex flex-col gap-5 lg:flex-row lg:items-start lg:justify-between">
          <div className="max-w-3xl">
            <p className="text-xs uppercase tracking-[0.32em]" style={{ color: colors.accent }}>
              {data.course || "Bachelor of Computer Applications"}
            </p>
            <h1 className="mt-4 text-4xl font-black uppercase leading-tight md:text-5xl" style={{ color: colors.primary }}>
              {data.institute || "Your College or Institute Name"}
            </h1>
          </div>

          <div className="rounded-full border px-5 py-3 text-sm font-semibold uppercase tracking-[0.26em]" style={{ borderColor: colors.border, backgroundColor: colors.highlight, color: colors.text }}>
            {data.session || "Academic Session 2026–27"}
          </div>
        </header>

        <main className="space-y-6">
          <div className="inline-flex rounded-full px-4 py-2 text-xs font-semibold uppercase tracking-[0.3em]" style={{ backgroundColor: colors.highlight, color: colors.primary }}>
            {data.subtitle || "ON"}
          </div>

          <div className="space-y-4">
            <h2 className="text-5xl font-black uppercase leading-tight md:text-6xl" style={{ color: colors.text }}>
              {data.title || "PROJECT REPORT"}
            </h2>
            <p className="max-w-3xl text-2xl font-semibold leading-snug" style={{ color: colors.primary }}>
              {data.topic || "Your Project Title Here"}
            </p>
          </div>
        </main>

        <section className="grid gap-4 lg:grid-cols-2">
          <InfoPanel label="Submitted by" value={data.author || "Your Name"} note={data.rollNumber || "Roll No. 0000"} colors={colors} />
          <InfoPanel label="Submitted to" value={data.guide || "Guide / Faculty Name"} note={data.institute || "Your College or Institute Name"} colors={colors} />
        </section>

        <footer className="flex flex-col gap-6 border-t pt-6 text-sm text-slate-500" style={{ borderColor: colors.border }}>
          <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <p className="text-xs uppercase tracking-[0.28em] text-slate-400">Institute</p>
              <p className="mt-2 text-base font-semibold" style={{ color: colors.text }}>
                {data.institute || "Your College or Institute Name"}
              </p>
            </div>

            <div className="flex items-center gap-4">
              <div className="flex h-20 w-20 items-center justify-center rounded-3xl border bg-white" style={{ borderColor: colors.border }}>
                {hasLogo ? <Image src={data.logoUrl} alt="Logo" width={64} height={64} unoptimized className="h-16 w-16 object-contain" /> : <span className="text-sm font-bold uppercase tracking-[0.25em]" style={{ color: colors.primary }}>DS</span>}
              </div>
              <div>
                <p className="text-xs uppercase tracking-[0.28em] text-slate-400">Roll number</p>
                <p className="mt-2 text-sm font-semibold" style={{ color: colors.text }}>
                  {data.rollNumber || "Roll No. 0000"}
                </p>
              </div>
            </div>
          </div>

          <p className="text-xs uppercase tracking-[0.24em] text-slate-400">Designed with DocSprintHub Cover Page Generator</p>
        </footer>
      </div>
    </div>
  );
}
