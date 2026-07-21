import React, { useState, useEffect, useRef } from 'react';
import { 
  fetchAdminTeamMembers, 
  createTeamMember, 
  updateTeamMember, 
  deleteTeamMember, 
  updateTeamMemberStatus,
  fetchSectionSetting,
  updateSectionSetting
} from '../../../../services/api';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import AddIcon from '@mui/icons-material/Add';
import SearchIcon from '@mui/icons-material/Search';
import CloseIcon from '@mui/icons-material/Close';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';

const TeamMembers = () => {
  const [members, setMembers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [filterFeatured, setFilterFeatured] = useState('all');
  
  // Modal states
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState('add');
  const [currentMember, setCurrentMember] = useState(null);
  
  // Form states
  const [formData, setFormData] = useState({
    name: '',
    designation: '',
    description: '',
    email: '',
    linkedin: '',
    whatsapp: '',
    display_order: 0,
    featured: false,
    status: true,
  });
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState('');
  const [formLoading, setFormLoading] = useState(false);
  
  const [deleteId, setDeleteId] = useState(null);

  // Section Settings State
  const [sectionSetting, setSectionSetting] = useState({
    subtitle: 'OUR TEAM',
    title: 'Meet Our Team',
    description: 'Behind BiteExport is a dedicated team committed to delivering quality products, reliable export services, and long-term partnerships with global buyers.'
  });
  const [savingSection, setSavingSection] = useState(false);
  const [isSectionOpen, setIsSectionOpen] = useState(false);

  const fileInputRef = useRef(null);

  useEffect(() => {
    loadMembers();
  }, [searchTerm, filterStatus, filterFeatured]);

  useEffect(() => {
    loadSectionSetting();
  }, []);

  const loadSectionSetting = async () => {
    try {
      const data = await fetchSectionSetting('about_team');
      if (data) {
        setSectionSetting({
          subtitle: data.subtitle || 'OUR TEAM',
          title: data.title || 'Meet Our Team',
          description: data.description || 'Behind BiteExport is a dedicated team committed to delivering quality products, reliable export services, and long-term partnerships with global buyers.'
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
      await updateSectionSetting('about_team', sectionSetting);
      showToast('Section header updated successfully!');
      setIsSectionOpen(false);
    } catch (error) {
      showToast('Error updating section header', 'error');
    }
    setSavingSection(false);
  };

  const loadMembers = async () => {
    setLoading(true);
    try {
      const data = await fetchAdminTeamMembers({
        search: searchTerm,
        status: filterStatus,
        featured: filterFeatured
      });
      setMembers(data || []);
    } catch (error) {
      showToast('Error loading team members', 'error');
    }
    setLoading(false);
  };

  const showToast = (message, type = 'success') => {
    // Basic alert fallback if no toast system exists
    alert(message);
  };

  const resetForm = () => {
    setFormData({
      name: '',
      designation: '',
      description: '',
      email: '',
      linkedin: '',
      whatsapp: '',
      display_order: 0,
      featured: false,
      status: true,
    });
    setImageFile(null);
    setImagePreview('');
    setCurrentMember(null);
  };

  const handleOpenAdd = () => {
    resetForm();
    setModalMode('add');
    setIsModalOpen(true);
  };

  const handleOpenEdit = (member) => {
    resetForm();
    setCurrentMember(member);
    setFormData({
      name: member.name,
      designation: member.designation,
      description: member.description || '',
      email: member.email || '',
      linkedin: member.linkedin || '',
      whatsapp: member.whatsapp || '',
      display_order: member.display_order,
      featured: member.featured,
      status: member.status,
    });
    if (member.image) {
      setImagePreview(`http://localhost:8000${member.image}`); // Adjust domain if needed based on setup
    }
    setModalMode('edit');
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    resetForm();
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 2 * 1024 * 1024) {
        showToast('Image must be less than 2MB', 'error');
        return;
      }
      
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);

      // We'll upload the original or let the user select webp. 
      // For a true client side convert, we would use a Canvas here. 
      // For simplicity, we just save the file.
      setImageFile(file);
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
  };

  const handleDrop = (e) => {
    e.preventDefault();
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      fileInputRef.current.files = e.dataTransfer.files;
      handleImageChange({ target: { files: e.dataTransfer.files } });
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
    setFormLoading(true);

    try {
      const data = new FormData();
      Object.keys(formData).forEach(key => {
        if (formData[key] !== null) {
          data.append(key, formData[key] === true ? 1 : formData[key] === false ? 0 : formData[key]);
        }
      });
      
      if (imageFile) {
        data.append('image', imageFile);
      }

      if (modalMode === 'add') {
        await createTeamMember(data);
        showToast('Team member added successfully!');
      } else {
        await updateTeamMember(currentMember.id, data);
        showToast('Team member updated successfully!');
      }

      handleCloseModal();
      loadMembers();
    } catch (error) {
      showToast(error.message || 'An error occurred', 'error');
    }
    setFormLoading(false);
  };

  const handleToggleStatus = async (id, currentStatus) => {
    try {
      await updateTeamMemberStatus(id, !currentStatus);
      setMembers(members.map(m => m.id === id ? { ...m, status: !currentStatus } : m));
      showToast('Status updated');
    } catch (error) {
      showToast('Error updating status', 'error');
    }
  };

  const confirmDelete = async () => {
    if (!deleteId) return;
    try {
      await deleteTeamMember(deleteId);
      showToast('Team member deleted successfully!');
      setDeleteId(null);
      loadMembers();
    } catch (error) {
      showToast('Error deleting team member', 'error');
    }
  };

  return (
    <div className="p-4 md:p-6 min-h-full bg-gray-50/50">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4 flex-shrink-0">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Team Members</h1>
          <p className="text-sm text-gray-500 mt-1">Manage team members displayed on the website.</p>
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
            Add Team Member
          </button>
        </div>
      </div>

      {isSectionOpen && (
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 mb-6 overflow-hidden animate-slide-down">
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
                  <label className="block text-sm font-medium text-gray-700 mb-1">Subtitle (e.g. OUR TEAM)</label>
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
        {/* Toolbar */}
        <div className="p-4 border-b border-gray-100 flex flex-col sm:flex-row gap-4 bg-gray-50/30">
          <div className="relative flex-grow max-w-md">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <SearchIcon className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="text"
              placeholder="Search team members..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="block w-full pl-10 pr-3 py-2 border border-gray-200 rounded-lg focus:ring-[#0B63CE] focus:border-[#0B63CE] sm:text-sm transition-colors bg-white"
            />
          </div>
          <div className="flex gap-3">
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="block w-full pl-3 pr-10 py-2 text-base border border-gray-200 focus:outline-none focus:ring-[#0B63CE] focus:border-[#0B63CE] sm:text-sm rounded-lg bg-white"
            >
              <option value="all">All Status</option>
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
            </select>
            <select
              value={filterFeatured}
              onChange={(e) => setFilterFeatured(e.target.value)}
              className="block w-full pl-3 pr-10 py-2 text-base border border-gray-200 focus:outline-none focus:ring-[#0B63CE] focus:border-[#0B63CE] sm:text-sm rounded-lg bg-white"
            >
              <option value="all">All Types</option>
              <option value="true">Featured</option>
              <option value="false">Standard</option>
            </select>
          </div>
        </div>

        {/* Data Table */}
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Member</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Designation</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Order</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Featured</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {loading ? (
                <tr>
                  <td colSpan="6" className="px-6 py-10 text-center text-gray-500">Loading...</td>
                </tr>
              ) : members.length === 0 ? (
                <tr>
                  <td colSpan="6" className="px-6 py-10 text-center text-gray-500">No team members found.</td>
                </tr>
              ) : (
                members.map((member) => (
                  <tr key={member.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="flex-shrink-0 h-10 w-10">
                          <img 
                            className="h-10 w-10 rounded-full object-cover border border-gray-100" 
                            src={member.image ? `http://localhost:8000${member.image}` : `https://ui-avatars.com/api/?name=${encodeURIComponent(member.name)}&background=random`} 
                            alt={member.name} 
                          />
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900">{member.name}</div>
                          <div className="text-sm text-gray-500">{member.email || 'No email'}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {member.designation}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {member.display_order}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {member.featured ? (
                        <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-blue-100 text-blue-800">Featured</span>
                      ) : (
                        <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-gray-100 text-gray-800">Standard</span>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input 
                          type="checkbox" 
                          className="sr-only peer" 
                          checked={member.status}
                          onChange={() => handleToggleStatus(member.id, member.status)}
                        />
                        <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-green-500"></div>
                      </label>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <button onClick={() => handleOpenEdit(member)} className="text-indigo-600 hover:text-indigo-900 mr-4 transition-colors">
                        <EditIcon fontSize="small" />
                      </button>
                      <button onClick={() => setDeleteId(member.id)} className="text-red-600 hover:text-red-900 transition-colors">
                        <DeleteIcon fontSize="small" />
                      </button>
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
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-gray-900/50 backdrop-blur-sm animate-fade-in">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-3xl max-h-[90vh] flex flex-col overflow-hidden animate-slide-up">
            <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
              <h2 className="text-xl font-bold text-gray-900">{modalMode === 'add' ? 'Add Team Member' : 'Edit Team Member'}</h2>
              <button onClick={handleCloseModal} className="text-gray-400 hover:text-gray-600 transition-colors rounded-full p-1 hover:bg-gray-100">
                <CloseIcon />
              </button>
            </div>
            
            <div className="p-6 overflow-y-auto flex-grow">
              <form id="team-form" onSubmit={handleSubmit} className="space-y-6">
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Left Column - Image Upload */}
                  <div className="space-y-2 text-center md:text-left">
                    <label className="block text-sm font-medium text-gray-700">Profile Image</label>
                    <div 
                      className={`mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-dashed rounded-xl transition-colors ${imagePreview ? 'border-gray-300' : 'border-gray-300 hover:border-[#0B63CE]'}`}
                      onDragOver={handleDragOver}
                      onDrop={handleDrop}
                    >
                      <div className="space-y-1 text-center w-full">
                        {imagePreview ? (
                          <div className="relative w-32 h-32 mx-auto mb-4 group rounded-full overflow-hidden border border-gray-200">
                            <img src={imagePreview} alt="Preview" className="w-full h-full object-cover" />
                            <div className="absolute inset-0 bg-black/50 hidden group-hover:flex items-center justify-center transition-all">
                              <span className="text-white text-xs font-medium cursor-pointer" onClick={() => fileInputRef.current?.click()}>Change</span>
                            </div>
                          </div>
                        ) : (
                          <CloudUploadIcon className="mx-auto h-12 w-12 text-gray-400" />
                        )}
                        <div className="flex text-sm text-gray-600 justify-center">
                          <label htmlFor="file-upload" className="relative cursor-pointer bg-white rounded-md font-medium text-[#0B63CE] hover:text-[#0950A7] focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-[#0B63CE]">
                            <span>Upload a file</span>
                            <input id="file-upload" name="file-upload" type="file" className="sr-only" ref={fileInputRef} onChange={handleImageChange} accept="image/jpeg,image/png,image/webp" />
                          </label>
                          <p className="pl-1">or drag and drop</p>
                        </div>
                        <p className="text-xs text-gray-500">PNG, JPG, WEBP up to 2MB</p>
                        <p className="text-xs text-gray-400 mt-2">Will be automatically resized & compressed</p>
                      </div>
                    </div>
                  </div>

                  {/* Right Column - Basic Info */}
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Full Name *</label>
                      <input type="text" name="name" required value={formData.name} onChange={handleChange} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-[#0B63CE] focus:border-[#0B63CE] sm:text-sm" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Designation *</label>
                      <input type="text" name="designation" required value={formData.designation} onChange={handleChange} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-[#0B63CE] focus:border-[#0B63CE] sm:text-sm" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Display Order</label>
                      <input type="number" name="display_order" value={formData.display_order} onChange={handleChange} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-[#0B63CE] focus:border-[#0B63CE] sm:text-sm" />
                    </div>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Short Description</label>
                  <textarea name="description" rows="3" value={formData.description} onChange={handleChange} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-[#0B63CE] focus:border-[#0B63CE] sm:text-sm resize-none"></textarea>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                    <input type="email" name="email" value={formData.email} onChange={handleChange} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-[#0B63CE] focus:border-[#0B63CE] sm:text-sm" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">LinkedIn URL</label>
                    <input type="url" name="linkedin" value={formData.linkedin} onChange={handleChange} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-[#0B63CE] focus:border-[#0B63CE] sm:text-sm" placeholder="https://linkedin.com/in/..." />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">WhatsApp Number</label>
                    <input type="text" name="whatsapp" value={formData.whatsapp} onChange={handleChange} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-[#0B63CE] focus:border-[#0B63CE] sm:text-sm" placeholder="e.g. +919876543210" />
                  </div>
                </div>

                <div className="flex items-center gap-6 pt-2">
                  <label className="flex items-center">
                    <input type="checkbox" name="status" checked={formData.status} onChange={handleChange} className="h-4 w-4 text-[#0B63CE] focus:ring-[#0B63CE] border-gray-300 rounded" />
                    <span className="ml-2 text-sm text-gray-700">Active Status</span>
                  </label>
                  <label className="flex items-center">
                    <input type="checkbox" name="featured" checked={formData.featured} onChange={handleChange} className="h-4 w-4 text-[#0B63CE] focus:ring-[#0B63CE] border-gray-300 rounded" />
                    <span className="ml-2 text-sm text-gray-700">Featured Member</span>
                  </label>
                </div>
              </form>
            </div>
            
            <div className="px-6 py-4 border-t border-gray-100 bg-gray-50 flex justify-end gap-3">
              <button type="button" onClick={handleCloseModal} className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#0B63CE]">
                Cancel
              </button>
              <button type="submit" form="team-form" disabled={formLoading} className="px-4 py-2 text-sm font-medium text-white bg-[#0B63CE] border border-transparent rounded-lg hover:bg-[#0950A7] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#0B63CE] disabled:opacity-50">
                {formLoading ? 'Saving...' : 'Save Team Member'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {deleteId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-gray-900/50 backdrop-blur-sm">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-md p-6 animate-scale-in">
            <h3 className="text-lg font-bold text-gray-900 mb-2">Delete Team Member</h3>
            <p className="text-gray-500 mb-6">Are you sure you want to delete this team member? This action cannot be undone and will remove their profile from the website.</p>
            <div className="flex justify-end gap-3">
              <button onClick={() => setDeleteId(null)} className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50">
                Cancel
              </button>
              <button onClick={confirmDelete} className="px-4 py-2 text-sm font-medium text-white bg-red-600 border border-transparent rounded-lg hover:bg-red-700">
                Delete
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};

export default TeamMembers;
