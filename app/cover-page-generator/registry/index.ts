/* ===========================================================
   DocSprintHub
   Registry Layer
   Public API
   Part - 1
   Version : 1.0.0
=========================================================== */

/* ===========================================================
   Theme Registry
=========================================================== */

export * from "./theme-registry";

/* ===========================================================
   Category Registry
=========================================================== */

export * from "./category-registry";

/* ===========================================================
   Search Engine
=========================================================== */

export * from "./search";

/* ===========================================================
   Recommendation Engine
=========================================================== */

export * from "./recommendation";

/* ===========================================================
   Statistics Engine
=========================================================== */

export * from "./statistics";

/* ===========================================================
   Theme Loader
=========================================================== */

export * from "./loader";

/* ===========================================================
   Registry Metadata
=========================================================== */

export const REGISTRY_ENGINE = {

  name: "DocSprintHub Registry",

  version: "1.0.0",

  author: "DocSprintHub",

  initialized: true,

} as const;

/* ===========================================================
   Registry Features
=========================================================== */

export const REGISTRY_FEATURES = {

  globalSearch: true,

  categoryLookup: true,

  themeLookup: true,

  recommendations: true,

  statistics: true,

  lazyLoading: true,

  runtimeRegistration: true,

  pluginSupport: true,

  aiReady: true,

  marketplaceReady: true,

} as const;

/* ===========================================================
   Supported Modules
=========================================================== */

export const REGISTRY_MODULES = [

  "themes",

  "categories",

  "search",

  "recommendation",

  "statistics",

  "loader",

] as const;

/* ===========================================================
   Registry Version
=========================================================== */

export const REGISTRY_VERSION = {

  api: "1.0.0",

  engine: "1.0.0",

  schema: "1.0.0",

} as const;

/* ===========================================================
   Registry Layer
   Public API
   Part - 2 (SDK & Manager)
   Version : 1.0.0
=========================================================== */

import {

  ThemeRegistry,

} from "./theme-registry";

import {

  CategoryRegistry,

} from "./category-registry";

import {

  SearchEngine,

} from "./search";

import {

  RecommendationEngine,

} from "./recommendation";

import {

  StatisticsEngine,

} from "./statistics";

import {

  RegistryLoader,

} from "./loader";

/* ===========================================================
   Registry Manager
=========================================================== */

export const RegistryManager = {

  themes: ThemeRegistry,

  categories: CategoryRegistry,

  search: SearchEngine,

  recommendation: RecommendationEngine,

  statistics: StatisticsEngine,

  loader: RegistryLoader,

};

/* ===========================================================
   Runtime Registry
=========================================================== */

export const RuntimeRegistry = {

  initialized: false,

  loadedModules: [] as string[],

  version: REGISTRY_ENGINE.version,

};

/* ===========================================================
   Registry SDK
=========================================================== */

export const RegistrySDK = {

  engine: REGISTRY_ENGINE,

  features: REGISTRY_FEATURES,

  modules: REGISTRY_MODULES,

  manager: RegistryManager,

  runtime: RuntimeRegistry,

};

/* ===========================================================
   Default Registry
=========================================================== */

export const DefaultRegistry =

  RegistrySDK;

/* ===========================================================
   Public Registry API
=========================================================== */

export const Registry = {

  themes: RegistryManager.themes,

  categories: RegistryManager.categories,

  search: RegistryManager.search,

  recommendation:

    RegistryManager.recommendation,

  statistics:

    RegistryManager.statistics,

  loader:

    RegistryManager.loader,

};

/* ===========================================================
   Registry Status
=========================================================== */

export function isRegistryReady(): boolean {

  return RuntimeRegistry.initialized;

}

/* ===========================================================
   Initialize Registry
=========================================================== */

export function initializeRegistry(): void {

  RuntimeRegistry.initialized = true;

  RuntimeRegistry.loadedModules = [

    ...REGISTRY_MODULES,

  ];

}

/* ===========================================================
   Reset Registry
=========================================================== */

export function resetRegistry(): void {

  RuntimeRegistry.initialized = false;

  RuntimeRegistry.loadedModules = [];

}


/* ===========================================================
   Registry Layer
   Public API
   Part - 3 (Enterprise SDK)
   Version : 1.0.0
=========================================================== */

/* ===========================================================
   Registry Hooks
=========================================================== */

export type RegistryHook = () => void;

const startupHooks: RegistryHook[] = [];

const shutdownHooks: RegistryHook[] = [];

/* ===========================================================
   Hook Registration
=========================================================== */

export function onRegistryStart(

  hook: RegistryHook

): void {

  startupHooks.push(hook);

}

export function onRegistryShutdown(

  hook: RegistryHook

): void {

  shutdownHooks.push(hook);

}

/* ===========================================================
   Plugin Registration
=========================================================== */

const registeredPlugins = new Set<string>();

export function registerPlugin(

  pluginId: string

): void {

  registeredPlugins.add(pluginId);

}

export function unregisterPlugin(

  pluginId: string

): void {

  registeredPlugins.delete(pluginId);

}

export function getRegisteredPlugins(): string[] {

  return Array.from(registeredPlugins);

}

/* ===========================================================
   Registry Configuration
=========================================================== */

export const RegistryConfiguration = {

  lazyLoading: true,

  preloadThemes: true,

  enableCache: true,

  enableRecommendations: true,

  enableStatistics: true,

  enablePlugins: true,

  strictMode: true,

} as const;

/* ===========================================================
   Compatibility
=========================================================== */

export function isRegistryCompatible(

  version: string

): boolean {

  return version.startsWith("1.");

}

/* ===========================================================
   Enterprise SDK
=========================================================== */

export const EnterpriseRegistry = {

  sdk: RegistrySDK,

  registry: Registry,

  runtime: RuntimeRegistry,

  configuration: RegistryConfiguration,

  plugins: {

    register: registerPlugin,

    unregister: unregisterPlugin,

    list: getRegisteredPlugins,

  },

  hooks: {

    onStart: onRegistryStart,

    onShutdown: onRegistryShutdown,

  },

};

/* ===========================================================
   Execute Startup Hooks
=========================================================== */

export function startRegistry(): void {

  initializeRegistry();

  startupHooks.forEach(

    hook => hook()

  );

}

/* ===========================================================
   Execute Shutdown Hooks
=========================================================== */

export function stopRegistry(): void {

  shutdownHooks.forEach(

    hook => hook()

  );

  resetRegistry();

}

/* ===========================================================
   SDK Version
=========================================================== */

export const REGISTRY_SDK_VERSION = {

  sdk: "1.0.0",

  api: "1.0.0",

  engine: REGISTRY_ENGINE.version,

} as const;

/* ===========================================================
   Default Export
=========================================================== */

export default EnterpriseRegistry;