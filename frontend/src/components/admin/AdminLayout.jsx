import { Outlet } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { useAuth } from '../../contexts/AuthContext';
import LogoutIcon from '@mui/icons-material/Logout';
import PersonIcon from '@mui/icons-material/Person';
import MenuIcon from '@mui/icons-material/Menu';
import { useState } from 'react';
import AdminSidebar from './AdminSidebar';

export default function AdminLayout() {
  const { logout } = useAuth();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="flex h-screen bg-gray-50 font-sans">
      <Helmet>
        <title>Admin Dashboard | BiteExport</title>
        <meta name="robots" content="noindex, nofollow" />
      </Helmet>

      <AdminSidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Top Navbar */}
        <header className="h-20 bg-white shadow-sm flex items-center justify-between px-6 lg:px-10 z-30 flex-shrink-0">
          <button 
            onClick={() => setSidebarOpen(true)}
            className="lg:hidden p-2 -ml-2 text-gray-600 hover:bg-gray-100 rounded-md transition-colors"
          >
            <MenuIcon />
          </button>
          
          <div className="flex-1 lg:flex-none"></div>

          <div className="flex items-center gap-4">
            <button className="w-10 h-10 rounded-full bg-gray-50 text-gray-600 flex items-center justify-center hover:bg-gray-100 hover:text-[#0B63CE] transition-colors border border-gray-100">
              <PersonIcon fontSize="small" />
            </button>
            <button 
              onClick={logout}
              className="flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium text-red-600 hover:bg-red-50 transition-colors"
            >
              <LogoutIcon fontSize="small" />
              <span className="hidden sm:inline">Logout</span>
            </button>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 overflow-auto p-4 sm:p-6 lg:p-10">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
