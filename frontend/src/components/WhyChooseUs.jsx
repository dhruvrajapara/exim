import { useState, useEffect } from 'react';
import { fetchWhyChooseUs, fetchSectionSetting } from '../services/api';
import Reveal from './Reveal';

import { getIconComponent } from './IconResolver';

export default function WhyChooseUs() {
  const [features, setFeatures] = useState([]);
  const [sectionSetting, setSectionSetting] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      const [featuresData, settingData] = await Promise.all([
        fetchWhyChooseUs(),
        fetchSectionSetting('why_choose_us')
      ]);
      setFeatures(featuresData);
      setSectionSetting(settingData);
      setIsLoading(false);
    };
    loadData();
  }, []);

  if (isLoading) {
    return (
      <section className="w-full py-[40px] lg:py-[50px] bg-white animate-pulse">
         <div className="container-custom">
            <div className="h-4 bg-gray-200 w-32 mx-auto mb-3 rounded"></div>
            <div className="h-10 bg-gray-200 w-64 mx-auto mb-4 rounded"></div>
            <div className="h-4 bg-gray-200 w-96 mx-auto mb-12 rounded"></div>
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
              {[1, 2, 3, 4, 5, 6, 7, 8].map(i => (
                <div key={i} className="bg-gray-100 h-[220px] rounded-[16px] w-full"></div>
              ))}
            </div>
         </div>
      </section>
    );
  }

  if (!features || features.length === 0) return null;

  return (
    <section className="w-full py-[40px] lg:py-[50px] bg-white">
      <div className="container-custom">
        
        {/* Section Header */}
        <Reveal delay={0} className="text-center mb-10 md:mb-12">
          <span className="text-secondary font-semibold tracking-[0.2em] uppercase text-[12px] md:text-[14px] mb-3 block">
            {sectionSetting?.subtitle || 'WHY CHOOSE US'}
          </span>
          <h2 className="text-[32px] md:text-[38px] lg:text-[44px] font-bold text-dark leading-[1.2] mb-4 font-rubik">
            {(() => {
              const titleText = sectionSetting?.title || 'Why Choose BiteExport';
              const words = titleText.split(' ');
              if (words.length <= 1) return titleText;
              
              const lastWord = words.pop();
              return (
                <>
                  {words.join(' ')} <span className="text-transparent bg-clip-text bg-gradient-to-r from-secondary to-[#0463C3]">{lastWord}</span>
                </>
              );
            })()}
          </h2>
          <p className="text-[15px] md:text-[16px] lg:text-[18px] text-text/90 max-w-2xl mx-auto leading-relaxed">
            {sectionSetting?.description || 'At BiteExport, we deliver premium-quality agricultural products backed by reliable export services, international standards, and long-term business relationships.'}
          </p>
        </Reveal>

        {/* Features Grid - 2 on Mobile/Tablet, 4 on Desktop */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
          {features.map((feature, index) => (
            <Reveal 
              key={feature.id || index} 
              delay={(index % 4) * 100} // Horizontal Cascading effect (0ms, 100ms, 200ms, 300ms)
              className="h-full"
            >
              {/* Premium Feature Card */}
              <div className="group bg-white rounded-[16px] p-5 md:p-6 lg:p-8 flex flex-col items-center text-center h-full border border-gray-100 shadow-sm hover:border-secondary/50 hover:shadow-[0_12px_30px_rgba(53,153,255,0.12)] transition-all duration-300 transform hover:-translate-y-2 overflow-hidden">
                
                {/* Dynamic Icon Wrapper */}
                <div className="w-[44px] h-[44px] lg:w-[56px] lg:h-[56px] rounded-full bg-secondary/10 text-secondary flex items-center justify-center mb-4 md:mb-6 group-hover:scale-110 group-hover:bg-secondary group-hover:text-white transition-all duration-300 shadow-sm group-hover:shadow-md">
                  <span className="text-[24px] lg:text-[30px] flex items-center justify-center">
                    {getIconComponent(feature.icon, { fontSize: 'inherit' })}
                  </span>
                </div>

                {/* Typography */}
                <h3 className="font-rubik font-semibold text-[15px] md:text-[18px] text-dark mb-2 leading-snug group-hover:text-secondary transition-colors line-clamp-2">
                  {feature.title}
                </h3>
                
                <p className="text-[13px] md:text-[14px] text-text/80 leading-[1.6] line-clamp-3">
                  {feature.short_description || feature.description}
                </p>

              </div>
            </Reveal>
          ))}
        </div>

      </div>
    </section>
  );
}
