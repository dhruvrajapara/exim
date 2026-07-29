import React, { useState, useEffect } from 'react';
import { 
  Box, Typography, Button, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper,
  IconButton, Chip
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import AddIcon from '@mui/icons-material/Add';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';

export default function BlogPostsAdmin() {
  const [blogs, setBlogs] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    fetchBlogs();
  }, []);

  const fetchBlogs = async () => {
    try {
      const response = await fetch('/api/admin/blogs');
      if (response.ok) {
        const data = await response.json();
        setBlogs(data.data);
      }
    } catch (error) {
      console.error('Error fetching blogs', error);
      toast.error('Failed to load blogs');
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this blog post?')) {
      try {
        const response = await fetch(`/api/admin/blogs/${id}`, {
          method: 'DELETE',
          headers: {
            'Accept': 'application/json'
          }
        });
        if (response.ok) {
          toast.success('Blog deleted successfully');
          fetchBlogs();
        } else {
            toast.error('Failed to delete blog');
        }
      } catch (error) {
        console.error('Delete error', error);
      }
    }
  };

  return (
    <Box sx={{ p: 3 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
        <Typography variant="h4">Manage Blog Posts</Typography>
        <Button variant="contained" startIcon={<AddIcon />} onClick={() => navigate('/admin/website/blog/posts/create')}>
          Create Post
        </Button>
      </Box>

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Image</TableCell>
              <TableCell>Title</TableCell>
              <TableCell>Category</TableCell>
              <TableCell>Date</TableCell>
              <TableCell>Status</TableCell>
              <TableCell>Views</TableCell>
              <TableCell align="right">Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {blogs.length > 0 ? (
                blogs.map((blog) => (
                <TableRow key={blog.id}>
                    <TableCell>
                    {blog.featured_image ? (
                        <img src={blog.featured_image} alt={blog.title} style={{ width: 60, height: 40, objectFit: 'cover', borderRadius: 4 }} />
                    ) : 'No Image'}
                    </TableCell>
                    <TableCell sx={{ fontWeight: 500 }}>{blog.title}</TableCell>
                    <TableCell>
                        <Chip label={blog.category?.name || 'Uncategorized'} size="small" variant="outlined" />
                    </TableCell>
                    <TableCell>{new Date(blog.published_date).toLocaleDateString()}</TableCell>
                    <TableCell>
                        <Chip 
                            label={blog.is_active ? 'Published' : 'Draft'} 
                            color={blog.is_active ? 'success' : 'default'}
                            size="small"
                        />
                    </TableCell>
                    <TableCell>{blog.views}</TableCell>
                    <TableCell align="right">
                    <IconButton onClick={() => navigate(`/admin/website/blog/posts/edit/${blog.id}`)} color="primary">
                        <EditIcon />
                    </IconButton>
                    <IconButton onClick={() => handleDelete(blog.id)} color="error">
                        <DeleteIcon />
                    </IconButton>
                    </TableCell>
                </TableRow>
                ))
            ) : (
                <TableRow>
                    <TableCell colSpan={7} align="center" sx={{ py: 3 }}>
                        No blogs found. Click 'Create Post' to start writing.
                    </TableCell>
                </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
}
