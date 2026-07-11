import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { adminMenu } from '../../constants/adminMenu';
import { useAuth } from '../../contexts/AuthContext';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import CircleIcon from '@mui/icons-material/Circle';

const MenuItem = ({ item, level = 0, location }) => {
  const hasChildren = item.children && item.children.length > 0;
  
  // Check if current path matches item path or any of its nested children paths
  const isActiveLink = item.path === location.pathname;
  const isChildActive = hasChildren && JSON.stringify(item.children).includes(`"path":"${location.pathname}"`);
  
  // Auto-expand if a child is active initially
  const [isOpen, setIsOpen] = useState(isChildActive);

  // Update open state if URL changes and a child becomes active
  useEffect(() => {
    if (isChildActive) {
      setIsOpen(true);
    }
  }, [location.pathname, isChildActive]);

  const toggleOpen = () => setIsOpen(!isOpen);

  // Indentation mapping
  const paddingLeft = level === 0 ? 'px-4' : level === 1 ? 'pl-11 pr-4' : 'pl-[68px] pr-4';

  if (!hasChildren) {
    return (
      <Link
        to={item.path || '#'}
        className={`flex items-center justify-between py-2 my-0.5 rounded-lg text-[13.5px] font-medium transition-colors ${paddingLeft} ${
          isActiveLink
            ? 'bg-[#0B63CE] text-white shadow-sm shadow-[#0B63CE]/20'
            : 'text-gray-600 hover:bg-gray-50 hover:text-[#0B63CE]'
        }`}
      >
        <div className="flex items-center gap-3">
          {item.icon ? (
            <span className={isActiveLink ? 'text-white' : 'text-gray-400'}>{item.icon}</span>
          ) : (
             <CircleIcon sx={{ fontSize: 6 }} className={`${isActiveLink ? 'text-white' : 'text-gray-300'} ml-1`} />
          )}
          {item.title}
        </div>
      </Link>
    );
  }

  return (
    <div className="my-1">
      <button
        onClick={toggleOpen}
        className={`w-full flex items-center justify-between py-2 rounded-lg text-[13.5px] font-medium transition-colors ${paddingLeft} ${
          isChildActive && !isOpen ? 'text-[#0B63CE] bg-blue-50/50' : 'text-gray-700 hover:bg-gray-50'
        }`}
      >
        <div className="flex items-center gap-3">
          {item.icon && <span className={isChildActive || isOpen ? 'text-[#0B63CE]' : 'text-gray-400'}>{item.icon}</span>}
          {item.title}
        </div>
        <span className="text-gray-400 transition-transform duration-200" style={{ transform: isOpen ? 'rotate(90deg)' : 'rotate(0deg)' }}>
          <ChevronRightIcon fontSize="small" />
        </span>
      </button>
      
      {/* Collapsible Content */}
      <div 
        className="overflow-hidden transition-all duration-300 ease-in-out"
        style={{ 
          maxHeight: isOpen ? '2000px' : '0px',
          opacity: isOpen ? 1 : 0,
          marginTop: isOpen ? '4px' : '0px'
        }}
      >
        {item.children.map((child, index) => (
          <MenuItem key={`${child.title}-${index}`} item={child} level={level + 1} location={location} />
        ))}
      </div>
    </div>
  );
};

export default function AdminSidebar({ sidebarOpen, setSidebarOpen }) {
  const { user } = useAuth();
  const location = useLocation();

  return (
    <>
      {/* Mobile Sidebar Overlay */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 bg-gray-900/50 backdrop-blur-sm z-40 lg:hidden transition-opacity"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside 
        className={`fixed inset-y-0 left-0 z-50 w-[280px] bg-white border-r border-gray-100 shadow-xl lg:shadow-none transform transition-transform duration-300 ease-in-out flex flex-col lg:static lg:translate-x-0 ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="h-20 flex flex-shrink-0 items-center justify-center border-b border-gray-100 px-6">
          <Link to="/" className="w-full flex justify-center hover:opacity-90 transition-opacity">
             <img src="/logo.png" alt="Company Logo" className="h-8 w-auto object-contain" />
          </Link>
        </div>

        <div className="flex-1 overflow-y-auto overflow-x-hidden p-4 scrollbar-hide">
          <div className="mb-6 px-4 flex items-center gap-3 p-3 bg-gray-50 rounded-xl border border-gray-100">
            <div className="w-10 h-10 rounded-full bg-[#0B63CE]/10 text-[#0B63CE] flex items-center justify-center font-bold uppercase shadow-sm">
              {user?.name?.charAt(0) || 'A'}
            </div>
            <div className="flex flex-col flex-1 min-w-0">
              <span className="text-sm font-semibold text-gray-800 truncate">{user?.name}</span>
              <span className="text-xs text-gray-500 capitalize truncate">{user?.role || 'Administrator'}</span>
            </div>
          </div>

          <nav className="flex flex-col gap-1 pb-20">
            {adminMenu.map((item, index) => (
              <MenuItem key={`${item.title}-${index}`} item={item} location={location} />
            ))}
          </nav>
        </div>
      </aside>
    </>
  );
}
