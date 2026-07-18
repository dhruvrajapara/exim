import { useState, useEffect } from 'react';
import { fetchCertifications, fetchSectionSetting } from '../services/api';
import VerifiedIcon from '@mui/icons-material/Verified';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import Reveal from './Reveal';

export default function AboutCertifications() {
  const [certs, setCerts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [sectionData, setSectionData] = useState({
    subtitle: 'TRUST & COMPLIANCE',
    title: 'Our Certifications',
    description: 'Our official registrations and certifications demonstrate our commitment to quality, compliance, transparency, and international export standards.'
  });

  useEffect(() => {
    const loadData = async () => {
      try {
        const [certsResult, sectionResult] = await Promise.all([
          fetchCertifications(),
          fetchSectionSetting('about_certifications')
        ]);
        
        setCerts(certsResult);
        
        if (sectionResult) {
          setSectionData({
            subtitle: sectionResult.subtitle || 'TRUST & COMPLIANCE',
            title: sectionResult.title || 'Our Certifications',
            description: sectionResult.description || 'Our official registrations and certifications demonstrate our commitment to quality, compliance, transparency, and international export standards.'
          });
        }
      } catch (err) {
        console.error("Error loading certifications:", err);
      } finally {
        setIsLoading(false);
      }
    };
    loadData();
  }, []);

  const renderTwoColorTitle = (title) => {
    if (!title) return null;
    const words = title.trim().split(' ');
    if (words.length <= 1) return title;
    
    const lastWord = words.pop();
    const firstWords = words.join(' ');
    
    return (
      <>
        {firstWords} <span className="text-transparent bg-clip-text bg-gradient-to-r from-secondary to-[#0463C3]">{lastWord}</span>
      </>
    );
  };

  if (isLoading) {
    return (
      <section className="w-full py-[40px] lg:py-[50px] bg-white animate-pulse">
        <div className="container-custom">
          <div className="w-40 h-4 bg-gray-200 rounded mx-auto mb-2"></div>
          <div className="w-80 h-10 bg-gray-200 rounded mx-auto mb-12"></div>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="bg-gray-100 h-[280px] rounded-[20px] w-full"></div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  if (!certs || certs.length === 0) return null;

  return (
    <section className="w-full py-[40px] lg:py-[50px] bg-white relative">
      <div className="container-custom">
        
        {/* Section Header */}
        <Reveal delay={0} className="text-center mb-10 md:mb-12">
          {sectionData.subtitle && (
            <span className="text-secondary font-semibold tracking-widest uppercase text-[12px] md:text-[14px] mb-3 block">
              {sectionData.subtitle}
            </span>
          )}
          {sectionData.title && (
            <h2 className="text-[32px] md:text-[38px] lg:text-[44px] font-bold text-dark leading-tight mb-4 font-rubik">
              {renderTwoColorTitle(sectionData.title)}
            </h2>
          )}
          {sectionData.description && (
            <p className="text-[15px] md:text-[16px] lg:text-[18px] text-text/90 max-w-2xl mx-auto leading-relaxed">
              {sectionData.description}
            </p>
          )}
        </Reveal>

        {/* Certifications Grid (4 Desktop/Laptop, 2 Tablet/Mobile) */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 mb-10 lg:mb-12">
          {certs.map((cert, index) => (
            <Reveal 
              key={cert.id || index}
              delay={index * 100}
              className="group bg-white rounded-[20px] border border-gray-100 hover:border-secondary shadow-sm hover:shadow-[0_15px_35px_rgba(53,153,255,0.1)] transition-all duration-300 transform hover:-translate-y-2 flex flex-col items-center text-center p-6 lg:p-8 overflow-hidden h-full relative"
            >
              {/* Official Logo */}
              <div className="w-full h-16 md:h-20 lg:h-24 mb-5 flex items-center justify-center">
                <img 
                  src={cert.logo_path} 
                  alt={`${cert.name} Logo`} 
                  loading="lazy"
                  className="max-h-full max-w-full object-contain filter grayscale-[10%] group-hover:grayscale-0 transition-all duration-300 group-hover:scale-105"
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.src = "https://cdn-icons-png.flaticon.com/512/814/814513.png"; // Fallback globe icon
                  }}
                />
              </div>

              {/* Verified Badge Pill */}
              <div className="bg-[#039639] text-white px-3 py-1.5 md:px-4 md:py-2 rounded-full text-[10px] md:text-[12px] font-medium flex items-center mb-5 whitespace-nowrap shadow-sm">
                <VerifiedIcon fontSize="small" className="mr-1.5 opacity-90" />
                {cert.verification_badge_text || 'Government Registered'}
              </div>

              {/* Secure Info */}
              <h3 className="font-rubik font-semibold text-[15px] md:text-[18px] text-dark leading-tight mb-2 group-hover:text-secondary transition-colors">
                {cert.name}
              </h3>
              
              <p className="text-[12px] md:text-[13px] text-secondary/80 font-semibold mb-3 uppercase tracking-wider">
                {cert.authority_name}
              </p>

              <p className="text-[13px] md:text-[14px] text-text/80 leading-relaxed mt-auto line-clamp-3">
                {cert.short_description}
              </p>
            </Reveal>
          ))}
        </div>

        {/* Additional Trust Strip (Hidden on Mobile) */}
        <Reveal delay={400} className="hidden md:flex w-full max-w-5xl mx-auto bg-[#f9fafb] rounded-[16px] p-6 lg:p-8 border border-gray-100 shadow-sm flex-col md:flex-row flex-wrap items-center justify-center gap-4 md:gap-8 lg:gap-12">
           {[
             "Government Registered",
             "Export Compliant",
             "International Trade Ready",
             "Trusted by Global Buyers"
           ].map((text, i) => (
             <div key={i} className="flex items-center gap-2 group cursor-default">
               <CheckCircleIcon className="text-secondary group-hover:scale-110 transition-transform" />
               <span className="font-medium text-dark text-[14px] md:text-[15px]">{text}</span>
             </div>
           ))}
        </Reveal>

      </div>
    </section>
  );
}
