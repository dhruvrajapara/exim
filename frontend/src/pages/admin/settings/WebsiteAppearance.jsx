import { useState, useEffect, useRef } from 'react';
import { Helmet } from 'react-helmet-async';
import ImageIcon from '@mui/icons-material/Image';
import SaveIcon from '@mui/icons-material/Save';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import PaletteIcon from '@mui/icons-material/Palette';
import ContactPhoneIcon from '@mui/icons-material/ContactPhone';
import ShareIcon from '@mui/icons-material/Share';
import BrandingWatermarkIcon from '@mui/icons-material/BrandingWatermark';
import SearchIcon from '@mui/icons-material/Search';
import UrlSelector from '../../../components/admin/UrlSelector';

export default function WebsiteAppearance() {
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [activeTab, setActiveTab] = useState('brand');

  const headerLogoRef = useRef(null);
  const footerLogoRef = useRef(null);
  const faviconRef = useRef(null);

  // Form State
  const [formData, setFormData] = useState({
    logo_height: '40',
    theme_primary_color: '#0B63CE',
    theme_secondary_color: '#18A0FB',
    theme_accent_color: '#F59E0B',
    theme_bg_color: '#ffffff',
    theme_text_color: '#4B5563',
    contact_company_name: 'BiteExport',
    contact_office_addresses: [''],
    contact_google_map_url: '',
    contact_phones: [''],
    contact_whatsapp: '',
    contact_emails: [''],
    contact_business_hours: '',
    contact_map_width: '100%',
    contact_map_height: '400px',
    contact_faqs: [{question: '', answer: ''}],
    social_facebook: '',
    social_facebook: '',
    social_instagram: '',
    social_linkedin: '',
    social_youtube: '',
    social_twitter: '',
    seo_home_title: '',
    footer_description: '',
    footer_copyright_text: '',
    whatsapp_float_enabled: false,
    whatsapp_float_number: '',
    whatsapp_float_message: 'Hello, I want to know more!',
    footer_quick_links: [{label: '', url: ''}],
    footer_product_links: [{label: '', url: ''}],
    header_btn_enabled: false,
    header_btn_label: 'Contact Us',
    header_btn_type: 'link', // 'link' or 'pdf'
    header_btn_link: {label: '', url: ''},
    blog_enabled: true,
  });

  const [headerLogoFile, setHeaderLogoFile] = useState(null);
  const [headerLogoPreview, setHeaderLogoPreview] = useState(null);
  const [footerLogoFile, setFooterLogoFile] = useState(null);
  const [footerLogoPreview, setFooterLogoPreview] = useState(null);
  const [faviconFile, setFaviconFile] = useState(null);
  const [faviconPreview, setFaviconPreview] = useState(null);
  const [headerBtnPdfFile, setHeaderBtnPdfFile] = useState(null);

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    try {
      setIsLoading(true);
      const res = await fetch('/api/website/settings', {
        headers: {
          'Cache-Control': 'no-cache',
          'Pragma': 'no-cache'
        }
      });
      if (res.ok) {
        const json = await res.json();
        if (json.data) {
          // Map JSON data to form data
          const newFormData = { ...formData };
          Object.keys(json.data).forEach(key => {
            // Handle booleans
            if (json.data[key] === 'true' || json.data[key] === '1') newFormData[key] = true;
            else if (json.data[key] === 'false' || json.data[key] === '0') newFormData[key] = false;
            else if (json.data[key] === 'null' || json.data[key] === null) newFormData[key] = '';
            else if (['contact_office_addresses', 'contact_phones', 'contact_emails'].includes(key)) {
              try {
                const parsed = JSON.parse(json.data[key]);
                newFormData[key] = Array.isArray(parsed) && parsed.length > 0 ? parsed : [''];
              } catch (e) {
                newFormData[key] = [''];
              }
            }
            else if (['footer_quick_links', 'footer_product_links', 'contact_faqs'].includes(key)) {
              try {
                const parsed = JSON.parse(json.data[key]);
                newFormData[key] = Array.isArray(parsed) && parsed.length > 0 ? parsed : (key === 'contact_faqs' ? [{question: '', answer: ''}] : [{label: '', url: ''}]);
              } catch (e) {
                newFormData[key] = key === 'contact_faqs' ? [{question: '', answer: ''}] : [{label: '', url: ''}];
              }
            }
            else if (key === 'header_btn_link') {
              try {
                newFormData[key] = JSON.parse(json.data[key]) || {label: '', url: ''};
              } catch (e) {
                newFormData[key] = {label: '', url: ''};
              }
            }
            else newFormData[key] = json.data[key];
          });
          setFormData(newFormData);
          
          if (json.data.header_logo_url) setHeaderLogoPreview(json.data.header_logo_url);
          if (json.data.footer_logo_url) setFooterLogoPreview(json.data.footer_logo_url);
          if (json.data.favicon_url) setFaviconPreview(json.data.favicon_url);
        }
      }
    } catch (error) {
      console.error('Error fetching settings', error);
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

  const handleArrayChange = (index, key, value) => {
    setFormData(prev => {
      const newArray = [...prev[key]];
      newArray[index] = value;
      return { ...prev, [key]: newArray };
    });
  };

  const handleObjectArrayChange = (index, key, field, value) => {
    setFormData(prev => {
      const newArray = [...prev[key]];
      if (field === null && typeof value === 'object') {
        // Replace the whole object or merge it, updating url, type, reference_id, and optionally label if empty
        newArray[index] = { 
          ...newArray[index], 
          url: value.url, 
          type: value.type, 
          reference_id: value.reference_id,
          label: newArray[index].label || value.label || ''
        };
      } else {
        newArray[index] = { ...newArray[index], [field]: value };
      }
      return { ...prev, [key]: newArray };
    });
  };

  const addArrayItem = (key) => {
    setFormData(prev => ({ ...prev, [key]: [...prev[key], ''] }));
  };

  const addObjectArrayItem = (key, defaultObj = {label: '', url: ''}) => {
    setFormData(prev => ({ ...prev, [key]: [...prev[key], defaultObj] }));
  };

  const removeArrayItem = (index, key, isObject = false, defaultObj = {label: '', url: ''}) => {
    setFormData(prev => {
      const newArray = prev[key].filter((_, i) => i !== index);
      const fallback = isObject ? [defaultObj] : [''];
      return { ...prev, [key]: newArray.length ? newArray : fallback };
    });
  };

  const handleImageChange = (e, type) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 2 * 1024 * 1024) {
        alert("Logo size must be less than 2MB.");
        e.target.value = '';
        return;
      }
      const imageUrl = URL.createObjectURL(file);
      if (type === 'header') {
        setHeaderLogoFile(file);
        setHeaderLogoPreview(imageUrl);
      } else if (type === 'footer') {
        setFooterLogoFile(file);
        setFooterLogoPreview(imageUrl);
      } else if (type === 'favicon') {
        setFaviconFile(file);
        setFaviconPreview(imageUrl);
      }
    }
  };

  const handlePdfChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.type !== 'application/pdf') {
        alert("Please upload a valid PDF file.");
        e.target.value = '';
        return;
      }
      if (file.size > 10 * 1024 * 1024) {
        alert("PDF size must be less than 10MB.");
        e.target.value = '';
        return;
      }
      setHeaderBtnPdfFile(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSaving(true);
    
    const submitData = new FormData();
    Object.keys(formData).forEach(key => {
      if (['contact_office_addresses', 'contact_phones', 'contact_emails'].includes(key)) {
        const filteredArray = formData[key].filter(v => v.trim() !== '');
        submitData.append(key, JSON.stringify(filteredArray));
      } else if (['footer_quick_links', 'footer_product_links'].includes(key)) {
        const filteredArray = formData[key].filter(v => v.label.trim() !== '' && v.url.trim() !== '');
        submitData.append(key, JSON.stringify(filteredArray));
      } else if (key === 'contact_faqs') {
        const filteredArray = formData[key].filter(v => v.question.trim() !== '' && v.answer.trim() !== '');
        submitData.append(key, JSON.stringify(filteredArray));
      } else if (key === 'header_btn_link') {
        submitData.append(key, JSON.stringify(formData[key]));
      } else {
        submitData.append(key, typeof formData[key] === 'boolean' ? (formData[key] ? '1' : '0') : formData[key]);
      }
    });

    if (headerLogoFile) submitData.append('header_logo', headerLogoFile);
    if (footerLogoFile) submitData.append('footer_logo', footerLogoFile);
    if (faviconFile) submitData.append('favicon', faviconFile);
    if (headerBtnPdfFile) submitData.append('header_btn_pdf', headerBtnPdfFile);
    
    submitData.append('_method', 'PUT');

    try {
      const res = await fetch('/api/admin/website/settings', {
        method: 'POST', // POST with _method=PUT
        body: submitData,
        headers: {
          'Accept': 'application/json'
        }
      });

      if (res.ok) {
        setSuccessMessage('Website settings updated successfully!');
        setTimeout(() => setSuccessMessage(''), 3000);
        
        // Dispatch custom event to tell app to refresh settings
        window.dispatchEvent(new Event('website-settings-updated'));
        
      } else {
        const err = await res.json();
        alert(err.message || 'Error saving settings');
      }
    } catch (error) {
      console.error('Fetch error:', error);
      alert(`Connection error: ${error.message}`);
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return <div className="p-8 text-center text-gray-500">Loading settings...</div>;
  }

  return (
    <>
      <Helmet>
        <title>Website Appearance | Admin</title>
      </Helmet>

      <div className="max-w-6xl mx-auto p-6 animate-fade-in">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Website Appearance</h1>
            <p className="text-gray-500 text-sm mt-1">Manage global branding, colors, and contact info.</p>
          </div>
          <button 
            onClick={handleSubmit}
            disabled={isSaving}
            className={`btn-primary flex items-center px-5 py-2.5 rounded-lg text-sm font-medium ${isSaving ? 'opacity-70 cursor-not-allowed' : ''}`}
          >
            <SaveIcon fontSize="small" className="mr-2" />
            {isSaving ? 'Saving...' : 'Save All Settings'}
          </button>
        </div>

        {successMessage && (
          <div className="mb-6 p-4 bg-green-50 border border-green-200 text-green-700 rounded-lg flex items-center shadow-sm">
            <CheckCircleIcon className="mr-3" fontSize="small" />
            <span className="font-medium">{successMessage}</span>
          </div>
        )}

        <div className="flex flex-col lg:flex-row gap-6">
          {/* Sidebar Tabs */}
          <div className="w-full lg:w-64 shrink-0">
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
              <button onClick={() => setActiveTab('brand')} className={`w-full flex items-center px-5 py-4 text-sm font-medium border-l-4 transition-colors ${activeTab === 'brand' ? 'border-[#0B63CE] bg-[#0B63CE]/5 text-[#0B63CE]' : 'border-transparent text-gray-600 hover:bg-gray-50'}`}>
                <BrandingWatermarkIcon fontSize="small" className="mr-3" /> Brand Identity
              </button>
              <button onClick={() => setActiveTab('header')} className={`w-full flex items-center px-5 py-4 text-sm font-medium border-l-4 transition-colors ${activeTab === 'header' ? 'border-[#0B63CE] bg-[#0B63CE]/5 text-[#0B63CE]' : 'border-transparent text-gray-600 hover:bg-gray-50'}`}>
                <ShareIcon fontSize="small" className="mr-3" /> Header Settings
              </button>
              <button onClick={() => setActiveTab('colors')} className={`w-full flex items-center px-5 py-4 text-sm font-medium border-l-4 transition-colors ${activeTab === 'colors' ? 'border-[#0B63CE] bg-[#0B63CE]/5 text-[#0B63CE]' : 'border-transparent text-gray-600 hover:bg-gray-50'}`}>
                <PaletteIcon fontSize="small" className="mr-3" /> Theme Colors
              </button>
              <button onClick={() => setActiveTab('contact')} className={`w-full flex items-center px-5 py-4 text-sm font-medium border-l-4 transition-colors ${activeTab === 'contact' ? 'border-[#0B63CE] bg-[#0B63CE]/5 text-[#0B63CE]' : 'border-transparent text-gray-600 hover:bg-gray-50'}`}>
                <ContactPhoneIcon fontSize="small" className="mr-3" /> Contact Information
              </button>
              <button onClick={() => setActiveTab('social')} className={`w-full flex items-center px-5 py-4 text-sm font-medium border-l-4 transition-colors ${activeTab === 'social' ? 'border-[#0B63CE] bg-[#0B63CE]/5 text-[#0B63CE]' : 'border-transparent text-gray-600 hover:bg-gray-50'}`}>
                <ShareIcon fontSize="small" className="mr-3" /> Social Media
              </button>
              <button onClick={() => setActiveTab('seo')} className={`w-full flex items-center px-5 py-4 text-sm font-medium border-l-4 transition-colors ${activeTab === 'seo' ? 'border-[#0B63CE] bg-[#0B63CE]/5 text-[#0B63CE]' : 'border-transparent text-gray-600 hover:bg-gray-50'}`}>
                <SearchIcon fontSize="small" className="mr-3" /> SEO Settings
              </button>
              <button onClick={() => setActiveTab('footer')} className={`w-full flex items-center px-5 py-4 text-sm font-medium border-l-4 transition-colors ${activeTab === 'footer' ? 'border-[#0B63CE] bg-[#0B63CE]/5 text-[#0B63CE]' : 'border-transparent text-gray-600 hover:bg-gray-50'}`}>
                <SearchIcon fontSize="small" className="mr-3" /> Footer & Features
              </button>
            </div>
          </div>

          {/* Main Content Area */}
          <div className="flex-grow bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            
            {/* Brand Identity Tab */}
            {activeTab === 'brand' && (
              <div className="space-y-6 animate-fade-in">
                <h2 className="text-lg font-semibold text-gray-800 border-b pb-3">Brand Logos</h2>
                
                <div className="mb-6">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Global Logo Height (px)</label>
                  <p className="text-xs text-gray-500 mb-2">Width will adjust automatically to maintain aspect ratio.</p>
                  <input type="number" name="logo_height" value={formData.logo_height || ''} onChange={handleChange} placeholder="40" className="w-full md:w-1/3 border border-gray-300 rounded-lg px-4 py-2 text-sm focus:border-[#0B63CE] outline-none" />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  {/* Header Logo */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Header Logo (Light Background)</label>
                    <div 
                      onClick={() => headerLogoRef.current?.click()}
                      className="w-full h-[150px] border-2 border-dashed border-gray-300 rounded-xl flex items-center justify-center cursor-pointer hover:bg-gray-50 transition-all bg-gray-50 overflow-hidden relative"
                    >
                      {headerLogoPreview ? (
                        <img src={headerLogoPreview} alt="Header Logo" className="max-h-full max-w-full object-contain p-4" />
                      ) : (
                        <div className="text-center text-gray-400"><ImageIcon /><p className="text-xs mt-1">Upload Header Logo</p></div>
                      )}
                      <input type="file" ref={headerLogoRef} onChange={(e) => handleImageChange(e, 'header')} accept="image/*" className="hidden" />
                    </div>
                  </div>
                  
                  {/* Footer Logo */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Footer Logo (Dark Background)</label>
                    <div 
                      onClick={() => footerLogoRef.current?.click()}
                      className="w-full h-[150px] border-2 border-dashed border-gray-300 rounded-xl flex items-center justify-center cursor-pointer transition-all bg-[#000821] overflow-hidden relative"
                    >
                      {footerLogoPreview ? (
                        <img src={footerLogoPreview} alt="Footer Logo" className="max-h-full max-w-full object-contain p-4" />
                      ) : (
                        <div className="text-center text-gray-400"><ImageIcon /><p className="text-xs mt-1">Upload Footer Logo</p></div>
                      )}
                      <input type="file" ref={footerLogoRef} onChange={(e) => handleImageChange(e, 'footer')} accept="image/*" className="hidden" />
                    </div>
                  </div>

                  {/* Favicon */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Favicon Icon (Browser Tab)</label>
                    <div 
                      onClick={() => faviconRef.current?.click()}
                      className="w-full h-[150px] border-2 border-dashed border-gray-300 rounded-xl flex items-center justify-center cursor-pointer hover:bg-gray-50 transition-all bg-gray-50 overflow-hidden relative"
                    >
                      {faviconPreview ? (
                        <img src={faviconPreview} alt="Favicon" className="max-h-[64px] max-w-[64px] object-contain p-2" />
                      ) : (
                        <div className="text-center text-gray-400"><ImageIcon /><p className="text-xs mt-1">Upload Favicon (.png, .ico)</p></div>
                      )}
                      <input type="file" ref={faviconRef} onChange={(e) => handleImageChange(e, 'favicon')} accept="image/*,.ico" className="hidden" />
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Header Settings Tab */}
            {activeTab === 'header' && (
              <div className="space-y-8 animate-fade-in">
                <h2 className="text-lg font-semibold text-gray-800 border-b pb-3">Header Action Button</h2>
                
                <div className="flex items-center gap-3">
                  <input type="checkbox" name="header_btn_enabled" id="header_btn_enabled" checked={formData.header_btn_enabled} onChange={handleChange} className="w-5 h-5 text-[#0B63CE] rounded" />
                  <label htmlFor="header_btn_enabled" className="text-sm font-medium text-gray-700 cursor-pointer">Enable Header Action Button</label>
                </div>

                {formData.header_btn_enabled && (
                  <div className="bg-gray-50 p-6 rounded-xl border border-gray-100 space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Button Label</label>
                        <input type="text" name="header_btn_label" value={formData.header_btn_label} onChange={handleChange} className="w-full border border-gray-300 rounded-lg px-4 py-2 text-sm focus:border-[#0B63CE] outline-none" placeholder="e.g. Brochure" />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Button Action Type</label>
                        <select name="header_btn_type" value={formData.header_btn_type} onChange={handleChange} className="w-full border border-gray-300 rounded-lg px-4 py-2 text-sm focus:border-[#0B63CE] outline-none bg-white">
                          <option value="link">Go to a Link</option>
                          <option value="pdf">Download a PDF</option>
                        </select>
                      </div>
                    </div>

                    {formData.header_btn_type === 'pdf' ? (
                      <div className="pt-4 border-t border-gray-200">
                        <label className="block text-sm font-medium text-gray-700 mb-2">Upload PDF Document</label>
                        <div className="flex items-center gap-4">
                          <input 
                            type="file" 
                            accept="application/pdf"
                            onChange={handlePdfChange}
                            className="block w-full text-sm text-gray-500
                              file:mr-4 file:py-2 file:px-4
                              file:rounded-full file:border-0
                              file:text-sm file:font-semibold
                              file:bg-[#0B63CE]/10 file:text-[#0B63CE]
                              hover:file:bg-[#0B63CE]/20 transition-all cursor-pointer"
                          />
                          {headerBtnPdfFile && <span className="text-sm text-green-600 font-medium whitespace-nowrap">Ready to upload</span>}
                        </div>
                        <p className="text-xs text-gray-500 mt-2">Max file size: 10MB.</p>
                      </div>
                    ) : (
                      <div className="pt-4 border-t border-gray-200">
                        <label className="block text-sm font-medium text-gray-700 mb-2">Select Page or Route</label>
                        <UrlSelector 
                          value={formData.header_btn_link} 
                          onChange={(val) => setFormData(prev => ({...prev, header_btn_link: val}))} 
                        />
                      </div>
                    )}
                  </div>
                )}
              </div>
            )}

            {/* Theme Colors Tab */}
            {activeTab === 'colors' && (
              <div className="space-y-6 animate-fade-in">
                <div className="flex justify-between items-end border-b pb-3">
                  <div>
                    <h2 className="text-lg font-semibold text-gray-800">Global Theme Colors</h2>
                    <p className="text-sm text-gray-500 mt-1">These colors will be applied automatically across the entire website frontend.</p>
                  </div>
                  <button 
                    type="button"
                    onClick={() => {
                      setFormData(prev => ({
                        ...prev,
                        theme_primary_color: '#0B63CE',
                        theme_secondary_color: '#18A0FB',
                        theme_accent_color: '#F59E0B',
                        theme_bg_color: '#ffffff',
                        theme_text_color: '#4B5563',
                      }));
                    }}
                    className="px-4 py-2 text-sm font-medium text-[#0B63CE] bg-[#EAF4FF] rounded-lg hover:bg-[#D5E8FA] transition-colors"
                  >
                    Reset to Defaults
                  </button>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {['theme_primary_color', 'theme_secondary_color', 'theme_accent_color', 'theme_bg_color', 'theme_text_color'].map(colorKey => (
                    <div key={colorKey}>
                      <label className="block text-sm font-medium text-gray-700 mb-2 capitalize">{colorKey.replace(/_/g, ' ')}</label>
                      <div className="flex items-center gap-3">
                        <input 
                          type="color" 
                          name={colorKey}
                          value={formData[colorKey]} 
                          onChange={handleChange}
                          className="w-12 h-12 rounded cursor-pointer border border-gray-300"
                        />
                        <input 
                          type="text" 
                          name={colorKey}
                          value={formData[colorKey]} 
                          onChange={handleChange}
                          className="flex-grow border border-gray-300 rounded-lg px-3 py-2 text-sm focus:border-[#0B63CE] focus:ring-1 focus:ring-[#0B63CE] outline-none"
                        />
                      </div>
                    </div>
                  ))}
                </div>
                
                <div className="mt-8 p-6 border rounded-xl" style={{ backgroundColor: formData.theme_bg_color }}>
                  <h3 className="font-bold mb-4" style={{ color: formData.theme_text_color }}>Live Preview</h3>
                  <button className="px-6 py-2 rounded-lg text-white font-medium shadow-md transition-transform hover:scale-105" style={{ backgroundColor: formData.theme_primary_color }}>
                    Primary Button
                  </button>
                  <button className="ml-4 px-6 py-2 rounded-lg text-white font-medium shadow-md transition-transform hover:scale-105" style={{ backgroundColor: formData.theme_secondary_color }}>
                    Secondary Button
                  </button>
                  <button className="ml-4 px-6 py-2 rounded-lg text-white font-medium shadow-md transition-transform hover:scale-105" style={{ backgroundImage: `linear-gradient(to right, ${formData.theme_primary_color}, ${formData.theme_secondary_color})` }}>
                    Gradient Button
                  </button>
                </div>
              </div>
            )}

            {/* Contact Information Tab */}
            {activeTab === 'contact' && (
              <div className="space-y-6 animate-fade-in">
                <h2 className="text-lg font-semibold text-gray-800 border-b pb-3">Contact Information</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-1">Company Name</label>
                    <input type="text" name="contact_company_name" value={formData.contact_company_name} onChange={handleChange} className="w-full border border-gray-300 rounded-lg px-4 py-2 text-sm focus:border-[#0B63CE] outline-none" />
                  </div>
                  {/* Emails */}
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-1">Email Addresses</label>
                    {formData.contact_emails.map((email, index) => (
                      <div key={index} className="flex gap-2 mb-2">
                        <input type="email" value={email} onChange={(e) => handleArrayChange(index, 'contact_emails', e.target.value)} className="w-full border border-gray-300 rounded-lg px-4 py-2 text-sm focus:border-[#0B63CE] outline-none" placeholder="contact@company.com" />
                        <button type="button" onClick={() => removeArrayItem(index, 'contact_emails')} className="px-3 py-2 text-red-500 hover:bg-red-50 rounded-lg transition border border-transparent hover:border-red-100">Remove</button>
                      </div>
                    ))}
                    <button type="button" onClick={() => addArrayItem('contact_emails')} className="text-[#0B63CE] text-sm font-medium hover:underline">+ Add Another Email</button>
                  </div>

                  {/* Phones */}
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-1">Phone Numbers</label>
                    {formData.contact_phones.map((phone, index) => (
                      <div key={index} className="flex gap-2 mb-2">
                        <input type="text" value={phone} onChange={(e) => handleArrayChange(index, 'contact_phones', e.target.value)} className="w-full border border-gray-300 rounded-lg px-4 py-2 text-sm focus:border-[#0B63CE] outline-none" placeholder="+1 234 567 8900" />
                        <button type="button" onClick={() => removeArrayItem(index, 'contact_phones')} className="px-3 py-2 text-red-500 hover:bg-red-50 rounded-lg transition border border-transparent hover:border-red-100">Remove</button>
                      </div>
                    ))}
                    <button type="button" onClick={() => addArrayItem('contact_phones')} className="text-[#0B63CE] text-sm font-medium hover:underline">+ Add Another Phone</button>
                  </div>

                  {/* Office Addresses */}
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-1">Office Addresses</label>
                    {formData.contact_office_addresses.map((address, index) => (
                      <div key={index} className="flex gap-2 mb-2">
                        <textarea value={address} onChange={(e) => handleArrayChange(index, 'contact_office_addresses', e.target.value)} rows="2" className="w-full border border-gray-300 rounded-lg px-4 py-2 text-sm focus:border-[#0B63CE] outline-none" placeholder="123 Export Avenue..."></textarea>
                        <button type="button" onClick={() => removeArrayItem(index, 'contact_office_addresses')} className="px-3 py-2 text-red-500 hover:bg-red-50 rounded-lg transition border border-transparent hover:border-red-100">Remove</button>
                      </div>
                    ))}
                    <button type="button" onClick={() => addArrayItem('contact_office_addresses')} className="text-[#0B63CE] text-sm font-medium hover:underline">+ Add Another Address</button>
                  </div>

                  {/* WhatsApp */}
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-1">WhatsApp Number</label>
                    <input type="text" name="contact_whatsapp" value={formData.contact_whatsapp} onChange={handleChange} className="w-full border border-gray-300 rounded-lg px-4 py-2 text-sm focus:border-[#0B63CE] outline-none" placeholder="+1 234 567 8900" />
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-1">Business Hours</label>
                    <input type="text" name="contact_business_hours" value={formData.contact_business_hours} onChange={handleChange} placeholder="e.g. Monday - Saturday, 9:00 AM - 6:00 PM" className="w-full border border-gray-300 rounded-lg px-4 py-2 text-sm focus:border-[#0B63CE] outline-none" />
                  </div>
                  
                  {/* WhatsApp Floating Button */}
                  <div className="md:col-span-2 mt-4 pt-4 border-t border-gray-100">
                    <h3 className="text-md font-semibold text-gray-800 mb-4">WhatsApp Floating Button</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="flex items-center gap-3 md:col-span-2">
                        <input type="checkbox" name="whatsapp_float_enabled" id="whatsapp_float_enabled" checked={formData.whatsapp_float_enabled} onChange={handleChange} className="w-5 h-5 text-[#0B63CE] rounded" />
                        <label htmlFor="whatsapp_float_enabled" className="text-sm font-medium text-gray-700 cursor-pointer">Enable Floating WhatsApp Button</label>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">WhatsApp Number (with country code)</label>
                        <input type="text" name="whatsapp_float_number" value={formData.whatsapp_float_number} onChange={handleChange} className="w-full border border-gray-300 rounded-lg px-4 py-2 text-sm focus:border-[#0B63CE] outline-none" placeholder="e.g. 919876543210" disabled={!formData.whatsapp_float_enabled} />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Default Message</label>
                        <input type="text" name="whatsapp_float_message" value={formData.whatsapp_float_message} onChange={handleChange} className="w-full border border-gray-300 rounded-lg px-4 py-2 text-sm focus:border-[#0B63CE] outline-none" placeholder="Hello, I want to know more!" disabled={!formData.whatsapp_float_enabled} />
                      </div>
                    </div>
                  </div>

                  {/* Google Map Embedded */}
                  <div className="md:col-span-2 mt-4 pt-4 border-t border-gray-100">
                    <h3 className="text-md font-semibold text-gray-800 mb-4">Google Map Embedded</h3>
                    <div className="mb-4">
                      <label className="block text-sm font-medium text-gray-700 mb-1">Google Map Embed URL or Iframe</label>
                      <input type="text" name="contact_google_map_url" value={formData.contact_google_map_url} onChange={handleChange} className="w-full border border-gray-300 rounded-lg px-4 py-2 text-sm focus:border-[#0B63CE] outline-none" placeholder='https://www.google.com/maps/embed?...' />
                      <p className="text-xs text-gray-500 mt-1">Full URL to the Google Maps embed.</p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Map Width</label>
                        <input type="text" name="contact_map_width" value={formData.contact_map_width} onChange={handleChange} className="w-full border border-gray-300 rounded-lg px-4 py-2 text-sm focus:border-[#0B63CE] outline-none" placeholder="e.g. 100% or 800px" />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Map Height</label>
                        <input type="text" name="contact_map_height" value={formData.contact_map_height} onChange={handleChange} className="w-full border border-gray-300 rounded-lg px-4 py-2 text-sm focus:border-[#0B63CE] outline-none" placeholder="e.g. 400px or 500px" />
                      </div>
                    </div>
                  </div>

                  {/* FAQs */}
                  <div className="md:col-span-2 mt-4 pt-4 border-t border-gray-100">
                    <h3 className="text-md font-semibold text-gray-800 mb-4">Frequently Asked Questions (Contact Page)</h3>
                    <div className="space-y-4">
                      {formData.contact_faqs.map((faq, index) => (
                        <div key={index} className="flex gap-3 items-start bg-gray-50/50 p-4 rounded-lg border border-gray-200">
                          <div className="flex-grow space-y-3">
                            <div>
                              <label className="block text-xs font-medium text-gray-500 mb-1">Question</label>
                              <input type="text" value={faq.question} onChange={(e) => handleObjectArrayChange(index, 'contact_faqs', 'question', e.target.value)} className="w-full border border-gray-300 rounded-lg px-3 py-1.5 text-sm focus:border-[#0B63CE] outline-none bg-white" placeholder="e.g. How can I request a quotation?" />
                            </div>
                            <div>
                              <label className="block text-xs font-medium text-gray-500 mb-1">Answer</label>
                              <textarea value={faq.answer} onChange={(e) => handleObjectArrayChange(index, 'contact_faqs', 'answer', e.target.value)} rows="3" className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:border-[#0B63CE] outline-none resize-none bg-white" placeholder="e.g. You can request a quotation by..."></textarea>
                            </div>
                          </div>
                          <button type="button" onClick={() => removeArrayItem(index, 'contact_faqs', true, {question: '', answer: ''})} className="mt-6 text-red-500 hover:text-red-700 p-2 bg-white rounded-lg border border-red-100 hover:bg-red-50 transition-colors">
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                          </button>
                        </div>
                      ))}
                      <button type="button" onClick={() => addObjectArrayItem('contact_faqs', {question: '', answer: ''})} className="text-sm text-[#0B63CE] font-medium hover:underline flex items-center">
                        <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" /></svg> Add Question
                      </button>
                    </div>
                  </div>

                </div>
              </div>
            )}

            {/* Social Media Tab */}
            {activeTab === 'social' && (
              <div className="space-y-6 animate-fade-in">
                <h2 className="text-lg font-semibold text-gray-800 border-b pb-3">Social Media Links</h2>
                <div className="space-y-4">
                  {['facebook', 'instagram', 'linkedin', 'youtube', 'twitter'].map(platform => (
                    <div key={platform} className="flex items-center gap-4 p-4 border border-gray-100 rounded-lg bg-gray-50/50">
                      <div className="w-24 shrink-0 font-medium capitalize text-sm text-gray-700">{platform}</div>
                      <input 
                        type="url" 
                        name={`social_${platform}`} 
                        value={formData[`social_${platform}`]} 
                        onChange={handleChange} 
                        placeholder={`https://${platform}.com/...`}
                        className="flex-grow border border-gray-300 rounded-lg px-3 py-2 text-sm focus:border-[#0B63CE] outline-none"
                      />
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Footer & Features Tab */}
            {activeTab === 'footer' && (
              <div className="space-y-6 animate-fade-in">
                <h2 className="text-lg font-semibold text-gray-800 border-b pb-3">Website Features</h2>
                <div className="mb-6">
                  <div className="flex items-center gap-3">
                    <input type="checkbox" name="blog_enabled" id="blog_enabled" checked={formData.blog_enabled} onChange={handleChange} className="w-5 h-5 text-[#0B63CE] rounded" />
                    <label htmlFor="blog_enabled" className="text-sm font-medium text-gray-700 cursor-pointer">Enable Blog Module</label>
                  </div>
                  <p className="text-xs text-gray-500 mt-1 ml-8">If disabled, the Blog link will be hidden from the header and other areas.</p>
                </div>

                <h2 className="text-lg font-semibold text-gray-800 border-b pb-3 mt-8">Footer Settings</h2>
                
                <div className="mb-6">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Footer Description</label>
                  <p className="text-xs text-gray-500 mb-2">Text displayed below the logo in the footer.</p>
                  <textarea name="footer_description" value={formData.footer_description} onChange={handleChange} rows="3" className="w-full border border-gray-300 rounded-lg px-4 py-2 text-sm focus:border-[#0B63CE] outline-none"></textarea>
                </div>

                <div className="mb-6">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Copyright Text</label>
                  <input type="text" name="footer_copyright_text" value={formData.footer_copyright_text} onChange={handleChange} className="w-full border border-gray-300 rounded-lg px-4 py-2 text-sm focus:border-[#0B63CE] outline-none" />
                </div>

                <div className="mt-8">
                  <h3 className="text-md font-semibold text-gray-800 mb-4">Footer Quick Links</h3>
                  {formData.footer_quick_links.map((item, index) => (
                    <div key={index} className="flex gap-4 mb-3 items-end">
                      <div className="flex-1">
                        <label className="block text-xs font-medium text-gray-500 mb-1">Label</label>
                        <input type="text" value={item.label} onChange={(e) => handleObjectArrayChange(index, 'footer_quick_links', 'label', e.target.value)} className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:border-[#0B63CE] outline-none" placeholder="About Us" />
                      </div>
                      <div className="flex-1">
                        <label className="block text-xs font-medium text-gray-500 mb-1">Page / Route</label>
                        <UrlSelector 
                          value={item} 
                          onChange={(val) => handleObjectArrayChange(index, 'footer_quick_links', null, val)} 
                        />
                      </div>
                      <button type="button" onClick={() => removeArrayItem(index, 'footer_quick_links', true)} className="px-3 py-2 text-red-500 hover:bg-red-50 rounded-lg transition border border-transparent hover:border-red-100 h-[38px]">Remove</button>
                    </div>
                  ))}
                  <button type="button" onClick={() => addObjectArrayItem('footer_quick_links')} className="text-[#0B63CE] text-sm font-medium hover:underline">+ Add Quick Link</button>
                </div>

                <div className="mt-8 border-t pt-8">
                  <h3 className="text-md font-semibold text-gray-800 mb-4">Footer Product Links</h3>
                  <p className="text-xs text-gray-500 mb-4">Manually configure the products/categories displayed in the footer Products column.</p>
                  {formData.footer_product_links.map((item, index) => (
                    <div key={index} className="flex gap-4 mb-3 items-end">
                      <div className="flex-1">
                        <label className="block text-xs font-medium text-gray-500 mb-1">Product/Category Name</label>
                        <input type="text" value={item.label} onChange={(e) => handleObjectArrayChange(index, 'footer_product_links', 'label', e.target.value)} className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:border-[#0B63CE] outline-none" placeholder="Fresh Mangoes" />
                      </div>
                      <div className="flex-1">
                        <label className="block text-xs font-medium text-gray-500 mb-1">Page / Route</label>
                        <UrlSelector 
                          value={item} 
                          onChange={(val) => handleObjectArrayChange(index, 'footer_product_links', null, val)} 
                        />
                      </div>
                      <button type="button" onClick={() => removeArrayItem(index, 'footer_product_links', true)} className="px-3 py-2 text-red-500 hover:bg-red-50 rounded-lg transition border border-transparent hover:border-red-100 h-[38px]">Remove</button>
                    </div>
                  ))}
                  <button type="button" onClick={() => addObjectArrayItem('footer_product_links')} className="text-[#0B63CE] text-sm font-medium hover:underline">+ Add Product Link</button>
                </div>

              </div>
            )}

            {/* SEO Settings Tab */}
            {activeTab === 'seo' && (
              <div className="space-y-6 animate-fade-in">
                <h2 className="text-lg font-semibold text-gray-800 border-b pb-3">Home Page SEO</h2>
                <div className="mb-6">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Home Page Title</label>
                  <p className="text-xs text-gray-500 mb-2">This is the title that will appear in search engines and browser tabs for the home page.</p>
                  <input type="text" name="seo_home_title" value={formData.seo_home_title || ''} onChange={handleChange} placeholder="e.g., Exim - Global Export & Import" className="w-full border border-gray-300 rounded-lg px-4 py-2 text-sm focus:border-[#0B63CE] outline-none" />
                </div>
              </div>
            )}

          </div>
        </div>
      </div>
    </>
  );
}
