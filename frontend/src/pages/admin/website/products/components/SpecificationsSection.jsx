import React from 'react';
import { Box, Button, TextField, IconButton, Typography, Table, TableBody, TableCell, TableContainer, TableRow } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import DeleteIcon from '@mui/icons-material/Delete';
import SectionCard from './SectionCard';

export default function SpecificationsSection({ specifications, setSpecifications }) {
  
  const handleSpecChange = (index, field, value) => {
    const newSpecs = [...specifications];
    newSpecs[index][field] = value;
    setSpecifications(newSpecs);
  };
  
  const addSpec = () => setSpecifications([...specifications, { key: '', value: '' }]);
  
  const removeSpec = (index) => {
      const newSpecs = specifications.filter((_, i) => i !== index);
      // Ensure at least one empty row if they delete everything
      setSpecifications(newSpecs.length ? newSpecs : [{ key: '', value: '' }]);
  };

  return (
    <SectionCard id="specifications" title="Specifications">
      <TableContainer>
        <Table sx={{ border: '1px solid #E5E7EB', borderRadius: '8px', borderCollapse: 'separate' }}>
          <TableBody>
            {specifications.map((spec, index) => (
              <TableRow key={index} sx={{ '&:last-child td, &:last-child th': { border: 0 }, bgcolor: index % 2 === 0 ? '#FFFFFF' : '#F9FAFB' }}>
                <TableCell sx={{ width: '40%', p: 1.5, borderRight: '1px solid #E5E7EB' }}>
                  <TextField 
                    placeholder="e.g. Origin" 
                    value={spec.key} 
                    onChange={(e) => handleSpecChange(index, 'key', e.target.value)} 
                    size="small" 
                    fullWidth 
                    variant="standard"
                    InputProps={{ disableUnderline: true, sx: { fontSize: '0.875rem', fontWeight: 500, color: '#374151' } }}
                  />
                </TableCell>
                <TableCell sx={{ p: 1.5 }}>
                  <TextField 
                    placeholder="e.g. India" 
                    value={spec.value} 
                    onChange={(e) => handleSpecChange(index, 'value', e.target.value)} 
                    size="small" 
                    fullWidth 
                    variant="standard"
                    InputProps={{ disableUnderline: true, sx: { fontSize: '0.875rem', color: '#6B7280' } }}
                  />
                </TableCell>
                <TableCell sx={{ width: '40px', p: 1.5, textAlign: 'center' }}>
                  <IconButton onClick={() => removeSpec(index)} size="small" sx={{ color: '#9CA3AF', '&:hover': { color: '#EF4444', bgcolor: '#FEF2F2' } }}>
                    <DeleteIcon fontSize="small" />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      
      <Box sx={{ mt: 2 }}>
        <Button 
            startIcon={<AddIcon fontSize="small" />} 
            onClick={addSpec}
            sx={{ textTransform: 'none', fontWeight: 600, color: '#2563EB', '&:hover': { bgcolor: '#EFF6FF' } }}
        >
            Add Row
        </Button>
      </Box>
    </SectionCard>
  );
}
