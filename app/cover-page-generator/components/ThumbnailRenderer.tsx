"use client";

import React from "react";

import { getThemeById } from "../registry/theme-registry";

import {
  getBackgroundComponent,
  getDecorationComponent,
} from "../registry/component-registry";

import LogoPlaceholder from "./placeholders/LogoPlaceholder";
import TitlePlaceholder from "./placeholders/TitlePlaceholder";
import SubtitlePlaceholder from "./placeholders/SubtitlePlaceholder";
import InstitutePlaceholder from "./placeholders/InstitutePlaceholder";
import CompanyPlaceholder from "./placeholders/CompanyPlaceholder";
import BodyPlaceholder from "./placeholders/BodyPlaceholder";
import FooterPlaceholder from "./placeholders/FooterPlaceholder";
import BadgePlaceholder from "./placeholders/BadgePlaceholder";

import Academic01 from "../data/layouts/Academic01";
import Academic02 from "../data/layouts/Academic02";

import Corporate01 from "../data/layouts/Corporate01";
import Corporate02 from "../data/layouts/Corporate02";

import Creative01 from "../data/layouts/Creative01";

interface ThumbnailRendererProps {
  themeId: string;

  className?: string;

  showShadow?: boolean;

  rounded?: boolean;
}

export default function ThumbnailRenderer({
  themeId,

  className = "",

  showShadow = true,

  rounded = true,
}: ThumbnailRendererProps) {

      const theme = getThemeById(themeId);

    if (!theme) {
    return null;
  }

    const BackgroundComponent =
    theme.backgroundId
        ? getBackgroundComponent(theme.backgroundId)
        : null;

    const DecorationComponents =
    theme.decorationIds?.map(getDecorationComponent) ?? [];

    const LayoutId = theme.layoutId;

    const placeholderNodes = {
    logo: (
      <LogoPlaceholder
        size={72}
        transparent
      />
    ),

    institute: <InstitutePlaceholder />,

    company: <CompanyPlaceholder />,

    title: <TitlePlaceholder />,

    subtitle: <SubtitlePlaceholder />,

    body: <BodyPlaceholder />,

    footer: <FooterPlaceholder />,

    badge: <BadgePlaceholder />,
  };

  function renderLayout() {
  switch (LayoutId) {

    case "academic01":
      return (
        <Academic01
            logo={placeholderNodes.logo}
            title={placeholderNodes.title}
            subtitle={placeholderNodes.subtitle}
            center={placeholderNodes.body}
            bottom={placeholderNodes.footer}
            background={
            BackgroundComponent
                ? <BackgroundComponent />
                : undefined
            }

            decorations={
            DecorationComponents.map((Decoration, index) => (
                <Decoration key={index} />
            ))
            }
            />
        );

    case "academic02":
      return (
        <Academic02
            logo={placeholderNodes.logo}
            title={placeholderNodes.title}
            subtitle={placeholderNodes.subtitle}
            center={placeholderNodes.body}
            bottom={placeholderNodes.footer}
            background={
            BackgroundComponent
                ? <BackgroundComponent />
                : undefined
            }

            decorations={
            DecorationComponents.map((Decoration, index) => (
                <Decoration key={index} />
            ))
            }
            />
        );

    case "corporate01":
      return (
        <Corporate01
            logo={placeholderNodes.logo}
            title={placeholderNodes.title}
            subtitle={placeholderNodes.subtitle}
            body={placeholderNodes.body}
            footer={placeholderNodes.footer}
            badge={placeholderNodes.badge}
            background={
            BackgroundComponent
                ? <BackgroundComponent />
                : undefined
            }

            decorations={
            DecorationComponents.map((Decoration, index) => (
                <Decoration key={index} />
            ))
            }
        />
      );

    case "corporate02":
      return (
        <Corporate02
            logo={placeholderNodes.logo}
            title={placeholderNodes.title}
            subtitle={placeholderNodes.subtitle}
            body={placeholderNodes.body}
            footer={placeholderNodes.footer}
            badge={placeholderNodes.badge}
            background={
            BackgroundComponent
                ? <BackgroundComponent />
                : undefined
            }

            decorations={
            DecorationComponents.map((Decoration, index) => (
                <Decoration key={index} />
            ))
            }
        />
      );

    case "creative01":
      return (
        <Creative01
            logo={placeholderNodes.logo}
            title={placeholderNodes.title}
            subtitle={placeholderNodes.subtitle}
            body={placeholderNodes.body}
            footer={placeholderNodes.footer}
            badge={placeholderNodes.badge}
            background={
            BackgroundComponent
                ? <BackgroundComponent />
                : undefined
            }

            decorations={
            DecorationComponents.map((Decoration, index) => (
                <Decoration key={index} />
            ))
            }
        />
      );

    default:
      return null;
  }
}
    return (
        <div
        className={`
            relative
            aspect-[210/297]
            w-full
            overflow-hidden
            bg-white
            ${rounded ? "rounded-xl" : ""}
            ${showShadow ? "shadow-lg" : ""}
            ${className}
        `}
        >

        {/* Decorations */}
        {DecorationComponents.length > 0 && (
            <div className="absolute inset-0 z-10 pointer-events-none">
            {DecorationComponents.map((Decoration, index) => (
                <div
                key={index}
                className="absolute inset-0"
                >   
                <Decoration />
                </div>
            ))}
            </div>
        )}

        {/* Layout */}
        <div className="relative z-20 h-full w-full">
            {renderLayout()}
        </div>
        </div>
    );
}