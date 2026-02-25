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
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
        <link
          href="https://fonts.googleapis.com/css2?family=Barlow+Condensed:wght@400;600;700;800;900&family=Barlow:wght@400;500;600&display=swap"
          rel="stylesheet"
        />
      </head>
      <body>{children}</body>
    </html>
  )
}
