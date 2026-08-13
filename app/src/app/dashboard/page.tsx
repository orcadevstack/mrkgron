"use client";
import { useQuery } from "@tanstack/react-query";
import apiClient from "@/lib/api";
import Link from "next/link";
import type { PaginatedResponse, Customer, Campaign, Order, Metric } from "@/types";
import { Users, Mail, ShoppingCart, TrendingUp, ArrowRight, Activity } from "lucide-react";

async function fetchSummary() {
    const [customers, campaigns, orders, metrics] = await Promise.all([
        apiClient.get<PaginatedResponse<Customer>>("/crm/customers/?page_size=5"),
        apiClient.get<PaginatedResponse<Campaign>>("/communications/campaigns/?page_size=5"),
        apiClient.get<PaginatedResponse<Order>>("/commerce/orders/?page_size=5"),
        apiClient.get<Metric[]>("/analytics/metrics/?period=daily&limit=5"),
    ]);
    return {
        totalCustomers: customers.data.count,
        totalCampaigns: campaigns.data.count,
        totalOrders: orders.data.count,
        recentMetrics: metrics.data,
        recentCustomers: customers.data.results,
        recentCampaigns: campaigns.data.results,
        recentOrders: orders.data.results,
    };
}

type DashboardSummary = Awaited<ReturnType<typeof fetchSummary>>;

const statCards = [
    {
        label: "Total Customers",
        key: "totalCustomers" as const,
        icon: Users,
        color: "bg-blue-500/10 text-blue-600",
        borderColor: "border-blue-100",
        href: "/crm",
    },
    {
        label: "Active Campaigns",
        key: "totalCampaigns" as const,
        icon: Mail,
        color: "bg-purple-500/10 text-purple-600",
        borderColor: "border-purple-100",
        href: "/communications",
    },
    {
        label: "Total Orders",
        key: "totalOrders" as const,
        icon: ShoppingCart,
        color: "bg-green-500/10 text-green-600",
        borderColor: "border-green-100",
        href: "/commerce",
    },
] satisfies ReadonlyArray<{
    label: string;
    key: keyof Pick<DashboardSummary, "totalCustomers" | "totalCampaigns" | "totalOrders">;
    icon: React.ElementType;
    color: string;
    borderColor: string;
    href: string;
}>;

const campaignStatusColor: Record<string, string> = {
    draft: "bg-gray-100 text-gray-600",
    scheduled: "bg-yellow-100 text-yellow-700",
    active: "bg-green-100 text-green-700",
    paused: "bg-orange-100 text-orange-700",
    completed: "bg-blue-100 text-blue-700",
    cancelled: "bg-red-100 text-red-600",
};

export default function DashboardPage() {
    const { data, isLoading, isError } = useQuery({
        queryKey: ["dashboard-summary"],
        queryFn: fetchSummary,
        retry: 1,
    });

    return (
        <div className="space-y-6" id="main-content">
            {/* Header banner */}
            <section className="app-surface p-8 lg:p-10">
                <p className="page-eyebrow">Executive Overview</p>
                <h2 className="page-title">Operational performance at a glance</h2>
                <p className="page-copy">
                    Track customer growth, campaign volume, and commercial activity from one leadership summary.
                </p>
            </section>

            {/* Stat cards */}
            <div className="grid grid-cols-1 gap-5 sm:grid-cols-3">
                {statCards.map(({ label, key, icon: Icon, color, borderColor, href }) => (
                    <Link
                        key={key}
                        href={href}
                        className={`app-panel flex items-center gap-4 p-6 transition hover:-translate-y-0.5 hover:shadow-md ${borderColor}`}
                    >
                        <div className={`flex h-12 w-12 items-center justify-center rounded-2xl ${color}`}>
                            <Icon size={22} />
                        </div>
                        <div>
                            <p className="text-3xl font-bold text-brand-dark">
                                {isLoading ? (
                                    <span className="inline-block h-8 w-16 animate-pulse rounded-lg bg-slate-100" />
                                ) : isError ? (
                                    "—"
                                ) : (
                                    (data?.[key] ?? 0).toLocaleString()
                                )}
                            </p>
                            <p className="text-sm text-slate-500">{label}</p>
                        </div>
                    </Link>
                ))}
            </div>

            {/* Recent activity grid */}
            <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
                {/* Recent Customers */}
                <section className="app-panel overflow-hidden">
                    <div className="flex items-center justify-between border-b border-slate-100 px-6 py-4">
                        <h3 className="flex items-center gap-2 text-sm font-semibold text-brand-dark">
                            <Users size={15} className="text-brand-accent" />
                            Recent Customers
                        </h3>
                        <Link href="/crm" className="flex items-center gap-1 text-xs font-semibold text-brand-accent hover:text-brand-blue">
                            View all <ArrowRight size={12} />
                        </Link>
                    </div>
                    {isLoading ? (
                        <div className="space-y-3 p-6">
                            {[1, 2, 3].map((i) => (
                                <div key={i} className="flex items-center gap-3">
                                    <div className="h-8 w-8 animate-pulse rounded-full bg-slate-100" />
                                    <div className="flex-1 space-y-1.5">
                                        <div className="h-3 w-32 animate-pulse rounded bg-slate-100" />
                                        <div className="h-2.5 w-48 animate-pulse rounded bg-slate-50" />
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : !data?.recentCustomers?.length ? (
                        <p className="px-6 py-8 text-center text-sm text-slate-400">No customers yet.</p>
                    ) : (
                        <ul className="divide-y divide-slate-50">
                            {data.recentCustomers.map((c) => (
                                <li key={c.id} className="flex items-center justify-between px-6 py-3 hover:bg-slate-50">
                                    <div className="flex items-center gap-3">
                                        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-brand-accent/10 text-xs font-bold text-brand-blue">
                                            {c.first_name?.[0]?.toUpperCase()}{c.last_name?.[0]?.toUpperCase()}
                                        </div>
                                        <div>
                                            <p className="text-sm font-medium text-brand-dark">{c.first_name} {c.last_name}</p>
                                            <p className="text-xs text-slate-400">{c.email}</p>
                                        </div>
                                    </div>
                                    <span className="status-chip bg-brand-accent/10 text-brand-blue capitalize">{c.status}</span>
                                </li>
                            ))}
                        </ul>
                    )}
                </section>

                {/* Recent Campaigns */}
                <section className="app-panel overflow-hidden">
                    <div className="flex items-center justify-between border-b border-slate-100 px-6 py-4">
                        <h3 className="flex items-center gap-2 text-sm font-semibold text-brand-dark">
                            <Mail size={15} className="text-brand-accent" />
                            Recent Campaigns
                        </h3>
                        <Link href="/communications" className="flex items-center gap-1 text-xs font-semibold text-brand-accent hover:text-brand-blue">
                            View all <ArrowRight size={12} />
                        </Link>
                    </div>
                    {isLoading ? (
                        <div className="space-y-3 p-6">
                            {[1, 2, 3].map((i) => (
                                <div key={i} className="h-10 animate-pulse rounded-xl bg-slate-100" />
                            ))}
                        </div>
                    ) : !data?.recentCampaigns?.length ? (
                        <p className="px-6 py-8 text-center text-sm text-slate-400">No campaigns yet.</p>
                    ) : (
                        <ul className="divide-y divide-slate-50">
                            {data.recentCampaigns.map((c) => (
                                <li key={c.id} className="flex items-center justify-between px-6 py-3 hover:bg-slate-50">
                                    <div>
                                        <p className="text-sm font-medium text-brand-dark">{c.name}</p>
                                        <p className="text-xs capitalize text-slate-400">{c.channel_type}</p>
                                    </div>
                                    <span className={`rounded-full px-2.5 py-1 text-xs font-medium capitalize ${campaignStatusColor[c.status] ?? "bg-gray-100 text-gray-500"}`}>
                                        {c.status}
                                    </span>
                                </li>
                            ))}
                        </ul>
                    )}
                </section>

                {/* Recent Orders */}
                <section className="app-panel overflow-hidden">
                    <div className="flex items-center justify-between border-b border-slate-100 px-6 py-4">
                        <h3 className="flex items-center gap-2 text-sm font-semibold text-brand-dark">
                            <ShoppingCart size={15} className="text-brand-accent" />
                            Recent Orders
                        </h3>
                        <Link href="/commerce" className="flex items-center gap-1 text-xs font-semibold text-brand-accent hover:text-brand-blue">
                            View all <ArrowRight size={12} />
                        </Link>
                    </div>
                    {isLoading ? (
                        <div className="space-y-3 p-6">
                            {[1, 2, 3].map((i) => (
                                <div key={i} className="h-10 animate-pulse rounded-xl bg-slate-100" />
                            ))}
                        </div>
                    ) : !data?.recentOrders?.length ? (
                        <p className="px-6 py-8 text-center text-sm text-slate-400">No orders yet.</p>
                    ) : (
                        <ul className="divide-y divide-slate-50">
                            {data.recentOrders.map((o) => (
                                <li key={o.id} className="flex items-center justify-between px-6 py-3 hover:bg-slate-50">
                                    <div>
                                        <p className="font-mono text-xs font-medium text-brand-dark">{o.order_number}</p>
                                        <p className="text-xs capitalize text-slate-400">{o.status}</p>
                                    </div>
                                    <p className="text-sm font-semibold text-brand-dark">${parseFloat(o.total_amount).toFixed(2)}</p>
                                </li>
                            ))}
                        </ul>
                    )}
                </section>

                {/* Metrics panel */}
                <section className="app-panel overflow-hidden">
                    <div className="flex items-center justify-between border-b border-slate-100 px-6 py-4">
                        <h3 className="flex items-center gap-2 text-sm font-semibold text-brand-dark">
                            <TrendingUp size={15} className="text-brand-accent" />
                            Recent Metrics
                        </h3>
                        <Link href="/analytics" className="flex items-center gap-1 text-xs font-semibold text-brand-accent hover:text-brand-blue">
                            Analytics <ArrowRight size={12} />
                        </Link>
                    </div>
                    {isLoading ? (
                        <div className="space-y-3 p-6">
                            {[1, 2, 3].map((i) => (
                                <div key={i} className="h-10 animate-pulse rounded-xl bg-slate-100" />
                            ))}
                        </div>
                    ) : !data?.recentMetrics?.length ? (
                        <div className="flex flex-col items-center gap-3 px-6 py-10">
                            <Activity size={28} className="text-slate-300" />
                            <p className="text-sm text-slate-400">No metrics recorded yet.</p>
                            <Link href="/analytics" className="text-xs font-semibold text-brand-accent hover:text-brand-blue">
                                Open Analytics
                            </Link>
                        </div>
                    ) : (
                        <ul className="divide-y divide-slate-50">
                            {data.recentMetrics.map((m) => (
                                <li key={m.id} className="flex items-center justify-between px-6 py-3 hover:bg-slate-50">
                                    <p className="text-sm font-medium text-brand-dark capitalize">{m.name.replace(/_/g, " ")}</p>
                                    <p className="font-mono text-sm font-semibold text-brand-blue">{m.value.toLocaleString()}</p>
                                </li>
                            ))}
                        </ul>
                    )}
                </section>
            </div>
        </div>
    );
}

