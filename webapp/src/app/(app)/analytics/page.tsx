"use client";
import { useQuery } from "@tanstack/react-query";
import apiClient from "@/lib/api";
import type { Dashboard } from "@/types";
import Link from "next/link";

async function fetchDashboards() {
    const { data } = await apiClient.get<Dashboard[]>("/analytics/dashboards/");
    return data;
}

export default function AnalyticsPage() {
    const { data, isLoading } = useQuery({ queryKey: ["dashboards"], queryFn: fetchDashboards });

    return (
        <div>
            <h1 className="text-2xl font-bold text-gray-900 mb-6">Analytics</h1>
            {isLoading ? (
                <p className="text-gray-500">Loading…</p>
            ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    {data?.map((d) => (
                        <Link
                            key={d.id}
                            href={`/analytics/dashboards/${d.id}`}
                            className="bg-white rounded-2xl shadow p-6 hover:shadow-md transition"
                        >
                            <h2 className="font-semibold text-gray-900">{d.name}</h2>
                            {d.is_default && (
                                <span className="mt-2 inline-block px-2 py-0.5 bg-primary-100 text-primary-700 text-xs rounded-full">Default</span>
                            )}
                        </Link>
                    ))}
                    {!data?.length && <p className="text-gray-500">No dashboards yet.</p>}
                </div>
            )}
        </div>
    );
}
