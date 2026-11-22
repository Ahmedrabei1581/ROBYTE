import { createRoot } from 'react-dom/client';
import { registerSW } from 'virtual:pwa-register';
import App from './App.tsx';
import './index.css';

if ('serviceWorker' in navigator) {
  if (import.meta.env.PROD) {
    try {
      registerSW({
        immediate: true,
        onRegisterError() {
          // Ignore service worker registration errors inside restricted preview frames
        },
      });
    } catch {
      // Safe fallback if serviceWorker is blocked
    }
  } else {
    // In dev/preview mode: unregister any stale Service Worker and clear old caches
    navigator.serviceWorker
      .getRegistrations()
      .then((registrations) => Promise.all(registrations.map((reg) => reg.unregister())))
      .catch(() => {});
    if ('caches' in window) {
      caches
        .keys()
        .then((keys) => Promise.all(keys.map((key) => caches.delete(key))))
        .catch(() => {});
    }
  }
}

createRoot(document.getElementById('root')!).render(<App />);
