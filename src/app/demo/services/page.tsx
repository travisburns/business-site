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

const SIDEBAR_SERVICES = [
  { label: 'Tile Design & Installation', href: '/demo/services/tile-installation-eugene' },
  { label: 'Kitchen Remodeling', href: '/demo/services/kitchen-remodeling-eugene' },
  { label: 'Bathroom Renovation', href: '/demo/services/bathroom-renovation-eugene' },
  { label: 'Decks & Fencing', href: '/demo/services/deck-builder-eugene' },
  { label: 'Patio Covers', href: '/demo/services/patio-cover-eugene' },
]

export default function Services() {
  return (
    <>
      <Header />
      <main>

        {/* Hero */}
        <section className="page-hero">
          <div className="container">
            <div className="page-hero-breadcrumb">
              <Link href="/demo">Home</Link>
              <span className="sep">/</span>
              <span>Services</span>
            </div>
            <div className="section-label">What We Do</div>
            <h1>Our Services</h1>
            <p className="page-hero-sub">
              Professional construction and remodeling throughout Eugene and Lane County.
              Licensed, bonded, and insured with 15+ years of experience.
            </p>
            <div className="page-hero-ctas">
              <Link href="/demo/contact" className="btn-primary">Get Free Estimate</Link>
              <a href="tel:5415254133" className="btn-secondary">Call (541) 525-4133</a>
            </div>
          </div>
        </section>

        {/* Two-column: cards + sidebar */}
        <section className="svc-layout-section">
          <div className="container">
            <div className="svc-layout">

              {/* Main — service cards */}
              <div className="svc-main">
                <div className="svc-cards-grid">
                  {SERVICE_CARDS.map((card) => (
                    <div key={card.slug} className="svc-listing-card">
                      <h2>{card.service}</h2>
                      <p>{card.description}</p>
                      <ul className="svc-listing-features">
                        {card.features.map((feature) => (
                          <li key={feature}>{feature}</li>
                        ))}
                      </ul>
                      <div className="svc-city-pills">
                        {CITIES.map((city) => {
                          const slug = `${card.slug}-${city.key}`
                          const exists = seoPages.some(p => p.slug === slug)
                          if (!exists) return null
                          return (
                            <Link
                              key={city.key}
                              href={`/services/${slug}`}
                              className="svc-city-pill"
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

              {/* Sidebar */}
              <aside className="svc-sidebar">
                {/* Estimate card */}
                <div className="svc-estimate-card">
                  <h3>Request A Free Estimate</h3>
                  <p>Tell us about your project</p>
                  <form action="/demo/contact" method="GET">
                    <div className="svc-field">
                      <label htmlFor="s-fname">First Name</label>
                      <input type="text" id="s-fname" name="firstName" placeholder="First Name" />
                    </div>
                    <div className="svc-field">
                      <label htmlFor="s-lname">Last Name</label>
                      <input type="text" id="s-lname" name="lastName" placeholder="Last Name" />
                    </div>
                    <div className="svc-field">
                      <label htmlFor="s-phone">Phone</label>
                      <input type="tel" id="s-phone" name="phone" placeholder="(541) 000-0000" />
                    </div>
                    <div className="svc-field">
                      <label htmlFor="s-email">E-Mail Address</label>
                      <input type="email" id="s-email" name="email" placeholder="you@email.com" />
                    </div>
                    <div className="svc-field">
                      <label htmlFor="s-message">How can we help?</label>
                      <textarea id="s-message" name="message" rows={3} placeholder="Describe your project..." />
                    </div>
                    <button type="submit" className="svc-submit">Submit Request →</button>
                  </form>
                  <div className="svc-submit-alt">
                    Or call us: <a href="tel:5415254133">(541) 525-4133</a>
                  </div>
                </div>

                {/* Service nav */}
                <div className="svc-nav-card">
                  <h4>Our Services</h4>
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

        {/* Service Areas */}
        <section className="svc-areas-section">
          <div className="container">
            <div className="section-label" style={{ justifyContent: 'center', marginBottom: '0.75rem' }}>Where We Work</div>
            <h2>Service Areas</h2>
            <div className="svc-areas-cols">
              {CITIES.map((city) => (
                <div key={city.key} className="svc-area-col">
                  <h3>{city.name}</h3>
                  <ul>
                    {seoPages
                      .filter(p => p.slug.endsWith(`-${city.key}`) && !['home-remodeling-lane-county', 'licensed-contractor-eugene', 'outdoor-living-eugene'].includes(p.slug))
                      .map(p => (
                        <li key={p.slug}>
                          <Link href={`/services/${p.slug}`}>{p.service}</Link>
                        </li>
                      ))
                    }
                  </ul>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* More Resources */}
        <section className="svc-resources-section">
          <div className="container">
            <h2>More Resources</h2>
            <div className="svc-resources-grid">
              <Link href="/services/home-remodeling-lane-county" className="svc-resource-link">
                <span className="svc-resource-name">Home Remodeling</span>
                <span className="svc-resource-loc">Lane County</span>
              </Link>
              <Link href="/services/licensed-contractor-eugene" className="svc-resource-link">
                <span className="svc-resource-name">Licensed Contractor</span>
                <span className="svc-resource-loc">Eugene, OR</span>
              </Link>
              <Link href="/services/outdoor-living-eugene" className="svc-resource-link">
                <span className="svc-resource-name">Outdoor Living</span>
                <span className="svc-resource-loc">Eugene, OR</span>
              </Link>
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="svc-cta-section">
          <div className="container">
            <div className="section-label" style={{ justifyContent: 'center', marginBottom: '1.25rem' }}>Ready to Start</div>
            <h2>Ready to Get Started?</h2>
            <p>Contact us today for a free estimate on your construction or remodeling project.</p>
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
