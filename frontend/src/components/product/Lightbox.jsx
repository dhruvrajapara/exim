import { useEffect } from 'react';

export default function Lightbox({ images, activeIndex, isOpen, onClose, onNavigate }) {
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (!isOpen) return;
      if (e.key === 'Escape') onClose();
      if (e.key === 'ArrowRight') onNavigate(1);
      if (e.key === 'ArrowLeft') onNavigate(-1);
    };
    
    window.addEventListener('keydown', handleKeyDown);
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'auto';
    }

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'auto';
    };
  }, [isOpen, onClose, onNavigate]);

  if (!isOpen || !images || images.length === 0) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/95 backdrop-blur-sm transition-opacity duration-300">
      
      {/* Close Button */}
      <button 
        onClick={onClose}
        className="absolute top-4 right-4 md:top-8 md:right-8 z-[60] w-12 h-12 flex items-center justify-center rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors"
        aria-label="Close Lightbox"
      >
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
        </svg>
      </button>

      {/* Main Image Container */}
      <div className="relative w-full h-full max-w-6xl p-4 md:p-8 flex items-center justify-center">
        
        {/* Prev Arrow */}
        {images.length > 1 && (
          <button 
            onClick={(e) => { e.stopPropagation(); onNavigate(-1); }}
            className="absolute left-4 md:left-8 z-[60] w-12 h-12 flex items-center justify-center rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors"
            aria-label="Previous Image"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" />
            </svg>
          </button>
        )}

        {/* Image wrapper to prevent clicks from closing */}
        <div className="relative max-h-full max-w-full flex items-center justify-center" onClick={(e) => e.stopPropagation()}>
          <img 
            src={images[activeIndex]} 
            alt="Fullscreen View" 
            className="max-h-[85vh] max-w-full object-contain select-none animate-in fade-in zoom-in-95 duration-200"
            draggable="false"
          />
        </div>

        {/* Next Arrow */}
        {images.length > 1 && (
          <button 
            onClick={(e) => { e.stopPropagation(); onNavigate(1); }}
            className="absolute right-4 md:right-8 z-[60] w-12 h-12 flex items-center justify-center rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors"
            aria-label="Next Image"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
            </svg>
          </button>
        )}
      </div>

      {/* Image Counter */}
      {images.length > 1 && (
        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 text-white/80 font-medium tracking-wide">
          {activeIndex + 1} / {images.length}
        </div>
      )}

      {/* Background click handler */}
      <div className="absolute inset-0 z-40" onClick={onClose} />
    </div>
  );
}
