"use client";
import { useEffect, useState, useCallback } from "react";
import {
  getFollowUpQueue,
  getFollowUpQueueStats,
  completeFollowUpStep,
  skipFollowUpStep,
  cancelProspectSequence,
  channelLabel,
  followUpStepStatusLabel,
  OUTREACH_CHANNELS,
  type FollowUpStep,
  type FollowUpQueueStats,
} from "@/lib/api";

// ─── Style maps ──────────────────────────────────────────────────────────────
const STEP_STATUS_COLORS: Record<number, string> = {
  0: "bg-blue-500/10 text-blue-400",       // Scheduled
  1: "bg-yellow-500/10 text-yellow-400",    // Due
  2: "bg-emerald-500/10 text-emerald-400",  // Completed
  3: "bg-zinc-500/10 text-zinc-400",        // Skipped
  4: "bg-red-500/10 text-red-400",          // Cancelled
};

const CHANNEL_COLORS: Record<number, string> = {
  0: "bg-blue-500/10 text-blue-400",     // Email
  1: "bg-sky-500/10 text-sky-400",       // LinkedIn
  2: "bg-indigo-500/10 text-indigo-400", // LinkedIn InMail
  3: "bg-emerald-500/10 text-emerald-400", // Phone
};

function stepLabel(step: FollowUpStep): string {
  return step.stepLabel || `Step ${step.stepNumber}`;
}

// ─── Complete Step Modal ────────────────────────────────────────────────────
function CompleteStepModal({ step, onClose, onCompleted }: {
  step: FollowUpStep;
  onClose: () => void;
  onCompleted: () => void;
}) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setError("");
    const fd = new FormData(e.currentTarget);
    try {
      await completeFollowUpStep(step.id, {
        channel: parseInt(fd.get("channel") as string),
        templateCategory: "Follow-Up",
        templateName: (fd.get("templateName") as string) || step.suggestedTemplateName || undefined,
        subject: (fd.get("subject") as string) || undefined,
        notes: (fd.get("notes") as string) || undefined,
      });
      onCompleted();
      onClose();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to complete step");
    } finally {
      setLoading(false);
    }
  }

  const inputCls = "w-full bg-background border border-border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-primary";

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center bg-black/60 backdrop-blur-sm px-4" onClick={onClose}>
      <div className="bg-surface border border-border rounded-2xl p-6 w-full max-w-md" onClick={(e) => e.stopPropagation()}>
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-lg font-bold">Complete Follow-Up</h2>
            <p className="text-xs text-muted mt-0.5">{step.companyName} &middot; {stepLabel(step)}</p>
          </div>
          <button onClick={onClose} className="text-muted hover:text-foreground text-xl">&times;</button>
        </div>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs text-muted mb-1">Channel</label>
            <select name="channel" defaultValue={step.channel} className={inputCls}>
              {OUTREACH_CHANNELS.map((s, i) => <option key={i} value={i}>{s}</option>)}
            </select>
          </div>
          <div>
            <label className="block text-xs text-muted mb-1">Template Used</label>
            <input name="templateName" defaultValue={step.suggestedTemplateName || ""} className={inputCls} />
          </div>
          <div>
            <label className="block text-xs text-muted mb-1">Subject Line</label>
            <input name="subject" className={inputCls} placeholder="Subject line used..." />
          </div>
          <div>
            <label className="block text-xs text-muted mb-1">Notes</label>
            <textarea name="notes" rows={2} className={inputCls + " resize-y"} placeholder="Any notes about this outreach..." />
          </div>
          {error && <p className="text-red-400 text-sm">{error}</p>}
          <div className="flex gap-3 pt-2">
            <button type="button" onClick={onClose} className="flex-1 px-4 py-2.5 rounded-full border border-border text-sm text-muted hover:text-foreground transition-colors">Cancel</button>
            <button type="submit" disabled={loading} className="flex-1 bg-primary hover:bg-primary-dark disabled:opacity-50 text-white px-4 py-2.5 rounded-full text-sm font-medium transition-all">
              {loading ? "Completing..." : "Mark Complete"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

// ─── Queue Stats Bar ──────────────────────────────────────────────────────
function QueueStatsBar({ stats }: { stats: FollowUpQueueStats | null }) {
  if (!stats) return null;
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 mb-8">
      <div className="bg-surface rounded-xl border border-border p-4">
        <p className={`text-2xl font-bold ${stats.overdueCount > 0 ? "text-red-400" : ""}`}>{stats.overdueCount}</p>
        <p className="text-xs text-muted">Overdue</p>
      </div>
      <div className="bg-surface rounded-xl border border-border p-4">
        <p className={`text-2xl font-bold ${stats.dueTodayCount > 0 ? "text-yellow-400" : ""}`}>{stats.dueTodayCount}</p>
        <p className="text-xs text-muted">Due Today</p>
      </div>
      <div className="bg-surface rounded-xl border border-border p-4">
        <p className="text-2xl font-bold">{stats.upcomingCount}</p>
        <p className="text-xs text-muted">Next 7 Days</p>
      </div>
      <div className="bg-surface rounded-xl border border-border p-4">
        <p className="text-2xl font-bold">{stats.totalScheduled}</p>
        <p className="text-xs text-muted">Total Queued</p>
      </div>
      <div className="bg-surface rounded-xl border border-border p-4">
        <p className="text-2xl font-bold text-emerald-400">{stats.completedThisWeek}</p>
        <p className="text-xs text-muted">Done This Week</p>
      </div>
      <div className="bg-surface rounded-xl border border-border p-4">
        <p className="text-2xl font-bold text-zinc-400">{stats.skippedThisWeek}</p>
        <p className="text-xs text-muted">Skipped This Week</p>
      </div>
    </div>
  );
}

// ─── Follow-Up Card ──────────────────────────────────────────────────────
function FollowUpCard({ step, onComplete, onSkip, onCancel }: {
  step: FollowUpStep;
  onComplete: (step: FollowUpStep) => void;
  onSkip: (step: FollowUpStep) => void;
  onCancel: (step: FollowUpStep) => void;
}) {
  const scheduledDate = new Date(step.scheduledDate);
  const isOverdue = step.isOverdue;
  const isDueToday = step.daysUntilDue === 0;

  return (
    <div className={`p-4 rounded-xl border transition-all ${
      isOverdue
        ? "border-red-500/30 bg-red-500/[0.03]"
        : isDueToday
        ? "border-yellow-500/30 bg-yellow-500/[0.03]"
        : "border-border/50 bg-background/50 hover:border-border"
    }`}>
      <div className="flex items-start justify-between gap-4">
        <div className="min-w-0 flex-1">
          {/* Company & Contact */}
          <div className="flex items-center gap-2 mb-1">
            <h3 className="text-sm font-semibold truncate">{step.companyName}</h3>
            {isOverdue && (
              <span className="shrink-0 text-[10px] px-2 py-0.5 rounded-full bg-red-500/10 text-red-400 font-medium">
                {Math.abs(step.daysUntilDue)}d OVERDUE
              </span>
            )}
            {isDueToday && !isOverdue && (
              <span className="shrink-0 text-[10px] px-2 py-0.5 rounded-full bg-yellow-500/10 text-yellow-400 font-medium">
                DUE TODAY
              </span>
            )}
          </div>
          <p className="text-xs text-muted mb-2">{step.prospectName}</p>

          {/* Step info */}
          <div className="flex flex-wrap items-center gap-2 mb-2">
            <span className={`text-[10px] px-2 py-0.5 rounded-full ${CHANNEL_COLORS[step.channel] || ""}`}>
              {channelLabel(step.channel)}
            </span>
            <span className="text-[10px] px-2 py-0.5 rounded-full bg-surface-lighter text-muted">
              {stepLabel(step)}
            </span>
            <span className="text-[10px] text-muted">
              {scheduledDate.toLocaleDateString("en-US", { weekday: "short", month: "short", day: "numeric" })}
            </span>
          </div>

          {/* Template suggestion */}
          {step.suggestedTemplateName && (
            <p className="text-xs text-muted/80 truncate">
              Template: <span className="text-foreground/70">{step.suggestedTemplateName}</span>
            </p>
          )}

          {/* Contact info */}
          <div className="flex gap-3 mt-2">
            {step.email && (
              <a href={`mailto:${step.email}`} className="text-[10px] text-primary hover:underline truncate">{step.email}</a>
            )}
            {step.phone && (
              <a href={`tel:${step.phone}`} className="text-[10px] text-primary hover:underline">{step.phone}</a>
            )}
          </div>
        </div>

        {/* Actions */}
        <div className="flex flex-col gap-1.5 shrink-0">
          <button
            onClick={() => onComplete(step)}
            className="px-3 py-1.5 rounded-full text-xs font-medium bg-primary/10 text-primary hover:bg-primary/20 border border-primary/20 transition-all"
          >
            Complete
          </button>
          <button
            onClick={() => onSkip(step)}
            className="px-3 py-1.5 rounded-full text-xs font-medium bg-zinc-500/10 text-zinc-300 hover:bg-zinc-500/20 border border-zinc-500/20 transition-all"
          >
            Skip
          </button>
          <button
            onClick={() => onCancel(step)}
            className="px-3 py-1.5 rounded-full text-xs font-medium text-red-400/60 hover:text-red-400 hover:bg-red-500/10 transition-all"
          >
            Cancel All
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── Main Follow-ups Page ────────────────────────────────────────────────
export default function FollowUpsPage() {
  const [steps, setSteps] = useState<FollowUpStep[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [filter, setFilter] = useState<"overdue" | "today" | "upcoming" | "all">("all");
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState<FollowUpQueueStats | null>(null);
  const [completingStep, setCompletingStep] = useState<FollowUpStep | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const [queueData, statsData] = await Promise.all([
        getFollowUpQueue(page, 50, filter),
        getFollowUpQueueStats(),
      ]);
      setSteps(queueData.items);
      setTotal(queueData.total);
      setStats(statsData);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, [page, filter]);

  useEffect(() => { load(); }, [load]);

  async function handleSkip(step: FollowUpStep) {
    try {
      await skipFollowUpStep(step.id);
      load();
    } catch {
      alert("Failed to skip step");
    }
  }

  async function handleCancelAll(step: FollowUpStep) {
    if (!confirm(`Cancel ALL remaining follow-ups for ${step.companyName}?`)) return;
    try {
      await cancelProspectSequence(step.prospectId);
      load();
    } catch {
      alert("Failed to cancel sequence");
    }
  }

  const totalPages = Math.ceil(total / 50);

  // Group steps by urgency for the "all" view
  const overdueSteps = steps.filter(s => s.isOverdue);
  const todaySteps = steps.filter(s => s.daysUntilDue === 0 && !s.isOverdue);
  const upcomingSteps = steps.filter(s => s.daysUntilDue > 0);

  return (
    <div className="p-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold">Follow-up Queue</h1>
          <p className="text-sm text-muted mt-1">
            {stats ? (
              <>
                {stats.overdueCount > 0 && <span className="text-red-400 font-medium">{stats.overdueCount} overdue</span>}
                {stats.overdueCount > 0 && stats.dueTodayCount > 0 && " · "}
                {stats.dueTodayCount > 0 && <span className="text-yellow-400 font-medium">{stats.dueTodayCount} due today</span>}
                {(stats.overdueCount > 0 || stats.dueTodayCount > 0) && " · "}
                {stats.totalScheduled} total queued
              </>
            ) : "Loading..."}
          </p>
        </div>
      </div>

      {/* Stats */}
      <QueueStatsBar stats={stats} />

      {/* Filters */}
      <div className="flex flex-wrap gap-2 mb-6">
        {([
          { key: "all" as const, label: "All Active", count: stats?.totalScheduled },
          { key: "overdue" as const, label: "Overdue", count: stats?.overdueCount },
          { key: "today" as const, label: "Due Today", count: stats?.dueTodayCount },
          { key: "upcoming" as const, label: "Next 7 Days", count: stats?.upcomingCount },
        ]).map(({ key, label, count }) => (
          <button key={key}
            onClick={() => { setFilter(key); setPage(1); }}
            className={`text-xs px-3 py-1.5 rounded-full border transition-all ${
              filter === key
                ? key === "overdue" ? "border-red-500/30 text-red-400 bg-red-500/10"
                : key === "today" ? "border-yellow-500/30 text-yellow-400 bg-yellow-500/10"
                : "border-primary text-primary bg-primary/10"
                : "border-border text-muted hover:text-foreground"
            }`}>
            {label}{count !== undefined ? ` (${count})` : ""}
          </button>
        ))}
      </div>

      {/* Queue list */}
      {loading ? (
        <p className="text-sm text-muted text-center py-12">Loading queue...</p>
      ) : steps.length === 0 ? (
        <div className="text-center py-16">
          <p className="text-lg font-semibold text-muted mb-2">Queue is clear</p>
          <p className="text-sm text-muted/70">
            No follow-ups {filter === "all" ? "scheduled" : filter === "overdue" ? "overdue" : filter === "today" ? "due today" : "upcoming"}.
            Follow-ups are auto-created when you log initial outreach to a prospect.
          </p>
        </div>
      ) : filter === "all" ? (
        /* Grouped view for "all" */
        <div className="space-y-8">
          {overdueSteps.length > 0 && (
            <div>
              <h2 className="text-xs font-semibold text-red-400 uppercase tracking-wider mb-3">
                Overdue ({overdueSteps.length})
              </h2>
              <div className="space-y-3">
                {overdueSteps.map(s => (
                  <FollowUpCard key={s.id} step={s} onComplete={setCompletingStep} onSkip={handleSkip} onCancel={handleCancelAll} />
                ))}
              </div>
            </div>
          )}
          {todaySteps.length > 0 && (
            <div>
              <h2 className="text-xs font-semibold text-yellow-400 uppercase tracking-wider mb-3">
                Due Today ({todaySteps.length})
              </h2>
              <div className="space-y-3">
                {todaySteps.map(s => (
                  <FollowUpCard key={s.id} step={s} onComplete={setCompletingStep} onSkip={handleSkip} onCancel={handleCancelAll} />
                ))}
              </div>
            </div>
          )}
          {upcomingSteps.length > 0 && (
            <div>
              <h2 className="text-xs font-semibold text-muted uppercase tracking-wider mb-3">
                Upcoming ({upcomingSteps.length})
              </h2>
              <div className="space-y-3">
                {upcomingSteps.map(s => (
                  <FollowUpCard key={s.id} step={s} onComplete={setCompletingStep} onSkip={handleSkip} onCancel={handleCancelAll} />
                ))}
              </div>
            </div>
          )}
        </div>
      ) : (
        /* Flat list for filtered views */
        <div className="space-y-3">
          {steps.map(s => (
            <FollowUpCard key={s.id} step={s} onComplete={setCompletingStep} onSkip={handleSkip} onCancel={handleCancelAll} />
          ))}
        </div>
      )}

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-2 mt-8">
          <button disabled={page <= 1} onClick={() => setPage(page - 1)}
            className="text-xs px-3 py-1.5 rounded-full border border-border text-muted hover:text-foreground disabled:opacity-30 transition-all">
            Prev
          </button>
          <span className="text-xs text-muted">Page {page} of {totalPages}</span>
          <button disabled={page >= totalPages} onClick={() => setPage(page + 1)}
            className="text-xs px-3 py-1.5 rounded-full border border-border text-muted hover:text-foreground disabled:opacity-30 transition-all">
            Next
          </button>
        </div>
      )}

      {/* Complete step modal */}
      {completingStep && (
        <CompleteStepModal
          step={completingStep}
          onClose={() => setCompletingStep(null)}
          onCompleted={load}
        />
      )}
    </div>
  );
}