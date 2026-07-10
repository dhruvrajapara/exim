import { useState } from 'react';
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

export default function ContactSection() {
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
  
  const [status, setStatus] = useState('idle'); // idle, loading, success, error

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setStatus('loading');
    
    // Simulate API call
    setTimeout(() => {
      setStatus('success');
      setFormData({
        name: '', company: '', email: '', phone: '', country: '', product: '', message: '', agreed: false
      });
      setTimeout(() => setStatus('idle'), 5000);
    }, 1500);
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
                <div className="flex gap-4">
                  <div className="w-[40px] h-[40px] rounded-full bg-[#EAF4FF] text-[#0B63CE] flex items-center justify-center flex-shrink-0">
                    <LocationOnIcon fontSize="small" />
                  </div>
                  <div>
                    <h4 className="text-[14px] font-bold text-dark mb-1">Office Address</h4>
                    <p className="text-gray-600 text-[15px]">BiteExport<br/>Surat, Gujarat, India</p>
                  </div>
                </div>

                {/* Phone */}
                <div className="flex gap-4">
                  <div className="w-[40px] h-[40px] rounded-full bg-[#EAF4FF] text-[#0B63CE] flex items-center justify-center flex-shrink-0">
                    <PhoneIcon fontSize="small" />
                  </div>
                  <div>
                    <h4 className="text-[14px] font-bold text-dark mb-1">Phone</h4>
                    <a href="tel:+919876543210" className="text-gray-600 text-[15px] hover:text-[#0B63CE]">+91 98765 43210</a>
                  </div>
                </div>

                {/* Email */}
                <div className="flex gap-4">
                  <div className="w-[40px] h-[40px] rounded-full bg-[#EAF4FF] text-[#0B63CE] flex items-center justify-center flex-shrink-0">
                    <EmailIcon fontSize="small" />
                  </div>
                  <div>
                    <h4 className="text-[14px] font-bold text-dark mb-1">Email</h4>
                    <a href="mailto:info@biteexport.com" className="block text-gray-600 text-[15px] hover:text-[#0B63CE] mb-1">info@biteexport.com</a>
                    <a href="mailto:sales@biteexport.com" className="block text-gray-600 text-[15px] hover:text-[#0B63CE]">sales@biteexport.com</a>
                  </div>
                </div>

                {/* Website */}
                <div className="flex gap-4">
                  <div className="w-[40px] h-[40px] rounded-full bg-[#EAF4FF] text-[#0B63CE] flex items-center justify-center flex-shrink-0">
                    <LanguageIcon fontSize="small" />
                  </div>
                  <div>
                    <h4 className="text-[14px] font-bold text-dark mb-1">Website</h4>
                    <a href="https://www.biteexport.com" target="_blank" rel="noreferrer" className="text-gray-600 text-[15px] hover:text-[#0B63CE]">www.biteexport.com</a>
                  </div>
                </div>

                {/* Business Hours */}
                <div className="flex gap-4">
                  <div className="w-[40px] h-[40px] rounded-full bg-[#EAF4FF] text-[#0B63CE] flex items-center justify-center flex-shrink-0">
                    <AccessTimeIcon fontSize="small" />
                  </div>
                  <div>
                    <h4 className="text-[14px] font-bold text-dark mb-1">Business Hours</h4>
                    <p className="text-gray-600 text-[15px]">Monday – Saturday<br/>9:00 AM – 6:00 PM (IST)</p>
                  </div>
                </div>

                {/* Export Markets */}
                <div className="flex gap-4">
                  <div className="w-[40px] h-[40px] rounded-full bg-[#EAF4FF] text-[#0B63CE] flex items-center justify-center flex-shrink-0">
                    <PublicIcon fontSize="small" />
                  </div>
                  <div>
                    <h4 className="text-[14px] font-bold text-dark mb-1">Export Markets</h4>
                    <p className="text-gray-600 text-[15px]">United Kingdom, Germany, Australia, Middle East, Africa</p>
                  </div>
                </div>
              </div>

              {/* Social Icons */}
              <div className="mt-10 pt-8 border-t border-gray-200 flex gap-3">
                <a href="#" className="w-[44px] h-[44px] rounded-full bg-white flex items-center justify-center text-gray-500 hover:bg-[#0A66C2] hover:text-white transition-colors border border-gray-200 shadow-sm">
                  <LinkedInIcon fontSize="small" />
                </a>
                <a href="#" className="w-[44px] h-[44px] rounded-full bg-white flex items-center justify-center text-gray-500 hover:bg-[#1877F2] hover:text-white transition-colors border border-gray-200 shadow-sm">
                  <FacebookIcon fontSize="small" />
                </a>
                <a href="#" className="w-[44px] h-[44px] rounded-full bg-white flex items-center justify-center text-gray-500 hover:bg-[#E4405F] hover:text-white transition-colors border border-gray-200 shadow-sm">
                  <InstagramIcon fontSize="small" />
                </a>
                <a href="#" className="w-[44px] h-[44px] rounded-full bg-white flex items-center justify-center text-gray-500 hover:bg-[#25D366] hover:text-white transition-colors border border-gray-200 shadow-sm">
                  <WhatsAppIcon fontSize="small" />
                </a>
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
                        <option value="Dehydrated Onion">Dehydrated Onion</option>
                        <option value="Dehydrated Garlic">Dehydrated Garlic</option>
                        <option value="Indian Spices">Indian Spices</option>
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
                      I agree to the Privacy Policy and consent to BiteExport processing my personal data for the purpose of handling my inquiry.
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
