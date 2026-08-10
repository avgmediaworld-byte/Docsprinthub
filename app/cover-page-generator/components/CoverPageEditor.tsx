"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import A4CoverCanvas, {
  DEFAULT_SAFE_MARGINS,
  createTemplateCanvasElements,
  type CoverCanvasElement,
  type CoverCanvasTextStyle,
  type CoverPageMargins,
} from "./A4CoverCanvas";
import { CoverTemplateSurface, getCoverTemplatePalette, type CoverDesignOverrides } from "../templates/ThemeDrivenCover";
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

const FONT_FAMILIES = [
  ["Inter, Arial, sans-serif", "Modern sans"],
  ["Arial, sans-serif", "Bold classic"],
  ["Georgia, serif", "Editorial serif"],
  ["Times New Roman, serif", "Formal serif"],
  ["cursive", "Handwritten"],
] as const;

const INITIAL_CONTENT = {
  title: "PROJECT REPORT",
  subtitle: "ON",
  topic: "Your Project Title Here",
  course: "Bachelor of Computer Applications",
  author: "Your Name",
  rollNumber: "Roll No. 0000",
  guide: "Guide / Faculty Name",
  institute: "Your College or Institute Name",
  session: "Academic Session 2026–27",
};

function displayName(templateId: string) {
  return templateId === "blank-cover" ? "Blank Cover" : templateId.replace(/[-_]/g, " ").replace(/\b\w/g, (letter) => letter.toUpperCase());
}

function LabelledInput({ label, value, onChange, type = "text", min, max, step }: { label: string; value: string | number; onChange: (value: string) => void; type?: "text" | "number"; min?: number; max?: number; step?: number }) {
  return (
    <label className="block text-sm font-bold text-slate-800">
      {label}
      <input type={type} value={value} min={min} max={max} step={step} onChange={(event) => onChange(event.target.value)} className="mt-2 w-full rounded-lg border border-slate-300 bg-white px-3 py-2 font-medium text-slate-900 outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-100" />
    </label>
  );
}

function LabelledSelect({ label, value, onChange, children }: { label: string; value: string; onChange: (value: string) => void; children: React.ReactNode }) {
  return (
    <label className="block text-sm font-bold text-slate-800">
      {label}
      <select value={value} onChange={(event) => onChange(event.target.value)} className="mt-2 w-full rounded-lg border border-slate-300 bg-white px-3 py-2 font-medium text-slate-900 outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-100">
        {children}
      </select>
    </label>
  );
}

function defaultTextStyle(color: string, fontFamily: string): CoverCanvasTextStyle {
  return { color, fontFamily, fontSize: 14, fontStyle: "normal", fontWeight: 500, textAlign: "left" };
}

export default function CoverPageEditor({ templateId }: { templateId: string }) {
  const cover = useCoverPage(templateId);
  const [design, setDesign] = useState<CoverDesignOverrides>({});
  const [decorations, setDecorations] = useState<string[] | null>(null);
  const initialPalette = getCoverTemplatePalette(templateId);
  const [elements, setElements] = useState<CoverCanvasElement[]>(() => createTemplateCanvasElements(templateId, INITIAL_CONTENT, initialPalette));
  const [selectedElementId, setSelectedElementId] = useState<string | null>("project-title");
  const [margins, setMargins] = useState<CoverPageMargins>(DEFAULT_SAFE_MARGINS);
  const [safeAreaNotice, setSafeAreaNotice] = useState("Drag objects on the canvas. The blue guide marks the safe printable area.");
  const editorDesign = { ...design, decorationIds: decorations ?? undefined };
  const palette = getCoverTemplatePalette(templateId, editorDesign);
  const selectedElement = useMemo(() => elements.find((element) => element.id === selectedElementId) ?? null, [elements, selectedElementId]);
  const isBlank = templateId === "blank-cover";

  function updateDesign(change: Partial<CoverDesignOverrides>) {
    setDesign((current) => ({ ...current, ...change }));
  }

  function updateSelected(change: Partial<CoverCanvasElement>) {
    if (!selectedElementId) return;
    setElements((current) => current.map((element) => element.id === selectedElementId ? { ...element, ...change } : element));
  }

  function updateSelectedStyle(change: Partial<CoverCanvasTextStyle>) {
    if (!selectedElementId) return;
    setElements((current) => current.map((element) => element.id === selectedElementId ? { ...element, style: { ...element.style, ...change } } : element));
  }

  function addTextBox() {
    const id = `text-${Date.now()}`;
    setElements((current) => [
      ...current,
      {
        id,
        type: "text",
        label: "New text",
        text: "New text",
        x: Math.max(margins.left, 50),
        y: Math.max(margins.top, 178),
        width: 110,
        height: 14,
        style: defaultTextStyle(palette.primary, palette.fontFamily),
      },
    ]);
    setSelectedElementId(id);
    setSafeAreaNotice("New text box added inside the safe printable area.");
  }

  function deleteSelected() {
    if (!selectedElement) return;
    setElements((current) => current.filter((element) => element.id !== selectedElement.id));
    setSelectedElementId(null);
    setSafeAreaNotice(`${selectedElement.label} removed. You can add a new text box at any time.`);
  }

  function updateMargin(side: keyof CoverPageMargins, value: string) {
    const numericValue = Number(value);
    if (!Number.isFinite(numericValue)) return;
    const next = { ...margins, [side]: Math.min(Math.max(numericValue, 0), 45) };
    if (next.left + next.right > 160 || next.top + next.bottom > 240) {
      setSafeAreaNotice("Margins must leave usable space on the A4 page.");
      return;
    }
    setMargins(next);
    setSafeAreaNotice("Safe-margin guide updated. Objects stay inside this area when moved or resized.");
  }

  function toggleDecoration(id: string) {
    setDecorations((current) => {
      const selected = current ?? [];
      return selected.includes(id) ? selected.filter((item) => item !== id) : [...selected, id];
    });
  }

  function resetEditor() {
    cover.reset();
    setDesign({});
    setDecorations(null);
    setMargins(DEFAULT_SAFE_MARGINS);
    setElements(createTemplateCanvasElements(templateId, INITIAL_CONTENT, getCoverTemplatePalette(templateId)));
    setSelectedElementId("project-title");
    setSafeAreaNotice("Template content and safe margins have been reset.");
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
        [data-exporting="true"] .editor-ui { display: none !important; }
        @media print {
          body * { visibility: hidden !important; }
          #cover-print, #cover-print * { visibility: visible !important; }
          #cover-print .editor-ui { display: none !important; }
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
          <h2 className="mt-1 text-2xl font-bold">Click, drag, resize, edit</h2>
          <p className="mt-2 text-sm leading-6 text-slate-600">Each object uses fixed millimetre coordinates. The preview, A4 PDF, JPG and print output use the same page.</p>

          <div className="mt-5 flex flex-wrap gap-2">
            <button type="button" onClick={addTextBox} className="rounded-lg bg-blue-600 px-3 py-2 text-sm font-bold text-white hover:bg-blue-700">+ Add text</button>
            <button type="button" onClick={deleteSelected} disabled={!selectedElement} className="rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm font-bold text-red-700 hover:bg-red-100 disabled:cursor-not-allowed disabled:opacity-50">Delete selected</button>
          </div>

          <details className="mt-6 rounded-xl border border-blue-100 bg-blue-50/60 p-4" open>
            <summary className="cursor-pointer text-sm font-bold text-slate-900">Selected object</summary>
            {selectedElement ? (
              <div className="mt-4 space-y-4">
                <p className="rounded-lg bg-white px-3 py-2 text-xs font-bold uppercase tracking-[0.12em] text-blue-700">{selectedElement.label}</p>
                {selectedElement.type === "text" ? <label className="block text-sm font-bold text-slate-800">Text<textarea value={selectedElement.text} onChange={(event) => updateSelected({ text: event.target.value })} rows={4} className="mt-2 w-full resize-y rounded-lg border border-slate-300 bg-white px-3 py-2 font-medium text-slate-900 outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-100" /></label> : <p className="rounded-lg border border-dashed border-slate-300 bg-white px-3 py-3 text-sm leading-6 text-slate-600">Upload a PNG or JPG logo below, then drag it or resize it using the blue handle on the canvas.</p>}
                <div className="grid grid-cols-2 gap-3">
                  <LabelledInput label="X (mm)" type="number" value={Math.round(selectedElement.x)} min={margins.left} max={210 - margins.right - selectedElement.width} onChange={(value) => updateSelected({ x: Math.min(Math.max(Number(value) || margins.left, margins.left), 210 - margins.right - selectedElement.width) })} />
                  <LabelledInput label="Y (mm)" type="number" value={Math.round(selectedElement.y)} min={margins.top} max={297 - margins.bottom - selectedElement.height} onChange={(value) => updateSelected({ y: Math.min(Math.max(Number(value) || margins.top, margins.top), 297 - margins.bottom - selectedElement.height) })} />
                  <LabelledInput label="Width (mm)" type="number" value={Math.round(selectedElement.width)} min={selectedElement.type === "logo" ? 12 : 28} max={210 - margins.right - selectedElement.x} onChange={(value) => updateSelected({ width: Math.min(Math.max(Number(value) || 28, selectedElement.type === "logo" ? 12 : 28), 210 - margins.right - selectedElement.x) })} />
                  <LabelledInput label="Height (mm)" type="number" value={Math.round(selectedElement.height)} min={selectedElement.type === "logo" ? 12 : 8} max={297 - margins.bottom - selectedElement.y} onChange={(value) => updateSelected({ height: Math.min(Math.max(Number(value) || 8, selectedElement.type === "logo" ? 12 : 8), 297 - margins.bottom - selectedElement.y) })} />
                </div>
                {selectedElement.type === "text" ? <>
                  <div className="grid grid-cols-2 gap-3">
                    <LabelledSelect label="Font family" value={selectedElement.style.fontFamily} onChange={(value) => updateSelectedStyle({ fontFamily: value })}>{FONT_FAMILIES.map(([value, label]) => <option key={value} value={value}>{label}</option>)}</LabelledSelect>
                    <LabelledInput label="Font size (pt)" type="number" value={selectedElement.style.fontSize} min={7} max={96} onChange={(value) => updateSelectedStyle({ fontSize: Math.min(Math.max(Number(value) || 14, 7), 96) })} />
                    <LabelledSelect label="Alignment" value={selectedElement.style.textAlign} onChange={(value) => updateSelectedStyle({ textAlign: value as CoverCanvasTextStyle["textAlign"] })}><option value="left">Left</option><option value="center">Centre</option><option value="right">Right</option></LabelledSelect>
                    <LabelledSelect label="Weight" value={String(selectedElement.style.fontWeight)} onChange={(value) => updateSelectedStyle({ fontWeight: Number(value) })}><option value="400">Regular</option><option value="500">Medium</option><option value="600">Semibold</option><option value="700">Bold</option><option value="800">Extra bold</option></LabelledSelect>
                  </div>
                  <div className="flex flex-wrap items-end gap-3"><label className="text-sm font-bold text-slate-800">Text colour<input type="color" value={selectedElement.style.color} onChange={(event) => updateSelectedStyle({ color: event.target.value })} className="mt-2 block h-10 w-16 cursor-pointer rounded-lg border border-slate-300 bg-white p-1" /></label><button type="button" onClick={() => updateSelectedStyle({ fontStyle: selectedElement.style.fontStyle === "italic" ? "normal" : "italic" })} className={`h-10 rounded-lg border px-4 text-sm font-bold italic ${selectedElement.style.fontStyle === "italic" ? "border-blue-600 bg-blue-600 text-white" : "border-slate-300 bg-white text-slate-800"}`}>Italic</button></div>
                </> : null}
              </div>
            ) : <p className="mt-3 text-sm leading-6 text-slate-600">Select a text box or logo on the A4 canvas to edit its content, placement, size and formatting.</p>}
          </details>

          <details className="mt-5 rounded-xl border border-slate-200 bg-slate-50 p-4" open>
            <summary className="cursor-pointer text-sm font-bold text-slate-900">Logo and safe margins</summary>
            <label className="mt-4 block"><span className="text-sm font-bold text-slate-800">Institute logo</span><span className="mt-2 flex cursor-pointer items-center justify-center rounded-lg border border-dashed border-slate-300 bg-white px-4 py-3 text-sm font-semibold text-blue-700 hover:bg-blue-50">{cover.logo ? cover.logo.name : "Choose PNG or JPG"}<input type="file" accept="image/png,image/jpeg" className="sr-only" onChange={cover.uploadLogo} /></span></label>
            <div className="mt-5 grid grid-cols-2 gap-3"><LabelledInput label="Top (mm)" type="number" value={margins.top} min={0} max={45} onChange={(value) => updateMargin("top", value)} /><LabelledInput label="Right (mm)" type="number" value={margins.right} min={0} max={45} onChange={(value) => updateMargin("right", value)} /><LabelledInput label="Bottom (mm)" type="number" value={margins.bottom} min={0} max={45} onChange={(value) => updateMargin("bottom", value)} /><LabelledInput label="Left (mm)" type="number" value={margins.left} min={0} max={45} onChange={(value) => updateMargin("left", value)} /></div>
            <p className="mt-3 text-xs leading-5 text-slate-600">The blue guide is visible only while editing. It is never shown in the PDF, JPG or printed page.</p>
          </details>

          <details className="mt-5 rounded-xl border border-slate-200 bg-slate-50 p-4">
            <summary className="cursor-pointer text-sm font-bold text-slate-900">Template appearance</summary>
            <div className="mt-5 space-y-4">
              <LabelledSelect label="Background" value={design.backgroundId ?? "template"} onChange={(value) => updateDesign({ backgroundId: value === "template" ? undefined : value })}><option value="template">Use template background</option>{BACKGROUNDS.map(([id, label]) => <option key={id} value={id}>{label}</option>)}</LabelledSelect>
              <LabelledSelect label="Layout direction" value={design.layoutId ?? "template"} onChange={(value) => updateDesign({ layoutId: value === "template" ? undefined : value })}><option value="template">Use template layout</option>{LAYOUTS.map(([id, label]) => <option key={id} value={id}>{label}</option>)}</LabelledSelect>
              <div className="grid grid-cols-2 gap-3"><label className="text-sm font-bold text-slate-800">Primary colour<input type="color" value={design.primaryColor ?? palette.primary} onChange={(event) => updateDesign({ primaryColor: event.target.value })} className="mt-2 block h-10 w-full cursor-pointer rounded-lg border border-slate-300 bg-white p-1" /></label><label className="text-sm font-bold text-slate-800">Accent colour<input type="color" value={design.accentColor ?? palette.accent} onChange={(event) => updateDesign({ accentColor: event.target.value })} className="mt-2 block h-10 w-full cursor-pointer rounded-lg border border-slate-300 bg-white p-1" /></label></div>
              <div><div className="flex items-center justify-between gap-3"><p className="text-sm font-bold text-slate-800">Decorations</p><button type="button" onClick={() => setDecorations(null)} className="text-xs font-bold text-blue-700 hover:underline">Restore template set</button></div><div className="mt-3 grid grid-cols-2 gap-2">{DECORATIONS.map(([id, label]) => <label key={id} className="flex cursor-pointer items-center gap-2 rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm font-medium text-slate-700"><input type="checkbox" checked={decorations?.includes(id) ?? false} onChange={() => toggleDecoration(id)} className="h-4 w-4 accent-blue-600" />{label}</label>)}</div>{decorations === null ? <p className="mt-2 text-xs text-slate-500">The original decoration set is active.</p> : null}</div>
            </div>
          </details>

          <div className="mt-6 grid gap-3 sm:grid-cols-2"><button type="button" onClick={() => cover.exportFile("pdf")} disabled={cover.isExporting} className="rounded-xl bg-blue-600 px-4 py-3 font-bold text-white hover:bg-blue-700 disabled:bg-blue-400">{cover.isExporting ? "Preparing..." : "Download A4 PDF"}</button><button type="button" onClick={() => cover.exportFile("jpg")} disabled={cover.isExporting} className="rounded-xl border border-blue-600 bg-white px-4 py-3 font-bold text-blue-700 hover:bg-blue-50">Download JPG</button><button type="button" onClick={() => window.print()} className="rounded-xl border border-slate-300 bg-white px-4 py-3 font-bold text-slate-700 hover:bg-slate-50">Print A4</button><button type="button" onClick={resetEditor} className="rounded-xl border border-slate-300 bg-white px-4 py-3 font-bold text-slate-700 hover:bg-slate-50">Reset editor</button></div>
          {cover.error ? <p role="alert" className="mt-4 rounded-xl bg-red-50 p-3 text-sm font-medium text-red-800">{cover.error}</p> : null}
        </section>

        <aside className="cover-editor-preview h-fit overflow-auto rounded-2xl border border-slate-200 bg-slate-200 p-4 shadow-sm sm:p-6">
          <div className="mb-4 flex flex-wrap items-center justify-between gap-3"><div><p className="text-sm font-bold text-slate-700">Live A4 canvas</p><p className="mt-1 text-xs text-slate-500">Select any object and drag it. Resize using the blue handle.</p></div><span className="rounded-full bg-emerald-100 px-3 py-1 text-xs font-bold text-emerald-700">Fixed 210 × 297 mm</span></div>
          <p role="status" className="mb-4 rounded-lg border border-blue-100 bg-blue-50 px-3 py-2 text-xs font-medium leading-5 text-blue-800">{safeAreaNotice}</p>
          <div className="min-w-[210mm] pb-2"><div id="cover-print" ref={cover.pageRef} className="relative overflow-hidden bg-white shadow-xl" style={{ height: "297mm", width: "210mm" }}>{isBlank ? <div className="relative h-full w-full overflow-hidden bg-white"><div className="absolute inset-x-0 top-0 h-[8mm]" style={{ backgroundColor: palette.accent }} /><div className="absolute -right-[30mm] -top-[30mm] h-[90mm] w-[90mm] rounded-full opacity-10" style={{ backgroundColor: palette.primary }} /><A4CoverCanvas canvasRef={cover.pageRef} elements={elements} selectedElementId={selectedElementId} margins={margins} logoUrl={cover.logoUrl} logoFallback="DS" isExporting={cover.isExporting} onChangeElements={setElements} onSelectElement={setSelectedElementId} onSafeAreaNotice={setSafeAreaNotice} /></div> : <CoverTemplateSurface templateId={templateId} design={editorDesign}><A4CoverCanvas canvasRef={cover.pageRef} elements={elements} selectedElementId={selectedElementId} margins={margins} logoUrl={cover.logoUrl} logoFallback="DS" isExporting={cover.isExporting} onChangeElements={setElements} onSelectElement={setSelectedElementId} onSafeAreaNotice={setSafeAreaNotice} /></CoverTemplateSurface>}</div></div>
        </aside>
      </section>
    </main>
  );
}
