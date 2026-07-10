import { Link } from 'react-router-dom';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import { motion } from 'framer-motion';

export default function FeaturedAndTrending({ featuredBlog, trendingBlogs }) {
  if (!featuredBlog || !trendingBlogs || trendingBlogs.length === 0) return null;

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
  };

  return (
    <section className="py-12 md:py-16 bg-white">
      <div className="container-custom">
        <div className="flex flex-col lg:flex-row gap-8">
          
          {/* Left: Featured Blog (70%) */}
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="w-full lg:w-[70%]"
          >
            <Link to={`/blog/${featuredBlog.slug}`} className="block group">
              <div className="rounded-[24px] overflow-hidden bg-white border border-[#E5E7EB] shadow-sm hover:shadow-xl transition-all duration-500 hover:-translate-y-2">
                <div className="aspect-[16/9] overflow-hidden relative">
                  <img 
                    src={featuredBlog.featured_image} 
                    alt={featuredBlog.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-in-out"
                  />
                  <div className="absolute top-6 left-6">
                    <span className="bg-white/90 backdrop-blur-sm text-[#0B63CE] px-4 py-2 rounded-full text-[13px] font-bold tracking-wide uppercase shadow-sm">
                      {featuredBlog.category}
                    </span>
                  </div>
                </div>
                
                <div className="p-8 md:p-10">
                  <div className="flex items-center gap-6 text-gray-500 text-[14px] font-medium mb-4">
                    <div className="flex items-center gap-1.5">
                      <CalendarMonthIcon fontSize="small" className="text-gray-400" />
                      <span>{formatDate(featuredBlog.published_date)}</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <AccessTimeIcon fontSize="small" className="text-gray-400" />
                      <span>{featuredBlog.reading_time || '5 min read'}</span>
                    </div>
                  </div>

                  <h2 className="font-rubik text-[28px] md:text-[36px] font-bold text-dark leading-tight mb-4 group-hover:text-[#0B63CE] transition-colors line-clamp-2">
                    {featuredBlog.title}
                  </h2>
                  
                  <p className="text-gray-600 text-[16px] md:text-[18px] mb-8 line-clamp-2 leading-relaxed">
                    {featuredBlog.short_description}
                  </p>

                  <div className="flex items-center justify-between border-t border-gray-100 pt-6">
                    <div className="font-medium text-gray-800">
                      By {featuredBlog.author || 'BiteExport'}
                    </div>
                    <div className="flex items-center gap-2 text-[#0B63CE] font-bold group-hover:gap-4 transition-all">
                      Read More <ArrowForwardIcon fontSize="small" />
                    </div>
                  </div>
                </div>
              </div>
            </Link>
          </motion.div>

          {/* Right: Trending Articles (30%) */}
          <motion.div 
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="w-full lg:w-[30%] flex flex-col"
          >
            <h3 className="font-rubik text-[24px] font-bold text-dark mb-6 pl-2 border-l-4 border-[#0B63CE]">
              Trending Articles
            </h3>
            
            <div className="flex flex-col gap-4">
              {trendingBlogs.slice(0, 4).map((blog) => (
                <Link 
                  key={blog.id} 
                  to={`/blog/${blog.slug}`}
                  className="group flex gap-4 p-3 rounded-[16px] hover:bg-[#EAF4FF] transition-colors duration-300 border border-transparent hover:border-[#0B63CE]/20"
                >
                  <div className="w-[100px] h-[100px] flex-shrink-0 rounded-[12px] overflow-hidden">
                    <img 
                      src={blog.featured_image} 
                      alt={blog.title}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                    />
                  </div>
                  <div className="flex flex-col justify-center">
                    <span className="text-[#0B63CE] text-[12px] font-bold uppercase tracking-wider mb-1">
                      {blog.category}
                    </span>
                    <h4 className="font-bold text-[16px] text-dark leading-snug line-clamp-2 mb-2 group-hover:text-[#0B63CE] transition-colors">
                      {blog.title}
                    </h4>
                    <div className="flex items-center gap-4 text-gray-400 text-[12px] font-medium">
                      <span>{formatDate(blog.published_date)}</span>
                      <span>{blog.reading_time || '3 min'}</span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </motion.div>

        </div>
      </div>
    </section>
  );
}
