/* ===========================================================
   DocSprintHub Cover Page Generator
   Types Package
   Enterprise Public API
   Version : 2.0.0
=========================================================== */

/* ===========================================================
   Core Types
=========================================================== */

export * from "./theme";

export * from "./template";

export * from "./layout";

export * from "./content";

export * from "./editor";

export * from "./page-config";

export * from "./export";

/* ===========================================================
   Package Information
=========================================================== */

export const COVER_PAGE_ENGINE = {

  name: "DocSprintHub Cover Page Engine",

  version: "2.0.0",

  apiVersion: 1,

} as const;

/* ===========================================================
   Feature Flags
=========================================================== */

export const COVER_PAGE_FEATURES = {

  themes: true,

  templates: true,

  editor: true,

  export: true,

  print: true,

  preview: true,

  qr: true,

  logo: true,

  photo: true,

  multilingual: true,

  watermark: true,

  autosave: true,

  history: true,

  clipboard: true,

  guides: true,

  snap: true,

  layerManager: true,

  aiReady: true,

  pluginSupport: true,

  cloudExport: true,

} as const;

/* ===========================================================
   Limits
=========================================================== */

export const COVER_PAGE_LIMITS = {

  maxTemplates: 1000,

  maxThemes: 1000,

  maxUndoHistory: 100,

  maxZoom: 4,

  minZoom: 0.25,

  maxUploadMB: 50,

  maxExportQueue: 100,

} as const;

/* ===========================================================
   Supported Formats
=========================================================== */

export const SUPPORTED_EXPORTS = [

  "pdf",

  "png",

  "jpeg",

  "webp",

  "svg",

  "print",

] as const;

/* ===========================================================
   Supported Page Formats
=========================================================== */

export const SUPPORTED_PAGE_FORMATS = [

  "A3",

  "A4",

  "A5",

  "Letter",

  "Legal",

  "Tabloid",

  "Custom",

] as const;

/* ===========================================================
   Theme Packs
=========================================================== */

export const BUILTIN_THEME_PACKS = [

  "academic",

  "corporate",

  "creative",

  "school",

  "technology",

  "minimal",

  "gradient",

  "glass",

  "dark",

] as const;

/* ===========================================================
   Template Categories
=========================================================== */

export const BUILTIN_TEMPLATE_CATEGORIES = [

  "academic",

  "corporate",

  "school",

  "creative",

  "technology",

  "minimal",

  "premium",

] as const;

/* ===========================================================
   Default Values
=========================================================== */

export const DEFAULTS = {

  language: "en",

  page: "A4",

  orientation: "portrait",

  theme: "academic-frame",

  export: "pdf",

} as const;