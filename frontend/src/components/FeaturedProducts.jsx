import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { fetchFeaturedProducts } from '../services/api';

export default function FeaturedProducts() {
  const [products, setProducts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      const result = await fetchFeaturedProducts();
      setProducts(result);
      setIsLoading(false);
    };
    loadData();
  }, []);

  if (isLoading) {
    return (
      <section className="py-[50px] w-full flex justify-center items-center">
        <div className="w-10 h-10 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
      </section>
    );
  }

  if (!products || products.length === 0) return null;

  return (
    <section className="w-full py-[40px] lg:py-[50px] bg-light">
      <div className="container-custom">
        {/* Section Header */}
        <div className="text-center mb-10 md:mb-12">
          <span className="text-primary font-semibold tracking-widest uppercase text-sm mb-2 block">
            OUR PRODUCTS
          </span>
          <h2 className="text-[32px] md:text-[38px] lg:text-[44px] font-bold text-dark leading-tight mb-4">
            Featured Products
          </h2>
          <p className="text-[16px] text-text max-w-2xl mx-auto leading-relaxed line-clamp-2">
            Explore our premium selection of highly optimized, enterprise-grade products designed to accelerate global operations.
          </p>
        </div>

        {/* Products Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 mb-12">
          {products.map((product, index) => (
            <div 
              key={product.id}
              // The CSS logic here guarantees 8 products on Desktop and Exactly 6 on Mobile/Tablet without JS hooks.
              className={`relative group bg-white rounded-[16px] shadow-sm hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2 overflow-hidden flex flex-col h-full cursor-pointer ${index >= 6 ? 'hidden lg:flex' : ''}`}
            >
              {/* Image Section (~75%) */}
              <div className="relative w-full aspect-[4/5] overflow-hidden bg-gray-100">
                <img 
                  src={product.image_path} 
                  alt={product.image_alt || product.name} 
                  title={product.image_title}
                  loading="lazy"
                  className="w-full h-full object-cover transition-transform duration-500 ease-in-out group-hover:scale-110"
                />
                
                {/* Dark Hover Overlay */}
                <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                  {/* View More Button */}
                  <Link 
                    to={`/product/${product.slug}`}
                    className="btn-primary h-[44px] px-6 rounded-[12px] flex items-center justify-center text-[15px] transform translate-y-4 group-hover:translate-y-0 opacity-0 group-hover:opacity-100 transition-all duration-300 shadow-lg"
                  >
                    View More
                  </Link>
                </div>
              </div>

              {/* Product Name Section (~25%) */}
              <div className="flex-grow p-4 md:p-5 flex items-center justify-center text-center bg-white border-t border-border/50">
                <h3 className="font-rubik font-semibold text-[15px] md:text-[16px] lg:text-[18px] text-dark leading-snug line-clamp-2 group-hover:text-primary transition-colors">
                  {product.name}
                </h3>
              </div>
            </div>
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
