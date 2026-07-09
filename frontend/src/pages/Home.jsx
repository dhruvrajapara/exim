import SEO from '../components/SEO';
import Hero from '../components/Hero';
import ProductCategories from '../components/ProductCategories';

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
      
      {/* Dynamic Product Categories */}
      <ProductCategories />
      
    </>
  );
}
