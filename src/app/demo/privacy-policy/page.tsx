import Header from '../components/Header'
import Footer from '../components/Footer'

export const metadata = {
  title: 'Privacy Policy | Halleman Construction LLC',
  description: 'Privacy policy for Halleman Construction LLC',
}

export default function PrivacyPolicy() {
  return (
    <>
      <Header />
      <main>
        <section className="section-padding">
          <div className="container max-w-4xl">
            <h1 className="text-4xl font-bold mb-8">Privacy Policy</h1>
            
            <div className="prose prose-lg max-w-none">
              <p className="text-gray-600 mb-6">Last updated: {new Date().toLocaleDateString()}</p>

              <h2 className="text-2xl font-bold mt-8 mb-4">Information We Collect</h2>
              <p className="mb-4">
                When you request an estimate or contact us through our website, we collect personal information including your name, email address, phone number, and project details. This information is used solely to respond to your inquiry and provide construction services.
              </p>

              <h2 className="text-2xl font-bold mt-8 mb-4">How We Use Your Information</h2>
              <p className="mb-4">
                We use the information you provide to:
              </p>
              <ul className="list-disc pl-6 mb-4">
                <li>Respond to your estimate requests and inquiries</li>
                <li>Schedule consultations and appointments</li>
                <li>Provide construction and remodeling services</li>
                <li>Send project updates and communications</li>
              </ul>

              <h2 className="text-2xl font-bold mt-8 mb-4">Information Sharing</h2>
              <p className="mb-4">
                We do not sell, trade, or share your personal information with third parties. Your information is kept confidential and used only for providing our construction services.
              </p>

              <h2 className="text-2xl font-bold mt-8 mb-4">Data Security</h2>
              <p className="mb-4">
                We implement appropriate security measures to protect your personal information from unauthorized access, alteration, or disclosure.
              </p>

              <h2 className="text-2xl font-bold mt-8 mb-4">Contact Us</h2>
              <p className="mb-4">
                If you have questions about this privacy policy, please contact us at:
              </p>
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