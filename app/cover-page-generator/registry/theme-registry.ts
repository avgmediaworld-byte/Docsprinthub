/* ===========================================================
   DocSprintHub
   Global Theme Registry
   Part - 1 (Foundation)
   Version : 1.0.0
=========================================================== */

import type { ThemeConfiguration } from "../data/themes/base";

/* ===========================================================
   Theme Collections
=========================================================== */

import {

  AcademicThemes,

  AcademicThemeCollection,

} from "../data/themes/academic";

import {

  CorporateThemes,

  CorporateThemeCollection,

} from "../data/themes/corporate";

import {

  SchoolThemes,

  SchoolThemeCollection,

} from "../data/themes/school";

import {

  TechnologyThemes,

  TechnologyThemeCollection,

} from "../data/themes/technology";

import {

  CreativeThemes,

  CreativeThemeCollection,

} from "../data/themes/creative";

import {

  MinimalThemes,

  MinimalThemeCollection,

} from "../data/themes/minimal";

import {

  GradientThemes,

  GradientThemeCollection,

} from "../data/themes/gradient";

import {

  GlassThemes,

  GlassThemeCollection,

} from "../data/themes/glass";

import {

  DarkThemes,

  DarkThemeCollection,

} from "../data/themes/dark";

/* ===========================================================
   Theme Categories
=========================================================== */

export type ThemeCategory =

  | "academic"

  | "corporate"

  | "school"

  | "technology"

  | "creative"

  | "minimal"

  | "gradient"

  | "glass"

  | "dark";

/* ===========================================================
   Category Registry
=========================================================== */

export const ThemeCategories = {

  academic: AcademicThemeCollection,

  corporate: CorporateThemeCollection,

  school: SchoolThemeCollection,

  technology: TechnologyThemeCollection,

  creative: CreativeThemeCollection,

  minimal: MinimalThemeCollection,

  gradient: GradientThemeCollection,

  glass: GlassThemeCollection,

  dark: DarkThemeCollection,

} as const;

/* ===========================================================
   Global Theme Registry
=========================================================== */

export const ThemeCollections = {

  academic: AcademicThemes,

  corporate: CorporateThemes,

  school: SchoolThemes,

  technology: TechnologyThemes,

  creative: CreativeThemes,

  minimal: MinimalThemes,

  gradient: GradientThemes,

  glass: GlassThemes,

  dark: DarkThemes,

} as const;

/* ===========================================================
   Registry Metadata
=========================================================== */

export const ThemeRegistryMetadata = {

  name: "DocSprintHub Theme Registry",

  version: "1.0.0",

  categories: 9,

  initialized: true,

} as const;

/* ===========================================================
   Registry Configuration
=========================================================== */

export const ThemeRegistryConfiguration = {

  cache: true,

  runtimeRegistration: true,

  lazyLoading: true,

  recommendations: true,

  statistics: true,

  aiReady: true,

} as const;

/* ===========================================================
   Global Theme Registry
   Part - 2 (Lookup Engine)
   Version : 1.0.0
=========================================================== */

/* ===========================================================
   Global Theme List
=========================================================== */

export const AllThemes: ThemeConfiguration[] = [

  ...AcademicThemes,

  ...CorporateThemes,

  ...SchoolThemes,

  ...TechnologyThemes,

  ...CreativeThemes,

  ...MinimalThemes,

  ...GradientThemes,

  ...GlassThemes,

  ...DarkThemes,

];

/* ===========================================================
   Theme Map
=========================================================== */

export const ThemeMap = new Map<
  string,
  ThemeConfiguration
>();

AllThemes.forEach(theme => {

  ThemeMap.set(theme.id, theme);

});

/* ===========================================================
   Category Map
=========================================================== */

export const CategoryMap = new Map<
  ThemeCategory,
  ThemeConfiguration[]
>();

CategoryMap.set("academic", AcademicThemes);

CategoryMap.set("corporate", CorporateThemes);

CategoryMap.set("school", SchoolThemes);

CategoryMap.set("technology", TechnologyThemes);

CategoryMap.set("creative", CreativeThemes);

CategoryMap.set("minimal", MinimalThemes);

CategoryMap.set("gradient", GradientThemes);

CategoryMap.set("glass", GlassThemes);

CategoryMap.set("dark", DarkThemes);

/* ===========================================================
   Registry Statistics
=========================================================== */

export const ThemeStatistics = {

  totalThemes: AllThemes.length,

  totalCategories: CategoryMap.size,

  initialized: true,

};

/* ===========================================================
   Featured Themes
=========================================================== */

export const FeaturedThemes: ThemeConfiguration[] = [

  AcademicThemes[0],

  CorporateThemes[0],

  SchoolThemes[0],

  TechnologyThemes[0],

  CreativeThemes[0],

  MinimalThemes[0],

  GradientThemes[0],

  GlassThemes[0],

  DarkThemes[0],

];

/* ===========================================================
   Premium Themes
=========================================================== */

export const PremiumThemes =

  AllThemes.filter(

    theme =>

      theme.variant === "premium"

  );

/* ===========================================================
   Modern Themes
=========================================================== */

export const ModernThemes =

  AllThemes.filter(

    theme =>

      theme.variant === "modern"

  );

/* ===========================================================
   Glass Themes
=========================================================== */

export const GlassCollection =

  AllThemes.filter(

    theme =>

      theme.variant === "glass"

  );

/* ===========================================================
   Minimal Themes
=========================================================== */

export const MinimalCollection =

  AllThemes.filter(

    theme =>

      theme.variant === "minimal"

  );

/* ===========================================================
   Dark Themes
=========================================================== */

export const DarkCollection =

  AllThemes.filter(

    theme =>

      theme.mode === "dark"

  );

/* ===========================================================
   Registry Cache
=========================================================== */

export const RegistryCache = {

  themes: ThemeMap,

  categories: CategoryMap,

  featured: FeaturedThemes,

  premium: PremiumThemes,

  modern: ModernThemes,

  glass: GlassCollection,

  minimal: MinimalCollection,

  dark: DarkCollection,

};

/* ===========================================================
   Global Theme Registry
   Part - 3 (Public APIs & SDK)
   Version : 1.0.0
=========================================================== */

/* ===========================================================
   Public APIs
=========================================================== */

export function getAllThemes(): ThemeConfiguration[] {

  return AllThemes;

}

export function getThemeById(

  id: string

): ThemeConfiguration | undefined {

  return ThemeMap.get(id);

}

export function getThemesByCategory(

  category: ThemeCategory

): ThemeConfiguration[] {

  return CategoryMap.get(category) ?? [];

}

export function getFeaturedThemes(): ThemeConfiguration[] {

  return FeaturedThemes;

}

export function getPremiumThemes(): ThemeConfiguration[] {

  return PremiumThemes;

}

export function getModernThemes(): ThemeConfiguration[] {

  return ModernThemes;

}

export function getGlassThemes(): ThemeConfiguration[] {

  return GlassCollection;

}

export function getMinimalThemes(): ThemeConfiguration[] {

  return MinimalCollection;

}

export function getDarkThemes(): ThemeConfiguration[] {

  return DarkCollection;

}

/* ===========================================================
   Search
=========================================================== */

  export function searchThemes(

    keyword: string

  ): ThemeConfiguration[] {

    const query = keyword.trim().toLowerCase();

    if (!query) {

      return [];

    }

  return AllThemes.filter(theme =>

    theme.name.toLowerCase().includes(query) ||

    theme.id.toLowerCase().includes(query)

  );

}

export function hasTheme(
  id: string
): boolean {
  return ThemeMap.has(id);
}

/* ===========================================================
   Random Theme
=========================================================== */

export function getRandomTheme():

  ThemeConfiguration {

  return AllThemes[

    Math.floor(

      Math.random() * AllThemes.length

    )

  ];

}

/* ===========================================================
   Statistics
=========================================================== */

export function getThemeStatistics() {

  return ThemeStatistics;

}

  /* ===========================================================
    Safe Theme Lookup
  =========================================================== */

  export function requireTheme(
    id: string
  ): ThemeConfiguration {

    const theme = ThemeMap.get(id);

    if (!theme) {

      throw new Error(
        `Theme '${id}' not found`
      );

    }

    return theme;

  }

/* ===========================================================
   Theme Registry SDK
=========================================================== */

export const ThemeRegistry = {

  metadata: ThemeRegistryMetadata,

  configuration: ThemeRegistryConfiguration,

  collections: ThemeCollections,

  categories: ThemeCategories,

  cache: RegistryCache,

  statistics: ThemeStatistics,

  getAllThemes,

  getThemeById,

  hasTheme,

  requireTheme,

  getThemesByCategory,

  getFeaturedThemes,

  getPremiumThemes,

  getModernThemes,

  getGlassThemes,

  getMinimalThemes,

  getDarkThemes,

  searchThemes,

  getRandomTheme,

  getThemeStatistics,

} as const;

/* ===========================================================
   Default Export
=========================================================== */

export default ThemeRegistry;