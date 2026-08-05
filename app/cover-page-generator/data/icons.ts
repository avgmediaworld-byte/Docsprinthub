/* ===========================================================
   DocSprintHub
   Universal Icon Engine
   Part - 1 (Foundation)
   Version : 2.0
=========================================================== */

/* ===========================================================
   Icon Library
=========================================================== */

export type IconLibrary =
  | "lucide"
  | "heroicons"
  | "tabler"
  | "phosphor"
  | "custom";

/* ===========================================================
   Icon Category
=========================================================== */

export type IconCategory =
  | "academic"
  | "school"
  | "corporate"
  | "technology"
  | "medical"
  | "engineering"
  | "commerce"
  | "science"
  | "creative"
  | "government"
  | "security"
  | "communication"
  | "documents"
  | "social"
  | "general";

/* ===========================================================
   Icon Style
=========================================================== */

export type IconStyle =
  | "outline"
  | "filled"
  | "duotone"
  | "rounded";

/* ===========================================================
   Icon Color Mode
=========================================================== */

export type IconColorMode =
  | "inherit"
  | "fixed"
  | "theme";

/* ===========================================================
   Icon Metadata
=========================================================== */

export interface IconMeta {

  id: string;

  name: string;

  library: IconLibrary;

  category: IconCategory;

  style: IconStyle;

  colorMode: IconColorMode;

  tags: string[];

}

/* ===========================================================
   Icon Preview
=========================================================== */

export interface IconPreview {

  svg?: string;

  thumbnail?: string;

}

/* ===========================================================
   Icon Entry
=========================================================== */

export interface IconDefinition {

  meta: IconMeta;

  preview?: IconPreview;

  component?: string;

}

/* ===========================================================
   Icon Pack
=========================================================== */

export interface IconPack {

  id: string;

  name: string;

  description: string;

  icons: IconDefinition[];

}

/* ===========================================================
   Registry
=========================================================== */

export interface IconRegistry {

  icons: IconDefinition[];

  packs: IconPack[];

}


/* ===========================================================
   Universal Icon Engine
   Part - 2 (Built-in Icon Registry)
   Version : 2.0
=========================================================== */

/* ===========================================================
   Built-in Icons
=========================================================== */

export const ICON_LIBRARY: IconDefinition[] = [

  /* =======================================================
     Academic
  ======================================================= */

  {
    meta: {
      id: "graduation-cap",
      name: "Graduation Cap",
      library: "lucide",
      category: "academic",
      style: "outline",
      colorMode: "theme",
      tags: ["college","education","university","degree"],
    },
    component: "GraduationCap",
  },

  {
    meta: {
      id: "book-open",
      name: "Book Open",
      library: "lucide",
      category: "academic",
      style: "outline",
      colorMode: "theme",
      tags: ["book","study","education"],
    },
    component: "BookOpen",
  },

  /* =======================================================
     School
  ======================================================= */

  {
    meta: {
      id: "school",
      name: "School",
      library: "lucide",
      category: "school",
      style: "outline",
      colorMode: "theme",
      tags: ["school","student","class"],
    },
    component: "School",
  },

  {
    meta: {
      id: "backpack",
      name: "Backpack",
      library: "lucide",
      category: "school",
      style: "outline",
      colorMode: "theme",
      tags: ["bag","school","education"],
    },
    component: "Backpack",
  },

  /* =======================================================
     Corporate
  ======================================================= */

  {
    meta: {
      id: "building",
      name: "Building",
      library: "lucide",
      category: "corporate",
      style: "outline",
      colorMode: "theme",
      tags: ["office","company","business"],
    },
    component: "Building2",
  },

  {
    meta: {
      id: "briefcase",
      name: "Briefcase",
      library: "lucide",
      category: "corporate",
      style: "outline",
      colorMode: "theme",
      tags: ["job","office","company"],
    },
    component: "BriefcaseBusiness",
  },

  /* =======================================================
     Technology
  ======================================================= */

  {
    meta: {
      id: "cpu",
      name: "CPU",
      library: "lucide",
      category: "technology",
      style: "outline",
      colorMode: "theme",
      tags: ["processor","technology","computer"],
    },
    component: "Cpu",
  },

  {
    meta: {
      id: "laptop",
      name: "Laptop",
      library: "lucide",
      category: "technology",
      style: "outline",
      colorMode: "theme",
      tags: ["computer","coding","software"],
    },
    component: "Laptop",
  },

  /* =======================================================
     Medical
  ======================================================= */

  {
    meta: {
      id: "stethoscope",
      name: "Stethoscope",
      library: "lucide",
      category: "medical",
      style: "outline",
      colorMode: "theme",
      tags: ["doctor","hospital","medical"],
    },
    component: "Stethoscope",
  },

  /* =======================================================
     Engineering
  ======================================================= */

  {
    meta: {
      id: "settings",
      name: "Settings",
      library: "lucide",
      category: "engineering",
      style: "outline",
      colorMode: "theme",
      tags: ["gear","engineering","mechanical"],
    },
    component: "Settings",
  },

  /* =======================================================
     Commerce
  ======================================================= */

  {
    meta: {
      id: "chart",
      name: "Chart",
      library: "lucide",
      category: "commerce",
      style: "outline",
      colorMode: "theme",
      tags: ["finance","business","graph"],
    },
    component: "ChartColumn",
  },

  /* =======================================================
     Science
  ======================================================= */

  {
    meta: {
      id: "flask",
      name: "Flask",
      library: "lucide",
      category: "science",
      style: "outline",
      colorMode: "theme",
      tags: ["chemistry","science","lab"],
    },
    component: "FlaskConical",
  },

  /* =======================================================
     Creative
  ======================================================= */

  {
    meta: {
      id: "palette",
      name: "Palette",
      library: "lucide",
      category: "creative",
      style: "outline",
      colorMode: "theme",
      tags: ["design","creative","art"],
    },
    component: "Palette",
  },

  /* =======================================================
     Documents
  ======================================================= */

  {
    meta: {
      id: "file-text",
      name: "Document",
      library: "lucide",
      category: "documents",
      style: "outline",
      colorMode: "theme",
      tags: ["pdf","report","document"],
    },
    component: "FileText",
  },

  {
    meta: {
      id: "file-check",
      name: "Certificate",
      library: "lucide",
      category: "documents",
      style: "outline",
      colorMode: "theme",
      tags: ["certificate","award"],
    },
    component: "FileCheck",
  },

  /* =======================================================
     General
  ======================================================= */

  {
    meta: {
      id: "star",
      name: "Star",
      library: "lucide",
      category: "general",
      style: "filled",
      colorMode: "theme",
      tags: ["favorite","featured"],
    },
    component: "Star",
  },

  {
    meta: {
      id: "shield",
      name: "Shield",
      library: "lucide",
      category: "security",
      style: "outline",
      colorMode: "theme",
      tags: ["security","verified"],
    },
    component: "ShieldCheck",
  },

];

/* ===========================================================
   Built-in Packs
=========================================================== */

export const ICON_PACKS: IconPack[] = [

  {
    id: "academic",
    name: "Academic",
    description: "Education related icons",
    icons: ICON_LIBRARY.filter(
      icon => icon.meta.category === "academic"
    ),
  },

  {
    id: "corporate",
    name: "Corporate",
    description: "Business related icons",
    icons: ICON_LIBRARY.filter(
      icon => icon.meta.category === "corporate"
    ),
  },

  {
    id: "technology",
    name: "Technology",
    description: "Technology related icons",
    icons: ICON_LIBRARY.filter(
      icon => icon.meta.category === "technology"
    ),
  },

  {
    id: "documents",
    name: "Documents",
    description: "Document icons",
    icons: ICON_LIBRARY.filter(
      icon => icon.meta.category === "documents"
    ),
  },

];



/* ===========================================================
   Universal Icon Engine
   Part - 3 (Registry, Search & Utilities)
   Version : 2.0
=========================================================== */

/* ===========================================================
   Search Options
=========================================================== */

export interface IconSearchOptions {

  category?: IconCategory;

  library?: IconLibrary;

  style?: IconStyle;

  colorMode?: IconColorMode;

  tag?: string;

  keyword?: string;

}

/* ===========================================================
   Validation
=========================================================== */

export interface IconValidationError {

  field: string;

  message: string;

}

export interface IconValidationResult {

  valid: boolean;

  errors: IconValidationError[];

}

/* ===========================================================
   Engine
=========================================================== */

export interface IconEngine {

  icons: IconDefinition[];

  packs: IconPack[];

}

export const ICON_ENGINE: IconEngine = {

  icons: ICON_LIBRARY,

  packs: ICON_PACKS,

};

/* ===========================================================
   Search By ID
=========================================================== */

export function getIconById(

  id: string

): IconDefinition | undefined {

  return ICON_LIBRARY.find(

    (icon) => icon.meta.id === id

  );

}

/* ===========================================================
   Search By Name
=========================================================== */

export function getIconByName(

  name: string

): IconDefinition | undefined {

  return ICON_LIBRARY.find(

    (icon) =>

      icon.meta.name.toLowerCase() ===

      name.toLowerCase()

  );

}

/* ===========================================================
   Category
=========================================================== */

export function getIconsByCategory(

  category: IconCategory

): IconDefinition[] {

  return ICON_LIBRARY.filter(

    (icon) => icon.meta.category === category

  );

}

/* ===========================================================
   Library
=========================================================== */

export function getIconsByLibrary(

  library: IconLibrary

): IconDefinition[] {

  return ICON_LIBRARY.filter(

    (icon) => icon.meta.library === library

  );

}

/* ===========================================================
   Search
=========================================================== */

export function searchIcons(

  options: IconSearchOptions

): IconDefinition[] {

  return ICON_LIBRARY.filter((icon) => {

    if (

      options.category &&

      icon.meta.category !== options.category

    ) {

      return false;

    }

    if (

      options.library &&

      icon.meta.library !== options.library

    ) {

      return false;

    }

    if (

      options.style &&

      icon.meta.style !== options.style

    ) {

      return false;

    }

    if (

      options.colorMode &&

      icon.meta.colorMode !== options.colorMode

    ) {

      return false;

    }

    if (

      options.tag &&

      !icon.meta.tags.includes(options.tag)

    ) {

      return false;

    }

    if (

      options.keyword

    ) {

      const keyword = options.keyword.toLowerCase();

      const found =

        icon.meta.name.toLowerCase().includes(keyword) ||

        icon.meta.tags.some(

          tag => tag.toLowerCase().includes(keyword)

        );

      if (!found) return false;

    }

    return true;

  });

}

/* ===========================================================
   Packs
=========================================================== */

export function getIconPack(

  id: string

): IconPack | undefined {

  return ICON_PACKS.find(

    (pack) => pack.id === id

  );

}

/* ===========================================================
   Recommendation
=========================================================== */

export function recommendIcons(

  category: IconCategory,

  limit = 6

): IconDefinition[] {

  return getIconsByCategory(category)

    .slice(0, limit);

}

/* ===========================================================
   Validation
=========================================================== */

export function validateIcon(

  icon: IconDefinition

): IconValidationResult {

  const errors: IconValidationError[] = [];

  if (!icon.meta.id.trim()) {

    errors.push({

      field: "id",

      message: "Icon id is required.",

    });

  }

  if (!icon.meta.name.trim()) {

    errors.push({

      field: "name",

      message: "Icon name is required.",

    });

  }

  return {

    valid: errors.length === 0,

    errors,

  };

}

/* ===========================================================
   Component Resolver
=========================================================== */

export function getIconComponentName(

  id: string

): string | undefined {

  return getIconById(id)?.component;

}

/* ===========================================================
   Statistics
=========================================================== */

export function getIconCount(): number {

  return ICON_LIBRARY.length;

}

export function getPackCount(): number {

  return ICON_PACKS.length;

}

export function getCategoryIconCount(

  category: IconCategory

): number {

  return getIconsByCategory(category).length;

}

/* ===========================================================
   Default Icon
=========================================================== */

export const DEFAULT_ICON =

  getIconById("file-text");

/* ===========================================================
   Export Registry
=========================================================== */

export const ICON_REGISTRY: IconRegistry = {

  icons: ICON_LIBRARY,

  packs: ICON_PACKS,

};