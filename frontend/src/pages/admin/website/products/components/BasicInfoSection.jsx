import React from 'react';
import { Grid, InputLabel, TextField, FormControl, Select, MenuItem, Box, Switch, Typography } from '@mui/material';
import SectionCard from './SectionCard';

export default function BasicInfoSection({ formData, handleChange, categories }) {
  return (
    <SectionCard id="basic-info" title="Basic Information">
      <Grid container spacing={3}>
        <Grid item xs={12}>
          <InputLabel sx={{ mb: 1, color: '#374151', fontWeight: 500, fontSize: '0.875rem' }}>Product Name *</InputLabel>
          <TextField 
            name="name" 
            value={formData.name} 
            onChange={handleChange} 
            fullWidth 
            required 
            placeholder="e.g. Premium Dehydrated Onion Flakes"
            size="small"
            sx={{ '& .MuiOutlinedInput-root': { borderRadius: '8px' } }}
          />
        </Grid>
        
        <Grid item xs={12} sm={6}>
          <InputLabel sx={{ mb: 1, color: '#374151', fontWeight: 500, fontSize: '0.875rem' }}>URL Slug</InputLabel>
          <TextField 
            name="slug" 
            value={formData.slug} 
            onChange={handleChange} 
            fullWidth 
            disabled
            size="small"
            sx={{ bgcolor: '#F9FAFB', '& .MuiOutlinedInput-root': { borderRadius: '8px' } }}
          />
        </Grid>
        
        <Grid item xs={12} sm={6}>
          <InputLabel sx={{ mb: 1, color: '#374151', fontWeight: 500, fontSize: '0.875rem' }}>Category</InputLabel>
          <FormControl fullWidth size="small">
            <Select
              name="category_id"
              value={formData.category_id}
              onChange={handleChange}
              displayEmpty
              sx={{ borderRadius: '8px' }}
            >
              <MenuItem value="" disabled>Select a category</MenuItem>
              {categories.map(cat => (
                <MenuItem key={cat.id} value={cat.id}>{cat.name}</MenuItem>
              ))}
            </Select>
          </FormControl>
        </Grid>

        <Grid item xs={12} sm={6}>
            <Box sx={{ p: 2, border: '1px solid #E5E7EB', borderRadius: '8px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Box>
                    <Typography variant="body2" sx={{ fontWeight: 600, color: '#111827' }}>Active Status</Typography>
                    <Typography variant="caption" sx={{ color: '#6B7280' }}>Visible to customers</Typography>
                </Box>
                <Switch checked={formData.is_active} onChange={handleChange} name="is_active" color="success" />
            </Box>
        </Grid>

        <Grid item xs={12} sm={6}>
            <Box sx={{ p: 2, border: '1px solid #E5E7EB', borderRadius: '8px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Box>
                    <Typography variant="body2" sx={{ fontWeight: 600, color: '#111827' }}>Featured Product</Typography>
                    <Typography variant="caption" sx={{ color: '#6B7280' }}>Highlight on homepage</Typography>
                </Box>
                <Switch checked={formData.is_featured} onChange={handleChange} name="is_featured" color="primary" />
            </Box>
        </Grid>
      </Grid>
    </SectionCard>
  );
}
