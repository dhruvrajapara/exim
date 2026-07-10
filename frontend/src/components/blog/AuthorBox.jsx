import { Link } from 'react-router-dom';

export default function AuthorBox({ author, image, designation, bio }) {
  return (
    <div className="bg-[#F9FAFB] rounded-[20px] p-8 md:p-10 border border-gray-200 flex flex-col md:flex-row gap-8 items-start mt-12 mb-16 shadow-sm">
      
      <div className="flex-shrink-0">
        <img 
          src={image || 'https://images.unsplash.com/photo-1560250097-0b93528c311a?w=400&q=80'} 
          alt={author}
          className="w-[100px] h-[100px] md:w-[120px] md:h-[120px] rounded-full object-cover border-4 border-white shadow-md"
        />
      </div>
      
      <div className="flex flex-col flex-grow">
        <span className="text-[#0B63CE] text-[13px] font-bold uppercase tracking-wide mb-1">Author</span>
        <h3 className="font-rubik text-[24px] font-bold text-dark mb-1">{author || 'BiteExport Team'}</h3>
        <span className="text-[15px] font-medium text-gray-500 mb-4">{designation || 'Export Specialist'}</span>
        
        <p className="text-gray-600 text-[16px] leading-relaxed mb-6">
          {bio || `${author} brings years of expertise in the global agricultural export market, sharing deep insights into quality standards, supply chain management, and market trends.`}
        </p>

        <Link to={`/blog?author=${author?.toLowerCase().replace(' ', '-')}`} className="inline-flex items-center text-[#0B63CE] font-bold text-[15px] hover:underline">
          View All Articles by {author}
        </Link>
      </div>

    </div>
  );
}
