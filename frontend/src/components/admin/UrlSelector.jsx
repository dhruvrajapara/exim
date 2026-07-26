import React, { useState, useEffect } from 'react';

export default function UrlSelector({ value, onChange, placeholder = "Select a page..." }) {
  const [pages, setPages] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchPages();
  }, []);

  const fetchPages = async () => {
    try {
      const res = await fetch('/api/website/available-pages');
      if (res.ok) {
        const json = await res.json();
        setPages(json.data || []);
      }
    } catch (error) {
      console.error('Error fetching available pages:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleChange = (e) => {
    const selectedVal = e.target.value;
    if (!selectedVal) {
      onChange({ url: '', type: '', reference_id: '', label: '' });
      return;
    }
    
    // selectedVal is going to be stringified JSON so we can extract all metadata
    try {
      const parsed = JSON.parse(selectedVal);
      onChange(parsed);
    } catch (err) {
      console.error('Error parsing selection', err);
    }
  };

  if (isLoading) {
    return <div className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm bg-gray-50 text-gray-400">Loading pages...</div>;
  }

  // To properly bind the select value, we must serialize the current `value` if it has a reference_id and type
  const currentValueString = value?.reference_id && value?.type 
    ? JSON.stringify({
        url: value.url,
        type: value.type,
        reference_id: value.reference_id,
        label: value.label
      }) 
    : '';

  return (
    <select
      value={currentValueString}
      onChange={handleChange}
      className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:border-[#0B63CE] outline-none bg-white"
    >
      <option value="">{placeholder}</option>
      {pages.map((group, gIndex) => (
        <optgroup key={gIndex} label={group.group}>
          {group.items.map((item, iIndex) => {
            const itemString = JSON.stringify({
              url: item.url,
              type: item.type,
              reference_id: item.reference_id,
              label: item.label
            });
            return (
              <option key={iIndex} value={itemString}>
                {item.label}
              </option>
            );
          })}
        </optgroup>
      ))}
    </select>
  );
}
