"use client";

import { createElement, type CSSProperties, type ReactNode } from "react";
import Image from "next/image";
import { DEFAULT_THEME, type ThemeConfiguration } from "../data/themes/base";
import Academic01 from "../data/layouts/Academic01";
import Academic02 from "../data/layouts/Academic02";
import Corporate01 from "../data/layouts/Corporate01";
import Corporate02 from "../data/layouts/Corporate02";
import Creative01 from "../data/layouts/Creative01";
import { getBackgroundComponent, getDecorationComponent } from "../registry/component-registry";
import { getThemeById } from "../registry/theme-registry";
import { getCuratedTemplateDesign } from "../data/curatedTemplateDesigns";
import TemplateSignatureArt from "./TemplateSignatureArt";
import type { AcademicTemplateData } from "./academic/AcademicFrame";

export const THEME_DRIVEN_TEMPLATE_IDS = new Set([
  "academic-frame",
  "ai-future",
  "corporate-blue",
  "commerce-gold",
  "computer-science",
  "education-theme",
  "elegant-border",
  "engineering-blue",
  "law-professional",
  "medical-white",
  "minimal-white",
  "minimal-academic",
  "modern-university",
  "premium-academic",
  "premium-gold",
  "portfolio-pro",
  "research-paper",
  "science-project",
  "school-project",
  "thesis-modern",
  "university-classic",
]);

export type CoverTextSlot = "course" | "heading" | "smallHeading" | "projectTitle";

export interface CoverTextStyle {
  color?: string;
  fontFamily?: string;
  fontSize?: number;
  fontStyle?: CSSProperties["fontStyle"];
  fontWeight?: CSSProperties["fontWeight"];
  textAlign?: CSSProperties["textAlign"];
}

export interface CoverDesignOverrides {
  accentColor?: string;
  backgroundId?: string;
  decorationIds?: string[];
  headingFont?: string;
  layoutId?: string;
  primaryColor?: string;
  textStyles?: Partial<Record<CoverTextSlot, CoverTextStyle>>;
}

interface ThemeDrivenCoverProps {
  templateId: string;
  data: AcademicTemplateData;
  design?: CoverDesignOverrides;
  thumbnail?: boolean;
}

function isDarkSurface(theme: ThemeConfiguration) {
  return theme.mode === "dark" || theme.backgroundId === "navy-luxury" || theme.backgroundId === "royal-purple";
}

function fallbackMonogram(institute: string) {
  const initials = institute
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((word) => word[0])
    .join("");
  return initials || "DS";
}

function resolveTheme(templateId: string): ThemeConfiguration {
  return getThemeById(templateId) ?? getThemeById("academic-frame") ?? DEFAULT_THEME;
}

function CoverLogo({ data, theme, inverted }: { data: AcademicTemplateData; theme: ThemeConfiguration; inverted: boolean }) {
  const border = inverted ? "rgba(255,255,255,0.5)" : theme.palette.border;
  const background = inverted ? "rgba(255,255,255,0.14)" : "rgba(255,255,255,0.88)";

  return (
    <div className="flex items-center gap-3">
      <div className="flex h-[76px] w-[76px] items-center justify-center overflow-hidden rounded-full border-2 shadow-sm" style={{ backgroundColor: background, borderColor: border }}>
        {data.logoUrl ? (
          <Image src={data.logoUrl} alt="Institute logo" width={64} height={64} unoptimized className="h-16 w-16 object-contain" />
        ) : (
          <span className="text-xl font-black tracking-[0.12em]" style={{ color: inverted ? "#ffffff" : theme.palette.primary }}>{fallbackMonogram(data.institute)}</span>
        )}
      </div>
      <div>
        <p className="text-xs font-bold uppercase tracking-[0.22em]" style={{ color: inverted ? "rgba(255,255,255,0.82)" : theme.palette.muted }}>DocSprintHub</p>
        <p className="mt-1 text-sm font-semibold" style={{ color: inverted ? "#ffffff" : theme.palette.text }}>A4 cover collection</p>
      </div>
    </div>
  );
}

function TitleBlock({ data, theme, inverted, textStyles }: { data: AcademicTemplateData; theme: ThemeConfiguration; inverted: boolean; textStyles?: CoverDesignOverrides["textStyles"] }) {
  const headingColor = inverted ? "#ffffff" : theme.palette.primary;
  const bodyColor = inverted ? "rgba(255,255,255,0.82)" : theme.palette.text;
  const courseStyle: CSSProperties = { color: inverted ? "rgba(255,255,255,0.72)" : theme.palette.muted, ...textStyles?.course };
  const headingStyle: CSSProperties = { color: headingColor, fontFamily: theme.typography.headingFont, ...textStyles?.heading };
  const smallHeadingStyle: CSSProperties = { color: bodyColor, ...textStyles?.smallHeading };

  return (
    <div className="text-center">
      <p className="text-sm font-bold uppercase tracking-[0.28em]" style={courseStyle}>{data.course || "Academic submission"}</p>
      <div className="mx-auto mt-5 h-1 w-20 rounded-full" style={{ backgroundColor: theme.palette.accent }} />
      <h1 className="mt-5 text-5xl font-black uppercase leading-[0.95] tracking-[-0.04em]" style={headingStyle}>{data.title || "Project report"}</h1>
      <p className="mt-5 text-base font-semibold uppercase tracking-[0.2em]" style={smallHeadingStyle}>{data.subtitle || "Presented for academic evaluation"}</p>
    </div>
  );
}

function TopicBlock({ data, theme, inverted, textStyles }: { data: AcademicTemplateData; theme: ThemeConfiguration; inverted: boolean; textStyles?: CoverDesignOverrides["textStyles"] }) {
  const projectTitleStyle: CSSProperties = { color: inverted ? "#ffffff" : theme.palette.text, fontFamily: theme.typography.headingFont, ...textStyles?.projectTitle };

  return (
    <div className="mx-auto max-w-[580px] text-center">
      <p className="text-xs font-bold uppercase tracking-[0.26em]" style={{ color: inverted ? "rgba(255,255,255,0.72)" : theme.palette.muted }}>Project / assignment</p>
      <h2 className="mt-3 text-3xl font-bold leading-tight" style={projectTitleStyle}>{data.topic || "Your project title"}</h2>
    </div>
  );
}

function DetailsCard({ data, theme }: { data: AcademicTemplateData; theme: ThemeConfiguration }) {
  const cardStyle: CSSProperties = {
    backgroundColor: "rgba(255,255,255,0.9)",
    borderColor: theme.palette.border,
    boxShadow: "0 18px 50px rgba(15, 23, 42, 0.12)",
  };

  return (
    <div className="mx-auto grid w-full max-w-[610px] grid-cols-2 gap-x-8 gap-y-6 rounded-[24px] border p-7 backdrop-blur-sm" style={cardStyle}>
      <Detail label="Submitted by" value={data.author || "Your name"} note={data.rollNumber || "Roll number"} theme={theme} />
      <Detail label="Submitted to" value={data.guide || "Faculty name"} note={data.institute || "Your institute"} theme={theme} />
    </div>
  );
}

function Detail({ label, value, note, theme }: { label: string; value: string; note: string; theme: ThemeConfiguration }) {
  return (
    <div>
      <p className="text-xs font-bold uppercase tracking-[0.2em]" style={{ color: theme.palette.muted }}>{label}</p>
      <p className="mt-2 text-lg font-bold leading-tight" style={{ color: theme.palette.text }}>{value}</p>
      <p className="mt-1 text-sm" style={{ color: theme.palette.muted }}>{note}</p>
    </div>
  );
}

function CoverFooter({ data, theme, inverted }: { data: AcademicTemplateData; theme: ThemeConfiguration; inverted: boolean }) {
  return (
    <div className="flex items-end justify-between gap-6 border-t pt-5" style={{ borderColor: inverted ? "rgba(255,255,255,0.3)" : theme.palette.border }}>
      <div>
        <p className="text-xs font-bold uppercase tracking-[0.22em]" style={{ color: inverted ? "rgba(255,255,255,0.68)" : theme.palette.muted }}>Institute</p>
        <p className="mt-2 text-base font-bold" style={{ color: inverted ? "#ffffff" : theme.palette.text }}>{data.institute || "Your college or institute"}</p>
      </div>
      <p className="text-right text-sm font-semibold" style={{ color: inverted ? "rgba(255,255,255,0.86)" : theme.palette.muted }}>{data.session || "Academic session"}</p>
    </div>
  );
}

function renderLayout(layoutId: string | undefined, slots: { logo: ReactNode; title: ReactNode; subtitle: ReactNode; center: ReactNode; bottom: ReactNode; company: ReactNode; badge: ReactNode }) {
  switch (layoutId) {
    case "academic02":
      return <Academic02 logo={slots.logo} title={slots.title} subtitle={slots.subtitle} center={slots.center} bottom={slots.bottom} />;
    case "corporate01":
      return <Corporate01 logo={slots.logo} company={slots.company} title={slots.title} subtitle={slots.subtitle} badge={slots.badge} body={slots.center} footer={slots.bottom} />;
    case "corporate02":
      return <Corporate02 logo={slots.logo} company={slots.company} title={slots.title} subtitle={slots.subtitle} badge={slots.badge} body={slots.center} footer={slots.bottom} />;
    case "creative01":
      return <Creative01 logo={slots.logo} badge={slots.badge} title={slots.title} subtitle={slots.subtitle} body={slots.center} footer={slots.bottom} />;
    case "academic01":
    default:
      return <Academic01 logo={slots.logo} title={slots.title} subtitle={slots.subtitle} center={slots.center} bottom={slots.bottom} />;
  }
}

export default function ThemeDrivenCover({ templateId, data, design, thumbnail = false }: ThemeDrivenCoverProps) {
  const baseTheme = resolveTheme(templateId);
  const curatedDesign = getCuratedTemplateDesign(templateId);
  const theme: ThemeConfiguration = {
    ...baseTheme,
    backgroundId: design?.backgroundId ?? curatedDesign?.backgroundId ?? baseTheme.backgroundId,
    decorationIds: design?.decorationIds ?? curatedDesign?.decorationIds ?? baseTheme.decorationIds,
    layoutId: design?.layoutId ?? curatedDesign?.layoutId ?? baseTheme.layoutId,
    palette: {
      ...baseTheme.palette,
      accent: design?.accentColor ?? curatedDesign?.accentColor ?? baseTheme.palette.accent,
      primary: design?.primaryColor ?? curatedDesign?.primaryColor ?? baseTheme.palette.primary,
    },
    typography: {
      ...baseTheme.typography,
      headingFont: design?.headingFont ?? curatedDesign?.headingFont ?? baseTheme.typography.headingFont,
    },
  };
  const inverted = isDarkSurface(theme);
  const Background = theme.backgroundId ? getBackgroundComponent(theme.backgroundId) : null;
  const decorations = (theme.decorationIds ?? []).map((id, index) => {
    const Decoration = getDecorationComponent(id);
    return Decoration ? createElement(Decoration, { color: theme.palette.accent, key: `${id}-${index}` }) : null;
  });
  const labelStyle: CSSProperties = { backgroundColor: inverted ? "rgba(255,255,255,0.16)" : `${theme.palette.primary}12`, borderColor: inverted ? "rgba(255,255,255,0.3)" : theme.palette.border, color: inverted ? "#ffffff" : theme.palette.primary };
  const thumbnailLabel = <h1 className="text-center text-5xl font-black uppercase tracking-[0.08em]" style={{ color: inverted ? "#ffffff" : theme.palette.primary, fontFamily: theme.typography.headingFont }}>{templateId === "corporate-blue" || templateId === "portfolio-pro" ? "Portfolio" : "Project"}</h1>;
  const thumbnailUsesHeroSlot = theme.layoutId === "corporate01" || theme.layoutId === "corporate02" || theme.layoutId === "creative01";
  const slots = thumbnail ? {
    logo: null,
    title: thumbnailUsesHeroSlot ? thumbnailLabel : null,
    subtitle: null,
    center: thumbnailUsesHeroSlot ? null : thumbnailLabel,
    bottom: null,
    company: null,
    badge: null,
  } : {
    logo: <CoverLogo data={data} theme={theme} inverted={inverted} />,
    title: <TitleBlock data={data} theme={theme} inverted={inverted} textStyles={design?.textStyles} />,
    subtitle: <TopicBlock data={data} theme={theme} inverted={inverted} textStyles={design?.textStyles} />,
    center: <DetailsCard data={data} theme={theme} />,
    bottom: <CoverFooter data={data} theme={theme} inverted={inverted} />,
    company: <p className="max-w-[250px] text-right text-sm font-bold uppercase tracking-[0.15em]" style={{ color: inverted ? "#ffffff" : theme.palette.text }}>{data.institute || "Your institute"}</p>,
    badge: <span className="rounded-full border px-4 py-2 text-xs font-bold uppercase tracking-[0.18em]" style={labelStyle}>{theme.name}</span>,
  };

  return (
    <div className="relative h-full w-full overflow-hidden" style={{ backgroundColor: theme.palette.background, fontFamily: theme.typography.bodyFont }}>
      {Background ? createElement(Background) : null}
      <TemplateSignatureArt templateId={templateId} primaryColor={theme.palette.primary} accentColor={theme.palette.accent} />
      <div className="pointer-events-none absolute inset-0 z-10 overflow-hidden">{decorations}</div>
      <div className="relative z-20 h-full w-full">{renderLayout(theme.layoutId, slots)}</div>
    </div>
  );
}
