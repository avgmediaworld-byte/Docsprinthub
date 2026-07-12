"use client";

import React from "react";
import { useRouter } from "next/navigation";

import {
  GraduationCap,
  BriefcaseBusiness,
  Sparkles,
  HeartHandshake,
} from "lucide-react";

import TemplateCard from "./TemplateCard";
import { ResumeData } from "../types/resume";


type TemplateType = "biodata" | "fresher" | "classic" | "modern";
type Props = {
  data: ResumeData;
  setData: React.Dispatch<React.SetStateAction<ResumeData>>;
  onContinue: () => void;
};

const templates: {
  id: TemplateType;
  title: string;
  subtitle: string;
  badge: string;
  features: string[];
  icon: React.ElementType;
  theme: "red" | "blue" | "green" | "purple";
}[] = [

  {
  id: "biodata",
  title: "Biodata",
  subtitle: "Marriage / Personal Profile",
  badge: "New",
  features: ["Marriage", "Personal"],
  icon: HeartHandshake,
  theme: "red",
  },
  {
    id: "fresher",
    title: "Fresher",
    subtitle: "Students & Entry Level",
    badge: "Popular",
    features: ["Student Friendly", "Easy to Customize"],
    icon: GraduationCap,
    theme: "blue",
  },

  {
    id: "classic",
    title: "Classic",
    subtitle: "Professional & ATS Friendly",
    badge: "Professional",
    features: ["ATS Friendly", "Professional Look"],
    icon: BriefcaseBusiness,
    theme: "green",
  },

  {
    id: "modern",
    title: "Modern",
    subtitle: "Stylish & Creative",
    badge: "Trending",
    features: ["Creative Design", "Stand Out"],
    icon: Sparkles,
    theme: "purple",
  },
];

export default function TemplateSelector({
  data,
  setData,
  onContinue,
}: Props) {

  const router = useRouter();

  return (

      <section className="max-w-[1200px] mx-auto px-8 pt-6 pb-10">

      {/* Heading */}

      <div className="text-center mb-8">

        <h1 className="text-4xl font-bold text-slate-900">
          Choose Your Resume Template
        </h1>

        <p className="mt-3 text-lg text-slate-500">
          Select a template before filling your details.
        </p>

      </div>

      {/* Cards */}

      <div
            className="
            grid 
            mt-6
            grid-cols-1
            lg:grid-cols-2
            gap-6
            justify-items-center
            "
          >
            {templates.map((template) => (
            <TemplateCard
              key={template.id}
              template={template}
              selected={data.template === template.id}
              onClick={() =>
                setData((prev) => ({
                  ...prev,
                  template: template.id,
                }))
              }
            />
          ))}


      </div>
            {/* Bottom Buttons */}

      <div className="mt-8 flex flex-wrap items-center justify-center gap-4">

        <button
          onClick={() => router.push("/")}
          className="
          inline-flex
          items-center
          justify-center
          px-8
          py-3
          rounded-2xl
          border
          border-slate-300
          bg-white
          text-slate-700
          font-medium
          transition-all
          duration-300
          hover:bg-slate-50
          hover:border-slate-400
          "
        >
          ← Back to Home
        </button>

        <button
          onClick={onContinue}
          disabled={!data.template}
          className="
          inline-flex
          items-center
          justify-center
          px-8
          py-3
          rounded-2xl
          bg-blue-600
          text-white
          font-semibold
          shadow-lg
          transition-all
          duration-300
          hover:bg-blue-700
          hover:shadow-xl
          "
        >
          Continue →
        </button>

      </div>

      <p className="mt-6 text-center text-sm text-gray-500">
        You can change your template anytime later.
      </p>

    </section>

  );

}