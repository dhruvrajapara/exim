import { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import SaveIcon from '@mui/icons-material/Save';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import ExtensionIcon from '@mui/icons-material/Extension';

export default function Integrations() {
  const [formData, setFormData] = useState({
    microsoft_clarity_enabled: false,
    microsoft_clarity_project_id: '',
  });

  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [isClarityGuideOpen, setIsClarityGuideOpen] = useState(false);

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

    // Add required CSRF / Auth tokens if any (typically handled by axios, but using fetch here as in WebsiteAppearance)
    // The previous WebsiteAppearance used _method: PUT and basic fetch without explicit token if it's relying on cookies or the Laravel setup handles it.
    // Wait, WebsiteAppearance used `method: 'POST'` and `submitData.append('_method', 'PUT');`
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
        setSuccessMessage('Integrations settings updated successfully!');
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
        <title>Integrations | Admin</title>
      </Helmet>

      <div className="max-w-4xl mx-auto p-6 animate-fade-in">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Analytics & Integrations</h1>
            <p className="text-gray-500 text-sm mt-1">Manage third-party tracking scripts and connections.</p>
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

              <div className="mt-6">
                <button 
                  type="button" 
                  onClick={() => setIsClarityGuideOpen(!isClarityGuideOpen)}
                  className="flex items-center justify-between w-full p-4 bg-gray-50 rounded-lg border border-gray-200 text-sm font-medium text-gray-700 hover:bg-gray-100 transition-colors"
                >
                  How to Connect Microsoft Clarity
                  <span className="text-gray-400">{isClarityGuideOpen ? '▲' : '▼'}</span>
                </button>
                
                {isClarityGuideOpen && (
                  <div className="p-5 border border-t-0 border-gray-200 rounded-b-lg bg-white text-sm text-gray-600 space-y-5">
                    <div>
                      <h4 className="font-semibold text-gray-900 mb-1">Step 1: Create Microsoft Clarity Account</h4>
                      <p>Open: <a href="https://clarity.microsoft.com" target="_blank" rel="noreferrer" className="text-[#0B63CE] hover:underline">https://clarity.microsoft.com</a></p>
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-900 mb-1">Step 2: Create New Project</h4>
                      <ul className="list-disc pl-5 space-y-1">
                        <li>Enter Website Name</li>
                        <li>Enter Website URL</li>
                        <li>Select Category</li>
                      </ul>
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-900 mb-1">Step 3: Copy Project ID</h4>
                      <p>Go to: Settings &rarr; Setup &rarr; Install manually, and copy the Project ID.</p>
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-900 mb-1">Step 4: Add Project ID</h4>
                      <p>Paste the Project ID in the field above and enable tracking.</p>
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-900 mb-1">Step 5: Verify</h4>
                      <p>Open your website, wait 15-30 minutes, and check the Clarity dashboard for session recordings and heatmaps.</p>
                    </div>

                    <div className="pt-4 border-t border-gray-100 mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <h4 className="font-semibold text-gray-900 mb-2">Benefits:</h4>
                        <ul className="space-y-1">
                          <li className="flex items-center gap-2"><CheckCircleIcon fontSize="inherit" className="text-green-500" /> Heatmaps</li>
                          <li className="flex items-center gap-2"><CheckCircleIcon fontSize="inherit" className="text-green-500" /> Session recordings</li>
                          <li className="flex items-center gap-2"><CheckCircleIcon fontSize="inherit" className="text-green-500" /> Click tracking</li>
                          <li className="flex items-center gap-2"><CheckCircleIcon fontSize="inherit" className="text-green-500" /> Scroll tracking</li>
                          <li className="flex items-center gap-2"><CheckCircleIcon fontSize="inherit" className="text-green-500" /> User behavior analysis</li>
                        </ul>
                      </div>
                      <div>
                        <h4 className="font-semibold text-gray-900 mb-2">Supported:</h4>
                        <ul className="space-y-1">
                          <li className="flex items-center gap-2"><CheckCircleIcon fontSize="inherit" className="text-green-500" /> React</li>
                          <li className="flex items-center gap-2"><CheckCircleIcon fontSize="inherit" className="text-green-500" /> Laravel</li>
                          <li className="flex items-center gap-2"><CheckCircleIcon fontSize="inherit" className="text-green-500" /> SPA Websites</li>
                          <li className="flex items-center gap-2"><CheckCircleIcon fontSize="inherit" className="text-green-500" /> Public Website Pages</li>
                        </ul>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
