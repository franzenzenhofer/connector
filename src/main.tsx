import React from 'react';
import ReactDOM from 'react-dom/client';
import { App } from '@ui/App';
import { errorReporter } from './utils/error-reporter';
import { onlineStatus } from './utils/online-status';

// Initialize online status monitoring
onlineStatus.onStatusChange((online) => {
  console.warn(`[ONLINE STATUS] ${online ? 'ONLINE' : 'OFFLINE'}`);
});

// Initialize error reporting

// Remove loading indicator
const loadingElement = document.querySelector('.loading');
if (loadingElement) {
  loadingElement.remove();
}

// Create React root and render app
try {
  const rootElement = document.getElementById('root');
  if (!rootElement) {
    throw new Error('Root element not found');
  }
  
  const root = ReactDOM.createRoot(rootElement);
  root.render(
    <React.StrictMode>
      <App />
    </React.StrictMode>
  );
  
  // App initialized successfully
} catch (error) {
  errorReporter.reportError(error as Error, 'App Initialization');
}