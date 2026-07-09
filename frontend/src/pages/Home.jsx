import SEO from '../components/SEO';

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
      
      <div className="space-y-12">
        <section className="text-center py-20 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-3xl shadow-sm border border-slate-100">
          <h1 className="text-5xl font-extrabold text-slate-900 tracking-tight mb-6">
            AI-First <span className="text-blue-600">Enterprise</span> Platform
          </h1>
          <p className="text-xl text-slate-600 max-w-2xl mx-auto mb-8">
            High-performance, fully optimized React 19 architecture powered by a scalable Laravel REST API.
          </p>
          <button className="bg-blue-600 text-white px-8 py-3 rounded-full font-medium hover:bg-blue-700 transition-colors shadow-lg shadow-blue-200">
            Get Started
          </button>
        </section>

        <section className="grid md:grid-cols-3 gap-8">
          {[
            { title: 'Performance', desc: 'Core Web Vitals 90+ guaranteed with lazy loading and optimized assets.' },
            { title: 'SEO / AEO', desc: 'Dynamic meta, Schema.org JSON-LD, and AI Search optimizations.' },
            { title: 'Security', desc: 'Enterprise-grade protection, CSRF, and strict rate limiting via Laravel.' }
          ].map((feature, i) => (
            <div key={i} className="p-6 bg-white rounded-2xl shadow-sm border border-slate-100 hover:shadow-md transition-shadow">
              <h3 className="text-xl font-bold text-slate-800 mb-2">{feature.title}</h3>
              <p className="text-slate-600">{feature.desc}</p>
            </div>
          ))}
        </section>
      </div>
    </>
  );
}
