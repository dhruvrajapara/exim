import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import MainLayout from './components/MainLayout';
import React, { Suspense, lazy } from 'react';
import SEO from './components/SEO';
import { AuthProvider } from './contexts/AuthContext';
import AuthGuard from './components/admin/AuthGuard';
import AdminLayout from './components/admin/AdminLayout';
import ScrollToTop from './components/ScrollToTop';

// Lazy load Public Components
const Home = lazy(() => import('./pages/Home'));
const AboutPage = lazy(() => import('./pages/AboutPage'));
const ProductPage = lazy(() => import('./pages/ProductPage'));
const ProductDetailPage = lazy(() => import('./pages/ProductDetailPage'));
const BlogPage = lazy(() => import('./pages/BlogPage'));
const BlogDetailPage = lazy(() => import('./pages/BlogDetailPage'));
const ImageGalleryPage = lazy(() => import('./pages/ImageGalleryPage'));
const ContactPage = lazy(() => import('./pages/ContactPage'));
const PrivacyPolicy = lazy(() => import('./pages/PrivacyPolicy'));
const TermsConditions = lazy(() => import('./pages/TermsConditions'));
const Disclaimer = lazy(() => import('./pages/Disclaimer'));

// Lazy load Admin Components
const AdminLogin = lazy(() => import('./pages/admin/AdminLogin'));
const Dashboard = lazy(() => import('./pages/admin/Dashboard'));
const HeroSlider = lazy(() => import('./pages/admin/website/home/HeroSlider'));
const AboutSection = lazy(() => import('./pages/admin/website/home/AboutSection'));
const ProductCategoriesSection = lazy(() => import('./pages/admin/website/home/ProductCategoriesSection'));
const FeaturedProductsSection = lazy(() => import('./pages/admin/website/home/FeaturedProductsSection'));
const HomepageLayout = lazy(() => import('./pages/admin/website/home/HomepageLayout'));
const Certifications = lazy(() => import('./pages/admin/website/home/Certifications'));
const TestimonialsAdmin = lazy(() => import('./pages/admin/website/home/TestimonialsAdmin'));
const BlogCategoryAdmin = lazy(() => import('./pages/admin/website/blog/BlogCategoryAdmin'));
const BlogPostsAdmin = lazy(() => import('./pages/admin/website/blog/BlogPostsAdmin'));
const BlogPostForm = lazy(() => import('./pages/admin/website/blog/BlogPostForm'));
const TeamMembers = lazy(() => import('./pages/admin/website/about/TeamMembers'));
const VisionMissionAdmin = lazy(() => import('./pages/admin/website/about/VisionMissionAdmin'));
const WhyChooseUsAdmin = lazy(() => import('./pages/admin/website/about/WhyChooseUsAdmin'));
const AboutPageLayout = lazy(() => import('./pages/admin/website/about/AboutPageLayout'));

const ProductCategories = lazy(() => import('./pages/admin/website/products/ProductCategories'));
const Products = lazy(() => import('./pages/admin/website/products/Products'));
const ProductForm = lazy(() => import('./pages/admin/website/products/ProductForm'));
const ProductPageHeroSection = lazy(() => import('./pages/admin/website/products/ProductPageHeroSection'));
const WebsiteAppearance = lazy(() => import('./pages/admin/settings/WebsiteAppearance'));
const WebsiteSetting = lazy(() => import('./pages/admin/settings/WebsiteSetting'));
const ExportCountries = lazy(() => import('./pages/admin/website/ExportCountries'));
const Integrations = lazy(() => import('./pages/admin/settings/Integrations'));
const ImageGalleryAdmin = lazy(() => import('./pages/admin/website/gallery/ImageGalleryAdmin'));
const GalleryPageHeroSection = lazy(() => import('./pages/admin/website/gallery/GalleryPageHeroSection'));
const BlogPageHeroSection = lazy(() => import('./pages/admin/website/blog/BlogPageHeroSection'));
const ContactPageHeroSection = lazy(() => import('./pages/admin/website/contact/ContactPageHeroSection'));
const InquiriesList = lazy(() => import('./pages/admin/inquiries/InquiriesList'));
const Subscribers = lazy(() => import('./pages/admin/Subscribers'));
const SendCampaignPage = lazy(() => import('./pages/admin/subscribers/SendCampaign'));
const Profile = lazy(() => import('./pages/admin/Profile'));
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
        <ScrollToTop />
        <Suspense fallback={<div className="flex items-center justify-center h-screen bg-gray-50"><div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin"></div></div>}>
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
            <Route path="gallery" element={<ImageGalleryPage />} />
            <Route path="contact" element={<ContactPage />} />
            <Route path="privacy-policy" element={<PrivacyPolicy />} />
            <Route path="terms-conditions" element={<TermsConditions />} />
            <Route path="disclaimer" element={<Disclaimer />} />
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
              <Route path="website/home/product-categories-section" element={<ProductCategoriesSection />} />
              <Route path="website/home/featured-products-section" element={<FeaturedProductsSection />} />
              <Route path="website/home/layout" element={<HomepageLayout />} />
              
              <Route path="certifications" element={<Certifications />} />
              <Route path="testimonials" element={<TestimonialsAdmin />} />
              <Route path="website/about/team-members" element={<TeamMembers />} />
              <Route path="website/about/vision-mission" element={<VisionMissionAdmin />} />
              <Route path="website/about/why-choose-us" element={<WhyChooseUsAdmin />} />
              <Route path="website/about/layout" element={<AboutPageLayout />} />
              
              
              <Route path="website/contact/hero-section" element={<ContactPageHeroSection />} />
              
              <Route path="website/products/hero-section" element={<ProductPageHeroSection />} />
              <Route path="website/products/categories" element={<ProductCategories />} />
              <Route path="website/products/list" element={<Products />} />
              <Route path="website/products/add" element={<ProductForm />} />
              <Route path="website/products/edit/:id" element={<ProductForm />} />
              
              <Route path="website/gallery/images" element={<ImageGalleryAdmin />} />
              <Route path="website/gallery/hero-section" element={<GalleryPageHeroSection />} />
              <Route path="website/blog/hero-section" element={<BlogPageHeroSection />} />
              <Route path="website/blog/categories" element={<BlogCategoryAdmin />} />
              <Route path="website/blog/posts" element={<BlogPostsAdmin />} />
              <Route path="website/blog/posts/create" element={<BlogPostForm />} />
              <Route path="website/blog/posts/edit/:id" element={<BlogPostForm />} />
              
              <Route path="inquiries" element={<InquiriesList />} />
              <Route path="subscribers" element={<Subscribers />} />
              <Route path="subscribers/send-campaign" element={<SendCampaignPage />} />
              
              <Route path="profile" element={<Profile />} />
              
              <Route path="settings/appearance" element={<WebsiteAppearance />} />
              <Route path="settings/website" element={<WebsiteSetting />} />
              <Route path="settings/export-countries" element={<ExportCountries />} />
              <Route path="settings/integrations" element={<Integrations />} />
              
              <Route path="*" element={<AdminPlaceholder />} />
            </Route>
          </Route>

        </Routes>
        </Suspense>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
