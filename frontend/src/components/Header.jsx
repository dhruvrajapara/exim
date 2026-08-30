import { useState, useEffect } from 'react';
import { NavLink, Link, useLocation } from 'react-router-dom';
import MenuIcon from '@mui/icons-material/Menu';
import CloseIcon from '@mui/icons-material/Close';
import { useSettings } from '../contexts/SettingsContext';
import RFQModal from './RFQModal';

const navItems = [
  { name: 'Home', path: '/' },
  { name: 'About', path: '/about' },
  { name: 'Our Products', path: '/product' },
  { name: 'Blog', path: '/blog' },
  { name: 'Gallery', path: '/gallery' },
  { name: 'Contact Us', path: '/contact' }
];

export default function Header() {
  const { settings } = useSettings();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [isRfqOpen, setIsRfqOpen] = useState(false);
  const location = useLocation();

  const isHomePage = location.pathname === '/';
  const isTransparent = settings?.header_transparent !== false && isHomePage && !isScrolled;

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && isDrawerOpen) {
        setIsDrawerOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isDrawerOpen]);

  useEffect(() => {
    if (isDrawerOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => { document.body.style.overflow = ''; };
  }, [isDrawerOpen]);

  useEffect(() => {
    setIsDrawerOpen(false);
  }, [location]);

  return (
    <>
      <header 
        className={`fixed top-0 z-50 w-full h-[80px] transition-all duration-300 ${
          isTransparent 
            ? 'bg-transparent shadow-none' 
            : 'bg-white/95 backdrop-blur-md shadow-md'
        }`}
      >
        <div className="container-custom h-full flex items-center justify-between">
          
          {/* Logo */}
          <Link to="/" className="flex-shrink-0" aria-label="Home">
            <img 
              src={settings?.header_logo_url || "/logo.png"} 
              alt={settings?.contact_company_name || "Company Logo"} 
              style={{ height: settings?.logo_height ? `${settings.logo_height}px` : '40px', width: 'auto' }}
              className="object-contain transition-all duration-300 max-h-[32px] md:max-h-none" 
            />
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex flex-1 justify-center" aria-label="Main Navigation">
            <ul className="flex items-center space-x-8 xl:space-x-12">
              {navItems.filter(item => item.name !== 'Blog' || settings?.blog_enabled !== false).map((item) => (
                <li key={item.name}>
                  <NavLink 
                    to={item.path}
                    className={({ isActive }) => `
                      text-[16px] whitespace-nowrap transition-colors duration-300 py-2 relative
                      ${isActive 
                        ? 'text-primary font-medium' 
                        : (isTransparent ? 'text-white/80 hover:text-white' : 'text-dark hover:text-primary')
                      }
                    `}
                  >
                    {({ isActive }) => (
                      <>
                        {item.name}
                        {isActive && (
                          <span className="absolute bottom-0 left-0 w-full h-[2px] bg-primary rounded-t-sm" />
                        )}
                      </>
                    )}
                  </NavLink>
                </li>
              ))}
            </ul>
          </nav>

          {/* Header Action Button (Desktop/Tablet) */}
          <div className="hidden md:flex flex-shrink-0 items-center justify-end gap-3 lg:w-auto">
            <button
              onClick={() => setIsRfqOpen(true)}
              className="btn-primary whitespace-nowrap bg-[#0B63CE] text-white hover:bg-blue-700 shadow-sm"
            >
              Request Quote
            </button>
            {settings?.header_btn_enabled && settings.header_btn_type === 'pdf' && (
              <a href={settings.header_btn_pdf_url} target="_blank" rel="noopener noreferrer" className="btn-primary bg-green-700 text-white whitespace-nowrap">
                {settings.header_btn_label || 'Download Catalogue'}
              </a>
            )}
          </div>

          {/* Mobile Hamburger Menu */}
          <button 
            type="button"
            className={`lg:hidden p-2 transition-colors focus:outline-none rounded-md ${
              isTransparent ? 'text-white hover:text-gray-300' : 'text-dark hover:text-primary'
            }`}
            onClick={() => setIsDrawerOpen(true)}
            aria-label="Open menu"
            aria-expanded={isDrawerOpen}
          >
            <MenuIcon fontSize="medium" />
          </button>
        </div>
      </header>

      {/* Mobile Drawer Overlay */}
      <div 
        className={`fixed inset-0 z-[60] bg-white transform transition-transform duration-300 ease-out lg:hidden flex flex-col ${
          isDrawerOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
        aria-hidden={!isDrawerOpen}
      >
        <div className="h-[80px] px-4 md:px-6 flex items-center justify-between border-b border-border">
          <Link to="/" className="flex-shrink-0" onClick={() => setIsDrawerOpen(false)}>
            <img src={settings?.header_logo_url || "/logo.png"} alt={settings?.contact_company_name || "Company Logo"} style={{ height: settings?.logo_height ? `${settings.logo_height}px` : '40px', width: 'auto' }} className="object-contain max-h-[32px] md:max-h-none" />
          </Link>
          <button 
            type="button"
            className="p-2 text-dark hover:text-primary transition-colors focus:outline-none rounded-md"
            onClick={() => setIsDrawerOpen(false)}
            aria-label="Close menu"
          >
            <CloseIcon fontSize="medium" />
          </button>
        </div>

        <nav className="flex-1 overflow-y-auto py-4" aria-label="Mobile Navigation">
          <ul className="flex flex-col">
            {navItems.filter(item => item.name !== 'Blog' || settings?.blog_enabled !== false).map((item) => (
              <li key={item.name}>
                <NavLink 
                  to={item.path}
                  className={({ isActive }) => `
                    flex items-center px-5 min-h-[48px] text-[15px] transition-colors duration-300
                    ${isActive ? 'text-primary font-medium bg-primary/5 border-l-4 border-primary pl-[16px]' : 'text-dark hover:bg-light border-l-4 border-transparent'}
                  `}
                >
                  {item.name}
                </NavLink>
              </li>
            ))}
          </ul>
        </nav>

        {settings?.header_btn_enabled && (
          <div className="p-5 border-t border-border mt-auto">
            {settings.header_btn_type === 'pdf' ? (
              <a href={settings.header_btn_pdf_url} target="_blank" rel="noopener noreferrer" className="btn-primary w-full flex items-center justify-center min-h-[44px] h-auto py-2.5 px-4 text-[14px] leading-tight whitespace-normal break-words text-center" onClick={() => setIsDrawerOpen(false)}>
                {settings.header_btn_label || 'Download'}
              </a>
            ) : (
              <Link to={settings.header_btn_link?.url || '/contact'} className="btn-primary w-full flex items-center justify-center min-h-[44px] h-auto py-2.5 px-4 text-[14px] leading-tight whitespace-normal break-words text-center" onClick={() => setIsDrawerOpen(false)}>
                {settings.header_btn_label || 'Contact'}
              </Link>
            )}
          </div>
        )}
      </div>

      <RFQModal isOpen={isRfqOpen} onClose={() => setIsRfqOpen(false)} />
    </>
  );
}
