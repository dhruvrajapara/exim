import { Link } from 'react-router-dom';
import KeyboardArrowRightIcon from '@mui/icons-material/KeyboardArrowRight';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import VisibilityIcon from '@mui/icons-material/Visibility';
import { motion } from 'framer-motion';

export default function BlogDetailHero({ blog }) {
  if (!blog) return null;

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
  };

  return (
    <section className="bg-gradient-to-r from-[#F8FBFF] to-white py-12 md:py-16 overflow-hidden">
      <div className="container-custom">
        <div className="flex flex-col lg:flex-row items-center gap-10 lg:gap-16">
          
          {/* Left Column - Content (60%) */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="w-full lg:w-[60%]"
          >
            {/* Breadcrumb */}
            <nav aria-label="Breadcrumb" className="flex flex-wrap items-center text-[13px] md:text-[14px] font-medium text-gray-500 mb-6 gap-y-2">
              <Link to="/" className="hover:text-[#0B63CE] transition-colors">Home</Link>
              <KeyboardArrowRightIcon fontSize="small" className="mx-1 opacity-50" />
              <Link to="/blog" className="hover:text-[#0B63CE] transition-colors">Blog</Link>
              <KeyboardArrowRightIcon fontSize="small" className="mx-1 opacity-50" />
              <Link to={`/blog?category=${blog.category_slug}`} className="hover:text-[#0B63CE] transition-colors">
                {blog.category}
              </Link>
              <KeyboardArrowRightIcon fontSize="small" className="mx-1 opacity-50" />
              <span className="text-[#0B63CE] truncate max-w-[200px]">{blog.title}</span>
            </nav>

            <span className="inline-block bg-[#EAF4FF] text-[#0B63CE] px-4 py-1.5 rounded-full text-[13px] font-bold uppercase tracking-wide mb-6">
              {blog.category}
            </span>

            <h1 className="font-rubik text-[36px] md:text-[48px] font-bold text-dark leading-[1.2] mb-6">
              {blog.title}
            </h1>

            <p className="text-gray-600 text-[18px] md:text-[20px] leading-relaxed mb-8 max-w-2xl">
              {blog.short_description}
            </p>

            {/* Author & Metadata */}
            <div className="flex flex-wrap items-center gap-6 border-t border-gray-200 pt-6">
              
              <div className="flex items-center gap-3">
                <img 
                  src={blog.author_image || 'https://images.unsplash.com/photo-1560250097-0b93528c311a?w=100&q=80'} 
                  alt={blog.author}
                  className="w-[48px] h-[48px] rounded-full object-cover shadow-sm border-2 border-white"
                />
                <div className="flex flex-col">
                  <span className="text-[14px] font-bold text-dark">{blog.author || 'BiteExport Team'}</span>
                  <span className="text-[13px] text-gray-500">{blog.author_designation || 'Export Specialist'}</span>
                </div>
              </div>

              <div className="hidden sm:block w-[1px] h-[32px] bg-gray-200"></div>

              <div className="flex items-center gap-5 text-gray-500 text-[14px] font-medium">
                <div className="flex items-center gap-1.5">
                  <CalendarMonthIcon fontSize="small" className="text-gray-400" />
                  <span>{formatDate(blog.published_date)}</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <AccessTimeIcon fontSize="small" className="text-gray-400" />
                  <span>{blog.reading_time || '5 min read'}</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <VisibilityIcon fontSize="small" className="text-gray-400" />
                  <span>{blog.views || '1,200'} Views</span>
                </div>
              </div>

            </div>
          </motion.div>

          {/* Right Column - Image (40%) */}
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="w-full lg:w-[40%]"
          >
            <div className="rounded-[20px] overflow-hidden shadow-2xl relative group">
              <div className="aspect-[4/3] w-full relative">
                <img 
                  src={blog.featured_image} 
                  alt={blog.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
                />
              </div>
            </div>
          </motion.div>

        </div>
      </div>
    </section>
  );
}
