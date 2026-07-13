import React, { useState, useEffect } from 'react';
import { Box, Typography, TextField, Button, Paper, CircularProgress, Snackbar, Alert } from '@mui/material';

export default function ProductCategoriesSection() {
  const [formData, setFormData] = useState({
    subtitle: '',
    title: '',
    description: ''
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });

  const handleCloseSnackbar = () => setSnackbar({ ...snackbar, open: false });

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    try {
      const response = await fetch('/api/section-settings/home_categories');
      if (response.ok) {
        const data = await response.json();
        if (data.data) {
          setFormData({
            subtitle: data.data.subtitle || '',
            title: data.data.title || '',
            description: data.data.description || ''
          });
        }
      }
    } catch (error) {
      console.error('Failed to fetch section settings:', error);
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
          Update the text that appears above the Product Categories grid on the Home Page.
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

          <Box>
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
