import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import './index.css'

// Initialize dataLayer
declare global {
  interface Window {
    dataLayer: any[];
    gtag: (...args: any[]) => void;
  }
}

// Add Google Ads tracking
const addGoogleAds = () => {
  // Add the main gtag.js script
  const mainScript = document.createElement('script');
  mainScript.async = true;
  mainScript.src = 'https://www.googletagmanager.com/gtag/js?id=AW-11545956114';
  document.head.appendChild(mainScript);

  // Add the configuration script
  const configScript = document.createElement('script');
  configScript.innerHTML = `
    window.dataLayer = window.dataLayer || [];
    function gtag(){dataLayer.push(arguments);}
    gtag('js', new Date());
    gtag('config', 'AW-11545956114');
  `;
  document.head.appendChild(configScript);
};

// Initialize tracking when the app starts
addGoogleAds();

createRoot(document.getElementById("root")!).render(<App />);
