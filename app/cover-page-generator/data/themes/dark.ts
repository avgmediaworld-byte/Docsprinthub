/* ===========================================================
   DocSprintHub
   Dark Theme Collection
   Part - 1 (Foundation)
   Version : 1.0
=========================================================== */

import {
  createTheme,
  type ThemeConfiguration,
} from "./base";

/* ===========================================================
   Dark Theme IDs
=========================================================== */

export type DarkThemeId =
  | "dark-professional"
  | "dark-aurora"
  | "midnight-blue"
  | "carbon-black"
  | "neon-purple"
  | "cyber-dark"
  | "matrix-green"
  | "crimson-dark"
  | "royal-dark"
  | "space-black";

/* ===========================================================
   Dark Base Theme
=========================================================== */

export const DarkBaseTheme = createTheme({

  id: "dark-professional",

  name: "Dark Base",

  mode: "dark",

  variant: "premium",

  status: "stable",

  palette: {

    primary: "#2563EB",

    secondary: "#3B82F6",

    accent: "#06B6D4",

    success: "#22C55E",

    warning: "#F59E0B",

    danger: "#EF4444",

    text: "#F8FAFC",

    muted: "#CBD5E1",

    border: "#334155",

    background: "#020617",

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
   Registry
=========================================================== */

export const DarkThemes: ThemeConfiguration[] = [

  DarkBaseTheme,

];

/* ===========================================================
   Collection Metadata
=========================================================== */

export const DarkThemeCollection = {

  id: "dark",

  name: "Dark",

  description:

    "Premium dark themes inspired by modern dashboards, cyber interfaces and luxury presentations.",

  totalThemes: 10,

};

/* ===========================================================
   Categories
=========================================================== */

export const DarkCategories = [

  "Professional",

  "Cyber",

  "Luxury",

  "Technology",

  "Gaming",

  "Presentation",

] as const;

/* ===========================================================
   Recommended Use Cases
=========================================================== */

export const DarkUseCases = [

  "Business Proposal",

  "Pitch Deck",

  "Company Profile",

  "Portfolio",

  "Technology Report",

  "Research",

  "Presentation",

  "Magazine",

  "Annual Report",

  "Resume",

] as const;

/* ===========================================================
   Surface Styles
=========================================================== */

export const DarkSurfaceStyles = [

  "Matte",

  "Gloss",

  "Carbon",

  "Glass",

  "Metal",

  "Neon",

] as const;

/* ===========================================================
   Accent Styles
=========================================================== */

export const DarkAccentStyles = [

  "Blue",

  "Purple",

  "Green",

  "Red",

  "Gold",

  "Cyan",

] as const;

/* ===========================================================
   Contrast Modes
=========================================================== */

export const DarkContrastModes = [

  "Standard",

  "High",

  "Ultra",

] as const;

/* ===========================================================
   Dark Theme Collection
   Part - 2 (Premium Dark Themes)
   Version : 1.0
=========================================================== */

/* ===========================================================
   Dark Professional
=========================================================== */

export const DarkProfessionalTheme = createTheme({

  ...DarkBaseTheme,

  id: "dark-professional",

  name: "Dark Professional",

});

/* ===========================================================
   Dark Aurora
=========================================================== */

export const DarkAuroraTheme = createTheme({

  ...DarkBaseTheme,

  id: "dark-aurora",

  name: "Dark Aurora",

  variant: "gradient",

  palette: {

    ...DarkBaseTheme.palette,

    primary: "#6366F1",

    secondary: "#8B5CF6",

    accent: "#C4B5FD",

  },

});

/* ===========================================================
   Midnight Blue
=========================================================== */

export const MidnightBlueTheme = createTheme({

  ...DarkBaseTheme,

  id: "midnight-blue",

  name: "Midnight Blue",

  variant: "premium",

  palette: {

    ...DarkBaseTheme.palette,

    primary: "#1D4ED8",

    secondary: "#2563EB",

    accent: "#60A5FA",

  },

});

/* ===========================================================
   Carbon Black
=========================================================== */

export const CarbonBlackTheme = createTheme({

  ...DarkBaseTheme,

  id: "carbon-black",

  name: "Carbon Black",

  variant: "minimal",

  palette: {

    ...DarkBaseTheme.palette,

    primary: "#18181B",

    secondary: "#27272A",

    accent: "#71717A",

    background: "#09090B",

    border: "#3F3F46",

  },

});

/* ===========================================================
   Neon Purple
=========================================================== */

export const NeonPurpleTheme = createTheme({

  ...DarkBaseTheme,

  id: "neon-purple",

  name: "Neon Purple",

  variant: "glass",

  palette: {

    ...DarkBaseTheme.palette,

    primary: "#9333EA",

    secondary: "#A855F7",

    accent: "#E879F9",

  },

});

/* ===========================================================
   Registry Update
=========================================================== */

DarkThemes.push(

  DarkProfessionalTheme,

  DarkAuroraTheme,

  MidnightBlueTheme,

  CarbonBlackTheme,

  NeonPurpleTheme,

);



/* ===========================================================
   Dark Theme Collection
   Part - 3 (Professional Themes & Registry)
   Version : 1.0
=========================================================== */

/* ===========================================================
   Cyber Dark
=========================================================== */

export const CyberDarkTheme = createTheme({

  ...DarkBaseTheme,

  id: "cyber-dark",

  name: "Cyber Dark",

  variant: "technology",

  palette: {

    ...DarkBaseTheme.palette,

    primary: "#06B6D4",

    secondary: "#22D3EE",

    accent: "#67E8F9",

  },

});

/* ===========================================================
   Matrix Green
=========================================================== */

export const MatrixGreenTheme = createTheme({

  ...DarkBaseTheme,

  id: "matrix-green",

  name: "Matrix Green",

  variant: "technology",

  palette: {

    ...DarkBaseTheme.palette,

    primary: "#16A34A",

    secondary: "#22C55E",

    accent: "#86EFAC",

  },

});

/* ===========================================================
   Crimson Dark
=========================================================== */

export const CrimsonDarkTheme = createTheme({

  ...DarkBaseTheme,

  id: "crimson-dark",

  name: "Crimson Dark",

  variant: "premium",

  palette: {

    ...DarkBaseTheme.palette,

    primary: "#B91C1C",

    secondary: "#DC2626",

    accent: "#F87171",

  },

});

/* ===========================================================
   Royal Dark
=========================================================== */

export const RoyalDarkTheme = createTheme({

  ...DarkBaseTheme,

  id: "royal-dark",

  name: "Royal Dark",

  variant: "luxury",

  palette: {

    ...DarkBaseTheme.palette,

    primary: "#312E81",

    secondary: "#4338CA",

    accent: "#A5B4FC",

  },

});

/* ===========================================================
   Space Black
=========================================================== */

export const SpaceBlackTheme = createTheme({

  ...DarkBaseTheme,

  id: "space-black",

  name: "Space Black",

  variant: "minimal",

  palette: {

    ...DarkBaseTheme.palette,

    primary: "#000000",

    secondary: "#18181B",

    accent: "#52525B",

    background: "#030712",

    border: "#27272A",

  },

});

/* ===========================================================
   Registry Update
=========================================================== */

DarkThemes.push(

  CyberDarkTheme,

  MatrixGreenTheme,

  CrimsonDarkTheme,

  RoyalDarkTheme,

  SpaceBlackTheme,

);

/* ===========================================================
   Theme APIs
=========================================================== */

export function getDarkTheme(

  id: DarkThemeId

): ThemeConfiguration {

  return (

    DarkThemes.find(

      theme => theme.id === id

    ) ?? DarkBaseTheme

  );

}

export function getDarkThemes(): ThemeConfiguration[] {

  return DarkThemes;

}

export function searchDarkThemes(

  keyword: string

): ThemeConfiguration[] {

  const query = keyword.toLowerCase();

  return DarkThemes.filter(

    theme =>

      theme.name
        .toLowerCase()
        .includes(query)

  );

}

/* ===========================================================
   Recommendation API
=========================================================== */

export function getDarkThemesByUseCase(

  useCase: string

): ThemeConfiguration[] {

  const value = useCase.toLowerCase();

  if (value.includes("technology")) {

    return [

      CyberDarkTheme,

      MatrixGreenTheme,

    ];

  }

  if (value.includes("business")) {

    return [

      DarkProfessionalTheme,

      RoyalDarkTheme,

    ];

  }

  if (value.includes("gaming")) {

    return [

      NeonPurpleTheme,

      SpaceBlackTheme,

    ];

  }

  if (value.includes("premium")) {

    return [

      MidnightBlueTheme,

      RoyalDarkTheme,

    ];

  }

  return DarkThemes;

}

/* ===========================================================
   Default Theme
=========================================================== */

export const DEFAULT_DARK_THEME =

  DarkProfessionalTheme;

/* ===========================================================
   Registry
=========================================================== */

export const DARK_THEME_REGISTRY = {

  category: "dark",

  version: "1.0.0",

  totalThemes: DarkThemes.length,

  defaultTheme: DEFAULT_DARK_THEME,

  themes: DarkThemes,

} as const;