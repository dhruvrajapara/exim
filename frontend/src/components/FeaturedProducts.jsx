import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { fetchFeaturedProducts, fetchSectionSetting } from '../services/api';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import Reveal from './Reveal';

export default function FeaturedProducts() {
  const [products, setProducts] = useState([]);
  const [sectionData, setSectionData] = useState({
    subtitle: 'TOP EXPORTS',
    title: 'Featured Products',
    description: 'Discover our highest demanded export products, carefully processed and packaged to meet stringent global quality parameters.'
  });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      try {
        const [productsResult, sectionResult] = await Promise.all([
          fetchFeaturedProducts(),
          fetchSectionSetting('home_featured_products')
        ]);
        setProducts(productsResult);
        if (sectionResult) {
          setSectionData({
            subtitle: sectionResult.subtitle || 'TOP EXPORTS',
            title: sectionResult.title || 'Featured Products',
            description: sectionResult.description || 'Discover our highest demanded export products, carefully processed and packaged to meet stringent global quality parameters.'
          });
        }
      } catch (err) {
        console.error("Error loading featured products:", err);
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
          <div className="text-center mb-10 md:mb-12">
             <div className="w-32 h-4 bg-gray-200 rounded mx-auto mb-2"></div>
             <div className="w-72 h-10 bg-gray-200 rounded mx-auto mb-4"></div>
             <div className="w-96 h-4 bg-gray-200 rounded mx-auto hidden md:block"></div>
          </div>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 mb-12">
            {[1,2,3,4,5,6,7,8].map((i, index) => (
              <div key={i} className={`bg-white rounded-[16px] h-[300px] md:h-[350px] border border-gray-100 flex flex-col ${index >= 6 ? 'hidden lg:flex' : ''}`}>
                 <div className="w-full h-[75%] bg-gray-200 rounded-t-[16px]"></div>
                 <div className="w-full h-[25%] p-4 flex items-center justify-center">
                    <div className="w-3/4 h-4 bg-gray-200 rounded"></div>
                 </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  if (!products || products.length === 0) return null;

  return (
    <section className="w-full py-[40px] lg:py-[50px] bg-white">
      <div className="container-custom">
        {/* Section Header */}
        <Reveal delay={0} className="text-center mb-10 md:mb-12">
          {sectionData.subtitle && (
            <span className="text-primary font-semibold tracking-widest uppercase text-sm mb-2 block">
              {sectionData.subtitle}
            </span>
          )}
          {sectionData.title && (
            <h2 className="text-[32px] md:text-[38px] lg:text-[44px] font-bold text-dark leading-tight mb-4">
              {sectionData.title}
            </h2>
          )}
          {sectionData.description && (
            <p className="text-[16px] text-text max-w-2xl mx-auto leading-relaxed text-left line-clamp-2 md:line-clamp-3">
              {sectionData.description}
            </p>
          )}
        </Reveal>

        {/* Products Grid - Mobile: 2x3 (6 items), Desktop: 4x2 (8 items) */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 mb-10 md:mb-12">
          {products.map((product, index) => (
            <Reveal 
              key={product.id}
              delay={(index % 4) * 100}
              className={index >= 6 ? 'hidden lg:block' : 'block'}
            >
              <Link 
                to={`/product/${product.slug}`}
                className="group flex flex-col h-full bg-white rounded-[16px] overflow-hidden shadow-sm border border-gray-100 hover:border-primary/30 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2"
              >
                {/* Image Area */}
                <div className="w-full aspect-square overflow-hidden bg-gray-50 relative">
                  <img 
                    src={product.image_path || product.featured_image} 
                    alt={product.name}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                    loading="lazy"
                  />
                </div>

                {/* Content Area */}
                <div className="p-4 md:p-5 flex flex-col flex-grow items-center text-center bg-white border-t border-border/50">
                  <h3 className="font-rubik font-semibold text-[15px] md:text-[18px] text-dark mb-2 group-hover:text-primary transition-colors line-clamp-1">
                    {product.name}
                  </h3>
                  
                  {/* CSS-Only Truncation for Mobile */}
                  <div 
                    className="text-gray-600 text-sm line-clamp-2 mb-4 [&>p]:mb-0 [&>p]:inline break-words"
                    dangerouslySetInnerHTML={{ __html: product.short_description?.replace(/&nbsp;/g, ' ') }} 
                  />

                  <div className="mt-auto w-full border-t border-gray-50 pt-3">
                    <span className="text-primary font-medium text-[13px] md:text-[14px] flex items-center justify-center group-hover:underline">
                      View Details
                      <ArrowForwardIcon fontSize="small" className="ml-1 opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300" />
                    </span>
                  </div>
                </div>
              </Link>
            </Reveal>
          ))}
        </div>

        {/* View All Products Button */}
        <div className="flex justify-center">
          <Link 
            to="/products"
            className="btn-primary h-[48px] px-8 rounded-[12px] shadow-sm hover:shadow-lg transition-all duration-300 hover:scale-[1.02] flex items-center text-[16px]"
          >
            View All Products
          </Link>
        </div>
      </div>
    </section>
  );
}
