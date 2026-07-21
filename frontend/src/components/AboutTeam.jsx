import { useState, useEffect } from 'react';
import { fetchTeamMembers, fetchSectionSetting } from '../services/api';
import Reveal from './Reveal';
import LinkedInIcon from '@mui/icons-material/LinkedIn';
import EmailIcon from '@mui/icons-material/Email';
import WhatsAppIcon from '@mui/icons-material/WhatsApp';
import { Helmet } from 'react-helmet-async';

export default function AboutTeam() {
  const [team, setTeam] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [sectionSetting, setSectionSetting] = useState(null);

  useEffect(() => {
    const loadData = async () => {
      const [teamResult, settingResult] = await Promise.all([
        fetchTeamMembers(),
        fetchSectionSetting('about_team')
      ]);
      setTeam(teamResult);
      setSectionSetting(settingResult);
      setIsLoading(false);
    };
    loadData();
  }, []);

  if (isLoading) {
    return (
      <section className="w-full py-[40px] lg:py-[50px] bg-[#f9fafb] animate-pulse">
        <div className="container-custom">
          <div className="w-40 h-4 bg-gray-200 rounded mx-auto mb-2"></div>
          <div className="w-80 h-10 bg-gray-200 rounded mx-auto mb-12"></div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="bg-gray-100 h-[380px] rounded-[20px] w-full"></div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  if (!team || team.length === 0) return null;

  const subtitle = sectionSetting?.subtitle || 'OUR TEAM';
  const titleText = sectionSetting?.title || 'Meet Our Team';
  const description = sectionSetting?.description || 'Behind BiteExport is a dedicated team committed to delivering quality products, reliable export services, and long-term partnerships with global buyers.';

  const titleWords = titleText.split(' ');
  const lastWord = titleWords.pop();
  const restOfTitle = titleWords.join(' ');

  return (
    <section className="w-full py-[40px] lg:py-[50px] bg-[#f9fafb] relative overflow-hidden">
      
      {/* JSON-LD Schema for Team Members (SEO Boost) */}
      <Helmet>
        {team.map((member) => (
          <script type="application/ld+json" key={member.id}>
            {JSON.stringify({
              "@context": "https://schema.org",
              "@type": "Person",
              "name": member.full_name,
              "jobTitle": member.role,
              "image": member.profile_image,
              "description": member.short_description,
              "worksFor": {
                "@type": "Organization",
                "name": "BiteExport"
              },
              "sameAs": [
                member.social_links?.linkedin,
                member.social_links?.email ? `mailto:${member.social_links.email}` : null
              ].filter(Boolean)
            })}
          </script>
        ))}
      </Helmet>

      <div className="container-custom relative z-10">
        
        {/* Section Header */}
        <Reveal delay={0} className="text-center mb-10 lg:mb-16">
          <span className="text-secondary font-semibold tracking-widest uppercase text-[12px] md:text-[14px] mb-3 block">
            {subtitle}
          </span>
          <h2 className="text-[32px] md:text-[38px] lg:text-[44px] font-bold text-dark leading-tight mb-4 font-rubik">
            {restOfTitle} <span className="text-transparent bg-clip-text bg-gradient-to-r from-secondary to-[#0463C3]">{lastWord}</span>
          </h2>
          <p className="text-[15px] md:text-[16px] lg:text-[18px] text-text/90 max-w-2xl mx-auto leading-relaxed">
            {description}
          </p>
        </Reveal>

        {/* Team Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8">
          {team.map((member, index) => (
            <Reveal 
              key={member.id || index}
              delay={index * 150}
              className="group bg-white rounded-[20px] p-6 lg:p-8 border border-gray-100 shadow-sm hover:shadow-[0_20px_40px_rgba(53,153,255,0.1)] hover:border-secondary/50 transition-all duration-300 transform hover:-translate-y-2 flex flex-col items-center text-center h-full overflow-hidden relative"
            >
              
              {/* Decorative background shape on hover */}
              <div className="absolute top-0 left-0 w-full h-1/2 bg-gradient-to-b from-secondary/[0.03] to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"></div>

              {/* Profile Image Wrapper */}
              <div className="w-[160px] h-[160px] lg:w-[200px] lg:h-[200px] rounded-full p-[4px] border border-gray-200 group-hover:border-secondary transition-colors duration-300 mb-6 relative z-10">
                <img 
                  src={member.profile_image} 
                  alt={member.full_name} 
                  loading="lazy"
                  className="w-full h-full rounded-full object-cover group-hover:scale-[1.03] transition-transform duration-500"
                  onError={(e) => { e.target.src = "https://i.pravatar.cc/300?img=8"; }}
                />
              </div>

              {/* Member Info */}
              <div className="relative z-10 flex flex-col flex-grow">
                <h3 className="font-rubik font-semibold text-[20px] md:text-[22px] text-dark leading-tight mb-1 group-hover:text-secondary transition-colors">
                  {member.full_name}
                </h3>
                
                <p className="text-secondary font-medium text-[14px] md:text-[15px] mb-3">
                  {member.role}
                </p>

                <p className="text-[14px] text-text/80 leading-relaxed line-clamp-4 flex-grow mb-4">
                  {member.short_description}
                </p>

                {/* Social Links (Rendered only if available) */}
                {member.social_links && Object.keys(member.social_links).length > 0 && (
                  <div className="flex items-center justify-center space-x-3 mt-auto pt-4 border-t border-gray-50">
                    {member.social_links.linkedin && (
                      <a href={member.social_links.linkedin} target="_blank" rel="noreferrer" className="w-8 h-8 rounded-full bg-gray-50 flex items-center justify-center text-gray-500 hover:bg-[#0A66C2] hover:text-white transition-colors" aria-label={`LinkedIn for ${member.full_name}`}>
                        <LinkedInIcon fontSize="small" />
                      </a>
                    )}
                    {member.social_links.email && (
                      <a href={`mailto:${member.social_links.email}`} className="w-8 h-8 rounded-full bg-gray-50 flex items-center justify-center text-gray-500 hover:bg-[#EA4335] hover:text-white transition-colors" aria-label={`Email for ${member.full_name}`}>
                        <EmailIcon fontSize="small" />
                      </a>
                    )}
                    {member.social_links.whatsapp && (
                      <a href={`https://wa.me/${member.social_links.whatsapp}`} target="_blank" rel="noreferrer" className="w-8 h-8 rounded-full bg-gray-50 flex items-center justify-center text-gray-500 hover:bg-[#25D366] hover:text-white transition-colors" aria-label={`WhatsApp for ${member.full_name}`}>
                        <WhatsAppIcon fontSize="small" />
                      </a>
                    )}
                  </div>
                )}
              </div>

            </Reveal>
          ))}
        </div>

      </div>
    </section>
  );
}
