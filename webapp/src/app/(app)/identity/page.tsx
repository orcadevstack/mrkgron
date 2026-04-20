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
  const { data } = await apiClient.get<{ results: IdentityProfile[] }>("/identity/profiles/");
  return data.results ?? [];
}

export default function IdentityPage() {
  const { data, isLoading } = useQuery({ queryKey: ["identity-profiles"], queryFn: fetchProfiles });

  return (
    <div className="space-y-6">
      <section className="app-surface p-8 lg:p-10">
        <p className="page-eyebrow">Identity</p>
        <h2 className="page-title">Profile resolution and alias coverage</h2>
        <p className="page-copy">Inspect known and anonymous profiles, primary identifiers, and alias density with clearer enterprise framing.</p>
      </section>
      {isLoading ? (
        <p className="app-panel px-6 py-10 text-sm text-slate-500">Loading identity profiles...</p>
      ) : (
        <div className="app-panel overflow-hidden">
          <table className="app-table">
            <thead>
              <tr>
                <th>Email</th>
                <th>Phone</th>
                <th>Aliases</th>
                <th>Type</th>
              </tr>
            </thead>
            <tbody>
              {data?.map((p) => (
                <tr key={p.id} className="hover:bg-slate-50">
                  <td className="text-sm text-brand-dark">{p.primary_email || "—"}</td>
                  <td className="text-sm text-slate-600">{p.primary_phone || "—"}</td>
                  <td className="text-sm text-slate-500">{p.aliases.length}</td>
                  <td>
                    <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${p.is_anonymous ? "bg-gray-100 text-gray-500" : "bg-blue-100 text-blue-700"}`}>
                      {p.is_anonymous ? "Anonymous" : "Known"}
                    </span>
                  </td>
                </tr>
              ))}
              {!data?.length && (
                <tr><td colSpan={4} className="px-4 py-6 text-center text-slate-400">No identity profiles yet.</td></tr>
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
