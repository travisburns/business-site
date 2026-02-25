"use client";

import { useEffect, useState, useCallback } from "react";
import {
  getAudits,
  updateAudit,
  auditStatusLabel,
  AUDIT_STATUSES,
  type AuditRequest,
} from "@/lib/api";

export default function AuditsPage() {
  const [audits, setAudits] = useState<AuditRequest[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [statusFilter, setStatusFilter] = useState<number | undefined>();
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editForm, setEditForm] = useState({ status: 0, notes: "" });

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const data = await getAudits(page, 25, statusFilter);
      setAudits(data.items);
      setTotal(data.total);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, [page, statusFilter]);

  useEffect(() => {
    load();
  }, [load]);

  function startEdit(audit: AuditRequest) {
    setEditingId(audit.id);
    setEditForm({ status: audit.status, notes: audit.notes || "" });
  }

  async function saveEdit(id: number) {
    try {
      await updateAudit(id, {
        status: editForm.status,
        notes: editForm.notes || undefined,
      });
      setEditingId(null);
      load();
    } catch (err) {
      console.error(err);
    }
  }

  const totalPages = Math.ceil(total / 25);

  const statusColors: Record<number, string> = {
    0: "bg-yellow-500/10 text-yellow-400",
    1: "bg-blue-500/10 text-blue-400",
    2: "bg-secondary/10 text-secondary",
    3: "bg-primary/10 text-primary",
  };

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-8">Audit Requests ({total})</h1>

      {/* Status filters */}
      <div className="flex gap-2 mb-6 flex-wrap">
        <button
          onClick={() => { setStatusFilter(undefined); setPage(1); }}
          className={`text-xs px-3 py-1.5 rounded-full border transition-all ${
            statusFilter === undefined
              ? "border-primary text-primary bg-primary/10"
              : "border-border text-muted hover:text-foreground"
          }`}
        >
          All
        </button>
        {AUDIT_STATUSES.map((s, i) => (
          <button
            key={s}
            onClick={() => { setStatusFilter(i); setPage(1); }}
            className={`text-xs px-3 py-1.5 rounded-full border transition-all ${
              statusFilter === i
                ? "border-primary text-primary bg-primary/10"
                : "border-border text-muted hover:text-foreground"
            }`}
          >
            {s}
          </button>
        ))}
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-border text-left">
              <th className="py-3 pr-4 text-muted font-medium">Name</th>
              <th className="py-3 pr-4 text-muted font-medium">Email</th>
              <th className="py-3 pr-4 text-muted font-medium">Company</th>
              <th className="py-3 pr-4 text-muted font-medium">Website</th>
              <th className="py-3 pr-4 text-muted font-medium">Status</th>
              <th className="py-3 pr-4 text-muted font-medium">Date</th>
              <th className="py-3 text-muted font-medium">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {loading ? (
              <tr>
                <td colSpan={7} className="py-8 text-center text-muted">Loading...</td>
              </tr>
            ) : audits.length === 0 ? (
              <tr>
                <td colSpan={7} className="py-8 text-center text-muted">No audit requests.</td>
              </tr>
            ) : (
              audits.map((audit) => (
                <tr key={audit.id} className="group">
                  <td className="py-3 pr-4 font-medium">{audit.name}</td>
                  <td className="py-3 pr-4 text-muted">{audit.email}</td>
                  <td className="py-3 pr-4 text-muted">{audit.companyName || "—"}</td>
                  <td className="py-3 pr-4 text-muted text-xs">
                    {audit.currentWebsiteUrl ? (
                      <a
                        href={audit.currentWebsiteUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-primary hover:underline"
                      >
                        {audit.currentWebsiteUrl}
                      </a>
                    ) : (
                      "—"
                    )}
                  </td>
                  <td className="py-3 pr-4">
                    {editingId === audit.id ? (
                      <select
                        value={editForm.status}
                        onChange={(e) => setEditForm({ ...editForm, status: parseInt(e.target.value) })}
                        className="bg-surface border border-border rounded-lg px-2 py-1 text-xs focus:outline-none focus:ring-1 focus:ring-primary"
                      >
                        {AUDIT_STATUSES.map((s, i) => (
                          <option key={s} value={i}>{s}</option>
                        ))}
                      </select>
                    ) : (
                      <span className={`text-xs px-2 py-0.5 rounded-full ${statusColors[audit.status] || ""}`}>
                        {auditStatusLabel(audit.status)}
                      </span>
                    )}
                  </td>
                  <td className="py-3 pr-4 text-muted text-xs">
                    {new Date(audit.createdAt).toLocaleDateString()}
                  </td>
                  <td className="py-3">
                    {editingId === audit.id ? (
                      <div className="flex gap-2">
                        <button onClick={() => saveEdit(audit.id)} className="text-xs text-secondary hover:underline">
                          Save
                        </button>
                        <button onClick={() => setEditingId(null)} className="text-xs text-muted hover:underline">
                          Cancel
                        </button>
                      </div>
                    ) : (
                      <button
                        onClick={() => startEdit(audit)}
                        className="text-xs text-primary hover:underline opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        Edit
                      </button>
                    )}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Notes editor */}
      {editingId !== null && (
        <div className="mt-4 p-4 bg-surface border border-border rounded-2xl">
          <label className="block text-xs text-muted mb-1">Notes for audit #{editingId}</label>
          <textarea
            value={editForm.notes}
            onChange={(e) => setEditForm({ ...editForm, notes: e.target.value })}
            className="w-full bg-background border border-border rounded-xl px-3 py-2 text-sm resize-y focus:outline-none focus:ring-1 focus:ring-primary"
            rows={3}
            placeholder="Add notes..."
          />
        </div>
      )}

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-2 mt-8">
          <button
            disabled={page <= 1}
            onClick={() => setPage(page - 1)}
            className="text-xs px-3 py-1.5 rounded-full border border-border text-muted disabled:opacity-30 transition-all"
          >
            Prev
          </button>
          <span className="text-xs text-muted">Page {page} of {totalPages}</span>
          <button
            disabled={page >= totalPages}
            onClick={() => setPage(page + 1)}
            className="text-xs px-3 py-1.5 rounded-full border border-border text-muted disabled:opacity-30 transition-all"
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
}