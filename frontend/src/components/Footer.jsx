import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { fetchFooter } from '../services/api';

import { useSettings } from '../contexts/SettingsContext';

// MUI Icons
import FacebookIcon from '@mui/icons-material/Facebook';
import InstagramIcon from '@mui/icons-material/Instagram';
import LinkedInIcon from '@mui/icons-material/LinkedIn';
import YouTubeIcon from '@mui/icons-material/YouTube';
import WhatsAppIcon from '@mui/icons-material/WhatsApp';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import CallIcon from '@mui/icons-material/Call';
import EmailIcon from '@mui/icons-material/Email';
import PublicIcon from '@mui/icons-material/Public'; // Fallback icon

const getSocialIcon = (platform) => {
  switch (platform?.toLowerCase()) {
    case 'facebook': return <FacebookIcon fontSize="small" />;
    case 'instagram': return <InstagramIcon fontSize="small" />;
    case 'linkedin': return <LinkedInIcon fontSize="small" />;
    case 'youtube': return <YouTubeIcon fontSize="small" />;
    case 'whatsapp': return <WhatsAppIcon fontSize="small" />;
    default: return <PublicIcon fontSize="small" />;
  }
};

export default function Footer() {
  const [data, setData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const { settings } = useSettings();

  useEffect(() => {
    const loadData = async () => {
      const result = await fetchFooter();
      setData(result);
      setIsLoading(false);
    };
    loadData();
  }, []);

  if (isLoading) {
    return (
      <footer className="w-full bg-[var(--color-footer-bg,#000821)] py-[40px] md:py-[50px] animate-pulse">
        <div className="container-custom">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-8">
             {[1,2,3,4].map(i => (
               <div key={i} className="flex flex-col gap-4">
                  <div className="w-32 h-6 bg-gray-800 rounded"></div>
                  <div className="w-full h-4 bg-gray-800 rounded"></div>
                  <div className="w-3/4 h-4 bg-gray-800 rounded"></div>
               </div>
             ))}
          </div>
        </div>
      </footer>
    );
  }

  if (!data || !data.footer) return null;

  const { footer, categories } = data;
  
  // Merge settings from global WebsiteSettings (which are updated in admin)
  const displayLogo = settings?.footer_logo_url || footer.company_logo;
  const displayAddresses = (settings?.contact_office_addresses && settings.contact_office_addresses.length > 0) ? settings.contact_office_addresses : footer.office_addresses;
  
  const settingsPhones = settings?.contact_phones || [];
  const displayPhones = [...settingsPhones, settings?.contact_whatsapp].filter(Boolean);
  
  const displayEmails = (settings?.contact_emails && settings.contact_emails.length > 0) ? settings.contact_emails : footer.email_addresses;
  
  const finalPhones = displayPhones.length > 0 ? displayPhones : footer.contact_numbers;
  const finalEmails = displayEmails.length > 0 ? displayEmails : footer.email_addresses;
  
  const displayDescription = settings?.footer_description || footer.company_description;
  const displayCopyright = settings?.footer_copyright_text || footer.copyright_text;
  
  const displayQuickLinks = (settings?.footer_quick_links && settings.footer_quick_links.length > 0) ? settings.footer_quick_links : footer.quick_links;
  
  // For product links, if defined in settings, use them. Otherwise fallback to database categories.
  let displayProductLinks = [];
  if (settings?.footer_product_links && settings.footer_product_links.length > 0) {
    displayProductLinks = settings.footer_product_links.map((p, i) => ({ id: `custom-${i}`, name: p.label, url: p.url }));
  } else if (categories) {
    displayProductLinks = categories.map(cat => ({ id: cat.id, name: cat.name, url: `/product?category=${cat.slug}` }));
  }

  // Build social links from settings if available, else fallback to footer
  let displaySocials = [];
  let usedSettingsForSocials = false;
  if (settings && Object.keys(settings).length > 0) {
    usedSettingsForSocials = true;
    ['facebook', 'instagram', 'linkedin', 'youtube', 'twitter'].forEach(platform => {
      const url = settings[`social_${platform}`];
      if (url && url !== 'null' && url.trim() !== '') {
        displaySocials.push({ platform, url });
      }
    });

    if (settings.contact_whatsapp && settings.contact_whatsapp !== 'null') {
      const waNumber = settings.contact_whatsapp.replace(/[^0-9]/g, '');
      displaySocials.push({ platform: 'whatsapp', url: `https://wa.me/${waNumber}` });
    }
  }
  
  if (!usedSettingsForSocials && footer.social_links) {
    displaySocials = footer.social_links;
  }

  return (
    <footer className="w-full bg-[var(--color-footer-bg,#000821)] text-gray-300 pt-[40px] lg:pt-[50px] pb-[25px] lg:pb-[30px] border-t border-white/5">
      <div className="container-custom">
        {/* Top 4-Column Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12 text-left mb-12">
          
          {/* Column 1: Logo & About */}
          <div className="flex flex-col items-start">
            <div className="mb-6">
              <img 
                src={displayLogo} 
                alt="Company Logo" 
                style={{ height: settings?.logo_height ? `${settings.logo_height}px` : '48px', width: 'auto' }}
                className="object-contain brightness-0 invert" 
                loading="lazy"
              />
            </div>
            <p className="text-[14px] leading-relaxed text-gray-400 mb-6 max-w-sm">
              {displayDescription}
            </p>
            {/* Social Links */}
            <div className="flex gap-3 justify-start">
              {displaySocials?.map((social, index) => (
                <a 
                  key={index}
                  href={social.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-10 h-10 rounded-full border border-gray-700 flex items-center justify-center text-gray-400 hover:bg-primary hover:border-primary hover:text-white hover:scale-110 transition-all duration-300"
                  aria-label={`Visit our ${social.platform}`}
                >
                  {getSocialIcon(social.platform)}
                </a>
              ))}
            </div>
          </div>

          {/* Column 2: Quick Links */}
          <div className="flex flex-col items-start">
            <h3 className="text-white font-rubik font-semibold text-[18px] mb-6">Quick Links</h3>
            <ul className="flex flex-col gap-3">
              {displayQuickLinks?.map((link, index) => (
                <li key={index}>
                  <Link 
                    to={link.url}
                    className="text-[14px] text-gray-400 hover:text-primary transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 3: Product Categories */}
          <div className="flex flex-col items-start">
            <h3 className="text-white font-rubik font-semibold text-[18px] mb-6">Products</h3>
            <ul className="flex flex-col gap-3">
              {displayProductLinks?.map((item) => (
                <li key={item.id}>
                  <Link 
                    to={item.url}
                    className="text-[14px] text-gray-400 hover:text-primary transition-colors"
                  >
                    {item.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 4: Contact Information */}
          <div className="flex flex-col items-start">
            <h3 className="text-white font-rubik font-semibold text-[18px] mb-6">Contact Us</h3>
            <div className="flex flex-col gap-4 w-full max-w-[280px]">
              
              {/* Addresses */}
              {displayAddresses?.map((address, index) => (
                <div key={`addr-${index}`} className="flex items-start gap-3">
                  <LocationOnIcon fontSize="small" className="text-primary mt-1 shrink-0" />
                  <span className="text-[14px] text-gray-400 leading-relaxed text-left">{address}</span>
                </div>
              ))}

              {/* Phones */}
              {finalPhones?.map((phone, index) => (
                <div key={`phone-${index}`} className="flex items-center gap-3">
                  <CallIcon fontSize="small" className="text-primary shrink-0" />
                  <a href={`tel:${phone.replace(/[^0-9+]/g, '')}`} className="text-[14px] text-gray-400 hover:text-primary transition-colors">
                    {phone}
                  </a>
                </div>
              ))}

              {/* Emails */}
              {finalEmails?.map((email, index) => (
                <div key={`email-${index}`} className="flex items-center gap-3">
                  <EmailIcon fontSize="small" className="text-primary shrink-0" />
                  <a href={`mailto:${email}`} className="text-[14px] text-gray-400 hover:text-primary transition-colors">
                    {email}
                  </a>
                </div>
              ))}

            </div>
          </div>

        </div>

        <div className="pt-6 border-t border-white/10 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <p className="text-[13px] text-gray-500">
            {displayCopyright}
          </p>
          <div className="flex gap-4 md:gap-6 flex-wrap justify-start">
            {footer.bottom_links?.map((link, index) => (
              <Link 
                key={index}
                to={link.url}
                className="text-[13px] text-gray-500 hover:text-primary transition-colors"
              >
                {link.label}
              </Link>
            ))}
          </div>
        </div>

      </div>
    </footer>
  );
}
