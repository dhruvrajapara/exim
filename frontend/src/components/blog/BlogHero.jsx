export default function BlogHero() {
  return (
    <div className="relative h-[240px] md:h-[300px] w-full bg-gradient-to-r from-[#f0f7ff] to-[#e6f2ff] overflow-hidden flex items-center justify-center">
      {/* Abstract World Map SVG Pattern */}
      <div 
        className="absolute inset-0 opacity-[0.03] pointer-events-none"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='1200' height='600' viewBox='0 0 1200 600' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M... (simplified map data)' fill='%23000' fill-rule='evenodd'/%3E%3C/svg%3E")`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat'
        }}
      />
      
      {/* Decorative Elements */}
      <div className="absolute top-[-50px] left-[-50px] w-[200px] h-[200px] bg-primary/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-[-50px] right-[-50px] w-[250px] h-[250px] bg-[#3599FF]/10 rounded-full blur-3xl pointer-events-none" />

      {/* Content */}
      <div className="relative z-10 text-center px-6">
        <span className="inline-block px-4 py-1.5 rounded-full bg-white/60 text-primary font-semibold text-[13px] tracking-widest uppercase mb-4 shadow-sm border border-white">
          Insights & Updates
        </span>
        <h1 className="font-rubik text-[36px] md:text-[48px] lg:text-[56px] font-bold text-dark leading-tight mb-4">
          BiteExport <span className="text-primary">Blog</span>
        </h1>
        <p className="text-gray-600 text-[15px] md:text-[18px] max-w-2xl mx-auto">
          Expert insights, market trends, and comprehensive guides for the global agricultural export industry.
        </p>
      </div>
    </div>
  );
}
