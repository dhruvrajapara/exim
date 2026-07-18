import { Link } from 'react-router-dom';
import RequestQuoteIcon from '@mui/icons-material/RequestQuote';
import WhatsAppIcon from '@mui/icons-material/WhatsApp';

export default function ProductInfo({ product }) {
  return (
    <div className="flex flex-col h-full justify-start w-full">
      
      {/* Category Tag */}
      <span className="inline-block bg-primary/10 text-primary px-4 py-1.5 rounded-full text-[13px] font-semibold tracking-wider uppercase mb-4 w-max">
        {typeof product.category === 'object' ? product.category?.name : product.category}
      </span>

      {/* Title */}
      <h1 className="font-rubik text-[32px] md:text-[42px] font-bold text-dark leading-tight mb-4">
        {product.name}
      </h1>

      {/* Short & Full Description */}
      <div className="text-gray-600 text-[15px] md:text-[16px] leading-relaxed mb-8 flex flex-col gap-4">
        {product.short_description && (
          <div 
            className="font-medium text-dark/80 prose prose-sm md:prose-base max-w-none [&>p]:mb-0" 
            dangerouslySetInnerHTML={{ __html: product.short_description }} 
          />
        )}
        {product.full_description && (
          <div 
            className="prose prose-sm md:prose-base max-w-none text-gray-600 leading-relaxed [&>p]:mb-4 last:[&>p]:mb-0" 
            dangerouslySetInnerHTML={{ __html: product.full_description }} 
          />
        )}
      </div>

      {/* CTA Buttons */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-auto w-full pt-4">
        <Link 
          to={`/contact?product=${product.slug}`}
          className="btn-primary w-full h-[50px] md:h-[54px] rounded-[12px] flex items-center justify-center gap-2 shadow-lg shadow-primary/20 hover:shadow-primary/40 hover:-translate-y-1 transition-all duration-300 text-[15px] md:text-[16px] font-medium"
        >
          <RequestQuoteIcon fontSize="small" />
          Request Quote
        </Link>
        
        <a 
          href={`https://wa.me/1234567890?text=I'm interested in ${product.name}`}
          target="_blank"
          rel="noopener noreferrer"
          className="w-full h-[50px] md:h-[54px] rounded-[12px] flex items-center justify-center gap-2 border-2 border-[#25D366] text-[#25D366] hover:bg-[#25D366] hover:text-white transition-all duration-300 text-[15px] md:text-[16px] font-medium"
        >
          <WhatsAppIcon fontSize="small" />
          WhatsApp Inquiry
        </a>
      </div>
      
    </div>
  );
}
