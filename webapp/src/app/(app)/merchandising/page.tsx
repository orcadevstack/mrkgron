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
      <section className="app-surface p-8 lg:p-10">
        <p className="page-eyebrow">Merchandising</p>
        <h2 className="page-title">Collections, banners, and pricing controls</h2>
        <p className="page-copy">Oversee merchandising assets with consistent layout hierarchy and stronger readability for review and demo presentation.</p>
      </section>

      {/* Collections */}
      <section>
        <h2 className="mb-3 text-lg font-semibold text-brand-dark">Collections</h2>
        {colLoading ? <p className="app-panel px-6 py-10 text-sm text-slate-500">Loading collections...</p> : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {collections?.map((c) => (
              <div key={c.id} className="app-panel flex items-center justify-between p-4">
                <div>
                  <p className="font-medium text-brand-dark">{c.name}</p>
                  <p className="text-xs text-slate-400">/{c.slug}</p>
                </div>
                <span className={`text-xs px-2 py-0.5 rounded-full ${c.is_published ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-500"}`}>
                  {c.is_published ? "Published" : "Draft"}
                </span>
              </div>
            ))}
            {!collections?.length && <p className="app-panel col-span-3 p-6 text-sm text-slate-500">No collections yet.</p>}
          </div>
        )}
      </section>

      {/* Banners */}
      <section>
        <h2 className="mb-3 text-lg font-semibold text-brand-dark">Banners</h2>
        {bannerLoading ? <p className="app-panel px-6 py-10 text-sm text-slate-500">Loading banners...</p> : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {banners?.map((b) => (
              <div key={b.id} className="app-panel p-4">
                <div className="flex justify-between items-start">
                  <p className="font-medium text-brand-dark">{b.title}</p>
                  <span className={`text-xs px-2 py-0.5 rounded-full ${b.is_active ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-500"}`}>
                    {b.is_active ? "Active" : "Inactive"}
                  </span>
                </div>
                <p className="mt-1 text-xs text-slate-400">{b.placement.replace(/_/g, " ")}</p>
              </div>
            ))}
            {!banners?.length && <p className="app-panel col-span-3 p-6 text-sm text-slate-500">No banners yet.</p>}
          </div>
        )}
      </section>

      {/* Pricing Rules */}
      <section>
        <h2 className="mb-3 text-lg font-semibold text-brand-dark">Pricing Rules</h2>
        {rulesLoading ? <p className="app-panel px-6 py-10 text-sm text-slate-500">Loading pricing rules...</p> : (
          <div className="app-panel overflow-hidden">
            <table className="app-table">
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Type</th>
                  <th>Scope</th>
                  <th>Priority</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {rules?.map((r) => (
                  <tr key={r.id} className="hover:bg-slate-50">
                    <td className="text-sm text-brand-dark">{r.name}</td>
                    <td className="text-sm text-slate-600">{r.rule_type.replace(/_/g, " ")}</td>
                    <td className="text-sm text-slate-600">{r.scope}</td>
                    <td className="text-sm text-slate-600">{r.priority}</td>
                    <td>
                      <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${r.is_active ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-500"}`}>
                        {r.is_active ? "Active" : "Inactive"}
                      </span>
                    </td>
                  </tr>
                ))}
                {!rules?.length && (
                  <tr><td colSpan={5} className="px-4 py-6 text-center text-slate-400">No pricing rules yet.</td></tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      </section>
    </div>
  );
}
