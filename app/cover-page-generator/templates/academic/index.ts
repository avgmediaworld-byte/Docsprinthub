"use client";

import type { ComponentType } from "react";
import type { AcademicTemplateData } from "./AcademicFrame";
import AcademicFrame from "./AcademicFrame";
import CommerceGold from "./CommerceGold";
import ComputerScience from "./ComputerScience";
import EducationTheme from "./EducationTheme";
import ElegantBorder from "./ElegantBorder";
import EngineeringBlue from "./EngineeringBlue";
import LawProfessional from "./LawProfessional";
import MedicalWhite from "./MedicalWhite";
import MinimalAcademic from "./MinimalAcademic";
import ModernUniversity from "./ModernUniversity";
import PremiumAcademic from "./PremiumAcademic";
import ResearchPaper from "./ResearchPaper";
import ScienceProject from "./ScienceProject";
import ThesisModern from "./ThesisModern";
import UniversityClassic from "./UniversityClassic";

export type AcademicTemplateComponent = ComponentType<{ data: AcademicTemplateData }>;

const ACADEMIC_TEMPLATES: Record<string, AcademicTemplateComponent> = {
  "academic-frame": AcademicFrame,
  "commerce-gold": CommerceGold,
  "computer-science": ComputerScience,
  "education-theme": EducationTheme,
  "elegant-border": ElegantBorder,
  "engineering-blue": EngineeringBlue,
  "law-professional": LawProfessional,
  "medical-white": MedicalWhite,
  "minimal-academic": MinimalAcademic,
  "modern-university": ModernUniversity,
  "premium-academic": PremiumAcademic,
  "research-paper": ResearchPaper,
  "science-project": ScienceProject,
  "thesis-modern": ThesisModern,
  "university-classic": UniversityClassic,
};

export function getAcademicTemplateComponent(id: string): AcademicTemplateComponent | null {
  return ACADEMIC_TEMPLATES[id] ?? null;
}
