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

  const organizationSchema = {
    "@context": "https://schema.org",
    "@type": "Organization",
    "name": "BiteExport",
    "legalName": "BiteExport",
    "url": "https://biteexport.com",
    "logo": "https://biteexport.com/storage/branding/370d8eb2-5d71-46bb-a509-309ee27ebec0.png",
    "email": "info@biteexport.com",
    "telephone": "+919274721033",
    "address": {
      "@type": "PostalAddress",
      "streetAddress": "480, AR Mall, Mota Varachha",
      "addressLocality": "Surat",
      "addressRegion": "Gujarat",
      "postalCode": "394101",
      "addressCountry": "IN"
    },
    "sameAs": [
      "https://facebook.com",
      "https://instagram.com",
      "https://linkedin.com"
    ]
  };

  const websiteSchema = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "name": "BiteExport",
    "url": "https://biteexport.com"
  };

  const combinedSchema = [organizationSchema, websiteSchema];

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
        const missingComponents = defaultOrder.filter(item => !parsedOrder.includes(item));
        order = [...parsedOrder, ...missingComponents];
      }
    } catch (e) {
      console.error('Failed to parse homepage_section_order', e);
    }
  }

  return (
    <>
      <SEO title={settings?.seo_home_title || "BiteExport - Merchant Exporter & Global Sourcing Partner"}
        exactTitle={true}
        description={settings?.seo_home_description || "BiteExport is a trusted merchant exporter and global sourcing partner from India specializing in dehydrated onion, garlic, spices, and agricultural ingredients."}
        canonical="https://biteexport.com/"
        schema={combinedSchema}
      />

      {/* Dynamic Homepage Sections */}
      {order.map(sectionId => {
        const Component = componentsMap[sectionId];
        return Component ? <Component key={sectionId} /> : null;
      })}
    </>
  );
}
