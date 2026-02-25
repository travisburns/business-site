import Link from 'next/link'

export default function Footer() {
  return (
    <footer className="footer">
      <div className="container">
        <div className="footer-content">
          <div className="footer-column">
            <h3>Halleman Construction LLC</h3>
            <p>Eugene&apos;s trusted remodeling contractor</p>
            <p className="footer-license">Licensed • Bonded • Insured<br />Oregon CCB #[number]</p>
          </div>
          <div className="footer-column">
            <h4>Services</h4>
            <ul>
              <li><Link href="/services/tile-installation-eugene">Tile Installation</Link></li>
              <li><Link href="/services/kitchen-remodeling-eugene">Kitchen Remodeling</Link></li>
              <li><Link href="/services/bathroom-renovation-eugene">Bathroom Renovation</Link></li>
              <li><Link href="/services/deck-builder-eugene">Decks &amp; Fencing</Link></li>
              <li><Link href="/services/patio-cover-eugene">Patio Covers</Link></li>
            </ul>
          </div>
          <div className="footer-column">
            <h4>Service Areas</h4>
            <ul>
              <li><span>Eugene, OR</span></li>
              <li><span>Cottage Grove, OR</span></li>
              <li><span>Veneta, OR</span></li>
              <li><span>Coburg, OR</span></li>
            </ul>
          </div>
          <div className="footer-column">
            <h4>Contact</h4>
            <p><a href="tel:5415254133">(541) 525-4133</a></p>
            <p><a href="mailto:info@hallemanconstructionllc.com">info@hallemanconstructionllc.com</a></p>
            <div className="footer-social">
              <a href="#" className="social-link">Facebook</a>
              <a href="#" className="social-link">Instagram</a>
            </div>
          </div>
        </div>
        <div className="footer-bottom">
          <p>&copy; {new Date().getFullYear()} Halleman Construction LLC. All rights reserved.</p>
          <div className="footer-links">
            <Link href="/privacy-policy">Privacy Policy</Link>
            <Link href="/terms-of-service">Terms of Service</Link>
          </div>
        </div>
      </div>
    </footer>
  )
}
