import { useState } from 'react';
import { motion } from 'framer-motion';
import VisibilityIcon from '@mui/icons-material/Visibility';
import GalleryLightbox from './GalleryLightbox';

const GALLERY_DATA = [
  {
    id: 1,
    title: 'Export Shipment Container Loading',
    slug: 'export-shipment-container-loading',
    image: 'https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?w=1200&q=80',
    category: 'Container Loading',
    description: 'Our team loading premium dehydrated onions into temperature-controlled containers bound for Europe.',
    country: 'India to Germany',
    date: 'March 2026',
  },
  {
    id: 2,
    title: 'Gulfood 2026 International Trade Fair',
    slug: 'gulfood-trade-fair-2026',
    image: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=1200&q=80',
    category: 'International Trade Fair',
    description: 'BiteExport showcasing innovative dehydrated vegetable products at the Gulfood Trade Fair in Dubai.',
    country: 'United Arab Emirates',
    date: 'February 2026',
  },
  {
    id: 3,
    title: 'State-of-the-art Factory Production',
    slug: 'factory-production-line',
    image: 'https://images.unsplash.com/photo-1589792923962-537704632910?w=1200&q=80',
    category: 'Factory Production',
    description: 'Inside our advanced manufacturing facility where raw vegetables are cleaned, sliced, and dehydrated.',
    country: 'Gujarat, India',
    date: 'April 2026',
  },
  {
    id: 4,
    title: 'Rigorous Quality Inspection',
    slug: 'quality-inspection-process',
    image: 'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?w=1200&q=80',
    category: 'Quality Inspection',
    description: 'Our QA experts performing stringent quality checks to ensure compliance with global food safety standards.',
    country: 'India',
    date: 'May 2026',
  },
  {
    id: 5,
    title: 'APEDA & FSSAI Certifications',
    slug: 'export-certifications',
    image: 'https://images.unsplash.com/photo-1589829085413-56de8ae18c73?w=1200&q=80',
    category: 'APEDA / IEC / FSSAI',
    description: 'Proudly holding top-tier international and national certifications for food export excellence.',
    country: 'Global',
    date: 'January 2026',
  },
  {
    id: 6,
    title: 'Meeting with European Buyers',
    slug: 'global-buyer-meeting',
    image: 'https://images.unsplash.com/photo-1556761175-5973dc0f32d7?w=1200&q=80',
    category: 'Global Buyer Meeting',
    description: 'Signing a multi-year export agreement with top food distributors in the European Union.',
    country: 'Germany',
    date: 'November 2025',
  },
  {
    id: 7,
    title: 'Automated Packaging Process',
    slug: 'automated-packaging',
    image: 'https://images.unsplash.com/photo-1615484477201-cb8633783a60?w=1200&q=80',
    category: 'Packaging Process',
    description: 'Hygienic, automated packaging lines sealing dehydrated products in moisture-proof bulk bags.',
    country: 'India',
    date: 'Ongoing',
  },
  {
    id: 8,
    title: 'Premium Product Showcase',
    slug: 'product-showcase',
    image: 'https://images.unsplash.com/photo-1596647901016-1f6b1587d46c?w=1200&q=80',
    category: 'Product Showcase',
    description: 'A display of our premium Grade-A dehydrated garlic cloves and onion flakes.',
    country: 'Global',
    date: '2026',
  }
];

export default function GlobalGallery() {
  const [lightboxIndex, setLightboxIndex] = useState(null);

  const openLightbox = (index) => setLightboxIndex(index);
  const closeLightbox = () => setLightboxIndex(null);
  
  const nextImage = () => {
    setLightboxIndex((prev) => (prev === GALLERY_DATA.length - 1 ? 0 : prev + 1));
  };
  
  const prevImage = () => {
    setLightboxIndex((prev) => (prev === 0 ? GALLERY_DATA.length - 1 : prev - 1));
  };

  return (
    <section className="py-12 md:py-16 bg-white">
      <div className="container-custom">

        {/* CSS Grid for masonry-like feel without external libraries. 
            Using auto-rows and spanning for dynamic looking layouts. */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {GALLERY_DATA.map((item, index) => (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              className={`relative rounded-[20px] overflow-hidden shadow-sm hover:shadow-xl cursor-pointer group bg-gray-100 ${
                index === 0 || index === 3 || index === 4 || index === 7 
                  ? 'lg:col-span-2 aspect-[16/9]' 
                  : 'aspect-square'
              }`}
              onClick={() => openLightbox(index)}
            >
              {/* Image */}
              <img 
                src={item.image} 
                alt={item.title} 
                loading="lazy"
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
              />
              
              {/* Dark Gradient Overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-dark/90 via-dark/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>

              {/* Hover Content */}
              <div className="absolute inset-0 p-6 flex flex-col justify-end opacity-0 group-hover:opacity-100 translate-y-4 group-hover:translate-y-0 transition-all duration-300">
                
                <div className="flex items-center justify-between mb-2">
                  <span className="bg-[#0B63CE] text-white text-[11px] font-bold uppercase tracking-wider px-2 py-1 rounded">
                    {item.category}
                  </span>
                  <div className="w-[32px] h-[32px] rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center text-white">
                    <VisibilityIcon fontSize="small" />
                  </div>
                </div>

                <h3 className="font-rubik text-[18px] md:text-[20px] font-bold text-white leading-tight mb-1">
                  {item.title}
                </h3>
                
                <div className="flex items-center gap-2 text-[12px] font-medium text-gray-300">
                  <span>{item.country}</span>
                  {item.date && (
                    <>
                      <span>•</span>
                      <span>{item.date}</span>
                    </>
                  )}
                </div>

              </div>
            </motion.div>
          ))}
        </div>

      </div>

      <GalleryLightbox 
        images={GALLERY_DATA} 
        currentIndex={lightboxIndex} 
        onClose={closeLightbox}
        onNext={nextImage}
        onPrev={prevImage}
      />
    </section>
  );
}
