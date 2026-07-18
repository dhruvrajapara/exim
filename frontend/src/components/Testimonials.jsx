import { useState, useEffect } from 'react';
import { fetchTestimonials, fetchSectionSetting } from '../services/api';
import Reveal from './Reveal';
import StarIcon from '@mui/icons-material/Star';
import ArrowBackIosNewIcon from '@mui/icons-material/ArrowBackIosNew';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';

// Swiper dependencies
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination, Autoplay } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';

export default function Testimonials() {
  const [testimonials, setTestimonials] = useState([]);
  const [sectionData, setSectionData] = useState({
    subtitle: 'CLIENT TESTIMONIALS',
    title: 'What Our Clients Say',
    description: 'Discover why international buyers trust us for their global agricultural export needs.'
  });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      try {
        const [testsResult, sectionResult] = await Promise.all([
          fetchTestimonials(),
          fetchSectionSetting('home_testimonials')
        ]);
        
        setTestimonials(testsResult);
        
        if (sectionResult) {
          setSectionData({
            subtitle: sectionResult.subtitle || 'CLIENT TESTIMONIALS',
            title: sectionResult.title || 'What Our Clients Say',
            description: sectionResult.description || 'Discover why international buyers trust us for their global agricultural export needs.'
          });
        }
      } catch (err) {
        console.error("Error loading testimonials:", err);
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
        {firstWords} <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-green-500">{lastWord}</span>
      </>
    );
  };

  if (isLoading) {
    return (
      <section className="w-full py-[40px] lg:py-[50px] bg-[#f9fafb] animate-pulse">
        <div className="container-custom">
          <div className="text-center mb-10 md:mb-12">
            <div className="w-40 h-4 bg-gray-200 rounded mx-auto mb-2"></div>
            <div className="w-80 h-10 bg-gray-200 rounded mx-auto mb-4"></div>
            <div className="w-96 h-4 bg-gray-200 rounded mx-auto hidden md:block"></div>
          </div>
          <div className="flex gap-6 overflow-hidden">
             {[1,2,3].map((i) => (
                <div key={i} className="bg-white rounded-[20px] p-6 lg:p-8 border border-gray-100 flex-1 min-w-[300px] h-[250px]">
                   <div className="flex items-center mb-5">
                      <div className="w-14 h-14 bg-gray-200 rounded-full"></div>
                      <div className="ml-4">
                         <div className="w-32 h-5 bg-gray-200 rounded mb-2"></div>
                         <div className="w-24 h-3 bg-gray-200 rounded"></div>
                      </div>
                   </div>
                   <div className="w-full h-16 bg-gray-200 rounded mt-4"></div>
                </div>
             ))}
          </div>
        </div>
      </section>
    );
  }

  if (!testimonials || testimonials.length === 0) return null;

  return (
    <section className="w-full py-[40px] lg:py-[50px] bg-[#f9fafb] relative overflow-hidden">
      <div className="container-custom relative z-10">
        
        {/* Section Header */}
        <Reveal delay={0} className="text-center mb-10 md:mb-12">
          {sectionData.subtitle && (
            <span className="text-primary font-semibold tracking-widest uppercase text-[12px] md:text-[14px] mb-3 block">
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

        {/* Swiper Slider Wrapper */}
        <Reveal 
          delay={200} 
          className="relative group w-full px-2 lg:px-12 [&_.swiper-pagination-bullet-active]:bg-primary [&_.swiper-pagination-bullet]:bg-gray-300"
        >
          <Swiper
            key={testimonials.length}
            modules={[Navigation, Pagination, Autoplay]}
            spaceBetween={24}
            slidesPerView={1}
            centerInsufficientSlides={true}
            loop={testimonials.length >= 4}
            autoplay={{
              delay: 3500,
              disableOnInteraction: false,
              pauseOnMouseEnter: true,
            }}
            pagination={{ 
              clickable: true, 
              el: '.custom-pagination' 
            }}
            navigation={{
              prevEl: '.custom-prev',
              nextEl: '.custom-next',
            }}
            breakpoints={{
              768: {
                slidesPerView: 2,
              },
              1200: {
                slidesPerView: 3,
              }
            }}
            className="pb-6"
          >
            {testimonials.map((testimonial, index) => (
              <SwiperSlide key={testimonial.id || index} className="h-auto">
                <div className="bg-white rounded-[20px] p-6 lg:p-8 border border-gray-100 shadow-sm hover:shadow-[0_15px_35px_rgba(3,150,57,0.08)] transition-all duration-300 h-full flex flex-col mx-1 my-2">
                  
                  {/* Client Info Header */}
                  <div className="flex items-center mb-5">
                    {testimonial.avatar_url ? (
                      <img 
                        src={testimonial.avatar_url} 
                        alt={testimonial.client_name}
                        loading="lazy"
                        className="w-[56px] h-[56px] rounded-full object-cover border-2 border-primary/20 p-[2px]"
                        onError={(e) => { e.target.style.display = 'none'; e.target.nextSibling.style.display = 'flex'; }}
                      />
                    ) : (
                      <div className="w-[56px] h-[56px] rounded-full bg-primary/10 border-2 border-primary/20 flex items-center justify-center text-primary font-bold text-xl uppercase shrink-0">
                        {testimonial.client_name ? testimonial.client_name.charAt(0) : 'C'}
                      </div>
                    )}
                    <div className="ml-4">
                      <h4 className="font-rubik font-bold text-dark text-[17px] leading-tight mb-0.5">
                        {testimonial.client_name}
                      </h4>
                      <p className="text-[12px] text-text/80 font-medium">
                        {testimonial.company_name}
                      </p>
                      <div className="flex items-center text-[11px] text-gray-500 mt-0.5 font-semibold">
                         <img 
                           src={`https://flagcdn.com/20x15/${testimonial.flag_code}.png`} 
                           alt={testimonial.country} 
                           className="w-[14px] h-[10px] mr-1 shadow-sm" 
                         />
                         {testimonial.country}
                      </div>
                    </div>
                  </div>

                  {/* Star Rating */}
                  <div className="flex text-[#FFB800] mb-4">
                    {[...Array(5)].map((_, i) => (
                      <StarIcon 
                        key={i} 
                        fontSize="small" 
                        className={i < testimonial.star_rating ? "" : "text-gray-200"} 
                      />
                    ))}
                  </div>

                  {/* Review Description */}
                  <p className="text-[14px] lg:text-[15px] text-text/90 italic leading-[1.8] flex-grow">
                    "{testimonial.review_text}"
                  </p>
                  
                </div>
              </SwiperSlide>
            ))}
          </Swiper>

          {/* Custom Navigation (Desktop Only) */}
          <button className="custom-prev absolute left-0 top-[45%] -translate-y-1/2 z-10 w-10 h-10 lg:w-12 lg:h-12 bg-white rounded-full flex items-center justify-center text-primary shadow-[0_4px_12px_rgba(0,0,0,0.1)] hover:bg-primary hover:text-white transition-all cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed group-hover:opacity-100 opacity-0 md:opacity-100 hidden lg:flex">
             <ArrowBackIosNewIcon fontSize="small" />
          </button>
          
          <button className="custom-next absolute right-0 top-[45%] -translate-y-1/2 z-10 w-10 h-10 lg:w-12 lg:h-12 bg-white rounded-full flex items-center justify-center text-primary shadow-[0_4px_12px_rgba(0,0,0,0.1)] hover:bg-primary hover:text-white transition-all cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed group-hover:opacity-100 opacity-0 md:opacity-100 hidden lg:flex">
             <ArrowForwardIosIcon fontSize="small" />
          </button>

          {/* Custom Pagination (Dots for Mobile/Tablet) */}
          <div className="custom-pagination flex justify-center items-center mt-6 w-full h-8"></div>

        </Reveal>
      </div>
    </section>
  );
}
