import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.tsx';
import { LanguageProvider } from './context/LanguageContext';
import './index.css';

// Guard against third-party affiliate widgets (tpemd, cascoon, travelpayouts) throwing network timeouts
if (typeof window !== 'undefined') {
  const isIgnored = (val: unknown) => {
    if (!val) return false;
    const str = (typeof val === 'string' ? val : (val as any)?.message || String(val)).toLowerCase();
    return (
      str.includes('request timed out') ||
      str.includes('timed out') ||
      str.includes('timeout') ||
      str.includes('failed to fetch') ||
      str.includes('networkerror') ||
      str.includes('tpemd') ||
      str.includes('cascoon') ||
      str.includes('travelpayouts') ||
      str.includes('script error')
    );
  };

  const origConsoleError = window.console.error;
  window.console.error = (...args: any[]) => {
    if (args.some(isIgnored)) return;
    origConsoleError.apply(window.console, args);
  };

  const origConsoleWarn = window.console.warn;
  window.console.warn = (...args: any[]) => {
    if (args.some(isIgnored)) return;
    origConsoleWarn.apply(window.console, args);
  };

  const origOnError = window.onerror;
  window.onerror = (message, source, lineno, colno, error) => {
    if (isIgnored(message) || isIgnored(error) || isIgnored(source)) {
      return true; // Suppress
    }
    if (origOnError) {
      return origOnError(message, source, lineno, colno, error);
    }
    return false;
  };

  const origOnUnhandledRejection = window.onunhandledrejection;
  window.onunhandledrejection = (event: PromiseRejectionEvent) => {
    if (isIgnored(event?.reason)) {
      event.preventDefault?.();
      return true;
    }
    if (origOnUnhandledRejection) {
      return origOnUnhandledRejection.call(window, event);
    }
    return false;
  };
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <LanguageProvider>
      <App />
    </LanguageProvider>
  </StrictMode>,
);


