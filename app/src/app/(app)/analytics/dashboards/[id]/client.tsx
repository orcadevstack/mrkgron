"use client";

import { useParams } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import apiClient from "@/lib/api";
import Link from "next/link";
import type { Dashboard, Widget } from "@/types";

async function fetchDashboard(id: string) {
  const [dashboard, widgets] = await Promise.all([
    apiClient.get<Dashboard>(`/analytics/dashboards/${id}/`),
    apiClient.get<{ results: Widget[] }>(`/analytics/dashboards/${id}/widgets/`).catch(() => ({ data: { results: [] as Widget[] } })),
  ]);

  return {
    dashboard: dashboard.data,
    widgets: widgets.data.results ?? [],
  };
}

export default function DashboardDetailClient() {
  const params = useParams();
  const id = String(params.id);
  const { data, isLoading } = useQuery({ queryKey: ["dashboard-detail", id], queryFn: () => fetchDashboard(id) });

  return (
    <div className="space-y-6">
      <section className="app-surface p-8 lg:p-10">
        <p className="page-eyebrow">Analytics Detail</p>
        <h2 className="page-title">{isLoading ? "Loading dashboard..." : data?.dashboard.name ?? "Dashboard"}</h2>
        <p className="page-copy">Inspect dashboard structure and widget configuration in a cleaner operator view.</p>
        <Link href="/analytics" className="mt-5 inline-flex text-sm font-semibold text-brand-accent hover:text-brand-blue">Back to analytics</Link>
      </section>
      <section className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
        {(data?.widgets ?? []).map((widget) => (
          <article key={widget.id} className="app-panel p-6">
            <p className="text-xs uppercase tracking-[0.18em] text-slate-400">Widget</p>
            <h3 className="mt-3 text-lg font-bold text-brand-dark">{widget.title}</h3>
            <p className="mt-2 text-sm text-slate-500">Type: {widget.widget_type}</p>
            <p className="mt-4 rounded-2xl bg-slate-50 px-4 py-3 font-mono text-xs text-slate-500">Position {widget.position}</p>
          </article>
        ))}
        {!isLoading && !(data?.widgets.length) && (
          <div className="app-panel p-6 text-sm text-slate-500">No widgets were returned for this dashboard.</div>
        )}
      </section>
    </div>
  );
}
