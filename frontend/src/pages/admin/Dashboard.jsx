import { Helmet } from 'react-helmet-async';
import { useAuth } from '../../contexts/AuthContext';
import InventoryIcon from '@mui/icons-material/Inventory';
import ChatBubbleIcon from '@mui/icons-material/ChatBubble';
import ArticleIcon from '@mui/icons-material/Article';
import GroupIcon from '@mui/icons-material/Group';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import TrendingDownIcon from '@mui/icons-material/TrendingDown';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import DownloadIcon from '@mui/icons-material/Download';
import PersonIcon from '@mui/icons-material/Person';

export default function Dashboard() {
  const { user } = useAuth();

  const stats = [
    { 
      label: 'Total Products', 
      value: '124', 
      trend: '+12%', 
      isPositive: true, 
      icon: <InventoryIcon className="text-[#0B63CE]" />, 
      bg: 'bg-blue-50' 
    },
    { 
      label: 'Active Enquiries', 
      value: '12', 
      trend: '+4%', 
      isPositive: true, 
      icon: <ChatBubbleIcon className="text-emerald-600" />, 
      bg: 'bg-emerald-50' 
    },
    { 
      label: 'Published Blogs', 
      value: '45', 
      trend: '-2%', 
      isPositive: false, 
      icon: <ArticleIcon className="text-purple-600" />, 
      bg: 'bg-purple-50' 
    },
    { 
      label: 'Total Users', 
      value: '8', 
      trend: '+1%', 
      isPositive: true, 
      icon: <GroupIcon className="text-amber-600" />, 
      bg: 'bg-amber-50' 
    },
  ];

  const recentEnquiries = [
    { id: 1, name: 'John Doe', email: 'john@example.com', product: 'Dehydrated Onion Flakes', status: 'New', time: '2 hours ago' },
    { id: 2, name: 'Maria Garcia', email: 'maria@market.es', product: 'Garlic Powder', status: 'Pending', time: '5 hours ago' },
    { id: 3, name: 'Liam Chen', email: 'liam@traders.sg', product: 'Turmeric Powder', status: 'Completed', time: '1 day ago' },
    { id: 4, name: 'Sarah Smith', email: 'sarah@organics.uk', product: 'Tomato Powder', status: 'Pending', time: '2 days ago' },
  ];

  const getStatusBadge = (status) => {
    switch (status) {
      case 'New': return 'bg-blue-100 text-blue-700';
      case 'Pending': return 'bg-amber-100 text-amber-700';
      case 'Completed': return 'bg-emerald-100 text-emerald-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

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
        <div className="flex items-center gap-3">
          <button className="px-4 py-2.5 bg-white border border-gray-200 text-gray-700 rounded-lg text-sm font-medium hover:bg-gray-50 hover:text-gray-900 transition-colors shadow-sm flex items-center gap-2">
            <DownloadIcon fontSize="small" />
            Export Data
          </button>
          <button className="px-4 py-2.5 bg-[#0B63CE] text-white rounded-lg text-sm font-medium hover:bg-[#0a55b3] transition-colors shadow-sm shadow-[#0B63CE]/20">
            Generate Report
          </button>
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
              <h3 className="text-lg font-bold text-gray-900">Traffic & Engagement</h3>
              <p className="text-[13px] text-gray-500 mt-1">Overview of your website performance</p>
            </div>
            <button className="p-1.5 text-gray-400 hover:text-gray-600 hover:bg-gray-50 rounded-md transition-colors">
              <MoreVertIcon />
            </button>
          </div>
          <div className="p-6 flex-1 flex flex-col min-h-[350px]">
            {/* Minimalist Chart Mockup */}
            <div className="w-full h-full flex-1 flex items-end gap-2 sm:gap-4 relative pt-10">
              {/* Grid Lines */}
              <div className="absolute inset-0 flex flex-col justify-between pb-6 pointer-events-none">
                {[1, 2, 3, 4, 5].map(line => (
                  <div key={line} className="w-full border-b border-dashed border-gray-200"></div>
                ))}
              </div>
              {/* Bars */}
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
                           <p className="text-[11px] font-medium text-gray-400">{enquiry.time}</p>
                        </div>
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
            ) : (
              <div className="p-10 flex flex-col items-center justify-center text-center h-full">
                <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mb-4">
                  <ChatBubbleOutlineIcon className="text-gray-400" />
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
