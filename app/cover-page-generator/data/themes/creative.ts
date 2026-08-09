/* ===========================================================
   DocSprintHub
   Creative Theme Collection
   Part - 1 (Foundation)
   Version : 1.0
=========================================================== */

import {
  createTheme,
  type ThemeConfiguration,
} from "./base";

/* ===========================================================
   Creative Theme IDs
=========================================================== */

export type CreativeThemeId =
  | "portfolio-pro"
  | "graphic-design"
  | "photography"
  | "architecture"
  | "interior-design"
  | "fashion-lookbook"
  | "fine-arts"
  | "ui-ux"
  | "magazine-editorial"
  | "creative-studio";

/* ===========================================================
   Creative Base Theme
=========================================================== */

export const CreativeBaseTheme = createTheme({

  id: "portfolio-pro",

  name: "Creative Base",

  mode: "light",

  variant: "creative",

  status: "stable",

  palette: {

    primary: "#9333EA",

    secondary: "#C084FC",

    accent: "#F472B6",

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

export const CreativeThemes: ThemeConfiguration[] = [

  CreativeBaseTheme,

];

/* ===========================================================
   Collection Metadata
=========================================================== */

export const CreativeThemeCollection = {

  id: "creative",

  name: "Creative",

  description:
    "Creative themes for portfolios, design projects, architecture, photography and magazines.",

  totalThemes: 10,

};

/* ===========================================================
   Categories
=========================================================== */

export const CreativeCategories = [

  "Portfolio",

  "Graphic Design",

  "Photography",

  "Architecture",

  "Interior",

  "Fashion",

  "Magazine",

  "UI/UX",

] as const;

/* ===========================================================
   Recommended Use Cases
=========================================================== */

export const CreativeUseCases = [

  "Portfolio",

  "Photography",

  "Architecture Project",

  "Interior Design",

  "Magazine Cover",

  "Graphic Design",

  "Fashion Design",

  "Creative Presentation",

  "Brand Book",

  "Case Study",

] as const;

/* ===========================================================
   Supported Industries
=========================================================== */

export const SupportedCreativeIndustries = [

  "Graphic Design",

  "Photography",

  "Architecture",

  "Interior Design",

  "Fashion",

  "Animation",

  "Film",

  "UI/UX",

  "Branding",

  "Advertising",

] as const; 

/* ===========================================================
   Creative Theme Collection
   Part - 2 (Premium Creative Themes)
   Version : 1.0
=========================================================== */

/* ===========================================================
   Portfolio Pro
=========================================================== */

export const PortfolioProTheme = createTheme({

  ...CreativeBaseTheme,

  id: "portfolio-pro",

  name: "Portfolio Pro",

  mode: "dark",

  layoutId: "creative01",

  backgroundId: "royal-purple",

  decorationIds: [
    "corner-ribbon",
  ],

  palette: {

    ...CreativeBaseTheme.palette,

    primary: "#FDF4FF",

    secondary: "#F0ABFC",

    accent: "#F9A8D4",

    text: "#0F172A",

    border: "#F0ABFC",

  },

});

/* ===========================================================
   Graphic Design
=========================================================== */

export const GraphicDesignTheme = createTheme({

  ...CreativeBaseTheme,

  id: "graphic-design",

  name: "Graphic Design",

  variant: "creative",

  palette: {

    ...CreativeBaseTheme.palette,

    primary: "#7C3AED",

    secondary: "#A855F7",

    accent: "#EC4899",

  },

});

/* ===========================================================
   Photography
=========================================================== */

export const PhotographyTheme = createTheme({

  ...CreativeBaseTheme,

  id: "photography",

  name: "Photography",

  variant: "minimal",

  palette: {

    ...CreativeBaseTheme.palette,

    primary: "#111827",

    secondary: "#374151",

    accent: "#9CA3AF",

  },

  typography: {

    ...CreativeBaseTheme.typography,

    headingFont: "Playfair Display",

    bodyFont: "Inter",

  },

});

/* ===========================================================
   Architecture
=========================================================== */

export const ArchitectureTheme = createTheme({

  ...CreativeBaseTheme,

  id: "architecture",

  name: "Architecture",

  variant: "professional",

  palette: {

    ...CreativeBaseTheme.palette,

    primary: "#334155",

    secondary: "#475569",

    accent: "#CBD5E1",

  },

});

/* ===========================================================
   Interior Design
=========================================================== */

export const InteriorDesignTheme = createTheme({

  ...CreativeBaseTheme,

  id: "interior-design",

  name: "Interior Design",

  variant: "glass",

  palette: {

    ...CreativeBaseTheme.palette,

    primary: "#B45309",

    secondary: "#D97706",

    accent: "#FBBF24",

  },

});

/* ===========================================================
   Registry Update
=========================================================== */

CreativeThemes.push(

  PortfolioProTheme,

  GraphicDesignTheme,

  PhotographyTheme,

  ArchitectureTheme,

  InteriorDesignTheme,

);

/* ===========================================================
   Creative Theme Collection
   Part - 3 (Professional Themes & Registry)
   Version : 1.0
=========================================================== */

/* ===========================================================
   Fashion Lookbook
=========================================================== */

export const FashionLookbookTheme = createTheme({

  ...CreativeBaseTheme,

  id: "fashion-lookbook",

  name: "Fashion Lookbook",

  variant: "premium",

  palette: {

    ...CreativeBaseTheme.palette,

    primary: "#DB2777",

    secondary: "#EC4899",

    accent: "#F9A8D4",

  },

});

/* ===========================================================
   Fine Arts
=========================================================== */

export const FineArtsTheme = createTheme({

  ...CreativeBaseTheme,

  id: "fine-arts",

  name: "Fine Arts",

  variant: "creative",

  palette: {

    ...CreativeBaseTheme.palette,

    primary: "#EA580C",

    secondary: "#FB923C",

    accent: "#FED7AA",

  },

});

/* ===========================================================
   UI / UX
=========================================================== */

export const UIUXTheme = createTheme({

  ...CreativeBaseTheme,

  id: "ui-ux",

  name: "UI / UX",

  variant: "glass",

  palette: {

    ...CreativeBaseTheme.palette,

    primary: "#2563EB",

    secondary: "#38BDF8",

    accent: "#BFDBFE",

  },

});

/* ===========================================================
   Magazine Editorial
=========================================================== */

export const MagazineEditorialTheme = createTheme({

  ...CreativeBaseTheme,

  id: "magazine-editorial",

  name: "Magazine Editorial",

  variant: "classic",

  typography: {

    ...CreativeBaseTheme.typography,

    headingFont: "Playfair Display",

    bodyFont: "Inter",

  },

  palette: {

    ...CreativeBaseTheme.palette,

    primary: "#111827",

    secondary: "#374151",

    accent: "#9CA3AF",

  },

});

/* ===========================================================
   Creative Studio
=========================================================== */

export const CreativeStudioTheme = createTheme({

  ...CreativeBaseTheme,

  id: "creative-studio",

  name: "Creative Studio",

  variant: "modern",

  palette: {

    ...CreativeBaseTheme.palette,

    primary: "#6D28D9",

    secondary: "#8B5CF6",

    accent: "#C4B5FD",

  },

});

/* ===========================================================
   Registry Update
=========================================================== */

CreativeThemes.push(

  FashionLookbookTheme,

  FineArtsTheme,

  UIUXTheme,

  MagazineEditorialTheme,

  CreativeStudioTheme,

);

/* ===========================================================
   Theme APIs
=========================================================== */

export function getCreativeTheme(

  id: CreativeThemeId

): ThemeConfiguration {

  return (

    CreativeThemes.find(

      theme => theme.id === id

    ) ?? CreativeBaseTheme

  );

}

export function getCreativeThemes(): ThemeConfiguration[] {

  return CreativeThemes;

}

export function searchCreativeThemes(

  keyword: string

): ThemeConfiguration[] {

  const query = keyword.toLowerCase();

  return CreativeThemes.filter(

    theme =>

      theme.name

        .toLowerCase()

        .includes(query)

  );

}

/* ===========================================================
   Recommendation API
=========================================================== */

export function getCreativeThemesByUseCase(

  useCase: string

): ThemeConfiguration[] {

  const value = useCase.toLowerCase();

  if (value.includes("portfolio")) {

    return [PortfolioProTheme];

  }

  if (value.includes("graphic")) {

    return [GraphicDesignTheme];

  }

  if (value.includes("photo")) {

    return [PhotographyTheme];

  }

  if (value.includes("architecture")) {

    return [ArchitectureTheme];

  }

  if (value.includes("interior")) {

    return [InteriorDesignTheme];

  }

  if (value.includes("fashion")) {

    return [FashionLookbookTheme];

  }

  if (value.includes("ui") || value.includes("ux")) {

    return [UIUXTheme];

  }

  if (value.includes("magazine")) {

    return [MagazineEditorialTheme];

  }

  return CreativeThemes;

}

/* ===========================================================
   Default Theme
=========================================================== */

export const DEFAULT_CREATIVE_THEME =

  PortfolioProTheme;

/* ===========================================================
   Registry
=========================================================== */

export const CREATIVE_THEME_REGISTRY = {

  category: "creative",

  version: "1.0.0",

  totalThemes: CreativeThemes.length,

  defaultTheme: DEFAULT_CREATIVE_THEME,

  themes: CreativeThemes,

} as const;
