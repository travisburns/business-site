import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Contractor Lead Management Systems in Eugene, Oregon | digitalheavyweights Inc",
  description:
    "Custom lead management systems for Eugene contractors. Capture every inquiry, track leads, and close more deals. Starting at $800.",
  openGraph: {
    title: "Contractor Lead Management Systems in Eugene, Oregon | digitalheavyweights Inc",
    description:
      "Custom lead management systems for Eugene contractors. Capture every inquiry, track leads, and close more deals. Starting at $800.",
    url: "https://digitalheavyweights.com/contractor-lead-management-eugene",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Contractor Lead Management Systems in Eugene, Oregon | digitalheavyweights Inc",
    description:
      "Custom lead management systems for Eugene contractors. Capture every inquiry, track leads, and close more deals. Starting at $800.",
  },
  alternates: {
    canonical: "/contractor-lead-management-eugene",
  },
  keywords: [
    "lead management Eugene",
    "contractor lead tracking",
    "Eugene Oregon",
  ],
};

export default function ContractorLeadManagementEugenePage() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Service",
    name: "Contractor Lead Management Systems in Eugene, Oregon",
    description:
      "Custom lead management systems for Eugene contractors. Capture every inquiry, track leads, and close more deals. Starting at $800.",
    provider: {
      "@type": "Organization",
      name: "digitalheavyweights Inc",
      url: "https://digitalheavyweights.com",
    },
    areaServed: {
      "@type": "City",
      name: "Eugene",
      addressRegion: "OR",
      addressCountry: "US",
    },
    url: "https://digitalheavyweights.com/contractor-lead-management-eugene",
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
            Eugene, Oregon
          </span>
          <h1 className="mt-6 text-4xl md:text-5xl font-bold text-foreground tracking-tight">
            Contractor <span className="gradient-text">Lead Management</span> Systems in Eugene, Oregon
          </h1>
          <p className="mt-4 text-lg text-muted leading-relaxed max-w-2xl mx-auto">
            Stop missing leads. Capture every inquiry automatically with a
            custom-built lead management system designed for Eugene contractors.
          </p>
          <Link
            href="/contact"
            className="inline-block mt-8 bg-primary hover:bg-primary-dark text-white px-8 py-4 rounded-full font-medium transition-all duration-200 hover:shadow-[0_0_30px_rgba(99,102,241,0.3)]"
          >
            Get a Free Audit
          </Link>
        </div>
      </section>

      {/* What Is Lead Management */}
      <section className="py-24 lg:py-32 bg-surface border-t border-border">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-foreground tracking-tight mb-6">
            What Is <span className="gradient-text">Lead Management</span> for Contractors?
          </h2>
          <p className="text-muted leading-relaxed mb-4">
            Lead management is the process of capturing, tracking, and
            converting inquiries into paying jobs. Instead of relying on email
            (which leads get lost in), a lead management system stores every
            inquiry in a database, sends automated responses, and gives you a
            dashboard to track your pipeline.
          </p>
          <p className="text-muted leading-relaxed">
            For Eugene contractors, this means never missing a lead again —
            whether you&apos;re on a job site in Springfield, driving to Cottage
            Grove, or finishing a project in Veneta.
          </p>
        </div>
      </section>

      {/* Why Eugene Contractors Need It */}
      <section className="py-24 lg:py-32 bg-background border-t border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-foreground tracking-tight text-center mb-12">
            Why Eugene Contractors Need <span className="gradient-text">Lead Management</span>
          </h2>
          <div className="grid md:grid-cols-3 gap-8 stagger-children">
            {[
              {
                title: "Competitive Market",
                desc: "Eugene and Lane County have dozens of contractors competing for the same customers. The ones who respond fastest and track leads systematically win the jobs.",
              },
              {
                title: "High Search Volume",
                desc: "People search for contractors online every day — 'tile installer Eugene,' 'bathroom remodel Cottage Grove,' 'deck builder Veneta.' You need to be there when they search.",
              },
              {
                title: "On-the-Job Reality",
                desc: "You can't check email every 5 minutes when you're installing tile or building a deck. Automated responses and a lead database solve this problem.",
              },
            ].map((item) => (
              <div
                key={item.title}
                className="bg-surface rounded-2xl p-8 border border-border card-glow"
              >
                <h3 className="font-bold text-lg text-foreground">{item.title}</h3>
                <p className="text-muted text-sm mt-2 leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-24 lg:py-32 bg-surface border-t border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-foreground tracking-tight text-center mb-12">
            What&apos;s <span className="gradient-text">Included</span>
          </h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 stagger-children">
            {[
              {
                title: "Lead Database",
                desc: "Every inquiry stored and timestamped. No more lost leads.",
              },
              {
                title: "Admin Dashboard",
                desc: "Track status, add notes, filter by service, export to CSV.",
              },
              {
                title: "Project Estimator",
                desc: "Customers get instant rough quotes. You capture budget upfront.",
              },
              {
                title: "Automated Responses",
                desc: "Email and SMS go out instantly when a lead comes in.",
              },
              {
                title: "20 Local SEO Pages",
                desc: "Rank for local searches across Eugene and surrounding cities.",
              },
              {
                title: "Mobile-First Design",
                desc: "Looks great on every device. Fast loading, touch-friendly.",
              },
            ].map((item) => (
              <div
                key={item.title}
                className="bg-surface-light rounded-2xl p-8 border border-border card-glow"
              >
                <h3 className="font-bold text-foreground">{item.title}</h3>
                <p className="text-muted text-sm mt-2 leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Case Study */}
      <section className="py-24 lg:py-32 bg-background border-t border-border">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <span className="inline-block px-3 py-1 rounded-full border border-border text-xs text-muted uppercase tracking-wider">
            Case Study
          </span>
          <h2 className="mt-6 text-3xl font-bold text-foreground tracking-tight mb-6">
            See It in Action: <span className="gradient-text">Halleman Construction</span>
          </h2>
          <p className="text-muted leading-relaxed mb-8 max-w-2xl mx-auto">
            Halleman Construction LLC in Eugene went from a basic contact form
            to a full lead management system — and stopped missing inquiries
            overnight.
          </p>
          <Link
            href="/case-studies/halleman-construction"
            className="text-primary hover:text-primary-dark font-semibold transition-colors"
          >
            Read the Full Case Study &rarr;
          </Link>
        </div>
      </section>

      {/* CTA */}
      <section className="relative overflow-hidden py-24 lg:py-32 border-t border-border">
        <div className="absolute inset-0 bg-gradient-to-b from-primary/10 to-background" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-primary/5 rounded-full blur-3xl" />
        <div className="relative max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold text-foreground tracking-tight mb-4">
            Ready to Stop <span className="gradient-text">Missing Leads</span>?
          </h2>
          <p className="text-muted leading-relaxed mb-8">
            Get a free audit of your current website. I&apos;ll show you exactly
            what&apos;s costing you leads in the Eugene market.
          </p>
          <Link
            href="/contact"
            className="inline-block bg-primary hover:bg-primary-dark text-white px-8 py-4 rounded-full font-medium transition-all duration-200 hover:shadow-[0_0_30px_rgba(99,102,241,0.3)]"
          >
            Get Your Free Audit
          </Link>
        </div>
      </section>
    </>
  );
}
