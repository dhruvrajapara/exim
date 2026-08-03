import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import KeyboardArrowRightIcon from '@mui/icons-material/KeyboardArrowRight';
import { fetchSectionSetting } from '../../services/api';
import { useSettings } from '../../contexts/SettingsContext';

export default function ContactHero() {
  const { settings } = useSettings();
  const [isLoading, setIsLoading] = useState(true);
  const [sectionData, setSectionData] = useState({
    title: "Let's Connect Globally",
    description: "Have questions about our products or export services? Our team is ready to help you with quotations, product information, export documentation, and international business inquiries.",
    extra_data: {
      backgroundColor: '#EAF4FF',
      textColor: '#1F2937',
      descriptionColor: '#4B5563',
      backgroundImage: null,
      overlayColor: '#000000',
      overlayOpacity: 40
    }
  });

  useEffect(() => {
    const loadData = async () => {
      try {
        const result = await fetchSectionSetting('contact_page_hero');
        if (result) {
          setSectionData({
            title: result.title || "Let's Connect Globally",
            description: result.description || "Have questions about our products or export services? Our team is ready to help you with quotations, product information, export documentation, and international business inquiries.",
            extra_data: result.extra_data || {
              backgroundColor: '#EAF4FF',
              textColor: '#1F2937',
              descriptionColor: '#4B5563',
              backgroundImage: null,
              overlayColor: '#000000',
              overlayOpacity: 40
            }
          });
        }
      } catch (err) {
        console.error("Error loading contact hero setting:", err);
      } finally {
        setIsLoading(false);
      }
    };
    loadData();
  }, []);

  const extra = sectionData.extra_data || {};
  const hasBgImage = !!extra.backgroundImage;
  const overlayOpacityValue = extra.overlayOpacity !== undefined ? extra.overlayOpacity / 100 : 0.4;

  if (isLoading) {
    return <section className="h-[250px] w-full bg-gray-100 animate-pulse"></section>;
  }

  return (
    <section 
      className="relative h-[250px] overflow-hidden flex items-center"
      style={{
        backgroundColor: hasBgImage ? 'transparent' : (extra.backgroundColor || '#EAF4FF')
      }}
    >
      {/* Background Image / Gradient */}
      {hasBgImage ? (
        <>
          <div 
            className="absolute inset-0 z-0 bg-cover bg-center bg-no-repeat"
            style={{ backgroundImage: `url(${extra.backgroundImage})` }}
          ></div>
          <div 
            className="absolute inset-0 z-0"
            style={{ 
              backgroundColor: extra.overlayColor || '#000000',
              opacity: overlayOpacityValue
            }}
          ></div>
        </>
      ) : (
        <div 
          className="absolute inset-0 opacity-10 pointer-events-none"
          style={{ backgroundImage: 'radial-gradient(currentColor 1px, transparent 1px)', backgroundSize: '24px 24px', color: extra.textColor || '#0B63CE' }}
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
          <nav aria-label="Breadcrumb" className="flex items-center text-[14px] font-medium mb-4" style={{ color: hasBgImage ? '#ffffff99' : (settings?.theme_breadcrumb_color || '#6B7280') }}>
            <Link to="/" className="hover:opacity-80 transition-colors">Home</Link>
            <KeyboardArrowRightIcon fontSize="small" className="mx-1 opacity-60" />
            <span style={{ color: hasBgImage ? '#ffffff' : (extra.textColor || '#0B63CE') }}>Contact</span>
          </nav>

          <h1 
            className="font-rubik text-[36px] md:text-[48px] font-bold leading-tight mb-3 tracking-tight"
            style={{ color: hasBgImage ? '#ffffff' : (extra.textColor || '#1F2937') }}
          >
            {sectionData.title}
          </h1>
          <p 
            className="text-[16px] max-w-2xl"
            style={{ color: hasBgImage ? '#ffffffdd' : (extra.descriptionColor || '#4B5563') }}
          >
            {sectionData.description}
          </p>
        </motion.div>
      </div>
    </section>
  );
}
