import { Link } from 'react-router-dom';
import VisibilityIcon from '@mui/icons-material/Visibility';

export default function ProductCard({ product }) {
  return (
    <div className="group bg-white rounded-[16px] border border-gray-100 shadow-sm hover:shadow-[0_20px_40px_rgba(0,0,0,0.08)] hover:border-primary/30 transition-all duration-300 transform hover:-translate-y-2 flex flex-col h-full overflow-hidden relative">
      
      {/* Product Image Wrapper */}
      <div className="w-full aspect-[4/3] bg-gray-50 relative overflow-hidden">
        <img 
          src={product.image} 
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

      {/* Product Info */}
      <div className="p-5 flex flex-col flex-grow relative z-10 bg-white">
        
        {/* Category Label */}
        <span className="text-secondary font-semibold tracking-widest uppercase text-[11px] mb-2 block">
          {product.category}
        </span>
        
        {/* Product Name */}
        <h3 className="font-rubik font-semibold text-[16px] md:text-[18px] text-dark leading-tight mb-2 group-hover:text-primary transition-colors line-clamp-2">
          {product.name}
        </h3>
        
        {/* Short Description */}
        <p className="text-text/80 text-[13px] leading-relaxed mb-4 line-clamp-2 flex-grow">
          {product.short_description}
        </p>

        {/* View Details Button (Appears on Hover) */}
        <Link 
          to={`/product/${product.slug}`}
          className="w-full inline-flex items-center justify-center gap-2 h-[42px] rounded-lg border border-primary text-primary font-medium opacity-0 translate-y-2 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-300 hover:bg-primary hover:text-white"
        >
          <VisibilityIcon fontSize="small" />
          View Details
        </Link>
      </div>

    </div>
  );
}
