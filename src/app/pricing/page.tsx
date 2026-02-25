import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Contractor Website Pricing | $800-1800 | Eugene, OR",
  description:
    "Transparent pricing for contractor lead management systems. Starting at $800 one-time, $3/month ongoing.",
  openGraph: {
    title: "Contractor Website Pricing | $800-1800 | Eugene, OR",
    description:
      "Transparent pricing for contractor lead management systems. Starting at $800 one-time, $3/month ongoing.",
    url: "https://digitalheavyweights.com/pricing",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Contractor Website Pricing | $800-1800 | Eugene, OR",
    description:
      "Transparent pricing for contractor lead management systems. Starting at $800 one-time, $3/month ongoing.",
  },
  alternates: {
    canonical: "/pricing",
  },
  keywords: [
    "contractor website pricing",
    "affordable contractor website",
    "lead management system cost",
    "cheap contractor website",
    "website pricing Eugene OR",
    "contractor web design rates",
  ],
};

export default function PricingPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "ItemList",
            name: "Contractor Website Pricing Tiers",
            url: "https://digitalheavyweights.com/pricing",
            itemListElement: [
              {
                "@type": "ListItem",
                position: 1,
                item: {
                  "@type": "Product",
                  name: "Basic",
                  description:
                    "10 pages, contact form with lead database, mobile-optimized design, on-page SEO + 5 local pages, Google Analytics setup.",
                  offers: {
                    "@type": "Offer",
                    price: "800",
                    priceCurrency: "USD",
                    priceSpecification: [
                      {
                        "@type": "UnitPriceSpecification",
                        price: "800",
                        priceCurrency: "USD",
                        unitText: "one-time",
                      },
                      {
                        "@type": "UnitPriceSpecification",
                        price: "3",
                        priceCurrency: "USD",
                        unitText: "monthly",
                        billingDuration: "P1M",
                      },
                    ],
                  },
                },
              },
              {
                "@type": "ListItem",
                position: 2,
                item: {
                  "@type": "Product",
                  name: "Standard",
                  description:
                    "25 pages with 20 SEO pages, project estimator tool, admin dashboard, automated email responses, on-page SEO + 20 local pages, Google Business Profile setup.",
                  offers: {
                    "@type": "Offer",
                    price: "1200",
                    priceCurrency: "USD",
                    priceSpecification: [
                      {
                        "@type": "UnitPriceSpecification",
                        price: "1200",
                        priceCurrency: "USD",
                        unitText: "one-time",
                      },
                      {
                        "@type": "UnitPriceSpecification",
                        price: "3",
                        priceCurrency: "USD",
                        unitText: "monthly",
                        billingDuration: "P1M",
                      },
                    ],
                  },
                },
              },
              {
                "@type": "ListItem",
                position: 3,
                item: {
                  "@type": "Product",
                  name: "Premium",
                  description:
                    "Everything in Standard plus booking/scheduling system, SMS notifications, CRM integration, analytics dashboard, and priority support.",
                  offers: {
                    "@type": "Offer",
                    price: "1800",
                    priceCurrency: "USD",
                    priceSpecification: [
                      {
                        "@type": "UnitPriceSpecification",
                        price: "1800",
                        priceCurrency: "USD",
                        unitText: "one-time",
                      },
                      {
                        "@type": "UnitPriceSpecification",
                        price: "3",
                        priceCurrency: "USD",
                        unitText: "monthly",
                        billingDuration: "P1M",
                      },
                    ],
                  },
                },
              },
            ],
          }),
        }}
      />
      {/* Hero */}
      <section className="relative pt-32 pb-20 lg:pt-40 lg:pb-28 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-primary/5 via-background to-background" />
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[500px] h-[500px] bg-primary/8 rounded-full blur-[100px]" />
        <div className="relative max-w-4xl mx-auto px-6 lg:px-8 text-center">
          <div className="inline-block mb-4 px-3 py-1 rounded-full border border-border text-xs text-muted uppercase tracking-wider">
            Pricing
          </div>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight">
            Transparent Pricing.
            <br />
            <span className="gradient-text">No Hidden Fees.</span>
          </h1>
          <p className="mt-6 text-lg text-muted max-w-2xl mx-auto leading-relaxed">
            One-time build cost plus minimal ongoing hosting. You know exactly what you&apos;re paying.
          </p>
        </div>
      </section>

      {/* Pricing Tiers */}
      <section className="py-24 lg:py-32 border-t border-border">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto">
            {/* Basic */}
            <div className="rounded-2xl p-8 border border-border bg-surface card-glow">
              <h2 className="text-2xl font-bold">Basic</h2>
              <div className="text-4xl font-bold gradient-text mt-3">$800</div>
              <div className="text-muted text-sm mt-1">one-time + $3/month ongoing</div>
              <ul className="mt-8 space-y-3">
                {[
                  "10 pages (Home, About, Services, Contact, Gallery, 5 SEO pages)",
                  "Contact form with lead database",
                  "Mobile-optimized design",
                  "On-page SEO + 5 local pages",
                  "Google Analytics setup",
                ].map((f) => (
                  <li key={f} className="flex items-start gap-2.5 text-sm">
                    <span className="text-secondary mt-0.5 flex-shrink-0">&#10003;</span>
                    <span className="text-muted-light">{f}</span>
                  </li>
                ))}
              </ul>
              <Link href="/contact" className="block mt-8 text-center border border-border hover:border-primary text-foreground px-6 py-3.5 rounded-full font-medium transition-all duration-200">
                Get Started
              </Link>
            </div>

            {/* Standard */}
            <div className="rounded-2xl p-8 border border-primary bg-surface relative shadow-[0_0_40px_rgba(99,102,241,0.1)]">
              <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-primary text-white text-xs font-medium px-4 py-1 rounded-full">
                Most Popular
              </div>
              <h2 className="text-2xl font-bold">Standard</h2>
              <div className="text-4xl font-bold gradient-text mt-3">$1,200</div>
              <div className="text-muted text-sm mt-1">one-time + $3/month ongoing</div>
              <ul className="mt-8 space-y-3">
                {[
                  "25 pages (everything in Basic + 20 SEO pages)",
                  "Project estimator tool",
                  "Admin dashboard (lead management)",
                  "Automated email responses (Brevo)",
                  "On-page SEO + 20 local pages",
                  "Google Business Profile setup",
                ].map((f) => (
                  <li key={f} className="flex items-start gap-2.5 text-sm">
                    <span className="text-secondary mt-0.5 flex-shrink-0">&#10003;</span>
                    <span className="text-muted-light">{f}</span>
                  </li>
                ))}
              </ul>
              <Link href="/contact" className="block mt-8 text-center bg-primary hover:bg-primary-dark text-white px-6 py-3.5 rounded-full font-medium transition-all duration-200 hover:shadow-[0_0_20px_rgba(99,102,241,0.3)]">
                Get Started
              </Link>
            </div>

            {/* Premium */}
            <div className="rounded-2xl p-8 border border-border bg-surface card-glow">
              <h2 className="text-2xl font-bold">Premium</h2>
              <div className="text-4xl font-bold gradient-text mt-3">$1,800</div>
              <div className="text-muted text-sm mt-1">one-time + $3/month ongoing</div>
              <ul className="mt-8 space-y-3">
                {[
                  "Everything in Standard",
                  "Booking/scheduling system",
                  "SMS notifications (Twilio)",
                  "CRM integration (export to tools)",
                  "Analytics dashboard",
                  "Priority support",
                ].map((f) => (
                  <li key={f} className="flex items-start gap-2.5 text-sm">
                    <span className="text-secondary mt-0.5 flex-shrink-0">&#10003;</span>
                    <span className="text-muted-light">{f}</span>
                  </li>
                ))}
              </ul>
              <Link href="/contact" className="block mt-8 text-center border border-border hover:border-primary text-foreground px-6 py-3.5 rounded-full font-medium transition-all duration-200">
                Get Started
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Add-Ons */}
      <section className="py-24 lg:py-32 bg-surface border-t border-border">
        <div className="max-w-4xl mx-auto px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold tracking-tight">Add-Ons</h2>
            <p className="mt-4 text-muted">Extend your system with additional services.</p>
          </div>
          <div className="grid sm:grid-cols-3 gap-6">
            {[
              { title: "Google Business Profile Setup", price: "$100" },
              { title: "Directory Submissions (Yelp, Angi, etc.)", price: "$150" },
              { title: "Monthly SEO Blog Post", price: "$200/month" },
            ].map((addon) => (
              <div key={addon.title} className="bg-background rounded-2xl p-6 border border-border text-center card-glow">
                <h3 className="font-semibold text-sm">{addon.title}</h3>
                <div className="text-2xl font-bold text-primary mt-3">{addon.price}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Comparison */}
      <section className="py-24 lg:py-32 border-t border-border">
        <div className="max-w-4xl mx-auto px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold tracking-tight">How We Compare</h2>
            <p className="mt-4 text-muted">See how digitalheavyweights stacks up against the alternatives.</p>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border">
                  <th className="text-left py-4 pr-4 text-muted font-medium"></th>
                  <th className="text-center py-4 px-4 text-primary font-bold">digitalheavyweights Inc</th>
                  <th className="text-center py-4 px-4 text-muted font-medium">DIY (Squarespace)</th>
                  <th className="text-center py-4 px-4 text-muted font-medium">Agency</th>
                  <th className="text-center py-4 px-4 text-muted font-medium">CRM Tools (Jobber)</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                <tr>
                  <td className="py-4 pr-4 font-medium">Upfront Cost</td>
                  <td className="text-center py-4 px-4 text-primary font-semibold">$800-1,800</td>
                  <td className="text-center py-4 px-4 text-muted">$0 + your time</td>
                  <td className="text-center py-4 px-4 text-muted">$5,000-10,000</td>
                  <td className="text-center py-4 px-4 text-muted">$0</td>
                </tr>
                <tr>
                  <td className="py-4 pr-4 font-medium">Monthly Cost</td>
                  <td className="text-center py-4 px-4 text-primary font-semibold">$3/month</td>
                  <td className="text-center py-4 px-4 text-muted">$40+/month</td>
                  <td className="text-center py-4 px-4 text-muted">$100+/month</td>
                  <td className="text-center py-4 px-4 text-muted">$50-100/month</td>
                </tr>
                <tr>
                  <td className="py-4 pr-4 font-medium">Lead Management</td>
                  <td className="text-center py-4 px-4 text-secondary font-semibold">&#10003;</td>
                  <td className="text-center py-4 px-4 text-red-400">&#10007;</td>
                  <td className="text-center py-4 px-4 text-secondary">&#10003;</td>
                  <td className="text-center py-4 px-4 text-secondary">&#10003;</td>
                </tr>
                <tr>
                  <td className="py-4 pr-4 font-medium">Local SEO Pages</td>
                  <td className="text-center py-4 px-4 text-secondary font-semibold">&#10003;</td>
                  <td className="text-center py-4 px-4 text-red-400">&#10007;</td>
                  <td className="text-center py-4 px-4 text-secondary">&#10003;</td>
                  <td className="text-center py-4 px-4 text-red-400">&#10007;</td>
                </tr>
                <tr>
                  <td className="py-4 pr-4 font-medium">Custom Built</td>
                  <td className="text-center py-4 px-4 text-secondary font-semibold">&#10003;</td>
                  <td className="text-center py-4 px-4 text-red-400">Template</td>
                  <td className="text-center py-4 px-4 text-secondary">&#10003;</td>
                  <td className="text-center py-4 px-4 text-red-400">&#10007;</td>
                </tr>
                <tr>
                  <td className="py-4 pr-4 font-medium">You Own Everything</td>
                  <td className="text-center py-4 px-4 text-secondary font-semibold">&#10003;</td>
                  <td className="text-center py-4 px-4 text-red-400">&#10007;</td>
                  <td className="text-center py-4 px-4 text-muted">Varies</td>
                  <td className="text-center py-4 px-4 text-red-400">&#10007;</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-24 lg:py-32 bg-surface border-t border-border relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-primary/5 to-transparent" />
        <div className="relative max-w-3xl mx-auto px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold tracking-tight mb-4">Ready to Get Started?</h2>
          <p className="text-muted mb-10">
            Get a free audit of your current website. No commitment, no pressure.
          </p>
          <Link href="/contact" className="inline-block bg-primary hover:bg-primary-dark text-white px-10 py-4 rounded-full text-lg font-medium transition-all duration-200 hover:shadow-[0_0_30px_rgba(99,102,241,0.3)]">
            Get Your Free Audit
          </Link>
        </div>
      </section>
    </>
  );
}
