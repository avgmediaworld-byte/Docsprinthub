"use client";

import type { AcademicTemplateData } from "./AcademicFrame";
import AcademicFrame from "./AcademicFrame";

interface Props {
  data: AcademicTemplateData;
}

export default function ComputerScience({ data }: Props) {
  return <AcademicFrame variant="computer" data={data} />;
}
