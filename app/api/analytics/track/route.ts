import { NextRequest, NextResponse } from "next/server";
import { isAnalyticsConfigured } from "@/app/lib/analytics/database";
import { ANALYTICS_VISITOR_COOKIE, ANALYTICS_VISITOR_MAX_AGE, newVisitorId, visitorHash } from "@/app/lib/analytics/identity";
import { isAnalyticsEventType, type AnalyticsDevice, type AnalyticsEvent, type AnalyticsTool, type AnalyticsTrafficSource } from "@/app/lib/analytics/events";
import { saveAnalyticsEvent } from "@/app/lib/analytics/storage";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

const tools = new Set<AnalyticsTool>(["resume_builder", "cover_page_generator", "pdf_tools", "qr_generator"]);
const devices = new Set<AnalyticsDevice>(["mobile", "tablet", "desktop"]);
const sources = new Set<AnalyticsTrafficSource>(["direct", "search", "social", "referral"]);

function noContent() {
  return new NextResponse(null, { status: 204, headers: { "Cache-Control": "no-store" } });
}

function validSameOrigin(request: NextRequest) {
  const origin = request.headers.get("origin");
  if (!origin) return true;

  try {
    return new URL(origin).host === (request.headers.get("x-forwarded-host") ?? request.headers.get("host"));
  } catch {
    return false;
  }
}

function text(value: unknown, maximumLength: number) {
  return typeof value === "string" ? value.trim().slice(0, maximumLength) : "";
}

function safePath(value: unknown) {
  const path = text(value, 160);
  return /^\/[a-z0-9/_-]*$/i.test(path) && !path.startsWith("/admin") && !path.startsWith("/api") ? path : "";
}

function optionalText(value: unknown, maximumLength: number) {
  return text(value, maximumLength) || undefined;
}

function validEvent(value: unknown): AnalyticsEvent | null {
  if (!value || typeof value !== "object") return null;
  const input = value as Record<string, unknown>;
  if (!isAnalyticsEventType(input.eventType)) return null;

  const path = safePath(input.path);
  if (!path) return null;

  const tool = text(input.tool, 40) as AnalyticsTool;
  const device = text(input.device, 12) as AnalyticsDevice;
  const source = text(input.source, 16) as AnalyticsTrafficSource;

  return {
    eventType: input.eventType,
    path,
    ...(tools.has(tool) ? { tool } : {}),
    ...(devices.has(device) ? { device } : {}),
    ...(sources.has(source) ? { source } : {}),
    ...(input.eventType === "template_selected" ? { template: optionalText(input.template, 100) } : {}),
    ...(input.eventType === "category_selected" ? { category: optionalText(input.category, 80) } : {}),
    ...(input.eventType === "tool_selected" || input.eventType === "download" ? { action: optionalText(input.action, 100) } : {}),
    ...(input.eventType === "download" ? { format: optionalText(input.format, 32) } : {}),
  };
}

function safeCountry(value: string | null) {
  const country = (value ?? "").trim().toUpperCase();
  return /^[A-Z]{2,3}$/.test(country) ? country : undefined;
}

function safeRegion(value: string | null) {
  const region = (value ?? "").trim();
  return /^[A-Za-z0-9 _-]{1,80}$/.test(region) ? region : undefined;
}

export async function POST(request: NextRequest) {
  if (!isAnalyticsConfigured() || !validSameOrigin(request)) return noContent();

  try {
    const body = await request.text();
    if (body.length > 1500) return noContent();
    const event = validEvent(JSON.parse(body));
    if (!event) return noContent();

    const currentVisitorId = request.cookies.get(ANALYTICS_VISITOR_COOKIE)?.value;
    const visitorId = currentVisitorId && /^[A-Za-z0-9_-]{40,60}$/.test(currentVisitorId) ? currentVisitorId : newVisitorId();
    const response = noContent();

    if (visitorId !== currentVisitorId) {
      response.cookies.set({
        name: ANALYTICS_VISITOR_COOKIE,
        value: visitorId,
        httpOnly: true,
        maxAge: ANALYTICS_VISITOR_MAX_AGE,
        path: "/",
        sameSite: "lax",
        secure: process.env.NODE_ENV === "production",
      });
    }

    await saveAnalyticsEvent({
      visitorHash: visitorHash(visitorId),
      ...event,
      country: safeCountry(request.headers.get("x-vercel-ip-country") ?? request.headers.get("cf-ipcountry")),
      region: safeRegion(request.headers.get("x-vercel-ip-country-region")),
    });

    return response;
  } catch {
    // Tracking must never make a public feature unavailable.
    return noContent();
  }
}
