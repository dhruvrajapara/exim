import SEO from '../components/SEO';

export default function TermsConditions() {
  return (
    <div className="w-full bg-[#F9FAFB] min-h-screen py-12 md:py-16">
      <SEO
        title="Terms & Conditions"
        description="Terms and Conditions for BiteExport international trade and export sourcing operations."
        canonical="https://biteexport.com/terms-conditions"
      />

      <div className="container-custom max-w-4xl bg-white p-8 md:p-12 rounded-2xl border border-gray-100 shadow-sm">
        <h1 className="text-3xl font-bold text-gray-900 mb-6">Terms & Conditions</h1>
        <p className="text-gray-600 text-sm mb-4">Last Updated: August 30, 2026</p>

        <div className="space-y-6 text-sm text-gray-700 leading-relaxed">
          <p>
            Welcome to <strong>BiteExport</strong> (<a href="https://biteexport.com" className="text-[#0B63CE] underline">https://biteexport.com</a>). By accessing our website and placing export inquiries or contracts, you agree to comply with the following Terms and Conditions.
          </p>

          <h2 className="text-xl font-bold text-gray-900 pt-2">1. Business Scope & Merchant Exporter Positioning</h2>
          <p>
            BiteExport operates as a merchant exporter and global sourcing partner based in Surat, Gujarat, India. Products supplied (including dehydrated onion, garlic, and spices) are sourced from quality-verified manufacturing partners and inspected according to international export standards.
          </p>

          <h2 className="text-xl font-bold text-gray-900 pt-2">2. Quotations, Pricing & Incoterms</h2>
          <p>
            Quotations provided via our Request for Quotation (RFQ) tool or email are valid for the period specified in the proforma invoice. All shipping terms (FOB, CIF, CFR, EXW) and payment terms (Letter of Credit, Advance T/T) are governed by final written proforma invoices or sales contracts.
          </p>

          <h2 className="text-xl font-bold text-gray-900 pt-2">3. Product Specifications & Batch Variations</h2>
          <p>
            Agricultural and dehydrated products may exhibit minor natural variations in mesh size, color, or aroma across different crop seasons. Authoritative specifications are confirmed per batch prior to dispatch.
          </p>

          <h2 className="text-xl font-bold text-gray-900 pt-2">4. Governing Law</h2>
          <p>
            Any disputes arising out of contracts or website usage shall be governed by the laws of India and subject to the exclusive jurisdiction of the courts in Surat, Gujarat, India.
          </p>
        </div>
      </div>
    </div>
  );
}
