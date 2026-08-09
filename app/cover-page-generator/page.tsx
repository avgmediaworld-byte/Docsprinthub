"use client";

import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import TemplateGallery from "./components/TemplateGallery";
import useCoverPage from "./templates/hooks/useCoverPage";
import AcademicTemplatePreview, { isAcademicTemplate } from "./templates/academic/AcademicTemplatePreview";

type PreviewVariant = "academic" | "modern" | "minimal" | "glass" | "split" | "hero" | "signature";

interface PreviewConfig {
  variant: PreviewVariant;
  background: string;
  accent: string;
  accent2: string;
  textColor: string;
  badge: string;
  accentShape: "circle" | "blob" | "stripe" | "angle";
}

function hashString(value: string) {
  return value.split("").reduce((sum, char) => sum + char.charCodeAt(0), 0);
}

function formatTemplateLabel(id: string) {
  return id
    .replace(/[-_]/g, " ")
    .replace(/\b\w/g, (char) => char.toUpperCase())
    .replace(/\bOf\b/g, "of");
}

function getPreviewConfig(templateId: string): PreviewConfig {
  const seed = hashString(templateId);
  const styles: PreviewConfig[] = [
    { variant: "academic", background: "bg-slate-50 text-slate-900", accent: "bg-blue-950", accent2: "bg-amber-400", textColor: "text-slate-900", badge: "Academic", accentShape: "circle" },
    { variant: "modern", background: "bg-slate-950 text-white", accent: "bg-cyan-400", accent2: "bg-blue-600/20", textColor: "text-white", badge: "Modern", accentShape: "blob" },
    { variant: "minimal", background: "bg-white text-slate-900", accent: "bg-slate-900", accent2: "bg-slate-200", textColor: "text-slate-900", badge: "Minimal", accentShape: "stripe" },
    { variant: "glass", background: "bg-slate-950 text-white", accent: "bg-white/10", accent2: "bg-cyan-300/15", textColor: "text-white", badge: "Glass", accentShape: "angle" },
    { variant: "split", background: "bg-white text-slate-900", accent: "bg-indigo-950", accent2: "bg-slate-100", textColor: "text-slate-900", badge: "Split", accentShape: "angle" },
    { variant: "hero", background: "bg-gradient-to-br from-violet-900 via-fuchsia-700 to-pink-500 text-white", accent: "bg-white/10", accent2: "bg-yellow-300/20", textColor: "text-white", badge: "Hero", accentShape: "blob" },
    { variant: "signature", background: "bg-amber-50 text-slate-950", accent: "bg-slate-950", accent2: "bg-slate-200", textColor: "text-slate-950", badge: "Signature", accentShape: "circle" },
  ];

  return styles[seed % styles.length];
}

function Input({ label, value, onChange, placeholder = "" }: { label: string; value: string; onChange: (value: string) => void; placeholder?: string }) {
  return <label className="block"><span className="text-sm font-bold text-slate-800">{label}</span><input value={value} onChange={(event) => onChange(event.target.value)} placeholder={placeholder} className="mt-2 w-full rounded-xl border border-slate-300 px-4 py-3 text-slate-900 outline-none placeholder:text-slate-400 focus:border-blue-600 focus:ring-2 focus:ring-blue-100" /></label>;
}

function renderPreview(config: PreviewConfig, data: { institute: string; title: string; subtitle: string; topic: string; course: string; author: string; rollNumber: string; guide: string; session: string; logoUrl: string; selectedTemplateId: string; }) {
  const shapeClasses = config.accentShape === "circle" ? "rounded-full" : config.accentShape === "blob" ? "rounded-3xl" : config.accentShape === "stripe" ? "-skew-y-6" : "rotate-6";
  const badgeTextColor = config.textColor.includes("white") ? "text-white" : "text-slate-900";

  return (
    <div className="relative flex h-full flex-col justify-between overflow-hidden px-10 py-10">
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className={`absolute -right-20 top-16 h-72 w-72 ${config.accent} ${shapeClasses} opacity-90`} />
        <div className={`absolute -left-16 bottom-16 h-64 w-64 ${config.accent2} ${shapeClasses} opacity-70`} />
      </div>
      <div className="relative z-10 flex h-full flex-col justify-between gap-8">
        <div className="flex items-center justify-between gap-4">
          <div>
            <p className={`inline-flex rounded-full px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.2em] ${config.accent} ${badgeTextColor}`}>{config.badge}</p>
            <p className={`mt-4 text-xs uppercase tracking-[0.32em] ${badgeTextColor}`}>Template · {formatTemplateLabel(data.selectedTemplateId)}</p>
          </div>
          <div className="flex h-16 w-16 items-center justify-center overflow-hidden rounded-3xl border border-white/20 bg-white/10 text-xl font-black text-white shadow-lg">
            {data.logoUrl ? <Image src={data.logoUrl} alt="Logo" width={64} height={64} unoptimized className="h-full w-full object-contain" /> : <span className="text-white">DS</span>}
          </div>
        </div>
        <div className="relative z-10 text-center">
          <p className={`mb-4 text-sm font-semibold uppercase tracking-[0.32em] ${config.textColor}`}>{data.institute}</p>
          <h1 className={`mx-auto max-w-3xl text-5xl font-black leading-tight ${config.textColor}`}>{data.topic}</h1>
          <p className={`mt-6 text-lg font-semibold ${config.textColor}`}>{data.course}</p>
        </div>
        <div className={`grid gap-3 rounded-3xl border p-6 ${config.accent2} bg-white/80 backdrop-blur-sm shadow-xl ${config.textColor}`}>
          <div>
            <p className="text-xs uppercase tracking-[0.24em] text-slate-500">Title</p>
            <p className="mt-2 text-xl font-bold text-slate-900">{data.title}</p>
          </div>
          <div className="grid gap-3 sm:grid-cols-2">
            <div>
              <p className="text-xs uppercase tracking-[0.24em] text-slate-500">Submitted by</p>
              <p className="mt-2 text-lg font-semibold text-slate-900">{data.author}</p>
              <p className="text-sm text-slate-600">{data.rollNumber}</p>
            </div>
            <div>
              <p className="text-xs uppercase tracking-[0.24em] text-slate-500">Submitted to</p>
              <p className="mt-2 text-lg font-semibold text-slate-900">{data.guide}</p>
              <p className="text-sm text-slate-600">{data.session}</p>
            </div>
          </div>
          <p className="text-xs uppercase tracking-[0.24em] text-slate-500">Subtitle</p>
          <p className="text-base font-medium text-slate-700">{data.subtitle}</p>
        </div>
      </div>
    </div>
  );
}

export default function CoverPageGeneratorPage() {
  const router = useRouter();

  return (
    <main className="min-h-screen bg-slate-50 text-slate-900">
      <header className="border-b border-slate-200 bg-white">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-5 py-4 sm:px-8">
          <Link href="/" className="inline-flex items-center gap-2 text-2xl font-bold tracking-tight sm:text-3xl">
            <Image src="/docsprinthub-logo.png" alt="DocSprintHub logo" width={38} height={38} className="h-9 w-9 object-contain" priority />
            DocSprint<span className="text-blue-600">Hub</span>
          </Link>
          <Link href="/resume-builder" className="rounded-xl bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-700 sm:px-5">
            Resume Builder
          </Link>
        </div>
      </header>
      <section className="border-b border-blue-100 bg-gradient-to-b from-blue-50 to-slate-50 px-5 py-8 text-center sm:px-8 sm:py-10">
        <p className="text-sm font-bold uppercase tracking-[0.2em] text-blue-700">DocSprintHub</p>
        <h1 className="mt-2 text-4xl font-bold tracking-tight text-slate-950 sm:text-5xl">Cover Page Generator</h1>
        <p className="mx-auto mt-3 max-w-2xl text-base leading-7 text-slate-600 sm:text-lg">Choose an A4-ready design, then customise every part on its own editor page.</p>
      </section>
      <section className="mx-auto w-full px-4 py-8 lg:px-6 xl:px-8 2xl:px-10" style={{ maxWidth: "1620px" }}>
        <TemplateGallery selectedTemplateId="" onSelectTemplate={(templateId) => router.push(`/cover-page-generator/editor/${encodeURIComponent(templateId)}`)} />
      </section>
    </main>
  );

  /* Legacy inline editor moved to the dedicated CoverPageEditor route.
  const {
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
  } = useCoverPage();

  const previewConfig = getPreviewConfig(selectedTemplateId);
  const previewData = { institute, title, subtitle, topic, course, author, rollNumber, guide, session, logoUrl, selectedTemplateId };
  const isLiveTemplate = isAcademicTemplate(selectedTemplateId);

  return <main className="min-h-screen bg-slate-50 text-slate-900">
    <style>{`@page { size: A4 portrait; margin: 0; } @media print { body * { visibility: hidden !important; } #cover-print, #cover-print * { visibility: visible !important; } #cover-print { position: fixed; left: 0; top: 0; width: 210mm !important; height: 297mm !important; margin: 0 !important; box-shadow: none !important; } }`}</style>
    <header className="border-b border-slate-200 bg-white"><div className="mx-auto flex max-w-7xl items-center justify-between px-5 py-4 sm:px-8"><Link href="/" className="inline-flex items-center gap-2 text-2xl font-bold tracking-tight sm:text-3xl"><Image src="/docsprinthub-logo.png" alt="DocSprintHub logo" width={38} height={38} className="h-9 w-9 object-contain" priority />DocSprint<span className="text-blue-600">Hub</span></Link><Link href="/resume-builder" className="rounded-xl bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-700 sm:px-5">Resume Builder</Link></div></header>
    <section className="border-b border-blue-100 bg-gradient-to-b from-blue-50 to-slate-50 px-5 py-8 text-center sm:px-8 sm:py-10"><p className="text-sm font-bold uppercase tracking-[0.2em] text-blue-700">DocSprintHub</p><h1 className="mt-2 text-4xl font-bold tracking-tight text-slate-950 sm:text-5xl">Cover Page Generator</h1><p className="mx-auto mt-3 max-w-2xl text-base leading-7 text-slate-600 sm:text-lg">Create a professional A4 cover page for assignments, reports and projects.</p></section>
    <section className="mx-auto w-full px-4 py-8 lg:px-6 xl:px-8 2xl:px-10" style={{ maxWidth: "1620px" }}>
      <TemplateGallery selectedTemplateId={selectedTemplateId} onSelectTemplate={handleSelectGalleryTemplate} />
    </section>
    {selectedTemplateId ? <section id="cover-page-editor" className="mx-auto grid max-w-7xl gap-7 px-5 py-7 sm:px-8 lg:grid-cols-[minmax(320px,0.8fr)_minmax(0,1.2fr)] lg:py-10">
      <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-7">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <h2 className="text-2xl font-bold">Cover page details</h2>
            <p className="mt-2 text-slate-600">Choose a template from the gallery and update your cover page details live.</p>
          </div>
          <div className="rounded-full bg-slate-100 px-4 py-2 text-sm font-semibold text-slate-700">Selected: {formatTemplateLabel(selectedTemplateId)}</div>
        </div>
        <div className="mt-4 rounded-3xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-600">Live preview updates whenever you select a template or change the fields below.</div>
        <div className="mt-7 grid gap-4"><Input label="Cover heading" value={title} onChange={setTitle} placeholder="PROJECT REPORT" /><Input label="Small heading" value={subtitle} onChange={setSubtitle} placeholder="ON" /><Input label="Project / assignment title" value={topic} onChange={setTopic} /><Input label="Course / subject" value={course} onChange={setCourse} /><div className="grid gap-4 sm:grid-cols-2"><Input label="Submitted by" value={author} onChange={setAuthor} /><Input label="Roll number" value={rollNumber} onChange={setRollNumber} /></div><div className="grid gap-4 sm:grid-cols-2"><Input label="Submitted to" value={guide} onChange={setGuide} /><Input label="Session / date" value={session} onChange={setSession} /></div><Input label="College / institute" value={institute} onChange={setInstitute} /><label><span className="text-sm font-bold text-slate-800">Institute logo (optional)</span><span className="mt-2 flex cursor-pointer items-center justify-center rounded-xl border border-dashed border-slate-300 px-4 py-3 text-sm font-semibold text-blue-700 hover:bg-blue-50">{logo ? logo.name : "Choose PNG or JPG"}<input type="file" accept="image/png,image/jpeg" className="sr-only" onChange={uploadLogo} /></span></label></div><div className="mt-7 grid gap-3 sm:grid-cols-2"><button type="button" onClick={() => exportFile("pdf")} disabled={isExporting} className="rounded-xl bg-blue-600 px-4 py-3 font-bold text-white hover:bg-blue-700 disabled:bg-blue-400">{isExporting ? "Preparing..." : "Download A4 PDF"}</button><button type="button" onClick={() => exportFile("jpg")} disabled={isExporting} className="rounded-xl border border-blue-600 px-4 py-3 font-bold text-blue-700 hover:bg-blue-50">Download JPG</button><button type="button" onClick={() => window.print()} className="rounded-xl border border-slate-300 px-4 py-3 font-bold text-slate-700 hover:bg-slate-50">Print A4</button><button type="button" onClick={reset} className="rounded-xl border border-slate-300 px-4 py-3 font-bold text-slate-700 hover:bg-slate-50">Reset</button></div>{error && <p role="alert" className="mt-4 rounded-xl bg-red-50 p-3 text-sm font-medium text-red-800">{error}</p>}
      </section>
      <aside className="overflow-auto rounded-2xl border border-slate-200 bg-slate-200 p-4 shadow-sm sm:p-6">
        <div className="mb-4 flex flex-wrap items-center justify-between gap-3 text-sm">
          <p className="font-semibold text-slate-600">Live A4 preview</p>
          <span className={`rounded-full px-3 py-1 text-[11px] font-semibold ${isLiveTemplate ? "bg-emerald-100 text-emerald-700" : "bg-amber-100 text-amber-700"}`}>
            {isLiveTemplate ? "Live production template" : "Blank cover preview"}
          </span>
        </div>
        <div className="min-w-[210mm] pb-2">
          <div id="cover-print" ref={pageRef} className={`relative overflow-hidden shadow-xl ${previewConfig.background}`} style={{ width: "210mm", height: "297mm" }}>
            {isLiveTemplate ? <AcademicTemplatePreview templateId={selectedTemplateId} data={previewData} /> : renderPreview(previewConfig, previewData)}
          </div>
        </div>
      </aside>
    </section> : <section className="mx-auto max-w-7xl px-5 pb-12 pt-2 text-center sm:px-8"><p className="rounded-2xl border border-dashed border-slate-300 bg-white px-6 py-7 text-sm font-medium text-slate-600">Select a template above to open the cover page editor and customise its details.</p></section>}
  </main>;
  */
}
