"use client";
import { useQuery } from "@tanstack/react-query";
import apiClient from "@/lib/api";
import type { PaginatedResponse, Campaign } from "@/types";
import Link from "next/link";

async function fetchCampaigns() {
    const { data } = await apiClient.get<PaginatedResponse<Campaign>>("/communications/campaigns/?page_size=20");
    return data;
}

const statusColor: Record<string, string> = {
    draft: "bg-gray-100 text-gray-600",
    scheduled: "bg-yellow-100 text-yellow-700",
    active: "bg-green-100 text-green-700",
    paused: "bg-orange-100 text-orange-700",
    completed: "bg-blue-100 text-blue-700",
    cancelled: "bg-red-100 text-red-600",
};

export default function CommunicationsPage() {
    const { data, isLoading } = useQuery({ queryKey: ["campaigns"], queryFn: fetchCampaigns });

    return (
        <div className="space-y-6">
            <section className="app-surface p-8 lg:p-10">
                <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
                    <div>
                        <p className="page-eyebrow">Communications</p>
                        <h2 className="page-title">Campaign command center</h2>
                        <p className="page-copy">Launch, monitor, and review campaign performance from a cleaner operational table.</p>
                    </div>
                    <Link href="/communications/new" className="btn-primary">
                    New Campaign
                </Link>
                </div>
            </section>
            {isLoading ? (
                <p className="app-panel px-6 py-10 text-sm text-slate-500">Loading campaigns...</p>
            ) : (
                <div className="app-panel overflow-hidden">
                    <table className="app-table">
                        <thead>
                            <tr>
                                {["Name", "Channel", "Status", "Sent", "Open Rate", "Click Rate", "Created"].map((h) => (
                                    <th key={h} className="px-4 py-3 font-medium">{h}</th>
                                ))}
                            </tr>
                        </thead>
                        <tbody>
                            {data?.results.map((c) => (
                                <tr key={c.id} className="hover:bg-slate-50">
                                    <td className="px-4 py-3 font-medium text-brand-blue">{c.name}</td>
                                    <td className="px-4 py-3 capitalize text-slate-600">{c.channel_type}</td>
                                    <td className="px-4 py-3">
                                        <span className={`px-2 py-0.5 rounded-full text-xs font-medium capitalize ${statusColor[c.status] ?? ""}`}>{c.status}</span>
                                    </td>
                                    <td className="px-4 py-3 text-slate-600">{c.sent_count.toLocaleString()}</td>
                                    <td className="px-4 py-3 text-slate-600">{(c.open_rate * 100).toFixed(1)}%</td>
                                    <td className="px-4 py-3 text-slate-600">{(c.click_rate * 100).toFixed(1)}%</td>
                                    <td className="px-4 py-3 text-slate-400">{new Date(c.created_at).toLocaleDateString()}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                    {data?.count === 0 && <p className="py-8 text-center text-slate-500">No campaigns yet.</p>}
                </div>
            )}
        </div>
    );
}
