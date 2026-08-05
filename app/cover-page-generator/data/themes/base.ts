/* ===========================================================
   DocSprintHub
   Universal Theme Engine
   Part - 1 (Foundation)
   Version : 3.0
=========================================================== */

import type {

  CoverTheme,

} from "../types/theme";

/* ===========================================================
   Theme Mode
=========================================================== */

export type ThemeMode =

  | "light"

  | "dark"

  | "auto";

/* ===========================================================
   Theme Variant
=========================================================== */

export type ThemeVariant =

  | "classic"

  | "modern"

  | "minimal"

  | "gradient"

  | "glass"

  | "premium";

/* ===========================================================
   Theme Status
=========================================================== */

export type ThemeStatus =

  | "stable"

  | "beta"

  | "experimental";

/* ===========================================================
   Border
=========================================================== */

export interface ThemeBorder {

  width: number;

  radius: number;

  color: string;

  style:

    | "solid"

    | "dashed"

    | "double"

    | "none";

}

/* ===========================================================
   Shadow
=========================================================== */

export interface ThemeShadow {

  enabled: boolean;

  x: number;

  y: number;

  blur: number;

  spread: number;

  color: string;

}

/* ===========================================================
   Background
=========================================================== */

export interface ThemeBackground {

  color: string;

  gradient?: string;

  image?: string;

  opacity: number;

}

/* ===========================================================
   Typography
=========================================================== */

export interface ThemeTypography {

  headingFont: string;

  bodyFont: string;

  headingWeight: number;

  bodyWeight: number;

  lineHeight: number;

}

/* ===========================================================
   Spacing
=========================================================== */

export interface ThemeSpacing {

  page: number;

  section: number;

  content: number;

}

/* ===========================================================
   Color Palette
=========================================================== */

export interface ThemePalette {

  primary: string;

  secondary: string;

  accent: string;

  success: string;

  warning: string;

  danger: string;

  text: string;

  muted: string;

  border: string;

  background: string;

}

/* ===========================================================
   Theme Configuration
=========================================================== */

export interface ThemeConfiguration {

  id: CoverTheme;

  name: string;

  mode: ThemeMode;

  variant: ThemeVariant;

  status: ThemeStatus;

  palette: ThemePalette;

  background: ThemeBackground;

  border: ThemeBorder;

  shadow: ThemeShadow;

  typography: ThemeTypography;

  spacing: ThemeSpacing;

}

/* ===========================================================
   Universal Theme Engine
   Part - 2 (Defaults, Factory & Registry)
   Version : 3.0
=========================================================== */

/* ===========================================================
   Default Palette
=========================================================== */

export const DEFAULT_THEME_PALETTE: ThemePalette = {

  primary: "#2563EB",

  secondary: "#1E40AF",

  accent: "#3B82F6",

  success: "#16A34A",

  warning: "#F59E0B",

  danger: "#DC2626",

  text: "#111827",

  muted: "#6B7280",

  border: "#E5E7EB",

  background: "#FFFFFF",

};

/* ===========================================================
   Default Background
=========================================================== */

export const DEFAULT_THEME_BACKGROUND: ThemeBackground = {

  color: "#FFFFFF",

  opacity: 1,

};

/* ===========================================================
   Default Border
=========================================================== */

export const DEFAULT_THEME_BORDER: ThemeBorder = {

  width: 1,

  radius: 0,

  color: "#E5E7EB",

  style: "solid",

};

/* ===========================================================
   Default Shadow
=========================================================== */

export const DEFAULT_THEME_SHADOW: ThemeShadow = {

  enabled: false,

  x: 0,

  y: 0,

  blur: 0,

  spread: 0,

  color: "#00000020",

};

/* ===========================================================
   Default Typography
=========================================================== */

export const DEFAULT_THEME_TYPOGRAPHY: ThemeTypography = {

  headingFont: "Poppins",

  bodyFont: "Inter",

  headingWeight: 700,

  bodyWeight: 400,

  lineHeight: 1.6,

};

/* ===========================================================
   Default Spacing
=========================================================== */

export const DEFAULT_THEME_SPACING: ThemeSpacing = {

  page: 40,

  section: 24,

  content: 16,

};

/* ===========================================================
   Default Theme
=========================================================== */

export const DEFAULT_THEME: ThemeConfiguration = {

  id: "academic-frame",

  name: "Default Theme",

  mode: "light",

  variant: "modern",

  status: "stable",

  palette: DEFAULT_THEME_PALETTE,

  background: DEFAULT_THEME_BACKGROUND,

  border: DEFAULT_THEME_BORDER,

  shadow: DEFAULT_THEME_SHADOW,

  typography: DEFAULT_THEME_TYPOGRAPHY,

  spacing: DEFAULT_THEME_SPACING,

};

/* ===========================================================
   Theme Registry
=========================================================== */

export type ThemeRegistry = Record<
  string,
  ThemeConfiguration
>;

/* ===========================================================
   Registry
=========================================================== */

export const BUILTIN_THEMES: ThemeRegistry = {

  default: DEFAULT_THEME,

};

/* ===========================================================
   Factory
=========================================================== */

export function createTheme(

  config: Partial<ThemeConfiguration>

): ThemeConfiguration {

  return {

    ...DEFAULT_THEME,

    ...config,

    palette: {

      ...DEFAULT_THEME.palette,

      ...config.palette,

    },

    background: {

      ...DEFAULT_THEME.background,

      ...config.background,

    },

    border: {

      ...DEFAULT_THEME.border,

      ...config.border,

    },

    shadow: {

      ...DEFAULT_THEME.shadow,

      ...config.shadow,

    },

    typography: {

      ...DEFAULT_THEME.typography,

      ...config.typography,

    },

    spacing: {

      ...DEFAULT_THEME.spacing,

      ...config.spacing,

    },

  };

}

/* ===========================================================
   Clone
=========================================================== */

export function cloneTheme(

  theme: ThemeConfiguration

): ThemeConfiguration {

  return structuredClone(theme);

}

/* ===========================================================
   Universal Theme Engine
   Part - 3 (Validation, Registry API & Utilities)
   Version : 3.0
=========================================================== */

/* ===========================================================
   Validation
=========================================================== */

export interface ThemeValidationError {

  field: string;

  message: string;

}

export interface ThemeValidationResult {

  valid: boolean;

  errors: ThemeValidationError[];

}

/* ===========================================================
   Engine
=========================================================== */

export interface ThemeEngine {

  registry: ThemeRegistry;

}

export const THEME_ENGINE: ThemeEngine = {

  registry: BUILTIN_THEMES,

};

/* ===========================================================
   Register
=========================================================== */

export function registerTheme(

  theme: ThemeConfiguration

): void {

  BUILTIN_THEMES[theme.id] = theme;

}

/* ===========================================================
   Get Theme
=========================================================== */

export function getTheme(

  id: CoverTheme

): ThemeConfiguration {

  return (

    BUILTIN_THEMES[id] ??

    DEFAULT_THEME

  );

}

/* ===========================================================
   Exists
=========================================================== */

export function hasTheme(

  id: CoverTheme

): boolean {

  return id in BUILTIN_THEMES;

}

/* ===========================================================
   All Themes
=========================================================== */

export function getThemes(): ThemeConfiguration[] {

  return Object.values(

    BUILTIN_THEMES

  );

}

/* ===========================================================
   By Variant
=========================================================== */

export function getThemesByVariant(

  variant: ThemeVariant

): ThemeConfiguration[] {

  return getThemes().filter(

    theme => theme.variant === variant

  );

}

/* ===========================================================
   By Mode
=========================================================== */

export function getThemesByMode(

  mode: ThemeMode

): ThemeConfiguration[] {

  return getThemes().filter(

    theme => theme.mode === mode

  );

}

/* ===========================================================
   Merge
=========================================================== */

export function mergeThemes(

  base: ThemeConfiguration,

  override: Partial<ThemeConfiguration>

): ThemeConfiguration {

  return createTheme({

    ...base,

    ...override,

  });

}

/* ===========================================================
   Validation
=========================================================== */

export function validateTheme(

  theme: ThemeConfiguration

): ThemeValidationResult {

  const errors: ThemeValidationError[] = [];

  if (!theme.name.trim()) {

    errors.push({

      field: "name",

      message: "Theme name is required.",

    });

  }

  if (!theme.id.trim()) {

    errors.push({

      field: "id",

      message: "Theme id is required.",

    });

  }

  if (!theme.palette.primary) {

    errors.push({

      field: "palette.primary",

      message: "Primary color is required.",

    });

  }

  return {

    valid: errors.length === 0,

    errors,

  };

}

/* ===========================================================
   CSS Variables
=========================================================== */

export function createCSSVariables(

  theme: ThemeConfiguration

): Record<string, string> {

  return {

    "--cp-primary": theme.palette.primary,

    "--cp-secondary": theme.palette.secondary,

    "--cp-accent": theme.palette.accent,

    "--cp-background": theme.palette.background,

    "--cp-text": theme.palette.text,

    "--cp-muted": theme.palette.muted,

    "--cp-border": theme.palette.border,

    "--cp-heading-font":

      theme.typography.headingFont,

    "--cp-body-font":

      theme.typography.bodyFont,

  };

}

/* ===========================================================
   Design Tokens
=========================================================== */

export function exportDesignTokens(

  theme: ThemeConfiguration

) {

  return {

    colors: theme.palette,

    typography: theme.typography,

    spacing: theme.spacing,

    border: theme.border,

    shadow: theme.shadow,

    background: theme.background,

  };

}

/* ===========================================================
   Recommendation
=========================================================== */

export function recommendTheme(

  category:

    | "academic"

    | "corporate"

    | "school"

    | "technology"

    | "creative"

): ThemeConfiguration {

  return DEFAULT_THEME;

}

/* ===========================================================
   Statistics
=========================================================== */

export function getThemeCount(): number {

  return Object.keys(

    BUILTIN_THEMES

  ).length;

}

/* ===========================================================
   Reset
=========================================================== */

export function resetTheme(): ThemeConfiguration {

  return cloneTheme(

    DEFAULT_THEME

  );

}