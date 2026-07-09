import { useState, useEffect } from 'react';
import WhatsAppIcon from '@mui/icons-material/WhatsApp';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';

export default function FloatingActionButtons() {
  const [isVisible, setIsVisible] = useState(false);

  // Toggle visibility of the "Scroll to Top" button based on scroll position
  useEffect(() => {
    const toggleVisibility = () => {
      if (window.scrollY > 400) {
        setIsVisible(true);
      } else {
        setIsVisible(false);
      }
    };

    window.addEventListener('scroll', toggleVisibility, { passive: true });
    return () => window.removeEventListener('scroll', toggleVisibility);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    });
  };

  return (
    <div className="fixed bottom-6 right-6 md:bottom-8 md:right-8 z-50 flex flex-col gap-3 md:gap-4 items-center">
      
      {/* Scroll to Top Button */}
      <button
        onClick={scrollToTop}
        className={`w-10 h-10 md:w-12 md:h-12 bg-[#000821]/80 hover:bg-primary text-white rounded-full flex items-center justify-center shadow-lg hover:shadow-xl transition-all duration-500 border border-white/10 backdrop-blur-md group ${
          isVisible ? 'opacity-100 translate-y-0 scale-100' : 'opacity-0 translate-y-8 scale-50 pointer-events-none'
        }`}
        aria-label="Scroll to top"
      >
        <KeyboardArrowUpIcon className="group-hover:-translate-y-1 transition-transform" />
      </button>

      {/* WhatsApp Floating Button */}
      <a
        href="https://wa.me/" // You can replace this with your actual WhatsApp link later from DB
        target="_blank"
        rel="noopener noreferrer"
        className={`relative flex items-center justify-center w-12 h-12 md:w-14 md:h-14 bg-[#25D366] text-white rounded-full shadow-[0_4px_15px_rgba(37,211,102,0.3)] hover:shadow-[0_8px_25px_rgba(37,211,102,0.5)] transition-all duration-500 group ${
          isVisible ? 'opacity-100 translate-y-0 scale-100 hover:-translate-y-1' : 'opacity-0 translate-y-8 scale-50 pointer-events-none'
        }`}
        aria-label="Chat on WhatsApp"
      >
        <WhatsAppIcon className="!w-6 !h-6 md:!w-8 md:!h-8 z-10" />
        {/* Subtle Ping Animation Ring - Only animate when visible to save CPU */}
        <span className={`absolute inset-0 rounded-full border-2 border-[#25D366] opacity-60 ${isVisible ? 'animate-ping' : ''}`}></span>
      </a>
      
    </div>
  );
}
