"use client";

import { useEffect, useState } from "react";
type Tone = "professional" | "friendly" | "apologetic";

type HistoryItem = {
  id: string;
  query: string;
  tone: Tone;
  response: string;
  createdAt: string;
  topicLabel?: string;
  topicId?: string;
};

function createId() {
  return (
    Date.now().toString(36) + "-" + Math.random().toString(36).substring(2, 10)
  );
}

function topicLabelFromId(id?: string): string | undefined {
  if (!id) return;
  switch (id) {
    case "billing-refund":
      return "Billing / refund";
    case "login-issues":
      return "Login / access";
    case "subscription-cancel":
      return "Subscription / cancellation";
    case "feature-request":
      return "Feature request";
    case "performance-issues":
      return "Performance / speed";
    case "generic-fallback":
      return "Needs human review";
    default:
      return undefined;
  }
}

export default function HomePage() {
  const [query, setQuery] = useState("");
  const [tone, setTone] = useState<Tone>("professional");
  const [response, setResponse] = useState("");
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [history, setHistory] = useState<HistoryItem[]>([]);
  const [isEditing, setIsEditing] = useState(false);
  const [draftResponse, setDraftResponse] = useState("");
  const [editingHistoryId, setEditingHistoryId] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  const [currentTopicId, setCurrentTopicId] = useState<string | undefined>();
  // Load from localStorage once on mount
  useEffect(() => {
    try {
      if (typeof window === "undefined") return;

      const raw = window.localStorage.getItem("acs-history");
      if (!raw) return;

      const parsed = JSON.parse(raw) as HistoryItem[];

      if (Array.isArray(parsed)) {
        setHistory(parsed);
      }
    } catch (err) {
      console.error("Failed to load history from localStorage", err);
    }
  }, []);

  useEffect(() => {
    try {
      if (typeof window === "undefined") return;
      if (!history.length) {
        // Optional: remove key when empty
        window.localStorage.removeItem("acs-history");
        return;
      }
      window.localStorage.setItem("acs-history", JSON.stringify(history));
    } catch (err) {
      console.error("Failed to save history to localStorage", err);
    }
  }, [history]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim() || loading) return;

    setLoading(true);
    setResponse("");
    setErrorMessage("");

    try {
      const res = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ query, tone }),
      });

      const data = await res.json();

      if (!res.ok) {
        setErrorMessage(data?.error || "Failed to generate response");
        return;
      }

      if (!data?.response) {
        setErrorMessage("AI did not return a response");
        return;
      }

      setResponse(data.response);
      setCurrentTopicId(data.matchedId);

      const meta = topicMetaFromId(data.matchedId);

      const item: HistoryItem = {
        id: createId(),
        query,
        tone,
        response: data.response,
        createdAt: new Date().toISOString(),
        topicLabel: meta?.label,
        topicId: data.matchedId,
      };
      setHistory((prev) => [item, ...prev]);
    } catch (err) {
      console.error(err);
      setErrorMessage("Unexpected error. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = async () => {
    if (!response) return;

    try {
      if (typeof navigator === "undefined") {
        console.warn("Navigator not available for clipboard");
        return;
      }

      if (!navigator.clipboard || !navigator.clipboard.writeText) {
        console.warn("Clipboard API not available in this environment");
        return;
      }

      await navigator.clipboard.writeText(response);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500); // 1.5s micro-feedback
    } catch (err) {
      console.error("Copy failed", err);
    }
  };

  const handleHistoryClick = (item: HistoryItem) => {
    setQuery(item.query);
    setTone(item.tone);
    setResponse(item.response);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleSaveEdit = () => {
    if (!draftResponse.trim()) return;

    // Update current response
    setResponse(draftResponse);

    // Update matching history item (if any)
    if (editingHistoryId) {
      setHistory((prev) =>
        prev.map((item) =>
          item.id === editingHistoryId
            ? { ...item, response: draftResponse }
            : item,
        ),
      );
    } else if (history.length > 0) {
      // Fallback: update latest entry
      const latestId = history[0].id;
      setHistory((prev) =>
        prev.map((item) =>
          item.id === latestId ? { ...item, response: draftResponse } : item,
        ),
      );
    }

    setIsEditing(false);
    setEditingHistoryId(null);
  };

  const handleCancelEdit = () => {
    setIsEditing(false);
    setDraftResponse("");
    setEditingHistoryId(null);
  };

  const handleRegenerate = async () => {
    if (!query.trim() || loading) return;

    setLoading(true);
    setErrorMessage("");

    try {
      const res = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ query, tone }),
      });

      const data = await res.json();

      if (!res.ok) {
        setErrorMessage(data?.error || "Failed to regenerate response");
        return;
      }

      if (!data?.response) {
        setErrorMessage("AI did not return a response");
        return;
      }

      setResponse(data.response);
      setCurrentTopicId(data.matchedId);

      const meta = topicMetaFromId(data.matchedId);

      const item: HistoryItem = {
        id: createId(),
        query,
        tone,
        response: data.response,
        createdAt: new Date().toISOString(),
        topicLabel: meta?.label,
        topicId: data.matchedId,
      };
      setHistory((prev) => [item, ...prev]);
    } catch (err) {
      console.error(err);
      setErrorMessage("Unexpected error. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  type TopicMeta = {
    label: string;
    colorClass: string; // Tailwind classes for badge
  };

  function topicMetaFromId(id?: string): TopicMeta | undefined {
    if (!id) return;

    switch (id) {
      case "billing-refund":
        return {
          label: "Refund",
          colorClass: "bg-amber-500/10 text-amber-300 border-amber-500/40",
        };
      case "login-issues":
        return {
          label: "Login / Access",
          colorClass: "bg-sky-500/10 text-sky-300 border-sky-500/40",
        };
      case "subscription-cancel":
        return {
          label: "Subscription",
          colorClass: "bg-indigo-500/10 text-indigo-300 border-indigo-500/40",
        };
      case "feature-request":
        return {
          label: "Feature Request",
          colorClass:
            "bg-emerald-500/10 text-emerald-300 border-emerald-500/40",
        };
      case "performance-issues":
        return {
          label: "Performance",
          colorClass: "bg-rose-500/10 text-rose-300 border-rose-500/40",
        };
      case "generic-fallback":
        return {
          label: "Needs Review",
          colorClass: "bg-slate-500/10 text-slate-300 border-slate-500/40",
        };
      default:
        return undefined;
    }
  }

  return (
    <div className="flex flex-1 flex-col gap-6">
      {/* Main grid */}
      <div className="grid gap-6 md:grid-cols-2">
        {/* Left: query + tone */}
        <section className="space-y-4">
          <div className="rounded-xl border border-slate-800 bg-slate-900/70 p-4 shadow-sm shadow-slate-950/40 transition-colors hover:border-slate-700">
            {" "}
            <h2 className="text-sm font-semibold text-slate-100">
              Customer message
            </h2>
            <p className="mt-1 text-xs text-slate-400">
              Paste or type the customer&apos;s email, chat, or ticket.
            </p>
            <form onSubmit={handleSubmit} className="mt-3 space-y-3">
              <textarea
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                rows={6}
                className="w-full rounded-lg border border-slate-700 bg-slate-950/60 px-3 py-2 text-sm text-slate-100 placeholder:text-slate-500 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                placeholder="E.g. 'Hi, my payment failed but I was still charged...'"
              />

              {/* Tone selector */}
              <div className="space-y-2">
                <p className="text-xs font-medium text-slate-300">Tone</p>
                <div className="inline-flex rounded-lg border border-slate-700 bg-slate-950/80 p-1 text-xs">
                  <ToneButton
                    label="Professional"
                    value="professional"
                    current={tone}
                    onClick={setTone}
                  />
                  <ToneButton
                    label="Friendly"
                    value="friendly"
                    current={tone}
                    onClick={setTone}
                  />
                  <ToneButton
                    label="Apologetic"
                    value="apologetic"
                    current={tone}
                    onClick={setTone}
                  />
                </div>
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="submit"
                  disabled={loading || !query.trim()}
                  className="inline-flex items-center justify-center rounded-lg bg-indigo-500 px-4 py-2 text-xs font-medium text-white shadow-sm shadow-indigo-950/60 transition-all hover:bg-indigo-400 hover:shadow-md hover:shadow-indigo-950/60 disabled:opacity-50 disabled:hover:bg-indigo-500 disabled:hover:shadow-sm"
                >
                  {loading ? "Generating..." : "Generate response"}
                </button>

                <button
                  type="button"
                  disabled={loading || !response}
                  onClick={handleRegenerate}
                  className="inline-flex items-center justify-center rounded-lg border border-slate-700 bg-slate-900/80 px-3 py-2 text-xs font-medium text-slate-200 shadow-sm shadow-slate-950/40 transition-colors hover:bg-slate-800 disabled:opacity-40"
                >
                  {loading ? "..." : "Regenerate"}
                </button>
              </div>

              {errorMessage && (
                <p className="text-xs text-rose-400">{errorMessage}</p>
              )}
            </form>
          </div>
        </section>

        {/* Right: AI response */}
        {/* Right: AI response */}
        <section className="rounded-xl border border-slate-800 bg-slate-900/70 p-4 shadow-sm shadow-slate-950/40 transition-colors hover:border-slate-700">
          <div className="flex items-center justify-between gap-4">
            <div>
              <h2 className="text-sm font-semibold text-slate-100">
                AI response
              </h2>
              {currentTopicId && (
                <p className="mt-1 text-[11px] text-emerald-400">
                  Detected topic:{" "}
                  {topicMetaFromId(currentTopicId)?.label ?? "Other"}
                </p>
              )}
            </div>

            <div className="flex items-center gap-2">
              {/* EDIT button */}
              {response && !loading && (
                <button
                  type="button"
                  onClick={() => {
                    setIsEditing(true);
                    setDraftResponse(response);
                    setEditingHistoryId(history[0]?.id ?? null);
                  }}
                  className="inline-flex items-center rounded-lg border border-slate-700 bg-slate-900/80 px-2 py-1 text-[11px] text-slate-200 hover:bg-slate-800"
                >
                  Edit
                </button>
              )}

              {copied && (
                <span className="text-[11px] text-emerald-400">Copied ✅</span>
              )}
              <button
                type="button"
                onClick={handleCopy}
                disabled={!response}
                className="inline-flex items-center rounded-lg border border-slate-700 bg-slate-900/80 px-3 py-1 text-xs text-slate-200 hover:bg-slate-800 disabled:opacity-40"
              >
                Copy
              </button>
            </div>
          </div>

          <div className="mt-2 min-h-[180px] rounded-xl border border-slate-800 bg-slate-900/60 p-4 text-sm text-slate-100">
            {loading ? (
              <div className="space-y-2 animate-pulse">
                <div className="h-3 w-3/4 rounded bg-slate-800" />
                <div className="h-3 w-2/3 rounded bg-slate-800" />
                <div className="h-3 w-5/6 rounded bg-slate-800" />
              </div>
            ) : isEditing ? (
              <div className="space-y-3">
                <textarea
                  value={draftResponse}
                  onChange={(e) => setDraftResponse(e.target.value)}
                  rows={6}
                  className="w-full rounded-lg border border-slate-700 bg-slate-950/60 px-3 py-2 text-sm text-slate-100 placeholder:text-slate-500 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                />
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={handleSaveEdit}
                    disabled={!draftResponse.trim()}
                    className="inline-flex items-center justify-center rounded-lg bg-emerald-500 px-3 py-1 text-xs font-medium text-white hover:bg-emerald-400 disabled:opacity-50"
                  >
                    Save
                  </button>
                  <button
                    type="button"
                    onClick={handleCancelEdit}
                    className="inline-flex items-center justify-center rounded-lg border border-slate-700 bg-slate-900/80 px-3 py-1 text-xs text-slate-200 hover:bg-slate-800"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            ) : response ? (
              <p className="whitespace-pre-line">{response}</p>
            ) : (
              <p className="text-xs text-slate-500">
                Your AI reply will appear here. Keep it short, clear, and on
                brand.
              </p>
            )}
          </div>
        </section>
      </div>

      {/* History section */}
      <section className="rounded-xl border border-slate-800 bg-slate-900/70 p-4 shadow-sm shadow-slate-950/40 transition-colors hover:border-slate-700">
        <div className="mb-3 flex items-center justify-between gap-2">
          <div>
            <h2 className="text-sm font-semibold text-slate-100">
              Response history
            </h2>
            <p className="text-[11px] text-slate-500">
              Saved across sessions on this device.
            </p>
          </div>
          {history.length > 0 && (
            <button
              type="button"
              onClick={() => setHistory([])}
              className="rounded-md border border-slate-700 px-2 py-1 text-[11px] text-slate-300 hover:bg-slate-800"
            >
              Clear
            </button>
          )}
        </div>

        {history.length === 0 ? (
          <p className="text-xs text-slate-500">
            Generated responses will be saved here for this session.
          </p>
        ) : (
          <ul className="space-y-2 text-xs">
            {history.map((item) => (
              <li
                key={item.id}
                className="flex items-start justify-between gap-2 rounded-lg border border-slate-800 bg-slate-950/60 px-3 py-2"
              >
                <div className="min-w-0">
                  <p className="truncate text-slate-100">
                    {item.query.length > 80
                      ? item.query.slice(0, 80) + "…"
                      : item.query}
                  </p>
                  <div className="mt-1 flex flex-wrap items-center gap-2">
                    {item.topicId && (
                      <span
                        className={[
                          "inline-flex items-center rounded-full border px-2 py-[1px] text-[10px] font-medium",
                          topicMetaFromId(item.topicId)?.colorClass ??
                            "bg-slate-500/10 text-slate-300 border-slate-500/40",
                        ].join(" ")}
                      >
                        {topicMetaFromId(item.topicId)?.label ?? "Other"}
                      </span>
                    )}
                    <span className="text-[11px] text-slate-500">
                      {item.tone.charAt(0).toUpperCase() + item.tone.slice(1)} •{" "}
                      {new Date(item.createdAt).toLocaleTimeString()}
                    </span>
                  </div>
                </div>
                <div className="flex flex-col items-end gap-1">
                  <button
                    type="button"
                    onClick={() => handleHistoryClick(item)}
                    className="whitespace-nowrap rounded-md border border-slate-700 px-2 py-1 text-[11px] text-slate-200 hover:bg-slate-800"
                  >
                    Reuse
                  </button>
                </div>
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  );
}

type ToneButtonProps = {
  label: string;
  value: Tone;
  current: Tone;
  onClick: (tone: Tone) => void;
};

function ToneButton({ label, value, current, onClick }: ToneButtonProps) {
  const active = current === value;
  return (
    <button
      type="button"
      onClick={() => onClick(value)}
      className={[
        "px-3 py-1 rounded-md border text-xs font-medium transition-colors cursor-pointer",
        active
          ? "border-indigo-500 bg-indigo-500 text-white"
          : "border-transparent text-slate-300 hover:bg-slate-800",
      ].join(" ")}
    >
      {label}
    </button>
  );
}
