import { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import SaveIcon from '@mui/icons-material/Save';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import ExtensionIcon from '@mui/icons-material/Extension';
import EmailIcon from '@mui/icons-material/Email';

export default function Integrations() {
  const [formData, setFormData] = useState({
    microsoft_clarity_enabled: false,
    microsoft_clarity_project_id: '',
    gsc_enabled: false,
    gsc_site_url: '',
    gsc_service_account_json: '',
    smtp_host: '',
    smtp_port: '465',
    smtp_username: '',
    smtp_password: '',
    smtp_encryption: 'ssl',
    smtp_from_address: '',
    smtp_from_name: 'BiteExport',
  });

  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [isClarityGuideOpen, setIsClarityGuideOpen] = useState(false);
  const [isGscGuideOpen, setIsGscGuideOpen] = useState(false);

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
          const newFormData = { ...formData };
          
          if (json.data.microsoft_clarity_enabled === 'true' || json.data.microsoft_clarity_enabled === '1') {
            newFormData.microsoft_clarity_enabled = true;
          } else if (json.data.microsoft_clarity_enabled === 'false' || json.data.microsoft_clarity_enabled === '0') {
            newFormData.microsoft_clarity_enabled = false;
          }

          if (json.data.microsoft_clarity_project_id !== undefined && json.data.microsoft_clarity_project_id !== null && json.data.microsoft_clarity_project_id !== 'null') {
            newFormData.microsoft_clarity_project_id = json.data.microsoft_clarity_project_id;
          }

          if (json.data.gsc_enabled === 'true' || json.data.gsc_enabled === '1') {
            newFormData.gsc_enabled = true;
          } else if (json.data.gsc_enabled === 'false' || json.data.gsc_enabled === '0') {
            newFormData.gsc_enabled = false;
          }

          if (json.data.gsc_site_url !== undefined && json.data.gsc_site_url !== null) {
            newFormData.gsc_site_url = json.data.gsc_site_url;
          }

          if (json.data.gsc_service_account_json !== undefined && json.data.gsc_service_account_json !== null) {
            newFormData.gsc_service_account_json = json.data.gsc_service_account_json;
          }

          // SMTP fields
          ['smtp_host', 'smtp_port', 'smtp_username', 'smtp_password', 'smtp_encryption', 'smtp_from_address', 'smtp_from_name'].forEach(key => {
            if (json.data[key] !== undefined && json.data[key] !== null) {
              newFormData[key] = json.data[key];
            }
          });
          
          setFormData(newFormData);
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

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSaving(true);
    setSuccessMessage('');
    
    const submitData = new FormData();
    submitData.append('microsoft_clarity_enabled', formData.microsoft_clarity_enabled ? 'true' : 'false');
    submitData.append('microsoft_clarity_project_id', formData.microsoft_clarity_project_id || '');
    submitData.append('gsc_enabled', formData.gsc_enabled ? 'true' : 'false');
    submitData.append('gsc_site_url', formData.gsc_site_url || '');
    submitData.append('gsc_service_account_json', formData.gsc_service_account_json || '');

    // Append SMTP fields
    submitData.append('smtp_host', formData.smtp_host || '');
    submitData.append('smtp_port', formData.smtp_port || '465');
    submitData.append('smtp_username', formData.smtp_username || '');
    submitData.append('smtp_password', formData.smtp_password || '');
    submitData.append('smtp_encryption', formData.smtp_encryption || 'ssl');
    submitData.append('smtp_from_address', formData.smtp_from_address || '');
    submitData.append('smtp_from_name', formData.smtp_from_name || 'BiteExport');

    submitData.append('_method', 'PUT');

    try {
      const res = await fetch('/api/admin/website/settings', {
        method: 'POST',
        headers: {
          'Accept': 'application/json'
        },
        body: submitData
      });

      if (res.ok) {
        setSuccessMessage('Integrations & SMTP settings updated successfully!');
        setTimeout(() => setSuccessMessage(''), 3000);
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
        <title>Integrations & Email Setup | Admin</title>
      </Helmet>

      <div className="max-w-4xl mx-auto p-6 animate-fade-in">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Analytics, Integrations & SMTP Setup</h1>
            <p className="text-gray-500 text-sm mt-1">Manage third-party tracking scripts, Search Console API, and outgoing email server settings.</p>
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
          <div className="mb-6 p-4 bg-green-50 border border-green-200 text-green-700 rounded-lg flex items-center shadow-sm">
            <CheckCircleIcon className="mr-3" fontSize="small" />
            <span className="font-medium">{successMessage}</span>
          </div>
        )}

        <div className="space-y-6">

          {/* Email / SMTP Configuration Card */}
          <div className="bg-white border border-gray-200 rounded-xl overflow-hidden shadow-sm">
            <div className="p-6">
              <div className="flex items-start justify-between mb-6">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-green-50 rounded-lg flex items-center justify-center text-green-600">
                    <EmailIcon />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-gray-900">SMTP Email Server Setup</h3>
                    <p className="text-sm text-gray-500">Configure outgoing email address (e.g. info@biteexport.com) for sending campaigns.</p>
                  </div>
                </div>
                <div className={`px-3 py-1 rounded-full text-xs font-semibold ${formData.smtp_host && formData.smtp_username ? 'bg-green-100 text-green-700' : 'bg-amber-100 text-amber-700'}`}>
                  {formData.smtp_host && formData.smtp_username ? 'Configured' : 'Not Configured'}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-5 bg-gray-50/50 p-5 rounded-lg border border-gray-100">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">SMTP Host</label>
                  <input 
                    type="text" 
                    name="smtp_host" 
                    value={formData.smtp_host || ''} 
                    onChange={handleChange} 
                    className="w-full border border-gray-300 rounded-lg px-4 py-2 text-sm focus:border-[#0B63CE] outline-none bg-white" 
                    placeholder="e.g. smtp.hostinger.com or smtp.gmail.com" 
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">SMTP Port</label>
                  <input 
                    type="text" 
                    name="smtp_port" 
                    value={formData.smtp_port || '465'} 
                    onChange={handleChange} 
                    className="w-full border border-gray-300 rounded-lg px-4 py-2 text-sm focus:border-[#0B63CE] outline-none bg-white" 
                    placeholder="465 for SSL or 587 for TLS" 
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">SMTP Username / Email</label>
                  <input 
                    type="email" 
                    name="smtp_username" 
                    value={formData.smtp_username || ''} 
                    onChange={handleChange} 
                    className="w-full border border-gray-300 rounded-lg px-4 py-2 text-sm focus:border-[#0B63CE] outline-none bg-white" 
                    placeholder="info@biteexport.com" 
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">SMTP Password</label>
                  <input 
                    type="password" 
                    name="smtp_password" 
                    value={formData.smtp_password || ''} 
                    onChange={handleChange} 
                    className="w-full border border-gray-300 rounded-lg px-4 py-2 text-sm focus:border-[#0B63CE] outline-none bg-white" 
                    placeholder="Email Account Password" 
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Encryption Method</label>
                  <select 
                    name="smtp_encryption" 
                    value={formData.smtp_encryption || 'ssl'} 
                    onChange={handleChange} 
                    className="w-full border border-gray-300 rounded-lg px-4 py-2 text-sm focus:border-[#0B63CE] outline-none bg-white"
                  >
                    <option value="ssl">SSL (Port 465)</option>
                    <option value="tls">TLS (Port 587)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Sender From Name</label>
                  <input 
                    type="text" 
                    name="smtp_from_name" 
                    value={formData.smtp_from_name || 'BiteExport'} 
                    onChange={handleChange} 
                    className="w-full border border-gray-300 rounded-lg px-4 py-2 text-sm focus:border-[#0B63CE] outline-none bg-white" 
                    placeholder="BiteExport" 
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Microsoft Clarity Card */}
          <div className="bg-white border border-gray-200 rounded-xl overflow-hidden shadow-sm">
            <div className="p-6">
              <div className="flex items-start justify-between mb-6">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-blue-50 rounded-lg flex items-center justify-center text-blue-600">
                    <ExtensionIcon />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-gray-900">Microsoft Clarity</h3>
                    <p className="text-sm text-gray-500">Track visitor behavior using heatmaps, session recordings, and user analytics.</p>
                  </div>
                </div>
                <div className={`px-3 py-1 rounded-full text-xs font-semibold ${formData.microsoft_clarity_enabled && formData.microsoft_clarity_project_id ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-600'}`}>
                  {formData.microsoft_clarity_enabled && formData.microsoft_clarity_project_id ? 'Connected' : 'Not Connected'}
                </div>
              </div>

              <div className="space-y-6 bg-gray-50/50 p-5 rounded-lg border border-gray-100">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Microsoft Clarity Project ID</label>
                  <p className="text-xs text-gray-500 mb-2">Find your Project ID: Microsoft Clarity Dashboard &rarr; Settings &rarr; Setup &rarr; Install manually</p>
                  <input 
                    type="text" 
                    name="microsoft_clarity_project_id" 
                    value={formData.microsoft_clarity_project_id || ''} 
                    onChange={handleChange} 
                    className="w-full border border-gray-300 rounded-lg px-4 py-2 text-sm focus:border-[#0B63CE] outline-none max-w-md bg-white" 
                    placeholder="Example: abc123xyz" 
                  />
                </div>

                <div className="flex items-center gap-3">
                  <input 
                    type="checkbox" 
                    name="microsoft_clarity_enabled" 
                    id="microsoft_clarity_enabled" 
                    checked={formData.microsoft_clarity_enabled} 
                    onChange={handleChange} 
                    className="w-5 h-5 text-[#0B63CE] rounded border-gray-300" 
                  />
                  <label htmlFor="microsoft_clarity_enabled" className="text-sm font-medium text-gray-700 cursor-pointer">
                    Enable Microsoft Clarity Tracking
                  </label>
                </div>
              </div>
            </div>
          </div>

          {/* Google Search Console Card */}
          <div className="bg-white border border-gray-200 rounded-xl overflow-hidden shadow-sm">
            <div className="p-6">
              <div className="flex items-start justify-between mb-6">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-red-50 rounded-lg flex items-center justify-center text-red-600">
                    <ExtensionIcon />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-gray-900">Google Search Console API</h3>
                    <p className="text-sm text-gray-500">Fetch real-time organic search clicks, impressions, and performance for your Admin Dashboard.</p>
                  </div>
                </div>
                <div className={`px-3 py-1 rounded-full text-xs font-semibold ${formData.gsc_enabled && formData.gsc_site_url && formData.gsc_service_account_json ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-600'}`}>
                  {formData.gsc_enabled && formData.gsc_site_url && formData.gsc_service_account_json ? 'Connected' : 'Not Connected'}
                </div>
              </div>

              <div className="space-y-6 bg-gray-50/50 p-5 rounded-lg border border-gray-100">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Search Console Property URL</label>
                  <p className="text-xs text-gray-500 mb-2">Exact site URL registered in your Google Search Console (e.g. https://yourdomain.com/)</p>
                  <input 
                    type="text" 
                    name="gsc_site_url" 
                    value={formData.gsc_site_url || ''} 
                    onChange={handleChange} 
                    className="w-full border border-gray-300 rounded-lg px-4 py-2 text-sm focus:border-[#0B63CE] outline-none bg-white" 
                    placeholder="https://yourdomain.com/" 
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Service Account JSON Key</label>
                  <p className="text-xs text-gray-500 mb-2">Paste the complete contents of your Google Cloud Service Account JSON key file</p>
                  <textarea 
                    name="gsc_service_account_json" 
                    rows={4}
                    value={formData.gsc_service_account_json || ''} 
                    onChange={handleChange} 
                    className="w-full border border-gray-300 rounded-lg p-3 text-xs font-mono focus:border-[#0B63CE] outline-none bg-white" 
                    placeholder='{"type": "service_account", "project_id": "...", "private_key": "..."}' 
                  />
                </div>

                <div className="flex items-center gap-3">
                  <input 
                    type="checkbox" 
                    name="gsc_enabled" 
                    id="gsc_enabled" 
                    checked={formData.gsc_enabled} 
                    onChange={handleChange} 
                    className="w-5 h-5 text-[#0B63CE] rounded border-gray-300" 
                  />
                  <label htmlFor="gsc_enabled" className="text-sm font-medium text-gray-700 cursor-pointer">
                    Enable Google Search Console Integration
                  </label>
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>
    </>
  );
}
