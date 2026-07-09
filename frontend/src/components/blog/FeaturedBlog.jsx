import { Link } from 'react-router-dom';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';

export default function FeaturedBlog({ blog }) {
  if (!blog) return null;

  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString('en-US', options);
  };

  return (
    <div className="mb-16 md:mb-20">
      <h2 className="font-rubik text-[24px] md:text-[28px] font-bold text-dark mb-6">Featured Article</h2>
      
      <div className="group bg-white rounded-[24px] border border-gray-100 shadow-sm hover:shadow-xl hover:border-primary/20 transition-all duration-300 overflow-hidden flex flex-col lg:flex-row">
        
        {/* Image Section */}
        <div className="w-full lg:w-1/2 aspect-[16/10] lg:aspect-auto overflow-hidden relative">
          <img 
            src={blog.featured_image} 
            alt={blog.title} 
            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
          />
          {/* Overlay gradient for premium feel */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
        </div>

        {/* Content Section */}
        <div className="w-full lg:w-1/2 p-8 md:p-12 flex flex-col justify-center">
          
          <div className="flex items-center gap-4 mb-4">
            <span className="bg-[#3599FF]/10 text-[#3599FF] px-3 py-1 rounded-md text-[13px] font-semibold tracking-wider uppercase">
              {blog.category}
            </span>
            <span className="flex items-center gap-1 text-gray-500 text-[13px] font-medium">
              <CalendarMonthIcon sx={{ fontSize: 16 }} />
              {formatDate(blog.published_date)}
            </span>
          </div>

          <h3 className="font-rubik text-[28px] md:text-[36px] font-bold text-dark leading-tight mb-4 group-hover:text-primary transition-colors">
            {blog.title}
          </h3>
          
          <p className="text-gray-600 text-[16px] md:text-[18px] leading-relaxed mb-8">
            {blog.short_description}
          </p>

          <div className="mt-auto">
            <Link 
              to={`/blog/${blog.slug}`}
              className="inline-flex items-center justify-center gap-2 bg-primary text-white px-8 py-3.5 rounded-[12px] font-medium hover:bg-green-700 hover:shadow-lg hover:-translate-y-1 transition-all duration-300 w-max"
            >
              Read Article
              <ArrowForwardIcon fontSize="small" />
            </Link>
          </div>
        </div>

      </div>
    </div>
  );
}
