import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "About digitalheavyweights Inc | Travis | Eugene Web Developer",
  description:
    "Meet Travis, founder of digitalheavyweights Inc. Local Eugene web developer specializing in lead management systems for contractors.",
  openGraph: {
    title: "About digitalheavyweights Inc | Travis | Eugene Web Developer",
    description:
      "Meet Travis, founder of digitalheavyweights Inc. Local Eugene web developer specializing in lead management systems for contractors.",
    url: "https://digitalheavyweights.com/about",
    type: "profile",
  },
  twitter: {
    card: "summary_large_image",
    title: "About digitalheavyweights Inc | Travis | Eugene Web Developer",
    description:
      "Meet Travis, founder of digitalheavyweights Inc. Local Eugene web developer specializing in lead management systems for contractors.",
  },
  alternates: {
    canonical: "/about",
  },
  keywords: [
    "Travis",
    "Eugene web developer",
    "digitalheavyweights Inc founder",
    "Lane County web developer",
    "contractor website developer",
    "Oregon web developer",
    "local web developer Eugene",
  ],
};

export default function AboutPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Person",
            name: "Travis",
            jobTitle: "Founder",
            worksFor: {
              "@type": "Organization",
              name: "digitalheavyweights Inc",
              url: "https://digitalheavyweights.com",
            },
            url: "https://digitalheavyweights.com/about",
            address: {
              "@type": "PostalAddress",
              addressLocality: "Eugene",
              addressRegion: "OR",
              addressCountry: "US",
            },
            alumniOf: [
              {
                "@type": "EducationalOrganization",
                name: "Lane Community College",
              },
              {
                "@type": "EducationalOrganization",
                name: "University of Oregon",
              },
            ],
            knowsAbout: [
              "Web Development",
              "Lead Management Systems",
              "Contractor Websites",
              "Local SEO",
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
            About
          </div>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight">
            About <span className="gradient-text">digitalheavyweights Inc</span>
          </h1>
          <p className="mt-6 text-lg text-muted max-w-2xl mx-auto leading-relaxed">
            Local Eugene web developer specializing in lead management systems for contractors.
          </p>
        </div>
      </section>

      {/* Who I Am */}
      <section className="py-24 lg:py-32 border-t border-border">
        <div className="max-w-4xl mx-auto px-6 lg:px-8">
          <div className="grid md:grid-cols-2 gap-12 items-start">
            <div>
              <h2 className="text-3xl font-bold tracking-tight mb-6">Who I Am</h2>
              <div className="space-y-4 text-muted leading-relaxed">
                <p>
                  I&apos;m Travis, founder of digitalheavyweights Inc, based in Eugene, Oregon. I build lead management systems specifically designed for local contractors.
                </p>
                <p>
                  My background includes an AAS in Software Development from Lane Community College and a BS in Art &amp; Technology from the University of Oregon. I&apos;ve worked in data analysis and software development, and I&apos;m now building a multi-division tech company focused on helping local businesses grow.
                </p>
                <p>
                  I saw contractors struggling with outdated websites, missed leads, and no way to track inquiries. So I built a solution — a custom lead management system that captures every inquiry, automates responses, and helps contractors close more deals.
                </p>
              </div>
            </div>
            <div className="bg-surface rounded-2xl p-8 border border-border">
              <h3 className="font-bold text-lg mb-5">Quick Facts</h3>
              <ul className="space-y-4 text-sm">
                <li className="flex items-start gap-3">
                  <span className="text-primary font-bold text-xs uppercase tracking-wider mt-0.5">Location</span>
                  <span className="text-muted">Eugene, Oregon</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-primary font-bold text-xs uppercase tracking-wider mt-0.5">Education</span>
                  <span className="text-muted">AAS Software Development (LCC), BS Art &amp; Technology (UO)</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-primary font-bold text-xs uppercase tracking-wider mt-0.5">Focus</span>
                  <span className="text-muted">Contractor lead management systems</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-primary font-bold text-xs uppercase tracking-wider mt-0.5">Serving</span>
                  <span className="text-muted">Eugene, Lane County, and surrounding areas</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Why I Built This */}
      <section className="py-24 lg:py-32 bg-surface border-t border-border">
        <div className="max-w-3xl mx-auto px-6 lg:px-8">
          <h2 className="text-3xl md:text-4xl font-bold tracking-tight text-center mb-12">Why I Built This</h2>
          <div className="space-y-6 text-muted leading-relaxed">
            <p>
              Most contractors I talked to had the same problems: a basic website with a contact form that sent emails they never checked, no way to track leads, and zero visibility into which inquiries turned into jobs.
            </p>
            <p>
              Meanwhile, the solutions on the market were either too expensive (agencies charging $5,000+) or too generic (SaaS tools like Jobber at $50-100/month that don&apos;t integrate with your website).
            </p>
            <p>
              I built a system that solves all of this for a fraction of the cost: a custom website with a built-in lead database, admin dashboard, project estimator, and local SEO — all for a one-time fee of $800 and just $3/month ongoing.
            </p>
          </div>
        </div>
      </section>

      {/* What Makes digitalheavyweights Different */}
      <section className="py-24 lg:py-32 border-t border-border">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <h2 className="text-3xl md:text-4xl font-bold tracking-tight text-center mb-16">What Makes digitalheavyweights Different</h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 stagger-children">
            {[
              { title: "Local", desc: "Based in Eugene. I understand the local market and what contractors here need." },
              { title: "Custom-Built", desc: "Not templates. Every system is built specifically for your business and services." },
              { title: "Affordable", desc: "One-time $800 instead of $100+/month SaaS fees. You save thousands over time." },
              { title: "Full Ownership", desc: "You own the code, the content, and the domain. No vendor lock-in, ever." },
            ].map((item) => (
              <div key={item.title} className="bg-surface rounded-2xl p-8 border border-border text-center card-glow">
                <h3 className="font-bold text-lg">{item.title}</h3>
                <p className="text-muted text-sm mt-3 leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* My Approach */}
      <section className="py-24 lg:py-32 bg-surface border-t border-border">
        <div className="max-w-4xl mx-auto px-6 lg:px-8">
          <h2 className="text-3xl md:text-4xl font-bold tracking-tight text-center mb-16">My Approach</h2>
          <div className="grid sm:grid-cols-2 gap-6">
            {[
              { title: "Transparent Pricing", desc: "You know exactly what you're paying. No surprise invoices, no scope creep charges." },
              { title: "Fast Delivery", desc: "Most projects launch in 2-3 weeks. Your lead management system is up and running fast." },
              { title: "Ongoing Support", desc: "Questions after launch? I'm here. $3/month covers hosting and ongoing support." },
              { title: "You Own Everything", desc: "Code, content, domain — it's all yours. Want to move to another developer later? No problem." },
            ].map((item) => (
              <div key={item.title} className="bg-background rounded-2xl p-6 border border-border card-glow">
                <h3 className="font-semibold">{item.title}</h3>
                <p className="text-muted text-sm mt-2 leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-24 lg:py-32 border-t border-border relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-primary/5 to-transparent" />
        <div className="relative max-w-3xl mx-auto px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold tracking-tight mb-4">Let&apos;s Talk About Your Business</h2>
          <p className="text-muted mb-10">
            Get a free audit of your current website. I&apos;ll show you what&apos;s costing you leads and how to fix it.
          </p>
          <Link href="/contact" className="inline-block bg-primary hover:bg-primary-dark text-white px-10 py-4 rounded-full text-lg font-medium transition-all duration-200 hover:shadow-[0_0_30px_rgba(99,102,241,0.3)]">
            Get Your Free Audit
          </Link>
        </div>
      </section>
    </>
  );
}
