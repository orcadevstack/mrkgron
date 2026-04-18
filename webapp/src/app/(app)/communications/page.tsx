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
        <div>
            <div className="flex items-center justify-between mb-6">
                <h1 className="text-2xl font-bold text-gray-900">Campaigns</h1>
                <Link href="/communications/new" className="bg-primary-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-primary-700 transition">
                    New Campaign
                </Link>
            </div>
            {isLoading ? (
                <p className="text-gray-500">Loading…</p>
            ) : (
                <div className="bg-white rounded-2xl shadow overflow-hidden">
                    <table className="w-full text-sm text-left">
                        <thead className="bg-gray-50 text-gray-500 uppercase text-xs">
                            <tr>
                                {["Name", "Channel", "Status", "Sent", "Open Rate", "Click Rate", "Created"].map((h) => (
                                    <th key={h} className="px-4 py-3 font-medium">{h}</th>
                                ))}
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            {data?.results.map((c) => (
                                <tr key={c.id} className="hover:bg-gray-50">
                                    <td className="px-4 py-3 font-medium text-primary-600">{c.name}</td>
                                    <td className="px-4 py-3 capitalize text-gray-600">{c.channel_type}</td>
                                    <td className="px-4 py-3">
                                        <span className={`px-2 py-0.5 rounded-full text-xs font-medium capitalize ${statusColor[c.status] ?? ""}`}>{c.status}</span>
                                    </td>
                                    <td className="px-4 py-3 text-gray-600">{c.sent_count.toLocaleString()}</td>
                                    <td className="px-4 py-3 text-gray-600">{(c.open_rate * 100).toFixed(1)}%</td>
                                    <td className="px-4 py-3 text-gray-600">{(c.click_rate * 100).toFixed(1)}%</td>
                                    <td className="px-4 py-3 text-gray-400">{new Date(c.created_at).toLocaleDateString()}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                    {data?.count === 0 && <p className="text-center text-gray-500 py-8">No campaigns yet.</p>}
                </div>
            )}
        </div>
    );
}
