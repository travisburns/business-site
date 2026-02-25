"use client";

import { useState, useEffect, useCallback, type FormEvent } from "react";
import {
  getRoiReports,
  getRoiReport,
  createRoiReport,
  updateRoiReport,
  deleteRoiReport,
  ROI_REPORT_STATUSES,
  type RoiReport,
} from "@/lib/api";
import Link from "next/link";

type ReportStatus = (typeof ROI_REPORT_STATUSES)[number];

const STATUS_COLORS: Record<ReportStatus, string> = {
  Draft: "bg-yellow-500/10 text-yellow-400 border-yellow-500/20",
  Finalized: "bg-blue-500/10 text-blue-400 border-blue-500/20",
  Sent: "bg-green-500/10 text-green-400 border-green-500/20",
};

const REPORT_PERIODS = ["30-Day Check", "60-Day Check", "90-Day Check", "Custom"] as const;

interface KeywordRanking {
  keyword: string;
  before: number;
  after: number;
}

function formatRank(pos: number): string {
  if (pos <= 0) return "Not Ranking";
  const page = Math.ceil(pos / 10);
  const spot = pos % 10 || 10;
  return `Page ${page}, #${spot}`;
}

function formatCurrency(n: number): string {
  return new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 }).format(n);
}

function formatNumber(n: number): string {
  return new Intl.NumberFormat("en-US").format(n);
}

function parseRankings(json: string): KeywordRanking[] {
  try {
    const parsed = JSON.parse(json);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

// ─── Number Input Helper ────────────────────────────────────────────────────
function NumField({ label, value, onChange, prefix, suffix, step }: {
  label: string; value: number; onChange: (v: number) => void;
  prefix?: string; suffix?: string; step?: number;
}) {
  return (
    <div>
      <label className="block text-xs text-muted mb-1">{label}</label>
      <div className="relative">
        {prefix && <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted text-sm">{prefix}</span>}
        <input
          type="number"
          value={value || ""}
          onChange={(e) => onChange(parseFloat(e.target.value) || 0)}
          step={step || 1}
          min={0}
          className={`w-full py-2 rounded-lg border border-border bg-background text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 ${prefix ? "pl-7 pr-3" : suffix ? "pl-3 pr-7" : "px-3"}`}
          placeholder="0"
        />
        {suffix && <span className="absolute right-3 top-1/2 -translate-y-1/2 text-muted text-sm">{suffix}</span>}
      </div>
    </div>
  );
}

// ─── Create Report Modal ────────────────────────────────────────────────────
function CreateReportModal({ onClose, onCreated }: { onClose: () => void; onCreated: () => void }) {
  const [clientName, setClientName] = useState("");
  const [businessName, setBusinessName] = useState("");
  const [contactEmail, setContactEmail] = useState("");
  const [reportPeriod, setReportPeriod] = useState<string>(REPORT_PERIODS[2]);
  const [reportDate, setReportDate] = useState(new Date().toISOString().split("T")[0]);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    if (!clientName.trim() || !businessName.trim()) return;
    setSaving(true);
    setError("");
    try {
      await createRoiReport({
        clientName: clientName.trim(),
        businessName: businessName.trim(),
        contactEmail: contactEmail.trim() || undefined,
        reportPeriod,
        reportDate,
      });
      onCreated();
      onClose();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to create report");
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm px-4" onClick={onClose}>
      <div className="bg-surface border border-border rounded-2xl p-8 w-full max-w-md" onClick={(e) => e.stopPropagation()}>
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-lg font-bold">New ROI Report</h2>
          <button onClick={onClose} className="text-muted hover:text-foreground text-xl">&times;</button>
        </div>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-muted mb-1">Client Name *</label>
              <input type="text" required value={clientName} onChange={(e) => setClientName(e.target.value)}
                className="w-full px-3 py-2 rounded-lg border border-border bg-background text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary/50"
                placeholder="John Smith" />
            </div>
            <div>
              <label className="block text-xs font-medium text-muted mb-1">Business Name *</label>
              <input type="text" required value={businessName} onChange={(e) => setBusinessName(e.target.value)}
                className="w-full px-3 py-2 rounded-lg border border-border bg-background text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary/50"
                placeholder="Smith Contracting" />
            </div>
          </div>
          <div>
            <label className="block text-xs font-medium text-muted mb-1">Email</label>
            <input type="email" value={contactEmail} onChange={(e) => setContactEmail(e.target.value)}
              className="w-full px-3 py-2 rounded-lg border border-border bg-background text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary/50"
              placeholder="john@smith.com" />
          </div>
          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-muted mb-1">Report Period</label>
              <select value={reportPeriod} onChange={(e) => setReportPeriod(e.target.value)}
                className="w-full px-3 py-2 rounded-lg border border-border bg-background text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary/50">
                {REPORT_PERIODS.map((p) => <option key={p} value={p}>{p}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-xs font-medium text-muted mb-1">Report Date</label>
              <input type="date" value={reportDate} onChange={(e) => setReportDate(e.target.value)}
                className="w-full px-3 py-2 rounded-lg border border-border bg-background text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary/50" />
            </div>
          </div>
          {error && <p className="text-red-500 text-sm">{error}</p>}
          <div className="flex gap-3 pt-2">
            <button type="button" onClick={onClose}
              className="flex-1 px-4 py-2.5 rounded-full border border-border text-sm text-muted hover:text-foreground transition-colors">
              Cancel
            </button>
            <button type="submit" disabled={saving}
              className="flex-1 bg-primary hover:bg-primary-dark disabled:opacity-50 text-white px-4 py-2.5 rounded-full text-sm font-medium transition-all duration-200">
              {saving ? "Creating..." : "Create Report"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

// ─── Report Preview (client-facing view) ────────────────────────────────────
function ReportPreview({ report }: { report: RoiReport }) {
  const rankings = parseRankings(report.keywordRankings);
  const pipelineValue = report.totalLeads * report.avgJobSize;
  const roi = report.serviceCost > 0 ? Math.round(((pipelineValue - report.serviceCost) / report.serviceCost) * 100) : 0;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center pb-4 border-b border-border">
        <p className="text-xs text-primary font-medium uppercase tracking-widest mb-1">Performance Report</p>
        <h2 className="text-xl font-bold">{report.businessName}</h2>
        <p className="text-sm text-muted mt-1">
          {report.reportPeriod} &middot; {new Date(report.reportDate).toLocaleDateString("en-US", { month: "long", year: "numeric" })}
        </p>
      </div>

      {/* Key Metrics Grid */}
      <div>
        <h3 className="text-xs font-medium text-muted uppercase tracking-wider mb-3">Search Visibility</h3>
        <div className="grid grid-cols-3 gap-3">
          <div className="bg-background rounded-xl p-4 text-center border border-border">
            <div className="text-2xl font-bold text-blue-400">{formatNumber(report.searchImpressions)}</div>
            <div className="text-[10px] text-muted mt-1 uppercase tracking-wider">Search Appearances</div>
          </div>
          <div className="bg-background rounded-xl p-4 text-center border border-border">
            <div className="text-2xl font-bold text-cyan-400">{formatNumber(report.searchClicks)}</div>
            <div className="text-[10px] text-muted mt-1 uppercase tracking-wider">Search Clicks</div>
          </div>
          <div className="bg-background rounded-xl p-4 text-center border border-border">
            <div className="text-2xl font-bold text-purple-400">{report.clickThroughRate}%</div>
            <div className="text-[10px] text-muted mt-1 uppercase tracking-wider">Click-Through Rate</div>
          </div>
        </div>
      </div>

      {/* Website Traffic */}
      <div>
        <h3 className="text-xs font-medium text-muted uppercase tracking-wider mb-3">Website Traffic</h3>
        <div className="grid grid-cols-3 gap-3">
          <div className="bg-background rounded-xl p-4 text-center border border-border">
            <div className="text-2xl font-bold text-green-400">{formatNumber(report.totalVisitors)}</div>
            <div className="text-[10px] text-muted mt-1 uppercase tracking-wider">Total Visitors</div>
          </div>
          <div className="bg-background rounded-xl p-4 text-center border border-border">
            <div className="text-2xl font-bold text-emerald-400">{formatNumber(report.uniqueVisitors)}</div>
            <div className="text-[10px] text-muted mt-1 uppercase tracking-wider">Unique Visitors</div>
          </div>
          <div className="bg-background rounded-xl p-4 text-center border border-border">
            <div className="text-2xl font-bold text-teal-400">
              {Math.floor(report.avgSessionDuration / 60)}:{String(report.avgSessionDuration % 60).padStart(2, "0")}
            </div>
            <div className="text-[10px] text-muted mt-1 uppercase tracking-wider">Avg. Session</div>
          </div>
        </div>
      </div>

      {/* Google Business Profile */}
      <div>
        <h3 className="text-xs font-medium text-muted uppercase tracking-wider mb-3">Google Business Profile</h3>
        <div className="grid grid-cols-4 gap-3">
          <div className="bg-background rounded-xl p-3 text-center border border-border">
            <div className="text-xl font-bold text-orange-400">{formatNumber(report.gbpViews)}</div>
            <div className="text-[10px] text-muted mt-1 uppercase tracking-wider">Views</div>
          </div>
          <div className="bg-background rounded-xl p-3 text-center border border-border">
            <div className="text-xl font-bold text-red-400">{formatNumber(report.gbpCalls)}</div>
            <div className="text-[10px] text-muted mt-1 uppercase tracking-wider">Calls</div>
          </div>
          <div className="bg-background rounded-xl p-3 text-center border border-border">
            <div className="text-xl font-bold text-amber-400">{formatNumber(report.gbpDirectionRequests)}</div>
            <div className="text-[10px] text-muted mt-1 uppercase tracking-wider">Directions</div>
          </div>
          <div className="bg-background rounded-xl p-3 text-center border border-border">
            <div className="text-xl font-bold text-yellow-400">{formatNumber(report.gbpWebsiteClicks)}</div>
            <div className="text-[10px] text-muted mt-1 uppercase tracking-wider">Site Clicks</div>
          </div>
        </div>
      </div>

      {/* Lead Generation */}
      <div>
        <h3 className="text-xs font-medium text-muted uppercase tracking-wider mb-3">Lead Generation</h3>
        <div className="grid grid-cols-3 gap-3">
          <div className="bg-background rounded-xl p-4 text-center border border-border">
            <div className="text-2xl font-bold text-indigo-400">{formatNumber(report.formSubmissions)}</div>
            <div className="text-[10px] text-muted mt-1 uppercase tracking-wider">Form Submissions</div>
          </div>
          <div className="bg-background rounded-xl p-4 text-center border border-border">
            <div className="text-2xl font-bold text-pink-400">{formatNumber(report.phoneCallLeads)}</div>
            <div className="text-[10px] text-muted mt-1 uppercase tracking-wider">Phone Leads</div>
          </div>
          <div className="bg-background rounded-xl p-4 text-center border border-border border-primary/30">
            <div className="text-2xl font-bold text-primary">{formatNumber(report.totalLeads)}</div>
            <div className="text-[10px] text-muted mt-1 uppercase tracking-wider">Total Leads</div>
          </div>
        </div>
      </div>

      {/* Keyword Rankings */}
      {rankings.length > 0 && (
        <div>
          <h3 className="text-xs font-medium text-muted uppercase tracking-wider mb-3">Keyword Rankings</h3>
          <div className="bg-background rounded-xl border border-border overflow-hidden">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border">
                  <th className="px-4 py-2.5 text-left text-xs text-muted font-medium">Keyword</th>
                  <th className="px-4 py-2.5 text-center text-xs text-muted font-medium">Before</th>
                  <th className="px-4 py-2.5 text-center text-xs text-muted font-medium">After</th>
                  <th className="px-4 py-2.5 text-center text-xs text-muted font-medium">Change</th>
                </tr>
              </thead>
              <tbody>
                {rankings.map((r, i) => {
                  const improved = r.before === 0 || r.after < r.before;
                  return (
                    <tr key={i} className="border-b border-border/50">
                      <td className="px-4 py-2.5 font-medium">&ldquo;{r.keyword}&rdquo;</td>
                      <td className="px-4 py-2.5 text-center text-muted">{formatRank(r.before)}</td>
                      <td className="px-4 py-2.5 text-center font-medium text-foreground">{formatRank(r.after)}</td>
                      <td className="px-4 py-2.5 text-center">
                        {improved ? (
                          <span className="text-green-400 font-bold">&uarr;</span>
                        ) : r.after === r.before ? (
                          <span className="text-muted">&mdash;</span>
                        ) : (
                          <span className="text-red-400 font-bold">&darr;</span>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ROI — The Killer Section */}
      <div className="bg-gradient-to-br from-primary/10 via-background to-green-500/10 rounded-2xl border border-primary/20 p-6">
        <h3 className="text-xs font-medium text-primary uppercase tracking-widest mb-4 text-center">Return on Investment</h3>
        <div className="grid grid-cols-2 gap-4 mb-4">
          <div className="text-center">
            <div className="text-xs text-muted mb-1">Your Investment</div>
            <div className="text-lg font-bold text-foreground">{formatCurrency(report.serviceCost)}</div>
          </div>
          <div className="text-center">
            <div className="text-xs text-muted mb-1">Leads Captured</div>
            <div className="text-lg font-bold text-foreground">{report.totalLeads}</div>
          </div>
          <div className="text-center">
            <div className="text-xs text-muted mb-1">Avg. Job Size</div>
            <div className="text-lg font-bold text-foreground">{formatCurrency(report.avgJobSize)}</div>
          </div>
          <div className="text-center">
            <div className="text-xs text-muted mb-1">Pipeline Value</div>
            <div className="text-lg font-bold text-green-400">{formatCurrency(pipelineValue)}</div>
          </div>
        </div>
        <div className="border-t border-primary/20 pt-4 text-center">
          <div className="text-xs text-muted mb-1">Estimated ROI</div>
          <div className="text-3xl font-black text-green-400">{formatNumber(roi)}%</div>
          <p className="text-xs text-muted/70 mt-2 max-w-xs mx-auto">
            Based on {report.totalLeads} leads captured at an average job size of {formatCurrency(report.avgJobSize)}, your {formatCurrency(report.serviceCost)} investment generated {formatCurrency(pipelineValue)} in potential pipeline value.
          </p>
        </div>
      </div>

      {report.notes && (
        <div>
          <h3 className="text-xs font-medium text-muted uppercase tracking-wider mb-2">Notes</h3>
          <p className="text-sm text-foreground/70 whitespace-pre-wrap">{report.notes}</p>
        </div>
      )}
    </div>
  );
}

// ─── Report Detail Modal ────────────────────────────────────────────────────
function ReportDetail({ report: initial, onClose, onUpdated }: {
  report: RoiReport;
  onClose: () => void;
  onUpdated: () => void;
}) {
  const [tab, setTab] = useState<"edit" | "preview">("edit");
  const [saving, setSaving] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(false);

  // Form data
  const [statusIdx, setStatusIdx] = useState(initial.status);
  const [searchImpressions, setSearchImpressions] = useState(initial.searchImpressions);
  const [searchClicks, setSearchClicks] = useState(initial.searchClicks);
  const [clickThroughRate, setClickThroughRate] = useState(initial.clickThroughRate);
  const [topKeywords, setTopKeywords] = useState(initial.topKeywords);
  const [totalVisitors, setTotalVisitors] = useState(initial.totalVisitors);
  const [uniqueVisitors, setUniqueVisitors] = useState(initial.uniqueVisitors);
  const [avgSessionDuration, setAvgSessionDuration] = useState(initial.avgSessionDuration);
  const [topPages, setTopPages] = useState(initial.topPages);
  const [bounceRate, setBounceRate] = useState(initial.bounceRate);
  const [gbpViews, setGbpViews] = useState(initial.gbpViews);
  const [gbpSearches, setGbpSearches] = useState(initial.gbpSearches);
  const [gbpCalls, setGbpCalls] = useState(initial.gbpCalls);
  const [gbpDirectionRequests, setGbpDirectionRequests] = useState(initial.gbpDirectionRequests);
  const [gbpWebsiteClicks, setGbpWebsiteClicks] = useState(initial.gbpWebsiteClicks);
  const [formSubmissions, setFormSubmissions] = useState(initial.formSubmissions);
  const [phoneCallLeads, setPhoneCallLeads] = useState(initial.phoneCallLeads);
  const [totalLeads, setTotalLeads] = useState(initial.totalLeads);
  const [serviceCost, setServiceCost] = useState(initial.serviceCost);
  const [avgJobSize, setAvgJobSize] = useState(initial.avgJobSize);
  const [notes, setNotes] = useState(initial.notes || "");
  const [rankings, setRankings] = useState<KeywordRanking[]>(() => parseRankings(initial.keywordRankings));

  function addRanking() {
    setRankings((prev) => [...prev, { keyword: "", before: 0, after: 0 }]);
  }

  function updateRanking(index: number, field: keyof KeywordRanking, value: string | number) {
    setRankings((prev) => prev.map((r, i) => (i === index ? { ...r, [field]: value } : r)));
  }

  function removeRanking(index: number) {
    setRankings((prev) => prev.filter((_, i) => i !== index));
  }

  // Build current report object for preview
  const currentReport: RoiReport = {
    ...initial,
    status: statusIdx,
    searchImpressions, searchClicks, clickThroughRate, topKeywords,
    totalVisitors, uniqueVisitors, avgSessionDuration, topPages, bounceRate,
    gbpViews, gbpSearches, gbpCalls, gbpDirectionRequests, gbpWebsiteClicks,
    formSubmissions, phoneCallLeads, totalLeads,
    keywordRankings: JSON.stringify(rankings.filter((r) => r.keyword.trim())),
    serviceCost, avgJobSize,
    estimatedPipelineValue: totalLeads * avgJobSize,
    notes,
  };

  async function handleSave() {
    setSaving(true);
    try {
      await updateRoiReport(initial.id, {
        status: statusIdx,
        searchImpressions, searchClicks, clickThroughRate, topKeywords,
        totalVisitors, uniqueVisitors, avgSessionDuration, topPages, bounceRate,
        gbpViews, gbpSearches, gbpCalls, gbpDirectionRequests, gbpWebsiteClicks,
        formSubmissions, phoneCallLeads, totalLeads,
        keywordRankings: JSON.stringify(rankings.filter((r) => r.keyword.trim())),
        serviceCost, avgJobSize,
        estimatedPipelineValue: totalLeads * avgJobSize,
        notes: notes || undefined,
      });
      onUpdated();
    } catch {
      alert("Failed to save report");
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete() {
    try {
      await deleteRoiReport(initial.id);
      onUpdated();
      onClose();
    } catch {
      alert("Failed to delete report");
    }
  }

  const pipelineValue = totalLeads * avgJobSize;
  const roi = serviceCost > 0 ? Math.round(((pipelineValue - serviceCost) / serviceCost) * 100) : 0;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm px-4" onClick={onClose}>
      <div className="bg-surface border border-border rounded-2xl w-full max-w-3xl max-h-[92vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        <div className="sticky top-0 bg-surface border-b border-border rounded-t-2xl px-8 py-5 z-10">
          <div className="flex items-start justify-between mb-3">
            <div>
              <h2 className="text-lg font-bold">{initial.businessName}</h2>
              <p className="text-sm text-muted">{initial.clientName} &middot; {initial.reportPeriod} &middot; {new Date(initial.reportDate).toLocaleDateString()}</p>
            </div>
            <button onClick={onClose} className="text-muted hover:text-foreground text-xl ml-4">&times;</button>
          </div>
          {/* Tabs */}
          <div className="flex gap-1">
            <button onClick={() => setTab("edit")}
              className={`px-4 py-1.5 rounded-full text-xs font-medium transition-all duration-200 ${
                tab === "edit" ? "bg-foreground/10 text-foreground" : "text-muted hover:text-foreground"
              }`}>
              Edit Data
            </button>
            <button onClick={() => setTab("preview")}
              className={`px-4 py-1.5 rounded-full text-xs font-medium transition-all duration-200 ${
                tab === "preview" ? "bg-foreground/10 text-foreground" : "text-muted hover:text-foreground"
              }`}>
              Preview Report
            </button>
          </div>
        </div>

        <div className="px-8 py-6">
          {/* Cross-stage link */}
          {initial.deliveryProjectId && (
            <div className="flex items-center gap-2 mb-4">
              <span className="text-xs text-muted">Linked from:</span>
              <Link
                href="/admin/delivery"
                className="text-xs text-primary hover:text-primary-light transition-colors"
                onClick={(e) => e.stopPropagation()}
              >
                Delivery Project #{initial.deliveryProjectId}
              </Link>
            </div>
          )}

          {tab === "preview" ? (
            <ReportPreview report={currentReport} />
          ) : (
            <div className="space-y-6">
              {/* Status */}
              <div>
                <label className="block text-xs font-medium text-muted mb-2">Status</label>
                <div className="flex flex-wrap gap-2">
                  {ROI_REPORT_STATUSES.map((s, i) => (
                    <button key={s} type="button" onClick={() => setStatusIdx(i)}
                      className={`px-3 py-1.5 rounded-full text-xs font-medium border transition-all duration-200 ${
                        statusIdx === i ? STATUS_COLORS[s] + " ring-1 ring-current" : "border-border text-muted hover:text-foreground"
                      }`}>
                      {s}
                    </button>
                  ))}
                </div>
              </div>

              {/* Search Console */}
              <div>
                <h3 className="text-xs font-medium text-muted uppercase tracking-wider mb-3 flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-blue-500" /> Google Search Console
                </h3>
                <div className="grid grid-cols-3 gap-3">
                  <NumField label="Impressions" value={searchImpressions} onChange={setSearchImpressions} />
                  <NumField label="Clicks" value={searchClicks} onChange={setSearchClicks} />
                  <NumField label="CTR" value={clickThroughRate} onChange={setClickThroughRate} suffix="%" step={0.1} />
                </div>
                <div className="mt-3">
                  <label className="block text-xs text-muted mb-1">Top Keywords</label>
                  <textarea value={topKeywords} onChange={(e) => setTopKeywords(e.target.value)} rows={2}
                    className="w-full px-3 py-2 rounded-lg border border-border bg-background text-foreground text-sm resize-y focus:outline-none focus:ring-2 focus:ring-primary/50"
                    placeholder="deck builder eugene, kitchen remodel eugene..." />
                </div>
              </div>

              <hr className="border-border" />

              {/* Google Analytics */}
              <div>
                <h3 className="text-xs font-medium text-muted uppercase tracking-wider mb-3 flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-green-500" /> Google Analytics
                </h3>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  <NumField label="Total Visitors" value={totalVisitors} onChange={setTotalVisitors} />
                  <NumField label="Unique Visitors" value={uniqueVisitors} onChange={setUniqueVisitors} />
                  <NumField label="Avg Session (sec)" value={avgSessionDuration} onChange={setAvgSessionDuration} />
                  <NumField label="Bounce Rate" value={bounceRate} onChange={setBounceRate} suffix="%" step={0.1} />
                </div>
                <div className="mt-3">
                  <label className="block text-xs text-muted mb-1">Top Pages</label>
                  <textarea value={topPages} onChange={(e) => setTopPages(e.target.value)} rows={2}
                    className="w-full px-3 py-2 rounded-lg border border-border bg-background text-foreground text-sm resize-y focus:outline-none focus:ring-2 focus:ring-primary/50"
                    placeholder="/kitchen-remodel-eugene, /deck-builder-springfield..." />
                </div>
              </div>

              <hr className="border-border" />

              {/* GBP Insights */}
              <div>
                <h3 className="text-xs font-medium text-muted uppercase tracking-wider mb-3 flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-orange-500" /> Google Business Profile
                </h3>
                <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
                  <NumField label="Profile Views" value={gbpViews} onChange={setGbpViews} />
                  <NumField label="Searches" value={gbpSearches} onChange={setGbpSearches} />
                  <NumField label="Phone Calls" value={gbpCalls} onChange={setGbpCalls} />
                  <NumField label="Directions" value={gbpDirectionRequests} onChange={setGbpDirectionRequests} />
                  <NumField label="Website Clicks" value={gbpWebsiteClicks} onChange={setGbpWebsiteClicks} />
                </div>
              </div>

              <hr className="border-border" />

              {/* Lead Capture */}
              <div>
                <h3 className="text-xs font-medium text-muted uppercase tracking-wider mb-3 flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-indigo-500" /> Lead Capture
                </h3>
                <div className="grid grid-cols-3 gap-3">
                  <NumField label="Form Submissions" value={formSubmissions} onChange={setFormSubmissions} />
                  <NumField label="Phone Call Leads" value={phoneCallLeads} onChange={setPhoneCallLeads} />
                  <NumField label="Total Leads" value={totalLeads} onChange={setTotalLeads} />
                </div>
              </div>

              <hr className="border-border" />

              {/* Keyword Rankings */}
              <div>
                <h3 className="text-xs font-medium text-muted uppercase tracking-wider mb-3 flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-purple-500" /> Keyword Rankings
                </h3>
                {rankings.length > 0 && (
                  <div className="space-y-2 mb-3">
                    <div className="grid grid-cols-[1fr_80px_80px_32px] gap-2 text-xs text-muted px-1">
                      <span>Keyword</span>
                      <span className="text-center">Before</span>
                      <span className="text-center">After</span>
                      <span />
                    </div>
                    {rankings.map((r, i) => (
                      <div key={i} className="grid grid-cols-[1fr_80px_80px_32px] gap-2 items-center">
                        <input type="text" value={r.keyword} onChange={(e) => updateRanking(i, "keyword", e.target.value)}
                          className="px-3 py-1.5 rounded-lg border border-border bg-background text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary/50"
                          placeholder="deck builder eugene" />
                        <input type="number" value={r.before || ""} onChange={(e) => updateRanking(i, "before", parseInt(e.target.value) || 0)}
                          className="px-2 py-1.5 rounded-lg border border-border bg-background text-foreground text-sm text-center focus:outline-none focus:ring-2 focus:ring-primary/50"
                          placeholder="0" min={0} title="0 = Not Ranking" />
                        <input type="number" value={r.after || ""} onChange={(e) => updateRanking(i, "after", parseInt(e.target.value) || 0)}
                          className="px-2 py-1.5 rounded-lg border border-border bg-background text-foreground text-sm text-center focus:outline-none focus:ring-2 focus:ring-primary/50"
                          placeholder="0" min={0} />
                        <button onClick={() => removeRanking(i)} className="p-1 text-muted hover:text-red-400 transition-colors">
                          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                          </svg>
                        </button>
                      </div>
                    ))}
                  </div>
                )}
                <button onClick={addRanking}
                  className="text-xs text-muted hover:text-primary transition-colors flex items-center gap-1">
                  <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                  </svg>
                  Add keyword
                </button>
                <p className="text-[10px] text-muted/60 mt-1">Use 0 for &ldquo;Before&rdquo; if not previously ranking.</p>
              </div>

              <hr className="border-border" />

              {/* ROI Calculation */}
              <div>
                <h3 className="text-xs font-medium text-muted uppercase tracking-wider mb-3 flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-green-500" /> ROI Calculation
                </h3>
                <div className="grid grid-cols-2 gap-3 mb-4">
                  <NumField label="Your Service Cost" value={serviceCost} onChange={setServiceCost} prefix="$" />
                  <NumField label="Client's Avg Job Size" value={avgJobSize} onChange={setAvgJobSize} prefix="$" />
                </div>
                {/* Calculated values */}
                <div className="bg-background rounded-xl border border-border p-4">
                  <div className="grid grid-cols-3 gap-4 text-center">
                    <div>
                      <div className="text-xs text-muted mb-1">Total Leads</div>
                      <div className="text-lg font-bold">{totalLeads}</div>
                    </div>
                    <div>
                      <div className="text-xs text-muted mb-1">Pipeline Value</div>
                      <div className="text-lg font-bold text-green-400">{formatCurrency(pipelineValue)}</div>
                    </div>
                    <div>
                      <div className="text-xs text-muted mb-1">ROI</div>
                      <div className={`text-lg font-bold ${roi > 0 ? "text-green-400" : "text-muted"}`}>{formatNumber(roi)}%</div>
                    </div>
                  </div>
                </div>
              </div>

              <hr className="border-border" />

              {/* Notes */}
              <div>
                <label className="block text-xs font-medium text-muted mb-1">Notes</label>
                <textarea value={notes} onChange={(e) => setNotes(e.target.value)} rows={3}
                  className="w-full px-3 py-2 rounded-lg border border-border bg-background text-foreground text-sm resize-y focus:outline-none focus:ring-2 focus:ring-primary/50"
                  placeholder="Additional notes or observations..." />
              </div>

              {/* Save */}
              <div className="flex gap-3">
                <button onClick={handleSave} disabled={saving}
                  className="flex-1 bg-primary hover:bg-primary-dark disabled:opacity-50 text-white px-4 py-2.5 rounded-full text-sm font-medium transition-all duration-200">
                  {saving ? "Saving..." : "Save Report"}
                </button>
              </div>

              {/* Delete */}
              <div className="pt-2">
                {confirmDelete ? (
                  <div className="flex items-center gap-3">
                    <span className="text-xs text-red-400">Delete this report? Cannot be undone.</span>
                    <button onClick={handleDelete}
                      className="px-3 py-1.5 rounded-full bg-red-500 hover:bg-red-600 text-white text-xs font-medium transition-colors">
                      Yes, Delete
                    </button>
                    <button onClick={() => setConfirmDelete(false)}
                      className="px-3 py-1.5 rounded-full border border-border text-xs text-muted hover:text-foreground transition-colors">
                      Cancel
                    </button>
                  </div>
                ) : (
                  <button onClick={() => setConfirmDelete(true)}
                    className="text-xs text-muted hover:text-red-400 transition-colors">
                    Delete Report
                  </button>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// ─── Main Page ──────────────────────────────────────────────────────────────
export default function AdminReportsPage() {
  const [reports, setReports] = useState<RoiReport[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [pageSize] = useState(25);
  const [filterStatus, setFilterStatus] = useState<number | undefined>(undefined);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState<RoiReport | null>(null);
  const [showCreate, setShowCreate] = useState(false);

  const fetchReports = useCallback(async () => {
    setLoading(true);
    try {
      const data = await getRoiReports(page, pageSize, filterStatus);
      setReports(data.items);
      setTotal(data.total);
    } catch {
      console.error("Failed to load reports");
    } finally {
      setLoading(false);
    }
  }, [page, pageSize, filterStatus]);

  useEffect(() => {
    fetchReports();
  }, [fetchReports]);

  async function handleSelect(r: RoiReport) {
    try {
      const full = await getRoiReport(r.id);
      setSelected(full);
    } catch {
      alert("Failed to load report");
    }
  }

  const totalPages = Math.ceil(total / pageSize);

  return (
    <div className="min-h-screen pt-24 pb-16 px-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex items-start justify-between mb-8">
          <div>
            <h1 className="text-2xl font-bold">Client ROI Reports</h1>
            <p className="text-sm text-muted mt-1">{total} report{total !== 1 ? "s" : ""}</p>
          </div>
          <button onClick={() => setShowCreate(true)}
            className="bg-primary hover:bg-primary-dark text-white px-5 py-2.5 rounded-full text-sm font-medium transition-all duration-200">
            + New Report
          </button>
        </div>

        {/* Status filter pills */}
        <div className="flex flex-wrap gap-2 mb-6">
          <button
            onClick={() => { setFilterStatus(undefined); setPage(1); }}
            className={`px-4 py-1.5 rounded-full text-xs font-medium border transition-all duration-200 ${
              filterStatus === undefined
                ? "bg-foreground/10 text-foreground border-foreground/20"
                : "border-border text-muted hover:text-foreground"
            }`}>
            All
          </button>
          {ROI_REPORT_STATUSES.map((s, i) => (
            <button key={s}
              onClick={() => { setFilterStatus(i); setPage(1); }}
              className={`px-4 py-1.5 rounded-full text-xs font-medium border transition-all duration-200 ${
                filterStatus === i ? STATUS_COLORS[s] : "border-border text-muted hover:text-foreground"
              }`}>
              {s}
            </button>
          ))}
        </div>

        {/* Report Cards */}
        {loading ? (
          <div className="p-12 text-center text-muted text-sm">Loading reports...</div>
        ) : reports.length === 0 ? (
          <div className="bg-surface rounded-2xl border border-border p-12 text-center">
            <p className="text-muted text-sm">No ROI reports yet.</p>
            <p className="text-muted/60 text-xs mt-2">Create a report at 30, 60, or 90 days to show clients the value you&apos;re delivering.</p>
          </div>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {reports.map((report) => {
              const statusLabel = ROI_REPORT_STATUSES[report.status] || "Unknown";
              const pipelineValue = report.totalLeads * report.avgJobSize;

              return (
                <div
                  key={report.id}
                  onClick={() => handleSelect(report)}
                  className="bg-surface border border-border rounded-2xl p-5 hover:border-primary/30 cursor-pointer transition-all duration-200 group"
                >
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <h3 className="font-semibold text-sm group-hover:text-primary transition-colors">{report.businessName}</h3>
                      <p className="text-xs text-muted">{report.clientName}</p>
                    </div>
                    <span className={`inline-block px-2.5 py-0.5 rounded-full text-[10px] font-medium border shrink-0 ${STATUS_COLORS[statusLabel as ReportStatus] || ""}`}>
                      {statusLabel}
                    </span>
                  </div>

                  <div className="flex items-center gap-2 mb-3">
                    <span className="text-xs text-muted bg-background px-2 py-0.5 rounded-full">{report.reportPeriod}</span>
                    <span className="text-xs text-muted">{new Date(report.reportDate).toLocaleDateString()}</span>
                  </div>

                  {/* Key stats preview */}
                  <div className="grid grid-cols-3 gap-2 text-center">
                    <div className="bg-background rounded-lg py-2">
                      <div className="text-sm font-bold text-foreground">{formatNumber(report.totalLeads)}</div>
                      <div className="text-[9px] text-muted uppercase">Leads</div>
                    </div>
                    <div className="bg-background rounded-lg py-2">
                      <div className="text-sm font-bold text-foreground">{formatNumber(report.totalVisitors)}</div>
                      <div className="text-[9px] text-muted uppercase">Visitors</div>
                    </div>
                    <div className="bg-background rounded-lg py-2">
                      <div className="text-sm font-bold text-green-400">{pipelineValue > 0 ? formatCurrency(pipelineValue) : "$0"}</div>
                      <div className="text-[9px] text-muted uppercase">Pipeline</div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex items-center justify-between mt-6">
            <span className="text-xs text-muted">Page {page} of {totalPages}</span>
            <div className="flex gap-2">
              <button onClick={() => setPage((p) => Math.max(1, p - 1))} disabled={page === 1}
                className="px-3 py-1.5 rounded-lg border border-border text-xs text-muted hover:text-foreground disabled:opacity-30 transition-colors">
                Previous
              </button>
              <button onClick={() => setPage((p) => Math.min(totalPages, p + 1))} disabled={page === totalPages}
                className="px-3 py-1.5 rounded-lg border border-border text-xs text-muted hover:text-foreground disabled:opacity-30 transition-colors">
                Next
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Modals */}
      {showCreate && (
        <CreateReportModal onClose={() => setShowCreate(false)} onCreated={fetchReports} />
      )}
      {selected && (
        <ReportDetail
          report={selected}
          onClose={() => setSelected(null)}
          onUpdated={() => { fetchReports(); setSelected(null); }}
        />
      )}
    </div>
  );
}