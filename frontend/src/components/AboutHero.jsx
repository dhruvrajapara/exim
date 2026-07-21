import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { fetchAboutSection } from '../services/api';
import CheckCircleOutlinedIcon from '@mui/icons-material/CheckCircleOutlined';
import KeyboardArrowRightIcon from '@mui/icons-material/KeyboardArrowRight';
import Reveal from './Reveal';

export default function AboutHero() {
  const [aboutData, setAboutData] = useState(null);
  const [stats, setStats] = useState([]);

  useEffect(() => {
    const loadData = async () => {
      const result = await fetchAboutSection();
      if (result) {
        setAboutData(result);
        if (result.active_statistics) {
          setStats(result.active_statistics);
        }
      }
    };
    loadData();
  }, []);

  return (
    <section className="relative w-full min-h-[70vh] md:min-h-[80vh] lg:h-[calc(100vh-80px)] flex items-center bg-[#000821] overflow-hidden">

      {/* Background Logistics Image with Premium Dark Overlay */}
      <div className="absolute inset-0 z-0">
        <img
          src={aboutData?.image_path || "https://images.unsplash.com/photo-1586528116311-ad8ed7c663be?q=80&w=2070&auto=format&fit=crop"}
          alt={aboutData?.image_alt || "Global Logistics and Export Warehouse"}
          className="w-full h-full object-cover opacity-20"
          loading="lazy"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-[#000821] via-[#000821]/95 to-[#000821]/70" />
      </div>

      <div className="container-custom relative z-10 py-[50px] lg:py-0 w-full">
        
        {/* Semantic Breadcrumb (Always on top for both mobile and desktop) */}
        <Reveal delay={0} className="mb-6 md:mb-8 lg:mb-2 lg:-mt-10">
          <nav aria-label="Breadcrumb" className="flex items-center text-[13px] md:text-[14px] font-medium text-gray-400">
            <Link to="/" className="hover:text-secondary transition-colors" aria-label="Go to Home">Home</Link>
            <KeyboardArrowRightIcon fontSize="small" className="mx-1 opacity-70" />
            <span className="text-white" aria-current="page">About Us</span>
          </nav>
        </Reveal>

        {/* Layout: Mobile (Image Top, Content Bottom) | Desktop (55% Left, 45% Right) */}
        <div className="flex flex-col-reverse lg:flex-row items-center justify-between gap-12 lg:gap-16 w-full">

          {/* Left Content (55%) */}
          <div className="w-full lg:w-[55%] flex flex-col justify-center items-center lg:items-start text-center lg:text-left">

            <Reveal delay={200} className="mb-6">
              <h2 className="text-[32px] md:text-[42px] lg:text-[48px] xl:text-[56px] font-bold text-white leading-[1.1] font-rubik">
                {(() => {
                  const heading = aboutData?.heading || 'About BiteExport';
                  const words = heading.split(' ');
                  if (words.length <= 1) return heading;
                  
                  // Highlight the last 3 words if it's a long heading (e.g., "Innovation & Trust"), else just the last word
                  const highlightCount = words.length >= 5 ? 3 : 1;
                  const highlightedWords = words.splice(-highlightCount).join(' ');
                  
                  return (
                    <>
                      {words.join(' ')} <span className="text-transparent bg-clip-text bg-gradient-to-r from-secondary to-[#0463C3]">{highlightedWords}</span>
                    </>
                  );
                })()}
              </h2>
            </Reveal>

            <Reveal delay={300} className="mb-8">
              <p className="text-[15px] md:text-[16px] lg:text-[18px] text-gray-300 max-w-xl leading-[1.7] opacity-90 font-light">
                {aboutData?.description || 'BiteExport is a trusted Indian merchant exporter delivering premium dehydrated vegetables, spices, and agricultural products to global markets with quality, consistency, and reliable export services.'}
              </p>
            </Reveal>

            {/* Dynamic Trust Points (Rendered in 2 Columns) */}
            {stats.length > 0 && (
              <Reveal delay={400} className="w-full mb-10">
                <div className="grid grid-cols-2 gap-y-3 gap-x-3 md:gap-x-4 max-w-xl mx-auto lg:mx-0">
                  {stats.map((stat, idx) => (
                    <div key={idx} className="flex flex-col md:flex-row items-center md:items-start justify-center md:justify-start gap-2 md:gap-3 text-gray-200 bg-white/5 border border-white/10 rounded-[10px] p-3 hover:bg-white/10 hover:border-secondary/40 transition-all duration-300 group text-center md:text-left">
                      <CheckCircleOutlinedIcon className="text-secondary flex-shrink-0 group-hover:scale-110 transition-transform" fontSize="small" />
                      <span className="text-[13px] md:text-[15px] font-medium leading-tight">
                        {stat.number_value} {stat.title}
                      </span>
                    </div>
                  ))}
                </div>
              </Reveal>
            )}

            {/* Buttons */}
            <Reveal delay={500} className="w-full sm:w-auto">
              <div className="flex flex-col sm:flex-row gap-4 w-full justify-center lg:justify-start">
                <Link
                  to={aboutData?.btn_url || "/contact"}
                  className="btn-primary w-full sm:w-auto h-[48px] px-8 rounded-[12px] shadow-lg hover:shadow-[0_8px_25px_rgba(53,153,255,0.4)] transition-all duration-300 hover:scale-[1.02] flex items-center justify-center font-medium"
                >
                  {aboutData?.btn_text || 'Contact Us'}
                </Link>
                <Link
                  to="/products"
                  className="w-full sm:w-auto h-[48px] px-8 rounded-[12px] bg-white/10 hover:bg-white/20 text-white border border-white/20 backdrop-blur-md transition-all duration-300 hover:scale-[1.02] flex items-center justify-center font-medium"
                >
                  Explore Products
                </Link>
              </div>
            </Reveal>
          </div>

          {/* Right Image (45%) */}
          <Reveal delay={300} className="w-[85%] sm:w-[70%] lg:w-[45%] flex justify-center items-center">
            <div className="relative w-full aspect-square max-h-[300px] lg:max-h-[450px]">
              {/* Premium Glow Effect */}
              <div className="absolute inset-0 bg-secondary/20 blur-[100px] animate-pulse"></div>

              {/* Premium Dummy Image - Square */}
              <img
                src={aboutData?.image_path || "https://images.unsplash.com/photo-1578575437130-527eed3abbec?q=80&w=800&auto=format&fit=crop"}
                alt={aboutData?.image_alt || "Global Export Network"}
                className="relative z-10 w-full h-full object-cover rounded-[16px] filter drop-shadow-[0_10px_25px_rgba(0,0,0,0.5)] transform hover:scale-105 transition-transform duration-700 ease-out border border-white/20"
                loading="lazy"
              />
            </div>
          </Reveal>

        </div>
      </div>
    </section>
  );
}
