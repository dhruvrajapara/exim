import { Outlet as RouterOutlet, useLocation } from 'react-router-dom';
import Header from './Header';
import Footer from './Footer';
import FloatingActionButtons from './FloatingActionButtons';
import ClarityTracker from './ClarityTracker';
import useWebsiteProtection from '../hooks/useWebsiteProtection';
import { useSettings } from '../contexts/SettingsContext';

export default function MainLayout() {
  const location = useLocation();
  const { settings } = useSettings();
  const isHomePage = location.pathname === '/';
  
  // If transparent header is disabled, we always want padding-top (even on home page)
  const needsPadding = !isHomePage || settings?.header_transparent === false;

  // Apply website security protection if enabled
  useWebsiteProtection();

  return (
    <div className="min-h-screen flex flex-col bg-light text-text font-sans">
      <ClarityTracker />
      <Header />
      
      <main className={`flex-grow w-full ${needsPadding ? 'pt-[80px]' : ''}`}>
        <RouterOutlet />
      </main>

      <Footer />
      <FloatingActionButtons />
    </div>
  );
}
