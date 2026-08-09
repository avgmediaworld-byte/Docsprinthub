/* ===========================================================
   DocSprintHub
   Component Registry
   React Template Mapping
   Version : 1.0.0
=========================================================== */

import type { ComponentType } from "react";
import type { AcademicTemplateData } from "../templates/academic/AcademicFrame";

/* ===========================================================
   Academic Templates
=========================================================== */

import AcademicFrame from "../templates/academic/AcademicFrame";
import ComputerScience from "../templates/academic/ComputerScience";
import EducationTheme from "../templates/academic/EducationTheme";
import ElegantBorder from "../templates/academic/ElegantBorder";
import EngineeringBlue from "../templates/academic/EngineeringBlue";
import LawProfessional from "../templates/academic/LawProfessional";
import MedicalWhite from "../templates/academic/MedicalWhite";
import MinimalAcademic from "../templates/academic/MinimalAcademic";
import ModernUniversity from "../templates/academic/ModernUniversity";
import PremiumAcademic from "../templates/academic/PremiumAcademic";
import ResearchPaper from "../templates/academic/ResearchPaper";
import ScienceProject from "../templates/academic/ScienceProject";
import ThesisModern from "../templates/academic/ThesisModern";
import UniversityClassic from "../templates/academic/UniversityClassic";

/* ===========================================================
   Background Registry
=========================================================== */

import GradientBlue from "../data/backgrounds/GradientBlue";
import MinimalWhite from "../data/backgrounds/MinimalWhite";
import NavyLuxury from "../data/backgrounds/NavyLuxury";
import RoyalPurple from "../data/backgrounds/RoyalPurple";
import GreenNature from "../data/backgrounds/GreenNature";

/* ===========================================================
   Decoration Registry
=========================================================== */

import WaveTop from "../data/decorations/WaveTop";
import WaveBottom from "../data/decorations/WaveBottom";
import CirclePattern from "../data/decorations/CirclePattern";
import Dots from "../data/decorations/Dots";
import Hexagon from "../data/decorations/Hexagon";
import CornerRibbon from "../data/decorations/CornerRibbon";

const DECORATION_COMPONENTS = {
  "wave-top": WaveTop,
  "wave-bottom": WaveBottom,
  "circle-pattern": CirclePattern,
  "dots": Dots,
  "hexagon": Hexagon,
  "corner-ribbon": CornerRibbon,
} as const;

export function getDecorationComponent(id: string) {
  return (
    DECORATION_COMPONENTS[
      id as keyof typeof DECORATION_COMPONENTS
    ] ?? null
  );
}

/* ===========================================================
   Layout Registry
=========================================================== */

import Academic01 from "../data/layouts/Academic01";
import Academic02 from "../data/layouts/Academic02";
import Corporate01 from "../data/layouts/Corporate01";
import Corporate02 from "../data/layouts/Corporate02";
import Creative01 from "../data/layouts/Creative01";

const LAYOUT_COMPONENTS = {
  academic01: Academic01,
  academic02: Academic02,
  corporate01: Corporate01,
  corporate02: Corporate02,
  creative01: Creative01,
} as const;

export function getLayoutComponent(id: string) {
  return (
    LAYOUT_COMPONENTS[
      id as keyof typeof LAYOUT_COMPONENTS
    ] ?? null
  );
}

/* ===========================================================
   Component Map
=========================================================== */

export const TemplateComponentRegistry = new Map<
  string,
  ComponentType<{ data: AcademicTemplateData }>
>();

/* ===========================================================
   Academic
=========================================================== */

TemplateComponentRegistry.set(
  "academic-frame",
  AcademicFrame
);

TemplateComponentRegistry.set(
  "computer-science",
  ComputerScience
);

TemplateComponentRegistry.set(
  "education-theme",
  EducationTheme
);

TemplateComponentRegistry.set(
  "elegant-border",
  ElegantBorder
);

TemplateComponentRegistry.set(
  "engineering-blue",
  EngineeringBlue
);

TemplateComponentRegistry.set(
  "law-professional",
  LawProfessional
);

TemplateComponentRegistry.set(
  "medical-white",
  MedicalWhite
);

TemplateComponentRegistry.set(
  "minimal-academic",
  MinimalAcademic
);

TemplateComponentRegistry.set(
  "modern-university",
  ModernUniversity
);

TemplateComponentRegistry.set(
  "premium-academic",
  PremiumAcademic
);

TemplateComponentRegistry.set(
  "research-paper",
  ResearchPaper
);

TemplateComponentRegistry.set(
  "science-project",
  ScienceProject
);

TemplateComponentRegistry.set(
  "thesis-modern",
  ThesisModern
);

TemplateComponentRegistry.set(
  "university-classic",
  UniversityClassic
);

/* ===========================================================
   Public API
=========================================================== */

export function getTemplateComponent(
  id: string
) {
  return (
    TemplateComponentRegistry.get(id) ??
    null
  );
}

export function hasTemplateComponent(
  id: string
): boolean {
  return TemplateComponentRegistry.has(id);
}

export function getRegisteredTemplateIds() {
  return Array.from(
    TemplateComponentRegistry.keys()
  );
}

export function getRegisteredComponentCount() {
  return TemplateComponentRegistry.size;
}

/* ===========================================================
   Registry
=========================================================== */

export const ComponentRegistry = {

  registry: TemplateComponentRegistry,

  getTemplateComponent,

  hasTemplateComponent,

  getRegisteredTemplateIds,

  getRegisteredComponentCount,

} as const;

export default ComponentRegistry;


const BACKGROUND_COMPONENTS = {
  "gradient-blue": GradientBlue,
  "minimal-white": MinimalWhite,
  "navy-luxury": NavyLuxury,
  "royal-purple": RoyalPurple,
  "green-nature": GreenNature,
}as const;

export function getBackgroundComponent(id: string) {
  return (
    BACKGROUND_COMPONENTS[
      id as keyof typeof BACKGROUND_COMPONENTS
    ] ?? null
  );
}
