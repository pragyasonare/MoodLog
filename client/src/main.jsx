import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'


// Service Worker Registration (for push notifications)
if ("serviceWorker" in navigator) {
  window.addEventListener('load', () => {
   // navigator.serviceWorker.register('/sw.js')
   navigator.serviceWorker.register('/firebase-messaging-sw.js')

      .then(reg => console.log('SW registered:', reg))
      .catch(err => console.warn('SW registration failed:', err));
  }) ;
}

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
)


