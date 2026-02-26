import Link from 'next/link'

export default function Footer() {
  return (
    <footer className="footer">
      <div className="container">
        <div className="footer-content">

          {/* Left — Office / Links */}
          <div className="footer-column">
            <h3>Office</h3>
            <p>Eugene, Oregon</p>
            <p>Lane County &amp; Surrounding Areas</p>
            <p className="footer-license">
              Licensed · Bonded · Insured<br />
              Oregon CCB #[number]
            </p>
            <ul style={{ marginTop: '1.5rem' }}>
              <li><Link href="/demo/services/tile-installation-eugene">Tile Installation</Link></li>
              <li><Link href="/demo/services/kitchen-remodeling-eugene">Kitchen Remodeling</Link></li>
              <li><Link href="/demo/services/bathroom-renovation-eugene">Bathroom Renovation</Link></li>
              <li><Link href="/demo/services/deck-builder-eugene">Decks &amp; Fencing</Link></li>
              <li><Link href="/demo/services/patio-cover-eugene">Patio Covers</Link></li>
            </ul>
          </div>

          {/* Center — Diamond logo mark */}
          <div className="footer-center-logo">
            <div className="footer-diamond-mark">◆</div>
            <div className="footer-brand-name">
              Halleman<br />Construction<br />LLC
            </div>
          </div>

          {/* Right — Contact */}
          <div className="footer-column">
            <h4>Contact</h4>
            <p>
              <a href="tel:5415254133">(541) 525-4133</a>
            </p>
            <p>
              <a href="mailto:info@hallemanconstructionllc.com">
                info@hallemanconstructionllc.com
              </a>
            </p>
            <div className="footer-social">
              <a href="#" className="social-link">Facebook</a>
              <a href="#" className="social-link">Instagram</a>
            </div>
          </div>

        </div>

        <div className="footer-bottom">
          <p>&copy; {new Date().getFullYear()} Halleman Construction LLC. All rights reserved.</p>
          <div className="footer-links">
            <Link href="/demo/privacy-policy">Privacy Policy</Link>
            <Link href="/demo/terms-of-service">Terms of Service</Link>
          </div>
        </div>
      </div>
    </footer>
  )
}