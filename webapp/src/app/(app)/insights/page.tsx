"use client";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import apiClient from "@/lib/api";

interface Insight {
  id: string;
  title: string;
  summary: string;
  insight_type: string;
  priority: string;
  is_read: boolean;
  is_dismissed: boolean;
  created_at: string;
}

async function fetchInsights() {
  const { data } = await apiClient.get<Insight[]>("/insights/insights/");
  return data;
}

const priorityColors: Record<string, string> = {
  critical: "bg-red-100 text-red-700",
  high: "bg-orange-100 text-orange-700",
  medium: "bg-yellow-100 text-yellow-700",
  low: "bg-gray-100 text-gray-500",
};

export default function InsightsPage() {
  const queryClient = useQueryClient();
  const { data, isLoading } = useQuery({ queryKey: ["insights"], queryFn: fetchInsights });

  const markRead = useMutation({
    mutationFn: (id: string) => apiClient.post(`/insights/insights/${id}/mark_read/`),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["insights"] }),
  });

  const dismiss = useMutation({
    mutationFn: (id: string) => apiClient.post(`/insights/insights/${id}/dismiss/`),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["insights"] }),
  });

  const visible = data?.filter((i) => !i.is_dismissed) ?? [];

  return (
    <div className="space-y-6">
      <section className="app-surface p-8 lg:p-10">
        <p className="page-eyebrow">Insights</p>
        <h2 className="page-title">Decision-ready recommendations</h2>
        <p className="page-copy">Review active insights, priorities, and operator actions from a more deliberate and presentation-ready interface.</p>
      </section>
      {isLoading ? (
        <p className="app-panel px-6 py-10 text-sm text-slate-500">Loading insights...</p>
      ) : (
        <div className="space-y-3">
          {visible.map((insight) => (
            <div
              key={insight.id}
              className={`app-panel flex gap-4 p-5 ${insight.is_read ? "opacity-70" : ""}`}
            >
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${priorityColors[insight.priority]}`}>
                    {insight.priority}
                  </span>
                  <span className="text-xs text-slate-400">{insight.insight_type.replace(/_/g, " ")}</span>
                </div>
                <h2 className="font-semibold text-brand-dark">{insight.title}</h2>
                <p className="mt-1 text-sm text-slate-600">{insight.summary}</p>
              </div>
              <div className="flex flex-col gap-2 shrink-0">
                {!insight.is_read && (
                  <button
                    onClick={() => markRead.mutate(insight.id)}
                    className="text-xs font-medium text-brand-accent hover:text-brand-blue"
                  >
                    Mark read
                  </button>
                )}
                <button
                  onClick={() => dismiss.mutate(insight.id)}
                  className="text-xs text-slate-400 hover:text-slate-600"
                >
                  Dismiss
                </button>
              </div>
            </div>
          ))}
          {!visible.length && (
            <p className="app-panel p-6 text-sm text-slate-500">No active insights. Check back later.</p>
          )}
        </div>
      )}
    </div>
  );
}
