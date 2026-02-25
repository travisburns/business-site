"use client";
import { useEffect, useState, useCallback } from "react";
import {
  getTemplateAnalyticsSummary,
  getTemplatePerformance,
  getChannelPerformance,
  getCategoryPerformance,
  getSequencePerformance,
  getTemplateComparison,
  type TemplateAnalyticsSummary,
  type TemplatePerformance,
  type ChannelPerformance,
  type CategoryPerformance,
  type SequenceStepPerformance,
  type TemplateComparison,
} from "@/lib/api";

// ─── Helpers ─────────────────────────────────────────────────────────────────
function rateColor(rate: number): string {
  if (rate >= 30) return "text-emerald-400";
  if (rate >= 15) return "text-yellow-400";
  if (rate >= 5) return "text-orange-400";
  return "text-red-400";
}

function rateBg(rate: number): string {
  if (rate >= 30) return "bg-emerald-500";
  if (rate >= 15) return "bg-yellow-500";
  if (rate >= 5) return "bg-orange-500";
  return "bg-red-500";
}

const CHANNEL_COLORS: Record<string, string> = {
  Email: "bg-blue-500/10 text-blue-400",
  LinkedIn: "bg-sky-500/10 text-sky-400",
  LinkedInInMail: "bg-indigo-500/10 text-indigo-400",
  Phone: "bg-emerald-500/10 text-emerald-400",
};

// ─── Summary Cards ───────────────────────────────────────────────────────────
function SummaryCards({ summary }: { summary: TemplateAnalyticsSummary | null }) {
  if (!summary) return null;
  return (
    <div className="space-y-4 mb-8">
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-7 gap-3">
        <div className="bg-surface rounded-xl border border-border p-4">
          <p className="text-2xl font-bold">{summary.totalTemplatesUsed}</p>
          <p className="text-xs text-muted">Templates Used</p>
        </div>
        <div className="bg-surface rounded-xl border border-border p-4">
          <p className="text-2xl font-bold">{summary.totalSent}</p>
          <p className="text-xs text-muted">Total Sent</p>
        </div>
        <div className="bg-surface rounded-xl border border-border p-4">
          <p className="text-2xl font-bold">{summary.totalReplies}</p>
          <p className="text-xs text-muted">Total Replies</p>
        </div>
        <div className="bg-surface rounded-xl border border-border p-4">
          <p className={`text-2xl font-bold ${rateColor(summary.overallReplyRate)}`}>{summary.overallReplyRate}%</p>
          <p className="text-xs text-muted">Reply Rate</p>
        </div>
        <div className="bg-surface rounded-xl border border-border p-4">
          <p className={`text-2xl font-bold ${rateColor(summary.overallPositiveRate)}`}>{summary.overallPositiveRate}%</p>
          <p className="text-xs text-muted">Positive Rate</p>
        </div>
        <div className="bg-surface rounded-xl border border-border p-4">
          <p className="text-2xl font-bold text-emerald-400">{summary.totalConversions}</p>
          <p className="text-xs text-muted">Conversions</p>
        </div>
        <div className="bg-surface rounded-xl border border-border p-4">
          <p className={`text-2xl font-bold ${rateColor(summary.overallConversionRate)}`}>{summary.overallConversionRate}%</p>
          <p className="text-xs text-muted">Conv. Rate</p>
        </div>
      </div>
      {(summary.bestTemplate || summary.worstTemplate) && (
        <div className="grid sm:grid-cols-2 gap-3">
          {summary.bestTemplate && (
            <div className="bg-surface rounded-xl border border-emerald-500/20 p-4">
              <div className="flex items-center gap-2 mb-1">
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 font-medium uppercase">Best Performer</span>
                <span className={`text-sm font-bold ${rateColor(summary.bestTemplateReplyRate)}`}>{summary.bestTemplateReplyRate}% reply rate</span>
              </div>
              <p className="text-sm font-medium truncate">{summary.bestTemplate}</p>
              <p className="text-[10px] text-muted mt-0.5">Min 5 sends to qualify</p>
            </div>
          )}
          {summary.worstTemplate && summary.worstTemplate !== summary.bestTemplate && (
            <div className="bg-surface rounded-xl border border-red-500/20 p-4">
              <div className="flex items-center gap-2 mb-1">
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-red-500/10 text-red-400 font-medium uppercase">Needs Work</span>
                <span className={`text-sm font-bold ${rateColor(summary.worstTemplateReplyRate)}`}>{summary.worstTemplateReplyRate}% reply rate</span>
              </div>
              <p className="text-sm font-medium truncate">{summary.worstTemplate}</p>
              <p className="text-[10px] text-muted mt-0.5">Consider rewriting or replacing</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

// ─── Template Performance Table ──────────────────────────────────────────────
function TemplateTable({ data, sortBy, sortDesc, onSort }: {
  data: TemplatePerformance[];
  sortBy: string;
  sortDesc: boolean;
  onSort: (col: string) => void;
}) {
  if (data.length === 0) return <p className="text-sm text-muted text-center py-8">No template data yet. Start logging outreach to see performance.</p>;

  function SortHeader({ col, label, className }: { col: string; label: string; className?: string }) {
    const active = sortBy === col;
    return (
      <th className={`py-3 pr-3 text-muted font-medium cursor-pointer hover:text-foreground transition-colors ${className || ""}`}
        onClick={() => onSort(col)}>
        {label} {active ? (sortDesc ? "\u2193" : "\u2191") : ""}
      </th>
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-border text-left">
            <th className="py-3 pr-3 text-muted font-medium">Template</th>
            <th className="py-3 pr-3 text-muted font-medium hidden lg:table-cell">Channel</th>
            <th className="py-3 pr-3 text-muted font-medium hidden lg:table-cell">Category</th>
            <SortHeader col="sent" label="Sent" />
            <SortHeader col="replies" label="Replies" />
            <SortHeader col="replyrate" label="Reply %" />
            <SortHeader col="positiverate" label="Positive %" className="hidden md:table-cell" />
            <SortHeader col="conversions" label="Conv." className="hidden md:table-cell" />
            <SortHeader col="conversionrate" label="Conv. %" className="hidden lg:table-cell" />
          </tr>
        </thead>
        <tbody className="divide-y divide-border">
          {data.map((t, i) => (
            <tr key={i} className="hover:bg-white/[0.02] transition-colors">
              <td className="py-3 pr-3">
                <div className="font-medium truncate max-w-[200px]">{t.templateName}</div>
              </td>
              <td className="py-3 pr-3 hidden lg:table-cell">
                <span className={`text-[10px] px-2 py-0.5 rounded-full ${CHANNEL_COLORS[t.channel] || "text-muted"}`}>{t.channel}</span>
              </td>
              <td className="py-3 pr-3 text-xs text-muted hidden lg:table-cell">{t.category}</td>
              <td className="py-3 pr-3 tabular-nums">{t.timesSent}</td>
              <td className="py-3 pr-3 tabular-nums">{t.replies}</td>
              <td className="py-3 pr-3">
                <div className="flex items-center gap-2">
                  <span className={`font-medium tabular-nums ${rateColor(t.replyRate)}`}>{t.replyRate}%</span>
                  <div className="w-12 h-1.5 rounded-full bg-border overflow-hidden hidden sm:block">
                    <div className={`h-full rounded-full ${rateBg(t.replyRate)}`} style={{ width: `${Math.min(t.replyRate, 100)}%` }} />
                  </div>
                </div>
              </td>
              <td className="py-3 pr-3 hidden md:table-cell">
                <span className={`tabular-nums ${rateColor(t.positiveRate)}`}>{t.positiveRate}%</span>
              </td>
              <td className="py-3 pr-3 tabular-nums hidden md:table-cell">{t.conversions}</td>
              <td className="py-3 pr-3 hidden lg:table-cell">
                <span className={`tabular-nums ${rateColor(t.conversionRate)}`}>{t.conversionRate}%</span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

// ─── Channel Breakdown ───────────────────────────────────────────────────────
function ChannelBreakdown({ data }: { data: ChannelPerformance[] }) {
  if (data.length === 0) return null;
  return (
    <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-3">
      {data.map((ch) => (
        <div key={ch.channel} className="bg-surface rounded-xl border border-border p-4">
          <div className="flex items-center gap-2 mb-3">
            <span className={`text-xs px-2.5 py-0.5 rounded-full ${CHANNEL_COLORS[ch.channel] || "text-muted bg-surface-lighter"}`}>{ch.channel}</span>
            <span className="text-xs text-muted">{ch.uniqueProspects} prospects</span>
          </div>
          <div className="grid grid-cols-2 gap-y-2 text-sm">
            <div>
              <p className="text-lg font-bold">{ch.totalSent}</p>
              <p className="text-[10px] text-muted">Sent</p>
            </div>
            <div>
              <p className="text-lg font-bold">{ch.replies}</p>
              <p className="text-[10px] text-muted">Replies</p>
            </div>
            <div>
              <p className={`text-lg font-bold ${rateColor(ch.replyRate)}`}>{ch.replyRate}%</p>
              <p className="text-[10px] text-muted">Reply Rate</p>
            </div>
            <div>
              <p className={`text-lg font-bold ${rateColor(ch.positiveRate)}`}>{ch.positiveRate}%</p>
              <p className="text-[10px] text-muted">Positive Rate</p>
            </div>
          </div>
          {ch.conversions > 0 && (
            <div className="mt-2 pt-2 border-t border-border">
              <span className="text-xs text-emerald-400 font-medium">{ch.conversions} conversion{ch.conversions !== 1 ? "s" : ""}</span>
              <span className="text-xs text-muted ml-1">({ch.conversionRate}%)</span>
            </div>
          )}
        </div>
      ))}
    </div>
  );
}

// ─── Category Breakdown ──────────────────────────────────────────────────────
function CategoryBreakdown({ data }: { data: CategoryPerformance[] }) {
  if (data.length === 0) return null;
  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-border text-left">
            <th className="py-3 pr-3 text-muted font-medium">Category</th>
            <th className="py-3 pr-3 text-muted font-medium">Templates</th>
            <th className="py-3 pr-3 text-muted font-medium">Sent</th>
            <th className="py-3 pr-3 text-muted font-medium">Replies</th>
            <th className="py-3 pr-3 text-muted font-medium">Reply %</th>
            <th className="py-3 pr-3 text-muted font-medium hidden md:table-cell">Positive %</th>
            <th className="py-3 pr-3 text-muted font-medium hidden md:table-cell">Conv.</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-border">
          {data.map((c) => (
            <tr key={c.category} className="hover:bg-white/[0.02] transition-colors">
              <td className="py-3 pr-3 font-medium">{c.category}</td>
              <td className="py-3 pr-3 text-muted tabular-nums">{c.uniqueTemplates}</td>
              <td className="py-3 pr-3 tabular-nums">{c.totalSent}</td>
              <td className="py-3 pr-3 tabular-nums">{c.replies}</td>
              <td className="py-3 pr-3">
                <span className={`font-medium tabular-nums ${rateColor(c.replyRate)}`}>{c.replyRate}%</span>
              </td>
              <td className="py-3 pr-3 hidden md:table-cell">
                <span className={`tabular-nums ${rateColor(c.positiveRate)}`}>{c.positiveRate}%</span>
              </td>
              <td className="py-3 pr-3 tabular-nums hidden md:table-cell">{c.conversions}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

// ─── Sequence Performance ────────────────────────────────────────────────────
function SequenceBreakdown({ data }: { data: SequenceStepPerformance[] }) {
  if (data.length === 0) return <p className="text-sm text-muted text-center py-6">No sequence data yet.</p>;
  return (
    <div className="space-y-3">
      {data.map((step) => (
        <div key={step.stepNumber} className="bg-surface rounded-xl border border-border p-4">
          <div className="flex items-center justify-between mb-3">
            <div>
              <h4 className="text-sm font-semibold">{step.stepLabel}</h4>
              <p className="text-[10px] text-muted">{step.totalSent} sent total</p>
            </div>
            <div className="flex items-center gap-4 text-right">
              <div>
                <p className={`text-lg font-bold ${rateColor(step.replyRate)}`}>{step.replyRate}%</p>
                <p className="text-[10px] text-muted">Reply Rate</p>
              </div>
              <div>
                <p className={`text-lg font-bold ${rateColor(step.positiveRate)}`}>{step.positiveRate}%</p>
                <p className="text-[10px] text-muted">Positive</p>
              </div>
            </div>
          </div>
          {/* Reply rate bar */}
          <div className="w-full h-2 rounded-full bg-border overflow-hidden mb-3">
            <div className={`h-full rounded-full ${rateBg(step.replyRate)} transition-all`} style={{ width: `${Math.min(step.replyRate, 100)}%` }} />
          </div>
          {/* Channel breakdown */}
          {(step.emailPerformance || step.linkedInPerformance) && (
            <div className="flex gap-4 text-xs">
              {step.emailPerformance && (
                <div className="flex items-center gap-1.5">
                  <span className="text-[10px] px-2 py-0.5 rounded-full bg-blue-500/10 text-blue-400">Email</span>
                  <span className="text-muted">{step.emailPerformance.totalSent} sent</span>
                  <span className={rateColor(step.emailPerformance.replyRate)}>{step.emailPerformance.replyRate}%</span>
                </div>
              )}
              {step.linkedInPerformance && (
                <div className="flex items-center gap-1.5">
                  <span className="text-[10px] px-2 py-0.5 rounded-full bg-sky-500/10 text-sky-400">LinkedIn</span>
                  <span className="text-muted">{step.linkedInPerformance.totalSent} sent</span>
                  <span className={rateColor(step.linkedInPerformance.replyRate)}>{step.linkedInPerformance.replyRate}%</span>
                </div>
              )}
            </div>
          )}
        </div>
      ))}
    </div>
  );
}

// ─── A/B Comparison ──────────────────────────────────────────────────────────
function ComparisonView({ data, categories, selectedCategory, onCategoryChange }: {
  data: TemplateComparison[];
  categories: string[];
  selectedCategory: string;
  onCategoryChange: (cat: string) => void;
}) {
  // Group comparisons by template name to show side-by-side channels
  const grouped: Record<string, TemplateComparison[]> = {};
  for (const item of data) {
    if (!grouped[item.templateName]) grouped[item.templateName] = [];
    grouped[item.templateName].push(item);
  }

  // Only show templates that appear in multiple channels (actual A/B data)
  const multiChannel = Object.entries(grouped).filter(([, items]) => items.length > 1);
  const singleChannel = Object.entries(grouped).filter(([, items]) => items.length === 1);

  return (
    <div>
      {/* Category filter */}
      <div className="flex flex-wrap gap-2 mb-4">
        <button onClick={() => onCategoryChange("")}
          className={`text-xs px-3 py-1.5 rounded-full border transition-all ${
            !selectedCategory ? "border-primary text-primary bg-primary/10" : "border-border text-muted hover:text-foreground"
          }`}>All</button>
        {categories.map((cat) => (
          <button key={cat} onClick={() => onCategoryChange(cat)}
            className={`text-xs px-3 py-1.5 rounded-full border transition-all ${
              selectedCategory === cat ? "border-primary text-primary bg-primary/10" : "border-border text-muted hover:text-foreground"
            }`}>{cat}</button>
        ))}
      </div>

      {data.length === 0 ? (
        <p className="text-sm text-muted text-center py-8">No comparison data yet.</p>
      ) : (
        <div className="space-y-6">
          {multiChannel.length > 0 && (
            <div>
              <h4 className="text-xs font-semibold text-muted uppercase tracking-wider mb-3">Multi-Channel Comparisons</h4>
              <div className="space-y-3">
                {multiChannel.map(([name, items]) => (
                  <div key={name} className="bg-surface rounded-xl border border-border p-4">
                    <h5 className="text-sm font-semibold mb-3 truncate">{name}</h5>
                    <div className="grid gap-2">
                      {items.sort((a, b) => b.replyRate - a.replyRate).map((item, i) => {
                        const isWinner = i === 0 && items.length > 1;
                        return (
                          <div key={item.channel} className={`flex items-center gap-3 p-2 rounded-lg ${isWinner ? "bg-emerald-500/[0.04] border border-emerald-500/20" : "bg-background/50"}`}>
                            <span className={`text-[10px] px-2 py-0.5 rounded-full ${CHANNEL_COLORS[item.channel] || "text-muted"}`}>{item.channel}</span>
                            <span className="text-xs text-muted">{item.timesSent} sent</span>
                            <span className="text-xs text-muted">{item.replies} replies</span>
                            <span className={`text-xs font-medium ml-auto ${rateColor(item.replyRate)}`}>{item.replyRate}% reply</span>
                            <span className={`text-xs ${rateColor(item.positiveRate)}`}>{item.positiveRate}% positive</span>
                            {isWinner && <span className="text-[10px] text-emerald-400 font-medium">WINNER</span>}
                          </div>
                        );
                      })}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {singleChannel.length > 0 && (
            <div>
              <h4 className="text-xs font-semibold text-muted uppercase tracking-wider mb-3">Single Channel (no comparison yet)</h4>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-border text-left">
                      <th className="py-2 pr-3 text-muted font-medium text-xs">Template</th>
                      <th className="py-2 pr-3 text-muted font-medium text-xs">Channel</th>
                      <th className="py-2 pr-3 text-muted font-medium text-xs">Sent</th>
                      <th className="py-2 pr-3 text-muted font-medium text-xs">Reply %</th>
                      <th className="py-2 text-muted font-medium text-xs">Positive %</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border">
                    {singleChannel.map(([name, items]) => (
                      <tr key={name} className="hover:bg-white/[0.02]">
                        <td className="py-2 pr-3 text-xs truncate max-w-[200px]">{name}</td>
                        <td className="py-2 pr-3"><span className={`text-[10px] px-2 py-0.5 rounded-full ${CHANNEL_COLORS[items[0].channel] || ""}`}>{items[0].channel}</span></td>
                        <td className="py-2 pr-3 text-xs tabular-nums">{items[0].timesSent}</td>
                        <td className="py-2 pr-3"><span className={`text-xs tabular-nums ${rateColor(items[0].replyRate)}`}>{items[0].replyRate}%</span></td>
                        <td className="py-2"><span className={`text-xs tabular-nums ${rateColor(items[0].positiveRate)}`}>{items[0].positiveRate}%</span></td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

// ─── Main Analytics Page ─────────────────────────────────────────────────────
export default function AnalyticsPage() {
  const [tab, setTab] = useState<"templates" | "channels" | "categories" | "sequence" | "compare">("templates");
  const [dateFrom, setDateFrom] = useState("");
  const [dateTo, setDateTo] = useState("");
  const [channelFilter, setChannelFilter] = useState("");
  const [sortBy, setSortBy] = useState("sent");
  const [sortDesc, setSortDesc] = useState(true);
  const [compareCategory, setCompareCategory] = useState("");

  const [summary, setSummary] = useState<TemplateAnalyticsSummary | null>(null);
  const [templates, setTemplates] = useState<TemplatePerformance[]>([]);
  const [channels, setChannels] = useState<ChannelPerformance[]>([]);
  const [categories, setCategories] = useState<CategoryPerformance[]>([]);
  const [sequence, setSequence] = useState<SequenceStepPerformance[]>([]);
  const [comparison, setComparison] = useState<TemplateComparison[]>([]);
  const [loading, setLoading] = useState(true);

  const from = dateFrom || undefined;
  const to = dateTo || undefined;

  const loadAll = useCallback(async () => {
    setLoading(true);
    try {
      const [summaryData, templateData, channelData, categoryData, sequenceData, comparisonData] = await Promise.all([
        getTemplateAnalyticsSummary(from, to),
        getTemplatePerformance(from, to, channelFilter || undefined, undefined, sortBy, sortDesc),
        getChannelPerformance(from, to),
        getCategoryPerformance(from, to),
        getSequencePerformance(from, to),
        getTemplateComparison(from, to, compareCategory || undefined),
      ]);
      setSummary(summaryData);
      setTemplates(templateData);
      setChannels(channelData);
      setCategories(categoryData);
      setSequence(sequenceData);
      setComparison(comparisonData);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, [from, to, channelFilter, sortBy, sortDesc, compareCategory]);

  useEffect(() => { loadAll(); }, [loadAll]);

  function handleSort(col: string) {
    if (sortBy === col) {
      setSortDesc(!sortDesc);
    } else {
      setSortBy(col);
      setSortDesc(true);
    }
  }

  const uniqueCategories = [...new Set(templates.map(t => t.category))].filter(Boolean);

  return (
    <div className="p-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold">Template Analytics</h1>
          <p className="text-sm text-muted mt-1">Which templates are weapons, which are duds</p>
        </div>
      </div>

      {/* Date range filter */}
      <div className="flex flex-wrap items-center gap-3 mb-6">
        <div className="flex items-center gap-2">
          <label className="text-xs text-muted">From</label>
          <input type="date" value={dateFrom} onChange={(e) => setDateFrom(e.target.value)}
            className="bg-surface border border-border rounded-lg px-3 py-1.5 text-xs focus:outline-none focus:ring-1 focus:ring-primary" />
        </div>
        <div className="flex items-center gap-2">
          <label className="text-xs text-muted">To</label>
          <input type="date" value={dateTo} onChange={(e) => setDateTo(e.target.value)}
            className="bg-surface border border-border rounded-lg px-3 py-1.5 text-xs focus:outline-none focus:ring-1 focus:ring-primary" />
        </div>
        {(dateFrom || dateTo) && (
          <button onClick={() => { setDateFrom(""); setDateTo(""); }}
            className="text-xs text-muted hover:text-foreground transition-colors">
            Clear dates
          </button>
        )}
      </div>

      {/* Summary */}
      {!loading && <SummaryCards summary={summary} />}

      {/* Tabs */}
      <div className="flex gap-1 mb-6 border-b border-border overflow-x-auto">
        {([
          { key: "templates" as const, label: "All Templates" },
          { key: "channels" as const, label: "By Channel" },
          { key: "categories" as const, label: "By Category" },
          { key: "sequence" as const, label: "Sequence" },
          { key: "compare" as const, label: "A/B Compare" },
        ]).map(({ key, label }) => (
          <button key={key} onClick={() => setTab(key)}
            className={`px-4 py-2 text-sm font-medium border-b-2 transition-colors whitespace-nowrap ${
              tab === key ? "border-primary text-foreground" : "border-transparent text-muted hover:text-foreground"
            }`}>
            {label}
          </button>
        ))}
      </div>

      {loading ? (
        <p className="text-sm text-muted text-center py-12">Loading analytics...</p>
      ) : (
        <>
          {/* All Templates Tab */}
          {tab === "templates" && (
            <div>
              {/* Channel filter */}
              <div className="flex flex-wrap gap-2 mb-4">
                {["", "Email", "LinkedIn", "LinkedInInMail", "Phone"].map((ch) => (
                  <button key={ch} onClick={() => setChannelFilter(ch)}
                    className={`text-xs px-3 py-1.5 rounded-full border transition-all ${
                      channelFilter === ch ? "border-primary text-primary bg-primary/10" : "border-border text-muted hover:text-foreground"
                    }`}>{ch || "All Channels"}</button>
                ))}
              </div>
              <TemplateTable data={templates} sortBy={sortBy} sortDesc={sortDesc} onSort={handleSort} />
            </div>
          )}

          {/* By Channel Tab */}
          {tab === "channels" && <ChannelBreakdown data={channels} />}

          {/* By Category Tab */}
          {tab === "categories" && <CategoryBreakdown data={categories} />}

          {/* Sequence Tab */}
          {tab === "sequence" && <SequenceBreakdown data={sequence} />}

          {/* A/B Compare Tab */}
          {tab === "compare" && (
            <ComparisonView
              data={comparison}
              categories={uniqueCategories}
              selectedCategory={compareCategory}
              onCategoryChange={setCompareCategory}
            />
          )}
        </>
      )}
    </div>
  );
}