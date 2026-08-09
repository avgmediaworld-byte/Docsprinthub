"use client";

import type { AcademicTemplateData } from "./AcademicFrame";
import ThemeDrivenCover, { THEME_DRIVEN_TEMPLATE_IDS, type CoverDesignOverrides } from "../ThemeDrivenCover";

export interface AcademicTemplatePreviewProps {
  templateId: string;
  data: AcademicTemplateData;
  design?: CoverDesignOverrides;
  thumbnail?: boolean;
}

export function isAcademicTemplate(templateId: string) {
  return THEME_DRIVEN_TEMPLATE_IDS.has(templateId);
}

export default function AcademicTemplatePreview({ templateId, data, design, thumbnail = false }: AcademicTemplatePreviewProps) {
  return <ThemeDrivenCover templateId={templateId} data={data} design={design} thumbnail={thumbnail} />;
}
