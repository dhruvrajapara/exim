import { Outlet, Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { useAuth } from '../../contexts/AuthContext';
import LogoutIcon from '@mui/icons-material/Logout';
import PersonIcon from '@mui/icons-material/Person';
import MenuIcon from '@mui/icons-material/Menu';
import PublicIcon from '@mui/icons-material/Public';
import { useState } from 'react';
import AdminSidebar from './AdminSidebar';

export default function AdminLayout() {
  const { logout } = useAuth();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="flex h-screen bg-gray-50 font-sans">
      <Helmet>
        <title>Admin Dashboard | Bite Export</title>
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

          <div className="flex items-center gap-3 sm:gap-4">
            <a
              href="/"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 px-3 py-2 bg-blue-50 text-[#0B63CE] rounded-md text-sm font-semibold hover:bg-[#0B63CE] hover:text-white transition-colors"
              title="View Website"
            >
              <PublicIcon fontSize="small" />
              <span className="hidden sm:inline">View Website</span>
            </a>

            <div className="w-px h-6 bg-gray-200 hidden sm:block"></div>

            <Link to="/admin/profile" title="Profile Settings" className="w-10 h-10 rounded-full bg-gray-50 text-gray-600 flex items-center justify-center hover:bg-gray-100 hover:text-[#0B63CE] transition-colors border border-gray-100">
              <PersonIcon fontSize="small" />
            </Link>
            <button
              onClick={logout}
              className="flex items-center gap-2 px-3 py-2 rounded-md text-sm font-medium text-red-600 hover:bg-red-50 transition-colors"
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
