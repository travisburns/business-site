"use client";

import { useState, useEffect, useCallback, useRef, type FormEvent } from "react";
import {
  getLeads,
  createLead,
  updateLead,
  deleteLead,
  exportLeads,
  submitOnboarding,
  LEAD_STATUSES,
  type Lead,
} from "@/lib/api";
import {
  startScrapingSession,
  getScrapingProgress,
  getScrapedLeads,
  importScrapedLead,
  type ScrapedLead,
  type ScrapingProgress,
} from "@/lib/scraperApi";
import Link from "next/link";

type LeadStatus = (typeof LEAD_STATUSES)[number];
type ActiveTab = "scraper" | "contractor-leads" | "leads";

const STATUS_COLORS: Record<LeadStatus, string> = {
  New: "bg-blue-500/10 text-blue-400 border-blue-500/20",
  Contacted: "bg-yellow-500/10 text-yellow-400 border-yellow-500/20",
  Quoted: "bg-purple-500/10 text-purple-400 border-purple-500/20",
  Won: "bg-green-500/10 text-green-400 border-green-500/20",
  Lost: "bg-red-500/10 text-red-400 border-red-500/20",
};

// ─── Contractor Lead type (display model, mapped from ScrapedLead) ──────────
interface ContractorLead {
  id: string;
  rawId: number; // DB id used for importScrapedLead
  company: string;
  city: string;
  state: string;
  service: string;
  phone?: string;
  email?: string;
  website?: string;
  hasWebsite: boolean;
  websiteGrade: "A" | "B" | "C" | "D" | "F" | "None";
  avgRating: number;
  opportunityScore: number; // 0–100 derived from conversionProbability
  addedToProspects: boolean;
}

function mapScrapedLead(lead: ScrapedLead): ContractorLead {
  const score = Math.round((lead.conversionProbability ?? 0) * 100);
  const grade = !lead.website
    ? "None"
    : score >= 75 ? "A"
    : score >= 55 ? "B"
    : score >= 35 ? "C"
    : score >= 20 ? "D"
    : "F";
  return {
    id: String(lead.id),
    rawId: lead.id,
    company: lead.businessName,
    city: lead.city ?? "",
    state: lead.state ?? "",
    service: lead.categories || lead.industry || "General",
    phone: lead.phone || undefined,
    email: lead.email,
    website: lead.website,
    hasWebsite: !!lead.website,
    websiteGrade: grade,
    avgRating: lead.rating ?? 0,
    opportunityScore: score,
    addedToProspects: lead.isManaged ?? false,
  };
}

const GRADE_COLORS: Record<ContractorLead["websiteGrade"], string> = {
  A: "bg-green-500/10 text-green-400 border-green-500/20",
  B: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20",
  C: "bg-yellow-500/10 text-yellow-400 border-yellow-500/20",
  D: "bg-orange-500/10 text-orange-400 border-orange-500/20",
  F: "bg-red-500/10 text-red-400 border-red-500/20",
  None: "bg-zinc-500/10 text-zinc-400 border-zinc-500/20",
};

function scoreColor(score: number) {
  if (score >= 80) return "text-green-400";
  if (score >= 60) return "text-yellow-400";
  if (score >= 40) return "text-orange-400";
  return "text-red-400";
}

// ─── Run Scraper Tab ──────────────────────────────────────────────────────────
type ScraperStatus = "idle" | "running" | "done" | "error";

interface LogLine {
  ts: string;
  msg: string;
  type: "info" | "success" | "warn" | "error";
}

function RunScraperTab({ onScrapeDone }: { onScrapeDone: (results: ScrapedLead[]) => void }) {
  const [niche, setNiche] = useState("contractors");
  const [city, setCity] = useState("");
  const [stateVal, setStateVal] = useState("");
  const [targetCount, setTargetCount] = useState(50);
  const [sessionName, setSessionName] = useState("");
  const [status, setStatus] = useState<ScraperStatus>("idle");
  const [logs, setLogs] = useState<LogLine[]>([]);
  const [progress, setProgress] = useState<ScrapingProgress | null>(null);
  const logRef = useRef<HTMLDivElement>(null);
  const pollRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    if (logRef.current) logRef.current.scrollTop = logRef.current.scrollHeight;
  }, [logs]);

  useEffect(() => {
    return () => { if (pollRef.current) clearInterval(pollRef.current); };
  }, []);

  function addLog(msg: string, type: LogLine["type"] = "info") {
    const ts = new Date().toLocaleTimeString("en-US", { hour12: false });
    setLogs((prev) => [...prev, { ts, msg, type }]);
  }

  async function handleRun(e: FormEvent) {
    e.preventDefault();
    if (!city.trim() || !stateVal.trim() || !niche.trim()) return;

    if (pollRef.current) clearInterval(pollRef.current);
    setStatus("running");
    setLogs([]);
    setProgress(null);

    const location = `${city.trim()}, ${stateVal.trim()}`;
    addLog(`Starting scraper — "${niche}" in ${location}`, "info");
    addLog(`Target: ${targetCount} leads`, "info");

    try {
      const result = await startScrapingSession({
        Niche: niche,
        Location: location,
        TargetCount: targetCount,
        SessionName: sessionName || `${niche} — ${location}`,
        DelayMin: 4,
        DelayMax: 8,
      });

      const sid = result.sessionId;
      addLog(`Session ${sid} started — Python scraper running`, "success");

      // Poll every 3s for real progress from the backend
      pollRef.current = setInterval(async () => {
        try {
          const prog = await getScrapingProgress(sid);
          setProgress(prog);

          if (prog.currentAction) addLog(prog.currentAction, "info");

          const done = prog.isComplete === true || prog.status === 2;
          if (done) {
            clearInterval(pollRef.current!);
            addLog(
              `Complete — ${prog.leadsFound} leads found, ${prog.duplicatesSkipped} duplicates skipped`,
              "success"
            );
            setStatus("done");

            // Fetch the actual scraped leads
            const scraped = await getScrapedLeads("YellowPages", targetCount);
            const items: ScrapedLead[] = scraped?.items ?? (Array.isArray(scraped) ? scraped as unknown as ScrapedLead[] : []);
            onScrapeDone(items);
          }

          if (prog.status === 3) {
            clearInterval(pollRef.current!);
            addLog("Scraper session failed on the backend", "error");
            setStatus("error");
          }
        } catch {
          // transient poll error — keep trying
        }
      }, 3000);
    } catch (err) {
      addLog(`Error: ${err instanceof Error ? err.message : "Unknown error"}`, "error");
      setStatus("error");
    }
  }

  function handleStop() {
    if (pollRef.current) clearInterval(pollRef.current);
    setStatus("idle");
    addLog("Scraper stopped by user", "warn");
  }

  function handleReset() {
    if (pollRef.current) clearInterval(pollRef.current);
    setStatus("idle");
    setLogs([]);
    setProgress(null);
  }

  const logColors: Record<LogLine["type"], string> = {
    info: "text-zinc-400",
    success: "text-green-400",
    warn: "text-yellow-400",
    error: "text-red-400",
  };

  return (
    <div className="space-y-6">
      <div className="bg-surface border border-border rounded-2xl p-6">
        <h2 className="text-sm font-semibold mb-5">Scraper Configuration</h2>
        <form onSubmit={handleRun} className="space-y-5">
          <div>
            <label className="block text-xs font-medium text-muted mb-1">Business Niche *</label>
            <input value={niche} onChange={(e) => setNiche(e.target.value)}
              placeholder="e.g. contractors, roofers, plumbers, dentists"
              required disabled={status === "running"}
              className="w-full px-3 py-2 rounded-lg border border-border bg-background text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 disabled:opacity-50" />
          </div>
          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-muted mb-1">City *</label>
              <input value={city} onChange={(e) => setCity(e.target.value)} placeholder="e.g. Denver" required disabled={status === "running"}
                className="w-full px-3 py-2 rounded-lg border border-border bg-background text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 disabled:opacity-50" />
            </div>
            <div>
              <label className="block text-xs font-medium text-muted mb-1">State *</label>
              <input value={stateVal} onChange={(e) => setStateVal(e.target.value)} placeholder="e.g. CO" maxLength={2} required disabled={status === "running"}
                className="w-full px-3 py-2 rounded-lg border border-border bg-background text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 disabled:opacity-50" />
            </div>
          </div>
          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-muted mb-1">Target Count: {targetCount}</label>
              <input type="range" min={10} max={250} step={5} value={targetCount}
                onChange={(e) => setTargetCount(parseInt(e.target.value))}
                disabled={status === "running"}
                className="w-full h-2 bg-border rounded-lg appearance-none cursor-pointer disabled:opacity-50" />
              <div className="flex justify-between text-xs text-muted mt-1"><span>10</span><span>250</span></div>
            </div>
            <div>
              <label className="block text-xs font-medium text-muted mb-1">Session Name</label>
              <input value={sessionName} onChange={(e) => setSessionName(e.target.value)}
                placeholder="Optional label"
                disabled={status === "running"}
                className="w-full px-3 py-2 rounded-lg border border-border bg-background text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 disabled:opacity-50" />
            </div>
          </div>
          <div className="flex gap-3 pt-1">
            {status !== "running" ? (
              <button type="submit"
                className="bg-primary hover:bg-primary-dark text-white px-6 py-2.5 rounded-full text-sm font-medium transition-all duration-200">
                Run Scraper
              </button>
            ) : (
              <>
                <button type="button" disabled
                  className="flex items-center gap-2 bg-primary/50 text-white px-6 py-2.5 rounded-full text-sm font-medium cursor-not-allowed">
                  <span className="w-2 h-2 rounded-full bg-white/80 animate-pulse" />
                  Running...
                </button>
                <button type="button" onClick={handleStop}
                  className="px-5 py-2.5 rounded-full border border-red-500/40 text-red-400 text-sm hover:bg-red-500/10 transition-all duration-200">
                  Stop
                </button>
              </>
            )}
            {(status === "done" || status === "error") && (
              <button type="button" onClick={handleReset}
                className="px-5 py-2.5 rounded-full border border-border text-sm text-muted hover:text-foreground transition-all duration-200">
                Reset
              </button>
            )}
          </div>
        </form>
      </div>

      {logs.length > 0 && (
        <div className="bg-surface border border-border rounded-2xl overflow-hidden">
          <div className="flex items-center justify-between px-5 py-3 border-b border-border">
            <div className="flex items-center gap-2">
              <span className="text-xs font-mono text-muted">output</span>
              {status === "running" && <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />}
              {status === "done" && <span className="text-xs text-green-400 font-medium">complete</span>}
              {status === "error" && <span className="text-xs text-red-400 font-medium">error</span>}
            </div>
            {progress && status === "running" && (
              <span className="text-xs text-muted">
                {progress.leadsFound} found · {progress.duplicatesSkipped} dupes skipped
                {progress.totalPages > 0 && ` · page ${progress.currentPage}/${progress.totalPages}`}
              </span>
            )}
            {status === "done" && progress && (
              <span className="text-xs font-medium text-primary">
                {progress.leadsFound} leads ready — switch to Contractor Leads tab
              </span>
            )}
          </div>
          {/* Progress bar */}
          {status === "running" && progress && progress.totalPages > 0 && (
            <div className="px-5 py-2 border-b border-border/50">
              <div className="w-full bg-border rounded-full h-1.5">
                <div
                  className="bg-primary h-1.5 rounded-full transition-all duration-500"
                  style={{ width: `${Math.min(progress.progressPercentage, 100)}%` }}
                />
              </div>
            </div>
          )}
          <div ref={logRef} className="font-mono text-xs p-5 space-y-1 h-64 overflow-y-auto bg-background/50">
            {logs.map((line, i) => (
              <div key={i} className="flex gap-3">
                <span className="text-zinc-600 shrink-0">{line.ts}</span>
                <span className={logColors[line.type]}>{line.msg}</span>
              </div>
            ))}
            {status === "running" && (
              <div className="flex gap-3">
                <span className="text-zinc-600 shrink-0">{new Date().toLocaleTimeString("en-US", { hour12: false })}</span>
                <span className="text-zinc-500 animate-pulse">_</span>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

// ─── Contractor Leads Tab ────────────────────────────────────────────────────
function ContractorLeadsTab({ leads, onAddToProspects }: {
  leads: ContractorLead[];
  onAddToProspects: (lead: ContractorLead) => void;
}) {
  const [filter, setFilter] = useState<"all" | "high" | "medium" | "low">("all");
  const [search, setSearch] = useState("");

  const filtered = leads
    .filter((l) => {
      if (filter === "high") return l.opportunityScore >= 70;
      if (filter === "medium") return l.opportunityScore >= 40 && l.opportunityScore < 70;
      if (filter === "low") return l.opportunityScore < 40;
      return true;
    })
    .filter((l) =>
      !search ||
      l.company.toLowerCase().includes(search.toLowerCase()) ||
      l.city.toLowerCase().includes(search.toLowerCase())
    )
    .sort((a, b) => b.opportunityScore - a.opportunityScore);

  if (leads.length === 0) {
    return (
      <div className="bg-surface border border-border rounded-2xl p-16 text-center">
        <p className="text-muted text-sm">No results yet.</p>
        <p className="text-xs text-muted mt-1">Run the scraper to populate contractor leads.</p>
      </div>
    );
  }

  const high = leads.filter((l) => l.opportunityScore >= 70).length;
  const medium = leads.filter((l) => l.opportunityScore >= 40 && l.opportunityScore < 70).length;
  const low = leads.filter((l) => l.opportunityScore < 40).length;

  return (
    <div className="space-y-5">
      {/* Stats bar */}
      <div className="grid grid-cols-3 gap-3">
        {[
          { label: "High Opportunity", count: high, color: "text-green-400", border: "border-green-500/20" },
          { label: "Medium Opportunity", count: medium, color: "text-yellow-400", border: "border-yellow-500/20" },
          { label: "Low Opportunity", count: low, color: "text-zinc-400", border: "border-zinc-500/20" },
        ].map(({ label, count, color, border }) => (
          <div key={label} className={`bg-surface border ${border} rounded-xl p-4`}>
            <div className={`text-2xl font-bold ${color}`}>{count}</div>
            <div className="text-xs text-muted mt-1">{label}</div>
          </div>
        ))}
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3">
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search company or city..."
          className="flex-1 px-3 py-2 rounded-lg border border-border bg-surface text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary/50"
        />
        <div className="flex gap-1 p-1 bg-surface border border-border rounded-xl shrink-0">
          {(["all", "high", "medium", "low"] as const).map((f) => (
            <button key={f} onClick={() => setFilter(f)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all duration-200 capitalize ${
                filter === f ? "bg-primary/10 text-primary" : "text-muted hover:text-foreground"
              }`}>
              {f}
            </button>
          ))}
        </div>
      </div>

      {/* Table */}
      <div className="bg-surface border border-border rounded-2xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border text-left">
                <th className="px-5 py-3 text-xs font-medium text-muted uppercase tracking-wider">Company</th>
                <th className="px-5 py-3 text-xs font-medium text-muted uppercase tracking-wider hidden md:table-cell">Location</th>
                <th className="px-5 py-3 text-xs font-medium text-muted uppercase tracking-wider hidden sm:table-cell">Category</th>
                <th className="px-5 py-3 text-xs font-medium text-muted uppercase tracking-wider">Website</th>
                <th className="px-5 py-3 text-xs font-medium text-muted uppercase tracking-wider hidden sm:table-cell">Rating</th>
                <th className="px-5 py-3 text-xs font-medium text-muted uppercase tracking-wider">ML Score</th>
                <th className="px-5 py-3 text-xs font-medium text-muted uppercase tracking-wider"></th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((lead) => (
                <tr key={lead.id} className="border-b border-border/50 hover:bg-white/[0.02] transition-colors duration-150">
                  <td className="px-5 py-4">
                    <div className="font-medium">{lead.company}</div>
                    {lead.phone && <div className="text-xs text-muted mt-0.5">{lead.phone}</div>}
                    {lead.email && <div className="text-xs text-muted">{lead.email}</div>}
                  </td>
                  <td className="px-5 py-4 text-muted text-xs hidden md:table-cell">
                    {[lead.city, lead.state].filter(Boolean).join(", ") || "—"}
                  </td>
                  <td className="px-5 py-4 text-muted text-xs hidden sm:table-cell">{lead.service || "—"}</td>
                  <td className="px-5 py-4">
                    {lead.website ? (
                      <a href={lead.website} target="_blank" rel="noopener noreferrer"
                        className="text-xs text-primary hover:text-primary-light truncate max-w-[120px] block">
                        {lead.website.replace(/^https?:\/\//, "")}
                      </a>
                    ) : (
                      <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium border ${GRADE_COLORS["None"]}`}>
                        No site
                      </span>
                    )}
                  </td>
                  <td className="px-5 py-4 text-muted text-xs hidden sm:table-cell">
                    {lead.avgRating > 0 ? `${lead.avgRating}★` : "—"}
                  </td>
                  <td className="px-5 py-4">
                    <div className="flex items-center gap-2">
                      <div className="w-16 bg-border rounded-full h-1.5">
                        <div className={`h-1.5 rounded-full ${lead.opportunityScore >= 70 ? "bg-green-400" : lead.opportunityScore >= 40 ? "bg-yellow-400" : "bg-red-400"}`}
                          style={{ width: `${lead.opportunityScore}%` }} />
                      </div>
                      <span className={`text-sm font-bold ${scoreColor(lead.opportunityScore)}`}>
                        {lead.opportunityScore}
                      </span>
                    </div>
                  </td>
                  <td className="px-5 py-4">
                    {lead.addedToProspects ? (
                      <span className="text-xs text-muted">Added</span>
                    ) : (
                      <button
                        onClick={() => onAddToProspects(lead)}
                        className="px-3 py-1.5 rounded-full border border-primary/30 text-primary text-xs hover:bg-primary/10 transition-all duration-200 whitespace-nowrap"
                      >
                        + Prospects
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {filtered.length === 0 && (
            <div className="p-10 text-center text-muted text-sm">No results match your filter.</div>
          )}
        </div>
      </div>
    </div>
  );
}

// ─── Create Lead Modal ───────────────────────────────────────────────────────
function CreateLeadModal({ onClose, onCreated }: { onClose: () => void; onCreated: () => void }) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setError("");
    const fd = new FormData(e.currentTarget);
    try {
      await createLead({
        name: fd.get("name") as string,
        email: fd.get("email") as string,
        phone: (fd.get("phone") as string) || undefined,
        companyName: (fd.get("companyName") as string) || undefined,
        service: (fd.get("service") as string) || undefined,
        notes: (fd.get("notes") as string) || undefined,
        estimatedValue: fd.get("estimatedValue") ? parseFloat(fd.get("estimatedValue") as string) : undefined,
      });
      onCreated();
      onClose();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error creating lead");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm px-4" onClick={onClose}>
      <div className="bg-surface border border-border rounded-2xl p-8 w-full max-w-lg max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-lg font-bold">New Lead</h2>
          <button onClick={onClose} className="text-muted hover:text-foreground text-xl">&times;</button>
        </div>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-muted mb-1">Name *</label>
              <input name="name" required className="w-full px-3 py-2 rounded-lg border border-border bg-background text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary/50" />
            </div>
            <div>
              <label className="block text-xs font-medium text-muted mb-1">Email *</label>
              <input name="email" type="email" required className="w-full px-3 py-2 rounded-lg border border-border bg-background text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary/50" />
            </div>
          </div>
          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-muted mb-1">Phone</label>
              <input name="phone" className="w-full px-3 py-2 rounded-lg border border-border bg-background text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary/50" />
            </div>
            <div>
              <label className="block text-xs font-medium text-muted mb-1">Company</label>
              <input name="companyName" className="w-full px-3 py-2 rounded-lg border border-border bg-background text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary/50" />
            </div>
          </div>
          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-muted mb-1">Service</label>
              <input name="service" className="w-full px-3 py-2 rounded-lg border border-border bg-background text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary/50" />
            </div>
            <div>
              <label className="block text-xs font-medium text-muted mb-1">Estimated Value ($)</label>
              <input name="estimatedValue" type="number" step="0.01" className="w-full px-3 py-2 rounded-lg border border-border bg-background text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary/50" />
            </div>
          </div>
          <div>
            <label className="block text-xs font-medium text-muted mb-1">Notes</label>
            <textarea name="notes" rows={3} className="w-full px-3 py-2 rounded-lg border border-border bg-background text-foreground text-sm resize-y focus:outline-none focus:ring-2 focus:ring-primary/50" />
          </div>
          {error && <p className="text-red-500 text-sm">{error}</p>}
          <div className="flex gap-3 pt-2">
            <button type="button" onClick={onClose} className="flex-1 px-4 py-2.5 rounded-full border border-border text-sm text-muted hover:text-foreground transition-colors">Cancel</button>
            <button type="submit" disabled={loading} className="flex-1 bg-primary hover:bg-primary-dark disabled:opacity-50 text-white px-4 py-2.5 rounded-full text-sm font-medium transition-all duration-200">
              {loading ? "Creating..." : "Create Lead"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

// ─── Lead Detail / Edit Panel ────────────────────────────────────────────────
function LeadDetail({ lead, onClose, onUpdated, onDeleted }: {
  lead: Lead;
  onClose: () => void;
  onUpdated: () => void;
  onDeleted: () => void;
}) {
  const [statusIdx, setStatusIdx] = useState(lead.status);
  const [notes, setNotes] = useState(lead.notes || "");
  const [value, setValue] = useState(lead.estimatedValue?.toString() || "");
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [converting, setConverting] = useState(false);

  async function handleConvertToOnboarding() {
    setConverting(true);
    try {
      await submitOnboarding({
        leadId: lead.id,
        contactName: lead.name,
        contactEmail: lead.email,
        contactPhone: lead.phone || undefined,
        businessName: lead.companyName || lead.name,
        services: lead.service || "TBD",
        serviceCities: "TBD",
      });
      alert("Client onboarding created successfully!");
      onUpdated();
      onClose();
    } catch (err) {
      alert(err instanceof Error ? err.message : "Failed to create onboarding");
    } finally {
      setConverting(false);
    }
  }

  async function handleSave() {
    setSaving(true);
    try {
      await updateLead(lead.id, { status: statusIdx, notes: notes || undefined, estimatedValue: value ? parseFloat(value) : undefined });
      onUpdated();
      onClose();
    } catch {
      alert("Failed to update lead");
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete() {
    setDeleting(true);
    try {
      await deleteLead(lead.id);
      onDeleted();
      onClose();
    } catch {
      alert("Failed to delete lead");
    } finally {
      setDeleting(false);
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm px-4" onClick={onClose}>
      <div className="bg-surface border border-border rounded-2xl p-8 w-full max-w-lg max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-lg font-bold">{lead.name}</h2>
          <button onClick={onClose} className="text-muted hover:text-foreground text-xl">&times;</button>
        </div>
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-3 text-sm">
            <div><span className="text-muted block text-xs">Email</span><a href={`mailto:${lead.email}`} className="text-primary hover:text-primary-light">{lead.email}</a></div>
            <div><span className="text-muted block text-xs">Phone</span>{lead.phone ? <a href={`tel:${lead.phone}`} className="text-primary hover:text-primary-light">{lead.phone}</a> : <span className="text-muted">&mdash;</span>}</div>
            <div><span className="text-muted block text-xs">Company</span><span>{lead.companyName || "&mdash;"}</span></div>
            <div><span className="text-muted block text-xs">Service</span><span>{lead.service || "&mdash;"}</span></div>
            <div><span className="text-muted block text-xs">Created</span><span>{new Date(lead.createdAt).toLocaleDateString()}</span></div>
            <div><span className="text-muted block text-xs">Last Updated</span><span>{new Date(lead.updatedAt).toLocaleDateString()}</span></div>
          </div>
          {lead.contactSubmissionId && (
            <div className="flex items-center gap-2">
              <span className="text-xs text-muted">From:</span>
              <Link href="/admin/contacts" className="text-xs text-primary hover:text-primary-light transition-colors" onClick={(e) => e.stopPropagation()}>
                Contact Submission #{lead.contactSubmissionId}
              </Link>
            </div>
          )}
          <hr className="border-border" />
          <div>
            <label className="block text-xs font-medium text-muted mb-1">Status</label>
            <div className="flex flex-wrap gap-2">
              {LEAD_STATUSES.map((s, i) => (
                <button key={s} type="button" onClick={() => setStatusIdx(i)}
                  className={`px-3 py-1.5 rounded-full text-xs font-medium border transition-all duration-200 ${statusIdx === i ? STATUS_COLORS[s] + " ring-1 ring-current" : "border-border text-muted hover:text-foreground"}`}>
                  {s}
                </button>
              ))}
            </div>
          </div>
          <div>
            <label className="block text-xs font-medium text-muted mb-1">Estimated Value ($)</label>
            <input type="number" step="0.01" value={value} onChange={(e) => setValue(e.target.value)}
              className="w-full px-3 py-2 rounded-lg border border-border bg-background text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary/50" placeholder="0.00" />
          </div>
          <div>
            <label className="block text-xs font-medium text-muted mb-1">Notes</label>
            <textarea value={notes} onChange={(e) => setNotes(e.target.value)} rows={4}
              className="w-full px-3 py-2 rounded-lg border border-border bg-background text-foreground text-sm resize-y focus:outline-none focus:ring-2 focus:ring-primary/50" />
          </div>
          {statusIdx === 3 && (
            <div className="bg-green-500/5 border border-green-500/20 rounded-xl p-4">
              <p className="text-xs text-green-400 mb-2">This lead is marked as Won. Ready to start onboarding?</p>
              <button type="button" onClick={handleConvertToOnboarding} disabled={converting}
                className="w-full bg-green-600 hover:bg-green-700 disabled:opacity-50 text-white px-4 py-2.5 rounded-full text-sm font-medium transition-all duration-200">
                {converting ? "Creating Onboarding..." : "Convert to Client Onboarding"}
              </button>
            </div>
          )}
          <div className="flex gap-3 pt-2">
            <button type="button" onClick={handleSave} disabled={saving}
              className="flex-1 bg-primary hover:bg-primary-dark disabled:opacity-50 text-white px-4 py-2.5 rounded-full text-sm font-medium transition-all duration-200">
              {saving ? "Saving..." : "Save Changes"}
            </button>
            {!confirmDelete ? (
              <button type="button" onClick={() => setConfirmDelete(true)}
                className="px-4 py-2.5 rounded-full border border-red-500/30 text-red-400 text-sm hover:bg-red-500/10 transition-all duration-200">
                Delete
              </button>
            ) : (
              <button type="button" onClick={handleDelete} disabled={deleting}
                className="px-4 py-2.5 rounded-full bg-red-500/20 border border-red-500/30 text-red-400 text-sm font-medium transition-all duration-200">
                {deleting ? "Deleting..." : "Confirm Delete"}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── Inbound Leads Tab ───────────────────────────────────────────────────────
function InboundLeadsTab() {
  const [leads, setLeads] = useState<Lead[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [pageSize] = useState(25);
  const [filterStatus, setFilterStatus] = useState<number | undefined>(undefined);
  const [loading, setLoading] = useState(true);
  const [selectedLead, setSelectedLead] = useState<Lead | null>(null);
  const [showCreate, setShowCreate] = useState(false);

  const fetchLeads = useCallback(async () => {
    setLoading(true);
    try {
      const data = await getLeads(page, pageSize, filterStatus);
      setLeads(data.items);
      setTotal(data.total);
    } catch {
      console.error("Failed to load leads");
    } finally {
      setLoading(false);
    }
  }, [page, pageSize, filterStatus]);

  useEffect(() => { fetchLeads(); }, [fetchLeads]);

  async function handleExport() {
    try {
      const blob = await exportLeads(filterStatus);
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = "leads.csv";
      a.click();
      URL.revokeObjectURL(url);
    } catch {
      alert("Failed to export leads");
    }
  }

  const totalPages = Math.ceil(total / pageSize);

  return (
    <>
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
        <p className="text-sm text-muted">{total} total lead{total !== 1 ? "s" : ""}</p>
        <div className="flex gap-3">
          <button onClick={handleExport} className="px-4 py-2 rounded-full border border-border text-sm text-muted hover:text-foreground hover:border-foreground/20 transition-all duration-200">Export CSV</button>
          <button onClick={() => setShowCreate(true)} className="bg-primary hover:bg-primary-dark text-white px-5 py-2 rounded-full text-sm font-medium transition-all duration-200">+ New Lead</button>
        </div>
      </div>
      <div className="flex flex-wrap gap-2 mb-6">
        <button onClick={() => { setFilterStatus(undefined); setPage(1); }}
          className={`px-4 py-1.5 rounded-full text-xs font-medium border transition-all duration-200 ${filterStatus === undefined ? "bg-foreground/10 text-foreground border-foreground/20" : "border-border text-muted hover:text-foreground"}`}>
          All
        </button>
        {LEAD_STATUSES.map((s, i) => (
          <button key={s} onClick={() => { setFilterStatus(i); setPage(1); }}
            className={`px-4 py-1.5 rounded-full text-xs font-medium border transition-all duration-200 ${filterStatus === i ? STATUS_COLORS[s] : "border-border text-muted hover:text-foreground"}`}>
            {s}
          </button>
        ))}
      </div>
      <div className="bg-surface rounded-2xl border border-border overflow-hidden">
        {loading ? (
          <div className="p-12 text-center text-muted text-sm">Loading leads...</div>
        ) : leads.length === 0 ? (
          <div className="p-12 text-center">
            <p className="text-muted text-sm">No leads found.</p>
            <button onClick={() => setShowCreate(true)} className="mt-3 text-primary hover:text-primary-light text-sm">Create your first lead</button>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border text-left">
                  <th className="px-5 py-3 text-xs font-medium text-muted uppercase tracking-wider">Name</th>
                  <th className="px-5 py-3 text-xs font-medium text-muted uppercase tracking-wider hidden md:table-cell">Email</th>
                  <th className="px-5 py-3 text-xs font-medium text-muted uppercase tracking-wider hidden lg:table-cell">Company</th>
                  <th className="px-5 py-3 text-xs font-medium text-muted uppercase tracking-wider hidden lg:table-cell">Service</th>
                  <th className="px-5 py-3 text-xs font-medium text-muted uppercase tracking-wider">Status</th>
                  <th className="px-5 py-3 text-xs font-medium text-muted uppercase tracking-wider hidden sm:table-cell">Value</th>
                  <th className="px-5 py-3 text-xs font-medium text-muted uppercase tracking-wider hidden md:table-cell">Date</th>
                </tr>
              </thead>
              <tbody>
                {leads.map((lead) => {
                  const statusLabel = LEAD_STATUSES[lead.status] || "Unknown";
                  return (
                    <tr key={lead.id} onClick={() => setSelectedLead(lead)} className="border-b border-border/50 hover:bg-white/[0.02] cursor-pointer transition-colors duration-150">
                      <td className="px-5 py-4">
                        <div className="font-medium">{lead.name}</div>
                        <div className="text-xs text-muted md:hidden">{lead.email}</div>
                      </td>
                      <td className="px-5 py-4 text-muted hidden md:table-cell">{lead.email}</td>
                      <td className="px-5 py-4 text-muted hidden lg:table-cell">{lead.companyName || "&mdash;"}</td>
                      <td className="px-5 py-4 text-muted hidden lg:table-cell">{lead.service || "&mdash;"}</td>
                      <td className="px-5 py-4">
                        <span className={`inline-block px-2.5 py-0.5 rounded-full text-xs font-medium border ${STATUS_COLORS[statusLabel as LeadStatus] || ""}`}>{statusLabel}</span>
                      </td>
                      <td className="px-5 py-4 text-muted hidden sm:table-cell">
                        {lead.estimatedValue != null ? `$${lead.estimatedValue.toLocaleString()}` : "&mdash;"}
                      </td>
                      <td className="px-5 py-4 text-muted hidden md:table-cell">{new Date(lead.createdAt).toLocaleDateString()}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
        {totalPages > 1 && (
          <div className="flex items-center justify-between px-5 py-3 border-t border-border">
            <span className="text-xs text-muted">Page {page} of {totalPages}</span>
            <div className="flex gap-2">
              <button onClick={() => setPage((p) => Math.max(1, p - 1))} disabled={page === 1} className="px-3 py-1.5 rounded-lg border border-border text-xs text-muted hover:text-foreground disabled:opacity-30 transition-colors">Previous</button>
              <button onClick={() => setPage((p) => Math.min(totalPages, p + 1))} disabled={page === totalPages} className="px-3 py-1.5 rounded-lg border border-border text-xs text-muted hover:text-foreground disabled:opacity-30 transition-colors">Next</button>
            </div>
          </div>
        )}
      </div>
      {showCreate && <CreateLeadModal onClose={() => setShowCreate(false)} onCreated={fetchLeads} />}
      {selectedLead && <LeadDetail lead={selectedLead} onClose={() => setSelectedLead(null)} onUpdated={fetchLeads} onDeleted={fetchLeads} />}
    </>
  );
}

// ─── Main Page ───────────────────────────────────────────────────────────────
export default function AdminLeadsPage() {
  const [activeTab, setActiveTab] = useState<ActiveTab>("scraper");
  const [contractorLeads, setContractorLeads] = useState<ContractorLead[]>([]);

  async function handleAddToProspects(lead: ContractorLead) {
    try {
      // Import the scraped lead into the Pipeline CRM via the backend
      await importScrapedLead(lead.rawId);
      setContractorLeads((prev) =>
        prev.map((l) => l.id === lead.id ? { ...l, addedToProspects: true } : l)
      );
    } catch {
      alert("Failed to import lead");
    }
  }

  function handleScrapeDone(results: ScrapedLead[]) {
    setContractorLeads(results.map(mapScrapedLead));
    setTimeout(() => setActiveTab("contractor-leads"), 600);
  }

  const tabs: { id: ActiveTab; label: string; badge?: number }[] = [
    { id: "scraper", label: "Run Scraper" },
    { id: "contractor-leads", label: "Contractor Leads", badge: contractorLeads.length || undefined },
    { id: "leads", label: "Inbound Leads" },
  ];

  return (
    <div className="min-h-screen pt-24 pb-16 px-6">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-2xl font-bold">Lead Generation</h1>
          <p className="text-sm text-muted mt-1">Run the contractor scraper and manage your pipeline</p>
        </div>

        {/* Tab switcher */}
        <div className="flex gap-1 p-1 bg-surface border border-border rounded-xl w-fit mb-8">
          {tabs.map((tab) => (
            <button key={tab.id} onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-5 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                activeTab === tab.id ? "bg-primary/10 text-primary" : "text-muted hover:text-foreground"
              }`}>
              {tab.label}
              {tab.badge != null && (
                <span className={`text-xs px-1.5 py-0.5 rounded-full font-medium ${
                  activeTab === tab.id ? "bg-primary/20 text-primary" : "bg-foreground/10 text-muted"
                }`}>
                  {tab.badge}
                </span>
              )}
            </button>
          ))}
        </div>

        {activeTab === "scraper" && <RunScraperTab onScrapeDone={handleScrapeDone} />}
        {activeTab === "contractor-leads" && (
          <ContractorLeadsTab leads={contractorLeads} onAddToProspects={handleAddToProspects} />
        )}
        {activeTab === "leads" && <InboundLeadsTab />}
      </div>
    </div>
  );
}
