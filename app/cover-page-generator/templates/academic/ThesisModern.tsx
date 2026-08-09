"use client";

import type { AcademicTemplateData } from "./AcademicFrame";
import AcademicFrame from "./AcademicFrame";

interface Props {
  data: AcademicTemplateData;
}

export default function ThesisModern({ data }: Props) {
  return (
    <AcademicFrame
      variant="thesis"
      data={data}
    />
  );
}