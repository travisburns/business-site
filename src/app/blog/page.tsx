import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Contractor Marketing Blog | Lead Generation Tips",
  description:
    "SEO tips, lead generation strategies, and web development insights for Eugene contractors.",
  openGraph: {
    title: "Contractor Marketing Blog | Lead Generation Tips",
    description:
      "SEO tips, lead generation strategies, and web development insights for Eugene contractors.",
    url: "https://digitalheavyweights.com/blog",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Contractor Marketing Blog | Lead Generation Tips",
    description:
      "SEO tips, lead generation strategies, and web development insights for Eugene contractors.",
  },
  alternates: {
    canonical: "/blog",
  },
  keywords: [
    "contractor marketing",
    "lead generation",
    "SEO tips",
    "Eugene",
  ],
};

const posts = [
  {
    slug: "5-reasons-eugene-contractors-lose-leads",
    title: "5 Reasons Eugene Contractors Lose Leads (And How to Fix It)",
    excerpt:
      "Most contractors are losing leads every week without realizing it. Here are the 5 biggest reasons — and simple fixes for each.",
    date: "February 15, 2026",
    readTime: "5 min read",
  },
  {
    slug: "lead-management-system-captures-more-customers",
    title:
      "How a Lead Management System Captures More Customers for Your Contracting Business",
    excerpt:
      "What is a lead management system, how does it work, and why does it capture more customers than a basic contact form?",
    date: "February 14, 2026",
    readTime: "6 min read",
  },
  {
    slug: "contractor-website-local-seo-eugene",
    title: "Why Your Contractor Website Needs Local SEO (Eugene Edition)",
    excerpt:
      "People search 'tile installer Eugene' every day. If you're not showing up, you're losing jobs to competitors who are.",
    date: "February 13, 2026",
    readTime: "5 min read",
  },
];

export default function BlogPage() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: "Contractor Marketing Blog | Lead Generation Tips",
    description:
      "SEO tips, lead generation strategies, and web development insights for Eugene contractors.",
    url: "https://digitalheavyweights.com/blog",
    mainEntity: {
      "@type": "Blog",
      name: "digitalheavyweights Contractor Marketing Blog",
      description:
        "SEO tips, lead generation strategies, and web development insights for Eugene contractors.",
      blogPost: posts.map((post) => ({
        "@type": "BlogPosting",
        headline: post.title,
        datePublished: post.date,
        url: `https://digitalheavyweights.com/blog/${post.slug}`,
      })),
    },
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
      <section className="relative pt-32 pb-20 lg:pt-40 lg:pb-28 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-primary/5 via-background to-background" />
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[500px] h-[500px] bg-primary/8 rounded-full blur-[100px]" />
        <div className="relative max-w-4xl mx-auto px-6 lg:px-8 text-center">
          <div className="inline-block mb-4 px-3 py-1 rounded-full border border-border text-xs text-muted uppercase tracking-wider">
            Blog
          </div>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight">
            Contractor Marketing
            <br />
            <span className="gradient-text">& Lead Generation</span>
          </h1>
          <p className="mt-6 text-lg text-muted max-w-2xl mx-auto leading-relaxed">
            SEO tips, lead generation strategies, and web development insights
            for Eugene contractors.
          </p>
        </div>
      </section>

      {/* Posts */}
      <section className="py-24 lg:py-32 border-t border-border">
        <div className="max-w-4xl mx-auto px-6 lg:px-8">
          <div className="space-y-6">
            {posts.map((post) => (
              <article
                key={post.slug}
                className="bg-surface rounded-2xl p-8 border border-border card-glow group"
              >
                <div className="flex items-center gap-3 text-sm text-muted mb-4">
                  <time>{post.date}</time>
                  <span className="w-1 h-1 bg-border rounded-full" />
                  <span>{post.readTime}</span>
                </div>
                <h2 className="text-xl md:text-2xl font-bold mb-3 group-hover:text-primary transition-colors duration-200">
                  <Link href={`/blog/${post.slug}`}>
                    {post.title}
                  </Link>
                </h2>
                <p className="text-muted leading-relaxed mb-5">{post.excerpt}</p>
                <Link
                  href={`/blog/${post.slug}`}
                  className="text-primary hover:text-primary-light font-medium text-sm transition-colors"
                >
                  Read More &rarr;
                </Link>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-24 lg:py-32 bg-surface border-t border-border relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-primary/5 to-transparent" />
        <div className="relative max-w-3xl mx-auto px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold tracking-tight mb-4">
            Want to Capture More Leads?
          </h2>
          <p className="text-muted mb-10">
            Get a free audit of your current website and see what&apos;s costing
            you customers.
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
