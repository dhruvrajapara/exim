import SEO from '../components/SEO';
import ProductListing from '../components/ProductListing';

export default function ProductPage() {
  const schema = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    "name": "Premium Export Products - BiteExport",
    "url": "https://example.com/product",
    "description": "BiteExport provides premium dehydrated vegetables, spices, and agricultural products with international export quality standards."
  };

  return (
    <div className="w-full bg-white min-h-screen">
      <SEO
        title="Products"
        description="BiteExport provides premium dehydrated vegetables, spices, and agricultural products with international export quality standards."
        canonical="https://example.com/product"
        schema={schema}
      />

      <ProductListing />

    </div>
  );
}
