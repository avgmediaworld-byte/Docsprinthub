"use client";

import CareerObjectiveForm from "./CareerObjectiveForm";
import PersonalDetails from "./PersonalDetails";
import Education from "./Education";
import Experience from "./Experience";
import Skills from "./Skills";
import Certificates from "./Certificates";
import Declaration from "./Declaration";

import { ResumeData } from "../types/resume";

type ResumeFormProps = {
data: ResumeData;
  setData: React.Dispatch<React.SetStateAction<ResumeData>>;
  onPreview: () => void;
  setStep: (step: "template" | "form" | "preview") => void;
};

export default function ResumeForm({
  data,
  setData,
  onPreview,
  setStep
  }: ResumeFormProps) {
  
    return (
    <div className="bg-white rounded-xl shadow-lg p-6 space-y-6">

      <PersonalDetails
        data={data}
        setData={setData}
      />

      <CareerObjectiveForm
        data={data}
        setData={setData}
      />

      <Education
        data={data}
        setData={setData}
      />

      <Experience
        data={data}
        setData={setData}
      />

      <Skills
        data={data}
        setData={setData}
      />

      <Certificates
        data={data}
        setData={setData}
      />

      <Declaration
        data={data}
        setData={setData}
      />

<div className="mt-6 grid grid-cols-2 gap-4">

  <button
    type="button"
    onClick={() => setStep("template")}
    className="
      h-10
      rounded-2xl
      border-2
      border-blue-600
      bg-white
      text-blue-600
      font-semibold
      transition-all
      duration-300
      hover:bg-blue-50
    "
  >
    ← Back to Template
  </button>

  <button
    type="button"
    onClick={onPreview}
    className="
      h-10
      rounded-2xl
      bg-blue-600
      text-white
      font-semibold
      shadow-lg
      transition-all
      duration-300
      hover:bg-blue-700
    "
  >
    Preview Resume →
  </button>

  </div>

    </div>
  );
}