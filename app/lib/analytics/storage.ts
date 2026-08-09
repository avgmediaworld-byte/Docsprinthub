import "server-only";

import { analyticsDb } from "./database";
import type { AnalyticsDevice, AnalyticsEventType, AnalyticsTool, AnalyticsTrafficSource } from "./events";

export type StoredAnalyticsEvent = {
  visitorHash: string;
  eventType: AnalyticsEventType;
  path: string;
  tool?: AnalyticsTool;
  template?: string;
  category?: string;
  action?: string;
  format?: string;
  device?: AnalyticsDevice;
  source?: AnalyticsTrafficSource;
  country?: string;
  region?: string;
};

export async function saveAnalyticsEvent(event: StoredAnalyticsEvent) {
  const sql = analyticsDb();

  await sql.begin(async (transaction) => {
    await transaction`
      INSERT INTO analytics_visitors (visitor_hash, first_seen_at, last_seen_at)
      VALUES (${event.visitorHash}, NOW(), NOW())
      ON CONFLICT (visitor_hash)
      DO UPDATE SET last_seen_at = EXCLUDED.last_seen_at
    `;

    await transaction`
      INSERT INTO analytics_events (
        visitor_hash, event_type, page_path, tool, template_id, category, action,
        download_format, device_type, traffic_source, country_code, region_code
      ) VALUES (
        ${event.visitorHash}, ${event.eventType}, ${event.path}, ${event.tool ?? null},
        ${event.template ?? null}, ${event.category ?? null}, ${event.action ?? null},
        ${event.format ?? null}, ${event.device ?? null}, ${event.source ?? null},
        ${event.country ?? null}, ${event.region ?? null}
      )
    `;
  });
}

export type AnalyticsMetric = { label: string; count: number };

export type AnalyticsReport = {
  visitors: {
    today: number;
    yesterday: number;
    last7Days: number;
    last30Days: number;
    allTime: number;
    newLast30Days: number;
    returningLast30Days: number;
  };
  dailyVisitors: AnalyticsMetric[];
  topPages: AnalyticsMetric[];
  tools: Array<AnalyticsMetric & { visitors: number }>;
  templates: AnalyticsMetric[];
  categories: AnalyticsMetric[];
  actions: AnalyticsMetric[];
  downloads: AnalyticsMetric[];
  devices: AnalyticsMetric[];
  sources: AnalyticsMetric[];
  locations: AnalyticsMetric[];
};

type SummaryRow = {
  today: unknown;
  yesterday: unknown;
  last_7_days: unknown;
  last_30_days: unknown;
  all_time: unknown;
  new_last_30_days: unknown;
  returning_last_30_days: unknown;
};

type MetricRow = { label: string; count: unknown };
type ToolRow = MetricRow & { visitors: unknown };

function count(value: unknown) {
  return Number(value ?? 0);
}

function timezone() {
  const configured = process.env.ANALYTICS_TIME_ZONE?.trim();
  return configured || "Asia/Kolkata";
}

export async function getAnalyticsReport(): Promise<AnalyticsReport> {
  const sql = analyticsDb();
  const timeZone = timezone();
  const dayStart = sql`date_trunc('day', NOW() AT TIME ZONE ${timeZone}) AT TIME ZONE ${timeZone}`;
  const thirtyDayStart = sql`(${dayStart} - INTERVAL '29 days')`;

  const [summaryRows, dailyRows, pageRows, toolRows, templateRows, categoryRows, actionRows, downloadRows, deviceRows, sourceRows, locationRows] = await Promise.all([
    sql`
      SELECT
        COUNT(DISTINCT e.visitor_hash) FILTER (WHERE e.occurred_at >= ${dayStart}) AS today,
        COUNT(DISTINCT e.visitor_hash) FILTER (
          WHERE e.occurred_at >= (${dayStart} - INTERVAL '1 day') AND e.occurred_at < ${dayStart}
        ) AS yesterday,
        COUNT(DISTINCT e.visitor_hash) FILTER (WHERE e.occurred_at >= (${dayStart} - INTERVAL '6 days')) AS last_7_days,
        COUNT(DISTINCT e.visitor_hash) FILTER (WHERE e.occurred_at >= ${thirtyDayStart}) AS last_30_days,
        COUNT(DISTINCT e.visitor_hash) AS all_time,
        COUNT(DISTINCT e.visitor_hash) FILTER (
          WHERE e.occurred_at >= ${thirtyDayStart} AND v.first_seen_at >= ${thirtyDayStart}
        ) AS new_last_30_days,
        COUNT(DISTINCT e.visitor_hash) FILTER (
          WHERE e.occurred_at >= ${thirtyDayStart} AND v.first_seen_at < ${thirtyDayStart}
        ) AS returning_last_30_days
      FROM analytics_events e
      JOIN analytics_visitors v ON v.visitor_hash = e.visitor_hash
    `,
    sql`
      SELECT TO_CHAR(e.occurred_at AT TIME ZONE ${timeZone}, 'Mon DD') AS label,
             COUNT(DISTINCT e.visitor_hash) AS count
      FROM analytics_events e
      WHERE e.occurred_at >= (${dayStart} - INTERVAL '6 days')
      GROUP BY DATE(e.occurred_at AT TIME ZONE ${timeZone}), label
      ORDER BY DATE(e.occurred_at AT TIME ZONE ${timeZone})
    `,
    sql`
      SELECT page_path AS label, COUNT(*) AS count
      FROM analytics_events
      WHERE event_type = 'page_view'
      GROUP BY page_path
      ORDER BY count DESC, page_path ASC
      LIMIT 10
    `,
    sql`
      SELECT tool AS label, COUNT(*) AS count, COUNT(DISTINCT visitor_hash) AS visitors
      FROM analytics_events
      WHERE tool IS NOT NULL
      GROUP BY tool
      ORDER BY count DESC, tool ASC
      LIMIT 10
    `,
    sql`
      SELECT template_id AS label, COUNT(*) AS count
      FROM analytics_events
      WHERE event_type = 'template_selected' AND template_id IS NOT NULL
      GROUP BY template_id
      ORDER BY count DESC, template_id ASC
      LIMIT 10
    `,
    sql`
      SELECT category AS label, COUNT(*) AS count
      FROM analytics_events
      WHERE event_type = 'category_selected' AND category IS NOT NULL
      GROUP BY category
      ORDER BY count DESC, category ASC
      LIMIT 10
    `,
    sql`
      SELECT action AS label, COUNT(*) AS count
      FROM analytics_events
      WHERE event_type = 'tool_selected' AND action IS NOT NULL
      GROUP BY action
      ORDER BY count DESC, action ASC
      LIMIT 10
    `,
    sql`
      SELECT CONCAT(COALESCE(tool, 'other'), ' / ', COALESCE(download_format, 'download')) AS label,
             COUNT(*) AS count
      FROM analytics_events
      WHERE event_type = 'download'
      GROUP BY tool, download_format
      ORDER BY count DESC, label ASC
      LIMIT 10
    `,
    sql`
      SELECT device_type AS label, COUNT(*) AS count
      FROM analytics_events
      WHERE event_type = 'page_view' AND device_type IS NOT NULL
      GROUP BY device_type
      ORDER BY count DESC, device_type ASC
    `,
    sql`
      SELECT traffic_source AS label, COUNT(*) AS count
      FROM analytics_events
      WHERE event_type = 'page_view' AND traffic_source IS NOT NULL
      GROUP BY traffic_source
      ORDER BY count DESC, traffic_source ASC
    `,
    sql`
      SELECT CONCAT(country_code, CASE WHEN region_code IS NOT NULL THEN ' / ' || region_code ELSE '' END) AS label,
             COUNT(*) AS count
      FROM analytics_events
      WHERE event_type = 'page_view' AND country_code IS NOT NULL
      GROUP BY country_code, region_code
      ORDER BY count DESC, label ASC
      LIMIT 10
    `,
  ]);

  const summary = (summaryRows[0] ?? {}) as unknown as SummaryRow;
  const toMetrics = (rows: unknown): AnalyticsMetric[] => (rows as MetricRow[]).map((row) => ({ label: row.label, count: count(row.count) }));

  return {
    visitors: {
      today: count(summary.today),
      yesterday: count(summary.yesterday),
      last7Days: count(summary.last_7_days),
      last30Days: count(summary.last_30_days),
      allTime: count(summary.all_time),
      newLast30Days: count(summary.new_last_30_days),
      returningLast30Days: count(summary.returning_last_30_days),
    },
    dailyVisitors: toMetrics(dailyRows),
    topPages: toMetrics(pageRows),
    tools: (toolRows as unknown as ToolRow[]).map((row) => ({ label: row.label, count: count(row.count), visitors: count(row.visitors) })),
    templates: toMetrics(templateRows),
    categories: toMetrics(categoryRows),
    actions: toMetrics(actionRows),
    downloads: toMetrics(downloadRows),
    devices: toMetrics(deviceRows),
    sources: toMetrics(sourceRows),
    locations: toMetrics(locationRows),
  };
}
