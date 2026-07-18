import React from 'react';
import { Box, Button, TextField, IconButton } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import DeleteIcon from '@mui/icons-material/Delete';
import DragIndicatorIcon from '@mui/icons-material/DragIndicator';
import { DragDropContext, Droppable, Draggable } from '@hello-pangea/dnd';
import SectionCard from './SectionCard';

export default function FeaturesSection({ features, setFeatures }) {

  const handleFeatureChange = (index, value) => {
    const newFeatures = [...features];
    newFeatures[index] = value;
    setFeatures(newFeatures);
  };
  
  const addFeature = () => setFeatures([...features, '']);
  
  const removeFeature = (index) => {
    const newFeatures = features.filter((_, i) => i !== index);
    setFeatures(newFeatures.length ? newFeatures : ['']);
  };

  const onDragEnd = (result) => {
    if (!result.destination) return;
    
    const items = Array.from(features);
    const [reorderedItem] = items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, reorderedItem);
    
    setFeatures(items);
  };

  return (
    <SectionCard id="features" title="Features">
      <DragDropContext onDragEnd={onDragEnd}>
        <Droppable droppableId="features-list">
          {(provided) => (
            <Box {...provided.droppableProps} ref={provided.innerRef} sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
              {features.map((feature, index) => (
                <Draggable key={`feature-${index}`} draggableId={`feature-${index}`} index={index}>
                  {(provided, snapshot) => (
                    <Box 
                      ref={provided.innerRef}
                      {...provided.draggableProps}
                      sx={{ 
                        display: 'flex', 
                        alignItems: 'center', 
                        gap: 1, 
                        p: 1,
                        bgcolor: snapshot.isDragging ? '#F3F4F6' : '#FFFFFF',
                        border: '1px solid',
                        borderColor: snapshot.isDragging ? '#2563EB' : '#E5E7EB',
                        borderRadius: '8px',
                        transition: 'background-color 0.2s',
                        boxShadow: snapshot.isDragging ? '0 4px 6px -1px rgb(0 0 0 / 0.1)' : 'none'
                      }}
                    >
                      <Box {...provided.dragHandleProps} sx={{ color: '#9CA3AF', display: 'flex', alignItems: 'center', cursor: 'grab' }}>
                        <DragIndicatorIcon fontSize="small" />
                      </Box>
                      <TextField 
                        placeholder="e.g. Premium Export Quality" 
                        value={feature} 
                        onChange={(e) => handleFeatureChange(index, e.target.value)} 
                        size="small" 
                        fullWidth
                        sx={{ 
                           '& .MuiOutlinedInput-root': { 
                               '& fieldset': { border: 'none' },
                               bgcolor: 'transparent'
                           }
                        }}
                      />
                      <IconButton onClick={() => removeFeature(index)} size="small" sx={{ color: '#9CA3AF', '&:hover': { color: '#EF4444', bgcolor: '#FEF2F2' } }}>
                        <DeleteIcon fontSize="small" />
                      </IconButton>
                    </Box>
                  )}
                </Draggable>
              ))}
              {provided.placeholder}
            </Box>
          )}
        </Droppable>
      </DragDropContext>
      
      <Box sx={{ mt: 2 }}>
        <Button 
            startIcon={<AddIcon fontSize="small" />} 
            onClick={addFeature}
            sx={{ textTransform: 'none', fontWeight: 600, color: '#2563EB', '&:hover': { bgcolor: '#EFF6FF' } }}
        >
            Add Feature
        </Button>
      </Box>
    </SectionCard>
  );
}
