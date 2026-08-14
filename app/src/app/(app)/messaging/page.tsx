"use client";
import { useMemo, useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import apiClient from "@/lib/api";
import type { PaginatedResponse } from "@/types";
import { MessageSquare, Send, CheckCheck, Circle, Plus } from "lucide-react";
import { FilterProvider, useFilterValue } from "@/components/filters/FilterProvider";
import { PremiumFilterTabs } from "@/components/filters/PremiumFilterTabs";

interface Thread {
  id: string;
  subject: string;
  channel_type: string;
  is_open: boolean;
  last_message_at: string | null;
  created_at: string;
  customer: string; // UUID
}

interface ThreadMessage {
  id: string;
  direction: "inbound" | "outbound";
  body: string;
  is_read: boolean;
  created_at: string;
}

async function fetchThreads(page = 1) {
  const { data } = await apiClient.get<PaginatedResponse<Thread>>(
    `/messaging/threads/?page=${page}&page_size=25`
  );
  return data;
}

async function fetchMessages(threadId: string) {
  const { data } = await apiClient.get<PaginatedResponse<ThreadMessage>>(
    `/messaging/threads/${threadId}/messages/`
  );
  return data.results ?? [];
}

async function sendMessage(threadId: string, body: string) {
  const { data } = await apiClient.post(`/messaging/threads/${threadId}/reply/`, { body });
  return data;
}

const channelBadge: Record<string, string> = {
  email:    "bg-blue-100 text-blue-700",
  sms:      "bg-green-100 text-green-700",
  whatsapp: "bg-emerald-100 text-emerald-700",
  in_app:   "bg-purple-100 text-purple-700",
  push:     "bg-orange-100 text-orange-700",
};

const threadFilterOptions = [
  { label: "Open", value: "open" },
  { label: "Closed", value: "closed" },
  { label: "All", value: "all" },
] as const;

type ThreadFilter = (typeof threadFilterOptions)[number]["value"];

function MessagingContent() {
  const [page, setPage] = useState(1);
  const [selectedThread, setSelectedThread] = useState<Thread | null>(null);
  const [replyText, setReplyText] = useState("");
  const [filter, setFilter] = useFilterValue("thread-status", "open") as [ThreadFilter, (value: ThreadFilter) => void];
  const queryClient = useQueryClient();

  const { data: threadsData, isLoading: threadsLoading } = useQuery({
    queryKey: ["threads", page],
    queryFn: () => fetchThreads(page),
  });

  const { data: messages, isLoading: messagesLoading } = useQuery({
    queryKey: ["messages", selectedThread?.id],
    queryFn: () => fetchMessages(selectedThread!.id),
    enabled: Boolean(selectedThread?.id),
  });

  const replyMutation = useMutation({
    mutationFn: ({ threadId, body }: { threadId: string; body: string }) =>
      sendMessage(threadId, body),
    onSuccess: () => {
      setReplyText("");
      queryClient.invalidateQueries({ queryKey: ["messages", selectedThread?.id] });
      queryClient.invalidateQueries({ queryKey: ["threads"] });
    },
  });

  const filtered = useMemo(() => (threadsData?.results ?? []).filter((thread) => {
    if (filter === "open") return thread.is_open;
    if (filter === "closed") return !thread.is_open;
    return true;
  }), [filter, threadsData?.results]);

  const totalPages = threadsData ? Math.ceil(threadsData.count / 25) : 1;

  const handleSend = () => {
    if (!replyText.trim() || !selectedThread) return;
    replyMutation.mutate({ threadId: selectedThread.id, body: replyText.trim() });
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <section className="app-surface p-8 lg:p-10">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <p className="page-eyebrow">Messaging</p>
            <h2 className="page-title">Customer message threads and inbox</h2>
            <p className="page-copy">
              Manage inbound and outbound customer conversations across email, SMS, WhatsApp,
              and in-app channels from a unified inbox.
            </p>
          </div>
          <button className="btn-primary inline-flex items-center gap-2">
            <Plus size={15} /> New Thread
          </button>
        </div>
      </section>

      {/* Inbox layout */}
      <div className="grid gap-4 lg:grid-cols-[340px_1fr]" style={{ minHeight: "60vh" }}>

        {/* Thread list */}
        <div className="app-panel flex flex-col overflow-hidden">
          <div className="border-b border-black/10 px-4 py-3">
            <div className="flex items-center gap-3">
              <PremiumFilterTabs
                ariaLabel="Filter threads by status"
                options={threadFilterOptions}
                value={filter}
                onChange={setFilter}
              />
              <span className="ml-auto flex shrink-0 items-center text-xs text-black">
              {threadsData?.count ?? 0} threads
              </span>
            </div>
          </div>

          {/* List */}
          <div className="flex-1 overflow-y-auto">
            {threadsLoading ? (
              <div className="space-y-2 p-4">
                {[...Array(6)].map((_, i) => (
                  <div key={i} className="h-16 animate-pulse rounded-xl bg-slate-100" />
                ))}
              </div>
            ) : filtered.length === 0 ? (
              <div className="flex flex-col items-center gap-2 py-12 text-center">
                <MessageSquare size={28} className="text-slate-300" />
                <p className="text-sm text-slate-500">No threads found.</p>
              </div>
            ) : (
              filtered.map((thread) => (
                <button
                  key={thread.id}
                  onClick={() => setSelectedThread(thread)}
                  className={`w-full border-b border-slate-50 px-4 py-4 text-left transition hover:bg-slate-50 ${
                    selectedThread?.id === thread.id ? "bg-brand-light" : ""
                  }`}
                >
                  <div className="flex items-start justify-between gap-2">
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm font-semibold text-brand-dark">
                        {thread.subject || "No subject"}
                      </p>
                      <p className="mt-0.5 text-xs text-slate-400 truncate">
                        {thread.customer}
                      </p>
                    </div>
                    <div className="flex shrink-0 flex-col items-end gap-1">
                      <span
                        className={`rounded-full px-2 py-0.5 text-[10px] font-semibold capitalize ${channelBadge[thread.channel_type] ?? "bg-slate-100 text-slate-600"}`}
                      >
                        {thread.channel_type}
                      </span>
                      {thread.is_open ? (
                        <Circle size={8} className="fill-emerald-400 text-emerald-400" />
                      ) : (
                        <CheckCheck size={10} className="text-slate-300" />
                      )}
                    </div>
                  </div>
                  {thread.last_message_at && (
                    <p className="mt-2 text-[10px] text-slate-400">
                      {new Date(thread.last_message_at).toLocaleString()}
                    </p>
                  )}
                </button>
              ))
            )}
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex items-center justify-between border-t border-slate-100 px-4 py-3">
              <button
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={page === 1}
                className="rounded-lg border px-3 py-1 text-xs disabled:opacity-40"
              >
                Prev
              </button>
              <span className="text-xs text-slate-400">{page} / {totalPages}</span>
              <button
                onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                disabled={page === totalPages}
                className="rounded-lg border px-3 py-1 text-xs disabled:opacity-40"
              >
                Next
              </button>
            </div>
          )}
        </div>

        {/* Message pane */}
        <div className="app-panel flex flex-col overflow-hidden">
          {!selectedThread ? (
            <div className="flex flex-1 flex-col items-center justify-center gap-3 py-16 text-center">
              <MessageSquare size={40} className="text-slate-200" />
              <p className="text-sm font-medium text-slate-400">Select a thread to view messages</p>
            </div>
          ) : (
            <>
              {/* Thread header */}
              <div className="flex items-center justify-between border-b border-slate-100 px-6 py-4">
                <div>
                  <p className="font-semibold text-brand-dark">
                    {selectedThread.subject || "No subject"}
                  </p>
                  <p className="mt-0.5 text-xs text-slate-400">
                    {selectedThread.channel_type} ·{" "}
                    {selectedThread.is_open ? (
                      <span className="text-emerald-600">Open</span>
                    ) : (
                      <span className="text-slate-400">Closed</span>
                    )}
                  </p>
                </div>
                <span
                  className={`rounded-full px-2.5 py-0.5 text-xs font-medium ${channelBadge[selectedThread.channel_type] ?? ""}`}
                >
                  {selectedThread.channel_type}
                </span>
              </div>

              {/* Messages */}
              <div className="flex-1 overflow-y-auto space-y-4 px-6 py-6">
                {messagesLoading ? (
                  <div className="space-y-3">
                    {[...Array(4)].map((_, i) => (
                      <div key={i} className={`h-12 w-3/4 animate-pulse rounded-2xl bg-slate-100 ${i % 2 === 1 ? "ml-auto" : ""}`} />
                    ))}
                  </div>
                ) : (messages ?? []).length === 0 ? (
                  <p className="text-center text-sm text-slate-400">No messages in this thread.</p>
                ) : (
                  (messages ?? []).map((msg) => (
                    <div
                      key={msg.id}
                      className={`flex ${msg.direction === "outbound" ? "justify-end" : "justify-start"}`}
                    >
                      <div
                        className={`max-w-[75%] rounded-2xl px-4 py-3 text-sm leading-6 ${
                          msg.direction === "outbound"
                            ? "rounded-tr-sm bg-brand-accent text-white"
                            : "rounded-tl-sm bg-slate-100 text-slate-800"
                        }`}
                      >
                        <p>{msg.body}</p>
                        <p className={`mt-1 text-[10px] ${msg.direction === "outbound" ? "text-white/60" : "text-slate-400"}`}>
                          {new Date(msg.created_at).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                        </p>
                      </div>
                    </div>
                  ))
                )}
              </div>

              {/* Reply */}
              {selectedThread.is_open && (
                <div className="border-t border-slate-100 px-6 py-4">
                  <div className="flex items-end gap-3">
                    <textarea
                      value={replyText}
                      onChange={(e) => setReplyText(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === "Enter" && (e.metaKey || e.ctrlKey)) handleSend();
                      }}
                      placeholder="Type a reply… (Ctrl+Enter to send)"
                      rows={3}
                      className="flex-1 resize-none rounded-2xl border border-slate-200 px-4 py-3 text-sm text-slate-800 placeholder-slate-400 focus:border-brand-accent focus:outline-none focus:ring-1 focus:ring-brand-accent"
                    />
                    <button
                      onClick={handleSend}
                      disabled={!replyText.trim() || replyMutation.isPending}
                      className="flex h-11 w-11 items-center justify-center rounded-2xl bg-brand-accent text-white transition hover:opacity-90 disabled:opacity-40"
                    >
                      <Send size={16} />
                    </button>
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}

export default function MessagingPage() {
  return (
    <FilterProvider initialValues={{ "thread-status": "open" }}>
      <MessagingContent />
    </FilterProvider>
  );
}
