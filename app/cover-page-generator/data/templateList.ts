/* ===========================================================
   DocSprintHub
   Template Registry
   Part - 1 (Foundation)
   Version : 2.0
=========================================================== */

import type {

  CoverTemplate,

  TemplateCategory,

} from "../types/template";

import type {

  CoverTheme,

} from "../types/theme";

/* ===========================================================
   Difficulty
=========================================================== */

export type TemplateDifficulty =

  | "beginner"

  | "intermediate"

  | "advanced";

/* ===========================================================
   Badge
=========================================================== */

export type TemplateBadge =

  | "new"

  | "popular"

  | "featured"

  | "premium"

  | "recommended";

/* ===========================================================
   Thumbnail
=========================================================== */

export interface TemplateThumbnail {

  small: string;

  medium: string;

  large: string;

}

/* ===========================================================
   Preview
=========================================================== */

export interface TemplatePreview {

  image: string;

  demo?: string;

}

/* ===========================================================
   Author
=========================================================== */

export interface TemplateAuthor {

  id: string;

  name: string;

}

/* ===========================================================
   Statistics
=========================================================== */

export interface TemplateStats {

  downloads: number;

  likes: number;

  rating: number;

}

/* ===========================================================
   Compatibility
=========================================================== */

export interface TemplateCompatibility {

  mobile: boolean;

  tablet: boolean;

  desktop: boolean;

  print: boolean;

}

/* ===========================================================
   Registry Entry
=========================================================== */

export interface TemplateRegistryItem {

  id: string;

  slug: string;

  name: string;

  description: string;

  category: TemplateCategory;

  difficulty: TemplateDifficulty;

  theme: CoverTheme;

  template: CoverTemplate;

  thumbnail: TemplateThumbnail;

  preview: TemplatePreview;

  tags: string[];

  author: TemplateAuthor;

  stats: TemplateStats;

  compatibility: TemplateCompatibility;

  premium: boolean;

  featured: boolean;

  badge?: TemplateBadge;

}

/* ===========================================================
   Template Registry
   Part - 2 (Starter Registry)
=========================================================== */

export const TEMPLATE_REGISTRY: TemplateRegistryItem[] = [

  /* =======================================================
     Academic
  ======================================================= */

  {

    id: "academic-frame",

    slug: "academic-frame",

    name: "Academic Frame",

    description:
      "Modern academic project cover page.",

    category: "academic",

    difficulty: "beginner",

    theme: "academic-frame",

    template: "academic-frame",

    thumbnail: {

      small:
        "/templates/academic-frame/thumbnail-sm.webp",

      medium:
        "/templates/academic-frame/thumbnail-md.webp",

      large:
        "/templates/academic-frame/thumbnail-lg.webp",

    },

    preview: {

      image:
        "/templates/academic-frame/preview.webp",

    },

    tags: [

      "college",

      "project",

      "assignment",

      "report",

    ],

    author: {

      id: "docsprinthub",

      name: "DocSprintHub",

    },

    stats: {

      downloads: 0,

      likes: 0,

      rating: 5,

    },

    compatibility: {

      mobile: true,

      tablet: true,

      desktop: true,

      print: true,

    },

    premium: false,

    featured: true,

    badge: "featured",

  },

  /* =======================================================
     Corporate
  ======================================================= */

  {

    id: "corporate-blue",

    slug: "corporate-blue",

    name: "Corporate Blue",

    description:
      "Professional business cover page.",

    category: "corporate",

    difficulty: "intermediate",

    theme: "corporate-blue",

    template: "corporate-blue",

    thumbnail: {

      small:
        "/templates/corporate-blue/thumbnail-sm.webp",

      medium:
        "/templates/corporate-blue/thumbnail-md.webp",

      large:
        "/templates/corporate-blue/thumbnail-lg.webp",

    },

    preview: {

      image:
        "/templates/corporate-blue/preview.webp",

    },

    tags: [

      "proposal",

      "business",

      "internship",

      "company",

    ],

    author: {

      id: "docsprinthub",

      name: "DocSprintHub",

    },

    stats: {

      downloads: 0,

      likes: 0,

      rating: 5,

    },

    compatibility: {

      mobile: true,

      tablet: true,

      desktop: true,

      print: true,

    },

    premium: false,

    featured: true,

  },

  /* =======================================================
     School
  ======================================================= */

  {

    id: "school-project",

    slug: "school-project",

    name: "School Project",

    description:
      "School assignment cover.",

    category: "school",

    difficulty: "beginner",

    theme: "school-classic",

    template: "school-project",

    thumbnail: {

      small:
        "/templates/school-project/thumbnail-sm.webp",

      medium:
        "/templates/school-project/thumbnail-md.webp",

      large:
        "/templates/school-project/thumbnail-lg.webp",

    },

    preview: {

      image:
        "/templates/school-project/preview.webp",

    },

    tags: [

      "school",

      "science",

      "holiday",

    ],

    author: {

      id: "docsprinthub",

      name: "DocSprintHub",

    },

    stats: {

      downloads: 0,

      likes: 0,

      rating: 5,

    },

    compatibility: {

      mobile: true,

      tablet: true,

      desktop: true,

      print: true,

    },

    premium: false,

    featured: false,

  },

];

/* ===========================================================
   Template Registry
   Part - 3 (Registry API & Utilities)
   Version : 2.0
=========================================================== */

/* ===========================================================
   Search Options
=========================================================== */

export interface TemplateSearchOptions {

  category?: TemplateCategory;

  featured?: boolean;

  premium?: boolean;

  difficulty?: TemplateDifficulty;

  badge?: TemplateBadge;

  tag?: string;

}

/* ===========================================================
   Validation
=========================================================== */

export interface TemplateValidationError {

  field: string;

  message: string;

}

export interface TemplateValidationResult {

  valid: boolean;

  errors: TemplateValidationError[];

}

/* ===========================================================
   Registry Engine
=========================================================== */

export interface TemplateRegistryEngine {

  templates: TemplateRegistryItem[];

}

/* ===========================================================
   Engine
=========================================================== */

export const TEMPLATE_ENGINE: TemplateRegistryEngine = {

  templates: TEMPLATE_REGISTRY,

};

/* ===========================================================
   Search By ID
=========================================================== */

export function getTemplateById(

  id: string

): TemplateRegistryItem | undefined {

  return TEMPLATE_REGISTRY.find(

    (template) => template.id === id

  );

}

/* ===========================================================
   Search By Slug
=========================================================== */

export function getTemplateBySlug(

  slug: string

): TemplateRegistryItem | undefined {

  return TEMPLATE_REGISTRY.find(

    (template) => template.slug === slug

  );

}

/* ===========================================================
   Category
=========================================================== */

export function getTemplatesByCategory(

  category: TemplateCategory

): TemplateRegistryItem[] {

  return TEMPLATE_REGISTRY.filter(

    (template) => template.category === category

  );

}

/* ===========================================================
   Theme
=========================================================== */

export function getTemplatesByTheme(

  theme: CoverTheme

): TemplateRegistryItem[] {

  return TEMPLATE_REGISTRY.filter(

    (template) => template.theme === theme

  );

}

/* ===========================================================
   Featured
=========================================================== */

export function getFeaturedTemplates() {

  return TEMPLATE_REGISTRY.filter(

    (template) => template.featured

  );

}

/* ===========================================================
   Premium
=========================================================== */

export function getPremiumTemplates() {

  return TEMPLATE_REGISTRY.filter(

    (template) => template.premium

  );

}

/* ===========================================================
   Search
=========================================================== */

export function searchTemplates(

  options: TemplateSearchOptions

): TemplateRegistryItem[] {

  return TEMPLATE_REGISTRY.filter((template) => {

    if (

      options.category &&

      template.category !== options.category

    ) {

      return false;

    }

    if (

      options.featured !== undefined &&

      template.featured !== options.featured

    ) {

      return false;

    }

    if (

      options.premium !== undefined &&

      template.premium !== options.premium

    ) {

      return false;

    }

    if (

      options.difficulty &&

      template.difficulty !== options.difficulty

    ) {

      return false;

    }

    if (

      options.badge &&

      template.badge !== options.badge

    ) {

      return false;

    }

    if (

      options.tag &&

      !template.tags.includes(options.tag)

    ) {

      return false;

    }

    return true;

  });

}

/* ===========================================================
   Related Templates
=========================================================== */

export function getRelatedTemplates(

  id: string,

  limit = 4

): TemplateRegistryItem[] {

  const current = getTemplateById(id);

  if (!current) return [];

  return TEMPLATE_REGISTRY

    .filter(

      (template) =>

        template.id !== id &&

        template.category === current.category

    )

    .slice(0, limit);

}

/* ===========================================================
   Recommendation
=========================================================== */

export function recommendTemplates(

  category: TemplateCategory

): TemplateRegistryItem[] {

  return getTemplatesByCategory(category)

    .sort((a, b) => {

      if (a.featured && !b.featured) return -1;

      if (!a.featured && b.featured) return 1;

      return b.stats.rating - a.stats.rating;

    });

}

/* ===========================================================
   Validation
=========================================================== */

export function validateTemplate(

  template: TemplateRegistryItem

): TemplateValidationResult {

  const errors: TemplateValidationError[] = [];

  if (!template.id.trim()) {

    errors.push({

      field: "id",

      message: "Template ID is required.",

    });

  }

  if (!template.name.trim()) {

    errors.push({

      field: "name",

      message: "Template name is required.",

    });

  }

  if (!template.slug.trim()) {

    errors.push({

      field: "slug",

      message: "Template slug is required.",

    });

  }

  return {

    valid: errors.length === 0,

    errors,

  };

}

/* ===========================================================
   Statistics
=========================================================== */

export function getTemplateCount() {

  return TEMPLATE_REGISTRY.length;

}

export function getCategoryCount(

  category: TemplateCategory

): number {

  return getTemplatesByCategory(category).length;

}