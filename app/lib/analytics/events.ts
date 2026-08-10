export const ANALYTICS_EVENT_TYPES = [
  "page_view",
  "tool_selected",
  "template_selected",
  "category_selected",
  "download",
] as const;

export type AnalyticsEventType = (typeof ANALYTICS_EVENT_TYPES)[number];

export const ANALYTICS_ENVIRONMENTS = ["development", "preview", "production"] as const;
export type AnalyticsEnvironment = (typeof ANALYTICS_ENVIRONMENTS)[number];

export type AnalyticsTool =
  | "resume_builder"
  | "cover_page_generator"
  | "pdf_tools"
  | "qr_generator";

export type AnalyticsDevice = "mobile" | "tablet" | "desktop";
export type AnalyticsTrafficSource = "direct" | "search" | "social" | "referral";

export type AnalyticsEvent = {
  eventType: AnalyticsEventType;
  path: string;
  tool?: AnalyticsTool;
  template?: string;
  category?: string;
  action?: string;
  format?: string;
  device?: AnalyticsDevice;
  source?: AnalyticsTrafficSource;
};

export function isAnalyticsEventType(value: unknown): value is AnalyticsEventType {
  return typeof value === "string" && ANALYTICS_EVENT_TYPES.includes(value as AnalyticsEventType);
}

export function isAnalyticsEnvironment(value: string | undefined): value is AnalyticsEnvironment {
  return typeof value === "string" && ANALYTICS_ENVIRONMENTS.includes(value as AnalyticsEnvironment);
}
