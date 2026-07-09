import SEO from '../components/SEO';
import Hero from '../components/Hero';

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
      
      {/* Full Width Hero Component (Breaks out of container padding using negative margins if needed, but in our Layout we put RouterOutlet inside a container. We need Hero outside the container, or remove container from Layout and put it in pages.) */}
      <Hero />
      
      <div className="container-custom py-12 space-y-12 mt-12">
        <section className="grid md:grid-cols-3 gap-8">
          {[
            { title: 'Performance', desc: 'Core Web Vitals 90+ guaranteed with lazy loading and optimized assets.' },
            { title: 'SEO / AEO', desc: 'Dynamic meta, Schema.org JSON-LD, and AI Search optimizations.' },
            { title: 'Security', desc: 'Enterprise-grade protection, CSRF, and strict rate limiting via Laravel.' }
          ].map((feature, i) => (
            <div key={i} className="p-6 bg-white rounded-[16px] shadow-sm border border-border hover:shadow-md hover:border-primary transition-all duration-300 transform hover:-translate-y-1">
              <h3 className="text-xl font-bold text-dark mb-2">{feature.title}</h3>
              <p className="text-text">{feature.desc}</p>
            </div>
          ))}
        </section>
      </div>
    </>
  );
}
