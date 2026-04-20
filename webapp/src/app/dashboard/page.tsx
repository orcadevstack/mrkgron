"use client";
import { useQuery } from "@tanstack/react-query";
import apiClient from "@/lib/api";
import type { PaginatedResponse, Customer, Campaign, Order, Metric } from "@/types";

async function fetchSummary() {
    const [customers, campaigns, orders, metrics] = await Promise.all([
        apiClient.get<PaginatedResponse<Customer>>("/crm/customers/?page_size=1"),
        apiClient.get<PaginatedResponse<Campaign>>("/communications/campaigns/?page_size=1"),
        apiClient.get<PaginatedResponse<Order>>("/commerce/orders/?page_size=1"),
        apiClient.get<Metric[]>("/analytics/metrics/?period=daily&limit=5"),
    ]);
    return {
        totalCustomers: customers.data.count,
        totalCampaigns: campaigns.data.count,
        totalOrders: orders.data.count,
        recentMetrics: metrics.data,
    };
}

type DashboardSummary = Awaited<ReturnType<typeof fetchSummary>>;

const statCards = [
    { label: "Total Customers", key: "totalCustomers", color: "bg-blue-500" },
    { label: "Campaigns", key: "totalCampaigns", color: "bg-purple-500" },
    { label: "Orders", key: "totalOrders", color: "bg-green-500" },
] as const satisfies ReadonlyArray<{
    label: string;
    key: keyof Pick<DashboardSummary, "totalCustomers" | "totalCampaigns" | "totalOrders">;
    color: string;
}>;

export default function DashboardPage() {
    const { data, isLoading } = useQuery({ queryKey: ["dashboard-summary"], queryFn: fetchSummary });

    return (
        <div className="space-y-6">
            <section className="app-surface p-8 lg:p-10">
                <p className="page-eyebrow">Executive Overview</p>
                <h2 className="page-title">Operational performance at a glance</h2>
                <p className="page-copy">
                    Track customer growth, campaign volume, and commercial activity from one leadership summary.
                </p>
            </section>
            {isLoading ? (
                <p className="app-panel px-6 py-10 text-sm text-slate-500">Loading dashboard summary...</p>
            ) : (
                <div className="grid grid-cols-1 gap-6 sm:grid-cols-3">
                    {statCards.map(({ label, key, color }) => (
                        <div key={key} className="app-panel flex items-center gap-4 p-6">
                            <div className={`h-12 w-12 rounded-2xl ${color} opacity-90`} />
                            <div>
                                <p className="text-3xl font-bold text-brand-dark">{data?.[key] ?? "—"}</p>
                                <p className="text-sm text-slate-500">{label}</p>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
