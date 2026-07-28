import { useEffect } from 'react';
import { useSettings } from '../contexts/SettingsContext';

export default function ClarityTracker() {
  const { settings } = useSettings();

  useEffect(() => {
    const isEnabled = settings?.microsoft_clarity_enabled;
    const projectId = settings?.microsoft_clarity_project_id;
    const scriptId = 'microsoft-clarity-script';

    // 1. If disabled or no project ID, ensure script is removed
    if (!isEnabled || !projectId) {
      const existingScript = document.getElementById(scriptId);
      if (existingScript) {
        existingScript.remove();
      }
      return;
    }

    // 2. If already exists, do nothing (prevent duplicate injection)
    if (document.getElementById(scriptId)) {
      return;
    }

    // 3. Inject Microsoft Clarity script
    const script = document.createElement('script');
    script.id = scriptId;
    script.type = 'text/javascript';
    script.async = true;
    script.innerHTML = `
      (function(c,l,a,r,i,t,y){
        c[a]=c[a]||function(){(c[a].q=c[a].q||[]).push(arguments)};
        t=l.createElement(r);t.async=1;t.src="https://www.clarity.ms/tag/"+i;
        y=l.getElementsByTagName(r)[0];y.parentNode.insertBefore(t,y);
      })(window, document, "clarity", "script", "${projectId}");
    `;
    
    document.head.appendChild(script);

    // Optional cleanup on unmount, although typically tracking scripts stay alive 
    // across SPA navigations. We only clean it up if explicitly disabled (handled above).
    return () => {
      // Intentionally empty to keep script alive during typical React router navigation.
    };
  }, [settings?.microsoft_clarity_enabled, settings?.microsoft_clarity_project_id]);

  return null;
}
