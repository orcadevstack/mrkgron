"use client";
import { useQuery } from "@tanstack/react-query";
import apiClient from "@/lib/api";

interface Workflow {
    id: string;
    name: string;
    status: string;
    created_at: string;
}

async function fetchWorkflows() {
    const { data } = await apiClient.get<{ results: Workflow[]; count: number }>("/automation/workflows/?page_size=20");
    return data;
}

const statusColor: Record<string, string> = {
    draft: "bg-gray-100 text-gray-600",
    active: "bg-green-100 text-green-700",
    paused: "bg-yellow-100 text-yellow-700",
    archived: "bg-red-100 text-red-600",
};

export default function AutomationPage() {
    const { data, isLoading } = useQuery({ queryKey: ["workflows"], queryFn: fetchWorkflows });

    return (
        <div className="space-y-6">
            <section className="app-surface p-8 lg:p-10">
                <p className="page-eyebrow">Automation</p>
                <h2 className="page-title">Workflow health and orchestration state</h2>
                <p className="page-copy">Review automation inventory, execution posture, and workflow lifecycle from the same disciplined operator layout used across the platform.</p>
            </section>
            {isLoading ? (
                <p className="app-panel px-6 py-10 text-sm text-slate-500">Loading workflows...</p>
            ) : (
                <div className="app-panel overflow-hidden">
                    <table className="app-table">
                        <thead>
                            <tr>
                                {["Name", "Status", "Created"].map((heading) => (
                                    <th key={heading}>{heading}</th>
                                ))}
                            </tr>
                        </thead>
                        <tbody>
                            {data?.results.map((w) => (
                                <tr key={w.id} className="hover:bg-slate-50">
                                    <td className="font-medium text-brand-dark">{w.name}</td>
                                    <td>
                                        <span className={`px-2 py-0.5 rounded-full text-xs font-medium capitalize ${statusColor[w.status] ?? ""}`}>{w.status}</span>
                                    </td>
                                    <td className="text-slate-400">{new Date(w.created_at).toLocaleDateString()}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                    {data?.count === 0 && <p className="py-8 text-center text-slate-500">No workflows yet.</p>}
                </div>
            )}
        </div>
    );
}
