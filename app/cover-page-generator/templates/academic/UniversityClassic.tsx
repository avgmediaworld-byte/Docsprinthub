"use client";

import type { AcademicTemplateData } from "./AcademicFrame";
import AcademicFrame from "./AcademicFrame";

interface Props {
  data: AcademicTemplateData;
}

export default function UniversityClassic({ data }: Props) {
  return (
    <AcademicFrame
      variant="university"
      data={data}
    />
  );
}