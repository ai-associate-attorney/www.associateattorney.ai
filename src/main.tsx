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

// Set up Content Security Policy for tracking scripts
const setupCSP = () => {
  // Create meta tag for CSP
  const metaTag = document.createElement('meta');
  metaTag.httpEquiv = 'Content-Security-Policy';
  metaTag.content = `
    default-src 'self';
    script-src 'self' 'unsafe-inline' https://www.googletagmanager.com https://static.ads-twitter.com https://ads-twitter.com https://ads-api.twitter.com https://analytics.twitter.com;
    connect-src 'self' https://www.googletagmanager.com https://static.ads-twitter.com https://ads-twitter.com https://ads-api.twitter.com https://analytics.twitter.com;
    img-src 'self' data: https://www.googletagmanager.com https://static.ads-twitter.com https://ads-twitter.com https://ads-api.twitter.com https://analytics.twitter.com;
    style-src 'self' 'unsafe-inline';
    font-src 'self';
  `;
  document.head.appendChild(metaTag);
};

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

// Function to verify tracking scripts are loaded
const verifyTrackingScripts = () => {
  // Check Google Ads
  if (window.dataLayer && typeof window.gtag === 'function') {
    console.log('Google Ads tracking is properly installed');
  } else {
    console.warn('Google Ads tracking may not be properly installed');
  }
  
  // Check Twitter Pixel
  if (typeof window.twq === 'function') {
    console.log('Twitter Pixel tracking is properly installed');
  } else {
    console.warn('Twitter Pixel tracking may not be properly installed');
  }
};

// Initialize everything when the app starts
// setupCSP();
addGoogleAds();
addTwitterPixel();

// Verify tracking scripts after a short delay to allow them to load
setTimeout(verifyTrackingScripts, 2000);

createRoot(document.getElementById("root")!).render(<App />);
