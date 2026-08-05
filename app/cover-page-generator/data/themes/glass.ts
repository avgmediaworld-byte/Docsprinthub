/* ===========================================================
   DocSprintHub
   Glass Theme Collection
   Part - 1 (Foundation)
   Version : 1.0
=========================================================== */

import {
  createTheme,
  type ThemeConfiguration,
} from "./base";

/* ===========================================================
   Glass Theme IDs
=========================================================== */

export type GlassThemeId =
  | "glass-frost"
  | "glass-crystal"
  | "glass-ocean"
  | "glass-aurora"
  | "glass-sky"
  | "glass-premium"
  | "glass-neon"
  | "glass-silver"
  | "glass-midnight"
  | "glass-prism";

/* ===========================================================
   Glass Base Theme
=========================================================== */

export const GlassBaseTheme = createTheme({

  id: "glass-frost",

  name: "Glass Base",

  mode: "light",

  variant: "glass",

  status: "stable",

  palette: {

    primary: "#2563EB",

    secondary: "#7C3AED",

    accent: "#06B6D4",

    success: "#22C55E",

    warning: "#F59E0B",

    danger: "#EF4444",

    text: "#111827",

    muted: "#6B7280",

    border: "rgba(255,255,255,0.35)",

    background: "#F8FAFC",

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

export const GlassThemes: ThemeConfiguration[] = [

  GlassBaseTheme,

];

/* ===========================================================
   Collection Metadata
=========================================================== */

export const GlassThemeCollection = {

  id: "glass",

  name: "Glass",

  description:
    "Glassmorphism inspired premium themes with blur, transparency and frosted effects.",

  totalThemes: 10,

};

/* ===========================================================
   Categories
=========================================================== */

export const GlassCategories = [

  "Glassmorphism",

  "Modern",

  "Corporate",

  "Creative",

  "Technology",

  "Luxury",

] as const;

/* ===========================================================
   Recommended Use Cases
=========================================================== */

export const GlassUseCases = [

  "Presentation",

  "Cover Page",

  "Portfolio",

  "Business Proposal",

  "Project Report",

  "Magazine",

  "Resume",

  "Brochure",

  "Company Profile",

  "Pitch Deck",

] as const;

/* ===========================================================
   Glass Effects
=========================================================== */

export const GlassEffects = [

  "Frosted",

  "Crystal",

  "Blur",

  "Acrylic",

  "Translucent",

  "Reflective",

] as const;

/* ===========================================================
   Transparency Levels
=========================================================== */

export const GlassTransparency = [

  "Low",

  "Medium",

  "High",

  "Ultra",

] as const;

/* ===========================================================
   Glass Theme Collection
   Part - 2 (Premium Glass Themes)
   Version : 1.0
=========================================================== */

/* ===========================================================
   Glass Frost
=========================================================== */

export const GlassFrostTheme = createTheme({

  ...GlassBaseTheme,

  id: "glass-frost",

  name: "Glass Frost",

});

/* ===========================================================
   Glass Crystal
=========================================================== */

export const GlassCrystalTheme = createTheme({

  ...GlassBaseTheme,

  id: "glass-crystal",

  name: "Glass Crystal",

  variant: "glass",

  palette: {

    ...GlassBaseTheme.palette,

    primary: "#38BDF8",

    secondary: "#7DD3FC",

    accent: "#E0F2FE",

  },

});

/* ===========================================================
   Glass Ocean
=========================================================== */

export const GlassOceanTheme = createTheme({

  ...GlassBaseTheme,

  id: "glass-ocean",

  name: "Glass Ocean",

  variant: "glass",

  palette: {

    ...GlassBaseTheme.palette,

    primary: "#0284C7",

    secondary: "#0EA5E9",

    accent: "#BAE6FD",

  },

});

/* ===========================================================
   Glass Aurora
=========================================================== */

export const GlassAuroraTheme = createTheme({

  ...GlassBaseTheme,

  id: "glass-aurora",

  name: "Glass Aurora",

  variant: "glass",

  palette: {

    ...GlassBaseTheme.palette,

    primary: "#7C3AED",

    secondary: "#A855F7",

    accent: "#DDD6FE",

  },

});

/* ===========================================================
   Glass Sky
=========================================================== */

export const GlassSkyTheme = createTheme({

  ...GlassBaseTheme,

  id: "glass-sky",

  name: "Glass Sky",

  variant: "glass",

  palette: {

    ...GlassBaseTheme.palette,

    primary: "#2563EB",

    secondary: "#60A5FA",

    accent: "#BFDBFE",

  },

});

/* ===========================================================
   Registry Update
=========================================================== */

GlassThemes.push(

  GlassFrostTheme,

  GlassCrystalTheme,

  GlassOceanTheme,

  GlassAuroraTheme,

  GlassSkyTheme,

);

/* ===========================================================
   Glass Theme Collection
   Part - 3 (Professional Themes & Registry)
   Version : 1.0
=========================================================== */

/* ===========================================================
   Glass Premium
=========================================================== */

export const GlassPremiumTheme = createTheme({

  ...GlassBaseTheme,

  id: "glass-premium",

  name: "Glass Premium",

  variant: "premium",

  palette: {

    ...GlassBaseTheme.palette,

    primary: "#4338CA",

    secondary: "#6366F1",

    accent: "#C4B5FD",

  },

});

/* ===========================================================
   Glass Neon
=========================================================== */

export const GlassNeonTheme = createTheme({

  ...GlassBaseTheme,

  id: "glass-neon",

  name: "Glass Neon",

  variant: "glass",

  palette: {

    ...GlassBaseTheme.palette,

    primary: "#06B6D4",

    secondary: "#22D3EE",

    accent: "#67E8F9",

  },

});

/* ===========================================================
   Glass Silver
=========================================================== */

export const GlassSilverTheme = createTheme({

  ...GlassBaseTheme,

  id: "glass-silver",

  name: "Glass Silver",

  variant: "glass",

  palette: {

    ...GlassBaseTheme.palette,

    primary: "#64748B",

    secondary: "#94A3B8",

    accent: "#CBD5E1",

  },

});

/* ===========================================================
   Glass Midnight
=========================================================== */

export const GlassMidnightTheme = createTheme({

  ...GlassBaseTheme,

  id: "glass-midnight",

  name: "Glass Midnight",

  mode: "dark",

  variant: "glass",

  palette: {

    ...GlassBaseTheme.palette,

    primary: "#0F172A",

    secondary: "#1E293B",

    accent: "#475569",

    background: "#020617",

    text: "#F8FAFC",

    border: "rgba(255,255,255,0.15)",

  },

});

/* ===========================================================
   Glass Prism
=========================================================== */

export const GlassPrismTheme = createTheme({

  ...GlassBaseTheme,

  id: "glass-prism",

  name: "Glass Prism",

  variant: "glass",

  palette: {

    ...GlassBaseTheme.palette,

    primary: "#EC4899",

    secondary: "#8B5CF6",

    accent: "#38BDF8",

  },

});

/* ===========================================================
   Registry Update
=========================================================== */

GlassThemes.push(

  GlassPremiumTheme,

  GlassNeonTheme,

  GlassSilverTheme,

  GlassMidnightTheme,

  GlassPrismTheme,

);

/* ===========================================================
   Theme APIs
=========================================================== */

export function getGlassTheme(

  id: GlassThemeId

): ThemeConfiguration {

  return (

    GlassThemes.find(

      theme => theme.id === id

    ) ?? GlassBaseTheme

  );

}

export function getGlassThemes(): ThemeConfiguration[] {

  return GlassThemes;

}

export function searchGlassThemes(

  keyword: string

): ThemeConfiguration[] {

  const query = keyword.toLowerCase();

  return GlassThemes.filter(

    theme =>

      theme.name

        .toLowerCase()

        .includes(query)

  );

}

/* ===========================================================
   Recommendation API
=========================================================== */

export function getGlassThemesByUseCase(

  useCase: string

): ThemeConfiguration[] {

  const value = useCase.toLowerCase();

  if (value.includes("business")) {

    return [

      GlassPremiumTheme,

      GlassCrystalTheme,

    ];

  }

  if (value.includes("technology")) {

    return [

      GlassNeonTheme,

      GlassMidnightTheme,

    ];

  }

  if (value.includes("creative")) {

    return [

      GlassAuroraTheme,

      GlassPrismTheme,

    ];

  }

  if (value.includes("portfolio")) {

    return [

      GlassOceanTheme,

      GlassSkyTheme,

    ];

  }

  return GlassThemes;

}

/* ===========================================================
   Default Theme
=========================================================== */

export const DEFAULT_GLASS_THEME =

  GlassFrostTheme;

/* ===========================================================
   Registry
=========================================================== */

export const GLASS_THEME_REGISTRY = {

  category: "glass",

  version: "1.0.0",

  totalThemes: GlassThemes.length,

  defaultTheme: DEFAULT_GLASS_THEME,

  themes: GlassThemes,

} as const;