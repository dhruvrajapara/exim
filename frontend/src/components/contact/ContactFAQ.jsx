import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import AddIcon from '@mui/icons-material/Add';
import RemoveIcon from '@mui/icons-material/Remove';

const FAQ_DATA = [
  {
    id: 1,
    question: "How can I request a quotation?",
    answer: "You can request a quotation by filling out the inquiry form on this page or emailing our sales team directly at sales@biteexport.com. Please include the product name, required quantity, packaging preferences, and the destination country."
  },
  {
    id: 2,
    question: "Which countries do you export to?",
    answer: "We currently export to over 25 countries worldwide, with a strong presence in the United Kingdom, Germany, Australia, the Middle East, and various parts of Africa. We hold the necessary APEDA and FSSAI certifications to ensure global compliance."
  },
  {
    id: 3,
    question: "What is your minimum order quantity (MOQ)?",
    answer: "Our Minimum Order Quantity (MOQ) depends on the specific product and packaging requirements. For most dehydrated vegetables, the MOQ starts at 1 Metric Ton (MT). Please contact us with your specific needs for a detailed assessment."
  },
  {
    id: 4,
    question: "Can you provide private labeling?",
    answer: "Yes, we offer comprehensive private labeling and OEM packaging solutions for B2B clients. We can pack products in retail-ready packaging customized with your brand's logo and design."
  },
  {
    id: 5,
    question: "How long does international shipping take?",
    answer: "Shipping duration varies significantly based on the destination port and the shipping line. Typically, shipments to the Middle East take 7-10 days, Europe takes 25-30 days, and Australia takes 20-25 days from the port of loading in India."
  }
];

export default function ContactFAQ() {
  const [openId, setOpenId] = useState(null);

  const toggleFAQ = (id) => {
    setOpenId(openId === id ? null : id);
  };

  return (
    <section className="py-12 md:py-16 bg-white">
      <div className="container-custom max-w-4xl mx-auto">
        
        <div className="text-center mb-10 md:mb-12">
          <h2 className="font-rubik text-[32px] md:text-[40px] font-bold text-dark mb-4">
            Frequently Asked Questions
          </h2>
          <p className="text-gray-600 text-[16px] md:text-[18px]">
            Find quick answers to common queries regarding our export process, shipping, and products.
          </p>
        </div>

        <div className="flex flex-col gap-4">
          {FAQ_DATA.map((faq) => {
            const isOpen = openId === faq.id;
            return (
              <div 
                key={faq.id} 
                className={`border ${isOpen ? 'border-[#0B63CE]' : 'border-gray-200'} rounded-[16px] overflow-hidden transition-colors duration-300`}
              >
                <button
                  onClick={() => toggleFAQ(faq.id)}
                  className={`w-full flex items-center justify-between p-5 md:p-6 text-left ${isOpen ? 'bg-[#EAF4FF]' : 'bg-white hover:bg-gray-50'}`}
                >
                  <span className={`font-bold text-[16px] md:text-[18px] ${isOpen ? 'text-[#0B63CE]' : 'text-dark'}`}>
                    {faq.question}
                  </span>
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 transition-transform duration-300 ${isOpen ? 'bg-[#0B63CE] text-white rotate-180' : 'bg-gray-100 text-gray-500'}`}>
                    {isOpen ? <RemoveIcon fontSize="small" /> : <AddIcon fontSize="small" />}
                  </div>
                </button>
                
                <AnimatePresence>
                  {isOpen && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.3, ease: "easeInOut" }}
                    >
                      <div className="p-5 md:p-6 border-t border-gray-200 bg-white text-gray-600 text-[15px] md:text-[16px] leading-relaxed">
                        {faq.answer}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
}
