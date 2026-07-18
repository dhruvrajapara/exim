import { useState, useEffect } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import SearchIcon from '@mui/icons-material/Search';
import FilterListIcon from '@mui/icons-material/FilterList';
import KeyboardArrowRightIcon from '@mui/icons-material/KeyboardArrowRight';
import CloseIcon from '@mui/icons-material/Close';

import ProductCard from './ProductCard';
import ProductSidebar from './ProductSidebar';
import { fetchProductCategories, fetchProducts } from '../services/api';
import Reveal from './Reveal';

export default function ProductListing() {
  const [searchParams, setSearchParams] = useSearchParams();
  const initialCategory = searchParams.get('category') || 'all';

  const [categories, setCategories] = useState([]);
  const [products, setProducts] = useState([]);
  const [activeCategory, setActiveCategory] = useState(initialCategory);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);
  const [isMobileFilterOpen, setIsMobileFilterOpen] = useState(false);

  // Sync state when URL searchParams change
  useEffect(() => {
    const cat = searchParams.get('category') || 'all';
    setActiveCategory(cat);
  }, [searchParams]);

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      try {
        const cats = await fetchProductCategories();
        setCategories(cats);
        
        const prods = await fetchProducts({ category: activeCategory, search: searchQuery });
        setProducts(prods);
      } catch (err) {
        console.error("Error loading products:", err);
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, [activeCategory, searchQuery]);

  const handleSearch = (e) => {
    setSearchQuery(e.target.value);
  };

  const handleCategoryChange = (slug) => {
    setActiveCategory(slug);
    if (slug === 'all') {
      searchParams.delete('category');
    } else {
      searchParams.set('category', slug);
    }
    setSearchParams(searchParams);
    setIsMobileFilterOpen(false); // Close mobile drawer if open
  };

  const clearSearch = () => {
    setSearchQuery('');
  };

  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": [
      {
        "@type": "ListItem",
        "position": 1,
        "name": "Home",
        "item": "https://example.com/"
      },
      {
        "@type": "ListItem",
        "position": 2,
        "name": "Products",
        "item": "https://example.com/product"
      }
    ]
  };

  // Add category to breadcrumb schema if active
  if (activeCategory !== 'all') {
    const catName = categories.find(c => c.slug === activeCategory)?.name || 'Category';
    breadcrumbSchema.itemListElement.push({
      "@type": "ListItem",
      "position": 3,
      "name": catName,
      "item": `https://example.com/product?category=${activeCategory}`
    });
  }

  const getCategoryName = () => {
    if (activeCategory === 'all') return null;
    return categories.find(c => c.slug === activeCategory)?.name;
  };

  return (
    <section className="py-12 md:py-16 bg-light">
      <Helmet>
        <script type="application/ld+json">
          {JSON.stringify(breadcrumbSchema)}
        </script>
      </Helmet>

      <div className="container-custom">
        
        {/* Top Header Area */}
        <div className="flex flex-col md:flex-row md:items-center justify-end gap-4 mb-8 pb-6 border-b border-gray-200">

          {/* Right Side - Search Bar & Mobile Filter Btn */}
          <div className="flex items-center gap-3 w-full md:w-auto">
            {/* Mobile Filter Trigger */}
            <button 
              className="md:hidden flex items-center justify-center gap-2 h-[48px] px-4 rounded-[12px] bg-white border border-gray-200 text-dark font-medium shadow-sm active:bg-gray-50"
              onClick={() => setIsMobileFilterOpen(true)}
            >
              <FilterListIcon />
              Filter
            </button>

            {/* Premium Search Bar */}
            <div className="relative flex-grow md:w-[320px]">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <SearchIcon className="text-gray-400" />
              </div>
              <input
                type="text"
                value={searchQuery}
                onChange={handleSearch}
                placeholder="Search products..."
                className="w-full h-[48px] pl-10 pr-10 rounded-[12px] border border-gray-200 bg-white text-dark placeholder-gray-400 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary shadow-sm transition-all duration-300"
              />
              {searchQuery && (
                <button 
                  onClick={clearSearch}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-dark transition-colors"
                >
                  <CloseIcon fontSize="small" />
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Main Content Layout */}
        <div className="flex flex-col lg:flex-row gap-8">
          
          {/* Left Sidebar (Desktop Only) */}
          <div className="hidden lg:block lg:w-1/4">
            <ProductSidebar 
              categories={categories} 
              activeCategory={activeCategory} 
              onCategoryChange={handleCategoryChange} 
            />
          </div>

          {/* Right Product Area */}
          <div className="w-full lg:w-3/4">
            
            {loading ? (
              <div className="w-full py-20 flex justify-center items-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
              </div>
            ) : products.length > 0 ? (
              <>
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
                  {products.map((product, idx) => (
                    <Reveal key={product.id} delay={idx * 50}>
                      <ProductCard product={product} />
                    </Reveal>
                  ))}
                </div>

                {/* Load More Button */}
                <div className="mt-12 flex justify-center">
                  <button className="btn-primary rounded-full px-8 bg-gradient-to-r from-primary to-green-600 border-none shadow-md hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
                    Load More Products
                  </button>
                </div>
              </>
            ) : (
              /* Empty State */
              <div className="w-full py-16 bg-white rounded-[16px] border border-gray-100 shadow-sm flex flex-col items-center justify-center text-center px-6">
                <div className="w-[80px] h-[80px] rounded-full bg-gray-50 flex items-center justify-center text-gray-400 mb-4">
                  <SearchIcon fontSize="large" />
                </div>
                <h3 className="font-rubik text-[24px] font-bold text-dark mb-2">No products found</h3>
                <p className="text-gray-500 max-w-md mb-6">
                  We couldn't find any products matching your search or category filter. Try adjusting your search criteria.
                </p>
                <button 
                  onClick={() => { clearSearch(); handleCategoryChange('all'); }}
                  className="btn-primary"
                >
                  Clear All Filters
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Mobile Filter Drawer / Bottom Sheet */}
      {isMobileFilterOpen && (
        <div className="fixed inset-0 z-50 lg:hidden flex flex-col justify-end">
          {/* Backdrop */}
          <div 
            className="absolute inset-0 bg-black/50 backdrop-blur-sm transition-opacity"
            onClick={() => setIsMobileFilterOpen(false)}
          ></div>
          
          {/* Bottom Sheet */}
          <div className="relative bg-white w-full rounded-t-[24px] shadow-2xl p-6 max-h-[80vh] overflow-y-auto animate-slide-up">
            <div className="flex items-center justify-between mb-6 pb-4 border-b border-gray-100">
              <h3 className="font-rubik font-bold text-[20px] text-dark">Filter Categories</h3>
              <button 
                onClick={() => setIsMobileFilterOpen(false)}
                className="w-[36px] h-[36px] rounded-full bg-gray-50 flex items-center justify-center text-gray-500 hover:bg-gray-100 transition-colors"
              >
                <CloseIcon fontSize="small" />
              </button>
            </div>
            
            <ProductSidebar 
              categories={categories} 
              activeCategory={activeCategory} 
              onCategoryChange={handleCategoryChange} 
            />
          </div>
        </div>
      )}

    </section>
  );
}
