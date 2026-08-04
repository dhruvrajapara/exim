import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import KeyboardArrowRightIcon from '@mui/icons-material/KeyboardArrowRight';
import SEO from '../components/SEO';
import ProductListing from '../components/ProductListing';
import { fetchSectionSetting } from '../services/api';
import { useSettings } from '../contexts/SettingsContext';

export default function ProductPage() {
  const { settings } = useSettings();
  const [heroSetting, setHeroSetting] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchSectionSetting('product_page_hero')
      .then(setHeroSetting)
      .catch(console.error)
      .finally(() => setIsLoading(false));
  }, []);

  const schema = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    "name": "Premium Export Products - ABC Export",
    "url": "https://example.com/product",
    "description": "ABC Export provides premium dehydrated vegetables, spices, and agricultural products with international export quality standards."
  };

  if (isLoading) {
    return (
      <div className="w-full bg-[#F9FAFB] min-h-screen">
        <section className="h-[250px] w-full bg-gray-200 animate-pulse"></section>
      </div>
    );
  }

  return (
    <div className="w-full bg-[#F9FAFB] min-h-screen">
      <SEO
        title="Products"
        description="ABC Export provides premium dehydrated vegetables, spices, and agricultural products with international export quality standards."
        canonical="https://example.com/product"
        schema={schema}
      />

      {/* Hero Banner matched to BlogHeroRedesign */}
      <section 
        className="relative h-[250px] overflow-hidden flex items-center bg-cover bg-center"
        style={{
          background: heroSetting?.extra_data?.backgroundImage 
            ? `url(${heroSetting.extra_data.backgroundImage}) center/cover no-repeat`
            : (heroSetting?.extra_data?.backgroundColor 
                ? `linear-gradient(to right, rgba(11, 99, 206, 0.05), ${heroSetting.extra_data.backgroundColor})`
                : 'linear-gradient(to right, rgba(11, 99, 206, 0.05), #EAF4FF)')
        }}
      >
        
        {/* Abstract Dot Pattern */}
        <div 
          className="absolute inset-0 opacity-10 pointer-events-none"
          style={{ backgroundImage: 'radial-gradient(#0B63CE 1px, transparent 1px)', backgroundSize: '24px 24px' }}
        ></div>

        {/* Optional overlay if there is a background image, to ensure text readability */}
        {heroSetting?.extra_data?.backgroundImage && (
          <div 
            className="absolute inset-0"
            style={{
              backgroundColor: heroSetting?.extra_data?.overlayColor || '#000000',
              opacity: (heroSetting?.extra_data?.overlayOpacity ?? 40) / 100
            }}
          ></div>
        )}

        <div className="container-custom relative z-10">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="max-w-3xl"
          >
            {/* Breadcrumb */}
            <nav aria-label="Breadcrumb" className="flex items-center text-[14px] font-medium mb-4" style={{ color: settings?.theme_breadcrumb_color || '#6B7280' }}>
              <Link to="/" className="hover:text-[#0B63CE] transition-colors">Home</Link>
              <KeyboardArrowRightIcon fontSize="small" className="mx-1 opacity-60" />
              <span className="text-[#0B63CE]">Products</span>
            </nav>

            <h1 
              className="font-rubik text-[36px] md:text-[48px] font-bold leading-tight mb-3 tracking-tight"
              style={{ color: heroSetting?.extra_data?.textColor || '#1F2937' }}
            >
              {heroSetting?.title || "Premium Export Products"}
            </h1>
            <p 
              className="text-[16px] max-w-2xl whitespace-pre-wrap"
              style={{ color: heroSetting?.extra_data?.descriptionColor || (heroSetting?.extra_data?.backgroundImage ? '#F3F4F6' : '#4B5563') }}
            >
              {heroSetting?.description || "Discover our export-grade dehydrated vegetables, spices, and agricultural ingredients sourced globally."}
            </p>
          </motion.div>
        </div>
      </section>

      <ProductListing />

    </div>
  );
}
