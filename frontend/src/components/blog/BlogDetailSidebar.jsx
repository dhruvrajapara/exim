import { Link } from 'react-router-dom';
import KeyboardArrowRightIcon from '@mui/icons-material/KeyboardArrowRight';
import DownloadIcon from '@mui/icons-material/Download';
import LocalShippingIcon from '@mui/icons-material/LocalShipping';
import LinkedInIcon from '@mui/icons-material/LinkedIn';
import FacebookIcon from '@mui/icons-material/Facebook';
import WhatsAppIcon from '@mui/icons-material/WhatsApp';
import LinkIcon from '@mui/icons-material/Link';
import { useState } from 'react';

export default function BlogDetailSidebar({ relatedBlogs }) {
  const [copied, setCopied] = useState(false);
  const currentUrl = typeof window !== 'undefined' ? window.location.href : '';

  const handleCopyLink = () => {
    navigator.clipboard.writeText(currentUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="w-full flex flex-col gap-8 sticky top-24">
      
      {/* 1. Export Inquiry CTA Widget */}
      <div className="bg-gradient-to-br from-[#00143A] to-[#0B63CE] rounded-[20px] p-8 text-white shadow-xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full blur-2xl -mr-10 -mt-10"></div>
        <div className="w-[48px] h-[48px] bg-white/10 rounded-[12px] flex items-center justify-center mb-6 backdrop-blur-sm border border-white/20">
          <LocalShippingIcon />
        </div>
        <h3 className="font-rubik text-[24px] font-bold mb-3 leading-tight">Need Bulk Quantity?</h3>
        <p className="text-gray-300 text-[15px] mb-8 leading-relaxed">
          Partner with BiteExport for premium dehydrated agriculture products delivered globally.
        </p>
        <div className="flex flex-col gap-3">
          <Link to="/contact" className="w-full h-[48px] bg-white text-[#0B63CE] font-bold rounded-[12px] flex items-center justify-center hover:bg-gray-50 transition-colors shadow-sm">
            Request a Quote
          </Link>
          <a href="/catalogue.pdf" target="_blank" className="w-full h-[48px] bg-transparent border border-white/30 text-white font-medium rounded-[12px] flex items-center justify-center gap-2 hover:bg-white/10 transition-colors">
            <DownloadIcon fontSize="small" /> Download Catalogue
          </a>
        </div>
      </div>

      {/* 2. Popular Categories */}
      <div className="bg-white rounded-[20px] p-8 border border-gray-200 shadow-sm">
        <h3 className="font-rubik text-[20px] font-bold text-dark mb-6">Categories</h3>
        <ul className="flex flex-col gap-3">
          {['Export Guides', 'Market Trends', 'Product Insights', 'Company News'].map((cat, idx) => (
            <li key={idx}>
              <Link 
                to={`/blog?category=${cat.toLowerCase().replace(' ', '-')}`}
                className="flex items-center justify-between text-[15px] font-medium text-gray-600 hover:text-[#0B63CE] transition-colors group p-2 hover:bg-[#EAF4FF] rounded-[10px]"
              >
                <span>{cat}</span>
                <KeyboardArrowRightIcon fontSize="small" className="text-gray-300 group-hover:text-[#0B63CE] transition-colors" />
              </Link>
            </li>
          ))}
        </ul>
      </div>

      {/* 3. Popular Mini Articles (from related) */}
      {relatedBlogs && relatedBlogs.length > 0 && (
        <div className="bg-white rounded-[20px] p-8 border border-gray-200 shadow-sm">
          <h3 className="font-rubik text-[20px] font-bold text-dark mb-6">Popular Reads</h3>
          <div className="flex flex-col gap-5">
            {relatedBlogs.slice(0, 3).map((blog) => (
              <Link key={blog.id} to={`/blog/${blog.slug}`} className="group flex gap-4">
                <div className="w-[80px] h-[80px] rounded-[12px] overflow-hidden flex-shrink-0">
                  <img src={blog.featured_image} alt={blog.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                </div>
                <div className="flex flex-col justify-center">
                  <h4 className="font-bold text-[15px] text-dark leading-snug line-clamp-2 group-hover:text-[#0B63CE] transition-colors mb-2">
                    {blog.title}
                  </h4>
                  <span className="text-[12px] text-gray-400 font-medium">{blog.reading_time || '5 min read'}</span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      )}

      {/* 4. Quick Share */}
      <div className="bg-white rounded-[20px] p-8 border border-gray-200 shadow-sm flex flex-col items-center">
        <h3 className="font-rubik text-[16px] font-bold text-gray-500 uppercase tracking-wider mb-5">Share Article</h3>
        <div className="flex items-center gap-3">
          <a href={`https://www.linkedin.com/shareArticle?mini=true&url=${encodeURIComponent(currentUrl)}`} target="_blank" rel="noreferrer" className="w-[40px] h-[40px] rounded-full bg-gray-50 flex items-center justify-center text-[#0A66C2] hover:bg-[#0A66C2] hover:text-white transition-colors border border-gray-100 shadow-sm">
            <LinkedInIcon fontSize="small" />
          </a>
          <a href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(currentUrl)}`} target="_blank" rel="noreferrer" className="w-[40px] h-[40px] rounded-full bg-gray-50 flex items-center justify-center text-[#1877F2] hover:bg-[#1877F2] hover:text-white transition-colors border border-gray-100 shadow-sm">
            <FacebookIcon fontSize="small" />
          </a>
          <a href={`https://api.whatsapp.com/send?text=${encodeURIComponent(currentUrl)}`} target="_blank" rel="noreferrer" className="w-[40px] h-[40px] rounded-full bg-gray-50 flex items-center justify-center text-[#25D366] hover:bg-[#25D366] hover:text-white transition-colors border border-gray-100 shadow-sm">
            <WhatsAppIcon fontSize="small" />
          </a>
          <button onClick={handleCopyLink} className="w-[40px] h-[40px] rounded-full bg-gray-50 flex items-center justify-center text-gray-600 hover:bg-dark hover:text-white transition-colors border border-gray-100 shadow-sm" title="Copy Link">
            <LinkIcon fontSize="small" />
          </button>
        </div>
        {copied && <span className="text-[#0B63CE] text-[13px] font-medium mt-3 block">Link copied!</span>}
      </div>

    </div>
  );
}
