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
        <div>
            <div className="flex items-center justify-between mb-6">
                <h1 className="text-2xl font-bold text-gray-900">Customers</h1>
                <Link href="/crm/new" className="bg-primary-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-primary-700 transition">
                    Add Customer
                </Link>
            </div>
            {isLoading ? (
                <p className="text-gray-500">Loading…</p>
            ) : (
                <div className="bg-white rounded-2xl shadow overflow-hidden">
                    <table className="w-full text-sm text-left">
                        <thead className="bg-gray-50 text-gray-500 uppercase text-xs">
                            <tr>
                                {["Name", "Email", "Status", "Source", "Created"].map((h) => (
                                    <th key={h} className="px-4 py-3 font-medium">{h}</th>
                                ))}
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            {data?.results.map((c) => (
                                <tr key={c.id} className="hover:bg-gray-50">
                                    <td className="px-4 py-3 font-medium">
                                        <Link href={`/crm/customers/${c.id}`} className="text-primary-600 hover:underline">
                                            {c.first_name} {c.last_name}
                                        </Link>
                                    </td>
                                    <td className="px-4 py-3 text-gray-600">{c.email}</td>
                                    <td className="px-4 py-3">
                                        <span className="px-2 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-700 capitalize">{c.status}</span>
                                    </td>
                                    <td className="px-4 py-3 text-gray-500 capitalize">{c.source}</td>
                                    <td className="px-4 py-3 text-gray-400">{new Date(c.created_at).toLocaleDateString()}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                    {data?.count === 0 && (
                        <p className="text-center text-gray-500 py-8">No customers yet.</p>
                    )}
                </div>
            )}
        </div>
    );
}
