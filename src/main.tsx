import {StrictMode} from 'react';
import {createRoot} from 'react-dom/client';
import App from './App.tsx';
import './index.css';

// Fix for ResizeObserver loop completed with undelivered notifications error
if (typeof window !== 'undefined') {
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
        e.message === 'ResizeObserver loop limit exceeded') {
      e.stopImmediatePropagation();
    }
  });
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
