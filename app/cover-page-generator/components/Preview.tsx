"use client";

import { memo } from "react";

import type { AcademicTemplateData } from "../templates/academic/AcademicFrame";
import AcademicTemplatePreview, { isAcademicTemplate } from "../templates/academic/AcademicTemplatePreview";

interface PreviewProps {
  templateId: string;
  data?: AcademicTemplateData;
  scale?: number;
}

function Preview({
  templateId,
  data,
  scale = 0.22,
}: PreviewProps) {
  const previewData = {
  institute: "DocSprintHub University",
  title: "PROJECT REPORT",
  subtitle: "ON",
  topic: "Artificial Intelligence Based System",
  course: "Bachelor of Computer Applications",
  author: "John Doe",
  rollNumber: "BCA-2026-001",
  guide: "Dr. A. Sharma",
  session: "2026-27",
  logoUrl: "",
  };

  if (!isAcademicTemplate(templateId)) {
    return (
      <div className="flex h-full min-h-[420px] items-center justify-center rounded-xl border border-dashed border-slate-300 bg-slate-100 text-sm text-slate-500">
        Template not found
      </div>
    );
  }

  return (
    <div className="relative h-full w-full overflow-hidden rounded-xl bg-white shadow-sm">
      <div
        className="origin-top-left"
        style={{
          transform: `scale(${scale})`,
          width: `${100 / scale}%`,
          height: `${100 / scale}%`,
        }}
      >
        <AcademicTemplatePreview templateId={templateId} data={data ?? previewData} />
      </div>
    </div>
  );
}

export default memo(Preview);
