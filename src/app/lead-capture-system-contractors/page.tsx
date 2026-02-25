import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Lead Capture Systems for Contractors | digitalheavyweights Inc",
  description:
    "Stop losing leads to email. A lead capture system stores every inquiry in a database with automated responses. Never miss a $5k+ project again.",
  openGraph: {
    title: "Lead Capture Systems for Contractors | digitalheavyweights Inc",
    description:
      "Stop losing leads to email. A lead capture system stores every inquiry in a database with automated responses. Never miss a $5k+ project again.",
    url: "https://digitalheavyweights.com/lead-capture-system-contractors",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Lead Capture Systems for Contractors | digitalheavyweights Inc",
    description:
      "Stop losing leads to email. A lead capture system stores every inquiry in a database with automated responses. Never miss a $5k+ project again.",
  },
  alternates: {
    canonical: "/lead-capture-system-contractors",
  },
  keywords: [
    "lead capture system",
    "contractor leads",
    "lead management",
    "automated lead capture",
  ],
};

export default function LeadCaptureSystemContractorsPage() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Service",
    name: "Lead Capture Systems for Contractors",
    description:
      "Stop losing leads to email. A lead capture system stores every inquiry in a database with automated responses. Never miss a $5k+ project again.",
    provider: {
      "@type": "Organization",
      name: "digitalheavyweights Inc",
      url: "https://digitalheavyweights.com",
    },
    url: "https://digitalheavyweights.com/lead-capture-system-contractors",
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(jsonLd),
        }}
      />
      {/* Hero */}
      <section className="relative pt-32 pb-20 lg:pt-40 lg:pb-28 overflow-hidden bg-background">
        <div className="absolute inset-0 bg-gradient-to-b from-primary/10 to-transparent" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-primary/5 rounded-full blur-3xl" />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <span className="inline-block px-3 py-1 rounded-full border border-border text-xs text-muted uppercase tracking-wider">
            For Contractors
          </span>
          <h1 className="mt-6 text-4xl md:text-5xl font-bold text-foreground tracking-tight">
            <span className="gradient-text">Lead Capture</span> Systems for Contractors
          </h1>
          <p className="mt-4 text-lg text-muted leading-relaxed max-w-2xl mx-auto">
            Email-only contact forms lose leads. A database-driven lead capture
            system stores every inquiry and responds automatically — so you
            never miss a project again.
          </p>
          <Link
            href="/contact"
            className="inline-block mt-8 bg-primary hover:bg-primary-dark text-white px-8 py-4 rounded-full font-medium transition-all duration-200 hover:shadow-[0_0_30px_rgba(99,102,241,0.3)]"
          >
            Get Pricing
          </Link>
        </div>
      </section>

      {/* What Is Lead Capture */}
      <section className="py-24 lg:py-32 bg-surface border-t border-border">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-foreground tracking-tight mb-6">
            What Is a <span className="gradient-text">Lead Capture</span> System?
          </h2>
          <div className="space-y-4 text-muted leading-relaxed">
            <p>
              A lead capture system is the infrastructure that sits behind your
              contact form. Instead of sending an email (which can end up in
              spam, get buried, or go unchecked on job sites), a lead capture
              system stores every single inquiry in a database.
            </p>
            <p>
              Every lead is timestamped, categorized by service type, and
              available in an admin dashboard. Automated responses go out
              instantly — the customer gets a confirmation, and you get a
              notification.
            </p>
          </div>
        </div>
      </section>

      {/* Why Email Forms Fail */}
      <section className="py-24 lg:py-32 bg-background border-t border-border">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-foreground tracking-tight mb-8">
            Why Email-Only Contact Forms <span className="text-accent">Fail</span>
          </h2>
          <div className="space-y-6 stagger-children">
            {[
              {
                title: "Spam Filters",
                desc: "Contact form submissions often end up in spam. You never see the lead, and the customer thinks you ignored them.",
              },
              {
                title: "Inbox Overload",
                desc: "Leads get mixed in with newsletters, invoices, and personal emails. Important inquiries get buried and forgotten.",
              },
              {
                title: "On Job Sites",
                desc: "When you're working, you're not checking email. By the time you see the inquiry — hours or days later — the customer has hired someone else.",
              },
              {
                title: "No Tracking",
                desc: "Email gives you zero visibility. You don't know which leads are new, which you've followed up on, or which turned into jobs.",
              },
              {
                title: "No Automation",
                desc: "With email, there's no automated response. The customer waits and wonders if you even received their message.",
              },
            ].map((item) => (
              <div
                key={item.title}
                className="bg-surface rounded-2xl p-8 border border-border card-glow"
              >
                <h3 className="font-bold text-accent">{item.title}</h3>
                <p className="text-muted text-sm mt-2 leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How a Database Solves This */}
      <section className="py-24 lg:py-32 bg-surface border-t border-border">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-foreground tracking-tight mb-8">
            How a Database <span className="gradient-text">Solves This</span>
          </h2>
          <div className="grid sm:grid-cols-2 gap-6 stagger-children">
            {[
              {
                title: "100% Capture Rate",
                desc: "Every inquiry goes to a database. No spam filters, no lost emails. Every lead is captured, period.",
              },
              {
                title: "Instant Automated Responses",
                desc: "The moment a lead comes in, the customer gets a professional confirmation email. You get an SMS/email notification.",
              },
              {
                title: "Admin Dashboard",
                desc: "See all leads in one place. Filter by service, date, or status. Update notes as you follow up. Export to CSV anytime.",
              },
              {
                title: "Full Pipeline Visibility",
                desc: "Track every lead from new inquiry to closed deal. Know exactly where each potential project stands.",
              },
            ].map((item) => (
              <div
                key={item.title}
                className="bg-surface-light rounded-2xl p-8 border border-border card-glow"
              >
                <h3 className="font-bold text-secondary">{item.title}</h3>
                <p className="text-muted text-sm mt-2 leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ROI */}
      <section className="py-24 lg:py-32 bg-background border-t border-border">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <span className="inline-block px-3 py-1 rounded-full border border-border text-xs text-muted uppercase tracking-wider">
            ROI
          </span>
          <h2 className="mt-6 text-3xl font-bold text-foreground tracking-tight mb-6">
            The Cost of Missing Just <span className="gradient-text">One Lead</span>
          </h2>
          <p className="text-muted leading-relaxed mb-8">
            The average contracting project is worth $5,000 - $15,000. Missing
            just one lead per month means losing $60,000 - $180,000 per year. A
            lead capture system costs $800 one-time. It pays for itself with a
            single captured lead.
          </p>
          <div className="bg-surface rounded-2xl p-8 border border-border card-glow">
            <div className="text-4xl font-bold text-accent">$60,000+</div>
            <div className="text-muted mt-2">
              potential revenue lost per year from just 1 missed lead/month
            </div>
            <div className="mt-6 text-4xl font-bold text-secondary">$800</div>
            <div className="text-muted mt-2">
              one-time investment for a lead capture system
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="relative overflow-hidden py-24 lg:py-32 border-t border-border">
        <div className="absolute inset-0 bg-gradient-to-b from-primary/10 to-background" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-primary/5 rounded-full blur-3xl" />
        <div className="relative max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold text-foreground tracking-tight mb-4">
            Never Miss a <span className="gradient-text">$5K+ Project</span> Again
          </h2>
          <p className="text-muted leading-relaxed mb-8">
            Get a free audit and see how many leads your current website is
            losing. The answer might surprise you.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/contact"
              className="bg-primary hover:bg-primary-dark text-white px-8 py-4 rounded-full font-medium transition-all duration-200 hover:shadow-[0_0_30px_rgba(99,102,241,0.3)]"
            >
              Get Your Free Audit
            </Link>
            <Link
              href="/pricing"
              className="border border-border hover:border-muted text-foreground px-8 py-4 rounded-full font-medium transition-all duration-200"
            >
              See Pricing
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
