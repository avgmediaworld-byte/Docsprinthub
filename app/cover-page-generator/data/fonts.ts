/* ===========================================================
   DocSprintHub
   Typography Engine
   Part - 1 (Foundation)
   Version : 2.0
=========================================================== */

/* ===========================================================
   Font Category
=========================================================== */

export type FontCategory =
  | "sans-serif"
  | "serif"
  | "display"
  | "monospace"
  | "handwriting"
  | "hindi"
  | "premium";

/* ===========================================================
   Font Source
=========================================================== */

export type FontSource =
  | "system"
  | "google"
  | "custom";

/* ===========================================================
   Font Weight
=========================================================== */

export type FontWeight =
  | 100
  | 200
  | 300
  | 400
  | 500
  | 600
  | 700
  | 800
  | 900;

/* ===========================================================
   Font Style
=========================================================== */

export type FontStyle =
  | "normal"
  | "italic";

/* ===========================================================
   Language Support
=========================================================== */

export type FontLanguage =
  | "en"
  | "hi"
  | "multi";

/* ===========================================================
   Font Variant
=========================================================== */

export interface FontVariant {

  weight: FontWeight;

  style: FontStyle;

}

/* ===========================================================
   Font Family
=========================================================== */

export interface FontFamily {

  id: string;

  name: string;

  family: string;

  category: FontCategory;

  source: FontSource;

  language: FontLanguage;

  variants: FontVariant[];

  fallback: string[];

  googleFamily?: string;

  previewText?: string;

}

/* ===========================================================
   Font Pair
=========================================================== */

export interface FontPair {

  id: string;

  heading: string;

  body: string;

}

/* ===========================================================
   Typography Scale
=========================================================== */

export interface TypographyScale {

  h1: number;

  h2: number;

  h3: number;

  h4: number;

  h5: number;

  h6: number;

  body: number;

  caption: number;

}

/* ===========================================================
   Font Registry
=========================================================== */

export interface FontRegistry {

  fonts: FontFamily[];

  pairs: FontPair[];

}

/* ===========================================================
   Typography Engine
   Part - 2 (Built-in Font Library)
   Version : 2.0
=========================================================== */

/* ===========================================================
   Default Typography Scale
=========================================================== */

export const DEFAULT_TYPOGRAPHY_SCALE: TypographyScale = {

  h1: 40,

  h2: 32,

  h3: 28,

  h4: 24,

  h5: 20,

  h6: 18,

  body: 16,

  caption: 12,

};

/* ===========================================================
   Built-in Fonts
=========================================================== */

export const FONT_LIBRARY: FontFamily[] = [

  /* ---------- Sans Serif ---------- */

  {
    id: "inter",
    name: "Inter",
    family: "Inter",
    category: "sans-serif",
    source: "google",
    language: "multi",
    googleFamily: "Inter",
    fallback: ["Arial", "sans-serif"],
    previewText: "Modern & Clean Typography",
    variants: [
      { weight: 400, style: "normal" },
      { weight: 500, style: "normal" },
      { weight: 600, style: "normal" },
      { weight: 700, style: "normal" },
    ],
  },

  {
    id: "poppins",
    name: "Poppins",
    family: "Poppins",
    category: "sans-serif",
    source: "google",
    language: "multi",
    googleFamily: "Poppins",
    fallback: ["Arial", "sans-serif"],
    previewText: "Elegant Modern Design",
    variants: [
      { weight: 400, style: "normal" },
      { weight: 500, style: "normal" },
      { weight: 600, style: "normal" },
      { weight: 700, style: "normal" },
    ],
  },

  {
    id: "montserrat",
    name: "Montserrat",
    family: "Montserrat",
    category: "sans-serif",
    source: "google",
    language: "multi",
    googleFamily: "Montserrat",
    fallback: ["Arial", "sans-serif"],
    previewText: "Professional Documents",
    variants: [
      { weight: 400, style: "normal" },
      { weight: 700, style: "normal" },
    ],
  },

  {
    id: "roboto",
    name: "Roboto",
    family: "Roboto",
    category: "sans-serif",
    source: "google",
    language: "multi",
    googleFamily: "Roboto",
    fallback: ["Arial", "sans-serif"],
    previewText: "Google Material Design",
    variants: [
      { weight: 400, style: "normal" },
      { weight: 500, style: "normal" },
      { weight: 700, style: "normal" },
    ],
  },

  /* ---------- Serif ---------- */

  {
    id: "merriweather",
    name: "Merriweather",
    family: "Merriweather",
    category: "serif",
    source: "google",
    language: "en",
    googleFamily: "Merriweather",
    fallback: ["Georgia", "serif"],
    previewText: "Classic Academic Style",
    variants: [
      { weight: 400, style: "normal" },
      { weight: 700, style: "normal" },
    ],
  },

  {
    id: "playfair-display",
    name: "Playfair Display",
    family: "Playfair Display",
    category: "serif",
    source: "google",
    language: "en",
    googleFamily: "Playfair Display",
    fallback: ["Georgia", "serif"],
    previewText: "Premium Elegant Heading",
    variants: [
      { weight: 400, style: "normal" },
      { weight: 700, style: "normal" },
    ],
  },

  /* ---------- Display ---------- */

  {
    id: "bebas-neue",
    name: "Bebas Neue",
    family: "Bebas Neue",
    category: "display",
    source: "google",
    language: "en",
    googleFamily: "Bebas Neue",
    fallback: ["Arial", "sans-serif"],
    previewText: "Powerful Headlines",
    variants: [
      { weight: 400, style: "normal" },
    ],
  },

  {
    id: "oswald",
    name: "Oswald",
    family: "Oswald",
    category: "display",
    source: "google",
    language: "en",
    googleFamily: "Oswald",
    fallback: ["Arial", "sans-serif"],
    previewText: "Corporate Heading",
    variants: [
      { weight: 400, style: "normal" },
      { weight: 700, style: "normal" },
    ],
  },

  /* ---------- Monospace ---------- */

  {
    id: "jetbrains-mono",
    name: "JetBrains Mono",
    family: "JetBrains Mono",
    category: "monospace",
    source: "google",
    language: "en",
    googleFamily: "JetBrains Mono",
    fallback: ["Consolas", "monospace"],
    previewText: "Developer Style",
    variants: [
      { weight: 400, style: "normal" },
      { weight: 700, style: "normal" },
    ],
  },

  /* ---------- Hindi ---------- */

  {
    id: "noto-sans-devanagari",
    name: "Noto Sans Devanagari",
    family: "Noto Sans Devanagari",
    category: "hindi",
    source: "google",
    language: "hi",
    googleFamily: "Noto Sans Devanagari",
    fallback: ["Mangal", "sans-serif"],
    previewText: "हिन्दी दस्तावेज़",
    variants: [
      { weight: 400, style: "normal" },
      { weight: 700, style: "normal" },
    ],
  },

];

/* ===========================================================
   Built-in Font Pairs
=========================================================== */

export const FONT_PAIRS: FontPair[] = [

  {
    id: "modern",
    heading: "Poppins",
    body: "Inter",
  },

  {
    id: "academic",
    heading: "Playfair Display",
    body: "Merriweather",
  },

  {
    id: "corporate",
    heading: "Montserrat",
    body: "Roboto",
  },

  {
    id: "tech",
    heading: "Oswald",
    body: "Inter",
  },

  {
    id: "developer",
    heading: "JetBrains Mono",
    body: "Inter",
  },

];

/* ===========================================================
   Typography Engine
   Part - 3 (Registry, Factory & Utilities)
   Version : 2.0
=========================================================== */

/* ===========================================================
   Font Search
=========================================================== */

export interface FontSearchOptions {

  category?: FontCategory;

  language?: FontLanguage;

  source?: FontSource;

}

/* ===========================================================
   Typography Engine
=========================================================== */

export interface TypographyEngine {

  fonts: FontFamily[];

  pairs: FontPair[];

  scale: TypographyScale;

}

/* ===========================================================
   Registry
=========================================================== */

export const FONT_REGISTRY: FontRegistry = {

  fonts: FONT_LIBRARY,

  pairs: FONT_PAIRS,

};

/* ===========================================================
   Default Font
=========================================================== */

export const DEFAULT_FONT =

  FONT_LIBRARY.find(

    (font) => font.id === "inter"

  )!;

/* ===========================================================
   Factory
=========================================================== */

export function createTypographyEngine(): TypographyEngine {

  return {

    fonts: FONT_LIBRARY,

    pairs: FONT_PAIRS,

    scale: DEFAULT_TYPOGRAPHY_SCALE,

  };

}

/* ===========================================================
   Search By ID
=========================================================== */

export function getFontById(

  id: string

): FontFamily | undefined {

  return FONT_LIBRARY.find(

    (font) => font.id === id

  );

}

/* ===========================================================
   Search By Name
=========================================================== */

export function getFontByName(

  name: string

): FontFamily | undefined {

  return FONT_LIBRARY.find(

    (font) =>

      font.name.toLowerCase() ===

      name.toLowerCase()

  );

}

/* ===========================================================
   Search By Category
=========================================================== */

export function getFontsByCategory(

  category: FontCategory

): FontFamily[] {

  return FONT_LIBRARY.filter(

    (font) => font.category === category

  );

}

/* ===========================================================
   Search By Language
=========================================================== */

export function getFontsByLanguage(

  language: FontLanguage

): FontFamily[] {

  return FONT_LIBRARY.filter(

    (font) =>

      font.language === language ||

      font.language === "multi"

  );

}

/* ===========================================================
   Advanced Search
=========================================================== */

export function searchFonts(

  options: FontSearchOptions

): FontFamily[] {

  return FONT_LIBRARY.filter((font) => {

    if (

      options.category &&

      font.category !== options.category

    ) {

      return false;

    }

    if (

      options.language &&

      font.language !== options.language &&

      font.language !== "multi"

    ) {

      return false;

    }

    if (

      options.source &&

      font.source !== options.source

    ) {

      return false;

    }

    return true;

  });

}

/* ===========================================================
   Font Pair
=========================================================== */

export function getFontPair(

  id: string

): FontPair | undefined {

  return FONT_PAIRS.find(

    (pair) => pair.id === id

  );

}

/* ===========================================================
   CSS Font Stack
=========================================================== */

export function getFontStack(

  font: FontFamily

): string {

  return [

    `"${font.family}"`,

    ...font.fallback,

  ].join(", ");

}

/* ===========================================================
   Validation
=========================================================== */

export function isFontSupported(

  id: string

): boolean {

  return FONT_LIBRARY.some(

    (font) => font.id === id

  );

}

/* ===========================================================
   AI Recommendation
=========================================================== */

export function recommendFontPair(

  category:

    | "academic"

    | "corporate"

    | "creative"

    | "technology"

    | "school"

): FontPair {

  switch (category) {

    case "academic":

      return FONT_PAIRS[1];

    case "corporate":

      return FONT_PAIRS[2];

    case "technology":

      return FONT_PAIRS[3];

    case "creative":

      return FONT_PAIRS[0];

    case "school":

      return FONT_PAIRS[0];

    default:

      return FONT_PAIRS[0];

  }

}

/* ===========================================================
   Export
=========================================================== */

export const TYPOGRAPHY_ENGINE =

  createTypographyEngine();