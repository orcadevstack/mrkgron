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
        <div>
            <h1 className="text-2xl font-bold text-gray-900 mb-6">Automation Workflows</h1>
            {isLoading ? (
                <p className="text-gray-500">Loading…</p>
            ) : (
                <div className="bg-white rounded-2xl shadow overflow-hidden">
                    <table className="w-full text-sm text-left">
                        <thead className="bg-gray-50 text-xs text-gray-500 uppercase">
                            <tr>
                                {["Name", "Status", "Created"].map((h) => (
                                    <th key={h} className="px-4 py-3 font-medium">{h}</th>
                                ))}
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            {data?.results.map((w) => (
                                <tr key={w.id} className="hover:bg-gray-50">
                                    <td className="px-4 py-3 font-medium text-gray-900">{w.name}</td>
                                    <td className="px-4 py-3">
                                        <span className={`px-2 py-0.5 rounded-full text-xs font-medium capitalize ${statusColor[w.status] ?? ""}`}>{w.status}</span>
                                    </td>
                                    <td className="px-4 py-3 text-gray-400">{new Date(w.created_at).toLocaleDateString()}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                    {data?.count === 0 && <p className="text-center text-gray-500 py-8">No workflows yet.</p>}
                </div>
            )}
        </div>
    );
}
