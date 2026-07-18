import React from 'react';
import { Box, Typography, Card, CardContent } from '@mui/material';

export default function LivePreview({ formData, previewImage }) {
  return (
    <Card elevation={0} sx={{ border: '1px solid #E5E7EB', borderRadius: '12px', overflow: 'hidden', bgcolor: '#FFFFFF' }}>
      <Box sx={{ px: 3, py: 2, bgcolor: '#F9FAFB', borderBottom: '1px solid #E5E7EB' }}>
         <Typography variant="subtitle2" sx={{ fontWeight: 600, color: '#111827' }}>
            Card Preview
         </Typography>
      </Box>
      <CardContent sx={{ p: 0 }}>
         {/* Fake Product Card Layout */}
         <Box sx={{ p: 2 }}>
            <Box sx={{ width: '100%', height: 200, bgcolor: '#F3F4F6', borderRadius: '8px', mb: 2, overflow: 'hidden' }}>
               {previewImage ? (
                  <img src={previewImage.startsWith('blob:') ? previewImage : `http://localhost:8000${previewImage}`} alt="Preview" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
               ) : (
                  <Box sx={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#9CA3AF' }}>
                      No Image
                  </Box>
               )}
            </Box>
            <Typography variant="caption" sx={{ color: '#2563EB', fontWeight: 600, textTransform: 'uppercase', letterSpacing: 0.5 }}>
               {formData.category_id ? 'Category Selected' : 'Uncategorized'}
            </Typography>
            <Typography variant="h6" sx={{ fontWeight: 700, color: '#111827', mt: 0.5, lineHeight: 1.2, mb: 1 }}>
               {formData.name || 'Product Name'}
            </Typography>
            <Typography variant="body2" sx={{ color: '#6B7280', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
               {formData.short_description || 'Product short description will appear here on category and archive pages.'}
            </Typography>
         </Box>
      </CardContent>
    </Card>
  );
}
