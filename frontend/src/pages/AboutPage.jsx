import AboutHero from '../components/AboutHero';
import { useEffect } from 'react';

export default function AboutPage() {
  
  // Ensure the page loads at the very top (React SPA routing fix)
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="w-full bg-white flex flex-col font-sans">
      <AboutHero />
      {/* Future About Page Sections (e.g. Our Team, Timeline, Certifications) will go here */}
    </div>
  );
}
