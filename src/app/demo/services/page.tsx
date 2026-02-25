import Header from '../components/Header'
import Footer from '../components/Footer'
import Link from 'next/link'
import { seoPages } from '../lib/seoData'

export const metadata = {
  title: 'Construction Services Eugene OR | Halleman Construction LLC',
  description: 'Complete construction and remodeling services in Eugene, Oregon and Lane County. Tile installation, kitchen remodeling, bathroom renovation, decks, fencing, patio covers. Licensed contractor.',
  alternates: {
    canonical: 'https://hallemanconstructionllc.com/services',
  },
}

const SERVICE_CARDS = [
  {
    service: 'Tile Installation',
    slug: 'tile-installation',
    description: 'Expert tile installation for kitchens, bathrooms, floors, and backsplashes. We work with ceramic, porcelain, natural stone, and glass tile.',
    features: ['Kitchen backsplashes', 'Bathroom floors and showers', 'Floor tile installation', 'Custom tile patterns'],
  },
  {
    service: 'Kitchen Remodeling',
    slug: 'kitchen-remodeling',
    description: 'Complete kitchen renovations including cabinets, countertops, tile work, and custom designs tailored to your needs.',
    features: ['Custom cabinet installation', 'Countertop installation', 'Tile backsplashes', 'Complete kitchen renovations'],
  },
  {
    service: 'Bathroom Renovation',
    slug: 'bathroom-renovation',
    description: 'Transform your bathroom with professional remodeling. From small updates to complete renovations.',
    features: ['Shower and tub installation', 'Tile work and flooring', 'Vanity installation', 'Complete bathroom remodels'],
  },
  {
    service: 'Decks & Fencing',
    slug: 'deck-builder',
    description: 'Custom deck building and fence installation with quality materials and expert craftsmanship.',
    features: ['Custom deck designs', 'Cedar and composite decking', 'Privacy and picket fences', 'Railings and stairs'],
  },
  {
    service: 'Patio Covers',
    slug: 'patio-cover',
    description: 'Custom patio cover installation to protect and enhance your outdoor living areas year-round.',
    features: ['Custom patio cover designs', 'Wood and aluminum options', 'Weather protection', 'Pergolas and shade structures'],
  },
]

const CITIES = [
  { name: 'Eugene', key: 'eugene' },
  { name: 'Springfield', key: 'springfield' },
  { name: 'Cottage Grove', key: 'cottage-grove' },
  { name: 'Veneta', key: 'veneta' },
  { name: 'Coburg', key: 'coburg' },
]

export default function Services() {
  return (
    <>
      <Header />
      <main>
        {/* Hero Section */}
        <section className="bg-secondary text-white py-16">
          <div className="container">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">Our Services</h1>
            <p className="text-xl text-gray-200">Professional construction and remodeling throughout Eugene and Lane County</p>
          </div>
        </section>

        {/* Services Grid */}
        <section className="section-padding">
          <div className="container">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
              {SERVICE_CARDS.map((card) => (
                <div key={card.slug} className="bg-white p-8 shadow-lg border border-gray-200">
                  <h2 className="text-2xl font-bold mb-4 text-secondary">{card.service}</h2>
                  <p className="text-gray-700 mb-4">{card.description}</p>
                  <ul className="space-y-2 mb-6 text-gray-600">
                    {card.features.map((feature) => (
                      <li key={feature}>&#10003; {feature}</li>
                    ))}
                  </ul>
                  <div className="flex flex-wrap gap-2">
                    {CITIES.map((city) => {
                      const slug = `${card.slug}-${city.key}`
                      const exists = seoPages.some(p => p.slug === slug)
                      if (!exists) return null
                      return (
                        <Link
                          key={city.key}
                          href={`/services/${slug}`}
                          className="text-sm px-3 py-1 bg-gray-100 text-gray-700 hover:bg-primary hover:text-white transition-colors"
                        >
                          {city.name}
                        </Link>
                      )
                    })}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* All Service Areas */}
        <section className="section-padding bg-gray-50">
          <div className="container">
            <h2 className="text-3xl font-bold mb-8 text-secondary text-center">Service Areas</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-6 max-w-5xl mx-auto">
              {CITIES.map((city) => (
                <div key={city.key}>
                  <h3 className="font-bold text-lg text-secondary mb-3">{city.name}</h3>
                  <ul className="space-y-2">
                    {seoPages
                      .filter(p => p.slug.endsWith(`-${city.key}`) && !['home-remodeling-lane-county', 'licensed-contractor-eugene', 'outdoor-living-eugene'].includes(p.slug))
                      .map(p => (
                        <li key={p.slug}>
                          <Link href={`/services/${p.slug}`} className="text-sm text-gray-600 hover:text-primary transition-colors">
                            {p.service}
                          </Link>
                        </li>
                      ))
                    }
                  </ul>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Additional Pages */}
        <section className="section-padding">
          <div className="container">
            <div className="max-w-3xl mx-auto">
              <h2 className="text-2xl font-bold mb-6 text-secondary text-center">More Resources</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Link href="/services/home-remodeling-lane-county" className="p-4 bg-gray-50 border border-gray-200 hover:border-primary transition-colors text-center">
                  <span className="font-semibold text-secondary block">Home Remodeling</span>
                  <span className="text-sm text-gray-500">Lane County</span>
                </Link>
                <Link href="/services/licensed-contractor-eugene" className="p-4 bg-gray-50 border border-gray-200 hover:border-primary transition-colors text-center">
                  <span className="font-semibold text-secondary block">Licensed Contractor</span>
                  <span className="text-sm text-gray-500">Eugene, OR</span>
                </Link>
                <Link href="/services/outdoor-living-eugene" className="p-4 bg-gray-50 border border-gray-200 hover:border-primary transition-colors text-center">
                  <span className="font-semibold text-secondary block">Outdoor Living</span>
                  <span className="text-sm text-gray-500">Eugene, OR</span>
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="section-padding bg-secondary text-white">
          <div className="container text-center">
            <h2 className="text-3xl font-bold mb-4">Ready to Get Started?</h2>
            <p className="text-xl text-gray-200 mb-8 max-w-2xl mx-auto">
              Contact us today for a free estimate on your construction or remodeling project.
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
