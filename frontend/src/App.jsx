import { BrowserRouter, Routes, Route } from 'react-router-dom';
import MainLayout from './components/MainLayout';
import Home from './pages/Home';
import AboutPage from './pages/AboutPage';
import ProductPage from './pages/ProductPage';
import ProductDetailPage from './pages/ProductDetailPage';
import BlogPage from './pages/BlogPage';
import BlogDetailPage from './pages/BlogDetailPage';
import FloatingActionButtons from './components/FloatingActionButtons';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<MainLayout />}>
          <Route index element={<Home />} />
          <Route path="about" element={<AboutPage />} />
          <Route path="product" element={<ProductPage />} />
          <Route path="product/:slug" element={<ProductDetailPage />} />
          <Route path="blog" element={<BlogPage />} />
          <Route path="blog/:slug" element={<BlogDetailPage />} />
          <Route path="*" element={<div className="p-8 text-center"><h1 className="text-4xl font-bold mb-4">404 - Not Found</h1><p>The page you are looking for does not exist.</p></div>} />
        </Route>
      </Routes>
      <FloatingActionButtons />
    </BrowserRouter>
  );
}

export default App;
