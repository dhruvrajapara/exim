import React, { useState, useEffect } from 'react';
import { Box, Typography } from '@mui/material';

const SECTIONS = [
  { id: 'basic-info', label: 'Basic Information' },
  { id: 'description', label: 'Description' },
  { id: 'media', label: 'Media' },
  { id: 'specifications', label: 'Specifications' },
  { id: 'features', label: 'Features' },
  { id: 'seo', label: 'SEO' },
];

export default function StickySidebarNav() {
  const [activeSection, setActiveSection] = useState('basic-info');

  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY + 150; // offset for sticky header
      
      for (const section of SECTIONS) {
        const element = document.getElementById(section.id);
        if (element) {
          const { top, bottom } = element.getBoundingClientRect();
          const elementTop = top + window.scrollY;
          if (scrollPosition >= elementTop && scrollPosition < elementTop + bottom) {
            setActiveSection(section.id);
          }
        }
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollTo = (id) => {
    const element = document.getElementById(id);
    if (element) {
      window.scrollTo({
        top: element.getBoundingClientRect().top + window.scrollY - 100,
        behavior: 'smooth'
      });
    }
  };

  return (
    <Box sx={{ position: 'sticky', top: 100 }}>
      <Typography variant="overline" sx={{ color: '#9CA3AF', fontWeight: 700, letterSpacing: 1, mb: 2, display: 'block' }}>
        ON THIS PAGE
      </Typography>
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1, borderLeft: '2px solid #E5E7EB', pl: 2 }}>
        {SECTIONS.map(section => (
          <Typography
            key={section.id}
            onClick={() => scrollTo(section.id)}
            sx={{
              cursor: 'pointer',
              fontSize: '0.875rem',
              fontWeight: activeSection === section.id ? 600 : 500,
              color: activeSection === section.id ? '#2563EB' : '#6B7280',
              transition: 'color 0.2s',
              position: 'relative',
              '&::before': {
                content: '""',
                position: 'absolute',
                left: '-18px',
                top: '50%',
                transform: 'translateY(-50%)',
                width: '2px',
                height: activeSection === section.id ? '16px' : '0px',
                bgcolor: '#2563EB',
                transition: 'height 0.2s'
              },
              '&:hover': { color: '#111827' }
            }}
          >
            {section.label}
          </Typography>
        ))}
      </Box>
    </Box>
  );
}
