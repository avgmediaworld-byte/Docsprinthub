"use client";

import type { AcademicTemplateData } from "./AcademicFrame";
import AcademicFrame from "./AcademicFrame";

interface Props {
  data: AcademicTemplateData;
}

export default function EngineeringBlue({ data }: Props) {
  return <AcademicFrame data={data} variant="engineering" />;
}
