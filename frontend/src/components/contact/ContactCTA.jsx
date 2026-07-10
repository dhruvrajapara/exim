import { Link } from 'react-router-dom';

export default function ContactCTA() {
  return (
    <section className="py-12 md:py-16 bg-white">
      <div className="container-custom">
        <div className="bg-gradient-to-r from-[#00143A] to-[#0B63CE] rounded-[24px] p-10 md:p-16 text-center relative overflow-hidden shadow-2xl">
          
          {/* Subtle Background Elements */}
          <div className="absolute top-0 right-0 -mr-20 -mt-20 w-64 h-64 rounded-full bg-white opacity-5 blur-3xl pointer-events-none"></div>
          <div className="absolute bottom-0 left-0 -ml-20 -mb-20 w-64 h-64 rounded-full bg-[#00FF55] opacity-10 blur-3xl pointer-events-none"></div>

          <div className="relative z-10 max-w-2xl mx-auto">
            <h2 className="font-rubik text-[32px] md:text-[48px] font-bold text-white mb-4 leading-tight">
              Ready to Start Your Import Journey?
            </h2>
            <p className="text-gray-300 text-[16px] md:text-[20px] mb-10 leading-relaxed">
              Partner with BiteExport for premium dehydrated food products and reliable export services worldwide.
            </p>
            
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <button 
                onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
                className="w-full sm:w-auto px-8 h-[54px] bg-white text-[#0B63CE] font-bold text-[16px] rounded-[12px] shadow-lg hover:shadow-xl hover:bg-gray-50 hover:-translate-y-1 transition-all duration-300 flex items-center justify-center"
              >
                Request a Quote
              </button>
              <Link 
                to="/product"
                className="w-full sm:w-auto px-8 h-[54px] bg-white/10 text-white font-bold text-[16px] rounded-[12px] border border-white/20 hover:bg-white/20 hover:-translate-y-1 transition-all duration-300 flex items-center justify-center"
              >
                View Products
              </Link>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
