import React from 'react';
import { Helmet } from 'react-helmet-async';
import { Link } from 'react-router-dom';
import InfoIcon from '@mui/icons-material/Info';

export default function WebsiteSetting() {
  return (
    <>
      <Helmet>
        <title>Website Settings | Admin</title>
      </Helmet>
      <div className="max-w-6xl mx-auto p-6 animate-fade-in">
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-gray-900">Website Settings</h1>
          <p className="text-gray-500 text-sm mt-1">Manage settings for specific pages.</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          
          <Link to="/admin/website/about/layout" className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 hover:shadow-md hover:border-[#0B63CE]/30 transition-all flex items-center gap-4 group">
            <div className="w-12 h-12 bg-blue-50 text-[#0B63CE] rounded-lg flex items-center justify-center group-hover:bg-[#0B63CE] group-hover:text-white transition-colors">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" /></svg>
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900 group-hover:text-[#0B63CE] transition-colors">About Page Layout</h3>
              <p className="text-sm text-gray-500 mt-1">Drag and drop to reorder the sections shown on the about page.</p>
            </div>
          </Link>
          
          <Link to="/admin/website/home/layout" className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 hover:shadow-md hover:border-[#0B63CE]/30 transition-all flex items-center gap-4 group">
            <div className="w-12 h-12 bg-blue-50 text-[#0B63CE] rounded-lg flex items-center justify-center group-hover:bg-[#0B63CE] group-hover:text-white transition-colors">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" /></svg>
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900 group-hover:text-[#0B63CE] transition-colors">Homepage Layout</h3>
              <p className="text-sm text-gray-500 mt-1">Drag and drop to reorder the sections shown on the homepage.</p>
            </div>
          </Link>
        </div>
      </div>
    </>
  );
}
