"use client";
import { useMemo, useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import apiClient from "@/lib/api";
import type { PaginatedResponse } from "@/types";
import { Plus, Route, Play, Pause, Archive, Users, ChevronRight } from "lucide-react";
import Link from "next/link";
import { FilterProvider, useFilterValue } from "@/components/filters/FilterProvider";
import { PremiumFilterTabs } from "@/components/filters/PremiumFilterTabs";

interface Journey {
  id: string;
  name: string;
  description: string;
  status: "draft" | "active" | "paused" | "archived";
  trigger_type: "event" | "segment_join" | "manual" | "schedule";
  allow_re_entry: boolean;
  created_at: string;
  updated_at: string;
}

interface JourneyEnrollment {
  id: string;
  journey: string;
  status: string;
  started_at: string;
}

async function fetchJourneys(page = 1) {
  const { data } = await apiClient.get<PaginatedResponse<Journey>>(
    `/journeys/?page=${page}&page_size=25`
  );
  return data;
}

async function patchJourneyStatus(id: string, action: string) {
  const { data } = await apiClient.post(`/journeys/${id}/${action}/`);
  return data;
}

const statusConfig: Record<string, { label: string; cls: string }> = {
  draft:    { label: "Draft",    cls: "bg-slate-100 text-slate-600" },
  active:   { label: "Active",   cls: "bg-emerald-100 text-emerald-700" },
  paused:   { label: "Paused",   cls: "bg-amber-100 text-amber-700" },
  archived: { label: "Archived", cls: "bg-red-100 text-red-600" },
};

const triggerConfig: Record<string, { label: string; cls: string }> = {
  event:        { label: "Event",        cls: "bg-purple-100 text-purple-700" },
  segment_join: { label: "Segment Join", cls: "bg-blue-100 text-blue-700" },
  manual:       { label: "Manual",       cls: "bg-slate-100 text-slate-600" },
  schedule:     { label: "Schedule",     cls: "bg-cyan-100 text-cyan-700" },
};

const journeyFilterOptions = [
  { label: "All journeys", value: "all" },
  { label: "Active", value: "active" },
  { label: "Draft", value: "draft" },
  { label: "Paused", value: "paused" },
  { label: "Archived", value: "archived" },
] as const;

type JourneyFilter = (typeof journeyFilterOptions)[number]["value"];

function JourneysContent() {
  const [page, setPage] = useState(1);
  const [statusFilter, setStatusFilter] = useFilterValue("journey-status", "all") as [JourneyFilter, (value: JourneyFilter) => void];
  const queryClient = useQueryClient();

  const { data, isLoading } = useQuery({
    queryKey: ["journeys", page],
    queryFn: () => fetchJourneys(page),
  });

  const actionMutation = useMutation({
    mutationFn: ({ id, action }: { id: string; action: string }) =>
      patchJourneyStatus(id, action),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["journeys"] }),
  });

  const filtered = useMemo(() => (
    statusFilter === "all"
      ? data?.results ?? []
      : (data?.results ?? []).filter((journey) => journey.status === statusFilter)
  ), [data?.results, statusFilter]);

  const totalPages = data ? Math.ceil(data.count / 25) : 1;

  const counts = {
    active:   data?.results.filter((j) => j.status === "active").length ?? 0,
    draft:    data?.results.filter((j) => j.status === "draft").length ?? 0,
    paused:   data?.results.filter((j) => j.status === "paused").length ?? 0,
    archived: data?.results.filter((j) => j.status === "archived").length ?? 0,
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <section className="app-surface p-8 lg:p-10">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <p className="page-eyebrow">Journeys</p>
            <h2 className="page-title">Customer journey orchestration</h2>
            <p className="page-copy">
              Design multi-step customer journeys triggered by events, segment membership changes,
              or schedules. Each journey moves customers through targeted touchpoints automatically.
            </p>
          </div>
          <button className="btn-primary inline-flex items-center gap-2">
            <Plus size={15} /> New Journey
          </button>
        </div>
      </section>

      {/* KPI strip */}
      {data && (
        <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
          {[
            { label: "Active", value: counts.active, cls: "text-emerald-600" },
            { label: "Draft",  value: counts.draft,  cls: "text-slate-500" },
            { label: "Paused", value: counts.paused, cls: "text-amber-600" },
            { label: "Total",  value: data.count,    cls: "text-blue-600" },
          ].map(({ label, value, cls }) => (
            <div key={label} className="app-panel p-5">
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-400">{label}</p>
              <p className={`mt-3 text-2xl font-bold tracking-tight ${cls}`}>{value}</p>
            </div>
          ))}
        </div>
      )}

      <PremiumFilterTabs
        ariaLabel="Filter journeys by status"
        options={journeyFilterOptions}
        value={statusFilter}
        onChange={setStatusFilter}
      />

      {/* Journey cards */}
      {isLoading ? (
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="app-panel h-40 animate-pulse" />
          ))}
        </div>
      ) : filtered.length === 0 ? (
        <div className="app-panel flex flex-col items-center gap-3 py-16 text-center">
          <Route size={32} className="text-slate-300" />
          <p className="text-sm font-medium text-slate-500">No journeys found.</p>
          <button className="btn-primary mt-2 inline-flex items-center gap-2">
            <Plus size={14} /> New Journey
          </button>
        </div>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {filtered.map((journey) => {
            const statusCfg = statusConfig[journey.status] ?? statusConfig.draft;
            const triggerCfg = triggerConfig[journey.trigger_type] ?? triggerConfig.manual;

            return (
              <div key={journey.id} className="app-panel flex flex-col p-6">
                {/* Card header */}
                <div className="flex items-start justify-between gap-3">
                  <div className="flex-1 min-w-0">
                    <h3 className="truncate font-semibold text-brand-dark">{journey.name}</h3>
                    {journey.description && (
                      <p className="mt-1 text-sm leading-5 text-slate-500 line-clamp-2">
                        {journey.description}
                      </p>
                    )}
                  </div>
                  <span className={`shrink-0 rounded-full px-2.5 py-0.5 text-xs font-semibold capitalize ${statusCfg.cls}`}>
                    {statusCfg.label}
                  </span>
                </div>

                {/* Badges */}
                <div className="mt-4 flex flex-wrap gap-2">
                  <span className={`rounded-full px-2.5 py-0.5 text-xs font-medium ${triggerCfg.cls}`}>
                    {triggerCfg.label}
                  </span>
                  {journey.allow_re_entry && (
                    <span className="rounded-full bg-indigo-100 px-2.5 py-0.5 text-xs font-medium text-indigo-700">
                      Re-entry allowed
                    </span>
                  )}
                </div>

                {/* Footer */}
                <div className="mt-auto flex items-center justify-between pt-5">
                  <p className="text-xs text-slate-400">
                    Updated {new Date(journey.updated_at).toLocaleDateString()}
                  </p>
                  <div className="flex items-center gap-1">
                    {journey.status === "draft" && (
                      <button
                        onClick={() => actionMutation.mutate({ id: journey.id, action: "activate" })}
                        disabled={actionMutation.isPending}
                        title="Activate journey"
                        className="rounded-xl p-1.5 text-emerald-600 hover:bg-emerald-50 disabled:opacity-40"
                      >
                        <Play size={14} />
                      </button>
                    )}
                    {journey.status === "active" && (
                      <button
                        onClick={() => actionMutation.mutate({ id: journey.id, action: "pause" })}
                        disabled={actionMutation.isPending}
                        title="Pause journey"
                        className="rounded-xl p-1.5 text-amber-600 hover:bg-amber-50 disabled:opacity-40"
                      >
                        <Pause size={14} />
                      </button>
                    )}
                    {journey.status === "paused" && (
                      <button
                        onClick={() => actionMutation.mutate({ id: journey.id, action: "activate" })}
                        disabled={actionMutation.isPending}
                        title="Resume journey"
                        className="rounded-xl p-1.5 text-emerald-600 hover:bg-emerald-50 disabled:opacity-40"
                      >
                        <Play size={14} />
                      </button>
                    )}
                    {(journey.status === "active" || journey.status === "paused") && (
                      <button
                        onClick={() => actionMutation.mutate({ id: journey.id, action: "archive" })}
                        disabled={actionMutation.isPending}
                        title="Archive journey"
                        className="rounded-xl p-1.5 text-slate-400 hover:bg-slate-100 disabled:opacity-40"
                      >
                        <Archive size={14} />
                      </button>
                    )}
                    <Link
                      href={`/journeys/${journey.id}`}
                      className="rounded-xl p-1.5 text-slate-400 hover:bg-slate-100 hover:text-brand-accent"
                      title="View journey"
                    >
                      <ChevronRight size={14} />
                    </Link>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="app-panel flex items-center justify-between px-6 py-4">
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
  );
}

export default function JourneysPage() {
  return (
    <FilterProvider initialValues={{ "journey-status": "all" }}>
      <JourneysContent />
    </FilterProvider>
  );
}
