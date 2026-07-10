import KeyboardArrowLeftIcon from '@mui/icons-material/KeyboardArrowLeft';
import KeyboardArrowRightIcon from '@mui/icons-material/KeyboardArrowRight';

export default function BlogPagination({ currentPage = 1, totalPages = 4, onPageChange }) {
  const pages = Array.from({ length: totalPages }, (_, i) => i + 1);

  if (totalPages <= 1) return null;

  return (
    <section className="pb-12 md:pb-16 bg-[#F9FAFB]">
      <div className="container-custom flex justify-center items-center gap-2">
        
        {/* Previous Button */}
        <button 
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage === 1}
          className="flex items-center gap-1 h-[40px] px-4 rounded-[8px] border border-[#E5E7EB] bg-white text-gray-500 font-medium hover:bg-gray-50 hover:text-dark disabled:opacity-50 disabled:pointer-events-none transition-colors"
        >
          <KeyboardArrowLeftIcon fontSize="small" />
          <span className="hidden sm:inline">Previous</span>
        </button>

        {/* Page Numbers */}
        <div className="flex items-center gap-2 px-2">
          {pages.map((page) => (
            <button
              key={page}
              onClick={() => onPageChange(page)}
              className={`w-[40px] h-[40px] rounded-[8px] flex items-center justify-center font-medium transition-colors ${
                currentPage === page 
                  ? 'bg-[#0B63CE] text-white border border-[#0B63CE] shadow-sm' 
                  : 'bg-white border border-[#E5E7EB] text-gray-600 hover:bg-gray-50 hover:text-dark'
              }`}
            >
              {page}
            </button>
          ))}
        </div>

        {/* Next Button */}
        <button 
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
          className="flex items-center gap-1 h-[40px] px-4 rounded-[8px] border border-[#E5E7EB] bg-white text-gray-500 font-medium hover:bg-gray-50 hover:text-dark disabled:opacity-50 disabled:pointer-events-none transition-colors"
        >
          <span className="hidden sm:inline">Next</span>
          <KeyboardArrowRightIcon fontSize="small" />
        </button>

      </div>
    </section>
  );
}
