"use client";

import { useState, useEffect, useCallback } from "react";
import {
  getOnboardings,
  updateOnboarding,
  createDeliveryProject,
  ONBOARDING_STATUSES,
  type ClientOnboarding,
} from "@/lib/api";
import Link from "next/link";

type OnboardingStatus = (typeof ONBOARDING_STATUSES)[number];

const STATUS_COLORS: Record<OnboardingStatus, string> = {
  Submitted: "bg-blue-500/10 text-blue-400 border-blue-500/20",
  "In Review": "bg-yellow-500/10 text-yellow-400 border-yellow-500/20",
  "In Progress": "bg-purple-500/10 text-purple-400 border-purple-500/20",
  Completed: "bg-green-500/10 text-green-400 border-green-500/20",
};

const STYLE_LABELS: Record<string, string> = {
  "modern-clean": "Modern & Clean",
  "bold-professional": "Bold & Professional",
  "warm-approachable": "Warm & Approachable",
  "dark-premium": "Dark & Premium",
  "no-preference": "No Preference",
};

// ─── Onboarding Detail Modal ─────────────────────────────────────────────────
function OnboardingDetail({ item, onClose, onUpdated }: {
  item: ClientOnboarding;
  onClose: () => void;
  onUpdated: () => void;
}) {
  const [statusIdx, setStatusIdx] = useState(item.status);
  const [adminNotes, setAdminNotes] = useState(item.adminNotes || "");
  const [saving, setSaving] = useState(false);
  const [converting, setConverting] = useState(false);

  async function handleStartDelivery() {
    setConverting(true);
    try {
      await createDeliveryProject({
        clientName: item.contactName,
        businessName: item.businessName,
        contactEmail: item.contactEmail || undefined,
        contactPhone: item.contactPhone || undefined,
        onboardingId: item.id,
        notes: item.adminNotes || undefined,
      });
      alert("Delivery project created successfully!");
      onUpdated();
      onClose();
    } catch (err) {
      alert(err instanceof Error ? err.message : "Failed to create delivery project");
    } finally {
      setConverting(false);
    }
  }

  async function handleSave() {
    setSaving(true);
    try {
      await updateOnboarding(item.id, {
        status: statusIdx,
        adminNotes: adminNotes || undefined,
      });
      onUpdated();
      onClose();
    } catch {
      alert("Failed to update onboarding");
    } finally {
      setSaving(false);
    }
  }

  const photoUrls = item.photoFileUrls ? item.photoFileUrls.split(",").filter(Boolean) : [];
  const logoUrls = item.logoFileUrls ? item.logoFileUrls.split(",").filter(Boolean) : [];
  const statusLabel = ONBOARDING_STATUSES[item.status] || "Unknown";

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm px-4" onClick={onClose}>
      <div className="bg-surface border border-border rounded-2xl p-8 w-full max-w-2xl max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-lg font-bold">{item.businessName}</h2>
            <p className="text-sm text-muted">{item.contactName} &middot; Submitted {new Date(item.createdAt).toLocaleDateString()}</p>
          </div>
          <button onClick={onClose} className="text-muted hover:text-foreground text-xl">&times;</button>
        </div>

        <div className="space-y-6">
          {/* Cross-stage links */}
          {(item.leadId || item.prospectId) && (
            <div className="flex flex-wrap items-center gap-3">
              <span className="text-xs text-muted">Linked from:</span>
              {item.leadId && (
                <Link
                  href="/admin/leads"
                  className="text-xs text-primary hover:text-primary-light transition-colors"
                  onClick={(e) => e.stopPropagation()}
                >
                  Lead #{item.leadId}
                </Link>
              )}
              {item.prospectId && (
                <Link
                  href="/admin/prospects"
                  className="text-xs text-primary hover:text-primary-light transition-colors"
                  onClick={(e) => e.stopPropagation()}
                >
                  Prospect #{item.prospectId}
                </Link>
              )}
            </div>
          )}

          {/* Contact Info */}
          <div>
            <h3 className="text-xs font-medium text-muted uppercase tracking-wider mb-3">Contact</h3>
            <div className="grid grid-cols-2 gap-3 text-sm">
              <div>
                <span className="text-muted block text-xs">Email</span>
                <a href={`mailto:${item.contactEmail}`} className="text-primary hover:text-primary-light">{item.contactEmail}</a>
              </div>
              <div>
                <span className="text-muted block text-xs">Phone</span>
                {item.contactPhone ? (
                  <a href={`tel:${item.contactPhone}`} className="text-primary hover:text-primary-light">{item.contactPhone}</a>
                ) : <span className="text-muted">&mdash;</span>}
              </div>
            </div>
          </div>

          {/* Business Details */}
          {item.businessDescription && (
            <div>
              <h3 className="text-xs font-medium text-muted uppercase tracking-wider mb-2">Business Description</h3>
              <p className="text-sm text-foreground/80 whitespace-pre-wrap">{item.businessDescription}</p>
            </div>
          )}

          {/* Services & Areas */}
          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <h3 className="text-xs font-medium text-muted uppercase tracking-wider mb-2">Services</h3>
              <div className="bg-background rounded-lg p-3 text-sm whitespace-pre-wrap">{item.services}</div>
            </div>
            <div>
              <h3 className="text-xs font-medium text-muted uppercase tracking-wider mb-2">Service Areas</h3>
              <div className="bg-background rounded-lg p-3 text-sm whitespace-pre-wrap">{item.serviceCities}</div>
            </div>
          </div>

          {/* Online Presence */}
          <div>
            <h3 className="text-xs font-medium text-muted uppercase tracking-wider mb-3">Online Presence</h3>
            <div className="grid grid-cols-1 gap-2 text-sm">
              {item.googleBusinessUrl && (
                <div className="flex items-center gap-2">
                  <span className="text-muted text-xs w-32 shrink-0">Google Business:</span>
                  <a href={item.googleBusinessUrl} target="_blank" rel="noopener noreferrer" className="text-primary hover:text-primary-light truncate">{item.googleBusinessUrl}</a>
                </div>
              )}
              {item.existingWebsiteUrl && (
                <div className="flex items-center gap-2">
                  <span className="text-muted text-xs w-32 shrink-0">Current Website:</span>
                  <a href={item.existingWebsiteUrl} target="_blank" rel="noopener noreferrer" className="text-primary hover:text-primary-light truncate">{item.existingWebsiteUrl}</a>
                </div>
              )}
              {item.socialMediaUrls && (
                <div>
                  <span className="text-muted text-xs block mb-1">Social Media:</span>
                  <div className="bg-background rounded-lg p-3 text-sm whitespace-pre-wrap">{item.socialMediaUrls}</div>
                </div>
              )}
              {!item.googleBusinessUrl && !item.existingWebsiteUrl && !item.socialMediaUrls && (
                <p className="text-muted text-xs">No online presence info provided</p>
              )}
            </div>
          </div>

          {/* Preferences */}
          <div>
            <h3 className="text-xs font-medium text-muted uppercase tracking-wider mb-3">Design Preferences</h3>
            <div className="grid grid-cols-2 gap-3 text-sm">
              <div>
                <span className="text-muted block text-xs">Style</span>
                <span>{item.stylePreference ? (STYLE_LABELS[item.stylePreference] || item.stylePreference) : "No preference"}</span>
              </div>
              <div>
                <span className="text-muted block text-xs">Colors</span>
                <span>{item.preferredColors || "No preference"}</span>
              </div>
            </div>
            {item.specialRequests && (
              <div className="mt-3">
                <span className="text-muted block text-xs mb-1">Special Requests</span>
                <div className="bg-background rounded-lg p-3 text-sm whitespace-pre-wrap">{item.specialRequests}</div>
              </div>
            )}
          </div>

          {/* Files */}
          {(logoUrls.length > 0 || photoUrls.length > 0) && (
            <div>
              <h3 className="text-xs font-medium text-muted uppercase tracking-wider mb-3">Uploaded Files</h3>
              {logoUrls.length > 0 && (
                <div className="mb-3">
                  <span className="text-xs text-muted block mb-2">Logo ({logoUrls.length})</span>
                  <div className="flex gap-2 flex-wrap">
                    {logoUrls.map((url, i) => (
                      <a key={i} href={url} target="_blank" rel="noopener noreferrer"
                        className="w-20 h-20 bg-background rounded-lg border border-border overflow-hidden block">
                        <img src={url} alt="Logo" className="w-full h-full object-contain" />
                      </a>
                    ))}
                  </div>
                </div>
              )}
              {photoUrls.length > 0 && (
                <div>
                  <span className="text-xs text-muted block mb-2">Project Photos ({photoUrls.length})</span>
                  <div className="grid grid-cols-4 gap-2">
                    {photoUrls.map((url, i) => (
                      <a key={i} href={url} target="_blank" rel="noopener noreferrer"
                        className="aspect-square bg-background rounded-lg border border-border overflow-hidden block">
                        <img src={url} alt={`Project photo ${i + 1}`} className="w-full h-full object-cover" />
                      </a>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          <hr className="border-border" />

          {/* Editable Admin Fields */}
          <div>
            <label className="block text-xs font-medium text-muted mb-2">Status</label>
            <div className="flex flex-wrap gap-2">
              {ONBOARDING_STATUSES.map((s, i) => (
                <button
                  key={s}
                  type="button"
                  onClick={() => setStatusIdx(i)}
                  className={`px-3 py-1.5 rounded-full text-xs font-medium border transition-all duration-200 ${
                    statusIdx === i
                      ? STATUS_COLORS[s] + " ring-1 ring-current"
                      : "border-border text-muted hover:text-foreground"
                  }`}
                >
                  {s}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-xs font-medium text-muted mb-1">Admin Notes</label>
            <textarea
              value={adminNotes}
              onChange={(e) => setAdminNotes(e.target.value)}
              rows={3}
              className="w-full px-3 py-2 rounded-lg border border-border bg-background text-foreground text-sm resize-y focus:outline-none focus:ring-2 focus:ring-primary/50"
              placeholder="Internal notes about this project..."
            />
          </div>

          {/* Start Delivery — only when Completed */}
          {statusIdx === 3 && (
            <div className="bg-green-500/5 border border-green-500/20 rounded-xl p-4">
              <p className="text-xs text-green-400 mb-2">Onboarding is complete. Ready to start delivery?</p>
              <button
                type="button"
                onClick={handleStartDelivery}
                disabled={converting}
                className="w-full bg-green-600 hover:bg-green-700 disabled:opacity-50 text-white px-4 py-2.5 rounded-full text-sm font-medium transition-all duration-200"
              >
                {converting ? "Creating Project..." : "Start Delivery Project"}
              </button>
            </div>
          )}

          <div className="flex gap-3">
            <button type="button" onClick={onClose}
              className="flex-1 px-4 py-2.5 rounded-full border border-border text-sm text-muted hover:text-foreground transition-colors">
              Cancel
            </button>
            <button type="button" onClick={handleSave} disabled={saving}
              className="flex-1 bg-primary hover:bg-primary-dark disabled:opacity-50 text-white px-4 py-2.5 rounded-full text-sm font-medium transition-all duration-200">
              {saving ? "Saving..." : "Save Changes"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── Main Page ───────────────────────────────────────────────────────────────
export default function AdminOnboardingPage() {
  const [items, setItems] = useState<ClientOnboarding[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [pageSize] = useState(25);
  const [filterStatus, setFilterStatus] = useState<number | undefined>(undefined);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState<ClientOnboarding | null>(null);

  const fetchItems = useCallback(async () => {
    setLoading(true);
    try {
      const data = await getOnboardings(page, pageSize, filterStatus);
      setItems(data.items);
      setTotal(data.total);
    } catch {
      console.error("Failed to load onboarding data");
    } finally {
      setLoading(false);
    }
  }, [page, pageSize, filterStatus]);

  useEffect(() => {
    fetchItems();
  }, [fetchItems]);

  const totalPages = Math.ceil(total / pageSize);

  return (
    <div className="min-h-screen pt-24 pb-16 px-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-2xl font-bold">Client Onboarding</h1>
          <p className="text-sm text-muted mt-1">{total} submission{total !== 1 ? "s" : ""}</p>
        </div>

        {/* Status filter pills */}
        <div className="flex flex-wrap gap-2 mb-6">
          <button
            onClick={() => { setFilterStatus(undefined); setPage(1); }}
            className={`px-4 py-1.5 rounded-full text-xs font-medium border transition-all duration-200 ${
              filterStatus === undefined
                ? "bg-foreground/10 text-foreground border-foreground/20"
                : "border-border text-muted hover:text-foreground"
            }`}
          >
            All
          </button>
          {ONBOARDING_STATUSES.map((s, i) => (
            <button
              key={s}
              onClick={() => { setFilterStatus(i); setPage(1); }}
              className={`px-4 py-1.5 rounded-full text-xs font-medium border transition-all duration-200 ${
                filterStatus === i
                  ? STATUS_COLORS[s]
                  : "border-border text-muted hover:text-foreground"
              }`}
            >
              {s}
            </button>
          ))}
        </div>

        {/* Table */}
        <div className="bg-surface rounded-2xl border border-border overflow-hidden">
          {loading ? (
            <div className="p-12 text-center text-muted text-sm">Loading onboarding submissions...</div>
          ) : items.length === 0 ? (
            <div className="p-12 text-center">
              <p className="text-muted text-sm">No onboarding submissions yet.</p>
              <p className="text-muted/60 text-xs mt-2">Clients will appear here after they submit the intake form.</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-border text-left">
                    <th className="px-5 py-3 text-xs font-medium text-muted uppercase tracking-wider">Business</th>
                    <th className="px-5 py-3 text-xs font-medium text-muted uppercase tracking-wider hidden md:table-cell">Contact</th>
                    <th className="px-5 py-3 text-xs font-medium text-muted uppercase tracking-wider hidden lg:table-cell">Services</th>
                    <th className="px-5 py-3 text-xs font-medium text-muted uppercase tracking-wider hidden lg:table-cell">Areas</th>
                    <th className="px-5 py-3 text-xs font-medium text-muted uppercase tracking-wider">Status</th>
                    <th className="px-5 py-3 text-xs font-medium text-muted uppercase tracking-wider hidden sm:table-cell">Style</th>
                    <th className="px-5 py-3 text-xs font-medium text-muted uppercase tracking-wider hidden md:table-cell">Submitted</th>
                  </tr>
                </thead>
                <tbody>
                  {items.map((item) => {
                    const statusLabel = ONBOARDING_STATUSES[item.status] || "Unknown";
                    return (
                      <tr
                        key={item.id}
                        onClick={() => setSelected(item)}
                        className="border-b border-border/50 hover:bg-white/[0.02] cursor-pointer transition-colors duration-150"
                      >
                        <td className="px-5 py-4">
                          <div className="font-medium">{item.businessName}</div>
                          <div className="text-xs text-muted md:hidden">{item.contactName}</div>
                        </td>
                        <td className="px-5 py-4 hidden md:table-cell">
                          <div className="text-foreground">{item.contactName}</div>
                          <div className="text-xs text-muted">{item.contactEmail}</div>
                        </td>
                        <td className="px-5 py-4 text-muted hidden lg:table-cell">
                          <div className="max-w-[200px] truncate">{item.services.split("\n")[0]}</div>
                          {item.services.split("\n").length > 1 && (
                            <span className="text-xs text-muted/60">+{item.services.split("\n").length - 1} more</span>
                          )}
                        </td>
                        <td className="px-5 py-4 text-muted hidden lg:table-cell">
                          <div className="max-w-[150px] truncate">{item.serviceCities.split("\n")[0]}</div>
                        </td>
                        <td className="px-5 py-4">
                          <span className={`inline-block px-2.5 py-0.5 rounded-full text-xs font-medium border ${STATUS_COLORS[statusLabel as OnboardingStatus] || ""}`}>
                            {statusLabel}
                          </span>
                        </td>
                        <td className="px-5 py-4 text-muted hidden sm:table-cell text-xs">
                          {item.stylePreference ? (STYLE_LABELS[item.stylePreference] || item.stylePreference) : "—"}
                        </td>
                        <td className="px-5 py-4 text-muted hidden md:table-cell">
                          {new Date(item.createdAt).toLocaleDateString()}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex items-center justify-between px-5 py-3 border-t border-border">
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
      </div>

      {/* Detail Modal */}
      {selected && (
        <OnboardingDetail
          item={selected}
          onClose={() => setSelected(null)}
          onUpdated={fetchItems}
        />
      )}
    </div>
  );
}