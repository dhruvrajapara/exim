import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import KeyboardArrowRightIcon from '@mui/icons-material/KeyboardArrowRight';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import PersonIcon from '@mui/icons-material/Person';

import SEO from '../components/SEO';
import BlogContent from '../components/blog/BlogContent';
import BlogShare from '../components/blog/BlogShare';
import RelatedBlogs from '../components/blog/RelatedBlogs';
import NewsletterCTA from '../components/NewsletterCTA';

import { fetchBlogBySlug } from '../services/api';

export default function BlogDetailPage() {
  const { slug } = useParams();
  const [blog, setBlog] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    const loadBlog = async () => {
      setLoading(true);
      setError(false);
      try {
        const data = await fetchBlogBySlug(slug);
        if (data) {
          setBlog(data);
        } else {
          setError(true);
        }
      } catch (err) {
        setError(true);
      }
      setLoading(false);
      window.scrollTo(0, 0);
    };

    loadBlog();
  }, [slug]);

  if (loading) {
    return (
      <div className="w-full min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (error || !blog) {
    return (
      <div className="w-full min-h-screen py-32 flex flex-col items-center justify-center text-center px-6">
        <h1 className="text-4xl font-bold mb-4">Article Not Found</h1>
        <p className="mb-6 text-gray-500">The article you are looking for does not exist or has been removed.</p>
        <Link to="/blog" className="btn-primary">Back to Blog</Link>
      </div>
    );
  }

  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString('en-US', options);
  };

  const currentUrl = typeof window !== 'undefined' ? window.location.href : `https://example.com/blog/${slug}`;

  // SEO Schemas
  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": [
      { "@type": "ListItem", "position": 1, "name": "Home", "item": "https://example.com/" },
      { "@type": "ListItem", "position": 2, "name": "Blog", "item": "https://example.com/blog" },
      { "@type": "ListItem", "position": 3, "name": blog.title, "item": currentUrl }
    ]
  };

  const articleSchema = {
    "@context": "https://schema.org",
    "@type": "Article",
    "headline": blog.title,
    "image": [blog.featured_image],
    "datePublished": blog.published_date,
    "author": [{
        "@type": "Person",
        "name": blog.author || "BiteExport"
      }]
  };

  return (
    <div className="w-full bg-white min-h-screen">
      <SEO 
        title={`${blog.title} - BiteExport Blog`} 
        description={blog.short_description}
        canonical={currentUrl}
      />
      
      <Helmet>
        <script type="application/ld+json">{JSON.stringify(breadcrumbSchema)}</script>
        <script type="application/ld+json">{JSON.stringify(articleSchema)}</script>
      </Helmet>

      {/* Main Content Container */}
      <div className="container-custom py-12 md:py-16">
        
        {/* Article Header */}
        <div className="mb-8 md:mb-12">
          {/* Breadcrumb */}
          <nav aria-label="Breadcrumb" className="flex flex-wrap items-center text-[13px] md:text-[14px] font-medium text-gray-500 mb-6 md:mb-8 pt-5">
            <Link to="/" className="hover:text-primary transition-colors">Home</Link>
            <KeyboardArrowRightIcon fontSize="small" className="mx-1" />
            <Link to="/blog" className="hover:text-primary transition-colors">Blog</Link>
            <KeyboardArrowRightIcon fontSize="small" className="mx-1" />
            <span className="text-dark line-clamp-1">{blog.title}</span>
          </nav>

          <div className="mb-6">
            <span className="bg-[#3599FF]/10 text-[#3599FF] px-3 py-1.5 rounded-md text-[13px] font-bold tracking-wider uppercase">
              {blog.category}
            </span>
          </div>

          <h1 className="font-rubik text-[32px] md:text-[48px] lg:text-[56px] font-bold text-dark leading-tight mb-6">
            {blog.title}
          </h1>

          <div className="flex flex-wrap items-center gap-6 text-gray-500 text-[14px] md:text-[15px] font-medium">
            <div className="flex items-center gap-1.5">
              <PersonIcon fontSize="small" className="text-gray-400" />
              <span>{blog.author || 'BiteExport Team'}</span>
            </div>
            <div className="flex items-center gap-1.5">
              <CalendarMonthIcon fontSize="small" className="text-gray-400" />
              <span>{formatDate(blog.published_date)}</span>
            </div>
          </div>
        </div>

        {/* Featured Image */}
        <div className="w-full rounded-[24px] md:rounded-[32px] overflow-hidden shadow-2xl relative aspect-[16/9] md:aspect-[21/9] bg-gray-100 mb-12 md:mb-16">
          <img 
            src={blog.featured_image} 
            alt={blog.title}
            className="w-full h-full object-cover"
          />
        </div>

        {/* Article Body & Sidebar */}
        <div className="flex flex-col lg:flex-row gap-8 lg:gap-16">
          
          {/* Left Sidebar (Social Share) */}
          <div className="lg:w-24 flex-shrink-0">
            <div className="sticky top-[120px]">
              <BlogShare url={currentUrl} title={blog.title} />
            </div>
          </div>

          {/* Article Body */}
          <div className="flex-grow">
            <BlogContent content={blog.content} />
            <RelatedBlogs categorySlug={blog.category_slug} />
          </div>

        </div>
      </div>

      {/* Newsletter */}
      <NewsletterCTA />

    </div>
  );
}
