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
        <div className="space-y-6">
            <section className="app-surface p-8 lg:p-10">
                <p className="page-eyebrow">Analytics Workspace</p>
                <h2 className="page-title">Dashboards and measurement views</h2>
                <p className="page-copy">Open the dashboards your teams use to track customer behavior, campaign performance, and business outcomes.</p>
            </section>
            {isLoading ? (
                <p className="app-panel px-6 py-10 text-sm text-slate-500">Loading dashboards...</p>
            ) : (
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                    {data?.map((d) => (
                        <Link
                            key={d.id}
                            href={`/analytics/dashboards/${d.id}`}
                            className="app-panel p-6 transition hover:-translate-y-0.5 hover:border-brand-accent/30 hover:shadow-md"
                        >
                            <h2 className="font-semibold text-brand-dark">{d.name}</h2>
                            {d.is_default && (
                                <span className="status-chip mt-3 bg-brand-accent/10 text-brand-blue">Default</span>
                            )}
                        </Link>
                    ))}
                    {!data?.length && <p className="app-panel p-6 text-sm text-slate-500">No dashboards yet.</p>}
                </div>
            )}
        </div>
    );
}
