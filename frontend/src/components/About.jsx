import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { fetchAboutSection } from '../services/api';
import DomainIcon from '@mui/icons-material/Domain';
import LocalShippingIcon from '@mui/icons-material/LocalShipping';
import LanguageIcon from '@mui/icons-material/Language';
import PublicIcon from '@mui/icons-material/Public';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import Reveal from './Reveal';

// Mapping icons dynamically since the database stores strings
const getIcon = (title) => {
  const t = title.toLowerCase();
  if (t.includes('experience') || t.includes('year')) return <DomainIcon fontSize="large" />;
  if (t.includes('shipment') || t.includes('logistic')) return <LocalShippingIcon fontSize="large" />;
  if (t.includes('buyer') || t.includes('client')) return <LanguageIcon fontSize="large" />;
  if (t.includes('countr') || t.includes('global')) return <PublicIcon fontSize="large" />;
  return <DomainIcon fontSize="large" />;
};

export default function About() {
  const [data, setData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      const result = await fetchAboutSection();
      setData(result);
      setIsLoading(false);
    };
    loadData();
  }, []);

  if (isLoading) {
    return (
      <section className="w-full bg-white overflow-hidden flex flex-col items-center justify-center min-h-[auto] lg:min-h-[calc(100vh-80px)] py-[40px] lg:py-[40px] animate-pulse">
        <div className="container-custom h-full flex flex-col justify-center">
          <div className="flex flex-col-reverse lg:flex-row items-center justify-between h-full gap-12 lg:gap-16">
            <div className="w-full lg:w-[55%] flex flex-col justify-center items-center lg:items-start text-center lg:text-left h-full py-4">
               <div className="w-32 h-4 bg-gray-200 rounded mb-3"></div>
               <div className="w-3/4 h-12 bg-gray-200 rounded mb-6"></div>
               <div className="w-full h-4 bg-gray-200 rounded mb-2"></div>
               <div className="w-5/6 h-4 bg-gray-200 rounded mb-10"></div>
               <div className="w-full grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4 mb-6">
                 {[1,2,3,4].map(i => (
                   <div key={i} className="bg-gray-100 rounded-[12px] h-[120px] w-full"></div>
                 ))}
               </div>
               <div className="w-40 h-12 bg-gray-200 rounded-[12px]"></div>
            </div>
            <div className="w-[90%] sm:w-[80%] lg:w-[45%] h-full flex justify-center items-center relative py-6">
               <div className="w-full aspect-square max-h-[400px] lg:max-h-[70vh] bg-gray-100 rounded-full"></div>
            </div>
          </div>
        </div>
      </section>
    );
  }

  if (!data) return null;

  return (
    <section className="w-full bg-white overflow-hidden flex flex-col items-center justify-center min-h-[auto] lg:min-h-[calc(100vh-80px)] py-[40px] lg:py-[40px]">
      <div className="container-custom h-full flex flex-col justify-center">
        <div className="flex flex-col-reverse lg:flex-row items-center justify-between h-full gap-12 lg:gap-16">
          
          {/* Left Side: Content & Statistics (w-[55%] on Desktop) */}
          <Reveal delay={0} className="w-full lg:w-[55%] flex flex-col justify-center items-center lg:items-start text-center lg:text-left h-full py-4">
            {data.label && (
              <span className="text-primary font-semibold tracking-widest uppercase text-sm mb-3 block">
                {data.label}
              </span>
            )}
            
            <h2 className="text-[32px] md:text-[38px] lg:text-[44px] font-bold text-dark leading-[1.2] mb-6">
              {data.heading}
            </h2>
            
            <p className="text-[16px] md:text-[18px] text-text mb-10 leading-relaxed max-w-2xl">
              {data.description}
            </p>

            {/* Statistics Grid (1 Row of 4 on Desktop, 2x2 on Mobile/Tablet) */}
            {data.active_statistics && data.active_statistics.length > 0 && (
              <div className="w-full grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4 mb-6">
                {data.active_statistics.slice(0, 4).map((stat) => (
                  <div 
                    key={stat.id} 
                    className="bg-light rounded-[12px] p-4 flex flex-col items-center lg:items-start shadow-sm hover:shadow-md transition-all duration-300 transform hover:-translate-y-1 border border-border h-full justify-center"
                  >
                    <div className="text-primary mb-2 flex items-center justify-center">
                      {getIcon(stat.title)}
                    </div>
                    <h3 className="text-[24px] lg:text-[28px] font-bold text-dark leading-none mb-1">
                      {stat.number_value}
                    </h3>
                    <p className="text-[13px] lg:text-[14px] font-medium text-text leading-tight">
                      {stat.title}
                    </p>
                  </div>
                ))}
              </div>
            )}

            {data.btn_text && data.btn_url && (
              <div className="mt-auto lg:mt-0">
                <Link 
                  to={data.btn_url} 
                  className="btn-primary w-full sm:w-auto h-[48px] px-8 rounded-[12px] shadow-sm hover:shadow-lg transition-all duration-300 hover:scale-[1.02] inline-flex items-center justify-center text-[16px]"
                >
                  {data.btn_text}
                </Link>
              </div>
            )}
          </Reveal>

          {/* Right Side: Image (w-[45%] on Desktop) */}
          <Reveal delay={200} className="w-[90%] sm:w-[80%] lg:w-[45%] flex justify-center items-center relative py-6">
            <div className="relative w-full max-h-[400px] lg:max-h-[70vh] aspect-square flex justify-center items-center group">
              
              {/* Premium Multi-Layered Background Glow */}
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[90%] h-[90%] bg-gradient-to-tr from-primary/30 to-[#6BC72A]/10 rounded-full filter blur-[80px] opacity-70 group-hover:opacity-100 transition-opacity duration-700"></div>
              <div className="absolute bottom-0 right-0 w-[60%] h-[60%] bg-blue-500/10 rounded-full filter blur-[60px] opacity-50"></div>
              
              {/* Main Image */}
              <img 
                src={data.image_path} 
                alt={data.image_alt || data.heading} 
                title={data.image_title}
                fetchPriority="high"
                className="relative z-10 w-full h-full object-contain drop-shadow-2xl transition-transform duration-700 ease-out group-hover:scale-105"
              />

              {/* Decorative Dots Pattern */}
              <div className="absolute -bottom-6 -left-6 w-24 h-24 bg-[radial-gradient(#039639_2px,transparent_2px)] [background-size:16px_16px] opacity-20 z-0"></div>
            </div>
          </Reveal>

        </div>
      </div>
    </section>
  );
}
