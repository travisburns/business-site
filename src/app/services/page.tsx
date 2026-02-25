import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Contractor Website Services | Lead Management Systems | Eugene, OR",
  description:
    "Custom contractor websites with lead tracking, project estimators, and local SEO. Starting at $800.",
  openGraph: {
    title: "Contractor Website Services | Lead Management Systems | Eugene, OR",
    description:
      "Custom contractor websites with lead tracking, project estimators, and local SEO. Starting at $800.",
    url: "https://digitalheavyweights.com/services",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Contractor Website Services | Lead Management Systems | Eugene, OR",
    description:
      "Custom contractor websites with lead tracking, project estimators, and local SEO. Starting at $800.",
  },
  alternates: {
    canonical: "/services",
  },
  keywords: [
    "contractor services",
    "lead database",
    "admin dashboard",
    "project estimator",
    "local SEO pages",
    "automated email responses",
    "contractor website features",
    "lead management system services",
  ],
};

export default function ServicesPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Service",
            serviceType: "Lead Management System for Contractors",
            provider: {
              "@type": "Organization",
              name: "digitalheavyweights Inc",
              url: "https://digitalheavyweights.com",
              areaServed: {
                "@type": "Place",
                name: "Eugene, Oregon",
              },
            },
            name: "Contractor Website Services",
            description:
              "Custom contractor websites with lead tracking, project estimators, admin dashboards, automated email responses, and local SEO pages.",
            url: "https://digitalheavyweights.com/services",
            offers: {
              "@type": "Offer",
              price: "800",
              priceCurrency: "USD",
              description: "Starting at $800 one-time build cost",
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
            Services
          </div>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight">
            Lead Management System
            <br />
            <span className="gradient-text">for Contractors</span>
          </h1>
          <p className="mt-6 text-lg text-muted max-w-2xl mx-auto leading-relaxed">
            Everything you need to capture, track, and convert leads — built custom for your contracting business.
          </p>
        </div>
      </section>

      {/* What You Get */}
      <section className="py-24 lg:py-32 border-t border-border">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold tracking-tight">What You Get</h2>
            <p className="mt-4 text-muted max-w-xl mx-auto">Every tool you need to capture more leads and grow your business.</p>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 stagger-children">
            {[
              { title: "Lead Database", desc: "Captures every inquiry from your website. No more leads lost to email spam folders or missed calls on job sites." },
              { title: "Admin Dashboard", desc: "Track lead status, add notes, filter by service type, and export to CSV. See all your leads in one place." },
              { title: "Project Estimator", desc: "Customers fill out a form and get an instant rough quote. You capture budget and timeline info upfront." },
              { title: "Automated Responses", desc: "Email and SMS notifications go out instantly when a new lead comes in. Professional response every time." },
              { title: "20 Local SEO Pages", desc: "City-specific pages targeting searches like 'tile installer Eugene' or 'bathroom remodel Cottage Grove'." },
              { title: "Mobile-First Design", desc: "Responsive, fast-loading, touch-friendly. Looks great on phones, tablets, and desktops." },
            ].map((item) => (
              <div key={item.title} className="bg-surface rounded-2xl p-8 border border-border card-glow group">
                <h3 className="font-bold text-lg group-hover:text-primary transition-colors duration-200">{item.title}</h3>
                <p className="text-muted text-sm mt-3 leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-24 lg:py-32 bg-surface border-t border-border">
        <div className="max-w-3xl mx-auto px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold tracking-tight">How It Works</h2>
            <p className="mt-4 text-muted">From first contact to closed deal — automated.</p>
          </div>
          <div className="space-y-8">
            {[
              { step: "01", title: "Customer Fills Out Project Estimator", desc: "They choose their service, enter project details, and get an instant rough estimate. You capture their info automatically." },
              { step: "02", title: "Lead Stored & Automated Emails Sent", desc: "The lead is stored in your database instantly. The customer gets a confirmation email. You get a notification." },
              { step: "03", title: "Manage Leads in Admin Dashboard", desc: "Log in to your dashboard to see all leads. Filter by status, service type, or date. Add notes as you follow up." },
              { step: "04", title: "Track, Follow Up, Close Deals", desc: "Update lead status as you move them through your pipeline. Never lose track of a potential project again." },
            ].map((item) => (
              <div key={item.step} className="flex gap-6 items-start group">
                <div className="flex-shrink-0 w-14 h-14 bg-background border border-border rounded-2xl flex items-center justify-center text-primary font-bold text-sm group-hover:border-primary/50 transition-colors duration-200">
                  {item.step}
                </div>
                <div className="pt-1">
                  <h3 className="font-bold text-lg">{item.title}</h3>
                  <p className="text-muted mt-2 leading-relaxed">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Tech Stack */}
      <section className="py-24 lg:py-32 border-t border-border">
        <div className="max-w-4xl mx-auto px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold tracking-tight">Built with Modern Technology</h2>
            <p className="mt-4 text-muted">Enterprise-grade tools, contractor-friendly pricing.</p>
          </div>
          <div className="grid sm:grid-cols-2 gap-6">
            {[
              { title: "Next.js Frontend", desc: "Fast, SEO-friendly React framework. Server-side rendering for top search performance." },
              { title: ".NET C# Backend", desc: "Enterprise-grade, secure API. Industry standard for reliability." },
              { title: "MSSQL Database", desc: "Scalable, proven database. Your data is safe and accessible." },
              { title: "Brevo Email / Twilio SMS", desc: "Automated notifications through trusted platforms. Free tier available." },
            ].map((item) => (
              <div key={item.title} className="bg-surface rounded-2xl p-6 border border-border card-glow">
                <h3 className="font-semibold">{item.title}</h3>
                <p className="text-muted text-sm mt-2 leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing Preview */}
      <section className="py-24 lg:py-32 bg-surface border-t border-border">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold tracking-tight">Pricing</h2>
            <p className="mt-4 text-muted">Transparent. No hidden fees.</p>
          </div>
          <div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto">
            {[
              { name: "Basic", price: "$800", features: ["10 pages", "Lead form + database", "Mobile-optimized", "On-page SEO + 5 local pages", "$3/month ongoing"], popular: false },
              { name: "Standard", price: "$1,200", features: ["25 pages (20 SEO pages)", "Project estimator", "Admin dashboard", "Automated email responses", "On-page SEO + 20 local pages", "$3/month ongoing"], popular: true },
              { name: "Premium", price: "$1,800", features: ["Everything in Standard", "Booking/scheduling system", "SMS notifications", "CRM integration", "Analytics dashboard", "Priority support", "$3/month ongoing"], popular: false },
            ].map((tier) => (
              <div key={tier.name} className={`rounded-2xl p-8 border relative ${tier.popular ? "border-primary bg-background shadow-[0_0_30px_rgba(99,102,241,0.1)]" : "border-border bg-background"}`}>
                {tier.popular && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-primary text-white text-xs font-medium px-4 py-1 rounded-full">
                    Most Popular
                  </div>
                )}
                <h3 className="text-xl font-bold">{tier.name}</h3>
                <div className="text-3xl font-bold text-primary mt-3">{tier.price}</div>
                <div className="text-muted text-sm">one-time</div>
                <ul className="mt-6 space-y-3">
                  {tier.features.map((f) => (
                    <li key={f} className="flex items-start gap-2.5 text-sm">
                      <span className="text-secondary mt-0.5">&#10003;</span>
                      <span className="text-muted-light">{f}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
          <div className="text-center mt-10">
            <Link href="/pricing" className="text-primary hover:text-primary-light font-medium text-sm transition-colors">
              See Full Pricing Details &rarr;
            </Link>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-24 lg:py-32 border-t border-border relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-primary/5 to-transparent" />
        <div className="relative max-w-3xl mx-auto px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold tracking-tight mb-4">Ready to Get Started?</h2>
          <p className="text-muted mb-10">
            Get a free audit of your current website and see what a lead management system can do for your business.
          </p>
          <Link href="/contact" className="inline-block bg-primary hover:bg-primary-dark text-white px-10 py-4 rounded-full text-lg font-medium transition-all duration-200 hover:shadow-[0_0_30px_rgba(99,102,241,0.3)]">
            Get Your Free Audit
          </Link>
        </div>
      </section>
    </>
  );
}
