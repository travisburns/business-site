import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Project Estimator Tools for Contractors | digitalheavyweights Inc",
  description:
    "Give customers instant rough quotes with a project estimator built into your contractor website. Capture budget and timeline upfront.",
  openGraph: {
    title: "Project Estimator Tools for Contractors | digitalheavyweights Inc",
    description:
      "Give customers instant rough quotes with a project estimator built into your contractor website. Capture budget and timeline upfront.",
    url: "https://digitalheavyweights.com/project-estimator-contractors",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Project Estimator Tools for Contractors | digitalheavyweights Inc",
    description:
      "Give customers instant rough quotes with a project estimator built into your contractor website. Capture budget and timeline upfront.",
  },
  alternates: {
    canonical: "/project-estimator-contractors",
  },
  keywords: [
    "project estimator",
    "contractor estimate tool",
    "instant quote",
    "contractor website",
  ],
};

export default function ProjectEstimatorContractorsPage() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Service",
    name: "Project Estimator Tools for Contractors",
    description:
      "Give customers instant rough quotes with a project estimator built into your contractor website. Capture budget and timeline upfront.",
    provider: {
      "@type": "Organization",
      name: "digitalheavyweights Inc",
      url: "https://digitalheavyweights.com",
    },
    url: "https://digitalheavyweights.com/project-estimator-contractors",
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
            <span className="gradient-text">Project Estimator</span> Tools for Contractors
          </h1>
          <p className="mt-4 text-lg text-muted leading-relaxed max-w-2xl mx-auto">
            Let customers get instant rough quotes on your website. Capture
            budget and timeline info before you ever pick up the phone.
          </p>
          <Link
            href="/contact"
            className="inline-block mt-8 bg-primary hover:bg-primary-dark text-white px-8 py-4 rounded-full font-medium transition-all duration-200 hover:shadow-[0_0_30px_rgba(99,102,241,0.3)]"
          >
            Contact for a Demo
          </Link>
        </div>
      </section>

      {/* What Is a Project Estimator */}
      <section className="py-24 lg:py-32 bg-surface border-t border-border">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-foreground tracking-tight mb-6">
            What Is a <span className="gradient-text">Project Estimator</span>?
          </h2>
          <div className="space-y-4 text-muted leading-relaxed">
            <p>
              A project estimator is an interactive form on your website that
              lets customers describe their project and get an instant rough
              quote. They select their service type, enter dimensions or scope,
              choose materials, and see an estimated price range — all before
              contacting you.
            </p>
            <p>
              For you, it means every lead comes with budget and timeline
              information already attached. No more wasting time on calls just
              to learn the customer&apos;s budget is half your minimum.
            </p>
          </div>
        </div>
      </section>

      {/* Benefits */}
      <section className="py-24 lg:py-32 bg-background border-t border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-foreground tracking-tight text-center mb-12">
            Benefits for Your <span className="gradient-text">Business</span>
          </h2>
          <div className="grid sm:grid-cols-2 gap-8 max-w-4xl mx-auto stagger-children">
            {[
              {
                title: "Capture Budget Upfront",
                desc: "Know what the customer is willing to spend before you call them. Filter out tire-kickers and focus on serious leads.",
              },
              {
                title: "Reduce Back-and-Forth",
                desc: "Instead of 3-4 calls to understand the project scope, you already have dimensions, materials, and timeline from the estimator.",
              },
              {
                title: "Professional First Impression",
                desc: "An interactive estimator shows customers you're a professional operation, not just a guy with a truck. It builds trust instantly.",
              },
              {
                title: "24/7 Lead Capture",
                desc: "Customers can get estimates at midnight, on weekends, whenever. The estimator works around the clock, even when you're on a job site.",
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

      {/* How It Works */}
      <section className="py-24 lg:py-32 bg-surface border-t border-border">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-foreground tracking-tight text-center mb-12">
            How It <span className="gradient-text">Works</span>
          </h2>
          <div className="space-y-8 stagger-children">
            {[
              {
                step: "1",
                title: "Customer Selects Their Service",
                desc: "Tile installation, bathroom remodel, deck building — whatever services you offer. Each has its own estimator flow.",
              },
              {
                step: "2",
                title: "They Enter Project Details",
                desc: "Square footage, materials preferred, timeline, and any special requirements. The form adapts to the service type.",
              },
              {
                step: "3",
                title: "Instant Rough Estimate",
                desc: "Based on your pricing, they see an estimated price range. This sets expectations and qualifies the lead.",
              },
              {
                step: "4",
                title: "Lead Stored in Your Database",
                desc: "Their contact info and project details are stored in your lead database. You get notified. They get a confirmation email.",
              },
            ].map((item) => (
              <div key={item.step} className="flex gap-6 items-start">
                <div className="flex-shrink-0 w-12 h-12 bg-primary text-white rounded-full flex items-center justify-center text-xl font-bold">
                  {item.step}
                </div>
                <div>
                  <h3 className="font-bold text-lg text-foreground">{item.title}</h3>
                  <p className="text-muted mt-1 leading-relaxed">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Example */}
      <section className="py-24 lg:py-32 bg-background border-t border-border">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <span className="inline-block px-3 py-1 rounded-full border border-border text-xs text-muted uppercase tracking-wider">
            Case Study
          </span>
          <h2 className="mt-6 text-3xl font-bold text-foreground tracking-tight mb-6">
            Real Example: <span className="gradient-text">Halleman Construction</span>
          </h2>
          <p className="text-muted leading-relaxed mb-8 max-w-2xl mx-auto">
            I built a project estimator for Halleman Construction LLC in Eugene.
            Customers can get rough quotes for tile installation, kitchen
            remodels, bathroom renovations, decks, and patios — all directly on
            the website.
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
            Add a Project Estimator to Your <span className="gradient-text">Website</span>
          </h2>
          <p className="text-muted leading-relaxed mb-8">
            Available in our Standard ($1,200) and Premium ($1,800) packages.
            Contact me for a demo.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/contact"
              className="bg-primary hover:bg-primary-dark text-white px-8 py-4 rounded-full font-medium transition-all duration-200 hover:shadow-[0_0_30px_rgba(99,102,241,0.3)]"
            >
              Contact for Demo
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
