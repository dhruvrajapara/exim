import LinkedInIcon from '@mui/icons-material/LinkedIn';
import TwitterIcon from '@mui/icons-material/Twitter';
import WhatsAppIcon from '@mui/icons-material/WhatsApp';
import LinkIcon from '@mui/icons-material/Link';
import { useState } from 'react';

export default function BlogShare({ url, title }) {
  const [copied, setCopied] = useState(false);

  const handleCopyLink = () => {
    navigator.clipboard.writeText(url);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const encodedUrl = encodeURIComponent(url);
  const encodedTitle = encodeURIComponent(title);

  return (
    <div className="flex lg:flex-col gap-4">
      <h4 className="hidden lg:block font-rubik text-[16px] font-bold text-gray-400 uppercase tracking-widest mb-2">Share</h4>
      
      <a 
        href={`https://www.linkedin.com/shareArticle?mini=true&url=${encodedUrl}&title=${encodedTitle}`}
        target="_blank"
        rel="noopener noreferrer"
        className="w-[44px] h-[44px] rounded-full bg-gray-50 flex items-center justify-center text-gray-500 hover:bg-[#0A66C2] hover:text-white transition-all duration-300 shadow-sm"
        aria-label="Share on LinkedIn"
      >
        <LinkedInIcon fontSize="small" />
      </a>

      <a 
        href={`https://twitter.com/intent/tweet?url=${encodedUrl}&text=${encodedTitle}`}
        target="_blank"
        rel="noopener noreferrer"
        className="w-[44px] h-[44px] rounded-full bg-gray-50 flex items-center justify-center text-gray-500 hover:bg-[#1DA1F2] hover:text-white transition-all duration-300 shadow-sm"
        aria-label="Share on Twitter"
      >
        <TwitterIcon fontSize="small" />
      </a>

      <a 
        href={`https://api.whatsapp.com/send?text=${encodedTitle} - ${encodedUrl}`}
        target="_blank"
        rel="noopener noreferrer"
        className="w-[44px] h-[44px] rounded-full bg-gray-50 flex items-center justify-center text-gray-500 hover:bg-[#25D366] hover:text-white transition-all duration-300 shadow-sm"
        aria-label="Share on WhatsApp"
      >
        <WhatsAppIcon fontSize="small" />
      </a>

      <button 
        onClick={handleCopyLink}
        className={`w-[44px] h-[44px] rounded-full flex items-center justify-center transition-all duration-300 shadow-sm relative ${copied ? 'bg-primary text-white' : 'bg-gray-50 text-gray-500 hover:bg-gray-200'}`}
        aria-label="Copy Link"
      >
        <LinkIcon fontSize="small" />
        {copied && (
          <span className="absolute -top-10 left-1/2 -translate-x-1/2 bg-dark text-white text-[12px] py-1 px-2 rounded-md whitespace-nowrap">
            Copied!
          </span>
        )}
      </button>
    </div>
  );
}
