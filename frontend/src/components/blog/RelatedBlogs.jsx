import { useState, useRef } from 'react';
import { Link } from 'react-router-dom';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination, Autoplay } from 'swiper/modules';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import ArrowBackIosNewIcon from '@mui/icons-material/ArrowBackIosNew';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';

import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';

export default function RelatedBlogs({ blogs }) {
  if (!blogs || blogs.length === 0) return null;

  const [activeIndex, setActiveIndex] = useState(0);
  const swiperRef = useRef(null);

  return (
    <section className="py-12 md:py-16 bg-[#F9FAFB]">
      <div className="container-custom">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 gap-4">
          <div>
            <span className="text-[#0B63CE] text-[14px] font-bold tracking-widest uppercase mb-2 block">
              You may also like
            </span>
            <h2 className="font-rubik text-[32px] md:text-[36px] font-bold text-dark">
              Related Articles
            </h2>
          </div>
          
          <div className="flex items-center gap-3">
            <button 
              onClick={() => swiperRef.current?.swiper.slidePrev()}
              className="w-[44px] h-[44px] rounded-full bg-white border border-[#E5E7EB] flex items-center justify-center text-dark hover:bg-[#0B63CE] hover:text-white hover:border-[#0B63CE] transition-all shadow-sm"
            >
              <ArrowBackIosNewIcon fontSize="small" />
            </button>
            <button 
              onClick={() => swiperRef.current?.swiper.slideNext()}
              className="w-[44px] h-[44px] rounded-full bg-white border border-[#E5E7EB] flex items-center justify-center text-dark hover:bg-[#0B63CE] hover:text-white hover:border-[#0B63CE] transition-all shadow-sm"
            >
              <ArrowForwardIosIcon fontSize="small" />
            </button>
          </div>
        </div>

        <Swiper
          ref={swiperRef}
          modules={[Navigation, Pagination, Autoplay]}
          spaceBetween={24}
          slidesPerView={1}
          autoplay={{ delay: 5000, disableOnInteraction: false }}
          pagination={{ clickable: true, el: '.custom-swiper-pagination-related' }}
          onSlideChange={(swiper) => setActiveIndex(swiper.realIndex)}
          breakpoints={{
            640: { slidesPerView: 2 },
            1024: { slidesPerView: 3 },
          }}
          className="pb-16"
        >
          {blogs.map((blog) => (
            <SwiperSlide key={blog.id} className="h-auto">
              <Link to={`/blog/${blog.slug}`} className="block group h-full">
                <div className="h-full bg-white rounded-[18px] border border-[#E5E7EB] overflow-hidden shadow-sm hover:shadow-xl hover:-translate-y-2 transition-all duration-300 flex flex-col">
                  <div className="aspect-[4/3] overflow-hidden relative">
                    <img 
                      src={blog.featured_image} 
                      alt={blog.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
                    />
                  </div>

                  <div className="p-6 md:p-8 flex flex-col flex-grow">
                    <div className="flex items-center justify-between mb-4">
                      <span className="text-[#0B63CE] text-[12px] font-bold uppercase tracking-wide">
                        {blog.category}
                      </span>
                      <span className="text-gray-400 text-[12px] font-medium">
                        {blog.reading_time || '5 min read'}
                      </span>
                    </div>

                    <h3 className="font-rubik text-[20px] font-bold text-dark leading-tight mb-3 group-hover:text-[#0B63CE] transition-colors line-clamp-2">
                      {blog.title}
                    </h3>
                    
                    <p className="text-gray-600 text-[14px] line-clamp-3 mb-6 flex-grow">
                      {blog.short_description}
                    </p>

                    <div className="flex items-center justify-between border-t border-gray-100 pt-5 mt-auto">
                      <span className="text-[14px] font-bold text-[#0B63CE]">Read More</span>
                      <div className="w-[36px] h-[36px] rounded-full bg-[#EAF4FF] text-[#0B63CE] flex items-center justify-center group-hover:bg-[#0B63CE] group-hover:text-white transition-colors duration-300">
                        <ArrowForwardIcon fontSize="small" className="-rotate-45 group-hover:rotate-0 transition-transform duration-300" />
                      </div>
                    </div>
                  </div>
                </div>
              </Link>
            </SwiperSlide>
          ))}
        </Swiper>
        <div className="custom-swiper-pagination-related flex justify-center gap-2 mt-4"></div>
      </div>
    </section>
  );
}
