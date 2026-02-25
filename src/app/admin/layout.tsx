"use client";

import { createContext, useContext, useState, useEffect, type ReactNode } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { isAuthenticated, getStoredUser, logout } from "@/lib/api";

// ── Auth context (scoped to admin) ───────────────────
interface AuthState {
  ready: boolean;
  authed: boolean;
  user: { email: string; fullName: string } | null;
}

const AuthCtx = createContext<AuthState>({ ready: false, authed: false, user: null });
export function useAuth() {
  return useContext(AuthCtx);
}

// ── Sidebar nav items ────────────────────────────────
const nav = [
  { href: "/admin/dashboard", label: "Dashboard" },
  { href: "/admin/leads", label: "Leads" },
  { href: "/admin/contacts", label: "Contacts" },
  { href: "/admin/audits", label: "Audits" },
   { href: "/admin/prospects", label: "Prospects" },
    { href: "/admin/follow-ups", label: "follow-ups" },
     { href: "/admin/onboarding", label: "onboarding" },
      { href: "/admin/Analytics", label: "Analytics" },
      { href: "/admin/delivery", label: "Delivery" },
      { href: "/admin/reports", label: "Report" },
];

// ── Layout shell ─────────────────────────────────────
function AdminShell({ children }: { children: ReactNode }) {
  const { ready, authed, user } = useAuth();
  const pathname = usePathname();
  const router = useRouter();

  // Login page renders without sidebar
  if (pathname === "/admin/login") {
    return (
      <div className="fixed inset-0 z-[100] bg-background overflow-y-auto">
        {children}
      </div>
    );
  }

  // Still checking localStorage
  if (!ready) {
    return (
      <div className="fixed inset-0 z-[100] bg-background flex items-center justify-center">
        <div className="text-muted text-sm">Loading...</div>
      </div>
    );
  }

  // Not authed → redirect
  if (!authed) {
    router.push("/admin/login");
    return (
      <div className="fixed inset-0 z-[100] bg-background flex items-center justify-center">
        <div className="text-muted text-sm">Redirecting...</div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-[100] flex bg-background overflow-hidden">
      {/* Sidebar */}
      <aside className="w-60 bg-surface border-r border-border flex flex-col shrink-0">
        <div className="p-6 border-b border-border">
          <Link href="/admin/dashboard" className="text-xl font-bold tracking-tight">
            digitalheavyweights<span className="text-primary">.</span>
            <span className="text-xs text-muted ml-2 font-normal">Admin</span>
          </Link>
        </div>

        <nav className="flex-1 p-3 space-y-0.5">
          {nav.map((item) => {
            const active = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`block px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200 ${
                  active
                    ? "bg-primary/10 text-primary"
                    : "text-muted hover:text-foreground hover:bg-surface-light"
                }`}
              >
                {item.label}
              </Link>
            );
          })}
        </nav>

        <div className="p-3 border-t border-border space-y-0.5">
          <div className="px-4 py-2 text-xs text-muted truncate">
            {user?.fullName || user?.email}
          </div>
          <button
            onClick={logout}
            className="block w-full text-left px-4 py-2.5 rounded-xl text-sm text-muted hover:text-accent hover:bg-surface-light transition-all duration-200"
          >
            Sign out
          </button>
          <Link
            href="/"
            className="block px-4 py-2.5 rounded-xl text-sm text-muted hover:text-foreground hover:bg-surface-light transition-all duration-200"
          >
            &larr; Back to site
          </Link>
        </div>
      </aside>

      {/* Main */}
      <main className="flex-1 overflow-y-auto">{children}</main>
    </div>
  );
}

// ── Export ────────────────────────────────────────────
export default function AdminLayout({ children }: { children: ReactNode }) {
  const [state, setState] = useState<AuthState>({ ready: false, authed: false, user: null });

  useEffect(() => {
    setState({
      ready: true,
      authed: isAuthenticated(),
      user: getStoredUser(),
    });
  }, []);

  return (
    <AuthCtx.Provider value={state}>
      <AdminShell>{children}</AdminShell>
    </AuthCtx.Provider>
  );
}
