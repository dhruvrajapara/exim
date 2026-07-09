import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import KeyboardArrowRightIcon from '@mui/icons-material/KeyboardArrowRight';
import SearchIcon from '@mui/icons-material/Search';
import FilterListIcon from '@mui/icons-material/FilterList';
import CloseIcon from '@mui/icons-material/Close';

import SEO from '../components/SEO';
import BlogHero from '../components/blog/BlogHero';
import FeaturedBlog from '../components/blog/FeaturedBlog';
import BlogSidebar from '../components/blog/BlogSidebar';
import BlogCard from '../components/blog/BlogCard';
import NewsletterCTA from '../components/NewsletterCTA';
import Reveal from '../components/Reveal';

import { fetchBlogCategories, fetchBlogs, fetchFeaturedBlog } from '../services/api';

export default function BlogPage() {
  const [categories, setCategories] = useState([]);
  const [blogs, setBlogs] = useState([]);
  const [featuredBlog, setFeaturedBlog] = useState(null);

  const [activeCategory, setActiveCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);
  const [isMobileFilterOpen, setIsMobileFilterOpen] = useState(false);

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);

      const cats = await fetchBlogCategories();
      setCategories(cats);

      const feat = await fetchFeaturedBlog();
      setFeaturedBlog(feat);

      const items = await fetchBlogs({ category: activeCategory, search: searchQuery });
      setBlogs(items);

      setLoading(false);
    };
    loadData();
  }, [activeCategory, searchQuery]);

  const handleSearch = (e) => {
    setSearchQuery(e.target.value);
  };

  const handleCategoryChange = (slug) => {
    setActiveCategory(slug);
    setIsMobileFilterOpen(false);
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
        "name": "Blog",
        "item": "https://example.com/blog"
      }
    ]
  };

  return (
    <div className="w-full bg-white min-h-screen">
      <SEO
        title="Blog & Export Insights"
        description="Read the latest news, market trends, and expert guides on global agricultural exporting."
        canonical="https://example.com/blog"
      />

      <Helmet>
        <script type="application/ld+json">
          {JSON.stringify(breadcrumbSchema)}
        </script>
      </Helmet>

      {/* Hero Section */}
      <BlogHero />

      {/* Main Content Area */}
      <section className="py-12 md:py-16 bg-light min-h-screen">
        <div className="container-custom">

          {/* Breadcrumb & Top Bar */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8 pb-6 border-b border-gray-200">
            <nav aria-label="Breadcrumb" className="flex items-center text-[13px] md:text-[14px] font-medium text-gray-500">
              <Link to="/" className="hover:text-primary transition-colors">Home</Link>
              <KeyboardArrowRightIcon fontSize="small" className="mx-1" />
              <span className="text-primary">Blog</span>
            </nav>

            <div className="flex items-center gap-3 w-full md:w-auto">
              <button
                className="md:hidden flex items-center justify-center gap-2 h-[48px] px-4 rounded-[12px] bg-white border border-gray-200 text-dark font-medium shadow-sm"
                onClick={() => setIsMobileFilterOpen(true)}
              >
                <FilterListIcon />
                Filter
              </button>

              <div className="relative flex-grow md:w-[320px]">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <SearchIcon className="text-gray-400" />
                </div>
                <input
                  type="text"
                  value={searchQuery}
                  onChange={handleSearch}
                  placeholder="Search articles..."
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

          {/* Featured Blog */}
          {activeCategory === 'all' && !searchQuery && featuredBlog && (
            <FeaturedBlog blog={featuredBlog} />
          )}

          {/* Main Grid Layout */}
          <div className="flex flex-col lg:flex-row gap-8">

            {/* Desktop Sidebar */}
            <div className="hidden lg:block lg:w-1/4">
              <BlogSidebar
                categories={categories}
                activeCategory={activeCategory}
                onCategoryChange={handleCategoryChange}
              />
            </div>

            {/* Articles Grid */}
            <div className="w-full lg:w-3/4">
              {loading ? (
                <div className="w-full py-20 flex justify-center items-center">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
                </div>
              ) : blogs.length > 0 ? (
                <>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                    {blogs.map((blog, idx) => (
                      <Reveal key={blog.id} delay={idx * 50}>
                        <BlogCard blog={blog} />
                      </Reveal>
                    ))}
                  </div>

                  <div className="mt-12 flex justify-center">
                    <button className="btn-primary rounded-full px-8 bg-gradient-to-r from-primary to-green-600 border-none shadow-md hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
                      Load More Articles
                    </button>
                  </div>
                </>
              ) : (
                <div className="w-full py-16 bg-white rounded-[16px] border border-gray-100 shadow-sm flex flex-col items-center justify-center text-center px-6">
                  <div className="w-[80px] h-[80px] rounded-full bg-gray-50 flex items-center justify-center text-gray-400 mb-4">
                    <SearchIcon fontSize="large" />
                  </div>
                  <h3 className="font-rubik text-[24px] font-bold text-dark mb-2">No articles found</h3>
                  <p className="text-gray-500 max-w-md mb-6">
                    We couldn't find any articles matching your search or category. Try adjusting your criteria.
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
      </section>

      {/* Newsletter Section */}
      <NewsletterCTA />

      {/* Mobile Drawer */}
      {isMobileFilterOpen && (
        <div className="fixed inset-0 z-50 lg:hidden flex flex-col justify-end">
          <div
            className="absolute inset-0 bg-black/50 backdrop-blur-sm transition-opacity"
            onClick={() => setIsMobileFilterOpen(false)}
          ></div>

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

            <BlogSidebar
              categories={categories}
              activeCategory={activeCategory}
              onCategoryChange={handleCategoryChange}
            />
          </div>
        </div>
      )}
    </div>
  );
}
