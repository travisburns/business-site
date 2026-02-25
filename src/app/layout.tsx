import type { Metadata, Viewport } from "next";
import "./globals.css";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#0A0A0A",
};

export const metadata: Metadata = {
  title: {
    default: "digitalheavyweights Inc | Lead Management Systems for Contractors | Eugene, OR",
    template: "%s | digitalheavyweights Inc",
  },
  description:
    "Custom lead capture and management systems for Eugene contractors. Stop missing inquiries. Websites starting at $800 one-time, $3/month ongoing.",
  keywords: [
    "contractor lead management",
    "Eugene contractor website",
    "lead capture system",
    "contractor SEO",
    "project estimator contractors",
    "Eugene Oregon web developer",
    "contractor website Eugene",
    "lead management system",
    "local SEO contractors",
    "Lane County contractor website",
  ],
  metadataBase: new URL("https://digitalheavyweights.com"),
  alternates: {
    canonical: "/",
  },
  openGraph: {
    title: "digitalheavyweights Inc | Lead Management Systems for Contractors",
    description:
      "Custom lead management systems for Eugene contractors. Capture every inquiry, track leads, close more deals. Starting at $800.",
    url: "https://digitalheavyweights.com",
    siteName: "digitalheavyweights Inc",
    locale: "en_US",
    type: "website",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "digitalheavyweights Inc - Lead Management Systems for Contractors",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "digitalheavyweights Inc | Lead Management Systems for Contractors",
    description:
      "Custom lead management systems for Eugene contractors. Stop missing leads. Starting at $800.",
    images: ["/og-image.png"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  category: "technology",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <link rel="icon" href="/favicon.ico" sizes="any" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800;900&display=swap"
          rel="stylesheet"
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "LocalBusiness",
              name: "digitalheavyweights Inc",
              description:
                "Custom lead management systems for contractors in Eugene, Oregon. Lead capture, admin dashboards, project estimators, and local SEO.",
              url: "https://digitalheavyweights.com",
              email: "travis@digitalheavyweights.com",
              telephone: "",
              address: {
                "@type": "PostalAddress",
                addressLocality: "Eugene",
                addressRegion: "OR",
                postalCode: "97401",
                addressCountry: "US",
              },
              geo: {
                "@type": "GeoCoordinates",
                latitude: "44.0521",
                longitude: "-123.0868",
              },
              priceRange: "$800-$1800",
              openingHoursSpecification: {
                "@type": "OpeningHoursSpecification",
                dayOfWeek: [
                  "Monday",
                  "Tuesday",
                  "Wednesday",
                  "Thursday",
                  "Friday",
                ],
                opens: "09:00",
                closes: "18:00",
              },
              areaServed: [
                {
                  "@type": "City",
                  name: "Eugene",
                  containedInPlace: {
                    "@type": "State",
                    name: "Oregon",
                  },
                },
                {
                  "@type": "City",
                  name: "Springfield",
                },
                {
                  "@type": "City",
                  name: "Cottage Grove",
                },
                {
                  "@type": "City",
                  name: "Veneta",
                },
                {
                  "@type": "City",
                  name: "Coburg",
                },
              ],
              sameAs: [],
              founder: {
                "@type": "Person",
                name: "Travis",
                jobTitle: "Founder & Developer",
              },
              hasOfferCatalog: {
                "@type": "OfferCatalog",
                name: "Contractor Website Services",
                itemListElement: [
                  {
                    "@type": "Offer",
                    itemOffered: {
                      "@type": "Service",
                      name: "Basic Lead Management Website",
                      description:
                        "10-page contractor website with lead form, database, mobile optimization, and basic SEO",
                    },
                    price: "800",
                    priceCurrency: "USD",
                  },
                  {
                    "@type": "Offer",
                    itemOffered: {
                      "@type": "Service",
                      name: "Standard Lead Management System",
                      description:
                        "25-page contractor website with project estimator, admin dashboard, automated email responses, and 20 SEO pages",
                    },
                    price: "1200",
                    priceCurrency: "USD",
                  },
                  {
                    "@type": "Offer",
                    itemOffered: {
                      "@type": "Service",
                      name: "Premium Lead Management System",
                      description:
                        "Full-featured system with booking, SMS, CRM integration, analytics dashboard, and priority support",
                    },
                    price: "1800",
                    priceCurrency: "USD",
                  },
                ],
              },
            }),
          }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "Organization",
              name: "digitalheavyweights Inc",
              url: "https://digitalheavyweights.com",
              logo: "https://digitalheavyweights.com/logo.png",
              contactPoint: {
                "@type": "ContactPoint",
                email: "travis@digitalheavyweights.com",
                contactType: "customer service",
                areaServed: "US",
                availableLanguage: "English",
              },
              founder: {
                "@type": "Person",
                name: "Travis",
              },
            }),
          }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "WebSite",
              name: "digitalheavyweights Inc",
              url: "https://digitalheavyweights.com",
              potentialAction: {
                "@type": "SearchAction",
                target: "https://digitalheavyweights.com/blog?q={search_term_string}",
                "query-input": "required name=search_term_string",
              },
            }),
          }}
        />
      </head>
      <body className="antialiased">
        <a href="#main-content" className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-[100] focus:bg-primary focus:text-white focus:px-4 focus:py-2 focus:rounded-lg">
          Skip to main content
        </a>
        <Header />
        <main id="main-content" className="min-h-screen">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
