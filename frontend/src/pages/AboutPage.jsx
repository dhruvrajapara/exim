import AboutHero from '../components/AboutHero';
import WhyChooseUs from '../components/WhyChooseUs';
import VisionMission from '../components/VisionMission';
import AboutCertifications from '../components/AboutCertifications';
import AboutTeam from '../components/AboutTeam';
import SEO from '../components/SEO';
import { useEffect } from 'react';
import { useSettings } from '../contexts/SettingsContext';

export default function AboutPage() {
  const { settings } = useSettings();

  // Ensure the page loads at the very top (React SPA routing fix)
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const componentsMap = {
    AboutHero,
    WhyChooseUs,
    VisionMission,
    AboutCertifications,
    AboutTeam,
  };

  const defaultOrder = ['AboutHero', 'WhyChooseUs', 'VisionMission', 'AboutCertifications', 'AboutTeam'];
  let order = defaultOrder;

  if (settings?.aboutpage_section_order) {
    try {
      const parsedOrder = JSON.parse(settings.aboutpage_section_order);
      if (Array.isArray(parsedOrder) && parsedOrder.length > 0) {
        order = parsedOrder;
      }
    } catch (e) {
      console.error('Failed to parse aboutpage_section_order', e);
    }
  }

  return (
    <div className="w-full bg-white flex flex-col font-sans">
      <SEO 
        title="About Us" 
        description="Learn about BiteExport, a premier Manufacturer & Exporter from India specializing in dehydrated vegetables, garlic, onion, and agricultural food ingredients." 
        canonical="https://biteexport.com/about" 
      />
      
      {order.map(sectionId => {
        const Component = componentsMap[sectionId];
        return Component ? <Component key={sectionId} /> : null;
      })}
    </div>
  );
}
