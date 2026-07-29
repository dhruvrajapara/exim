import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import KeyboardArrowRightIcon from '@mui/icons-material/KeyboardArrowRight';

import SEO from '../components/SEO';
import ProductGallery from '../components/product/ProductGallery';
import ProductInfo from '../components/product/ProductInfo';
import ProductSpecifications from '../components/product/ProductSpecifications';
import ProductFeatures from '../components/product/ProductFeatures';
import ProductFAQ from '../components/product/ProductFAQ';
import RelatedProducts from '../components/product/RelatedProducts';
import { fetchProductBySlug } from '../services/api';

export default function ProductDetailPage() {
  const { slug } = useParams();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    const loadProduct = async () => {
      setLoading(true);
      setError(false);
      try {
        const data = await fetchProductBySlug(slug);
        if (data) {
          setProduct(data);
        } else {
          setError(true);
        }
      } catch (err) {
        setError(true);
      }
      setLoading(false);
      // Scroll to top on new product load
      window.scrollTo(0, 0);
    };

    loadProduct();
  }, [slug]);

  if (loading) {
    return (
      <div className="w-full min-h-screen pt-[120px] flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="w-full min-h-screen pt-[120px] flex flex-col items-center justify-center text-center px-6">
        <h1 className="text-4xl font-bold mb-4">Product Not Found</h1>
        <p className="mb-6 text-gray-500">The product you are looking for does not exist or has been removed.</p>
        <Link to="/product" className="btn-primary">Back to Products</Link>
      </div>
    );
  }

  // Generate Breadcrumb Schema
  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": [
      {
        "@type": "ListItem",
        "position": 1,
        "name": "Home",
        "item": "https://example.com/"
      },
      {
        "@type": "ListItem",
        "position": 2,
        "name": "Products",
        "item": "https://example.com/product"
      },
      {
        "@type": "ListItem",
        "position": 3,
        "name": product.name,
        "item": `https://example.com/product/${product.slug}`
      }
    ]
  };

  // Generate Product Schema
  const stripHtml = (html) => {
    if (!html) return '';
    return html.replace(/<[^>]*>?/gm, '').replace(/&nbsp;/g, ' ').trim();
  };

  const productSchema = {
    "@context": "https://schema.org",
    "@type": "Product",
    "name": product.name,
    "image": product.gallery && product.gallery.length > 0 ? product.gallery : (product.main_image ? [product.main_image] : ['https://example.com/default-product-image.jpg']),
    "description": stripHtml(product.short_description),
    "sku": product.slug,
    "brand": {
      "@type": "Brand",
      "name": "BiteExport"
    }
  };

  const cleanHtml = (html) => {
    if (!html) return '';
    // Replace non-breaking spaces with standard spaces to allow natural wrapping
    return html.replace(/&nbsp;/g, ' ');
  };

  let parsedFaqs = product.faqs;
  if (typeof product.faqs === 'string') {
    try {
      parsedFaqs = JSON.parse(product.faqs);
    } catch (e) {
      parsedFaqs = [];
    }
  }

  const faqSchema = parsedFaqs && Array.isArray(parsedFaqs) && parsedFaqs.length > 0 ? {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": parsedFaqs.map(faq => ({
      "@type": "Question",
      "name": faq.question,
      "acceptedAnswer": {
        "@type": "Answer",
        "text": faq.answer
      }
    }))
  } : null;

  return (
    <div className="w-full bg-white min-h-screen">
      <SEO
        title={product.name}
        description={stripHtml(product.short_description)}
        canonical={`https://example.com/product/${product.slug}`}
        image={product.seo_image || product.image_path || (product.gallery && product.gallery.length > 0 ? product.gallery[0] : '/icon.png')}
      />

      <Helmet>
        <script type="application/ld+json">
          {JSON.stringify(breadcrumbSchema)}
        </script>
        <script type="application/ld+json">
          {JSON.stringify(productSchema)}
        </script>
        {faqSchema && (
          <script type="application/ld+json">
            {JSON.stringify(faqSchema)}
          </script>
        )}
      </Helmet>

      <div className="container-custom">

        {/* Breadcrumb Navigation */}
        <nav aria-label="Breadcrumb" className="flex items-center text-[13px] md:text-[14px] font-medium text-gray-500 mb-8 md:mb-12 pt-5">
          <Link to="/" className="hover:text-primary transition-colors">Home</Link>
          <KeyboardArrowRightIcon fontSize="small" className="mx-1" />
          <Link to="/product" className="hover:text-primary transition-colors">Products</Link>
          <KeyboardArrowRightIcon fontSize="small" className="mx-1" />
          <span className="text-dark line-clamp-1">{product.name}</span>
        </nav>

        {/* Hero Product Section (Gallery + Info) */}
        <div className="flex flex-col lg:flex-row gap-10 lg:gap-16 mb-16 md:mb-20">
          {(product.main_image || (product.gallery && product.gallery.length > 0)) && (
            <div className="w-full lg:w-1/2 min-w-0">
              <ProductGallery images={product.gallery} mainImage={product.image_path || product.main_image} />
            </div>
          )}
          <div className={`w-full min-w-0 ${(product.main_image || (product.gallery && product.gallery.length > 0)) ? 'lg:w-1/2' : 'lg:max-w-4xl mx-auto'}`}>
            <ProductInfo product={product} />
          </div>
        </div>

        {/* Full Product Description (Rich Text) */}
        {product.full_description && (
          <div className="w-full mb-16 md:mb-24 bg-white rounded-[20px] p-6 md:p-10 lg:p-12 shadow-sm border border-gray-100">
            <div 
              className="prose prose-sm md:prose-base lg:prose-lg max-w-none prose-headings:text-dark prose-p:text-gray-600 prose-a:text-primary hover:prose-a:text-secondary prose-img:rounded-xl prose-h1:text-[24px] md:prose-h1:text-[32px] prose-h2:text-[20px] md:prose-h2:text-[28px] prose-h3:text-[18px] md:prose-h3:text-[22px]"
              dangerouslySetInnerHTML={{ __html: cleanHtml(product.full_description) }}
            />
          </div>
        )}

        {/* Specifications Table */}
        <ProductSpecifications specifications={product.specifications} />

        {/* Features Grid */}
        <ProductFeatures features={product.features} />

        {/* Product FAQ */}
        <ProductFAQ productName={product.name} faqs={parsedFaqs} />

        {/* Related Products Slider */}
        <RelatedProducts categorySlug={product.category_slug} />

      </div>
    </div>
  );
}
