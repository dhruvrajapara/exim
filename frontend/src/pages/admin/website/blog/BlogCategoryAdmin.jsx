import React, { useState, useEffect } from 'react';
import { 
  Box, Typography, Button, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper,
  IconButton, Dialog, DialogTitle, DialogContent, DialogActions, TextField
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import AddIcon from '@mui/icons-material/Add';
import { toast } from 'sonner';

export default function BlogCategoryAdmin() {
  const [categories, setCategories] = useState([]);
  const [open, setOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    slug: ''
  });

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      const response = await fetch('/api/admin/blog-categories'); // we'll use the public route if needed, or admin route if we set it up. Let's use the GET route we made
      // Wait, in api.php we registered it publicly as GET /api/blog-categories, so:
      const res = await fetch('/api/blog-categories');
      if (res.ok) {
        const data = await res.json();
        setCategories(data.data);
      }
    } catch (error) {
      console.error('Error fetching categories', error);
      toast.error('Failed to load categories');
    }
  };

  const handleOpen = (category = null) => {
    if (category) {
      setEditingId(category.id);
      setFormData({
        name: category.name,
        slug: category.slug
      });
    } else {
      setEditingId(null);
      setFormData({
        name: '',
        slug: ''
      });
    }
    setOpen(true);
  };

  const handleClose = () => setOpen(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
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
         [name]: value
       });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      let url = '/api/admin/blog-categories';
      let method = 'POST';

      if (editingId) {
        url = `/api/admin/blog-categories/${editingId}`;
        method = 'PUT';
      }

      const response = await fetch(url, {
        method: method,
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData)
      });

      if (response.ok) {
        toast.success(`Category ${editingId ? 'updated' : 'added'} successfully`);
        fetchCategories();
        handleClose();
      } else {
        const err = await response.json();
        toast.error(err.message || 'Error saving category');
      }
    } catch (error) {
      console.error('Save error', error);
      toast.error('An error occurred');
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this category?')) {
      try {
        const response = await fetch(`/api/admin/blog-categories/${id}`, {
          method: 'DELETE',
          headers: {
            'Accept': 'application/json'
          }
        });
        if (response.ok) {
          toast.success('Category deleted');
          fetchCategories();
        } else {
            toast.error('Failed to delete');
        }
      } catch (error) {
        console.error('Delete error', error);
      }
    }
  };

  return (
    <Box sx={{ p: 3 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
        <Typography variant="h4">Blog Categories</Typography>
        <Button variant="contained" startIcon={<AddIcon />} onClick={() => handleOpen()}>
          Add Category
        </Button>
      </Box>

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>ID</TableCell>
              <TableCell>Name</TableCell>
              <TableCell>Slug</TableCell>
              <TableCell align="right">Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {categories.length > 0 ? (
                categories.map((category) => (
                <TableRow key={category.id}>
                    <TableCell>{category.id}</TableCell>
                    <TableCell sx={{ fontWeight: 500 }}>{category.name}</TableCell>
                    <TableCell sx={{ color: 'text.secondary' }}>{category.slug}</TableCell>
                    <TableCell align="right">
                    <IconButton onClick={() => handleOpen(category)} color="primary">
                        <EditIcon />
                    </IconButton>
                    <IconButton onClick={() => handleDelete(category.id)} color="error">
                        <DeleteIcon />
                    </IconButton>
                    </TableCell>
                </TableRow>
                ))
            ) : (
                <TableRow>
                    <TableCell colSpan={4} align="center" sx={{ py: 3 }}>
                        No categories found. Click 'Add Category' to create one.
                    </TableCell>
                </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>

      <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
        <form onSubmit={handleSubmit}>
            <DialogTitle>{editingId ? 'Edit Category' : 'Add Category'}</DialogTitle>
            <DialogContent>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 2 }}>
                <TextField 
                    label="Category Name" 
                    name="name" 
                    value={formData.name} 
                    onChange={handleInputChange} 
                    fullWidth 
                    required 
                    autoFocus
                />
                <TextField 
                    label="Slug (Auto-generated)" 
                    name="slug" 
                    value={formData.slug} 
                    onChange={handleInputChange} 
                    fullWidth 
                    required 
                    disabled 
                    helperText="This will be used in the URL: /blog/category/slug"
                />
            </Box>
            </DialogContent>
            <DialogActions sx={{ p: 2, pt: 0 }}>
            <Button onClick={handleClose}>Cancel</Button>
            <Button type="submit" variant="contained" color="primary">
                Save Category
            </Button>
            </DialogActions>
        </form>
      </Dialog>
    </Box>
  );
}
