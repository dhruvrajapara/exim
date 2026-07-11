import { useState, useRef, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import AddIcon from '@mui/icons-material/Add';
import DeleteIcon from '@mui/icons-material/Delete';
import ImageIcon from '@mui/icons-material/Image';
import SaveIcon from '@mui/icons-material/Save';
import EditIcon from '@mui/icons-material/Edit';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';

export default function AboutSection() {
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [sectionId, setSectionId] = useState(null);
  const fileInputRef = useRef(null);

  // Form State
  const [formData, setFormData] = useState({
    label: '',
    heading: '',
    description: '',
    btn_text: '',
    btn_url: '',
    image_alt: '',
    image_title: '',
    is_active: true,
  });

  const [statistics, setStatistics] = useState([]);
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);

  useEffect(() => {
    fetchAboutSection();
  }, []);

  const fetchAboutSection = async () => {
    try {
      setIsLoading(true);
      const res = await fetch('/api/admin/about-section');
      if (res.ok) {
        const json = await res.json();
        const data = json.data;
        if (data) {
          setSectionId(data.id);
          setFormData({
            label: data.label || '',
            heading: data.heading || '',
            description: data.description || '',
            btn_text: data.btn_text || '',
            btn_url: data.btn_url || '',
            image_alt: data.image_alt || '',
            image_title: data.image_title || '',
            is_active: !!data.is_active,
          });
          setImagePreview(data.image_path);
          setStatistics(data.statistics || []);
        }
      }
    } catch (error) {
      console.error('Error fetching about section', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleStatChange = (index, field, value) => {
    setStatistics(prev => {
      const updated = [...prev];
      updated[index][field] = value;
      return updated;
    });
  };

  const handleAddStat = () => {
    setStatistics(prev => [
      ...prev,
      { id: null, number_value: '', title: '', display_order: prev.length + 1 }
    ]);
  };

  const handleRemoveStat = (index) => {
    setStatistics(prev => prev.filter((_, i) => i !== index));
  };

  const handleImageClick = () => {
    fileInputRef.current?.click();
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        alert("Image size must be less than 5MB. Please choose a smaller image.");
        e.target.value = '';
        return;
      }
      setImageFile(file);
      const imageUrl = URL.createObjectURL(file);
      setImagePreview(imageUrl);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!sectionId) return;

    setIsSaving(true);
    const submitData = new FormData();
    Object.keys(formData).forEach(key => {
      submitData.append(key, typeof formData[key] === 'boolean' ? (formData[key] ? '1' : '0') : formData[key]);
    });

    submitData.append('statistics', JSON.stringify(statistics));

    if (imageFile) {
      submitData.append('image', imageFile);
    }
    submitData.append('_method', 'PUT');

    try {
      const res = await fetch(`/api/admin/about-section/${sectionId}`, {
        method: 'POST', // Using POST with _method=PUT
        body: submitData,
        headers: {
          'Accept': 'application/json'
        }
      });

      if (res.ok) {
        setSuccessMessage('About section updated successfully!');
        setTimeout(() => setSuccessMessage(''), 3000);
        fetchAboutSection();
      } else {
        const contentType = res.headers.get("content-type");
        if (contentType && contentType.includes("application/json")) {
            const err = await res.json();
            console.error('Validation error', err);
            alert(err.message || 'Error saving about section');
        } else {
            const text = await res.text();
            console.error('Server returned non-JSON error:', res.status, text);
            alert(`Server Error (${res.status}). Check console for details.`);
        }
      }
    } catch (error) {
      console.error('Fetch error:', error);
      alert(`Connection error: ${error.message}`);
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return <div className="p-8 text-center text-gray-500">Loading...</div>;
  }

  return (
    <>
      <Helmet>
        <title>Manage About Section | Admin</title>
      </Helmet>

      <div className="max-w-5xl mx-auto p-6 animate-fade-in">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Manage About Section</h1>
            <p className="text-gray-500 text-sm mt-1">Update home page about section content and statistics.</p>
          </div>
          <button 
            onClick={handleSubmit}
            disabled={isSaving}
            className={`btn-primary flex items-center px-5 py-2.5 rounded-lg text-sm font-medium ${isSaving ? 'opacity-70 cursor-not-allowed' : ''}`}
          >
            <SaveIcon fontSize="small" className="mr-2" />
            {isSaving ? 'Saving...' : 'Save Changes'}
          </button>
        </div>

        {successMessage && (
          <div className="mb-6 p-4 bg-green-50 border border-green-200 text-green-700 rounded-lg flex items-center shadow-sm animate-fade-in">
            <CheckCircleIcon className="mr-3" fontSize="small" />
            <span className="font-medium">{successMessage}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-100 bg-gray-50/50">
              <h2 className="text-lg font-semibold text-gray-800">Main Content</h2>
            </div>
            
            <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Image Upload */}
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">Section Image</label>
                <div 
                  onClick={handleImageClick}
                  className="w-full h-[300px] border-2 border-dashed border-gray-300 rounded-xl flex flex-col items-center justify-center cursor-pointer hover:bg-gray-50 hover:border-[#0B63CE] transition-all overflow-hidden group relative bg-gray-50"
                >
                  {imagePreview ? (
                    <>
                      <img src={imagePreview} alt="Preview" className="w-full h-full object-cover" />
                      <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                        <div className="bg-white text-gray-800 px-4 py-2 rounded-lg text-sm font-medium flex items-center shadow-lg">
                          <EditIcon fontSize="small" className="mr-2" /> Change Image
                        </div>
                      </div>
                    </>
                  ) : (
                    <div className="text-center p-6">
                      <div className="w-16 h-16 bg-white shadow-sm rounded-full flex items-center justify-center mx-auto mb-4 text-[#0B63CE]">
                        <ImageIcon fontSize="large" />
                      </div>
                      <p className="text-gray-600 font-medium">Click to upload image</p>
                      <p className="text-gray-400 text-sm mt-1">SVG, PNG, JPG or GIF (max. 5MB)</p>
                    </div>
                  )}
                  
                  <input 
                    type="file"
                    ref={fileInputRef}
                    onChange={handleImageChange}
                    accept="image/*"
                    className="hidden"
                  />
                </div>
              </div>

              {/* Text Fields */}
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">Label (Small text above heading)</label>
                <input 
                  type="text" 
                  name="label" 
                  value={formData.label} 
                  onChange={handleChange}
                  className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#0B63CE]/20 focus:border-[#0B63CE]"
                />
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">Heading</label>
                <input 
                  type="text" 
                  name="heading" 
                  required
                  value={formData.heading} 
                  onChange={handleChange}
                  className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#0B63CE]/20 focus:border-[#0B63CE]"
                />
              </div>
              
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                <textarea 
                  name="description" 
                  rows="4"
                  required
                  value={formData.description} 
                  onChange={handleChange}
                  className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#0B63CE]/20 focus:border-[#0B63CE]"
                ></textarea>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Button Text</label>
                <input 
                  type="text" 
                  name="btn_text" 
                  value={formData.btn_text} 
                  onChange={handleChange}
                  className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#0B63CE]/20 focus:border-[#0B63CE]"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Button Link</label>
                <input 
                  type="text" 
                  name="btn_url" 
                  value={formData.btn_url} 
                  onChange={handleChange}
                  className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#0B63CE]/20 focus:border-[#0B63CE]"
                />
              </div>

              <div className="md:col-span-2 pt-2 flex items-center">
                <input 
                  type="checkbox" 
                  id="is_active" 
                  name="is_active" 
                  checked={formData.is_active} 
                  onChange={handleChange}
                  className="w-4 h-4 text-[#0B63CE] bg-gray-100 border-gray-300 rounded focus:ring-[#0B63CE]"
                />
                <label htmlFor="is_active" className="ml-2 text-sm font-medium text-gray-800">
                  Section Active (Show on homepage)
                </label>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-100 bg-gray-50/50 flex justify-between items-center">
              <h2 className="text-lg font-semibold text-gray-800">Statistics</h2>
              <button 
                type="button" 
                onClick={handleAddStat}
                className="text-sm font-medium text-[#0B63CE] bg-[#0B63CE]/10 hover:bg-[#0B63CE]/20 px-3 py-1.5 rounded-lg flex items-center transition-colors"
              >
                <AddIcon fontSize="small" className="mr-1" /> Add Stat
              </button>
            </div>
            
            <div className="p-6">
              {statistics.length === 0 ? (
                <div className="text-center py-8 text-gray-500 text-sm">
                  No statistics added yet. Click "Add Stat" to create one.
                </div>
              ) : (
                <div className="space-y-4">
                  {statistics.map((stat, index) => (
                    <div key={index} className="flex flex-col sm:flex-row gap-4 p-4 border border-gray-200 rounded-lg bg-gray-50/30 items-start sm:items-center relative group transition-all hover:border-[#0B63CE]/30">
                      
                      <div className="w-full sm:w-1/3">
                        <label className="block text-xs font-medium text-gray-500 mb-1 uppercase tracking-wider">Number/Value</label>
                        <input 
                          type="text" 
                          value={stat.number_value} 
                          onChange={(e) => handleStatChange(index, 'number_value', e.target.value)}
                          placeholder="e.g. 50+"
                          required
                          className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:border-[#0B63CE] bg-white"
                        />
                      </div>
                      
                      <div className="w-full sm:w-2/3">
                        <label className="block text-xs font-medium text-gray-500 mb-1 uppercase tracking-wider">Title/Label</label>
                        <input 
                          type="text" 
                          value={stat.title} 
                          onChange={(e) => handleStatChange(index, 'title', e.target.value)}
                          placeholder="e.g. Global Buyers"
                          required
                          className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:border-[#0B63CE] bg-white"
                        />
                      </div>

                      <button 
                        type="button"
                        onClick={() => handleRemoveStat(index)}
                        className="mt-6 sm:mt-0 p-2 text-red-500 hover:bg-red-50 rounded-md transition-colors"
                        title="Remove Statistic"
                      >
                        <DeleteIcon fontSize="small" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </form>
      </div>
    </>
  );
}
