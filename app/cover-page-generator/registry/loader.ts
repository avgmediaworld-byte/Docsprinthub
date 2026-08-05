/* ===========================================================
   DocSprintHub
   Registry Loader
   Part - 1 (Foundation)
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

/* ===========================================================
   Loader Status
=========================================================== */

export type LoaderStatus =

  | "idle"

  | "loading"

  | "ready"

  | "failed";

/* ===========================================================
   Loader State
=========================================================== */

export interface LoaderState {

  status: LoaderStatus;

  initialized: boolean;

  loadedModules: string[];

  startedAt?: Date;

  completedAt?: Date;

}

/* ===========================================================
   Loader Metadata
=========================================================== */

export const LoaderMetadata = {

  engine: "Registry Loader",

  version: "1.0.0",

  initialized: false,

} as const;

/* ===========================================================
   Loader Configuration
=========================================================== */

export const LoaderConfiguration = {

  autoInitialize: true,

  validateModules: true,

  enableCache: true,

  enableStatistics: true,

  enableRecommendations: true,

} as const;

/* ===========================================================
   Loader Modules
=========================================================== */

export const LoaderModules = {

  themes: ThemeRegistry,

  categories: CategoryRegistry,

  search: SearchEngine,

  recommendation: RecommendationEngine,

  statistics: StatisticsEngine,

};

/* ===========================================================
   Runtime State
=========================================================== */

export const LoaderRuntime: LoaderState = {

  status: "idle",

  initialized: false,

  loadedModules: [],

};

/* ===========================================================
   Registry Loader
   Part - 2 (Loader APIs)
   Version : 1.0.0
=========================================================== */

/* ===========================================================
   Initialize Loader
=========================================================== */

export function initializeLoader(): void {

  LoaderRuntime.status = "loading";

  LoaderRuntime.initialized = false;

  LoaderRuntime.startedAt = new Date();

  LoaderRuntime.loadedModules = [];

}

/* ===========================================================
   Load Module
=========================================================== */

export function loadModule(

  moduleName: keyof typeof LoaderModules

): boolean {

  if (!(moduleName in LoaderModules)) {

    return false;

  }

  if (

    !LoaderRuntime.loadedModules.includes(

      moduleName

    )

  ) {

    LoaderRuntime.loadedModules.push(

      moduleName

    );

  }

  return true;

}

/* ===========================================================
   Load Registry
=========================================================== */

export function loadRegistry(): void {

  initializeLoader();

  (

    Object.keys(

      LoaderModules

    ) as Array<

      keyof typeof LoaderModules

    >

  ).forEach(moduleName => {

    loadModule(moduleName);

  });

  LoaderRuntime.status = "ready";

  LoaderRuntime.initialized = true;

  LoaderRuntime.completedAt = new Date();

}

/* ===========================================================
   Loader Status
=========================================================== */

export function getLoaderStatus():

  LoaderStatus {

  return LoaderRuntime.status;

}

/* ===========================================================
   Loader Ready
=========================================================== */

export function isLoaderReady():

  boolean {

  return (

    LoaderRuntime.initialized &&

    LoaderRuntime.status === "ready"

  );

}

/* ===========================================================
   Loaded Modules
=========================================================== */

export function getLoadedModules():

  string[] {

  return [

    ...LoaderRuntime.loadedModules,

  ];

}

/* ===========================================================
   Module Count
=========================================================== */

export function getLoadedModuleCount():

  number {

  return LoaderRuntime.loadedModules.length;

}

/* ===========================================================
   Check Module
=========================================================== */

export function isModuleLoaded(

  moduleName: keyof typeof LoaderModules

): boolean {

  return LoaderRuntime.loadedModules.includes(

    moduleName

  );

}

/* ===========================================================
   Runtime Information
=========================================================== */

export function getLoaderRuntime() {

  return {

    ...LoaderRuntime,

  };

}

/* ===========================================================
   Registry Loader
   Part - 3 (Bootstrap & SDK)
   Version : 1.0.0
=========================================================== */

/* ===========================================================
   Validate Registry
=========================================================== */

export function validateRegistry(): boolean {

  const moduleCount = Object.keys(
    LoaderModules
  ).length;

  return (

    LoaderRuntime.loadedModules.length ===
      moduleCount &&

    LoaderRuntime.status === "ready"

  );

}

/* ===========================================================
   Reset Loader
=========================================================== */

export function resetLoader(): void {

  LoaderRuntime.status = "idle";

  LoaderRuntime.initialized = false;

  LoaderRuntime.loadedModules = [];

  LoaderRuntime.startedAt = undefined;

  LoaderRuntime.completedAt = undefined;

}

/* ===========================================================
   Restart Loader
=========================================================== */

export function restartLoader(): void {

  resetLoader();

  loadRegistry();

}

/* ===========================================================
   Bootstrap Registry
=========================================================== */

export function bootstrapRegistry(): boolean {

  loadRegistry();

  return validateRegistry();

}

/* ===========================================================
   Loader Statistics
=========================================================== */

export function getLoaderStatistics() {

  return {

    status: LoaderRuntime.status,

    initialized:

      LoaderRuntime.initialized,

    loadedModules:

      LoaderRuntime.loadedModules.length,

    startedAt:

      LoaderRuntime.startedAt,

    completedAt:

      LoaderRuntime.completedAt,

    validation:

      validateRegistry(),

    version:

      LoaderMetadata.version,

  };

}

/* ===========================================================
   Loader SDK
=========================================================== */

export const RegistryLoader = {

  metadata: LoaderMetadata,

  configuration: LoaderConfiguration,

  modules: LoaderModules,

  runtime: LoaderRuntime,

  initializeLoader,

  loadRegistry,

  loadModule,

  bootstrapRegistry,

  validateRegistry,

  resetLoader,

  restartLoader,

  getLoaderStatus,

  isLoaderReady,

  getLoadedModules,

  getLoadedModuleCount,

  isModuleLoaded,

  getLoaderRuntime,

  getLoaderStatistics,

} as const;

/* ===========================================================
   Auto Bootstrap
=========================================================== */

if (

  LoaderConfiguration.autoInitialize &&

  !LoaderRuntime.initialized

) {

  bootstrapRegistry();

}

/* ===========================================================
   Default Export
=========================================================== */

export default RegistryLoader;