import React from 'react';
import { Grid, InputLabel, TextField, Box, Typography, Divider } from '@mui/material';
import SectionCard from './SectionCard';

export default function SeoSection({ formData, handleChange }) {
  
  // Calculate SEO metrics for visual feedback
  const titleLength = formData.meta_title?.length || 0;
  const descLength = formData.meta_description?.length || 0;
  
  const titleColor = titleLength > 0 && titleLength <= 60 ? '#10B981' : (titleLength > 60 ? '#F59E0B' : '#6B7280');
  const descColor = descLength > 0 && descLength <= 160 ? '#10B981' : (descLength > 160 ? '#F59E0B' : '#6B7280');

  // Preview fallbacks
  const previewTitle = formData.meta_title || formData.name || 'Your Product Title';
  const previewDesc = formData.meta_description || formData.short_description || 'Your product meta description will appear here in search results. Make it compelling to increase click-through rates.';
  const previewUrl = `https://yourwebsite.com/product/${formData.canonical_url || formData.slug || 'product-slug'}`;

  return (
    <SectionCard id="seo" title="Search Engine Optimization">
      <Grid container spacing={4}>
        <Grid item xs={12} md={7}>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
            <Box>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                    <InputLabel sx={{ color: '#374151', fontWeight: 500, fontSize: '0.875rem' }}>Meta Title</InputLabel>
                    <Typography variant="caption" sx={{ color: titleColor, fontWeight: 500 }}>
                        {titleLength}/60
                    </Typography>
                </Box>
                <TextField 
                    name="meta_title" 
                    value={formData.meta_title} 
                    onChange={handleChange} 
                    fullWidth 
                    size="small"
                    placeholder="Leave blank to use product name"
                    sx={{ '& .MuiOutlinedInput-root': { borderRadius: '8px' } }}
                />
            </Box>

            <Box>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                    <InputLabel sx={{ color: '#374151', fontWeight: 500, fontSize: '0.875rem' }}>Meta Description</InputLabel>
                    <Typography variant="caption" sx={{ color: descColor, fontWeight: 500 }}>
                        {descLength}/160
                    </Typography>
                </Box>
                <TextField 
                    name="meta_description" 
                    value={formData.meta_description} 
                    onChange={handleChange} 
                    fullWidth 
                    multiline
                    rows={3}
                    placeholder="Leave blank to use short description"
                    sx={{ '& .MuiOutlinedInput-root': { borderRadius: '8px' } }}
                />
            </Box>

            <Box>
                <InputLabel sx={{ mb: 1, color: '#374151', fontWeight: 500, fontSize: '0.875rem' }}>Meta Keywords (Comma separated)</InputLabel>
                <TextField 
                    name="meta_keywords" 
                    value={formData.meta_keywords} 
                    onChange={handleChange} 
                    fullWidth 
                    size="small"
                    placeholder="e.g. organic, onions, export"
                    sx={{ '& .MuiOutlinedInput-root': { borderRadius: '8px' } }}
                />
            </Box>

            <Box>
                <InputLabel sx={{ mb: 1, color: '#374151', fontWeight: 500, fontSize: '0.875rem' }}>Canonical URL</InputLabel>
                <TextField 
                    name="canonical_url" 
                    value={formData.canonical_url} 
                    onChange={handleChange} 
                    fullWidth 
                    size="small"
                    placeholder="Leave blank unless content is duplicated"
                    sx={{ '& .MuiOutlinedInput-root': { borderRadius: '8px' } }}
                />
            </Box>
          </Box>
        </Grid>
        
        <Grid item xs={12} md={5}>
           <Typography variant="subtitle2" sx={{ fontWeight: 600, color: '#374151', mb: 2 }}>
               Google Search Preview
           </Typography>
           <Box sx={{ p: 2, bgcolor: '#FFFFFF', border: '1px solid #E5E7EB', borderRadius: '12px', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.05)' }}>
               <Typography variant="body2" sx={{ color: '#1A0DAB', fontSize: '18px', fontWeight: 400, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', mb: 0.5, '&:hover': { textDecoration: 'underline', cursor: 'pointer' } }}>
                   {previewTitle}
               </Typography>
               <Typography variant="body2" sx={{ color: '#006621', fontSize: '14px', mb: 0.5, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                   {previewUrl}
               </Typography>
               <Typography variant="body2" sx={{ color: '#545454', fontSize: '13px', lineHeight: 1.4, display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                   {previewDesc}
               </Typography>
           </Box>
           
           {/* Simple SEO Check UI */}
           <Box sx={{ mt: 4, p: 2, bgcolor: '#F9FAFB', borderRadius: '8px', border: '1px solid #E5E7EB' }}>
               <Typography variant="caption" sx={{ fontWeight: 600, color: '#6B7280', display: 'block', mb: 1.5, textTransform: 'uppercase' }}>SEO Checks</Typography>
               <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                   <Typography variant="body2" sx={{ color: titleLength > 0 ? '#10B981' : '#6B7280', display: 'flex', alignItems: 'center', gap: 1 }}>
                       <span style={{ display: 'inline-block', width: 8, height: 8, borderRadius: '50%', backgroundColor: titleLength > 0 ? '#10B981' : '#D1D5DB' }}></span>
                       Custom Meta Title {titleLength === 0 && '(Missing)'}
                   </Typography>
                   <Typography variant="body2" sx={{ color: descLength > 0 ? '#10B981' : '#6B7280', display: 'flex', alignItems: 'center', gap: 1 }}>
                       <span style={{ display: 'inline-block', width: 8, height: 8, borderRadius: '50%', backgroundColor: descLength > 0 ? '#10B981' : '#D1D5DB' }}></span>
                       Custom Meta Description {descLength === 0 && '(Missing)'}
                   </Typography>
                   <Typography variant="body2" sx={{ color: formData.image || previewImage ? '#10B981' : '#6B7280', display: 'flex', alignItems: 'center', gap: 1 }}>
                       <span style={{ display: 'inline-block', width: 8, height: 8, borderRadius: '50%', backgroundColor: formData.image || previewImage ? '#10B981' : '#D1D5DB' }}></span>
                       Primary Image
                   </Typography>
               </Box>
           </Box>
        </Grid>
      </Grid>
    </SectionCard>
  );
}
