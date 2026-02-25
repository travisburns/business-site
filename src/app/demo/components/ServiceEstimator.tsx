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

  return (
    <div className="max-w-xl mx-auto bg-white p-8 shadow-lg border border-gray-200">
      <h3 className="font-bold text-lg text-center mb-6">{rates.label} Cost Estimator</h3>

      {rates.unit !== 'project' && (
        <div className="mb-6">
          <div className="flex justify-between items-baseline mb-2">
            <label className="font-semibold text-gray-700">Project Size</label>
            <span className="bg-[#2c3e50] text-white px-3 py-1 text-sm font-bold">{size} {rates.unit}</span>
          </div>
          <div className="relative w-full h-8 flex items-center">
            <div className="absolute left-0 right-0 h-1.5 bg-gray-200 rounded-full" />
            <div
              className="absolute left-0 h-1.5 bg-[#d4662a] rounded-full"
              style={{ width: `${((size - rates.minSize) / (rates.maxSize - rates.minSize)) * 100}%` }}
            />
            <input
              type="range"
              min={rates.minSize}
              max={rates.maxSize}
              step={rates.step}
              value={size}
              onChange={(e) => { setSize(Number(e.target.value)); setCalculated(false) }}
              className="absolute w-full h-8 opacity-0 cursor-pointer z-10"
            />
            <div
              className="absolute w-5 h-5 bg-[#d4662a] border-2 border-white shadow-md rounded-full pointer-events-none"
              style={{ left: `calc(${((size - rates.minSize) / (rates.maxSize - rates.minSize)) * 100}% - 10px)` }}
            />
          </div>
          <div className="flex justify-between text-xs text-gray-400 mt-1">
            <span>{rates.minSize}</span>
            <span>{rates.maxSize} {rates.unit}</span>
          </div>
        </div>
      )}

      <div className="mb-6">
        <label className="font-semibold text-gray-700 block mb-2">Project Tier</label>
        <div className="grid grid-cols-3 gap-3">
          {TIERS.map((t) => (
            <button
              key={t.key}
              onClick={() => { setTier(t.key); setCalculated(false) }}
              className={`py-3 text-center border-2 transition-all text-sm font-semibold ${
                tier === t.key
                  ? 'border-[#d4662a] bg-orange-50 text-[#d4662a]'
                  : 'border-gray-200 text-gray-600 hover:border-gray-300'
              }`}
            >
              {t.label}
            </button>
          ))}
        </div>
      </div>

      {!calculated ? (
        <button
          onClick={calculate}
          className="w-full bg-[#d4662a] hover:bg-[#b85521] text-white font-bold py-3 transition-colors"
        >
          Calculate Estimate
        </button>
      ) : (
        <div>
          <div className="bg-green-50 border border-green-200 p-6 text-center mb-4">
            <p className="text-green-700/60 text-sm font-medium mb-1 uppercase tracking-wide">Estimated Cost</p>
            <p className="text-3xl font-extrabold text-green-700">
              ${low.toLocaleString()} &ndash; ${high.toLocaleString()}
            </p>
            <p className="text-xs text-green-600/50 mt-2">Based on Lane County, OR rates</p>
          </div>
          <Link
            href="/contact"
            className="block w-full bg-[#d4662a] hover:bg-[#b85521] text-white font-bold py-3 text-center transition-colors"
          >
            Get an Exact Quote
          </Link>
          <button
            onClick={() => setCalculated(false)}
            className="w-full mt-2 text-sm text-gray-400 hover:text-gray-600 py-2"
          >
            Adjust estimate
          </button>
        </div>
      )}
    </div>
  )
}
