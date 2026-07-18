import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Toaster, toast } from 'sonner';
import ReactQuill from 'react-quill-new';
import 'react-quill-new/dist/quill.snow.css';

const defaultFormState = {
  name: '',
  slug: '',
  category_id: '',
  short_description: '',
  full_description: '',
  is_active: true,
  is_featured: false,
  status: 'Published',
  new_until: '',
  meta_title: '',
  meta_description: '',
  meta_keywords: '',
};

export default function ProductFormContainer() {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEditing = Boolean(id);

  const [isInitializing, setIsInitializing] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  
  const [categories, setCategories] = useState([]);
  const [formData, setFormData] = useState(defaultFormState);

  const [showShortDescEditor, setShowShortDescEditor] = useState(true);
  const [showFullDescEditor, setShowFullDescEditor] = useState(true);

  // Dynamic Array States
  const [features, setFeatures] = useState(['']);
  const [specifications, setSpecifications] = useState([{ key: '', value: '' }]);
  
  // Media States
  const [mainImage, setMainImage] = useState(null);
  const [mainImagePreview, setMainImagePreview] = useState('');
  const [galleryFiles, setGalleryFiles] = useState([]);

  useEffect(() => {
    fetchInitialData();
  }, [id]);

  const fetchInitialData = async () => {
    setIsInitializing(true);
    try {
      const catRes = await fetch('/api/admin/product-categories');
      if (catRes.ok) {
        const catData = await catRes.json();
        setCategories(catData.data || []);
      }

      if (isEditing) {
        const prodRes = await fetch('/api/admin/products');
        if (prodRes.ok) {
          const prodData = await prodRes.json();
          const product = prodData.data.find(p => p.id === parseInt(id));
          
          if (product) {
            setFormData({
              ...defaultFormState,
              ...product,
              status: product.is_active ? 'Published' : 'Draft',
              new_until: product.new_until || ''
            });
            if (product.features?.length) setFeatures(product.features);
            if (product.specifications?.length) setSpecifications(product.specifications);
          }
        }
      }
    } catch (error) {
      console.error('Initialization error', error);
      toast.error('Failed to load product data.');
    } finally {
      setIsInitializing(false);
    }
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    if (name === 'name') {
       setFormData(prev => ({
           ...prev,
           name: value,
           slug: value.toLowerCase().replace(/\s+/g, '-').replace(/[^\w-]+/g, '')
       }));
    } else {
       setFormData(prev => ({
         ...prev,
         [name]: type === 'checkbox' ? checked : value
       }));
    }
  };

  const handleRichTextChange = (field, value) => {
      setFormData(prev => ({ ...prev, [field]: value }));
  };

  // Dynamic Handlers
  const addFeature = () => setFeatures([...features, '']);
  const removeFeature = (index) => {
    const newFeatures = features.filter((_, i) => i !== index);
    setFeatures(newFeatures.length ? newFeatures : ['']);
  };
  const updateFeature = (index, value) => {
    const newFeatures = [...features];
    newFeatures[index] = value;
    setFeatures(newFeatures);
  };

  const addSpecification = () => setSpecifications([...specifications, { key: '', value: '' }]);
  const removeSpecification = (index) => {
    const newSpecs = specifications.filter((_, i) => i !== index);
    setSpecifications(newSpecs.length ? newSpecs : [{ key: '', value: '' }]);
  };
  const updateSpecification = (index, field, value) => {
    const newSpecs = [...specifications];
    newSpecs[index][field] = value;
    setSpecifications(newSpecs);
  };

  // File Handlers
  const handleMainImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setMainImage(file);
      setMainImagePreview(URL.createObjectURL(file));
    }
  };
  const removeMainImage = () => {
    setMainImage(null);
    setMainImagePreview('');
  };

  const handleGalleryChange = (e) => {
    const files = Array.from(e.target.files);
    setGalleryFiles(prev => [...prev, ...files.map(f => ({ file: f, preview: URL.createObjectURL(f) }))]);
  };
  const removeGalleryFile = (index) => {
    setGalleryFiles(prev => prev.filter((_, i) => i !== index));
  };

  const handleSave = async (exit = false) => {
    if (!formData.name) {
        toast.error('Product Name is required.');
        return;
    }

    setIsSaving(true);
    
    const data = new FormData();
    Object.keys(defaultFormState).forEach(key => {
      if (key !== 'is_active' && key !== 'is_featured' && key !== 'status') {
        if (formData[key] !== null && formData[key] !== undefined && formData[key] !== '') {
          data.append(key, formData[key]);
        }
      }
    });

    data.append('is_active', formData.status === 'Published' ? 1 : 0);
    data.append('is_featured', formData.is_featured ? 1 : 0);

    if (mainImage) {
      data.append('image', mainImage);
    }

    const validSpecs = Array.isArray(specifications) ? specifications.filter(s => s && s.key && s.value) : [];
    if (validSpecs.length > 0) data.append('specifications', JSON.stringify(validSpecs));
    
    const validFeatures = Array.isArray(features) ? features.filter(f => typeof f === 'string' && f.trim() !== '') : [];
    if (validFeatures.length > 0) data.append('features', JSON.stringify(validFeatures));

    galleryFiles.forEach((fileObj, index) => {
      data.append(`gallery[${index}]`, fileObj.file);
    });

    try {
      let url = '/api/admin/products';
      if (isEditing) {
        url = `/api/admin/products/${id}`;
        data.append('_method', 'PUT');
      }

      const response = await fetch(url, {
        method: 'POST', 
        body: data,
        headers: {
            'Accept': 'application/json'
        }
      });

      const parseResponse = async (res) => {
        const text = await res.text();
        try {
            const jsonStart = text.indexOf('{');
            if (jsonStart !== -1) {
                return JSON.parse(text.substring(jsonStart));
            }
            return JSON.parse(text);
        } catch (e) {
            throw new Error(text.substring(0, 150));
        }
      };

      if (response.ok) {
        const result = await parseResponse(response);
        toast.success('Product saved successfully!');
        if (exit) {
          navigate('/admin/website/products/list');
        } else if (!isEditing && result?.data?.id) {
          navigate(`/admin/website/products/edit/${result.data.id}`);
        }
      } else {
        let errMessage = 'Unknown error';
        try {
            const err = await parseResponse(response);
            if (err.errors) {
                errMessage = err.message + ' ' + JSON.stringify(err.errors);
            } else {
                errMessage = err.message || JSON.stringify(err);
            }
        } catch (e) {
            errMessage = `Server error ${response.status}: ${e.message}`;
        }
        toast.error('Error saving: ' + errMessage);
      }
    } catch (error) {
      console.error('Save error', error);
      toast.error('Save failed: ' + (error.message || error.toString()));
    } finally {
      setIsSaving(false);
    }
  };

  if (isInitializing) {
    return (
      <div className="flex justify-center items-center h-screen bg-[#F8FAFC]">
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  const modules = {
    toolbar: [
      ['bold', 'italic', 'underline', 'link', 'strike'],
      [{ 'list': 'bullet' }, { 'list': 'ordered' }],
      [{ 'align': [] }],
      ['clean'],
      ['code-block']
    ]
  };

  return (
    <div className="min-h-screen bg-[#F3F4F6] p-6 font-sans text-[#374151]">
      <Toaster position="top-right" richColors />
      
      <div className="max-w-[1400px] mx-auto">
        <div className="flex flex-col lg:flex-row gap-6">
          
          {/* LEFT COLUMN */}
          <div className="flex-1 flex flex-col gap-6">
            
            {/* Form Fields Card */}
            <div className="bg-white rounded-lg border border-gray-200 shadow-sm p-6">
              
              {/* Name */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="Name"
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                />
              </div>

              {/* Description (Short) */}
              <div className="mb-8">
                <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
                
                <div className="flex flex-wrap gap-2 mb-3">
                  <button 
                    type="button"
                    onClick={() => setShowShortDescEditor(!showShortDescEditor)}
                    className="flex items-center px-4 py-2 border border-gray-300 rounded-md text-sm font-medium bg-white hover:bg-gray-50 text-gray-700"
                  >
                    Show/Hide Editor
                  </button>
                  <button type="button" className="flex items-center px-4 py-2 border border-gray-300 rounded-md text-sm font-medium bg-white hover:bg-gray-50 text-gray-700">
                    <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"></path></svg>
                    Add media
                  </button>
                </div>

                {showShortDescEditor && (
                  <div className="border border-gray-300 rounded-md overflow-hidden">
                    <ReactQuill 
                      theme="snow"
                      value={formData.short_description}
                      onChange={(val) => handleRichTextChange('short_description', val)}
                      placeholder="Short description"
                      modules={modules}
                      className="bg-white min-h-[150px]"
                    />
                  </div>
                )}
              </div>

              {/* Content (Full Description) */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Content</label>
                
                <div className="flex flex-wrap gap-2 mb-3">
                  <button 
                    type="button" 
                    onClick={() => setShowFullDescEditor(!showFullDescEditor)}
                    className="flex items-center px-4 py-2 border border-gray-300 rounded-md text-sm font-medium bg-white hover:bg-gray-50 text-gray-700"
                  >
                    Show/Hide Editor
                  </button>
                  <button type="button" className="flex items-center px-4 py-2 border border-gray-300 rounded-md text-sm font-medium bg-white hover:bg-gray-50 text-gray-700">
                    <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"></path></svg>
                    Add media
                  </button>
                  <button type="button" className="flex items-center px-4 py-2 border border-gray-300 rounded-md text-sm font-medium bg-white hover:bg-gray-50 text-gray-700">
                    <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"></path></svg>
                    UI Blocks
                  </button>
                </div>

                {showFullDescEditor && (
                  <div className="border border-gray-300 rounded-md overflow-hidden">
                    <ReactQuill 
                      theme="snow"
                      value={formData.full_description}
                      onChange={(val) => handleRichTextChange('full_description', val)}
                      modules={modules}
                      className="bg-white min-h-[300px]"
                    />
                  </div>
                )}
              </div>
            </div>

            {/* Media Upload Card */}
            <div className="bg-white rounded-lg border border-gray-200 shadow-sm p-6">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">Media</h3>
              
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">Primary Image</label>
                {mainImagePreview ? (
                  <div className="relative w-40 h-40 border rounded-lg overflow-hidden group">
                    <img src={mainImagePreview} alt="Preview" className="w-full h-full object-cover" />
                    <div className="absolute inset-0 bg-black bg-opacity-40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                      <button type="button" onClick={removeMainImage} className="text-white bg-red-600 p-2 rounded-full hover:bg-red-700">
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path></svg>
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="relative w-full max-w-sm border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:bg-gray-50 transition-colors cursor-pointer">
                    <input type="file" onChange={handleMainImageChange} accept="image/*" className="absolute inset-0 w-full h-full opacity-0 cursor-pointer" />
                    <svg className="mx-auto h-12 w-12 text-gray-400" stroke="currentColor" fill="none" viewBox="0 0 48 48"><path d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" /></svg>
                    <p className="mt-1 text-sm text-gray-600">Click or drag image to upload</p>
                  </div>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Gallery Images</label>
                <div className="relative w-full border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:bg-gray-50 transition-colors cursor-pointer mb-4">
                  <input type="file" onChange={handleGalleryChange} accept="image/*" multiple className="absolute inset-0 w-full h-full opacity-0 cursor-pointer" />
                  <p className="text-sm text-gray-600">Select multiple files to upload gallery</p>
                </div>
                
                {galleryFiles.length > 0 && (
                  <div className="flex flex-wrap gap-4">
                    {galleryFiles.map((fileObj, idx) => (
                      <div key={idx} className="relative w-24 h-24 border rounded-md overflow-hidden group">
                        <img src={fileObj.preview} alt={`Gallery ${idx}`} className="w-full h-full object-cover" />
                        <div className="absolute inset-0 bg-black bg-opacity-40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                          <button type="button" onClick={() => removeGalleryFile(idx)} className="text-white p-1 rounded-full hover:bg-red-600">
                             <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path></svg>
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Features Card */}
            <div className="bg-white rounded-lg border border-gray-200 shadow-sm p-6">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">Features</h3>
              <div className="space-y-3">
                {features.map((feature, idx) => (
                  <div key={idx} className="flex gap-2 items-center">
                    <input
                      type="text"
                      value={feature}
                      onChange={(e) => updateFeature(idx, e.target.value)}
                      placeholder="e.g. 100% Organic"
                      className="flex-1 px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    <button type="button" onClick={() => removeFeature(idx)} className="text-gray-400 hover:text-red-500 p-2">
                       <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path></svg>
                    </button>
                  </div>
                ))}
              </div>
              <button type="button" onClick={addFeature} className="mt-4 text-blue-600 font-medium text-sm flex items-center hover:underline">
                <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4"></path></svg>
                Add Feature
              </button>
            </div>

            {/* Specifications Card */}
            <div className="bg-white rounded-lg border border-gray-200 shadow-sm p-6">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">Specifications</h3>
              <div className="space-y-3">
                {specifications.map((spec, idx) => (
                  <div key={idx} className="flex gap-2 items-center">
                    <input
                      type="text"
                      value={spec.key}
                      onChange={(e) => updateSpecification(idx, 'key', e.target.value)}
                      placeholder="e.g. Weight"
                      className="w-1/3 px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 bg-gray-50"
                    />
                    <input
                      type="text"
                      value={spec.value}
                      onChange={(e) => updateSpecification(idx, 'value', e.target.value)}
                      placeholder="e.g. 500g"
                      className="flex-1 px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    <button type="button" onClick={() => removeSpecification(idx)} className="text-gray-400 hover:text-red-500 p-2">
                       <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path></svg>
                    </button>
                  </div>
                ))}
              </div>
              <button type="button" onClick={addSpecification} className="mt-4 text-blue-600 font-medium text-sm flex items-center hover:underline">
                <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4"></path></svg>
                Add Specification
              </button>
            </div>

            {/* SEO Card */}
            <div className="bg-white rounded-lg border border-gray-200 shadow-sm p-6">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">Search Engine Optimization</h3>
              
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">Meta Title</label>
                <input
                  type="text"
                  name="meta_title"
                  value={formData.meta_title}
                  onChange={handleChange}
                  placeholder="SEO Title"
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">Meta Description</label>
                <textarea
                  name="meta_description"
                  value={formData.meta_description}
                  onChange={handleChange}
                  placeholder="Brief description for search engines"
                  rows="3"
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                ></textarea>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Meta Keywords</label>
                <input
                  type="text"
                  name="meta_keywords"
                  value={formData.meta_keywords}
                  onChange={handleChange}
                  placeholder="keyword1, keyword2, keyword3"
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>

          </div>

          {/* RIGHT COLUMN */}
          <div className="w-full lg:w-[320px] flex flex-col gap-6">
            
            {/* Publish Card */}
            <div className="bg-white rounded-lg border border-gray-200 shadow-sm">
              <div className="px-5 py-4 border-b border-gray-100">
                <h3 className="text-sm font-semibold text-gray-800">Publish</h3>
              </div>
              <div className="p-5 flex flex-col sm:flex-row lg:flex-col xl:flex-row gap-3">
                <button 
                  onClick={() => handleSave(false)}
                  disabled={isSaving}
                  className="flex-1 flex items-center justify-center bg-[#2F65E0] hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-md transition-colors"
                >
                  <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-3m-1 4l-3 3m0 0l-3-3m3 3V4"></path></svg>
                  {isSaving ? 'Saving...' : 'Save'}
                </button>
                <button 
                  onClick={() => handleSave(true)}
                  disabled={isSaving}
                  className="flex-1 flex items-center justify-center bg-white border border-gray-300 hover:bg-gray-50 text-gray-700 font-medium py-2 px-4 rounded-md transition-colors"
                >
                  <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"></path></svg>
                  Save & Exit
                </button>
              </div>
            </div>

            {/* Status Card */}
            <div className="bg-white rounded-lg border border-gray-200 shadow-sm">
              <div className="px-5 py-4 border-b border-gray-100">
                <h3 className="text-sm font-semibold text-gray-800">Status <span className="text-red-500">*</span></h3>
              </div>
              <div className="p-5">
                <select 
                  name="status"
                  value={formData.status}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
                >
                  <option value="Published">Published</option>
                  <option value="Draft">Draft</option>
                  <option value="Pending">Pending</option>
                </select>
              </div>
            </div>

            {/* Is featured Card */}
            <div className="bg-white rounded-lg border border-gray-200 shadow-sm">
              <div className="px-5 py-4 border-b border-gray-100">
                <h3 className="text-sm font-semibold text-gray-800">Is featured?</h3>
              </div>
              <div className="p-5">
                <label className="relative inline-flex items-center cursor-pointer">
                  <input 
                    type="checkbox" 
                    name="is_featured"
                    checked={formData.is_featured} 
                    onChange={handleChange}
                    className="sr-only peer" 
                  />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#2F65E0]"></div>
                </label>
              </div>
            </div>

            {/* New until Card */}
            <div className="bg-white rounded-lg border border-gray-200 shadow-sm">
              <div className="px-5 py-4 border-b border-gray-100">
                <h3 className="text-sm font-semibold text-gray-800">New until</h3>
              </div>
              <div className="p-5">
                <div className="relative">
                  <input
                    type="date"
                    name="new_until"
                    value={formData.new_until}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
                  />
                  {formData.new_until && (
                    <button 
                      type="button"
                      onClick={() => setFormData({...formData, new_until: ''})}
                      className="absolute right-8 top-1/2 -translate-y-1/2 text-red-500 hover:text-red-700"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path></svg>
                    </button>
                  )}
                </div>
                <p className="mt-2 text-xs text-gray-500 leading-tight">
                  Set a date until which this product will be marked as "New". Leave empty to not mark as new based on date.
                </p>
              </div>
            </div>

            {/* Categories Card */}
            <div className="bg-white rounded-lg border border-gray-200 shadow-sm">
              <div className="px-5 py-4 border-b border-gray-100">
                <h3 className="text-sm font-semibold text-gray-800">Categories</h3>
              </div>
              <div className="p-5">
                <div className="max-h-[200px] overflow-y-auto space-y-2">
                  {categories.length > 0 ? categories.map(cat => (
                    <label key={cat.id} className="flex items-center gap-2 cursor-pointer">
                      <input 
                        type="radio" 
                        name="category_id"
                        value={cat.id}
                        checked={String(formData.category_id) === String(cat.id)}
                        onChange={handleChange}
                        className="w-4 h-4 text-[#2F65E0] bg-gray-100 border-gray-300 focus:ring-[#2F65E0]"
                      />
                      <span className="text-sm text-gray-700">{cat.name}</span>
                    </label>
                  )) : (
                    <p className="text-sm text-gray-500">No categories found.</p>
                  )}
                </div>
              </div>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}
