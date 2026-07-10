import { Link } from 'react-router-dom';
import KeyboardArrowRightIcon from '@mui/icons-material/KeyboardArrowRight';
import { motion } from 'framer-motion';

export default function BlogHeroRedesign() {
  return (
    <section className="relative h-[250px] bg-gradient-to-r from-[#0B63CE]/5 to-[#EAF4FF] overflow-hidden flex items-center">

      {/* Abstract World Map Texture / Dot Pattern */}
      <div
        className="absolute inset-0 opacity-10 pointer-events-none"
        style={{ backgroundImage: 'radial-gradient(#0B63CE 1px, transparent 1px)', backgroundSize: '24px 24px' }}
      ></div>

      <div className="container-custom relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="max-w-3xl"
        >
          {/* Breadcrumb */}
          <nav aria-label="Breadcrumb" className="flex items-center text-[14px] font-medium text-gray-500 mb-4">
            <Link to="/" className="hover:text-[#0B63CE] transition-colors">Home</Link>
            <KeyboardArrowRightIcon fontSize="small" className="mx-1 opacity-60" />
            <span className="text-[#0B63CE]">Blog</span>
          </nav>

          {/* Title */}
          <h1 className="font-rubik text-[36px] md:text-[48px] font-bold text-dark leading-tight mb-3 tracking-tight">
            Export Blog & Industry Insights
          </h1>

          {/* Subtitle */}
          <p className="text-gray-600 text-[16px] max-w-2xl">
            Latest export news, market trends, food industry updates, business guides and international trade insights.
          </p>
        </motion.div>
      </div>
    </section>
  );
}
