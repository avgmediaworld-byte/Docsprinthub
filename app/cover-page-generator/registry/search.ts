/* ===========================================================
   DocSprintHub
   Registry Search Engine
   Part - 1 (Foundation)
   Version : 1.0.0
=========================================================== */

import type { ThemeConfiguration } from "../data/themes/base";

import {

  AllThemes,

  ThemeCategory,

  ThemeMap,

  CategoryMap,

} from "./theme-registry";

/* ===========================================================
   Search Types
=========================================================== */

export type SearchMode =

  | "all"

  | "name"

  | "category"

  | "variant"

  | "mode";

export interface SearchOptions {

  query?: string;

  category?: ThemeCategory;

  variant?: string;

  mode?: "light" | "dark";

  limit?: number;

}

/* ===========================================================
   Search Result
=========================================================== */

export interface SearchResult {

  total: number;

  results: ThemeConfiguration[];

  query: string;

  mode: SearchMode;

}

/* ===========================================================
   Search Metadata
=========================================================== */

export const SearchMetadata = {

  engine: "Registry Search",

  version: "1.0.0",

  initialized: true,

  indexedThemes: AllThemes.length,

} as const;

/* ===========================================================
   Search Configuration
=========================================================== */

export const SearchConfiguration = {

  caseSensitive: false,

  partialMatch: true,

  sortResults: true,

  maxResults: 100,

} as const;

/* ===========================================================
   Search Index
=========================================================== */

export const SearchIndex = {

  themes: ThemeMap,

  categories: CategoryMap,

};

/* ===========================================================
   Default Search Options
=========================================================== */

export const DefaultSearchOptions: Required<SearchOptions> = {

  query: "",

  category: "academic",

  variant: "",

  mode: "light",

  limit: SearchConfiguration.maxResults,

};


/* ===========================================================
   Registry Search Engine
   Part - 2 (Search APIs)
   Version : 1.0.0
=========================================================== */

/* ===========================================================
   Search By ID
=========================================================== */

export function searchById(

  id: string

): ThemeConfiguration | undefined {

  return SearchIndex.themes.get(id);

}

/* ===========================================================
   Search By Name
=========================================================== */

export function searchByName(

  query: string

): ThemeConfiguration[] {

  const value = query.trim().toLowerCase();

  if (!value) {

    return [];

  }

  return AllThemes.filter(theme =>

    theme.name.toLowerCase().includes(value)

  );

}

/* ===========================================================
   Search By Category
=========================================================== */

export function searchByCategory(

  category: ThemeCategory

): ThemeConfiguration[] {

  return SearchIndex.categories.get(category) ?? [];

}

/* ===========================================================
   Search By Variant
=========================================================== */

export function searchByVariant(

  variant: string

): ThemeConfiguration[] {

  const value = variant.toLowerCase();

  return AllThemes.filter(

    theme =>

      theme.variant.toLowerCase() === value

  );

}

/* ===========================================================
   Search By Mode
=========================================================== */

export function searchByMode(

  mode: "light" | "dark"

): ThemeConfiguration[] {

  return AllThemes.filter(

    theme => theme.mode === mode

  );

}

/* ===========================================================
   Global Search
=========================================================== */

export function searchAll(

  query: string

): SearchResult {

  const value = query.trim().toLowerCase();

  const results =

    value.length === 0

      ? []

      : AllThemes.filter(theme =>

          theme.name

            .toLowerCase()

            .includes(value) ||

          theme.id

            .toLowerCase()

            .includes(value)

        );

  return {

    total: results.length,

    results,

    query,

    mode: "all",

  };

}

/* ===========================================================
   Advanced Search
=========================================================== */

export function advancedSearch(

  options: SearchOptions

): SearchResult {

  const settings = {

    ...DefaultSearchOptions,

    ...options,

  };

  let results = [...AllThemes];

  if (settings.query) {

    const query = settings.query.toLowerCase();

    results = results.filter(theme =>

      theme.name

        .toLowerCase()

        .includes(query) ||

      theme.id

        .toLowerCase()

        .includes(query)

    );

  }

  if (settings.variant) {

    const variant = settings.variant.toLowerCase();

    results = results.filter(

      theme =>

        theme.variant.toLowerCase() === variant

    );

  }

  if (settings.mode) {

    results = results.filter(

      theme => theme.mode === settings.mode

    );

  }

  if (settings.category) {

    const categoryThemes =

      SearchIndex.categories.get(

        settings.category

      ) ?? [];

    const ids = new Set(

      categoryThemes.map(

        theme => theme.id

      )

    );

    results = results.filter(

      theme => ids.has(theme.id)

    );

  }

  results = results.slice(

    0,

    settings.limit

  );

  return {

    total: results.length,

    results,

    query: settings.query,

    mode: "all",

  };

}


/* ===========================================================
   Registry Search Engine
   Part - 3 (SDK & Smart Search)
   Version : 1.0.0
=========================================================== */

/* ===========================================================
   Featured Search
=========================================================== */

export function getFeaturedSearchResults(): ThemeConfiguration[] {

  return AllThemes.filter(

    theme =>

      theme.status === "stable"

  );

}

/* ===========================================================
   Premium Search
=========================================================== */

export function getPremiumSearchResults(): ThemeConfiguration[] {

  return AllThemes.filter(

    theme =>

      (theme.variant ?? "") === "premium"

  );

}

/* ===========================================================
   Light Theme Search
=========================================================== */

export function getLightThemes(): ThemeConfiguration[] {

  return searchByMode("light");

}

/* ===========================================================
   Dark Theme Search
=========================================================== */

export function getDarkThemes(): ThemeConfiguration[] {

  return searchByMode("dark");

}

/* ===========================================================
   Random Search
=========================================================== */

export function getRandomSearchResult():

ThemeConfiguration {

  return AllThemes[

    Math.floor(

      Math.random() * AllThemes.length

    )

  ];

}

/* ===========================================================
   Search Statistics
=========================================================== */

export function getSearchStatistics() {

  return {

    indexedThemes: AllThemes.length,

    indexedCategories:

      SearchIndex.categories.size,

    themeMapSize:

      SearchIndex.themes.size,

    version:

      SearchMetadata.version,

  };

}

/* ===========================================================
   Smart Search
=========================================================== */

export function smartSearch(

  query: string

): SearchResult {

  const result = searchAll(query);

  result.results.sort(

    (a, b) => {

      const exactA =

        a.name.toLowerCase() ===

        query.toLowerCase();

      const exactB =

        b.name.toLowerCase() ===

        query.toLowerCase();

      if (exactA && !exactB) return -1;

      if (!exactA && exactB) return 1;

      return a.name.localeCompare(

        b.name

      );

    }

  );

  return result;

}

/* ===========================================================
   Search SDK
=========================================================== */

export const SearchEngine = {

  metadata:

    SearchMetadata,

  configuration:

    SearchConfiguration,

  index:

    SearchIndex,

  searchById,

  searchByName,

  searchByCategory,

  searchByVariant,

  searchByMode,

  searchAll,

  advancedSearch,

  smartSearch,

  getFeaturedSearchResults,

  getPremiumSearchResults,

  getLightThemes,

  getDarkThemes,

  getRandomSearchResult,

  getSearchStatistics,

} as const;

/* ===========================================================
   Default Export
=========================================================== */

export default SearchEngine;
