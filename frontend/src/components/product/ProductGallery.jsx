import { useState } from 'react';

export default function ProductGallery({ images = [], mainImage }) {
  const fallbackImage = 'https://placehold.co/600x400/eeeeee/999999?text=Product+Image';
  const displayImages = images && images.length > 0 ? images : (mainImage ? [mainImage] : [fallbackImage]);
  const [activeImage, setActiveImage] = useState(mainImage || (images && images.length > 0 ? images[0] : fallbackImage));

  return (
    <div className="flex flex-col gap-4 w-full">
      
      {/* Main Image View */}
      <div className="w-full aspect-[4/3] rounded-[20px] bg-gray-50 border border-gray-100 shadow-sm overflow-hidden group cursor-crosshair">
        <img 
          src={activeImage || fallbackImage} 
          alt="Product Main" 
          onError={(e) => { e.target.onerror = null; e.target.src = fallbackImage; }}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
        />
      </div>

      {/* Thumbnails Gallery */}
      <div className="grid grid-cols-4 gap-3">
        {displayImages.map((img, index) => (
          <button
            key={index}
            onClick={() => setActiveImage(img)}
            className={`w-full aspect-square rounded-[12px] overflow-hidden border-2 transition-all duration-300 ${
              activeImage === img ? 'border-primary shadow-md' : 'border-transparent opacity-70 hover:opacity-100 hover:border-gray-300'
            }`}
          >
            <img 
              src={img || fallbackImage} 
              alt={`Thumbnail ${index + 1}`} 
              onError={(e) => { e.target.onerror = null; e.target.src = fallbackImage; }}
              className="w-full h-full object-cover"
            />
          </button>
        ))}
      </div>
      
    </div>
  );
}
