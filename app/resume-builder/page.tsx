"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import ResumeForm from "./components/ResumeForm";
import { ResumeData } from "./types/resume";
import TemplateSelector from "./components/TemplateSelector";
import { downloadResumePDF } from "./utils/downloadPdf";
import "./styles/print.css";
import { downloadResumeImage } from "./utils/downloadImage";
import ResumePreview from "./components/ResumePreview";
import { printResume } from "./utils/printResume";



export default function ResumeBuilderPage() {
  const [step, setStep] = useState <"template" | "form" | "preview">("template");
  const [isReady, setIsReady] = useState(false);

  const [resumeData, setResumeData] = useState<ResumeData>({
    template: "classic",

    personal: {
      photo: "",

      fullName: "",

      email: "",

      phone: "",

      alternatePhone: "",

      fatherName: "",

      motherName: "",

      spouseName: "",

      dob: "",

      languages: "",

      hobbies: "",

      correspondenceAddress: "",

      permanentAddress: "",

      sameAddress: false,

      extraFields: [],
    },

    objective: "",

    education: [
      {
        id: "1",
        course: "High School",
        institute: "",
        board: "",
        year: "",
        division: "",
        percentage: "",
        status: "Completed",
      },
      {
        id: "2",
        course: "Intermediate",
        institute: "",
        board: "",
        year: "",
        division: "",
        percentage: "",
        status: "Completed",
      },
      {
        id: "3",
        course: "Graduation",
        institute: "",
        board: "",
        year: "",
        division: "",
        percentage: "",
        status: "Completed",
      },
    ],

    experience: [
      {
        id: "1",
        designation: "",
        company: "",
        duration: "",
        description: "",
      },
    ],

    skills: [],

    certificates: [],

    declaration: {
      enabled: true,
      type: "standard",
      place: "",
      date: "",
      text:
        "I hereby declare that the information provided above is true and correct to the best of my knowledge and belief.",
    },
  });
  
    useEffect(() => {
    const savedData = sessionStorage.getItem("resumeData");
    const savedStep = sessionStorage.getItem("resumeStep");

    if (savedData) {
      setResumeData(JSON.parse(savedData));
    }

  if (
    savedStep === "template" ||
    savedStep === "form" ||
    savedStep === "preview"
  ) {
    setStep(savedStep);
  }
   setIsReady(true);
    },[]);

  useEffect(() => {
    sessionStorage.setItem(
      "resumeData",
      JSON.stringify(resumeData)
    );
  }, [resumeData]);

  useEffect(() => {
    sessionStorage.setItem("resumeStep", step);
  }, [step]);
  

const downloadPDF = async () => {
  const button = document.getElementById("pdf-download-btn");
  const title = document.getElementById("preview-title");

  console.log("PAGE-2 : Before downloadResumePDF");

  await downloadResumePDF({
    filename: `${resumeData.personal.fullName || "Resume"}.pdf`,

    beforeDownload: () => {
      if (button) button.style.display = "none";
      if (title) title.style.display = "none";
    },

    afterDownload: () => {
      if (button) button.style.display = "block";
      if (title) title.style.display = "block";
    },
  });

  console.log("PAGE-3 : After downloadResumePDF");


};

    if (!isReady) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        Loading...
      </div>
    );
  }


 const downloadJPG = async () => {
  const button = document.getElementById("pdf-download-btn");
  const title = document.getElementById("preview-title");

  await downloadResumeImage({
    filename: `${resumeData.personal.fullName || "Resume"}`,

    beforeDownload: () => {
      if (button) button.style.display = "none";
      if (title) title.style.display = "none";
    },

    afterDownload: () => {
      if (button) button.style.display = "block";
      if (title) title.style.display = "block";
    },
  });
};

  return (
    <main className="min-h-screen bg-gray-100 text-slate-950">
      <header className="border-b border-slate-200 bg-white">
        <div className="flex w-full items-center justify-between px-5 py-4 sm:px-8">
          <Link href="/" className="inline-flex items-center gap-2 text-2xl font-bold tracking-tight sm:text-3xl">
            <Image src="/docsprinthub-logo.png" alt="DocSprintHub logo" width={38} height={38} className="h-9 w-9 object-contain" priority />
            <span className="whitespace-nowrap">DocSprint<span className="text-blue-600">Hub</span></span>
          </Link>
          <span className="text-base font-bold text-slate-800">Resume Builder</span>
        </div>
      </header>

      <div className="px-4 py-10">
      <div className="mx-auto max-w-6xl">
        {step === "form" && (
          <h3 className="mb-8 text-center text-xl font-medium text-gray-600">
              Create your professional resume in minutes.
          </h3>
        )}

      {step === "template" ? (
        <TemplateSelector
          data={resumeData}
          setData={setResumeData}
          onContinue={() => setStep("form")}
        />
      ) : step === "form" ? (
        <ResumeForm
          data={resumeData}
          setData={setResumeData}
          onPreview={() => setStep("preview")}
          setStep={setStep}
        />
      ) : (
      <ResumePreview
          data={resumeData}
          onPDF={downloadPDF}
          onJPG={downloadJPG}
          onPrint={printResume}
          onBack={() => setStep("form")}
      />
      )}
      </div>
      </div>
    </main>
  );
}
