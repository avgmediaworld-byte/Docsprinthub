/* ===========================================================
   DocSprintHub
   Technology Theme Collection
   Part - 1 (Foundation)
   Version : 1.0
=========================================================== */

import {

  createTheme,

  type ThemeConfiguration,

} from "./base";

/* ===========================================================
   Technology Theme IDs
=========================================================== */

export type TechnologyThemeId =

  | "ai-future"

  | "cyber-security"

  | "cloud-computing"

  | "software-engineering"

  | "full-stack"

  | "data-science"

  | "networking-pro"

  | "robotics"

  | "electronics"

  | "quantum-tech";

/* ===========================================================
   Technology Base Theme
=========================================================== */

export const TechnologyBaseTheme = createTheme({

  id: "ai-future",

  name: "Technology Base",

  mode: "light",

  variant: "modern",

  status: "stable",

  palette: {

    primary: "#2563EB",

    secondary: "#3B82F6",

    accent: "#06B6D4",

    success: "#10B981",

    warning: "#F59E0B",

    danger: "#EF4444",

    text: "#111827",

    muted: "#6B7280",

    border: "#D1D5DB",

    background: "#FFFFFF",

  },

  typography: {

    headingFont: "Inter",

    bodyFont: "Inter",

    headingWeight: 700,

    bodyWeight: 400,

    lineHeight: 1.6,

  },

  spacing: {

    page: 40,

    section: 24,

    content: 16,

  },

});

/* ===========================================================
   Theme Registry
=========================================================== */

export const TechnologyThemes: ThemeConfiguration[] = [

  TechnologyBaseTheme,

];

/* ===========================================================
   Collection Metadata
=========================================================== */

export const TechnologyThemeCollection = {

  id: "technology",

  name: "Technology",

  description:

    "Modern technology themes for engineering, AI, software development and technical reports.",

  totalThemes: 10,

};

/* ===========================================================
   Categories
=========================================================== */

export const TechnologyCategories = [

  "Artificial Intelligence",

  "Programming",

  "Cyber Security",

  "Cloud",

  "Networking",

  "Electronics",

  "Robotics",

] as const;

/* ===========================================================
   Recommended Use Cases
=========================================================== */

export const TechnologyUseCases = [

  "Major Project",

  "Minor Project",

  "Internship Report",

  "Seminar Report",

  "Research Paper",

  "Technical Documentation",

  "Lab Manual",

  "Final Year Project",

  "Industrial Training",

  "Capstone Project",

] as const;

/* ===========================================================
   Supported Fields
=========================================================== */

export const SupportedFields = [

  "Computer Science",

  "Information Technology",

  "Artificial Intelligence",

  "Machine Learning",

  "Cyber Security",

  "Cloud Computing",

  "Data Science",

  "Electronics",

  "Electrical",

  "Mechanical",

  "Civil",

] as const;

/* ===========================================================
   Supported Degrees
=========================================================== */

export const SupportedDegrees = [

  "B.Tech",

  "M.Tech",

  "BCA",

  "MCA",

  "Diploma",

  "Polytechnic",

  "B.Sc",

  "M.Sc",

] as const;


/* ===========================================================
   Technology Theme Collection
   Part - 2 (Premium Technology Themes)
   Version : 1.0
=========================================================== */

/* ===========================================================
   AI Future
=========================================================== */

export const AIFutureTheme = createTheme({

  ...TechnologyBaseTheme,

  id: "ai-future",

  name: "AI Future",

  variant: "modern",

  palette: {

    ...TechnologyBaseTheme.palette,

    primary: "#4F46E5",

    secondary: "#6366F1",

    accent: "#A78BFA",

  },

});

/* ===========================================================
   Cyber Security
=========================================================== */

export const CyberSecurityTheme = createTheme({

  ...TechnologyBaseTheme,

  id: "cyber-security",

  name: "Cyber Security",

  variant: "dark",

  palette: {

    ...TechnologyBaseTheme.palette,

    primary: "#0F172A",

    secondary: "#1E293B",

    accent: "#22D3EE",

  },

});

/* ===========================================================
   Cloud Computing
=========================================================== */

export const CloudComputingTheme = createTheme({

  ...TechnologyBaseTheme,

  id: "cloud-computing",

  name: "Cloud Computing",

  variant: "glass",

  palette: {

    ...TechnologyBaseTheme.palette,

    primary: "#0284C7",

    secondary: "#38BDF8",

    accent: "#BAE6FD",

  },

});

/* ===========================================================
   Software Engineering
=========================================================== */

export const SoftwareEngineeringTheme = createTheme({

  ...TechnologyBaseTheme,

  id: "software-engineering",

  name: "Software Engineering",

  variant: "professional",

  typography: {

    ...TechnologyBaseTheme.typography,

    headingFont: "Poppins",

    bodyFont: "Inter",

  },

  palette: {

    ...TechnologyBaseTheme.palette,

    primary: "#1E40AF",

    secondary: "#2563EB",

    accent: "#60A5FA",

  },

});

/* ===========================================================
   Full Stack Developer
=========================================================== */

export const FullStackTheme = createTheme({

  ...TechnologyBaseTheme,

  id: "full-stack",

  name: "Full Stack Developer",

  variant: "modern",

  palette: {

    ...TechnologyBaseTheme.palette,

    primary: "#7C3AED",

    secondary: "#8B5CF6",

    accent: "#C4B5FD",

  },

});

/* ===========================================================
   Registry Update
=========================================================== */

TechnologyThemes.push(

  AIFutureTheme,

  CyberSecurityTheme,

  CloudComputingTheme,

  SoftwareEngineeringTheme,

  FullStackTheme,

);


/* ===========================================================
   Technology Theme Collection
   Part - 3 (Professional Themes & Registry)
   Version : 1.0
=========================================================== */

/* ===========================================================
   Data Science
=========================================================== */

export const DataScienceTheme = createTheme({

  ...TechnologyBaseTheme,

  id: "data-science",

  name: "Data Science",

  variant: "professional",

  palette: {

    ...TechnologyBaseTheme.palette,

    primary: "#0F766E",

    secondary: "#14B8A6",

    accent: "#5EEAD4",

  },

});

/* ===========================================================
   Networking Pro
=========================================================== */

export const NetworkingProTheme = createTheme({

  ...TechnologyBaseTheme,

  id: "networking-pro",

  name: "Networking Pro",

  variant: "modern",

  palette: {

    ...TechnologyBaseTheme.palette,

    primary: "#1D4ED8",

    secondary: "#3B82F6",

    accent: "#93C5FD",

  },

});

/* ===========================================================
   Robotics
=========================================================== */

export const RoboticsTheme = createTheme({

  ...TechnologyBaseTheme,

  id: "robotics",

  name: "Robotics",

  variant: "glass",

  palette: {

    ...TechnologyBaseTheme.palette,

    primary: "#7C3AED",

    secondary: "#A855F7",

    accent: "#DDD6FE",

  },

});

/* ===========================================================
   Electronics
=========================================================== */

export const ElectronicsTheme = createTheme({

  ...TechnologyBaseTheme,

  id: "electronics",

  name: "Electronics",

  variant: "minimal",

  palette: {

    ...TechnologyBaseTheme.palette,

    primary: "#EA580C",

    secondary: "#FB923C",

    accent: "#FED7AA",

  },

});

/* ===========================================================
   Quantum Tech
=========================================================== */

export const QuantumTechTheme = createTheme({

  ...TechnologyBaseTheme,

  id: "quantum-tech",

  name: "Quantum Tech",

  variant: "premium",

  palette: {

    ...TechnologyBaseTheme.palette,

    primary: "#312E81",

    secondary: "#4338CA",

    accent: "#A5B4FC",

  },

});

/* ===========================================================
   Registry Update
=========================================================== */

TechnologyThemes.push(

  DataScienceTheme,

  NetworkingProTheme,

  RoboticsTheme,

  ElectronicsTheme,

  QuantumTechTheme,

);

/* ===========================================================
   Theme APIs
=========================================================== */

export function getTechnologyTheme(

  id: TechnologyThemeId

): ThemeConfiguration {

  return (

    TechnologyThemes.find(

      theme => theme.id === id

    ) ?? TechnologyBaseTheme

  );

}

export function getTechnologyThemes(): ThemeConfiguration[] {

  return TechnologyThemes;

}

export function searchTechnologyThemes(

  keyword: string

): ThemeConfiguration[] {

  const query = keyword.toLowerCase();

  return TechnologyThemes.filter(

    theme =>

      theme.name

        .toLowerCase()

        .includes(query)

  );

}

/* ===========================================================
   Recommendation API
=========================================================== */

export function getTechnologyThemesByUseCase(

  useCase: string

): ThemeConfiguration[] {

  const value = useCase.toLowerCase();

  if (value.includes("ai")) {

    return [AIFutureTheme];

  }

  if (value.includes("cyber")) {

    return [CyberSecurityTheme];

  }

  if (value.includes("cloud")) {

    return [CloudComputingTheme];

  }

  if (value.includes("software")) {

    return [SoftwareEngineeringTheme];

  }

  if (value.includes("data")) {

    return [DataScienceTheme];

  }

  if (value.includes("network")) {

    return [NetworkingProTheme];

  }

  if (value.includes("robot")) {

    return [RoboticsTheme];

  }

  if (value.includes("electronic")) {

    return [ElectronicsTheme];

  }

  return TechnologyThemes;

}

/* ===========================================================
   Default Theme
=========================================================== */

export const DEFAULT_TECHNOLOGY_THEME =

  AIFutureTheme;

/* ===========================================================
   Registry
=========================================================== */

export const TECHNOLOGY_THEME_REGISTRY = {

  category: "technology",

  version: "1.0.0",

  totalThemes: TechnologyThemes.length,

  defaultTheme: DEFAULT_TECHNOLOGY_THEME,

  themes: TechnologyThemes,

} as const;