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
      <section className="app-surface p-8 lg:p-10">
        <p className="page-eyebrow">Logistics</p>
        <h2 className="page-title">Fulfillment and delivery visibility</h2>
        <p className="page-copy">Track carrier readiness and shipment status with the same clean operational framing used across the workspace.</p>
      </section>

      {/* Carriers */}
      <section>
        <h2 className="mb-3 text-lg font-semibold text-brand-dark">Carriers</h2>
        {carriersLoading ? (
          <p className="app-panel px-6 py-10 text-sm text-slate-500">Loading carriers...</p>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
            {carriers?.map((c) => (
              <div key={c.id} className="app-panel flex items-center justify-between p-4">
                <span className="font-medium text-brand-dark">{c.name}</span>
                <span className={`text-xs px-2 py-0.5 rounded-full ${c.is_active ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-400"}`}>
                  {c.is_active ? "Active" : "Inactive"}
                </span>
              </div>
            ))}
            {!carriers?.length && <p className="app-panel p-6 text-sm text-slate-500">No carriers added.</p>}
          </div>
        )}
      </section>

      {/* Shipments */}
      <section>
        <h2 className="mb-3 text-lg font-semibold text-brand-dark">Shipments</h2>
        {shipmentsLoading ? (
          <p className="app-panel px-6 py-10 text-sm text-slate-500">Loading shipments...</p>
        ) : (
          <div className="app-panel overflow-hidden">
            <table className="app-table">
              <thead>
                <tr>
                  <th>Tracking #</th>
                  <th>Status</th>
                  <th>Est. Delivery</th>
                </tr>
              </thead>
              <tbody>
                {shipments?.map((s) => (
                  <tr key={s.id} className="hover:bg-slate-50">
                    <td className="font-mono text-sm text-brand-dark">{s.tracking_number}</td>
                    <td>
                      <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${statusColors[s.status] ?? "bg-gray-100 text-gray-500"}`}>
                        {s.status.replace(/_/g, " ")}
                      </span>
                    </td>
                    <td className="text-sm text-slate-500">{s.estimated_delivery ?? "—"}</td>
                  </tr>
                ))}
                {!shipments?.length && (
                  <tr><td colSpan={3} className="px-4 py-6 text-center text-slate-400">No shipments yet.</td></tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      </section>
    </div>
  );
}
