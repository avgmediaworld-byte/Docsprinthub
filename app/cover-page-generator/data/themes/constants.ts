/* ===========================================================
   DocSprintHub
   Theme Engine Constants
   Part - 1 (Design Tokens)
   Version : 3.0
=========================================================== */

/* ===========================================================
   Border Radius
=========================================================== */

export const BORDER_RADIUS = {

  none: 0,

  xs: 2,

  sm: 4,

  md: 8,

  lg: 12,

  xl: 16,

  xxl: 24,

  full: 9999,

} as const;

/* ===========================================================
   Border Width
=========================================================== */

export const BORDER_WIDTH = {

  none: 0,

  thin: 1,

  normal: 2,

  medium: 3,

  thick: 4,

  heavy: 6,

} as const;

/* ===========================================================
   Shadow Presets
=========================================================== */

export const SHADOW = {

  none:

    "none",

  xs:

    "0 1px 2px rgba(0,0,0,.08)",

  sm:

    "0 2px 4px rgba(0,0,0,.10)",

  md:

    "0 6px 16px rgba(0,0,0,.15)",

  lg:

    "0 12px 30px rgba(0,0,0,.18)",

  xl:

    "0 20px 45px rgba(0,0,0,.22)",

} as const;

/* ===========================================================
   Blur
=========================================================== */

export const BLUR = {

  none: 0,

  sm: 4,

  md: 8,

  lg: 16,

  xl: 24,

} as const;

/* ===========================================================
   Opacity
=========================================================== */

export const OPACITY = {

  hidden: 0,

  low: 0.2,

  medium: 0.5,

  high: 0.75,

  full: 1,

} as const;

/* ===========================================================
   Z Index
=========================================================== */

export const Z_INDEX = {

  background: 0,

  content: 10,

  overlay: 100,

  modal: 1000,

  tooltip: 2000,

} as const;

/* ===========================================================
   Transition
=========================================================== */

export const TRANSITION = {

  fast: 150,

  normal: 250,

  slow: 400,

} as const;

/* ===========================================================
   Animation
=========================================================== */

export const ANIMATION = {

  none: 0,

  fast: 200,

  normal: 300,

  slow: 600,

} as const;

/* ===========================================================
   Page Padding
=========================================================== */

export const PAGE_PADDING = {

  xs: 12,

  sm: 20,

  md: 30,

  lg: 40,

  xl: 50,

} as const;

/* ===========================================================
   Section Gap
=========================================================== */

export const SECTION_GAP = {

  xs: 8,

  sm: 12,

  md: 20,

  lg: 28,

  xl: 36,

} as const;


/* ===========================================================
   Theme Engine Constants
   Part - 2 (Colors, Gradients & Typography)
   Version : 3.0
=========================================================== */

/* ===========================================================
   Neutral Colors
=========================================================== */

export const NEUTRAL_COLORS = {

  white: "#FFFFFF",

  black: "#000000",

  gray50: "#F9FAFB",

  gray100: "#F3F4F6",

  gray200: "#E5E7EB",

  gray300: "#D1D5DB",

  gray400: "#9CA3AF",

  gray500: "#6B7280",

  gray600: "#4B5563",

  gray700: "#374151",

  gray800: "#1F2937",

  gray900: "#111827",

} as const;

/* ===========================================================
   Semantic Colors
=========================================================== */

export const SEMANTIC_COLORS = {

  success: "#22C55E",

  warning: "#F59E0B",

  danger: "#EF4444",

  info: "#3B82F6",

} as const;

/* ===========================================================
   Accent Palette
=========================================================== */

export const ACCENT_COLORS = {

  blue: "#2563EB",

  indigo: "#4F46E5",

  purple: "#7C3AED",

  pink: "#DB2777",

  red: "#DC2626",

  orange: "#EA580C",

  amber: "#D97706",

  yellow: "#CA8A04",

  emerald: "#059669",

  green: "#16A34A",

  teal: "#0D9488",

  cyan: "#0891B2",

} as const;

/* ===========================================================
   Paper Colors
=========================================================== */

export const PAPER_COLORS = {

  white: "#FFFFFF",

  ivory: "#FFFDF7",

  cream: "#FFF8EB",

  pearl: "#FCFCFC",

  lightGray: "#F8FAFC",

} as const;

/* ===========================================================
   Gradient Presets
=========================================================== */

export const GRADIENTS = {

  blue:

    "linear-gradient(135deg,#2563EB,#3B82F6)",

  purple:

    "linear-gradient(135deg,#7C3AED,#A855F7)",

  sunset:

    "linear-gradient(135deg,#F97316,#EF4444)",

  ocean:

    "linear-gradient(135deg,#0284C7,#06B6D4)",

  emerald:

    "linear-gradient(135deg,#059669,#10B981)",

  premium:

    "linear-gradient(135deg,#111827,#374151)",

  glass:

    "linear-gradient(135deg,#FFFFFF90,#FFFFFF20)",

} as const;

/* ===========================================================
   Font Sizes
=========================================================== */

export const FONT_SIZE = {

  xs: 10,

  sm: 12,

  md: 14,

  base: 16,

  lg: 18,

  xl: 22,

  xxl: 28,

  display: 40,

} as const;

/* ===========================================================
   Font Weights
=========================================================== */

export const FONT_WEIGHT = {

  light: 300,

  regular: 400,

  medium: 500,

  semibold: 600,

  bold: 700,

  extrabold: 800,

} as const;

/* ===========================================================
   Line Heights
=========================================================== */

export const LINE_HEIGHT = {

  tight: 1.2,

  normal: 1.5,

  relaxed: 1.75,

} as const;

/* ===========================================================
   Letter Spacing
=========================================================== */

export const LETTER_SPACING = {

  tight: "-0.02em",

  normal: "0",

  wide: "0.04em",

  extraWide: "0.08em",

} as const;



/* ===========================================================
   Theme Engine Constants
   Part - 3 (Layout, Print & Design Tokens)
   Version : 3.0
=========================================================== */

/* ===========================================================
   A-Series Paper Sizes (mm)
=========================================================== */

export const PAPER_SIZE = {

  A3: {
    width: 297,
    height: 420,
  },

  A4: {
    width: 210,
    height: 297,
  },

  A5: {
    width: 148,
    height: 210,
  },

} as const;

/* ===========================================================
   Safe Print Margins (mm)
=========================================================== */

export const PRINT_MARGIN = {

  none: 0,

  narrow: 5,

  normal: 10,

  wide: 15,

  extraWide: 20,

} as const;

/* ===========================================================
   Grid System
=========================================================== */

export const GRID = {

  columns: 12,

  gutter: 16,

  baseline: 8,

} as const;

/* ===========================================================
   Logo Sizes (px)
=========================================================== */

export const LOGO_SIZE = {

  xs: 32,

  sm: 48,

  md: 64,

  lg: 96,

  xl: 128,

} as const;

/* ===========================================================
   QR Sizes (px)
=========================================================== */

export const QR_SIZE = {

  sm: 60,

  md: 90,

  lg: 120,

  xl: 160,

} as const;

/* ===========================================================
   Photo Sizes (px)
=========================================================== */

export const PHOTO_SIZE = {

  passport: 132,

  profile: 180,

  large: 240,

} as const;

/* ===========================================================
   Icon Sizes (px)
=========================================================== */

export const ICON_SIZE = {

  xs: 12,

  sm: 16,

  md: 20,

  lg: 24,

  xl: 32,

  xxl: 48,

} as const;

/* ===========================================================
   Aspect Ratios
=========================================================== */

export const ASPECT_RATIO = {

  square: "1 / 1",

  portrait: "3 / 4",

  landscape: "4 / 3",

  widescreen: "16 / 9",

  cover: "210 / 297",

} as const;

/* ===========================================================
   Export DPI
=========================================================== */

export const EXPORT_DPI = {

  draft: 150,

  standard: 300,

  premium: 600,

} as const;

/* ===========================================================
   Complete Design Tokens
=========================================================== */

export const DESIGN_TOKENS = {

  borderRadius: BORDER_RADIUS,

  borderWidth: BORDER_WIDTH,

  shadow: SHADOW,

  blur: BLUR,

  opacity: OPACITY,

  zIndex: Z_INDEX,

  transition: TRANSITION,

  animation: ANIMATION,

  pagePadding: PAGE_PADDING,

  sectionGap: SECTION_GAP,

  neutral: NEUTRAL_COLORS,

  semantic: SEMANTIC_COLORS,

  accent: ACCENT_COLORS,

  paper: PAPER_COLORS,

  gradients: GRADIENTS,

  fontSize: FONT_SIZE,

  fontWeight: FONT_WEIGHT,

  lineHeight: LINE_HEIGHT,

  letterSpacing: LETTER_SPACING,

  paperSize: PAPER_SIZE,

  printMargin: PRINT_MARGIN,

  grid: GRID,

  logoSize: LOGO_SIZE,

  qrSize: QR_SIZE,

  photoSize: PHOTO_SIZE,

  iconSize: ICON_SIZE,

  aspectRatio: ASPECT_RATIO,

  exportDpi: EXPORT_DPI,

} as const;

/* ===========================================================
   Engine Metadata
=========================================================== */

export const CONSTANTS_ENGINE = {

  name: "DocSprintHub Design Tokens",

  version: "3.0.0",

  initialized: true,

} as const;