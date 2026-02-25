"use client";
import { useEffect, useState, useCallback, type FormEvent } from "react";
import {
  getProspects,
  getProspect,
  createProspect,
  updateProspect,
  deleteProspect,
  logOutreach,
  updateOutreach,
  getTemplateSuggestions,
  getProspectStats,
  exportProspects,
  getTemplates,
  getTemplate,
  previewTemplate,
  getProspectSequence,
  createProspectSequence,
  cancelProspectSequence,
  submitOnboarding,
  prospectStatusLabel,
  websiteStatusLabel,
  serviceTypeLabel,
  leadGenLabel,
  channelLabel,
  responseStatusLabel,
  PROSPECT_STATUSES,
  WEBSITE_STATUSES,
  SERVICE_TYPES,
  LEAD_GEN_METHODS,
  OUTREACH_CHANNELS,
  RESPONSE_STATUSES,
  type Prospect,
  type OutreachActivity,
  type TemplateSuggestion,
  type ProspectStats,
  type OutreachTemplate,
  type TemplateGroup,
  type TemplatePreview,
  type FollowUpStep,
} from "@/lib/api";
// ─── Style maps ──────────────────────────────────────────────────────────────
const PROSPECT_STATUS_COLORS: Record<number, string> = {
  0: "bg-zinc-500/10 text-zinc-400",      // Researched
  1: "bg-blue-500/10 text-blue-400",      // Contacted
  2: "bg-yellow-500/10 text-yellow-400",  // Engaged
  3: "bg-secondary/10 text-secondary",    // Converted
  4: "bg-accent/10 text-accent",          // Not Interested
  5: "bg-orange-500/10 text-orange-400",  // Unresponsive
};
const CHANNEL_COLORS: Record<number, string> = {
  0: "bg-blue-500/10 text-blue-400",     // Email
  1: "bg-sky-500/10 text-sky-400",       // LinkedIn
  2: "bg-indigo-500/10 text-indigo-400", // LinkedIn InMail
  3: "bg-secondary/10 text-secondary",   // Phone
};
const RESPONSE_COLORS: Record<number, string> = {
  0: "text-zinc-500",    // No Response
  1: "text-secondary",   // Positive
  2: "text-accent",      // Negative
  3: "text-yellow-400",  // Question
  4: "text-orange-400",  // Unsubscribed
};
// ─── Create Prospect Modal ───────────────────────────────────────────────────
function CreateProspectModal({ onClose, onCreated }: { onClose: () => void; onCreated: () => void }) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setError("");
    const fd = new FormData(e.currentTarget);
    try {
      await createProspect({
        name: fd.get("name") as string,
        email: (fd.get("email") as string) || undefined,
        phone: (fd.get("phone") as string) || undefined,
        companyName: fd.get("companyName") as string,
        city: (fd.get("city") as string) || undefined,
        websiteUrl: (fd.get("websiteUrl") as string) || undefined,
        websiteStatus: parseInt(fd.get("websiteStatus") as string),
        serviceType: parseInt(fd.get("serviceType") as string),
        googleRankingPage: fd.get("googleRankingPage") ? parseInt(fd.get("googleRankingPage") as string) : undefined,
        isMobileFriendly: fd.get("isMobileFriendly") === "on",
        hasLeadCapture: fd.get("hasLeadCapture") === "on",
        currentLeadGen: parseInt(fd.get("currentLeadGen") as string),
        source: (fd.get("source") as string) || undefined,
        notes: (fd.get("notes") as string) || undefined,
      });
      onCreated();
      onClose();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to create prospect");
    } finally {
      setLoading(false);
    }
  }
  const inputCls = "w-full bg-background border border-border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-primary";
  const labelCls = "block text-xs text-muted mb-1";
  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center bg-black/60 backdrop-blur-sm px-4" onClick={onClose}>
      <div className="bg-surface border border-border rounded-2xl p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-lg font-bold">New Prospect</h2>
          <button onClick={onClose} className="text-muted hover:text-foreground text-xl">&times;</button>
        </div>
        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Contact Info */}
          <div>
            <h3 className="text-xs font-semibold text-muted uppercase tracking-wider mb-3">Contact Info</h3>
            <div className="grid sm:grid-cols-2 gap-3">
              <div>
                <label className={labelCls}>Contact Name *</label>
                <input name="name" required className={inputCls} />
              </div>
              <div>
                <label className={labelCls}>Company Name *</label>
                <input name="companyName" required className={inputCls} />
              </div>
              <div>
                <label className={labelCls}>Email</label>
                <input name="email" type="email" className={inputCls} />
              </div>
              <div>
                <label className={labelCls}>Phone</label>
                <input name="phone" className={inputCls} />
              </div>
              <div>
                <label className={labelCls}>City</label>
                <input name="city" defaultValue="Eugene" className={inputCls} />
              </div>
              <div>
                <label className={labelCls}>Source</label>
                <select name="source" className={inputCls}>
                  <option value="Google">Google Search</option>
                  <option value="LinkedIn">LinkedIn</option>
                  <option value="Referral">Referral</option>
                  <option value="Yelp">Yelp</option>
                  <option value="BBB">BBB</option>
                  <option value="Other">Other</option>
                </select>
              </div>
            </div>
          </div>
          {/* Site Audit */}
          <div>
            <h3 className="text-xs font-semibold text-muted uppercase tracking-wider mb-3">Site Audit</h3>
            <div className="grid sm:grid-cols-2 gap-3">
              <div>
                <label className={labelCls}>Website URL</label>
                <input name="websiteUrl" placeholder="https://..." className={inputCls} />
              </div>
              <div>
                <label className={labelCls}>Website Status</label>
                <select name="websiteStatus" className={inputCls}>
                  {WEBSITE_STATUSES.map((s, i) => <option key={i} value={i}>{s}</option>)}
                </select>
              </div>
              <div>
                <label className={labelCls}>Google Ranking Page</label>
                <input name="googleRankingPage" type="number" min="1" placeholder="e.g. 4" className={inputCls} />
              </div>
              <div className="flex items-center gap-6 pt-5">
                <label className="flex items-center gap-2 text-sm text-muted cursor-pointer">
                  <input name="isMobileFriendly" type="checkbox" className="rounded border-border bg-background" />
                  Mobile Friendly
                </label>
                <label className="flex items-center gap-2 text-sm text-muted cursor-pointer">
                  <input name="hasLeadCapture" type="checkbox" className="rounded border-border bg-background" />
                  Lead Capture
                </label>
              </div>
            </div>
          </div>
          {/* Business Profile */}
          <div>
            <h3 className="text-xs font-semibold text-muted uppercase tracking-wider mb-3">Business Profile</h3>
            <div className="grid sm:grid-cols-2 gap-3">
              <div>
                <label className={labelCls}>Service Type</label>
                <select name="serviceType" className={inputCls}>
                  {SERVICE_TYPES.map((s, i) => <option key={i} value={i}>{s}</option>)}
                </select>
              </div>
              <div>
                <label className={labelCls}>Current Lead Gen</label>
                <select name="currentLeadGen" className={inputCls}>
                  {LEAD_GEN_METHODS.map((s, i) => <option key={i} value={i}>{s}</option>)}
                </select>
              </div>
            </div>
          </div>
          <div>
            <label className={labelCls}>Notes</label>
            <textarea name="notes" rows={3} className={inputCls + " resize-y"} />
          </div>
          {error && <p className="text-accent text-sm">{error}</p>}
          <div className="flex gap-3 pt-2">
            <button type="button" onClick={onClose} className="flex-1 px-4 py-2.5 rounded-full border border-border text-sm text-muted hover:text-foreground transition-colors">
              Cancel
            </button>
            <button type="submit" disabled={loading} className="flex-1 bg-primary hover:bg-primary-dark disabled:opacity-50 text-white px-4 py-2.5 rounded-full text-sm font-medium transition-all">
              {loading ? "Creating..." : "Add Prospect"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
// ─── Template Preview Modal ──────────────────────────────────────────────────
function TemplatePreviewModal({ prospectId, templateId, onClose, onUseTemplate }: {
  prospectId: number;
  templateId: string;
  onClose: () => void;
  onUseTemplate: (preview: TemplatePreview) => void;
}) {
  const [preview, setPreview] = useState<TemplatePreview | null>(null);
  const [raw, setRaw] = useState<OutreachTemplate | null>(null);
  const [loading, setLoading] = useState(true);
  const [viewMode, setViewMode] = useState<"preview" | "raw">("preview");
  useEffect(() => {
    setLoading(true);
    Promise.all([
      previewTemplate(prospectId, templateId).catch(() => null),
      getTemplate(templateId).catch(() => null),
    ]).then(([p, r]) => {
      setPreview(p);
      setRaw(r);
    }).finally(() => setLoading(false));
  }, [prospectId, templateId]);
  return (
    <div className="fixed inset-0 z-[220] flex items-center justify-center bg-black/60 backdrop-blur-sm px-4" onClick={onClose}>
      <div className="bg-surface border border-border rounded-2xl p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
        {loading ? (
          <p className="text-sm text-muted text-center py-12">Loading template...</p>
        ) : !preview && !raw ? (
          <p className="text-sm text-accent text-center py-12">Failed to load template.</p>
        ) : (
          <>
            <div className="flex items-start justify-between mb-4">
              <div>
                <h2 className="text-lg font-bold">{preview?.templateName || raw?.name}</h2>
                <p className="text-xs text-muted mt-0.5">
                  {raw?.channel || preview?.channel} &middot; {raw?.category}
                  {preview?.companyName && <> &middot; For: <span className="text-foreground">{preview.companyName}</span></>}
                </p>
              </div>
              <button onClick={onClose} className="text-muted hover:text-foreground text-xl">&times;</button>
            </div>
            {/* Toggle */}
            {preview && raw && (
              <div className="flex gap-1 mb-4">
                <button onClick={() => setViewMode("preview")}
                  className={`px-3 py-1 rounded-full text-xs font-medium transition-all ${viewMode === "preview" ? "bg-primary/10 text-primary border border-primary/20" : "text-muted hover:text-foreground"}`}>
                  Preview (filled in)
                </button>
                <button onClick={() => setViewMode("raw")}
                  className={`px-3 py-1 rounded-full text-xs font-medium transition-all ${viewMode === "raw" ? "bg-primary/10 text-primary border border-primary/20" : "text-muted hover:text-foreground"}`}>
                  Raw Template
                </button>
              </div>
            )}
            {/* Subject */}
            {(viewMode === "preview" ? preview?.subject : raw?.subject) && (
              <div className="mb-4">
                <label className="block text-[10px] font-semibold text-muted uppercase tracking-wider mb-1">Subject Line</label>
                <div className="px-4 py-2.5 rounded-lg border border-border bg-background text-sm">
                  {viewMode === "preview" ? preview?.subject : raw?.subject}
                </div>
              </div>
            )}
            {/* Body */}
            <div className="mb-6">
              <label className="block text-[10px] font-semibold text-muted uppercase tracking-wider mb-1">Message Body</label>
              <div className="px-4 py-4 rounded-lg border border-border bg-background text-sm whitespace-pre-wrap leading-relaxed max-h-[50vh] overflow-y-auto">
                {viewMode === "preview" ? preview?.body : raw?.body}
              </div>
            </div>
            {/* Placeholders */}
            {viewMode === "raw" && raw?.placeholders && raw.placeholders.length > 0 && (
              <div className="mb-6">
                <label className="block text-[10px] font-semibold text-muted uppercase tracking-wider mb-1">Placeholders</label>
                <div className="flex flex-wrap gap-1.5">
                  {raw.placeholders.map((p) => (
                    <span key={p} className="px-2 py-0.5 rounded-full text-[10px] font-mono bg-primary/5 text-primary border border-primary/10">
                      {`{${p}}`}
                    </span>
                  ))}
                </div>
              </div>
            )}
            {/* Actions */}
            <div className="flex gap-3">
              <button onClick={onClose} className="flex-1 px-4 py-2.5 rounded-full border border-border text-sm text-muted hover:text-foreground transition-colors">
                Close
              </button>
              {preview && (
                <button onClick={() => onUseTemplate(preview)}
                  className="flex-1 bg-primary hover:bg-primary-dark text-white px-4 py-2.5 rounded-full text-sm font-medium transition-all">
                  Use This Template
                </button>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
// ─── Template Browser (for "All Templates" tab) ──────────────────────────────
function TemplateBrowserPanel({ prospectId, onSelectTemplate, onUseTemplate }: {
  prospectId: number;
  onSelectTemplate: (templateId: string) => void;
  onUseTemplate: (preview: TemplatePreview) => void;
}) {
  const [groups, setGroups] = useState<TemplateGroup[]>([]);
  const [loading, setLoading] = useState(true);
  const [channelFilter, setChannelFilter] = useState<string>("");
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [expandedTemplate, setExpandedTemplate] = useState<OutreachTemplate | null>(null);
  const [expandedPreview, setExpandedPreview] = useState<TemplatePreview | null>(null);
  const [expandLoading, setExpandLoading] = useState(false);
  const [viewMode, setViewMode] = useState<"preview" | "raw">("preview");
  useEffect(() => {
    setLoading(true);
    getTemplates(channelFilter || undefined)
      .then(setGroups)
      .catch(() => setGroups([]))
      .finally(() => setLoading(false));
  }, [channelFilter]);
  function handleExpand(templateId: string) {
    if (expandedId === templateId) {
      setExpandedId(null);
      setExpandedTemplate(null);
      setExpandedPreview(null);
      return;
    }
    setExpandedId(templateId);
    setExpandLoading(true);
    setViewMode("preview");
    Promise.all([
      getTemplate(templateId).catch(() => null),
      previewTemplate(prospectId, templateId).catch(() => null),
    ]).then(([raw, prev]) => {
      setExpandedTemplate(raw);
      setExpandedPreview(prev);
    }).finally(() => setExpandLoading(false));
  }
  // Count total templates
  const totalCount = groups.reduce((sum, g) => sum + g.templates.length, 0);
  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <div className="flex gap-2">
          {["", "Email", "LinkedIn", "LinkedIn InMail", "Phone"].map((ch) => (
            <button key={ch} onClick={() => { setChannelFilter(ch); setExpandedId(null); }}
              className={`px-3 py-1.5 rounded-full text-xs font-medium border transition-all ${
                channelFilter === ch ? "bg-primary/10 text-primary border-primary/20" : "border-border text-muted hover:text-foreground"
              }`}>
              {ch || "All"}
            </button>
          ))}
        </div>
        <span className="text-[10px] text-muted">{totalCount} templates</span>
      </div>
      {loading ? (
        <p className="text-sm text-muted text-center py-8">Loading templates...</p>
      ) : groups.length === 0 ? (
        <p className="text-sm text-muted text-center py-8">No templates found.</p>
      ) : (
        <div className="space-y-5">
          {groups.map((g) => (
            <div key={`${g.channel}-${g.category}`}>
              <div className="flex items-center gap-2 mb-2">
                <span className="text-xs font-semibold text-muted uppercase tracking-wider">{g.channel}</span>
                <span className="text-xs text-muted">&middot;</span>
                <span className="text-xs text-muted">{g.category}</span>
                <span className="text-[10px] text-muted/50">({g.templates.length})</span>
              </div>
              <div className="space-y-2">
                {g.templates.map((t) => {
                  const isExpanded = expandedId === t.id;
                  return (
                    <div key={t.id} className={`rounded-xl border transition-all ${isExpanded ? "border-primary/30 bg-primary/[0.02]" : "border-border/50 hover:border-primary/20 bg-background/50"}`}>
                      {/* Template header — always visible */}
                      <button onClick={() => handleExpand(t.id)}
                        className="w-full text-left p-3 group">
                        <div className="flex items-start justify-between gap-3">
                          <div className="min-w-0 flex-1">
                            <div className="flex items-center gap-2">
                              <p className="text-sm font-medium">{t.name}</p>
                              <span className={`text-[10px] px-2 py-0.5 rounded-full ${
                                g.channel === "Email" ? "bg-blue-500/10 text-blue-400" :
                                g.channel === "LinkedIn" ? "bg-sky-500/10 text-sky-400" :
                                g.channel === "LinkedIn InMail" ? "bg-indigo-500/10 text-indigo-400" :
                                "bg-secondary/10 text-secondary"
                              }`}>{g.channel}</span>
                            </div>
                            {t.subject && <p className="text-xs text-muted mt-0.5">Subject: {t.subject}</p>}
                            {!isExpanded && <p className="text-xs text-muted/60 mt-1 line-clamp-2">{t.bodyPreview}</p>}
                          </div>
                          <span className={`shrink-0 px-2.5 py-1 rounded-full text-[10px] font-medium transition-all ${
                            isExpanded ? "text-primary bg-primary/10 border border-primary/20" : "text-primary bg-primary/5 border border-primary/10 opacity-0 group-hover:opacity-100"
                          }`}>
                            {isExpanded ? "Collapse" : "View Full"}
                          </span>
                        </div>
                      </button>
                      {/* Expanded details — full template content */}
                      {isExpanded && (
                        <div className="px-3 pb-4 border-t border-border/30 pt-3">
                          {expandLoading ? (
                            <p className="text-xs text-muted text-center py-4">Loading full template...</p>
                          ) : !expandedTemplate && !expandedPreview ? (
                            <p className="text-xs text-accent text-center py-4">Failed to load template details.</p>
                          ) : (
                            <>
                              {/* Preview / Raw toggle */}
                              {expandedPreview && expandedTemplate && (
                                <div className="flex gap-1 mb-3">
                                  <button onClick={() => setViewMode("preview")}
                                    className={`px-3 py-1 rounded-full text-xs font-medium transition-all ${viewMode === "preview" ? "bg-primary/10 text-primary border border-primary/20" : "text-muted hover:text-foreground"}`}>
                                    Preview (filled in)
                                  </button>
                                  <button onClick={() => setViewMode("raw")}
                                    className={`px-3 py-1 rounded-full text-xs font-medium transition-all ${viewMode === "raw" ? "bg-primary/10 text-primary border border-primary/20" : "text-muted hover:text-foreground"}`}>
                                    Raw Template
                                  </button>
                                </div>
                              )}
                              {/* Subject line */}
                              {(viewMode === "preview" ? expandedPreview?.subject : expandedTemplate?.subject) && (
                                <div className="mb-3">
                                  <label className="block text-[10px] font-semibold text-muted uppercase tracking-wider mb-1">Subject Line</label>
                                  <div className="px-3 py-2 rounded-lg border border-border bg-background text-sm">
                                    {viewMode === "preview" ? expandedPreview?.subject : expandedTemplate?.subject}
                                  </div>
                                </div>
                              )}
                              {/* Full body */}
                              <div className="mb-3">
                                <label className="block text-[10px] font-semibold text-muted uppercase tracking-wider mb-1">Full Message</label>
                                <div className="px-3 py-3 rounded-lg border border-border bg-background text-sm whitespace-pre-wrap leading-relaxed max-h-[40vh] overflow-y-auto">
                                  {viewMode === "preview" ? (expandedPreview?.body || expandedTemplate?.body) : expandedTemplate?.body}
                                </div>
                              </div>
                              {/* Placeholders (raw mode) */}
                              {viewMode === "raw" && expandedTemplate?.placeholders && expandedTemplate.placeholders.length > 0 && (
                                <div className="mb-3">
                                  <label className="block text-[10px] font-semibold text-muted uppercase tracking-wider mb-1">Placeholders</label>
                                  <div className="flex flex-wrap gap-1.5">
                                    {expandedTemplate.placeholders.map((p) => (
                                      <span key={p} className="px-2 py-0.5 rounded-full text-[10px] font-mono bg-primary/5 text-primary border border-primary/10">
                                        {`{${p}}`}
                                      </span>
                                    ))}
                                  </div>
                                </div>
                              )}
                              {/* Template info */}
                              <div className="flex flex-wrap gap-3 mb-3 text-[10px] text-muted">
                                <span>Channel: <span className="text-foreground">{expandedTemplate?.channel || g.channel}</span></span>
                                <span>Category: <span className="text-foreground">{expandedTemplate?.category || g.category}</span></span>
                                {expandedPreview?.companyName && (
                                  <span>Preview for: <span className="text-foreground">{expandedPreview.companyName}</span></span>
                                )}
                              </div>
                              {/* Actions */}
                              <div className="flex gap-2">
                                <button onClick={() => onSelectTemplate(t.id)}
                                  className="px-4 py-2 rounded-full text-xs font-medium bg-zinc-500/10 text-zinc-300 hover:bg-zinc-500/20 border border-zinc-500/20 transition-all">
                                  Open in Modal
                                </button>
                                {expandedPreview && (
                                  <button onClick={() => onUseTemplate(expandedPreview)}
                                    className="px-4 py-2 rounded-full text-xs font-medium bg-primary/10 text-primary hover:bg-primary/20 border border-primary/20 transition-all">
                                    Use This Template
                                  </button>
                                )}
                              </div>
                            </>
                          )}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
// ─── Template Suggestions Panel ──────────────────────────────────────────────
function TemplateSuggestionsPanel({ prospectId, onLogOutreach, onViewTemplate }: {
  prospectId: number;
  onLogOutreach: (suggestion: TemplateSuggestion) => void;
  onViewTemplate: (templateId: string) => void;
}) {
  const [suggestions, setSuggestions] = useState<TemplateSuggestion[]>([]);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    setLoading(true);
    getTemplateSuggestions(prospectId)
      .then(setSuggestions)
      .catch(() => setSuggestions([]))
      .finally(() => setLoading(false));
  }, [prospectId]);
  if (loading) return <p className="text-xs text-muted py-3">Loading suggestions...</p>;
  if (suggestions.length === 0) return <p className="text-xs text-muted py-3">No more templates to suggest. All have been used.</p>;
  const byChannel: Record<string, TemplateSuggestion[]> = {};
  for (const s of suggestions) {
    if (!byChannel[s.channel]) byChannel[s.channel] = [];
    byChannel[s.channel].push(s);
  }
  return (
    <div className="space-y-4">
      {Object.entries(byChannel).map(([channel, items]) => (
        <div key={channel}>
          <h4 className="text-xs font-semibold text-muted uppercase tracking-wider mb-2">{channel}</h4>
          <div className="space-y-2">
            {items.map((s, i) => (
              <div key={i} className="flex items-start gap-3 p-3 rounded-xl border border-border/50 hover:border-border bg-background/50 group">
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium truncate">{s.templateName}</p>
                  <p className="text-xs text-muted mt-0.5">{s.reason}</p>
                  <span className="inline-block mt-1 text-[10px] text-muted bg-surface-lighter px-2 py-0.5 rounded-full">{s.category}</span>
                </div>
                <div className="flex gap-1.5 shrink-0 opacity-0 group-hover:opacity-100 transition-all">
                  <button
                    onClick={() => onViewTemplate(s.templateId)}
                    className="px-3 py-1.5 rounded-full text-xs font-medium bg-zinc-500/10 text-zinc-300 hover:bg-zinc-500/20 border border-zinc-500/20"
                  >
                    View
                  </button>
                  <button
                    onClick={() => onLogOutreach(s)}
                    className="px-3 py-1.5 rounded-full text-xs font-medium bg-primary/10 text-primary hover:bg-primary/20 border border-primary/20"
                  >
                    Log Send
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
// ─── Log Outreach Modal ──────────────────────────────────────────────────────
function LogOutreachModal({ prospectId, prefill, onClose, onLogged }: {
  prospectId: number;
  prefill?: { channel?: string; category?: string; templateName?: string; subject?: string } | null;
  onClose: () => void;
  onLogged: () => void;
}) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  // Map prefill channel string to integer
  function channelStringToInt(ch?: string): number {
    if (!ch) return 0;
    const map: Record<string, number> = { Email: 0, LinkedIn: 1, "LinkedIn InMail": 2, Phone: 3 };
    return map[ch] ?? 0;
  }
  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setError("");
    const fd = new FormData(e.currentTarget);
    try {
      await logOutreach(prospectId, {
        channel: parseInt(fd.get("channel") as string),
        templateCategory: (fd.get("templateCategory") as string) || undefined,
        templateName: (fd.get("templateName") as string) || undefined,
        subject: (fd.get("subject") as string) || undefined,
        notes: (fd.get("notes") as string) || undefined,
      });
      onLogged();
      onClose();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to log outreach");
    } finally {
      setLoading(false);
    }
  }
  const inputCls = "w-full bg-background border border-border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-primary";
  return (
    <div className="fixed inset-0 z-[210] flex items-center justify-center bg-black/60 backdrop-blur-sm px-4" onClick={onClose}>
      <div className="bg-surface border border-border rounded-2xl p-6 w-full max-w-md" onClick={(e) => e.stopPropagation()}>
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-lg font-bold">Log Outreach</h2>
          <button onClick={onClose} className="text-muted hover:text-foreground text-xl">&times;</button>
        </div>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs text-muted mb-1">Channel *</label>
            <select name="channel" defaultValue={channelStringToInt(prefill?.channel)} className={inputCls}>
              {OUTREACH_CHANNELS.map((s, i) => <option key={i} value={i}>{s}</option>)}
            </select>
          </div>
          <div>
            <label className="block text-xs text-muted mb-1">Template Category</label>
            <input name="templateCategory" defaultValue={prefill?.category || ""} className={inputCls} placeholder="e.g. Website Status, Service Type" />
          </div>
          <div>
            <label className="block text-xs text-muted mb-1">Template Used</label>
            <input name="templateName" defaultValue={prefill?.templateName || ""} className={inputCls} placeholder="e.g. Email #1: No Website" />
          </div>
          <div>
            <label className="block text-xs text-muted mb-1">Subject Line</label>
            <input name="subject" defaultValue={prefill?.subject || ""} className={inputCls} placeholder="e.g. You're invisible on Google" />
          </div>
          <div>
            <label className="block text-xs text-muted mb-1">Notes</label>
            <textarea name="notes" rows={2} className={inputCls + " resize-y"} />
          </div>
          {error && <p className="text-accent text-sm">{error}</p>}
          <div className="flex gap-3 pt-2">
            <button type="button" onClick={onClose} className="flex-1 px-4 py-2.5 rounded-full border border-border text-sm text-muted hover:text-foreground transition-colors">Cancel</button>
            <button type="submit" disabled={loading} className="flex-1 bg-primary hover:bg-primary-dark disabled:opacity-50 text-white px-4 py-2.5 rounded-full text-sm font-medium transition-all">
              {loading ? "Logging..." : "Log Outreach"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
// ─── Prospect Detail Panel ───────────────────────────────────────────────────
function ProspectDetail({ prospect, onClose, onUpdated }: {
  prospect: Prospect;
  onClose: () => void;
  onUpdated: () => void;
}) {
  const [full, setFull] = useState<Prospect>(prospect);
  const [tab, setTab] = useState<"suggestions" | "cadence" | "browse" | "details" | "history">("suggestions");
  const [cadenceSteps, setCadenceSteps] = useState<FollowUpStep[]>([]);
  const [cadenceLoading, setCadenceLoading] = useState(false);
  const [status, setStatus] = useState(prospect.status);
  const [notes, setNotes] = useState(prospect.notes || "");
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [showLogOutreach, setShowLogOutreach] = useState(false);
  const [outreachPrefill, setOutreachPrefill] = useState<{ channel?: string; category?: string; templateName?: string; subject?: string } | null>(null);
  const [previewTemplateId, setPreviewTemplateId] = useState<string | null>(null);
  const [converting, setConverting] = useState(false);
  const refresh = useCallback(async () => {
    try {
      const data = await getProspect(prospect.id);
      setFull(data);
    } catch { /* ignore */ }
  }, [prospect.id]);
  useEffect(() => { refresh(); }, [refresh]);
  const loadCadence = useCallback(async () => {
    setCadenceLoading(true);
    try {
      const steps = await getProspectSequence(prospect.id);
      setCadenceSteps(steps);
    } catch { setCadenceSteps([]); }
    finally { setCadenceLoading(false); }
  }, [prospect.id]);
  useEffect(() => { if (tab === "cadence") loadCadence(); }, [tab, loadCadence]);
  async function handleSave() {
    setSaving(true);
    try {
      await updateProspect(prospect.id, { status, notes: notes || undefined });
      onUpdated();
      onClose();
    } catch {
      alert("Failed to update prospect");
    } finally {
      setSaving(false);
    }
  }
  async function handleDelete() {
    setDeleting(true);
    try {
      await deleteProspect(prospect.id);
      onUpdated();
      onClose();
    } catch {
      alert("Failed to delete prospect");
    } finally {
      setDeleting(false);
    }
  }
  async function handleResponseUpdate(activityId: number, responseStatus: number) {
    try {
      await updateOutreach(activityId, { responseStatus });
      refresh();
      onUpdated();
    } catch { /* ignore */ }
  }
  function handleUseTemplate(preview: TemplatePreview) {
    setPreviewTemplateId(null);
    setOutreachPrefill({
      channel: preview.channel,
      templateName: preview.templateName,
      subject: preview.subject || undefined,
    });
    setShowLogOutreach(true);
  }
  async function handleConvertToOnboarding() {
    setConverting(true);
    try {
      const payload: Parameters<typeof submitOnboarding>[0] = {
        prospectId: full.id,
        contactName: full.name,
        contactEmail: full.email ?? "",
        businessName: full.companyName,
        services: serviceTypeLabel(full.serviceType),
        serviceCities: full.city || "TBD",
      };
      if (full.email) payload.contactEmail = full.email;
      if (full.phone) payload.contactPhone = full.phone;
      if (full.websiteUrl) payload.existingWebsiteUrl = full.websiteUrl;
      await submitOnboarding(payload);
      alert("Client onboarding created successfully!");
      onUpdated();
      onClose();
    } catch (err) {
      alert(err instanceof Error ? err.message : "Failed to create onboarding");
    } finally {
      setConverting(false);
    }
  }

  const overdue = full.nextFollowUpAt && new Date(full.nextFollowUpAt) <= new Date();
  return (
    <>
      <div className="fixed inset-0 z-[200] flex items-center justify-center bg-black/60 backdrop-blur-sm px-4" onClick={onClose}>
        <div className="bg-surface border border-border rounded-2xl p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
          {/* Header */}
          <div className="flex items-center justify-between mb-2">
            <div>
              <h2 className="text-lg font-bold">{full.companyName}</h2>
              <p className="text-sm text-muted">{full.name}</p>
            </div>
            <button onClick={onClose} className="text-muted hover:text-foreground text-xl">&times;</button>
          </div>
          {/* Badges */}
          <div className="flex flex-wrap gap-2 mb-5">
            <span className={`text-xs px-2.5 py-0.5 rounded-full ${PROSPECT_STATUS_COLORS[full.status] || ""}`}>
              {prospectStatusLabel(full.status)}
            </span>
            <span className="text-xs px-2.5 py-0.5 rounded-full bg-surface-lighter text-muted">
              {websiteStatusLabel(full.websiteStatus)}
            </span>
            <span className="text-xs px-2.5 py-0.5 rounded-full bg-surface-lighter text-muted">
              {serviceTypeLabel(full.serviceType)}
            </span>
            <span className="text-xs px-2.5 py-0.5 rounded-full bg-surface-lighter text-muted">
              Stage {full.outreachStage}
            </span>
            {overdue && (
              <span className="text-xs px-2.5 py-0.5 rounded-full bg-accent/10 text-accent">
                Follow-up Due
              </span>
            )}
          </div>
          {/* Tabs */}
          <div className="flex gap-1 mb-5 border-b border-border overflow-x-auto">
            {(["suggestions", "cadence", "browse", "details", "history"] as const).map((t) => (
              <button key={t} onClick={() => setTab(t)}
                className={`px-4 py-2 text-sm font-medium border-b-2 transition-colors whitespace-nowrap ${
                  tab === t ? "border-primary text-foreground" : "border-transparent text-muted hover:text-foreground"
                }`}>
                {t === "suggestions" ? "Suggested" : t === "cadence" ? "Cadence" : t === "browse" ? "All Templates" : t === "details" ? "Details" : `History (${full.outreachActivities?.length || 0})`}
              </button>
            ))}
          </div>
          {/* Suggested templates tab */}
          {tab === "suggestions" && (
            <div>
              <div className="flex items-center justify-between mb-4">
                <p className="text-xs text-muted">Suggested templates based on audit data</p>
                <button
                  onClick={() => { setOutreachPrefill(null); setShowLogOutreach(true); }}
                  className="px-3 py-1.5 rounded-full text-xs font-medium bg-primary/10 text-primary hover:bg-primary/20 border border-primary/20 transition-all"
                >
                  + Log Custom
                </button>
              </div>
              <TemplateSuggestionsPanel
                prospectId={prospect.id}
                onLogOutreach={(s) => {
                  setOutreachPrefill({ channel: s.channel, category: s.category, templateName: s.templateName });
                  setShowLogOutreach(true);
                }}
                onViewTemplate={(templateId) => setPreviewTemplateId(templateId)}
              />
            </div>
          )}
          {/* Cadence tab — multi-channel sequence timeline */}
          {tab === "cadence" && (
            <div>
              {cadenceLoading ? (
                <p className="text-sm text-muted text-center py-8">Loading cadence...</p>
              ) : cadenceSteps.length === 0 ? (
                <div className="text-center py-8">
                  <p className="text-sm text-muted mb-3">No sequence created yet.</p>
                  <p className="text-xs text-muted/70 mb-4">Log your first outreach or start a sequence manually.</p>
                  <div className="flex gap-2 justify-center">
                    <button
                      onClick={async () => {
                        try {
                          await createProspectSequence(prospect.id, 1); // Start with LinkedIn
                          loadCadence();
                          refresh();
                          onUpdated();
                        } catch (err) { alert(err instanceof Error ? err.message : "Failed"); }
                      }}
                      className="px-4 py-2 rounded-full text-xs font-medium bg-sky-500/10 text-sky-400 hover:bg-sky-500/20 border border-sky-500/20 transition-all"
                    >Start with LinkedIn</button>
                    <button
                      onClick={async () => {
                        try {
                          await createProspectSequence(prospect.id, 0); // Start with Email
                          loadCadence();
                          refresh();
                          onUpdated();
                        } catch (err) { alert(err instanceof Error ? err.message : "Failed"); }
                      }}
                      className="px-4 py-2 rounded-full text-xs font-medium bg-blue-500/10 text-blue-400 hover:bg-blue-500/20 border border-blue-500/20 transition-all"
                    >Start with Email</button>
                  </div>
                </div>
              ) : (
                <div>
                  {/* Cadence header */}
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <p className="text-xs text-muted">
                        {cadenceSteps.filter(s => s.status === 2).length}/{cadenceSteps.length} steps completed
                      </p>
                      {/* Progress bar */}
                      <div className="w-48 h-1.5 rounded-full bg-border mt-1.5 overflow-hidden">
                        <div
                          className="h-full rounded-full bg-primary transition-all"
                          style={{ width: `${(cadenceSteps.filter(s => s.status === 2).length / cadenceSteps.length) * 100}%` }}
                        />
                      </div>
                    </div>
                    <button
                      onClick={async () => {
                        if (!confirm("Cancel all remaining steps in this sequence?")) return;
                        try {
                          await cancelProspectSequence(prospect.id);
                          loadCadence();
                          refresh();
                          onUpdated();
                        } catch { alert("Failed to cancel"); }
                      }}
                      className="text-xs text-red-400/60 hover:text-red-400 transition-colors"
                    >Cancel Sequence</button>
                  </div>
                  {/* Timeline */}
                  <div className="relative">
                    {/* Vertical line */}
                    <div className="absolute left-[15px] top-2 bottom-2 w-px bg-border" />
                    <div className="space-y-0.5">
                      {cadenceSteps.map((step, idx) => {
                        const isCompleted = step.status === 2;
                        const isSkipped = step.status === 3;
                        const isCancelled = step.status === 4;
                        const isActive = step.status === 0 || step.status === 1;
                        const isOverdue = step.isOverdue;
                        const isDone = isCompleted || isSkipped || isCancelled;
                        const date = new Date(step.scheduledDate);
                        const chColors: Record<number, string> = {
                          0: "border-blue-400 bg-blue-400",    // Email
                          1: "border-sky-400 bg-sky-400",      // LinkedIn
                          2: "border-indigo-400 bg-indigo-400", // LI InMail
                          3: "border-emerald-400 bg-emerald-400", // Phone
                        };
                        const chBadge: Record<number, string> = {
                          0: "bg-blue-500/10 text-blue-400",
                          1: "bg-sky-500/10 text-sky-400",
                          2: "bg-indigo-500/10 text-indigo-400",
                          3: "bg-emerald-500/10 text-emerald-400",
                        };
                        return (
                          <div key={step.id} className="relative flex items-start gap-3 py-2.5 pl-0">
                            {/* Dot */}
                            <div className={`relative z-10 mt-0.5 w-[30px] h-[30px] rounded-full border-2 flex items-center justify-center shrink-0 ${
                              isCompleted ? `${chColors[step.channel] || "border-emerald-400 bg-emerald-400"} text-white`
                              : isSkipped ? "border-zinc-500 bg-zinc-500/20 text-zinc-500"
                              : isCancelled ? "border-red-500/30 bg-red-500/10 text-red-500/50"
                              : isOverdue ? "border-red-400 bg-red-400/10 text-red-400"
                              : `${(chColors[step.channel] || "border-blue-400 bg-blue-400").replace("bg-", "bg-").replace(/bg-[^ ]+/, "bg-background")} text-foreground`
                            }`}>
                              {isCompleted ? (
                                <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></svg>
                              ) : isSkipped ? (
                                <span className="text-[10px] font-bold">—</span>
                              ) : isCancelled ? (
                                <span className="text-[10px] font-bold">&times;</span>
                              ) : (
                                <span className="text-[10px] font-bold">{step.stepNumber}</span>
                              )}
                            </div>
                            {/* Content */}
                            <div className={`flex-1 min-w-0 ${isDone && !isCompleted ? "opacity-50" : ""}`}>
                              <div className="flex items-center gap-2 mb-0.5">
                                <span className={`text-[10px] px-2 py-0.5 rounded-full ${chBadge[step.channel] || ""}`}>
                                  {channelLabel(step.channel)}
                                </span>
                                <span className="text-sm font-medium">{step.stepLabel || `Step ${step.stepNumber}`}</span>
                                {isOverdue && <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-red-500/10 text-red-400 font-medium">OVERDUE</span>}
                                {isCompleted && step.completedAt && (
                                  <span className="text-[10px] text-emerald-400">Done {new Date(step.completedAt).toLocaleDateString()}</span>
                                )}
                                {isSkipped && <span className="text-[10px] text-zinc-500">Skipped</span>}
                                {isCancelled && <span className="text-[10px] text-red-400/50">Cancelled</span>}
                              </div>
                              <div className="flex items-center gap-2 text-[10px] text-muted">
                                <span>{date.toLocaleDateString("en-US", { weekday: "short", month: "short", day: "numeric" })}</span>
                                {step.suggestedTemplateName && (
                                  <span className="truncate">&middot; {step.suggestedTemplateName}</span>
                                )}
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}
          {/* All Templates tab */}
          {tab === "browse" && (
            <TemplateBrowserPanel
              prospectId={prospect.id}
              onSelectTemplate={(templateId) => setPreviewTemplateId(templateId)}
              onUseTemplate={handleUseTemplate}
            />
          )}
          {/* Details tab */}
          {tab === "details" && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-3 text-sm">
                <div>
                  <span className="text-muted block text-xs">Email</span>
                  {full.email ? <a href={`mailto:${full.email}`} className="text-primary hover:underline">{full.email}</a> : <span className="text-muted">--</span>}
                </div>
                <div>
                  <span className="text-muted block text-xs">Phone</span>
                  {full.phone ? <a href={`tel:${full.phone}`} className="text-primary hover:underline">{full.phone}</a> : <span className="text-muted">--</span>}
                </div>
                <div>
                  <span className="text-muted block text-xs">City</span>
                  <span>{full.city || "--"}</span>
                </div>
                <div>
                  <span className="text-muted block text-xs">Source</span>
                  <span>{full.source || "--"}</span>
                </div>
                <div>
                  <span className="text-muted block text-xs">Website</span>
                  {full.websiteUrl ? <a href={full.websiteUrl} target="_blank" rel="noopener noreferrer" className="text-primary hover:underline truncate block">{full.websiteUrl}</a> : <span className="text-muted">No website</span>}
                </div>
                <div>
                  <span className="text-muted block text-xs">Google Ranking</span>
                  <span>{full.googleRankingPage ? `Page ${full.googleRankingPage}` : "Not found"}</span>
                </div>
                <div>
                  <span className="text-muted block text-xs">Mobile Friendly</span>
                  <span>{full.isMobileFriendly ? "Yes" : "No"}</span>
                </div>
                <div>
                  <span className="text-muted block text-xs">Lead Capture</span>
                  <span>{full.hasLeadCapture ? "Yes" : "No"}</span>
                </div>
                <div>
                  <span className="text-muted block text-xs">Current Lead Gen</span>
                  <span>{leadGenLabel(full.currentLeadGen)}</span>
                </div>
                <div>
                  <span className="text-muted block text-xs">Last Contacted</span>
                  <span>{full.lastContactedAt ? new Date(full.lastContactedAt).toLocaleDateString() : "Never"}</span>
                </div>
              </div>
              <hr className="border-border" />
              {/* Status selector */}
              <div>
                <label className="block text-xs text-muted mb-2">Status</label>
                <div className="flex flex-wrap gap-2">
                  {PROSPECT_STATUSES.map((s, i) => (
                    <button key={i} type="button" onClick={() => setStatus(i)}
                      className={`text-xs px-3 py-1.5 rounded-full border transition-all ${
                        status === i
                          ? (PROSPECT_STATUS_COLORS[i] || "") + " border-current"
                          : "border-border text-muted hover:text-foreground"
                      }`}>
                      {s}
                    </button>
                  ))}
                </div>
              </div>
              <div>
                <label className="block text-xs text-muted mb-1">Notes</label>
                <textarea value={notes} onChange={(e) => setNotes(e.target.value)} rows={3}
                  className="w-full bg-background border border-border rounded-xl px-3 py-2 text-sm resize-y focus:outline-none focus:ring-1 focus:ring-primary" />
              </div>
              {/* Convert to Onboarding — only when Converted */}
              {status === 3 && (
                <div className="bg-green-500/5 border border-green-500/20 rounded-xl p-4">
                  <p className="text-xs text-green-400 mb-2">This prospect is converted. Ready to start onboarding?</p>
                  <button
                    type="button"
                    onClick={handleConvertToOnboarding}
                    disabled={converting}
                    className="w-full bg-green-600 hover:bg-green-700 disabled:opacity-50 text-white px-4 py-2.5 rounded-full text-sm font-medium transition-all duration-200"
                  >
                    {converting ? "Creating Onboarding..." : "Convert to Client Onboarding"}
                  </button>
                </div>
              )}

              <div className="flex gap-3 pt-2">
                <button onClick={handleSave} disabled={saving}
                  className="flex-1 bg-primary hover:bg-primary-dark disabled:opacity-50 text-white px-4 py-2.5 rounded-full text-sm font-medium transition-all">
                  {saving ? "Saving..." : "Save Changes"}
                </button>
                {!confirmDelete ? (
                  <button onClick={() => setConfirmDelete(true)}
                    className="px-4 py-2.5 rounded-full border border-accent/30 text-accent text-sm hover:bg-accent/10 transition-all">
                    Delete
                  </button>
                ) : (
                  <button onClick={handleDelete} disabled={deleting}
                    className="px-4 py-2.5 rounded-full bg-accent/20 border border-accent/30 text-accent text-sm font-medium transition-all">
                    {deleting ? "Deleting..." : "Confirm Delete"}
                  </button>
                )}
              </div>
            </div>
          )}
          {/* History tab */}
          {tab === "history" && (
            <div className="space-y-3">
              {(full.outreachActivities?.length || 0) === 0 ? (
                <p className="text-sm text-muted text-center py-6">No outreach logged yet.</p>
              ) : (
                full.outreachActivities.map((a) => (
                  <div key={a.id} className="p-3 rounded-xl border border-border/50 bg-background/50">
                    <div className="flex items-start justify-between gap-3">
                      <div className="min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <span className={`text-[10px] px-2 py-0.5 rounded-full ${CHANNEL_COLORS[a.channel] || ""}`}>
                            {channelLabel(a.channel)}
                          </span>
                          <span className={`text-xs ${RESPONSE_COLORS[a.responseStatus] || ""}`}>
                            {responseStatusLabel(a.responseStatus)}
                          </span>
                        </div>
                        {a.templateName && <p className="text-sm font-medium">{a.templateName}</p>}
                        {a.subject && <p className="text-xs text-muted">{a.subject}</p>}
                        {a.notes && <p className="text-xs text-muted mt-1">{a.notes}</p>}
                        <p className="text-[10px] text-muted mt-1">
                          Sent {new Date(a.sentAt).toLocaleDateString()}
                          {a.respondedAt && ` · Responded ${new Date(a.respondedAt).toLocaleDateString()}`}
                        </p>
                      </div>
                      {a.responseStatus === 0 && (
                        <div className="flex gap-1 shrink-0">
                          <button onClick={() => handleResponseUpdate(a.id, 1)} className="px-2 py-1 rounded text-[10px] text-secondary hover:bg-secondary/10 transition-colors">+</button>
                          <button onClick={() => handleResponseUpdate(a.id, 2)} className="px-2 py-1 rounded text-[10px] text-accent hover:bg-accent/10 transition-colors">-</button>
                          <button onClick={() => handleResponseUpdate(a.id, 3)} className="px-2 py-1 rounded text-[10px] text-yellow-400 hover:bg-yellow-500/10 transition-colors">?</button>
                        </div>
                      )}
                    </div>
                  </div>
                ))
              )}
            </div>
          )}
        </div>
      </div>
      {/* Template Preview overlay */}
      {previewTemplateId && (
        <TemplatePreviewModal
          prospectId={prospect.id}
          templateId={previewTemplateId}
          onClose={() => setPreviewTemplateId(null)}
          onUseTemplate={handleUseTemplate}
        />
      )}
      {showLogOutreach && (
        <LogOutreachModal
          prospectId={prospect.id}
          prefill={outreachPrefill}
          onClose={() => { setShowLogOutreach(false); setOutreachPrefill(null); }}
          onLogged={() => { refresh(); onUpdated(); }}
        />
      )}
    </>
  );
}
// ─── Stats Panel ─────────────────────────────────────────────────────────────
function StatsPanel({ stats }: { stats: ProspectStats | null }) {
  if (!stats) return null;
  return (
    <div className="space-y-6 mb-8">
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
        <div className="bg-surface rounded-xl border border-border p-4">
          <p className="text-2xl font-bold">{stats.totalProspects}</p>
          <p className="text-xs text-muted">Total Prospects</p>
        </div>
        <div className="bg-surface rounded-xl border border-border p-4">
          <p className="text-2xl font-bold">{stats.totalOutreach}</p>
          <p className="text-xs text-muted">Outreach Sent</p>
        </div>
        <div className="bg-surface rounded-xl border border-border p-4">
          <p className="text-2xl font-bold">{stats.responseRate}%</p>
          <p className="text-xs text-muted">Response Rate</p>
        </div>
        <div className="bg-surface rounded-xl border border-border p-4">
          <p className="text-2xl font-bold">{stats.positiveRate}%</p>
          <p className="text-xs text-muted">Positive Rate</p>
        </div>
        <div className="bg-surface rounded-xl border border-border p-4">
          <p className="text-2xl font-bold text-yellow-400">{stats.needsFollowUp}</p>
          <p className="text-xs text-muted">Needs Follow-up</p>
        </div>
        <div className="bg-surface rounded-xl border border-border p-4">
          <p className="text-2xl font-bold text-secondary">{stats.byStatus?.["3"] || 0}</p>
          <p className="text-xs text-muted">Converted</p>
        </div>
      </div>
      {stats.topTemplates.length > 0 && (
        <div className="bg-surface rounded-xl border border-border p-5">
          <h3 className="text-sm font-semibold mb-3">Template Performance</h3>
          <div className="space-y-2">
            {stats.topTemplates.map((t, i) => (
              <div key={i} className="flex items-center gap-3 text-sm">
                <div className="flex-1 min-w-0 truncate text-muted-light">{t.template}</div>
                <div className="shrink-0 text-xs text-muted">{t.sent} sent</div>
                <div className="shrink-0 text-xs text-muted">{t.responses} replies</div>
                <div className={`shrink-0 text-xs font-medium ${t.responseRate > 20 ? "text-secondary" : t.responseRate > 10 ? "text-yellow-400" : "text-muted"}`}>
                  {t.responseRate}%
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
// ─── Main Prospects Page ─────────────────────────────────────────────────────
export default function ProspectsPage() {
  const [prospects, setProspects] = useState<Prospect[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [statusFilter, setStatusFilter] = useState<number | undefined>();
  const [followUpFilter, setFollowUpFilter] = useState(false);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState<Prospect | null>(null);
  const [showCreate, setShowCreate] = useState(false);
  const [showStats, setShowStats] = useState(false);
  const [stats, setStats] = useState<ProspectStats | null>(null);
  const load = useCallback(async () => {
    setLoading(true);
    try {
      const data = await getProspects(page, 10, {
        status: statusFilter,
        needsFollowUp: followUpFilter || undefined,
        search: search || undefined,
      });
      setProspects(data.items);
      setTotal(data.total);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, [page, statusFilter, followUpFilter, search]);
  useEffect(() => { load(); }, [load]);
  useEffect(() => {
    if (showStats) getProspectStats().then(setStats).catch(() => {});
  }, [showStats]);
  async function handleExport() {
    try {
      const blob = await exportProspects(statusFilter);
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = "prospects.csv";
      a.click();
      URL.revokeObjectURL(url);
    } catch {
      alert("Failed to export");
    }
  }
  const totalPages = Math.ceil(total / 10);
  return (
    <div className="p-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold">Prospects</h1>
          <p className="text-sm text-muted mt-1">{total} prospect{total !== 1 ? "s" : ""} in pipeline</p>
        </div>
        <div className="flex flex-wrap gap-2">
          <button onClick={() => setShowStats(!showStats)}
            className={`text-sm px-4 py-2 rounded-full border transition-all ${
              showStats ? "border-primary text-primary bg-primary/10" : "border-border text-muted hover:text-foreground"
            }`}>
            {showStats ? "Hide Stats" : "Stats"}
          </button>
          <button onClick={handleExport}
            className="text-sm px-4 py-2 rounded-full border border-border text-muted hover:text-foreground transition-all">
            Export CSV
          </button>
          <button onClick={() => setShowCreate(true)}
            className="bg-primary hover:bg-primary-dark text-white px-5 py-2 rounded-full text-sm font-medium transition-all">
            + New Prospect
          </button>
        </div>
      </div>
      {/* Stats */}
      {showStats && <StatsPanel stats={stats} />}
      {/* Search */}
      <div className="mb-4">
        <input
          type="text"
          placeholder="Search by company, name, or city..."
          value={search}
          onChange={(e) => { setSearch(e.target.value); setPage(1); }}
          className="w-full sm:w-80 bg-surface border border-border rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-1 focus:ring-primary"
        />
      </div>
      {/* Filters */}
      <div className="flex flex-wrap gap-2 mb-6">
        <button
          onClick={() => { setStatusFilter(undefined); setFollowUpFilter(false); setPage(1); }}
          className={`text-xs px-3 py-1.5 rounded-full border transition-all ${
            statusFilter === undefined && !followUpFilter
              ? "border-primary text-primary bg-primary/10"
              : "border-border text-muted hover:text-foreground"
          }`}>
          All
        </button>
        <button
          onClick={() => { setFollowUpFilter(!followUpFilter); setStatusFilter(undefined); setPage(1); }}
          className={`text-xs px-3 py-1.5 rounded-full border transition-all ${
            followUpFilter
              ? "border-accent text-accent bg-accent/10"
              : "border-border text-muted hover:text-foreground"
          }`}>
          Needs Follow-up
        </button>
        {PROSPECT_STATUSES.map((s, i) => (
          <button key={i}
            onClick={() => { setStatusFilter(i); setFollowUpFilter(false); setPage(1); }}
            className={`text-xs px-3 py-1.5 rounded-full border transition-all ${
              statusFilter === i
                ? (PROSPECT_STATUS_COLORS[i] || "") + " border-current"
                : "border-border text-muted hover:text-foreground"
            }`}>
            {s}
          </button>
        ))}
      </div>
      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-border text-left">
              <th className="py-3 pr-4 text-muted font-medium">Company</th>
              <th className="py-3 pr-4 text-muted font-medium">Contact</th>
              <th className="py-3 pr-4 text-muted font-medium hidden lg:table-cell">Website</th>
              <th className="py-3 pr-4 text-muted font-medium hidden lg:table-cell">Service</th>
              <th className="py-3 pr-4 text-muted font-medium">Status</th>
              <th className="py-3 pr-4 text-muted font-medium hidden md:table-cell">Stage</th>
              <th className="py-3 text-muted font-medium hidden md:table-cell">Follow-up</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {loading ? (
              <tr><td colSpan={7} className="py-8 text-center text-muted">Loading...</td></tr>
            ) : prospects.length === 0 ? (
              <tr>
                <td colSpan={7} className="py-8 text-center text-muted">
                  No prospects found.
                  <button onClick={() => setShowCreate(true)} className="ml-2 text-primary hover:underline">Add your first prospect</button>
                </td>
              </tr>
            ) : (
              prospects.map((p) => {
                const overdue = p.nextFollowUpAt && new Date(p.nextFollowUpAt) <= new Date();
                return (
                  <tr key={p.id} onClick={() => setSelected(p)}
                    className={`cursor-pointer transition-colors ${overdue ? "hover:bg-accent/[0.03]" : "hover:bg-white/[0.02]"}`}>
                    <td className="py-3 pr-4">
                      <div className="font-medium">{p.companyName}</div>
                      <div className="text-xs text-muted">{p.city || "--"}</div>
                    </td>
                    <td className="py-3 pr-4">
                      <div>{p.name}</div>
                      <div className="text-xs text-muted">{p.email || p.phone || "--"}</div>
                    </td>
                    <td className="py-3 pr-4 text-muted text-xs hidden lg:table-cell">{websiteStatusLabel(p.websiteStatus)}</td>
                    <td className="py-3 pr-4 text-muted text-xs hidden lg:table-cell">{serviceTypeLabel(p.serviceType)}</td>
                    <td className="py-3 pr-4">
                      <span className={`text-xs px-2 py-0.5 rounded-full ${PROSPECT_STATUS_COLORS[p.status] || ""}`}>
                        {prospectStatusLabel(p.status)}
                      </span>
                    </td>
                    <td className="py-3 pr-4 text-muted text-xs hidden md:table-cell">
                      {p.outreachStage === 0 ? "--" : `Touch ${p.outreachStage}`}
                    </td>
                    <td className="py-3 text-xs hidden md:table-cell">
                      {p.nextFollowUpAt ? (
                        <span className={overdue ? "text-accent font-medium" : "text-muted"}>
                          {overdue ? "OVERDUE" : new Date(p.nextFollowUpAt).toLocaleDateString()}
                        </span>
                      ) : <span className="text-muted">--</span>}
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
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
      {/* Modals */}
      {showCreate && <CreateProspectModal onClose={() => setShowCreate(false)} onCreated={load} />}
      {selected && <ProspectDetail prospect={selected} onClose={() => setSelected(null)} onUpdated={load} />}
    </div>
  );
}