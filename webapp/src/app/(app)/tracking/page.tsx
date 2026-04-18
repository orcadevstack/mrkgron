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
  const { data } = await apiClient.get<Session[]>("/tracking/sessions/");
  return data;
}

async function fetchEvents() {
  const { data } = await apiClient.get<RawEvent[]>("/tracking/raw-events/");
  return data;
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
      <h1 className="text-2xl font-bold text-gray-900">Tracking</h1>

      {/* Sessions */}
      <section>
        <h2 className="text-lg font-semibold text-gray-700 mb-3">Recent Sessions</h2>
        {sessionsLoading ? (
          <p className="text-gray-500">Loading…</p>
        ) : (
          <div className="bg-white rounded-2xl shadow overflow-hidden">
            <table className="min-w-full divide-y divide-gray-100">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Anonymous ID</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Channel</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Started</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {sessions?.map((s) => (
                  <tr key={s.id}>
                    <td className="px-4 py-3 text-sm font-mono text-gray-700">{s.anonymous_id}</td>
                    <td className="px-4 py-3 text-sm text-gray-600 capitalize">{s.channel}</td>
                    <td className="px-4 py-3 text-sm text-gray-500">{new Date(s.started_at).toLocaleString()}</td>
                  </tr>
                ))}
                {!sessions?.length && (
                  <tr><td colSpan={3} className="px-4 py-6 text-center text-gray-400">No sessions yet.</td></tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      </section>

      {/* Raw Events */}
      <section>
        <h2 className="text-lg font-semibold text-gray-700 mb-3">Event Queue</h2>
        {eventsLoading ? (
          <p className="text-gray-500">Loading…</p>
        ) : (
          <div className="bg-white rounded-2xl shadow overflow-hidden">
            <table className="min-w-full divide-y divide-gray-100">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Event</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Received</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {events?.map((e) => (
                  <tr key={e.id}>
                    <td className="px-4 py-3 text-sm text-gray-800">{e.event_name}</td>
                    <td className="px-4 py-3">
                      <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${statusColors[e.status] ?? "bg-gray-100 text-gray-500"}`}>
                        {e.status}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-500">{new Date(e.received_at).toLocaleString()}</td>
                  </tr>
                ))}
                {!events?.length && (
                  <tr><td colSpan={3} className="px-4 py-6 text-center text-gray-400">No events queued.</td></tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      </section>
    </div>
  );
}
