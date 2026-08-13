"use client";
import { useQuery } from "@tanstack/react-query";
import apiClient from "@/lib/api";

interface Session {
  id: string;
  anonymous_id: string;
  channel: string;
  started_at: string;
  page_view_count?: number;
}

interface RawEvent {
  id: string;
  event_name: string;
  status: string;
  received_at: string;
}

async function fetchSessions() {
  const { data } = await apiClient.get<{ results: Session[] }>("/tracking/sessions/");
  return data.results ?? [];
}

async function fetchEvents() {
  const { data } = await apiClient.get<{ results: RawEvent[] }>("/tracking/raw-events/");
  return data.results ?? [];
}

const statusColors: Record<string, string> = {
  pending: "bg-yellow-100 text-yellow-700",
  processed: "bg-green-100 text-green-700",
  failed: "bg-red-100 text-red-700",
};

export default function TrackingPage() {
  const { data: sessions, isLoading: sessionsLoading } = useQuery({ queryKey: ["sessions"], queryFn: fetchSessions });
  const { data: events, isLoading: eventsLoading } = useQuery({ queryKey: ["raw-events"], queryFn: fetchEvents });

  return (
    <div className="space-y-8">
      <section className="app-surface p-8 lg:p-10">
        <p className="page-eyebrow">Tracking</p>
        <h2 className="page-title">Session and event observability</h2>
        <p className="page-copy">Monitor acquisition sessions and raw event processing from a cleaner operational ledger.</p>
      </section>

      {/* Sessions */}
      <section>
        <h2 className="mb-3 text-lg font-semibold text-brand-dark">Recent Sessions</h2>
        {sessionsLoading ? (
          <p className="app-panel px-6 py-10 text-sm text-slate-500">Loading sessions...</p>
        ) : (
          <div className="app-panel overflow-hidden">
            <table className="app-table">
              <thead>
                <tr>
                  <th>Anonymous ID</th>
                  <th>Channel</th>
                  <th>Started</th>
                </tr>
              </thead>
              <tbody>
                {sessions?.map((s) => (
                  <tr key={s.id} className="hover:bg-slate-50">
                    <td className="font-mono text-sm text-slate-700">{s.anonymous_id}</td>
                    <td className="text-sm capitalize text-slate-600">{s.channel}</td>
                    <td className="text-sm text-slate-500">{new Date(s.started_at).toLocaleString()}</td>
                  </tr>
                ))}
                {!sessions?.length && (
                  <tr><td colSpan={3} className="px-4 py-6 text-center text-slate-400">No sessions yet.</td></tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      </section>

      {/* Raw Events */}
      <section>
        <h2 className="mb-3 text-lg font-semibold text-brand-dark">Event Queue</h2>
        {eventsLoading ? (
          <p className="app-panel px-6 py-10 text-sm text-slate-500">Loading raw events...</p>
        ) : (
          <div className="app-panel overflow-hidden">
            <table className="app-table">
              <thead>
                <tr>
                  <th>Event</th>
                  <th>Status</th>
                  <th>Received</th>
                </tr>
              </thead>
              <tbody>
                {events?.map((e) => (
                  <tr key={e.id} className="hover:bg-slate-50">
                    <td className="text-sm text-brand-dark">{e.event_name}</td>
                    <td>
                      <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${statusColors[e.status] ?? "bg-gray-100 text-gray-500"}`}>
                        {e.status}
                      </span>
                    </td>
                    <td className="text-sm text-slate-500">{new Date(e.received_at).toLocaleString()}</td>
                  </tr>
                ))}
                {!events?.length && (
                  <tr><td colSpan={3} className="px-4 py-6 text-center text-slate-400">No events queued.</td></tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      </section>
    </div>
  );
}
