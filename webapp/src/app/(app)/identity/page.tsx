"use client";
import { useQuery } from "@tanstack/react-query";
import apiClient from "@/lib/api";

interface IdentityProfile {
  id: string;
  primary_email: string;
  primary_phone: string;
  is_anonymous: boolean;
  aliases: { alias_type: string; alias_value: string }[];
}

async function fetchProfiles() {
  const { data } = await apiClient.get<IdentityProfile[]>("/identity/profiles/");
  return data;
}

export default function IdentityPage() {
  const { data, isLoading } = useQuery({ queryKey: ["identity-profiles"], queryFn: fetchProfiles });

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Identity Resolution</h1>
      {isLoading ? (
        <p className="text-gray-500">Loading…</p>
      ) : (
        <div className="bg-white rounded-2xl shadow overflow-hidden">
          <table className="min-w-full divide-y divide-gray-100">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Email</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Phone</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Aliases</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Type</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {data?.map((p) => (
                <tr key={p.id}>
                  <td className="px-4 py-3 text-sm text-gray-800">{p.primary_email || "—"}</td>
                  <td className="px-4 py-3 text-sm text-gray-600">{p.primary_phone || "—"}</td>
                  <td className="px-4 py-3 text-sm text-gray-500">{p.aliases.length}</td>
                  <td className="px-4 py-3">
                    <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${p.is_anonymous ? "bg-gray-100 text-gray-500" : "bg-blue-100 text-blue-700"}`}>
                      {p.is_anonymous ? "Anonymous" : "Known"}
                    </span>
                  </td>
                </tr>
              ))}
              {!data?.length && (
                <tr><td colSpan={4} className="px-4 py-6 text-center text-gray-400">No identity profiles yet.</td></tr>
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
