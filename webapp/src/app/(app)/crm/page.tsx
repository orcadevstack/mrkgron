"use client";
import { useQuery } from "@tanstack/react-query";
import apiClient from "@/lib/api";
import type { PaginatedResponse, Customer } from "@/types";
import Link from "next/link";

async function fetchCustomers(page = 1) {
    const { data } = await apiClient.get<PaginatedResponse<Customer>>(`/crm/customers/?page=${page}&page_size=20`);
    return data;
}

export default function CRMPage() {
    const { data, isLoading } = useQuery({ queryKey: ["customers"], queryFn: () => fetchCustomers() });

    return (
        <div className="space-y-6">
            <section className="app-surface p-8 lg:p-10">
                <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
                    <div>
                        <p className="page-eyebrow">CRM</p>
                        <h2 className="page-title">Customer records and lifecycle visibility</h2>
                        <p className="page-copy">Maintain a clean customer ledger with standardized statuses, sources, and profile navigation.</p>
                    </div>
                    <Link href="/crm/new" className="btn-primary">
                    Add Customer
                </Link>
                </div>
            </section>
            {isLoading ? (
                <p className="app-panel px-6 py-10 text-sm text-slate-500">Loading customers...</p>
            ) : (
                <div className="app-panel overflow-hidden">
                    <table className="app-table">
                        <thead>
                            <tr>
                                {["Name", "Email", "Status", "Source", "Created"].map((h) => (
                                    <th key={h} className="px-4 py-3 font-medium">{h}</th>
                                ))}
                            </tr>
                        </thead>
                        <tbody>
                            {data?.results.map((c) => (
                                <tr key={c.id} className="hover:bg-slate-50">
                                    <td className="px-4 py-3 font-medium">
                                        <Link href={`/crm/customers/${c.id}`} className="text-brand-accent hover:text-brand-blue hover:underline">
                                            {c.first_name} {c.last_name}
                                        </Link>
                                    </td>
                                    <td className="px-4 py-3 text-slate-600">{c.email}</td>
                                    <td className="px-4 py-3">
                                        <span className="status-chip bg-brand-accent/10 text-brand-blue capitalize">{c.status}</span>
                                    </td>
                                    <td className="px-4 py-3 capitalize text-slate-500">{c.source}</td>
                                    <td className="px-4 py-3 text-slate-400">{new Date(c.created_at).toLocaleDateString()}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                    {data?.count === 0 && (
                        <p className="py-8 text-center text-slate-500">No customers yet.</p>
                    )}
                </div>
            )}
        </div>
    );
}
