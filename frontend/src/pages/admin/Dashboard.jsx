import { Helmet } from 'react-helmet-async';
import { useState, useEffect } from 'react';
import { fetchDashboardStats } from '../../services/api';
import { useAuth } from '../../contexts/AuthContext';
import InventoryIcon from '@mui/icons-material/Inventory';
import ChatBubbleIcon from '@mui/icons-material/ChatBubble';
import ArticleIcon from '@mui/icons-material/Article';
import GroupIcon from '@mui/icons-material/Group';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import TrendingDownIcon from '@mui/icons-material/TrendingDown';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import PersonIcon from '@mui/icons-material/Person';

export default function Dashboard() {
  const { user } = useAuth();
  const [dashboardData, setDashboardData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      const data = await fetchDashboardStats();
      if (data) {
        setDashboardData(data);
      }
      setLoading(false);
    };
    loadData();
  }, []);

  const stats = [
    { 
      label: 'Total Products', 
      value: dashboardData?.stats?.total_products || '0', 
      trend: '+12%', 
      isPositive: true, 
      icon: <InventoryIcon className="text-[#0B63CE]" />, 
      bg: 'bg-blue-50' 
    },
    { 
      label: 'Active Enquiries', 
      value: dashboardData?.stats?.active_enquiries || '0', 
      trend: '+4%', 
      isPositive: true, 
      icon: <ChatBubbleIcon className="text-emerald-600" />, 
      bg: 'bg-emerald-50' 
    },
    { 
      label: 'Published Blogs', 
      value: dashboardData?.stats?.published_blogs || '0', 
      trend: '-2%', 
      isPositive: false, 
      icon: <ArticleIcon className="text-purple-600" />, 
      bg: 'bg-purple-50' 
    },
    { 
      label: 'Total Users', 
      value: dashboardData?.stats?.total_users || '0', 
      trend: '+1%', 
      isPositive: true, 
      icon: <GroupIcon className="text-amber-600" />, 
      bg: 'bg-amber-50' 
    },
  ];

  const recentEnquiries = dashboardData?.recent_enquiries || [];

  const getStatusBadge = (status) => {
    switch (status?.toLowerCase()) {
      case 'new': return 'bg-blue-100 text-blue-700';
      case 'pending': return 'bg-amber-100 text-amber-700';
      case 'completed': return 'bg-emerald-100 text-emerald-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return '';
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short', day: 'numeric', year: 'numeric'
    });
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen w-full">
        <div className="w-8 h-8 border-4 border-[#0B63CE] border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="animate-fade-in w-full max-w-[1400px] mx-auto font-sans">
      <Helmet>
        <title>Dashboard | Admin Portal</title>
      </Helmet>

      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
        <div>
          <h1 className="text-[28px] font-bold text-gray-900 tracking-tight mb-1">
            Dashboard
          </h1>
          <p className="text-[15px] text-gray-500">
            Welcome back, <span className="font-medium text-gray-700">{user?.name}</span>. Here's your business overview.
          </p>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {stats.map((stat, i) => (
          <div key={i} className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 flex flex-col hover:shadow-md transition-shadow duration-300">
            <div className="flex items-start justify-between mb-4">
              <div className={`w-12 h-12 rounded-lg ${stat.bg} flex items-center justify-center`}>
                {stat.icon}
              </div>
              <div className={`flex items-center gap-1 text-[13px] font-semibold px-2 py-1 rounded-full ${stat.isPositive ? 'text-emerald-700 bg-emerald-50' : 'text-red-700 bg-red-50'}`}>
                {stat.isPositive ? <TrendingUpIcon fontSize="inherit" /> : <TrendingDownIcon fontSize="inherit" />}
                {stat.trend}
              </div>
            </div>
            <div>
              <h3 className="text-[28px] font-bold text-gray-900 leading-tight mb-1">{stat.value}</h3>
              <p className="text-sm font-medium text-gray-500">{stat.label}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 pb-10">
        
        {/* Chart Section */}
        <div className="lg:col-span-2 bg-white rounded-xl shadow-sm border border-gray-100 flex flex-col">
          <div className="p-6 border-b border-gray-50 flex items-center justify-between">
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-lg font-bold text-gray-900">Search Performance</h3>
                {dashboardData?.gsc?.connected ? (
                  <span className="bg-green-100 text-green-700 text-xs font-semibold px-2.5 py-0.5 rounded-full">
                    Google Search Console Live
                  </span>
                ) : (
                  <span className="bg-amber-100 text-amber-700 text-xs font-semibold px-2.5 py-0.5 rounded-full">
                    Demo Mode
                  </span>
                )}
              </div>
              <p className="text-[13px] text-gray-500 mt-1">
                {dashboardData?.gsc?.connected
                  ? 'Organic search clicks & impressions from Google Search Console'
                  : 'Connect Google Search Console API in Settings to view live organic analytics'}
              </p>
            </div>
            {!dashboardData?.gsc?.connected && (
              <a
                href="/admin/settings/integrations"
                className="text-xs font-semibold bg-[#0B63CE] text-white px-3 py-1.5 rounded-lg hover:bg-blue-700 transition-colors"
              >
                Connect GSC
              </a>
            )}
          </div>

          <div className="p-6 flex-1 flex flex-col min-h-[350px]">
            {dashboardData?.gsc?.connected && dashboardData?.gsc?.data?.chart?.length > 0 ? (
              <div className="flex flex-col h-full">
                {/* Summary Metrics */}
                <div className="grid grid-cols-3 gap-4 mb-6 p-4 bg-gray-50 rounded-lg">
                  <div>
                    <p className="text-xs text-gray-500 font-medium">Total Clicks (30 Days)</p>
                    <p className="text-xl font-bold text-gray-900">{dashboardData.gsc.data.total_clicks}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 font-medium">Total Impressions</p>
                    <p className="text-xl font-bold text-gray-900">{dashboardData.gsc.data.total_impressions}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 font-medium">Average CTR</p>
                    <p className="text-xl font-bold text-[#0B63CE]">{dashboardData.gsc.data.ctr}%</p>
                  </div>
                </div>

                {/* Dynamic Bar Chart */}
                <div className="w-full flex-1 flex items-end gap-1.5 sm:gap-2 relative pt-6 min-h-[200px]">
                  <div className="absolute inset-0 flex flex-col justify-between pb-6 pointer-events-none">
                    {[1, 2, 3, 4].map((line) => (
                      <div key={line} className="w-full border-b border-dashed border-gray-200"></div>
                    ))}
                  </div>
                  {dashboardData.gsc.data.chart.slice(-15).map((item, i) => {
                    const maxClicks = Math.max(...dashboardData.gsc.data.chart.map((c) => c.clicks), 1);
                    const heightPercent = Math.max((item.clicks / maxClicks) * 100, 8);
                    return (
                      <div key={i} className="flex-1 flex flex-col justify-end items-center z-10 group relative h-full">
                        <div
                          className="w-full bg-blue-500/80 group-hover:bg-[#0B63CE] rounded-t-sm transition-all relative"
                          style={{ height: `${heightPercent}%` }}
                        >
                          <div className="opacity-0 group-hover:opacity-100 absolute -top-8 left-1/2 -translate-x-1/2 bg-gray-900 text-white text-[10px] px-2 py-1 rounded shadow pointer-events-none whitespace-nowrap z-20">
                            {item.clicks} clicks ({item.impressions} imp)
                          </div>
                        </div>
                        <span className="text-[10px] text-gray-400 mt-2 truncate w-full text-center">
                          {item.date}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>
            ) : (
              /* Fallback / Mockup view with setup hint */
              <div className="w-full h-full flex-1 flex flex-col justify-between relative">
                <div className="w-full flex-1 flex items-end gap-2 sm:gap-4 relative pt-10">
                  <div className="absolute inset-0 flex flex-col justify-between pb-6 pointer-events-none">
                    {[1, 2, 3, 4, 5].map((line) => (
                      <div key={line} className="w-full border-b border-dashed border-gray-200"></div>
                    ))}
                  </div>
                  {[40, 70, 45, 90, 65, 80, 55, 100, 75, 85, 60, 95].map((height, i) => (
                    <div key={i} className="flex-1 flex flex-col justify-end items-center z-10 group relative h-full">
                      <div
                        className="w-full bg-blue-100 group-hover:bg-blue-200 rounded-t-sm transition-colors relative"
                        style={{ height: `${height}%` }}
                      >
                        <div className="absolute top-0 left-0 right-0 h-1 bg-[#0B63CE] rounded-t-sm group-hover:h-2 transition-all"></div>
                      </div>
                      <span className="text-[10px] sm:text-xs text-gray-400 mt-3 absolute -bottom-6">
                        {['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'][i]}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
        
        {/* Recent Enquiries Section */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 flex flex-col">
          <div className="p-6 border-b border-gray-50 flex items-center justify-between">
            <div>
              <h3 className="text-lg font-bold text-gray-900">Latest Enquiries</h3>
              <p className="text-[13px] text-gray-500 mt-1">Recent buyer requests</p>
            </div>
            <button className="text-[13px] font-medium text-[#0B63CE] hover:text-[#0a55b3]">
              View All
            </button>
          </div>
          <div className="p-0 flex-1">
            {recentEnquiries.length > 0 ? (
              <ul className="divide-y divide-gray-50">
                {recentEnquiries.map(enquiry => (
                  <li key={enquiry.id} className="p-5 sm:p-6 hover:bg-gray-50/80 transition-colors group">
                    <div className="flex items-start gap-4">
                      <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center text-gray-500 flex-shrink-0 group-hover:bg-white group-hover:shadow-sm transition-all border border-transparent group-hover:border-gray-200">
                        <PersonIcon fontSize="small" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex flex-wrap items-center justify-between gap-1 mb-1">
                          <p className="text-sm font-bold text-gray-900 truncate">{enquiry.name}</p>
                          <span className={`text-[11px] font-bold px-2 py-0.5 rounded-md ${getStatusBadge(enquiry.status)}`}>
                            {enquiry.status}
                          </span>
                        </div>
                        <p className="text-[13px] text-gray-600 truncate mb-1">{enquiry.product}</p>
                        <div className="flex flex-wrap items-center justify-between gap-2 mt-2">
                           <p className="text-[12px] text-gray-400 truncate">{enquiry.email}</p>
                           <p className="text-[11px] font-medium text-gray-400">{formatDate(enquiry.created_at)}</p>
                        </div>
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
            ) : (
              <div className="p-10 flex flex-col items-center justify-center text-center h-full">
                <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mb-4">
                  <ChatBubbleIcon className="text-gray-400" />
                </div>
                <p className="text-sm font-medium text-gray-900">No recent enquiries</p>
                <p className="text-xs text-gray-500 mt-1">New requests will appear here.</p>
              </div>
            )}
          </div>
        </div>
        
      </div>
    </div>
  );
}
