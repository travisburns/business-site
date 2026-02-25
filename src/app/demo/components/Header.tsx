'use client'
import { useState } from 'react'
import Link from 'next/link'

interface HeaderProps {
  onOpenEstimator?: () => void
}

export default function Header({ onOpenEstimator }: HeaderProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  const handleEstimate = () => {
    if (onOpenEstimator) {
      onOpenEstimator()
    }
  }

  return (
    <header className="header">
      <div className="container">
        <div className="header-content">
          <div className="logo">
            <h1>
              <Link href="/">Halleman Construction <span>LLC</span></Link>
            </h1>
          </div>

          <nav className="nav">
            <ul>
              <li><Link href="/">Home</Link></li>
              <li><Link href="/services">Services</Link></li>
              <li><Link href="/gallery">Gallery</Link></li>
              <li><Link href="/about">About</Link></li>
              <li><Link href="/contact">Contact</Link></li>
            </ul>
          </nav>

          <div className="header-cta">
            <a href="tel:5415254133" className="btn-phone">(541) 525-4133</a>
            {onOpenEstimator ? (
              <button onClick={handleEstimate} className="btn-estimate">
                Get Free Estimate
              </button>
            ) : (
              <Link href="/contact" className="btn-estimate">
                Get Free Estimate
              </Link>
            )}
          </div>

          <button
            className="mobile-menu-toggle"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            <span></span>
            <span></span>
            <span></span>
          </button>
        </div>

        {mobileMenuOpen && (
          <div className="mobile-menu">
            <nav>
              <ul>
                <li><Link href="/">Home</Link></li>
                <li><Link href="/services">Services</Link></li>
                <li><Link href="/gallery">Gallery</Link></li>
                <li><Link href="/about">About</Link></li>
                <li><Link href="/contact">Contact</Link></li>
                <li><a href="tel:5415254133" className="btn-phone">(541) 525-4133</a></li>
                <li>
                  {onOpenEstimator ? (
                    <button onClick={handleEstimate} className="btn-estimate">Get Free Estimate</button>
                  ) : (
                    <Link href="/contact" className="btn-estimate">Get Free Estimate</Link>
                  )}
                </li>
              </ul>
            </nav>
          </div>
        )}
      </div>
    </header>
  )
}
