import { notFound } from 'next/navigation'
import Link from 'next/link'
import type { Metadata } from 'next'
import Header from '../../components/Header'
import Footer from '../../components/Footer'
import { seoPages, getAllSlugs, getSeoPageBySlug } from '../../lib/seoData'
import type { SeoPage } from '../../lib/seoData'
import ServiceEstimator from '../../components/ServiceEstimator'

type PageProps = {
  params: Promise<{ slug: string }>
}

// Pre-build all SEO pages at build time
export function generateStaticParams() {
  return getAllSlugs().map((slug) => ({ slug }))
}

// Dynamic metadata per page
export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params
  const page = getSeoPageBySlug(slug)
  if (!page) return {}

  const url = `https://hallemanconstructionllc.com/services/${page.slug}`

  return {
    title: page.title,
    description: page.description,
    alternates: {
      canonical: url,
    },
    openGraph: {
      title: page.title,
      description: page.description,
      url,
      siteName: 'Halleman Construction LLC',
      locale: 'en_US',
      type: 'website',
    },
  }
}

// JSON-LD structured data
function generateJsonLd(page: SeoPage) {
  const schemas = []

  schemas.push({
    '@context': 'https://schema.org',
    '@type': 'HomeAndConstructionBusiness',
    name: 'Halleman Construction LLC',
    description: page.description,
    url: 'https://hallemanconstructionllc.com',
    telephone: '+1-541-525-4133',
    address: {
      '@type': 'PostalAddress',
      addressLocality: 'Eugene',
      addressRegion: 'OR',
      addressCountry: 'US',
    },
    areaServed: [
      { '@type': 'City', name: 'Eugene', containedInPlace: { '@type': 'AdministrativeArea', name: 'Lane County, Oregon' } },
      { '@type': 'City', name: 'Springfield' },
      { '@type': 'City', name: 'Cottage Grove' },
      { '@type': 'City', name: 'Veneta' },
      { '@type': 'City', name: 'Coburg' },
    ],
    priceRange: '$$',
  })

  schemas.push({
    '@context': 'https://schema.org',
    '@type': 'Service',
    name: `${page.service} in ${page.city}`,
    description: page.description,
    provider: {
      '@type': 'HomeAndConstructionBusiness',
      name: 'Halleman Construction LLC',
      telephone: '+1-541-525-4133',
    },
    areaServed: {
      '@type': 'City',
      name: page.city,
    },
    serviceType: page.service,
  })

  if (page.faq.length > 0) {
    schemas.push({
      '@context': 'https://schema.org',
      '@type': 'FAQPage',
      mainEntity: page.faq.map((item) => ({
        '@type': 'Question',
        name: item.question,
        acceptedAnswer: {
          '@type': 'Answer',
          text: item.answer,
        },
      })),
    })
  }

  return schemas
}

const SIDEBAR_SERVICES = [
  { label: 'Tile Design & Installation', href: '/demo/services/tile-installation-eugene' },
  { label: 'Kitchen Remodeling', href: '/demo/services/kitchen-remodeling-eugene' },
  { label: 'Bathroom Renovation', href: '/demo/services/bathroom-renovation-eugene' },
  { label: 'Decks & Fencing', href: '/demo/services/deck-builder-eugene' },
  { label: 'Patio Covers', href: '/demo/services/patio-cover-eugene' },
]

export default async function ServicePage({ params }: PageProps) {
  const { slug } = await params
  const page = getSeoPageBySlug(slug)
  if (!page) notFound()

  const schemas = generateJsonLd(page)
  const contentParagraphs = page.content.split('\n\n')

  const relatedPages = seoPages.filter(
    (p) =>
      p.slug !== page.slug &&
      (p.service === page.service || p.city === page.city) &&
      p.slug !== 'home-remodeling-lane-county' &&
      p.slug !== 'licensed-contractor-eugene' &&
      p.slug !== 'outdoor-living-eugene'
  ).slice(0, 6)

  return (
    <>
      {schemas.map((schema, i) => (
        <script
          key={i}
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
        />
      ))}

      <Header />
      <main>

        {/* Hero */}
        <section className="page-hero">
          <div className="container">
            <nav className="page-hero-breadcrumb">
              <Link href="/demo">Home</Link>
              <span className="sep">/</span>
              <Link href="/demo/services">Services</Link>
              <span className="sep">/</span>
              <span>{page.service} — {page.city}</span>
            </nav>
            <div className="section-label">{page.service}</div>
            <h1>{page.h1}</h1>
            <p className="page-hero-sub">{page.heroSubtitle}</p>
            <div className="page-hero-ctas">
              <Link href="/demo/contact" className="btn-primary">Get Free Estimate</Link>
              <a href="tel:5415254133" className="btn-secondary">Call (541) 525-4133</a>
            </div>
          </div>
        </section>

        {/* Two-column layout */}
        <section className="svc-layout-section">
          <div className="container">
            <div className="svc-layout">

              {/* Main content */}
              <div className="svc-main">
                <h2 className="svc-content-title">
                  {page.service} in {page.city}
                </h2>
                <p className="svc-body-text" style={{ fontSize: '1rem', marginBottom: '1.25rem' }}>
                  {page.intro}
                </p>

                {/* What We Offer — dark card */}
                <div className="svc-dark-card">
                  <div className="svc-dark-card-label">◆ What We Offer</div>
                  <h3>Our {page.service} Services</h3>
                  <ul className="svc-features-grid">
                    {page.features.map((feature, i) => (
                      <li key={i}>{feature}</li>
                    ))}
                  </ul>
                  <div className="svc-serving-label">Serving {page.city} and nearby areas</div>
                  <div className="svc-area-pills">
                    {page.nearbyAreas.map((area) => (
                      <span key={area} className="svc-area-pill">{area}</span>
                    ))}
                  </div>
                </div>

                {/* Content paragraphs */}
                {contentParagraphs.map((paragraph, i) => (
                  <p key={i} className="svc-body-text">{paragraph}</p>
                ))}
              </div>

              {/* Sidebar */}
              <aside className="svc-sidebar">
                {/* Estimate card */}
                <div className="svc-estimate-card">
                  <h3>Request A Free Estimate</h3>
                  <p>Tell us about your project</p>
                  <form action="/demo/contact" method="GET">
                    <div className="svc-field">
                      <label htmlFor="sf-fname">First Name</label>
                      <input type="text" id="sf-fname" name="firstName" placeholder="First Name" />
                    </div>
                    <div className="svc-field">
                      <label htmlFor="sf-lname">Last Name</label>
                      <input type="text" id="sf-lname" name="lastName" placeholder="Last Name" />
                    </div>
                    <div className="svc-field">
                      <label htmlFor="sf-phone">Phone</label>
                      <input type="tel" id="sf-phone" name="phone" placeholder="(541) 000-0000" />
                    </div>
                    <div className="svc-field">
                      <label htmlFor="sf-email">E-Mail Address</label>
                      <input type="email" id="sf-email" name="email" placeholder="you@email.com" />
                    </div>
                    <div className="svc-field">
                      <label htmlFor="sf-message">How can we help?</label>
                      <textarea id="sf-message" name="message" rows={3} placeholder="Describe your project..." />
                    </div>
                    <button type="submit" className="svc-submit">Submit Request →</button>
                  </form>
                  <div className="svc-submit-alt">
                    Or call us: <a href="tel:5415254133">(541) 525-4133</a>
                  </div>
                </div>

                {/* Service nav */}
                <div className="svc-nav-card">
                  <h4>All Services</h4>
                  <ul className="svc-nav-list">
                    {SIDEBAR_SERVICES.map((s) => (
                      <li key={s.href} className="svc-nav-item">
                        <Link href={s.href}>{s.label}</Link>
                      </li>
                    ))}
                  </ul>
                </div>
              </aside>

            </div>
          </div>
        </section>

        {/* Estimator */}
        {page.estimatorType && (
          <section className="svc-estimator-section">
            <div className="container">
              <div className="section-top">
                <div className="section-label" style={{ justifyContent: 'center', marginBottom: '0.75rem' }}>
                  Instant Pricing
                </div>
                <h2>Get an Instant {page.service} Estimate</h2>
                <p>
                  Use our free estimator tool to get an instant cost range for your{' '}
                  {page.service.toLowerCase()} project in {page.city}. Based on current Lane County contractor rates.
                </p>
              </div>
              <ServiceEstimator defaultType={page.estimatorType} />
            </div>
          </section>
        )}

        {/* FAQ */}
        {page.faq.length > 0 && (
          <section className="svc-faq-section">
            <div className="container">
              <div style={{ maxWidth: '760px', margin: '0 auto' }}>
                <div className="section-label">Common Questions</div>
                <h2>Frequently Asked Questions</h2>
                <div>
                  {page.faq.map((item, i) => (
                    <div key={i} className="svc-faq-item">
                      <h3>{item.question}</h3>
                      <p>{item.answer}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </section>
        )}

        {/* Related Services */}
        {relatedPages.length > 0 && (
          <section className="svc-related-section">
            <div className="container">
              <div className="section-label" style={{ justifyContent: 'center', marginBottom: '0.75rem' }}>
                More Services
              </div>
              <h2>Related Services</h2>
              <div className="svc-related-grid">
                {relatedPages.map((related) => (
                  <Link
                    key={related.slug}
                    href={`/services/${related.slug}`}
                    className="svc-related-link"
                  >
                    <span className="svc-related-service">{related.service}</span>
                    <span className="svc-related-city">{related.city}, OR</span>
                  </Link>
                ))}
              </div>
            </div>
          </section>
        )}

        {/* CTA */}
        <section className="svc-cta-section">
          <div className="container">
            <div className="section-label" style={{ justifyContent: 'center', marginBottom: '1.25rem' }}>
              Ready to Start
            </div>
            <h2>Ready to Start Your {page.service} Project?</h2>
            <p>
              Contact us today for a free estimate on your {page.service.toLowerCase()} project
              in {page.city}. Licensed, bonded, and insured.
            </p>
            <div className="svc-cta-buttons">
              <Link href="/demo/contact" className="btn-primary">Get Free Estimate</Link>
              <a href="tel:5415254133" className="btn-phone-large">(541) 525-4133</a>
            </div>
          </div>
        </section>

      </main>
      <Footer />
    </>
  )
}