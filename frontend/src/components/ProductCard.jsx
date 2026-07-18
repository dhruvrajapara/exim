import { Link } from 'react-router-dom';
import VisibilityIcon from '@mui/icons-material/Visibility';

export default function ProductCard({ product }) {
  return (
    <Link 
      to={`/product/${product.slug}`}
      className="group block bg-white rounded-[16px] border border-gray-100 shadow-sm hover:shadow-[0_20px_40px_rgba(0,0,0,0.08)] hover:border-primary/30 transition-all duration-300 transform hover:-translate-y-2 flex flex-col h-full overflow-hidden relative cursor-pointer"
    >
      
      {/* Product Image Wrapper */}
      <div className="w-full aspect-[4/3] bg-gray-50 relative overflow-hidden">
        <img 
          src={product.image_path || product.image} 
          alt={product.name} 
          loading="lazy"
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
          onError={(e) => {
            e.target.onerror = null;
            e.target.src = 'https://placehold.co/600x400/eeeeee/999999?text=Product+Image';
          }}
        />
        {/* Hover Overlay */}
        <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
      </div>

      {/* Product Info (Slides up on hover) */}
      <div className="p-5 flex flex-col flex-grow relative z-10 bg-white transition-transform duration-500 ease-[cubic-bezier(0.25,1,0.5,1)] group-hover:-translate-y-[62px]">
        
        {/* Category Label */}
        <span className="text-secondary font-semibold tracking-widest uppercase text-[11px] mb-2 block">
          {typeof product.category === 'object' ? product.category?.name : product.category}
        </span>
        
        {/* Product Name */}
        <h3 className="font-rubik font-semibold text-[16px] md:text-[18px] text-dark leading-tight mb-2 group-hover:text-primary transition-colors line-clamp-2">
          {product.name}
        </h3>
        
        {/* Short Description */}
        <div 
          className="text-gray-600 text-[15px] leading-relaxed line-clamp-2 [&>p]:mb-0 [&>p]:inline break-words"
          dangerouslySetInnerHTML={{ __html: product.short_description?.replace(/&nbsp;/g, ' ') }} 
        />

        {/* View Details Button (Revealed at bottom when content slides up) */}
        <div className="absolute left-0 right-0 -bottom-[62px] px-5 pb-[20px] w-full opacity-0 group-hover:opacity-100 transition-opacity duration-500 delay-100">
          <span 
            className="w-full inline-flex items-center justify-center gap-2 h-[42px] rounded-lg border border-primary text-primary font-medium transition-colors group-hover:bg-primary group-hover:text-white"
          >
            <VisibilityIcon fontSize="small" />
            View Details
          </span>
        </div>
      </div>

    </Link>
  );
}
