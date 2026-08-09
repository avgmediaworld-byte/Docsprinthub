"use client";

import type { AcademicTemplateData } from "./AcademicFrame";
import AcademicFrame from "./AcademicFrame";

interface Props {
  data: AcademicTemplateData;
}

export default function ResearchPaper({ data }: Props) {
  return (
    <AcademicFrame
      variant="research"
      data={data}
    />
  );
}