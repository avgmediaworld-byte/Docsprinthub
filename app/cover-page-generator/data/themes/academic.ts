/* ===========================================================
   DocSprintHub
   Academic Theme Collection
   Part - 1 (Foundation)
   Version : 1.0
=========================================================== */

import {

  createTheme,

  type ThemeConfiguration,

} from "./base";

/* ===========================================================
   Academic Theme IDs
=========================================================== */

export type AcademicThemeId =

  | "academic-frame"

  | "university-classic"

  | "research-paper"

  | "thesis-modern"

  | "engineering-blue"

  | "medical-white"

  | "commerce-gold"

  | "computer-science"

  | "education-theme"

  | "elegant-border"

  | "education-classic"

  | "minimal-academic"

  | "modern-university"

  | "premium-academic"

  | "law-professional";

/* ===========================================================
   Academic Base Theme
=========================================================== */

export const AcademicBaseTheme = createTheme({

  id: "academic-frame",

  name: "Academic Base",

  mode: "light",

  variant: "modern",

  layoutId: "academic01",

  backgroundId: "gradient-blue",

  decorationIds: [
    "wave-top",
    "wave-bottom",
  ],

  status: "stable",

  palette: {

    primary: "#1E40AF",

    secondary: "#2563EB",

    accent: "#3B82F6",

    success: "#16A34A",

    warning: "#D97706",

    danger: "#DC2626",

    text: "#111827",

    muted: "#6B7280",

    border: "#D1D5DB",

    background: "#FFFFFF",

  },

  typography: {

    headingFont: "Poppins",

    bodyFont: "Inter",

    headingWeight: 700,

    bodyWeight: 400,

    lineHeight: 1.6,

  },

  spacing: {

    page: 40,

    section: 24,

    content: 16,

  },

});

/* ===========================================================
   Theme Registry
=========================================================== */

export const AcademicThemes: ThemeConfiguration[] = [

  AcademicBaseTheme,

];

/* ===========================================================
   Category Metadata
=========================================================== */

export const AcademicThemeCollection = {

  id: "academic",

  name: "Academic",

  description:

    "Professional academic cover page themes.",

  totalThemes: 10,

};

/* ===========================================================
   Academic Theme Collection
   Part - 2 (Premium Academic Themes)
   Version : 1.0
=========================================================== */

/* ===========================================================
   Academic Frame
=========================================================== */

export const AcademicFrameTheme = createTheme({

  ...AcademicBaseTheme,

  id: "academic-frame",

  name: "Academic Frame",

});

/* ===========================================================
   University Classic
=========================================================== */

export const UniversityClassicTheme = createTheme({

  ...AcademicBaseTheme,

  id: "university-classic",

  name: "University Classic",

  layoutId: "academic02",

  backgroundId: "minimal-white",

  decorationIds: [
    "dots",
  ],

  palette: {

    ...AcademicBaseTheme.palette,

    primary: "#0F172A",

    secondary: "#334155",

    accent: "#2563EB",

  },

});

/* ===========================================================
   Research Paper
=========================================================== */

export const ResearchPaperTheme = createTheme({

  ...AcademicBaseTheme,

  id: "research-paper",

  name: "Research Paper",

  variant: "minimal",

  layoutId: "academic01",

  backgroundId: "minimal-white",

  decorationIds: [
    "circle-pattern",
  ],

  typography: {

    ...AcademicBaseTheme.typography,

    headingFont: "Merriweather",

    bodyFont: "Inter",

  },

});

/* ===========================================================
   Thesis Modern
=========================================================== */

export const ThesisModernTheme = createTheme({

  ...AcademicBaseTheme,

  id: "thesis-modern",

  name: "Thesis Modern",

  variant: "modern",

  layoutId: "academic02",

  backgroundId: "gradient-blue",

  decorationIds: [
    "wave-top",
  ],

  palette: {

    ...AcademicBaseTheme.palette,

    primary: "#1D4ED8",

    secondary: "#2563EB",

    accent: "#60A5FA",

  },

});

/* ===========================================================
   Engineering Blue
=========================================================== */

export const EngineeringBlueTheme = createTheme({

  ...AcademicBaseTheme,

  id: "engineering-blue",

  name: "Engineering Blue",

  variant: "modern",

  layoutId: "academic02",

  backgroundId: "navy-luxury",

  decorationIds: [
    "hexagon",
  ],

  palette: {

    ...AcademicBaseTheme.palette,

    primary: "#1E3A8A",

    secondary: "#2563EB",

    accent: "#38BDF8",

  },

});

/* ===========================================================
   Registry Update
=========================================================== */

AcademicThemes.push(

  AcademicFrameTheme,

  UniversityClassicTheme,

  ResearchPaperTheme,

  ThesisModernTheme,

  EngineeringBlueTheme,

);

/* ===========================================================
   Academic Theme Collection
   Part - 3 (Professional Themes & Registry)
   Version : 1.0
=========================================================== */

/* ===========================================================
   Medical White
=========================================================== */

export const MedicalWhiteTheme = createTheme({

  ...AcademicBaseTheme,

  id: "medical-white",

  name: "Medical White",

  variant: "minimal",

  layoutId: "academic01",

  backgroundId: "green-nature",

  decorationIds: [
    "circle-pattern",
  ],

  palette: {

    ...AcademicBaseTheme.palette,

    primary: "#0F766E",

    secondary: "#14B8A6",

    accent: "#99F6E4",

  },

});

/* ===========================================================
   Commerce Gold
=========================================================== */

export const CommerceGoldTheme = createTheme({

  ...AcademicBaseTheme,

  id: "commerce-gold",

  name: "Commerce Gold",

  variant: "premium",

  layoutId: "corporate01",

  backgroundId: "royal-purple",

  decorationIds: [
    "corner-ribbon",
  ],

  palette: {

    ...AcademicBaseTheme.palette,

    primary: "#B45309",

    secondary: "#D97706",

    accent: "#FBBF24",

  },

});

/* ===========================================================
   Computer Science Tech
=========================================================== */

export const ComputerScienceTheme = createTheme({

  ...AcademicBaseTheme,

  id: "computer-science",

  name: "Computer Science Tech",

  variant: "modern",

  layoutId: "academic02",

  backgroundId: "navy-luxury",

  decorationIds: [
    "hexagon",
    "dots",
  ],

  palette: {

    ...AcademicBaseTheme.palette,

    primary: "#4338CA",

    secondary: "#6366F1",

    accent: "#A5B4FC",

  },

});

/* ===========================================================
   Education Classic
=========================================================== */

export const EducationClassicTheme = createTheme({

  ...AcademicBaseTheme,

  id: "education-classic",

  name: "Education Classic",

  variant: "classic",

  layoutId: "academic01",

  backgroundId: "minimal-white",

  decorationIds: [
    "dots",
  ],

  typography: {

    ...AcademicBaseTheme.typography,

    headingFont: "Playfair Display",

    bodyFont: "Inter",

  },

});

/* ===========================================================
   Law Professional
=========================================================== */

export const LawProfessionalTheme = createTheme({

  ...AcademicBaseTheme,

  id: "law-professional",

  name: "Law Professional",

  variant: "premium",

  layoutId: "corporate02",

  backgroundId: "minimal-white",

  decorationIds: [
    "corner-ribbon",
  ],

  palette: {

    ...AcademicBaseTheme.palette,

    primary: "#1F2937",

    secondary: "#374151",

    accent: "#9CA3AF",

  },

});

/* ===========================================================
   Additional Gallery Templates
   These configurations power the live A4 renderer. Each one deliberately
   combines a background, composition and decoration treatment.
=========================================================== */

export const EducationThemeConfig = createTheme({

  ...AcademicBaseTheme,

  id: "education-theme",

  name: "Education Classic",

  variant: "classic",

  layoutId: "academic01",

  backgroundId: "minimal-white",

  decorationIds: [
    "dots",
  ],

  palette: {

    ...AcademicBaseTheme.palette,

    primary: "#166534",

    secondary: "#16A34A",

    accent: "#65A30D",

  },

});

export const ElegantBorderTheme = createTheme({

  ...AcademicBaseTheme,

  id: "elegant-border",

  name: "Elegant Border",

  variant: "professional",

  layoutId: "corporate02",

  backgroundId: "minimal-white",

  decorationIds: [
    "corner-ribbon",
  ],

  palette: {

    ...AcademicBaseTheme.palette,

    primary: "#4338CA",

    secondary: "#818CF8",

    accent: "#8B5CF6",

  },

});

export const MinimalAcademicTheme = createTheme({

  ...AcademicBaseTheme,

  id: "minimal-academic",

  name: "Minimal Academic",

  variant: "minimal",

  layoutId: "academic01",

  backgroundId: "minimal-white",

  decorationIds: [
    "circle-pattern",
  ],

  palette: {

    ...AcademicBaseTheme.palette,

    primary: "#1E293B",

    secondary: "#64748B",

    accent: "#475569",

  },

});

export const ModernUniversityTheme = createTheme({

  ...AcademicBaseTheme,

  id: "modern-university",

  name: "Modern University",

  variant: "modern",

  layoutId: "academic02",

  backgroundId: "gradient-blue",

  decorationIds: [
    "wave-top",
    "wave-bottom",
  ],

  palette: {

    ...AcademicBaseTheme.palette,

    primary: "#1E3A8A",

    secondary: "#2563EB",

    accent: "#06B6D4",

  },

});

export const PremiumAcademicTheme = createTheme({

  ...AcademicBaseTheme,

  id: "premium-academic",

  name: "Premium Academic",

  mode: "dark",

  variant: "premium",

  layoutId: "corporate01",

  backgroundId: "navy-luxury",

  decorationIds: [
    "corner-ribbon",
  ],

  palette: {

    ...AcademicBaseTheme.palette,

    primary: "#FDE68A",

    secondary: "#D97706",

    accent: "#FBBF24",

    text: "#0F172A",

    border: "#FCD34D",

  },

});

/* ===========================================================
   Registry Update
=========================================================== */

AcademicThemes.push(

  MedicalWhiteTheme,

  CommerceGoldTheme,

  ComputerScienceTheme,

  EducationClassicTheme,

  LawProfessionalTheme,

  EducationThemeConfig,

  ElegantBorderTheme,

  MinimalAcademicTheme,

  ModernUniversityTheme,

  PremiumAcademicTheme,

);

/* ===========================================================
   Search API
=========================================================== */

export function getAcademicTheme(

  id: AcademicThemeId

): ThemeConfiguration {

  return (

    AcademicThemes.find(

      theme => theme.id === id

    ) ?? AcademicBaseTheme

  );

}

export function getAcademicThemes(): ThemeConfiguration[] {

  return AcademicThemes;

}

export function searchAcademicThemes(

  keyword: string

): ThemeConfiguration[] {

  const query = keyword.toLowerCase();

  return AcademicThemes.filter(

    theme =>

      theme.name

        .toLowerCase()

        .includes(query)

  );

}

/* ===========================================================
   Default Theme
=========================================================== */

export const DEFAULT_ACADEMIC_THEME =

  AcademicFrameTheme;

/* ===========================================================
   Academic Registry
=========================================================== */

export const ACADEMIC_THEME_REGISTRY = {

  category: "academic",

  version: "1.0.0",

  totalThemes: AcademicThemes.length,

  defaultTheme: DEFAULT_ACADEMIC_THEME,

  themes: AcademicThemes,

} as const;
