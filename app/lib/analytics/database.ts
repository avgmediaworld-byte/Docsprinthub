import "server-only";

import postgres from "postgres";
import { isAnalyticsEnvironment, type AnalyticsEnvironment } from "./events";

let client: ReturnType<typeof postgres> | null = null;

export function analyticsDatabaseUrl() {
  return process.env.ANALYTICS_DATABASE_URL?.trim() || "";
}

export function isAnalyticsConfigured() {
  return Boolean(analyticsDatabaseUrl() && process.env.ANALYTICS_HASH_SECRET?.trim());
}

function isLocalHost(hostname: string) {
  const normalized = hostname.trim().toLowerCase().replace(/^\[|\]$/g, "");
  return normalized === "localhost" || normalized === "127.0.0.1" || normalized === "::1" || normalized === "0.0.0.0";
}

export function analyticsDeploymentEnvironment(hostname: string): AnalyticsEnvironment {
  if (isLocalHost(hostname)) return "development";

  if (process.env.VERCEL_ENV === "preview") return "preview";
  if (process.env.VERCEL_ENV === "production") return "production";

  const configured = process.env.ANALYTICS_ENVIRONMENT?.trim().toLowerCase();
  if (isAnalyticsEnvironment(configured)) return configured;
  return process.env.NODE_ENV === "production" ? "production" : "development";
}

export function analyticsDb() {
  const connectionString = analyticsDatabaseUrl();
  if (!connectionString) throw new Error("Analytics database is not configured.");

  if (!client) {
    client = postgres(connectionString, {
      connect_timeout: 5,
      idle_timeout: 20,
      max: 2,
      prepare: false,
    });
  }

  return client;
}
