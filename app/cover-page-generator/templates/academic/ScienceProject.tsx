"use client";

import type { AcademicTemplateData } from "./AcademicFrame";
import AcademicFrame from "./AcademicFrame";

interface Props {
  data: AcademicTemplateData;
}

export default function ScienceProject({ data }: Props) {
  return (
    <AcademicFrame
      variant="science"
      data={data}
    />
  );
}