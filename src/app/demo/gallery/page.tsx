import Header from '../components/Header'
import Footer from '../components/Footer'
import Link from 'next/link'
import Image from 'next/image'

export const metadata = {
  title: 'Project Gallery | Halleman Construction LLC Eugene OR',
  description: 'View our completed construction and remodeling projects in Eugene, Oregon. Tile installation, kitchen remodeling, bathroom renovation, decks, and more.',
}

export default function Gallery() {
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
              <span>Gallery</span>
            </div>
            <div className="section-label">Our Work</div>
            <h1>Project Gallery</h1>
            <p className="page-hero-sub">See our quality craftsmanship in action</p>
          </div>
        </section>

        {/* Intro */}
        <section className="glr-intro">
          <div className="container">
            <div className="section-label" style={{ justifyContent: 'center', marginBottom: '1rem' }}>
              Dreams Made Reality
            </div>
            <h2>Our Work Speaks for Itself</h2>
            <p>
              Browse through our completed projects showcasing tile installation, kitchen remodeling,
              bathroom renovation, deck construction, and more. Each project represents our commitment
              to quality craftsmanship and customer satisfaction.
            </p>
          </div>
        </section>

        {/* Gallery Grid */}
        <section className="glr-grid-section">
          <div className="container">
            <div className="glr-grid">

              <div className="glr-card">
                <div className="glr-card-image">Project Photo</div>
                <div className="glr-card-info">
                  <div className="glr-card-title">Tile Installation</div>
                  <div className="glr-card-loc">Kitchen Backsplash — Eugene</div>
                </div>
              </div>

              <div className="glr-card">
                <div className="glr-card-image">Project Photo</div>
                <div className="glr-card-info">
                  <div className="glr-card-title">Kitchen Remodeling</div>
                  <div className="glr-card-loc">Complete Renovation — Cottage Grove</div>
                </div>
              </div>

              <div className="glr-card">
                <div className="glr-card-image">
                  <Image
                    src="/bathroom.jpg"
                    alt="bathroom"
                    width={500}
                    height={350}
                  />
                </div>
                <div className="glr-card-info">
                  <div className="glr-card-title">Bathroom Renovation</div>
                  <div className="glr-card-loc">Shower Remodel — Veneta</div>
                </div>
              </div>

              <div className="glr-card">
                <div className="glr-card-image">Project Photo</div>
                <div className="glr-card-info">
                  <div className="glr-card-title">Deck Construction</div>
                  <div className="glr-card-loc">Cedar Deck — Eugene</div>
                </div>
              </div>

              <div className="glr-card">
                <div className="glr-card-image">Project Photo</div>
                <div className="glr-card-info">
                  <div className="glr-card-title">Fence Installation</div>
                  <div className="glr-card-loc">Privacy Fence — Coburg</div>
                </div>
              </div>

              <div className="glr-card">
                <div className="glr-card-image">Project Photo</div>
                <div className="glr-card-info">
                  <div className="glr-card-title">Patio Cover</div>
                  <div className="glr-card-loc">Covered Patio — Eugene</div>
                </div>
              </div>

            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="svc-cta-section">
          <div className="container">
            <div className="section-label" style={{ justifyContent: 'center', marginBottom: '1.25rem' }}>
              Start Your Project
            </div>
            <h2>Want to See More of Our Work?</h2>
            <p>Want to see more of our work or discuss your project? Get in touch today for a free, no-obligation estimate.</p>
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
