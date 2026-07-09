import { Link, useLocation } from 'react-router-dom';

export default function Breadcrumbs() {
  const location = useLocation();
  const pathnames = location.pathname.split('/').filter(x => x);

  const schema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": [
      {
        "@type": "ListItem",
        "position": 1,
        "name": "Home",
        "item": "https://example.com/"
      },
      ...pathnames.map((value, index) => ({
        "@type": "ListItem",
        "position": index + 2,
        "name": value.charAt(0).toUpperCase() + value.slice(1),
        "item": `https://example.com/${pathnames.slice(0, index + 1).join('/')}`
      }))
    ]
  };

  return (
    <nav aria-label="breadcrumb" className="mb-4 text-sm text-slate-500">
      <script type="application/ld+json">
        {JSON.stringify(schema)}
      </script>
      <ol className="flex space-x-2">
        <li>
          <Link to="/" className="hover:text-blue-600 transition-colors">Home</Link>
        </li>
        {pathnames.map((value, index) => {
          const to = `/${pathnames.slice(0, index + 1).join('/')}`;
          const isLast = index === pathnames.length - 1;
          return (
            <li key={to} className="flex space-x-2">
              <span>/</span>
              {isLast ? (
                <span className="text-slate-800 font-medium" aria-current="page">
                  {value.charAt(0).toUpperCase() + value.slice(1)}
                </span>
              ) : (
                <Link to={to} className="hover:text-blue-600 transition-colors">
                  {value.charAt(0).toUpperCase() + value.slice(1)}
                </Link>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
