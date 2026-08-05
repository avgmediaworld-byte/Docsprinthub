/* ===========================================================
   DocSprintHub
   Minimal Theme Collection
   Part - 1 (Foundation)
   Version : 1.0
=========================================================== */

import {
  createTheme,
  type ThemeConfiguration,
} from "./base";

/* ===========================================================
   Minimal Theme IDs
=========================================================== */

export type MinimalThemeId =
  | "minimal-white"
  | "apple-clean"
  | "editorial"
  | "nordic"
  | "swiss-grid"
  | "soft-paper"
  | "luxury-minimal"
  | "classic-white"
  | "zen-minimal"
  | "elegant-mono";

/* ===========================================================
   Minimal Base Theme
=========================================================== */

export const MinimalBaseTheme = createTheme({

  id: "minimal-white",

  name: "Minimal Base",

  mode: "light",

  variant: "minimal",

  status: "stable",

  palette: {

    primary: "#111827",

    secondary: "#374151",

    accent: "#9CA3AF",

    success: "#16A34A",

    warning: "#D97706",

    danger: "#DC2626",

    text: "#111827",

    muted: "#6B7280",

    border: "#E5E7EB",

    background: "#FFFFFF",

  },

  typography: {

    headingFont: "Inter",

    bodyFont: "Inter",

    headingWeight: 700,

    bodyWeight: 400,

    lineHeight: 1.7,

  },

  spacing: {

    page: 48,

    section: 28,

    content: 18,

  },

});

/* ===========================================================
   Registry
=========================================================== */

export const MinimalThemes: ThemeConfiguration[] = [

  MinimalBaseTheme,

];

/* ===========================================================
   Collection Metadata
=========================================================== */

export const MinimalThemeCollection = {

  id: "minimal",

  name: "Minimal",

  description:
    "Elegant, clean and typography-focused document themes inspired by Apple, Notion and editorial layouts.",

  totalThemes: 10,

};

/* ===========================================================
   Categories
=========================================================== */

export const MinimalCategories = [

  "Editorial",

  "Apple",

  "Professional",

  "Luxury",

  "Classic",

  "Swiss",

  "Nordic",

] as const;

/* ===========================================================
   Recommended Use Cases
=========================================================== */

export const MinimalUseCases = [

  "Research Paper",

  "Resume",

  "Documentation",

  "Whitepaper",

  "Project Report",

  "Proposal",

  "Case Study",

  "Business Profile",

  "Documentation",

  "Official Letter",

] as const;

/* ===========================================================
   Design Principles
=========================================================== */

export const MinimalDesignPrinciples = [

  "Whitespace First",

  "Typography Driven",

  "Minimal Decoration",

  "Thin Borders",

  "Grid Alignment",

  "Balanced Margins",

  "Elegant Hierarchy",

] as const;

/* ===========================================================
   Supported Layout Styles
=========================================================== */

export const MinimalLayoutStyles = [

  "Centered",

  "Left Aligned",

  "Editorial",

  "Swiss Grid",

  "Single Column",

  "Magazine",

] as const;

/* ===========================================================
   Minimal Theme Collection
   Part - 2 (Premium Minimal Themes)
   Version : 1.0
=========================================================== */

/* ===========================================================
   Minimal White
=========================================================== */

export const MinimalWhiteTheme = createTheme({

  ...MinimalBaseTheme,

  id: "minimal-white",

  name: "Minimal White",

});

/* ===========================================================
   Apple Clean
=========================================================== */

export const AppleCleanTheme = createTheme({

  ...MinimalBaseTheme,

  id: "apple-clean",

  name: "Apple Clean",

  variant: "minimal",

  palette: {

    ...MinimalBaseTheme.palette,

    primary: "#111827",

    secondary: "#6B7280",

    accent: "#D1D5DB",

  },

  typography: {

    ...MinimalBaseTheme.typography,

    headingFont: "SF Pro Display",

    bodyFont: "SF Pro Text",

  },

});

/* ===========================================================
   Editorial
=========================================================== */

export const EditorialTheme = createTheme({

  ...MinimalBaseTheme,

  id: "editorial",

  name: "Editorial",

  variant: "classic",

  typography: {

    ...MinimalBaseTheme.typography,

    headingFont: "Playfair Display",

    bodyFont: "Inter",

  },

  palette: {

    ...MinimalBaseTheme.palette,

    primary: "#1F2937",

    secondary: "#4B5563",

    accent: "#9CA3AF",

  },

});

/* ===========================================================
   Nordic
=========================================================== */

export const NordicTheme = createTheme({

  ...MinimalBaseTheme,

  id: "nordic",

  name: "Nordic",

  variant: "minimal",

  palette: {

    ...MinimalBaseTheme.palette,

    primary: "#334155",

    secondary: "#64748B",

    accent: "#CBD5E1",

  },

});

/* ===========================================================
   Swiss Grid
=========================================================== */

export const SwissGridTheme = createTheme({

  ...MinimalBaseTheme,

  id: "swiss-grid",

  name: "Swiss Grid",

  variant: "professional",

  typography: {

    ...MinimalBaseTheme.typography,

    headingFont: "Helvetica",

    bodyFont: "Inter",

  },

  palette: {

    ...MinimalBaseTheme.palette,

    primary: "#0F172A",

    secondary: "#475569",

    accent: "#94A3B8",

  },

});

/* ===========================================================
   Registry Update
=========================================================== */

MinimalThemes.push(

  MinimalWhiteTheme,

  AppleCleanTheme,

  EditorialTheme,

  NordicTheme,

  SwissGridTheme,

);

/* ===========================================================
   Minimal Theme Collection
   Part - 3 (Professional Themes & Registry)
   Version : 1.0
=========================================================== */

/* ===========================================================
   Soft Paper
=========================================================== */

export const SoftPaperTheme = createTheme({

  ...MinimalBaseTheme,

  id: "soft-paper",

  name: "Soft Paper",

  variant: "minimal",

  palette: {

    ...MinimalBaseTheme.palette,

    background: "#FFFCF7",

    border: "#E7E5E4",

    primary: "#44403C",

    secondary: "#78716C",

    accent: "#D6D3D1",

  },

});

/* ===========================================================
   Luxury Minimal
=========================================================== */

export const LuxuryMinimalTheme = createTheme({

  ...MinimalBaseTheme,

  id: "luxury-minimal",

  name: "Luxury Minimal",

  variant: "premium",

  palette: {

    ...MinimalBaseTheme.palette,

    primary: "#111827",

    secondary: "#374151",

    accent: "#D4AF37",

    border: "#D4AF37",

  },

});

/* ===========================================================
   Classic White
=========================================================== */

export const ClassicWhiteTheme = createTheme({

  ...MinimalBaseTheme,

  id: "classic-white",

  name: "Classic White",

  variant: "classic",

  palette: {

    ...MinimalBaseTheme.palette,

    background: "#FFFFFF",

    border: "#D1D5DB",

  },

});

/* ===========================================================
   Zen Minimal
=========================================================== */

export const ZenMinimalTheme = createTheme({

  ...MinimalBaseTheme,

  id: "zen-minimal",

  name: "Zen Minimal",

  variant: "minimal",

  palette: {

    ...MinimalBaseTheme.palette,

    primary: "#475569",

    secondary: "#94A3B8",

    accent: "#CBD5E1",

  },

});

/* ===========================================================
   Elegant Mono
=========================================================== */

export const ElegantMonoTheme = createTheme({

  ...MinimalBaseTheme,

  id: "elegant-mono",

  name: "Elegant Mono",

  variant: "professional",

  palette: {

    ...MinimalBaseTheme.palette,

    primary: "#000000",

    secondary: "#404040",

    accent: "#A3A3A3",

  },

  typography: {

    ...MinimalBaseTheme.typography,

    headingFont: "IBM Plex Sans",

    bodyFont: "Inter",

  },

});

/* ===========================================================
   Registry Update
=========================================================== */

MinimalThemes.push(

  SoftPaperTheme,

  LuxuryMinimalTheme,

  ClassicWhiteTheme,

  ZenMinimalTheme,

  ElegantMonoTheme,

);

/* ===========================================================
   Theme APIs
=========================================================== */

export function getMinimalTheme(

  id: MinimalThemeId

): ThemeConfiguration {

  return (

    MinimalThemes.find(

      theme => theme.id === id

    ) ?? MinimalBaseTheme

  );

}

export function getMinimalThemes(): ThemeConfiguration[] {

  return MinimalThemes;

}

export function searchMinimalThemes(

  keyword: string

): ThemeConfiguration[] {

  const query = keyword.toLowerCase();

  return MinimalThemes.filter(

    theme =>

      theme.name

        .toLowerCase()

        .includes(query)

  );

}

/* ===========================================================
   Recommendation API
=========================================================== */

export function getMinimalThemesByUseCase(

  useCase: string

): ThemeConfiguration[] {

  const value = useCase.toLowerCase();

  if (value.includes("resume")) {

    return [

      AppleCleanTheme,

      MinimalWhiteTheme,

    ];

  }

  if (value.includes("research")) {

    return [

      EditorialTheme,

      SwissGridTheme,

    ];

  }

  if (value.includes("proposal")) {

    return [

      LuxuryMinimalTheme,

      ClassicWhiteTheme,

    ];

  }

  if (value.includes("official")) {

    return [

      ElegantMonoTheme,

      ClassicWhiteTheme,

    ];

  }

  return MinimalThemes;

}

/* ===========================================================
   Default Theme
=========================================================== */

export const DEFAULT_MINIMAL_THEME =

  MinimalWhiteTheme;

/* ===========================================================
   Registry
=========================================================== */

export const MINIMAL_THEME_REGISTRY = {

  category: "minimal",

  version: "1.0.0",

  totalThemes: MinimalThemes.length,

  defaultTheme: DEFAULT_MINIMAL_THEME,

  themes: MinimalThemes,

} as const;