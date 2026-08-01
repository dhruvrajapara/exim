import { useSettings } from '../contexts/SettingsContext';
import SEO from '../components/SEO';
import Hero from '../components/Hero';
import About from '../components/About';
import FeaturedProducts from '../components/FeaturedProducts';
import ProductCategories from '../components/ProductCategories';
import Certifications from '../components/Certifications';
import Testimonials from '../components/Testimonials';
import LatestBlogs from '../components/LatestBlogs';
import ExportMap from '../components/ExportMap';

export default function Home() {
  const { settings } = useSettings();

  const schema = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "name": "Enterprise AI Platform",
    "url": "https://example.com"
  };

  const componentsMap = {
    Hero,
    About,
    ProductCategories,
    FeaturedProducts,
    Certifications,
    Testimonials,
    LatestBlogs,
    ExportMap,
  };

  const defaultOrder = ['Hero', 'About', 'ProductCategories', 'ExportMap', 'FeaturedProducts', 'Certifications', 'Testimonials', 'LatestBlogs'];
  let order = defaultOrder;

  if (settings?.homepage_section_order) {
    try {
      const parsedOrder = JSON.parse(settings.homepage_section_order);
      if (Array.isArray(parsedOrder) && parsedOrder.length > 0) {
        // Keep the saved order but append any new default components that are missing
        const missingComponents = defaultOrder.filter(item => !parsedOrder.includes(item));
        order = [...parsedOrder, ...missingComponents];
      }
    } catch (e) {
      console.error('Failed to parse homepage_section_order', e);
    }
  }

  return (
    <>
      <SEO title={settings?.seo_home_title || "Export Import Company"}
        exactTitle={true}
        description="Welcome to the AI-First Enterprise Platform built with React and Laravel."
        canonical="https://example.com/"
        schema={schema}
      />

      {/* Dynamic Homepage Sections */}
      {order.map(sectionId => {
        const Component = componentsMap[sectionId];
        return Component ? <Component key={sectionId} /> : null;
      })}
    </>
  );
}
