"use client";
import { useQuery } from "@tanstack/react-query";
import apiClient from "@/lib/api";

interface Collection {
  id: string;
  name: string;
  slug: string;
  is_published: boolean;
}

interface Banner {
  id: string;
  title: string;
  placement: string;
  is_active: boolean;
}

interface PricingRule {
  id: string;
  name: string;
  rule_type: string;
  scope: string;
  priority: number;
  is_active: boolean;
}

async function fetchCollections() {
  const { data } = await apiClient.get<Collection[]>("/merchandising/collections/");
  return data;
}
async function fetchBanners() {
  const { data } = await apiClient.get<Banner[]>("/merchandising/banners/");
  return data;
}
async function fetchPricingRules() {
  const { data } = await apiClient.get<PricingRule[]>("/merchandising/pricing-rules/");
  return data;
}

export default function MerchandisingPage() {
  const { data: collections, isLoading: colLoading } = useQuery({ queryKey: ["collections"], queryFn: fetchCollections });
  const { data: banners, isLoading: bannerLoading } = useQuery({ queryKey: ["banners"], queryFn: fetchBanners });
  const { data: rules, isLoading: rulesLoading } = useQuery({ queryKey: ["pricing-rules"], queryFn: fetchPricingRules });

  return (
    <div className="space-y-8">
      <h1 className="text-2xl font-bold text-gray-900">Merchandising</h1>

      {/* Collections */}
      <section>
        <h2 className="text-lg font-semibold text-gray-700 mb-3">Collections</h2>
        {colLoading ? <p className="text-gray-500">Loading…</p> : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {collections?.map((c) => (
              <div key={c.id} className="bg-white rounded-xl shadow p-4 flex justify-between items-center">
                <div>
                  <p className="font-medium text-gray-900">{c.name}</p>
                  <p className="text-xs text-gray-400">/{c.slug}</p>
                </div>
                <span className={`text-xs px-2 py-0.5 rounded-full ${c.is_published ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-500"}`}>
                  {c.is_published ? "Published" : "Draft"}
                </span>
              </div>
            ))}
            {!collections?.length && <p className="text-gray-500 col-span-3">No collections yet.</p>}
          </div>
        )}
      </section>

      {/* Banners */}
      <section>
        <h2 className="text-lg font-semibold text-gray-700 mb-3">Banners</h2>
        {bannerLoading ? <p className="text-gray-500">Loading…</p> : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {banners?.map((b) => (
              <div key={b.id} className="bg-white rounded-xl shadow p-4">
                <div className="flex justify-between items-start">
                  <p className="font-medium text-gray-900">{b.title}</p>
                  <span className={`text-xs px-2 py-0.5 rounded-full ${b.is_active ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-500"}`}>
                    {b.is_active ? "Active" : "Inactive"}
                  </span>
                </div>
                <p className="text-xs text-gray-400 mt-1">{b.placement.replace(/_/g, " ")}</p>
              </div>
            ))}
            {!banners?.length && <p className="text-gray-500 col-span-3">No banners yet.</p>}
          </div>
        )}
      </section>

      {/* Pricing Rules */}
      <section>
        <h2 className="text-lg font-semibold text-gray-700 mb-3">Pricing Rules</h2>
        {rulesLoading ? <p className="text-gray-500">Loading…</p> : (
          <div className="bg-white rounded-2xl shadow overflow-hidden">
            <table className="min-w-full divide-y divide-gray-100">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Name</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Type</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Scope</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Priority</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {rules?.map((r) => (
                  <tr key={r.id}>
                    <td className="px-4 py-3 text-sm text-gray-800">{r.name}</td>
                    <td className="px-4 py-3 text-sm text-gray-600">{r.rule_type.replace(/_/g, " ")}</td>
                    <td className="px-4 py-3 text-sm text-gray-600">{r.scope}</td>
                    <td className="px-4 py-3 text-sm text-gray-600">{r.priority}</td>
                    <td className="px-4 py-3">
                      <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${r.is_active ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-500"}`}>
                        {r.is_active ? "Active" : "Inactive"}
                      </span>
                    </td>
                  </tr>
                ))}
                {!rules?.length && (
                  <tr><td colSpan={5} className="px-4 py-6 text-center text-gray-400">No pricing rules yet.</td></tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      </section>
    </div>
  );
}
