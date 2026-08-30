import { useState, useEffect } from 'react';
import CloseIcon from '@mui/icons-material/Close';
import SendIcon from '@mui/icons-material/Send';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';

export default function RFQModal({ isOpen, onClose, initialProduct = '' }) {
  const [formData, setFormData] = useState({
    name: '',
    company: '',
    email: '',
    phone: '',
    country: '',
    product: initialProduct || '',
    quantity: '',
    quantity_unit: 'MT',
    packaging_requirement: '',
    destination_port: '',
    incoterm: 'FOB',
    private_labelling: 'No',
    sample_required: 'No',
    message: '',
    honeypot: '', // Spam protection
    consent: false
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    if (initialProduct) {
      setFormData(prev => ({ ...prev, product: initialProduct }));
    }
  }, [initialProduct]);

  if (!isOpen) return null;

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Honeypot anti-spam check
    if (formData.honeypot) {
      return;
    }

    if (!formData.consent) {
      setErrorMessage('Please accept the consent checkbox to proceed.');
      return;
    }

    setIsSubmitting(true);
    setErrorMessage('');

    try {
      const response = await fetch('/api/inquiries', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify(formData)
      });

      const data = await response.json();

      if (response.ok && data.success) {
        setIsSuccess(true);
      } else {
        setErrorMessage(data.message || 'Failed to submit RFQ. Please check input fields.');
      }
    } catch (err) {
      setErrorMessage('Connection error. Please try again later.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto border border-gray-100 p-6 md:p-8 relative">
        
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 w-9 h-9 rounded-full bg-gray-100 flex items-center justify-center text-gray-500 hover:bg-gray-200 transition-colors"
          aria-label="Close modal"
        >
          <CloseIcon fontSize="small" />
        </button>

        {isSuccess ? (
          <div className="py-12 text-center flex flex-col items-center">
            <div className="w-16 h-16 bg-green-100 text-green-600 rounded-full flex items-center justify-center mb-4">
              <CheckCircleIcon sx={{ fontSize: 40 }} />
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-2">RFQ Submitted Successfully!</h3>
            <p className="text-gray-600 max-w-md mb-6">
              Thank you for your Request for Quotation. Our export sales team will review your specifications and contact you within 24 hours.
            </p>
            <button
              onClick={() => {
                setIsSuccess(false);
                onClose();
              }}
              className="px-6 py-2.5 bg-[#0B63CE] text-white rounded-lg font-semibold hover:bg-blue-700 transition-colors"
            >
              Done
            </button>
          </div>
        ) : (
          <div>
            <div className="mb-6">
              <span className="text-[#0B63CE] font-bold uppercase text-xs tracking-wider">BiteExport Global Sourcing</span>
              <h2 className="text-2xl font-bold text-gray-900 mt-1">Request For Quotation (RFQ)</h2>
              <p className="text-sm text-gray-500">Fill in your product quantity, Incoterms, and specifications to get official FOB/CIF pricing.</p>
            </div>

            {errorMessage && (
              <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-700 rounded-lg text-xs font-medium">
                {errorMessage}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              
              {/* Honeypot hidden input */}
              <input
                type="text"
                name="honeypot"
                value={formData.honeypot}
                onChange={handleChange}
                className="hidden"
                tabIndex="-1"
                autoComplete="off"
              />

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">Full Name *</label>
                  <input
                    type="text"
                    required
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 text-xs focus:border-[#0B63CE] outline-none"
                    placeholder="John Doe"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">Company Name *</label>
                  <input
                    type="text"
                    required
                    name="company"
                    value={formData.company}
                    onChange={handleChange}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 text-xs focus:border-[#0B63CE] outline-none"
                    placeholder="Global Foods Corp"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">Business Email *</label>
                  <input
                    type="email"
                    required
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 text-xs focus:border-[#0B63CE] outline-none"
                    placeholder="buyer@company.com"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">Phone / WhatsApp</label>
                  <input
                    type="text"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 text-xs focus:border-[#0B63CE] outline-none"
                    placeholder="+1 234 567 8900"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">Buyer Country *</label>
                  <input
                    type="text"
                    required
                    name="country"
                    value={formData.country}
                    onChange={handleChange}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 text-xs focus:border-[#0B63CE] outline-none"
                    placeholder="United States, UAE..."
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">Product Required *</label>
                  <input
                    type="text"
                    required
                    name="product"
                    value={formData.product}
                    onChange={handleChange}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 text-xs focus:border-[#0B63CE] outline-none"
                    placeholder="Dehydrated Red Onion Flakes"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">Quantity</label>
                  <input
                    type="text"
                    name="quantity"
                    value={formData.quantity}
                    onChange={handleChange}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 text-xs focus:border-[#0B63CE] outline-none"
                    placeholder="20"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">Quantity Unit</label>
                  <select
                    name="quantity_unit"
                    value={formData.quantity_unit}
                    onChange={handleChange}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 text-xs focus:border-[#0B63CE] outline-none bg-white"
                  >
                    <option value="MT">MT (Metric Ton)</option>
                    <option value="KG">KG (Kilograms)</option>
                    <option value="20ft Container">20ft Container</option>
                    <option value="40ft Container">40ft Container</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">Incoterm</label>
                  <select
                    name="incoterm"
                    value={formData.incoterm}
                    onChange={handleChange}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 text-xs focus:border-[#0B63CE] outline-none bg-white"
                  >
                    <option value="FOB">FOB (Free On Board)</option>
                    <option value="CIF">CIF (Cost, Insurance & Freight)</option>
                    <option value="CFR">CFR (Cost & Freight)</option>
                    <option value="EXW">EXW (Ex Works)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">Destination Port</label>
                  <input
                    type="text"
                    name="destination_port"
                    value={formData.destination_port}
                    onChange={handleChange}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 text-xs focus:border-[#0B63CE] outline-none"
                    placeholder="Port of Hamburg / Jebel Ali"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">Private Labelling?</label>
                  <select
                    name="private_labelling"
                    value={formData.private_labelling}
                    onChange={handleChange}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 text-xs focus:border-[#0B63CE] outline-none bg-white"
                  >
                    <option value="No">No</option>
                    <option value="Yes">Yes</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">Product Specification / Message *</label>
                <textarea
                  required
                  rows={3}
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  className="w-full border border-gray-300 rounded-lg p-3 text-xs focus:border-[#0B63CE] outline-none"
                  placeholder="Specify mesh size, moisture content, packaging type (20kg bag/carton), etc."
                />
              </div>

              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="rfq_consent"
                  name="consent"
                  checked={formData.consent}
                  onChange={handleChange}
                  className="w-4 h-4 text-[#0B63CE] rounded"
                />
                <label htmlFor="rfq_consent" className="text-xs text-gray-600">
                  I agree to allow BiteExport to process my business details for quotation purposes.
                </label>
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-3 bg-[#0B63CE] text-white rounded-lg text-sm font-semibold hover:bg-blue-700 transition-colors shadow-sm flex items-center justify-center gap-2"
              >
                {isSubmitting ? (
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                ) : (
                  <>
                    <SendIcon fontSize="small" />
                    <span>Submit Request For Quotation</span>
                  </>
                )}
              </button>
            </form>
          </div>
        )}
      </div>
    </div>
  );
}
