'use client'

interface HeroProps {
  onOpenEstimator?: () => void
}

export default function Hero({ onOpenEstimator }: HeroProps) {
  return (
    <section className="hero" id="home">
      <div className="container">
        <h2 className="hero-title">Eugene&apos;s Trusted Remodeling Contractor</h2>
        <p className="hero-subtitle">Licensed. Bonded. Insured.</p>
        <p className="hero-description">
          Transform your home with expert craftsmanship. From kitchens and bathrooms to custom decks and tile work,
          we bring over 15 years of experience to every project.
        </p>
        <div className="hero-cta">
          <button className="btn-primary" onClick={onOpenEstimator}>Get Your Free Estimate</button>
          <a href="tel:5415254133" className="btn-secondary">Call (541) 525-4133</a>
        </div>
        <div className="hero-trust">
          <div className="trust-item">
            <span className="trust-icon">✓</span>
            <span>Licensed &amp; Insured</span>
          </div>
          <div className="trust-item">
            <span className="trust-icon">✓</span>
            <span>15+ Years Experience</span>
          </div>
          <div className="trust-item">
            <span className="trust-icon">✓</span>
            <span>Family Owned</span>
          </div>
        </div>
      </div>
    </section>
  )
}
