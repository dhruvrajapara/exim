import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import { fetchProductCategories } from '../services/api';

export default function ProductCategories() {
  const [categories, setCategories] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadCategories = async () => {
      const data = await fetchProductCategories();
      setCategories(data);
      setIsLoading(false);
    };
    loadCategories();
  }, []);

  if (isLoading) {
    return (
      <section className="py-[50px] w-full flex justify-center items-center">
        <div className="w-10 h-10 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
      </section>
    );
  }

  if (categories.length === 0) return null;

  return (
    <section className="w-full py-[40px] md:py-[50px] bg-light">
      <div className="container-custom">
        {/* Section Header */}
        <div className="text-center mb-12">
          <span className="text-primary font-semibold tracking-widest uppercase text-sm mb-2 block">
            Our Portfolio
          </span>
          <h2 className="text-[32px] md:text-[42px] font-bold text-dark mb-4">
            Product Categories
          </h2>
          <p className="text-text max-w-2xl mx-auto text-[16px]">
            Explore our enterprise-grade hardware and software solutions designed to scale with your business and secure your infrastructure.
          </p>
        </div>

        {/* Categories Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-6">
          {categories.map((category) => (
            <div 
              key={category.id}
              className="group relative rounded-[16px] overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2 aspect-square lg:aspect-auto lg:h-[420px] bg-dark cursor-pointer"
            >
              {/* Image */}
              <img 
                src={category.image_path} 
                alt={category.image_alt}
                title={category.image_title}
                loading="lazy"
                className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 ease-out group-hover:scale-110"
              />
              
              {/* Default Gradient Overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent transition-opacity duration-300 group-hover:opacity-80" />
              
              {/* Hover Darken Overlay */}
              <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

              {/* Content */}
              <div className="absolute inset-0 flex flex-col justify-end p-6 z-10">
                <h3 className="text-white text-[24px] font-bold leading-tight mb-2 line-clamp-2 drop-shadow-md">
                  {category.name}
                </h3>
                
                {/* View More Button (Fades and slides in on hover) */}
                <div className="overflow-hidden transition-all duration-300 h-0 opacity-0 group-hover:h-[44px] group-hover:opacity-100 group-hover:mt-4">
                  <Link 
                    to={`/products/${category.slug}`}
                    className="inline-flex items-center justify-center bg-primary text-white h-[44px] px-6 rounded-[12px] font-medium text-sm hover:bg-primary-light transition-colors w-max"
                  >
                    View More
                    <ArrowForwardIcon fontSize="small" className="ml-2" />
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
