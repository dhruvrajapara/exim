import React, { useState, useEffect } from 'react';
import { 
  Box, Typography, TextField, Button, Paper, CircularProgress, 
  Snackbar, Alert, MenuItem, Select, InputLabel, FormControl, 
  OutlinedInput, Checkbox, ListItemText 
} from '@mui/material';

export default function ProductCategoriesSection() {
  const [formData, setFormData] = useState({
    subtitle: '',
    title: '',
    description: '',
    extra_data: {
      limit: 'All',
      selected_categories: []
    }
  });
  const [allCategories, setAllCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });

  const handleCloseSnackbar = () => setSnackbar({ ...snackbar, open: false });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [settingsRes, categoriesRes] = await Promise.all([
        fetch('/api/section-settings/home_categories'),
        fetch('/api/admin/product-categories')
      ]);

      let settingsData = null;
      if (settingsRes.ok) {
        const resJson = await settingsRes.json();
        settingsData = resJson.data;
      }

      if (categoriesRes.ok) {
        const catJson = await categoriesRes.json();
        setAllCategories(catJson.data || []);
      }

      if (settingsData) {
        setFormData({
          subtitle: settingsData.subtitle || '',
          title: settingsData.title || '',
          description: settingsData.description || '',
          extra_data: settingsData.extra_data || { limit: 'All', selected_categories: [] }
        });
      }
    } catch (error) {
      console.error('Failed to fetch data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const handleExtraDataChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      extra_data: {
        ...formData.extra_data,
        [name]: value
      }
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const response = await fetch('/api/admin/section-settings/home_categories', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify(formData)
      });
      
      if (response.ok) {
        setSnackbar({ open: true, message: 'Section updated successfully!', severity: 'success' });
      } else {
        setSnackbar({ open: true, message: 'Failed to update section', severity: 'error' });
      }
    } catch (error) {
      console.error('Update error:', error);
      setSnackbar({ open: true, message: 'Error updating section', severity: 'error' });
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return <Box p={3}><CircularProgress /></Box>;
  }

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" sx={{ mb: 3 }}>Product Categories Section Settings</Typography>
      
      <Paper sx={{ p: 3, maxWidth: 800 }}>
        <Typography variant="body1" sx={{ mb: 3, color: 'text.secondary' }}>
          Update the text and configuration for the Product Categories grid on the Home Page.
        </Typography>

        <Box component="form" onSubmit={handleSubmit} sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
          <TextField 
            label="Subtitle (e.g. OUR CATEGORIES)" 
            name="subtitle" 
            value={formData.subtitle} 
            onChange={handleInputChange} 
            fullWidth 
          />
          <TextField 
            label="Title (e.g. Premium Export Products)" 
            name="title" 
            value={formData.title} 
            onChange={handleInputChange} 
            fullWidth 
            required 
          />
          <TextField 
            label="Description" 
            name="description" 
            value={formData.description} 
            onChange={handleInputChange} 
            fullWidth 
            multiline 
            rows={4} 
          />

          <Typography variant="h6" sx={{ mt: 2 }}>Display Settings</Typography>
          
          <FormControl fullWidth>
            <InputLabel>Category Limit</InputLabel>
            <Select
              name="limit"
              value={formData.extra_data?.limit || 'All'}
              onChange={handleExtraDataChange}
              label="Category Limit"
            >
              <MenuItem value="All">Show All Categories</MenuItem>
              <MenuItem value="4">Show 4 Categories</MenuItem>
              <MenuItem value="8">Show 8 Categories</MenuItem>
              <MenuItem value="12">Show 12 Categories</MenuItem>
            </Select>
          </FormControl>

          <FormControl fullWidth>
            <InputLabel>Select Specific Categories (Optional)</InputLabel>
            <Select
              multiple
              name="selected_categories"
              value={formData.extra_data?.selected_categories || []}
              onChange={handleExtraDataChange}
              input={<OutlinedInput label="Select Specific Categories (Optional)" />}
              renderValue={(selected) => selected.map(id => allCategories.find(c => c.id === id)?.name).join(', ')}
            >
              {allCategories.map((category) => (
                <MenuItem key={category.id} value={category.id}>
                  <Checkbox checked={(formData.extra_data?.selected_categories || []).indexOf(category.id) > -1} />
                  <ListItemText primary={category.name} />
                </MenuItem>
              ))}
            </Select>
            <Typography variant="caption" sx={{ mt: 1, color: 'text.secondary' }}>
              If you select specific categories, only these will be shown (up to the limit). If left empty, it will show categories automatically based on their display order.
            </Typography>
          </FormControl>

          <Box sx={{ mt: 2 }}>
            <Button 
              type="submit" 
              variant="contained" 
              color="primary" 
              disabled={saving}
            >
              {saving ? 'Saving...' : 'Save Changes'}
            </Button>
          </Box>
        </Box>
      </Paper>
      <Snackbar open={snackbar.open} autoHideDuration={6000} onClose={handleCloseSnackbar} anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}>
        <Alert onClose={handleCloseSnackbar} severity={snackbar.severity} sx={{ width: '100%' }}>
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
}
