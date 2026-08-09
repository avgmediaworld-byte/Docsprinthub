"use client";

import { createElement, type ReactNode, memo } from "react";

import {
  getBackgroundComponent,
  getDecorationComponent,
  getLayoutComponent,
} from "../registry/component-registry";

import { getThemeById } from "../registry/theme-registry";

import type { ThemeConfiguration } from "../data/themes/base";

export interface TemplateRendererProps {

  background?: ReactNode;

  backgroundId?: string;

  decorations?: ReactNode;

  decorationIds?: string[];

  layout?: ReactNode;

  layoutId?: string;

  themeId?: string;

  children?: ReactNode;

  logo?: ReactNode;

  title?: ReactNode;

  subtitle?: ReactNode;

  info?: ReactNode;

  footer?: ReactNode;

  className?: string;

}

function TemplateRenderer({

  background,

  backgroundId,

  decorations,

  decorationIds,

  layout,

  layoutId,

  themeId,

  children,

  logo,

  title,

  subtitle,

  info,

  footer,

  className = "",

}: TemplateRendererProps) {

  /* ===========================================================
    Theme
  =========================================================== */

  const activeThemeId = themeId ?? null;

  const theme = activeThemeId
    ? getThemeById(activeThemeId)
    : null;

  const activeTheme: ThemeConfiguration | null =
    theme ?? null;

  /* ===========================================================
    Background
  =========================================================== */

  const BackgroundNode = background;

  const resolvedBackgroundId =
    activeTheme?.backgroundId ?? backgroundId;

  const BackgroundComponent = resolvedBackgroundId
    ? getBackgroundComponent(resolvedBackgroundId)
    : null;

  /* ===========================================================
    Layout
  =========================================================== */

  const LayoutNode = layout;

  const resolvedLayoutId =
    activeTheme?.layoutId ?? layoutId;

  const LayoutComponent = resolvedLayoutId
    ? getLayoutComponent(resolvedLayoutId)
    : null;

  /* ===========================================================
    Decorations
  =========================================================== */

  const resolvedDecorationIds =
    activeTheme?.decorationIds ?? decorationIds;

  const DecorationComponents =
    resolvedDecorationIds?.map(getDecorationComponent) ?? [];

  /* ===========================================================
    Mode
  =========================================================== */

  return (

    <div
      className={`
        relative
        overflow-hidden
        bg-white
        w-full
        h-full
        rounded-xl
        shadow-sm
        ${className}
      `}
    >

      {/* Background Layer */}

      <div className="absolute inset-0 z-0">

        {BackgroundNode}

        {BackgroundComponent ? createElement(BackgroundComponent) : null}

      </div>

      {/* Decoration Layer */}

      <div className="absolute inset-0 z-10 pointer-events-none">

        {decorations}

        {DecorationComponents.map((Decoration, index) =>
          Decoration ? createElement(Decoration, { key: index }) : null
        )}

      </div>

      {/* Layout Layer */}

      <div className="relative z-20 h-full w-full">

        {LayoutNode}

      {LayoutComponent ? createElement(LayoutComponent) : null}

      </div>
    
    {/* Content Slots */}

      <div className="absolute inset-0 z-25 flex flex-col">

        {logo}

        {title}

        {subtitle}

        <div className="flex-1">
          {info}
        </div>

        {footer}

      </div>

      {/* Dynamic Content */}

      <div className="absolute inset-0 z-30">

        {children}

      </div>

    </div>

  );

}

export default memo(TemplateRenderer);
