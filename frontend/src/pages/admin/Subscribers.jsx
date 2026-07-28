import { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { getAdminSubscribers, deleteSubscriber } from '../../services/api';
import MarkEmailReadIcon from '@mui/icons-material/MarkEmailRead';
import DeleteIcon from '@mui/icons-material/Delete';

export default function Subscribers() {
  const [subscribers, setSubscribers] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchSubscribers();
  }, []);

  const fetchSubscribers = async () => {
    try {
      const data = await getAdminSubscribers();
      setSubscribers(data);
    } catch (error) {
      console.error('Failed to load subscribers');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this subscriber?')) {
      try {
        await deleteSubscriber(id);
        fetchSubscribers();
      } catch (error) {
        alert('Failed to delete subscriber');
      }
    }
  };

  if (isLoading) {
    return <div className="p-8 text-center text-gray-500">Loading subscribers...</div>;
  }

  return (
    <>
      <Helmet>
        <title>Newsletter Subscribers | Admin</title>
      </Helmet>

      <div className="max-w-7xl mx-auto p-6 animate-fade-in">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Newsletter Subscribers</h1>
            <p className="text-gray-500 text-sm mt-1">Manage users who have subscribed to your newsletter.</p>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-gray-50 text-gray-600 text-sm border-b border-gray-100">
                  <th className="py-4 px-6 font-semibold w-16">#</th>
                  <th className="py-4 px-6 font-semibold">Email Address</th>
                  <th className="py-4 px-6 font-semibold w-40">Status</th>
                  <th className="py-4 px-6 font-semibold w-48">Subscribed On</th>
                  <th className="py-4 px-6 font-semibold w-24 text-center">Actions</th>
                </tr>
              </thead>
              <tbody>
                {subscribers.length === 0 ? (
                  <tr>
                    <td colSpan="5" className="py-12 text-center text-gray-500">
                      <div className="flex flex-col items-center">
                        <MarkEmailReadIcon className="text-gray-300 mb-3" sx={{ fontSize: 48 }} />
                        <p className="text-lg font-medium text-gray-900">No subscribers yet</p>
                        <p className="text-sm">When users subscribe, they will appear here.</p>
                      </div>
                    </td>
                  </tr>
                ) : (
                  subscribers.map((sub, index) => (
                    <tr key={sub.id} className="border-b border-gray-50 hover:bg-gray-50 transition-colors">
                      <td className="py-4 px-6 text-sm text-gray-500">{index + 1}</td>
                      <td className="py-4 px-6">
                        <span className="font-medium text-gray-900">{sub.email}</span>
                      </td>
                      <td className="py-4 px-6">
                        <span className={`px-3 py-1 rounded-full text-xs font-medium ${sub.status === 'active' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-700'}`}>
                          {sub.status || 'active'}
                        </span>
                      </td>
                      <td className="py-4 px-6 text-sm text-gray-500">
                        {new Date(sub.created_at).toLocaleDateString()}
                      </td>
                      <td className="py-4 px-6 text-center">
                        <button 
                          onClick={() => handleDelete(sub.id)}
                          className="text-red-400 hover:text-red-600 p-2 rounded-lg hover:bg-red-50 transition-colors"
                          title="Delete Subscriber"
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
      </div>
    </>
  );
}
