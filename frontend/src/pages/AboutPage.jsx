import AboutHero from '../components/AboutHero';
import WhyChooseUs from '../components/WhyChooseUs';
import VisionMission from '../components/VisionMission';
import AboutCertifications from '../components/AboutCertifications';
import AboutTeam from '../components/AboutTeam';
import SEO from '../components/SEO';
import { useEffect } from 'react';

export default function AboutPage() {
  
  // Ensure the page loads at the very top (React SPA routing fix)
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="w-full bg-white flex flex-col font-sans">
      <SEO title="About Us" description="About BiteExport - Premium Food Export Company" canonical="https://example.com/about" />
      <AboutHero />
      <WhyChooseUs />
      <VisionMission />
      <AboutCertifications />
      <AboutTeam />
    </div>
  );
}
