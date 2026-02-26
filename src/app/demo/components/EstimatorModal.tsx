'use client'
import { useEffect, useState } from 'react'
import { leadsApi } from '../lib/api'
import type { LeadCreateDto } from '../lib/types'

interface EstimatorModalProps {
  isOpen: boolean
  onClose: () => void
}

const PROJECT_RATES: Record<string, { label: string; icon: string; unit: string; lowRate: number; highRate: number; defaultSize: number; minSize: number; maxSize: number; step: number }> = {
  tile: { label: 'Tile Installation', icon: '◧', unit: 'sq ft', lowRate: 10, highRate: 25, defaultSize: 200, minSize: 20, maxSize: 2000, step: 10 },
  kitchen: { label: 'Kitchen Remodeling', icon: '⌂', unit: 'project', lowRate: 15000, highRate: 45000, defaultSize: 1, minSize: 1, maxSize: 1, step: 1 },
  bathroom: { label: 'Bathroom Renovation', icon: '◎', unit: 'project', lowRate: 9000, highRate: 25000, defaultSize: 1, minSize: 1, maxSize: 1, step: 1 },
  deck: { label: 'Deck Construction', icon: '⬒', unit: 'sq ft', lowRate: 19, highRate: 45, defaultSize: 300, minSize: 50, maxSize: 1500, step: 25 },
  fence: { label: 'Fence Installation', icon: '▥', unit: 'linear ft', lowRate: 18, highRate: 50, defaultSize: 150, minSize: 20, maxSize: 1000, step: 10 },
  patio: { label: 'Patio Cover', icon: '⛱', unit: 'sq ft', lowRate: 50, highRate: 150, defaultSize: 200, minSize: 50, maxSize: 800, step: 25 },
}

const TIERS = [
  { key: 'basic' as const, label: 'Basic', desc: 'Budget-friendly materials', multiplier: 0.8 },
  { key: 'mid' as const, label: 'Standard', desc: 'Most popular choice', multiplier: 1.0 },
  { key: 'high' as const, label: 'Premium', desc: 'High-end finishes', multiplier: 1.3 },
]

type Step = 'project' | 'details' | 'estimate' | 'contact' | 'submitted'

export default function EstimatorModal({ isOpen, onClose }: EstimatorModalProps) {
  const [step, setStep] = useState<Step>('project')
  const [projectType, setProjectType] = useState('')
  const [size, setSize] = useState(0)
  const [complexity, setComplexity] = useState<'basic' | 'mid' | 'high'>('mid')
  const [estimateLow, setEstimateLow] = useState(0)
  const [estimateHigh, setEstimateHigh] = useState(0)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [contactInfo, setContactInfo] = useState({ fullName: '', email: '', phone: '' })

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = 'auto'
    }
    return () => { document.body.style.overflow = 'auto' }
  }, [isOpen])

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose() }
    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [onClose])

  const reset = () => {
    setStep('project')
    setProjectType('')
    setSize(0)
    setComplexity('mid')
    setEstimateLow(0)
    setEstimateHigh(0)
    setContactInfo({ fullName: '', email: '', phone: '' })
  }

  const handleClose = () => { reset(); onClose() }

  const selectProject = (type: string) => {
    setProjectType(type)
    setSize(PROJECT_RATES[type].defaultSize)
    setStep('details')
  }

  const calculateEstimate = () => {
    const rates = PROJECT_RATES[projectType]
    if (!rates) return
    const mult = TIERS.find(t => t.key === complexity)?.multiplier ?? 1.0
    if (rates.unit === 'project') {
      setEstimateLow(Math.round(rates.lowRate * mult))
      setEstimateHigh(Math.round(rates.highRate * mult))
    } else {
      setEstimateLow(Math.round(size * rates.lowRate * mult))
      setEstimateHigh(Math.round(size * rates.highRate * mult))
    }
    setStep('estimate')
  }

  const handleSubmitLead = async () => {
    setIsSubmitting(true)
    try {
      const rates = PROJECT_RATES[projectType]
      const leadData: LeadCreateDto = {
        fullName: contactInfo.fullName,
        email: contactInfo.email,
        phone: contactInfo.phone,
        preferredContactMethod: 'either',
        projectType,
        location: '',
        budgetRange: `$${estimateLow.toLocaleString()} - $${estimateHigh.toLocaleString()}`,
        timeline: '',
        projectDescription: `Estimated via online tool: ${rates.label}${rates.unit !== 'project' ? ` - ${size} ${rates.unit}` : ''} (${complexity} tier)`,
        pageSource: '/estimator',
        estimatedCostLow: estimateLow,
        estimatedCostHigh: estimateHigh,
      }
      await leadsApi.create(leadData)
      setStep('submitted')
    } catch {
      alert('Something went wrong. Please try again or call us at (541) 525-4133.')
    } finally {
      setIsSubmitting(false)
    }
  }

  if (!isOpen) return null

  const rates = PROJECT_RATES[projectType]
  const stepNumber = step === 'project' ? 1 : step === 'details' ? 2 : step === 'estimate' ? 3 : step === 'contact' ? 4 : 5
  const totalSteps = 4

  const fillPct = rates && rates.unit !== 'project'
    ? ((size - rates.minSize) / (rates.maxSize - rates.minSize)) * 100
    : 0

  return (
    <div
      className="emod-overlay"
      onClick={(e) => { if (e.target === e.currentTarget) handleClose() }}
    >
      <div className="emod-backdrop" />

      <div className="emod-panel">
        {/* Header */}
        <div className="emod-header">
          <div className="emod-header-row">
            <div>
              <div className="emod-header-title">Free Project Estimate</div>
              <div className="emod-header-sub">Lane County, Oregon</div>
            </div>
            <button onClick={handleClose} className="emod-close">&times;</button>
          </div>
          {step !== 'submitted' && (
            <div className="emod-progress">
              {Array.from({ length: totalSteps }).map((_, i) => (
                <div
                  key={i}
                  className={`emod-progress-seg${i < stepNumber ? ' done' : ''}`}
                />
              ))}
            </div>
          )}
        </div>

        {/* Body */}
        <div className="emod-body">

          {/* Step 1 — Pick project */}
          {step === 'project' && (
            <>
              <div className="emod-step-desc">What type of project are you planning?</div>
              <div className="emod-project-grid">
                {Object.entries(PROJECT_RATES).map(([key, val]) => (
                  <button
                    key={key}
                    onClick={() => selectProject(key)}
                    className="emod-project-btn"
                  >
                    <span className="emod-project-icon">{val.icon}</span>
                    <span className="emod-project-name">{val.label}</span>
                    {val.unit !== 'project' && (
                      <span className="emod-project-rate">
                        ${val.lowRate}&ndash;${val.highRate}/{val.unit}
                      </span>
                    )}
                  </button>
                ))}
              </div>
            </>
          )}

          {/* Step 2 — Details */}
          {step === 'details' && rates && (
            <>
              <button onClick={() => setStep('project')} className="emod-back">
                &larr; Back
              </button>
              <div className="emod-step-title">{rates.icon} {rates.label}</div>
              <div className="emod-step-sub">Adjust the details below</div>

              {rates.unit !== 'project' && (
                <div className="emod-section">
                  <div className="emod-size-row">
                    <span className="emod-label" style={{ marginBottom: 0 }}>Project Size</span>
                    <span className="emod-badge">{size} {rates.unit}</span>
                  </div>
                  <div className="est-slider-wrap">
                    <div className="est-track-bg" />
                    <div className="est-track-fill" style={{ width: `${fillPct}%` }} />
                    <input
                      type="range"
                      min={rates.minSize}
                      max={rates.maxSize}
                      step={rates.step}
                      value={size}
                      onChange={(e) => setSize(Number(e.target.value))}
                      className="est-range"
                    />
                    <div className="est-thumb" style={{ left: `${fillPct}%` }} />
                  </div>
                  <div className="est-limits">
                    <span>{rates.minSize}</span>
                    <span>{rates.maxSize} {rates.unit}</span>
                  </div>
                </div>
              )}

              <div className="emod-section">
                <span className="emod-label">Project Tier</span>
                <div className="emod-tiers">
                  {TIERS.map((t) => (
                    <button
                      key={t.key}
                      onClick={() => setComplexity(t.key)}
                      className={`emod-tier${complexity === t.key ? ' emod-active' : ''}`}
                    >
                      <div className="emod-tier-name">{t.label}</div>
                      <div className="emod-tier-desc">{t.desc}</div>
                    </button>
                  ))}
                </div>
              </div>

              <button onClick={calculateEstimate} className="emod-btn">
                Calculate Estimate
              </button>
            </>
          )}

          {/* Step 3 — Estimate result */}
          {step === 'estimate' && rates && (
            <>
              <button onClick={() => setStep('details')} className="emod-back">
                &larr; Adjust
              </button>

              <div className="emod-estimate-meta">
                <div className="emod-estimate-meta-title">{rates.label}</div>
                {rates.unit !== 'project' && (
                  <div className="emod-estimate-meta-sub">
                    {size} {rates.unit} &middot; {TIERS.find(t => t.key === complexity)?.label} tier
                  </div>
                )}
              </div>

              <div className="emod-estimate-box">
                <div className="emod-estimate-label">Estimated Cost</div>
                <div className="emod-estimate-low">${estimateLow.toLocaleString()}</div>
                <div className="emod-estimate-to">to ${estimateHigh.toLocaleString()}</div>
                <div className="emod-estimate-divider" />
                <div className="emod-estimate-footnote">Based on current Lane County, OR rates</div>
              </div>

              <button onClick={() => setStep('contact')} className="emod-btn">
                Get an Exact Quote
              </button>
              <div className="emod-call">
                Or call <a href="tel:5415254133">(541) 525-4133</a>
              </div>
            </>
          )}

          {/* Step 4 — Contact */}
          {step === 'contact' && (
            <>
              <button onClick={() => setStep('estimate')} className="emod-back">
                &larr; Back
              </button>

              <div className="emod-step-title">Get Your Exact Quote</div>
              <div className="emod-step-sub">We&apos;ll follow up within 24 hours</div>

              <div className="emod-summary-bar">
                <span className="emod-summary-name">{PROJECT_RATES[projectType]?.label}</span>
                <span className="emod-summary-value">
                  ${estimateLow.toLocaleString()} &ndash; ${estimateHigh.toLocaleString()}
                </span>
              </div>

              <div className="emod-fields">
                <div className="svc-field">
                  <label>Full Name</label>
                  <input
                    type="text"
                    value={contactInfo.fullName}
                    onChange={(e) => setContactInfo({ ...contactInfo, fullName: e.target.value })}
                    placeholder="John Smith"
                  />
                </div>
                <div className="svc-field">
                  <label>Email</label>
                  <input
                    type="email"
                    value={contactInfo.email}
                    onChange={(e) => setContactInfo({ ...contactInfo, email: e.target.value })}
                    placeholder="john@example.com"
                  />
                </div>
                <div className="svc-field">
                  <label>Phone</label>
                  <input
                    type="tel"
                    value={contactInfo.phone}
                    onChange={(e) => setContactInfo({ ...contactInfo, phone: e.target.value })}
                    placeholder="(541) 555-1234"
                  />
                </div>
              </div>

              <button
                onClick={handleSubmitLead}
                disabled={isSubmitting || !contactInfo.fullName || !contactInfo.email || !contactInfo.phone}
                className="emod-btn"
              >
                {isSubmitting ? 'Submitting...' : 'Submit Request'}
              </button>
              <div className="emod-disclaimer">
                We&apos;ll contact you within 24 hours. No spam, ever.
              </div>
            </>
          )}

          {/* Step 5 — Submitted */}
          {step === 'submitted' && (
            <div className="emod-success">
              <div className="emod-success-icon">&#10003;</div>
              <div className="emod-success-title">Request Submitted!</div>
              <div className="emod-success-body">
                We&apos;ll review your project and get back to you within 24 hours with an exact quote.
              </div>
              <button onClick={handleClose} className="emod-done-btn">
                Done
              </button>
            </div>
          )}

        </div>
      </div>
    </div>
  )
}