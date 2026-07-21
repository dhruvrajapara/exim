import React, { useState, useEffect } from 'react';
import { 
  fetchAdminVisionMission, 
  createVisionMission, 
  updateVisionMission, 
  deleteVisionMission,
  fetchSectionSetting,
  updateSectionSetting
} from '../../../../services/api';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import AddIcon from '@mui/icons-material/Add';
import CloseIcon from '@mui/icons-material/Close';
import VisibilityIcon from '@mui/icons-material/Visibility';
import PublicIcon from '@mui/icons-material/Public';
import TravelExploreIcon from '@mui/icons-material/TravelExplore';
import FlagIcon from '@mui/icons-material/Flag';
import TrackChangesIcon from '@mui/icons-material/TrackChanges';
import MilitaryTechIcon from '@mui/icons-material/MilitaryTech';

const availableIcons = [
  'Visibility', 'Public', 'TravelExplore', 'Flag', 'TrackChanges', 'MilitaryTech'
];

const VisionMissionAdmin = () => {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // Modal states
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState('add');
  const [currentItem, setCurrentItem] = useState(null);
  
  // Form states
  const [formData, setFormData] = useState({
    type: 'vision',
    label: '',
    title: '',
    description: '',
    icon: 'Visibility'
  });
  const [formLoading, setFormLoading] = useState(false);
  
  // Delete confirm state
  const [deleteId, setDeleteId] = useState(null);

  // Section Settings State
  const [sectionSetting, setSectionSetting] = useState({
    subtitle: 'OUR PURPOSE',
    title: 'Vision & Mission',
    description: 'Our vision and mission guide every step of our journey as we strive to become a trusted global exporter of premium agricultural products.'
  });
  const [savingSection, setSavingSection] = useState(false);
  const [isSectionOpen, setIsSectionOpen] = useState(false);

  useEffect(() => {
    loadItems();
    loadSectionSetting();
  }, []);

  const loadSectionSetting = async () => {
    try {
      const data = await fetchSectionSetting('vision_mission');
      if (data) {
        setSectionSetting({
          subtitle: data.subtitle || 'OUR PURPOSE',
          title: data.title || 'Vision & Mission',
          description: data.description || 'Our vision and mission guide every step of our journey as we strive to become a trusted global exporter of premium agricultural products.'
        });
      }
    } catch (error) {
      console.error('Error loading section setting:', error);
    }
  };

  const handleSaveSectionSetting = async (e) => {
    e.preventDefault();
    setSavingSection(true);
    try {
      await updateSectionSetting('vision_mission', sectionSetting);
      showToast('Section header updated successfully!');
      setIsSectionOpen(false);
    } catch (error) {
      showToast('Error updating section header', 'error');
    }
    setSavingSection(false);
  };

  const loadItems = async () => {
    setLoading(true);
    try {
      const data = await fetchAdminVisionMission();
      setItems(data || []);
    } catch (error) {
      showToast('Error loading vision & mission items', 'error');
    }
    setLoading(false);
  };

  const showToast = (message, type = 'success') => {
    alert(message);
  };

  const resetForm = () => {
    setFormData({
      type: 'vision',
      label: '',
      title: '',
      description: '',
      icon: 'Visibility'
    });
    setCurrentItem(null);
    setFormLoading(false);
  };

  const handleOpenAdd = () => {
    resetForm();
    setModalMode('add');
    setIsModalOpen(true);
  };

  const handleOpenEdit = (item) => {
    setCurrentItem(item);
    setFormData({
      type: item.type,
      label: item.label,
      title: item.title,
      description: item.description,
      icon: item.icon
    });
    setModalMode('edit');
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    resetForm();
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormLoading(true);

    try {
      if (modalMode === 'add') {
        await createVisionMission(formData);
        showToast('Item added successfully!');
      } else {
        await updateVisionMission(currentItem.id, formData);
        showToast('Item updated successfully!');
      }
      handleCloseModal();
      loadItems();
    } catch (error) {
      showToast(error.message || 'Error saving item', 'error');
    }
    setFormLoading(false);
  };

  const handleDeleteClick = (id) => {
    setDeleteId(id);
  };

  const confirmDelete = async () => {
    try {
      await deleteVisionMission(deleteId);
      showToast('Item deleted successfully!');
      setDeleteId(null);
      loadItems();
    } catch (error) {
      showToast('Error deleting item', 'error');
    }
  };

  return (
    <div className="p-4 md:p-6 min-h-full bg-gray-50/50">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4 flex-shrink-0">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Vision & Mission</h1>
          <p className="text-sm text-gray-500 mt-1">Manage the Vision and Mission cards displayed on the About page.</p>
        </div>
        <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
          <button 
            onClick={() => setIsSectionOpen(!isSectionOpen)}
            className="w-full sm:w-auto justify-center bg-white border border-gray-300 text-gray-700 px-5 py-2.5 rounded-lg flex items-center font-medium transition-colors hover:bg-gray-50 shadow-sm"
          >
            <EditIcon className="w-5 h-5 mr-2" />
            {isSectionOpen ? 'Close Header Settings' : 'Edit Section Header'}
          </button>
          <button 
            onClick={handleOpenAdd}
            className="w-full sm:w-auto justify-center bg-[#0B63CE] hover:bg-[#0950A7] text-white px-5 py-2.5 rounded-lg flex items-center font-medium transition-colors shadow-sm"
          >
            <AddIcon className="w-5 h-5 mr-2" />
            Add Item
          </button>
        </div>
      </div>

      {/* Section Settings Panel */}
      {isSectionOpen && (
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 mb-6 overflow-hidden animate-slide-down flex-shrink-0">
          <div className="px-6 py-4 border-b border-gray-100 bg-gray-50/50 flex justify-between items-center">
            <h2 className="text-lg font-bold text-gray-900">Section Header Settings</h2>
            <button onClick={() => setIsSectionOpen(false)} className="text-gray-400 hover:text-gray-600">
              <CloseIcon />
            </button>
          </div>
          <div className="p-6">
            <form onSubmit={handleSaveSectionSetting} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Subtitle (e.g. OUR PURPOSE)</label>
                  <input type="text" value={sectionSetting.subtitle} onChange={(e) => setSectionSetting({...sectionSetting, subtitle: e.target.value})} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-[#0B63CE] focus:border-[#0B63CE] sm:text-sm" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Main Title</label>
                  <input type="text" value={sectionSetting.title} onChange={(e) => setSectionSetting({...sectionSetting, title: e.target.value})} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-[#0B63CE] focus:border-[#0B63CE] sm:text-sm" />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                <textarea rows="3" value={sectionSetting.description} onChange={(e) => setSectionSetting({...sectionSetting, description: e.target.value})} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-[#0B63CE] focus:border-[#0B63CE] sm:text-sm resize-none"></textarea>
              </div>
              <div className="flex justify-end">
                <button type="submit" disabled={savingSection} className="px-5 py-2 text-sm font-medium text-white bg-[#0B63CE] rounded-lg hover:bg-[#0950A7] disabled:opacity-50">
                  {savingSection ? 'Saving...' : 'Save Settings'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 mb-8 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Type</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Label</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Title</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Icon</th>
                <th className="px-6 py-4 text-right text-xs font-semibold text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {loading ? (
                <tr>
                  <td colSpan="5" className="px-6 py-8 text-center text-gray-500">
                    <div className="flex justify-center items-center">
                      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#0B63CE]"></div>
                    </div>
                  </td>
                </tr>
              ) : items.length === 0 ? (
                <tr>
                  <td colSpan="5" className="px-6 py-8 text-center text-gray-500 bg-gray-50/50">
                    No vision/mission items found. Click "Add Item" to create one.
                  </td>
                </tr>
              ) : (
                items.map((item) => (
                  <tr key={item.id} className="hover:bg-gray-50/50 transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                        item.type === 'vision' ? 'bg-blue-100 text-blue-800' : 'bg-green-100 text-green-800'
                      }`}>
                        {item.type.toUpperCase()}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">{item.label}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{item.title}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="text-gray-500 text-sm bg-gray-100 px-2 py-1 rounded">{item.icon}</span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <div className="flex justify-end gap-2">
                        <button
                          onClick={() => handleOpenEdit(item)}
                          className="p-1.5 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                          title="Edit"
                        >
                          <EditIcon className="w-5 h-5" />
                        </button>
                        <button
                          onClick={() => handleDeleteClick(item.id)}
                          className="p-1.5 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                          title="Delete"
                        >
                          <DeleteIcon className="w-5 h-5" />
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
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:p-0">
            <div className="fixed inset-0 transition-opacity bg-gray-900/50 backdrop-blur-sm" onClick={handleCloseModal}></div>

            <div className="relative inline-block w-full max-w-2xl p-6 overflow-hidden text-left align-middle transition-all transform bg-white shadow-xl rounded-2xl sm:my-8 animate-scale-up">
              <div className="flex items-center justify-between mb-5 border-b border-gray-100 pb-4">
                <h3 className="text-xl font-bold text-gray-900">
                  {modalMode === 'add' ? 'Add Item' : 'Edit Item'}
                </h3>
                <button
                  onClick={handleCloseModal}
                  className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-full transition-colors"
                >
                  <CloseIcon />
                </button>
              </div>

              <form onSubmit={handleSubmit} className="space-y-5">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Type *</label>
                    <select
                      required
                      value={formData.type}
                      onChange={(e) => setFormData({...formData, type: e.target.value})}
                      className="w-full px-4 py-2.5 border border-gray-300 rounded-xl focus:ring-[#0B63CE] focus:border-[#0B63CE] bg-white text-sm"
                    >
                      <option value="vision">Vision</option>
                      <option value="mission">Mission</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Icon *</label>
                    <select
                      required
                      value={formData.icon}
                      onChange={(e) => setFormData({...formData, icon: e.target.value})}
                      className="w-full px-4 py-2.5 border border-gray-300 rounded-xl focus:ring-[#0B63CE] focus:border-[#0B63CE] bg-white text-sm"
                    >
                      {availableIcons.map(icon => (
                        <option key={icon} value={icon}>{icon}</option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Label (e.g. OUR VISION) *</label>
                    <input
                      type="text"
                      required
                      value={formData.label}
                      onChange={(e) => setFormData({...formData, label: e.target.value})}
                      className="w-full px-4 py-2.5 border border-gray-300 rounded-xl focus:ring-[#0B63CE] focus:border-[#0B63CE] text-sm"
                      placeholder="Enter label"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Title *</label>
                    <input
                      type="text"
                      required
                      value={formData.title}
                      onChange={(e) => setFormData({...formData, title: e.target.value})}
                      className="w-full px-4 py-2.5 border border-gray-300 rounded-xl focus:ring-[#0B63CE] focus:border-[#0B63CE] text-sm"
                      placeholder="Enter title"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Description *</label>
                  <textarea
                    required
                    rows="4"
                    value={formData.description}
                    onChange={(e) => setFormData({...formData, description: e.target.value})}
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-xl focus:ring-[#0B63CE] focus:border-[#0B63CE] text-sm resize-none"
                    placeholder="Enter full description"
                  ></textarea>
                </div>

                <div className="flex justify-end gap-3 pt-5 border-t border-gray-100">
                  <button
                    type="button"
                    onClick={handleCloseModal}
                    className="px-5 py-2.5 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-xl hover:bg-gray-50 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={formLoading}
                    className="px-5 py-2.5 text-sm font-medium text-white bg-[#0B63CE] rounded-xl hover:bg-[#0950A7] transition-colors disabled:opacity-50 flex items-center"
                  >
                    {formLoading ? (
                      <>
                        <span className="animate-spin w-4 h-4 border-2 border-white border-t-transparent rounded-full mr-2"></span>
                        Saving...
                      </>
                    ) : (
                      modalMode === 'add' ? 'Add Item' : 'Save Changes'
                    )}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {deleteId && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:p-0">
            <div className="fixed inset-0 transition-opacity bg-gray-900/50 backdrop-blur-sm" onClick={() => setDeleteId(null)}></div>
            <div className="relative inline-block w-full max-w-sm p-6 overflow-hidden text-left align-middle transition-all transform bg-white shadow-xl rounded-2xl sm:my-8 animate-scale-up">
              <div className="flex flex-col items-center justify-center text-center">
                <div className="w-12 h-12 rounded-full bg-red-100 flex items-center justify-center mb-4 text-red-600">
                  <DeleteIcon className="w-6 h-6" />
                </div>
                <h3 className="text-lg font-bold text-gray-900 mb-2">Delete Item</h3>
                <p className="text-sm text-gray-500 mb-6">
                  Are you sure you want to delete this vision/mission item? This action cannot be undone.
                </p>
                <div className="flex gap-3 w-full">
                  <button
                    onClick={() => setDeleteId(null)}
                    className="flex-1 px-4 py-2.5 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-xl hover:bg-gray-50 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={confirmDelete}
                    className="flex-1 px-4 py-2.5 text-sm font-medium text-white bg-red-600 rounded-xl hover:bg-red-700 transition-colors"
                  >
                    Delete
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default VisionMissionAdmin;
