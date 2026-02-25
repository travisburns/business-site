'use client'
import { useState, FormEvent } from 'react'
import Header from '../components/Header'
import Footer from '../components/Footer'
import Link from 'next/link'
import { leadsApi } from '../lib/api'
import type { LeadCreateDto } from '../lib/types'

export default function Contact() {
  const [formData, setFormData] = useState<LeadCreateDto>({
    fullName: '',
    email: '',
    phone: '',
    preferredContactMethod: 'either',
    projectType: '',
    otherProjectDescription: '',
    location: '',
    otherLocation: '',
    budgetRange: '',
    timeline: '',
    projectDescription: '',
    propertyType: '',
    referralSource: '',
    pageSource: '/contact',
  })

  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitSuccess, setSubmitSuccess] = useState(false)
  const [submitError, setSubmitError] = useState('')

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    })
  }

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    setSubmitError('')

    try {
      await leadsApi.create(formData)
      setSubmitSuccess(true)
      setFormData({
        fullName: '',
        email: '',
        phone: '',
        preferredContactMethod: 'either',
        projectType: '',
        otherProjectDescription: '',
        location: '',
        otherLocation: '',
        budgetRange: '',
        timeline: '',
        projectDescription: '',
        propertyType: '',
        referralSource: '',
        pageSource: '/contact',
      })
    } catch (error) {
      setSubmitError('Failed to submit form. Please try again or call us directly.')
      console.error('Form submission error:', error)
    } finally {
      setIsSubmitting(false)
    }
  }

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
              <span>Contact</span>
            </div>
            <div className="section-label">Free Estimates</div>
            <h1>Contact Us</h1>
            <p className="page-hero-sub">Get a free estimate for your project</p>
          </div>
        </section>

        {/* Contact Section */}
        <section className="cnt-section">
          <div className="container">
            <div className="cnt-grid">

              {/* Left — contact info */}
              <div>
                <div className="cnt-info-header">
                  <div className="section-label" style={{ marginBottom: '1rem' }}>Reach Us Directly</div>
                  <h2>Get in Touch</h2>
                  <p>
                    Ready to start your construction or remodeling project? Contact us today for a
                    free estimate. We&apos;ll discuss your project needs and provide a detailed quote.
                  </p>
                </div>

                <div className="cnt-info-items">
                  <div className="cnt-info-item">
                    <div className="cnt-info-label">Phone</div>
                    <div className="cnt-info-value">
                      <a href="tel:5415254133">(541) 525-4133</a>
                    </div>
                  </div>

                  <div className="cnt-info-item">
                    <div className="cnt-info-label">Email</div>
                    <div className="cnt-info-value">
                      <a href="mailto:info@hallemanconstructionllc.com">
                        info@hallemanconstructionllc.com
                      </a>
                    </div>
                  </div>

                  <div className="cnt-info-item">
                    <div className="cnt-info-label">Service Areas</div>
                    <div className="cnt-info-value">Lane County, Oregon</div>
                    <div className="cnt-info-sub">
                      Eugene, Cottage Grove, Veneta, Coburg, and throughout Lane County, Oregon
                    </div>
                  </div>

                  <div className="cnt-info-item">
                    <div className="cnt-info-label">License &amp; Insurance</div>
                    <div className="cnt-info-value">Licensed, Bonded &amp; Insured</div>
                    <div className="cnt-info-sub">Oregon CCB License</div>
                  </div>
                </div>
              </div>

              {/* Right — form */}
              <div className="cnt-form-card">
                <div className="cnt-form-title">Request a Free Estimate</div>

                {submitSuccess ? (
                  <div className="cnt-success">
                    <h3>Thank you!</h3>
                    <p>We&apos;ve received your request and will contact you within 24 hours.</p>
                  </div>
                ) : (
                  <form onSubmit={handleSubmit}>
                    {submitError && (
                      <div className="cnt-error">{submitError}</div>
                    )}

                    <div className="cnt-fields">
                      <div className="svc-field">
                        <label>Full Name *</label>
                        <input
                          type="text"
                          name="fullName"
                          value={formData.fullName}
                          onChange={handleChange}
                          required
                        />
                      </div>

                      <div className="svc-field">
                        <label>Email *</label>
                        <input
                          type="email"
                          name="email"
                          value={formData.email}
                          onChange={handleChange}
                          required
                        />
                      </div>

                      <div className="svc-field">
                        <label>Phone *</label>
                        <input
                          type="tel"
                          name="phone"
                          value={formData.phone}
                          onChange={handleChange}
                          required
                        />
                      </div>

                      <div className="svc-field">
                        <label>Project Type *</label>
                        <select
                          name="projectType"
                          value={formData.projectType}
                          onChange={handleChange}
                          required
                        >
                          <option value="">Select a project type</option>
                          <option value="tile">Tile Installation</option>
                          <option value="kitchen">Kitchen Remodeling</option>
                          <option value="bathroom">Bathroom Renovation</option>
                          <option value="deck">Deck Construction</option>
                          <option value="fence">Fence Installation</option>
                          <option value="patio">Patio Cover</option>
                          <option value="other">Other</option>
                        </select>
                      </div>

                      <div className="svc-field">
                        <label>Location *</label>
                        <select
                          name="location"
                          value={formData.location}
                          onChange={handleChange}
                          required
                        >
                          <option value="">Select your location</option>
                          <option value="eugene">Eugene</option>
                          <option value="cottage-grove">Cottage Grove</option>
                          <option value="veneta">Veneta</option>
                          <option value="coburg">Coburg</option>
                          <option value="other">Other</option>
                        </select>
                      </div>

                      <div className="svc-field">
                        <label>Budget Range *</label>
                        <select
                          name="budgetRange"
                          value={formData.budgetRange}
                          onChange={handleChange}
                          required
                        >
                          <option value="">Select budget range</option>
                          <option value="under-5k">Under $5,000</option>
                          <option value="5k-10k">$5,000 - $10,000</option>
                          <option value="10k-20k">$10,000 - $20,000</option>
                          <option value="20k-50k">$20,000 - $50,000</option>
                          <option value="50k-100k">$50,000 - $100,000</option>
                          <option value="over-100k">Over $100,000</option>
                          <option value="not-sure">Not Sure</option>
                        </select>
                      </div>

                      <div className="svc-field">
                        <label>Timeline *</label>
                        <select
                          name="timeline"
                          value={formData.timeline}
                          onChange={handleChange}
                          required
                        >
                          <option value="">Select timeline</option>
                          <option value="asap">ASAP</option>
                          <option value="1-3months">1-3 Months</option>
                          <option value="3-6months">3-6 Months</option>
                          <option value="6-12months">6-12 Months</option>
                          <option value="planning">Just Planning</option>
                        </select>
                      </div>

                      <div className="svc-field">
                        <label>Project Description</label>
                        <textarea
                          name="projectDescription"
                          value={formData.projectDescription}
                          onChange={handleChange}
                          rows={4}
                          placeholder="Tell us about your project..."
                        />
                      </div>

                      <button
                        type="submit"
                        disabled={isSubmitting}
                        className="svc-submit"
                        style={{ opacity: isSubmitting ? 0.5 : 1, cursor: isSubmitting ? 'not-allowed' : 'pointer' }}
                      >
                        {isSubmitting ? 'Submitting...' : 'Get Free Estimate'}
                      </button>
                    </div>
                  </form>
                )}
              </div>

            </div>
          </div>
        </section>

      </main>
      <Footer />
    </>
  )
}
