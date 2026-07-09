import AboutHero from '../components/AboutHero';
import WhyChooseUs from '../components/WhyChooseUs';
import { useEffect } from 'react';

export default function AboutPage() {
  
  // Ensure the page loads at the very top (React SPA routing fix)
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="w-full bg-white flex flex-col font-sans">
      <AboutHero />
      <WhyChooseUs />
    </div>
  );
}
