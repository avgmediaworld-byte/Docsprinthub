import "server-only";

import postgres from "postgres";

let client: ReturnType<typeof postgres> | null = null;

export function analyticsDatabaseUrl() {
  return process.env.ANALYTICS_DATABASE_URL?.trim() || "";
}

export function isAnalyticsConfigured() {
  return Boolean(analyticsDatabaseUrl() && process.env.ANALYTICS_HASH_SECRET?.trim());
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
