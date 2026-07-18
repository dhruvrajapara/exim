import React from 'react';
import { Card, Box, Typography, Divider } from '@mui/material';

export default function SectionCard({ id, title, children }) {
  return (
    <Card 
      id={id}
      elevation={0} 
      sx={{ 
        border: '1px solid #E5E7EB', 
        borderRadius: '16px',
        overflow: 'hidden',
        scrollMarginTop: '100px'
      }}
    >
      <Box sx={{ 
        px: 3, 
        py: 2, 
        bgcolor: '#FFFFFF',
        display: 'flex',
        alignItems: 'center'
      }}>
        <Typography variant="h6" sx={{ fontSize: '1.125rem', fontWeight: 600, color: '#111827' }}>
          {title}
        </Typography>
      </Box>
      <Divider sx={{ borderColor: '#F3F4F6' }} />
      <Box sx={{ p: 3, bgcolor: '#FFFFFF' }}>
        {children}
      </Box>
    </Card>
  );
}
