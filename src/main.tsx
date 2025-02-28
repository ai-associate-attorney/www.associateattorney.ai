import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import './index.css'

// Initialize dataLayer
declare global {
  interface Window {
    dataLayer: any[];
    gtag: (...args: any[]) => void;
    twq: (...args: any[]) => void;
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

// Add Twitter pixel tracking
const addTwitterPixel = () => {
  // Add Twitter conversion tracking base code
  const twitterScript = document.createElement('script');
  twitterScript.innerHTML = `
    !function(e,t,n,s,u,a){e.twq||(s=e.twq=function(){s.exe?s.exe.apply(s,arguments):s.queue.push(arguments);
    },s.version='1.1',s.queue=[],u=t.createElement(n),u.async=!0,u.src='https://static.ads-twitter.com/uwt.js',
    a=t.getElementsByTagName(n)[0],a.parentNode.insertBefore(u,a))}(window,document,'script');
    twq('config','p791z');
  `;
  document.head.appendChild(twitterScript);
};

// Initialize tracking when the app starts
addGoogleAds();
addTwitterPixel();

createRoot(document.getElementById("root")!).render(<App />);
