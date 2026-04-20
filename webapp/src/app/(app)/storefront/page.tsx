"use client";
import { useQuery } from "@tanstack/react-query";
import apiClient from "@/lib/api";

interface Store {
  id: string;
  name: string;
  domain: string;
  status: string;
  currency: string;
}

async function fetchStores() {
  const { data } = await apiClient.get<Store[]>("/storefront/stores/");
  return data;
}

export default function StorefrontPage() {
  const { data, isLoading } = useQuery({ queryKey: ["stores"], queryFn: fetchStores });

  const statusBadge = (s: string) => {
    const colors: Record<string, string> = {
      active: "bg-green-100 text-green-700",
      maintenance: "bg-yellow-100 text-yellow-700",
      inactive: "bg-gray-100 text-gray-500",
    };
    return colors[s] ?? "bg-gray-100 text-gray-500";
  };

  return (
    <div className="space-y-6">
      <section className="app-surface p-8 lg:p-10">
        <p className="page-eyebrow">Storefront</p>
        <h2 className="page-title">Store readiness and channel posture</h2>
        <p className="page-copy">Inspect storefront configuration, operational status, and currency coverage in a layout that matches the rest of the operator workspace.</p>
      </section>
      {isLoading ? (
        <p className="app-panel px-6 py-10 text-sm text-slate-500">Loading storefronts...</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {data?.map((store) => (
            <div key={store.id} className="app-panel p-6">
              <div className="flex items-center justify-between mb-2">
                <h2 className="font-semibold text-brand-dark">{store.name}</h2>
                <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${statusBadge(store.status)}`}>
                  {store.status}
                </span>
              </div>
              <p className="text-sm text-slate-500">{store.domain}</p>
              <p className="mt-1 text-xs text-slate-400">{store.currency}</p>
            </div>
          ))}
          {!data?.length && <p className="app-panel p-6 text-sm text-slate-500">No stores configured yet.</p>}
        </div>
      )}
    </div>
  );
}
