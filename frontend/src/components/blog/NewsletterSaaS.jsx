import { useState } from 'react';
import MarkEmailReadIcon from '@mui/icons-material/MarkEmailRead';
import { useSettings } from '../../contexts/SettingsContext';
import { subscribeNewsletter } from '../../services/api';

export default function NewsletterSaaS() {
  const { settings } = useSettings();
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState('idle');
  const [message, setMessage] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email) return;
    
    setStatus('loading');
    try {
      const res = await subscribeNewsletter(email);
      setStatus('success');
      setMessage(res.message || 'Successfully subscribed!');
      setEmail('');
    } catch (err) {
      setStatus('error');
      setMessage(err.message || 'Failed to subscribe. Please try again.');
    }
    
    setTimeout(() => {
      setStatus('idle');
      setMessage('');
    }, 5000);
  };

  return (
    <section className="py-12 md:py-16 bg-[#F9FAFB]">
      <div className="container-custom">
        <div className="bg-gradient-to-br from-dark to-[#00143A] rounded-[24px] md:rounded-[32px] overflow-hidden relative shadow-2xl">
          
          {/* Subtle Grid / Noise Texture */}
          <div 
            className="absolute inset-0 opacity-20 pointer-events-none mix-blend-overlay"
            style={{ backgroundImage: 'radial-gradient(rgba(255,255,255,0.4) 1px, transparent 1px)', backgroundSize: '30px 30px' }}
          ></div>

          {/* Accent Blue Glow */}
          <div className="absolute top-0 right-0 w-[50%] h-full bg-[#0B63CE]/20 blur-[100px] pointer-events-none"></div>

          <div className="relative z-10 p-10 md:p-16 flex flex-col lg:flex-row items-center gap-10 lg:gap-16">
            
            {/* Left: Text Content */}
            <div className="w-full lg:w-1/2 text-center lg:text-left">
              <div className="inline-flex items-center justify-center w-[56px] h-[56px] rounded-[16px] bg-[#EAF4FF]/10 text-[#EAF4FF] mb-6 shadow-inner border border-white/10 backdrop-blur-sm">
                <MarkEmailReadIcon fontSize="medium" />
              </div>
              <h2 className="font-rubik text-[32px] md:text-[40px] font-bold text-white leading-tight mb-4 tracking-tight">
                {settings?.newsletter_title || 'Stay Updated with Export Market Insights'}
              </h2>
              <p className="text-gray-300 text-[16px] md:text-[18px] max-w-md mx-auto lg:mx-0">
                {settings?.newsletter_description || 'Get export tips, buyer trends and global food industry updates delivered straight to your inbox.'}
              </p>
            </div>

            {/* Right: Form */}
            <div className="w-full lg:w-1/2 flex items-center justify-center lg:justify-end">
              <div className="w-full flex flex-col gap-2">
                <form 
                  className="w-full max-w-md bg-white/5 backdrop-blur-md p-2 rounded-[16px] border border-white/10 flex flex-col sm:flex-row gap-2 shadow-lg relative"
                  onSubmit={handleSubmit}
                >
                  <input 
                    type="email" 
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Enter your email address"
                    required
                    disabled={status === 'loading'}
                    className="flex-grow h-[54px] px-5 rounded-[12px] bg-transparent text-white placeholder-gray-400 focus:outline-none focus:bg-white/10 transition-colors border-none text-[16px] disabled:opacity-50"
                  />
                  <button 
                    type="submit" 
                    disabled={status === 'loading'}
                    className="h-[54px] px-8 rounded-[12px] bg-[#0B63CE] text-white font-semibold hover:bg-[#084b9e] transition-colors duration-300 shadow-md whitespace-nowrap disabled:opacity-70 flex items-center justify-center min-w-[140px]"
                  >
                    {status === 'loading' ? 'Subscribing...' : 'Subscribe'}
                  </button>
                </form>
                {message && (
                  <div className={`text-sm mt-2 font-medium ${status === 'success' ? 'text-green-400' : 'text-red-400'}`}>
                    {message}
                  </div>
                )}
              </div>
            </div>

          </div>
        </div>
      </div>
    </section>
  );
}
