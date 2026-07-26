import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import AddIcon from '@mui/icons-material/Add';
import RemoveIcon from '@mui/icons-material/Remove';

import { useSettings } from '../../contexts/SettingsContext';

export default function ContactFAQ() {
  const { settings } = useSettings();
  const [openId, setOpenId] = useState(null);

  const faqs = settings?.contact_faqs && settings.contact_faqs.length > 0 ? settings.contact_faqs : [];

  if (faqs.length === 0) return null;

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
          {faqs.map((faq, index) => {
            const isOpen = openId === index;
            return (
              <div 
                key={index} 
                className={`border ${isOpen ? 'border-[#0B63CE]' : 'border-gray-200'} rounded-[16px] overflow-hidden transition-colors duration-300`}
              >
                <button
                  onClick={() => toggleFAQ(index)}
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
