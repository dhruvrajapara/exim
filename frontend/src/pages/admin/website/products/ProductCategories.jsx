import React, { useState, useEffect } from 'react';
import { 
  Box, Typography, Button, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper,
  IconButton, Dialog, DialogTitle, DialogContent, DialogActions, TextField, Switch, FormControlLabel
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import AddIcon from '@mui/icons-material/Add';
import PhotoCamera from '@mui/icons-material/PhotoCamera';

export default function ProductCategories() {
  const [categories, setCategories] = useState([]);
  const [open, setOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    slug: '',
    description: '',
    is_active: true,
    display_order: 0,
    image: null
  });
  const [previewImage, setPreviewImage] = useState('');

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      const response = await fetch('/api/admin/product-categories');
      if (response.ok) {
        const data = await response.json();
        setCategories(data.data);
      }
    } catch (error) {
      console.error('Error fetching categories', error);
    }
  };

  const handleOpen = (category = null) => {
    if (category) {
      setEditingId(category.id);
      setFormData({
        name: category.name,
        slug: category.slug,
        description: category.description || '',
        is_active: category.is_active,
        display_order: category.display_order || 0,
        image: null
      });
      setPreviewImage(category.image_path || '');
    } else {
      setEditingId(null);
      setFormData({
        name: '',
        slug: '',
        description: '',
        is_active: true,
        display_order: 0,
        image: null
      });
      setPreviewImage('');
    }
    setOpen(true);
  };

  const handleClose = () => setOpen(false);

  const handleInputChange = (e) => {
    const { name, value, checked, type } = e.target;
    if (name === 'name') {
       // always auto-generate slug from name
       setFormData({
           ...formData,
           name: value,
           slug: value.toLowerCase().replace(/\s+/g, '-').replace(/[^\w-]+/g, '')
       });
    } else {
       setFormData({
         ...formData,
         [name]: type === 'checkbox' ? checked : value
       });
    }
  };

  const handleImageChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setFormData({ ...formData, image: file });
      setPreviewImage(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const data = new FormData();
    Object.keys(formData).forEach(key => {
      if (key === 'image' && formData[key]) {
        data.append('image', formData[key]);
      } else if (key === 'is_active') {
        data.append('is_active', formData[key] ? 1 : 0);
      } else if (formData[key] !== null && key !== 'image') {
        data.append(key, formData[key]);
      }
    });

    try {
      let url = '/api/admin/product-categories';
      let method = 'POST';

      if (editingId) {
        url = `/api/admin/product-categories/${editingId}`;
        data.append('_method', 'PUT'); // Laravel workaround for FormData PUT
      }

      const response = await fetch(url, {
        method: 'POST', // use POST for both due to _method=PUT
        body: data,
        headers: {
            'Accept': 'application/json'
        }
      });

      if (response.ok) {
        fetchCategories();
        handleClose();
      } else {
        const err = await response.json();
        alert('Error saving category: ' + JSON.stringify(err));
      }
    } catch (error) {
      console.error('Save error', error);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this category?')) {
      try {
        const response = await fetch(`/api/admin/product-categories/${id}`, {
          method: 'DELETE',
          headers: {
            'Accept': 'application/json'
          }
        });
        if (response.ok) {
          fetchCategories();
        }
      } catch (error) {
        console.error('Delete error', error);
      }
    }
  };

  return (
    <Box sx={{ p: 3 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
        <Typography variant="h4">Product Categories</Typography>
        <Button variant="contained" startIcon={<AddIcon />} onClick={() => handleOpen()}>
          Add Category
        </Button>
      </Box>

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Image</TableCell>
              <TableCell>Name</TableCell>
              <TableCell>Slug</TableCell>
              <TableCell>Order</TableCell>
              <TableCell>Status</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {categories.map((category) => (
              <TableRow key={category.id}>
                <TableCell>
                  {category.image_path ? (
                    <img src={`http://localhost:8000${category.image_path}`} alt={category.name} style={{ width: 50, height: 50, objectFit: 'cover' }} />
                  ) : 'No Image'}
                </TableCell>
                <TableCell>{category.name}</TableCell>
                <TableCell>{category.slug}</TableCell>
                <TableCell>{category.display_order}</TableCell>
                <TableCell>{category.is_active ? 'Active' : 'Inactive'}</TableCell>
                <TableCell>
                  <IconButton onClick={() => handleOpen(category)} color="primary">
                    <EditIcon />
                  </IconButton>
                  <IconButton onClick={() => handleDelete(category.id)} color="error">
                    <DeleteIcon />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
        <DialogTitle>{editingId ? 'Edit Category' : 'Add Category'}</DialogTitle>
        <DialogContent>
          <Box component="form" sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 2 }}>
            <Box sx={{ textAlign: 'center' }}>
                <input
                    accept="image/*"
                    style={{ display: 'none' }}
                    id="icon-button-file"
                    type="file"
                    onChange={handleImageChange}
                />
                <label htmlFor="icon-button-file">
                    <IconButton color="primary" aria-label="upload picture" component="span">
                        <PhotoCamera />
                    </IconButton>
                    <Typography variant="body2">Upload Image</Typography>
                </label>
                {previewImage && (
                    <Box mt={2}>
                        <img src={previewImage.startsWith('blob:') ? previewImage : `http://localhost:8000${previewImage}`} alt="Preview" style={{ width: 100, height: 100, objectFit: 'cover' }} />
                    </Box>
                )}
            </Box>

            <TextField label="Name" name="name" value={formData.name} onChange={handleInputChange} fullWidth required />
            <TextField label="Slug (Auto-generated)" name="slug" value={formData.slug} onChange={handleInputChange} fullWidth required disabled />
            <TextField label="Description" name="description" value={formData.description} onChange={handleInputChange} fullWidth multiline rows={3} />
            <TextField label="Display Order" name="display_order" type="number" value={formData.display_order} onChange={handleInputChange} fullWidth />
            <FormControlLabel
              control={<Switch checked={formData.is_active} onChange={handleInputChange} name="is_active" />}
              label="Active"
            />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Cancel</Button>
          <Button onClick={handleSubmit} variant="contained" color="primary">
            Save
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
