/* ===========================================================
   DocSprintHub
   School Theme Collection
   Part - 1 (Foundation)
   Version : 1.0
=========================================================== */

import {

  createTheme,

  type ThemeConfiguration,

} from "./base";

/* ===========================================================
   School Theme IDs
=========================================================== */

export type SchoolThemeId =

  | "school-project"

  | "classic-school"

  | "colorful-school"

  | "science-project"

  | "mathematics-project"

  | "holiday-homework"

  | "smart-classroom"

  | "notebook-style"

  | "kids-creative"

  | "modern-education"

  | "teacher-edition";

/* ===========================================================
   School Base Theme
=========================================================== */

export const SchoolBaseTheme = createTheme({

  id: "classic-school",

  name: "School Base",

  mode: "light",

  variant: "modern",

  status: "stable",

  palette: {

    primary: "#2563EB",

    secondary: "#3B82F6",

    accent: "#60A5FA",

    success: "#16A34A",

    warning: "#F59E0B",

    danger: "#DC2626",

    text: "#111827",

    muted: "#6B7280",

    border: "#D1D5DB",

    background: "#FFFFFF",

  },

  typography: {

    headingFont: "Poppins",

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

export const SchoolThemes: ThemeConfiguration[] = [

  SchoolBaseTheme,

];

/* ===========================================================
   Category Metadata
=========================================================== */

export const SchoolThemeCollection = {

  id: "school",

  name: "School",

  description:

    "School cover page themes for assignments, projects, practical files and holiday homework.",

  totalThemes: 10,

};

/* ===========================================================
   Theme Categories
=========================================================== */

export const SchoolCategories = [

  "Assignment",

  "Project",

  "Practical",

  "Homework",

  "Teacher",

] as const;

/* ===========================================================
   Recommended Use Cases
=========================================================== */

export const SchoolUseCases = [

  "Science Project",

  "Mathematics Project",

  "Social Science Project",

  "English Project",

  "Hindi Project",

  "Holiday Homework",

  "Practical File",

  "Assignment",

  "Activity File",

  "Teacher Notes",

] as const;

/* ===========================================================
   Supported Classes
=========================================================== */

export const SupportedClasses = [

  "Class 1-5",

  "Class 6-8",

  "Class 9-10",

  "Class 11-12",

] as const;

/* ===========================================================
   Supported Boards
=========================================================== */

export const SupportedBoards = [

  "CBSE",

  "ICSE",

  "State Board",

  "IB",

  "Cambridge",

] as const;

/* ===========================================================
   School Theme Collection
   Part - 2 (Premium School Themes)
   Version : 1.0
=========================================================== */

/* ===========================================================
   Classic School
=========================================================== */

export const ClassicSchoolTheme = createTheme({

  ...SchoolBaseTheme,

  id: "classic-school",

  name: "Classic School",

});

/* ===========================================================
   Colorful School
=========================================================== */

export const ColorfulSchoolTheme = createTheme({

  ...SchoolBaseTheme,

  id: "colorful-school",

  name: "Colorful School",

  palette: {

    ...SchoolBaseTheme.palette,

    primary: "#EC4899",

    secondary: "#8B5CF6",

    accent: "#F59E0B",

  },

});

/* ===========================================================
   Science Project
=========================================================== */

export const ScienceProjectTheme = createTheme({

  ...SchoolBaseTheme,

  id: "science-project",

  name: "Science Project",

  variant: "modern",

  palette: {

    ...SchoolBaseTheme.palette,

    primary: "#0F766E",

    secondary: "#14B8A6",

    accent: "#5EEAD4",

  },

});

/* ===========================================================
   Mathematics Project
=========================================================== */

export const MathematicsProjectTheme = createTheme({

  ...SchoolBaseTheme,

  id: "mathematics-project",

  name: "Mathematics Project",

  variant: "minimal",

  palette: {

    ...SchoolBaseTheme.palette,

    primary: "#4338CA",

    secondary: "#6366F1",

    accent: "#A5B4FC",

  },

  typography: {

    ...SchoolBaseTheme.typography,

    headingFont: "Poppins",

    bodyFont: "Inter",

  },

});

/* ===========================================================
   Holiday Homework
=========================================================== */

export const HolidayHomeworkTheme = createTheme({

  ...SchoolBaseTheme,

  id: "holiday-homework",

  name: "Holiday Homework",

  variant: "creative",

  palette: {

    ...SchoolBaseTheme.palette,

    primary: "#F97316",

    secondary: "#FB923C",

    accent: "#FDBA74",

  },

});

/* ===========================================================
   Registry Update
=========================================================== */

SchoolThemes.push(

  ClassicSchoolTheme,

  ColorfulSchoolTheme,

  ScienceProjectTheme,

  MathematicsProjectTheme,

  HolidayHomeworkTheme,

);


/* ===========================================================
   School Theme Collection
   Part - 3 (Professional Themes & Registry)
   Version : 1.0
=========================================================== */

/* ===========================================================
   Smart Classroom
=========================================================== */

export const SmartClassroomTheme = createTheme({

  ...SchoolBaseTheme,

  id: "smart-classroom",

  name: "Smart Classroom",

  variant: "modern",

  palette: {

    ...SchoolBaseTheme.palette,

    primary: "#0284C7",

    secondary: "#0EA5E9",

    accent: "#7DD3FC",

  },

});

/* ===========================================================
   Notebook Style
=========================================================== */

export const NotebookStyleTheme = createTheme({

  ...SchoolBaseTheme,

  id: "notebook-style",

  name: "Notebook Style",

  variant: "classic",

  typography: {

    ...SchoolBaseTheme.typography,

    headingFont: "Merriweather",

    bodyFont: "Inter",

  },

});

/* ===========================================================
   Kids Creative
=========================================================== */

export const KidsCreativeTheme = createTheme({

  ...SchoolBaseTheme,

  id: "kids-creative",

  name: "Kids Creative",

  variant: "creative",

  palette: {

    ...SchoolBaseTheme.palette,

    primary: "#EC4899",

    secondary: "#8B5CF6",

    accent: "#FACC15",

  },

});

/* ===========================================================
   Modern Education
=========================================================== */

export const ModernEducationTheme = createTheme({

  ...SchoolBaseTheme,

  id: "modern-education",

  name: "Modern Education",

  variant: "glass",

  palette: {

    ...SchoolBaseTheme.palette,

    primary: "#2563EB",

    secondary: "#3B82F6",

    accent: "#93C5FD",

  },

});

/* ===========================================================
   Teacher Edition
=========================================================== */

export const TeacherEditionTheme = createTheme({

  ...SchoolBaseTheme,

  id: "teacher-edition",

  name: "Teacher Edition",

  variant: "premium",

  palette: {

    ...SchoolBaseTheme.palette,

    primary: "#1E293B",

    secondary: "#334155",

    accent: "#64748B",

  },

});

/* Gallery template: playful, print-safe science composition */
export const SchoolProjectGalleryTheme = createTheme({

  ...SchoolBaseTheme,

  id: "school-project",

  name: "School Project",

  variant: "creative",

  layoutId: "creative01",

  backgroundId: "green-nature",

  decorationIds: [
    "circle-pattern",
    "dots",
  ],

  palette: {

    ...SchoolBaseTheme.palette,

    primary: "#0F766E",

    secondary: "#14B8A6",

    accent: "#F59E0B",

  },

});

/* ===========================================================
   Registry Update
=========================================================== */

SchoolThemes.push(

  SmartClassroomTheme,

  NotebookStyleTheme,

  KidsCreativeTheme,

  ModernEducationTheme,

  TeacherEditionTheme,

  SchoolProjectGalleryTheme,

);

/* ===========================================================
   Theme APIs
=========================================================== */

export function getSchoolTheme(

  id: SchoolThemeId

): ThemeConfiguration {

  return (

    SchoolThemes.find(

      theme => theme.id === id

    ) ?? SchoolBaseTheme

  );

}

export function getSchoolThemes(): ThemeConfiguration[] {

  return SchoolThemes;

}

export function searchSchoolThemes(

  keyword: string

): ThemeConfiguration[] {

  const query = keyword.toLowerCase();

  return SchoolThemes.filter(

    theme =>

      theme.name

        .toLowerCase()

        .includes(query)

  );

}

/* ===========================================================
   Recommendation API
=========================================================== */

export function getSchoolThemesByUseCase(

  useCase: string

): ThemeConfiguration[] {

  const value = useCase.toLowerCase();

  if (value.includes("science")) {

    return [ScienceProjectTheme];

  }

  if (value.includes("math")) {

    return [MathematicsProjectTheme];

  }

  if (value.includes("holiday")) {

    return [HolidayHomeworkTheme];

  }

  if (value.includes("teacher")) {

    return [TeacherEditionTheme];

  }

  if (value.includes("assignment")) {

    return [

      ClassicSchoolTheme,

      NotebookStyleTheme,

    ];

  }

  return SchoolThemes;

}

/* ===========================================================
   Default Theme
=========================================================== */

export const DEFAULT_SCHOOL_THEME =

  ClassicSchoolTheme;

/* ===========================================================
   Registry
=========================================================== */

export const SCHOOL_THEME_REGISTRY = {

  category: "school",

  version: "1.0.0",

  totalThemes: SchoolThemes.length,

  defaultTheme: DEFAULT_SCHOOL_THEME,

  themes: SchoolThemes,

} as const;
