import { Link } from 'react-router-dom';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';

export default function BlogCard({ blog }) {
  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'short', day: 'numeric' };
    return new Date(dateString).toLocaleDateString('en-US', options);
  };

  return (
    <div className="group bg-white rounded-[16px] border border-gray-100 shadow-sm hover:shadow-[0_20px_40px_rgba(0,0,0,0.08)] hover:border-[#3599FF]/30 transition-all duration-300 transform hover:-translate-y-2 flex flex-col h-full overflow-hidden">
      
      {/* Image Wrapper */}
      <div className="w-full aspect-[16/10] bg-gray-50 relative overflow-hidden">
        <img 
          src={blog.featured_image} 
          alt={blog.title} 
          loading="lazy"
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
        />
        <div className="absolute top-4 left-4 z-10">
          <span className="bg-white/90 backdrop-blur-sm text-dark px-3 py-1 rounded-md text-[11px] font-bold tracking-wider uppercase shadow-sm">
            {blog.category}
          </span>
        </div>
      </div>

      {/* Content */}
      <div className="p-6 flex flex-col flex-grow bg-white">
        
        {/* Date */}
        <div className="flex items-center gap-1 text-gray-400 text-[12px] font-medium mb-3">
          <CalendarMonthIcon sx={{ fontSize: 14 }} />
          {formatDate(blog.published_date)}
        </div>
        
        {/* Title */}
        <h3 className="font-rubik font-bold text-[18px] text-dark leading-snug mb-3 group-hover:text-[#3599FF] transition-colors line-clamp-2">
          {blog.title}
        </h3>
        
        {/* Excerpt */}
        <p className="text-gray-500 text-[14px] leading-relaxed mb-6 line-clamp-3 flex-grow">
          {blog.short_description}
        </p>

        {/* Read More Link */}
        <div className="mt-auto pt-4 border-t border-gray-50 flex items-center justify-between">
          <Link 
            to={`/blog/${blog.slug}`}
            className="text-[#3599FF] font-semibold text-[14px] flex items-center gap-1 group-hover:gap-2 transition-all duration-300"
          >
            Read Article
            <ArrowForwardIcon sx={{ fontSize: 16 }} />
          </Link>
        </div>
      </div>

    </div>
  );
}
