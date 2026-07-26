import React, { createContext, useContext, useState, useEffect } from 'react';

const SettingsContext = createContext(null);

export const useSettings = () => useContext(SettingsContext);

export const SettingsProvider = ({ children }) => {
  const [settings, setSettings] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  const fetchSettings = async () => {
    try {
      const res = await fetch('/api/website/settings', {
        headers: {
          'Cache-Control': 'no-cache',
          'Pragma': 'no-cache'
        }
      });
      if (res.ok) {
        const json = await res.json();
        const settingsData = { ...json.data };
        
        // Parse booleans
        Object.keys(settingsData).forEach(key => {
          if (settingsData[key] === 'true' || settingsData[key] === '1') settingsData[key] = true;
          else if (settingsData[key] === 'false' || settingsData[key] === '0') settingsData[key] = false;
          else if (settingsData[key] === 'null') settingsData[key] = null;
        });

        ['contact_office_addresses', 'contact_phones', 'contact_emails'].forEach(key => {
          if (settingsData[key]) {
            try {
              settingsData[key] = JSON.parse(settingsData[key]);
            } catch (e) {
              settingsData[key] = [];
            }
          } else {
            settingsData[key] = [];
          }
        });
        ['footer_quick_links', 'footer_product_links', 'contact_faqs'].forEach(key => {
          if (settingsData[key]) {
            try {
              settingsData[key] = JSON.parse(settingsData[key]);
            } catch (e) {
              settingsData[key] = [];
            }
          } else {
            settingsData[key] = [];
          }
        });
        if (settingsData['header_btn_link']) {
          try {
            settingsData['header_btn_link'] = JSON.parse(settingsData['header_btn_link']);
          } catch (e) {
            settingsData['header_btn_link'] = { label: '', url: '' };
          }
        }
        setSettings(settingsData);
        applyThemeColors(settingsData);
        applyFavicon(settingsData);
      }
    } catch (error) {
      console.error('Failed to fetch global settings:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const applyThemeColors = (data) => {
    const root = document.documentElement;
    if (data.theme_primary_color) {
      root.style.setProperty('--color-primary', data.theme_primary_color);
    }
    if (data.theme_secondary_color) {
      root.style.setProperty('--color-secondary', data.theme_secondary_color);
    }
    if (data.theme_accent_color) {
      root.style.setProperty('--color-accent', data.theme_accent_color); // Custom
    }
    if (data.theme_bg_color) {
      root.style.setProperty('--color-bg-custom', data.theme_bg_color); // Custom
    }
    if (data.theme_text_color) {
      root.style.setProperty('--color-text-custom', data.theme_text_color); // Custom
    }
    
    // Inject Gradient Color Combining Primary and Secondary
    if (data.theme_primary_color && data.theme_secondary_color) {
      root.style.setProperty('--color-gradient', `linear-gradient(to right, ${data.theme_primary_color}, ${data.theme_secondary_color})`);
    }
  };

  const applyFavicon = (data) => {
    if (data.favicon_url) {
      let link = document.querySelector("link[rel~='icon']");
      if (!link) {
        link = document.createElement('link');
        link.rel = 'icon';
        document.head.appendChild(link);
      }
      link.href = data.favicon_url;
      
      let shortcut = document.querySelector("link[rel='shortcut icon']");
      if (shortcut) {
        shortcut.href = data.favicon_url;
      }
    }
  };

  useEffect(() => {
    fetchSettings();
    
    // Listen for custom event from admin panel to re-fetch dynamically
    const handleUpdate = () => fetchSettings();
    window.addEventListener('website-settings-updated', handleUpdate);
    
    return () => window.removeEventListener('website-settings-updated', handleUpdate);
  }, []);

  return (
    <SettingsContext.Provider value={{ settings, isLoading, fetchSettings }}>
      {children}
    </SettingsContext.Provider>
  );
};
