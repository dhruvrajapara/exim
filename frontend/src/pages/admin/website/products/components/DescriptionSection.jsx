import React from 'react';
import { Grid, InputLabel, TextField, Box, Typography } from '@mui/material';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css'; // Import Quill styles
import SectionCard from './SectionCard';

const modules = {
  toolbar: [
    [{ 'header': [1, 2, 3, false] }],
    ['bold', 'italic', 'underline', 'strike'],
    [{ 'list': 'ordered'}, { 'list': 'bullet' }],
    ['link', 'clean']
  ],
};

export default function DescriptionSection({ formData, handleRichTextChange }) {
  const shortDescCount = formData.short_description?.length || 0;

  return (
    <SectionCard id="description" title="Description">
      <Grid container spacing={4}>
        <Grid item xs={12}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
             <InputLabel sx={{ color: '#374151', fontWeight: 500, fontSize: '0.875rem' }}>Short Description</InputLabel>
             <Typography variant="caption" sx={{ color: shortDescCount > 160 ? '#EF4444' : '#6B7280' }}>
                {shortDescCount}/160
             </Typography>
          </Box>
          <TextField 
            name="short_description" 
            value={formData.short_description} 
            onChange={(e) => handleRichTextChange('short_description', e.target.value)} 
            fullWidth 
            multiline 
            rows={2} 
            placeholder="Brief summary for product cards and search results."
            sx={{ '& .MuiOutlinedInput-root': { borderRadius: '8px' } }}
          />
        </Grid>
        
        <Grid item xs={12}>
          <InputLabel sx={{ mb: 1, color: '#374151', fontWeight: 500, fontSize: '0.875rem' }}>Full Description</InputLabel>
          <Box sx={{ 
              '.ql-container': { borderBottomLeftRadius: '8px', borderBottomRightRadius: '8px', minHeight: '200px', fontSize: '15px', fontFamily: 'Inter' },
              '.ql-toolbar': { borderTopLeftRadius: '8px', borderTopRightRadius: '8px', bgcolor: '#F9FAFB' }
          }}>
             <ReactQuill 
                theme="snow" 
                value={formData.full_description} 
                onChange={(content) => handleRichTextChange('full_description', content)} 
                modules={modules}
                placeholder="Write a detailed, engaging description..."
             />
          </Box>
        </Grid>
      </Grid>
    </SectionCard>
  );
}
