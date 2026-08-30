import { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import DeleteIcon from '@mui/icons-material/Delete';
import VisibilityIcon from '@mui/icons-material/Visibility';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import MarkEmailUnreadIcon from '@mui/icons-material/MarkEmailUnread';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import Button from '@mui/material/Button';

export default function InquiriesList() {
  const [inquiries, setInquiries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedInquiry, setSelectedInquiry] = useState(null);
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false);

  useEffect(() => {
    fetchInquiries();
  }, []);

  const fetchInquiries = async () => {
    try {
      const response = await fetch('/api/admin/inquiries');
      if (response.ok) {
        const data = await response.json();
        setInquiries(data);
      }
    } catch (error) {
      console.error('Error fetching inquiries:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleView = async (inquiry) => {
    setSelectedInquiry(inquiry);
    setIsViewDialogOpen(true);

    if (inquiry.status === 'new') {
      try {
        await fetch(`/api/admin/inquiries/${inquiry.id}/status`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ status: 'read' })
        });
        
        // Update local state
        setInquiries(prev => prev.map(item => 
          item.id === inquiry.id ? { ...item, status: 'read' } : item
        ));
        
        setSelectedInquiry(prev => ({ ...prev, status: 'read' }));
      } catch (error) {
        console.error('Error updating status:', error);
      }
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this inquiry?')) return;
    try {
      await fetch(`/api/admin/inquiries/${id}`, {
        method: 'DELETE',
      });
      setInquiries(prev => prev.filter(item => item.id !== id));
    } catch (error) {
      console.error('Error deleting inquiry:', error);
    }
  };

  const closeViewDialog = () => {
    setIsViewDialogOpen(false);
    setSelectedInquiry(null);
  };

  return (
    <div className="space-y-6">
      <Helmet>
        <title>Manage Inquiries | Admin Dashboard</title>
      </Helmet>

      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Contact Inquiries</h1>
          <p className="text-sm text-gray-500 mt-1">Manage inquiries received from the website contact form.</p>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-100">
                <th className="px-6 py-4 text-sm font-semibold text-gray-900">Date</th>
                <th className="px-6 py-4 text-sm font-semibold text-gray-900">Name</th>
                <th className="px-6 py-4 text-sm font-semibold text-gray-900">Company</th>
                <th className="px-6 py-4 text-sm font-semibold text-gray-900">Product</th>
                <th className="px-6 py-4 text-sm font-semibold text-gray-900">Status</th>
                <th className="px-6 py-4 text-sm font-semibold text-gray-900 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {loading ? (
                <tr>
                  <td colSpan="6" className="px-6 py-8 text-center text-gray-500">
                    <div className="w-6 h-6 border-2 border-[#0B63CE] border-t-transparent rounded-full animate-spin mx-auto mb-2"></div>
                    Loading inquiries...
                  </td>
                </tr>
              ) : inquiries.length === 0 ? (
                <tr>
                  <td colSpan="6" className="px-6 py-8 text-center text-gray-500">
                    No inquiries found.
                  </td>
                </tr>
              ) : (
                inquiries.map((inquiry) => (
                  <tr key={inquiry.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4 text-sm text-gray-500 whitespace-nowrap">
                      {new Date(inquiry.created_at).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 text-sm font-medium text-gray-900">
                      {inquiry.name}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-500">
                      {inquiry.company}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-500">
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                        {inquiry.product}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm">
                      {inquiry.status === 'new' ? (
                        <span className="inline-flex items-center gap-1 text-xs font-medium text-red-600 bg-red-50 px-2 py-1 rounded-md">
                          <MarkEmailUnreadIcon fontSize="small" style={{ fontSize: '14px' }} />
                          New
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 text-xs font-medium text-green-600 bg-green-50 px-2 py-1 rounded-md">
                          <CheckCircleIcon fontSize="small" style={{ fontSize: '14px' }} />
                          Read
                        </span>
                      )}
                    </td>
                    <td className="px-6 py-4 text-sm text-right space-x-2 whitespace-nowrap">
                      <button
                        onClick={() => handleView(inquiry)}
                        className="p-1.5 text-[#0B63CE] hover:bg-blue-50 rounded-md transition-colors"
                        title="View Details"
                      >
                        <VisibilityIcon fontSize="small" />
                      </button>
                      <button
                        onClick={() => handleDelete(inquiry.id)}
                        className="p-1.5 text-red-600 hover:bg-red-50 rounded-md transition-colors"
                        title="Delete Inquiry"
                      >
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

      {/* View Details Dialog */}
      <Dialog open={isViewDialogOpen} onClose={closeViewDialog} maxWidth="sm" fullWidth>
        <DialogTitle className="border-b border-gray-100">
          <div className="flex justify-between items-center">
            <span className="text-xl font-bold">Inquiry Details</span>
            {selectedInquiry?.status === 'new' && (
              <span className="text-xs font-medium text-red-600 bg-red-50 px-2 py-1 rounded-md">
                New Unread
              </span>
            )}
          </div>
        </DialogTitle>
        <DialogContent dividers className="space-y-4">
          {selectedInquiry && (
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-xs text-gray-500 font-bold uppercase mb-1">Date Received</p>
                <p className="text-sm font-medium">{new Date(selectedInquiry.created_at).toLocaleString()}</p>
              </div>
              <div>
                <p className="text-xs text-gray-500 font-bold uppercase mb-1">Product Interest</p>
                <p className="text-sm font-medium">{selectedInquiry.product}</p>
              </div>
              <div>
                <p className="text-xs text-gray-500 font-bold uppercase mb-1">Name</p>
                <p className="text-sm font-medium">{selectedInquiry.name}</p>
              </div>
              <div>
                <p className="text-xs text-gray-500 font-bold uppercase mb-1">Company</p>
                <p className="text-sm font-medium">{selectedInquiry.company}</p>
              </div>
              <div>
                <p className="text-xs text-gray-500 font-bold uppercase mb-1">Email</p>
                <a href={`mailto:${selectedInquiry.email}`} className="text-sm font-medium text-[#0B63CE] hover:underline">
                  {selectedInquiry.email}
                </a>
              </div>
              <div>
                <p className="text-xs text-gray-500 font-bold uppercase mb-1">Phone</p>
                <a href={`tel:${selectedInquiry.phone}`} className="text-sm font-medium text-[#0B63CE] hover:underline">
                  {selectedInquiry.phone || 'N/A'}
                </a>
              </div>
              <div>
                <p className="text-xs text-gray-500 font-bold uppercase mb-1">Country</p>
                <p className="text-sm font-medium">{selectedInquiry.country}</p>
              </div>

              {selectedInquiry.quantity && (
                <div>
                  <p className="text-xs text-gray-500 font-bold uppercase mb-1">Quantity</p>
                  <p className="text-sm font-medium">{selectedInquiry.quantity} {selectedInquiry.quantity_unit || ''}</p>
                </div>
              )}

              {selectedInquiry.incoterm && (
                <div>
                  <p className="text-xs text-gray-500 font-bold uppercase mb-1">Incoterm</p>
                  <p className="text-sm font-medium">{selectedInquiry.incoterm}</p>
                </div>
              )}

              {selectedInquiry.destination_port && (
                <div>
                  <p className="text-xs text-gray-500 font-bold uppercase mb-1">Destination Port</p>
                  <p className="text-sm font-medium">{selectedInquiry.destination_port}</p>
                </div>
              )}

              {selectedInquiry.private_labelling && (
                <div>
                  <p className="text-xs text-gray-500 font-bold uppercase mb-1">Private Labelling</p>
                  <p className="text-sm font-medium">{selectedInquiry.private_labelling}</p>
                </div>
              )}

              <div className="col-span-2 bg-gray-50 p-4 rounded-lg border border-gray-100">
                <p className="text-xs text-gray-500 font-bold uppercase mb-2">Specifications & Message</p>
                <p className="text-sm text-gray-800 whitespace-pre-wrap">{selectedInquiry.message}</p>
              </div>
            </div>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={closeViewDialog} variant="contained" sx={{ backgroundColor: '#0B63CE', '&:hover': { backgroundColor: '#0950a7' } }}>
            Close
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}
