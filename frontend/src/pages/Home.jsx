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
      <SEO title={settings?.seo_home_title || "ABC Export - Premium Food Export Company"}
        exactTitle={true}
        description={settings?.seo_home_description || "ABC Export is a leading global supplier of premium quality agricultural products, food ingredients, and raw materials. Discover our wide range of export items."}
        canonical={window.location.href}
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
