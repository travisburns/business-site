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

  // LocalBusiness schema
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

  // Service schema
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

  // FAQ schema
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

export default async function ServicePage({ params }: PageProps) {
  const { slug } = await params
  const page = getSeoPageBySlug(slug)
  if (!page) notFound()

  const schemas = generateJsonLd(page)
  const contentParagraphs = page.content.split('\n\n')

  // Find related pages (same service, different cities OR same city, different services)
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
      {/* JSON-LD Schema Markup */}
      {schemas.map((schema, i) => (
        <script
          key={i}
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
        />
      ))}

      <Header />
      <main>
        {/* Hero Section */}
        <section className="bg-secondary text-white py-16">
          <div className="container">
            <nav className="text-sm text-gray-300 mb-4">
              <Link href="/" className="hover:text-white">Home</Link>
              <span className="mx-2">/</span>
              <Link href="/services" className="hover:text-white">Services</Link>
              <span className="mx-2">/</span>
              <span className="text-white">{page.service} — {page.city}</span>
            </nav>
            <h1 className="text-4xl md:text-5xl font-bold mb-4">{page.h1}</h1>
            <p className="text-xl text-gray-200 max-w-2xl">{page.heroSubtitle}</p>
            <div className="mt-8 flex flex-col sm:flex-row gap-4">
              <Link href="/contact" className="btn-primary inline-block text-center">
                Get Free Estimate
              </Link>
              <a href="tel:5415254133" className="btn-secondary inline-block text-center">
                Call (541) 525-4133
              </a>
            </div>
          </div>
        </section>

        {/* Intro + Features */}
        <section className="section-padding">
          <div className="container">
            <div className="max-w-4xl mx-auto">
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
                <div className="lg:col-span-2">
                  <h2 className="text-3xl font-bold mb-6 text-secondary">
                    {page.service} in {page.city}
                  </h2>
                  <p className="text-gray-700 text-lg leading-relaxed mb-8">{page.intro}</p>

                  {contentParagraphs.map((paragraph, i) => (
                    <p key={i} className="text-gray-600 leading-relaxed mb-4">{paragraph}</p>
                  ))}
                </div>

                <div>
                  <div className="bg-gray-50 p-6 sticky top-4">
                    <h3 className="font-bold text-lg text-secondary mb-4">What We Offer</h3>
                    <ul className="space-y-3">
                      {page.features.map((feature, i) => (
                        <li key={i} className="flex items-start gap-2 text-gray-700">
                          <span className="text-primary font-bold mt-0.5">&#10003;</span>
                          <span>{feature}</span>
                        </li>
                      ))}
                    </ul>
                    <div className="mt-6 pt-6 border-t border-gray-200">
                      <p className="text-sm text-gray-500 mb-2">Serving {page.city} and:</p>
                      <div className="flex flex-wrap gap-2">
                        {page.nearbyAreas.map((area) => (
                          <span key={area} className="text-xs bg-white px-2 py-1 border border-gray-200 text-gray-600">
                            {area}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Estimator */}
        {page.estimatorType && (
          <section className="section-padding bg-gray-50">
            <div className="container">
              <div className="max-w-2xl mx-auto text-center mb-8">
                <h2 className="text-3xl font-bold mb-4 text-secondary">
                  Get an Instant {page.service} Estimate
                </h2>
                <p className="text-gray-600">
                  Use our free estimator tool to get an instant cost range for your {page.service.toLowerCase()} project in {page.city}. Based on current Lane County contractor rates.
                </p>
              </div>
              <ServiceEstimator defaultType={page.estimatorType} />
            </div>
          </section>
        )}

        {/* FAQ Section */}
        {page.faq.length > 0 && (
          <section className="section-padding">
            <div className="container">
              <div className="max-w-3xl mx-auto">
                <h2 className="text-3xl font-bold mb-8 text-secondary">
                  Frequently Asked Questions
                </h2>
                <div className="space-y-6">
                  {page.faq.map((item, i) => (
                    <div key={i} className="border-b border-gray-200 pb-6">
                      <h3 className="font-bold text-lg text-gray-900 mb-2">{item.question}</h3>
                      <p className="text-gray-600 leading-relaxed">{item.answer}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </section>
        )}

        {/* Related Services / Cities */}
        {relatedPages.length > 0 && (
          <section className="section-padding bg-gray-50">
            <div className="container">
              <h2 className="text-2xl font-bold mb-6 text-secondary text-center">
                Related Services
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 max-w-4xl mx-auto">
                {relatedPages.map((related) => (
                  <Link
                    key={related.slug}
                    href={`/services/${related.slug}`}
                    className="bg-white p-4 border border-gray-200 hover:border-primary hover:shadow-md transition-all"
                  >
                    <span className="font-semibold text-secondary block">{related.service}</span>
                    <span className="text-sm text-gray-500">{related.city}, OR</span>
                  </Link>
                ))}
              </div>
            </div>
          </section>
        )}

        {/* CTA Section */}
        <section className="section-padding bg-secondary text-white">
          <div className="container text-center">
            <h2 className="text-3xl font-bold mb-4">
              Ready to Start Your {page.service} Project?
            </h2>
            <p className="text-xl text-gray-200 mb-8 max-w-2xl mx-auto">
              Contact us today for a free estimate on your {page.service.toLowerCase()} project in {page.city}. Licensed, bonded, and insured.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/contact" className="btn-primary">
                Get Free Estimate
              </Link>
              <a href="tel:5415254133" className="bg-white text-secondary font-bold px-8 py-3 hover:bg-gray-100 transition-colors inline-block">
                Call (541) 525-4133
              </a>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  )
}
