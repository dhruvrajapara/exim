import { useState } from 'react';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';

export default function ProductFAQ({ productName }) {
  const [openIndex, setOpenIndex] = useState(0);

  // Generate some dynamic dummy FAQs based on the product name for SEO
  const faqs = [
    {
      question: `What is the shelf life of ${productName || 'this product'}?`,
      answer: `When stored properly in a cool, dry place away from direct sunlight, ${productName || 'this product'} has a shelf life of up to 12-24 months. For maximum freshness, we recommend keeping it in an airtight container.`
    },
    {
      question: `Are there any quality certifications for ${productName || 'this product'}?`,
      answer: `Yes, we adhere to strict international food safety standards. Our products are processed in ISO and HACCP certified facilities, ensuring premium export quality and safety.`
    },
    {
      question: `What are the packaging options available?`,
      answer: `We offer versatile packaging solutions including bulk PP bags, paper bags, and customized retail packaging depending on your order quantity and requirements. Private labeling is also available upon request.`
    },
    {
      question: `Do you provide samples before bulk orders?`,
      answer: `Absolutely! We understand the importance of quality verification. We can arrange for product samples to be shipped internationally via DHL or FedEx so you can test our quality firsthand.`
    }
  ];

  return (
    <div className="w-full bg-white rounded-[20px] border border-gray-100 shadow-sm p-6 md:p-8 lg:p-10 mb-16 md:mb-20">
      <h3 className="font-rubik text-[24px] font-bold text-dark mb-2">
        Frequently Asked Questions
      </h3>
      <p className="text-gray-500 mb-8 text-[15px]">Common questions about {productName}</p>
      
      <div className="flex flex-col gap-3">
        {faqs.map((faq, index) => {
          const isOpen = openIndex === index;
          return (
            <div 
              key={index} 
              className={`border rounded-[12px] overflow-hidden transition-all duration-300 ${isOpen ? 'border-primary shadow-sm bg-primary/5' : 'border-gray-100 bg-white hover:border-gray-300'}`}
            >
              <button
                className="w-full flex items-center justify-between p-4 md:p-5 text-left focus:outline-none"
                onClick={() => setOpenIndex(isOpen ? -1 : index)}
              >
                <span className={`font-semibold text-[15px] md:text-[16px] pr-8 ${isOpen ? 'text-primary' : 'text-dark'}`}>
                  {faq.question}
                </span>
                <KeyboardArrowDownIcon 
                  className={`text-gray-400 transition-transform duration-300 shrink-0 ${isOpen ? 'rotate-180 text-primary' : ''}`}
                />
              </button>
              
              <div 
                className={`transition-all duration-300 ease-in-out ${isOpen ? 'max-h-[500px] opacity-100' : 'max-h-0 opacity-0'}`}
              >
                <div className="p-4 md:p-5 pt-0 text-gray-600 text-[14px] md:text-[15px] leading-relaxed">
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
