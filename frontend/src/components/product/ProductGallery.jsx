import { useState, useEffect, useRef } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Pagination } from 'swiper/modules';
import ZoomInIcon from '@mui/icons-material/ZoomIn';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';

import Lightbox from './Lightbox';

export default function ProductGallery({ images = [], mainImage }) {
  const displayImages = images && images.length > 0 ? (mainImage ? [mainImage, ...images] : images) : (mainImage ? [mainImage] : ['/placeholder.png']);
  const uniqueDisplayImages = [...new Set(displayImages)];
  const [activeImage, setActiveImage] = useState(uniqueDisplayImages[0]);
  const [isMainImageLoaded, setIsMainImageLoaded] = useState(false);
  const swiperRef = useRef(null);
  
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [lightboxIndex, setLightboxIndex] = useState(0);

  // Sync swiper when active image changes externally
  useEffect(() => {
    if (swiperRef.current && swiperRef.current.swiper) {
      const index = uniqueDisplayImages.indexOf(activeImage);
      if (index !== -1) {
        swiperRef.current.swiper.slideTo(index);
      }
    }
  }, [activeImage, uniqueDisplayImages]);

  // Keyboard navigation for gallery
  useEffect(() => {
    const handleGalleryKeyDown = (e) => {
      if (lightboxOpen) return; // Let lightbox handle its own keys
      const currentIndex = uniqueDisplayImages.indexOf(activeImage);
      if (currentIndex === -1) return;
      if (e.key === 'ArrowRight') {
        const nextIdx = (currentIndex + 1) % uniqueDisplayImages.length;
        setActiveImage(uniqueDisplayImages[nextIdx]);
      } else if (e.key === 'ArrowLeft') {
        const prevIdx = (currentIndex - 1 + uniqueDisplayImages.length) % uniqueDisplayImages.length;
        setActiveImage(uniqueDisplayImages[prevIdx]);
      }
    };
    window.addEventListener('keydown', handleGalleryKeyDown);
    return () => window.removeEventListener('keydown', handleGalleryKeyDown);
  }, [activeImage, uniqueDisplayImages, lightboxOpen]);

  // Reset loaded state when active image changes
  useEffect(() => {
    setIsMainImageLoaded(false);
  }, [activeImage]);

  if (uniqueDisplayImages.length === 0) return null;

  const handleOpenLightbox = (imgUrl) => {
    const idx = uniqueDisplayImages.indexOf(imgUrl);
    setLightboxIndex(idx !== -1 ? idx : 0);
    setLightboxOpen(true);
  };

  const handleNavigateLightbox = (direction) => {
    let newIndex = lightboxIndex + direction;
    if (newIndex < 0) newIndex = uniqueDisplayImages.length - 1;
    if (newIndex >= uniqueDisplayImages.length) newIndex = 0;
    setLightboxIndex(newIndex);
  };

  const isCarousel = uniqueDisplayImages.length > 4;

  return (
    <div className="flex flex-col gap-4 w-full select-none">
      
      {/* Main Image View */}
      <div 
        className="relative w-full aspect-[4/3] rounded-[20px] bg-gray-50 border border-gray-100 shadow-sm overflow-hidden group cursor-pointer"
        onClick={() => handleOpenLightbox(activeImage)}
      >
        {!isMainImageLoaded && (
          <div className="absolute inset-0 bg-gray-200 animate-pulse" />
        )}
        <img 
          key={activeImage} // Force remount for animation
          src={activeImage} 
          alt="Product Main" 
          onLoad={() => setIsMainImageLoaded(true)}
          onError={(e) => { e.target.style.display = 'none'; }}
          className={`w-full h-full object-contain p-4 transition-transform duration-500 group-hover:scale-105 animate-in fade-in duration-300 ${!isMainImageLoaded ? 'opacity-0' : 'opacity-100'}`}
        />
        {/* Zoom Badge */}
        <div className="absolute top-4 right-4 bg-white/80 backdrop-blur-sm p-2 rounded-full shadow-sm text-gray-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none">
          <ZoomInIcon fontSize="small" />
        </div>
      </div>

      {/* Thumbnails Gallery */}
      {uniqueDisplayImages.length > 1 && !isCarousel && (
        <div className="grid grid-cols-4 gap-3">
          {uniqueDisplayImages.map((img, index) => (
            <button
              key={index}
              onClick={() => setActiveImage(img)}
              className={`w-full aspect-square rounded-[12px] overflow-hidden border-2 transition-all duration-300 ${
                activeImage === img ? 'border-primary shadow-[0_0_12px_rgba(11,99,206,0.25)] scale-[1.02]' : 'border-transparent opacity-70 hover:opacity-100 hover:border-gray-300'
              }`}
              aria-label={`View Image ${index + 1}`}
            >
              <img 
                src={img} 
                alt={`Thumbnail ${index + 1}`} 
                loading="lazy"
                onError={(e) => { e.target.style.display = 'none'; }}
                className="w-full h-full object-contain bg-gray-50 p-1"
              />
            </button>
          ))}
        </div>
      )}

      {/* Carousel Gallery (For >4 images) */}
      {isCarousel && (
        <div className="w-full relative">
          <Swiper
            ref={swiperRef}
            modules={[Pagination]}
            spaceBetween={12}
            slidesPerView={4}
            slideToClickedSlide={true}
            breakpoints={{
              320: { slidesPerView: 3 },
              480: { slidesPerView: 4 },
              768: { slidesPerView: 5 },
              1024: { slidesPerView: 4 }
            }}
            className="thumbnail-swiper"
          >
            {uniqueDisplayImages.map((img, index) => (
              <SwiperSlide key={index} className="py-2">
                <button
                  onClick={() => setActiveImage(img)}
                  className={`w-full aspect-square rounded-[12px] overflow-hidden border-2 transition-all duration-300 block ${
                    activeImage === img ? 'border-primary shadow-[0_0_12px_rgba(11,99,206,0.25)] scale-[1.02]' : 'border-transparent opacity-70 hover:opacity-100 hover:border-gray-300'
                  }`}
                  aria-label={`View Image ${index + 1}`}
                >
                  <img 
                    src={img} 
                    alt={`Thumbnail ${index + 1}`} 
                    loading="lazy"
                    onError={(e) => { e.target.style.display = 'none'; }}
                    className="w-full h-full object-contain bg-gray-50 p-1"
                  />
                </button>
              </SwiperSlide>
            ))}
          </Swiper>
        </div>
      )}

      <Lightbox 
        images={uniqueDisplayImages} 
        activeIndex={lightboxIndex} 
        isOpen={lightboxOpen} 
        onClose={() => setLightboxOpen(false)}
        onNavigate={handleNavigateLightbox}
      />
    </div>
  );
}
