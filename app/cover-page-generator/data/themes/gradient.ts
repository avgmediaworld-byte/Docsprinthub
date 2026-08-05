/* ===========================================================
   DocSprintHub
   Gradient Theme Collection
   Part - 1 (Foundation)
   Version : 1.0
=========================================================== */

import {
  createTheme,
  type ThemeConfiguration,
} from "./base";

/* ===========================================================
   Gradient Theme IDs
=========================================================== */

export type GradientThemeId =
  | "aurora"
  | "ocean-blue"
  | "sunset-glow"
  | "purple-dream"
  | "emerald-flow"
  | "cosmic-night"
  | "neon-pulse"
  | "sky-horizon"
  | "peach-bloom"
  | "royal-gradient";

/* ===========================================================
   Gradient Base Theme
=========================================================== */

export const GradientBaseTheme = createTheme({

  id: "aurora",

  name: "Gradient Base",

  mode: "light",

  variant: "gradient",

  status: "stable",

  palette: {

    primary: "#2563EB",

    secondary: "#7C3AED",

    accent: "#EC4899",

    success: "#22C55E",

    warning: "#F59E0B",

    danger: "#EF4444",

    text: "#111827",

    muted: "#6B7280",

    border: "#E5E7EB",

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
   Registry
=========================================================== */

export const GradientThemes: ThemeConfiguration[] = [

  GradientBaseTheme,

];

/* ===========================================================
   Collection Metadata
=========================================================== */

export const GradientThemeCollection = {

  id: "gradient",

  name: "Gradient",

  description:

    "Modern gradient themes inspired by Canva, Adobe Express and premium presentations.",

  totalThemes: 10,

};

/* ===========================================================
   Categories
=========================================================== */

export const GradientCategories = [

  "Business",

  "Creative",

  "Education",

  "Technology",

  "Portfolio",

  "Presentation",

] as const;

/* ===========================================================
   Recommended Use Cases
=========================================================== */

export const GradientUseCases = [

  "Cover Page",

  "Presentation",

  "Project Report",

  "Research Paper",

  "Portfolio",

  "Magazine",

  "Proposal",

  "Assignment",

  "Profile",

  "Documentation",

] as const;

/* ===========================================================
   Gradient Presets
=========================================================== */

export const GradientPresets = [

  "Linear",

  "Radial",

  "Mesh",

  "Aurora",

  "Glass Gradient",

  "Diagonal",

] as const;

/* ===========================================================
   Color Mood
=========================================================== */

export const GradientMood = [

  "Professional",

  "Modern",

  "Creative",

  "Elegant",

  "Premium",

  "Bold",

] as const;

/* ===========================================================
   Gradient Theme Collection
   Part - 2 (Premium Gradient Themes)
   Version : 1.0
=========================================================== */

/* ===========================================================
   Aurora
=========================================================== */

export const AuroraTheme = createTheme({

  ...GradientBaseTheme,

  id: "aurora",

  name: "Aurora",

  variant: "gradient",

  palette: {

    ...GradientBaseTheme.palette,

    primary: "#2563EB",

    secondary: "#7C3AED",

    accent: "#EC4899",

  },

});

/* ===========================================================
   Ocean Blue
=========================================================== */

export const OceanBlueTheme = createTheme({

  ...GradientBaseTheme,

  id: "ocean-blue",

  name: "Ocean Blue",

  variant: "gradient",

  palette: {

    ...GradientBaseTheme.palette,

    primary: "#0284C7",

    secondary: "#0EA5E9",

    accent: "#7DD3FC",

  },

});

/* ===========================================================
   Sunset Glow
=========================================================== */

export const SunsetGlowTheme = createTheme({

  ...GradientBaseTheme,

  id: "sunset-glow",

  name: "Sunset Glow",

  variant: "gradient",

  palette: {

    ...GradientBaseTheme.palette,

    primary: "#EA580C",

    secondary: "#F97316",

    accent: "#FDBA74",

  },

});

/* ===========================================================
   Purple Dream
=========================================================== */

export const PurpleDreamTheme = createTheme({

  ...GradientBaseTheme,

  id: "purple-dream",

  name: "Purple Dream",

  variant: "gradient",

  palette: {

    ...GradientBaseTheme.palette,

    primary: "#7C3AED",

    secondary: "#8B5CF6",

    accent: "#C4B5FD",

  },

});

/* ===========================================================
   Emerald Flow
=========================================================== */

export const EmeraldFlowTheme = createTheme({

  ...GradientBaseTheme,

  id: "emerald-flow",

  name: "Emerald Flow",

  variant: "gradient",

  palette: {

    ...GradientBaseTheme.palette,

    primary: "#059669",

    secondary: "#10B981",

    accent: "#6EE7B7",

  },

});

/* ===========================================================
   Registry Update
=========================================================== */

GradientThemes.push(

  AuroraTheme,

  OceanBlueTheme,

  SunsetGlowTheme,

  PurpleDreamTheme,

  EmeraldFlowTheme,

);


/* ===========================================================
   Gradient Theme Collection
   Part - 3 (Professional Themes & Registry)
   Version : 1.0
=========================================================== */

/* ===========================================================
   Cosmic Night
=========================================================== */

export const CosmicNightTheme = createTheme({

  ...GradientBaseTheme,

  id: "cosmic-night",

  name: "Cosmic Night",

  variant: "gradient",

  mode: "dark",

  palette: {

    ...GradientBaseTheme.palette,

    primary: "#1E1B4B",

    secondary: "#312E81",

    accent: "#6366F1",

    background: "#0F172A",

    text: "#F8FAFC",

  },

});

/* ===========================================================
   Neon Pulse
=========================================================== */

export const NeonPulseTheme = createTheme({

  ...GradientBaseTheme,

  id: "neon-pulse",

  name: "Neon Pulse",

  variant: "gradient",

  palette: {

    ...GradientBaseTheme.palette,

    primary: "#06B6D4",

    secondary: "#8B5CF6",

    accent: "#EC4899",

  },

});

/* ===========================================================
   Sky Horizon
=========================================================== */

export const SkyHorizonTheme = createTheme({

  ...GradientBaseTheme,

  id: "sky-horizon",

  name: "Sky Horizon",

  variant: "gradient",

  palette: {

    ...GradientBaseTheme.palette,

    primary: "#38BDF8",

    secondary: "#60A5FA",

    accent: "#BFDBFE",

  },

});

/* ===========================================================
   Peach Bloom
=========================================================== */

export const PeachBloomTheme = createTheme({

  ...GradientBaseTheme,

  id: "peach-bloom",

  name: "Peach Bloom",

  variant: "gradient",

  palette: {

    ...GradientBaseTheme.palette,

    primary: "#FB7185",

    secondary: "#FDBA74",

    accent: "#FEF3C7",

  },

});

/* ===========================================================
   Royal Gradient
=========================================================== */

export const RoyalGradientTheme = createTheme({

  ...GradientBaseTheme,

  id: "royal-gradient",

  name: "Royal Gradient",

  variant: "premium",

  palette: {

    ...GradientBaseTheme.palette,

    primary: "#4338CA",

    secondary: "#7C3AED",

    accent: "#C4B5FD",

  },

});

/* ===========================================================
   Registry Update
=========================================================== */

GradientThemes.push(

  CosmicNightTheme,

  NeonPulseTheme,

  SkyHorizonTheme,

  PeachBloomTheme,

  RoyalGradientTheme,

);

/* ===========================================================
   Theme APIs
=========================================================== */

export function getGradientTheme(

  id: GradientThemeId

): ThemeConfiguration {

  return (

    GradientThemes.find(

      theme => theme.id === id

    ) ?? GradientBaseTheme

  );

}

export function getGradientThemes(): ThemeConfiguration[] {

  return GradientThemes;

}

export function searchGradientThemes(

  keyword: string

): ThemeConfiguration[] {

  const query = keyword.toLowerCase();

  return GradientThemes.filter(

    theme =>

      theme.name

        .toLowerCase()

        .includes(query)

  );

}

/* ===========================================================
   Recommendation API
=========================================================== */

export function getGradientThemesByUseCase(

  useCase: string

): ThemeConfiguration[] {

  const value = useCase.toLowerCase();

  if (value.includes("business")) {

    return [

      RoyalGradientTheme,

      OceanBlueTheme,

    ];

  }

  if (value.includes("creative")) {

    return [

      AuroraTheme,

      PurpleDreamTheme,

    ];

  }

  if (value.includes("portfolio")) {

    return [

      SunsetGlowTheme,

      PeachBloomTheme,

    ];

  }

  if (value.includes("technology")) {

    return [

      CosmicNightTheme,

      NeonPulseTheme,

    ];

  }

  return GradientThemes;

}

/* ===========================================================
   Default Theme
=========================================================== */

export const DEFAULT_GRADIENT_THEME =

  AuroraTheme;

/* ===========================================================
   Registry
=========================================================== */

export const GRADIENT_THEME_REGISTRY = {

  category: "gradient",

  version: "1.0.0",

  totalThemes: GradientThemes.length,

  defaultTheme: DEFAULT_GRADIENT_THEME,

  themes: GradientThemes,

} as const;