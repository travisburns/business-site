import Header from '../components/Header'
import Footer from '../components/Footer'

export const metadata = {
  title: 'Terms of Service | Halleman Construction LLC',
  description: 'Terms of service for Halleman Construction LLC',
}

export default function TermsOfService() {
  return (
    <>
      <Header />
      <main>
        <section className="section-padding">
          <div className="container max-w-4xl">
            <h1 className="text-4xl font-bold mb-8">Terms of Service</h1>
            
            <div className="prose prose-lg max-w-none">
              <p className="text-gray-600 mb-6">Last updated: {new Date().toLocaleDateString()}</p>

              <h2 className="text-2xl font-bold mt-8 mb-4">Services</h2>
              <p className="mb-4">
                Halleman Construction LLC provides professional construction and remodeling services including tile installation, kitchen remodeling, bathroom renovation, deck construction, fence installation, and patio covers in Eugene, Oregon and surrounding areas.
              </p>

              <h2 className="text-2xl font-bold mt-8 mb-4">Estimates</h2>
              <p className="mb-4">
                All estimates provided are approximations based on the information provided by the client. Final project costs may vary based on actual project scope, materials selected, and unforeseen conditions discovered during work.
              </p>

              <h2 className="text-2xl font-bold mt-8 mb-4">Project Timeline</h2>
              <p className="mb-4">
                Project timelines are estimates and may be affected by weather conditions, material availability, permit processing times, and other factors beyond our control. We will communicate any timeline changes as they occur.
              </p>

              <h2 className="text-2xl font-bold mt-8 mb-4">Payment Terms</h2>
              <p className="mb-4">
                Payment terms will be outlined in individual project contracts. Typical payment schedules include deposits, progress payments, and final payment upon completion.
              </p>

              <h2 className="text-2xl font-bold mt-8 mb-4">Licensing and Insurance</h2>
              <p className="mb-4">
                Halleman Construction LLC is a licensed, bonded, and insured contractor in the state of Oregon. We maintain all required licenses and insurance coverage for your protection.
              </p>

              <h2 className="text-2xl font-bold mt-8 mb-4">Warranty</h2>
              <p className="mb-4">
                We stand behind our work and offer warranties on workmanship. Specific warranty terms will be outlined in individual project contracts.
              </p>

              <h2 className="text-2xl font-bold mt-8 mb-4">Contact Information</h2>
              <p className="mb-2">
                <strong>Phone:</strong> <a href="tel:5415254133" className="text-primary hover:text-primary-dark">(541) 525-4133</a>
              </p>
              <p className="mb-4">
                <strong>Email:</strong> <a href="mailto:info@hallemanconstructionllc.com" className="text-primary hover:text-primary-dark">info@hallemanconstructionllc.com</a>
              </p>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  )
}