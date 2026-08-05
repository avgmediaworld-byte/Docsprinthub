/* ===========================================================
   DocSprintHub
   Theme Runtime Types
   Part - 1 (Foundation)
   Version : 3.0
=========================================================== */

import type {

  ThemeConfiguration,

  ThemeMode,

  ThemeVariant,

} from "./base";

/* ===========================================================
   Theme Source
=========================================================== */

export type ThemeSource =

  | "builtin"

  | "custom"

  | "community"

  | "plugin"

  | "ai";

/* ===========================================================
   Runtime Status
=========================================================== */

export type ThemeRuntimeStatus =

  | "idle"

  | "loading"

  | "ready"

  | "error";

/* ===========================================================
   Theme Action
=========================================================== */

export type ThemeActionType =

  | "create"

  | "update"

  | "delete"

  | "duplicate"

  | "apply"

  | "reset"

  | "import"

  | "export";

/* ===========================================================
   Runtime Metadata
=========================================================== */

export interface ThemeMetadata {

  id: string;

  source: ThemeSource;

  version: string;

  author?: string;

  createdAt: string;

  updatedAt: string;

}

/* ===========================================================
   Theme Runtime
=========================================================== */

export interface ThemeRuntime {

  theme: ThemeConfiguration;

  metadata: ThemeMetadata;

  status: ThemeRuntimeStatus;

}

/* ===========================================================
   Theme History Entry
=========================================================== */

export interface ThemeHistoryEntry {

  id: string;

  action: ThemeActionType;

  timestamp: string;

  themeId: string;

}

/* ===========================================================
   Theme History
=========================================================== */

export interface ThemeHistory {

  undo: ThemeHistoryEntry[];

  redo: ThemeHistoryEntry[];

}

/* ===========================================================
   Theme Context
=========================================================== */

export interface ThemeContext {

  current: ThemeConfiguration;

  previous?: ThemeConfiguration;

  history: ThemeHistory;

}

/* ===========================================================
   Theme Manager
=========================================================== */

export interface ThemeManager {

  activeTheme: ThemeConfiguration;

  themes: ThemeRuntime[];

  context: ThemeContext;

}


/* ===========================================================
   Theme Runtime Types
   Part - 2 (State, Events & Workspace)
   Version : 3.0
=========================================================== */

/* ===========================================================
   Theme Event
=========================================================== */

export type ThemeEventType =

  | "theme:created"

  | "theme:updated"

  | "theme:deleted"

  | "theme:applied"

  | "theme:loaded"

  | "theme:saved"

  | "theme:reset"

  | "theme:exported"

  | "theme:imported";

/* ===========================================================
   Theme Event
=========================================================== */

export interface ThemeEvent {

  id: string;

  type: ThemeEventType;

  timestamp: string;

  themeId: string;

}

/* ===========================================================
   Theme Listener
=========================================================== */

export type ThemeListener = (

  event: ThemeEvent

) => void;

/* ===========================================================
   Theme State
=========================================================== */

export interface ThemeState {

  loading: boolean;

  dirty: boolean;

  readonly: boolean;

  initialized: boolean;

}

/* ===========================================================
   Theme Search
=========================================================== */

export interface ThemeSearch {

  keyword?: string;

  mode?: ThemeMode;

  variant?: ThemeVariant;

  source?: ThemeSource;

}

/* ===========================================================
   Theme Sort
=========================================================== */

export type ThemeSort =

  | "name"

  | "created"

  | "updated"

  | "variant";

/* ===========================================================
   Theme Filter
=========================================================== */

export interface ThemeFilter {

  mode?: ThemeMode;

  variant?: ThemeVariant;

  source?: ThemeSource;

}

/* ===========================================================
   Theme Collection
=========================================================== */

export interface ThemeCollection {

  id: string;

  name: string;

  themes: string[];

}

/* ===========================================================
   Theme Preset
=========================================================== */

export interface ThemePreset {

  id: string;

  name: string;

  description: string;

  themeId: string;

}

/* ===========================================================
   Theme Workspace
=========================================================== */

export interface ThemeWorkspace {

  activeThemeId: string;

  collections: ThemeCollection[];

  presets: ThemePreset[];

}

/* ===========================================================
   Theme Session
=========================================================== */

export interface ThemeSession {

  workspace: ThemeWorkspace;

  state: ThemeState;

  search: ThemeSearch;

  filter: ThemeFilter;

  sort: ThemeSort;

}

/* ===========================================================
   Default Theme State
=========================================================== */

export const DEFAULT_THEME_STATE: ThemeState = {

  loading: false,

  dirty: false,

  readonly: false,

  initialized: false,

};

/* ===========================================================
   Default Session
=========================================================== */

export const DEFAULT_THEME_SESSION: ThemeSession = {

  workspace: {

    activeThemeId: "",

    collections: [],

    presets: [],

  },

  state: DEFAULT_THEME_STATE,

  search: {},

  filter: {},

  sort: "name",

};

/* ===========================================================
   Theme Runtime Types
   Part - 3 (Plugins, Registry, Cache & Cloud)
   Version : 3.0
=========================================================== */

import type { ThemeValidationResult } from "./base";

/* ===========================================================
   Theme Registry
=========================================================== */

export interface ThemeRegistry {

  items: ThemeRuntime[];

}

/* ===========================================================
   Theme Loader
=========================================================== */

export interface ThemeLoader {

  load(id: string): Promise<ThemeConfiguration>;

  unload(id: string): Promise<void>;

}

/* ===========================================================
   Theme Cache
=========================================================== */

export interface ThemeCache {

  enabled: boolean;

  maxEntries: number;

  ttl: number;

}

/* ===========================================================
   Theme Snapshot
=========================================================== */

export interface ThemeSnapshot {

  id: string;

  timestamp: string;

  theme: ThemeConfiguration;

}

/* ===========================================================
   Theme Backup
=========================================================== */

export interface ThemeBackup {

  version: string;

  createdAt: string;

  snapshots: ThemeSnapshot[];

}

/* ===========================================================
   Theme Restore
=========================================================== */

export interface ThemeRestoreResult {

  success: boolean;

  restoredTheme?: ThemeConfiguration;

  message?: string;

}

/* ===========================================================
   Theme Plugin
=========================================================== */

export interface ThemePlugin {

  id: string;

  name: string;

  version: string;

  author?: string;

  enabled: boolean;

  apply(

    theme: ThemeConfiguration

  ): ThemeConfiguration;

}

/* ===========================================================
   Theme Marketplace
=========================================================== */

export interface ThemeMarketplaceItem {

  id: string;

  title: string;

  author: string;

  version: string;

  premium: boolean;

}

/* ===========================================================
   Theme AI Recommendation
=========================================================== */

export interface ThemeAIRecommendation {

  category:

    | "academic"

    | "corporate"

    | "school"

    | "technology"

    | "creative";

  confidence: number;

  recommendedThemeId: string;

}

/* ===========================================================
   Theme Import
=========================================================== */

export interface ThemeImport {

  json: string;

}

/* ===========================================================
   Theme Export
=========================================================== */

export interface ThemeExport {

  format: "json";

  pretty: boolean;

}

/* ===========================================================
   Cloud Sync
=========================================================== */

export interface ThemeCloudSync {

  enabled: boolean;

  provider:

    | "google-drive"

    | "onedrive"

    | "dropbox"

    | "icloud"

    | "none";

}

/* ===========================================================
   Runtime Validation
=========================================================== */

export interface ThemeRuntimeValidation {

  runtime: ThemeRuntime;

  validation: ThemeValidationResult;

}

/* ===========================================================
   Theme Engine Runtime
=========================================================== */

export interface ThemeRuntimeEngine {

  registry: ThemeRegistry;

  cache: ThemeCache;

  session: ThemeSession;

  plugins: ThemePlugin[];

  cloud: ThemeCloudSync;

}

/* ===========================================================
   Default Cache
=========================================================== */

export const DEFAULT_THEME_CACHE: ThemeCache = {

  enabled: true,

  maxEntries: 100,

  ttl: 300,

};

/* ===========================================================
   Default Cloud
=========================================================== */

export const DEFAULT_THEME_CLOUD: ThemeCloudSync = {

  enabled: false,

  provider: "none",

};

/* ===========================================================
   Default Runtime Engine
=========================================================== */

export const DEFAULT_THEME_RUNTIME_ENGINE: ThemeRuntimeEngine = {

  registry: {

    items: [],

  },

  cache: DEFAULT_THEME_CACHE,

  session: DEFAULT_THEME_SESSION,

  plugins: [],

  cloud: DEFAULT_THEME_CLOUD,

};