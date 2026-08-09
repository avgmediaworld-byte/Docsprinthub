import type { Metadata } from "next";
import Link from "next/link";
import { isAnalyticsConfigured } from "@/app/lib/analytics/database";
import { getAnalyticsReport, type AnalyticsMetric, type AnalyticsReport } from "@/app/lib/analytics/storage";
import { requireAnalyticsAdmin } from "@/app/lib/admin-auth";
import LogoutButton from "./LogoutButton";

export const dynamic = "force-dynamic";
export const metadata: Metadata = {
  title: "DocSprintHub Analytics",
  robots: { index: false, follow: false },
};

const formatter = new Intl.NumberFormat("en-IN");

function format(value: number) {
  return formatter.format(value);
}

function titleCase(value: string) {
  return value.replace(/[_-]/g, " ").replace(/\b\w/g, (character) => character.toUpperCase());
}

function SummaryCard({ label, value }: { label: string; value: number }) {
  return <article className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm"><p className="text-sm font-semibold text-slate-600">{label}</p><p className="mt-2 text-3xl font-bold tracking-tight text-slate-950">{format(value)}</p><p className="mt-1 text-xs text-slate-500">Unique visitors</p></article>;
}

function EmptyState() {
  return <p className="rounded-xl border border-dashed border-slate-300 bg-slate-50 px-4 py-5 text-sm leading-6 text-slate-500">No analytics recorded yet. Data will appear after public visitors use the website.</p>;
}

function BarList({ items, valueLabel = "Events" }: { items: AnalyticsMetric[]; valueLabel?: string }) {
  if (!items.length) return <EmptyState />;
  const maximum = Math.max(...items.map((item) => item.count), 1);
  return <div className="space-y-4">{items.map((item) => <div key={item.label}><div className="mb-1.5 flex items-center justify-between gap-3 text-sm"><span className="truncate font-semibold text-slate-700">{titleCase(item.label)}</span><span className="shrink-0 font-bold text-slate-950">{format(item.count)} <span className="font-medium text-slate-500">{valueLabel}</span></span></div><div className="h-2 overflow-hidden rounded-full bg-slate-100"><div className="h-full rounded-full bg-blue-600" style={{ width: `${Math.max((item.count / maximum) * 100, 3)}%` }} /></div></div>)}</div>;
}

function Section({ title, description, children }: { title: string; description: string; children: React.ReactNode }) {
  return <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6"><div className="mb-5"><h2 className="text-xl font-bold text-slate-950">{title}</h2><p className="mt-1 text-sm leading-6 text-slate-600">{description}</p></div>{children}</section>;
}

function ToolTable({ tools }: { tools: AnalyticsReport["tools"] }) {
  if (!tools.length) return <EmptyState />;
  return <div className="overflow-x-auto"><table className="w-full min-w-[26rem] text-left text-sm"><thead className="border-b border-slate-200 text-xs uppercase tracking-wide text-slate-500"><tr><th className="pb-3 pr-4">Tool</th><th className="pb-3 pr-4 text-right">Visitors</th><th className="pb-3 text-right">Interactions</th></tr></thead><tbody>{tools.map((tool) => <tr key={tool.label} className="border-b border-slate-100 last:border-0"><td className="py-3 pr-4 font-semibold text-slate-800">{titleCase(tool.label)}</td><td className="py-3 pr-4 text-right text-slate-600">{format(tool.visitors)}</td><td className="py-3 text-right font-bold text-slate-950">{format(tool.count)}</td></tr>)}</tbody></table></div>;
}

function DailyChart({ values }: { values: AnalyticsMetric[] }) {
  if (!values.length) return <EmptyState />;
  const maximum = Math.max(...values.map((value) => value.count), 1);
  return <div className="flex h-48 items-end gap-2 border-b border-slate-200 pt-4">{values.map((value) => <div key={value.label} className="flex min-w-0 flex-1 flex-col items-center gap-2"><span className="text-xs font-bold text-slate-700">{value.count || ""}</span><div className="w-full rounded-t-md bg-blue-600" style={{ height: `${Math.max((value.count / maximum) * 100, value.count ? 5 : 1)}%` }} title={`${value.label}: ${value.count} visitors`} /><span className="whitespace-nowrap text-[10px] text-slate-500 sm:text-xs">{value.label}</span></div>)}</div>;
}

function SetupState() {
  return <section className="mx-auto mt-10 max-w-2xl rounded-2xl border border-amber-200 bg-amber-50 p-6 text-amber-950"><h1 className="text-2xl font-bold">Analytics needs setup</h1><p className="mt-3 leading-7">Add the analytics environment variables and run the database migration. No analytics data is shown until the real PostgreSQL database is available.</p><pre className="mt-5 overflow-x-auto rounded-xl bg-slate-950 p-4 text-sm text-slate-100">npm run analytics:migrate</pre></section>;
}

export default async function AnalyticsDashboardPage() {
  await requireAnalyticsAdmin();

  if (!isAnalyticsConfigured()) return <SetupState />;

  let report: AnalyticsReport;
  try {
    report = await getAnalyticsReport();
  } catch {
    return <SetupState />;
  }

  return <main className="min-h-screen bg-slate-50 px-5 py-7 text-slate-950 sm:px-8 sm:py-10"><div className="mx-auto max-w-7xl"><header className="flex flex-wrap items-start justify-between gap-5"><div><p className="text-sm font-bold uppercase tracking-[0.2em] text-blue-700">Private first-party analytics</p><h1 className="mt-2 text-4xl font-bold tracking-tight">DocSprintHub Analytics</h1><p className="mt-3 max-w-2xl leading-7 text-slate-600">Anonymous, aggregate usage data only. No document content, feedback, names, emails, IP addresses, or user-agent strings are stored.</p></div><div className="flex items-center gap-3"><Link href="/" className="rounded-xl px-3 py-2 text-sm font-bold text-blue-700 hover:bg-blue-50">View site</Link><LogoutButton /></div></header>

  <section className="mt-8 grid gap-4 sm:grid-cols-2 xl:grid-cols-5"><SummaryCard label="Today" value={report.visitors.today} /><SummaryCard label="Yesterday" value={report.visitors.yesterday} /><SummaryCard label="Last 7 Days" value={report.visitors.last7Days} /><SummaryCard label="Last 30 Days" value={report.visitors.last30Days} /><SummaryCard label="All Time" value={report.visitors.allTime} /></section>

  <section className="mt-6 grid gap-6 lg:grid-cols-[1.4fr_0.6fr]"><Section title="Visitors over the last 7 days" description="Daily unique visitors in the configured analytics time zone."><DailyChart values={report.dailyVisitors} /></Section><Section title="New vs returning" description="Unique visitors active in the last 30 days."><div className="grid grid-cols-2 gap-4"><div className="rounded-xl bg-blue-50 p-5"><p className="text-sm font-semibold text-blue-900">New</p><p className="mt-2 text-3xl font-bold text-blue-950">{format(report.visitors.newLast30Days)}</p></div><div className="rounded-xl bg-violet-50 p-5"><p className="text-sm font-semibold text-violet-900">Returning</p><p className="mt-2 text-3xl font-bold text-violet-950">{format(report.visitors.returningLast30Days)}</p></div></div></Section></section>

  <section className="mt-6 grid gap-6 lg:grid-cols-2"><Section title="Top pages" description="Page views by public route."><BarList items={report.topPages} valueLabel="views" /></Section><Section title="Tools" description="All recorded tool activity; visitor counts are distinct anonymous visitors."><ToolTable tools={report.tools} /></Section></section>

  <section className="mt-6 grid gap-6 lg:grid-cols-2"><Section title="Selected templates" description="Resume and cover-page templates selected by visitors."><BarList items={report.templates} valueLabel="selections" /></Section><Section title="Selected categories" description="Cover-page template categories visitors opened."><BarList items={report.categories} valueLabel="selections" /></Section></section>

  <section className="mt-6 grid gap-6 lg:grid-cols-2"><Section title="PDF tool actions" description="PDF tools selected before processing files locally."><BarList items={report.actions} valueLabel="uses" /></Section><Section title="Downloads" description="Files whose download was started in the browser."><BarList items={report.downloads} valueLabel="downloads" /></Section></section>

  <section className="mt-6 grid gap-6 lg:grid-cols-3"><Section title="Devices" description="Calculated from viewport width; no user-agent is stored."><BarList items={report.devices} valueLabel="views" /></Section><Section title="Traffic sources" description="Only source category is stored, never the referring URL."><BarList items={report.sources} valueLabel="views" /></Section><Section title="Country / region" description="Only aggregated deployment-provided location codes when available; IP addresses are not stored."><BarList items={report.locations} valueLabel="views" /></Section></section>
  </div></main>;
}
