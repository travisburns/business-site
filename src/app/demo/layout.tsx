import type { Metadata } from 'next'
import { Barlow_Condensed, Barlow } from 'next/font/google'
import './globals.css'

const barlowCondensed = Barlow_Condensed({
  subsets: ['latin'],
  weight: ['400', '600', '700', '800', '900'],
  variable: '--font-barlow-condensed',
  display: 'swap',
})

const barlow = Barlow({
  subsets: ['latin'],
  weight: ['400', '500', '600'],
  variable: '--font-barlow',
  display: 'swap',
})

export const metadata: Metadata = {
  title: "Halleman Construction LLC | Eugene's Trusted Remodeling Contractor",
  description: 'Professional tile installation, kitchen remodeling, bathroom renovation, decks, fencing, and patio covers in Eugene, Oregon. Licensed, bonded, and insured with 15+ years experience.',
}

export default function DemoLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className={`${barlowCondensed.variable} ${barlow.variable} demo-root`}>
      {children}
    </div>
  )
}