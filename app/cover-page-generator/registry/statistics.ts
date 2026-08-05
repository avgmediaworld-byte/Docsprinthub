/* ===========================================================
   DocSprintHub
   Registry Statistics Engine
   Part - 1 (Foundation)
   Version : 1.0.0
=========================================================== */

import type { ThemeConfiguration } from "../themes/base";

import {

  AllThemes,

  ThemeCollections,

  ThemeCategories,

} from "./theme-registry";

/* ===========================================================
   Statistics Types
=========================================================== */

export interface ThemeStatistics {

  totalThemes: number;

  totalCategories: number;

  lightThemes: number;

  darkThemes: number;

  premiumThemes: number;

  modernThemes: number;

  glassThemes: number;

  minimalThemes: number;

}

/* ===========================================================
   Category Statistics
=========================================================== */

export interface CategoryStatistics {

  id: string;

  name: string;

  totalThemes: number;

}

/* ===========================================================
   Statistics Metadata
=========================================================== */

export const StatisticsMetadata = {

  engine: "Registry Statistics",

  version: "1.0.0",

  initialized: true,

} as const;

/* ===========================================================
   Statistics Configuration
=========================================================== */

export const StatisticsConfiguration = {

  enableCaching: true,

  autoRefresh: false,

  includeRuntime: true,

} as const;

/* ===========================================================
   Statistics Cache
=========================================================== */

export const StatisticsCache = {

  themes: AllThemes,

  collections: ThemeCollections,

  categories: ThemeCategories,

};

/* ===========================================================
   Default Statistics
=========================================================== */

export const DefaultStatistics: ThemeStatistics = {

  totalThemes: AllThemes.length,

  totalCategories: Object.keys(

    ThemeCollections

  ).length,

  lightThemes: 0,

  darkThemes: 0,

  premiumThemes: 0,

  modernThemes: 0,

  glassThemes: 0,

  minimalThemes: 0,

};

/* ===========================================================
   Registry Statistics Engine
   Part - 2 (Analytics APIs)
   Version : 1.0.0
=========================================================== */

/* ===========================================================
   Theme Statistics
=========================================================== */

export function getThemeStatistics(): ThemeStatistics {

  return {

    totalThemes: AllThemes.length,

    totalCategories: Object.keys(

      ThemeCollections

    ).length,

    lightThemes: AllThemes.filter(

      theme => theme.mode === "light"

    ).length,

    darkThemes: AllThemes.filter(

      theme => theme.mode === "dark"

    ).length,

    premiumThemes: AllThemes.filter(

      theme =>

        (theme.variant ?? "") === "premium"

    ).length,

    modernThemes: AllThemes.filter(

      theme =>

        (theme.variant ?? "") === "modern"

    ).length,

    glassThemes: AllThemes.filter(

      theme =>

        (theme.variant ?? "") === "glass"

    ).length,

    minimalThemes: AllThemes.filter(

      theme =>

        (theme.variant ?? "") === "minimal"

    ).length,

  };

}

/* ===========================================================
   Category Statistics
=========================================================== */

export function getCategoryStatistics():

  CategoryStatistics[] {

  return Object.entries(

    ThemeCollections

  ).map(

    ([key, themes]) => ({

      id: key,

      name:

        ThemeCategories[

          key as keyof typeof ThemeCategories

        ].name,

      totalThemes: themes.length,

    })

  );

}

/* ===========================================================
   Variant Statistics
=========================================================== */

export function getVariantStatistics() {

  return {

    premium: AllThemes.filter(

      theme =>

        (theme.variant ?? "") === "premium"

    ).length,

    modern: AllThemes.filter(

      theme =>

        (theme.variant ?? "") === "modern"

    ).length,

    minimal: AllThemes.filter(

      theme =>

        (theme.variant ?? "") === "minimal"

    ).length,

    glass: AllThemes.filter(

      theme =>

        (theme.variant ?? "") === "glass"

    ).length,

    gradient: AllThemes.filter(

      theme =>

        (theme.variant ?? "") === "gradient"

    ).length,

    classic: AllThemes.filter(

      theme =>

        (theme.variant ?? "") === "classic"

    ).length,

    creative: AllThemes.filter(

      theme =>

        (theme.variant ?? "") === "creative"

    ).length,

  };

}

/* ===========================================================
   Mode Statistics
=========================================================== */

export function getModeStatistics() {

  return {

    light: AllThemes.filter(

      theme => theme.mode === "light"

    ).length,

    dark: AllThemes.filter(

      theme => theme.mode === "dark"

    ).length,

  };

}

/* ===========================================================
   Collection Statistics
=========================================================== */

export function getCollectionStatistics() {

  return Object.entries(

    ThemeCollections

  ).map(

    ([key, themes]) => ({

      category: key,

      themes: themes.length,

    })

  );

}

/* ===========================================================
   Registry Health
=========================================================== */

export function getRegistryHealth() {

  return {

    initialized: true,

    totalThemes: AllThemes.length,

    totalCategories:

      Object.keys(

        ThemeCollections

      ).length,

    status: "healthy",

    version:

      StatisticsMetadata.version,

  };

}




/* ===========================================================
   Registry Statistics Engine
   Part - 3 (SDK & Dashboard)
   Version : 1.0.0
=========================================================== */

/* ===========================================================
   Statistics Dashboard
=========================================================== */

export function getStatisticsDashboard() {

  return {

    themes: getThemeStatistics(),

    categories: getCategoryStatistics(),

    variants: getVariantStatistics(),

    modes: getModeStatistics(),

    collections: getCollectionStatistics(),

    health: getRegistryHealth(),

  };

}

/* ===========================================================
   Refresh Statistics
=========================================================== */

export function refreshStatistics() {

  return {

    refreshedAt: new Date(),

    dashboard: getStatisticsDashboard(),

  };

}

/* ===========================================================
   Cache Information
=========================================================== */

export function getStatisticsCache() {

  return StatisticsCache;

}

/* ===========================================================
   Registry Summary
=========================================================== */

export function getRegistrySummary() {

  const themeStats = getThemeStatistics();

  return {

    version: StatisticsMetadata.version,

    totalThemes: themeStats.totalThemes,

    totalCategories: themeStats.totalCategories,

    lightThemes: themeStats.lightThemes,

    darkThemes: themeStats.darkThemes,

    premiumThemes: themeStats.premiumThemes,

    registryHealth: getRegistryHealth().status,

  };

}

/* ===========================================================
   Statistics SDK
=========================================================== */

export const StatisticsEngine = {

  metadata: StatisticsMetadata,

  configuration: StatisticsConfiguration,

  cache: StatisticsCache,

  getThemeStatistics,

  getCategoryStatistics,

  getVariantStatistics,

  getModeStatistics,

  getCollectionStatistics,

  getRegistryHealth,

  getStatisticsDashboard,

  refreshStatistics,

  getStatisticsCache,

  getRegistrySummary,

} as const;

/* ===========================================================
   Default Export
=========================================================== */

export default StatisticsEngine;