"use client";

import type { AcademicTemplateData } from "./AcademicFrame";
import AcademicFrame from "./AcademicFrame";

interface Props {
  data: AcademicTemplateData;
}

export default function ElegantBorder({ data }: Props) {
  return <AcademicFrame variant="elegant" data={data} />;
}
