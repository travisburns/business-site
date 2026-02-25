import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";

type BlogPost = {
  title: string;
  meta: string;
  date: string;
  readTime: string;
  content: React.ReactNode;
};

const posts: Record<string, BlogPost> = {
  "5-reasons-eugene-contractors-lose-leads": {
    title: "5 Reasons Eugene Contractors Lose Leads (And How to Fix It)",
    meta: "Most Eugene contractors lose leads every week without realizing it. Here are the 5 biggest reasons and how to fix each one.",
    date: "February 15, 2026",
    readTime: "5 min read",
    content: (
      <>
        <p>
          If you&apos;re a contractor in Eugene, you&apos;re probably losing leads
          every single week without even knowing it. Most contractors I talk to
          have the same blind spots — and the good news is, every one of them is
          fixable.
        </p>
        <p>
          Here are the five biggest reasons contractors lose leads, and what you
          can do about each one.
        </p>

        <h2>1. Email-Only Contact Forms</h2>
        <p>
          The most common setup: a basic contact form that sends you an email.
          The problem? Those emails end up in spam, get buried under other
          messages, or go unchecked when you&apos;re on a job site. By the time you
          see it, the customer has already called someone else.
        </p>
        <p>
          <strong>The fix:</strong> Use a contact form that stores leads in a
          database. Every inquiry is captured, timestamped, and waiting for you
          in an admin dashboard — not lost in your inbox.
        </p>

        <h2>2. No Mobile Optimization</h2>
        <p>
          Over 60% of people searching for contractors are on their phones. If
          your site is slow, hard to navigate, or has tiny text on mobile,
          they&apos;ll bounce and find someone with a better site.
        </p>
        <p>
          <strong>The fix:</strong> Build mobile-first. Large buttons, readable
          text, fast loading times, and a contact form that&apos;s easy to fill
          out on a phone.
        </p>

        <h2>3. Slow Response Time</h2>
        <p>
          Studies show that responding to a lead within 5 minutes makes you 21x
          more likely to close the deal compared to waiting 30 minutes. Most
          contractors respond in hours — or days.
        </p>
        <p>
          <strong>The fix:</strong> Set up automated email and SMS responses.
          The moment a lead comes in, they get a professional response and you
          get a notification. Even if you&apos;re on a roof somewhere, the lead
          knows you&apos;re on it.
        </p>

        <h2>4. No Lead Tracking</h2>
        <p>
          Without a system, you have no idea which leads are new, which
          you&apos;ve followed up on, and which turned into actual jobs. You
          can&apos;t improve what you don&apos;t measure.
        </p>
        <p>
          <strong>The fix:</strong> An admin dashboard where you can see every
          lead, update their status (new, contacted, quoted, won, lost), add
          notes, and track your pipeline.
        </p>

        <h2>5. Poor Local SEO</h2>
        <p>
          When someone in Eugene searches for &quot;tile installer near me&quot;
          or &quot;bathroom remodel Cottage Grove,&quot; does your site show up?
          If you don&apos;t have city-specific pages optimized for local
          searches, you&apos;re invisible to the people most likely to hire you.
        </p>
        <p>
          <strong>The fix:</strong> Create dedicated SEO pages for each service
          and location you serve. &quot;Tile Installation Eugene,&quot;
          &quot;Kitchen Remodel Cottage Grove,&quot; &quot;Deck Building
          Veneta&quot; — each page targets the exact searches your customers are
          making.
        </p>

        <h2>Stop Losing Leads</h2>
        <p>
          Every missed lead is a missed project — potentially worth $5,000,
          $10,000, or more. The contractors who invest in proper lead management
          systems capture every inquiry and close more deals.
        </p>
      </>
    ),
  },
  "lead-management-system-captures-more-customers": {
    title:
      "How a Lead Management System Captures More Customers for Your Contracting Business",
    meta: "Learn how a lead management system works for contractors and how it captures more customers than a basic contact form.",
    date: "February 14, 2026",
    readTime: "6 min read",
    content: (
      <>
        <p>
          A lead management system does something that a basic contact form
          can&apos;t: it captures every single inquiry, stores it in a database,
          and gives you tools to track, follow up, and close deals
          systematically.
        </p>

        <h2>What Is a Lead Management System?</h2>
        <p>
          At its core, a lead management system is a combination of a website,
          a database, and a dashboard. When someone fills out your contact form
          or project estimator, their information is stored in a database — not
          just sent to your email. You can then manage those leads through an
          admin dashboard.
        </p>
        <p>Think of it as a CRM built directly into your website.</p>

        <h2>How It Works</h2>
        <p>Here&apos;s the typical flow:</p>
        <ol>
          <li>
            <strong>Customer visits your website</strong> and fills out a
            project estimator or contact form. They enter their name, email,
            phone, service needed, and project details.
          </li>
          <li>
            <strong>Lead is stored in your database</strong> instantly.
            It&apos;s timestamped, categorized, and ready for you to review.
          </li>
          <li>
            <strong>Automated responses go out</strong> — the customer gets a
            confirmation email, and you get a notification (email and/or SMS).
          </li>
          <li>
            <strong>You manage leads in your dashboard</strong> — update
            status, add notes, filter by service type, and track your pipeline.
          </li>
        </ol>

        <h2>Benefits for Contractors</h2>
        <h3>Never Miss a Lead</h3>
        <p>
          Unlike email, a database doesn&apos;t have a spam folder. Every
          inquiry is captured and stored, whether you&apos;re on a job site, on
          vacation, or asleep.
        </p>

        <h3>Faster Response Time</h3>
        <p>
          Automated responses mean the customer hears back within seconds, not
          hours. This dramatically increases your chances of closing the deal.
        </p>

        <h3>Better Organization</h3>
        <p>
          See all your leads in one place. Filter by service type, date, or
          status. Know exactly where each lead stands in your pipeline.
        </p>

        <h3>Data-Driven Decisions</h3>
        <p>
          Track which services generate the most inquiries, which marketing
          channels work best, and what your conversion rate looks like. Use
          data to grow your business.
        </p>

        <h2>Real Example: Halleman Construction</h2>
        <p>
          I recently built a lead management system for Halleman Construction
          LLC, a Eugene-based contractor specializing in tile, kitchen remodel,
          bathroom, decks, and patios. They went from a basic contact form to a
          full system with a lead database, admin dashboard, project estimator,
          and 20 local SEO pages.
        </p>
        <p>
          The result? Every inquiry is now captured. No more leads lost in
          email. Automated responses go out instantly. And the admin dashboard
          gives them full visibility into their pipeline.
        </p>
      </>
    ),
  },
  "contractor-website-local-seo-eugene": {
    title: "Why Your Contractor Website Needs Local SEO (Eugene Edition)",
    meta: "Learn why local SEO matters for Eugene contractors and how city-specific pages can help you rank for local searches.",
    date: "February 13, 2026",
    readTime: "5 min read",
    content: (
      <>
        <p>
          When someone in Eugene needs a tile installer, they don&apos;t open
          the Yellow Pages. They type &quot;tile installer Eugene&quot; into
          Google. If your website doesn&apos;t show up on that first page, you
          might as well not exist to that customer.
        </p>
        <p>That&apos;s where local SEO comes in.</p>

        <h2>What Is Local SEO?</h2>
        <p>
          Local SEO (Search Engine Optimization) is the practice of optimizing
          your website to rank higher in local search results. When someone
          searches for a service + location (like &quot;bathroom remodel Cottage
          Grove&quot;), Google shows results that are most relevant to that
          specific area.
        </p>
        <p>
          Local SEO is how you make sure your business shows up in those
          results.
        </p>

        <h2>Why It Matters for Eugene Contractors</h2>
        <p>
          Eugene and Lane County have a competitive contractor market. There are
          dozens of contractors offering similar services. The ones who show up
          on the first page of Google get the calls. Everyone else gets
          nothing.
        </p>
        <p>Consider these common searches:</p>
        <ul>
          <li>&quot;tile installer Eugene&quot;</li>
          <li>&quot;bathroom remodel Cottage Grove&quot;</li>
          <li>&quot;deck builder Veneta&quot;</li>
          <li>&quot;kitchen remodel Springfield&quot;</li>
          <li>&quot;general contractor Coburg&quot;</li>
        </ul>
        <p>
          If your website has one generic &quot;Services&quot; page, Google has
          no reason to show your site for any of these specific searches. You
          need dedicated pages for each service and location.
        </p>

        <h2>How to Optimize: The 20-Page Strategy</h2>
        <p>
          The most effective approach for local contractors is to create
          dedicated pages for each service + city combination. For example:
        </p>
        <ul>
          <li>
            <strong>Tile Installation Eugene</strong> — Targets &quot;tile
            installer Eugene&quot; and related searches
          </li>
          <li>
            <strong>Bathroom Remodel Cottage Grove</strong> — Targets
            &quot;bathroom remodel Cottage Grove&quot;
          </li>
          <li>
            <strong>Deck Building Veneta</strong> — Targets &quot;deck builder
            Veneta&quot;
          </li>
        </ul>
        <p>
          Each page should include the service name, the city name, relevant
          details about your work in that area, and a clear call to action
          (contact form or project estimator).
        </p>
        <p>
          With 4-5 services and 4-5 cities, you get 20 highly targeted SEO
          pages that each rank for specific local searches.
        </p>

        <h2>Google Business Profile</h2>
        <p>
          Beyond your website, your Google Business Profile is critical for
          local SEO. Make sure it&apos;s fully filled out with:
        </p>
        <ul>
          <li>Accurate business name, address, and phone number</li>
          <li>Business hours</li>
          <li>Services offered</li>
          <li>Photos of your work</li>
          <li>Customer reviews (ask happy customers to leave reviews!)</li>
        </ul>

        <h2>The Bottom Line</h2>
        <p>
          Local SEO isn&apos;t optional for Eugene contractors — it&apos;s how
          customers find you. Without it, you&apos;re leaving money on the
          table every single day. With a targeted SEO strategy, you can show up
          for the exact searches your ideal customers are making.
        </p>
      </>
    ),
  },
};

export async function generateStaticParams() {
  return Object.keys(posts).map((slug) => ({ slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const post = posts[slug];
  if (!post) return {};
  return {
    title: post.title,
    description: post.meta,
    openGraph: {
      title: post.title,
      description: post.meta,
      url: `https://digitalheavyweights.com/blog/${slug}`,
      type: "article",
      publishedTime: post.date,
    },
    twitter: {
      card: "summary_large_image",
      title: post.title,
      description: post.meta,
    },
    alternates: {
      canonical: `/blog/${slug}`,
    },
  };
}

export default async function BlogPostPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const post = posts[slug];
  if (!post) notFound();

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: post.title,
    description: post.meta,
    datePublished: post.date,
    author: {
      "@type": "Organization",
      name: "digitalheavyweights Inc",
      url: "https://digitalheavyweights.com",
    },
    publisher: {
      "@type": "Organization",
      name: "digitalheavyweights Inc",
      url: "https://digitalheavyweights.com",
    },
    url: `https://digitalheavyweights.com/blog/${slug}`,
    mainEntityOfPage: `https://digitalheavyweights.com/blog/${slug}`,
    timeRequired: post.readTime,
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(jsonLd),
        }}
      />
      {/* Header */}
      <section className="relative pt-32 pb-16 lg:pt-40 lg:pb-20 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-primary/5 via-background to-background" />
        <div className="relative max-w-4xl mx-auto px-6 lg:px-8">
          <Link
            href="/blog"
            className="text-muted hover:text-foreground text-sm mb-6 inline-block transition-colors"
          >
            &larr; Back to Blog
          </Link>
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold leading-tight tracking-tight">
            {post.title}
          </h1>
          <div className="flex items-center gap-3 mt-5 text-muted text-sm">
            <time>{post.date}</time>
            <span className="w-1 h-1 bg-border rounded-full" />
            <span>{post.readTime}</span>
          </div>
        </div>
      </section>

      {/* Content */}
      <article className="py-16 lg:py-24 border-t border-border">
        <div className="max-w-3xl mx-auto px-6 lg:px-8 [&>h2]:text-2xl [&>h2]:font-bold [&>h2]:mt-12 [&>h2]:mb-4 [&>h2]:tracking-tight [&>h3]:text-xl [&>h3]:font-bold [&>h3]:mt-8 [&>h3]:mb-3 [&>p]:text-muted [&>p]:mb-5 [&>p]:leading-relaxed [&>ul]:list-disc [&>ul]:pl-6 [&>ul]:mb-5 [&>ul]:space-y-2 [&>ul]:text-muted [&>ol]:list-decimal [&>ol]:pl-6 [&>ol]:mb-5 [&>ol]:space-y-3 [&>ol]:text-muted [&_strong]:text-foreground">
          {post.content}
        </div>
      </article>

      {/* CTA */}
      <section className="py-24 lg:py-32 bg-surface border-t border-border relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-primary/5 to-transparent" />
        <div className="relative max-w-3xl mx-auto px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold tracking-tight mb-4">
            Ready to Capture More Leads?
          </h2>
          <p className="text-muted mb-10">
            Get a free audit of your current website and see what a lead
            management system can do for your business.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/contact"
              className="bg-primary hover:bg-primary-dark text-white px-8 py-4 rounded-full text-base font-medium transition-all duration-200 hover:shadow-[0_0_30px_rgba(99,102,241,0.3)]"
            >
              Get Your Free Audit
            </Link>
            <Link
              href="/pricing"
              className="border border-border hover:border-muted text-foreground px-8 py-4 rounded-full text-base font-medium transition-all duration-200 hover:bg-surface-light"
            >
              See Pricing
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
