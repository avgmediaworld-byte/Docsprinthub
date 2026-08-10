"use client";

import Image from "next/image";
import type { CSSProperties, PointerEvent as ReactPointerEvent, RefObject } from "react";
import { useRef } from "react";

export const A4_WIDTH_MM = 210;
export const A4_HEIGHT_MM = 297;

export type CoverCanvasElementType = "text" | "logo";

export interface CoverCanvasTextStyle {
  color: string;
  fontFamily: string;
  fontSize: number;
  fontStyle: "normal" | "italic";
  fontWeight: number;
  textAlign: "left" | "center" | "right";
}

export interface CoverCanvasElement {
  id: string;
  type: CoverCanvasElementType;
  label: string;
  text: string;
  x: number;
  y: number;
  width: number;
  height: number;
  style: CoverCanvasTextStyle;
}

export interface CoverPageMargins {
  top: number;
  right: number;
  bottom: number;
  left: number;
}

export const DEFAULT_SAFE_MARGINS: CoverPageMargins = {
  top: 12,
  right: 12,
  bottom: 12,
  left: 12,
};

interface CanvasColors {
  primary: string;
  accent: string;
  fontFamily: string;
}

interface CoverDataForCanvas {
  institute: string;
  title: string;
  subtitle: string;
  topic: string;
  course: string;
  author: string;
  rollNumber: string;
  guide: string;
  session: string;
}

const DEFAULT_STYLE: CoverCanvasTextStyle = {
  color: "#0f172a",
  fontFamily: "Inter, Arial, sans-serif",
  fontSize: 14,
  fontStyle: "normal",
  fontWeight: 500,
  textAlign: "center",
};

function textElement(
  id: string,
  label: string,
  text: string,
  position: Pick<CoverCanvasElement, "x" | "y" | "width" | "height">,
  style: Partial<CoverCanvasTextStyle>,
): CoverCanvasElement {
  return {
    id,
    type: "text",
    label,
    text,
    ...position,
    style: { ...DEFAULT_STYLE, ...style },
  };
}

function defaultCoordinates(templateId: string) {
  if (/corporate|premium|commerce|law|ai-future/i.test(templateId)) {
    return { logoX: 22, logoY: 22, instituteY: 33, sessionY: 47, headingY: 91, titleY: 120, courseY: 151, detailsY: 208, footerY: 266 };
  }

  if (/creative|portfolio|science|education/i.test(templateId)) {
    return { logoX: 152, logoY: 20, instituteY: 39, sessionY: 53, headingY: 94, titleY: 123, courseY: 154, detailsY: 207, footerY: 265 };
  }

  return { logoX: 87, logoY: 18, instituteY: 58, sessionY: 73, headingY: 102, titleY: 129, courseY: 158, detailsY: 210, footerY: 266 };
}

export function createTemplateCanvasElements(templateId: string, data: CoverDataForCanvas, colors: CanvasColors): CoverCanvasElement[] {
  const positions = defaultCoordinates(templateId);
  const primaryStyle = { color: colors.primary, fontFamily: colors.fontFamily };
  const textStyle = { color: colors.primary, fontFamily: colors.fontFamily };

  return [
    {
      id: "logo",
      type: "logo",
      label: "Institute logo",
      text: "",
      x: positions.logoX,
      y: positions.logoY,
      width: 36,
      height: 36,
      style: { ...DEFAULT_STYLE, ...primaryStyle },
    },
    textElement("institute", "Institute / College Name", data.institute, { x: 24, y: positions.instituteY, width: 162, height: 13 }, { ...primaryStyle, fontSize: 18, fontWeight: 800, textAlign: "center" }),
    textElement("session", "Session", data.session, { x: 45, y: positions.sessionY, width: 120, height: 9 }, { ...textStyle, fontSize: 11, fontWeight: 600, textAlign: "center" }),
    textElement("heading", "Project / Project Report", `${data.title}\n${data.subtitle}`.trim(), { x: 28, y: positions.headingY, width: 154, height: 25 }, { ...primaryStyle, fontSize: 27, fontWeight: 800, textAlign: "center" }),
    textElement("project-title", "Project Title", data.topic, { x: 29, y: positions.titleY, width: 152, height: 23 }, { ...textStyle, fontSize: 20, fontWeight: 700, textAlign: "center" }),
    textElement("course", "Course / Subject", data.course, { x: 38, y: positions.courseY, width: 134, height: 13 }, { ...textStyle, fontSize: 12, fontWeight: 600, textAlign: "center" }),
    textElement("submitted-by", "Submitted By", `SUBMITTED BY\n${data.author}\n${data.rollNumber}`, { x: 23, y: positions.detailsY, width: 72, height: 32 }, { ...textStyle, fontSize: 12, fontWeight: 600, textAlign: "left" }),
    textElement("submitted-to", "Submitted To", `SUBMITTED TO\n${data.guide}`, { x: 115, y: positions.detailsY, width: 72, height: 32 }, { ...textStyle, fontSize: 12, fontWeight: 600, textAlign: "right" }),
    textElement("footer", "Footer", `${data.institute}  •  ${data.session}`, { x: 22, y: positions.footerY, width: 166, height: 10 }, { ...textStyle, fontSize: 10, fontWeight: 600, textAlign: "center" }),
  ];
}

interface PointerState {
  elementId: string;
  mode: "move" | "resize";
  startX: number;
  startY: number;
  original: CoverCanvasElement;
}

interface A4CoverCanvasProps {
  canvasRef: RefObject<HTMLDivElement | null>;
  elements: CoverCanvasElement[];
  selectedElementId: string | null;
  margins: CoverPageMargins;
  logoUrl: string;
  logoFallback: string;
  isExporting: boolean;
  onChangeElements: (updater: (current: CoverCanvasElement[]) => CoverCanvasElement[]) => void;
  onSelectElement: (id: string | null) => void;
  onSafeAreaNotice: (notice: string) => void;
}

function clamp(value: number, minimum: number, maximum: number) {
  return Math.min(Math.max(value, minimum), Math.max(minimum, maximum));
}

function canvasPoint(event: ReactPointerEvent<HTMLElement>, canvas: HTMLDivElement) {
  const bounds = canvas.getBoundingClientRect();
  return {
    x: ((event.clientX - bounds.left) / bounds.width) * A4_WIDTH_MM,
    y: ((event.clientY - bounds.top) / bounds.height) * A4_HEIGHT_MM,
  };
}

function elementStyle(element: CoverCanvasElement): CSSProperties {
  return {
    color: element.style.color,
    fontFamily: element.style.fontFamily,
    fontSize: `${element.style.fontSize}pt`,
    fontStyle: element.style.fontStyle,
    fontWeight: element.style.fontWeight,
    textAlign: element.style.textAlign,
    lineHeight: 1.22,
  };
}

export default function A4CoverCanvas({
  canvasRef,
  elements,
  selectedElementId,
  margins,
  logoUrl,
  logoFallback,
  isExporting,
  onChangeElements,
  onSelectElement,
  onSafeAreaNotice,
}: A4CoverCanvasProps) {
  const pointerRef = useRef<PointerState | null>(null);

  function startPointer(event: ReactPointerEvent<HTMLElement>, element: CoverCanvasElement, mode: PointerState["mode"]) {
    if (isExporting || !canvasRef.current) return;
    event.preventDefault();
    event.stopPropagation();
    const point = canvasPoint(event, canvasRef.current);
    pointerRef.current = { elementId: element.id, mode, startX: point.x, startY: point.y, original: element };
    onSelectElement(element.id);
    event.currentTarget.setPointerCapture(event.pointerId);
  }

  function updatePointer(event: ReactPointerEvent<HTMLDivElement>) {
    const action = pointerRef.current;
    const canvas = canvasRef.current;
    if (!action || !canvas) return;

    const point = canvasPoint(event, canvas);
    const deltaX = point.x - action.startX;
    const deltaY = point.y - action.startY;
    let restricted = false;
    let change: Partial<CoverCanvasElement>;

    if (action.mode === "move") {
      const rawX = action.original.x + deltaX;
      const rawY = action.original.y + deltaY;
      const x = clamp(rawX, margins.left, A4_WIDTH_MM - margins.right - action.original.width);
      const y = clamp(rawY, margins.top, A4_HEIGHT_MM - margins.bottom - action.original.height);
      restricted = x !== rawX || y !== rawY;
      change = { x, y };
    } else {
      const minimumWidth = action.original.type === "logo" ? 12 : 28;
      const minimumHeight = action.original.type === "logo" ? 12 : 8;
      const rawWidth = action.original.width + deltaX;
      const rawHeight = action.original.height + deltaY;
      const width = clamp(rawWidth, minimumWidth, A4_WIDTH_MM - margins.right - action.original.x);
      const height = clamp(rawHeight, minimumHeight, A4_HEIGHT_MM - margins.bottom - action.original.y);
      restricted = width !== rawWidth || height !== rawHeight;
      change = { width, height };
    }

    onChangeElements((current) => current.map((element) => element.id === action.elementId ? { ...element, ...change } : element));

    if (restricted) {
      onSafeAreaNotice("Safe margin reached — elements stay inside the printable A4 area.");
    }
  }

  function endPointer(event: ReactPointerEvent<HTMLDivElement>) {
    pointerRef.current = null;
    if (event.currentTarget.hasPointerCapture(event.pointerId)) {
      event.currentTarget.releasePointerCapture(event.pointerId);
    }
  }

  return (
    <div
      ref={canvasRef}
      className="absolute inset-0 z-30 overflow-hidden"
      data-exporting={isExporting ? "true" : "false"}
      onPointerDown={() => onSelectElement(null)}
      onPointerMove={updatePointer}
      onPointerUp={endPointer}
      onPointerCancel={endPointer}
    >
      <div className="a4-safe-guides editor-ui pointer-events-none absolute border border-dashed border-blue-500/70 bg-blue-500/[0.025]" style={{ top: `${margins.top}mm`, right: `${margins.right}mm`, bottom: `${margins.bottom}mm`, left: `${margins.left}mm` }}>
        <span className="absolute -top-5 left-0 rounded bg-blue-700 px-1.5 py-0.5 text-[8px] font-bold uppercase tracking-[0.12em] text-white">Safe printable area</span>
      </div>

      {elements.map((element) => {
        const selected = selectedElementId === element.id;
        const boxStyle: CSSProperties = {
          left: `${element.x}mm`,
          top: `${element.y}mm`,
          width: `${element.width}mm`,
          height: `${element.height}mm`,
        };

        return (
          <div
            key={element.id}
            className={`absolute touch-none ${isExporting ? "" : "cursor-move"}`}
            style={boxStyle}
            onPointerDown={(event) => startPointer(event, element, "move")}
          >
            {element.type === "logo" ? (
              <div className="flex h-full w-full items-center justify-center overflow-hidden rounded-full border-2 bg-white/90 shadow-sm" style={{ borderColor: element.style.color }}>
                {logoUrl ? <Image src={logoUrl} alt="Institute logo" fill unoptimized sizes="160px" className="object-contain p-1.5" /> : <span className="text-center text-[18pt] font-black tracking-[0.12em]" style={{ color: element.style.color }}>{logoFallback}</span>}
              </div>
            ) : (
              <p className="m-0 h-full w-full overflow-hidden whitespace-pre-wrap break-words" style={elementStyle(element)}>{element.text || "Double-click or use the panel to edit text"}</p>
            )}

            {selected && !isExporting ? (
              <>
                <div className="editor-ui pointer-events-none absolute -inset-[1.2mm] border-[0.7mm] border-blue-600 shadow-[0_0_0_0.7mm_rgba(255,255,255,0.92)]" />
                <button
                  type="button"
                  aria-label={`Resize ${element.label}`}
                  className="editor-ui absolute -bottom-[3.2mm] -right-[3.2mm] z-10 h-[6.4mm] w-[6.4mm] cursor-nwse-resize rounded-sm border-[0.7mm] border-white bg-blue-600 shadow"
                  onPointerDown={(event) => startPointer(event, element, "resize")}
                />
              </>
            ) : null}
          </div>
        );
      })}
    </div>
  );
}
