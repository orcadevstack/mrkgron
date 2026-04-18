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

const statCards = [
    { label: "Total Customers", key: "totalCustomers", color: "bg-blue-500" },
    { label: "Campaigns", key: "totalCampaigns", color: "bg-purple-500" },
    { label: "Orders", key: "totalOrders", color: "bg-green-500" },
];

export default function DashboardPage() {
    const { data, isLoading } = useQuery({ queryKey: ["dashboard-summary"], queryFn: fetchSummary });

    return (
        <div>
            <h1 className="text-2xl font-bold text-gray-900 mb-6">Dashboard</h1>
            {isLoading ? (
                <p className="text-gray-500">Loading…</p>
            ) : (
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-10">
                    {statCards.map(({ label, key, color }) => (
                        <div key={key} className="bg-white rounded-2xl shadow p-6 flex items-center gap-4">
                            <div className={`w-12 h-12 rounded-xl ${color} opacity-80`} />
                            <div>
                                <p className="text-3xl font-bold text-gray-900">{data?.[key as keyof typeof data] ?? "—"}</p>
                                <p className="text-sm text-gray-500">{label}</p>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
