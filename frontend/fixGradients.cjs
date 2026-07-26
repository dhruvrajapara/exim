const fs = require('fs');
const files = [
  'src/components/WhyChooseUs.jsx',
  'src/components/Testimonials.jsx',
  'src/components/VisionMission.jsx',
  'src/components/Certifications.jsx',
  'src/components/AboutTeam.jsx',
  'src/components/AboutCertifications.jsx',
  'src/components/ProductListing.jsx'
];

files.forEach(file => {
  if (fs.existsSync(file)) {
    let content = fs.readFileSync(file, 'utf8');
    // Replace text gradients
    content = content.replace(/className="text-transparent bg-clip-text bg-gradient-to-[a-z] from-[^\s"]+ to-[^\s"]+"/g, 'className="text-transparent bg-clip-text" style={{ backgroundImage: \'var(--color-gradient)\' }}');
    
    // Replace button gradients
    content = content.replace(/className="btn-primary rounded-full px-8 bg-gradient-to-r from-primary to-green-600 border-none shadow-md hover:shadow-lg transition-all duration-300 hover:-translate-y-1"/g, 'className="btn-primary rounded-full px-8 border-none shadow-md hover:shadow-lg transition-all duration-300 hover:-translate-y-1" style={{ backgroundImage: \'var(--color-gradient)\' }}');
    
    fs.writeFileSync(file, content);
    console.log('Updated ' + file);
  }
});
