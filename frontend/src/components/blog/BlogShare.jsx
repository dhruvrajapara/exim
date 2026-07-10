import LinkedInIcon from '@mui/icons-material/LinkedIn';
import FacebookIcon from '@mui/icons-material/Facebook';
import TwitterIcon from '@mui/icons-material/Twitter';
import WhatsAppIcon from '@mui/icons-material/WhatsApp';
import LinkIcon from '@mui/icons-material/Link';
import { useState } from 'react';

export default function BlogShare() {
  const [copied, setCopied] = useState(false);
  const currentUrl = typeof window !== 'undefined' ? window.location.href : '';

  const handleCopyLink = () => {
    navigator.clipboard.writeText(currentUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="bg-white rounded-[20px] p-6 border border-gray-200 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-4">
      <h3 className="font-rubik text-[18px] font-bold text-dark">Share this Article</h3>
      
      <div className="flex items-center gap-3">
        <a href={`https://www.linkedin.com/shareArticle?mini=true&url=${encodeURIComponent(currentUrl)}`} target="_blank" rel="noreferrer" className="w-[44px] h-[44px] rounded-full bg-[#EAF4FF] flex items-center justify-center text-[#0B63CE] hover:bg-[#0B63CE] hover:text-white transition-colors">
          <LinkedInIcon fontSize="small" />
        </a>
        <a href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(currentUrl)}`} target="_blank" rel="noreferrer" className="w-[44px] h-[44px] rounded-full bg-[#EAF4FF] flex items-center justify-center text-[#0B63CE] hover:bg-[#0B63CE] hover:text-white transition-colors">
          <FacebookIcon fontSize="small" />
        </a>
        <a href={`https://twitter.com/intent/tweet?url=${encodeURIComponent(currentUrl)}`} target="_blank" rel="noreferrer" className="w-[44px] h-[44px] rounded-full bg-[#EAF4FF] flex items-center justify-center text-[#0B63CE] hover:bg-[#0B63CE] hover:text-white transition-colors">
          <TwitterIcon fontSize="small" />
        </a>
        <a href={`https://api.whatsapp.com/send?text=${encodeURIComponent(currentUrl)}`} target="_blank" rel="noreferrer" className="w-[44px] h-[44px] rounded-full bg-[#EAF4FF] flex items-center justify-center text-[#0B63CE] hover:bg-[#0B63CE] hover:text-white transition-colors">
          <WhatsAppIcon fontSize="small" />
        </a>
        <button onClick={handleCopyLink} className="w-[44px] h-[44px] rounded-full bg-[#EAF4FF] flex items-center justify-center text-[#0B63CE] hover:bg-dark hover:text-white transition-colors relative" title="Copy Link">
          <LinkIcon fontSize="small" />
          {copied && (
            <span className="absolute -top-10 left-1/2 -translate-x-1/2 bg-dark text-white text-[12px] py-1 px-2 rounded whitespace-nowrap">
              Copied!
            </span>
          )}
        </button>
      </div>
    </div>
  );
}
