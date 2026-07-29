import { useState } from 'react';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';

export default function ProductFAQ({ productName, faqs }) {
  const [openIndex, setOpenIndex] = useState(0);

  console.log("ProductFAQ received faqs:", faqs);

  let parsedFaqs = faqs;
  if (typeof faqs === 'string') {
    try {
      parsedFaqs = JSON.parse(faqs);
    } catch (e) {
      console.error("Failed to parse faqs string:", e);
      parsedFaqs = [];
    }
  }

  console.log("ProductFAQ parsedFaqs:", parsedFaqs);

  if (!parsedFaqs || !Array.isArray(parsedFaqs) || parsedFaqs.length === 0) {
    console.log("ProductFAQ returning null because faqs is empty or invalid.");
    return null;
  }

  return (
    <div className="w-full bg-white rounded-[20px] border border-gray-100 shadow-sm p-4 md:p-8 lg:p-10 mb-10 md:mb-20">
      <h3 className="font-rubik text-[20px] md:text-[24px] font-bold text-dark mb-1 md:mb-2">
        Frequently Asked Questions
      </h3>
      <p className="text-gray-500 mb-4 md:mb-8 text-[14px] md:text-[15px]">Common questions about {productName}</p>
      
      <div className="flex flex-col gap-3">
        {parsedFaqs.map((faq, index) => {
          const isOpen = openIndex === index;
          return (
            <div 
              key={index} 
              className={`border rounded-[12px] overflow-hidden transition-all duration-300 ${isOpen ? 'border-primary shadow-sm bg-primary/5' : 'border-gray-100 bg-white hover:border-gray-300'}`}
            >
              <button
                className="w-full flex items-center justify-between p-3 md:p-5 text-left focus:outline-none"
                onClick={() => setOpenIndex(isOpen ? -1 : index)}
              >
                <span className={`font-semibold text-[14px] md:text-[16px] pr-8 ${isOpen ? 'text-primary' : 'text-dark'}`}>
                  {faq.question}
                </span>
                <KeyboardArrowDownIcon 
                  className={`text-gray-400 transition-transform duration-300 shrink-0 ${isOpen ? 'rotate-180 text-primary' : ''}`}
                />
              </button>
              
              <div 
                className={`transition-all duration-300 ease-in-out ${isOpen ? 'max-h-[500px] opacity-100' : 'max-h-0 opacity-0'}`}
              >
                <div className="p-3 md:p-5 pt-0 text-gray-600 text-[13px] md:text-[15px] leading-relaxed">
                  {faq.answer}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
