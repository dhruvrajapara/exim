export default function ContactMap() {
  return (
    <section className="py-12 md:py-16 bg-[#F9FAFB]">
      <div className="container-custom flex flex-col items-center">
        
        <div className="text-center max-w-2xl mx-auto mb-10">
          <h2 className="font-rubik text-[32px] md:text-[36px] font-bold text-dark mb-4">Our Location</h2>
          <p className="text-gray-600 text-[16px] md:text-[18px]">
            Locate our corporate office and connect with our export team for premium dehydrated food products.
          </p>
        </div>

        <div className="w-full max-w-5xl rounded-[24px] overflow-hidden shadow-lg border border-gray-200 mb-8 bg-white h-[400px] md:h-[500px]">
          {/* Default to Surat, Gujarat as requested */}
          <iframe 
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1m2!1s0x395e848aba5bd449%3A0x4fcedd11614f6516!2sSurat%2C%20Gujarat!5e0!3m2!1sen!2sin!4v1700000000000!5m2!1sen!2sin" 
            width="100%" 
            height="100%" 
            style={{ border: 0 }} 
            allowFullScreen="" 
            loading="lazy" 
            referrerPolicy="no-referrer-when-downgrade"
            title="BiteExport Office Location"
          ></iframe>
        </div>

        <a 
          href="https://maps.google.com/?q=Surat,Gujarat" 
          target="_blank" 
          rel="noreferrer"
          className="px-8 h-[48px] bg-white text-[#0B63CE] font-bold rounded-[12px] shadow-sm hover:shadow-md hover:bg-gray-50 border border-gray-200 flex items-center justify-center transition-all"
        >
          Open Google Maps
        </a>

      </div>
    </section>
  );
}
