import { useState } from 'react';

export default function ProductGallery({ images = [], mainImage }) {
  const [activeImage, setActiveImage] = useState(mainImage || images[0]);

  if (!images || images.length === 0) return null;

  return (
    <div className="flex flex-col gap-4 w-full">
      
      {/* Main Image View */}
      <div className="w-full aspect-[4/3] rounded-[20px] bg-gray-50 border border-gray-100 shadow-sm overflow-hidden group cursor-crosshair">
        <img 
          src={activeImage} 
          alt="Product Main" 
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
        />
      </div>

      {/* Thumbnails Gallery */}
      <div className="grid grid-cols-4 gap-3">
        {images.map((img, index) => (
          <button
            key={index}
            onClick={() => setActiveImage(img)}
            className={`w-full aspect-square rounded-[12px] overflow-hidden border-2 transition-all duration-300 ${
              activeImage === img ? 'border-primary shadow-md' : 'border-transparent opacity-70 hover:opacity-100 hover:border-gray-300'
            }`}
          >
            <img 
              src={img} 
              alt={`Thumbnail ${index + 1}`} 
              className="w-full h-full object-cover"
            />
          </button>
        ))}
      </div>
      
    </div>
  );
}
