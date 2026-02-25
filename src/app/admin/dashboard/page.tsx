"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  getContacts,
  getLeads,
  getAudits,
  leadStatusLabel,
  type ContactSubmission,
  type Lead,
} from "@/lib/api";

export default function DashboardPage() {
  const [stats, setStats] = useState({ contacts: 0, unread: 0, leads: 0, newLeads: 0, audits: 0 });
  const [recentContacts, setRecentContacts] = useState<ContactSubmission[]>([]);
  const [recentLeads, setRecentLeads] = useState<Lead[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      try {
        const [contacts, unreadContacts, leads, newLeads, audits] = await Promise.all([
          getContacts(1, 1),
          getContacts(1, 5, true),
          getLeads(1, 5),
          getLeads(1, 1, 0),
          getAudits(1, 1),
        ]);
        setStats({
          contacts: contacts.total,
          unread: unreadContacts.total,
          leads: leads.total,
          newLeads: newLeads.total,
          audits: audits.total,
        });
        setRecentContacts(unreadContacts.items);
        setRecentLeads(leads.items);
      } catch (err) {
        console.error("Failed to load dashboard", err);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  if (loading) {
    return (
      <div className="p-8">
        <div className="animate-pulse space-y-6">
          <div className="h-8 bg-surface-light rounded w-48" />
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {[1, 2, 3, 4].map((i) => <div key={i} className="h-28 bg-surface rounded-2xl" />)}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-8">Dashboard</h1>

      {/* Stat cards */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-10">
        {[
          { label: "Total Leads", value: stats.leads, href: "/admin/leads", color: "text-primary" },
          { label: "New Leads", value: stats.newLeads, href: "/admin/leads", color: "text-secondary" },
          { label: "Unread Contacts", value: stats.unread, href: "/admin/contacts", color: "text-accent" },
          { label: "Audit Requests", value: stats.audits, href: "/admin/audits", color: "text-primary-light" },
        ].map((s) => (
          <Link
            key={s.label}
            href={s.href}
            className="bg-surface border border-border rounded-2xl p-6 hover:border-primary/40 transition-all duration-200"
          >
            <div className="text-sm text-muted mb-1">{s.label}</div>
            <div className={`text-3xl font-bold ${s.color}`}>{s.value}</div>
          </Link>
        ))}
      </div>

      {/* Recent activity */}
      <div className="grid lg:grid-cols-2 gap-6">
        {/* Unread contacts */}
        <div className="bg-surface border border-border rounded-2xl p-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="font-semibold">Unread Contacts</h2>
            <Link href="/admin/contacts" className="text-xs text-primary hover:underline">
              View all
            </Link>
          </div>
          {recentContacts.length === 0 ? (
            <p className="text-sm text-muted">No unread contacts.</p>
          ) : (
            <div className="space-y-3">
              {recentContacts.map((c) => (
                <div key={c.id} className="flex justify-between items-start text-sm">
                  <div>
                    <div className="font-medium">{c.name}</div>
                    <div className="text-muted text-xs">
                      {c.email} &middot; {c.service || "N/A"}
                    </div>
                  </div>
                  <div className="text-xs text-muted whitespace-nowrap ml-4">
                    {new Date(c.createdAt).toLocaleDateString()}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Recent leads */}
        <div className="bg-surface border border-border rounded-2xl p-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="font-semibold">Recent Leads</h2>
            <Link href="/admin/leads" className="text-xs text-primary hover:underline">
              View all
            </Link>
          </div>
          {recentLeads.length === 0 ? (
            <p className="text-sm text-muted">No leads yet.</p>
          ) : (
            <div className="space-y-3">
              {recentLeads.map((l) => (
                <div key={l.id} className="flex justify-between items-start text-sm">
                  <div>
                    <div className="font-medium">{l.name}</div>
                    <div className="text-muted text-xs">{l.companyName || l.email}</div>
                  </div>
                  <span
                    className={`text-xs px-2 py-0.5 rounded-full ${
                      l.status === 0 ? "bg-primary/10 text-primary"
                        : l.status === 3 ? "bg-secondary/10 text-secondary"
                        : l.status === 4 ? "bg-accent/10 text-accent"
                        : "bg-surface-lighter text-muted"
                    }`}
                  >
                    {leadStatusLabel(l.status)}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}