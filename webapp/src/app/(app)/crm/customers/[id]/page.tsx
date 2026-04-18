"use client";
import { useQuery } from "@tanstack/react-query";
import { useParams } from "next/navigation";
import apiClient from "@/lib/api";
import type { Customer } from "@/types";
import Link from "next/link";

export default function CustomerDetailPage() {
    const params = useParams();
    const id = params.id as string;

    const { data: customer, isLoading } = useQuery({
        queryKey: ["customer", id],
        queryFn: async () => {
            const { data } = await apiClient.get<Customer>(`/crm/customers/${id}/`);
            return data;
        },
    });

    if (isLoading) return <p className="text-gray-500">Loading…</p>;
    if (!customer) return <p className="text-red-500">Customer not found.</p>;

    return (
        <div>
            <div className="mb-4">
                <Link href="/crm" className="text-primary-600 hover:underline text-sm">← Back to Customers</Link>
            </div>
            <h1 className="text-2xl font-bold text-gray-900 mb-6">{customer.first_name} {customer.last_name}</h1>
            <div className="bg-white rounded-2xl shadow p-6 grid grid-cols-2 gap-4 text-sm">
                <Detail label="Email" value={customer.email} />
                <Detail label="Phone" value={customer.phone ?? "—"} />
                <Detail label="Status" value={customer.status} />
                <Detail label="Source" value={customer.source} />
                <Detail label="Email Opt-in" value={customer.opted_in_email ? "Yes" : "No"} />
                <Detail label="SMS Opt-in" value={customer.opted_in_sms ? "Yes" : "No"} />
                <Detail label="Created" value={new Date(customer.created_at).toLocaleString()} />
            </div>
        </div>
    );
}

function Detail({ label, value }: { label: string; value: string }) {
    return (
        <div>
            <p className="text-gray-400 text-xs uppercase mb-1">{label}</p>
            <p className="text-gray-800 font-medium capitalize">{value}</p>
        </div>
    );
}
