import React, { useCallback } from 'react';
import { Box, Typography, IconButton, Tooltip, Grid, Card } from '@mui/material';
import { useDropzone } from 'react-dropzone';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import DeleteIcon from '@mui/icons-material/Delete';
import StarIcon from '@mui/icons-material/Star';
import StarBorderIcon from '@mui/icons-material/StarBorder';
import SectionCard from './SectionCard';

export default function MediaUploadSection({ 
  galleryFiles, 
  setGalleryFiles, 
  existingGallery, 
  previewImage, 
  setPreviewImage,
  setFormData 
}) {

  const onDrop = useCallback((acceptedFiles) => {
    // If no main image yet, set the first one as main
    if (!previewImage && acceptedFiles.length > 0) {
      const file = acceptedFiles[0];
      setFormData(prev => ({ ...prev, image: file }));
      setPreviewImage(URL.createObjectURL(file));
      
      // Add the rest to gallery
      if (acceptedFiles.length > 1) {
        setGalleryFiles(prev => [...prev, ...acceptedFiles.slice(1)]);
      }
    } else {
      setGalleryFiles(prev => [...prev, ...acceptedFiles]);
    }
  }, [previewImage, setPreviewImage, setFormData, setGalleryFiles]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { 'image/*': [] }
  });

  const removeGalleryFile = (index) => {
    setGalleryFiles(prev => prev.filter((_, i) => i !== index));
  };

  const setAsPrimaryNew = (index) => {
    const file = galleryFiles[index];
    setFormData(prev => ({ ...prev, image: file }));
    setPreviewImage(URL.createObjectURL(file));
    // Optional: remove it from gallery if you don't want duplicates
    // removeGalleryFile(index);
  };

  return (
    <SectionCard id="media" title="Media">
      <Box 
        {...getRootProps()}
        sx={{
          border: '2px dashed',
          borderColor: isDragActive ? '#2563EB' : '#D1D5DB',
          borderRadius: '12px',
          p: 6,
          textAlign: 'center',
          cursor: 'pointer',
          bgcolor: isDragActive ? '#EFF6FF' : '#F9FAFB',
          transition: 'all 0.2s ease',
          '&:hover': { borderColor: '#2563EB', bgcolor: '#EFF6FF' }
        }}
      >
        <input {...getInputProps()} />
        <CloudUploadIcon sx={{ fontSize: 48, color: isDragActive ? '#2563EB' : '#9CA3AF', mb: 2 }} />
        <Typography variant="h6" sx={{ color: '#111827', fontWeight: 600, mb: 1 }}>
          {isDragActive ? 'Drop files here...' : 'Click or drag images here'}
        </Typography>
        <Typography variant="body2" sx={{ color: '#6B7280' }}>
          Supports JPG, PNG, WEBP. Maximum file size 5MB.
        </Typography>
      </Box>

      {/* Primary Image Preview */}
      {previewImage && (
         <Box sx={{ mt: 4 }}>
           <Typography variant="subtitle2" sx={{ fontWeight: 600, mb: 2, color: '#374151' }}>Primary Image</Typography>
           <Box sx={{ position: 'relative', width: 160, height: 160, borderRadius: '12px', overflow: 'hidden', border: '1px solid #E5E7EB', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
              <img src={previewImage.startsWith('blob:') ? previewImage : `http://localhost:8000${previewImage}`} alt="Primary" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
              <Box sx={{ position: 'absolute', top: 8, left: 8, bgcolor: 'rgba(255,255,255,0.9)', borderRadius: 1, px: 1, py: 0.5, display: 'flex', alignItems: 'center', gap: 0.5 }}>
                 <StarIcon sx={{ color: '#F59E0B', fontSize: 16 }} />
                 <Typography variant="caption" sx={{ fontWeight: 600, color: '#92400E' }}>Primary</Typography>
              </Box>
           </Box>
         </Box>
      )}

      {/* Gallery Previews */}
      {(existingGallery.length > 0 || galleryFiles.length > 0) && (
        <Box sx={{ mt: 4 }}>
          <Typography variant="subtitle2" sx={{ fontWeight: 600, mb: 2, color: '#374151' }}>Gallery Images</Typography>
          <Grid container spacing={2}>
             {existingGallery.map((path, index) => (
                <Grid item key={`existing-${index}`}>
                  <Card sx={{ position: 'relative', width: 120, height: 120, borderRadius: '8px', overflow: 'hidden', border: '1px solid #E5E7EB', elevation: 0, '&:hover .actions': { opacity: 1 } }}>
                     <img src={`http://localhost:8000${path}`} alt="Gallery" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                     {/* Hover Actions overlay omitted for brevity on existing images since deletion requires backend logic */}
                  </Card>
                </Grid>
             ))}
             
             {galleryFiles.map((file, index) => (
                <Grid item key={`new-${index}`}>
                  <Card sx={{ position: 'relative', width: 120, height: 120, borderRadius: '8px', overflow: 'hidden', border: '1px solid #E5E7EB', elevation: 0, '&:hover .actions': { opacity: 1 } }}>
                     <img src={URL.createObjectURL(file)} alt="Gallery New" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                     
                     {/* Hover Actions */}
                     <Box className="actions" sx={{ position: 'absolute', inset: 0, bgcolor: 'rgba(0,0,0,0.4)', opacity: 0, transition: 'opacity 0.2s', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 1 }}>
                        <Tooltip title="Set as Primary">
                           <IconButton size="small" onClick={() => setAsPrimaryNew(index)} sx={{ bgcolor: 'white', '&:hover': { bgcolor: '#F9FAFB' } }}>
                             <StarBorderIcon fontSize="small" sx={{ color: '#374151' }} />
                           </IconButton>
                        </Tooltip>
                        <Tooltip title="Remove">
                           <IconButton size="small" onClick={() => removeGalleryFile(index)} sx={{ bgcolor: 'white', '&:hover': { bgcolor: '#FEF2F2', color: '#EF4444' } }}>
                             <DeleteIcon fontSize="small" sx={{ color: '#EF4444' }} />
                           </IconButton>
                        </Tooltip>
                     </Box>
                  </Card>
                </Grid>
             ))}
          </Grid>
        </Box>
      )}
    </SectionCard>
  );
}
