import SEO from '../components/SEO';
import Hero from '../components/Hero';
import About from '../components/About';
import FeaturedProducts from '../components/FeaturedProducts';
import ProductCategories from '../components/ProductCategories';
import Certifications from '../components/Certifications';
import Testimonials from '../components/Testimonials';
import LatestBlogs from '../components/LatestBlogs';

export default function Home() {
  const schema = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "name": "Enterprise AI Platform",
    "url": "https://example.com"
  };

  return (
    <>
      <SEO 
        title="Home" 
        description="Welcome to the AI-First Enterprise Platform built with React and Laravel."
        canonical="https://example.com/"
        schema={schema}
      />
      
      {/* Full-Screen Hero */}
      <Hero />
      
      {/* Dynamic About Section */}
      <About />
      
      {/* Dynamic Product Categories */}
      <ProductCategories />
      
      {/* Dynamic Featured Products */}
      <FeaturedProducts />
      
      {/* Dynamic Certifications */}
      <Certifications />
      
      {/* Client Testimonials Slider */}
      <Testimonials />
      
      {/* Dynamic Latest Blogs */}
      <LatestBlogs />
      
    </>
  );
}
