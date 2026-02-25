'use client'
import { useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import Header from './Header'
import Footer from './Footer'
import Hero from './Hero'
import EstimatorModal from './EstimatorModal'

export default function HomeContent() {
  const [estimatorOpen, setEstimatorOpen] = useState(false)

  return (
    <>
      <Header onOpenEstimator={() => setEstimatorOpen(true)} />
      <main>
        <Hero onOpenEstimator={() => setEstimatorOpen(true)} />

        {/* ── SERVICES ── */}
        <section className="services" id="services">
          <div className="container">
            <div className="services-section-top">
              <div className="section-label">Our Services</div>
              <h2>What We Build Best</h2>
              <p>Expert residential remodeling for homes throughout Lane County</p>
            </div>

            {/* Featured service card */}
            <div className="featured-service">
              <div className="featured-service-image">
                🔧
              </div>
              <div className="featured-service-content">
                <div className="section-label">Featured Service</div>
                <h3>Tile Design<br />&amp; Installation</h3>
                <div className="featured-service-tag">Bathrooms · Showers · Floors · Backsplashes</div>
                <p>
                  Beautiful bathroom floors and walk-in showers done right. Tile is our specialty
                  and our favorite way to completely transform a space — precision cuts, flawless
                  grout lines, and lasting results every time.
                </p>
                <Link href="/demo/services/tile-installation-eugene" className="btn-secondary">
                  Learn More →
                </Link>
              </div>
            </div>

            {/* Service icon row */}
            <div className="services-icon-row">
              <Link href="/demo/services/tile-installation-eugene" className="service-icon-card">
                <span className="service-icon-symbol">🔧</span>
                <div className="service-icon-label">Tile Installation</div>
              </Link>
              <Link href="/demo/services/kitchen-remodeling-eugene" className="service-icon-card">
                <span className="service-icon-symbol">🏠</span>
                <div className="service-icon-label">Kitchen Remodeling</div>
              </Link>
              <Link href="/demo/services/bathroom-renovation-eugene" className="service-icon-card">
                <span className="service-icon-symbol">🚿</span>
                <div className="service-icon-label">Bathroom Renovation</div>
              </Link>
              <Link href="/demo/services/deck-builder-eugene" className="service-icon-card">
                <span className="service-icon-symbol">🌲</span>
                <div className="service-icon-label">Decks &amp; Fencing</div>
              </Link>
              <Link href="/demo/services/patio-cover-eugene" className="service-icon-card">
                <span className="service-icon-symbol">☂️</span>
                <div className="service-icon-label">Patio Covers</div>
              </Link>
              <Link href="/demo/services" className="service-icon-card">
                <span className="service-icon-symbol">🛠️</span>
                <div className="service-icon-label">General Remodeling</div>
              </Link>
            </div>
          </div>
        </section>

        {/* ── WHY CHOOSE US / MISSION ── */}
        <section className="why-choose" id="about">
          <div className="container">
            <div className="why-choose-content">
              <div className="why-choose-text">
                <div className="section-label">Our Mission</div>
                <h2>Built Right &amp; Trusted Across Lane County</h2>
                <div className="feature">
                  <div className="feature-icon-box">◆</div>
                  <div className="feature-text">
                    <h3>ServiceMaster Professional Background</h3>
                    <p>Josh Halleman brings professional training and expertise from ServiceMaster, ensuring top-quality workmanship on every project.</p>
                  </div>
                </div>
                <div className="feature">
                  <div className="feature-icon-box">◆</div>
                  <div className="feature-text">
                    <h3>Local Eugene Family Business</h3>
                    <p>We&apos;re a family of four living right here in Eugene. We understand Lane County homes and building requirements inside and out.</p>
                  </div>
                </div>
                <div className="feature">
                  <div className="feature-icon-box">◆</div>
                  <div className="feature-text">
                    <h3>Licensed, Bonded &amp; Insured</h3>
                    <p>Full Oregon licensing and insurance protection for your complete peace of mind from start to finish.</p>
                  </div>
                </div>
                <div className="feature">
                  <div className="feature-icon-box">◆</div>
                  <div className="feature-text">
                    <h3>15+ Years of Experience</h3>
                    <p>From small updates to complete remodels, we&apos;ve transformed hundreds of homes across Lane County.</p>
                  </div>
                </div>
              </div>

              <div className="why-choose-image">
                <div className="image-placeholder">
                  <Image
                    src="/hallemanfamily.jpg"
                    alt="The Halleman family"
                    width={500}
                    height={520}
                  />
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ── GALLERY ── */}
        <section className="featured-gallery" id="gallery">
          <div className="container">
            <div className="gallery-section-top">
              <div className="section-label">Dreams Made Reality</div>
              <h2>Projects That Elevate Any Space</h2>
              <p>See the quality and craftsmanship we bring to every project in Lane County</p>
            </div>

            <div className="gallery-grid">
              <div className="gallery-item">
                <div className="gallery-image-placeholder">Project Photo</div>
                <div className="gallery-info">
                  <h4>Kitchen Remodel</h4>
                  <p>Eugene, OR</p>
                </div>
              </div>
              <div className="gallery-item">
                <div className="gallery-image-placeholder">Project Photo</div>
                <div className="gallery-info">
                  <h4>Bathroom Renovation</h4>
                  <p>Cottage Grove, OR</p>
                </div>
              </div>
              <div className="gallery-item">
                <div className="gallery-image-placeholder">Project Photo</div>
                <div className="gallery-info">
                  <h4>Custom Deck</h4>
                  <p>Veneta, OR</p>
                </div>
              </div>
              <div className="gallery-item">
                <div className="gallery-image-placeholder">Project Photo</div>
                <div className="gallery-info">
                  <h4>Tile Installation</h4>
                  <p>Coburg, OR</p>
                </div>
              </div>
            </div>

            <div className="gallery-cta">
              <Link href="/demo/gallery" className="btn-secondary">View Full Gallery</Link>
            </div>
          </div>
        </section>

        {/* ── SERVICE AREAS ── */}
        <section className="service-areas">
          <div className="container">
            <div className="section-header">
              <div className="section-label" style={{ display: 'inline-flex' }}>Where We Work</div>
              <h2>Serving Lane County</h2>
              <p>Professional remodeling services throughout the Eugene area</p>
            </div>
            <div className="areas-grid">
              <div className="area-card">
                <h3>Eugene</h3>
                <p>Complete home remodeling services in Eugene and surrounding neighborhoods</p>
              </div>
              <div className="area-card">
                <h3>Cottage Grove</h3>
                <p>Kitchen, bathroom, and deck services for Cottage Grove residents</p>
              </div>
              <div className="area-card">
                <h3>Veneta</h3>
                <p>Trusted contractor for Veneta homeowners and the surrounding area</p>
              </div>
              <div className="area-card">
                <h3>Coburg</h3>
                <p>Quality remodeling in Coburg and the surrounding communities</p>
              </div>
            </div>
          </div>
        </section>

        {/* ── CTA ── */}
        <section className="cta-section" id="contact">
          <div className="container">
            <div className="cta-content">
              <div className="section-label" style={{ display: 'inline-flex', marginBottom: '1.5rem' }}>
                Ready to Start
              </div>
              <h2>Let&apos;s Build Something Together</h2>
              <p>
                Get a free, no-obligation estimate today. We&apos;ll discuss your vision
                and provide a detailed quote — no pressure, no surprises.
              </p>
              <div className="cta-buttons">
                <button className="btn-primary" onClick={() => setEstimatorOpen(true)}>
                  Get Free Estimate
                </button>
                <a href="tel:5415254133" className="btn-phone-large">(541) 525-4133</a>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
      <EstimatorModal isOpen={estimatorOpen} onClose={() => setEstimatorOpen(false)} />
    </>
  )
}
