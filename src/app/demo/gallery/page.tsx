import Header from '../components/Header'
import Footer from '../components/Footer'
import Link from 'next/link'
import Image from 'next/image'

export const metadata = {
  title: 'Project Gallery | Halleman Construction LLC Eugene OR',
  description: 'View our completed construction and remodeling projects in Eugene, Oregon. Tile installation, kitchen remodeling, bathroom renovation, decks, and more.',
}

export default function Gallery() {
  return (
    <>
      <Header />
      <main>
        {/* Hero Section */}
        <section className="bg-secondary text-white py-16">
          <div className="container">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">Project Gallery</h1>
            <p className="text-xl text-gray-200">See our quality craftsmanship in action</p>
          </div>
        </section>

        {/* Gallery Content */}
        <section className="section-padding">
          <div className="container">
            <div className="text-center max-w-3xl mx-auto mb-12">
              <h2 className="text-3xl font-bold mb-6">Our Work Speaks for Itself</h2>
              <p className="text-gray-700 text-lg">
                Browse through our completed projects showcasing tile installation, kitchen remodeling, bathroom renovation, deck construction, and more. Each project represents our commitment to quality craftsmanship and customer satisfaction.
              </p>
            </div>

            {/* Placeholder for gallery - you can add actual images later */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              <div className="bg-gray-200 rounded-lg overflow-hidden shadow-lg aspect-square flex items-center justify-center">
                <div className="text-center p-6">
                  <p className="text-gray-600 font-semibold mb-2">Tile Installation</p>
                  <p className="text-sm text-gray-500">Kitchen Backsplash - Eugene</p>
                </div>
              </div>

              <div className="bg-gray-200 rounded-lg overflow-hidden shadow-lg aspect-square flex items-center justify-center">
                <div className="text-center p-6">
                  <p className="text-gray-600 font-semibold mb-2">Kitchen Remodeling</p>
                  <p className="text-sm text-gray-500">Complete Renovation - Cottage Grove</p>
                </div>
              </div>

              <div className="bg-gray-200 rounded-lg overflow-hidden shadow-lg aspect-square flex items-center justify-center">
                       
                <div className="text-center p-6">
                      <Image
                  src="/bathroom.jpg"
                  alt="bathroom"
                  width={500}
                  height={350}
                />
                  <p className="text-gray-600 font-semibold mb-2">Bathroom Renovation</p>
                  <p className="text-sm text-gray-500">Shower Remodel - Veneta</p>
                </div>
              </div>

              <div className="bg-gray-200 rounded-lg overflow-hidden shadow-lg aspect-square flex items-center justify-center">
                <div className="text-center p-6">
                  <p className="text-gray-600 font-semibold mb-2">Deck Construction</p>
                  <p className="text-sm text-gray-500">Cedar Deck - Eugene</p>
                </div>
              </div>

              <div className="bg-gray-200 rounded-lg overflow-hidden shadow-lg aspect-square flex items-center justify-center">
                <div className="text-center p-6">
                  <p className="text-gray-600 font-semibold mb-2">Fence Installation</p>
                  <p className="text-sm text-gray-500">Privacy Fence - Coburg</p>
                </div>
              </div>

              <div className="bg-gray-200 rounded-lg overflow-hidden shadow-lg aspect-square flex items-center justify-center">
                <div className="text-center p-6">
                  <p className="text-gray-600 font-semibold mb-2">Patio Cover</p>
                  <p className="text-sm text-gray-500">Covered Patio - Eugene</p>
                </div>
              </div>
            </div>

            <div className="mt-12 text-center">
              <p className="text-gray-600 mb-6">Want to see more of our work or discuss your project?</p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link href="/contact" className="btn-primary">
                  Get Free Estimate
                </Link>
                <a href="tel:5415254133" className="btn-secondary">
                  Call (541) 525-4133
                </a>
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  )
}