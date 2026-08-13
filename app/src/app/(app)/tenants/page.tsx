"use client";
import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import apiClient from "@/lib/api";
import type { PaginatedResponse } from "@/types";
import {
  Building2, Users, Mail, Crown, Shield, User, Plus,
  ToggleLeft, ToggleRight, Send, ChevronDown, ChevronUp,
} from "lucide-react";

interface Tenant {
  id: string;
  name: string;
  slug: string;
  domain: string;
  plan: "free" | "starter" | "professional" | "enterprise";
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

interface TenantMembership {
  id: string;
  tenant: string;
  user: string;
  role: "owner" | "admin" | "manager" | "analyst" | "member" | "viewer";
  is_active: boolean;
  joined_at: string;
}

async function fetchTenants(page = 1) {
  const { data } = await apiClient.get<PaginatedResponse<Tenant>>(
    `/tenants/?page=${page}&page_size=20`
  );
  return data;
}

async function fetchMemberships(tenantId: string) {
  const { data } = await apiClient.get<PaginatedResponse<TenantMembership>>(
    `/tenants/memberships/?tenant=${tenantId}&page_size=50`
  );
  return data.results ?? [];
}

async function inviteMember(payload: { tenant: string; email: string; role: string }) {
  const { data } = await apiClient.post("/tenants/invite/", payload);
  return data;
}

async function toggleTenant(id: string, is_active: boolean) {
  const { data } = await apiClient.patch(`/tenants/${id}/`, { is_active });
  return data;
}

const planConfig: Record<string, { label: string; cls: string }> = {
  free:         { label: "Free",         cls: "bg-slate-100 text-slate-600" },
  starter:      { label: "Starter",      cls: "bg-blue-100 text-blue-700" },
  professional: { label: "Professional", cls: "bg-indigo-100 text-indigo-700" },
  enterprise:   { label: "Enterprise",   cls: "bg-amber-100 text-amber-700" },
};

const roleIcon: Record<string, React.ReactNode> = {
  owner:   <Crown size={12} />,
  admin:   <Shield size={12} />,
  manager: <User size={12} />,
  analyst: <User size={12} />,
  member:  <User size={12} />,
  viewer:  <User size={12} />,
};

const roleColors: Record<string, string> = {
  owner:   "bg-amber-100 text-amber-700",
  admin:   "bg-red-100 text-red-600",
  manager: "bg-indigo-100 text-indigo-700",
  analyst: "bg-blue-100 text-blue-700",
  member:  "bg-slate-100 text-slate-600",
  viewer:  "bg-slate-100 text-slate-400",
};

export default function TenantsPage() {
  const [page, setPage] = useState(1);
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [inviteState, setInviteState] = useState<{ tenantId: string; email: string; role: string } | null>(null);
  const queryClient = useQueryClient();

  const { data, isLoading } = useQuery({
    queryKey: ["tenants", page],
    queryFn: () => fetchTenants(page),
  });

  const membershipsQuery = useQuery({
    queryKey: ["memberships", expandedId],
    queryFn: () => fetchMemberships(expandedId!),
    enabled: Boolean(expandedId),
  });

  const toggleMutation = useMutation({
    mutationFn: ({ id, is_active }: { id: string; is_active: boolean }) =>
      toggleTenant(id, is_active),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["tenants"] }),
  });

  const inviteMutation = useMutation({
    mutationFn: inviteMember,
    onSuccess: () => {
      setInviteState(null);
      queryClient.invalidateQueries({ queryKey: ["memberships", expandedId] });
    },
  });

  const totalPages = data ? Math.ceil(data.count / 20) : 1;

  const planCounts = Object.fromEntries(
    ["free", "starter", "professional", "enterprise"].map((p) => [
      p,
      data?.results.filter((t) => t.plan === p).length ?? 0,
    ])
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <section className="app-surface p-8 lg:p-10">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <p className="page-eyebrow">Tenant Management</p>
            <h2 className="page-title">Workspace tenants and team access</h2>
            <p className="page-copy">
              Manage all tenant workspaces on the platform, inspect membership rosters, control
              activation state, and invite team members to any tenant from this panel.
            </p>
          </div>
        </div>
      </section>

      {/* Plan KPI strip */}
      {data && (
        <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
          {[
            { label: "Total tenants", value: data.count, cls: "text-brand-dark" },
            { label: "Enterprise",    value: planCounts.enterprise, cls: "text-amber-600" },
            { label: "Professional",  value: planCounts.professional, cls: "text-indigo-600" },
            { label: "Starter + Free",value: (planCounts.starter ?? 0) + (planCounts.free ?? 0), cls: "text-slate-500" },
          ].map(({ label, value, cls }) => (
            <div key={label} className="app-panel p-5">
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-400">{label}</p>
              <p className={`mt-3 text-2xl font-bold tracking-tight ${cls}`}>{value}</p>
            </div>
          ))}
        </div>
      )}

      {/* Tenant table */}
      {isLoading ? (
        <div className="app-panel space-y-3 px-6 py-10">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="h-12 animate-pulse rounded-xl bg-slate-100" />
          ))}
        </div>
      ) : (
        <div className="app-panel overflow-hidden">
          <table className="app-table">
            <thead>
              <tr>
                {["Tenant", "Plan", "Domain", "Status", "Created", ""].map((h) => (
                  <th key={h}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {data?.results.map((tenant) => {
                const planCfg = planConfig[tenant.plan] ?? planConfig.free;
                const isExpanded = expandedId === tenant.id;

                return (
                  <>
                    <tr key={tenant.id} className="hover:bg-slate-50">
                      <td>
                        <div className="flex items-center gap-3">
                          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-2xl bg-brand-light">
                            <Building2 size={15} className="text-brand-accent" />
                          </div>
                          <div>
                            <p className="font-semibold text-brand-dark">{tenant.name}</p>
                            <p className="text-xs text-slate-400">/{tenant.slug}</p>
                          </div>
                        </div>
                      </td>
                      <td>
                        <span className={`rounded-full px-2.5 py-0.5 text-xs font-semibold capitalize ${planCfg.cls}`}>
                          {planCfg.label}
                        </span>
                      </td>
                      <td className="text-slate-500">{tenant.domain || "—"}</td>
                      <td>
                        <button
                          onClick={() =>
                            toggleMutation.mutate({ id: tenant.id, is_active: !tenant.is_active })
                          }
                          disabled={toggleMutation.isPending}
                          className="flex items-center gap-1.5 text-xs font-medium disabled:opacity-40"
                          title={tenant.is_active ? "Deactivate tenant" : "Activate tenant"}
                        >
                          {tenant.is_active ? (
                            <>
                              <ToggleRight size={18} className="text-emerald-500" />
                              <span className="text-emerald-600">Active</span>
                            </>
                          ) : (
                            <>
                              <ToggleLeft size={18} className="text-slate-400" />
                              <span className="text-slate-400">Inactive</span>
                            </>
                          )}
                        </button>
                      </td>
                      <td className="text-slate-400">
                        {new Date(tenant.created_at).toLocaleDateString()}
                      </td>
                      <td>
                        <div className="flex items-center gap-1">
                          <button
                            onClick={() => {
                              setInviteState({ tenantId: tenant.id, email: "", role: "member" });
                              setExpandedId(tenant.id);
                            }}
                            title="Invite member"
                            className="rounded-xl p-1.5 text-slate-400 hover:bg-slate-100 hover:text-brand-accent"
                          >
                            <Mail size={14} />
                          </button>
                          <button
                            onClick={() => setExpandedId(isExpanded ? null : tenant.id)}
                            title="View members"
                            className="rounded-xl p-1.5 text-slate-400 hover:bg-slate-100 hover:text-brand-accent"
                          >
                            {isExpanded ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
                          </button>
                        </div>
                      </td>
                    </tr>

                    {/* Expanded membership section */}
                    {isExpanded && (
                      <tr key={`${tenant.id}-expand`}>
                        <td colSpan={6} className="bg-slate-50 px-6 pb-6 pt-2">
                          {/* Invite form */}
                          {inviteState?.tenantId === tenant.id && (
                            <div className="mb-4 flex flex-wrap items-end gap-3 rounded-2xl border border-slate-200 bg-white p-4">
                              <div className="flex-1 min-w-[200px]">
                                <label className="mb-1 block text-xs font-semibold text-slate-500">
                                  Email address
                                </label>
                                <input
                                  type="email"
                                  value={inviteState.email}
                                  onChange={(e) =>
                                    setInviteState((s) => s ? { ...s, email: e.target.value } : null)
                                  }
                                  placeholder="name@company.com"
                                  className="w-full rounded-xl border border-slate-200 px-3 py-2 text-sm focus:border-brand-accent focus:outline-none focus:ring-1 focus:ring-brand-accent"
                                />
                              </div>
                              <div>
                                <label className="mb-1 block text-xs font-semibold text-slate-500">
                                  Role
                                </label>
                                <select
                                  value={inviteState.role}
                                  onChange={(e) =>
                                    setInviteState((s) => s ? { ...s, role: e.target.value } : null)
                                  }
                                  className="rounded-xl border border-slate-200 px-3 py-2 text-sm focus:border-brand-accent focus:outline-none"
                                >
                                  {["owner","admin","manager","analyst","member","viewer"].map((r) => (
                                    <option key={r} value={r} className="capitalize">{r}</option>
                                  ))}
                                </select>
                              </div>
                              <button
                                onClick={() => {
                                  if (!inviteState.email.trim()) return;
                                  inviteMutation.mutate({
                                    tenant: inviteState.tenantId,
                                    email: inviteState.email.trim(),
                                    role: inviteState.role,
                                  });
                                }}
                                disabled={!inviteState.email.trim() || inviteMutation.isPending}
                                className="btn-primary inline-flex items-center gap-2 disabled:opacity-40"
                              >
                                <Send size={13} />
                                {inviteMutation.isPending ? "Sending…" : "Send invite"}
                              </button>
                              <button
                                onClick={() => setInviteState(null)}
                                className="text-sm text-slate-400 hover:text-slate-600"
                              >
                                Cancel
                              </button>
                            </div>
                          )}

                          {/* Members list */}
                          <div>
                            <div className="mb-2 flex items-center gap-2">
                              <Users size={13} className="text-slate-400" />
                              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-400">
                                Team members
                              </p>
                            </div>
                            {membershipsQuery.isLoading ? (
                              <div className="space-y-2">
                                {[...Array(3)].map((_, i) => (
                                  <div key={i} className="h-10 animate-pulse rounded-xl bg-slate-100" />
                                ))}
                              </div>
                            ) : (membershipsQuery.data ?? []).length === 0 ? (
                              <p className="rounded-xl bg-white px-4 py-3 text-sm text-slate-500">
                                No members yet.{" "}
                                <button
                                  onClick={() =>
                                    setInviteState({ tenantId: tenant.id, email: "", role: "member" })
                                  }
                                  className="text-brand-accent hover:underline"
                                >
                                  Invite the first member.
                                </button>
                              </p>
                            ) : (
                              <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
                                {(membershipsQuery.data ?? []).map((m) => (
                                  <div
                                    key={m.id}
                                    className="flex items-center gap-3 rounded-xl bg-white px-4 py-3 shadow-sm"
                                  >
                                    <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-brand-light text-xs font-bold text-brand-accent">
                                      {m.user.slice(0, 2).toUpperCase()}
                                    </div>
                                    <div className="min-w-0 flex-1">
                                      <p className="truncate text-sm font-medium text-brand-dark">
                                        {m.user}
                                      </p>
                                      <p className="text-[10px] text-slate-400">
                                        Joined {new Date(m.joined_at).toLocaleDateString()}
                                      </p>
                                    </div>
                                    <span
                                      className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[10px] font-semibold capitalize ${roleColors[m.role] ?? ""}`}
                                    >
                                      {roleIcon[m.role]}
                                      {m.role}
                                    </span>
                                  </div>
                                ))}
                              </div>
                            )}
                          </div>
                        </td>
                      </tr>
                    )}
                  </>
                );
              })}
            </tbody>
          </table>

          {data?.count === 0 && (
            <div className="flex flex-col items-center gap-3 py-16 text-center">
              <Building2 size={32} className="text-slate-300" />
              <p className="text-sm font-medium text-slate-500">No tenants found.</p>
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
