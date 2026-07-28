import { useState, useEffect } from 'react';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import PhoneIcon from '@mui/icons-material/Phone';
import EmailIcon from '@mui/icons-material/Email';
import LanguageIcon from '@mui/icons-material/Language';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import PublicIcon from '@mui/icons-material/Public';
import LinkedInIcon from '@mui/icons-material/LinkedIn';
import FacebookIcon from '@mui/icons-material/Facebook';
import InstagramIcon from '@mui/icons-material/Instagram';
import WhatsAppIcon from '@mui/icons-material/WhatsApp';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import { useSettings } from '../../contexts/SettingsContext';
export default function ContactSection() {
  const { settings } = useSettings();
  
  const [formData, setFormData] = useState({
    name: '',
    company: '',
    email: '',
    phone: '',
    country: '',
    product: '',
    message: '',
    agreed: false
  });
  const [products, setProducts] = useState([]);

  useEffect(() => {
    const loadProducts = async () => {
      try {
        const response = await fetch('/api/admin/products');
        if (response.ok) {
          const data = await response.json();
          setProducts(data.data || []);
        }
      } catch (error) {
        console.error('Error fetching products:', error);
      }
    };
    loadProducts();
  }, []);
  const [status, setStatus] = useState('idle'); // idle, loading, success, error

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus('loading');

    try {
      const response = await fetch('/api/inquiries', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        throw new Error('Failed to submit inquiry');
      }

      setStatus('success');
      setFormData({
        name: '', company: '', email: '', phone: '', country: '', product: '', message: '', agreed: false
      });
      setTimeout(() => setStatus('idle'), 5000);
    } catch (error) {
      console.error('Submission error:', error);
      setStatus('idle'); // Or set to an 'error' state if you have one
      alert('Failed to submit inquiry. Please try again.');
    }
  };

  return (
    <section className="py-12 md:py-16 bg-white">
      <div className="container-custom">
        <div className="flex flex-col lg:flex-row gap-8 lg:gap-12">

          {/* Left Side: Information Panel (40%) */}
          <div className="w-full lg:w-[40%] flex flex-col gap-6">
            <div className="bg-[#F9FAFB] rounded-[20px] p-8 md:p-10 border border-gray-200 shadow-sm h-full flex flex-col">

              <h2 className="font-rubik text-[28px] font-bold text-dark mb-8">Contact Information</h2>

              <div className="flex flex-col gap-6 flex-grow">
                {/* Address */}
                {settings?.contact_office_addresses && settings.contact_office_addresses.length > 0 && (
                  <div className="flex gap-4">
                    <div className="w-[40px] h-[40px] rounded-full bg-[#EAF4FF] text-[#0B63CE] flex items-center justify-center flex-shrink-0">
                      <LocationOnIcon fontSize="small" />
                    </div>
                    <div>
                      <h4 className="text-[14px] font-bold text-dark mb-1">Office Address</h4>
                      {settings.contact_office_addresses.map((address, idx) => (
                        <p key={idx} className="text-gray-600 text-[15px] whitespace-pre-line mb-2">{address}</p>
                      ))}
                    </div>
                  </div>
                )}

                {/* Phone */}
                {settings?.contact_phones && settings.contact_phones.length > 0 && (
                  <div className="flex gap-4">
                    <div className="w-[40px] h-[40px] rounded-full bg-[#EAF4FF] text-[var(--color-primary)] flex items-center justify-center flex-shrink-0">
                      <PhoneIcon fontSize="small" />
                    </div>
                    <div>
                      <h4 className="text-[14px] font-bold text-dark mb-1">Phone</h4>
                      {settings.contact_phones.map((phone, idx) => (
                        <a key={idx} href={`tel:${phone.replace(/[^0-9+]/g, '')}`} className="block text-gray-600 text-[15px] hover:text-[var(--color-primary)] mb-1">{phone}</a>
                      ))}
                    </div>
                  </div>
                )}

                {/* Email */}
                {settings?.contact_emails && settings.contact_emails.length > 0 && (
                  <div className="flex gap-4">
                    <div className="w-[40px] h-[40px] rounded-full bg-[#EAF4FF] text-[var(--color-primary)] flex items-center justify-center flex-shrink-0">
                      <EmailIcon fontSize="small" />
                    </div>
                    <div>
                      <h4 className="text-[14px] font-bold text-dark mb-1">Email</h4>
                      {settings.contact_emails.map((email, idx) => (
                        <a key={idx} href={`mailto:${email}`} className="block text-gray-600 text-[15px] hover:text-[var(--color-primary)] mb-1">{email}</a>
                      ))}
                    </div>
                  </div>
                )}

                {/* Business Hours */}
                {settings?.contact_business_hours && (
                  <div className="flex gap-4">
                    <div className="w-[40px] h-[40px] rounded-full bg-[#EAF4FF] text-[var(--color-primary)] flex items-center justify-center flex-shrink-0">
                      <AccessTimeIcon fontSize="small" />
                    </div>
                    <div>
                      <h4 className="text-[14px] font-bold text-dark mb-1">Business Hours</h4>
                      <p className="text-gray-600 text-[15px] whitespace-pre-line">{settings.contact_business_hours}</p>
                    </div>
                  </div>
                )}
              </div>

              {/* Social Icons */}
              <div className="mt-10 pt-8 border-t border-gray-200 flex gap-3">
                {settings?.social_linkedin_enabled && settings?.social_linkedin && (
                  <a href={settings.social_linkedin} target="_blank" rel="noreferrer" className="w-[44px] h-[44px] rounded-full bg-white flex items-center justify-center text-gray-500 hover:bg-[#0A66C2] hover:text-white transition-colors border border-gray-200 shadow-sm">
                    <LinkedInIcon fontSize="small" />
                  </a>
                )}
                {settings?.social_facebook_enabled && settings?.social_facebook && (
                  <a href={settings.social_facebook} target="_blank" rel="noreferrer" className="w-[44px] h-[44px] rounded-full bg-white flex items-center justify-center text-gray-500 hover:bg-[#1877F2] hover:text-white transition-colors border border-gray-200 shadow-sm">
                    <FacebookIcon fontSize="small" />
                  </a>
                )}
                {settings?.social_instagram_enabled && settings?.social_instagram && (
                  <a href={settings.social_instagram} target="_blank" rel="noreferrer" className="w-[44px] h-[44px] rounded-full bg-white flex items-center justify-center text-gray-500 hover:bg-[#E4405F] hover:text-white transition-colors border border-gray-200 shadow-sm">
                    <InstagramIcon fontSize="small" />
                  </a>
                )}
                {settings?.social_twitter_enabled && settings?.social_twitter && (
                  <a href={settings.social_twitter} target="_blank" rel="noreferrer" className="w-[44px] h-[44px] rounded-full bg-white flex items-center justify-center text-gray-500 hover:bg-[#1DA1F2] hover:text-white transition-colors border border-gray-200 shadow-sm">
                    {/* Add twitter icon if available, or just a placeholder */}
                    <LanguageIcon fontSize="small" />
                  </a>
                )}
                {settings?.social_youtube_enabled && settings?.social_youtube && (
                  <a href={settings.social_youtube} target="_blank" rel="noreferrer" className="w-[44px] h-[44px] rounded-full bg-white flex items-center justify-center text-gray-500 hover:bg-[#FF0000] hover:text-white transition-colors border border-gray-200 shadow-sm">
                    <LanguageIcon fontSize="small" /> {/* Using fallback, update icon as needed */}
                  </a>
                )}
              </div>

            </div>
          </div>

          {/* Right Side: Contact Form (60%) */}
          <div className="w-full lg:w-[60%]">
            <div className="bg-white rounded-[20px] p-8 md:p-10 border border-gray-200 shadow-sm h-full">

              <div className="mb-8">
                <h2 className="font-rubik text-[28px] font-bold text-dark mb-2">Send Us an Inquiry</h2>
                <p className="text-gray-500 text-[15px]">Fill in the details below and our export team will contact you within 24 hours.</p>
              </div>

              {status === 'success' ? (
                <div className="w-full h-64 flex flex-col items-center justify-center bg-[#EAF4FF] rounded-[16px] p-8 text-center border border-[#0B63CE]/20 animate-fade-up">
                  <CheckCircleIcon className="text-[#0B63CE] mb-4" style={{ fontSize: 64 }} />
                  <h3 className="font-rubik text-[24px] font-bold text-dark mb-2">Inquiry Sent Successfully!</h3>
                  <p className="text-gray-600">Thank you for reaching out. Our team will get back to you shortly.</p>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="flex flex-col gap-5">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    <div className="flex flex-col gap-1.5">
                      <label className="text-[14px] font-bold text-dark">Full Name *</label>
                      <input type="text" name="name" required value={formData.name} onChange={handleChange} className="w-full h-[48px] px-4 rounded-[12px] border border-gray-200 bg-[#F9FAFB] focus:bg-white focus:outline-none focus:border-[#0B63CE] focus:ring-1 focus:ring-[#0B63CE] transition-all" placeholder="John Doe" />
                    </div>
                    <div className="flex flex-col gap-1.5">
                      <label className="text-[14px] font-bold text-dark">Company Name *</label>
                      <input type="text" name="company" required value={formData.company} onChange={handleChange} className="w-full h-[48px] px-4 rounded-[12px] border border-gray-200 bg-[#F9FAFB] focus:bg-white focus:outline-none focus:border-[#0B63CE] focus:ring-1 focus:ring-[#0B63CE] transition-all" placeholder="Acme Corp" />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    <div className="flex flex-col gap-1.5">
                      <label className="text-[14px] font-bold text-dark">Email Address *</label>
                      <input type="email" name="email" required value={formData.email} onChange={handleChange} className="w-full h-[48px] px-4 rounded-[12px] border border-gray-200 bg-[#F9FAFB] focus:bg-white focus:outline-none focus:border-[#0B63CE] focus:ring-1 focus:ring-[#0B63CE] transition-all" placeholder="john@company.com" />
                    </div>
                    <div className="flex flex-col gap-1.5">
                      <label className="text-[14px] font-bold text-dark">Phone Number</label>
                      <input type="tel" name="phone" value={formData.phone} onChange={handleChange} className="w-full h-[48px] px-4 rounded-[12px] border border-gray-200 bg-[#F9FAFB] focus:bg-white focus:outline-none focus:border-[#0B63CE] focus:ring-1 focus:ring-[#0B63CE] transition-all" placeholder="+1 234 567 8900" />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    <div className="flex flex-col gap-1.5">
                      <label className="text-[14px] font-bold text-dark">Country *</label>
                      <input type="text" name="country" required value={formData.country} onChange={handleChange} className="w-full h-[48px] px-4 rounded-[12px] border border-gray-200 bg-[#F9FAFB] focus:bg-white focus:outline-none focus:border-[#0B63CE] focus:ring-1 focus:ring-[#0B63CE] transition-all" placeholder="United Kingdom" />
                    </div>
                    <div className="flex flex-col gap-1.5">
                      <label className="text-[14px] font-bold text-dark">Product Interested In *</label>
                      <select name="product" required value={formData.product} onChange={handleChange} className="w-full h-[48px] px-4 rounded-[12px] border border-gray-200 bg-[#F9FAFB] focus:bg-white focus:outline-none focus:border-[#0B63CE] focus:ring-1 focus:ring-[#0B63CE] transition-all text-gray-700">
                        <option value="">Select a product...</option>
                        {products.map((p) => (
                          <option key={p.id} value={p.name}>{p.name}</option>
                        ))}
                        <option value="Other">Other / General Inquiry</option>
                      </select>
                    </div>
                  </div>

                  <div className="flex flex-col gap-1.5">
                    <label className="text-[14px] font-bold text-dark">Message *</label>
                    <textarea name="message" required value={formData.message} onChange={handleChange} rows="4" className="w-full p-4 rounded-[12px] border border-gray-200 bg-[#F9FAFB] focus:bg-white focus:outline-none focus:border-[#0B63CE] focus:ring-1 focus:ring-[#0B63CE] transition-all resize-none" placeholder="Please describe your requirements..."></textarea>
                  </div>

                  <div className="flex items-start gap-3 mt-2">
                    <input type="checkbox" name="agreed" id="agreed" required checked={formData.agreed} onChange={handleChange} className="mt-1 w-4 h-4 rounded border-gray-300 text-[#0B63CE] focus:ring-[#0B63CE]" />
                    <label htmlFor="agreed" className="text-[14px] text-gray-500 leading-relaxed cursor-pointer">
                      I agree to the Privacy Policy and consent to {settings?.contact_company_name || 'BiteExport'} processing my personal data for the purpose of handling my inquiry.
                    </label>
                  </div>

                  <button
                    type="submit"
                    disabled={status === 'loading'}
                    className="mt-4 w-full md:w-auto self-start px-8 h-[48px] bg-[#0B63CE] text-white font-bold rounded-[12px] shadow-md hover:shadow-lg hover:-translate-y-0.5 transition-all duration-300 disabled:opacity-70 disabled:transform-none flex items-center justify-center min-w-[160px]"
                  >
                    {status === 'loading' ? (
                      <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
                    ) : (
                      "Send Inquiry"
                    )}
                  </button>
                </form>
              )}

            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
