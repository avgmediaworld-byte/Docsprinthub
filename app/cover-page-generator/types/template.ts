/* ===========================================================
   DocSprintHub Cover Page Generator
   Template Type System
   Version : 2.0
   Enterprise Architecture
=========================================================== */

import type { ThemeCategory, CoverTheme } from "./theme";

export type TemplateCategory = ThemeCategory | "magazine";

/* ===========================================================
   Template Status
=========================================================== */

export type TemplateStatus =
  | "draft"
  | "beta"
  | "stable"
  | "deprecated";

/* ===========================================================
   Template Type
=========================================================== */

export type TemplateType =
  | "cover-page"
  | "assignment"
  | "report"
  | "thesis"
  | "portfolio"
  | "proposal"
  | "magazine"
  | "certificate";

/* ===========================================================
   Visibility
=========================================================== */

export type TemplateVisibility =
  | "public"
  | "private"
  | "premium";

/* ===========================================================
   Difficulty
=========================================================== */

export type TemplateComplexity =
  | "basic"
  | "standard"
  | "professional"
  | "premium";

/* ===========================================================
   Thumbnail
=========================================================== */

export interface TemplateThumbnail {

  small: string;

  medium: string;

  large: string;

}

/* ===========================================================
   Preview
=========================================================== */

export interface TemplatePreview {

  desktop: string;

  mobile?: string;

  dark?: string;

}

/* ===========================================================
   Author
=========================================================== */

export interface TemplateAuthor {

  id?: string;

  name: string;

  website?: string;

}

/* ===========================================================
   Version
=========================================================== */

export interface TemplateVersion {

  version: string;

  releasedAt: string;

  updatedAt?: string;

}

/* ===========================================================
   Template Features
=========================================================== */

export interface TemplateFeatures {

  editable: boolean;

  logo: boolean;

  photo: boolean;

  qr: boolean;

  watermark: boolean;

  darkMode: boolean;

  multilingual: boolean;

  printReady: boolean;

}

/* ===========================================================
   Template Statistics
=========================================================== */

export interface TemplateStats {

  downloads?: number;

  views?: number;

  likes?: number;

  rating?: number;

}

/* ===========================================================
   Search Metadata
=========================================================== */

export interface TemplateSearch {

  keywords: string[];

  tags: string[];

}

/* ===========================================================
   Template Metadata
=========================================================== */

export interface TemplateMeta {

  author: TemplateAuthor;

  version: TemplateVersion;

  status: TemplateStatus;

  visibility: TemplateVisibility;

  complexity: TemplateComplexity;

  featured: boolean;

  popular: boolean;

  newest: boolean;

  premium: boolean;

  description: string;

}

/* ===========================================================
   Template Component
=========================================================== */

export interface TemplateComponent {

  component: unknown;

}

/* ===========================================================
   Main Template
=========================================================== */

export interface CoverTemplate {

  id: string;

  slug: string;

  name: string;

  category: ThemeCategory;

  type: TemplateType;

  thumbnail: TemplateThumbnail;

  preview: TemplatePreview;

  theme: CoverTheme;

  component: TemplateComponent;

  features: TemplateFeatures;

  stats: TemplateStats;

  search: TemplateSearch;

  meta: TemplateMeta;

}

/* ===========================================================
   Registry
=========================================================== */

export type TemplateRegistry = Record<
  string,
  CoverTemplate
>;

/* ===========================================================
   Collection
=========================================================== */

export type TemplateCollection = CoverTemplate[];

/* ===========================================================
   Filter
=========================================================== */

export interface TemplateFilter {

  category?: ThemeCategory;

  type?: TemplateType;

  premium?: boolean;

  featured?: boolean;

  popular?: boolean;

  newest?: boolean;

  search?: string;

}

/* ===========================================================
   Sort
=========================================================== */

export type TemplateSort =

  | "popular"

  | "latest"

  | "downloads"

  | "rating"

  | "alphabetical";

/* ===========================================================
   Pagination
=========================================================== */

export interface TemplatePagination {

  page: number;

  limit: number;

  total: number;

}

/* ===========================================================
   Template Response
=========================================================== */

export interface TemplateResult {

  items: CoverTemplate[];

  pagination: TemplatePagination;

}

/* ===========================================================
   AI Recommendation
=========================================================== */

export interface TemplateRecommendation {

  templateId: string;

  score: number;

  reason: string;

}
