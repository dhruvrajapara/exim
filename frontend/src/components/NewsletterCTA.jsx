import MarkEmailReadIcon from '@mui/icons-material/MarkEmailRead';

export default function NewsletterCTA() {
  return (
    <section className="py-16 md:py-20 relative overflow-hidden bg-dark">
      {/* Background Decor */}
      <div className="absolute inset-0 opacity-10 pointer-events-none"
           style={{ backgroundImage: 'radial-gradient(#fff 1px, transparent 1px)', backgroundSize: '30px 30px' }}>
      </div>
      <div className="absolute top-0 right-0 w-1/2 h-full bg-gradient-to-l from-primary/20 to-transparent blur-3xl pointer-events-none"></div>

      <div className="container-custom relative z-10">
        <div className="max-w-3xl mx-auto text-center bg-white/5 backdrop-blur-md border border-white/10 p-8 md:p-12 rounded-[24px]">
          <div className="w-[64px] h-[64px] bg-primary/20 rounded-full flex items-center justify-center mx-auto mb-6 text-primary border border-primary/30">
            <MarkEmailReadIcon fontSize="large" />
          </div>
          
          <h2 className="font-rubik text-[32px] md:text-[40px] font-bold text-white mb-4">
            Subscribe to Market Insights
          </h2>
          <p className="text-gray-300 text-[16px] md:text-[18px] mb-8">
            Get the latest updates on global agricultural export trends, pricing, and industry news directly in your inbox. No spam, ever.
          </p>

          <form className="flex flex-col sm:flex-row gap-3 max-w-xl mx-auto" onSubmit={(e) => e.preventDefault()}>
            <input 
              type="email" 
              placeholder="Enter your email address" 
              required
              className="flex-grow h-[54px] px-6 rounded-[14px] bg-white text-dark placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary border-none text-[16px]"
            />
            <button 
              type="submit" 
              className="h-[54px] px-8 rounded-[14px] bg-primary text-white font-medium hover:bg-green-600 transition-colors duration-300 text-[16px] shadow-lg shadow-primary/20 whitespace-nowrap"
            >
              Subscribe Now
            </button>
          </form>
        </div>
      </div>
    </section>
  );
}
