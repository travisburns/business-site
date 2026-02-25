import Header from '../components/Header'
import Footer from '../components/Footer'
import Link from 'next/link'

export const metadata = {
  title: 'About Us | Halleman Construction LLC Eugene OR',
  description: 'Family-owned construction and remodeling contractor serving Lane County, Oregon for 15+ years. Licensed, bonded, and insured. Owner Josh Halleman.',
}

export default function About() {
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
              <span>About</span>
            </div>
            <div className="section-label">Our Story</div>
            <h1>About Halleman Construction</h1>
            <p className="page-hero-sub">Family-owned and Lane County trusted since day one</p>
          </div>
        </section>

        {/* Story */}
        <section className="abt-story">
          <div className="container">
            <div className="abt-story-grid">
              <div className="abt-story-text">
                <div className="section-label" style={{ marginBottom: '1rem' }}>Who We Are</div>
                <h2>Built on Family,<br />Built on Trust</h2>
                <p>
                  Halleman Construction LLC is a locally owned and operated remodeling contractor
                  based in Eugene, Oregon. Owner Josh Halleman started the company with a simple
                  promise — do the work right, treat every home like your own, and always leave
                  things better than you found them.
                </p>
                <p>
                  Josh is a family man with roots deep in Lane County. With professional training
                  through ServiceMaster and years of hands-on field experience, he built a reputation
                  for precision craftsmanship and straight-talking service that homeowners across the
                  county have come to rely on.
                </p>
                <p>
                  We specialize in tile installation, kitchen and bathroom remodeling, deck
                  construction, fencing, and patio covers. Whether it's a small tile repair or a
                  full kitchen renovation, every project gets the same level of care and attention
                  to detail.
                </p>
                <p>
                  We're licensed, bonded, and insured through Oregon's Construction Contractors
                  Board — so you can hire with confidence.
                </p>
              </div>

              <div className="abt-stats">
                <div className="abt-stat">
                  <div className="abt-stat-num">15+</div>
                  <div className="abt-stat-label">Years of Experience</div>
                </div>
                <div className="abt-stat">
                  <div className="abt-stat-num">100s</div>
                  <div className="abt-stat-label">Homes Transformed</div>
                </div>
                <div className="abt-stat">
                  <div className="abt-stat-num">CCB</div>
                  <div className="abt-stat-label">Licensed &amp; Insured</div>
                </div>
                <div className="abt-stat">
                  <div className="abt-stat-num">Lane</div>
                  <div className="abt-stat-label">County Oregon</div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Credentials bar */}
        <section className="abt-creds">
          <div className="container">
            <div className="abt-creds-strip">
              <div className="abt-cred-item">
                <div className="abt-cred-value">Oregon CCB Licensed</div>
                <div className="abt-cred-label">Construction Contractors Board</div>
              </div>
              <div className="abt-cred-divider" />
              <div className="abt-cred-item">
                <div className="abt-cred-value">Fully Bonded</div>
                <div className="abt-cred-label">Bonded &amp; Insured</div>
              </div>
              <div className="abt-cred-divider" />
              <div className="abt-cred-item">
                <div className="abt-cred-value">ServiceMaster Trained</div>
                <div className="abt-cred-label">Professional Certification</div>
              </div>
              <div className="abt-cred-divider" />
              <div className="abt-cred-item">
                <div className="abt-cred-value">Free Estimates</div>
                <div className="abt-cred-label">No-Obligation Quote</div>
              </div>
            </div>
          </div>
        </section>

        {/* Values */}
        <section className="abt-values">
          <div className="container">
            <div className="abt-values-header">
              <div className="section-label" style={{ justifyContent: 'center', marginBottom: '1rem' }}>
                What Sets Us Apart
              </div>
              <h2>How We Work</h2>
              <p>Four things every Halleman Construction customer can count on, every time.</p>
            </div>
            <div className="abt-values-grid">
              <div className="abt-value-card">
                <div className="abt-value-num">01</div>
                <div className="abt-value-title">We Show Up On Time</div>
                <div className="abt-value-desc">
                  We respect your schedule. If we say we'll be there at 8am, we're there at 8am.
                  No waiting around, no vague windows.
                </div>
              </div>
              <div className="abt-value-card">
                <div className="abt-value-num">02</div>
                <div className="abt-value-title">We Communicate Clearly</div>
                <div className="abt-value-desc">
                  No surprises. We walk you through the plan before we start and keep you informed
                  at every stage of the project.
                </div>
              </div>
              <div className="abt-value-card">
                <div className="abt-value-num">03</div>
                <div className="abt-value-title">We Do Quality Work</div>
                <div className="abt-value-desc">
                  Every cut, every tile, every fastener is done right. We take pride in the
                  details — because that's where quality is actually made.
                </div>
              </div>
              <div className="abt-value-card">
                <div className="abt-value-num">04</div>
                <div className="abt-value-title">We Clean Up After</div>
                <div className="abt-value-desc">
                  We leave your home cleaner than we found it. Dust, debris, and materials
                  are always hauled away — no mess left behind.
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Service Area */}
        <section className="abt-area">
          <div className="container">
            <div className="abt-area-header">
              <h2>Serving Lane County, Oregon</h2>
              <p>Locally based in Eugene — serving the whole county</p>
            </div>
            <div className="svc-area-pills">
              {[
                'Eugene', 'Springfield', 'Cottage Grove', 'Veneta',
                'Coburg', 'Junction City', 'Creswell',
                'Surrounding Rural Areas',
              ].map((city) => (
                <span key={city} className="svc-area-pill">{city}</span>
              ))}
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="svc-cta-section">
          <div className="container">
            <div className="section-label" style={{ justifyContent: 'center', marginBottom: '1.25rem' }}>
              Let&apos;s Get Started
            </div>
            <h2>Ready to Work with Us?</h2>
            <p>Get in touch today for a free, no-obligation estimate on your next project.</p>
            <div className="svc-cta-buttons">
              <Link href="/demo/contact" className="btn-primary">Get Free Estimate</Link>
              <a href="tel:5415254133" className="btn-secondary">Call (541) 525-4133</a>
            </div>
          </div>
        </section>

      </main>
      <Footer />
    </>
  )
}
