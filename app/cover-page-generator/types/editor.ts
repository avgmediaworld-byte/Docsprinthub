/* ===========================================================
   DocSprintHub Cover Page Generator
   Editor Engine
   Part - 1 (Foundation)
   Version : 2.0
=========================================================== */

import type { TemplateLayout } from "./layout";
import type { UniversalContent } from "./content";
import type { CoverTheme } from "./theme";

/* ===========================================================
   Tool
=========================================================== */

export type EditorTool =
  | "select"
  | "move"
  | "text"
  | "shape"
  | "image"
  | "logo"
  | "photo"
  | "qr"
  | "background"
  | "crop"
  | "erase"
  | "hand";

/* ===========================================================
   Mode
=========================================================== */

export type EditorMode =
  | "design"
  | "preview"
  | "print";

/* ===========================================================
   Cursor
=========================================================== */

export type CursorType =
  | "default"
  | "move"
  | "grab"
  | "grabbing"
  | "crosshair"
  | "text";

/* ===========================================================
   Zoom
=========================================================== */

export interface ZoomState {

  level: number;

  min: number;

  max: number;

  fitToScreen: boolean;

}

/* ===========================================================
   Pan
=========================================================== */

export interface PanState {

  x: number;

  y: number;

}

/* ===========================================================
   Grid
=========================================================== */

export interface GridState {

  visible: boolean;

  snap: boolean;

}

/* ===========================================================
   Guide
=========================================================== */

export interface GuideState {

  visible: boolean;

  smartGuide: boolean;

}

/* ===========================================================
   Selection
=========================================================== */

export interface SelectionState {

  ids: string[];

  activeId?: string;

}

/* ===========================================================
   Clipboard
=========================================================== */

export interface ClipboardState {

  items: string[];

}

/* ===========================================================
   History
=========================================================== */

export interface HistoryState {

  undo: number;

  redo: number;

  maxHistory: number;

}

/* ===========================================================
   View
=========================================================== */

export interface ViewState {

  ruler: boolean;

  grid: boolean;

  safeArea: boolean;

  bleed: boolean;

}

/* ===========================================================
   Inspector
=========================================================== */

export interface InspectorState {

  opened: boolean;

  activeTab: string;

}

/* ===========================================================
   Editor Preferences
=========================================================== */

export interface EditorPreferences {

  autoSave: boolean;

  autoSaveInterval: number;

  darkUI: boolean;

}

/* ===========================================================
   Main Editor
=========================================================== */

export interface EditorState {

  tool: EditorTool;

  mode: EditorMode;

  cursor: CursorType;

  zoom: ZoomState;

  pan: PanState;

  grid: GridState;

  guides: GuideState;

  selection: SelectionState;

  clipboard: ClipboardState;

  history: HistoryState;

  view: ViewState;

  inspector: InspectorState;

  preferences: EditorPreferences;

  layout: TemplateLayout;

  content: UniversalContent;

  theme: CoverTheme;

}

/* ===========================================================
   Editor Engine
   Part - 2 (Interaction & Editing)
   Version : 2.0
=========================================================== */

/* ===========================================================
   Mouse
=========================================================== */

export interface MouseState {

  x: number;

  y: number;

  pressed: boolean;

  dragging: boolean;

}

/* ===========================================================
   Keyboard
=========================================================== */

export interface KeyboardState {

  ctrl: boolean;

  shift: boolean;

  alt: boolean;

  meta: boolean;

}

/* ===========================================================
   Drag
=========================================================== */

export interface DragState {

  active: boolean;

  objectId?: string;

  startX: number;

  startY: number;

}

/* ===========================================================
   Resize
=========================================================== */

export type ResizeHandle =

  | "top"

  | "bottom"

  | "left"

  | "right"

  | "top-left"

  | "top-right"

  | "bottom-left"

  | "bottom-right";

export interface ResizeState {

  active: boolean;

  handle?: ResizeHandle;

}

/* ===========================================================
   Rotation
=========================================================== */

export interface RotationState {

  active: boolean;

  angle: number;

}

/* ===========================================================
   Alignment
=========================================================== */

export type AlignmentCommand =

  | "left"

  | "center"

  | "right"

  | "top"

  | "middle"

  | "bottom";

/* ===========================================================
   Distribution
=========================================================== */

export type DistributionCommand =

  | "horizontal"

  | "vertical";

/* ===========================================================
   Layer Operations
=========================================================== */

export interface LayerOperation {

  bringForward: boolean;

  sendBackward: boolean;

  bringToFront: boolean;

  sendToBack: boolean;

}

/* ===========================================================
   Clipboard Operations
=========================================================== */

export interface ClipboardOperation {

  copy: boolean;

  cut: boolean;

  paste: boolean;

  duplicate: boolean;

}

/* ===========================================================
   Object State
=========================================================== */

export interface ObjectState {

  locked: boolean;

  hidden: boolean;

}

/* ===========================================================
   Context Menu
=========================================================== */

export interface ContextMenuState {

  opened: boolean;

  x: number;

  y: number;

}

/* ===========================================================
   Snap
=========================================================== */

export interface SnapState {

  enabled: boolean;

  tolerance: number;

}

/* ===========================================================
   Guides
=========================================================== */

export interface SmartGuide {

  enabled: boolean;

  horizontal: number[];

  vertical: number[];

}

/* ===========================================================
   Ruler
=========================================================== */

export interface RulerState {

  visible: boolean;

  unit: "px" | "mm";

}

/* ===========================================================
   Multi Selection
=========================================================== */

export interface MultiSelectionState {

  enabled: boolean;

  ids: string[];

}

/* ===========================================================
   Editing Session
=========================================================== */

export interface EditingSession {

  mouse: MouseState;

  keyboard: KeyboardState;

  drag: DragState;

  resize: ResizeState;

  rotation: RotationState;

  snap: SnapState;

  ruler: RulerState;

  smartGuide: SmartGuide;

  multiSelection: MultiSelectionState;

  contextMenu: ContextMenuState;

}

/* ===========================================================
   Editor Engine
   Part - 3 (Factory, Commands & Utilities)
   Version : 2.0
=========================================================== */

export type EditorCommand =
  | "undo"
  | "redo"
  | "copy"
  | "cut"
  | "paste"
  | "duplicate"
  | "delete"
  | "select-all"
  | "deselect-all"
  | "zoom-in"
  | "zoom-out"
  | "fit-screen"
  | "bring-forward"
  | "send-backward"
  | "bring-front"
  | "send-back"
  | "lock"
  | "unlock"
  | "hide"
  | "show";

/* ===========================================================
   Editor Events
=========================================================== */

export interface EditorEvents {

  onSelectionChange?: () => void;

  onContentChange?: () => void;

  onLayoutChange?: () => void;

  onThemeChange?: () => void;

  onZoomChange?: () => void;

  onHistoryChange?: () => void;

}

/* ===========================================================
   Plugin
=========================================================== */

export interface EditorPlugin {

  id: string;

  name: string;

  enabled: boolean;

}

/* ===========================================================
   Autosave
=========================================================== */

export interface AutoSaveState {

  enabled: boolean;

  interval: number;

  lastSaved?: string;

}

/* ===========================================================
   Validation
=========================================================== */

export interface EditorValidationError {

  id: string;

  message: string;

}

export interface EditorValidationResult {

  valid: boolean;

  errors: EditorValidationError[];

}

/* ===========================================================
   Default Editor State
=========================================================== */

export const DEFAULT_EDITOR_STATE: Omit<
  EditorState,
  "layout" | "content" | "theme"
> = {

  tool: "select",

  mode: "design",

  cursor: "default",

  zoom: {
    level: 1,
    min: 0.25,
    max: 4,
    fitToScreen: true,
  },

  pan: {
    x: 0,
    y: 0,
  },

  grid: {
    visible: false,
    snap: true,
  },

  guides: {
    visible: true,
    smartGuide: true,
  },

  selection: {
    ids: [],
  },

  clipboard: {
    items: [],
  },

  history: {
    undo: 0,
    redo: 0,
    maxHistory: 100,
  },

  view: {
    ruler: true,
    grid: false,
    safeArea: true,
    bleed: false,
  },

  inspector: {
    opened: true,
    activeTab: "properties",
  },

  preferences: {
    autoSave: true,
    autoSaveInterval: 30,
    darkUI: false,
  },

};

/* ===========================================================
   Factory
=========================================================== */

export function createEditorState(

  layout: TemplateLayout,

  content: UniversalContent,

  theme: CoverTheme

): EditorState {

  return {

    ...DEFAULT_EDITOR_STATE,

    layout,

    content,

    theme,

  };

}

/* ===========================================================
   Helpers
=========================================================== */

export function cloneEditorState(

  state: EditorState

): EditorState {

  return structuredClone(state);

}

export function canUndo(

  state: EditorState

): boolean {

  return state.history.undo > 0;

}

export function canRedo(

  state: EditorState

): boolean {

  return state.history.redo > 0;

}

export function hasSelection(

  state: EditorState

): boolean {

  return state.selection.ids.length > 0;

}

/* ===========================================================
   Validation
=========================================================== */

export function validateEditor(

  state: EditorState

): EditorValidationResult {

  const errors: EditorValidationError[] = [];

  if (state.zoom.level < state.zoom.min) {

    errors.push({

      id: "zoom-min",

      message: "Zoom level below minimum.",

    });

  }

  if (state.zoom.level > state.zoom.max) {

    errors.push({

      id: "zoom-max",

      message: "Zoom level exceeds maximum.",

    });

  }

  return {

    valid: errors.length === 0,

    errors,

  };

}

/* ===========================================================
   Command Registry
=========================================================== */

export const EDITOR_COMMANDS: readonly EditorCommand[] = [

  "undo",

  "redo",

  "copy",

  "cut",

  "paste",

  "duplicate",

  "delete",

  "select-all",

  "deselect-all",

  "zoom-in",

  "zoom-out",

  "fit-screen",

  "bring-forward",

  "send-backward",

  "bring-front",

  "send-back",

  "lock",

  "unlock",

  "hide",

  "show",

];

/* ===========================================================
   Editor Constants
=========================================================== */

export const MAX_HISTORY = 100;

export const DEFAULT_ZOOM = 1;

export const MIN_ZOOM = 0.25;

export const MAX_ZOOM = 4;