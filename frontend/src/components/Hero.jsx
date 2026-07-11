import { useState, useEffect } from 'react';
import ArrowBackIosNewIcon from '@mui/icons-material/ArrowBackIosNew';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';
import { fetchHeroSlides } from '../services/api';
import Reveal from './Reveal';

export default function Hero() {
  const [slides, setSlides] = useState(() => {
    const cached = localStorage.getItem('heroSlides_cache');
    return cached ? JSON.parse(cached) : [];
  });
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isHovered, setIsHovered] = useState(false);
  const [isLoading, setIsLoading] = useState(() => {
    return !localStorage.getItem('heroSlides_cache');
  });

  useEffect(() => {
    const loadSlides = async () => {
      try {
        const data = await fetchHeroSlides();
        setSlides(data);
        setIsLoading(false);
        localStorage.setItem('heroSlides_cache', JSON.stringify(data));
      } catch (error) {
        console.error("Failed to fetch slides:", error);
        setIsLoading(false);
      }
    };
    loadSlides();
  }, []);

  useEffect(() => {
    if (slides.length <= 1 || isHovered) return;

    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex === slides.length - 1 ? 0 : prevIndex + 1));
    }, 5000);

    return () => clearInterval(interval);
  }, [slides.length, isHovered]);

  const handleNext = () => {
    setCurrentIndex((prevIndex) => (prevIndex === slides.length - 1 ? 0 : prevIndex + 1));
  };

  const handlePrev = () => {
    setCurrentIndex((prevIndex) => (prevIndex === 0 ? slides.length - 1 : prevIndex - 1));
  };

  if (isLoading) {
    return (
      <section className="relative w-full h-[100vh] bg-dark/90 animate-pulse overflow-hidden flex items-center justify-center">
         <div className="container-custom z-10 flex flex-col items-center w-full">
            <div className="w-32 h-6 bg-gray-600 rounded-full mb-6"></div>
            <div className="w-3/4 max-w-4xl h-16 md:h-24 bg-gray-700 rounded-xl mb-8"></div>
            <div className="w-1/2 max-w-2xl h-6 bg-gray-700 rounded-xl mb-12"></div>
            <div className="flex gap-4">
              <div className="w-40 h-12 bg-gray-600 rounded-[12px]"></div>
              <div className="w-40 h-12 bg-gray-700 rounded-[12px]"></div>
            </div>
         </div>
      </section>
    );
  }

  if (slides.length === 0) return null;

  return (
    <section
      className="relative w-full h-screen bg-[#000821] text-white overflow-hidden"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      aria-roledescription="carousel"
      aria-label="Hero Highlights"
    >
      {slides.map((slide, index) => {
        const isActive = index === currentIndex;
        return (
          <div
            key={slide.id}
            className={`absolute inset-0 w-full h-full transition-opacity duration-1000 ease-in-out flex items-center ${isActive ? 'opacity-100 z-10' : 'opacity-0 z-0 pointer-events-none'}`}
            aria-hidden={!isActive}
            role="group"
            aria-roledescription="slide"
            aria-label={`${index + 1} of ${slides.length}`}
          >
            {/* Full Screen Background Image */}
            <div className="absolute inset-0 z-0">
              <img
                src={slide.image_path}
                alt={slide.image_alt}
                title={slide.image_title}
                loading={index === 0 ? 'eager' : 'lazy'}
                fetchpriority={index === 0 ? 'high' : 'auto'}
                className="w-full h-full object-cover animate-[scale-in_10s_ease-out_forwards]"
                style={{ transform: isActive ? 'scale(1.05)' : 'scale(1)', transition: 'transform 5s ease-out' }}
              />
              {/* Premium Full-Screen Dark Overlay for Text Readability */}
              <div className="absolute inset-0 bg-[#000000]/75" />
              {/* Subtle bottom fade to blend smoothly if needed */}
              <div className="absolute inset-0 bg-gradient-to-t from-[#000821]/60 via-transparent to-transparent" />
            </div>

            {/* Overlay Content */}
            <div className="container-custom relative z-20 h-full flex items-center pt-[80px]">

              <div className="w-full md:w-[80%] lg:w-[60%] flex flex-col justify-center items-start text-left space-y-4 md:space-y-6">
                {slide.label && (
                  <Reveal delay={0}>
                    <span className="text-sm md:text-base font-semibold tracking-widest uppercase text-[#6BC72A] opacity-90">
                      {slide.label}
                    </span>
                  </Reveal>
                )}

                <Reveal delay={100}>
                  <h1 className="text-[36px] md:text-[48px] lg:text-[56px] xl:text-[64px] font-bold leading-[1.1] text-white line-clamp-3">
                    {slide.heading}
                  </h1>
                </Reveal>

                {slide.description && (
                  <Reveal delay={200}>
                    <p className="text-[16px] md:text-[18px] lg:text-[20px] text-gray-200 max-w-xl line-clamp-3 leading-[1.6] opacity-90 font-light">
                      {slide.description}
                    </p>
                  </Reveal>
                )}

                <Reveal delay={300} className="w-full sm:w-auto">
                  <div className="flex flex-col sm:flex-row gap-4 pt-6 w-full sm:w-auto">
                    <a href={slide.primary_btn_url} className="btn-primary w-full sm:w-auto px-8">
                      {slide.primary_btn_text}
                    </a>
                    {slide.secondary_btn_text && (
                      <a href={slide.secondary_btn_url} className="inline-flex items-center justify-center bg-white/10 hover:bg-white/20 text-white h-[48px] px-8 rounded-md transition-all duration-300 backdrop-blur-md border border-white/20 w-full sm:w-auto">
                        {slide.secondary_btn_text}
                      </a>
                    )}
                  </div>
                </Reveal>
              </div>

            </div>
          </div>
        );
      })}

      {/* Navigation Controls (Bottom Right strictly) */}
      {slides.length > 1 && (
        <div className="absolute bottom-6 right-6 md:bottom-12 md:right-12 z-30 flex items-center space-x-2 bg-white/5 backdrop-blur-xl px-5 py-3 rounded-full border border-white/10 shadow-lg">
          <button
            onClick={handlePrev}
            className="p-2 text-white/50 hover:text-white transition-colors focus:outline-none rounded-full flex items-center justify-center"
            aria-label="Previous Slide"
          >
            <ArrowBackIosNewIcon fontSize="small" />
          </button>
          <span className="text-white/40 text-sm font-medium mx-4 tracking-widest">
            {currentIndex + 1} <span className="opacity-50">/</span> {slides.length}
          </span>
          <button
            onClick={handleNext}
            className="p-2 text-white/50 hover:text-white transition-colors focus:outline-none rounded-full flex items-center justify-center"
            aria-label="Next Slide"
          >
            <ArrowForwardIosIcon fontSize="small" />
          </button>
        </div>
      )}
    </section>
  );
}
