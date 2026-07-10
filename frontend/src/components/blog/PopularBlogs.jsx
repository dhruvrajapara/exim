import { Link } from 'react-router-dom';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import { motion } from 'framer-motion';

export default function PopularBlogs({ blogs }) {
  if (!blogs || blogs.length === 0) return null;

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
  };

  return (
    <section className="py-12 md:py-16 bg-[#F9FAFB]">
      <div className="container-custom">
        <div className="flex items-center justify-between mb-10">
          <h2 className="font-rubik text-[36px] font-bold text-dark">
            Most Popular Articles
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {blogs.map((blog, idx) => (
            <motion.div
              key={blog.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.5, delay: idx * 0.1 }}
            >
              <Link to={`/blog/${blog.slug}`} className="block group h-full">
                <div className="h-full bg-white rounded-[18px] border border-[#E5E7EB] overflow-hidden shadow-sm hover:shadow-xl hover:-translate-y-2 transition-all duration-300 flex flex-col">
                  
                  <div className="aspect-[4/3] overflow-hidden relative">
                    <img 
                      src={blog.featured_image} 
                      alt={blog.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
                    />
                  </div>

                  <div className="p-6 md:p-8 flex flex-col flex-grow">
                    <div className="flex items-center justify-between mb-4">
                      <span className="text-[#0B63CE] text-[13px] font-bold uppercase tracking-wide">
                        {blog.category}
                      </span>
                      <span className="text-gray-400 text-[13px] font-medium">
                        {blog.reading_time || '5 min read'}
                      </span>
                    </div>

                    <h3 className="font-rubik text-[22px] font-bold text-dark leading-tight mb-3 group-hover:text-[#0B63CE] transition-colors line-clamp-2">
                      {blog.title}
                    </h3>
                    
                    <p className="text-gray-600 text-[15px] line-clamp-3 mb-6 flex-grow">
                      {blog.short_description}
                    </p>

                    <div className="flex items-center justify-between border-t border-gray-100 pt-5 mt-auto">
                      <div className="flex flex-col">
                        <span className="text-[12px] text-gray-400 uppercase tracking-wider font-bold">Author</span>
                        <span className="text-[14px] font-medium text-dark">{blog.author || 'BiteExport'}</span>
                      </div>
                      
                      <div className="w-[40px] h-[40px] rounded-full bg-[#EAF4FF] text-[#0B63CE] flex items-center justify-center group-hover:bg-[#0B63CE] group-hover:text-white transition-colors duration-300">
                        <ArrowForwardIcon fontSize="small" className="-rotate-45 group-hover:rotate-0 transition-transform duration-300" />
                      </div>
                    </div>
                  </div>
                  
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
