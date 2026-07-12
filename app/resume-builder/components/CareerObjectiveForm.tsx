"use client";

import { ResumeData } from "../types/resume";

type Props = {
  data: ResumeData;
  setData: React.Dispatch<React.SetStateAction<ResumeData>>;
};

const objectiveTemplates: Record<string, string> = {
  Fresher:
    "To secure a challenging position where I can apply my knowledge, skills and enthusiasm while continuously learning and contributing to the organization.",

  Teacher:
    "To obtain a responsible teaching position where I can inspire students, contribute to academic excellence and support the overall development of the institution.",

  "Software Developer":
    "To work as a Software Developer where I can utilize my programming skills, creativity and problem-solving abilities to build innovative software solutions.",

  "Computer Operator":
    "To obtain a Computer Operator position where I can effectively utilize my computer skills, accuracy and dedication.",

  "Data Entry Operator":
    "To obtain a Data Entry Operator position where I can maintain accuracy and efficiency while handling organizational data.",

  Accountant:
    "To work in a challenging accounting environment where I can apply my financial knowledge and analytical skills.",

  "Sales Executive":
    "To build a successful career in Sales by providing excellent customer service and achieving organizational goals.",

  Marketing:
    "To work in a dynamic marketing environment where I can contribute through creativity and communication skills.",

  "General Professional":
    "To work in a challenging and growth-oriented organization where I can utilize my knowledge, skills and abilities for mutual growth.",

  Custom: "",
};

export default function CareerObjectiveForm({
  data,
  setData,
}: Props) {
  const handleSelect = (value: string) => {
    setData({
      ...data,
      objective: objectiveTemplates[value] || "",
    });
  };

  return (
    <div className="bg-white rounded-xl shadow-0 p-6 mb-6">

      <h2 className="text-xl font-bold mb-4">
        🎯 Career Objective
      </h2>

      <select
        className="w-full border rounded-lg p-3 mb-4"
        onChange={(e) => handleSelect(e.target.value)}
      >
        <option>Select Career Objective</option>

        {Object.keys(objectiveTemplates).map((item) => (
          <option key={item} value={item}>
            {item}
          </option>
        ))}
      </select>

      <textarea
        rows={3}
        placeholder="Write your career objective..."
        value={data.objective}
        onChange={(e) =>
          setData({
            ...data,
            objective: e.target.value,
          })
        }
        className="w-full border rounded-lg p-3 resize-none"
      />
    </div>
  );
}