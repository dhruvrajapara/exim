import React, { useState } from 'react';
import { AVAILABLE_ICONS, getIconComponent } from '../../../components/IconResolver';
import SearchIcon from '@mui/icons-material/Search';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';

const IconsLibrary = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [copiedIcon, setCopiedIcon] = useState(null);

  const filteredIcons = AVAILABLE_ICONS.filter(name => 
    name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleCopy = (iconName) => {
    navigator.clipboard.writeText(iconName);
    setCopiedIcon(iconName);
    setTimeout(() => {
      setCopiedIcon(null);
    }, 2000);
  };

  return (
    <div className="p-4 md:p-6 min-h-full bg-gray-50/50">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Icon Library</h1>
        <p className="text-sm text-gray-500 mt-1">
          Browse available icons. Click on any icon to copy its name, then paste it into the "Icon" field when adding or editing features.
        </p>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden flex flex-col h-[calc(100vh-200px)]">
        {/* Search Header */}
        <div className="p-4 border-b border-gray-100 bg-gray-50/50">
          <div className="relative max-w-md">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <SearchIcon className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="text"
              className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:ring-[#0B63CE] focus:border-[#0B63CE] sm:text-sm"
              placeholder="Search icons..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        {/* Icon Grid */}
        <div className="flex-1 overflow-y-auto p-4 md:p-6">
          <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-8 gap-4">
            {filteredIcons.map(iconName => (
              <button
                key={iconName}
                onClick={() => handleCopy(iconName)}
                className={`relative group flex flex-col items-center justify-center p-4 rounded-xl border-2 transition-all duration-200 ${
                  copiedIcon === iconName 
                    ? 'border-green-500 bg-green-50 text-green-700' 
                    : 'border-transparent bg-gray-50 text-gray-600 hover:bg-blue-50 hover:text-[#0B63CE] hover:border-blue-200 hover:shadow-sm'
                }`}
                title={`Click to copy: ${iconName}`}
              >
                <div className="mb-2 text-[32px] flex items-center justify-center">
                  {copiedIcon === iconName ? (
                    <CheckCircleIcon fontSize="inherit" />
                  ) : (
                    getIconComponent(iconName, { fontSize: 'inherit' })
                  )}
                </div>
                <span className="text-[11px] font-medium text-center break-words w-full opacity-80">
                  {iconName}
                </span>

                {/* Hover overlay hint */}
                <div className="absolute inset-0 bg-white/80 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center pointer-events-none backdrop-blur-[1px]">
                  <div className="flex flex-col items-center text-[#0B63CE]">
                    <ContentCopyIcon fontSize="small" className="mb-1" />
                    <span className="text-xs font-bold">Copy</span>
                  </div>
                </div>
                
                {/* Copied state overlay */}
                {copiedIcon === iconName && (
                  <div className="absolute inset-0 bg-green-50 rounded-xl flex items-center justify-center pointer-events-none">
                    <div className="flex flex-col items-center text-green-600">
                      <CheckCircleIcon fontSize="small" className="mb-1" />
                      <span className="text-xs font-bold">Copied!</span>
                    </div>
                  </div>
                )}
              </button>
            ))}
          </div>

          {filteredIcons.length === 0 && (
            <div className="flex flex-col items-center justify-center h-40 text-gray-500">
              <SearchIcon className="w-12 h-12 mb-3 opacity-20" />
              <p>No icons found matching "{searchTerm}"</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default IconsLibrary;
