import { Helmet } from 'react-helmet-async';
import SEO from '../components/SEO';
import ContactHero from '../components/contact/ContactHero';
import ContactSection from '../components/contact/ContactSection';
import ContactMap from '../components/contact/ContactMap';
import ContactFAQ from '../components/contact/ContactFAQ';
import ContactCTA from '../components/contact/ContactCTA';

export default function ContactPage() {
  
  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": [
      { "@type": "ListItem", "position": 1, "name": "Home", "item": "https://example.com/" },
      { "@type": "ListItem", "position": 2, "name": "Contact Us", "item": "https://example.com/contact" }
    ]
  };

  const localBusinessSchema = {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    "name": "BiteExport",
    "image": "https://example.com/logo.png",
    "url": "https://example.com",
    "telephone": "+919876543210",
    "email": "info@biteexport.com",
    "address": {
      "@type": "PostalAddress",
      "streetAddress": "Corporate Office",
      "addressLocality": "Surat",
      "addressRegion": "Gujarat",
      "addressCountry": "IN"
    },
    "openingHoursSpecification": {
      "@type": "OpeningHoursSpecification",
      "dayOfWeek": [
        "Monday",
        "Tuesday",
        "Wednesday",
        "Thursday",
        "Friday",
        "Saturday"
      ],
      "opens": "09:00",
      "closes": "18:00"
    }
  };

  return (
    <div className="w-full bg-[#F9FAFB] min-h-screen">
      <SEO 
        title="Contact Us"
        description="Get in touch with BiteExport for premium dehydrated vegetables and spices. Request quotations and explore international trade opportunities."
        canonical="https://example.com/contact"
      />

      <Helmet>
        <script type="application/ld+json">
          {JSON.stringify(breadcrumbSchema)}
        </script>
        <script type="application/ld+json">
          {JSON.stringify(localBusinessSchema)}
        </script>
      </Helmet>

      {/* 1. Hero Banner */}
      <ContactHero />

      {/* 2. Contact Information & Form (40/60 Split) */}
      <ContactSection />

      {/* 3. Embedded Google Map */}
      <ContactMap />

      {/* 4. Frequently Asked Questions */}
      <ContactFAQ />

      {/* 5. Call To Action */}
      <ContactCTA />

    </div>
  );
}
