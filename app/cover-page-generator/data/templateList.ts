/* ===========================================================
   DocSprintHub
   Template Registry
   Part - 1 (Foundation)
   Version : 2.0
=========================================================== */

import type { CoverTemplate, TemplateCategory } from "../types/template";
import type { CoverTheme } from "../types/theme";

/* ===========================================================
   Difficulty
=========================================================== */

export type TemplateDifficulty =

  | "beginner"

  | "intermediate"

  | "advanced"

  | "standard"

  | "professional";

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

  theme: CoverTheme["id"];

  template: CoverTemplate["id"];

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

  {
    id: "commerce-gold",
    slug: "commerce-gold",
    name: "Commerce Gold",
    description: "Premium academic frame with luxury gold accents.",
    category: "academic",
    difficulty: "intermediate",
    theme: "commerce-gold",
    template: "commerce-gold",
    thumbnail: {
      small: "/templates/commerce-gold/thumbnail-sm.webp",
      medium: "/templates/commerce-gold/thumbnail-md.webp",
      large: "/templates/commerce-gold/thumbnail-lg.webp",
    },
    preview: {
      image: "/templates/commerce-gold/preview.webp",
    },
    tags: ["college", "report", "premium", "research"],
    author: { id: "docsprinthub", name: "DocSprintHub" },
    stats: { downloads: 0, likes: 0, rating: 5 },
    compatibility: { mobile: true, tablet: true, desktop: true, print: true },
    premium: false,
    featured: false,
  },
  {
    id: "computer-science",
    slug: "computer-science",
    name: "Computer Science",
    description: "Technical project cover with structured layout.",
    category: "academic",
    difficulty: "standard",
    theme: "computer-science",
    template: "computer-science",
    thumbnail: {
      small: "/templates/computer-science/thumbnail-sm.webp",
      medium: "/templates/computer-science/thumbnail-md.webp",
      large: "/templates/computer-science/thumbnail-lg.webp",
    },
    preview: {
      image: "/templates/computer-science/preview.webp",
    },
    tags: ["technology", "engineering", "college"],
    author: { id: "docsprinthub", name: "DocSprintHub" },
    stats: { downloads: 0, likes: 0, rating: 5 },
    compatibility: { mobile: true, tablet: true, desktop: true, print: true },
    premium: false,
    featured: false,
  },
  {
    id: "education-theme",
    slug: "education-theme",
    name: "Education Theme",
    description: "Clean academic cover for university and classes.",
    category: "academic",
    difficulty: "beginner",
    theme: "education-theme",
    template: "education-theme",
    thumbnail: {
      small: "/templates/education-theme/thumbnail-sm.webp",
      medium: "/templates/education-theme/thumbnail-md.webp",
      large: "/templates/education-theme/thumbnail-lg.webp",
    },
    preview: {
      image: "/templates/education-theme/preview.webp",
    },
    tags: ["academic", "education", "professional"],
    author: { id: "docsprinthub", name: "DocSprintHub" },
    stats: { downloads: 0, likes: 0, rating: 5 },
    compatibility: { mobile: true, tablet: true, desktop: true, print: true },
    premium: false,
    featured: false,
  },
  {
    id: "elegant-border",
    slug: "elegant-border",
    name: "Elegant Border",
    description: "Subtle border styling for premium academic presentation.",
    category: "academic",
    difficulty: "standard",
    theme: "elegant-border",
    template: "elegant-border",
    thumbnail: {
      small: "/templates/elegant-border/thumbnail-sm.webp",
      medium: "/templates/elegant-border/thumbnail-md.webp",
      large: "/templates/elegant-border/thumbnail-lg.webp",
    },
    preview: {
      image: "/templates/elegant-border/preview.webp",
    },
    tags: ["academic", "elegant", "report"],
    author: { id: "docsprinthub", name: "DocSprintHub" },
    stats: { downloads: 0, likes: 0, rating: 5 },
    compatibility: { mobile: true, tablet: true, desktop: true, print: true },
    premium: false,
    featured: false,
  },
  {
    id: "engineering-blue",
    slug: "engineering-blue",
    name: "Engineering Blue",
    description: "Strong academic cover with engineering-inspired accents.",
    category: "academic",
    difficulty: "intermediate",
    theme: "engineering-blue",
    template: "engineering-blue",
    thumbnail: {
      small: "/templates/engineering-blue/thumbnail-sm.webp",
      medium: "/templates/engineering-blue/thumbnail-md.webp",
      large: "/templates/engineering-blue/thumbnail-lg.webp",
    },
    preview: {
      image: "/templates/engineering-blue/preview.webp",
    },
    tags: ["engineering", "technology", "project"],
    author: { id: "docsprinthub", name: "DocSprintHub" },
    stats: { downloads: 0, likes: 0, rating: 5 },
    compatibility: { mobile: true, tablet: true, desktop: true, print: true },
    premium: false,
    featured: false,
  },
  {
    id: "law-professional",
    slug: "law-professional",
    name: "Law Professional",
    description: "Formal academic cover for law and business projects.",
    category: "academic",
    difficulty: "standard",
    theme: "law-professional",
    template: "law-professional",
    thumbnail: {
      small: "/templates/law-professional/thumbnail-sm.webp",
      medium: "/templates/law-professional/thumbnail-md.webp",
      large: "/templates/law-professional/thumbnail-lg.webp",
    },
    preview: {
      image: "/templates/law-professional/preview.webp",
    },
    tags: ["law", "business", "formal"],
    author: { id: "docsprinthub", name: "DocSprintHub" },
    stats: { downloads: 0, likes: 0, rating: 5 },
    compatibility: { mobile: true, tablet: true, desktop: true, print: true },
    premium: false,
    featured: false,
  },
  {
    id: "medical-white",
    slug: "medical-white",
    name: "Medical White",
    description: "Clean healthcare theme for medical projects and reports.",
    category: "academic",
    difficulty: "beginner",
    theme: "medical-white",
    template: "medical-white",
    thumbnail: {
      small: "/templates/medical-white/thumbnail-sm.webp",
      medium: "/templates/medical-white/thumbnail-md.webp",
      large: "/templates/medical-white/thumbnail-lg.webp",
    },
    preview: {
      image: "/templates/medical-white/preview.webp",
    },
    tags: ["medical", "health", "academic"],
    author: { id: "docsprinthub", name: "DocSprintHub" },
    stats: { downloads: 0, likes: 0, rating: 5 },
    compatibility: { mobile: true, tablet: true, desktop: true, print: true },
    premium: false,
    featured: false,
  },
  {
    id: "minimal-academic",
    slug: "minimal-academic",
    name: "Minimal Academic",
    description: "Minimal academic cover with a modern editorial style.",
    category: "academic",
    difficulty: "beginner",
    theme: "minimal-academic",
    template: "minimal-academic",
    thumbnail: {
      small: "/templates/minimal-academic/thumbnail-sm.webp",
      medium: "/templates/minimal-academic/thumbnail-md.webp",
      large: "/templates/minimal-academic/thumbnail-lg.webp",
    },
    preview: {
      image: "/templates/minimal-academic/preview.webp",
    },
    tags: ["minimal", "clean", "report"],
    author: { id: "docsprinthub", name: "DocSprintHub" },
    stats: { downloads: 0, likes: 0, rating: 5 },
    compatibility: { mobile: true, tablet: true, desktop: true, print: true },
    premium: false,
    featured: false,
  },
  {
    id: "modern-university",
    slug: "modern-university",
    name: "Modern University",
    description: "Stylish university cover page with a contemporary feel.",
    category: "academic",
    difficulty: "intermediate",
    theme: "modern-university",
    template: "modern-university",
    thumbnail: {
      small: "/templates/modern-university/thumbnail-sm.webp",
      medium: "/templates/modern-university/thumbnail-md.webp",
      large: "/templates/modern-university/thumbnail-lg.webp",
    },
    preview: {
      image: "/templates/modern-university/preview.webp",
    },
    tags: ["university", "contemporary", "project"],
    author: { id: "docsprinthub", name: "DocSprintHub" },
    stats: { downloads: 0, likes: 0, rating: 5 },
    compatibility: { mobile: true, tablet: true, desktop: true, print: true },
    premium: false,
    featured: false,
  },
  {
    id: "premium-academic",
    slug: "premium-academic",
    name: "Premium Academic",
    description: "Luxury academic cover design with premium typography.",
    category: "academic",
    difficulty: "professional",
    theme: "premium-academic",
    template: "premium-academic",
    thumbnail: {
      small: "/templates/premium-academic/thumbnail-sm.webp",
      medium: "/templates/premium-academic/thumbnail-md.webp",
      large: "/templates/premium-academic/thumbnail-lg.webp",
    },
    preview: {
      image: "/templates/premium-academic/preview.webp",
    },
    tags: ["premium", "luxury", "academic"],
    author: { id: "docsprinthub", name: "DocSprintHub" },
    stats: { downloads: 0, likes: 0, rating: 5 },
    compatibility: { mobile: true, tablet: true, desktop: true, print: true },
    premium: false,
    featured: false,
  },
  {
    id: "research-paper",
    slug: "research-paper",
    name: "Research Paper",
    description: "Structured cover page for academic research and thesis.",
    category: "academic",
    difficulty: "intermediate",
    theme: "research-paper",
    template: "research-paper",
    thumbnail: {
      small: "/templates/research-paper/thumbnail-sm.webp",
      medium: "/templates/research-paper/thumbnail-md.webp",
      large: "/templates/research-paper/thumbnail-lg.webp",
    },
    preview: {
      image: "/templates/research-paper/preview.webp",
    },
    tags: ["thesis", "research", "professional"],
    author: { id: "docsprinthub", name: "DocSprintHub" },
    stats: { downloads: 0, likes: 0, rating: 5 },
    compatibility: { mobile: true, tablet: true, desktop: true, print: true },
    premium: false,
    featured: false,
  },
  {
    id: "science-project",
    slug: "science-project",
    name: "Science Project",
    description: "Science themed cover page for experiments and reports.",
    category: "academic",
    difficulty: "beginner",
    theme: "science-project",
    template: "science-project",
    thumbnail: {
      small: "/templates/science-project/thumbnail-sm.webp",
      medium: "/templates/science-project/thumbnail-md.webp",
      large: "/templates/science-project/thumbnail-lg.webp",
    },
    preview: {
      image: "/templates/science-project/preview.webp",
    },
    tags: ["science", "school", "project"],
    author: { id: "docsprinthub", name: "DocSprintHub" },
    stats: { downloads: 0, likes: 0, rating: 5 },
    compatibility: { mobile: true, tablet: true, desktop: true, print: true },
    premium: false,
    featured: false,
  },
  {
    id: "thesis-modern",
    slug: "thesis-modern",
    name: "Thesis Modern",
    description: "Contemporary thesis cover page with bold accents.",
    category: "academic",
    difficulty: "professional",
    theme: "thesis-modern",
    template: "thesis-modern",
    thumbnail: {
      small: "/templates/thesis-modern/thumbnail-sm.webp",
      medium: "/templates/thesis-modern/thumbnail-md.webp",
      large: "/templates/thesis-modern/thumbnail-lg.webp",
    },
    preview: {
      image: "/templates/thesis-modern/preview.webp",
    },
    tags: ["thesis", "modern", "academic"],
    author: { id: "docsprinthub", name: "DocSprintHub" },
    stats: { downloads: 0, likes: 0, rating: 5 },
    compatibility: { mobile: true, tablet: true, desktop: true, print: true },
    premium: false,
    featured: false,
  },
  {
    id: "university-classic",
    slug: "university-classic",
    name: "University Classic",
    description: "Classic university report cover with academic iconography.",
    category: "academic",
    difficulty: "standard",
    theme: "university-classic",
    template: "university-classic",
    thumbnail: {
      small: "/templates/university-classic/thumbnail-sm.webp",
      medium: "/templates/university-classic/thumbnail-md.webp",
      large: "/templates/university-classic/thumbnail-lg.webp",
    },
    preview: {
      image: "/templates/university-classic/preview.webp",
    },
    tags: ["university", "classic", "report"],
    author: { id: "docsprinthub", name: "DocSprintHub" },
    stats: { downloads: 0, likes: 0, rating: 5 },
    compatibility: { mobile: true, tablet: true, desktop: true, print: true },
    premium: false,
    featured: false,
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

  /* =======================================================
     Additional category gallery templates
  ======================================================= */

  createGalleryTemplate({
    id: "ai-future",
    name: "AI Future",
    description: "Dark technology cover for technical and AI projects.",
    category: "technology",
    tags: ["technology", "ai", "project"],
  }),

  createGalleryTemplate({
    id: "portfolio-pro",
    name: "Portfolio Pro",
    description: "Creative portfolio cover with a bold purple composition.",
    category: "creative",
    tags: ["creative", "portfolio", "design"],
  }),

  createGalleryTemplate({
    id: "minimal-white",
    name: "Minimal White",
    description: "Clean, typography-first cover for reports and proposals.",
    category: "minimal",
    tags: ["minimal", "clean", "report"],
  }),

  createGalleryTemplate({
    id: "premium-gold",
    name: "Premium Gold",
    description: "Luxury dark cover with gold details.",
    category: "premium",
    tags: ["premium", "luxury", "portfolio"],
    premium: true,
  }),

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

  theme: CoverTheme["id"]

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

function createGalleryTemplate({
  id,
  name,
  description,
  category,
  tags,
  premium = false,
}: {
  id: string;
  name: string;
  description: string;
  category: TemplateCategory;
  tags: string[];
  premium?: boolean;
}): TemplateRegistryItem {
  return {
    id,
    slug: id,
    name,
    description,
    category,
    difficulty: premium ? "professional" : "standard",
    theme: id,
    template: id,
    thumbnail: {
      small: `/templates/${id}/thumbnail-sm.webp`,
      medium: `/templates/${id}/thumbnail-md.webp`,
      large: `/templates/${id}/thumbnail-lg.webp`,
    },
    preview: { image: `/templates/${id}/preview.webp` },
    tags,
    author: { id: "docsprinthub", name: "DocSprintHub" },
    stats: { downloads: 0, likes: 0, rating: 5 },
    compatibility: { mobile: true, tablet: true, desktop: true, print: true },
    premium,
    featured: false,
  };
}
