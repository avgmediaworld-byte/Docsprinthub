/* ===========================================================
   DocSprintHub
   Category Registry
   Part - 1 (Foundation)
   Version : 1.0.0
=========================================================== */

import type { ThemeConfiguration } from "../themes/base";

import {

  ThemeCategory,

  ThemeCategories,

  ThemeCollections,

} from "./theme-registry";

/* ===========================================================
   Category Information
=========================================================== */

export interface CategoryInformation {

  id: ThemeCategory;

  name: string;

  description: string;

  themeCount: number;

  featured: boolean;

}

/* ===========================================================
   Category List
=========================================================== */

export const CategoryList: CategoryInformation[] = [

  {

    id: "academic",

    name: "Academic",

    description:

      "Academic reports, thesis and research themes.",

    themeCount:

      ThemeCollections.academic.length,

    featured: true,

  },

  {

    id: "corporate",

    name: "Corporate",

    description:

      "Business and professional themes.",

    themeCount:

      ThemeCollections.corporate.length,

    featured: true,

  },

  {

    id: "school",

    name: "School",

    description:

      "Assignments, projects and homework themes.",

    themeCount:

      ThemeCollections.school.length,

    featured: true,

  },

  {

    id: "technology",

    name: "Technology",

    description:

      "Engineering and computer science themes.",

    themeCount:

      ThemeCollections.technology.length,

    featured: true,

  },

  {

    id: "creative",

    name: "Creative",

    description:

      "Portfolio and creative design themes.",

    themeCount:

      ThemeCollections.creative.length,

    featured: true,

  },

  {

    id: "minimal",

    name: "Minimal",

    description:

      "Elegant minimal document themes.",

    themeCount:

      ThemeCollections.minimal.length,

    featured: true,

  },

  {

    id: "gradient",

    name: "Gradient",

    description:

      "Modern gradient inspired themes.",

    themeCount:

      ThemeCollections.gradient.length,

    featured: true,

  },

  {

    id: "glass",

    name: "Glass",

    description:

      "Glassmorphism premium themes.",

    themeCount:

      ThemeCollections.glass.length,

    featured: true,

  },

  {

    id: "dark",

    name: "Dark",

    description:

      "Dark mode professional themes.",

    themeCount:

      ThemeCollections.dark.length,

    featured: true,

  },

];

/* ===========================================================
   Category Map
=========================================================== */

export const CategoryRegistryMap =

  new Map<

    ThemeCategory,

    CategoryInformation

  >();

CategoryList.forEach(category => {

  CategoryRegistryMap.set(

    category.id,

    category

  );

});

/* ===========================================================
   Category Theme Map
=========================================================== */

export const CategoryThemeMap =

  new Map<

    ThemeCategory,

    ThemeConfiguration[]

  >();

Object.entries(

  ThemeCollections

).forEach(([key, themes]) => {

  CategoryThemeMap.set(

    key as ThemeCategory,

    themes

  );

});

/* ===========================================================
   Registry Metadata
=========================================================== */

export const CategoryRegistryMetadata = {

  version: "1.0.0",

  categories:

    CategoryList.length,

  initialized: true,

} as const;


/* ===========================================================
   Category Registry
   Part - 2 (Public APIs)
   Version : 1.0.0
=========================================================== */

/* ===========================================================
   Get All Categories
=========================================================== */

export function getAllCategories():

  CategoryInformation[] {

  return CategoryList;

}

/* ===========================================================
   Get Category By ID
=========================================================== */

export function getCategoryById(

  id: ThemeCategory

): CategoryInformation | undefined {

  return CategoryRegistryMap.get(id);

}

/* ===========================================================
   Get Themes Of Category
=========================================================== */

export function getCategoryThemes(

  id: ThemeCategory

): ThemeConfiguration[] {

  return CategoryThemeMap.get(id) ?? [];

}

/* ===========================================================
   Check Category Exists
=========================================================== */

export function hasCategory(

  id: ThemeCategory

): boolean {

  return CategoryRegistryMap.has(id);

}

/* ===========================================================
   Featured Categories
=========================================================== */

export function getFeaturedCategories():

  CategoryInformation[] {

  return CategoryList.filter(

    category => category.featured

  );

}

/* ===========================================================
   Category Count
=========================================================== */

export function getCategoryCount():

  number {

  return CategoryList.length;

}

/* ===========================================================
   Total Theme Count
=========================================================== */

export function getTotalThemeCount():

  number {

  return CategoryList.reduce(

    (count, category) =>

      count + category.themeCount,

    0

  );

}

/* ===========================================================
   Empty Category Check
=========================================================== */

export function isCategoryEmpty(

  id: ThemeCategory

): boolean {

  return getCategoryThemes(id).length === 0;

}

/* ===========================================================
   Largest Category
=========================================================== */

export function getLargestCategory():

  CategoryInformation {

  return [...CategoryList].sort(

    (a, b) =>

      b.themeCount - a.themeCount

  )[0];

}

/* ===========================================================
   Smallest Category
=========================================================== */

export function getSmallestCategory():

  CategoryInformation {

  return [...CategoryList].sort(

    (a, b) =>

      a.themeCount - b.themeCount

  )[0];

}



/* ===========================================================
   Category Registry
   Part - 3 (SDK & Registry)
   Version : 1.0.0
=========================================================== */

/* ===========================================================
   Search Categories
=========================================================== */

export function searchCategories(

  keyword: string

): CategoryInformation[] {

  const query = keyword.trim().toLowerCase();

  if (!query) {

    return [];

  }

  return CategoryList.filter(category =>

    category.name.toLowerCase().includes(query) ||

    category.description.toLowerCase().includes(query)

  );

}

/* ===========================================================
   Sort Categories
=========================================================== */

export function sortCategories(

  by: "name" | "themes" = "name"

): CategoryInformation[] {

  const categories = [...CategoryList];

  if (by === "themes") {

    return categories.sort(

      (a, b) => b.themeCount - a.themeCount

    );

  }

  return categories.sort(

    (a, b) =>

      a.name.localeCompare(b.name)

  );

}

/* ===========================================================
   Category Statistics
=========================================================== */

export function getCategoryStatistics() {

  return {

    totalCategories: CategoryList.length,

    totalThemes: getTotalThemeCount(),

    featuredCategories:

      getFeaturedCategories().length,

    largestCategory:

      getLargestCategory(),

    smallestCategory:

      getSmallestCategory(),

  };

}

/* ===========================================================
   Category Registry SDK
=========================================================== */

export const CategoryRegistry = {

  metadata: CategoryRegistryMetadata,

  categories: CategoryList,

  map: CategoryRegistryMap,

  themeMap: CategoryThemeMap,

  getAllCategories,

  getCategoryById,

  getCategoryThemes,

  hasCategory,

  getFeaturedCategories,

  getCategoryCount,

  getTotalThemeCount,

  isCategoryEmpty,

  getLargestCategory,

  getSmallestCategory,

  searchCategories,

  sortCategories,

  getCategoryStatistics,

} as const;

/* ===========================================================
   Default Export
=========================================================== */

export default CategoryRegistry;