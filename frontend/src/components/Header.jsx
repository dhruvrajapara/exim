import { useState, useEffect } from 'react';
import { NavLink, Link, useLocation } from 'react-router-dom';
import MenuIcon from '@mui/icons-material/Menu';
import CloseIcon from '@mui/icons-material/Close';

const navItems = [
  { name: 'Home', path: '/' },
  { name: 'About', path: '/about' },
  { name: 'Product', path: '/product' },
  { name: 'Team', path: '/team' },
  { name: 'Blog', path: '/blog' },
  { name: 'Image', path: '/image' }
];

export default function Header() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const location = useLocation();

  const isHomePage = location.pathname === '/';
  const isTransparent = isHomePage && !isScrolled;

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
              src="/logo.png" 
              alt="Company Logo" 
              className="h-[40px] w-auto object-contain transition-all duration-300" 
            />
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex flex-1 justify-center" aria-label="Main Navigation">
            <ul className="flex items-center space-x-8 xl:space-x-12">
              {navItems.map((item) => (
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

          {/* Contact Button (Desktop/Tablet) */}
          <div className="hidden md:flex flex-shrink-0 items-center justify-end lg:w-auto">
            <Link to="/contact" className="btn-primary whitespace-nowrap">
              Contact
            </Link>
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
            <MenuIcon fontSize="large" />
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
            <img src="/logo.png" alt="Company Logo" className="h-[40px] w-auto object-contain" />
          </Link>
          <button 
            type="button"
            className="p-2 text-dark hover:text-primary transition-colors focus:outline-none rounded-md"
            onClick={() => setIsDrawerOpen(false)}
            aria-label="Close menu"
          >
            <CloseIcon fontSize="large" />
          </button>
        </div>

        <nav className="flex-1 overflow-y-auto py-4" aria-label="Mobile Navigation">
          <ul className="flex flex-col">
            {navItems.map((item) => (
              <li key={item.name}>
                <NavLink 
                  to={item.path}
                  className={({ isActive }) => `
                    flex items-center px-6 min-h-[56px] text-[16px] transition-colors duration-300
                    ${isActive ? 'text-primary font-medium bg-primary/5 border-l-4 border-primary pl-[20px]' : 'text-dark hover:bg-light border-l-4 border-transparent'}
                  `}
                >
                  {item.name}
                </NavLink>
              </li>
            ))}
          </ul>
        </nav>

        <div className="p-6 border-t border-border">
          <Link to="/contact" className="btn-primary w-full text-center" onClick={() => setIsDrawerOpen(false)}>
            Contact
          </Link>
        </div>
      </div>
    </>
  );
}
