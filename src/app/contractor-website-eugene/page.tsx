import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Custom Contractor Websites in Eugene, Oregon | digitalheavyweights Inc",
  description:
    "Custom contractor websites with lead capture, mobile optimization, and local SEO. Starting at $800. Eugene, OR.",
  openGraph: {
    title: "Custom Contractor Websites in Eugene, Oregon | digitalheavyweights Inc",
    description:
      "Custom contractor websites with lead capture, mobile optimization, and local SEO. Starting at $800. Eugene, OR.",
    url: "https://digitalheavyweights.com/contractor-website-eugene",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Custom Contractor Websites in Eugene, Oregon | digitalheavyweights Inc",
    description:
      "Custom contractor websites with lead capture, mobile optimization, and local SEO. Starting at $800. Eugene, OR.",
  },
  alternates: {
    canonical: "/contractor-website-eugene",
  },
  keywords: [
    "contractor website Eugene",
    "custom website",
    "local contractor",
  ],
};

export default function ContractorWebsiteEugenePage() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Service",
    name: "Custom Contractor Websites in Eugene, Oregon",
    description:
      "Custom contractor websites with lead capture, mobile optimization, and local SEO. Starting at $800. Eugene, OR.",
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
    url: "https://digitalheavyweights.com/contractor-website-eugene",
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
            Custom <span className="gradient-text">Contractor Websites</span> in Eugene, Oregon
          </h1>
          <p className="mt-4 text-lg text-muted leading-relaxed max-w-2xl mx-auto">
            Not a template. A custom-built website with lead capture, local SEO,
            and a management dashboard — designed for Eugene contractors.
          </p>
          <Link
            href="/contact"
            className="inline-block mt-8 bg-primary hover:bg-primary-dark text-white px-8 py-4 rounded-full font-medium transition-all duration-200 hover:shadow-[0_0_30px_rgba(99,102,241,0.3)]"
          >
            Get a Free Audit
          </Link>
        </div>
      </section>

      {/* Why Templates Don't Work */}
      <section className="py-24 lg:py-32 bg-surface border-t border-border">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-foreground tracking-tight mb-6">
            Why Generic Templates Don&apos;t Work for <span className="gradient-text">Contractors</span>
          </h2>
          <div className="space-y-4 text-muted leading-relaxed">
            <p>
              Most contractors start with a Squarespace or Wix template. It looks
              fine, but it doesn&apos;t do anything to actually help your business
              grow. No lead tracking, no project estimator, no local SEO, no
              automated follow-up.
            </p>
            <p>
              A template gives you an online brochure. What you need is a lead
              management system — a website that actively captures inquiries,
              tracks them, and helps you close more deals.
            </p>
            <p>
              Plus, templates charge $40+/month. A custom-built site from
              digitalheavyweights Inc is $800 one-time and just $3/month ongoing. You save
              thousands over time.
            </p>
          </div>
        </div>
      </section>

      {/* What Makes a Good Contractor Website */}
      <section className="py-24 lg:py-32 bg-background border-t border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-foreground tracking-tight text-center mb-12">
            What Makes a Good <span className="gradient-text">Contractor Website</span>
          </h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8 stagger-children">
            {[
              {
                title: "Lead Capture",
                desc: "Every inquiry goes to a database, not just an email. No more lost leads in spam folders.",
              },
              {
                title: "Mobile-First Design",
                desc: "Over 60% of your customers search on their phones. Your site needs to work perfectly on mobile.",
              },
              {
                title: "Local SEO",
                desc: "City-specific pages targeting searches like 'tile installer Eugene' and 'bathroom remodel Cottage Grove.'",
              },
              {
                title: "Project Estimator",
                desc: "Let customers get instant rough quotes. Capture budget and timeline info before you ever call them.",
              },
              {
                title: "Fast Loading",
                desc: "Slow sites lose customers. Built with Next.js for fast, server-rendered pages that load instantly.",
              },
              {
                title: "Professional Design",
                desc: "Clean, modern design that builds trust. Before/after galleries, testimonials, and clear calls to action.",
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

      {/* Pricing */}
      <section className="py-24 lg:py-32 bg-surface border-t border-border">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <span className="inline-block px-3 py-1 rounded-full border border-border text-xs text-muted uppercase tracking-wider">
            Pricing
          </span>
          <h2 className="mt-6 text-3xl font-bold text-foreground tracking-tight mb-4">
            Transparent <span className="gradient-text">Pricing</span>
          </h2>
          <p className="text-muted leading-relaxed mb-8">
            No hidden fees. No surprise invoices. One-time build cost plus
            minimal ongoing hosting.
          </p>
          <div className="bg-surface-light rounded-2xl p-8 border border-border card-glow">
            <div className="text-5xl font-bold text-primary">$800 - $1,800</div>
            <div className="text-muted mt-2">one-time build</div>
            <div className="text-2xl font-bold text-secondary mt-4">
              + $3/month
            </div>
            <div className="text-muted mt-1">
              ongoing hosting &amp; maintenance
            </div>
            <Link
              href="/pricing"
              className="inline-block mt-6 bg-primary hover:bg-primary-dark text-white px-8 py-4 rounded-full font-medium transition-all duration-200 hover:shadow-[0_0_30px_rgba(99,102,241,0.3)]"
            >
              See Full Pricing
            </Link>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="relative overflow-hidden py-24 lg:py-32 border-t border-border">
        <div className="absolute inset-0 bg-gradient-to-b from-primary/10 to-background" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-primary/5 rounded-full blur-3xl" />
        <div className="relative max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold text-foreground tracking-tight mb-4">
            Get a Custom Website for Your <span className="gradient-text">Contracting Business</span>
          </h2>
          <p className="text-muted leading-relaxed mb-8">
            Free audit included. I&apos;ll show you what your current site is
            missing and how a custom build can help you capture more leads.
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
