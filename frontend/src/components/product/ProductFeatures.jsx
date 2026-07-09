import CheckCircleIcon from '@mui/icons-material/CheckCircle';

export default function ProductFeatures({ features = [] }) {
  if (!features || features.length === 0) return null;

  return (
    <div className="mb-16 md:mb-20">
      <h3 className="font-rubik text-[24px] font-bold text-dark mb-6">
        Key Features
      </h3>
      
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {features.map((feature, index) => (
          <div 
            key={index}
            className="bg-white border border-gray-100 shadow-sm rounded-[16px] p-5 flex items-center gap-3 hover:border-primary/50 hover:shadow-md transition-all duration-300 group"
          >
            <CheckCircleIcon className="text-primary group-hover:scale-110 transition-transform" />
            <span className="font-semibold text-dark text-[14px] md:text-[16px] leading-tight group-hover:text-primary transition-colors">
              {feature.title}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
