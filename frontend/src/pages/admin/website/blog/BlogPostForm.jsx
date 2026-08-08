import React, { useState, useEffect, useRef, useMemo } from 'react';
import { 
  Box, Typography, Button, TextField, Switch, FormControlLabel,
  FormControl, InputLabel, Select, MenuItem, Paper, Grid,
  Dialog, DialogTitle, DialogContent, DialogActions, IconButton
} from '@mui/material';
import PhotoCamera from '@mui/icons-material/PhotoCamera';
import TableChartIcon from '@mui/icons-material/TableChart';
import AddIcon from '@mui/icons-material/Add';
import DeleteIcon from '@mui/icons-material/Delete';
import { useNavigate, useParams } from 'react-router-dom';
import { toast } from 'sonner';
import ReactQuill from 'react-quill-new';
import 'react-quill-new/dist/quill.snow.css';

export default function BlogPostForm() {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEditing = !!id;
  const quillRef = useRef(null);

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

  // Dynamic Table Builder State
  const [tableDialogOpen, setTableDialogOpen] = useState(false);
  const [tableData, setTableData] = useState({
    rows: [
      ['Feature', 'Dehydrated Onion', 'Fresh Onion'],
      ['Moisture', 'Low', 'High']
    ]
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
          setPreviewImage(blog.featured_image ? blog.featured_image : '');
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

  // Table Builder Functions
  const handleAddColumn = () => {
    setTableData(prev => ({
      rows: prev.rows.map(row => [...row, ''])
    }));
  };

  const handleRemoveColumn = (colIndex) => {
    if (tableData.rows[0].length <= 1) return;
    setTableData(prev => ({
      rows: prev.rows.map(row => row.filter((_, i) => i !== colIndex))
    }));
  };

  const handleAddRow = () => {
    setTableData(prev => ({
      rows: [...prev.rows, new Array(prev.rows[0].length).fill('')]
    }));
  };

  const handleRemoveRow = (rowIndex) => {
    if (tableData.rows.length <= 1) return;
    setTableData(prev => ({
      rows: prev.rows.filter((_, i) => i !== rowIndex)
    }));
  };

  const handleCellChange = (val, rowIndex, colIndex) => {
    setTableData(prev => {
      const newRows = [...prev.rows];
      newRows[rowIndex] = [...newRows[rowIndex]];
      newRows[rowIndex][colIndex] = val;
      return { rows: newRows };
    });
  };

  const insertDynamicTable = () => {
    let tbodyHtml = tableData.rows.map((row, i) => {
      const bgColor = i % 2 !== 0 ? '#fafafa' : '#ffffff';
      const rowHtml = row.map((cell) => 
        `<td style="padding: 16px; border: 1px solid #e0e0e0;">${cell}</td>`
      ).join('');
      return `<tr style="background-color: ${bgColor};">${rowHtml}</tr>`;
    }).join('');

    const tableHtml = `
      <div style="overflow-x: auto; margin: 20px 0;">
        <table style="width: 100%; border-collapse: collapse; text-align: left; border: 1px solid #e0e0e0; font-family: sans-serif;">
          <tbody>
            ${tbodyHtml}
          </tbody>
        </table>
      </div>
      <p><br></p>
    `;
    
    // Append to current content
    setFormData(prev => ({
      ...prev,
      content: prev.content + tableHtml
    }));
    toast.success("Table inserted into content");
    setTableDialogOpen(false);
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

  // Configure quill modules
  const modules = useMemo(() => ({
    toolbar: [
      [{ 'header': [1, 2, 3, 4, 5, 6, false] }],
      ['bold', 'italic', 'underline', 'strike'],
      [{ 'list': 'ordered'}, { 'list': 'bullet' }],
      [{ 'color': [] }, { 'background': [] }],
      [{ 'align': [] }],
      ['link', 'image', 'video'],
      ['clean']
    ]
  }), []);

  return (
    <Box sx={{ p: 3 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
        <Typography variant="h4">{isEditing ? 'Edit Blog Post' : 'Create Blog Post'}</Typography>
        <Button variant="outlined" onClick={() => navigate('/admin/website/blog/posts')}>
          Back to List
        </Button>
      </Box>

      <form onSubmit={handleSubmit}>
        <Box sx={{ display: 'flex', flexDirection: { xs: 'column', md: 'row' }, gap: 3 }}>
            
          {/* Left Column - 70% */}
          <Box sx={{ flex: { xs: '1 1 100%', md: '0 0 calc(66.666% - 12px)' }, maxWidth: { xs: '100%', md: 'calc(66.666% - 12px)' } }}>
            <Paper sx={{ p: 3, display: 'flex', flexDirection: 'column', gap: 3, height: '100%' }}>
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
              
              <Box sx={{ 
                display: 'flex', 
                flexDirection: 'column',
                flexGrow: 1,
                '& .quill': { display: 'flex', flexDirection: 'column' },
                '& .ql-container': { flexGrow: 1, minHeight: '400px', borderBottomLeftRadius: 4, borderBottomRightRadius: 4, fontSize: '16px' },
                '& .ql-toolbar': { borderTopLeftRadius: 4, borderTopRightRadius: 4 }
              }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
                  <Typography variant="subtitle2" sx={{ color: 'text.secondary' }}>Content</Typography>
                  <Button 
                    variant="outlined" 
                    size="small" 
                    startIcon={<TableChartIcon />}
                    onClick={() => setTableDialogOpen(true)}
                  >
                    Build Dynamic Table
                  </Button>
                </Box>
                <ReactQuill 
                  ref={quillRef}
                  theme="snow" 
                  value={formData.content} 
                  onChange={handleQuillChange} 
                  modules={modules}
                />
              </Box>
            </Paper>
          </Box>

          {/* Right Column - 30% */}
          <Box sx={{ flex: { xs: '1 1 100%', md: '0 0 calc(33.333% - 12px)' }, maxWidth: { xs: '100%', md: 'calc(33.333% - 12px)' } }}>
            <Paper sx={{ p: 3, display: 'flex', flexDirection: 'column', gap: 3, height: '100%' }}>
              
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
          </Box>

        </Box>
      </form>

      {/* Dynamic Table Builder Dialog */}
      <Dialog 
        open={tableDialogOpen} 
        onClose={() => setTableDialogOpen(false)}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>Build Dynamic Table</DialogTitle>
        <DialogContent dividers>
          <Box sx={{ overflowX: 'auto' }}>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, minWidth: 600 }}>
              
              {/* Controls for Columns */}
              <Box sx={{ display: 'flex', justifyContent: 'flex-end', mb: 1 }}>
                <Button variant="outlined" size="small" startIcon={<AddIcon />} onClick={handleAddColumn}>
                  Add Column
                </Button>
              </Box>

              {/* Rows */}
              {tableData.rows.map((row, rowIndex) => (
                <Box key={`r-${rowIndex}`} sx={{ display: 'flex', gap: 1, position: 'relative' }}>
                  {row.map((cell, colIndex) => (
                    <Box key={`c-${rowIndex}-${colIndex}`} sx={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
                      <TextField 
                        size="small"
                        fullWidth
                        placeholder="Cell data..."
                        value={cell}
                        onChange={(e) => handleCellChange(e.target.value, rowIndex, colIndex)}
                      />
                      {/* Column Delete Button - show only on first row */}
                      {rowIndex === 0 && tableData.rows[0].length > 1 && (
                        <Button 
                          size="small" 
                          color="error" 
                          sx={{ mt: 0.5, alignSelf: 'center', fontSize: '0.75rem', py: 0 }}
                          onClick={() => handleRemoveColumn(colIndex)}
                        >
                          Delete Col
                        </Button>
                      )}
                    </Box>
                  ))}
                  
                  {/* Row Delete Button */}
                  {tableData.rows.length > 1 && (
                    <Box sx={{ display: 'flex', alignItems: 'flex-start' }}>
                      <IconButton size="small" color="error" onClick={() => handleRemoveRow(rowIndex)}>
                        <DeleteIcon fontSize="small" />
                      </IconButton>
                    </Box>
                  )}
                </Box>
              ))}

              <Box>
                <Button variant="text" startIcon={<AddIcon />} onClick={handleAddRow}>
                  Add Row
                </Button>
              </Box>
              
            </Box>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setTableDialogOpen(false)}>Cancel</Button>
          <Button variant="contained" onClick={insertDynamicTable}>Insert into Editor</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
