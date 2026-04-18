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
    <div>
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Insights</h1>
      {isLoading ? (
        <p className="text-gray-500">Loading…</p>
      ) : (
        <div className="space-y-3">
          {visible.map((insight) => (
            <div
              key={insight.id}
              className={`bg-white rounded-2xl shadow p-5 flex gap-4 ${insight.is_read ? "opacity-60" : ""}`}
            >
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${priorityColors[insight.priority]}`}>
                    {insight.priority}
                  </span>
                  <span className="text-xs text-gray-400">{insight.insight_type.replace(/_/g, " ")}</span>
                </div>
                <h2 className="font-semibold text-gray-900">{insight.title}</h2>
                <p className="text-sm text-gray-600 mt-1">{insight.summary}</p>
              </div>
              <div className="flex flex-col gap-2 shrink-0">
                {!insight.is_read && (
                  <button
                    onClick={() => markRead.mutate(insight.id)}
                    className="text-xs text-primary-600 hover:underline"
                  >
                    Mark read
                  </button>
                )}
                <button
                  onClick={() => dismiss.mutate(insight.id)}
                  className="text-xs text-gray-400 hover:text-gray-600"
                >
                  Dismiss
                </button>
              </div>
            </div>
          ))}
          {!visible.length && (
            <p className="text-gray-500">No active insights. Check back later.</p>
          )}
        </div>
      )}
    </div>
  );
}
