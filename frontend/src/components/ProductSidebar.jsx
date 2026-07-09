import KeyboardArrowRightIcon from '@mui/icons-material/KeyboardArrowRight';

export default function ProductSidebar({ categories, activeCategory, onCategoryChange }) {
  return (
    <div className="bg-white rounded-[16px] border border-gray-100 shadow-sm p-6 sticky top-[100px]">
      <h3 className="font-rubik font-bold text-[20px] text-dark mb-4 pb-4 border-b border-gray-100">
        Product Categories
      </h3>
      
      <ul className="flex flex-col gap-2">
        <li>
          <button
            onClick={() => onCategoryChange('all')}
            className={`w-full text-left px-4 py-3 rounded-[10px] font-medium transition-all duration-300 flex items-center justify-between ${
              activeCategory === 'all'
                ? 'bg-primary text-white shadow-md'
                : 'text-text hover:bg-gray-50 hover:text-primary'
            }`}
          >
            <span>All Products</span>
            <KeyboardArrowRightIcon fontSize="small" className={activeCategory === 'all' ? 'text-white' : 'text-gray-400'} />
          </button>
        </li>
        
        {categories.map((cat) => (
          <li key={cat.id}>
            <button
              onClick={() => onCategoryChange(cat.slug)}
              className={`w-full text-left px-4 py-3 rounded-[10px] font-medium transition-all duration-300 flex items-center justify-between ${
                activeCategory === cat.slug
                  ? 'bg-primary text-white shadow-md'
                  : 'text-text hover:bg-gray-50 hover:text-primary'
              }`}
            >
              <span>{cat.name}</span>
              <KeyboardArrowRightIcon fontSize="small" className={activeCategory === cat.slug ? 'text-white' : 'text-gray-400'} />
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}
