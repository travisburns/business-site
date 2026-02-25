import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Lead Management Systems for Contractors | digitalheavyweights Inc | Eugene, OR",
  description:
    "Custom lead capture and management systems for Eugene contractors. Stop missing inquiries. $800 one-time, $3/month ongoing.",
  openGraph: {
    title: "Lead Management Systems for Contractors | digitalheavyweights Inc | Eugene, OR",
    description:
      "Custom lead capture and management systems for Eugene contractors. Stop missing inquiries. $800 one-time, $3/month ongoing.",
    url: "https://digitalheavyweights.com",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Lead Management Systems for Contractors | digitalheavyweights Inc | Eugene, OR",
    description:
      "Custom lead capture and management systems for Eugene contractors. Stop missing inquiries. $800 one-time, $3/month ongoing.",
  },
  alternates: {
    canonical: "/",
  },
  keywords: [
    "contractor lead management",
    "Eugene contractor website",
    "lead tracking system",
    "contractor leads Eugene OR",
    "local SEO contractors",
    "lead capture system",
    "contractor website builder",
    "Eugene Oregon web developer",
  ],
};

export default function HomePage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "BreadcrumbList",
            itemListElement: [
              {
                "@type": "ListItem",
                position: 1,
                name: "Home",
                item: "https://digitalheavyweights.com",
              },
            ],
          }),
        }}
      />
      {/* Hero */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-primary/5 via-background to-background" />
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-primary/10 rounded-full blur-[120px]" />
        <div className="relative max-w-5xl mx-auto px-6 lg:px-8 text-center pt-20">
          <div className="inline-block mb-6 px-4 py-1.5 rounded-full border border-border text-sm text-muted">
            Lead management for Eugene contractors
          </div>
          <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold leading-[1.1] tracking-tight">
            Stop Missing Leads.
            <br />
            <span className="gradient-text">Start Closing Deals.</span>
          </h1>
          <p className="mt-6 text-lg md:text-xl text-muted max-w-2xl mx-auto leading-relaxed">
            Custom lead tracking, project estimators, and local SEO — built
            specifically for contractors in Eugene and Lane County.
          </p>
          <div className="mt-10 flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/case-studies/halleman-construction"
              className="bg-primary hover:bg-primary-dark text-white px-8 py-4 rounded-full text-base font-medium transition-all duration-200 hover:shadow-[0_0_30px_rgba(99,102,241,0.3)]"
            >
              See How It Works
            </Link>
            <Link
              href="/contact"
              className="border border-border hover:border-muted text-foreground px-8 py-4 rounded-full text-base font-medium transition-all duration-200 hover:bg-surface-light"
            >
              Get a Free Audit
            </Link>
          </div>
        </div>
      </section>

      {/* Problem / Solution */}
      <section className="py-24 lg:py-32 border-t border-border">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold tracking-tight">
              Are You Losing Leads?
            </h2>
            <p className="mt-4 text-muted max-w-xl mx-auto">
              Most contractors lose leads every week without realizing it. Here are the most common problems — and how we solve them.
            </p>
          </div>
          <div className="grid md:grid-cols-3 gap-6 stagger-children">
            {[
              {
                problem: "Missed Leads",
                description:
                  "Inquiries go to an email you check once a day — or never. Leads slip through the cracks while you're on the job site.",
                solution:
                  "Every inquiry is captured in a database instantly. No more lost leads.",
              },
              {
                problem: "No Tracking",
                description:
                  "You have no idea which leads are new, which you've followed up on, or which turned into jobs.",
                solution:
                  "Admin dashboard lets you track lead status, add notes, and export data.",
              },
              {
                problem: "Manual Follow-Up",
                description:
                  "You're calling back hours or days later. By then, they've hired someone else.",
                solution:
                  "Automated email and SMS responses go out instantly when a lead comes in.",
              },
            ].map((item) => (
              <div
                key={item.problem}
                className="bg-surface rounded-2xl p-8 border border-border card-glow"
              >
                <div className="text-accent font-medium text-sm uppercase tracking-wider">
                  The Problem
                </div>
                <h3 className="text-xl font-bold mt-3">{item.problem}</h3>
                <p className="text-muted mt-3 text-sm leading-relaxed">{item.description}</p>
                <div className="border-t border-border mt-6 pt-6">
                  <div className="text-secondary font-medium text-sm uppercase tracking-wider">
                    The Solution
                  </div>
                  <p className="text-sm mt-2 text-muted-light leading-relaxed">{item.solution}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Social Proof */}
      <section className="py-24 lg:py-32 bg-surface border-t border-border">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="text-center mb-16">
            <div className="inline-block mb-4 px-3 py-1 rounded-full border border-border text-xs text-muted uppercase tracking-wider">
              Case Study
            </div>
            <h2 className="text-3xl md:text-4xl font-bold tracking-tight">
              Halleman Construction LLC
            </h2>
            <p className="mt-4 text-muted max-w-2xl mx-auto">
              See how a Eugene contractor went from a basic contact form to a full lead
              management system — and stopped missing inquiries.
            </p>
          </div>
          <div className="grid md:grid-cols-2 gap-6 max-w-4xl mx-auto">
            <div className="bg-background rounded-2xl p-8 border border-red-500/20">
              <h3 className="font-bold text-red-400 mb-4 text-sm uppercase tracking-wider">Before</h3>
              <ul className="space-y-3 text-sm text-muted">
                <li className="flex items-start gap-3">
                  <span className="text-red-400 mt-0.5">&#x2717;</span>
                  Basic contact form to email only
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-red-400 mt-0.5">&#x2717;</span>
                  No lead tracking
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-red-400 mt-0.5">&#x2717;</span>
                  No project estimator
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-red-400 mt-0.5">&#x2717;</span>
                  Limited local SEO
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-red-400 mt-0.5">&#x2717;</span>
                  Missing leads on job sites
                </li>
              </ul>
            </div>
            <div className="bg-background rounded-2xl p-8 border border-secondary/20">
              <h3 className="font-bold text-secondary mb-4 text-sm uppercase tracking-wider">After</h3>
              <ul className="space-y-3 text-sm text-muted">
                <li className="flex items-start gap-3">
                  <span className="text-secondary mt-0.5">&#10003;</span>
                  Lead database captures every inquiry
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-secondary mt-0.5">&#10003;</span>
                  Admin dashboard for full tracking
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-secondary mt-0.5">&#10003;</span>
                  Project estimator for instant quotes
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-secondary mt-0.5">&#10003;</span>
                  20 local SEO pages
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-secondary mt-0.5">&#10003;</span>
                  Automated email responses
                </li>
              </ul>
            </div>
          </div>
          <div className="text-center mt-10">
            <Link
              href="/case-studies/halleman-construction"
              className="text-primary hover:text-primary-light font-medium text-sm transition-colors"
            >
              Read the Full Case Study &rarr;
            </Link>
          </div>
        </div>
      </section>

      {/* Services Overview */}
      <section className="py-24 lg:py-32 border-t border-border">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold tracking-tight">
              What You Get
            </h2>
            <p className="mt-4 text-muted max-w-xl mx-auto">
              Everything you need to capture, track, and close more leads.
            </p>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 stagger-children">
            {[
              {
                title: "Lead Database & Admin Dashboard",
                desc: "Every inquiry stored. Track status, add notes, export to CSV.",
              },
              {
                title: "Project Estimator",
                desc: "Customers get instant rough quotes. You capture budget and timeline upfront.",
              },
              {
                title: "20 Local SEO Pages",
                desc: "Rank for searches like 'tile installer Eugene' and 'bathroom remodel Cottage Grove'.",
              },
              {
                title: "Automated Email & SMS",
                desc: "Instant responses when a lead comes in. Never miss a follow-up.",
              },
              {
                title: "Mobile-Optimized Design",
                desc: "Looks great on every device. Touch-friendly, fast loading.",
              },
              {
                title: "You Own Everything",
                desc: "Your code, your content, your domain. No lock-in.",
              },
            ].map((service) => (
              <div
                key={service.title}
                className="bg-surface rounded-2xl p-8 border border-border card-glow group"
              >
                <h3 className="font-bold text-lg group-hover:text-primary transition-colors duration-200">{service.title}</h3>
                <p className="text-muted text-sm mt-3 leading-relaxed">{service.desc}</p>
              </div>
            ))}
          </div>
          <div className="text-center mt-10">
            <Link
              href="/services"
              className="text-primary hover:text-primary-light font-medium text-sm transition-colors"
            >
              See All Services &rarr;
            </Link>
          </div>
        </div>
      </section>

      {/* Pricing Teaser */}
      <section className="py-24 lg:py-32 bg-surface border-t border-border">
        <div className="max-w-3xl mx-auto px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold tracking-tight mb-4">Simple, Transparent Pricing</h2>
          <p className="text-muted mb-12">
            No surprises. No hidden fees. One-time build cost plus minimal ongoing hosting.
          </p>
          <div className="bg-background rounded-2xl p-10 border border-border relative overflow-hidden">
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-1/2 h-px bg-gradient-to-r from-transparent via-primary to-transparent" />
            <div className="text-6xl font-bold gradient-text">$800</div>
            <div className="text-muted mt-2">one-time build</div>
            <div className="text-2xl font-bold text-secondary mt-6">+ $3/month</div>
            <div className="text-muted mt-1 text-sm">ongoing hosting &amp; maintenance</div>
            <Link
              href="/pricing"
              className="inline-block mt-8 bg-primary hover:bg-primary-dark text-white px-8 py-3.5 rounded-full font-medium transition-all duration-200 hover:shadow-[0_0_30px_rgba(99,102,241,0.3)]"
            >
              See Full Pricing
            </Link>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-24 lg:py-32 border-t border-border relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-primary/5 to-transparent" />
        <div className="relative max-w-3xl mx-auto px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold tracking-tight mb-4">
            Ready to Stop Missing Leads?
          </h2>
          <p className="text-muted mb-10 max-w-xl mx-auto">
            Get a free audit of your current website. I&apos;ll show you exactly
            what&apos;s costing you leads — and how to fix it.
          </p>
          <Link
            href="/contact"
            className="inline-block bg-primary hover:bg-primary-dark text-white px-10 py-4 rounded-full text-lg font-medium transition-all duration-200 hover:shadow-[0_0_30px_rgba(99,102,241,0.3)]"
          >
            Get Your Free Audit
          </Link>
        </div>
      </section>
    </>
  );
}
