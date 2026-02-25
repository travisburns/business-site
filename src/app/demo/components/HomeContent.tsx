'use client'
import { useState } from 'react'
import Link from 'next/link'
import Image from "next/image"
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

        {/* Services */}
        <section className="services" id="services">
          <div className="container">
            <div className="section-header">
              <h2>Our Services</h2>
              <p>Expert residential remodeling for homes throughout Lane County</p>
            </div>
            <div className="services-grid">
              <div className="service-card">
                <div className="service-icon">🔧</div>
                <h3>Tile Design &amp; Installation</h3>
                <p>Beautiful bathroom floors and walk-in showers. Tile is our specialty and favorite way to transform your space.</p>
                <Link href="/services/tile-installation-eugene" className="service-link">Learn More →</Link>
              </div>
              <div className="service-card">
                <div className="service-icon">🏠</div>
                <h3>Kitchen Remodeling</h3>
                <p>Complete kitchen transformations from cabinets to countertops. Create the heart of your home.</p>
                <Link href="/services/kitchen-remodeling-eugene" className="service-link">Learn More →</Link>
              </div>
              <div className="service-card">
                <div className="service-icon">🚿</div>
                <h3>Bathroom Renovation</h3>
                <p>Modern bathroom updates that add value and comfort to your Eugene home.</p>
                <Link href="/services/bathroom-renovation-eugene" className="service-link">Learn More →</Link>
              </div>
              <div className="service-card">
                <div className="service-icon">🌲</div>
                <h3>Decks &amp; Fencing</h3>
                <p>Custom-built outdoor spaces perfect for Oregon living. Durable, stylish, and built to last.</p>
                <Link href="/services/deck-builder-eugene" className="service-link">Learn More →</Link>
              </div>
              <div className="service-card">
                <div className="service-icon">☂️</div>
                <h3>Patio Covers</h3>
                <p>Extend your outdoor season with quality patio covers designed for Lane County weather.</p>
                <Link href="/services/patio-cover-eugene" className="service-link">Learn More →</Link>
              </div>
              <div className="service-card">
                <div className="service-icon">🛠️</div>
                <h3>General Remodeling</h3>
                <p>Complete home renovations and additions. Whatever your project, we&apos;ve got you covered.</p>
                <Link href="/services" className="service-link">Learn More →</Link>
              </div>
            </div>
          </div>
        </section>

        {/* Why Choose Us */}
        <section className="why-choose" id="about">
          <div className="container">
            <div className="why-choose-content">
              <div className="why-choose-text">
                <h2>Why Choose Halleman Construction?</h2>
                <div className="feature">
                  <h3>ServiceMaster Professional Background</h3>
                  <p>Josh Halleman brings professional training and expertise from ServiceMaster, ensuring top-quality workmanship on every project.</p>
                </div>
                <div className="feature">
                  <h3>Local Eugene Family Business</h3>
                  <p>We&apos;re a family of four living right here in Eugene. We understand Lane County homes and building requirements.</p>
                </div>
                <div className="feature">
                  <h3>Licensed, Bonded &amp; Insured</h3>
                  <p>Full Oregon licensing and insurance protection for your peace of mind.</p>
                </div>
                <div className="feature">
                  <h3>15+ Years of Experience</h3>
                  <p>From small updates to complete remodels, we&apos;ve transformed hundreds of homes across Lane County.</p>
                </div>
              </div>
              <div className="why-choose-image">
                <div className="image-placeholder">
                  <Image
  src="/hallemanfamily.jpg"
  alt="Halleman family"
  width={500}
  height={350}
/>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Gallery */}
        <section className="featured-gallery" id="gallery">
          <div className="container">
            <div className="section-header">
              <h2>Our Work</h2>
              <p>See the quality and craftsmanship we bring to every project</p>
            </div>
            <div className="gallery-grid">
              <div className="gallery-item">
                <div className="gallery-image-placeholder">[Project Photo 1]</div>
                <div className="gallery-info">
                  <h4>Kitchen Remodel</h4>
                  <p>Eugene, OR</p>
                </div>
              </div>
              <div className="gallery-item">
                <div className="gallery-image-placeholder">[Project Photo 2]</div>
                <div className="gallery-info">
                  <h4>Bathroom Renovation</h4>
                  <p>Cottage Grove, OR</p>
                </div>
              </div>
              <div className="gallery-item">
                <div className="gallery-image-placeholder">[Project Photo 3]</div>
                <div className="gallery-info">
                  <h4>Custom Deck</h4>
                  <p>Veneta, OR</p>
                </div>
              </div>
              <div className="gallery-item">
                <div className="gallery-image-placeholder">[Project Photo 4]</div>
                <div className="gallery-info">
                  <h4>Tile Installation</h4>
                  <p>Coburg, OR</p>
                </div>
              </div>
            </div>
            <div className="gallery-cta">
              <Link href="/gallery" className="btn-secondary">View Full Gallery</Link>
            </div>
          </div>
        </section>

        {/* Service Areas */}
        <section className="service-areas">
          <div className="container">
            <div className="section-header">
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
                <p>Trusted contractor for Veneta homeowners</p>
              </div>
              <div className="area-card">
                <h3>Coburg</h3>
                <p>Quality remodeling in Coburg and the surrounding area</p>
              </div>
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="cta-section" id="contact">
          <div className="container">
            <div className="cta-content">
              <h2>Ready to Start Your Project?</h2>
              <p>Get a free, no-obligation estimate today. We&apos;ll discuss your vision and provide a detailed quote.</p>
              <div className="cta-buttons">
                <button className="btn-primary" onClick={() => setEstimatorOpen(true)}>Get Free Estimate</button>
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
