"use client";
import { useQuery } from "@tanstack/react-query";
import apiClient from "@/lib/api";

interface Carrier {
  id: string;
  name: string;
  code: string;
  is_active: boolean;
}

interface ShipmentTracking {
  id: string;
  tracking_number: string;
  status: string;
  estimated_delivery: string | null;
}

async function fetchCarriers() {
  const { data } = await apiClient.get<Carrier[]>("/logistics/carriers/");
  return data;
}

async function fetchShipments() {
  const { data } = await apiClient.get<ShipmentTracking[]>("/logistics/shipments/");
  return data;
}

const statusColors: Record<string, string> = {
  delivered: "bg-green-100 text-green-700",
  in_transit: "bg-blue-100 text-blue-700",
  out_for_delivery: "bg-indigo-100 text-indigo-700",
  failed: "bg-red-100 text-red-700",
  returned: "bg-orange-100 text-orange-700",
  pre_transit: "bg-gray-100 text-gray-600",
};

export default function LogisticsPage() {
  const { data: carriers, isLoading: carriersLoading } = useQuery({
    queryKey: ["carriers"],
    queryFn: fetchCarriers,
  });
  const { data: shipments, isLoading: shipmentsLoading } = useQuery({
    queryKey: ["shipments"],
    queryFn: fetchShipments,
  });

  return (
    <div className="space-y-8">
      <h1 className="text-2xl font-bold text-gray-900">Logistics</h1>

      {/* Carriers */}
      <section>
        <h2 className="text-lg font-semibold text-gray-700 mb-3">Carriers</h2>
        {carriersLoading ? (
          <p className="text-gray-500">Loading…</p>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
            {carriers?.map((c) => (
              <div key={c.id} className="bg-white rounded-xl shadow p-4 flex items-center justify-between">
                <span className="font-medium text-gray-800">{c.name}</span>
                <span className={`text-xs px-2 py-0.5 rounded-full ${c.is_active ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-400"}`}>
                  {c.is_active ? "Active" : "Inactive"}
                </span>
              </div>
            ))}
            {!carriers?.length && <p className="text-gray-500">No carriers added.</p>}
          </div>
        )}
      </section>

      {/* Shipments */}
      <section>
        <h2 className="text-lg font-semibold text-gray-700 mb-3">Shipments</h2>
        {shipmentsLoading ? (
          <p className="text-gray-500">Loading…</p>
        ) : (
          <div className="bg-white rounded-2xl shadow overflow-hidden">
            <table className="min-w-full divide-y divide-gray-100">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Tracking #</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Est. Delivery</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {shipments?.map((s) => (
                  <tr key={s.id}>
                    <td className="px-4 py-3 text-sm font-mono text-gray-800">{s.tracking_number}</td>
                    <td className="px-4 py-3">
                      <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${statusColors[s.status] ?? "bg-gray-100 text-gray-500"}`}>
                        {s.status.replace(/_/g, " ")}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-500">{s.estimated_delivery ?? "—"}</td>
                  </tr>
                ))}
                {!shipments?.length && (
                  <tr><td colSpan={3} className="px-4 py-6 text-center text-gray-400">No shipments yet.</td></tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      </section>
    </div>
  );
}
