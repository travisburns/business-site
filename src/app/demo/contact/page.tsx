'use client'
import { useState, FormEvent } from 'react'
import Header from '../components/Header'
import Footer from '../components/Footer'
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
        {/* Hero Section */}
        <section className="bg-secondary text-white py-16">
          <div className="container">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">Contact Us</h1>
            <p className="text-xl text-gray-200">Get a free estimate for your project</p>
          </div>
        </section>

        {/* Contact Section */}
        <section className="section-padding">
          <div className="container">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
              {/* Contact Info */}
              <div>
                <h2 className="text-3xl font-bold mb-6">Get in Touch</h2>
                <p className="text-gray-700 mb-8">
                  Ready to start your construction or remodeling project? Contact us today for a free estimate. We'll discuss your project needs and provide a detailed quote.
                </p>

                <div className="space-y-8">
                  <div>
                    <h3 className="font-bold text-xl mb-2">Phone</h3>
                    <a href="tel:5415254133" className="text-primary text-lg hover:text-primary-dark">
                      (541) 525-4133
                    </a>
                  </div>

                  <div>
                    <h3 className="font-bold text-xl mb-2">Email</h3>
                    <a href="mailto:info@hallemanconstructionllc.com" className="text-primary text-lg hover:text-primary-dark">
                      info@hallemanconstructionllc.com
                    </a>
                  </div>

                  <div>
                    <h3 className="font-bold text-xl mb-2">Service Areas</h3>
                    <p className="text-gray-700">Eugene, Cottage Grove, Veneta, Coburg, and throughout Lane County, Oregon</p>
                  </div>

                  <div>
                    <h3 className="font-bold text-xl mb-2">License & Insurance</h3>
                    <p className="text-gray-700">Licensed, Bonded & Insured<br />Oregon CCB License</p>
                  </div>
                </div>
              </div>

              {/* Contact Form */}
              <div className="bg-white p-8 rounded-lg shadow-lg">
                <h2 className="text-2xl font-bold mb-6">Request a Free Estimate</h2>

                {submitSuccess ? (
                  <div className="bg-green-50 border border-green-200 text-green-800 px-6 py-4 rounded-lg">
                    <h3 className="font-bold mb-2">Thank you!</h3>
                    <p>We've received your request and will contact you within 24 hours.</p>
                  </div>
                ) : (
                  <form onSubmit={handleSubmit} className="space-y-6">
                    {submitError && (
                      <div className="bg-red-50 border border-red-200 text-red-800 px-4 py-3 rounded">
                        {submitError}
                      </div>
                    )}

                    <div>
                      <label className="block font-semibold mb-1">Full Name *</label>
                      <input
                        type="text"
                        name="fullName"
                        value={formData.fullName}
                        onChange={handleChange}
                        required
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                      />
                    </div>

                    <div>
                      <label className="block font-semibold mb-1">Email *</label>
                      <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        required
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                      />
                    </div>

                    <div>
                      <label className="block font-semibold mb-1">Phone *</label>
                      <input
                        type="tel"
                        name="phone"
                        value={formData.phone}
                        onChange={handleChange}
                        required
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                      />
                    </div>

                    <div>
                      <label className="block font-semibold mb-1">Project Type *</label>
                      <select
                        name="projectType"
                        value={formData.projectType}
                        onChange={handleChange}
                        required
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
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

                    <div>
                      <label className="block font-semibold mb-1">Location *</label>
                      <select
                        name="location"
                        value={formData.location}
                        onChange={handleChange}
                        required
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                      >
                        <option value="">Select your location</option>
                        <option value="eugene">Eugene</option>
                        <option value="cottage-grove">Cottage Grove</option>
                        <option value="veneta">Veneta</option>
                        <option value="coburg">Coburg</option>
                        <option value="other">Other</option>
                      </select>
                    </div>

                    <div>
                      <label className="block font-semibold mb-1">Budget Range *</label>
                      <select
                        name="budgetRange"
                        value={formData.budgetRange}
                        onChange={handleChange}
                        required
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
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

                    <div>
                      <label className="block font-semibold mb-1">Timeline *</label>
                      <select
                        name="timeline"
                        value={formData.timeline}
                        onChange={handleChange}
                        required
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                      >
                        <option value="">Select timeline</option>
                        <option value="asap">ASAP</option>
                        <option value="1-3months">1-3 Months</option>
                        <option value="3-6months">3-6 Months</option>
                        <option value="6-12months">6-12 Months</option>
                        <option value="planning">Just Planning</option>
                      </select>
                    </div>

                    <div>
                      <label className="block font-semibold mb-1">Project Description</label>
                      <textarea
                        name="projectDescription"
                        value={formData.projectDescription}
                        onChange={handleChange}
                        rows={4}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                        placeholder="Tell us about your project..."
                      />
                    </div>

                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="w-full btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {isSubmitting ? 'Submitting...' : 'Get Free Estimate'}
                    </button>
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