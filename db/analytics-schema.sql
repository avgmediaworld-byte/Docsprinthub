CREATE TABLE IF NOT EXISTS analytics_visitors (
  visitor_hash CHAR(64) PRIMARY KEY,
  first_seen_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  last_seen_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS analytics_events (
  id BIGSERIAL PRIMARY KEY,
  visitor_hash CHAR(64) NOT NULL REFERENCES analytics_visitors(visitor_hash) ON DELETE CASCADE,
  occurred_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  event_type TEXT NOT NULL CHECK (event_type IN ('page_view', 'tool_selected', 'template_selected', 'category_selected', 'download')),
  page_path VARCHAR(160) NOT NULL,
  tool VARCHAR(40),
  template_id VARCHAR(100),
  category VARCHAR(80),
  action VARCHAR(100),
  download_format VARCHAR(32),
  device_type VARCHAR(12) CHECK (device_type IN ('mobile', 'tablet', 'desktop')),
  traffic_source VARCHAR(16) CHECK (traffic_source IN ('direct', 'search', 'social', 'referral')),
  country_code VARCHAR(4),
  region_code VARCHAR(80)
);

CREATE INDEX IF NOT EXISTS analytics_events_occurred_at_idx ON analytics_events (occurred_at DESC);
CREATE INDEX IF NOT EXISTS analytics_events_visitor_occurred_idx ON analytics_events (visitor_hash, occurred_at DESC);
CREATE INDEX IF NOT EXISTS analytics_events_page_view_idx ON analytics_events (event_type, page_path);
CREATE INDEX IF NOT EXISTS analytics_events_tool_idx ON analytics_events (tool, event_type);
