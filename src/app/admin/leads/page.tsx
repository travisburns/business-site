"use client";

import { useState, useEffect, useCallback, type FormEvent } from "react";
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
import Link from "next/link";

type LeadStatus = (typeof LEAD_STATUSES)[number];

const STATUS_COLORS: Record<LeadStatus, string> = {
  New: "bg-blue-500/10 text-blue-400 border-blue-500/20",
  Contacted: "bg-yellow-500/10 text-yellow-400 border-yellow-500/20",
  Quoted: "bg-purple-500/10 text-purple-400 border-purple-500/20",
  Won: "bg-green-500/10 text-green-400 border-green-500/20",
  Lost: "bg-red-500/10 text-red-400 border-red-500/20",
};

// ─── Create Lead Modal ──────────────────────────────────────────────────────
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
            <button type="button" onClick={onClose} className="flex-1 px-4 py-2.5 rounded-full border border-border text-sm text-muted hover:text-foreground transition-colors">
              Cancel
            </button>
            <button type="submit" disabled={loading} className="flex-1 bg-primary hover:bg-primary-dark disabled:opacity-50 text-white px-4 py-2.5 rounded-full text-sm font-medium transition-all duration-200">
              {loading ? "Creating..." : "Create Lead"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

// ─── Lead Detail / Edit Panel ───────────────────────────────────────────────
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
      await updateLead(lead.id, {
        status: statusIdx,
        notes: notes || undefined,
        estimatedValue: value ? parseFloat(value) : undefined,
      });
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
          {/* Read-only info */}
          <div className="grid grid-cols-2 gap-3 text-sm">
            <div>
              <span className="text-muted block text-xs">Email</span>
              <a href={`mailto:${lead.email}`} className="text-primary hover:text-primary-light">{lead.email}</a>
            </div>
            <div>
              <span className="text-muted block text-xs">Phone</span>
              {lead.phone ? (
                <a href={`tel:${lead.phone}`} className="text-primary hover:text-primary-light">{lead.phone}</a>
              ) : (
                <span className="text-muted">&mdash;</span>
              )}
            </div>
            <div>
              <span className="text-muted block text-xs">Company</span>
              <span>{lead.companyName || "&mdash;"}</span>
            </div>
            <div>
              <span className="text-muted block text-xs">Service</span>
              <span>{lead.service || "&mdash;"}</span>
            </div>
            <div>
              <span className="text-muted block text-xs">Created</span>
              <span>{new Date(lead.createdAt).toLocaleDateString()}</span>
            </div>
            <div>
              <span className="text-muted block text-xs">Last Updated</span>
              <span>{new Date(lead.updatedAt).toLocaleDateString()}</span>
            </div>
          </div>

          {/* Cross-stage links */}
          {lead.contactSubmissionId && (
            <div className="flex items-center gap-2">
              <span className="text-xs text-muted">From:</span>
              <Link
                href="/admin/contacts"
                className="text-xs text-primary hover:text-primary-light transition-colors"
                onClick={(e) => e.stopPropagation()}
              >
                Contact Submission #{lead.contactSubmissionId}
              </Link>
            </div>
          )}

          <hr className="border-border" />

          {/* Editable fields */}
          <div>
            <label className="block text-xs font-medium text-muted mb-1">Status</label>
            <div className="flex flex-wrap gap-2">
              {LEAD_STATUSES.map((s, i) => (
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
            <label className="block text-xs font-medium text-muted mb-1">Estimated Value ($)</label>
            <input
              type="number"
              step="0.01"
              value={value}
              onChange={(e) => setValue(e.target.value)}
              className="w-full px-3 py-2 rounded-lg border border-border bg-background text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary/50"
              placeholder="0.00"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-muted mb-1">Notes</label>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              rows={4}
              className="w-full px-3 py-2 rounded-lg border border-border bg-background text-foreground text-sm resize-y focus:outline-none focus:ring-2 focus:ring-primary/50"
            />
          </div>

          {/* Convert to Onboarding — only when Won */}
          {statusIdx === 3 && (
            <div className="bg-green-500/5 border border-green-500/20 rounded-xl p-4">
              <p className="text-xs text-green-400 mb-2">This lead is marked as Won. Ready to start onboarding?</p>
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
            <button
              type="button"
              onClick={handleSave}
              disabled={saving}
              className="flex-1 bg-primary hover:bg-primary-dark disabled:opacity-50 text-white px-4 py-2.5 rounded-full text-sm font-medium transition-all duration-200"
            >
              {saving ? "Saving..." : "Save Changes"}
            </button>

            {!confirmDelete ? (
              <button
                type="button"
                onClick={() => setConfirmDelete(true)}
                className="px-4 py-2.5 rounded-full border border-red-500/30 text-red-400 text-sm hover:bg-red-500/10 transition-all duration-200"
              >
                Delete
              </button>
            ) : (
              <button
                type="button"
                onClick={handleDelete}
                disabled={deleting}
                className="px-4 py-2.5 rounded-full bg-red-500/20 border border-red-500/30 text-red-400 text-sm font-medium transition-all duration-200"
              >
                {deleting ? "Deleting..." : "Confirm Delete"}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── Main Page ──────────────────────────────────────────────────────────────
export default function AdminLeadsPage() {
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

  useEffect(() => {
    fetchLeads();
  }, [fetchLeads]);

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
    <div className="min-h-screen pt-24 pb-16 px-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
          <div>
            <h1 className="text-2xl font-bold">Leads</h1>
            <p className="text-sm text-muted mt-1">{total} total lead{total !== 1 ? "s" : ""}</p>
          </div>
          <div className="flex gap-3">
            <button
              onClick={handleExport}
              className="px-4 py-2 rounded-full border border-border text-sm text-muted hover:text-foreground hover:border-foreground/20 transition-all duration-200"
            >
              Export CSV
            </button>
            <button
              onClick={() => setShowCreate(true)}
              className="bg-primary hover:bg-primary-dark text-white px-5 py-2 rounded-full text-sm font-medium transition-all duration-200"
            >
              + New Lead
            </button>
          </div>
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
          {LEAD_STATUSES.map((s, i) => (
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
            <div className="p-12 text-center text-muted text-sm">Loading leads...</div>
          ) : leads.length === 0 ? (
            <div className="p-12 text-center">
              <p className="text-muted text-sm">No leads found.</p>
              <button
                onClick={() => setShowCreate(true)}
                className="mt-3 text-primary hover:text-primary-light text-sm"
              >
                Create your first lead
              </button>
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
                      <tr
                        key={lead.id}
                        onClick={() => setSelectedLead(lead)}
                        className="border-b border-border/50 hover:bg-white/[0.02] cursor-pointer transition-colors duration-150"
                      >
                        <td className="px-5 py-4">
                          <div className="font-medium">{lead.name}</div>
                          <div className="text-xs text-muted md:hidden">{lead.email}</div>
                        </td>
                        <td className="px-5 py-4 text-muted hidden md:table-cell">{lead.email}</td>
                        <td className="px-5 py-4 text-muted hidden lg:table-cell">{lead.companyName || "&mdash;"}</td>
                        <td className="px-5 py-4 text-muted hidden lg:table-cell">{lead.service || "&mdash;"}</td>
                        <td className="px-5 py-4">
                          <span className={`inline-block px-2.5 py-0.5 rounded-full text-xs font-medium border ${STATUS_COLORS[statusLabel as LeadStatus] || ""}`}>
                            {statusLabel}
                          </span>
                        </td>
                        <td className="px-5 py-4 text-muted hidden sm:table-cell">
                          {lead.estimatedValue != null ? `$${lead.estimatedValue.toLocaleString()}` : "&mdash;"}
                        </td>
                        <td className="px-5 py-4 text-muted hidden md:table-cell">
                          {new Date(lead.createdAt).toLocaleDateString()}
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
              <span className="text-xs text-muted">
                Page {page} of {totalPages}
              </span>
              <div className="flex gap-2">
                <button
                  onClick={() => setPage((p) => Math.max(1, p - 1))}
                  disabled={page === 1}
                  className="px-3 py-1.5 rounded-lg border border-border text-xs text-muted hover:text-foreground disabled:opacity-30 transition-colors"
                >
                  Previous
                </button>
                <button
                  onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                  disabled={page === totalPages}
                  className="px-3 py-1.5 rounded-lg border border-border text-xs text-muted hover:text-foreground disabled:opacity-30 transition-colors"
                >
                  Next
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Modals */}
      {showCreate && (
        <CreateLeadModal
          onClose={() => setShowCreate(false)}
          onCreated={fetchLeads}
        />
      )}

      {selectedLead && (
        <LeadDetail
          lead={selectedLead}
          onClose={() => setSelectedLead(null)}
          onUpdated={fetchLeads}
          onDeleted={fetchLeads}
        />
      )}
    </div>
  );
}