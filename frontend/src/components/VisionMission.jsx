import { useState, useEffect } from 'react';
import { fetchVisionMission, fetchSectionSetting } from '../services/api';
import Reveal from './Reveal';

// Dynamic Material UI Icon Resolver
import VisibilityIcon from '@mui/icons-material/Visibility';
import PublicIcon from '@mui/icons-material/Public';
import TravelExploreIcon from '@mui/icons-material/TravelExplore';
import FlagIcon from '@mui/icons-material/Flag';
import TrackChangesIcon from '@mui/icons-material/TrackChanges';
import MilitaryTechIcon from '@mui/icons-material/MilitaryTech';
import StarIcon from '@mui/icons-material/Star'; // Fallback icon

const getDynamicIcon = (iconString) => {
  if (!iconString) return <StarIcon fontSize="inherit" />;
  
  const iconMap = {
    'Visibility': <VisibilityIcon fontSize="inherit" />,
    'Public': <PublicIcon fontSize="inherit" />,
    'TravelExplore': <TravelExploreIcon fontSize="inherit" />,
    'Flag': <FlagIcon fontSize="inherit" />,
    'TrackChanges': <TrackChangesIcon fontSize="inherit" />,
    'MilitaryTech': <MilitaryTechIcon fontSize="inherit" />
  };

  return iconMap[iconString] || <StarIcon fontSize="inherit" />;
};

export default function VisionMission() {
  const [items, setItems] = useState([]);
  const [sectionSetting, setSectionSetting] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      const [visionMissionData, settingData] = await Promise.all([
        fetchVisionMission(),
        fetchSectionSetting('vision_mission')
      ]);
      
      // Ensure we only take the first Vision and the first Mission
      const vision = visionMissionData.find(item => item.type === 'vision');
      const mission = visionMissionData.find(item => item.type === 'mission');
      const filteredItems = [];
      if (vision) filteredItems.push(vision);
      if (mission) filteredItems.push(mission);
      
      setItems(filteredItems);
      setSectionSetting(settingData);
      setIsLoading(false);
    };
    loadData();
  }, []);

  if (isLoading) {
    return (
      <section className="w-full py-[40px] lg:py-[50px] bg-[#f9fafb] animate-pulse">
         <div className="container-custom">
            <div className="h-4 bg-gray-200 w-32 mx-auto mb-3 rounded"></div>
            <div className="h-10 bg-gray-200 w-64 mx-auto mb-12 rounded"></div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-10">
              {[1, 2].map(i => (
                <div key={i} className="bg-white h-[350px] rounded-[20px] w-full"></div>
              ))}
            </div>
         </div>
      </section>
    );
  }

  if (!items || items.length === 0) return null;

  return (
    <section className="w-full py-[40px] lg:py-[50px] bg-[#f9fafb] relative overflow-hidden">
      
      {/* Decorative Background Pattern */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden opacity-5 pointer-events-none">
        <svg className="absolute w-[800px] h-[800px] -top-[400px] -left-[200px]" viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
          <path fill="#039639" d="M45.7,-76.4C58.9,-69.1,69,-55.4,75.4,-40.8C81.8,-26.2,84.4,-10.8,81.3,3.5C78.3,17.9,69.5,31.2,60.1,43.3C50.7,55.3,40.7,66,27.9,73C15.1,80,0.5,83.3,-14.8,82.4C-30.1,81.4,-46.1,76.2,-58.5,66.4C-70.9,56.5,-79.8,42.1,-84.3,26.5C-88.7,10.9,-88.7,-6,-83.4,-21C-78.1,-36,-67.4,-49.2,-54.3,-56.9C-41.2,-64.5,-25.6,-66.6,-10.7,-68.8C4.3,-71.1,19.3,-73.4,32.7,-77.8Z" transform="translate(100 100)" />
        </svg>
      </div>

      <div className="container-custom relative z-10">
        
        {/* Section Header */}
        <Reveal delay={0} className="text-center mb-10 lg:mb-16">
          <span className="text-secondary font-semibold tracking-[0.2em] uppercase text-[12px] md:text-[14px] mb-3 block">
            {sectionSetting?.subtitle || 'OUR PURPOSE'}
          </span>
          <h2 className="text-[32px] md:text-[38px] lg:text-[44px] font-bold text-dark leading-[1.2] mb-4 font-rubik">
            {(() => {
              const titleText = sectionSetting?.title || 'Vision & Mission';
              const words = titleText.split(' ');
              if (words.length <= 1) return titleText;
              
              // To handle "& Mission" as a single highlighted part, we'll try splitting on ampersand first if it exists
              if (titleText.includes('&')) {
                const parts = titleText.split('&');
                return (
                  <>
                    {parts[0]} <span className="text-transparent bg-clip-text bg-gradient-to-r from-secondary to-[#0463C3]">&{parts[1]}</span>
                  </>
                );
              }
              
              const lastWord = words.pop();
              return (
                <>
                  {words.join(' ')} <span className="text-transparent bg-clip-text bg-gradient-to-r from-secondary to-[#0463C3]">{lastWord}</span>
                </>
              );
            })()}
          </h2>
          <p className="text-[15px] md:text-[16px] lg:text-[18px] text-text/90 max-w-2xl mx-auto leading-relaxed">
            {sectionSetting?.description || 'Our vision and mission guide every step of our journey as we strive to become a trusted global exporter of premium agricultural products.'}
          </p>
        </Reveal>

        {/* 50/50 Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-10">
          {items.map((item, index) => (
            <Reveal 
              key={item.id || index} 
              delay={index * 200} // Staggered delay (0ms, 200ms)
              className="h-full"
            >
              <div className="group relative bg-white rounded-[20px] p-6 md:p-8 lg:p-10 flex flex-col h-full border border-gray-100 shadow-md hover:border-secondary/50 hover:shadow-[0_20px_40px_rgba(53,153,255,0.12)] transition-all duration-300 transform hover:-translate-y-2 overflow-hidden">
                
                {/* Subtle Decorative Pattern Inside Card */}
                <div className="absolute -bottom-10 -right-10 text-gray-50 opacity-10 group-hover:scale-125 transition-transform duration-700 pointer-events-none">
                   <span className="text-[200px] flex items-center justify-center">
                     {getDynamicIcon(item.icon)}
                   </span>
                </div>

                <div className="relative z-10 flex flex-col h-full">
                  {/* Dynamic Icon */}
                  <div className="w-[48px] h-[48px] lg:w-[60px] lg:h-[60px] rounded-[14px] bg-secondary/10 text-secondary flex items-center justify-center mb-6 group-hover:scale-110 group-hover:bg-secondary group-hover:text-white transition-all duration-300 shadow-sm">
                    <span className="text-[28px] lg:text-[34px] flex items-center justify-center">
                      {getDynamicIcon(item.icon)}
                    </span>
                  </div>

                  {/* Content */}
                  <span className="text-secondary font-semibold tracking-widest uppercase text-[12px] mb-2 block">
                    {item.label}
                  </span>
                  
                  <h3 className="font-rubik font-bold text-[28px] lg:text-[40px] text-dark mb-4 leading-tight group-hover:text-secondary transition-colors">
                    {item.title}
                  </h3>
                  
                  <p className="text-[15px] lg:text-[16px] text-text/80 leading-[1.8] line-clamp-[6]">
                    {item.description}
                  </p>
                </div>

              </div>
            </Reveal>
          ))}
        </div>

      </div>
    </section>
  );
}
