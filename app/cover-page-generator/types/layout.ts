/* ===========================================================
   DocSprintHub Cover Page Generator
   Layout Engine
   Part - 1 (Foundation)
   Version : 2.0
=========================================================== */

/* ===========================================================
   Basic Units
=========================================================== */

export type Unit =
  | "px"
  | "%"
  | "mm"
  | "cm"
  | "rem";

/* ===========================================================
   Position
=========================================================== */

export interface Position {

  x: number;

  y: number;

  unit?: Unit;

}

/* ===========================================================
   Size
=========================================================== */

export interface Size {

  width: number;

  height: number;

  unit?: Unit;

}

/* ===========================================================
   Rotation
=========================================================== */

export interface Rotation {

  angle: number;

}

/* ===========================================================
   Scale
=========================================================== */

export interface Scale {

  x: number;

  y: number;

}

/* ===========================================================
   Opacity
=========================================================== */

export interface Opacity {

  value: number;

}

/* ===========================================================
   Layer
=========================================================== */

export interface Layer {

  id: string;

  name: string;

  visible: boolean;

  locked: boolean;

  zIndex: number;

}

/* ===========================================================
   Margin
=========================================================== */

export interface Margin {

  top: number;

  right: number;

  bottom: number;

  left: number;

}

/* ===========================================================
   Padding
=========================================================== */

export interface Padding {

  top: number;

  right: number;

  bottom: number;

  left: number;

}

/* ===========================================================
   Border Radius
=========================================================== */

export interface Radius {

  topLeft: number;

  topRight: number;

  bottomLeft: number;

  bottomRight: number;

}

/* ===========================================================
   Alignment
=========================================================== */

export type HorizontalAlignment =

  | "left"

  | "center"

  | "right";

export type VerticalAlignment =

  | "top"

  | "center"

  | "bottom";

export interface Alignment {

  horizontal: HorizontalAlignment;

  vertical: VerticalAlignment;

}

/* ===========================================================
   Anchor
=========================================================== */

export type Anchor =

  | "top-left"

  | "top-center"

  | "top-right"

  | "center-left"

  | "center"

  | "center-right"

  | "bottom-left"

  | "bottom-center"

  | "bottom-right";

/* ===========================================================
   Grid
=========================================================== */

export interface Grid {

  enabled: boolean;

  columns: number;

  rows: number;

  gap: number;

  snap: boolean;

}

/* ===========================================================
   Safe Area
=========================================================== */

export interface SafeArea {

  enabled: boolean;

  top: number;

  right: number;

  bottom: number;

  left: number;

}

/* ===========================================================
   Bleed
=========================================================== */

export interface Bleed {

  enabled: boolean;

  value: number;

}

/* ===========================================================
   Common Layout Properties
=========================================================== */

export interface LayoutProps {

  id: string;

  name: string;

  position: Position;

  size: Size;

  rotation?: Rotation;

  scale?: Scale;

  opacity?: Opacity;

  margin?: Margin;

  padding?: Padding;

  radius?: Radius;

  alignment?: Alignment;

  anchor?: Anchor;

  layer?: Layer;

}

/* ===========================================================
   Section Types
=========================================================== */

export type SectionType =

  | "header"

  | "footer"

  | "body"

  | "sidebar"

  | "logo"

  | "title"

  | "subtitle"

  | "content"

  | "photo"

  | "qr"

  | "watermark";

/* ===========================================================
   Section
=========================================================== */

export interface LayoutSection {

  id: string;

  type: SectionType;

  title: string;

  props: LayoutProps;

}

/* ===========================================================
   Canvas Layout
=========================================================== */

export interface PageLayout {

  width: number;

  height: number;

  margin: Margin;

  safeArea: SafeArea;

  bleed: Bleed;

  grid: Grid;

  sections: LayoutSection[];

}

/* ===========================================================
   Default Constants
=========================================================== */

export const DEFAULT_MARGIN: Margin = {

  top: 40,

  right: 40,

  bottom: 40,

  left: 40,

};

export const DEFAULT_GRID: Grid = {

  enabled: false,

  columns: 12,

  rows: 12,

  gap: 16,

  snap: true,

};

export const DEFAULT_SAFE_AREA: SafeArea = {

  enabled: true,

  top: 20,

  right: 20,

  bottom: 20,

  left: 20,

};

export const DEFAULT_BLEED: Bleed = {

  enabled: false,

  value: 0,

};




/* ===========================================================
   Layout Engine
   Part - 2 (Visual Objects & Components)
=========================================================== */

/* ===========================================================
   Background
=========================================================== */

export type BackgroundType =
  | "solid"
  | "gradient"
  | "image"
  | "pattern"
  | "mesh";

export interface BackgroundLayer {

  id: string;

  type: BackgroundType;

  visible: boolean;

  color?: string;

  image?: string;

  opacity: number;

}

/* ===========================================================
   Shape Types
=========================================================== */

export type ShapeType =

  | "rectangle"

  | "rounded-rectangle"

  | "circle"

  | "ellipse"

  | "triangle"

  | "polygon"

  | "hexagon"

  | "diamond"

  | "wave"

  | "blob"

  | "line"

  | "arc";

/* ===========================================================
   Shape Object
=========================================================== */

export interface ShapeObject {

  id: string;

  type: ShapeType;

  props: LayoutProps;

  fill: string;

  stroke?: string;

  strokeWidth?: number;

}

/* ===========================================================
   Divider
=========================================================== */

export interface DividerObject {

  id: string;

  props: LayoutProps;

  color: string;

  thickness: number;

}

/* ===========================================================
   Logo
=========================================================== */

export interface LogoObject {

  id: string;

  props: LayoutProps;

  required: boolean;

  circle: boolean;

  shadow: boolean;

}

/* ===========================================================
   Student Photo
=========================================================== */

export interface PhotoObject {

  id: string;

  props: LayoutProps;

  rounded: boolean;

  border: boolean;

  shadow: boolean;

}

/* ===========================================================
   QR
=========================================================== */

export interface QRObject {

  id: string;

  props: LayoutProps;

  size: number;

  enabled: boolean;

}

/* ===========================================================
   Text
=========================================================== */

export type TextRole =

  | "title"

  | "subtitle"

  | "heading"

  | "subheading"

  | "body"

  | "footer"

  | "caption";

export interface TextObject {

  id: string;

  role: TextRole;

  props: LayoutProps;

  maxLines: number;

}

/* ===========================================================
   Watermark
=========================================================== */

export interface WatermarkObject {

  id: string;

  props: LayoutProps;

  opacity: number;

  rotation: number;

}

/* ===========================================================
   Decorative Objects
=========================================================== */

export interface DecorativeObject {

  id: string;

  props: LayoutProps;

  shape: ShapeType;

}

/* ===========================================================
   Layer Group
=========================================================== */

export interface LayerGroup {

  id: string;

  name: string;

  visible: boolean;

  locked: boolean;

  layers: string[];

}

/* ===========================================================
   Constraints
=========================================================== */

export interface LayoutConstraint {

  lockAspectRatio: boolean;

  keepInsidePage: boolean;

  snapToGrid: boolean;

  snapToSafeArea: boolean;

}

/* ===========================================================
   Complete Layout
=========================================================== */

export interface TemplateLayout {

  page: PageLayout;

  background: BackgroundLayer[];

  shapes: ShapeObject[];

  dividers: DividerObject[];

  logos: LogoObject[];

  photos: PhotoObject[];

  qrs: QRObject[];

  texts: TextObject[];

  watermarks: WatermarkObject[];

  decorations: DecorativeObject[];

  groups: LayerGroup[];

  constraints: LayoutConstraint;

}



/* ===========================================================
   Layout Engine
   Part - 3 (Utilities, Validation & Factory)
   Version : 2.0
=========================================================== */

/* ===========================================================
   Bounding Box
=========================================================== */

export interface BoundingBox {
  left: number;
  top: number;
  right: number;
  bottom: number;
}

/* ===========================================================
   Viewport
=========================================================== */

export interface Viewport {
  width: number;
  height: number;
  zoom: number;
}

/* ===========================================================
   Responsive Scale
=========================================================== */

export interface ResponsiveScale {
  minZoom: number;
  maxZoom: number;
  fitToPage: boolean;
  keepAspectRatio: boolean;
}

/* ===========================================================
   Layout Validation
=========================================================== */

export interface LayoutValidationError {
  id: string;
  message: string;
}

export interface LayoutValidationResult {
  valid: boolean;
  errors: LayoutValidationError[];
}

/* ===========================================================
   Selection
=========================================================== */

export interface LayoutSelection {
  ids: string[];
  multiple: boolean;
}

/* ===========================================================
   Snap Guide
=========================================================== */

export interface SnapGuide {
  x?: number;
  y?: number;
  enabled: boolean;
}

/* ===========================================================
   History
=========================================================== */

export interface LayoutHistory {
  undo: number;
  redo: number;
}

/* ===========================================================
   Layout State
=========================================================== */

export interface LayoutState {
  viewport: Viewport;
  selection: LayoutSelection;
  history: LayoutHistory;
}

/* ===========================================================
   Factory
=========================================================== */

export function createPosition(
  x = 0,
  y = 0
): Position {
  return { x, y, unit: "px" };
}

export function createSize(
  width = 100,
  height = 100
): Size {
  return { width, height, unit: "px" };
}

export function createMargin(
  value = 40
): Margin {
  return {
    top: value,
    right: value,
    bottom: value,
    left: value,
  };
}

export function createPadding(
  value = 0
): Padding {
  return {
    top: value,
    right: value,
    bottom: value,
    left: value,
  };
}

/* ===========================================================
   Helpers
=========================================================== */

export function cloneLayout(
  layout: TemplateLayout
): TemplateLayout {
  return structuredClone(layout);
}

export function calculateCenter(
  width: number,
  height: number
): Position {
  return {
    x: width / 2,
    y: height / 2,
    unit: "px",
  };
}

export function isInsidePage(
  position: Position,
  page: PageLayout
): boolean {
  return (
    position.x >= 0 &&
    position.y >= 0 &&
    position.x <= page.width &&
    position.y <= page.height
  );
}

export function createBoundingBox(
  position: Position,
  size: Size
): BoundingBox {
  return {
    left: position.x,
    top: position.y,
    right: position.x + size.width,
    bottom: position.y + size.height,
  };
}

/* ===========================================================
   Validation
=========================================================== */

export function validateLayout(
  layout: TemplateLayout
): LayoutValidationResult {

  const errors: LayoutValidationError[] = [];

  if (layout.page.width <= 0) {
    errors.push({
      id: "page-width",
      message: "Page width must be greater than zero.",
    });
  }

  if (layout.page.height <= 0) {
    errors.push({
      id: "page-height",
      message: "Page height must be greater than zero.",
    });
  }

  return {
    valid: errors.length === 0,
    errors,
  };
}

/* ===========================================================
   Default State
=========================================================== */

export const DEFAULT_LAYOUT_STATE: LayoutState = {
  viewport: {
    width: 1200,
    height: 900,
    zoom: 1,
  },

  selection: {
    ids: [],
    multiple: false,
  },

  history: {
    undo: 0,
    redo: 0,
  },
};

export const DEFAULT_RESPONSIVE_SCALE: ResponsiveScale = {
  minZoom: 0.25,
  maxZoom: 4,
  fitToPage: true,
  keepAspectRatio: true,
};