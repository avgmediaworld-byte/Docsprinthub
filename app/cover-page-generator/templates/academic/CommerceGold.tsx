"use client";

import type { AcademicTemplateData } from "./AcademicFrame";
import AcademicFrame from "./AcademicFrame";

interface Props {
  data: AcademicTemplateData;
}

export default function CommerceGold({ data }: Props) {
  return <AcademicFrame variant="commerce" data={data} />;
}
