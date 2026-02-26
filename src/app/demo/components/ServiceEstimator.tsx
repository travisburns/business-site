'use client'
import { useState } from 'react'
import Link from 'next/link'

const PROJECT_RATES: Record<string, { label: string; unit: string; lowRate: number; highRate: number; defaultSize: number; minSize: number; maxSize: number; step: number }> = {
  tile: { label: 'Tile Installation', unit: 'sq ft', lowRate: 10, highRate: 25, defaultSize: 200, minSize: 20, maxSize: 2000, step: 10 },
  kitchen: { label: 'Kitchen Remodeling', unit: 'project', lowRate: 15000, highRate: 45000, defaultSize: 1, minSize: 1, maxSize: 1, step: 1 },
  bathroom: { label: 'Bathroom Renovation', unit: 'project', lowRate: 9000, highRate: 25000, defaultSize: 1, minSize: 1, maxSize: 1, step: 1 },
  deck: { label: 'Deck & Fencing', unit: 'sq ft', lowRate: 19, highRate: 45, defaultSize: 300, minSize: 50, maxSize: 1500, step: 25 },
  fence: { label: 'Fence Installation', unit: 'linear ft', lowRate: 18, highRate: 50, defaultSize: 150, minSize: 20, maxSize: 1000, step: 10 },
  patio: { label: 'Patio Cover', unit: 'sq ft', lowRate: 50, highRate: 150, defaultSize: 200, minSize: 50, maxSize: 800, step: 25 },
}

const TIERS = [
  { key: 'basic' as const, label: 'Basic', multiplier: 0.8 },
  { key: 'mid' as const, label: 'Standard', multiplier: 1.0 },
  { key: 'high' as const, label: 'Premium', multiplier: 1.3 },
]

export default function ServiceEstimator({ defaultType }: { defaultType: string }) {
  const rates = PROJECT_RATES[defaultType]
  const [size, setSize] = useState(rates?.defaultSize ?? 200)
  const [tier, setTier] = useState<'basic' | 'mid' | 'high'>('mid')
  const [calculated, setCalculated] = useState(false)
  const [low, setLow] = useState(0)
  const [high, setHigh] = useState(0)

  if (!rates) return null

  const calculate = () => {
    const mult = TIERS.find(t => t.key === tier)?.multiplier ?? 1.0
    if (rates.unit === 'project') {
      setLow(Math.round(rates.lowRate * mult))
      setHigh(Math.round(rates.highRate * mult))
    } else {
      setLow(Math.round(size * rates.lowRate * mult))
      setHigh(Math.round(size * rates.highRate * mult))
    }
    setCalculated(true)
  }

  const fillPct = rates.unit !== 'project'
    ? ((size - rates.minSize) / (rates.maxSize - rates.minSize)) * 100
    : 0

  return (
    <div className="est-card">
      <div className="est-title">{rates.label} Cost Estimator</div>

      {rates.unit !== 'project' && (
        <div className="est-section">
          <div className="est-label-row">
            <span className="est-label">Project Size</span>
            <span className="est-badge">{size} {rates.unit}</span>
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
              onChange={(e) => { setSize(Number(e.target.value)); setCalculated(false) }}
              className="est-range"
            />
            <div
              className="est-thumb"
              style={{ left: `${fillPct}%` }}
            />
          </div>
          <div className="est-limits">
            <span>{rates.minSize}</span>
            <span>{rates.maxSize} {rates.unit}</span>
          </div>
        </div>
      )}

      <div className="est-section">
        <div className="est-label-row">
          <span className="est-label">Project Tier</span>
        </div>
        <div className="est-tiers">
          {TIERS.map((t) => (
            <button
              key={t.key}
              onClick={() => { setTier(t.key); setCalculated(false) }}
              className={`est-tier${tier === t.key ? ' est-active' : ''}`}
            >
              {t.label}
            </button>
          ))}
        </div>
      </div>

      {!calculated ? (
        <button onClick={calculate} className="svc-submit">
          Calculate Estimate
        </button>
      ) : (
        <>
          <div className="est-result">
            <div className="est-result-label">Estimated Cost</div>
            <div className="est-result-price">
              ${low.toLocaleString()} &ndash; ${high.toLocaleString()}
            </div>
            <div className="est-result-sub">Based on Lane County, OR rates</div>
          </div>
          <Link href="/demo/contact" className="est-quote-link">
            Get an Exact Quote
          </Link>
          <button onClick={() => setCalculated(false)} className="est-adjust">
            Adjust estimate
          </button>
        </>
      )}
    </div>
  )
}
