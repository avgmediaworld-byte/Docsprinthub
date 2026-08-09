"use client";

import type { AcademicTemplateData } from "./AcademicFrame";
import AcademicFrame from "./AcademicFrame";

interface Props {
  data: AcademicTemplateData;
}

export default function EducationTheme({ data }: Props) {
  return <AcademicFrame variant="education" data={data} />;
}
