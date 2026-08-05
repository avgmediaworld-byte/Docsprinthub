/* ===========================================================
   DocSprintHub Cover Page Generator
   Categories Registry
   Version : 1.0
   =========================================================== */

import { TemplateCategory } from "../types";

/* -----------------------------------------------------------
   Category Badge Color
----------------------------------------------------------- */

export type CategoryColor =
  | "blue"
  | "green"
  | "purple"
  | "orange"
  | "red"
  | "yellow"
  | "cyan"
  | "gray";

/* -----------------------------------------------------------
   Category Icon
----------------------------------------------------------- */

export type CategoryIcon =
  | "graduation-cap"
  | "building"
  | "school"
  | "palette"
  | "cpu"
  | "sparkles"
  | "book-open"
  | "newspaper";

/* -----------------------------------------------------------
   Category Definition
----------------------------------------------------------- */

export interface CategoryItem {
  id: TemplateCategory;

  title: string;

  shortTitle: string;

  description: string;

  icon: CategoryIcon;

  color: CategoryColor;

  order: number;

  featured: boolean;

  popular: boolean;

  comingSoon?: boolean;
}

/* -----------------------------------------------------------
   Categories
----------------------------------------------------------- */

export const COVER_CATEGORIES: readonly CategoryItem[] = [
  {
    id: "academic",
    title: "Academic",
    shortTitle: "Academic",
    description: "College, University, Thesis & Research Covers",
    icon: "graduation-cap",
    color: "blue",
    order: 1,
    featured: true,
    popular: true,
  },

  {
    id: "corporate",
    title: "Corporate",
    shortTitle: "Corporate",
    description: "Business Reports, Proposal & Internship",
    icon: "building",
    color: "green",
    order: 2,
    featured: true,
    popular: true,
  },

  {
    id: "school",
    title: "School",
    shortTitle: "School",
    description: "Assignments, Projects & Holiday Homework",
    icon: "school",
    color: "orange",
    order: 3,
    featured: true,
    popular: true,
  },

  {
    id: "creative",
    title: "Creative",
    shortTitle: "Creative",
    description: "Portfolio, Design & Creative Covers",
    icon: "palette",
    color: "purple",
    order: 4,
    featured: true,
    popular: false,
  },

  {
    id: "technology",
    title: "Technology",
    shortTitle: "Tech",
    description: "AI, Coding, Cyber Security & Engineering",
    icon: "cpu",
    color: "cyan",
    order: 5,
    featured: true,
    popular: true,
  },

  {
    id: "minimal",
    title: "Minimal",
    shortTitle: "Minimal",
    description: "Simple, Elegant & Apple Style Covers",
    icon: "sparkles",
    color: "gray",
    order: 6,
    featured: false,
    popular: false,
  },

  {
    id: "magazine",
    title: "Magazine",
    shortTitle: "Magazine",
    description: "Editorial, Annual Report & Portfolio",
    icon: "newspaper",
    color: "red",
    order: 7,
    featured: false,
    popular: false,
  },

  {
    id: "premium",
    title: "Premium",
    shortTitle: "Premium",
    description: "Luxury, Black Gold & Glass UI",
    icon: "book-open",
    color: "yellow",
    order: 8,
    featured: true,
    popular: true,
  },
] as const;

/* -----------------------------------------------------------
   Quick Lookup
----------------------------------------------------------- */

export const CATEGORY_MAP: Record<
  TemplateCategory,
  CategoryItem
> = COVER_CATEGORIES.reduce(
  (acc, category) => {
    acc[category.id] = category;
    return acc;
  },
  {} as Record<TemplateCategory, CategoryItem>
);

/* -----------------------------------------------------------
   Featured Categories
----------------------------------------------------------- */

export const FEATURED_CATEGORIES = COVER_CATEGORIES.filter(
  (category) => category.featured
);

/* -----------------------------------------------------------
   Popular Categories
----------------------------------------------------------- */

export const POPULAR_CATEGORIES = COVER_CATEGORIES.filter(
  (category) => category.popular
);

/* -----------------------------------------------------------
   Category Helpers
----------------------------------------------------------- */

export function getCategory(
  id: TemplateCategory
): CategoryItem {
  return CATEGORY_MAP[id];
}

export function getCategoryTitle(
  id: TemplateCategory
): string {
  return CATEGORY_MAP[id].title;
}

export function getCategoryDescription(
  id: TemplateCategory
): string {
  return CATEGORY_MAP[id].description;
}