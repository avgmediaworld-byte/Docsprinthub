"use client";

import { useMemo, useState } from "react";
import TemplateCard from "./TemplateCard";
import { galleryController } from "../gallery";
import SearchBar from "./SearchBar";
import CategoryTabs, { type TemplateCategory } from "./CategoryTabs";

interface TemplateGalleryProps {
  selectedTemplateId: string;
  onSelectTemplate: (id: string) => void;
}

export default function TemplateGallery({ selectedTemplateId, onSelectTemplate }: TemplateGalleryProps) {
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState<TemplateCategory>("all");
  const templates = useMemo(() => galleryController.filterTemplates({ search, category }), [search, category]);

  return (
    <section aria-labelledby="template-gallery-heading">
      <h2 id="template-gallery-heading" className="sr-only">Template gallery</h2>

      <div className="mb-6 flex flex-wrap items-center gap-4">
        <div className="w-full" style={{ flex: "1 1 320px", maxWidth: "360px", minWidth: "260px" }}>
          <SearchBar value={search} onChange={setSearch} placeholder="Search templates..." />
        </div>
        <div style={{ flex: "1 1 760px" }}>
          <CategoryTabs selectedCategory={category} onCategoryChange={setCategory} />
        </div>
      </div>

      <div
        className="grid"
        style={{
          columnGap: "1.75rem",
          gridTemplateColumns: "repeat(auto-fill, minmax(min(100%, 260px), 1fr))",
          rowGap: "2rem",
        }}
      >
        <button type="button" onClick={() => onSelectTemplate("blank-cover")} className="group text-left outline-none transition hover:-translate-y-1 focus-visible:ring-4 focus-visible:ring-blue-200">
          <div className={`flex items-center justify-center rounded-2xl border bg-slate-50 transition ${selectedTemplateId === "blank-cover" ? "border-blue-600 bg-blue-50 shadow-[0_12px_30px_rgba(37,99,235,0.18)] ring-2 ring-inset ring-blue-600" : "border-slate-200 group-hover:border-slate-300 group-hover:bg-white group-hover:shadow-lg"}`} style={{ aspectRatio: "210 / 297" }}>
            <div className="text-center text-slate-900"><span className="mx-auto flex h-12 w-12 items-center justify-center rounded-full border border-slate-300 text-3xl font-light leading-none transition group-hover:border-blue-500 group-hover:text-blue-700">+</span><p className="mt-4 text-sm font-semibold">Create a blank Cover Page</p></div>
          </div>
          <p className="px-1 pt-3 text-[15px] font-semibold text-slate-900">Blank cover page</p>
        </button>

        {templates.length === 0 ? (
          <div className="col-span-full rounded-2xl border border-dashed border-slate-300 bg-white px-8 py-20 text-center"><h3 className="text-xl font-bold text-slate-700">No templates found</h3><p className="mt-2 text-slate-500">Try another keyword or category.</p></div>
        ) : templates.map((template) => (
          <TemplateCard key={template.id} template={template} selected={selectedTemplateId === template.id} onSelect={() => onSelectTemplate(template.id)} />
        ))}
      </div>
    </section>
  );
}
