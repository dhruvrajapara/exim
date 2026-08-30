import SEO from '../components/SEO';

export default function PrivacyPolicy() {
  return (
    <div className="w-full bg-[#F9FAFB] min-h-screen py-12 md:py-16">
      <SEO
        title="Privacy Policy"
        description="Privacy Policy for BiteExport merchant exporter and global sourcing partner."
        canonical="https://biteexport.com/privacy-policy"
      />

      <div className="container-custom max-w-4xl bg-white p-8 md:p-12 rounded-2xl border border-gray-100 shadow-sm">
        <h1 className="text-3xl font-bold text-gray-900 mb-6">Privacy Policy</h1>
        <p className="text-gray-600 text-sm mb-4">Last Updated: August 30, 2026</p>

        <div className="space-y-6 text-sm text-gray-700 leading-relaxed">
          <p>
            At <strong>BiteExport</strong>, accessible from <a href="https://biteexport.com" className="text-[#0B63CE] underline">https://biteexport.com</a>, one of our main priorities is the privacy of our visitors and business partners. This Privacy Policy document outlines the types of information collected and how it is used.
          </p>

          <h2 className="text-xl font-bold text-gray-900 pt-2">1. Information We Collect</h2>
          <p>
            When you submit a Request for Quotation (RFQ), subscribe to our newsletter, or contact our export team, we may collect:
          </p>
          <ul className="list-disc pl-6 space-y-1">
            <li>Full Name and Company Name</li>
            <li>Business Email Address and Phone / WhatsApp number</li>
            <li>Buyer Country, Destination Port, and Product Specifications</li>
          </ul>

          <h2 className="text-xl font-bold text-gray-900 pt-2">2. How We Use Your Information</h2>
          <p>We use the collected information exclusively to:</p>
          <ul className="list-disc pl-6 space-y-1">
            <li>Process export quotations, Incoterm calculations, and RFQ inquiries</li>
            <li>Communicate order status, batch specifications, and shipment documentation</li>
            <li>Send periodic product catalogues and market updates (you may unsubscribe at any time)</li>
          </ul>

          <h2 className="text-xl font-bold text-gray-900 pt-2">3. Data Protection and Security</h2>
          <p>
            We implement industry-standard administrative and technical security measures to protect your commercial details against unauthorized access or disclosure. We do not sell or trade your business information to third parties.
          </p>

          <h2 className="text-xl font-bold text-gray-900 pt-2">4. Contact Us</h2>
          <p>
            If you have additional questions or require more information about our Privacy Policy, do not hesitate to contact us at <a href="mailto:info@biteexport.com" className="text-[#0B63CE] underline">info@biteexport.com</a>.
          </p>
        </div>
      </div>
    </div>
  );
}
