import { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { fetchLatestBlogs } from '../services/api';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import Reveal from './Reveal';

export default function LatestBlogs() {
  const [blogs, setBlogs] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const sliderRef = useRef(null);

  useEffect(() => {
    const loadData = async () => {
      const result = await fetchLatestBlogs();
      setBlogs(result);
      setIsLoading(false);
    };
    loadData();
  }, []);

  const scrollLeft = () => {
    if (sliderRef.current) {
      sliderRef.current.scrollBy({ left: -350, behavior: 'smooth' });
    }
  };

  const scrollRight = () => {
    if (sliderRef.current) {
      sliderRef.current.scrollBy({ left: 350, behavior: 'smooth' });
    }
  };

  const formatDate = (dateString) => {
    const options = { day: 'numeric', month: 'long', year: 'numeric' };
    return new Date(dateString).toLocaleDateString('en-GB', options);
  };

  if (isLoading) {
    return (
      <section className="w-full py-[40px] lg:py-[50px] bg-light animate-pulse">
        <div className="container-custom overflow-hidden">
          <div className="text-center mb-10 md:mb-12">
             <div className="w-32 h-4 bg-gray-200 rounded mx-auto mb-2"></div>
             <div className="w-72 h-10 bg-gray-200 rounded mx-auto mb-4"></div>
             <div className="w-96 h-4 bg-gray-200 rounded mx-auto hidden md:block"></div>
          </div>
          <div className="flex gap-4 md:gap-6 overflow-hidden">
            {[1,2,3,4].map((i) => (
              <div key={i} className="flex-none w-full md:w-[calc(50%-12px)] lg:w-[calc(25%-18px)] bg-white rounded-[16px] h-[400px] border border-gray-100 flex flex-col">
                 <div className="w-full h-[200px] bg-gray-200 rounded-t-[16px]"></div>
                 <div className="p-5">
                    <div className="w-32 h-4 bg-gray-200 rounded mb-4"></div>
                    <div className="w-full h-6 bg-gray-200 rounded mb-2"></div>
                    <div className="w-2/3 h-6 bg-gray-200 rounded mb-4"></div>
                    <div className="w-full h-4 bg-gray-200 rounded mb-2"></div>
                    <div className="w-4/5 h-4 bg-gray-200 rounded mb-6"></div>
                    <div className="w-24 h-4 bg-gray-200 rounded"></div>
                 </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  if (!blogs || blogs.length === 0) return null;

  return (
    <section className="w-full py-[40px] lg:py-[50px] bg-light relative">
      <div className="container-custom">
        {/* Section Header */}
        <Reveal delay={0} className="text-center mb-10 md:mb-12 relative">
          <span className="text-primary font-semibold tracking-widest uppercase text-sm mb-2 block">
            LATEST ARTICLES
          </span>
          <h2 className="text-[32px] md:text-[38px] lg:text-[44px] font-bold text-dark leading-tight mb-4">
            Latest Blogs & Insights
          </h2>
          <p className="text-[16px] text-text max-w-2xl mx-auto leading-relaxed">
            Stay updated with our latest export knowledge, industry trends, product information, and international trade insights.
          </p>

          {/* Desktop Slider Navigation Buttons */}
          <div className="hidden lg:flex absolute right-0 top-1/2 -translate-y-1/2 gap-2">
            <button 
              onClick={scrollLeft}
              className="w-10 h-10 rounded-full border border-border flex items-center justify-center bg-white text-dark hover:bg-primary hover:text-white hover:border-primary transition-colors shadow-sm"
              aria-label="Previous Blogs"
            >
              <ChevronLeftIcon />
            </button>
            <button 
              onClick={scrollRight}
              className="w-10 h-10 rounded-full border border-border flex items-center justify-center bg-white text-dark hover:bg-primary hover:text-white hover:border-primary transition-colors shadow-sm"
              aria-label="Next Blogs"
            >
              <ChevronRightIcon />
            </button>
          </div>
        </Reveal>

        {/* Native CSS Scroll-Snap Slider */}
        <Reveal delay={100} className="relative">
          <div 
            ref={sliderRef}
            className="flex overflow-x-auto snap-x snap-mandatory gap-4 md:gap-6 pb-6 hide-scrollbar cursor-grab active:cursor-grabbing"
            style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
          >
          {blogs.map((blog) => (
            <div 
              key={blog.id}
              className="flex-none w-full md:w-[calc(50%-12px)] lg:w-[calc(25%-18px)] snap-start group bg-white rounded-[16px] border border-border hover:border-transparent shadow-sm hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2 flex flex-col overflow-hidden"
            >
              {/* Featured Image */}
              <div className="w-full aspect-video overflow-hidden">
                <img 
                  src={blog.featured_image} 
                  alt={blog.title} 
                  loading="lazy"
                  className="w-full h-full object-cover transition-transform duration-500 ease-in-out group-hover:scale-110"
                />
              </div>

              {/* Card Content */}
              <div className="p-5 md:p-6 flex flex-col flex-grow">
                {/* Published Date */}
                <div className="flex items-center text-text/70 text-[13px] font-medium mb-3">
                  <CalendarMonthIcon fontSize="small" className="mr-1.5" />
                  {formatDate(blog.published_date)}
                </div>

                {/* Title */}
                <h3 className="font-rubik font-semibold text-[18px] md:text-[20px] text-dark leading-snug mb-3 line-clamp-2 group-hover:text-primary transition-colors">
                  {blog.title}
                </h3>

                {/* Excerpt */}
                <p className="text-[14px] text-text/80 leading-relaxed line-clamp-3 mb-6">
                  {blog.short_description}
                </p>

                {/* Read Blog Button */}
                <div className="mt-auto pt-4 border-t border-border/50">
                  <Link 
                    to={`/blog/${blog.slug}`}
                    className="inline-flex items-center font-semibold text-[15px] text-primary group-hover:text-primary-dark transition-colors"
                  >
                    Read Blog 
                    <ArrowForwardIcon fontSize="small" className="ml-1 transform transition-transform group-hover:translate-x-1" />
                  </Link>
                </div>
              </div>
            </div>
          ))}
          </div>
        </Reveal>

        {/* View All Blogs Button */}
        <Reveal delay={200} className="flex justify-center mt-6">
          <Link 
            to="/blog"
            className="btn-primary h-[48px] px-8 rounded-[12px] shadow-sm hover:shadow-lg transition-all duration-300 hover:scale-[1.02] flex items-center text-[16px]"
          >
            View All Blogs
          </Link>
        </Reveal>
      </div>
    </section>
  );
}
