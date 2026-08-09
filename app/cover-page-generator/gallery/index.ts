/* ===========================================================
   DocSprintHub
   Gallery Engine
   Public API
   Version : 1.0.0
=========================================================== */

/* ===========================================================
   Controller
=========================================================== */

export {
  GalleryController,
  galleryController,
} from "./controller";

export type {
  GalleryFilterOptions,
} from "./controller";

/* ===========================================================
   Future Modules
=========================================================== */

/*
export * from "./search";
export * from "./filter";
export * from "./sort";
*/

/* ===========================================================
   Version
=========================================================== */

export const GALLERY_ENGINE = {

  name: "DocSprintHub Gallery Engine",

  version: "1.0.0",

} as const;