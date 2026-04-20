"use client";
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import apiClient from "@/lib/api";
import type { Dashboard, Metric, PaginatedResponse } from "@/types";
import Link from "next/link";
import {
    BarChart3, TrendingUp, Users, Activity, Zap, FileText,
    LayoutDashboard, Plus, ArrowRight, Calendar, RefreshCw,
} from "lucide-react";

// ─── Types ──────────────────────────────────────────────────────────────────

interface AnalyticsSummary {
    customer_count: number;
    active_customers: number;
    total_events: number;
    total_revenue: number;
}

interface AnalyticsEvent {
    id: string;
    event_name: string;
    category: string;
    occurred_at: string;
    url: string;
    referrer: string;
}

interface Report {
    id: string;
    name: string;
    status: string;
    report_type: string;
    created_at: string;
}

// ─── API fetchers ────────────────────────────────────────────────────────────

async function fetchSummary() {
    const { data } = await apiClient.get<AnalyticsSummary>("/analytics/summary/");
    return data;
}

async function fetchDashboards() {
    const { data } = await apiClient.get<PaginatedResponse<Dashboard>>("/analytics/dashboards/?page_size=6");
    return data.results ?? [];
}

async function fetchMetrics() {
    const { data } = await apiClient.get<PaginatedResponse<Metric>>("/analytics/metrics/?page_size=8");
    return data.results ?? [];
}

async function fetchEvents() {
    const { data } = await apiClient.get<PaginatedResponse<AnalyticsEvent>>("/analytics/events/?page_size=10");
    return data.results ?? [];
}

async function fetchReports() {
    const { data } = await apiClient.get<PaginatedResponse<Report>>("/analytics/reports/?page_size=6");
    return data.results ?? [];
}

// ─── Sparkline (pure SVG) ────────────────────────────────────────────────────

function Sparkline({ values, color = "#6366f1" }: { values: number[]; color?: string }) {
    if (!values.length) return null;
    const max = Math.max(...values, 1);
    const w = 80, h = 32;
    const pts = values.map((v, i) => `${(i / (values.length - 1)) * w},${h - (v / max) * h}`).join(" ");
    return (
        <svg width={w} height={h} viewBox={`0 0 ${w} ${h}`} fill="none" aria-hidden="true">
            <polyline points={pts} stroke={color} strokeWidth="2" strokeLinejoin="round" strokeLinecap="round" />
        </svg>
    );
}

// ─── Bar chart (pure SVG) ─────────────────────────────────────────────────────

const weeklyBars = [38, 52, 45, 68, 74, 61, 83];
const weekLabels = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

function WeeklyBarChart() {
    const max = Math.max(...weeklyBars);
    return (
        <div className="flex items-end gap-2 h-28 w-full" aria-label="Weekly events chart">
            {weeklyBars.map((v, i) => (
                <div key={i} className="flex flex-1 flex-col items-center gap-1">
                    <div
                        className="w-full rounded-t-md bg-gradient-to-t from-brand-accent/80 to-brand-blue/70 transition-all"
                        style={{ height: `${(v / max) * 100}%` }}
                        title={`${weekLabels[i]}: ${v} events`}
                    />
                    <span className="text-[10px] text-slate-400">{weekLabels[i]}</span>
                </div>
            ))}
        </div>
    );
}

// ─── Skeleton ────────────────────────────────────────────────────────────────

function Skeleton({ className = "" }: { className?: string }) {
    return <div className={`animate-pulse rounded-xl bg-slate-100 ${className}`} />;
}

// ─── KPI Cards ───────────────────────────────────────────────────────────────

const kpiConfig = [
    {
        key: "customer_count" as const,
        label: "Total Customers",
        icon: Users,
        color: "text-brand-blue",
        bg: "bg-brand-blue/8",
        format: (v: number) => v.toLocaleString(),
        trend: [28, 34, 31, 38, 42, 40, 45],
        trendColor: "#6366f1",
        delta: "+8.2%",
        deltaUp: true,
    },
    {
        key: "active_customers" as const,
        label: "Active Customers",
        icon: Activity,
        color: "text-emerald-600",
        bg: "bg-emerald-500/8",
        format: (v: number) => v.toLocaleString(),
        trend: [20, 22, 25, 23, 28, 27, 31],
        trendColor: "#10b981",
        delta: "+5.1%",
        deltaUp: true,
    },
    {
        key: "total_events" as const,
        label: "Total Events",
        icon: Zap,
        color: "text-amber-600",
        bg: "bg-amber-500/8",
        format: (v: number) => v.toLocaleString(),
        trend: [120, 145, 138, 162, 175, 160, 184],
        trendColor: "#f59e0b",
        delta: "+12.4%",
        deltaUp: true,
    },
    {
        key: "total_revenue" as const,
        label: "Total Revenue",
        icon: TrendingUp,
        color: "text-brand-accent",
        bg: "bg-brand-accent/8",
        format: (v: number) => `$${v.toLocaleString("en-US", { minimumFractionDigits: 2 })}`,
        trend: [4200, 4800, 4600, 5200, 5600, 5400, 5900],
        trendColor: "#8b5cf6",
        delta: "+6.8%",
        deltaUp: true,
    },
];

// ─── Tab type ─────────────────────────────────────────────────────────────────

type Tab = "overview" | "events" | "metrics" | "dashboards" | "reports";

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function AnalyticsPage() {
    const [tab, setTab] = useState<Tab>("overview");

    const { data: summary, isLoading: loadingSummary } = useQuery({
        queryKey: ["analytics-summary"],
        queryFn: fetchSummary,
    });
    const { data: dashboards, isLoading: loadingDashboards } = useQuery({
        queryKey: ["dashboards"],
        queryFn: fetchDashboards,
        enabled: tab === "overview" || tab === "dashboards",
    });
    const { data: metrics, isLoading: loadingMetrics } = useQuery({
        queryKey: ["metrics"],
        queryFn: fetchMetrics,
        enabled: tab === "overview" || tab === "metrics",
    });
    const { data: events, isLoading: loadingEvents } = useQuery({
        queryKey: ["analytics-events"],
        queryFn: fetchEvents,
        enabled: tab === "events",
    });
    const { data: reports, isLoading: loadingReports } = useQuery({
        queryKey: ["reports"],
        queryFn: fetchReports,
        enabled: tab === "reports",
    });

    const tabs: { id: Tab; label: string; icon: React.ElementType }[] = [
        { id: "overview", label: "Overview", icon: BarChart3 },
        { id: "events", label: "Events", icon: Zap },
        { id: "metrics", label: "Metrics", icon: Activity },
        { id: "dashboards", label: "Dashboards", icon: LayoutDashboard },
        { id: "reports", label: "Reports", icon: FileText },
    ];

    return (
        <div className="space-y-6">
            {/* Header */}
            <section className="app-surface p-6 lg:p-8">
                <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                        <p className="page-eyebrow">Analytics Workspace</p>
                        <h1 className="page-title mt-1">Data, Insights & Intelligence</h1>
                        <p className="page-copy mt-1 max-w-xl">
                            Track customer behavior, campaign performance, and revenue outcomes across all channels in real time.
                        </p>
                    </div>
                    <div className="flex flex-wrap gap-2">
                        <button className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-600 hover:bg-slate-50">
                            <Calendar size={14} />
                            Last 7 days
                        </button>
                        <button className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-600 hover:bg-slate-50">
                            <RefreshCw size={14} />
                            Refresh
                        </button>
                    </div>
                </div>
            </section>

            {/* KPI Cards */}
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
                {kpiConfig.map((kpi) => {
                    const Icon = kpi.icon;
                    const value = summary?.[kpi.key] ?? 0;
                    return (
                        <div key={kpi.key} className="app-panel p-5">
                            <div className="flex items-start justify-between">
                                <div className={`flex h-9 w-9 items-center justify-center rounded-xl ${kpi.bg}`}>
                                    <Icon size={18} className={kpi.color} />
                                </div>
                                {!loadingSummary && (
                                    <span className={`text-xs font-semibold ${kpi.deltaUp ? "text-emerald-600" : "text-red-500"}`}>
                                        {kpi.delta}
                                    </span>
                                )}
                            </div>
                            {loadingSummary ? (
                                <>
                                    <Skeleton className="mt-4 h-7 w-24" />
                                    <Skeleton className="mt-2 h-4 w-32" />
                                </>
                            ) : (
                                <>
                                    <p className="mt-4 text-2xl font-bold tracking-tight text-brand-dark">
                                        {kpi.format(value)}
                                    </p>
                                    <p className="mt-1 text-sm text-slate-500">{kpi.label}</p>
                                </>
                            )}
                            <div className="mt-3">
                                <Sparkline values={kpi.trend} color={kpi.trendColor} />
                            </div>
                        </div>
                    );
                })}
            </div>

            {/* Tabs */}
            <div className="flex gap-1 overflow-x-auto rounded-2xl border border-slate-200 bg-slate-50 p-1 scrollbar-hide">
                {tabs.map((t) => {
                    const Icon = t.icon;
                    return (
                        <button
                            key={t.id}
                            onClick={() => setTab(t.id)}
                            className={`flex shrink-0 items-center gap-2 rounded-xl px-4 py-2 text-sm font-medium transition-colors ${
                                tab === t.id
                                    ? "bg-white text-brand-dark shadow-sm"
                                    : "text-slate-500 hover:text-brand-dark"
                            }`}
                        >
                            <Icon size={14} />
                            {t.label}
                        </button>
                    );
                })}
            </div>

            {/* ── Overview Tab ─────────────────────────────────────────── */}
            {tab === "overview" && (
                <div className="grid gap-6 lg:grid-cols-3">
                    {/* Weekly activity chart */}
                    <div className="app-panel p-6 lg:col-span-2">
                        <div className="mb-5 flex items-center justify-between">
                            <div>
                                <p className="text-xs font-semibold uppercase tracking-widest text-slate-400">Event Volume</p>
                                <h2 className="mt-1 text-lg font-bold text-brand-dark">Weekly Activity</h2>
                            </div>
                            <span className="rounded-full bg-brand-accent/10 px-3 py-1 text-xs font-semibold text-brand-accent">
                                This week
                            </span>
                        </div>
                        <WeeklyBarChart />
                    </div>

                    {/* Recent metrics */}
                    <div className="app-panel p-6">
                        <div className="mb-4 flex items-center justify-between">
                            <h2 className="font-bold text-brand-dark">Key Metrics</h2>
                            <button onClick={() => setTab("metrics")} className="text-xs font-medium text-brand-accent hover:text-brand-blue">
                                View all
                            </button>
                        </div>
                        {loadingMetrics ? (
                            <div className="space-y-3">
                                {[...Array(4)].map((_, i) => <Skeleton key={i} className="h-12" />)}
                            </div>
                        ) : metrics?.length ? (
                            <ul className="divide-y divide-slate-100">
                                {metrics.slice(0, 5).map((m) => (
                                    <li key={m.id} className="flex items-center justify-between py-2.5">
                                        <div>
                                            <p className="text-sm font-medium text-brand-dark">{m.name}</p>
                                            <p className="text-xs capitalize text-slate-400">{m.period}</p>
                                        </div>
                                        <span className="font-bold text-brand-dark">{m.value.toLocaleString()}</span>
                                    </li>
                                ))}
                            </ul>
                        ) : (
                            <div className="flex flex-col items-center justify-center py-8 text-center">
                                <Activity size={28} className="text-slate-300" />
                                <p className="mt-2 text-sm text-slate-400">No metrics yet</p>
                            </div>
                        )}
                    </div>

                    {/* Dashboards quick links */}
                    <div className="app-panel p-6">
                        <div className="mb-4 flex items-center justify-between">
                            <h2 className="font-bold text-brand-dark">Dashboards</h2>
                            <button onClick={() => setTab("dashboards")} className="text-xs font-medium text-brand-accent hover:text-brand-blue">
                                View all
                            </button>
                        </div>
                        {loadingDashboards ? (
                            <div className="space-y-3">
                                {[...Array(3)].map((_, i) => <Skeleton key={i} className="h-14" />)}
                            </div>
                        ) : dashboards?.length ? (
                            <ul className="space-y-2">
                                {dashboards.slice(0, 4).map((d) => (
                                    <li key={d.id}>
                                        <Link
                                            href={`/analytics/dashboards/${d.id}`}
                                            className="flex items-center justify-between rounded-xl border border-slate-100 p-3 hover:border-brand-accent/30 hover:bg-brand-accent/5"
                                        >
                                            <div className="flex items-center gap-2.5">
                                                <LayoutDashboard size={15} className="text-brand-accent" />
                                                <span className="text-sm font-medium text-brand-dark">{d.name}</span>
                                            </div>
                                            <ArrowRight size={13} className="text-slate-400" />
                                        </Link>
                                    </li>
                                ))}
                            </ul>
                        ) : (
                            <div className="flex flex-col items-center justify-center py-8 text-center">
                                <LayoutDashboard size={28} className="text-slate-300" />
                                <p className="mt-2 text-sm text-slate-400">No dashboards yet</p>
                                <p className="text-xs text-slate-300">Create one to visualize your data</p>
                            </div>
                        )}
                    </div>

                    {/* Reports summary */}
                    <div className="app-panel p-6 lg:col-span-2">
                        <div className="mb-4 flex items-center justify-between">
                            <h2 className="font-bold text-brand-dark">Recent Reports</h2>
                            <button onClick={() => setTab("reports")} className="text-xs font-medium text-brand-accent hover:text-brand-blue">
                                View all
                            </button>
                        </div>
                        <div className="flex flex-col items-center justify-center py-10 text-center">
                            <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-slate-100">
                                <FileText size={24} className="text-slate-400" />
                            </div>
                            <p className="mt-3 text-sm font-medium text-slate-600">No reports generated yet</p>
                            <p className="mt-1 max-w-xs text-xs text-slate-400">
                                Reports give you scheduled, formatted views of your analytics data. Create your first report to get started.
                            </p>
                            <button
                                onClick={() => setTab("reports")}
                                className="mt-4 inline-flex items-center gap-2 rounded-xl bg-brand-accent/10 px-4 py-2 text-sm font-semibold text-brand-accent hover:bg-brand-accent/20"
                            >
                                <Plus size={14} />
                                Create report
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* ── Events Tab ────────────────────────────────────────────── */}
            {tab === "events" && (
                <div className="app-panel overflow-hidden">
                    <div className="flex items-center justify-between border-b border-slate-100 px-6 py-4">
                        <div>
                            <h2 className="font-bold text-brand-dark">Event Stream</h2>
                            <p className="text-xs text-slate-400">Raw customer interaction events from all channels</p>
                        </div>
                        <button className="inline-flex items-center gap-2 rounded-xl bg-brand-accent px-4 py-2 text-sm font-semibold text-white hover:bg-brand-blue">
                            <Plus size={14} />
                            Track event
                        </button>
                    </div>
                    {loadingEvents ? (
                        <div className="space-y-3 p-6">
                            {[...Array(6)].map((_, i) => <Skeleton key={i} className="h-14" />)}
                        </div>
                    ) : events?.length ? (
                        <div className="divide-y divide-slate-100">
                            {events.map((ev) => (
                                <div key={ev.id} className="flex items-start gap-4 px-6 py-4 hover:bg-slate-50">
                                    <div className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-amber-50">
                                        <Zap size={14} className="text-amber-500" />
                                    </div>
                                    <div className="min-w-0 flex-1">
                                        <p className="text-sm font-semibold text-brand-dark">{ev.event_name}</p>
                                        <p className="mt-0.5 truncate text-xs text-slate-400">
                                            {ev.category && <span className="mr-2 capitalize">{ev.category}</span>}
                                            {ev.url && <span className="text-slate-300">{ev.url}</span>}
                                        </p>
                                    </div>
                                    <time className="shrink-0 text-xs text-slate-400">
                                        {new Date(ev.occurred_at).toLocaleString()}
                                    </time>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="flex flex-col items-center justify-center py-16 text-center">
                            <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-amber-50">
                                <Zap size={24} className="text-amber-400" />
                            </div>
                            <p className="mt-3 text-sm font-medium text-slate-600">No events tracked yet</p>
                            <p className="mt-1 text-xs text-slate-400">Events are ingested automatically when customers interact with your storefront or campaigns.</p>
                        </div>
                    )}
                </div>
            )}

            {/* ── Metrics Tab ───────────────────────────────────────────── */}
            {tab === "metrics" && (
                <div className="app-panel overflow-hidden">
                    <div className="flex items-center justify-between border-b border-slate-100 px-6 py-4">
                        <div>
                            <h2 className="font-bold text-brand-dark">Defined Metrics</h2>
                            <p className="text-xs text-slate-400">Computed aggregations over your event stream</p>
                        </div>
                        <button className="inline-flex items-center gap-2 rounded-xl bg-brand-accent px-4 py-2 text-sm font-semibold text-white hover:bg-brand-blue">
                            <Plus size={14} />
                            New metric
                        </button>
                    </div>
                    {loadingMetrics ? (
                        <div className="space-y-3 p-6">
                            {[...Array(5)].map((_, i) => <Skeleton key={i} className="h-16" />)}
                        </div>
                    ) : metrics?.length ? (
                        <div className="divide-y divide-slate-100">
                            {metrics.map((m) => (
                                <div key={m.id} className="flex items-center gap-4 px-6 py-4 hover:bg-slate-50">
                                    <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-indigo-50">
                                        <Activity size={16} className="text-indigo-500" />
                                    </div>
                                    <div className="min-w-0 flex-1">
                                        <p className="text-sm font-semibold text-brand-dark">{m.name}</p>
                                        <p className="text-xs capitalize text-slate-400">{m.period} · {m.period_start ? new Date(m.period_start).toLocaleDateString() : "—"}</p>
                                    </div>
                                    <span className="text-xl font-bold text-brand-dark">{m.value.toLocaleString()}</span>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="flex flex-col items-center justify-center py-16 text-center">
                            <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-indigo-50">
                                <Activity size={24} className="text-indigo-400" />
                            </div>
                            <p className="mt-3 text-sm font-medium text-slate-600">No metrics defined yet</p>
                            <p className="mt-1 text-xs text-slate-400">Define metrics to aggregate your events into meaningful KPIs for your team.</p>
                        </div>
                    )}
                </div>
            )}

            {/* ── Dashboards Tab ─────────────────────────────────────────── */}
            {tab === "dashboards" && (
                <div className="space-y-4">
                    <div className="flex items-center justify-between">
                        <h2 className="font-bold text-brand-dark">All Dashboards</h2>
                        <button className="inline-flex items-center gap-2 rounded-xl bg-brand-accent px-4 py-2 text-sm font-semibold text-white hover:bg-brand-blue">
                            <Plus size={14} />
                            New dashboard
                        </button>
                    </div>
                    {loadingDashboards ? (
                        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                            {[...Array(3)].map((_, i) => <Skeleton key={i} className="h-28" />)}
                        </div>
                    ) : dashboards?.length ? (
                        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                            {dashboards.map((d) => (
                                <Link
                                    key={d.id}
                                    href={`/analytics/dashboards/${d.id}`}
                                    className="app-panel group p-6 transition hover:-translate-y-0.5 hover:border-brand-accent/30 hover:shadow-md"
                                >
                                    <div className="flex items-start justify-between">
                                        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-brand-accent/10">
                                            <LayoutDashboard size={18} className="text-brand-accent" />
                                        </div>
                                        {d.is_default && (
                                            <span className="rounded-full bg-brand-accent/10 px-2.5 py-0.5 text-[11px] font-semibold text-brand-accent">Default</span>
                                        )}
                                    </div>
                                    <h3 className="mt-4 font-semibold text-brand-dark">{d.name}</h3>
                                    <div className="mt-3 flex items-center gap-1 text-xs font-medium text-brand-accent opacity-0 transition-opacity group-hover:opacity-100">
                                        Open dashboard <ArrowRight size={12} />
                                    </div>
                                </Link>
                            ))}
                        </div>
                    ) : (
                        <div className="app-panel flex flex-col items-center justify-center py-16 text-center">
                            <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-brand-accent/10">
                                <LayoutDashboard size={24} className="text-brand-accent" />
                            </div>
                            <p className="mt-3 text-sm font-medium text-slate-600">No dashboards yet</p>
                            <p className="mt-1 text-xs text-slate-400">Create a dashboard to arrange widgets and visualize your data.</p>
                        </div>
                    )}
                </div>
            )}

            {/* ── Reports Tab ──────────────────────────────────────────────── */}
            {tab === "reports" && (
                <div className="app-panel overflow-hidden">
                    <div className="flex items-center justify-between border-b border-slate-100 px-6 py-4">
                        <div>
                            <h2 className="font-bold text-brand-dark">Reports</h2>
                            <p className="text-xs text-slate-400">Scheduled and on-demand analytics reports</p>
                        </div>
                        <button className="inline-flex items-center gap-2 rounded-xl bg-brand-accent px-4 py-2 text-sm font-semibold text-white hover:bg-brand-blue">
                            <Plus size={14} />
                            New report
                        </button>
                    </div>
                    {loadingReports ? (
                        <div className="space-y-3 p-6">
                            {[...Array(4)].map((_, i) => <Skeleton key={i} className="h-16" />)}
                        </div>
                    ) : reports?.length ? (
                        <div className="divide-y divide-slate-100">
                            {reports.map((r) => {
                                const statusColor: Record<string, string> = {
                                    completed: "bg-emerald-50 text-emerald-700",
                                    running: "bg-blue-50 text-blue-700",
                                    pending: "bg-amber-50 text-amber-700",
                                    failed: "bg-red-50 text-red-700",
                                };
                                return (
                                    <div key={r.id} className="flex items-center gap-4 px-6 py-4 hover:bg-slate-50">
                                        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-slate-100">
                                            <FileText size={16} className="text-slate-400" />
                                        </div>
                                        <div className="min-w-0 flex-1">
                                            <p className="text-sm font-semibold text-brand-dark">{r.name}</p>
                                            <p className="text-xs capitalize text-slate-400">{r.report_type} · {new Date(r.created_at).toLocaleDateString()}</p>
                                        </div>
                                        <span className={`rounded-full px-2.5 py-0.5 text-xs font-semibold capitalize ${statusColor[r.status] ?? "bg-slate-100 text-slate-600"}`}>
                                            {r.status}
                                        </span>
                                    </div>
                                );
                            })}
                        </div>
                    ) : (
                        <div className="flex flex-col items-center justify-center py-16 text-center">
                            <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-slate-100">
                                <FileText size={24} className="text-slate-400" />
                            </div>
                            <p className="mt-3 text-sm font-medium text-slate-600">No reports yet</p>
                            <p className="mt-1 text-xs text-slate-400">Generate a report to export and share your analytics data with stakeholders.</p>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}
