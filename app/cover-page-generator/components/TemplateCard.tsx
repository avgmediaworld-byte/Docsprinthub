"use client";

import type { TemplateRegistryItem } from "../data/templateList";
import CoverThumbnail from "./CoverThumbnail";

interface TemplateCardProps {
  template: TemplateRegistryItem;
  selected?: boolean;
  onSelect?: () => void;
}

export default function TemplateCard({ template, selected = false, onSelect }: TemplateCardProps) {
  return (
    <button
      type="button"
      onClick={onSelect}
      className={`group relative w-full text-left outline-none transition duration-200 focus-visible:ring-4 focus-visible:ring-blue-200 ${selected ? "-translate-y-0.5" : "hover:-translate-y-1"}`}
    >
      <div className={`relative overflow-hidden rounded-2xl border bg-white transition-shadow duration-200 ${selected ? "border-blue-600 shadow-[0_12px_30px_rgba(37,99,235,0.2)]" : "border-slate-200 shadow-sm group-hover:border-slate-300 group-hover:shadow-lg"}`}>
        <div className="w-full" style={{ aspectRatio: "210 / 297" }}><CoverThumbnail template={template} /></div>
        <div className={`absolute inset-0 pointer-events-none transition ${selected ? "ring-2 ring-inset ring-blue-600" : "opacity-0 group-hover:opacity-100 group-focus-visible:opacity-100"}`} />
        <div className={`absolute right-3 top-3 rounded-full px-3 py-1 text-xs font-bold transition ${selected ? "bg-blue-600 text-white" : "bg-slate-950/75 text-white opacity-0 group-hover:opacity-100"}`}>
          {selected ? "Selected" : "Use template"}
        </div>
      </div>
      <div className="flex items-center gap-2 px-1 pt-3">
        <h3 className="truncate text-[15px] font-semibold text-slate-900">{template.name}</h3>
        {template.badge === "new" && <span className="rounded-full bg-blue-50 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide text-blue-700">New</span>}
      </div>
    </button>
  );
}
