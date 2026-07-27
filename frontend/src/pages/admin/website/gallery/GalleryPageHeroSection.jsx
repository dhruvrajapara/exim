import React, { useState, useEffect, useRef } from 'react';
import { 
  Box, Typography, TextField, Button, Paper, CircularProgress, 
  Snackbar, Alert
} from '@mui/material';
import ImageIcon from '@mui/icons-material/Image';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';

export default function GalleryPageHeroSection() {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    extra_data: {
      backgroundColor: '#EAF4FF',
      textColor: '#1F2937',
      backgroundImage: null
    }
  });
  
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const fileInputRef = useRef(null);

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });

  const handleCloseSnackbar = () => setSnackbar({ ...snackbar, open: false });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const settingsRes = await fetch('/api/section-settings/gallery_page_hero');
      if (settingsRes.ok) {
        const resJson = await settingsRes.json();
        const settingsData = resJson.data;
        if (settingsData) {
          setFormData({
            title: settingsData.title || '',
            description: settingsData.description || '',
            extra_data: settingsData.extra_data || { backgroundColor: '#EAF4FF', textColor: '#1F2937' }
          });
          if (settingsData.extra_data && settingsData.extra_data.backgroundImage) {
            setImagePreview(settingsData.extra_data.backgroundImage);
          }
        }
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

  const handleImageClick = () => {
    fileInputRef.current?.click();
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        alert("Image size must be less than 5MB. Please choose a smaller image.");
        e.target.value = '';
        return;
      }
      setImageFile(file);
      setImagePreview(URL.createObjectURL(file));
      
      // Clear the remove_image flag if they picked a new one
      setFormData(prev => ({
        ...prev,
        remove_image: false
      }));
    }
  };

  const handleRemoveImage = (e) => {
    e.stopPropagation();
    setImageFile(null);
    setImagePreview(null);
    if (fileInputRef.current) fileInputRef.current.value = '';
    
    // Tell backend to remove the image
    setFormData(prev => ({
      ...prev,
      remove_image: true,
      extra_data: {
        ...prev.extra_data,
        backgroundImage: null
      }
    }));
  };

  const handleReset = () => {
    setFormData({
      ...formData,
      extra_data: {
        ...formData.extra_data,
        backgroundColor: '#EAF4FF',
        textColor: '#1F2937',
        descriptionColor: '#4B5563',
        overlayColor: '#000000',
        overlayOpacity: 40
      }
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const submitData = new FormData();
      submitData.append('title', formData.title);
      submitData.append('description', formData.description);
      submitData.append('extra_data', JSON.stringify(formData.extra_data));
      submitData.append('_method', 'PUT');
      
      if (imageFile) {
        submitData.append('image', imageFile);
      }
      if (formData.remove_image) {
        submitData.append('remove_image', '1');
      }

      const response = await fetch('/api/admin/section-settings/gallery_page_hero', {
        method: 'POST',
        headers: {
          'Accept': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('admin_token')}`
        },
        body: submitData
      });
      
      if (response.ok) {
        const resJson = await response.json();
        
        // Update local state with the saved data
        if (resJson.data && resJson.data.extra_data) {
           setFormData(prev => ({
             ...prev,
             extra_data: resJson.data.extra_data,
             remove_image: false
           }));
           if (resJson.data.extra_data.backgroundImage) {
             setImagePreview(resJson.data.extra_data.backgroundImage);
           }
        }
        
        setImageFile(null); // Clear pending file upload
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
      <Typography variant="h4" sx={{ mb: 3 }}>Gallery Page Hero Settings</Typography>
      
      <Paper sx={{ p: 3, maxWidth: 800 }}>
        <Typography variant="body1" sx={{ mb: 3, color: 'text.secondary' }}>
          Update the dynamic text, colors, and background image for the Hero Banner on the Gallery Page.
        </Typography>

        <Box component="form" onSubmit={handleSubmit} sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
          <TextField 
            label="Title (e.g. Image Gallery)" 
            name="title" 
            value={formData.title} 
            onChange={handleInputChange} 
            fullWidth 
            required 
          />
          <TextField 
            label="Description (e.g. Discover our export-grade...)" 
            name="description" 
            value={formData.description} 
            onChange={handleInputChange} 
            fullWidth 
            multiline 
            rows={4} 
          />
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              <TextField 
                label="Background Color" 
                name="backgroundColor" 
                value={formData.extra_data?.backgroundColor || '#EAF4FF'} 
                onChange={handleExtraDataChange} 
                fullWidth 
                helperText="Shown behind image, or as gradient"
              />
              <input 
                type="color" 
                name="backgroundColor" 
                value={formData.extra_data?.backgroundColor || '#EAF4FF'} 
                onChange={handleExtraDataChange} 
                style={{ width: '50px', height: '50px', cursor: 'pointer', padding: 0, border: 'none', marginBottom: '22px' }}
              />
            </Box>
            
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              <TextField 
                label="Title Color" 
                name="textColor" 
                value={formData.extra_data?.textColor || '#1F2937'} 
                onChange={handleExtraDataChange} 
                fullWidth 
                helperText="Main title text color"
              />
              <input 
                type="color" 
                name="textColor" 
                value={formData.extra_data?.textColor || '#1F2937'} 
                onChange={handleExtraDataChange} 
                style={{ width: '50px', height: '50px', cursor: 'pointer', padding: 0, border: 'none', marginBottom: '22px' }}
              />
            </Box>

            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              <TextField 
                label="Description Color" 
                name="descriptionColor" 
                value={formData.extra_data?.descriptionColor || '#4B5563'} 
                onChange={handleExtraDataChange} 
                fullWidth 
                helperText="Subtitle text color"
              />
              <input 
                type="color" 
                name="descriptionColor" 
                value={formData.extra_data?.descriptionColor || '#4B5563'} 
                onChange={handleExtraDataChange} 
                style={{ width: '50px', height: '50px', cursor: 'pointer', padding: 0, border: 'none', marginBottom: '22px' }}
              />
            </Box>
          </div>

          <div className="mt-2">
            <label className="block text-sm font-medium text-gray-700 mb-2">Background Image (Optional)</label>
            <div 
              onClick={handleImageClick}
              className="w-full h-[200px] border-2 border-dashed border-gray-300 rounded-xl flex flex-col items-center justify-center cursor-pointer hover:bg-gray-50 hover:border-[#0B63CE] transition-all overflow-hidden group relative bg-gray-50 mb-4"
            >
              {imagePreview ? (
                <>
                  <img src={imagePreview} alt="Preview" className="w-full h-full object-cover" />
                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-4">
                    <div className="bg-white text-gray-800 px-4 py-2 rounded-lg text-sm font-medium flex items-center shadow-lg hover:bg-gray-100">
                      <EditIcon fontSize="small" className="mr-2" /> Change Image
                    </div>
                    <div 
                      onClick={handleRemoveImage}
                      className="bg-red-500 text-white px-4 py-2 rounded-lg text-sm font-medium flex items-center shadow-lg hover:bg-red-600"
                    >
                      <DeleteIcon fontSize="small" className="mr-2" /> Remove
                    </div>
                  </div>
                </>
              ) : (
                <div className="text-center p-6">
                  <div className="w-16 h-16 bg-white shadow-sm rounded-full flex items-center justify-center mx-auto mb-4 text-[#0B63CE]">
                    <ImageIcon fontSize="large" />
                  </div>
                  <p className="text-gray-600 font-medium">Click to upload background image</p>
                  <p className="text-gray-400 text-sm mt-1">SVG, PNG, JPG (max. 5MB)</p>
                </div>
              )}
              
              <input 
                type="file"
                ref={fileInputRef}
                onChange={handleImageChange}
                accept="image/*"
                className="hidden"
              />
            </div>
            
            {imagePreview && (
              <div className="mt-4 p-4 border border-gray-200 rounded-lg bg-white">
                <Typography variant="subtitle2" sx={{ mb: 2 }}>Image Overlay Settings</Typography>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                    <TextField 
                      label="Overlay Color" 
                      name="overlayColor" 
                      value={formData.extra_data?.overlayColor || '#000000'} 
                      onChange={handleExtraDataChange} 
                      fullWidth 
                    />
                    <input 
                      type="color" 
                      name="overlayColor" 
                      value={formData.extra_data?.overlayColor || '#000000'} 
                      onChange={handleExtraDataChange} 
                      style={{ width: '50px', height: '50px', cursor: 'pointer', padding: 0, border: 'none' }}
                    />
                  </Box>

                  <Box>
                    <Typography variant="body2" color="text.secondary" gutterBottom>
                      Overlay Opacity: {formData.extra_data?.overlayOpacity ?? 40}%
                    </Typography>
                    <input 
                      type="range" 
                      name="overlayOpacity" 
                      min="0" 
                      max="100" 
                      value={formData.extra_data?.overlayOpacity ?? 40} 
                      onChange={handleExtraDataChange}
                      className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                    />
                    <Typography variant="caption" color="text.secondary">
                      0% is completely transparent, 100% is solid color.
                    </Typography>
                  </Box>
                </div>
              </div>
            )}
          </div>

          <Box sx={{ mt: 2, display: 'flex', gap: 2 }}>
            <Button 
              type="submit" 
              variant="contained" 
              color="primary" 
              disabled={saving}
            >
              {saving ? 'Saving...' : 'Save Changes'}
            </Button>
            <Button 
              type="button" 
              variant="outlined" 
              color="secondary" 
              onClick={handleReset}
              disabled={saving}
            >
              Reset Colors to Default
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
