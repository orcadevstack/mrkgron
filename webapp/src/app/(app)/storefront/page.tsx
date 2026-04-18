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
    <div>
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Storefront</h1>
      {isLoading ? (
        <p className="text-gray-500">Loading…</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {data?.map((store) => (
            <div key={store.id} className="bg-white rounded-2xl shadow p-6">
              <div className="flex items-center justify-between mb-2">
                <h2 className="font-semibold text-gray-900">{store.name}</h2>
                <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${statusBadge(store.status)}`}>
                  {store.status}
                </span>
              </div>
              <p className="text-sm text-gray-500">{store.domain}</p>
              <p className="text-xs text-gray-400 mt-1">{store.currency}</p>
            </div>
          ))}
          {!data?.length && <p className="text-gray-500">No stores configured yet.</p>}
        </div>
      )}
    </div>
  );
}
