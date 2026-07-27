import React, { useState, useEffect } from 'react';
import { 
  Box, Typography, Button, TextField, Switch, FormControlLabel,
  FormControl, InputLabel, Select, MenuItem, Paper, Grid
} from '@mui/material';
import PhotoCamera from '@mui/icons-material/PhotoCamera';
import { useNavigate, useParams } from 'react-router-dom';
import { toast } from 'sonner';
import ReactQuill from 'react-quill-new';
import 'react-quill-new/dist/quill.snow.css';

export default function BlogPostForm() {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEditing = !!id;

  const [categories, setCategories] = useState([]);
  const [previewImage, setPreviewImage] = useState('');
  
  const [formData, setFormData] = useState({
    title: '',
    category_id: '',
    short_description: '',
    content: '',
    published_date: new Date().toISOString().split('T')[0], // YYYY-MM-DD
    reading_time: '',
    is_active: true,
    is_featured: false,
    featured_image: null
  });

  useEffect(() => {
    fetchCategories();
    if (isEditing) {
      fetchBlog();
    }
  }, [id]);

  const fetchCategories = async () => {
    try {
      const response = await fetch('/api/blog-categories');
      if (response.ok) {
        const data = await response.json();
        setCategories(data.data);
      }
    } catch (error) {
      console.error('Error fetching categories', error);
    }
  };

  const fetchBlog = async () => {
    try {
      // In admin context, we fetch all blogs and find the one, or ideally we'd have a show endpoint by ID
      const response = await fetch('/api/admin/blogs');
      if (response.ok) {
        const data = await response.json();
        const blog = data.data.find(b => b.id === parseInt(id));
        if (blog) {
          setFormData({
            title: blog.title,
            category_id: blog.category_id || '',
            short_description: blog.short_description || '',
            content: blog.content || '',
            published_date: blog.published_date ? new Date(blog.published_date).toISOString().split('T')[0] : '',
            reading_time: blog.reading_time || '',
            is_active: blog.is_active,
            is_featured: blog.is_featured,
            featured_image: null
          });
          setPreviewImage(blog.featured_image ? `http://localhost:8000${blog.featured_image}` : '');
        }
      }
    } catch (error) {
      console.error('Error fetching blog', error);
    }
  };

  const handleInputChange = (e) => {
    const { name, value, checked, type } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value
    });
  };

  const handleQuillChange = (content) => {
    setFormData({ ...formData, content });
  };

  const handleImageChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setFormData({ ...formData, featured_image: file });
      setPreviewImage(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const data = new FormData();
    
    Object.keys(formData).forEach(key => {
      if (key === 'featured_image') {
        if (formData[key]) data.append('featured_image', formData[key]);
      } else if (key === 'is_active' || key === 'is_featured') {
        data.append(key, formData[key] ? 1 : 0);
      } else {
        data.append(key, formData[key]);
      }
    });

    try {
      let url = '/api/admin/blogs';
      if (isEditing) {
        url = `/api/admin/blogs/${id}`;
        data.append('_method', 'PUT'); // For laravel multipart form data PUT spoofing
      }

      const response = await fetch(url, {
        method: 'POST', // use POST always when sending FormData (because of _method=PUT)
        body: data,
        headers: {
            'Accept': 'application/json'
        }
      });

      if (response.ok) {
        toast.success(`Blog post ${isEditing ? 'updated' : 'created'} successfully`);
        navigate('/admin/website/blog/posts');
      } else {
        const err = await response.json();
        toast.error(err.message || 'Error saving blog post');
      }
    } catch (error) {
      console.error('Save error', error);
      toast.error('An error occurred');
    }
  };

  return (
    <Box sx={{ p: 3 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
        <Typography variant="h4">{isEditing ? 'Edit Blog Post' : 'Create Blog Post'}</Typography>
        <Button variant="outlined" onClick={() => navigate('/admin/website/blog/posts')}>
          Back to List
        </Button>
      </Box>

      <form onSubmit={handleSubmit}>
        <Grid container spacing={3}>
            
          {/* Left Column - 70% */}
          <Grid item xs={12} md={8}>
            <Paper sx={{ p: 3, display: 'flex', flexDirection: 'column', gap: 3 }}>
              <TextField 
                label="Post Title" 
                name="title" 
                value={formData.title} 
                onChange={handleInputChange} 
                fullWidth 
                required 
              />
              <TextField 
                label="Short Description (For SEO & Hero section)" 
                name="short_description" 
                value={formData.short_description} 
                onChange={handleInputChange} 
                multiline 
                rows={3}
                fullWidth 
                required 
              />
              
              <Box>
                <Typography variant="subtitle2" sx={{ mb: 1, color: 'text.secondary' }}>Content</Typography>
                <ReactQuill 
                  theme="snow" 
                  value={formData.content} 
                  onChange={handleQuillChange} 
                  style={{ height: '300px', marginBottom: '50px' }}
                />
              </Box>
            </Paper>
          </Grid>

          {/* Right Column - 30% */}
          <Grid item xs={12} md={4}>
            <Paper sx={{ p: 3, display: 'flex', flexDirection: 'column', gap: 3 }}>
              
              {/* Featured Image */}
              <Box sx={{ textAlign: 'center', border: '1px dashed #ccc', borderRadius: 2, p: 2, bgcolor: '#f9f9f9' }}>
                  <Typography variant="subtitle2" sx={{ mb: 2 }}>Featured Image</Typography>
                  <input
                      accept="image/*"
                      style={{ display: 'none' }}
                      id="featured-image-file"
                      type="file"
                      onChange={handleImageChange}
                  />
                  <label htmlFor="featured-image-file">
                      <Button variant="outlined" component="span" startIcon={<PhotoCamera />}>
                          Upload Image
                      </Button>
                  </label>
                  {previewImage && (
                      <Box mt={2} sx={{ display: 'flex', justifyContent: 'center' }}>
                          <img src={previewImage} alt="Preview" style={{ width: '100%', maxHeight: '200px', objectFit: 'cover', borderRadius: '8px' }} />
                      </Box>
                  )}
                  {!previewImage && isEditing && (
                    <Typography color="error" variant="caption" sx={{ display: 'block', mt: 1 }}>Required</Typography>
                  )}
              </Box>

              <FormControl fullWidth required>
                <InputLabel>Category</InputLabel>
                <Select
                  name="category_id"
                  value={formData.category_id}
                  onChange={handleInputChange}
                  label="Category"
                >
                  {categories.map(cat => (
                    <MenuItem key={cat.id} value={cat.id}>{cat.name}</MenuItem>
                  ))}
                </Select>
              </FormControl>

              <TextField 
                label="Published Date" 
                type="date"
                name="published_date" 
                value={formData.published_date} 
                onChange={handleInputChange} 
                fullWidth 
                required 
                InputLabelProps={{ shrink: true }}
              />

              <TextField 
                label="Reading Time (e.g., 5 min read)" 
                name="reading_time" 
                value={formData.reading_time} 
                onChange={handleInputChange} 
                fullWidth 
              />

              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                <FormControlLabel
                  control={<Switch checked={formData.is_active} onChange={handleInputChange} name="is_active" />}
                  label="Publish Status (Active/Draft)"
                />
                <FormControlLabel
                  control={<Switch checked={formData.is_featured} onChange={handleInputChange} name="is_featured" />}
                  label="Featured Post"
                />
              </Box>

              <Button type="submit" variant="contained" color="primary" size="large" sx={{ mt: 2 }}>
                  {isEditing ? 'Update Post' : 'Publish Post'}
              </Button>
            </Paper>
          </Grid>

        </Grid>
      </form>
    </Box>
  );
}
