import { useState } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';

import Lightbox from './Lightbox';

export default function ProductGallery({ images = [], mainImage }) {
  const displayImages = images && images.length > 0 ? images : (mainImage ? [mainImage] : []);
  const [activeImage, setActiveImage] = useState(mainImage || images[0]);
  
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [lightboxIndex, setLightboxIndex] = useState(0);

  if (displayImages.length === 0) return null;

  const handleOpenLightbox = (imgUrl) => {
    const idx = displayImages.indexOf(imgUrl);
    setLightboxIndex(idx !== -1 ? idx : 0);
    setLightboxOpen(true);
  };

  const handleNavigateLightbox = (direction) => {
    let newIndex = lightboxIndex + direction;
    if (newIndex < 0) newIndex = displayImages.length - 1;
    if (newIndex >= displayImages.length) newIndex = 0;
    setLightboxIndex(newIndex);
  };

  const isCarousel = displayImages.length > 4;

  return (
    <div className="flex flex-col gap-4 w-full">
      
      {/* Main Image View */}
      <div 
        className="w-full aspect-[4/3] rounded-[20px] bg-gray-50 border border-gray-100 shadow-sm overflow-hidden group cursor-pointer"
        onClick={() => handleOpenLightbox(activeImage)}
      >
        <img 
          src={activeImage} 
          alt="Product Main" 
          loading="lazy"
          onError={(e) => { e.target.style.display = 'none'; }}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
        />
      </div>

      {/* Thumbnails Gallery */}
      {displayImages.length > 1 && !isCarousel && (
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
                src={img} 
                alt={`Thumbnail ${index + 1}`} 
                loading="lazy"
                onError={(e) => { e.target.style.display = 'none'; }}
                className="w-full h-full object-cover"
              />
            </button>
          ))}
        </div>
      )}

      {/* Carousel Gallery (For >4 images) */}
      {isCarousel && (
        <div className="w-full relative px-8">
          <Swiper
            modules={[Navigation, Pagination]}
            spaceBetween={12}
            slidesPerView={4}
            navigation
            breakpoints={{
              320: { slidesPerView: 3 },
              480: { slidesPerView: 4 },
              768: { slidesPerView: 5 },
              1024: { slidesPerView: 4 }
            }}
            className="thumbnail-swiper"
          >
            {displayImages.map((img, index) => (
              <SwiperSlide key={index}>
                <button
                  onClick={() => setActiveImage(img)}
                  className={`w-full aspect-square rounded-[12px] overflow-hidden border-2 transition-all duration-300 block ${
                    activeImage === img ? 'border-primary shadow-md' : 'border-transparent opacity-70 hover:opacity-100 hover:border-gray-300'
                  }`}
                >
                  <img 
                    src={img} 
                    alt={`Thumbnail ${index + 1}`} 
                    loading="lazy"
                    onError={(e) => { e.target.style.display = 'none'; }}
                    className="w-full h-full object-cover"
                  />
                </button>
              </SwiperSlide>
            ))}
          </Swiper>
        </div>
      )}

      <Lightbox 
        images={displayImages} 
        activeIndex={lightboxIndex} 
        isOpen={lightboxOpen} 
        onClose={() => setLightboxOpen(false)}
        onNavigate={handleNavigateLightbox}
      />
    </div>
  );
}
