/* ===========================================================
   DocSprintHub
   Universal Page Configuration Engine
   Part - 1 (Foundation)
   Version : 2.0
=========================================================== */

/* ===========================================================
   Page Format
=========================================================== */

export type PageFormat =
  | "A3"
  | "A4"
  | "A5"
  | "Letter"
  | "Legal"
  | "Tabloid"
  | "Custom";

/* ===========================================================
   Orientation
=========================================================== */

export type PageOrientation =
  | "portrait"
  | "landscape";

/* ===========================================================
   Measurement Unit
=========================================================== */

export type MeasurementUnit =
  | "mm"
  | "cm"
  | "px"
  | "inch";

/* ===========================================================
   Print Quality
=========================================================== */

export type PrintQuality =
  | "draft"
  | "standard"
  | "high"
  | "ultra";

/* ===========================================================
   Page Size
=========================================================== */

export interface PageSize {

  width: number;

  height: number;

  unit: MeasurementUnit;

}

/* ===========================================================
   Margin
=========================================================== */

export interface PageMargin {

  top: number;

  right: number;

  bottom: number;

  left: number;

}

/* ===========================================================
   Padding
=========================================================== */

export interface PagePadding {

  top: number;

  right: number;

  bottom: number;

  left: number;

}

/* ===========================================================
   Bleed
=========================================================== */

export interface PageBleed {

  enabled: boolean;

  value: number;

}

/* ===========================================================
   Safe Area
=========================================================== */

export interface SafeArea {

  enabled: boolean;

  top: number;

  right: number;

  bottom: number;

  left: number;

}

/* ===========================================================
   Resolution
=========================================================== */

export interface Resolution {

  dpi: number;

}

/* ===========================================================
   Main Page Config
=========================================================== */

export interface PageConfig {

  format: PageFormat;

  orientation: PageOrientation;

  size: PageSize;

  margin: PageMargin;

  padding: PagePadding;

  bleed: PageBleed;

  safeArea: SafeArea;

  resolution: Resolution;

  quality: PrintQuality;

}

/* ===========================================================
   Universal Page Configuration Engine
   Part - 2 (Profiles, Preview & Print)
   Version : 2.0
=========================================================== */

/* ===========================================================
   Preview
=========================================================== */

export interface PreviewConfig {

  zoom: number;

  minZoom: number;

  maxZoom: number;

  fitToScreen: boolean;

  showShadow: boolean;

  showPageBorder: boolean;

}

/* ===========================================================
   Grid
=========================================================== */

export interface PageGrid {

  enabled: boolean;

  columns: number;

  rows: number;

  gap: number;

  snap: boolean;

}

/* ===========================================================
   Print Profile
=========================================================== */

export interface PrintProfile {

  id: string;

  name: string;

  dpi: number;

  quality: PrintQuality;

  colorMode:
    | "rgb"
    | "cmyk";

}

/* ===========================================================
   Export Profile
=========================================================== */

export interface ExportProfile {

  pdf: boolean;

  png: boolean;

  jpeg: boolean;

  transparent: boolean;

}

/* ===========================================================
   Page Metadata
=========================================================== */

export interface PageMetadata {

  version: string;

  author?: string;

  description?: string;

}

/* ===========================================================
   Preset
=========================================================== */

export interface PagePreset {

  id: string;

  title: string;

  config: PageConfig;

}

/* ===========================================================
   Page Engine
=========================================================== */

export interface PageEngine {

  page: PageConfig;

  preview: PreviewConfig;

  grid: PageGrid;

  print: PrintProfile;

  export: ExportProfile;

  metadata: PageMetadata;

}

/* ===========================================================
   Standard Sizes
=========================================================== */

export const PAGE_SIZES = {

  A3: {
    width: 297,
    height: 420,
    unit: "mm",
  },

  A4: {
    width: 210,
    height: 297,
    unit: "mm",
  },

  A5: {
    width: 148,
    height: 210,
    unit: "mm",
  },

  Letter: {
    width: 216,
    height: 279,
    unit: "mm",
  },

  Legal: {
    width: 216,
    height: 356,
    unit: "mm",
  },

} as const;

/* ===========================================================
   Standard Print Profiles
=========================================================== */

export const PRINT_PROFILES: readonly PrintProfile[] = [

  {

    id: "draft",

    name: "Draft",

    dpi: 150,

    quality: "draft",

    colorMode: "rgb",

  },

  {

    id: "standard",

    name: "Standard",

    dpi: 300,

    quality: "standard",

    colorMode: "rgb",

  },

  {

    id: "high",

    name: "High Quality",

    dpi: 600,

    quality: "high",

    colorMode: "cmyk",

  },

  {

    id: "ultra",

    name: "Ultra Print",

    dpi: 1200,

    quality: "ultra",

    colorMode: "cmyk",

  },

];

/* ===========================================================
   Default Preview
=========================================================== */

export const DEFAULT_PREVIEW: PreviewConfig = {

  zoom: 1,

  minZoom: 0.25,

  maxZoom: 4,

  fitToScreen: true,

  showShadow: true,

  showPageBorder: true,

};

/* ===========================================================
   Default Grid
=========================================================== */

export const DEFAULT_PAGE_GRID: PageGrid = {

  enabled: false,

  columns: 12,

  rows: 12,

  gap: 16,

  snap: true,

};



/* ===========================================================
   Universal Page Configuration Engine
   Part - 3 (Factory, Registry & Utilities)
   Version : 2.0
=========================================================== */

/* ===========================================================
   Builder
=========================================================== */

export interface PageConfigBuilder {

  format?: PageFormat;

  orientation?: PageOrientation;

  quality?: PrintQuality;

  size?: Partial<PageSize>;

  margin?: Partial<PageMargin>;

  padding?: Partial<PagePadding>;

  bleed?: Partial<PageBleed>;

  safeArea?: Partial<SafeArea>;

  resolution?: Partial<Resolution>;

}

/* ===========================================================
   Validation
=========================================================== */

export interface PageValidationError {

  field: string;

  message: string;

}

export interface PageValidationResult {

  valid: boolean;

  errors: PageValidationError[];

}

/* ===========================================================
   Registry
=========================================================== */

export type PageRegistry = Record<
  string,
  PagePreset
>;

/* ===========================================================
   Default Config
=========================================================== */

export const DEFAULT_PAGE_CONFIG: PageConfig = {

  format: "A4",

  orientation: "portrait",

  size: {

    ...PAGE_SIZES.A4,

  },

  margin: {

    top: 20,

    right: 20,

    bottom: 20,

    left: 20,

  },

  padding: {

    top: 0,

    right: 0,

    bottom: 0,

    left: 0,

  },

  bleed: {

    enabled: false,

    value: 0,

  },

  safeArea: {

    enabled: true,

    top: 10,

    right: 10,

    bottom: 10,

    left: 10,

  },

  resolution: {

    dpi: 300,

  },

  quality: "high",

};

/* ===========================================================
   Factory
=========================================================== */

export function createPageConfig(
  builder: PageConfigBuilder = {}
): PageConfig {

  return {

    ...DEFAULT_PAGE_CONFIG,

    format:
      builder.format ??
      DEFAULT_PAGE_CONFIG.format,

    orientation:
      builder.orientation ??
      DEFAULT_PAGE_CONFIG.orientation,

    quality:
      builder.quality ??
      DEFAULT_PAGE_CONFIG.quality,

    size: {
      ...DEFAULT_PAGE_CONFIG.size,
      ...builder.size,
    },

    margin: {
      ...DEFAULT_PAGE_CONFIG.margin,
      ...builder.margin,
    },

    padding: {
      ...DEFAULT_PAGE_CONFIG.padding,
      ...builder.padding,
    },

    bleed: {
      ...DEFAULT_PAGE_CONFIG.bleed,
      ...builder.bleed,
    },

    safeArea: {
      ...DEFAULT_PAGE_CONFIG.safeArea,
      ...builder.safeArea,
    },

    resolution: {
      ...DEFAULT_PAGE_CONFIG.resolution,
      ...builder.resolution,
    },

  };

}

/* ===========================================================
   Clone
=========================================================== */

export function clonePageConfig(
  config: PageConfig
): PageConfig {

  return structuredClone(config);

}

/* ===========================================================
   Merge
=========================================================== */

export function mergePageConfig(
  base: PageConfig,
  update: Partial<PageConfig>
): PageConfig {

  return {

    ...base,

    ...update,

    size: {
      ...base.size,
      ...update.size,
    },

    margin: {
      ...base.margin,
      ...update.margin,
    },

    padding: {
      ...base.padding,
      ...update.padding,
    },

    bleed: {
      ...base.bleed,
      ...update.bleed,
    },

    safeArea: {
      ...base.safeArea,
      ...update.safeArea,
    },

    resolution: {
      ...base.resolution,
      ...update.resolution,
    },

  };

}

/* ===========================================================
   Printable Area
=========================================================== */

export function getPrintableArea(
  config: PageConfig
) {

  return {

    width:
      config.size.width -
      config.margin.left -
      config.margin.right,

    height:
      config.size.height -
      config.margin.top -
      config.margin.bottom,

  };

}

/* ===========================================================
   Orientation Helper
=========================================================== */

export function isLandscape(
  config: PageConfig
): boolean {

  return config.orientation === "landscape";

}

export function isPortrait(
  config: PageConfig
): boolean {

  return config.orientation === "portrait";

}

/* ===========================================================
   Validation
=========================================================== */

export function validatePageConfig(
  config: PageConfig
): PageValidationResult {

  const errors: PageValidationError[] = [];

  if (config.size.width <= 0) {

    errors.push({

      field: "width",

      message: "Invalid page width.",

    });

  }

  if (config.size.height <= 0) {

    errors.push({

      field: "height",

      message: "Invalid page height.",

    });

  }

  return {

    valid: errors.length === 0,

    errors,

  };

}

/* ===========================================================
   Unit Conversion
=========================================================== */

export function mmToInch(
  mm: number
): number {

  return mm / 25.4;

}

export function inchToMm(
  inch: number
): number {

  return inch * 25.4;

}

export function mmToPx(
  mm: number,
  dpi = 300
): number {

  return (mm / 25.4) * dpi;

}

export function pxToMm(
  px: number,
  dpi = 300
): number {

  return (px * 25.4) / dpi;

}

/* ===========================================================
   Built-in Presets
=========================================================== */

export const PAGE_PRESETS: PageRegistry = {

  A4: {

    id: "A4",

    title: "A4 Portrait",

    config: DEFAULT_PAGE_CONFIG,

  },

  LETTER: {

    id: "LETTER",

    title: "Letter",

    config: createPageConfig({

      format: "Letter",

      size: {

        ...PAGE_SIZES.Letter,

      },

    }),

  },

  LEGAL: {

    id: "LEGAL",

    title: "Legal",

    config: createPageConfig({

      format: "Legal",

      size: {

        ...PAGE_SIZES.Legal,

      },

    }),

  },

};