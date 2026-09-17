import { Link } from 'react-router-dom';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import HomeIcon from '@mui/icons-material/Home';
import SEO from '../components/SEO';

export default function NotFoundPage() {
  return (
    <>
      <SEO 
        title="404 - Page Not Found | BiteExport"
        description="The page you are looking for does not exist or has been moved."
      />
      <div className="min-h-[70vh] flex items-center justify-center py-16 px-4 bg-light">
        <div className="max-w-lg w-full text-center bg-white rounded-2xl p-8 md:p-12 shadow-sm border border-gray-100">
          
          {/* Animated 404 Badge */}
          <div className="relative inline-flex items-center justify-center mb-6">
            <span className="text-8xl md:text-9xl font-extrabold text-transparent bg-clip-text" style={{ backgroundImage: 'var(--color-gradient)' }}>
              404
            </span>
            <span className="absolute -bottom-2 px-3 py-1 bg-primary/10 text-primary text-xs font-bold uppercase tracking-wider rounded-full border border-primary/20">
              Page Not Found
            </span>
          </div>

          <h1 className="text-2xl md:text-3xl font-bold text-dark mb-3">
            Oops! Lost in Sourcing?
          </h1>
          
          <p className="text-sm md:text-base text-text max-w-md mx-auto mb-8 leading-relaxed">
            The page you are looking for might have been removed, had its name changed, or is temporarily unavailable.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Link 
              to="/" 
              className="btn-primary w-full sm:w-auto px-6 flex items-center justify-center gap-2"
            >
              <HomeIcon fontSize="small" />
              <span>Back to Home</span>
            </Link>
            
            <Link 
              to="/product" 
              className="btn-outline-dark w-full sm:w-auto px-6 flex items-center justify-center gap-2"
            >
              <ArrowBackIcon fontSize="small" />
              <span>Browse Products</span>
            </Link>
          </div>

        </div>
      </div>
    </>
  );
}
