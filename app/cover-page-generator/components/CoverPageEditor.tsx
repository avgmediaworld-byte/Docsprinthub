"use client";

import Link from "next/link";
import { useState } from "react";
import type { AcademicTemplateData } from "../templates/academic/AcademicFrame";
import AcademicTemplatePreview, { isAcademicTemplate } from "../templates/academic/AcademicTemplatePreview";
import type { CoverDesignOverrides, CoverTextSlot, CoverTextStyle } from "../templates/ThemeDrivenCover";
import useCoverPage from "../templates/hooks/useCoverPage";

const BACKGROUNDS = [
  ["gradient-blue", "Blue gradient"],
  ["minimal-white", "Minimal white"],
  ["navy-luxury", "Navy luxury"],
  ["royal-purple", "Royal purple"],
  ["green-nature", "Green nature"],
] as const;

const LAYOUTS = [
  ["academic01", "Academic centred"],
  ["academic02", "Academic header"],
  ["corporate01", "Corporate hero"],
  ["corporate02", "Corporate formal"],
  ["creative01", "Creative studio"],
] as const;

const DECORATIONS = [
  ["wave-top", "Top wave"],
  ["wave-bottom", "Bottom wave"],
  ["circle-pattern", "Circle pattern"],
  ["hexagon", "Hexagons"],
  ["corner-ribbon", "Corner ribbon"],
] as const;

const TEXT_SLOTS: Array<{ id: CoverTextSlot; label: string }> = [
  { id: "heading", label: "Cover heading" },
  { id: "smallHeading", label: "Small heading" },
  { id: "projectTitle", label: "Project title" },
  { id: "course", label: "Course / subject" },
];

const FONT_FAMILIES = [
  ["Inter, sans-serif", "Modern sans"],
  ["Arial, sans-serif", "Bold classic"],
  ["Georgia, serif", "Editorial serif"],
  ["'Times New Roman', serif", "Formal serif"],
  ["cursive", "Handwritten"],
] as const;

function displayName(templateId: string) {
  return templateId.replace(/[-_]/g, " ").replace(/\b\w/g, (letter) => letter.toUpperCase());
}

function TextInput({ label, value, onChange, placeholder = "" }: { label: string; value: string; onChange: (value: string) => void; placeholder?: string }) {
  return (
    <label className="block">
      <span className="text-sm font-bold text-slate-800">{label}</span>
      <input value={value} onChange={(event) => onChange(event.target.value)} placeholder={placeholder} className="mt-2 w-full rounded-xl border border-slate-300 px-4 py-3 text-slate-900 outline-none placeholder:text-slate-400 focus:border-blue-600 focus:ring-2 focus:ring-blue-100" />
    </label>
  );
}

function BlankCover({ data, design }: { data: AcademicTemplateData; design: CoverDesignOverrides }) {
  const primary = design.primaryColor ?? "#1d4ed8";
  const accent = design.accentColor ?? "#38bdf8";
  const smallHeadingStyle = { color: primary, ...design.textStyles?.smallHeading };
  const headingStyle = { color: primary, ...design.textStyles?.heading };
  const projectTitleStyle = { color: primary, ...design.textStyles?.projectTitle };

  return (
    <div className="relative flex h-full w-full flex-col justify-between overflow-hidden bg-white p-16" style={{ color: primary }}>
      <div className="absolute inset-x-0 top-0 h-5" style={{ backgroundColor: accent }} />
      <div className="absolute -right-24 -top-24 h-80 w-80 rounded-full opacity-15" style={{ backgroundColor: accent }} />
      <div className="relative text-center">
        <p className="text-sm font-bold uppercase tracking-[0.32em]">{data.institute || "Your institute"}</p>
        <div className="mx-auto mt-6 h-px w-40" style={{ backgroundColor: primary }} />
      </div>
      <div className="relative text-center">
        <p className="text-sm font-bold uppercase tracking-[0.28em]" style={smallHeadingStyle}>{data.subtitle || "Cover page"}</p>
        <h1 className="mt-7 text-6xl font-black uppercase leading-none" style={headingStyle}>{data.title || "Project"}</h1>
        <p className="mx-auto mt-7 max-w-[560px] text-3xl font-semibold leading-tight" style={projectTitleStyle}>{data.topic || "Your project title"}</p>
      </div>
      <div className="relative border-t pt-6 text-center" style={{ borderColor: `${primary}55` }}>
        <p className="text-xl font-bold">{data.author || "Your name"}</p>
        <p className="mt-2 text-base">{data.rollNumber || "Roll number"} · {data.session || "Session"}</p>
      </div>
    </div>
  );
}

export default function CoverPageEditor({ templateId }: { templateId: string }) {
  const {
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
    reset,
  } = useCoverPage(templateId);
  const [design, setDesign] = useState<CoverDesignOverrides>({});
  const [decorations, setDecorations] = useState<string[] | null>(null);
  const [textSlot, setTextSlot] = useState<CoverTextSlot>("heading");
  const isBlank = templateId === "blank-cover";
  const previewData: AcademicTemplateData = { institute, title, subtitle, topic, course, author, rollNumber, guide, session, logoUrl };
  const editorDesign = { ...design, decorationIds: decorations ?? undefined };
  const selectedTextStyle = design.textStyles?.[textSlot] ?? {};
  const isBold = selectedTextStyle.fontWeight === 700 || selectedTextStyle.fontWeight === "700" || selectedTextStyle.fontWeight === "bold";
  const isItalic = selectedTextStyle.fontStyle === "italic";

  function updateDesign(change: Partial<CoverDesignOverrides>) {
    setDesign((current) => ({ ...current, ...change }));
  }

  function toggleDecoration(id: string) {
    setDecorations((current) => {
      const selected = current ?? [];
      return selected.includes(id) ? selected.filter((item) => item !== id) : [...selected, id];
    });
  }

  function updateTextStyle(change: Partial<CoverTextStyle>) {
    setDesign((current) => ({
      ...current,
      textStyles: {
        ...current.textStyles,
        [textSlot]: {
          ...current.textStyles?.[textSlot],
          ...change,
        },
      },
    }));
  }

  function resetTextStyle() {
    setDesign((current) => {
      const textStyles = { ...current.textStyles };
      delete textStyles[textSlot];
      return { ...current, textStyles: Object.keys(textStyles).length > 0 ? textStyles : undefined };
    });
  }

  return (
    <main className="min-h-screen bg-slate-100 text-slate-900">
      <style>{`
        @page { size: A4 portrait; margin: 0; }
        .cover-editor-layout { grid-template-columns: minmax(0, 1fr); }
        @media (min-width: 1024px) {
          .cover-editor-layout { grid-template-columns: minmax(360px, 430px) minmax(0, 1fr); align-items: start; }
          .cover-editor-preview { position: sticky; top: 1.5rem; }
        }
        @media print {
          body * { visibility: hidden !important; }
          #cover-print, #cover-print * { visibility: visible !important; }
          #cover-print { position: fixed; left: 0; top: 0; width: 210mm !important; height: 297mm !important; margin: 0 !important; box-shadow: none !important; }
        }
      `}</style>
      <header className="border-b border-slate-200 bg-white">
        <div className="mx-auto flex max-w-[1700px] items-center justify-between gap-4 px-5 py-4 sm:px-8">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.22em] text-blue-700">DocSprintHub cover studio</p>
            <h1 className="mt-1 text-xl font-bold sm:text-2xl">Edit {displayName(templateId)}</h1>
          </div>
          <Link href="/cover-page-generator" className="rounded-xl border border-slate-300 bg-white px-4 py-2 text-sm font-bold text-slate-700 hover:bg-slate-50">← Change template</Link>
        </div>
      </header>

      <section className="cover-editor-layout mx-auto grid max-w-[1700px] gap-6 px-4 py-6 lg:px-6">
        <section className="h-fit rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
          <div className="flex items-start justify-between gap-4">
            <div>
              <p className="text-sm font-bold uppercase tracking-[0.18em] text-blue-700">Template editor</p>
              <h2 className="mt-1 text-2xl font-bold">Make it yours</h2>
              <p className="mt-2 text-sm leading-6 text-slate-600">Update content and control the visual direction before exporting the A4 cover.</p>
            </div>
            <span className="rounded-full bg-blue-50 px-3 py-1 text-xs font-bold text-blue-700">{displayName(templateId)}</span>
          </div>

          <div className="mt-7 space-y-4">
            <TextInput label="Cover heading" value={title} onChange={setTitle} />
            <TextInput label="Small heading" value={subtitle} onChange={setSubtitle} />
            <TextInput label="Project / assignment title" value={topic} onChange={setTopic} />
            <TextInput label="Course / subject" value={course} onChange={setCourse} />
            <div className="grid gap-4 sm:grid-cols-2">
              <TextInput label="Submitted by" value={author} onChange={setAuthor} />
              <TextInput label="Roll number" value={rollNumber} onChange={setRollNumber} />
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <TextInput label="Submitted to" value={guide} onChange={setGuide} />
              <TextInput label="Session / date" value={session} onChange={setSession} />
            </div>
            <TextInput label="College / institute" value={institute} onChange={setInstitute} />
            <label className="block"><span className="text-sm font-bold text-slate-800">Institute logo</span><span className="mt-2 flex cursor-pointer items-center justify-center rounded-xl border border-dashed border-slate-300 px-4 py-3 text-sm font-semibold text-blue-700 hover:bg-blue-50">{logo ? logo.name : "Choose PNG or JPG"}<input type="file" accept="image/png,image/jpeg" className="sr-only" onChange={uploadLogo} /></span></label>
          </div>

          <details className="mt-7 rounded-xl border border-blue-100 bg-blue-50/50 p-4" open>
            <summary className="cursor-pointer text-sm font-bold text-slate-900">Text formatting</summary>
            <p className="mt-2 text-xs leading-5 text-slate-600">Choose any main text field, then format it directly in the live A4 preview.</p>
            <div className="mt-5 space-y-4">
              <label className="block text-sm font-bold text-slate-800">Format text<select value={textSlot} onChange={(event) => setTextSlot(event.target.value as CoverTextSlot)} className="mt-2 w-full rounded-lg border border-slate-300 bg-white px-3 py-2 font-medium">{TEXT_SLOTS.map(({ id, label }) => <option key={id} value={id}>{label}</option>)}</select></label>
              <div className="grid gap-4 sm:grid-cols-2">
                <label className="block text-sm font-bold text-slate-800">Font family<select value={selectedTextStyle.fontFamily ?? ""} onChange={(event) => updateTextStyle({ fontFamily: event.target.value || undefined })} className="mt-2 w-full rounded-lg border border-slate-300 bg-white px-3 py-2 font-medium"><option value="">Template default</option>{FONT_FAMILIES.map(([value, label]) => <option key={value} value={value}>{label}</option>)}</select></label>
                <label className="block text-sm font-bold text-slate-800">Font size<input type="number" min="12" max="96" step="1" value={selectedTextStyle.fontSize ?? ""} onChange={(event) => updateTextStyle({ fontSize: event.target.value ? Number(event.target.value) : undefined })} placeholder="Template default" className="mt-2 w-full rounded-lg border border-slate-300 bg-white px-3 py-2 font-medium" /></label>
              </div>
              <div className="grid gap-4 sm:grid-cols-2">
                <label className="block text-sm font-bold text-slate-800">Font weight<select value={selectedTextStyle.fontWeight?.toString() ?? ""} onChange={(event) => updateTextStyle({ fontWeight: event.target.value ? Number(event.target.value) : undefined })} className="mt-2 w-full rounded-lg border border-slate-300 bg-white px-3 py-2 font-medium"><option value="">Template default</option><option value="400">Regular</option><option value="500">Medium</option><option value="600">Semibold</option><option value="700">Bold</option><option value="800">Extra bold</option></select></label>
                <label className="block text-sm font-bold text-slate-800">Alignment<select value={selectedTextStyle.textAlign ?? ""} onChange={(event) => updateTextStyle({ textAlign: (event.target.value || undefined) as CoverTextStyle["textAlign"] })} className="mt-2 w-full rounded-lg border border-slate-300 bg-white px-3 py-2 font-medium"><option value="">Template default</option><option value="left">Left</option><option value="center">Centre</option><option value="right">Right</option></select></label>
              </div>
              <div className="flex flex-wrap items-end justify-between gap-3"><div className="flex items-center gap-3"><label className="text-sm font-bold text-slate-800">Font colour<input type="color" value={selectedTextStyle.color ?? "#1d4ed8"} onChange={(event) => updateTextStyle({ color: event.target.value })} className="mt-2 block h-10 w-16 cursor-pointer rounded-lg border border-slate-300 bg-white p-1" /></label><div className="flex gap-2 pt-6"><button type="button" aria-pressed={isBold} onClick={() => updateTextStyle({ fontWeight: isBold ? undefined : 700 })} className={`h-10 min-w-10 rounded-lg border px-3 text-sm font-black ${isBold ? "border-blue-600 bg-blue-600 text-white" : "border-slate-300 bg-white text-slate-800"}`}>B</button><button type="button" aria-pressed={isItalic} onClick={() => updateTextStyle({ fontStyle: isItalic ? undefined : "italic" })} className={`h-10 min-w-10 rounded-lg border px-3 text-sm font-bold italic ${isItalic ? "border-blue-600 bg-blue-600 text-white" : "border-slate-300 bg-white text-slate-800"}`}>I</button></div></div><button type="button" onClick={resetTextStyle} className="text-xs font-bold text-blue-700 hover:underline">Reset selected text</button></div>
            </div>
          </details>

          <details className="mt-7 rounded-xl border border-slate-200 bg-slate-50 p-4" open>
            <summary className="cursor-pointer text-sm font-bold text-slate-900">Design controls</summary>
            <div className="mt-5 space-y-5">
              <label className="block text-sm font-bold text-slate-800">Background<select value={design.backgroundId ?? "template"} onChange={(event) => updateDesign({ backgroundId: event.target.value === "template" ? undefined : event.target.value })} className="mt-2 w-full rounded-lg border border-slate-300 bg-white px-3 py-2 font-medium"><option value="template">Use template background</option>{BACKGROUNDS.map(([id, label]) => <option key={id} value={id}>{label}</option>)}</select></label>
              <label className="block text-sm font-bold text-slate-800">Layout<select value={design.layoutId ?? "template"} onChange={(event) => updateDesign({ layoutId: event.target.value === "template" ? undefined : event.target.value })} className="mt-2 w-full rounded-lg border border-slate-300 bg-white px-3 py-2 font-medium"><option value="template">Use template layout</option>{LAYOUTS.map(([id, label]) => <option key={id} value={id}>{label}</option>)}</select></label>
              <label className="block text-sm font-bold text-slate-800">Heading font<select value={design.headingFont ?? "template"} onChange={(event) => updateDesign({ headingFont: event.target.value === "template" ? undefined : event.target.value })} className="mt-2 w-full rounded-lg border border-slate-300 bg-white px-3 py-2 font-medium"><option value="template">Use template font</option><option value="Inter, sans-serif">Modern sans</option><option value="Georgia, serif">Editorial serif</option><option value="Arial, sans-serif">Bold classic</option><option value="cursive">Handwritten</option></select></label>
              <div className="grid grid-cols-2 gap-4"><label className="text-sm font-bold text-slate-800">Heading colour<input type="color" value={design.primaryColor ?? "#1d4ed8"} onChange={(event) => updateDesign({ primaryColor: event.target.value })} className="mt-2 block h-11 w-full cursor-pointer rounded-lg border border-slate-300 bg-white p-1" /></label><label className="text-sm font-bold text-slate-800">Accent colour<input type="color" value={design.accentColor ?? "#38bdf8"} onChange={(event) => updateDesign({ accentColor: event.target.value })} className="mt-2 block h-11 w-full cursor-pointer rounded-lg border border-slate-300 bg-white p-1" /></label></div>
              <div><div className="flex items-center justify-between gap-3"><p className="text-sm font-bold text-slate-800">Decorations</p><button type="button" onClick={() => setDecorations(null)} className="text-xs font-bold text-blue-700 hover:underline">Use template set</button></div><div className="mt-3 grid grid-cols-2 gap-2">{DECORATIONS.map(([id, label]) => <label key={id} className="flex cursor-pointer items-center gap-2 rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm font-medium text-slate-700"><input type="checkbox" checked={decorations?.includes(id) ?? false} onChange={() => toggleDecoration(id)} className="h-4 w-4 accent-blue-600" />{label}</label>)}</div>{decorations === null ? <p className="mt-2 text-xs text-slate-500">Template&apos;s original decoration set is active.</p> : null}</div>
            </div>
          </details>

          <div className="mt-7 grid gap-3 sm:grid-cols-2"><button type="button" onClick={() => exportFile("pdf")} disabled={isExporting} className="rounded-xl bg-blue-600 px-4 py-3 font-bold text-white hover:bg-blue-700 disabled:bg-blue-400">{isExporting ? "Preparing..." : "Download A4 PDF"}</button><button type="button" onClick={() => exportFile("jpg")} disabled={isExporting} className="rounded-xl border border-blue-600 bg-white px-4 py-3 font-bold text-blue-700 hover:bg-blue-50">Download JPG</button><button type="button" onClick={() => window.print()} className="rounded-xl border border-slate-300 bg-white px-4 py-3 font-bold text-slate-700 hover:bg-slate-50">Print A4</button><button type="button" onClick={() => { reset(); setDesign({}); setDecorations(null); }} className="rounded-xl border border-slate-300 bg-white px-4 py-3 font-bold text-slate-700 hover:bg-slate-50">Reset editor</button></div>
          {error ? <p role="alert" className="mt-4 rounded-xl bg-red-50 p-3 text-sm font-medium text-red-800">{error}</p> : null}
        </section>

        <aside className="cover-editor-preview h-fit overflow-auto rounded-2xl border border-slate-200 bg-slate-200 p-4 shadow-sm sm:p-6">
          <div className="mb-4 flex items-center justify-between gap-3"><div><p className="text-sm font-bold text-slate-700">Live A4 preview</p><p className="mt-1 text-xs text-slate-500">Changes are applied to export and print.</p></div><span className="rounded-full bg-emerald-100 px-3 py-1 text-xs font-bold text-emerald-700">Editable design</span></div>
          <div className="min-w-[210mm] pb-2"><div id="cover-print" ref={pageRef} className="relative overflow-hidden bg-white shadow-xl" style={{ height: "297mm", width: "210mm" }}>{isBlank || !isAcademicTemplate(templateId) ? <BlankCover data={previewData} design={editorDesign} /> : <AcademicTemplatePreview templateId={templateId} data={previewData} design={editorDesign} />}</div></div>
        </aside>
      </section>
    </main>
  );
}
