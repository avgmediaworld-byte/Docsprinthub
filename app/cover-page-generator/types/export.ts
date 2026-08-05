/* ===========================================================
   DocSprintHub
   Universal Export Engine
   Part - 1 (Foundation)
   Version : 2.0
=========================================================== */

/* ===========================================================
   Export Format
=========================================================== */

export type ExportFormat =
  | "pdf"
  | "png"
  | "jpeg"
  | "webp"
  | "svg"
  | "print";

/* ===========================================================
   Quality
=========================================================== */

export type ExportQuality =
  | "low"
  | "medium"
  | "high"
  | "ultra";

/* ===========================================================
   Color Mode
=========================================================== */

export type ColorMode =
  | "rgb"
  | "cmyk"
  | "grayscale";

/* ===========================================================
   Compression
=========================================================== */

export type CompressionLevel =
  | "none"
  | "low"
  | "medium"
  | "high";

/* ===========================================================
   File Name
=========================================================== */

export interface ExportFile {

  name: string;

  extension: ExportFormat;

}

/* ===========================================================
   Resolution
=========================================================== */

export interface ExportResolution {

  dpi: number;

}

/* ===========================================================
   Watermark
=========================================================== */

export interface WatermarkConfig {

  enabled: boolean;

  text?: string;

  opacity?: number;

}

/* ===========================================================
   Metadata
=========================================================== */

export interface ExportMetadata {

  title?: string;

  author?: string;

  subject?: string;

  keywords?: string[];

}

/* ===========================================================
   Main Export Config
=========================================================== */

export interface ExportConfig {

  format: ExportFormat;

  quality: ExportQuality;

  colorMode: ColorMode;

  compression: CompressionLevel;

  resolution: ExportResolution;

  file: ExportFile;

  watermark?: WatermarkConfig;

  metadata?: ExportMetadata;

}


/* ===========================================================
   Universal Export Engine
   Part - 2 (Profiles, Queue & Progress)
   Version : 2.0
=========================================================== */

/* ===========================================================
   PDF Options
=========================================================== */

export interface PDFExportOptions {

  embedFonts: boolean;

  compress: boolean;

  password?: string;

  permissions?: {

    print: boolean;

    copy: boolean;

    edit: boolean;

  };

}

/* ===========================================================
   Image Options
=========================================================== */

export interface ImageExportOptions {

  transparent: boolean;

  backgroundColor?: string;

  quality: number;

}

/* ===========================================================
   Print Options
=========================================================== */

export interface PrintOptions {

  copies: number;

  duplex: boolean;

  collate: boolean;

  showMargins: boolean;

}

/* ===========================================================
   Batch Export
=========================================================== */

export interface BatchExportItem {

  id: string;

  fileName: string;

  format: ExportFormat;

}

export interface BatchExport {

  enabled: boolean;

  items: BatchExportItem[];

}

/* ===========================================================
   Progress
=========================================================== */

export interface ExportProgress {

  total: number;

  completed: number;

  percentage: number;

  status:

    | "idle"

    | "processing"

    | "completed"

    | "failed";

}

/* ===========================================================
   Queue
=========================================================== */

export interface ExportQueue {

  running: boolean;

  items: BatchExportItem[];

}

/* ===========================================================
   File Size
=========================================================== */

export interface FileSizeLimit {

  enabled: boolean;

  maxMB: number;

}

/* ===========================================================
   Export Profile
=========================================================== */

export interface ExportProfile {

  id: string;

  name: string;

  config: ExportConfig;

}

/* ===========================================================
   Cloud Export
=========================================================== */

export interface CloudExport {

  googleDrive: boolean;

  oneDrive: boolean;

  dropbox: boolean;

  localDownload: boolean;

}

/* ===========================================================
   Complete Export Engine
=========================================================== */

export interface ExportEngine {

  config: ExportConfig;

  pdf: PDFExportOptions;

  image: ImageExportOptions;

  print: PrintOptions;

  batch: BatchExport;

  queue: ExportQueue;

  progress: ExportProgress;

  cloud: CloudExport;

  fileLimit: FileSizeLimit;

}

/* ===========================================================
   Default Progress
=========================================================== */

export const DEFAULT_EXPORT_PROGRESS: ExportProgress = {

  total: 0,

  completed: 0,

  percentage: 0,

  status: "idle",

};

/* ===========================================================
   Default Queue
=========================================================== */

export const DEFAULT_EXPORT_QUEUE: ExportQueue = {

  running: false,

  items: [],

};

/* ===========================================================
   Default Print
=========================================================== */

export const DEFAULT_PRINT_OPTIONS: PrintOptions = {

  copies: 1,

  duplex: false,

  collate: true,

  showMargins: false,

};

/* ===========================================================
   Default Image
=========================================================== */

export const DEFAULT_IMAGE_OPTIONS: ImageExportOptions = {

  transparent: false,

  quality: 1,

};

/* ===========================================================
   Default PDF
=========================================================== */

export const DEFAULT_PDF_OPTIONS: PDFExportOptions = {

  embedFonts: true,

  compress: true,

  permissions: {

    print: true,

    copy: true,

    edit: false,

  },

};


/* ===========================================================
   Universal Export Engine
   Part - 3 (Factory, Registry & Utilities)
   Version : 2.0
=========================================================== */

/* ===========================================================
   Builder
=========================================================== */

export interface ExportConfigBuilder {

  format?: ExportFormat;

  quality?: ExportQuality;

  colorMode?: ColorMode;

  compression?: CompressionLevel;

  resolution?: Partial<ExportResolution>;

  file?: Partial<ExportFile>;

  watermark?: Partial<WatermarkConfig>;

  metadata?: Partial<ExportMetadata>;

}

/* ===========================================================
   Validation
=========================================================== */

export interface ExportValidationError {

  field: string;

  message: string;

}

export interface ExportValidationResult {

  valid: boolean;

  errors: ExportValidationError[];

}

/* ===========================================================
   Registry
=========================================================== */

export type ExportRegistry = Record<
  string,
  ExportProfile
>;

/* ===========================================================
   Default Config
=========================================================== */

export const DEFAULT_EXPORT_CONFIG: ExportConfig = {

  format: "pdf",

  quality: "high",

  colorMode: "rgb",

  compression: "medium",

  resolution: {

    dpi: 300,

  },

  file: {

    name: "Document",

    extension: "pdf",

  },

};

/* ===========================================================
   Factory
=========================================================== */

export function createExportConfig(

  builder: ExportConfigBuilder = {}

): ExportConfig {

  return {

    ...DEFAULT_EXPORT_CONFIG,

    format:
      builder.format ??
      DEFAULT_EXPORT_CONFIG.format,

    quality:
      builder.quality ??
      DEFAULT_EXPORT_CONFIG.quality,

    colorMode:
      builder.colorMode ??
      DEFAULT_EXPORT_CONFIG.colorMode,

    compression:
      builder.compression ??
      DEFAULT_EXPORT_CONFIG.compression,

    resolution: {

      ...DEFAULT_EXPORT_CONFIG.resolution,

      ...builder.resolution,

    },

    file: {

      ...DEFAULT_EXPORT_CONFIG.file,

      ...builder.file,

    },

    watermark: builder.watermark,

    metadata: builder.metadata,

  };

}

/* ===========================================================
   Export Engine Factory
=========================================================== */

export function createExportEngine(

  config: ExportConfig

): ExportEngine {

  return {

    config,

    pdf: DEFAULT_PDF_OPTIONS,

    image: DEFAULT_IMAGE_OPTIONS,

    print: DEFAULT_PRINT_OPTIONS,

    batch: {

      enabled: false,

      items: [],

    },

    queue: DEFAULT_EXPORT_QUEUE,

    progress: DEFAULT_EXPORT_PROGRESS,

    cloud: {

      googleDrive: false,

      oneDrive: false,

      dropbox: false,

      localDownload: true,

    },

    fileLimit: {

      enabled: false,

      maxMB: 100,

    },

  };

}

/* ===========================================================
   Clone
=========================================================== */

export function cloneExportConfig(

  config: ExportConfig

): ExportConfig {

  return structuredClone(config);

}

/* ===========================================================
   Merge
=========================================================== */

export function mergeExportConfig(

  base: ExportConfig,

  update: Partial<ExportConfig>

): ExportConfig {

  return {

    ...base,

    ...update,

    resolution: {

      ...base.resolution,

      ...update.resolution,

    },

    file: {

      ...base.file,

      ...update.file,

    },

    watermark: {

      ...base.watermark,

      ...update.watermark,

    },

    metadata: {

      ...base.metadata,

      ...update.metadata,

    },

  };

}

/* ===========================================================
   Validation
=========================================================== */

export function validateExportConfig(

  config: ExportConfig

): ExportValidationResult {

  const errors: ExportValidationError[] = [];

  if (!config.file.name.trim()) {

    errors.push({

      field: "file.name",

      message: "File name is required.",

    });

  }

  if (config.resolution.dpi <= 0) {

    errors.push({

      field: "resolution.dpi",

      message: "Invalid DPI value.",

    });

  }

  return {

    valid: errors.length === 0,

    errors,

  };

}

/* ===========================================================
   Helpers
=========================================================== */

export function getMimeType(

  format: ExportFormat

): string {

  switch (format) {

    case "pdf":

      return "application/pdf";

    case "png":

      return "image/png";

    case "jpeg":

      return "image/jpeg";

    case "webp":

      return "image/webp";

    case "svg":

      return "image/svg+xml";

    default:

      return "application/octet-stream";

  }

}

export function buildFileName(

  name: string,

  format: ExportFormat

): string {

  return `${name}.${format}`;

}

/* ===========================================================
   Built-in Profiles
=========================================================== */

export const EXPORT_PROFILES: ExportRegistry = {

  PDF: {

    id: "pdf",

    name: "PDF High Quality",

    config: createExportConfig({

      format: "pdf",

      quality: "high",

    }),

  },

  PNG: {

    id: "png",

    name: "PNG",

    config: createExportConfig({

      format: "png",

      quality: "high",

      file: {

        extension: "png",

      },

    }),

  },

  JPEG: {

    id: "jpeg",

    name: "JPEG",

    config: createExportConfig({

      format: "jpeg",

      quality: "high",

      file: {

        extension: "jpeg",

      },

    }),

  },

  WEBP: {

    id: "webp",

    name: "WebP",

    config: createExportConfig({

      format: "webp",

      quality: "high",

      file: {

        extension: "webp",

      },

    }),

  },

  PRINT: {

    id: "print",

    name: "Print",

    config: createExportConfig({

      format: "print",

      file: {

        extension: "print",

      },

    }),

  },

};