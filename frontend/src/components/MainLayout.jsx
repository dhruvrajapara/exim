import { Outlet as RouterOutlet, useLocation } from 'react-router-dom';
import Header from './Header';
import Footer from './Footer';

export default function MainLayout() {
  const location = useLocation();
  const isHomePage = location.pathname === '/';

  return (
    <div className="min-h-screen flex flex-col bg-light text-text font-sans">
      <Header />
      
      <main className={`flex-grow w-full ${!isHomePage ? 'pt-[80px]' : ''}`}>
        <RouterOutlet />
      </main>

      <Footer />
    </div>
  );
}
