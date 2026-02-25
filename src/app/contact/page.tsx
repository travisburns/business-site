import type { Metadata } from "next";
import ContactForm from "@/components/forms/ContactForm";

export const metadata: Metadata = {
  title: "Contact digitalheavyweights Inc | Free Website Audit for Eugene Contractors",
  description:
    "Get a free website audit. See what's costing you leads. Eugene, OR web developer specializing in contractor lead management.",
  openGraph: {
    title: "Contact digitalheavyweights Inc | Free Website Audit for Eugene Contractors",
    description:
      "Get a free website audit. See what's costing you leads. Eugene, OR web developer specializing in contractor lead management.",
    url: "https://digitalheavyweights.com/contact",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Contact digitalheavyweights Inc | Free Website Audit for Eugene Contractors",
    description:
      "Get a free website audit. See what's costing you leads. Eugene, OR web developer specializing in contractor lead management.",
  },
  alternates: {
    canonical: "/contact",
  },
  keywords: [
    "free website audit",
    "contact contractor developer",
    "Eugene contractor consultation",
    "free lead management audit",
    "contractor website review",
    "digitalheavyweights Inc contact",
  ],
};

export default function ContactPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "ContactPage",
            name: "Contact digitalheavyweights Inc",
            description:
              "Get a free website audit. See what's costing you leads.",
            url: "https://digitalheavyweights.com/contact",
            mainEntity: {
              "@type": "Organization",
              name: "digitalheavyweights Inc",
              url: "https://digitalheavyweights.com",
              email: "travis@digitalheavyweights.com",
              address: {
                "@type": "PostalAddress",
                addressLocality: "Eugene",
                addressRegion: "OR",
                addressCountry: "US",
              },
              openingHoursSpecification: {
                "@type": "OpeningHoursSpecification",
                dayOfWeek: [
                  "Monday",
                  "Tuesday",
                  "Wednesday",
                  "Thursday",
                  "Friday",
                ],
                opens: "09:00",
                closes: "18:00",
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
            Contact
          </div>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight">
            Get Your <span className="gradient-text">Free Audit</span>
          </h1>
          <p className="mt-6 text-lg text-muted max-w-2xl mx-auto leading-relaxed">
            I&apos;ll review your current website and show you exactly
            what&apos;s costing you leads — and how to fix it.
          </p>
        </div>
      </section>

      {/* Contact Form + Info */}
      <section className="py-24 lg:py-32 border-t border-border">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-16">
            <div>
              <h2 className="text-2xl font-bold tracking-tight mb-8">
                Tell Me About Your Business
              </h2>
              <ContactForm />
            </div>

            <div className="space-y-6">
              <div className="bg-surface rounded-2xl p-8 border border-border">
                <h3 className="font-bold text-lg mb-5">What Happens Next</h3>
                <ol className="space-y-5">
                  <li className="flex gap-4">
                    <span className="flex-shrink-0 w-8 h-8 bg-primary/10 text-primary rounded-full flex items-center justify-center text-xs font-bold border border-primary/20">1</span>
                    <span className="text-muted text-sm pt-1">I&apos;ll review your current website (or discuss your needs if you don&apos;t have one yet).</span>
                  </li>
                  <li className="flex gap-4">
                    <span className="flex-shrink-0 w-8 h-8 bg-primary/10 text-primary rounded-full flex items-center justify-center text-xs font-bold border border-primary/20">2</span>
                    <span className="text-muted text-sm pt-1">Within 48 hours, I&apos;ll send you a detailed audit showing what&apos;s costing you leads.</span>
                  </li>
                  <li className="flex gap-4">
                    <span className="flex-shrink-0 w-8 h-8 bg-primary/10 text-primary rounded-full flex items-center justify-center text-xs font-bold border border-primary/20">3</span>
                    <span className="text-muted text-sm pt-1">We&apos;ll discuss solutions and next steps — no pressure, no commitment.</span>
                  </li>
                </ol>
              </div>

              <div className="bg-surface rounded-2xl p-8 border border-border">
                <h3 className="font-bold text-lg mb-4">Direct Contact</h3>
                <ul className="space-y-3 text-sm">
                  <li>
                    <span className="text-muted">Email: </span>
                    <a href="mailto:travis@digitalheavyweights.com" className="text-primary hover:text-primary-light transition-colors">travis@digitalheavyweights.com</a>
                  </li>
                  <li className="text-muted">Location: Eugene, Oregon</li>
                </ul>
              </div>

              <div className="bg-surface rounded-2xl p-8 border border-border">
                <h3 className="font-bold text-lg mb-4">Office Hours</h3>
                <ul className="space-y-2 text-sm text-muted">
                  <li>Monday - Friday, 9am - 6pm PST</li>
                  <li>Response time: Within 24 hours</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
