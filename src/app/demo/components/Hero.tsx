'use client'

interface HeroProps {
  onOpenEstimator?: () => void
}

export default function Hero({ onOpenEstimator }: HeroProps) {
  return (
    <section className="hero" id="home">
      <div className="container">
        <div className="hero-inner">

          {/* Left — main content */}
          <div className="hero-left">
            <div className="section-label">Trusted in Lane County</div>
            <h2 className="hero-title">Halleman<br />Construction<br />LLC</h2>
            <p className="hero-subtitle">Eugene, Oregon</p>
            <p className="hero-description">
              Transform your home with expert craftsmanship. From kitchens and bathrooms
              to custom decks and tile work, we bring over 15 years of experience to
              every project — on time, on budget, no surprises.
            </p>
            <div className="hero-cta">
              <button className="btn-primary" onClick={onOpenEstimator}>
                Get Your Free Estimate
              </button>
              <a href="tel:5415254133" className="btn-secondary">
                Call (541) 525-4133
              </a>
            </div>
            <div className="hero-trust">
              <div className="trust-item">
                <span className="trust-icon">◆</span>
                <span>Licensed &amp; Insured</span>
              </div>
              <div className="trust-item">
                <span className="trust-icon">◆</span>
                <span>15+ Years Experience</span>
              </div>
              <div className="trust-item">
                <span className="trust-icon">◆</span>
                <span>Family Owned</span>
              </div>
            </div>
          </div>

          {/* Right — estimate card */}
          <div className="estimate-card">
            <div className="estimate-card-title">Get a Free Estimate</div>
            <div className="estimate-card-sub">Tell us about your project</div>

            <div className="estimate-field">
              <label>Your Name</label>
              <input type="text" placeholder="First &amp; Last Name" />
            </div>
            <div className="estimate-field">
              <label>Phone Number</label>
              <input type="tel" placeholder="(541) 000-0000" />
            </div>
            <div className="estimate-field">
              <label>Project Type</label>
              <select defaultValue="">
                <option value="" disabled>Select a service...</option>
                <option value="tile">Tile Design &amp; Installation</option>
                <option value="kitchen">Kitchen Remodeling</option>
                <option value="bathroom">Bathroom Renovation</option>
                <option value="deck">Decks &amp; Fencing</option>
                <option value="patio">Patio Covers</option>
                <option value="general">General Remodeling</option>
              </select>
            </div>

            <button className="estimate-submit" onClick={onOpenEstimator}>
              Start Your Estimate →
            </button>

            <div className="estimate-card-alt">
              Prefer to call? <a href="tel:5415254133">(541) 525-4133</a>
            </div>
          </div>

        </div>
      </div>
    </section>
  )
}
