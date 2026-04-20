"use client";
import { useQuery } from "@tanstack/react-query";
import apiClient from "@/lib/api";

interface Integration {
  id: string;
  name: string;
  provider: string;
  status: string;
}

interface APIKey {
  id: string;
  name: string;
  key_prefix: string;
  scope: string;
  is_active: boolean;
  expires_at: string | null;
}

async function fetchIntegrations() {
  const { data } = await apiClient.get<Integration[]>("/integrations/integrations/");
  return data;
}

async function fetchAPIKeys() {
  const { data } = await apiClient.get<APIKey[]>("/integrations/api-keys/");
  return data;
}

const statusColors: Record<string, string> = {
  connected: "bg-green-100 text-green-700",
  disconnected: "bg-gray-100 text-gray-500",
  error: "bg-red-100 text-red-700",
  pending: "bg-yellow-100 text-yellow-700",
};

export default function IntegrationsPage() {
  const { data: integrations, isLoading: intLoading } = useQuery({
    queryKey: ["integrations"],
    queryFn: fetchIntegrations,
  });
  const { data: apiKeys, isLoading: keysLoading } = useQuery({
    queryKey: ["api-keys"],
    queryFn: fetchAPIKeys,
  });

  return (
    <div className="space-y-8">
      <section className="app-surface p-8 lg:p-10">
        <p className="page-eyebrow">Integrations</p>
        <h2 className="page-title">Connected systems and API access</h2>
        <p className="page-copy">Review external connections, API credentials, and activation status from a consistent operator workspace.</p>
      </section>

      {/* Connected Apps */}
      <section>
        <h2 className="mb-3 text-lg font-semibold text-brand-dark">Connected Apps</h2>
        {intLoading ? (
          <p className="app-panel px-6 py-10 text-sm text-slate-500">Loading integrations...</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {integrations?.map((i) => (
              <div key={i.id} className="app-panel flex items-center justify-between p-4">
                <div>
                  <p className="font-medium text-brand-dark">{i.name}</p>
                  <p className="mt-0.5 text-xs text-slate-400">{i.provider}</p>
                </div>
                <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${statusColors[i.status]}`}>
                  {i.status}
                </span>
              </div>
            ))}
            {!integrations?.length && <p className="app-panel col-span-3 p-6 text-sm text-slate-500">No integrations connected.</p>}
          </div>
        )}
      </section>

      {/* API Keys */}
      <section>
        <h2 className="mb-3 text-lg font-semibold text-brand-dark">API Keys</h2>
        {keysLoading ? (
          <p className="app-panel px-6 py-10 text-sm text-slate-500">Loading API keys...</p>
        ) : (
          <div className="app-panel overflow-hidden">
            <table className="app-table">
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Prefix</th>
                  <th>Scope</th>
                  <th>Expires</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {apiKeys?.map((k) => (
                  <tr key={k.id} className="hover:bg-slate-50">
                    <td className="text-sm text-brand-dark">{k.name}</td>
                    <td className="font-mono text-sm text-slate-600">{k.key_prefix}…</td>
                    <td className="text-sm capitalize text-slate-600">{k.scope}</td>
                    <td className="text-sm text-slate-500">{k.expires_at ? new Date(k.expires_at).toLocaleDateString() : "Never"}</td>
                    <td>
                      <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${k.is_active ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-500"}`}>
                        {k.is_active ? "Active" : "Revoked"}
                      </span>
                    </td>
                  </tr>
                ))}
                {!apiKeys?.length && (
                  <tr><td colSpan={5} className="px-4 py-6 text-center text-slate-400">No API keys created.</td></tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      </section>
    </div>
  );
}
