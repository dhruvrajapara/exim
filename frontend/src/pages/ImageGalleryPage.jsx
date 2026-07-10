import { Helmet } from 'react-helmet-async';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import KeyboardArrowRightIcon from '@mui/icons-material/KeyboardArrowRight';
import SEO from '../components/SEO';
import GlobalGallery from '../components/gallery/GlobalGallery';

export default function ImageGalleryPage() {
  return (
    <div className="w-full bg-[#F9FAFB] min-h-screen">
      <SEO 
        title="Gallery"
        description="Explore our export milestones, global buyer meetings, advanced manufacturing processes, and international trade fair participations."
        canonical="https://example.com/image"
      />

      {/* Hero Banner matched to BlogHeroRedesign */}
      <section className="relative h-[250px] bg-gradient-to-r from-[#0B63CE]/5 to-[#EAF4FF] overflow-hidden flex items-center">
        
        {/* Abstract Dot Pattern */}
        <div 
          className="absolute inset-0 opacity-10 pointer-events-none"
          style={{ backgroundImage: 'radial-gradient(#0B63CE 1px, transparent 1px)', backgroundSize: '24px 24px' }}
        ></div>

        <div className="container-custom relative z-10">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="max-w-3xl"
          >
            {/* Breadcrumb */}
            <nav aria-label="Breadcrumb" className="flex items-center text-[14px] font-medium text-gray-500 mb-4">
              <Link to="/" className="hover:text-[#0B63CE] transition-colors">Home</Link>
              <KeyboardArrowRightIcon fontSize="small" className="mx-1 opacity-60" />
              <span className="text-[#0B63CE]">Gallery</span>
            </nav>

            <h1 className="font-rubik text-[36px] md:text-[48px] font-bold text-dark leading-tight mb-3 tracking-tight">
              Image Gallery
            </h1>
            <p className="text-gray-600 text-[16px] max-w-2xl">
              Discover the visual story behind BiteExport's commitment to quality, sustainability, and global trade excellence.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Main Gallery Section */}
      <GlobalGallery />

    </div>
  );
}
