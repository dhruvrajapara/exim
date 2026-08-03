import { useEffect, useState } from 'react';
import { useSettings } from '../contexts/SettingsContext';

export default function useWebsiteProtection() {
  const { settings } = useSettings();
  const [devToolsOpen, setDevToolsOpen] = useState(false);

  useEffect(() => {
    // Only enable if the setting is true/1
    if (!settings || (settings.disable_copy_protection !== true && settings.disable_copy_protection !== '1')) {
      return;
    }

    // --- 1. Prevent default events ---
    const preventDefault = (e) => {
      e.preventDefault();
      return false;
    };

    // Events to block
    const blockEvents = [
      'contextmenu',
      'copy',
      'cut',
      'paste',
      'dragstart',
      'selectstart'
    ];

    blockEvents.forEach((event) => {
      document.addEventListener(event, preventDefault, { capture: true });
    });

    // Disable image dragging specifically by CSS if needed, though dragstart prevents most of it
    document.body.style.userSelect = 'none';
    document.body.style.webkitUserSelect = 'none';

    // --- 2. Block Keyboard Shortcuts ---
    const handleKeyDown = (e) => {
      // F12
      if (e.keyCode === 123) {
        e.preventDefault();
        return false;
      }

      // Ctrl or Cmd key pressed
      if (e.ctrlKey || e.metaKey) {
        const key = e.key ? e.key.toLowerCase() : String.fromCharCode(e.keyCode).toLowerCase();

        // Ctrl+Shift+I, J, C
        if (e.shiftKey && (key === 'i' || key === 'j' || key === 'c')) {
          e.preventDefault();
          return false;
        }

        // Ctrl+U (View Source), S (Save), P (Print), C (Copy), X (Cut), V (Paste), A (Select All)
        if (['u', 's', 'p', 'c', 'x', 'v', 'a'].includes(key)) {
          e.preventDefault();
          return false;
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown, { capture: true });

    // --- 3. DevTools Detection ---
    let devToolsInterval;
    const threshold = 160;

    const checkDevTools = () => {
      const widthDiff = window.outerWidth - window.innerWidth > threshold;
      const heightDiff = window.outerHeight - window.innerHeight > threshold;
      
      if (widthDiff || heightDiff) {
        setDevToolsOpen(true);
      } else {
        setDevToolsOpen(false);
      }
    };

    // Check periodically
    devToolsInterval = setInterval(checkDevTools, 500);

    // Initial check
    checkDevTools();

    // --- Cleanup ---
    return () => {
      blockEvents.forEach((event) => {
        document.removeEventListener(event, preventDefault, { capture: true });
      });
      window.removeEventListener('keydown', handleKeyDown, { capture: true });
      clearInterval(devToolsInterval);
      
      document.body.style.userSelect = '';
      document.body.style.webkitUserSelect = '';
    };
  }, [settings?.disable_copy_protection]);

  // Inject overlay into the DOM if devtools are open
  useEffect(() => {
    if (devToolsOpen) {
      const overlay = document.createElement('div');
      overlay.id = 'security-devtools-overlay';
      overlay.style.position = 'fixed';
      overlay.style.top = '0';
      overlay.style.left = '0';
      overlay.style.width = '100vw';
      overlay.style.height = '100vh';
      overlay.style.backgroundColor = '#111827'; // Tailwind gray-900
      overlay.style.color = '#fff';
      overlay.style.display = 'flex';
      overlay.style.flexDirection = 'column';
      overlay.style.justifyContent = 'center';
      overlay.style.alignItems = 'center';
      overlay.style.zIndex = '9999999';
      overlay.style.fontFamily = 'system-ui, -apple-system, sans-serif';
      
      overlay.innerHTML = `
        <div style="text-align: center; max-width: 600px; padding: 20px;">
          <h1 style="font-size: 2rem; margin-bottom: 1rem; color: #ef4444;">Security Protection Enabled</h1>
          <p style="font-size: 1.1rem; color: #9ca3af; margin-bottom: 0.5rem;">Developer tools are disabled on this website.</p>
          <p style="font-size: 1.1rem; color: #9ca3af;">Please close Developer Tools to continue browsing.</p>
        </div>
      `;
      
      document.body.appendChild(overlay);

      return () => {
        const existing = document.getElementById('security-devtools-overlay');
        if (existing) {
          existing.remove();
        }
      };
    }
  }, [devToolsOpen]);

  return null;
}
