import { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { useNavigate } from 'react-router-dom';
import { getAdminSubscribers, deleteSubscriber, getCampaignLogs } from '../../services/api';
import MarkEmailReadIcon from '@mui/icons-material/MarkEmailRead';
import DeleteIcon from '@mui/icons-material/Delete';
import SendIcon from '@mui/icons-material/Send';
import HistoryIcon from '@mui/icons-material/History';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import ErrorIcon from '@mui/icons-material/Error';

export default function Subscribers() {
  const navigate = useNavigate();
  const [subscribers, setSubscribers] = useState([]);
  const [campaignLogs, setCampaignLogs] = useState([]);
  const [activeTab, setActiveTab] = useState('subscribers'); // 'subscribers' or 'logs'
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setIsLoading(true);
    try {
      const [subData, logsData] = await Promise.all([
        getAdminSubscribers(),
        getCampaignLogs()
      ]);
      setSubscribers(Array.isArray(subData) ? subData : []);
      setCampaignLogs(Array.isArray(logsData) ? logsData : []);
    } catch (error) {
      console.error('Failed to load data', error);
      setSubscribers([]);
      setCampaignLogs([]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this subscriber?')) {
      try {
        await deleteSubscriber(id);
        fetchData();
      } catch (error) {
        alert('Failed to delete subscriber');
      }
    }
  };

  if (isLoading) {
    return <div className="p-8 text-center text-gray-500">Loading Subscribers & Logs...</div>;
  }

  return (
    <>
      <Helmet>
        <title>Newsletter Subscribers & Email History | Admin</title>
      </Helmet>

      <div className="max-w-7xl mx-auto p-6 animate-fade-in space-y-6">
        {/* Top Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Newsletter Subscribers & Broadcast History</h1>
            <p className="text-gray-500 text-sm mt-1">View email subscribers and trace every broadcast email campaign status & recipient.</p>
          </div>

          <button
            onClick={() => navigate('/admin/subscribers/send-campaign')}
            className="flex items-center justify-center gap-2 px-5 py-2.5 bg-[#0B63CE] text-white rounded-lg font-medium hover:bg-blue-700 transition-colors shadow-sm cursor-pointer"
          >
            <SendIcon fontSize="small" />
            <span>Send Email Campaign</span>
          </button>
        </div>

        {/* Tab Switcher */}
        <div className="flex border-b border-gray-200 gap-6">
          <button
            onClick={() => setActiveTab('subscribers')}
            className={`pb-3 text-sm font-semibold border-b-2 transition-all flex items-center gap-2 ${
              activeTab === 'subscribers' ? 'border-[#0B63CE] text-[#0B63CE]' : 'border-transparent text-gray-500 hover:text-gray-700'
            }`}
          >
            <MarkEmailReadIcon fontSize="small" />
            <span>Subscribers ({subscribers.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('logs')}
            className={`pb-3 text-sm font-semibold border-b-2 transition-all flex items-center gap-2 ${
              activeTab === 'logs' ? 'border-[#0B63CE] text-[#0B63CE]' : 'border-transparent text-gray-500 hover:text-gray-700'
            }`}
          >
            <HistoryIcon fontSize="small" />
            <span>Sent Email Broadcast Logs ({campaignLogs.length})</span>
          </button>
        </div>

        {/* TAB 1: Subscribers List */}
        {activeTab === 'subscribers' && (
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
                          <p className="text-sm text-gray-500 mt-1">When users sign up via the website footer, they will appear here.</p>
                        </div>
                      </td>
                    </tr>
                  ) : (
                    subscribers.map((sub, index) => (
                      <tr key={sub.id || index} className="border-b border-gray-50 hover:bg-gray-50/50 transition-colors">
                        <td className="py-4 px-6 text-sm text-gray-500 font-medium">{index + 1}</td>
                        <td className="py-4 px-6 text-sm font-semibold text-gray-900">{sub.email}</td>
                        <td className="py-4 px-6 text-sm">
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                            Active
                          </span>
                        </td>
                        <td className="py-4 px-6 text-sm text-gray-500">
                          {sub.created_at ? new Date(sub.created_at).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' }) : 'N/A'}
                        </td>
                        <td className="py-4 px-6 text-sm text-center">
                          <button
                            onClick={() => handleDelete(sub.id)}
                            className="text-red-500 hover:text-red-700 p-1.5 rounded-lg hover:bg-red-50 transition-colors"
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
        )}

        {/* TAB 2: Email Broadcast Logs */}
        {activeTab === 'logs' && (
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-gray-50 text-gray-600 text-sm border-b border-gray-100">
                    <th className="py-4 px-6 font-semibold w-16">#</th>
                    <th className="py-4 px-6 font-semibold">Recipient Email & Name</th>
                    <th className="py-4 px-6 font-semibold">Email Subject</th>
                    <th className="py-4 px-6 font-semibold w-32">Status</th>
                    <th className="py-4 px-6 font-semibold w-48">Sent Date & Time</th>
                    <th className="py-4 px-6 font-semibold">Details / Error Log</th>
                  </tr>
                </thead>
                <tbody>
                  {campaignLogs.length === 0 ? (
                    <tr>
                      <td colSpan="6" className="py-12 text-center text-gray-500">
                        <div className="flex flex-col items-center">
                          <HistoryIcon className="text-gray-300 mb-3" sx={{ fontSize: 48 }} />
                          <p className="text-lg font-medium text-gray-900">No email broadcast logs yet</p>
                          <p className="text-sm text-gray-500 mt-1">When you broadcast an email campaign, detailed sent history will appear here.</p>
                        </div>
                      </td>
                    </tr>
                  ) : (
                    campaignLogs.map((log, index) => (
                      <tr key={log.id || index} className="border-b border-gray-50 hover:bg-gray-50/50 transition-colors">
                        <td className="py-4 px-6 text-sm text-gray-500 font-medium">{index + 1}</td>
                        <td className="py-4 px-6 text-sm">
                          <div className="font-semibold text-gray-900">{log.recipient_email}</div>
                          {log.recipient_name && <div className="text-xs text-gray-500">Name: {log.recipient_name}</div>}
                        </td>
                        <td className="py-4 px-6 text-sm text-gray-800 font-medium">{log.subject}</td>
                        <td className="py-4 px-6 text-sm">
                          {log.status === 'sent' ? (
                            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-green-100 text-green-800">
                              <CheckCircleIcon sx={{ fontSize: 14 }} /> Sent
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-red-100 text-red-800">
                              <ErrorIcon sx={{ fontSize: 14 }} /> Failed
                            </span>
                          )}
                        </td>
                        <td className="py-4 px-6 text-sm text-gray-500 whitespace-nowrap">
                          {log.created_at ? new Date(log.created_at).toLocaleString('en-US', { year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' }) : 'N/A'}
                        </td>
                        <td className="py-4 px-6 text-xs text-gray-500 max-w-xs truncate">
                          {log.error_message ? (
                            <span className="text-red-600 font-mono" title={log.error_message}>{log.error_message}</span>
                          ) : (
                            <span className="text-gray-400">Delivered via SMTP</span>
                          )}
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </>
  );
}
