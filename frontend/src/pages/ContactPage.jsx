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
      { "@type": "ListItem", "position": 1, "name": "Home", "item": "https://biteexport.com/" },
      { "@type": "ListItem", "position": 2, "name": "Contact Us", "item": "https://biteexport.com/contact" }
    ]
  };

  const localBusinessSchema = {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    "name": "BiteExport",
    "image": "https://biteexport.com/storage/branding/370d8eb2-5d71-46bb-a509-309ee27ebec0.png",
    "url": "https://biteexport.com",
    "telephone": "+919274721033",
    "email": "info@biteexport.com",
    "address": {
      "@type": "PostalAddress",
      "streetAddress": "480, AR Mall, Mota Varachha",
      "addressLocality": "Surat",
      "addressRegion": "Gujarat",
      "postalCode": "394101",
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
        description="Get in touch with BiteExport, merchant exporter and global sourcing partner from India. Request quotations for dehydrated onion, garlic, and spices."
        canonical="https://biteexport.com/contact"
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
