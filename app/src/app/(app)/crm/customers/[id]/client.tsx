"use client";
import { useQuery } from "@tanstack/react-query";
import { useParams } from "next/navigation";
import apiClient from "@/lib/api";
import type { Customer } from "@/types";
import Link from "next/link";

export default function CustomerDetailClient() {
    const params = useParams();
    const id = params.id as string;

    const { data: customer, isLoading } = useQuery({
        queryKey: ["customer", id],
        queryFn: async () => {
            const { data } = await apiClient.get<Customer>(`/crm/customers/${id}/`);
            return data;
        },
    });

    if (isLoading) return <p className="app-panel px-6 py-10 text-sm text-slate-500">Loading customer profile...</p>;
    if (!customer) return <p className="app-panel px-6 py-10 text-sm text-red-600">Customer not found.</p>;

    return (
        <div className="space-y-6">
            <section className="app-surface p-8 lg:p-10">
                <Link href="/crm" className="text-sm font-semibold text-brand-accent hover:text-brand-blue">← Back to customers</Link>
                <h1 className="mt-4 text-3xl font-bold tracking-tight text-brand-dark">{customer.first_name} {customer.last_name}</h1>
                <p className="mt-3 max-w-2xl text-sm leading-6 text-slate-600">Detailed profile view for CRM operators, including consent, source attribution, and record provenance.</p>
            </section>
            <div className="app-panel grid grid-cols-1 gap-4 p-6 text-sm md:grid-cols-2">
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
        <div className="rounded-2xl bg-slate-50 px-4 py-4">
            <p className="mb-1 text-xs uppercase tracking-[0.18em] text-slate-400">{label}</p>
            <p className="font-medium capitalize text-brand-dark">{value}</p>
        </div>
    );
}
