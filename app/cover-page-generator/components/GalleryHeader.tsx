"use client";

interface GalleryHeaderProps {
  totalTemplates: number;
}

export default function GalleryHeader({
  totalTemplates,
}: GalleryHeaderProps) {
  return (
    <div className="mb-8 overflow-hidden rounded-3xl border border-slate-200 bg-gradient-to-r from-blue-50 via-white to-indigo-50">
      <div className="flex flex-col gap-8 p-8 lg:flex-row lg:items-center lg:justify-between">
        {/* Left */}
        <div className="max-w-3xl">
          <span className="inline-flex items-center rounded-full bg-blue-100 px-4 py-1 text-xs font-bold uppercase tracking-[0.25em] text-blue-700">
            Cover Page Gallery
          </span>

          <h1 className="mt-5 text-4xl font-black tracking-tight text-slate-900">
            Professional Cover Page Templates
          </h1>

          <p className="mt-4 max-w-2xl text-base leading-7 text-slate-600">
            Browse premium templates for School, College, University,
            Research, Corporate and Professional documents.
            Every template is fully editable and print-ready.
          </p>
        </div>

        {/* Right */}
        <div className="grid grid-cols-2 gap-4 lg:w-[340px]">
          <div className="rounded-2xl bg-white p-5 shadow-sm">
            <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">
              Templates
            </p>

            <h2 className="mt-2 text-3xl font-black text-blue-700">
              {totalTemplates}
            </h2>
          </div>

          <div className="rounded-2xl bg-white p-5 shadow-sm">
            <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">
              Categories
            </p>

            <h2 className="mt-2 text-3xl font-black text-emerald-600">
              5
            </h2>
          </div>

          <div className="rounded-2xl bg-white p-5 shadow-sm">
            <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">
              Editable
            </p>

            <h2 className="mt-2 text-3xl font-black text-purple-600">
              100%
            </h2>
          </div>

          <div className="rounded-2xl bg-white p-5 shadow-sm">
            <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">
              Print Ready
            </p>

            <h2 className="mt-2 text-3xl font-black text-orange-500">
              A4
            </h2>
          </div>
        </div>
      </div>
    </div>
  );
}