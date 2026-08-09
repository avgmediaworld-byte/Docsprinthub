import { readFile } from "node:fs/promises";
import nextEnv from "@next/env";
import postgres from "postgres";

const { loadEnvConfig } = nextEnv;

loadEnvConfig(process.cwd());

const connectionString = process.env.ANALYTICS_DATABASE_URL;
if (!connectionString) {
  throw new Error("ANALYTICS_DATABASE_URL is required before running the analytics migration.");
}

const migrationUrl = new URL("../db/analytics-schema.sql", import.meta.url);
const migration = await readFile(migrationUrl, "utf8");
const sql = postgres(connectionString, { max: 1, prepare: false });

try {
  await sql.unsafe(migration);

  const requiredTables = ["analytics_events", "analytics_visitors"];
  const requiredIndexes = [
    "analytics_events_occurred_at_idx",
    "analytics_events_page_view_idx",
    "analytics_events_tool_idx",
    "analytics_events_visitor_occurred_idx",
  ];
  const tableRows = await sql`
    SELECT table_name
    FROM information_schema.tables
    WHERE table_schema = 'public' AND table_name IN ${sql(requiredTables)}
    ORDER BY table_name
  `;
  const indexRows = await sql`
    SELECT indexname
    FROM pg_indexes
    WHERE schemaname = 'public' AND indexname IN ${sql(requiredIndexes)}
    ORDER BY indexname
  `;
  const tables = tableRows.map((row) => row.table_name);
  const indexes = indexRows.map((row) => row.indexname);
  const missingTables = requiredTables.filter((name) => !tables.includes(name));
  const missingIndexes = requiredIndexes.filter((name) => !indexes.includes(name));

  if (missingTables.length || missingIndexes.length) {
    throw new Error(`Analytics schema verification failed. Missing tables: ${missingTables.join(", ") || "none"}. Missing indexes: ${missingIndexes.join(", ") || "none"}.`);
  }

  console.log(`Analytics schema is ready. Verified tables: ${tables.join(", ")}. Verified indexes: ${indexes.join(", ")}.`);
} finally {
  await sql.end({ timeout: 5 });
}
