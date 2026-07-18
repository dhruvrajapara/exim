import React, { useState, useEffect } from 'react';
import { 
  Box, Typography, Button, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper,
  IconButton, Dialog, DialogTitle, DialogContent, DialogActions, TextField, Switch, FormControlLabel,
  Tabs, Tab, CircularProgress, Snackbar, Alert, Rating
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import AddIcon from '@mui/icons-material/Add';
import PhotoCamera from '@mui/icons-material/PhotoCamera';
import { fetchAdminTestimonials, createTestimonial, updateTestimonial, deleteTestimonial } from '../../../../services/api';

function TabPanel(props) {
  const { children, value, index, ...other } = props;
  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`test-tabpanel-${index}`}
      aria-labelledby={`test-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box sx={{ py: 3 }}>
          {children}
        </Box>
      )}
    </div>
  );
}

function SectionSettingsForm({ settingKey, title }) {
  const [formData, setFormData] = useState({ subtitle: '', title: '', description: '' });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    try {
      const res = await fetch(`/api/section-settings/${settingKey}`);
      if (res.ok) {
        const json = await res.json();
        if (json.data) {
          setFormData({
            subtitle: json.data.subtitle || '',
            title: json.data.title || '',
            description: json.data.description || ''
          });
        }
      }
    } catch (error) {
      console.error('Failed to fetch settings:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const res = await fetch(`/api/admin/section-settings/${settingKey}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
        body: JSON.stringify(formData)
      });
      if (!res.ok) throw new Error('Failed to update');
      setSnackbar({ open: true, message: 'Settings saved successfully', severity: 'success' });
    } catch (error) {
      setSnackbar({ open: true, message: error.message, severity: 'error' });
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <CircularProgress />;

  return (
    <Paper sx={{ p: 3, maxWidth: 800 }}>
      <Typography variant="h6" mb={3}>{title}</Typography>
      <form onSubmit={handleSubmit}>
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
          <TextField label="Subtitle" name="subtitle" value={formData.subtitle} onChange={handleChange} fullWidth />
          <TextField label="Title" name="title" value={formData.title} onChange={handleChange} fullWidth required />
          <TextField label="Description" name="description" value={formData.description} onChange={handleChange} fullWidth multiline rows={4} />
          <Button type="submit" variant="contained" disabled={saving} sx={{ alignSelf: 'flex-start' }}>
            {saving ? 'Saving...' : 'Save Settings'}
          </Button>
        </Box>
      </form>
      <Snackbar open={snackbar.open} autoHideDuration={4000} onClose={() => setSnackbar({...snackbar, open: false})}>
        <Alert severity={snackbar.severity} sx={{ width: '100%' }}>{snackbar.message}</Alert>
      </Snackbar>
    </Paper>
  );
}

export default function TestimonialsAdmin() {
  const [tabValue, setTabValue] = useState(0);
  const [testimonials, setTestimonials] = useState([]);
  const [open, setOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState({
    client_name: '',
    company_name: '',
    country: '',
    flag_code: '',
    star_rating: 5,
    review_text: '',
    display_order: 0,
    is_active: true,
    avatar: null
  });
  const [previewImage, setPreviewImage] = useState('');

  useEffect(() => {
    loadTestimonials();
  }, []);

  const loadTestimonials = async () => {
    try {
      const data = await fetchAdminTestimonials();
      setTestimonials(data);
    } catch (error) {
      console.error('Failed to load testimonials', error);
    }
  };

  const handleOpen = (item = null) => {
    if (item) {
      setEditingId(item.id);
      setFormData({
        client_name: item.client_name,
        company_name: item.company_name || '',
        country: item.country || '',
        flag_code: item.flag_code || '',
        star_rating: item.star_rating || 5,
        review_text: item.review_text || '',
        display_order: item.display_order,
        is_active: item.is_active,
        avatar: null
      });
      setPreviewImage(item.avatar_url || '');
    } else {
      setEditingId(null);
      setFormData({
        client_name: '',
        company_name: '',
        country: '',
        flag_code: '',
        star_rating: 5,
        review_text: '',
        display_order: 0,
        is_active: true,
        avatar: null
      });
      setPreviewImage('');
    }
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleInputChange = (e) => {
    const { name, value, checked, type } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleRatingChange = (event, newValue) => {
    setFormData(prev => ({ ...prev, star_rating: newValue }));
  };

  const handleImageChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setFormData(prev => ({ ...prev, avatar: file }));
      setPreviewImage(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const data = new FormData();
    Object.keys(formData).forEach(key => {
      if (formData[key] !== null && formData[key] !== undefined) {
        let value = formData[key];
        if (typeof value === 'boolean') {
          value = value ? '1' : '0';
        }
        data.append(key, value);
      }
    });

    try {
      if (editingId) {
        await updateTestimonial(editingId, data);
      } else {
        await createTestimonial(data);
      }
      handleClose();
      loadTestimonials();
    } catch (error) {
      alert(error.message || 'An error occurred');
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this testimonial?')) {
      try {
        await deleteTestimonial(id);
        loadTestimonials();
      } catch (error) {
        alert(error.message || 'An error occurred');
      }
    }
  };

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
        <Typography variant="h4">Manage Testimonials</Typography>
        {tabValue === 0 && (
          <Button variant="contained" startIcon={<AddIcon />} onClick={() => handleOpen()}>
            Add Testimonial
          </Button>
        )}
      </Box>

      <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
        <Tabs value={tabValue} onChange={(e, v) => setTabValue(v)}>
          <Tab label="Testimonial List" />
          <Tab label="Home Page Settings" />
        </Tabs>
      </Box>

      <TabPanel value={tabValue} index={0}>
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Avatar</TableCell>
                <TableCell>Client Name</TableCell>
                <TableCell>Company</TableCell>
                <TableCell>Rating</TableCell>
                <TableCell>Order</TableCell>
                <TableCell>Status</TableCell>
                <TableCell align="right">Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {testimonials.map((item) => (
                <TableRow key={item.id}>
                  <TableCell>
                    {item.avatar_url ? (
                      <img src={item.avatar_url} alt={item.client_name} style={{ width: 40, height: 40, borderRadius: '50%', objectFit: 'cover' }} />
                    ) : (
                      <Box sx={{ width: 40, height: 40, borderRadius: '50%', bgcolor: 'grey.300' }} />
                    )}
                  </TableCell>
                  <TableCell>{item.client_name}</TableCell>
                  <TableCell>{item.company_name}</TableCell>
                  <TableCell>
                    <Rating value={item.star_rating} readOnly size="small" />
                  </TableCell>
                  <TableCell>{item.display_order}</TableCell>
                  <TableCell>{item.is_active ? 'Active' : 'Inactive'}</TableCell>
                  <TableCell align="right">
                    <IconButton color="primary" onClick={() => handleOpen(item)}>
                      <EditIcon />
                    </IconButton>
                    <IconButton color="error" onClick={() => handleDelete(item.id)}>
                      <DeleteIcon />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>

        <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
          <DialogTitle>{editingId ? 'Edit Testimonial' : 'Add Testimonial'}</DialogTitle>
          <form onSubmit={handleSubmit}>
            <DialogContent>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, pt: 1 }}>
                <TextField label="Client Name" name="client_name" value={formData.client_name} onChange={handleInputChange} fullWidth required />
                <TextField label="Company Name" name="company_name" value={formData.company_name} onChange={handleInputChange} fullWidth />
                <Box sx={{ display: 'flex', gap: 2 }}>
                  <TextField label="Country Name" name="country" value={formData.country} onChange={handleInputChange} fullWidth />
                  <TextField label="Flag Code (e.g. us, gb, in)" name="flag_code" value={formData.flag_code} onChange={handleInputChange} fullWidth />
                </Box>
                
                <Box>
                  <Typography component="legend" variant="caption">Star Rating</Typography>
                  <Rating
                    name="star_rating"
                    value={formData.star_rating}
                    onChange={handleRatingChange}
                  />
                </Box>

                <TextField label="Review Text" name="review_text" value={formData.review_text} onChange={handleInputChange} fullWidth multiline rows={4} required />
                <TextField label="Display Order" name="display_order" type="number" value={formData.display_order} onChange={handleInputChange} fullWidth />
                
                <Box>
                  <input accept="image/*" style={{ display: 'none' }} id="avatar-upload" type="file" onChange={handleImageChange} />
                  <label htmlFor="avatar-upload">
                    <Button variant="outlined" component="span" startIcon={<PhotoCamera />}>Upload Avatar Image</Button>
                  </label>
                  {previewImage && (
                    <Box mt={2}>
                      <img src={previewImage} alt="Preview" style={{ width: 80, height: 80, borderRadius: '50%', objectFit: 'cover' }} />
                    </Box>
                  )}
                </Box>

                <FormControlLabel
                  control={<Switch checked={formData.is_active} onChange={handleInputChange} name="is_active" color="primary" />}
                  label="Active"
                />
              </Box>
            </DialogContent>
            <DialogActions>
              <Button onClick={handleClose}>Cancel</Button>
              <Button type="submit" variant="contained">Save</Button>
            </DialogActions>
          </form>
        </Dialog>
      </TabPanel>

      <TabPanel value={tabValue} index={1}>
        <SectionSettingsForm settingKey="home_testimonials" title="Home Page Testimonials Section" />
      </TabPanel>
    </Box>
  );
}
