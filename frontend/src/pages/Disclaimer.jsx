import SEO from '../components/SEO';

export default function Disclaimer() {
  return (
    <div className="w-full bg-[#F9FAFB] min-h-screen py-12 md:py-16">
      <SEO
        title="Disclaimer"
        description="Official Disclaimer for BiteExport merchant export services and product specifications."
        canonical="https://biteexport.com/disclaimer"
      />

      <div className="container-custom max-w-4xl bg-white p-8 md:p-12 rounded-2xl border border-gray-100 shadow-sm">
        <h1 className="text-3xl font-bold text-gray-900 mb-6">Legal Disclaimer</h1>
        <p className="text-gray-600 text-sm mb-4">Last Updated: August 30, 2026</p>

        <div className="space-y-6 text-sm text-gray-700 leading-relaxed">
          <p>
            The information provided by <strong>BiteExport</strong> on <a href="https://biteexport.com" className="text-[#0B63CE] underline">https://biteexport.com</a> is for general informational and trade inquiry purposes only.
          </p>

          <h2 className="text-xl font-bold text-gray-900 pt-2">1. Merchant Exporter Sourcing Disclaimer</h2>
          <p>
            BiteExport is a registered merchant exporter and global sourcing partner. BiteExport sources products from inspected and verified third-party manufacturing units across India. References to quality assurance and processing standards refer to our rigorous sourcing checks and partner supplier controls.
          </p>

          <h2 className="text-xl font-bold text-gray-900 pt-2">2. Product Images and Representative Samples</h2>
          <p>
            Product images, packaging visual representations, and specifications shown on the website are for demonstration and product identification purposes. Final packaging designs, private labels, and moisture/purity parameters are confirmed individually in official commercial contracts.
          </p>

          <h2 className="text-xl font-bold text-gray-900 pt-2">3. Limitation of Liability</h2>
          <p>
            In no event shall BiteExport be liable for any indirect, special, or consequential damages resulting from reliance on website materials without prior commercial confirmation.
          </p>
        </div>
      </div>
    </div>
  );
}
