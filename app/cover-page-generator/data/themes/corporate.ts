/* ===========================================================
   DocSprintHub
   Corporate Theme Collection
   Part - 1 (Foundation)
   Version : 1.0
=========================================================== */

import {

  createTheme,

  type ThemeConfiguration,

} from "./base";

/* ===========================================================
   Corporate Theme IDs
=========================================================== */

export type CorporateThemeId =

  | "corporate-blue"

  | "executive-pro"

  | "blue-corporate"

  | "business-modern"

  | "startup-pitch"

  | "financial-report"

  | "annual-report"

  | "premium-gold"

  | "glass-office"

  | "dark-business"

  | "consulting-elite";

/* ===========================================================
   Corporate Base Theme
=========================================================== */

export const CorporateBaseTheme = createTheme({

  id: "executive-pro",

  name: "Corporate Base",

  mode: "light",

  variant: "modern",

  status: "stable",

  palette: {

    primary: "#1E3A8A",

    secondary: "#2563EB",

    accent: "#60A5FA",

    success: "#16A34A",

    warning: "#D97706",

    danger: "#DC2626",

    text: "#111827",

    muted: "#6B7280",

    border: "#D1D5DB",

    background: "#FFFFFF",

  },

  typography: {

    headingFont: "Inter",

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
   Corporate Theme Registry
=========================================================== */

export const CorporateThemes: ThemeConfiguration[] = [

  CorporateBaseTheme,

];

/* ===========================================================
   Category Metadata
=========================================================== */

export const CorporateThemeCollection = {

  id: "corporate",

  name: "Corporate",

  description:

    "Professional corporate cover page themes for reports, proposals and business documents.",

  totalThemes: 10,

};

/* ===========================================================
   Theme Categories
=========================================================== */

export const CorporateCategories = [

  "Executive",

  "Business",

  "Finance",

  "Startup",

  "Consulting",

] as const;

/* ===========================================================
   Recommended Use Cases
=========================================================== */

export const CorporateUseCases = [

  "Business Report",

  "Annual Report",

  "Project Proposal",

  "Company Profile",

  "Startup Pitch",

  "Financial Report",

  "Industrial Training",

  "Internship Report",

  "Business Plan",

  "Consulting Report",

] as const; 

/* ===========================================================
   Corporate Theme Collection
   Part - 2 (Premium Corporate Themes)
   Version : 1.0
=========================================================== */

/* ===========================================================
   Executive Pro
=========================================================== */

export const ExecutiveProTheme = createTheme({

  ...CorporateBaseTheme,

  id: "executive-pro",

  name: "Executive Pro",

});

/* ===========================================================
   Blue Corporate
=========================================================== */

export const BlueCorporateTheme = createTheme({

  ...CorporateBaseTheme,

  id: "blue-corporate",

  name: "Blue Corporate",

  palette: {

    ...CorporateBaseTheme.palette,

    primary: "#1D4ED8",

    secondary: "#2563EB",

    accent: "#60A5FA",

  },

});

/* ===========================================================
   Business Modern
=========================================================== */

export const BusinessModernTheme = createTheme({

  ...CorporateBaseTheme,

  id: "business-modern",

  name: "Business Modern",

  variant: "modern",

  typography: {

    ...CorporateBaseTheme.typography,

    headingFont: "Poppins",

    bodyFont: "Inter",

  },

});

/* ===========================================================
   Startup Pitch
=========================================================== */

export const StartupPitchTheme = createTheme({

  ...CorporateBaseTheme,

  id: "startup-pitch",

  name: "Startup Pitch",

  variant: "glass",

  palette: {

    ...CorporateBaseTheme.palette,

    primary: "#4338CA",

    secondary: "#6366F1",

    accent: "#A78BFA",

  },

});

/* ===========================================================
   Financial Report
=========================================================== */

export const FinancialReportTheme = createTheme({

  ...CorporateBaseTheme,

  id: "financial-report",

  name: "Financial Report",

  variant: "premium",

  mode: "dark",

  layoutId: "corporate01",

  backgroundId: "navy-luxury",

  decorationIds: [
    "corner-ribbon",
  ],

  palette: {

    ...CorporateBaseTheme.palette,

    primary: "#065F46",

    secondary: "#059669",

    accent: "#34D399",

  },

});

/* ===========================================================
   Registry Update
=========================================================== */

CorporateThemes.push(

  ExecutiveProTheme,

  BlueCorporateTheme,

  BusinessModernTheme,

  StartupPitchTheme,

  FinancialReportTheme,

);

/* ===========================================================
   Corporate Theme Collection
   Part - 3 (Professional Themes & Registry)
   Version : 1.0
=========================================================== */

/* ===========================================================
   Annual Report
=========================================================== */

export const AnnualReportTheme = createTheme({

  ...CorporateBaseTheme,

  id: "annual-report",

  name: "Annual Report",

  variant: "premium",

  palette: {

    ...CorporateBaseTheme.palette,

    primary: "#0F172A",

    secondary: "#1E293B",

    accent: "#475569",

  },

});

/* ===========================================================
   Premium Gold
=========================================================== */

export const PremiumGoldTheme = createTheme({

  ...CorporateBaseTheme,

  id: "premium-gold",

  name: "Premium Gold",

  variant: "premium",

  palette: {

    ...CorporateBaseTheme.palette,

    primary: "#FEF3C7",

    secondary: "#D97706",

    accent: "#FBBF24",

  },

});

/* ===========================================================
   Glass Office
=========================================================== */

export const GlassOfficeTheme = createTheme({

  ...CorporateBaseTheme,

  id: "glass-office",

  name: "Glass Office",

  variant: "glass",

  palette: {

    ...CorporateBaseTheme.palette,

    primary: "#2563EB",

    secondary: "#60A5FA",

    accent: "#BFDBFE",

  },

});

/* ===========================================================
   Dark Business
=========================================================== */

export const DarkBusinessTheme = createTheme({

  ...CorporateBaseTheme,

  id: "dark-business",

  name: "Dark Business",

  mode: "dark",

  variant: "premium",

  palette: {

    ...CorporateBaseTheme.palette,

    primary: "#111827",

    secondary: "#1F2937",

    accent: "#374151",

    text: "#F9FAFB",

    muted: "#D1D5DB",

    border: "#4B5563",

    background: "#0F172A",

  },

});

/* ===========================================================
   Consulting Elite
=========================================================== */

export const ConsultingEliteTheme = createTheme({

  ...CorporateBaseTheme,

  id: "consulting-elite",

  name: "Consulting Elite",

  variant: "classic",

  typography: {

    ...CorporateBaseTheme.typography,

    headingFont: "Playfair Display",

    bodyFont: "Inter",

  },

  palette: {

    ...CorporateBaseTheme.palette,

    primary: "#1E3A8A",

    secondary: "#334155",

    accent: "#64748B",

  },

});

/* Gallery template: production composition */
export const CorporateBlueTheme = createTheme({

  ...CorporateBaseTheme,

  id: "corporate-blue",

  name: "Corporate Blue",

  mode: "dark",

  variant: "professional",

  layoutId: "corporate01",

  backgroundId: "navy-luxury",

  decorationIds: [
    "hexagon",
  ],

  palette: {

    ...CorporateBaseTheme.palette,

    primary: "#DBEAFE",

    secondary: "#60A5FA",

    accent: "#38BDF8",

    text: "#0F172A",

    border: "#93C5FD",

  },

});

/* ===========================================================
   Registry Update
=========================================================== */

CorporateThemes.push(

  AnnualReportTheme,

  PremiumGoldTheme,

  GlassOfficeTheme,

  DarkBusinessTheme,

  ConsultingEliteTheme,

  CorporateBlueTheme,

);

/* ===========================================================
   Search API
=========================================================== */

export function getCorporateTheme(

  id: CorporateThemeId

): ThemeConfiguration {

  return (

    CorporateThemes.find(

      theme => theme.id === id

    ) ?? CorporateBaseTheme

  );

}

export function getCorporateThemes(): ThemeConfiguration[] {

  return CorporateThemes;

}

export function searchCorporateThemes(

  keyword: string

): ThemeConfiguration[] {

  const query = keyword.toLowerCase();

  return CorporateThemes.filter(

    theme =>

      theme.name

        .toLowerCase()

        .includes(query)

  );

}

/* ===========================================================
   Recommendation API
=========================================================== */

export function getCorporateThemesByUseCase(

  useCase: string

): ThemeConfiguration[] {

  const value = useCase.toLowerCase();

  if (value.includes("annual")) {

    return [AnnualReportTheme];

  }

  if (value.includes("startup")) {

    return [StartupPitchTheme];

  }

  if (value.includes("finance")) {

    return [FinancialReportTheme];

  }

  if (value.includes("proposal")) {

    return [

      ExecutiveProTheme,

      ConsultingEliteTheme,

    ];

  }

  return CorporateThemes;

}

/* ===========================================================
   Default Theme
=========================================================== */

export const DEFAULT_CORPORATE_THEME =

  ExecutiveProTheme;

/* ===========================================================
   Corporate Registry
=========================================================== */

export const CORPORATE_THEME_REGISTRY = {

  category: "corporate",

  version: "1.0.0",

  totalThemes: CorporateThemes.length,

  defaultTheme: DEFAULT_CORPORATE_THEME,

  themes: CorporateThemes,

} as const;
