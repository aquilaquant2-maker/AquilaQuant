import {StrictMode} from 'react';
import {createRoot} from 'react-dom/client';
import App from './App.tsx';
import './index.css';
import { AuthProvider } from './hooks/useAuth.tsx';

// Fix for ResizeObserver loop completed with undelivered notifications error
if (typeof window !== 'undefined') {
  // Clear legacy auth tokens to ensure the new "Manual Only" policy takes effect
  const authKeys = ['aquila-quant-session-v12', 'aquila_session_only', 'supabase.auth.token'];
  authKeys.forEach(k => localStorage.removeItem(k));
  
  const debounce = (callback: any, delay: number) => {
    let tid: any;
    return (...args: any[]) => {
      window.clearTimeout(tid);
      tid = window.setTimeout(() => callback(...args), delay);
    };
  };

  const _OriginalResizeObserver = window.ResizeObserver;
  window.ResizeObserver = class ResizeObserver extends _OriginalResizeObserver {
    constructor(callback: any) {
      super(debounce(callback, 16));
    }
  };

  window.addEventListener('error', (e) => {
    if (e.message === 'ResizeObserver loop completed with undelivered notifications.' || 
        e.message === 'ResizeObserver loop limit exceeded' ||
        e.message === 'Script error.') {
      e.stopImmediatePropagation();
    }
  });
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <AuthProvider>
      <App />
    </AuthProvider>
  </StrictMode>,
);
