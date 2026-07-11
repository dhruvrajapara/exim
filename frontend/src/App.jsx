import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import MainLayout from './components/MainLayout';
import Home from './pages/Home';
import AboutPage from './pages/AboutPage';
import ProductPage from './pages/ProductPage';
import ProductDetailPage from './pages/ProductDetailPage';
import BlogPage from './pages/BlogPage';
import BlogDetailPage from './pages/BlogDetailPage';
import ImageGalleryPage from './pages/ImageGalleryPage';
import ContactPage from './pages/ContactPage';
import SEO from './components/SEO';

// Admin Imports
import { AuthProvider } from './contexts/AuthContext';
import AuthGuard from './components/admin/AuthGuard';
import AdminLayout from './components/admin/AdminLayout';
import AdminLogin from './pages/admin/AdminLogin';
import Dashboard from './pages/admin/Dashboard';
import HeroSlider from './pages/admin/website/home/HeroSlider';
import AboutSection from './pages/admin/website/home/AboutSection';
import { useLocation } from 'react-router-dom';

const AdminPlaceholder = () => {
  const location = useLocation();
  const pathName = location.pathname.split('/').pop().replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
  return (
    <div className="flex flex-col items-center justify-center h-full min-h-[500px] bg-white rounded-xl shadow-sm border border-gray-100 p-8 text-center animate-fade-in">
      <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mb-4">
        <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 002-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
        </svg>
      </div>
      <h2 className="text-2xl font-bold text-gray-900 mb-2">{pathName}</h2>
      <p className="text-gray-500 max-w-md">This module is currently under development. The functionality will be available in an upcoming release.</p>
    </div>
  );
};

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          {/* Public Website Routes */}
          <Route path="/" element={<MainLayout />}>
            <Route index element={<Home />} />
            <Route path="about" element={<AboutPage />} />
            <Route path="product" element={<ProductPage />} />
            <Route path="product/:slug" element={<ProductDetailPage />} />
            <Route path="blog" element={<BlogPage />} />
            <Route path="blog/:slug" element={<BlogDetailPage />} />
            <Route path="image" element={<ImageGalleryPage />} />
            <Route path="contact" element={<ContactPage />} />
            <Route path="*" element={<><SEO title="Page Not Found" /><div className="p-8 text-center"><h1 className="text-4xl font-bold mb-4">404 - Not Found</h1><p>The page you are looking for does not exist.</p></div></>} />
          </Route>

          {/* Admin Routes */}
          <Route path="/admin" element={<AdminLogin />} />
          
          <Route path="/admin/*" element={<AuthGuard />}>
            <Route element={<AdminLayout />}>
              <Route path="dashboard" element={<Dashboard />} />
              
              {/* Website Management */}
              <Route path="website/home/hero-slider" element={<HeroSlider />} />
              <Route path="website/home/about-section" element={<AboutSection />} />
              
              <Route path="*" element={<AdminPlaceholder />} />
            </Route>
          </Route>

        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
