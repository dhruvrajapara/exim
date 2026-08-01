import { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import DragIndicatorIcon from '@mui/icons-material/DragIndicator';
import SaveIcon from '@mui/icons-material/Save';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';

const DEFAULT_ORDER = [
  { id: 'AboutHero', label: 'About Hero' },
  { id: 'WhyChooseUs', label: 'Why Choose Us' },
  { id: 'VisionMission', label: 'Vision & Mission' },
  { id: 'AboutCertifications', label: 'Certifications' },
  { id: 'AboutTeam', label: 'Team Members' },
];

export default function AboutPageLayout() {
  const [sections, setSections] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  
  // Drag state
  const [draggedItem, setDraggedItem] = useState(null);

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
        if (json.data && json.data.aboutpage_section_order) {
          try {
            const savedOrderIds = JSON.parse(json.data.aboutpage_section_order);
            const loadedSections = savedOrderIds.map(id => {
              const found = DEFAULT_ORDER.find(item => item.id === id);
              return found ? found : null;
            }).filter(Boolean);
            
            const missingSections = DEFAULT_ORDER.filter(def => !savedOrderIds.includes(def.id));
            setSections([...loadedSections, ...missingSections]);
          } catch (e) {
            console.error("Error parsing aboutpage_section_order", e);
            setSections(DEFAULT_ORDER);
          }
        } else {
          setSections(DEFAULT_ORDER);
        }
      } else {
        setSections(DEFAULT_ORDER);
      }
    } catch (error) {
      console.error('Error fetching settings', error);
      setSections(DEFAULT_ORDER);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDragStart = (e, index) => {
    setDraggedItem(sections[index]);
    e.dataTransfer.effectAllowed = 'move';
    e.dataTransfer.setData('text/plain', index);
    setTimeout(() => {
      e.target.style.opacity = '0.5';
    }, 0);
  };

  const handleDragEnd = (e) => {
    e.target.style.opacity = '1';
    setDraggedItem(null);
  };

  const handleDragOver = (e, index) => {
    e.preventDefault();
    if (!draggedItem) return;
    
    const draggedOverItem = sections[index];
    if (draggedItem === draggedOverItem) return;

    const newSections = sections.filter(item => item !== draggedItem);
    newSections.splice(index, 0, draggedItem);
    
    setSections(newSections);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSaving(true);
    
    const submitData = new FormData();
    const orderIds = sections.map(s => s.id);
    submitData.append('aboutpage_section_order', JSON.stringify(orderIds));
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
        setSuccessMessage('About Page layout saved successfully!');
        setTimeout(() => setSuccessMessage(''), 3000);
        window.dispatchEvent(new Event('website-settings-updated'));
      } else {
        const err = await res.json();
        alert(err.message || 'Error saving layout');
      }
    } catch (error) {
      console.error('Fetch error:', error);
      alert(`Connection error: ${error.message}`);
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return <div className="p-8 text-center text-gray-500">Loading layout...</div>;
  }

  return (
    <>
      <Helmet>
        <title>About Page Layout | Admin</title>
      </Helmet>

      <div className="max-w-4xl mx-auto p-6 animate-fade-in">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">About Page Layout</h1>
            <p className="text-gray-500 text-sm mt-1">Drag and drop sections to reorder how they appear on the about page.</p>
          </div>
          <button 
            onClick={handleSubmit}
            disabled={isSaving}
            className={`btn-primary flex items-center px-5 py-2.5 rounded-lg text-sm font-medium ${isSaving ? 'opacity-70 cursor-not-allowed' : ''}`}
          >
            <SaveIcon fontSize="small" className="mr-2" />
            {isSaving ? 'Saving...' : 'Save Layout'}
          </button>
        </div>

        {successMessage && (
          <div className="mb-6 p-4 bg-green-50 border border-green-200 text-green-700 rounded-lg flex items-center shadow-sm">
            <CheckCircleIcon className="mr-3" fontSize="small" />
            <span className="font-medium">{successMessage}</span>
          </div>
        )}

        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <div className="space-y-3">
            {sections.map((section, index) => (
              <div
                key={section.id}
                draggable
                onDragStart={(e) => handleDragStart(e, index)}
                onDragOver={(e) => handleDragOver(e, index)}
                onDragEnd={handleDragEnd}
                className="flex items-center gap-4 p-4 border border-gray-200 rounded-lg bg-gray-50 hover:bg-gray-100 cursor-grab active:cursor-grabbing transition-colors"
              >
                <DragIndicatorIcon className="text-gray-400" />
                <div className="flex-grow">
                  <h3 className="font-medium text-gray-900">{section.label}</h3>
                </div>
                <div className="text-sm font-medium text-gray-400">Position: {index + 1}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}
