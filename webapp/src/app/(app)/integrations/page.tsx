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
      <h1 className="text-2xl font-bold text-gray-900">Integrations</h1>

      {/* Connected Apps */}
      <section>
        <h2 className="text-lg font-semibold text-gray-700 mb-3">Connected Apps</h2>
        {intLoading ? (
          <p className="text-gray-500">Loading…</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {integrations?.map((i) => (
              <div key={i.id} className="bg-white rounded-xl shadow p-4 flex items-center justify-between">
                <div>
                  <p className="font-medium text-gray-900">{i.name}</p>
                  <p className="text-xs text-gray-400 mt-0.5">{i.provider}</p>
                </div>
                <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${statusColors[i.status]}`}>
                  {i.status}
                </span>
              </div>
            ))}
            {!integrations?.length && <p className="text-gray-500 col-span-3">No integrations connected.</p>}
          </div>
        )}
      </section>

      {/* API Keys */}
      <section>
        <h2 className="text-lg font-semibold text-gray-700 mb-3">API Keys</h2>
        {keysLoading ? (
          <p className="text-gray-500">Loading…</p>
        ) : (
          <div className="bg-white rounded-2xl shadow overflow-hidden">
            <table className="min-w-full divide-y divide-gray-100">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Name</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Prefix</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Scope</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Expires</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {apiKeys?.map((k) => (
                  <tr key={k.id}>
                    <td className="px-4 py-3 text-sm text-gray-800">{k.name}</td>
                    <td className="px-4 py-3 text-sm font-mono text-gray-600">{k.key_prefix}…</td>
                    <td className="px-4 py-3 text-sm text-gray-600 capitalize">{k.scope}</td>
                    <td className="px-4 py-3 text-sm text-gray-500">{k.expires_at ? new Date(k.expires_at).toLocaleDateString() : "Never"}</td>
                    <td className="px-4 py-3">
                      <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${k.is_active ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-500"}`}>
                        {k.is_active ? "Active" : "Revoked"}
                      </span>
                    </td>
                  </tr>
                ))}
                {!apiKeys?.length && (
                  <tr><td colSpan={5} className="px-4 py-6 text-center text-gray-400">No API keys created.</td></tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      </section>
    </div>
  );
}
