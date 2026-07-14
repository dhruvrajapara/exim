import React, { useState, useEffect } from 'react';
import { 
  Box, Typography, Button, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper,
  IconButton, Dialog, DialogTitle, DialogContent, DialogActions, TextField, Switch, FormControlLabel
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import AddIcon from '@mui/icons-material/Add';
import PhotoCamera from '@mui/icons-material/PhotoCamera';

export default function Products() {
  const [products, setProducts] = useState([]);
  const [open, setOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    slug: '',
    short_description: '',
    is_active: true,
    is_featured: false,
    display_order: 0,
    image: null
  });
  const [previewImage, setPreviewImage] = useState('');

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const response = await fetch('/api/admin/products');
      if (response.ok) {
        const data = await response.json();
        setProducts(data.data);
      }
    } catch (error) {
      console.error('Error fetching products', error);
    }
  };

  const handleOpen = (product = null) => {
    if (product) {
      setEditingId(product.id);
      setFormData({
        name: product.name,
        slug: product.slug,
        short_description: product.short_description || '',
        is_active: product.is_active,
        is_featured: product.is_featured,
        display_order: product.display_order || 0,
        image: null
      });
      setPreviewImage(product.image_path || '');
    } else {
      setEditingId(null);
      setFormData({
        name: '',
        slug: '',
        short_description: '',
        is_active: true,
        is_featured: false,
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
      } else if (key === 'is_active' || key === 'is_featured') {
        data.append(key, formData[key] ? 1 : 0);
      } else if (formData[key] !== null && key !== 'image') {
        data.append(key, formData[key]);
      }
    });

    try {
      let url = '/api/admin/products';
      let method = 'POST';

      if (editingId) {
        url = `/api/admin/products/${editingId}`;
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
        fetchProducts();
        handleClose();
      } else {
        const err = await response.json();
        alert('Error saving product: ' + JSON.stringify(err));
      }
    } catch (error) {
      console.error('Save error', error);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this product?')) {
      try {
        const response = await fetch(`/api/admin/products/${id}`, {
          method: 'DELETE',
          headers: {
            'Accept': 'application/json'
          }
        });
        if (response.ok) {
          fetchProducts();
        }
      } catch (error) {
        console.error('Delete error', error);
      }
    }
  };

  return (
    <Box sx={{ p: 3 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
        <Typography variant="h4">Products</Typography>
        <Button variant="contained" startIcon={<AddIcon />} onClick={() => handleOpen()}>
          Add Product
        </Button>
      </Box>

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Image</TableCell>
              <TableCell>Name</TableCell>
              <TableCell>Featured</TableCell>
              <TableCell>Order</TableCell>
              <TableCell>Status</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {products.map((product) => (
              <TableRow key={product.id}>
                <TableCell>
                  {product.image_path ? (
                    <img src={`http://localhost:8000${product.image_path}`} alt={product.name} style={{ width: 50, height: 50, objectFit: 'cover' }} />
                  ) : 'No Image'}
                </TableCell>
                <TableCell>{product.name}</TableCell>
                <TableCell>{product.is_featured ? 'Yes' : 'No'}</TableCell>
                <TableCell>{product.display_order}</TableCell>
                <TableCell>{product.is_active ? 'Active' : 'Inactive'}</TableCell>
                <TableCell>
                  <IconButton onClick={() => handleOpen(product)} color="primary">
                    <EditIcon />
                  </IconButton>
                  <IconButton onClick={() => handleDelete(product.id)} color="error">
                    <DeleteIcon />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
        <DialogTitle>{editingId ? 'Edit Product' : 'Add Product'}</DialogTitle>
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
            <TextField label="Short Description" name="short_description" value={formData.short_description} onChange={handleInputChange} fullWidth multiline rows={3} />
            <TextField label="Display Order" name="display_order" type="number" value={formData.display_order} onChange={handleInputChange} fullWidth />
            
            <Box sx={{ display: 'flex', gap: 2 }}>
                <FormControlLabel
                control={<Switch checked={formData.is_active} onChange={handleInputChange} name="is_active" />}
                label="Active"
                />
                <FormControlLabel
                control={<Switch checked={formData.is_featured} onChange={handleInputChange} name="is_featured" />}
                label="Featured (Shows on Home Page)"
                />
            </Box>
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
