import { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';

import SEO from '../components/SEO';
import BlogHeroRedesign from '../components/blog/BlogHeroRedesign';
import FeaturedAndTrending from '../components/blog/FeaturedAndTrending';
import PopularBlogs from '../components/blog/PopularBlogs';
import NewsletterSaaS from '../components/blog/NewsletterSaaS';
import BlogPagination from '../components/blog/BlogPagination';

import { fetchBlogs, fetchFeaturedBlog } from '../services/api';

export default function BlogPage() {
  const [blogs, setBlogs] = useState([]);
  const [featuredBlog, setFeaturedBlog] = useState(null);
  
  // Pagination State
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6;

  useEffect(() => {
    const loadData = async () => {
      // Mock bypassing normal fetching with our instant data
      const feat = await fetchFeaturedBlog();
      setFeaturedBlog(feat);

      const items = await fetchBlogs();
      setBlogs(items);
    };
    loadData();
  }, []);

  // Reset scroll to top when page changes
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [currentPage]);

  const trendingBlogs = blogs.filter(b => b.trending === true);
  
  // Pagination Logic
  const totalPages = Math.ceil(blogs.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const popularBlogsPaginated = blogs.slice(startIndex, startIndex + itemsPerPage);

  const handlePageChange = (page) => {
    setCurrentPage(page);
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
    <div className="w-full bg-[#F9FAFB] min-h-screen">
      <SEO
        title="Blog"
        description="Latest export news, market trends, food industry updates, business guides and international trade insights."
        canonical="https://example.com/blog"
      />

      <Helmet>
        <script type="application/ld+json">
          {JSON.stringify(breadcrumbSchema)}
        </script>
      </Helmet>

      {/* 1. Hero Banner */}
      <BlogHeroRedesign />

      {/* 2. Featured & Trending Section */}
      <FeaturedAndTrending 
        featuredBlog={featuredBlog} 
        trendingBlogs={trendingBlogs.length > 0 ? trendingBlogs : blogs.slice(0, 4)} 
      />

      {/* 3. Most Popular Articles Grid (Paginated to 6 items) */}
      <PopularBlogs blogs={popularBlogsPaginated} />

      {/* 4. Pagination (Moved above Newsletter) */}
      <BlogPagination 
        currentPage={currentPage} 
        totalPages={totalPages} 
        onPageChange={handlePageChange} 
      />

      {/* 5. Newsletter Subscription (SaaS Style) */}
      <NewsletterSaaS />

    </div>
  );
}
