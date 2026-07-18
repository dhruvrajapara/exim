import React, { useState, useEffect } from 'react';
import { 
  Box, Typography, Button, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper,
  IconButton, Dialog, DialogTitle, DialogContent, DialogActions, TextField, Switch, FormControlLabel,
  Tabs, Tab, CircularProgress, Snackbar, Alert
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import AddIcon from '@mui/icons-material/Add';
import PhotoCamera from '@mui/icons-material/PhotoCamera';
import { fetchAdminCertifications, createCertification, updateCertification, deleteCertification } from '../../../../services/api';

function TabPanel(props) {
  const { children, value, index, ...other } = props;
  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`cert-tabpanel-${index}`}
      aria-labelledby={`cert-tab-${index}`}
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

export default function Certifications() {
  const [tabValue, setTabValue] = useState(0);
  const [certifications, setCertifications] = useState([]);
  const [open, setOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    authority_name: '',
    short_description: '',
    verification_badge_text: '',
    btn_text: '',
    btn_url: '',
    display_order: 0,
    is_active: true,
    logo: null
  });
  const [previewImage, setPreviewImage] = useState('');

  useEffect(() => {
    loadCertifications();
  }, []);

  const loadCertifications = async () => {
    try {
      const data = await fetchAdminCertifications();
      setCertifications(data);
    } catch (error) {
      console.error('Failed to load certifications', error);
    }
  };

  const handleOpen = (cert = null) => {
    if (cert) {
      setEditingId(cert.id);
      setFormData({
        name: cert.name,
        authority_name: cert.authority_name,
        short_description: cert.short_description || '',
        verification_badge_text: cert.verification_badge_text || '',
        btn_text: cert.btn_text || '',
        btn_url: cert.btn_url || '',
        display_order: cert.display_order,
        is_active: cert.is_active,
        logo: null
      });
      setPreviewImage(cert.logo_path || '');
    } else {
      setEditingId(null);
      setFormData({
        name: '',
        authority_name: '',
        short_description: '',
        verification_badge_text: '',
        btn_text: '',
        btn_url: '',
        display_order: 0,
        is_active: true,
        logo: null
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

  const handleImageChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setFormData(prev => ({ ...prev, logo: file }));
      setPreviewImage(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const data = new FormData();
    Object.keys(formData).forEach(key => {
      if (formData[key] !== null) {
        data.append(key, formData[key]);
      }
    });

    try {
      if (editingId) {
        await updateCertification(editingId, data);
      } else {
        await createCertification(data);
      }
      handleClose();
      loadCertifications();
    } catch (error) {
      alert(error.message || 'An error occurred');
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this certification?')) {
      try {
        await deleteCertification(id);
        loadCertifications();
      } catch (error) {
        alert(error.message || 'An error occurred');
      }
    }
  };

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
        <Typography variant="h4">Manage Certifications</Typography>
        {tabValue === 0 && (
          <Button variant="contained" startIcon={<AddIcon />} onClick={() => handleOpen()}>
            Add Certification
          </Button>
        )}
      </Box>

      <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
        <Tabs value={tabValue} onChange={(e, v) => setTabValue(v)}>
          <Tab label="Certifications List" />
          <Tab label="Home Page Settings" />
          <Tab label="About Page Settings" />
        </Tabs>
      </Box>

      <TabPanel value={tabValue} index={0}>
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Logo</TableCell>
                <TableCell>Name</TableCell>
                <TableCell>Authority</TableCell>
                <TableCell>Order</TableCell>
                <TableCell>Status</TableCell>
                <TableCell align="right">Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {certifications.map((cert) => (
                <TableRow key={cert.id}>
                  <TableCell>
                    {cert.logo_path && (
                      <img src={cert.logo_path} alt={cert.name} style={{ width: 50, height: 50, objectFit: 'contain' }} />
                    )}
                  </TableCell>
                  <TableCell>{cert.name}</TableCell>
                  <TableCell>{cert.authority_name}</TableCell>
                  <TableCell>{cert.display_order}</TableCell>
                  <TableCell>{cert.is_active ? 'Active' : 'Inactive'}</TableCell>
                  <TableCell align="right">
                    <IconButton color="primary" onClick={() => handleOpen(cert)}>
                      <EditIcon />
                    </IconButton>
                    <IconButton color="error" onClick={() => handleDelete(cert.id)}>
                      <DeleteIcon />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>

        <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
          <DialogTitle>{editingId ? 'Edit Certification' : 'Add Certification'}</DialogTitle>
          <form onSubmit={handleSubmit}>
            <DialogContent>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, pt: 1 }}>
                <TextField label="Certification Name" name="name" value={formData.name} onChange={handleInputChange} fullWidth required />
                <TextField label="Authority Name (e.g. FDA, ISO)" name="authority_name" value={formData.authority_name} onChange={handleInputChange} fullWidth required />
                <TextField label="Short Description" name="short_description" value={formData.short_description} onChange={handleInputChange} fullWidth multiline rows={3} />
                <TextField label="Verification Badge Text (e.g. Verified 2024)" name="verification_badge_text" value={formData.verification_badge_text} onChange={handleInputChange} fullWidth />
                <Box sx={{ display: 'flex', gap: 2 }}>
                  <TextField label="Button Text (e.g. Verify)" name="btn_text" value={formData.btn_text} onChange={handleInputChange} fullWidth />
                  <TextField label="Button URL" name="btn_url" value={formData.btn_url} onChange={handleInputChange} fullWidth />
                </Box>
                <TextField label="Display Order" name="display_order" type="number" value={formData.display_order} onChange={handleInputChange} fullWidth />
                
                <Box>
                  <input accept="image/*" style={{ display: 'none' }} id="logo-upload" type="file" onChange={handleImageChange} />
                  <label htmlFor="logo-upload">
                    <Button variant="outlined" component="span" startIcon={<PhotoCamera />}>Upload Logo</Button>
                  </label>
                  {previewImage && (
                    <Box mt={2}>
                      <img src={previewImage} alt="Preview" style={{ maxWidth: '100%', maxHeight: 150, objectFit: 'contain' }} />
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
        <SectionSettingsForm settingKey="home_certifications" title="Home Page Certifications Section" />
      </TabPanel>
      
      <TabPanel value={tabValue} index={2}>
        <SectionSettingsForm settingKey="about_certifications" title="About Page Certifications Section" />
      </TabPanel>
    </Box>
  );
}
