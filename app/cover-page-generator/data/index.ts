/* ===========================================================
   DocSprintHub
   Cover Page Generator
   Data Registry
   Enterprise Public API
   Version : 2.0.0
=========================================================== */

/* ===========================================================
   Data Modules
=========================================================== */

export * from "./categories";

export * from "./fonts";

export * from "./template-list";

export * from "./icons";

/* ===========================================================
   Registry Information
=========================================================== */

export const DATA_ENGINE = {

  name: "DocSprintHub Data Registry",

  version: "2.0.0",

  apiVersion: 1,

} as const;

/* ===========================================================
   Supported Data
=========================================================== */

export const DATA_MODULES = [

  "categories",

  "fonts",

  "templates",

  "icons",

] as const;

/* ===========================================================
   Limits
=========================================================== */

export const DATA_LIMITS = {

  maxCategories: 100,

  maxFonts: 1000,

  maxTemplates: 1000,

  maxIcons: 5000,

  maxFontPairs: 500,

  maxThemePacks: 500,

} as const;

/* ===========================================================
   Registry Features
=========================================================== */

export const DATA_FEATURES = {

  categories: true,

  fonts: true,

  fontPairs: true,

  icons: true,

  templateRegistry: true,

  search: true,

  filtering: true,

  recommendations: true,

  lazyLoading: true,

  dynamicImport: true,

  aiReady: true,

} as const;

/* ===========================================================
   Default Values
=========================================================== */

export const DATA_DEFAULTS = {

  category: "academic",

  font: "inter",

  icon: "file-text",

  template: "academic-frame",

} as const;

/* ===========================================================
   Version
=========================================================== */

export const DATA_VERSION = {

  schema: "1.0.0",

  registry: "2.0.0",

  compatibility: "stable",

} as const;

/* ===========================================================
   Registry Status
=========================================================== */

export const DATA_STATUS = {

  initialized: true,

  loaded: true,

  validated: true,

} as const;