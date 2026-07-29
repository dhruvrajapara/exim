import { useState, useEffect, useRef } from 'react';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import AddIcon from '@mui/icons-material/Add';
import CloseIcon from '@mui/icons-material/Close';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import VisibilityIcon from '@mui/icons-material/Visibility';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';
import { toast } from 'sonner';

export default function ImageGalleryAdmin() {
  const [images, setImages] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingImage, setEditingImage] = useState(null);
  
  const [formData, setFormData] = useState({
    title: '',
    category: '',
    description: '',
    country: '',
    date_text: '',
    is_active: true,
  });
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [isSaving, setIsSaving] = useState(false);

  const fileInputRef = useRef(null);

  const fetchImages = async () => {
    try {
      setIsLoading(true);
      const token = localStorage.getItem('admin_token');
      const response = await fetch('/api/gallery-images', {
        headers: { 
          'Authorization': `Bearer ${token}`,
          'Accept': 'application/json'
        }
      });
      const data = await response.json();
      if (data.status === 'success') {
        setImages(data.data);
      } else {
        throw new Error(data.message || 'Failed to load images');
      }
    } catch (error) {
      toast.error('Failed to load gallery images');
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchImages();
  }, []);

  const handleOpenModal = (image = null) => {
    if (image) {
      setEditingImage(image);
      setFormData({
        title: image.title,
        category: image.category,
        description: image.description || '',
        country: image.country || '',
        date_text: image.date_text || '',
        is_active: image.is_active,
      });
      setImagePreview(image.image_url);
    } else {
      setEditingImage(null);
      setFormData({
        title: '',
        category: '',
        description: '',
        country: '',
        date_text: '',
        is_active: true,
      });
      setImagePreview(null);
    }
    setImageFile(null);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingImage(null);
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImageFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!editingImage && !imageFile) {
      toast.error('Please select an image to upload.');
      return;
    }

    try {
      setIsSaving(true);
      const submitData = new FormData();
      Object.keys(formData).forEach(key => {
        if (formData[key] !== null && formData[key] !== undefined) {
          submitData.append(key, key === 'is_active' ? (formData[key] ? 1 : 0) : formData[key]);
        }
      });
      
      if (imageFile) {
        submitData.append('image', imageFile);
      }

      const token = localStorage.getItem('admin_token');
      const url = editingImage 
        ? `/api/admin/gallery-images/${editingImage.id}`
        : '/api/admin/gallery-images';

      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Accept': 'application/json'
        },
        body: submitData
      });

      const data = await response.json();

      if (!response.ok || data.status !== 'success') {
        console.error('Validation errors:', data.errors);
        const errorMsg = data.errors ? Object.values(data.errors).flat().join(', ') : (data.message || 'Error saving image');
        throw new Error(errorMsg);
      }

      toast.success(editingImage ? 'Image updated successfully' : 'Image added successfully');
      handleCloseModal();
      fetchImages();
    } catch (error) {
      toast.error(error.message || 'Error saving image');
      console.error(error);
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this image?')) {
      try {
        const token = localStorage.getItem('admin_token');
        const response = await fetch(`/api/admin/gallery-images/${id}`, {
          method: 'DELETE',
          headers: { 
            'Authorization': `Bearer ${token}`,
            'Accept': 'application/json'
          }
        });
        const data = await response.json();

        if (response.ok && data.status === 'success') {
          toast.success('Image deleted successfully');
          fetchImages();
        } else {
          throw new Error(data.message || 'Error deleting image');
        }
      } catch (error) {
        toast.error(error.message || 'Error deleting image');
        console.error(error);
      }
    }
  };

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Image Gallery Management</h1>
          <p className="text-gray-600 mt-1">Manage images displayed in the public gallery.</p>
        </div>
        <button 
          onClick={() => handleOpenModal()}
          className="bg-[#0B63CE] text-white px-4 py-2 rounded-lg font-medium hover:bg-[#0950A7] transition-colors flex items-center"
        >
          <AddIcon className="mr-2" /> Add Image
        </button>
      </div>

      {isLoading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#0B63CE]"></div>
        </div>
      ) : images.length === 0 ? (
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-12 text-center">
          <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
          </div>
          <h3 className="text-xl font-bold text-gray-900 mb-2">No Images Found</h3>
          <p className="text-gray-500 mb-6">You haven't uploaded any images to the gallery yet.</p>
          <button onClick={() => handleOpenModal()} className="text-[#0B63CE] font-medium hover:underline">
            Upload your first image
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {images.map((image) => (
            <div key={image.id} className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden flex flex-col group">
              <div className="relative h-48 bg-gray-100 overflow-hidden">
                <img src={image.image_url} alt={image.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                <div className="absolute top-2 right-2 flex gap-1">
                  {!image.is_active && (
                    <span className="bg-red-500 text-white text-xs px-2 py-1 rounded shadow flex items-center">
                      <VisibilityOffIcon fontSize="small" className="mr-1" /> Hidden
                    </span>
                  )}
                  <span className="bg-white text-[#0B63CE] text-xs font-bold px-2 py-1 rounded shadow">
                    {image.category}
                  </span>
                </div>
              </div>
              <div className="p-4 flex-grow flex flex-col">
                <h3 className="font-bold text-gray-900 truncate mb-1" title={image.title}>{image.title}</h3>
                <p className="text-sm text-gray-500 mb-3 flex-grow line-clamp-2">{image.description}</p>
                <div className="flex justify-between items-center text-xs text-gray-400 mb-4">
                  <span className="truncate max-w-[50%]">{image.country}</span>
                  <span>{image.date_text}</span>
                </div>
                <div className="flex justify-end gap-2 pt-3 border-t border-gray-100 mt-auto">
                  <button onClick={() => handleOpenModal(image)} className="p-2 text-[#0B63CE] hover:bg-blue-50 rounded transition-colors" title="Edit">
                    <EditIcon fontSize="small" />
                  </button>
                  <button onClick={() => handleDelete(image.id)} className="p-2 text-red-500 hover:bg-red-50 rounded transition-colors" title="Delete">
                    <DeleteIcon fontSize="small" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 overflow-y-auto">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-3xl my-8 relative">
            <button 
              onClick={handleCloseModal}
              className="absolute right-4 top-4 text-gray-400 hover:text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-full p-2 transition-colors z-10"
            >
              <CloseIcon />
            </button>
            
            <div className="p-6 md:p-8">
              <h2 className="text-2xl font-bold text-gray-800 mb-6">
                {editingImage ? 'Edit Gallery Image' : 'Add New Image'}
              </h2>
              
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Image Upload Area */}
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-2">Image File *</label>
                    <div 
                      className="border-2 border-dashed border-gray-300 rounded-xl p-6 flex flex-col items-center justify-center text-center cursor-pointer hover:bg-gray-50 transition-colors"
                      onClick={() => fileInputRef.current?.click()}
                    >
                      {imagePreview ? (
                        <div className="relative w-full">
                          <img src={imagePreview} alt="Preview" className="max-h-64 object-contain mx-auto rounded" />
                          <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity rounded">
                            <span className="text-white font-medium flex items-center"><CloudUploadIcon className="mr-2" /> Change Image</span>
                          </div>
                        </div>
                      ) : (
                        <div className="py-8">
                          <CloudUploadIcon className="w-12 h-12 text-gray-400 mb-3 mx-auto" />
                          <p className="text-gray-600 font-medium">Click to select an image</p>
                          <p className="text-gray-400 text-sm mt-1">PNG, JPG, WEBP up to 20MB</p>
                        </div>
                      )}
                      <input 
                        type="file" 
                        ref={fileInputRef} 
                        className="hidden" 
                        accept="image/jpeg, image/png, image/webp" 
                        onChange={handleImageChange} 
                        required={!editingImage}
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Title *</label>
                    <input type="text" value={formData.title} onChange={e => setFormData({...formData, title: e.target.value})} className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:border-[#0B63CE] outline-none" required placeholder="e.g. Factory Production Line" />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Category *</label>
                    <input type="text" value={formData.category} onChange={e => setFormData({...formData, category: e.target.value})} className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:border-[#0B63CE] outline-none" required placeholder="e.g. Factory Production" />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Country</label>
                    <input type="text" value={formData.country} onChange={e => setFormData({...formData, country: e.target.value})} className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:border-[#0B63CE] outline-none" placeholder="e.g. India" />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Date</label>
                    <input type="text" value={formData.date_text} onChange={e => setFormData({...formData, date_text: e.target.value})} className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:border-[#0B63CE] outline-none" placeholder="e.g. March 2026" />
                  </div>

                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                    <textarea value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})} rows="3" className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:border-[#0B63CE] outline-none resize-none" placeholder="Optional brief description..." />
                  </div>

                  <div className="md:col-span-2 flex items-center">
                    <input 
                      type="checkbox" 
                      id="is_active" 
                      checked={formData.is_active} 
                      onChange={e => setFormData({...formData, is_active: e.target.checked})} 
                      className="w-4 h-4 text-[#0B63CE] rounded"
                    />
                    <label htmlFor="is_active" className="ml-2 text-sm font-medium text-gray-700 cursor-pointer">
                      Make image visible in public gallery
                    </label>
                  </div>
                </div>

                <div className="flex justify-end gap-3 pt-4 border-t border-gray-100">
                  <button type="button" onClick={handleCloseModal} className="px-5 py-2 text-gray-600 font-medium hover:bg-gray-100 rounded-lg transition-colors">
                    Cancel
                  </button>
                  <button type="submit" disabled={isSaving} className="bg-[#0B63CE] text-white px-6 py-2 rounded-lg font-medium hover:bg-[#0950A7] transition-colors disabled:opacity-70 flex items-center">
                    {isSaving ? <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div> : null}
                    {isSaving ? 'Saving...' : 'Save Image'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
