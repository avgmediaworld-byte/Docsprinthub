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

  | "education-classic"

  | "law-professional";

/* ===========================================================
   Academic Base Theme
=========================================================== */

export const AcademicBaseTheme = createTheme({

  id: "academic-frame",

  name: "Academic Base",

  mode: "light",

  variant: "modern",

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

  palette: {

    ...AcademicBaseTheme.palette,

    primary: "#1F2937",

    secondary: "#374151",

    accent: "#9CA3AF",

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
