/* ===========================================================
   DocSprintHub
   Universal Content Engine
   Part - 1 (Foundation)
   Version : 2.0
=========================================================== */

/* ===========================================================
   Language
=========================================================== */

export type LanguageCode =
  | "en"
  | "hi"
  | "auto";

/* ===========================================================
   Content Type
=========================================================== */

export type ContentType =

  | "text"

  | "textarea"

  | "number"

  | "date"

  | "email"

  | "phone"

  | "url"

  | "image"

  | "logo"

  | "qr";

/* ===========================================================
   Validation
=========================================================== */

export interface ValidationRule {

  required?: boolean;

  minLength?: number;

  maxLength?: number;

  min?: number;

  max?: number;

  pattern?: string;

}

/* ===========================================================
   Label
=========================================================== */

export interface LocalizedLabel {

  en: string;

  hi?: string;

}

/* ===========================================================
   Placeholder
=========================================================== */

export interface LocalizedPlaceholder {

  en: string;

  hi?: string;

}

/* ===========================================================
   Generic Field
=========================================================== */

export interface ContentField {

  id: string;

  key: string;

  type: ContentType;

  label: LocalizedLabel;

  placeholder?: LocalizedPlaceholder;

  defaultValue?: unknown;

  validation?: ValidationRule;

  hidden?: boolean;

  readonly?: boolean;

}

/* ===========================================================
   Institute
=========================================================== */

export interface InstituteInfo {

  name: string;

  department?: string;

  address?: string;

  city?: string;

  state?: string;

  country?: string;

  website?: string;

  email?: string;

  phone?: string;

  logo?: string;

}

/* ===========================================================
   Student
=========================================================== */

export interface StudentInfo {

  name: string;

  rollNumber?: string;

  enrollmentNumber?: string;

  registrationNumber?: string;

  className?: string;

  section?: string;

  semester?: string;

  branch?: string;

  session?: string;

}

/* ===========================================================
   Guide
=========================================================== */

export interface GuideInfo {

  name: string;

  designation?: string;

  department?: string;

}

/* ===========================================================
   Project
=========================================================== */

export interface ProjectInfo {

  title: string;

  subtitle?: string;

  subject?: string;

  projectType?: string;

}

/* ===========================================================
   Universal Content
=========================================================== */

export interface DocumentContent {

  language: LanguageCode;

  institute: InstituteInfo;

  student: StudentInfo;

  guide?: GuideInfo;

  project: ProjectInfo;

}


/* ===========================================================
   Universal Content Engine
   Part - 2 (Advanced Content Models)
   Version : 2.0
=========================================================== */

/* ===========================================================
   Company
=========================================================== */

export interface CompanyInfo {

  name: string;

  department?: string;

  designation?: string;

  address?: string;

  website?: string;

  email?: string;

  phone?: string;

  logo?: string;

}

/* ===========================================================
   Certificate
=========================================================== */

export interface CertificateInfo {

  certificateNumber?: string;

  issueDate?: string;

  validUntil?: string;

}

/* ===========================================================
   Author
=========================================================== */

export interface AuthorInfo {

  name: string;

  designation?: string;

  organization?: string;

}

/* ===========================================================
   Signature
=========================================================== */

export interface SignatureInfo {

  name: string;

  designation?: string;

  image?: string;

}

/* ===========================================================
   QR
=========================================================== */

export interface QRContent {

  enabled: boolean;

  value?: string;

}

/* ===========================================================
   Photo
=========================================================== */

export interface PhotoContent {

  enabled: boolean;

  image?: string;

}

/* ===========================================================
   Header
=========================================================== */

export interface HeaderContent {

  title?: string;

  subtitle?: string;

  logo?: string;

}

/* ===========================================================
   Footer
=========================================================== */

export interface FooterContent {

  text?: string;

  website?: string;

  email?: string;

}

/* ===========================================================
   Contact
=========================================================== */

export interface ContactInfo {

  phone?: string;

  email?: string;

  website?: string;

  address?: string;

}

/* ===========================================================
   Dynamic Field
=========================================================== */

export interface DynamicField {

  id: string;

  label: string;

  value?: unknown;

  type: ContentType;

}

/* ===========================================================
   Metadata
=========================================================== */

export interface ContentMetadata {

  createdAt?: string;

  updatedAt?: string;

  version?: string;

  author?: string;

}

/* ===========================================================
   Universal Document Content
=========================================================== */

export interface UniversalContent extends DocumentContent {

  company?: CompanyInfo;

  certificate?: CertificateInfo;

  author?: AuthorInfo;

  contact?: ContactInfo;

  qr?: QRContent;

  photo?: PhotoContent;

  header?: HeaderContent;

  footer?: FooterContent;

  signatures?: SignatureInfo[];

  metadata?: ContentMetadata;

  customFields?: DynamicField[];

}



/* ===========================================================
   Universal Content Engine
   Part - 3 (Factory, Registry & Utilities)
   Version : 2.0
=========================================================== */

export interface ContentRegistry {

  fields: ContentField[];

  metadata?: ContentMetadata;

}

/* ===========================================================
   Content Builder
=========================================================== */

export interface ContentBuilder {

  language?: LanguageCode;

  institute?: Partial<InstituteInfo>;

  student?: Partial<StudentInfo>;

  guide?: Partial<GuideInfo>;

  project?: Partial<ProjectInfo>;

  company?: Partial<CompanyInfo>;

  certificate?: Partial<CertificateInfo>;

  author?: Partial<AuthorInfo>;

  contact?: Partial<ContactInfo>;

  qr?: Partial<QRContent>;

  photo?: Partial<PhotoContent>;

  header?: Partial<HeaderContent>;

  footer?: Partial<FooterContent>;

  signatures?: SignatureInfo[];

  metadata?: Partial<ContentMetadata>;

  customFields?: DynamicField[];

}

/* ===========================================================
   Default Objects
=========================================================== */

export const DEFAULT_CONTENT: UniversalContent = {

  language: "en",

  institute: {
    name: "",
  },

  student: {
    name: "",
  },

  project: {
    title: "",
  },

  qr: {
    enabled: false,
  },

  photo: {
    enabled: false,
  },

  customFields: [],

};

/* ===========================================================
   Factory
=========================================================== */

export function createContent(
  builder: ContentBuilder = {}
): UniversalContent {

  return {

    ...DEFAULT_CONTENT,

    language:
      builder.language ??
      DEFAULT_CONTENT.language,

    institute: {
      ...DEFAULT_CONTENT.institute,
      ...builder.institute,
    },

    student: {
      ...DEFAULT_CONTENT.student,
      ...builder.student,
    },

    guide: builder.guide ? { name: "", ...builder.guide } : undefined,

    project: {
      ...DEFAULT_CONTENT.project,
      ...builder.project,
    },

    company: builder.company ? { name: "", ...builder.company } : undefined,

    certificate: builder.certificate,

    author: builder.author ? { name: "", ...builder.author } : undefined,

    contact: builder.contact,

    qr: {
      ...builder.qr,
      enabled: builder.qr?.enabled ?? DEFAULT_CONTENT.qr?.enabled ?? false,
    },

    photo: {
      ...builder.photo,
      enabled: builder.photo?.enabled ?? DEFAULT_CONTENT.photo?.enabled ?? false,
    },

    header: builder.header,

    footer: builder.footer,

    signatures:
      builder.signatures ?? [],

    metadata: builder.metadata,

    customFields:
      builder.customFields ?? [],

  };

}

/* ===========================================================
   Clone
=========================================================== */

export function cloneContent(
  content: UniversalContent
): UniversalContent {

  return structuredClone(content);

}

/* ===========================================================
   Merge
=========================================================== */

export function mergeContent(
  base: UniversalContent,
  update: Partial<UniversalContent>
): UniversalContent {

  return {

    ...base,

    ...update,

    institute: {
      ...base.institute,
      ...update.institute,
    },

    student: {
      ...base.student,
      ...update.student,
    },

    project: {
      ...base.project,
      ...update.project,
    },

    qr: base.qr || update.qr ? {
      ...base.qr,
      ...update.qr,
      enabled: update.qr?.enabled ?? base.qr?.enabled ?? false,
    } : undefined,

    photo: base.photo || update.photo ? {
      ...base.photo,
      ...update.photo,
      enabled: update.photo?.enabled ?? base.photo?.enabled ?? false,
    } : undefined,

    customFields:
      update.customFields ??
      base.customFields,

  };

}

/* ===========================================================
   Validation
=========================================================== */

export interface ContentValidationError {

  field: string;

  message: string;

}

export interface ContentValidationResult {

  valid: boolean;

  errors: ContentValidationError[];

}

export function validateContent(
  content: UniversalContent
): ContentValidationResult {

  const errors: ContentValidationError[] = [];

  if (!content.institute.name.trim()) {

    errors.push({
      field: "institute.name",
      message: "Institute name is required.",
    });

  }

  if (!content.student.name.trim()) {

    errors.push({
      field: "student.name",
      message: "Student name is required.",
    });

  }

  if (!content.project.title.trim()) {

    errors.push({
      field: "project.title",
      message: "Project title is required.",
    });

  }

  return {

    valid: errors.length === 0,

    errors,

  };

}

/* ===========================================================
   Search
=========================================================== */

export function findCustomField(

  fields: DynamicField[],

  id: string

): DynamicField | undefined {

  return fields.find(
    (field) => field.id === id
  );

}

/* ===========================================================
   Registry
=========================================================== */

export const CONTENT_REGISTRY: ContentRegistry = {

  fields: [],

};

/* ===========================================================
   Language Helper
=========================================================== */

export function getLabel(

  label: LocalizedLabel,

  language: LanguageCode

): string {

  if (language === "hi") {

    return label.hi ?? label.en;

  }

  return label.en;

}
