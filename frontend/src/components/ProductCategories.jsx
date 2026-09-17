import { useState, useEffect } from 'react';
import { fetchProductCategories, fetchSectionSetting } from '../services/api';
import { Link } from 'react-router-dom';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import Reveal from './Reveal';

export default function ProductCategories() {
  const [categories, setCategories] = useState(() => {
    try {
      const cached = localStorage.getItem('api_cache_/api/product-categories?home=1');
      return cached ? JSON.parse(cached).data : [];
    } catch { return []; }
  });
  const [sectionSetting, setSectionSetting] = useState(() => {
    try {
      const cached = localStorage.getItem('api_cache_/api/section-settings/home_categories');
      return cached ? JSON.parse(cached).data : null;
    } catch { return null; }
  });
  const [isLoading, setIsLoading] = useState(() => {
    return !localStorage.getItem('api_cache_/api/product-categories?home=1');
  });

  useEffect(() => {
    const loadData = async () => {
      try {
        const [result, setting] = await Promise.all([
          fetchProductCategories('?home=1'),
          fetchSectionSetting('home_categories')
        ]);
        setCategories(result);
        setSectionSetting(setting);
      } catch (err) {
        console.error("Error loading categories:", err);
      } finally {
        setIsLoading(false);
      }
    };
    loadData();
  }, []);

  if (isLoading) {
    return (
      <section className="w-full py-[40px] lg:py-[50px] bg-light animate-pulse">
        <div className="container-custom">
          <div className="text-center mb-12">
            <div className="w-24 h-4 bg-gray-200 rounded mx-auto mb-2"></div>
            <div className="w-64 h-10 bg-gray-200 rounded mx-auto mb-4"></div>
            <div className="w-96 h-4 bg-gray-200 rounded mx-auto hidden md:block"></div>
          </div>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-6">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="rounded-[12px] md:rounded-[16px] bg-gray-200 aspect-square lg:aspect-auto lg:h-[420px]"></div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  if (!categories || categories.length === 0) return null;

  return (
    <section className="w-full py-[40px] lg:py-[50px] bg-light">
      <div className="container-custom">
        {/* Section Header */}
        <Reveal delay={0} className="text-center mb-10 md:mb-12">
          <span className="text-primary font-semibold tracking-widest uppercase text-sm mb-2 block">
            {sectionSetting?.subtitle || "OUR CATEGORIES"}
          </span>
          <h2 className="text-[32px] md:text-[38px] lg:text-[44px] font-bold text-dark leading-tight mb-4">
            {sectionSetting?.title || "Premium Export Products"}
          </h2>
          <p className="text-[16px] text-text max-w-2xl mx-auto leading-relaxed whitespace-pre-wrap">
            {sectionSetting?.description || "Explore our diverse range of high-quality agricultural exports. We ensure international standards of quality, packing, and timely delivery."}
          </p>
        </Reveal>

        {/* Categories Grid - Mobile: 2x2, Desktop: 4x1 */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
          {categories.map((category, index) => (
            <Reveal key={category.id} delay={index * 100}>
              <Link 
                to={`/product?category=${category.slug}`}
                className="group relative flex flex-col h-full bg-white rounded-[16px] overflow-hidden shadow-sm hover:shadow-xl transition-all duration-500 transform hover:-translate-y-2 border border-gray-100"
              >
                {/* Image Container with Zoom Effect */}
                <div className="w-full aspect-square lg:aspect-auto lg:h-[300px] overflow-hidden relative bg-gray-50">
                  <img 
                    src={category.image_path || category.image} 
                    alt={category.name}
                    className="w-full h-full object-cover transition-transform duration-700 ease-in-out group-hover:scale-110"
                    loading="lazy"
                  />
                  
                  {/* Dark Hover Overlay */}
                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-all duration-300 flex items-center justify-center">
                    <span className="inline-flex items-center justify-center bg-primary text-white h-[40px] px-5 rounded-lg font-medium text-xs md:text-sm shadow-lg transform translate-y-4 group-hover:translate-y-0 transition-all duration-300">
                      Explore Category
                      <ArrowForwardIcon fontSize="small" className="ml-1.5" />
                    </span>
                  </div>
                </div>

                {/* Content Box */}
                <div className="p-4 md:p-6 flex flex-col flex-grow items-center text-center bg-white z-10 relative border-t border-border/50">
                  <h3 className="font-rubik font-semibold text-[16px] md:text-[20px] text-dark mb-2 group-hover:text-primary transition-colors">
                    {category.name}
                  </h3>
                  {category.short_description && (
                    <p className="text-xs md:text-sm text-text/80 line-clamp-2 mb-4 flex-grow">
                      {category.short_description}
                    </p>
                  )}
                  <div className="mt-auto pt-2 flex items-center text-xs md:text-sm font-semibold text-primary group-hover:underline">
                    <span>View Products</span>
                    <ArrowForwardIcon fontSize="small" className="ml-1 w-4 h-4 transform group-hover:translate-x-1 transition-transform" />
                  </div>
                </div>
              </Link>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
