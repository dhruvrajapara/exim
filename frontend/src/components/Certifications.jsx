import { useState, useEffect } from 'react';
import { fetchCertifications } from '../services/api';
import VerifiedIcon from '@mui/icons-material/Verified';

export default function Certifications() {
  const [certs, setCerts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      const result = await fetchCertifications();
      setCerts(result);
      setIsLoading(false);
    };
    loadData();
  }, []);

  if (isLoading) {
    return (
      <section className="w-full py-[40px] lg:py-[50px] bg-white animate-pulse">
        <div className="container-custom">
          <div className="text-center mb-10 md:mb-12">
             <div className="w-40 h-4 bg-gray-200 rounded mx-auto mb-2"></div>
             <div className="w-80 h-10 bg-gray-200 rounded mx-auto mb-4"></div>
             <div className="w-96 h-4 bg-gray-200 rounded mx-auto hidden md:block"></div>
          </div>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
            {[1,2,3,4].map((i) => (
              <div key={i} className="bg-white rounded-[12px] md:rounded-[16px] border border-gray-100 p-3 md:p-6 flex flex-col items-center">
                 <div className="w-24 h-16 md:h-24 bg-gray-200 rounded mb-4 md:mb-6"></div>
                 <div className="w-20 h-6 bg-gray-200 rounded-full mb-3 md:mb-4"></div>
                 <div className="w-32 h-4 bg-gray-200 rounded mb-1 md:mb-2"></div>
                 <div className="w-24 h-3 bg-gray-200 rounded"></div>
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  if (!certs || certs.length === 0) return null;

  return (
    <section className="w-full py-[40px] lg:py-[50px] bg-white">
      <div className="container-custom">
        {/* Section Header */}
        <div className="text-center mb-10 md:mb-12">
          <span className="text-primary font-semibold tracking-widest uppercase text-sm mb-2 block">
            TRUST & COMPLIANCE
          </span>
          <h2 className="text-[32px] md:text-[38px] lg:text-[44px] font-bold text-dark leading-tight mb-4">
            Our Certifications
          </h2>
          <p className="text-[16px] text-text max-w-2xl mx-auto leading-relaxed">
            Our certifications and registrations demonstrate our commitment to quality, compliance, and reliable international export services.
          </p>
        </div>

        {/* Certifications Grid (4 Desktop, 2 Mobile) */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
          {certs.map((cert) => (
            <div 
              key={cert.id}
              className="group bg-white rounded-[12px] md:rounded-[16px] border border-border hover:border-primary shadow-sm hover:shadow-lg transition-all duration-300 transform hover:-translate-y-2 flex flex-col items-center text-center p-3 md:p-6 overflow-hidden"
            >
              {/* Logo */}
              <div className="w-full h-16 md:h-24 mb-4 md:mb-6 flex items-center justify-center">
                <img 
                  src={cert.logo_path} 
                  alt={`${cert.name} Logo`} 
                  loading="lazy"
                  className="max-h-full max-w-full object-contain transition-transform duration-300 group-hover:scale-105"
                />
              </div>

              {/* Verified Badge */}
              <div className="bg-primary/10 text-primary px-2 py-1 md:px-3 md:py-1.5 rounded-full text-[10px] md:text-[12px] font-semibold flex items-center mb-3 md:mb-4 whitespace-nowrap">
                <VerifiedIcon fontSize="inherit" className="mr-1 md:mr-1.5" />
                {cert.verification_badge_text}
              </div>

              {/* Names */}
              <h3 className="font-rubik font-semibold text-[13px] md:text-[18px] text-dark leading-tight mb-1 md:mb-2">
                {cert.name}
              </h3>
              <p className="text-[11px] md:text-[14px] text-text font-medium mb-0 md:mb-3">
                {cert.authority_name}
              </p>

              {/* Optional Description (Hidden on mobile to save space and prevent overflow) */}
              {cert.short_description && (
                <p className="hidden md:block text-[13px] text-text/80 leading-snug mt-auto">
                  {cert.short_description}
                </p>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
