import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Case Study: Halleman Construction Lead Management System",
  description:
    "How I built a lead management system for a Eugene contractor. Before/after, results, tech stack.",
  openGraph: {
    title: "Case Study: Halleman Construction Lead Management System",
    description:
      "How I built a lead management system for a Eugene contractor. Before/after, results, tech stack.",
    url: "https://digitalheavyweights.com/case-studies/halleman-construction",
    type: "article",
  },
  twitter: {
    card: "summary_large_image",
    title: "Case Study: Halleman Construction Lead Management System",
    description:
      "How I built a lead management system for a Eugene contractor. Before/after, results, tech stack.",
  },
  alternates: {
    canonical: "/case-studies/halleman-construction",
  },
  keywords: [
    "Halleman Construction",
    "contractor case study",
    "lead management system results",
    "Eugene contractor website",
    "contractor lead tracking",
    "construction company website",
  ],
};

export default function HallemanCaseStudy() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Article",
            headline:
              "Case Study: Halleman Construction Lead Management System",
            description:
              "How a Eugene contractor went from missing leads to capturing every inquiry with a custom lead management system.",
            url: "https://digitalheavyweights.com/case-studies/halleman-construction",
            author: {
              "@type": "Person",
              name: "Travis",
              url: "https://digitalheavyweights.com/about",
            },
            publisher: {
              "@type": "Organization",
              name: "digitalheavyweights Inc",
              url: "https://digitalheavyweights.com",
            },
            about: {
              "@type": "Organization",
              name: "Halleman Construction LLC",
              url: "https://hallemanconstructionllc.com",
              address: {
                "@type": "PostalAddress",
                addressLocality: "Eugene",
                addressRegion: "OR",
                addressCountry: "US",
              },
            },
          }),
        }}
      />
      {/* Hero */}
      <section className="relative pt-32 pb-20 lg:pt-40 lg:pb-28 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-primary/5 via-background to-background" />
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[500px] h-[500px] bg-primary/8 rounded-full blur-[100px]" />
        <div className="relative max-w-4xl mx-auto px-6 lg:px-8 text-center">
          <div className="inline-block mb-4 px-3 py-1 rounded-full border border-border text-xs text-muted uppercase tracking-wider">
            Case Study
          </div>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight">
            Halleman Construction <span className="gradient-text">LLC</span>
          </h1>
          <p className="mt-6 text-lg text-muted max-w-2xl mx-auto leading-relaxed">
            How a Eugene contractor went from missing leads to capturing every inquiry with a custom lead management system.
          </p>
        </div>
      </section>

      {/* Client Overview */}
      <section className="py-24 lg:py-32 border-t border-border">
        <div className="max-w-4xl mx-auto px-6 lg:px-8">
          <h2 className="text-3xl font-bold tracking-tight mb-10">Client Overview</h2>
          <div className="grid sm:grid-cols-2 gap-6">
            <div className="bg-surface rounded-2xl p-6 border border-border">
              <h3 className="text-xs font-semibold text-muted uppercase tracking-wider">Company</h3>
              <p className="font-bold text-lg mt-2">Halleman Construction LLC</p>
            </div>
            <div className="bg-surface rounded-2xl p-6 border border-border">
              <h3 className="text-xs font-semibold text-muted uppercase tracking-wider">Services</h3>
              <p className="mt-2 text-muted-light">Tile, Kitchen Remodel, Bathroom, Decks, Patios</p>
            </div>
            <div className="bg-surface rounded-2xl p-6 border border-border">
              <h3 className="text-xs font-semibold text-muted uppercase tracking-wider">Location</h3>
              <p className="mt-2 text-muted-light">Eugene, Cottage Grove, Veneta, Coburg</p>
            </div>
            <div className="bg-surface rounded-2xl p-6 border border-border">
              <h3 className="text-xs font-semibold text-muted uppercase tracking-wider">Website</h3>
              <a href="https://hallemanconstructionllc.com" target="_blank" rel="noopener noreferrer" className="text-primary hover:text-primary-light font-medium mt-2 inline-block transition-colors">
                hallemanconstructionllc.com
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* The Problem */}
      <section className="py-24 lg:py-32 bg-surface border-t border-border">
        <div className="max-w-4xl mx-auto px-6 lg:px-8">
          <h2 className="text-3xl font-bold tracking-tight mb-10">The Problem</h2>
          <div className="bg-background rounded-2xl p-8 border border-red-500/20">
            <ul className="space-y-4">
              {[
                "Old site had a basic contact form that only sent emails — leads were lost in spam or missed entirely",
                "No lead tracking system — no way to know which inquiries were new, followed up, or converted",
                "No project estimator — had to call every customer back to discuss scope and budget",
                "Limited SEO — not ranking for local searches like 'tile installer Eugene'",
                "Missing leads when on job sites — by the time he checked email, customers had moved on",
              ].map((item) => (
                <li key={item} className="flex items-start gap-3">
                  <span className="text-red-400 mt-0.5 flex-shrink-0">&#x2717;</span>
                  <span className="text-muted">{item}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* The Solution */}
      <section className="py-24 lg:py-32 border-t border-border">
        <div className="max-w-4xl mx-auto px-6 lg:px-8">
          <h2 className="text-3xl font-bold tracking-tight mb-4">The Solution</h2>
          <p className="text-muted mb-10">
            I built a custom lead management system that replaced the basic website with a full business tool:
          </p>
          <div className="grid sm:grid-cols-2 gap-6 stagger-children">
            {[
              { title: "Lead Database", desc: "Every inquiry is captured and stored in a database — no more lost leads in email." },
              { title: "Admin Dashboard", desc: "Track lead status, add notes, filter by service type, and export data anytime." },
              { title: "Project Estimator", desc: "Customers get instant rough quotes. Budget and timeline info captured upfront." },
              { title: "20 Local SEO Pages", desc: "City and service-specific pages targeting searches like 'tile installer Eugene'." },
              { title: "Automated Responses", desc: "Instant email confirmations when leads come in. SMS notifications for the team." },
              { title: "Mobile-First Design", desc: "Fast, responsive design that works perfectly on phones, tablets, and desktops." },
            ].map((item) => (
              <div key={item.title} className="bg-surface rounded-2xl p-6 border border-secondary/20 card-glow">
                <h3 className="font-bold text-secondary">{item.title}</h3>
                <p className="text-muted text-sm mt-2 leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Before / After */}
      <section className="py-24 lg:py-32 bg-surface border-t border-border">
        <div className="max-w-4xl mx-auto px-6 lg:px-8">
          <h2 className="text-3xl md:text-4xl font-bold tracking-tight text-center mb-16">Before &amp; After</h2>
          <div className="grid md:grid-cols-2 gap-6">
            <div className="bg-background rounded-2xl p-8 border border-red-500/20">
              <h3 className="text-sm font-bold text-red-400 mb-5 uppercase tracking-wider">Before</h3>
              <ul className="space-y-3 text-sm">
                <li className="flex items-start gap-3"><span className="text-red-400">&#x2717;</span> <span className="text-muted">Basic contact form to email</span></li>
                <li className="flex items-start gap-3"><span className="text-red-400">&#x2717;</span> <span className="text-muted">No lead tracking</span></li>
                <li className="flex items-start gap-3"><span className="text-red-400">&#x2717;</span> <span className="text-muted">No project estimator</span></li>
                <li className="flex items-start gap-3"><span className="text-red-400">&#x2717;</span> <span className="text-muted">Limited SEO (not ranking locally)</span></li>
                <li className="flex items-start gap-3"><span className="text-red-400">&#x2717;</span> <span className="text-muted">Missing leads on job sites</span></li>
                <li className="flex items-start gap-3"><span className="text-red-400">&#x2717;</span> <span className="text-muted">Manual follow-up process</span></li>
              </ul>
            </div>
            <div className="bg-background rounded-2xl p-8 border border-secondary/20">
              <h3 className="text-sm font-bold text-secondary mb-5 uppercase tracking-wider">After</h3>
              <ul className="space-y-3 text-sm">
                <li className="flex items-start gap-3"><span className="text-secondary">&#10003;</span> <span className="text-muted">Lead database captures every inquiry</span></li>
                <li className="flex items-start gap-3"><span className="text-secondary">&#10003;</span> <span className="text-muted">Full admin dashboard with tracking</span></li>
                <li className="flex items-start gap-3"><span className="text-secondary">&#10003;</span> <span className="text-muted">Project estimator for instant quotes</span></li>
                <li className="flex items-start gap-3"><span className="text-secondary">&#10003;</span> <span className="text-muted">20 SEO pages ranking locally</span></li>
                <li className="flex items-start gap-3"><span className="text-secondary">&#10003;</span> <span className="text-muted">100% lead capture rate</span></li>
                <li className="flex items-start gap-3"><span className="text-secondary">&#10003;</span> <span className="text-muted">Automated email responses</span></li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Tech Stack & Details */}
      <section className="py-24 lg:py-32 border-t border-border">
        <div className="max-w-4xl mx-auto px-6 lg:px-8">
          <div className="grid sm:grid-cols-2 gap-16">
            <div>
              <h2 className="text-2xl font-bold tracking-tight mb-6">Tech Stack</h2>
              <ul className="space-y-3 text-sm">
                {[
                  "Next.js (React framework, server-side rendering)",
                  ".NET C# API (secure backend)",
                  "MSSQL Database (reliable data storage)",
                  "Brevo (email automation)",
                  "Twilio (SMS notifications)",
                  "Vercel (frontend hosting)",
                ].map((item) => (
                  <li key={item} className="flex items-start gap-3">
                    <span className="text-primary mt-0.5">&#x2022;</span>
                    <span className="text-muted">{item}</span>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <h2 className="text-2xl font-bold tracking-tight mb-6">Project Details</h2>
              <dl className="space-y-5 text-sm">
                <div>
                  <dt className="text-muted text-xs uppercase tracking-wider font-semibold">Timeline</dt>
                  <dd className="mt-1 text-muted-light">1 month from start to launch</dd>
                </div>
                <div>
                  <dt className="text-muted text-xs uppercase tracking-wider font-semibold">Investment</dt>
                  <dd className="mt-1 text-muted-light">$300 (discounted first client rate, now $800+)</dd>
                </div>
                <div>
                  <dt className="text-muted text-xs uppercase tracking-wider font-semibold">Ongoing Cost</dt>
                  <dd className="mt-1 text-muted-light">$3/month (hosting &amp; support)</dd>
                </div>
              </dl>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-24 lg:py-32 bg-surface border-t border-border relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-primary/5 to-transparent" />
        <div className="relative max-w-3xl mx-auto px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold tracking-tight mb-4">Want Results Like This?</h2>
          <p className="text-muted mb-10">
            Get a free audit of your current website. I&apos;ll show you exactly how a lead management system can help your contracting business.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/contact" className="bg-primary hover:bg-primary-dark text-white px-8 py-4 rounded-full text-base font-medium transition-all duration-200 hover:shadow-[0_0_30px_rgba(99,102,241,0.3)]">
              Get Your Free Audit
            </Link>
            <Link href="/pricing" className="border border-border hover:border-muted text-foreground px-8 py-4 rounded-full text-base font-medium transition-all duration-200 hover:bg-surface-light">
              See Pricing
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
