"use client";
import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import apiClient from "@/lib/api";
import type { PaginatedResponse } from "@/types";
import { RefreshCw, Plus, Users, Zap, Filter } from "lucide-react";

interface Segment {
  id: string;
  name: string;
  description: string;
  segment_type: "static" | "dynamic";
  member_count: number;
  auto_refresh: boolean;
  last_refreshed_at: string | null;
  created_at: string;
}

async function fetchSegments(page = 1) {
  const { data } = await apiClient.get<PaginatedResponse<Segment>>(
    `/segments/?page=${page}&page_size=25`
  );
  return data;
}

async function refreshSegment(id: string) {
  const { data } = await apiClient.post(`/segments/${id}/refresh/`);
  return data;
}

const typeBadge: Record<string, string> = {
  static: "bg-slate-100 text-slate-600",
  dynamic: "bg-blue-100 text-blue-700",
};

export default function SegmentsPage() {
  const [page, setPage] = useState(1);
  const queryClient = useQueryClient();

  const { data, isLoading } = useQuery({
    queryKey: ["segments", page],
    queryFn: () => fetchSegments(page),
  });

  const refreshMutation = useMutation({
    mutationFn: refreshSegment,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["segments"] }),
  });

  const totalPages = data ? Math.ceil(data.count / 25) : 1;

  return (
    <div className="space-y-6">
      {/* Header */}
      <section className="app-surface p-8 lg:p-10">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <p className="page-eyebrow">Segments</p>
            <h2 className="page-title">Audience segmentation and targeting rules</h2>
            <p className="page-copy">
              Define static and dynamic audience segments driven by customer attributes, behaviour,
              and lifecycle state. Dynamic segments refresh automatically as your data changes.
            </p>
          </div>
          <button className="btn-primary inline-flex items-center gap-2">
            <Plus size={15} /> New Segment
          </button>
        </div>
      </section>

      {/* KPI strip */}
      {data && (
        <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
          {[
            { label: "Total segments", value: data.count, icon: Filter, tone: "text-blue-600" },
            {
              label: "Dynamic",
              value: data.results.filter((s) => s.segment_type === "dynamic").length,
              icon: Zap,
              tone: "text-amber-600",
            },
            {
              label: "Static",
              value: data.results.filter((s) => s.segment_type === "static").length,
              icon: Users,
              tone: "text-slate-600",
            },
            {
              label: "Total members",
              value: data.results.reduce((sum, s) => sum + s.member_count, 0).toLocaleString(),
              icon: Users,
              tone: "text-emerald-600",
            },
          ].map(({ label, value, icon: Icon, tone }) => (
            <div key={label} className="app-panel p-5">
              <div className="flex items-center justify-between">
                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-400">{label}</p>
                <Icon size={16} className={tone} />
              </div>
              <p className="mt-3 text-2xl font-bold tracking-tight text-brand-dark">{value}</p>
            </div>
          ))}
        </div>
      )}

      {/* Table */}
      {isLoading ? (
        <div className="app-panel space-y-3 px-6 py-10">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="h-10 animate-pulse rounded-xl bg-slate-100" />
          ))}
        </div>
      ) : (
        <div className="app-panel overflow-hidden">
          <table className="app-table">
            <thead>
              <tr>
                {["Name", "Type", "Members", "Auto-refresh", "Last refreshed", "Created", ""].map(
                  (h) => <th key={h}>{h}</th>
                )}
              </tr>
            </thead>
            <tbody>
              {data?.results.map((seg) => (
                <tr key={seg.id} className="hover:bg-slate-50">
                  <td>
                    <p className="font-semibold text-brand-dark">{seg.name}</p>
                    {seg.description && (
                      <p className="mt-0.5 text-xs text-slate-400 line-clamp-1">{seg.description}</p>
                    )}
                  </td>
                  <td>
                    <span
                      className={`inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-semibold capitalize ${typeBadge[seg.segment_type] ?? ""}`}
                    >
                      {seg.segment_type === "dynamic" ? <Zap size={10} /> : <Users size={10} />}
                      {seg.segment_type}
                    </span>
                  </td>
                  <td className="font-semibold text-brand-dark tabular-nums">
                    {seg.member_count.toLocaleString()}
                  </td>
                  <td>
                    <span
                      className={`rounded-full px-2.5 py-0.5 text-xs font-medium ${seg.auto_refresh ? "bg-emerald-100 text-emerald-700" : "bg-slate-100 text-slate-500"}`}
                    >
                      {seg.auto_refresh ? "On" : "Off"}
                    </span>
                  </td>
                  <td className="text-slate-400">
                    {seg.last_refreshed_at
                      ? new Date(seg.last_refreshed_at).toLocaleString()
                      : "Never"}
                  </td>
                  <td className="text-slate-400">
                    {new Date(seg.created_at).toLocaleDateString()}
                  </td>
                  <td>
                    {seg.segment_type === "dynamic" && (
                      <button
                        onClick={() => refreshMutation.mutate(seg.id)}
                        disabled={refreshMutation.isPending}
                        title="Refresh segment"
                        className="rounded-xl p-1.5 text-slate-400 transition hover:bg-slate-100 hover:text-brand-accent disabled:opacity-40"
                      >
                        <RefreshCw
                          size={14}
                          className={refreshMutation.isPending ? "animate-spin" : ""}
                        />
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {data?.count === 0 && (
            <div className="flex flex-col items-center gap-3 py-16 text-center">
              <Filter size={32} className="text-slate-300" />
              <p className="text-sm font-medium text-slate-500">No segments yet.</p>
              <p className="text-sm text-slate-400">Create your first segment to start targeting your audience.</p>
              <button className="btn-primary mt-2 inline-flex items-center gap-2">
                <Plus size={14} /> New Segment
              </button>
            </div>
          )}

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex items-center justify-between border-t border-slate-100 px-6 py-4">
              <p className="text-sm text-slate-500">
                Page {page} of {totalPages} · {data?.count} total
              </p>
              <div className="flex gap-2">
                <button
                  onClick={() => setPage((p) => Math.max(1, p - 1))}
                  disabled={page === 1}
                  className="rounded-xl border border-slate-200 px-3 py-1.5 text-sm font-medium text-slate-600 hover:bg-slate-50 disabled:opacity-40"
                >
                  Previous
                </button>
                <button
                  onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                  disabled={page === totalPages}
                  className="rounded-xl border border-slate-200 px-3 py-1.5 text-sm font-medium text-slate-600 hover:bg-slate-50 disabled:opacity-40"
                >
                  Next
                </button>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
