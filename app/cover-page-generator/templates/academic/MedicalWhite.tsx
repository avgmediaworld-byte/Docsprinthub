"use client";

import type { AcademicTemplateData } from "./AcademicFrame";
import AcademicFrame from "./AcademicFrame";

interface Props {
  data: AcademicTemplateData;
}

export default function MedicalWhite({ data }: Props) {
  return <AcademicFrame data={data} variant="medical" />;
}
