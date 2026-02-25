"use client";

import { useEffect, useState, useCallback } from "react";
import {
  getContacts,
  markContactRead,
  deleteContact,
  createLead,
  type ContactSubmission,
} from "@/lib/api";

export default function ContactsPage() {
  const [contacts, setContacts] = useState<ContactSubmission[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [unreadOnly, setUnreadOnly] = useState(false);
  const [loading, setLoading] = useState(true);
  const [expandedId, setExpandedId] = useState<number | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const data = await getContacts(page, 25, unreadOnly);
      setContacts(data.items);
      setTotal(data.total);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, [page, unreadOnly]);

  useEffect(() => {
    load();
  }, [load]);

  async function handleMarkRead(id: number) {
    try {
      await markContactRead(id);
      load();
    } catch (err) {
      console.error(err);
    }
  }

  async function handleDelete(id: number) {
    if (!confirm("Delete this contact submission?")) return;
    try {
      await deleteContact(id);
      load();
    } catch (err) {
      console.error(err);
    }
  }

  async function handleConvertToLead(contact: ContactSubmission) {
    try {
      await createLead({
        name: contact.name,
        email: contact.email,
        phone: contact.phone,
        companyName: contact.companyName,
        service: contact.service,
        notes: contact.message,
        contactSubmissionId: contact.id,
      });
      if (!contact.isRead) await markContactRead(contact.id);
      load();
      alert("Lead created!");
    } catch (err) {
      console.error(err);
      alert("Failed to create lead. It may already exist.");
    }
  }

  const totalPages = Math.ceil(total / 25);

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-8">Contact Submissions ({total})</h1>

      {/* Filters */}
      <div className="flex gap-2 mb-6">
        <button
          onClick={() => { setUnreadOnly(false); setPage(1); }}
          className={`text-xs px-3 py-1.5 rounded-full border transition-all ${
            !unreadOnly ? "border-primary text-primary bg-primary/10" : "border-border text-muted"
          }`}
        >
          All
        </button>
        <button
          onClick={() => { setUnreadOnly(true); setPage(1); }}
          className={`text-xs px-3 py-1.5 rounded-full border transition-all ${
            unreadOnly ? "border-primary text-primary bg-primary/10" : "border-border text-muted"
          }`}
        >
          Unread Only
        </button>
      </div>

      {/* Expandable cards */}
      <div className="space-y-3">
        {loading ? (
          <p className="text-center text-muted py-8">Loading...</p>
        ) : contacts.length === 0 ? (
          <p className="text-center text-muted py-8">No contact submissions.</p>
        ) : (
          contacts.map((c) => (
            <div
              key={c.id}
              className={`bg-surface border rounded-2xl transition-all duration-200 ${
                c.isRead ? "border-border" : "border-primary/30"
              }`}
            >
              {/* Header row (clickable) */}
              <button
                onClick={() => setExpandedId(expandedId === c.id ? null : c.id)}
                className="w-full flex items-center justify-between p-4 text-left"
              >
                <div className="flex items-center gap-4">
                  {!c.isRead && <span className="w-2 h-2 rounded-full bg-primary flex-shrink-0" />}
                  <div>
                    <div className="font-medium text-sm">{c.name}</div>
                    <div className="text-xs text-muted">
                      {c.email} &middot; {c.service || "No service"}
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-3 flex-shrink-0">
                  {c.wantAudit && (
                    <span className="text-xs bg-secondary/10 text-secondary px-2 py-0.5 rounded-full">
                      Wants Audit
                    </span>
                  )}
                  {c.leadId && (
                    <span className="text-xs bg-primary/10 text-primary px-2 py-0.5 rounded-full">
                      Lead #{c.leadId}
                    </span>
                  )}
                  <span className="text-xs text-muted">
                    {new Date(c.createdAt).toLocaleDateString()}
                  </span>
                </div>
              </button>

              {/* Expanded details */}
              {expandedId === c.id && (
                <div className="px-4 pb-4 border-t border-border pt-3">
                  <div className="grid sm:grid-cols-2 gap-4 text-sm mb-4">
                    <div>
                      <span className="text-muted text-xs">Phone:</span>
                      <div>{c.phone || "—"}</div>
                    </div>
                    <div>
                      <span className="text-muted text-xs">Company:</span>
                      <div>{c.companyName || "—"}</div>
                    </div>
                  </div>
                  {c.message && (
                    <div className="mb-4">
                      <span className="text-muted text-xs">Message:</span>
                      <div className="text-sm mt-1 p-3 bg-background rounded-xl whitespace-pre-wrap">
                        {c.message}
                      </div>
                    </div>
                  )}
                  <div className="flex gap-2 flex-wrap">
                    {!c.isRead && (
                      <button
                        onClick={() => handleMarkRead(c.id)}
                        className="text-xs px-3 py-1.5 rounded-full border border-border hover:border-secondary text-muted hover:text-secondary transition-all"
                      >
                        Mark Read
                      </button>
                    )}
                    {!c.leadId && (
                      <button
                        onClick={() => handleConvertToLead(c)}
                        className="text-xs px-3 py-1.5 rounded-full border border-border hover:border-primary text-muted hover:text-primary transition-all"
                      >
                        Convert to Lead
                      </button>
                    )}
                    <button
                      onClick={() => handleDelete(c.id)}
                      className="text-xs px-3 py-1.5 rounded-full border border-border hover:border-accent text-muted hover:text-accent transition-all"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              )}
            </div>
          ))
        )}
      </div>

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