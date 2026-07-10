import { useEffect } from 'react';
import CloseIcon from '@mui/icons-material/Close';
import ArrowBackIosNewIcon from '@mui/icons-material/ArrowBackIosNew';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';

export default function GalleryLightbox({ images, currentIndex, onClose, onNext, onPrev }) {
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') onClose();
      if (e.key === 'ArrowRight') onNext();
      if (e.key === 'ArrowLeft') onPrev();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClose, onNext, onPrev]);

  if (currentIndex === null) return null;

  const currentImage = images[currentIndex];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-dark/95 backdrop-blur-md p-4 md:p-8">
      
      {/* Close Button */}
      <button 
        onClick={onClose}
        className="absolute top-6 right-6 md:top-8 md:right-8 w-[48px] h-[48px] rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-colors z-10"
      >
        <CloseIcon />
      </button>

      {/* Navigation Arrows */}
      <button 
        onClick={onPrev}
        className="absolute left-4 md:left-8 top-1/2 -translate-y-1/2 w-[48px] h-[48px] rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-colors z-10"
      >
        <ArrowBackIosNewIcon />
      </button>
      <button 
        onClick={onNext}
        className="absolute right-4 md:right-8 top-1/2 -translate-y-1/2 w-[48px] h-[48px] rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-colors z-10"
      >
        <ArrowForwardIosIcon />
      </button>

      {/* Main Content Area */}
      <div className="w-full max-w-6xl max-h-full flex flex-col items-center justify-center relative">
        <div className="relative w-full max-h-[75vh] flex items-center justify-center mb-6">
          <img 
            src={currentImage.image} 
            alt={currentImage.title}
            className="max-w-full max-h-[75vh] object-contain rounded-[12px] shadow-2xl"
          />
        </div>
        
        {/* Image Metadata */}
        <div className="w-full max-w-3xl text-center flex flex-col items-center justify-center bg-dark/50 p-6 rounded-[20px] border border-white/10">
          <div className="flex flex-wrap items-center justify-center gap-3 mb-3">
            <span className="bg-[#0B63CE] text-white text-[12px] font-bold uppercase tracking-wider px-3 py-1 rounded-[6px]">
              {currentImage.category}
            </span>
            <span className="text-gray-400 text-[14px] font-medium">
              {currentImage.country}
            </span>
            {currentImage.date && (
              <>
                <span className="text-gray-600">•</span>
                <span className="text-gray-400 text-[14px] font-medium">{currentImage.date}</span>
              </>
            )}
          </div>
          <h3 className="font-rubik text-[24px] md:text-[32px] font-bold text-white mb-2">
            {currentImage.title}
          </h3>
          <p className="text-gray-300 text-[15px] md:text-[16px]">
            {currentImage.description}
          </p>
        </div>
      </div>

    </div>
  );
}
