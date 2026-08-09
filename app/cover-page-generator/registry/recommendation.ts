/* ===========================================================
   DocSprintHub
   Recommendation Engine
   Part - 1 (Foundation)
   Version : 1.0.0
=========================================================== */

import type { ThemeConfiguration } from "../data/themes/base";

import type { ThemeCategory } from "./theme-registry";

import {

  AllThemes,

  ThemeCollections,

} from "./theme-registry";

/* ===========================================================
   Recommendation Types
=========================================================== */

export type RecommendationMode =

  | "category"

  | "variant"

  | "mode"

  | "document"

  | "featured"

  | "premium"

  | "smart";

/* ===========================================================
   Recommendation Request
=========================================================== */

export interface RecommendationRequest {

  category?: ThemeCategory;

  variant?: string;

  mode?: "light" | "dark";

  documentType?: string;

  limit?: number;

}

/* ===========================================================
   Recommendation Result
=========================================================== */

export interface RecommendationResult {

  mode: RecommendationMode;

  total: number;

  themes: ThemeConfiguration[];

}

/* ===========================================================
   Metadata
=========================================================== */

export const RecommendationMetadata = {

  engine: "Theme Recommendation Engine",

  version: "1.0.0",

  initialized: true,

} as const;

/* ===========================================================
   Configuration
=========================================================== */

export const RecommendationConfiguration = {

  defaultLimit: 10,

  enableSmartRanking: true,

  enableCategoryPriority: true,

  enableVariantPriority: true,

  enableModePriority: true,

} as const;

/* ===========================================================
   Featured Themes
=========================================================== */

export const FeaturedRecommendations = [

  ...ThemeCollections.academic.slice(0, 1),

  ...ThemeCollections.corporate.slice(0, 1),

  ...ThemeCollections.school.slice(0, 1),

  ...ThemeCollections.technology.slice(0, 1),

  ...ThemeCollections.creative.slice(0, 1),

  ...ThemeCollections.minimal.slice(0, 1),

  ...ThemeCollections.gradient.slice(0, 1),

  ...ThemeCollections.glass.slice(0, 1),

  ...ThemeCollections.dark.slice(0, 1),

];

/* ===========================================================
   Premium Themes
=========================================================== */

export const PremiumRecommendations =

  AllThemes.filter(

    theme =>

      (theme.variant ?? "") === "premium"

  );

/* ===========================================================
   Recommendation Cache
=========================================================== */

export const RecommendationCache = {

  featured: FeaturedRecommendations,

  premium: PremiumRecommendations,

};

/* ===========================================================
   Recommendation Engine
   Part - 2 (Recommendation APIs)
   Version : 1.0.0
=========================================================== */

/* ===========================================================
   Recommend By Category
=========================================================== */

export function recommendByCategory(

  category: ThemeCategory,

  limit: number = RecommendationConfiguration.defaultLimit

): RecommendationResult {

  const themes =

    ThemeCollections[category].slice(0, limit);

  return {

    mode: "category",

    total: themes.length,

    themes,

  };

}

/* ===========================================================
   Recommend By Variant
=========================================================== */

export function recommendByVariant(

  variant: string,

  limit: number = RecommendationConfiguration.defaultLimit

): RecommendationResult {

  const themes = AllThemes.filter(

    theme =>

      (theme.variant ?? "").toLowerCase() ===

      variant.toLowerCase()

  ).slice(0, limit);

  return {

    mode: "variant",

    total: themes.length,

    themes,

  };

}

/* ===========================================================
   Recommend By Mode
=========================================================== */

export function recommendByMode(

  mode: "light" | "dark",

  limit: number = RecommendationConfiguration.defaultLimit

): RecommendationResult {

  const themes = AllThemes.filter(

    theme => theme.mode === mode

  ).slice(0, limit);

  return {

    mode: "mode",

    total: themes.length,

    themes,

  };

}

/* ===========================================================
   Recommend By Document Type
=========================================================== */

export function recommendByDocumentType(

  documentType: string,

  limit: number = RecommendationConfiguration.defaultLimit

): RecommendationResult {

  const value = documentType.toLowerCase();

  let themes: ThemeConfiguration[] = [];

  if (

    value.includes("resume") ||

    value.includes("cv")

  ) {

    themes = ThemeCollections.minimal;

  }

  else if (

    value.includes("assignment") ||

    value.includes("homework")

  ) {

    themes = ThemeCollections.school;

  }

  else if (

    value.includes("business") ||

    value.includes("proposal")

  ) {

    themes = ThemeCollections.corporate;

  }

  else if (

    value.includes("technology") ||

    value.includes("engineering")

  ) {

    themes = ThemeCollections.technology;

  }

  else if (

    value.includes("portfolio")

  ) {

    themes = ThemeCollections.creative;

  }

  else {

    themes = FeaturedRecommendations;

  }

  return {

    mode: "document",

    total: Math.min(themes.length, limit),

    themes: themes.slice(0, limit),

  };

}

/* ===========================================================
   Featured Recommendations
=========================================================== */

export function getFeaturedRecommendations(

  limit: number = RecommendationConfiguration.defaultLimit

): RecommendationResult {

  return {

    mode: "featured",

    total: Math.min(

      FeaturedRecommendations.length,

      limit

    ),

    themes:

      FeaturedRecommendations.slice(

        0,

        limit

      ),

  };

}

/* ===========================================================
   Premium Recommendations
=========================================================== */

export function getPremiumRecommendations(

  limit: number = RecommendationConfiguration.defaultLimit

): RecommendationResult {

  return {

    mode: "premium",

    total: Math.min(

      PremiumRecommendations.length,

      limit

    ),

    themes:

      PremiumRecommendations.slice(

        0,

        limit

      ),

  };

}

/* ===========================================================
   Random Recommendations
=========================================================== */

export function getRandomRecommendations(

  limit: number = RecommendationConfiguration.defaultLimit

): RecommendationResult {

  const shuffled =

    [...AllThemes].sort(

      () => Math.random() - 0.5

    );

  return {

    mode: "smart",

    total: Math.min(

      shuffled.length,

      limit

    ),

    themes:

      shuffled.slice(

        0,

        limit

      ),

  };

}

/* ===========================================================
   Recommendation Engine
   Part - 3 (Smart Engine & SDK)
   Version : 1.0.0
=========================================================== */

/* ===========================================================
   Smart Recommendation
=========================================================== */

export function smartRecommendation(

  request: RecommendationRequest

): RecommendationResult {

  if (request.category) {

    return recommendByCategory(

      request.category,

      request.limit

    );

  }

  if (request.variant) {

    return recommendByVariant(

      request.variant,

      request.limit

    );

  }

  if (request.mode) {

    return recommendByMode(

      request.mode,

      request.limit

    );

  }

  if (request.documentType) {

    return recommendByDocumentType(

      request.documentType,

      request.limit

    );

  }

  return getFeaturedRecommendations(

    request.limit

  );

}

/* ===========================================================
   Recommendation Statistics
=========================================================== */

export function getRecommendationStatistics() {

  return {

    totalThemes: AllThemes.length,

    featuredThemes:

      FeaturedRecommendations.length,

    premiumThemes:

      PremiumRecommendations.length,

    version:

      RecommendationMetadata.version,

  };

}

/* ===========================================================
   Recommendation SDK
=========================================================== */

export const RecommendationEngine = {

  metadata:

    RecommendationMetadata,

  configuration:

    RecommendationConfiguration,

  cache:

    RecommendationCache,

  recommendByCategory,

  recommendByVariant,

  recommendByMode,

  recommendByDocumentType,

  getFeaturedRecommendations,

  getPremiumRecommendations,

  getRandomRecommendations,

  smartRecommendation,

  getRecommendationStatistics,

} as const;

/* ===========================================================
   Default Export
=========================================================== */

export default RecommendationEngine;
