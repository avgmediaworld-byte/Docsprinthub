"use client";

import Link from "next/link";
import { ChangeEvent, useRef, useState } from "react";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";

type Template = "academic" | "modern" | "minimal";

const templateOptions: Array<{ id: Template; title: string; description: string }> = [
  { id: "academic", title: "Academic Frame", description: "Premium college report design" },
  { id: "modern", title: "Modern Studio", description: "Bold project and portfolio cover" },
  { id: "minimal", title: "Editorial", description: "Elegant magazine-style composition" },
];

async function waitForRender() {
  await document.fonts.ready;
  await new Promise<void>((resolve) => requestAnimationFrame(() => resolve()));
  await new Promise<void>((resolve) => requestAnimationFrame(() => resolve()));
}

async function captureA4(element: HTMLElement) {
  const surface = document.createElement("div");
  const clone = element.cloneNode(true) as HTMLElement;
  surface.style.cssText = "position:fixed;left:-100000px;top:0;width:210mm;height:297mm;overflow:hidden;pointer-events:none;";
  clone.style.width = "210mm";
  clone.style.minWidth = "210mm";
  clone.style.maxWidth = "210mm";
  clone.style.height = "297mm";
  clone.style.minHeight = "297mm";
  clone.style.maxHeight = "297mm";
  clone.style.margin = "0";
  clone.style.transform = "none";
  surface.append(clone);
  document.body.append(surface);
  try {
    await waitForRender();
    return await html2canvas(clone, { scale: 2, width: clone.offsetWidth, height: clone.offsetHeight, windowWidth: clone.offsetWidth, windowHeight: clone.offsetHeight, backgroundColor: "#ffffff", useCORS: true, logging: false, scrollX: 0, scrollY: 0 });
  } finally {
    surface.remove();
  }
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

function Input({ label, value, onChange, placeholder = "" }: { label: string; value: string; onChange: (value: string) => void; placeholder?: string }) {
  return <label className="block"><span className="text-sm font-bold text-slate-800">{label}</span><input value={value} onChange={(event) => onChange(event.target.value)} placeholder={placeholder} className="mt-2 w-full rounded-xl border border-slate-300 px-4 py-3 text-slate-900 outline-none placeholder:text-slate-400 focus:border-blue-600 focus:ring-2 focus:ring-blue-100" /></label>;
}

export default function CoverPageGeneratorPage() {
  const [template, setTemplate] = useState<Template>("academic");
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
  const pageRef = useRef<HTMLDivElement>(null);

  function uploadLogo(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0] ?? null;
    if (file && !["image/png", "image/jpeg"].includes(file.type)) setError("Logo ke liye PNG ya JPG select kijiye.");
    else if (file) {
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

  async function exportFile(format: "pdf" | "jpg") {
    if (!pageRef.current) return;
    setIsExporting(true); setError("");
    try {
      const canvas = await captureA4(pageRef.current);
      if (format === "jpg") {
        const blob = await new Promise<Blob>((resolve, reject) => canvas.toBlob((result) => result ? resolve(result) : reject(new Error("JPG create nahi ho saka.")), "image/jpeg", 0.95));
        downloadBlob(blob, "cover-page-a4.jpg");
      } else {
        const pdf = new jsPDF({ orientation: "portrait", unit: "mm", format: "a4", compress: true });
        pdf.addImage(canvas.toDataURL("image/png"), "PNG", 0, 0, 210, 297, undefined, "FAST");
        pdf.setProperties({ title: title || "Cover Page", author: "DocSprintHub", subject: "A4 Cover Page" });
        pdf.save("cover-page-a4.pdf");
      }
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : "Export nahi ho saka.");
    } finally { setIsExporting(false); }
  }

  function reset() {
    setTemplate("academic"); setTitle("PROJECT REPORT"); setSubtitle("ON"); setTopic("Your Project Title Here"); setCourse("Bachelor of Computer Applications"); setAuthor("Your Name"); setRollNumber("Roll No. 0000"); setGuide("Guide / Faculty Name"); setInstitute("Your College or Institute Name"); setSession("Academic Session 2026–27"); setLogo(null); setLogoUrl(""); setError("");
  }


  return <main className="min-h-screen bg-slate-50 text-slate-900">
    <style>{`@page { size: A4 portrait; margin: 0; } @media print { body * { visibility: hidden !important; } #cover-print, #cover-print * { visibility: visible !important; } #cover-print { position: fixed; left: 0; top: 0; width: 210mm !important; height: 297mm !important; margin: 0 !important; box-shadow: none !important; } }`}</style>
    <header className="border-b border-slate-200 bg-white"><div className="mx-auto flex max-w-7xl items-center justify-between px-5 py-4 sm:px-8"><Link href="/" className="text-2xl font-bold tracking-tight sm:text-3xl">DocSprint<span className="text-blue-600">Hub</span></Link><Link href="/resume-builder" className="rounded-xl bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-700 sm:px-5">Resume Builder</Link></div></header>
    <section className="border-b border-blue-100 bg-gradient-to-b from-blue-50 to-slate-50 px-5 py-8 text-center sm:px-8 sm:py-10"><p className="text-sm font-bold uppercase tracking-[0.2em] text-blue-700">DocSprintHub</p><h1 className="mt-2 text-4xl font-bold tracking-tight text-slate-950 sm:text-5xl">Cover Page Generator</h1><p className="mx-auto mt-3 max-w-2xl text-base leading-7 text-slate-600 sm:text-lg">Create a professional A4 cover page for assignments, reports and projects.</p></section>
    <section className="mx-auto grid max-w-7xl gap-7 px-5 py-7 sm:px-8 lg:grid-cols-[minmax(320px,0.8fr)_minmax(0,1.2fr)] lg:py-10">
      <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-7"><h2 className="text-2xl font-bold">Cover page details</h2><p className="mt-2 text-slate-600">All changes preview mein turant dikhenge.</p><div className="mt-6 grid gap-3">{templateOptions.map((option) => <button key={option.id} type="button" onClick={() => setTemplate(option.id)} className={`rounded-xl border p-4 text-left transition ${template === option.id ? "border-blue-600 bg-blue-50 ring-1 ring-blue-600" : "border-slate-200 hover:border-blue-300 hover:bg-slate-50"}`}><span className="block font-bold">{option.title}</span><span className="mt-1 block text-sm text-slate-600">{option.description}</span></button>)}</div><div className="mt-7 grid gap-4"><Input label="Cover heading" value={title} onChange={setTitle} placeholder="PROJECT REPORT" /><Input label="Small heading" value={subtitle} onChange={setSubtitle} placeholder="ON" /><Input label="Project / assignment title" value={topic} onChange={setTopic} /><Input label="Course / subject" value={course} onChange={setCourse} /><div className="grid gap-4 sm:grid-cols-2"><Input label="Submitted by" value={author} onChange={setAuthor} /><Input label="Roll number" value={rollNumber} onChange={setRollNumber} /></div><div className="grid gap-4 sm:grid-cols-2"><Input label="Submitted to" value={guide} onChange={setGuide} /><Input label="Session / date" value={session} onChange={setSession} /></div><Input label="College / institute" value={institute} onChange={setInstitute} /><label><span className="text-sm font-bold text-slate-800">Institute logo (optional)</span><span className="mt-2 flex cursor-pointer items-center justify-center rounded-xl border border-dashed border-slate-300 px-4 py-3 text-sm font-semibold text-blue-700 hover:bg-blue-50">{logo ? logo.name : "Choose PNG or JPG"}<input type="file" accept="image/png,image/jpeg" className="sr-only" onChange={uploadLogo} /></span></label></div><div className="mt-7 grid gap-3 sm:grid-cols-2"><button type="button" onClick={() => exportFile("pdf")} disabled={isExporting} className="rounded-xl bg-blue-600 px-4 py-3 font-bold text-white hover:bg-blue-700 disabled:bg-blue-400">{isExporting ? "Preparing..." : "Download A4 PDF"}</button><button type="button" onClick={() => exportFile("jpg")} disabled={isExporting} className="rounded-xl border border-blue-600 px-4 py-3 font-bold text-blue-700 hover:bg-blue-50">Download JPG</button><button type="button" onClick={() => window.print()} className="rounded-xl border border-slate-300 px-4 py-3 font-bold text-slate-700 hover:bg-slate-50">Print A4</button><button type="button" onClick={reset} className="rounded-xl border border-slate-300 px-4 py-3 font-bold text-slate-700 hover:bg-slate-50">Reset</button></div>{error && <p role="alert" className="mt-4 rounded-xl bg-red-50 p-3 text-sm font-medium text-red-800">{error}</p>}</section>
      <aside className="overflow-auto rounded-2xl border border-slate-200 bg-slate-200 p-4 shadow-sm sm:p-6"><p className="mb-4 text-center text-sm font-semibold text-slate-600">Live A4 preview</p><div className="min-w-[210mm] pb-2"><div id="cover-print" ref={pageRef} className={`relative overflow-hidden shadow-xl ${template === "modern" ? "bg-slate-950 text-white" : "bg-white text-slate-900"}`} style={{ width: "210mm", height: "297mm" }}>
        {template === "academic" && <>
          <div className="absolute inset-7 border-[3px] border-blue-900" /><div className="absolute inset-10 border border-blue-300" />
          <div className="absolute -right-16 top-28 h-72 w-72 rounded-full bg-blue-100" /><div className="absolute -left-20 bottom-24 h-64 w-64 rounded-full bg-amber-100" />
          <div className="relative flex h-full flex-col px-24 py-20 text-center"><div className="flex items-center justify-between"><div className="h-20 w-20 overflow-hidden rounded-2xl border-2 border-blue-900 bg-white p-2">{logoUrl ? <img src={logoUrl} alt="Institute logo" className="h-full w-full object-contain" /> : <span className="flex h-full items-center justify-center text-2xl font-black text-blue-900">DS</span>}</div><div className="text-right"><p className="text-xs font-bold tracking-[0.24em] text-blue-800">DOCSPRINTHUB</p><p className="mt-2 text-sm text-slate-500">Academic cover series</p></div></div><div className="mt-20"><p className="text-lg font-bold tracking-[0.2em] text-blue-900">{institute}</p><div className="mx-auto mt-7 h-1 w-28 bg-amber-400" /><p className="mt-20 text-base font-bold tracking-[0.35em] text-slate-600">{title}</p><p className="mt-8 text-sm font-semibold tracking-[0.3em] text-blue-800">{subtitle}</p><h2 className="mt-7 text-5xl font-black leading-[1.12] text-blue-950">{topic}</h2><p className="mt-10 text-xl text-slate-700">{course}</p></div><div className="mt-auto grid grid-cols-2 gap-7 border-t-2 border-blue-900 pt-8 text-left"><div><p className="text-xs font-bold uppercase tracking-[0.15em] text-slate-500">Prepared by</p><p className="mt-3 text-2xl font-bold text-blue-950">{author}</p><p className="mt-1 text-base">{rollNumber}</p></div><div className="border-l border-blue-200 pl-7"><p className="text-xs font-bold uppercase tracking-[0.15em] text-slate-500">Submitted to</p><p className="mt-3 text-xl font-bold text-blue-950">{guide}</p><p className="mt-1 text-base">{session}</p></div></div></div>
        </>}
        {template === "modern" && <><div className="absolute -right-24 -top-20 h-96 w-96 rounded-full bg-cyan-400/20" /><div className="absolute -bottom-32 -left-24 h-96 w-96 rounded-full bg-blue-600/30" /><div className="relative flex h-full flex-col px-20 py-20"><div className="flex items-center justify-between"><p className="text-sm font-bold tracking-[0.3em] text-cyan-300">{institute}</p>{logoUrl && <div className="h-16 w-16 overflow-hidden rounded-xl bg-white p-2"><img src={logoUrl} alt="Institute logo" className="h-full w-full object-contain" /></div>}</div><div className="mt-32"><p className="text-xl font-semibold tracking-[0.22em] text-cyan-300">{title}</p><h2 className="mt-6 text-6xl font-bold leading-tight">{topic}</h2><div className="mt-8 h-2 w-32 bg-cyan-400" /><p className="mt-8 text-xl text-slate-300">{course}</p></div><div className="mt-auto border-t border-white/30 pt-8"><p className="text-base text-slate-300">Prepared by</p><p className="mt-2 text-2xl font-bold">{author}</p><p className="mt-1 text-slate-300">{rollNumber}</p><div className="mt-8 flex justify-between text-sm text-slate-300"><span>{guide}</span><span>{session}</span></div></div></div></>}
        {template === "minimal" && <><div className="mx-16 mt-16 border-y-4 border-slate-900 py-7 text-center"><p className="text-lg font-bold tracking-[0.2em]">{institute}</p></div><div className="flex h-[calc(100%-170px)] flex-col px-24 py-24 text-center"><p className="text-sm font-bold tracking-[0.32em] text-slate-500">{title}</p><h2 className="mt-10 text-5xl font-bold leading-tight">{topic}</h2><p className="mt-8 text-xl text-slate-600">{subtitle}</p>{logoUrl && <div className="mx-auto mt-14 h-24 w-24 overflow-hidden"><img src={logoUrl} alt="Institute logo" className="h-full w-full object-contain" /></div>}<p className="mt-12 text-lg">{course}</p><div className="mt-auto text-base"><p className="font-bold">{author}</p><p className="mt-1">{rollNumber}</p><p className="mt-8">Submitted to: {guide}</p><p className="mt-2 text-slate-600">{session}</p></div></div></>}
      </div></div></aside>
    </section>
  </main>;
}
