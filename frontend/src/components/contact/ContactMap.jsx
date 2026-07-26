import { useSettings } from '../../contexts/SettingsContext';

export default function ContactMap() {
  const { settings } = useSettings();
  
  // Default map URL
  let mapUrl = "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1m2!1s0x395e848aba5bd449%3A0x4fcedd11614f6516!2sSurat%2C%20Gujarat!5e0!3m2!1sen!2sin!4v1700000000000!5m2!1sen!2sin";
  
  // Clean up user input (in case they pasted the whole iframe)
  if (settings?.contact_google_map_url) {
    if (settings.contact_google_map_url.includes('<iframe')) {
      const match = settings.contact_google_map_url.match(/src="([^"]+)"/);
      if (match && match[1]) {
        mapUrl = match[1];
      }
    } else {
      let rawUrl = settings.contact_google_map_url;
      if (rawUrl.startsWith('embed?')) {
        rawUrl = 'https://www.google.com/maps/' + rawUrl;
      } else if (!rawUrl.startsWith('http')) {
        rawUrl = 'https://' + rawUrl;
      }
      mapUrl = rawUrl;
    }
  }

  return (
    <section className="py-12 md:py-16 bg-[#F9FAFB]">
      <div className="container-custom flex flex-col items-center">
        
        <div className="text-center max-w-2xl mx-auto mb-10">
          <h2 className="font-rubik text-[32px] md:text-[36px] font-bold text-dark mb-4">Our Location</h2>
          <p className="text-gray-600 text-[16px] md:text-[18px]">
            Locate our corporate office and connect with our export team for premium dehydrated food products.
          </p>
        </div>

        <div 
          className="w-full rounded-[24px] overflow-hidden shadow-lg border border-gray-200 mb-8 bg-white"
          style={{
            maxWidth: settings?.contact_map_width || '100%',
            height: settings?.contact_map_height || '400px'
          }}
        >
          <iframe 
            src={mapUrl}
            width="100%" 
            height="100%" 
            style={{ border: 0 }} 
            allowFullScreen="" 
            loading="lazy" 
            referrerPolicy="no-referrer-when-downgrade"
            title="Office Location"
          ></iframe>
        </div>

      </div>
    </section>
  );
}
