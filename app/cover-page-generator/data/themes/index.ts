/* ===========================================================
   DocSprintHub
   Theme Engine
   Public API
   Part - 1
   Version : 3.0
=========================================================== */

/* ===========================================================
   Core Engine
=========================================================== */

export * from "./base";

export * from "./constants";

export * from "./helpers";

export * from "./types";

/* ===========================================================
   Theme Categories
=========================================================== */

export * from "./academic";

export * from "./corporate";

export * from "./school";

export * from "./technology";

export * from "./minimal";

export * from "./creative";

export * from "./gradient";

export * from "./glass";

export * from "./dark";

/* ===========================================================
   Engine Metadata
=========================================================== */

export const THEME_ENGINE = {

  name: "DocSprintHub Theme Engine",

  version: "3.0.0",

  author: "DocSprintHub",

  initialized: true,

} as const;

/* ===========================================================
   Engine Features
=========================================================== */

export const THEME_FEATURES = {

  livePreview: true,

  runtimeSwitching: true,

  cssVariables: true,

  designTokens: true,

  gradients: true,

  glassEffect: true,

  darkMode: true,

  printOptimized: true,

  aiReady: true,

  pluginSupport: true,

} as const;

/* ===========================================================
   Supported Categories
=========================================================== */

export const THEME_CATEGORIES = [

  "academic",

  "corporate",

  "school",

  "technology",

  "minimal",

  "creative",

  "gradient",

  "glass",

  "dark",

] as const;

/* ===========================================================
   Theme Engine
   Public API
   Part - 2 (Registry & Manager)
   Version : 3.0
=========================================================== */

import {

  DEFAULT_THEME,

  BUILTIN_THEMES,

  createTheme,

  getTheme,

  getThemes,

  hasTheme,

  registerTheme,

  getThemeCount,

} from "./base";

import type {

  ThemeConfiguration,

} from "./base";

/* ===========================================================
   Default Theme
=========================================================== */

export const DEFAULT_ENGINE_THEME =

  DEFAULT_THEME;

/* ===========================================================
   Registry
=========================================================== */

export const THEME_REGISTRY =

  BUILTIN_THEMES;

/* ===========================================================
   Theme Collections
=========================================================== */

export const THEME_COLLECTIONS = {

  academic: [] as ThemeConfiguration[],

  corporate: [] as ThemeConfiguration[],

  school: [] as ThemeConfiguration[],

  technology: [] as ThemeConfiguration[],

  minimal: [] as ThemeConfiguration[],

  creative: [] as ThemeConfiguration[],

  gradient: [] as ThemeConfiguration[],

  glass: [] as ThemeConfiguration[],

  dark: [] as ThemeConfiguration[],

};

/* ===========================================================
   Statistics
=========================================================== */

export const THEME_STATS = {

  get totalThemes() {

    return getThemeCount();

  },

  get categories() {

    return THEME_CATEGORIES.length;

  },

  get engineVersion() {

    return THEME_ENGINE.version;

  },

};

/* ===========================================================
   Public Manager
=========================================================== */

export const ThemeManager = {

  create: createTheme,

  register: registerTheme,

  get: getTheme,

  getAll: getThemes,

  exists: hasTheme,

  defaultTheme: DEFAULT_THEME,

};

/* ===========================================================
   Search
=========================================================== */

export function searchThemes(

  keyword: string

): ThemeConfiguration[] {

  const query = keyword.toLowerCase();

  return getThemes().filter(

    theme =>

      theme.name

        .toLowerCase()

        .includes(query)

  );

}

/* ===========================================================
   Recommendation
=========================================================== */

export function recommendThemes(

  variant?: string

): ThemeConfiguration[] {

  if (!variant) {

    return getThemes();

  }

  return getThemes().filter(

    theme =>

      theme.variant === variant

  );

}

/* ===========================================================
   Export Engine
=========================================================== */

export const THEME_PUBLIC_API = {

  manager: ThemeManager,

  registry: THEME_REGISTRY,

  collections: THEME_COLLECTIONS,

  metadata: THEME_ENGINE,

  features: THEME_FEATURES,

  defaults: DEFAULT_ENGINE_THEME,

};

/* ===========================================================
   Theme Engine
   Public API
   Part - 3 (SDK, Plugins & Runtime)
   Version : 3.0
=========================================================== */

import type {
  ThemePlugin,
  ThemeRuntimeEngine,
} from "./types";

/* ===========================================================
   Plugin Registry
=========================================================== */

const PLUGIN_REGISTRY = new Map<string, ThemePlugin>();

/* ===========================================================
   Register Plugin
=========================================================== */

export function registerThemePlugin(

  plugin: ThemePlugin

): void {

  PLUGIN_REGISTRY.set(

    plugin.id,

    plugin

  );

}

/* ===========================================================
   Remove Plugin
=========================================================== */

export function unregisterThemePlugin(

  pluginId: string

): boolean {

  return PLUGIN_REGISTRY.delete(

    pluginId

  );

}

/* ===========================================================
   Get Plugin
=========================================================== */

export function getThemePlugin(

  pluginId: string

): ThemePlugin | undefined {

  return PLUGIN_REGISTRY.get(

    pluginId

  );

}

/* ===========================================================
   Plugin List
=========================================================== */

export function getThemePlugins(): ThemePlugin[] {

  return Array.from(

    PLUGIN_REGISTRY.values()

  );

}

/* ===========================================================
   Runtime Theme Switch
=========================================================== */

export function switchTheme(

  id: string

): ThemeConfiguration {

  if (!hasTheme(id as never)) {

    return DEFAULT_ENGINE_THEME;

  }

  return getTheme(id as never);

}

/* ===========================================================
   Dynamic Theme Loader
=========================================================== */

export async function loadTheme(

  id: string

): Promise<ThemeConfiguration> {

  return switchTheme(id);

}

/* ===========================================================
   Lazy Theme Loader
=========================================================== */

export async function lazyLoadTheme(

  id: string

): Promise<ThemeConfiguration> {

  return loadTheme(id);

}

/* ===========================================================
   Compatibility
=========================================================== */

export function isCompatibleVersion(

  version: string

): boolean {

  return version.startsWith("3.");

}

/* ===========================================================
   Migration Stub
=========================================================== */

export function migrateTheme(

  theme: ThemeConfiguration

): ThemeConfiguration {

  return theme;

}

/* ===========================================================
   Runtime Engine
=========================================================== */

export const THEME_RUNTIME: Partial<ThemeRuntimeEngine> = {

  registry: {

    items: [],

  },

  plugins: [],

};

/* ===========================================================
   SDK
=========================================================== */

export const ThemeSDK = {

  version: THEME_ENGINE.version,

  engine: THEME_ENGINE,

  manager: ThemeManager,

  registry: THEME_REGISTRY,

  runtime: THEME_RUNTIME,

  features: THEME_FEATURES,

  plugins: {

    register: registerThemePlugin,

    unregister: unregisterThemePlugin,

    get: getThemePlugin,

    list: getThemePlugins,

  },

  theme: {

    create: createTheme,

    get: getTheme,

    getAll: getThemes,

    exists: hasTheme,

    search: searchThemes,

    recommend: recommendThemes,

    switch: switchTheme,

    load: loadTheme,

    lazyLoad: lazyLoadTheme,

    migrate: migrateTheme,

  },

};

/* ===========================================================
   Version Information
=========================================================== */

export const THEME_VERSION = {

  engine: "3.0.0",

  sdk: "1.0.0",

  api: "1.0.0",

  compatibility: "3.x",

} as const;

/* ===========================================================
   Default Export
=========================================================== */

export default ThemeSDK;