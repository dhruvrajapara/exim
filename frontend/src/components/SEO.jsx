import { Helmet } from 'react-helmet-async';

export default function SEO({
  title,
  description,
  canonical,
  type = 'website',
  image = '/icon.png',
  schema,
  exactTitle = false
}) {
  const siteTitle = 'BiteExport';
  const fullTitle = exactTitle ? title : (title ? `${title} | ${siteTitle}` : siteTitle);

  // Ensure image URL is absolute for social media crawlers (WhatsApp, Facebook, LinkedIn, Twitter)
  const getAbsoluteImageUrl = (img) => {
    if (!img) return 'https://biteexport.com/hero.png';
    if (img.startsWith('http://') || img.startsWith('https://')) return img;
    if (img.startsWith('/storage/')) return `https://biteexport.com${img}`;
    if (img.startsWith('/')) return `https://biteexport.com${img}`;
    return `https://biteexport.com/${img}`;
  };

  const absoluteImageUrl = getAbsoluteImageUrl(image);

  return (
    <Helmet>
      {/* Standard Metadata */}
      <title>{fullTitle}</title>
      <meta name="description" content={description || 'BiteExport - Merchant Exporter & Global Sourcing Partner'} />
      {canonical && <link rel="canonical" href={canonical} />}

      {/* Open Graph */}
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={description || 'BiteExport - Merchant Exporter & Global Sourcing Partner'} />
      <meta property="og:type" content={type} />
      <meta property="og:image" content={absoluteImageUrl} />
      <meta property="og:image:secure_url" content={absoluteImageUrl} />
      {canonical && <meta property="og:url" content={canonical} />}
      <meta property="og:site_name" content="BiteExport" />

      {/* Twitter Card */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={fullTitle} />
      <meta name="twitter:description" content={description || 'BiteExport - Merchant Exporter & Global Sourcing Partner'} />
      <meta name="twitter:image" content={absoluteImageUrl} />

      {/* JSON-LD Schema */}
      {schema && (
        <script type="application/ld+json">
          {JSON.stringify(schema)}
        </script>
      )}
    </Helmet>
  );
}
