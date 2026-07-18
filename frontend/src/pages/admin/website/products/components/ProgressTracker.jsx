import React from 'react';
import { Box, Typography, Card, LinearProgress } from '@mui/material';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import RadioButtonUncheckedIcon from '@mui/icons-material/RadioButtonUnchecked';

export default function ProgressTracker({ formData, specifications, features, galleryFiles, existingGallery }) {
  
  const checks = [
    { label: 'Product Name', completed: !!formData.name },
    { label: 'Category', completed: !!formData.category_id },
    { label: 'Short Description', completed: !!formData.short_description },
    { label: 'Full Description', completed: !!formData.full_description && formData.full_description !== '<p><br></p>' },
    { label: 'Primary Image', completed: !!formData.image || existingGallery.length > 0 },
    { label: 'Gallery', completed: galleryFiles.length > 0 || existingGallery.length > 1 },
    { label: 'Specifications', completed: specifications.some(s => s.key && s.value) },
    { label: 'Features', completed: features.some(f => f.trim() !== '') },
    { label: 'SEO Title', completed: !!formData.meta_title },
  ];

  const completedCount = checks.filter(c => c.completed).length;
  const progressPercentage = Math.round((completedCount / checks.length) * 100);

  return (
    <Card elevation={0} sx={{ border: '1px solid #E5E7EB', borderRadius: '12px', p: 3, bgcolor: '#FFFFFF' }}>
      <Typography variant="subtitle2" sx={{ fontWeight: 600, color: '#111827', mb: 1 }}>
        Listing Completion
      </Typography>
      
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
        <Typography variant="h4" sx={{ fontWeight: 700, color: progressPercentage === 100 ? '#10B981' : '#2563EB' }}>
          {progressPercentage}%
        </Typography>
        <Typography variant="caption" sx={{ color: '#6B7280' }}>
          {completedCount} of {checks.length} tasks
        </Typography>
      </Box>

      <LinearProgress 
        variant="determinate" 
        value={progressPercentage} 
        sx={{ 
          height: 8, 
          borderRadius: 4, 
          bgcolor: '#F3F4F6',
          mb: 3,
          '& .MuiLinearProgress-bar': {
            bgcolor: progressPercentage === 100 ? '#10B981' : '#2563EB'
          }
        }} 
      />

      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
        {checks.map((check, i) => (
          <Box key={i} sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
            {check.completed ? (
              <CheckCircleIcon sx={{ fontSize: 18, color: '#10B981' }} />
            ) : (
              <RadioButtonUncheckedIcon sx={{ fontSize: 18, color: '#D1D5DB' }} />
            )}
            <Typography variant="body2" sx={{ color: check.completed ? '#374151' : '#9CA3AF', textDecoration: check.completed ? 'line-through' : 'none' }}>
              {check.label}
            </Typography>
          </Box>
        ))}
      </Box>
    </Card>
  );
}
