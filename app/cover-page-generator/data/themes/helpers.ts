/* ===========================================================
   DocSprintHub
   Theme Helper Engine
   Part - 1 (Foundation)
   Version : 3.0
=========================================================== */

import type {

  ThemeConfiguration,

  ThemePalette,

} from "./base";

/* ===========================================================
   RGB
=========================================================== */

export interface RGB {

  r: number;

  g: number;

  b: number;

}

/* ===========================================================
   HSL
=========================================================== */

export interface HSL {

  h: number;

  s: number;

  l: number;

}

/* ===========================================================
   Contrast Result
=========================================================== */

export interface ContrastResult {

  ratio: number;

  passesAA: boolean;

  passesAAA: boolean;

}

/* ===========================================================
   Theme Difference
=========================================================== */

export interface ThemeDifference {

  changed: boolean;

  fields: string[];

}

/* ===========================================================
   Color Utilities
=========================================================== */

/**
 * Remove # from color
 */

export function normalizeHex(

  color: string

): string {

  return color.replace("#", "");

}

/**
 * Add # if missing
 */

export function ensureHex(

  color: string

): string {

  if (color.startsWith("#")) {

    return color;

  }

  return `#${color}`;

}

/**
 * Clamp Number
 */

export function clamp(

  value: number,

  min: number,

  max: number

): number {

  return Math.min(

    Math.max(value, min),

    max

  );

}

/**
 * Convert HEX -> RGB
 */

export function hexToRgb(

  hex: string

): RGB {

  const value = normalizeHex(hex);

  const bigint = parseInt(value, 16);

  return {

    r: (bigint >> 16) & 255,

    g: (bigint >> 8) & 255,

    b: bigint & 255,

  };

}

/**
 * RGB -> HEX
 */

export function rgbToHex(

  rgb: RGB

): string {

  return (

    "#" +

    [rgb.r, rgb.g, rgb.b]

      .map(

        value =>

          value

            .toString(16)

            .padStart(2, "0")

      )

      .join("")

  );

}

/* ===========================================================
   Theme Helper Engine
   Part - 2 (Color Engine)
   Version : 3.0
=========================================================== */

/* ===========================================================
   Lighten Color
=========================================================== */

export function lightenColor(

  hex: string,

  amount = 15

): string {

  const rgb = hexToRgb(hex);

  return rgbToHex({

    r: clamp(rgb.r + amount, 0, 255),

    g: clamp(rgb.g + amount, 0, 255),

    b: clamp(rgb.b + amount, 0, 255),

  });

}

/* ===========================================================
   Darken Color
=========================================================== */

export function darkenColor(

  hex: string,

  amount = 15

): string {

  const rgb = hexToRgb(hex);

  return rgbToHex({

    r: clamp(rgb.r - amount, 0, 255),

    g: clamp(rgb.g - amount, 0, 255),

    b: clamp(rgb.b - amount, 0, 255),

  });

}

/* ===========================================================
   Alpha Color
=========================================================== */

export function withAlpha(

  hex: string,

  alpha: number

): string {

  const value = normalizeHex(hex);

  const opacity = Math.round(

    clamp(alpha, 0, 1) * 255

  )

    .toString(16)

    .padStart(2, "0");

  return `#${value}${opacity}`;

}

/* ===========================================================
   Mix Colors
=========================================================== */

export function mixColors(

  first: string,

  second: string,

  ratio = 0.5

): string {

  const a = hexToRgb(first);

  const b = hexToRgb(second);

  const t = clamp(ratio, 0, 1);

  return rgbToHex({

    r: Math.round(a.r + (b.r - a.r) * t),

    g: Math.round(a.g + (b.g - a.g) * t),

    b: Math.round(a.b + (b.b - a.b) * t),

  });

}

/* ===========================================================
   Gradient Builder
=========================================================== */

export function createGradient(

  from: string,

  to: string,

  angle = 135

): string {

  return `linear-gradient(${angle}deg, ${from}, ${to})`;

}

/* ===========================================================
   Relative Luminance
=========================================================== */

export function getLuminance(

  color: string

): number {

  const rgb = hexToRgb(color);

  const normalize = (value: number) => {

    const c = value / 255;

    return c <= 0.03928

      ? c / 12.92

      : Math.pow(

          (c + 0.055) / 1.055,

          2.4

        );

  };

  const r = normalize(rgb.r);

  const g = normalize(rgb.g);

  const b = normalize(rgb.b);

  return (

    0.2126 * r +

    0.7152 * g +

    0.0722 * b

  );

}

/* ===========================================================
   Contrast Ratio
=========================================================== */

export function getContrastRatio(

  foreground: string,

  background: string

): ContrastResult {

  const l1 = getLuminance(foreground);

  const l2 = getLuminance(background);

  const ratio =

    (Math.max(l1, l2) + 0.05) /

    (Math.min(l1, l2) + 0.05);

  return {

    ratio,

    passesAA: ratio >= 4.5,

    passesAAA: ratio >= 7,

  };

}

/* ===========================================================
   Readable Text Color
=========================================================== */

export function getReadableTextColor(

  background: string

): string {

  const contrastWithWhite =

    getContrastRatio(

      "#FFFFFF",

      background

    ).ratio;

  const contrastWithBlack =

    getContrastRatio(

      "#000000",

      background

    ).ratio;

  return contrastWithWhite >

    contrastWithBlack

    ? "#FFFFFF"

    : "#000000";

}

/* ===========================================================
   Palette Validation
=========================================================== */

export function validatePalette(

  palette: ThemePalette

): boolean {

  return [

    palette.primary,

    palette.secondary,

    palette.accent,

    palette.text,

    palette.background,

  ].every(

    value =>

      /^#([0-9A-F]{6}|[0-9A-F]{8})$/i.test(

        value

      )

  );

}

/* ===========================================================
   Theme Helper Engine
   Part - 3 (Theme Utilities & Serialization)
   Version : 3.0
=========================================================== */

import { createTheme } from "./base";

/* ===========================================================
   Clone Theme
=========================================================== */

export function cloneTheme(

  theme: ThemeConfiguration

): ThemeConfiguration {

  return structuredClone(theme);

}

/* ===========================================================
   Merge Theme
=========================================================== */

export function mergeTheme(

  base: ThemeConfiguration,

  override: Partial<ThemeConfiguration>

): ThemeConfiguration {

  return createTheme({

    ...base,

    ...override,

    palette: {

      ...base.palette,

      ...override.palette,

    },

    background: {

      ...base.background,

      ...override.background,

    },

    border: {

      ...base.border,

      ...override.border,

    },

    shadow: {

      ...base.shadow,

      ...override.shadow,

    },

    typography: {

      ...base.typography,

      ...override.typography,

    },

    spacing: {

      ...base.spacing,

      ...override.spacing,

    },

  });

}

/* ===========================================================
   Compare Themes
=========================================================== */

export function compareThemes(

  first: ThemeConfiguration,

  second: ThemeConfiguration

): ThemeDifference {

  const fields: string[] = [];

  const keys = Object.keys(first) as Array<keyof ThemeConfiguration>;

  keys.forEach(key => {

    if (

      JSON.stringify(first[key]) !==

      JSON.stringify(second[key])

    ) {

      fields.push(String(key));

    }

  });

  return {

    changed: fields.length > 0,

    fields,

  };

}

/* ===========================================================
   CSS Variables
=========================================================== */

export function themeToCSSVariables(

  theme: ThemeConfiguration

): Record<string, string> {

  return {

    "--theme-primary": theme.palette.primary,

    "--theme-secondary": theme.palette.secondary,

    "--theme-accent": theme.palette.accent,

    "--theme-background": theme.palette.background,

    "--theme-text": theme.palette.text,

    "--theme-muted": theme.palette.muted,

    "--theme-border": theme.palette.border,

    "--theme-heading-font":

      theme.typography.headingFont,

    "--theme-body-font":

      theme.typography.bodyFont,

    "--theme-page-spacing":

      `${theme.spacing.page}px`,

    "--theme-section-spacing":

      `${theme.spacing.section}px`,

    "--theme-content-spacing":

      `${theme.spacing.content}px`,

    "--theme-border-radius":

      `${theme.border.radius}px`,

    "--theme-border-width":

      `${theme.border.width}px`,

  };

}

/* ===========================================================
   Serialize
=========================================================== */

export function serializeTheme(

  theme: ThemeConfiguration

): string {

  return JSON.stringify(

    theme,

    null,

    2

  );

}

/* ===========================================================
   Deserialize
=========================================================== */

export function deserializeTheme(

  json: string

): ThemeConfiguration {

  return createTheme(

    JSON.parse(json)

  );

}

/* ===========================================================
   Export Design Tokens
=========================================================== */

export function exportThemeTokens(

  theme: ThemeConfiguration

) {

  return {

    palette: theme.palette,

    typography: theme.typography,

    spacing: theme.spacing,

    border: theme.border,

    shadow: theme.shadow,

    background: theme.background,

  };

}

/* ===========================================================
   Print Safe Theme
=========================================================== */

export function createPrintSafeTheme(

  theme: ThemeConfiguration

): ThemeConfiguration {

  const clone = cloneTheme(theme);

  clone.shadow.enabled = false;

  clone.background.opacity = 1;

  return clone;

}

/* ===========================================================
   Theme Summary
=========================================================== */

export function getThemeSummary(

  theme: ThemeConfiguration

) {

  return {

    id: theme.id,

    name: theme.name,

    mode: theme.mode,

    variant: theme.variant,

    primary: theme.palette.primary,

    secondary: theme.palette.secondary,

    headingFont: theme.typography.headingFont,

    bodyFont: theme.typography.bodyFont,

  };

}

/* ===========================================================
   AI Recommendation Helper
=========================================================== */

export function recommendPalette(

  category:

    | "academic"

    | "corporate"

    | "school"

    | "technology"

    | "creative"

): Pick<ThemePalette, "primary" | "secondary"> {

  switch (category) {

    case "academic":

      return {

        primary: "#2563EB",

        secondary: "#1E40AF",

      };

    case "corporate":

      return {

        primary: "#0F172A",

        secondary: "#334155",

      };

    case "school":

      return {

        primary: "#16A34A",

        secondary: "#15803D",

      };

    case "technology":

      return {

        primary: "#7C3AED",

        secondary: "#4C1D95",

      };

    case "creative":

      return {

        primary: "#DB2777",

        secondary: "#9333EA",

      };

    default:

      return {

        primary: "#2563EB",

        secondary: "#1E40AF",

      };

  }

}