"use client";

import type { AcademicTemplateData } from "./AcademicFrame";
import AcademicFrame from "./AcademicFrame";

interface Props {
  data: AcademicTemplateData;
}

export default function ModernUniversity({ data }: Props) {
  return (
    <AcademicFrame
      variant="modern"
      data={data}
    />
  );
}