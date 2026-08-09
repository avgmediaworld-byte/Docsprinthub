/* ===========================================================
   DocSprintHub Cover Page Generator
   Theme Type System
   Version : 2.0
   Enterprise Architecture
   =========================================================== */

/* -----------------------------------------------------------
   Theme Category
----------------------------------------------------------- */

export type ThemeCategory =
  | "academic"
  | "corporate"
  | "creative"
  | "school"
  | "technology"
  | "minimal"
  | "gradient"
  | "glass"
  | "dark"
  | "premium";

/* -----------------------------------------------------------
   Theme Variant
----------------------------------------------------------- */

export type ThemeVariant =
  | "light"
  | "dark"
  | "glass"
  | "gradient"
  | "solid"
  | "creative"
  | "professional"
  | "technology"
  | "luxury";

/* -----------------------------------------------------------
   Color Palette
----------------------------------------------------------- */

export interface ThemePalette {
  primary: string;

  secondary: string;

  accent: string;

  background: string;

  surface: string;

  textPrimary: string;

  textSecondary: string;

  border: string;

  success?: string;

  warning?: string;

  danger?: string;

  info?: string;
}

/* -----------------------------------------------------------
   Gradient
----------------------------------------------------------- */

export interface ThemeGradient {

  enabled: boolean;

  from: string;

  to: string;

  angle: number;

}

/* -----------------------------------------------------------
   Shadow
----------------------------------------------------------- */

export interface ThemeShadow {

  enabled: boolean;

  color: string;

  blur: number;

  spread: number;

  x: number;

  y: number;

  opacity: number;

}

/* -----------------------------------------------------------
   Border
----------------------------------------------------------- */

export interface ThemeBorder {

  enabled: boolean;

  color: string;

  width: number;

  radius: number;

  style:
    | "solid"
    | "double"
    | "dashed"
    | "dotted"
    | "none";

}

/* -----------------------------------------------------------
   Typography
----------------------------------------------------------- */

export interface ThemeTypography {

  headingFont: string;

  bodyFont: string;

  headingWeight: number;

  bodyWeight: number;

  headingSpacing: number;

  bodySpacing: number;

}

/* -----------------------------------------------------------
   Shape Preset
----------------------------------------------------------- */

export type ShapePreset =

  | "none"

  | "wave"

  | "circle"

  | "blob"

  | "polygon"

  | "triangle"

  | "hexagon"

  | "diagonal"

  | "glass"

  | "corner";

/* -----------------------------------------------------------
   Theme Effects
----------------------------------------------------------- */

export interface ThemeEffects {

  blur: boolean;

  glass: boolean;

  transparency: number;

  noise: boolean;

  texture: boolean;

}

/* -----------------------------------------------------------
   Theme Preview
----------------------------------------------------------- */

export interface ThemePreview {

  thumbnail: string;

  previewImage?: string;

}

/* -----------------------------------------------------------
   Theme Metadata
----------------------------------------------------------- */

export interface ThemeMeta {

  author?: string;

  version?: string;

  description?: string;

  premium?: boolean;

  featured?: boolean;

  popular?: boolean;

  tags?: string[];

}

/* -----------------------------------------------------------
   Main Theme
----------------------------------------------------------- */

export interface CoverTheme {

  id: string;

  name: string;

  category: ThemeCategory;

  variant: ThemeVariant;

  palette: ThemePalette;

  gradient?: ThemeGradient;

  border: ThemeBorder;

  shadow: ThemeShadow;

  typography: ThemeTypography;

  shapePreset: ShapePreset;

  effects: ThemeEffects;

  preview: ThemePreview;

  meta: ThemeMeta;

}

/* -----------------------------------------------------------
   Theme Collection
----------------------------------------------------------- */

export type ThemeCollection = CoverTheme[];

/* -----------------------------------------------------------
   Theme Lookup
----------------------------------------------------------- */

export type ThemeRegistry = Record<
  string,
  CoverTheme
>;

/* -----------------------------------------------------------
   Theme Filters
----------------------------------------------------------- */

export interface ThemeFilter {

  category?: ThemeCategory;

  variant?: ThemeVariant;

  premium?: boolean;

  featured?: boolean;

  search?: string;

}

/* -----------------------------------------------------------
   Theme Sort
----------------------------------------------------------- */

export type ThemeSort =

  | "name"

  | "newest"

  | "popular"

  | "featured";

/* -----------------------------------------------------------
   Theme Statistics
----------------------------------------------------------- */

export interface ThemeStatistics {

  total: number;

  premium: number;

  free: number;

  featured: number;

  categories: number;

}
