"use client";

import { useEffect, useRef } from "react";
import { usePathname } from "next/navigation";
import type { AnalyticsDevice, AnalyticsEvent, AnalyticsTool, AnalyticsTrafficSource } from "./events";

function deviceType(): AnalyticsDevice {
  if (window.innerWidth < 768) return "mobile";
  if (window.innerWidth < 1024) return "tablet";
  return "desktop";
}

function trafficSource(): AnalyticsTrafficSource {
  if (!document.referrer) return "direct";

  try {
    const source = new URL(document.referrer);
    if (source.host === window.location.host) return "direct";
    const host = source.hostname.toLowerCase();
    if (/(google|bing|yahoo|duckduckgo|baidu|yandex)\./.test(host)) return "search";
    if (/(facebook|instagram|linkedin|twitter|x\.com|youtube|pinterest|whatsapp|t\.me)\./.test(host)) return "social";
    return "referral";
  } catch {
    return "direct";
  }
}

function toolForPath(path: string): AnalyticsTool | undefined {
  if (path === "/resume-builder") return "resume_builder";
  if (path === "/cover-page-generator" || path.startsWith("/cover-page-generator/editor/")) return "cover_page_generator";
  if (path === "/pdf-tools") return "pdf_tools";
  if (path === "/qr-generator") return "qr_generator";
  return undefined;
}

function canTrack() {
  return typeof window !== "undefined" && navigator.doNotTrack !== "1";
}

export function trackAnalyticsEvent(event: Omit<AnalyticsEvent, "device" | "source"> & { device?: AnalyticsDevice; source?: AnalyticsTrafficSource }) {
  if (!canTrack()) return;

  const payload: AnalyticsEvent = {
    ...event,
    device: event.device ?? deviceType(),
    source: event.source ?? trafficSource(),
  };

  void fetch("/api/analytics/track", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
    credentials: "same-origin",
    keepalive: true,
  }).catch(() => {
    // Analytics is intentionally best-effort and must never affect user actions.
  });
}

export function AnalyticsTracker() {
  const pathname = usePathname();
  const lastTrackedPath = useRef<string | null>(null);

  useEffect(() => {
    if (!pathname || pathname.startsWith("/admin") || lastTrackedPath.current === pathname) return;
    lastTrackedPath.current = pathname;
    trackAnalyticsEvent({ eventType: "page_view", path: pathname, tool: toolForPath(pathname) });
  }, [pathname]);

  return null;
}

export function trackToolSelection(path: string, tool: AnalyticsTool, action: string) {
  trackAnalyticsEvent({ eventType: "tool_selected", path, tool, action });
}

export function trackDownload(path: string, tool: AnalyticsTool, format: string, template?: string, action?: string) {
  trackAnalyticsEvent({ eventType: "download", path, tool, format, template, action });
}

export function trackTemplateSelection(path: string, tool: AnalyticsTool, template: string) {
  trackAnalyticsEvent({ eventType: "template_selected", path, tool, template });
}

export function trackCategorySelection(path: string, tool: AnalyticsTool, category: string) {
  trackAnalyticsEvent({ eventType: "category_selected", path, tool, category });
}
