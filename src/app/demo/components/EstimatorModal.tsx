'use client'
import { useEffect, useState } from 'react'
import { leadsApi } from '../lib/api'
import type { LeadCreateDto } from '../lib/types'
interface EstimatorModalProps {
  isOpen: boolean
  onClose: () => void
}
const PROJECT_RATES: Record<string, { label: string; icon: string; unit: string; lowRate: number; highRate: number; defaultSize: number; minSize: number; maxSize: number; step: number }> = {
  tile: {
    label: 'Tile Installation',
    icon: '◧',
    unit: 'sq ft',
    lowRate: 10,
    highRate: 25,
    defaultSize: 200,
    minSize: 20,
    maxSize: 2000,
    step: 10,
  },
  kitchen: {
    label: 'Kitchen Remodeling',
    icon: '⌂',
    unit: 'project',
    lowRate: 15000,
    highRate: 45000,
    defaultSize: 1,
    minSize: 1,
    maxSize: 1,
    step: 1,
  },
  bathroom: {
    label: 'Bathroom Renovation',
    icon: '◎',
    unit: 'project',
    lowRate: 9000,
    highRate: 25000,
    defaultSize: 1,
    minSize: 1,
    maxSize: 1,
    step: 1,
  },
  deck: {
    label: 'Deck Construction',
    icon: '⬒',
    unit: 'sq ft',
    lowRate: 19,
    highRate: 45,
    defaultSize: 300,
    minSize: 50,
    maxSize: 1500,
    step: 25,
  },
  fence: {
    label: 'Fence Installation',
    icon: '▥',
    unit: 'linear ft',
    lowRate: 18,
    highRate: 50,
    defaultSize: 150,
    minSize: 20,
    maxSize: 1000,
    step: 10,
  },
  patio: {
    label: 'Patio Cover',
    icon: '⛱',
    unit: 'sq ft',
    lowRate: 50,
    highRate: 150,
    defaultSize: 200,
    minSize: 50,
    maxSize: 800,
    step: 25,
  },
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
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      onClick={(e) => { if (e.target === e.currentTarget) handleClose() }}
    >
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" />
      {/* Modal */}
      <div className="relative bg-white rounded-none shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="bg-gradient-to-r from-[#2c3e50] to-[#34495e] px-12 py-10 text-white">
          <div className="flex justify-between items-start">
            <div>
              <h2 className="text-xl font-bold">Free Project Estimate</h2>
              <p className="text-white/60 text-sm mt-1">Lane County, Oregon</p>
            </div>
            <button onClick={handleClose} className="text-white/50 hover:text-white text-2xl leading-none -mt-1">&times;</button>
          </div>
          {/* Progress bar */}
          {step !== 'submitted' && (
            <div className="mt-5 flex gap-2">
              {Array.from({ length: totalSteps }).map((_, i) => (
                <div
                  key={i}
                  className={`h-1 flex-1 transition-all duration-300 ${
                    i < stepNumber ? 'bg-[#d4662a]' : 'bg-white/20'
                  }`}
                />
              ))}
            </div>
          )}
        </div>
        {/* Content */}
        <div className="px-10 py-10 overflow-y-auto flex-1">
          {/* Step 1: Pick project */}
          {step === 'project' && (
            <div>
              <p className="text-gray-500 mb-8">What type of project are you planning?</p>
              <div className="grid grid-cols-2 gap-5">
                {Object.entries(PROJECT_RATES).map(([key, val]) => (
                  <button
                    key={key}
                    onClick={() => selectProject(key)}
                    className="group p-6 border-2 border-gray-200 rounded-none hover:border-[#d4662a] hover:shadow-md transition-all text-left"
                  >
                    <span className="text-2xl block mb-2">{val.icon}</span>
                    <span className="font-semibold text-[#2c3e50] group-hover:text-[#d4662a] transition-colors">{val.label}</span>
                    {val.unit !== 'project' && (
                      <span className="block text-xs text-gray-400 mt-1">${val.lowRate}-${val.highRate}/{val.unit}</span>
                    )}
                  </button>
                ))}
              </div>
            </div>
          )}
          {/* Step 2: Details */}
          {step === 'details' && rates && (
            <div>
              <button onClick={() => setStep('project')} className="text-sm text-gray-400 hover:text-gray-600 mb-5 flex items-center gap-1">
                &larr; Back
              </button>
              <h3 className="font-bold text-lg mb-1">{rates.icon} {rates.label}</h3>
              <p className="text-gray-400 text-sm mb-8">Adjust the details below</p>
              {rates.unit !== 'project' && (
                <div className="mb-10">
                  <div className="flex justify-between items-baseline mb-3">
                    <label className="font-semibold text-[#2c3e50]">Project Size</label>
                    <div className="bg-[#2c3e50] text-white px-4 py-1.5 text-sm font-bold">
                      {size} {rates.unit}
                    </div>
                  </div>
                  <input
                    type="range"
                    min={rates.minSize}
                    max={rates.maxSize}
                    step={rates.step}
                    value={size}
                    onChange={(e) => setSize(Number(e.target.value))}
                    className="w-full h-2 appearance-none cursor-pointer accent-[#d4662a]"
                  />
                  <div className="flex justify-between text-xs text-gray-400 mt-2">
                    <span>{rates.minSize}</span>
                    <span>{rates.maxSize} {rates.unit}</span>
                  </div>
                </div>
              )}
              <div className="mb-10">
                <label className="font-semibold text-[#2c3e50] block mb-3">Project Tier</label>
                <div className="grid grid-cols-3 gap-4">
                  {TIERS.map((tier) => (
                    <button
                      key={tier.key}
                      onClick={() => setComplexity(tier.key)}
                      className={`p-5 rounded-none text-center transition-all border-2 ${
                        complexity === tier.key
                          ? 'border-[#d4662a] bg-orange-50 shadow-sm'
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      <div className={`font-bold text-sm ${complexity === tier.key ? 'text-[#d4662a]' : 'text-[#2c3e50]'}`}>
                        {tier.label}
                      </div>
                      <div className="text-[10px] text-gray-400 mt-1 leading-tight">{tier.desc}</div>
                    </button>
                  ))}
                </div>
              </div>
              <button onClick={calculateEstimate} className="w-full bg-[#d4662a] hover:bg-[#b85521] text-white font-bold py-3.5 rounded-none transition-colors">
                Calculate Estimate
              </button>
            </div>
          )}
          {/* Step 3: Estimate result */}
          {step === 'estimate' && rates && (
            <div>
              <button onClick={() => setStep('details')} className="text-sm text-gray-400 hover:text-gray-600 mb-5 flex items-center gap-1">
                &larr; Adjust
              </button>
              <div className="text-center mb-6">
                <h3 className="font-bold text-lg text-[#2c3e50]">{rates.label}</h3>
                {rates.unit !== 'project' && (
                  <p className="text-gray-400 text-sm">{size} {rates.unit} &middot; {TIERS.find(t => t.key === complexity)?.label} tier</p>
                )}
              </div>
              <div className="bg-gradient-to-br from-green-50 to-emerald-50 border border-green-200 rounded-none p-12 mb-8 text-center">
                <p className="text-green-700/60 text-sm font-medium mb-2 uppercase tracking-wide">Estimated Cost</p>
                <p className="text-4xl font-extrabold text-green-700">
                  ${estimateLow.toLocaleString()}
                </p>
                <p className="text-green-600/60 font-medium mt-1">to ${estimateHigh.toLocaleString()}</p>
                <div className="w-12 h-0.5 bg-green-300 mx-auto my-5" />
                <p className="text-xs text-green-600/50">Based on current Lane County, OR rates</p>
              </div>
              <button
                onClick={() => setStep('contact')}
                className="w-full bg-[#d4662a] hover:bg-[#b85521] text-white font-bold py-3.5 rounded-none transition-colors mb-4"
              >
                Get an Exact Quote
              </button>
              <div className="text-center">
                <a href="tel:5415254133" className="text-[#d4662a] text-sm font-semibold hover:underline">
                  Or call (541) 525-4133
                </a>
              </div>
            </div>
          )}
          {/* Step 4: Contact */}
          {step === 'contact' && (
            <div>
              <button onClick={() => setStep('estimate')} className="text-sm text-gray-400 hover:text-gray-600 mb-5 flex items-center gap-1">
                &larr; Back
              </button>
              <h3 className="font-bold text-lg text-[#2c3e50] mb-2">Get Your Exact Quote</h3>
              <div className="bg-gray-50 rounded-none p-5 mb-6 flex items-center justify-between text-sm">
                <span className="text-gray-500">{PROJECT_RATES[projectType]?.label}</span>
                <span className="font-bold text-[#2c3e50]">${estimateLow.toLocaleString()} &ndash; ${estimateHigh.toLocaleString()}</span>
              </div>
              <div className="space-y-5">
                <div>
                  <label className="block text-sm font-semibold text-[#2c3e50] mb-2">Full Name</label>
                  <input
                    type="text"
                    value={contactInfo.fullName}
                    onChange={(e) => setContactInfo({ ...contactInfo, fullName: e.target.value })}
                    placeholder="John Smith"
                    className="w-full px-5 py-3.5 border border-gray-300 rounded-none focus:outline-none focus:ring-2 focus:ring-[#d4662a] focus:border-transparent transition-all"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-[#2c3e50] mb-2">Email</label>
                  <input
                    type="email"
                    value={contactInfo.email}
                    onChange={(e) => setContactInfo({ ...contactInfo, email: e.target.value })}
                    placeholder="john@example.com"
                    className="w-full px-5 py-3.5 border border-gray-300 rounded-none focus:outline-none focus:ring-2 focus:ring-[#d4662a] focus:border-transparent transition-all"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-[#2c3e50] mb-2">Phone</label>
                  <input
                    type="tel"
                    value={contactInfo.phone}
                    onChange={(e) => setContactInfo({ ...contactInfo, phone: e.target.value })}
                    placeholder="(541) 555-1234"
                    className="w-full px-5 py-3.5 border border-gray-300 rounded-none focus:outline-none focus:ring-2 focus:ring-[#d4662a] focus:border-transparent transition-all"
                  />
                </div>
              </div>
              <button
                onClick={handleSubmitLead}
                disabled={isSubmitting || !contactInfo.fullName || !contactInfo.email || !contactInfo.phone}
                className="w-full mt-8 bg-[#d4662a] hover:bg-[#b85521] text-white font-bold py-3.5 rounded-none transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
              >
                {isSubmitting ? 'Submitting...' : 'Submit Request'}
              </button>
              <p className="text-[10px] text-gray-400 text-center mt-4">We&apos;ll contact you within 24 hours. No spam, ever.</p>
            </div>
          )}
          {/* Step 5: Done */}
          {step === 'submitted' && (
            <div className="text-center py-10">
              <div className="w-16 h-16 bg-green-100 flex items-center justify-center mx-auto mb-6">
                <span className="text-green-600 text-3xl">&#10003;</span>
              </div>
              <h3 className="font-bold text-xl text-[#2c3e50] mb-2">Request Submitted!</h3>
              <p className="text-gray-500 mb-10 max-w-xs mx-auto">
                We&apos;ll review your project and get back to you within 24 hours with an exact quote.
              </p>
              <button onClick={handleClose} className="bg-[#2c3e50] hover:bg-[#34495e] text-white font-bold px-8 py-3.5 rounded-none transition-colors">
                Done
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
