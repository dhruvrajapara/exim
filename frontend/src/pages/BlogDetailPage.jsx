import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import SearchIcon from '@mui/icons-material/Search';

import SEO from '../components/SEO';
import BlogDetailHero from '../components/blog/BlogDetailHero';
import BlogContent from '../components/blog/BlogContent';
import BlogShare from '../components/blog/BlogShare';
import AuthorBox from '../components/blog/AuthorBox';
import BlogDetailSidebar from '../components/blog/BlogDetailSidebar';
import RelatedBlogs from '../components/blog/RelatedBlogs';
import NewsletterSaaS from '../components/blog/NewsletterSaaS';
import GlobalGallery from '../components/gallery/GlobalGallery';

import { fetchBlogBySlug, fetchRelatedBlogs } from '../services/api';

export default function BlogDetailPage() {
  const { slug } = useParams();
  const [blog, setBlog] = useState(null);
  const [relatedBlogs, setRelatedBlogs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      
      const data = await fetchBlogBySlug(slug);
      setBlog(data);
      
      if (data) {
        const related = await fetchRelatedBlogs(data.category_slug);
        setRelatedBlogs(related);
      }
      
      setLoading(false);
      window.scrollTo(0, 0);
    };

    loadData();
  }, [slug]);

  if (loading) {
    return (
      <div className="w-full min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#0B63CE]"></div>
      </div>
    );
  }

  if (!blog) {
    return (
      <div className="w-full min-h-screen flex flex-col items-center justify-center bg-[#F9FAFB]">
        <div className="w-[80px] h-[80px] rounded-full bg-gray-100 flex items-center justify-center text-gray-400 mb-6">
          <SearchIcon fontSize="large" />
        </div>
        <h1 className="font-rubik text-[32px] font-bold text-dark mb-4">Article Not Found</h1>
        <p className="text-gray-500 mb-8 max-w-md text-center">
          The article you are looking for might have been removed, had its name changed, or is temporarily unavailable.
        </p>
        <a href="/blog" className="px-8 py-4 bg-[#0B63CE] text-white font-bold rounded-[12px] hover:bg-dark transition-colors">
          Back to Blog
        </a>
      </div>
    );
  }

  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": [
      { "@type": "ListItem", "position": 1, "name": "Home", "item": "https://example.com/" },
      { "@type": "ListItem", "position": 2, "name": "Blog", "item": "https://example.com/blog" },
      { "@type": "ListItem", "position": 3, "name": blog.category, "item": `https://example.com/blog?category=${blog.category_slug}` },
      { "@type": "ListItem", "position": 4, "name": blog.title, "item": `https://example.com/blog/${blog.slug}` }
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
        "name": blog.author || "BiteExport",
        "url": `https://example.com/author/${blog.author?.toLowerCase().replace(' ', '-')}`
      }]
  };

  return (
    <div className="w-full bg-[#F9FAFB] min-h-screen">
      <SEO 
        title={blog.title}
        description={blog.short_description}
        canonical={`https://example.com/blog/${blog.slug}`}
      />

      <Helmet>
        <script type="application/ld+json">
          {JSON.stringify(breadcrumbSchema)}
        </script>
        <script type="application/ld+json">
          {JSON.stringify(articleSchema)}
        </script>
      </Helmet>

      {/* 1. 60/40 Split Hero */}
      <BlogDetailHero blog={blog} />

      {/* 2. 70/30 Content & Sidebar Area */}
      <section className="py-12 md:py-16 bg-white">
        <div className="container-custom">
          <div className="flex flex-col lg:flex-row gap-12 lg:gap-16">
            
            {/* Left: Article Prose Content (70%) */}
            <div className="w-full lg:w-[70%]">
              
              <BlogContent content={blog.content} />
              
              <AuthorBox 
                author={blog.author} 
                image={blog.author_image} 
                designation={blog.author_designation} 
                bio={blog.author_bio} 
              />
              
              <BlogShare />
              
            </div>

            {/* Right: Sticky Sidebar (30%) */}
            <div className="w-full lg:w-[30%]">
              <BlogDetailSidebar relatedBlogs={relatedBlogs} />
            </div>

          </div>
        </div>
      </section>

      {/* 3. Swiper Slider - Related Articles */}
      <RelatedBlogs blogs={relatedBlogs} />

      {/* 4. Global Gallery */}
      <GlobalGallery />

      {/* 5. Newsletter Subscription (SaaS Style) */}
      <NewsletterSaaS />

    </div>
  );
}
