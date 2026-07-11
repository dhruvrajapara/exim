import { useState, useRef, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import CloseIcon from '@mui/icons-material/Close';
import ImageIcon from '@mui/icons-material/Image';
import SearchIcon from '@mui/icons-material/Search';

export default function HeroSlider() {
  const [slides, setSlides] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [currentSlide, setCurrentSlide] = useState(null);
  
  const fileInputRef = useRef(null);

  // Form State mapped to backend schema
  const [formData, setFormData] = useState({
    label: '',
    heading: '',
    description: '',
    primary_btn_text: '',
    primary_btn_url: '',
    secondary_btn_text: '',
    secondary_btn_url: '',
    is_active: true,
  });
  
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);

  useEffect(() => {
    fetchSlides();
  }, []);

  const fetchSlides = async () => {
    try {
      setIsLoading(true);
      const res = await fetch('/api/admin/hero-slides');
      if (res.ok) {
        const json = await res.json();
        setSlides(json.data || []);
      }
    } catch (error) {
      console.error('Error fetching slides', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleOpenModal = (slide = null) => {
    if (slide) {
      setCurrentSlide(slide);
      setFormData({
        label: slide.label || '',
        heading: slide.heading || '',
        description: slide.description || '',
        primary_btn_text: slide.primary_btn_text || '',
        primary_btn_url: slide.primary_btn_url || '',
        secondary_btn_text: slide.secondary_btn_text || '',
        secondary_btn_url: slide.secondary_btn_url || '',
        is_active: !!slide.is_active,
      });
      setImagePreview(slide.image_path ? `http://localhost:8000${slide.image_path}` : null); // Fallback host if proxy isn't rewriting image paths perfectly, or just use slide.image_path if they are absolute/proxied correctly. We'll try relative first.
      setImagePreview(slide.image_path);
    } else {
      setCurrentSlide(null);
      setFormData({
        label: '',
        heading: '',
        description: '',
        primary_btn_text: '',
        primary_btn_url: '',
        secondary_btn_text: '',
        secondary_btn_url: '',
        is_active: true,
      });
      setImagePreview(null);
    }
    setImageFile(null);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setCurrentSlide(null);
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };
  
  const handleImageClick = () => {
    fileInputRef.current?.click();
  };
  
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Prevent uploading files larger than 5MB to avoid PHP post_max_size warnings
      if (file.size > 5 * 1024 * 1024) {
        alert("Image size must be less than 5MB. Please choose a smaller image.");
        e.target.value = ''; // Reset input
        return;
      }
      setImageFile(file);
      const imageUrl = URL.createObjectURL(file);
      setImagePreview(imageUrl);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    const submitData = new FormData();
    submitData.append('label', formData.label);
    submitData.append('heading', formData.heading);
    submitData.append('description', formData.description);
    submitData.append('primary_btn_text', formData.primary_btn_text);
    submitData.append('primary_btn_url', formData.primary_btn_url);
    submitData.append('secondary_btn_text', formData.secondary_btn_text);
    submitData.append('secondary_btn_url', formData.secondary_btn_url);
    submitData.append('is_active', formData.is_active ? '1' : '0');
    
    if (imageFile) {
      submitData.append('image', imageFile);
    }

    try {
      let url = '/api/admin/hero-slides';
      let method = 'POST';

      if (currentSlide) {
        url = `/api/admin/hero-slides/${currentSlide.id}`;
        // Laravel requires POST with _method=PUT for multipart/form-data
        submitData.append('_method', 'PUT');
      }

      const res = await fetch(url, {
        method: method,
        body: submitData,
        headers: {
          'Accept': 'application/json'
        }
      });

      if (res.ok) {
        fetchSlides();
        handleCloseModal();
      } else {
        const contentType = res.headers.get("content-type");
        if (contentType && contentType.includes("application/json")) {
            const err = await res.json();
            console.error('Validation error', err);
            alert(err.message || 'Error saving slide');
        } else {
            const text = await res.text();
            console.error('Server returned non-JSON error:', res.status, text);
            alert(`Server Error (${res.status}). Check console for details.`);
        }
      }
    } catch (error) {
      console.error('Fetch error:', error);
      alert(`Connection error: ${error.message}`);
    }
  };

  const confirmDelete = (slide) => {
    setCurrentSlide(slide);
    setIsDeleteModalOpen(true);
  };

  const handleDelete = async () => {
    try {
      const res = await fetch(`/api/admin/hero-slides/${currentSlide.id}`, {
        method: 'DELETE',
        headers: {
          'Accept': 'application/json'
        }
      });
      if (res.ok) {
        fetchSlides();
        setIsDeleteModalOpen(false);
        setCurrentSlide(null);
      } else {
          const contentType = res.headers.get("content-type");
          if (contentType && contentType.includes("application/json")) {
              const err = await res.json();
              alert(err.message || 'Error deleting slide');
          } else {
              alert(`Server Error (${res.status}). Check console.`);
          }
      }
    } catch (error) {
      console.error('Delete error', error);
      alert(`Connection error: ${error.message}`);
    }
  };

  return (
    <div className="animate-fade-in w-full max-w-[1400px] mx-auto font-sans">
      <Helmet>
        <title>Hero Slider | Admin Portal</title>
      </Helmet>

      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
        <div>
          <h1 className="text-[28px] font-bold text-gray-900 tracking-tight mb-1">
            Hero Slider
          </h1>
          <p className="text-[15px] text-gray-500">
            Manage the main slider images and content on the homepage.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <button 
            onClick={() => handleOpenModal()}
            className="px-4 py-2.5 bg-[#0B63CE] text-white rounded-lg text-sm font-medium hover:bg-[#0a55b3] transition-colors shadow-sm shadow-[#0B63CE]/20 flex items-center gap-2"
          >
            <AddIcon fontSize="small" />
            Add New Slide
          </button>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 flex flex-col overflow-hidden">
        
        {/* Toolbar */}
        <div className="p-4 border-b border-gray-100 flex items-center justify-between bg-gray-50/50">
          <div className="relative max-w-sm w-full">
            <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-400">
              <SearchIcon fontSize="small" />
            </span>
            <input 
              type="text" 
              placeholder="Search slides..." 
              className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#0B63CE]/20 focus:border-[#0B63CE] transition-all"
            />
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50 text-gray-500 text-xs uppercase tracking-wider">
                <th className="px-6 py-4 font-semibold border-b border-gray-100">Image</th>
                <th className="px-6 py-4 font-semibold border-b border-gray-100">Content</th>
                <th className="px-6 py-4 font-semibold border-b border-gray-100">Button</th>
                <th className="px-6 py-4 font-semibold border-b border-gray-100">Status</th>
                <th className="px-6 py-4 font-semibold border-b border-gray-100 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {isLoading ? (
                <tr>
                  <td colSpan="5" className="px-6 py-12 text-center text-gray-500">
                    Loading slides...
                  </td>
                </tr>
              ) : slides.length === 0 ? (
                <tr>
                  <td colSpan="5" className="px-6 py-12 text-center text-gray-500">
                    <div className="flex flex-col items-center justify-center">
                      <ImageIcon className="w-12 h-12 text-gray-300 mb-3" />
                      <p className="text-base font-medium text-gray-900">No slides found</p>
                      <p className="text-sm mt-1">Get started by adding a new hero slide.</p>
                    </div>
                  </td>
                </tr>
              ) : (
                slides.map((slide) => (
                  <tr key={slide.id} className="hover:bg-gray-50/50 transition-colors group">
                    <td className="px-6 py-4">
                      <div className="w-24 h-14 rounded-md bg-gray-100 overflow-hidden relative border border-gray-200">
                        {slide.image_path ? (
                          // In local dev, image paths might need the backend domain if running separate ports. Usually proxy handles it.
                          <img src={slide.image_path.startsWith('http') ? slide.image_path : `http://localhost:8000${slide.image_path}`} alt={slide.heading} className="w-full h-full object-cover" onError={(e) => { e.target.onerror = null; e.target.src = slide.image_path }} />
                        ) : (
                          <div className="flex items-center justify-center w-full h-full text-gray-400">
                            <ImageIcon fontSize="small" />
                          </div>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="font-semibold text-gray-900 text-sm mb-0.5">{slide.heading}</div>
                      <div className="text-xs text-gray-500 line-clamp-1 max-w-xs">{slide.description}</div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm text-gray-700">{slide.primary_btn_text || '-'}</div>
                      <div className="text-xs text-gray-400">{slide.primary_btn_url || '-'}</div>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium ${
                        slide.is_active ? 'bg-emerald-50 text-emerald-700 border border-emerald-200/60' : 'bg-gray-100 text-gray-700 border border-gray-200'
                      }`}>
                        {slide.is_active ? 'Active' : 'Inactive'}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button 
                          onClick={() => handleOpenModal(slide)}
                          className="p-1.5 text-blue-600 hover:bg-blue-50 rounded-md transition-colors"
                          title="Edit"
                        >
                          <EditIcon fontSize="small" />
                        </button>
                        <button 
                          onClick={() => confirmDelete(slide)}
                          className="p-1.5 text-red-600 hover:bg-red-50 rounded-md transition-colors"
                          title="Delete"
                        >
                          <DeleteIcon fontSize="small" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add/Edit Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-gray-900/40 backdrop-blur-sm" onClick={handleCloseModal}></div>
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-2xl relative z-10 flex flex-col max-h-[90vh] animate-slide-up">
            <div className="flex items-center justify-between p-6 border-b border-gray-100">
              <h2 className="text-xl font-bold text-gray-900">
                {currentSlide ? 'Edit Slide' : 'Add New Slide'}
              </h2>
              <button 
                onClick={handleCloseModal}
                className="text-gray-400 hover:text-gray-600 hover:bg-gray-100 p-1 rounded-full transition-colors"
              >
                <CloseIcon />
              </button>
            </div>
            
            <form id="slideForm" onSubmit={handleSubmit} className="flex flex-col min-h-0">
              <div className="p-6 overflow-y-auto space-y-5">
                {/* Image Upload Zone */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Background Image</label>
                  <div 
                    onClick={handleImageClick}
                    className="border-2 border-dashed border-gray-300 rounded-lg p-6 flex flex-col items-center justify-center text-center hover:bg-gray-50 transition-colors cursor-pointer relative overflow-hidden group"
                  >
                    {imagePreview ? (
                       <>
                         <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center z-10">
                           <span className="text-white font-medium flex items-center gap-2">
                             <EditIcon fontSize="small" /> Change Image
                           </span>
                         </div>
                         <img 
                           src={imagePreview.startsWith('http') ? imagePreview : `http://localhost:8000${imagePreview}`} 
                           alt="Preview" 
                           className="max-h-32 object-contain rounded" 
                           onError={(e) => { e.target.onerror = null; e.target.src = imagePreview }}
                         />
                       </>
                    ) : (
                       <>
                        <ImageIcon className="text-gray-400 mb-2" fontSize="large" />
                        <p className="text-sm font-medium text-[#0B63CE]">Click to upload or drag and drop</p>
                        <p className="text-xs text-gray-500 mt-1">SVG, PNG, JPG or GIF (max. 5MB)</p>
                       </>
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

                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-1">Label (Optional small text above heading)</label>
                    <input 
                      type="text" 
                      name="label" 
                      value={formData.label} 
                      onChange={handleChange}
                      className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#0B63CE]/20 focus:border-[#0B63CE] transition-all"
                      placeholder="e.g. Next-Gen Analytics"
                    />
                  </div>

                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-1">Title (Heading)</label>
                    <input 
                      type="text" 
                      name="heading" 
                      required
                      value={formData.heading} 
                      onChange={handleChange}
                      className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#0B63CE]/20 focus:border-[#0B63CE] transition-all"
                      placeholder="e.g. Premium Quality Spices"
                    />
                  </div>
                  
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-1">Subtitle (Description)</label>
                    <textarea 
                      name="description" 
                      rows="3"
                      value={formData.description} 
                      onChange={handleChange}
                      className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#0B63CE]/20 focus:border-[#0B63CE] transition-all"
                      placeholder="A short description..."
                    ></textarea>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Primary Button Text</label>
                    <input 
                      type="text" 
                      name="primary_btn_text" 
                      value={formData.primary_btn_text} 
                      onChange={handleChange}
                      className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#0B63CE]/20 focus:border-[#0B63CE] transition-all"
                      placeholder="e.g. Get Started"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Primary Button Link</label>
                    <input 
                      type="text" 
                      name="primary_btn_url" 
                      value={formData.primary_btn_url} 
                      onChange={handleChange}
                      className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#0B63CE]/20 focus:border-[#0B63CE] transition-all"
                      placeholder="e.g. /contact"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Secondary Button Text</label>
                    <input 
                      type="text" 
                      name="secondary_btn_text" 
                      value={formData.secondary_btn_text} 
                      onChange={handleChange}
                      className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#0B63CE]/20 focus:border-[#0B63CE] transition-all"
                      placeholder="e.g. Learn More"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Secondary Button Link</label>
                    <input 
                      type="text" 
                      name="secondary_btn_url" 
                      value={formData.secondary_btn_url} 
                      onChange={handleChange}
                      className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#0B63CE]/20 focus:border-[#0B63CE] transition-all"
                      placeholder="e.g. /about"
                    />
                  </div>
                </div>

                <div className="flex items-center gap-2 pt-2">
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input 
                      type="checkbox" 
                      name="is_active" 
                      checked={formData.is_active}
                      onChange={handleChange}
                      className="sr-only peer" 
                    />
                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#0B63CE]"></div>
                    <span className="ml-3 text-sm font-medium text-gray-700">Active Status</span>
                  </label>
                </div>
              </div>
              
              <div className="p-6 border-t border-gray-100 flex items-center justify-end gap-3 bg-gray-50/50 rounded-b-xl flex-shrink-0">
                <button 
                  type="button"
                  onClick={handleCloseModal}
                  className="px-5 py-2.5 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                <button 
                  type="submit"
                  className="px-5 py-2.5 text-sm font-medium text-white bg-[#0B63CE] rounded-lg hover:bg-[#0a55b3] shadow-sm transition-colors"
                >
                  {currentSlide ? 'Save Changes' : 'Create Slide'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {isDeleteModalOpen && (
        <div className="fixed inset-0 z-[70] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-gray-900/40 backdrop-blur-sm" onClick={() => setIsDeleteModalOpen(false)}></div>
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-sm relative z-10 flex flex-col animate-scale-up">
            <div className="p-6 text-center">
              <div className="w-14 h-14 rounded-full bg-red-100 text-red-600 flex items-center justify-center mx-auto mb-4">
                <DeleteIcon fontSize="large" />
              </div>
              <h3 className="text-lg font-bold text-gray-900 mb-2">Delete Slide?</h3>
              <p className="text-sm text-gray-500 mb-6">
                Are you sure you want to delete <span className="font-semibold text-gray-700">"{currentSlide?.title}"</span>? This action cannot be undone.
              </p>
              <div className="flex gap-3 w-full">
                <button 
                  onClick={() => setIsDeleteModalOpen(false)}
                  className="flex-1 py-2.5 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                <button 
                  onClick={handleDelete}
                  className="flex-1 py-2.5 text-sm font-medium text-white bg-red-600 rounded-lg hover:bg-red-700 shadow-sm transition-colors"
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
