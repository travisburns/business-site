import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'Halleman Construction LLC | Eugene\'s Trusted Remodeling Contractor',
  description: 'Professional tile installation, kitchen remodeling, bathroom renovation, decks, fencing, and patio covers in Eugene, Oregon. Licensed, bonded, and insured with 15+ years experience.',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}