import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

// Custom error logging plugin
const errorLoggerPlugin = () => {
  return {
    name: 'error-logger',
    configureServer(server) {
      // Log all server errors
      server.ws.on('error', (error) => {
        console.error('[WebSocket Error]:', error);
      });
      
      // Intercept and log client errors
      server.middlewares.use((req, res, next) => {
        if (req.url === '/__vite_error') {
          let body = '';
          req.on('data', chunk => body += chunk);
          req.on('end', () => {
            try {
              const error = JSON.parse(body);
              console.error('[Client Error]:', error);
            } catch (e) {
              console.error('[Client Error Parse Failed]:', body);
            }
          });
        }
        next();
      });
    },
    transform(code, id) {
      // Inject error handler for runtime errors
      if (id.endsWith('main.tsx')) {
        return `
          // Global error handler
          window.addEventListener('error', (event) => {
            console.error('[Runtime Error]:', event.error);
            fetch('/__vite_error', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                message: event.error.message,
                stack: event.error.stack,
                filename: event.filename,
                lineno: event.lineno,
                colno: event.colno
              })
            });
          });
          
          window.addEventListener('unhandledrejection', (event) => {
            console.error('[Unhandled Promise Rejection]:', event.reason);
            fetch('/__vite_error', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                message: 'Unhandled Promise Rejection',
                reason: event.reason
              })
            });
          });
          
          ${code}
        `;
      }
      return code;
    }
  };
};

export default defineConfig({
  plugins: [
    react(),
    errorLoggerPlugin()
  ],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
      '@math': path.resolve(__dirname, './src/math'),
      '@game': path.resolve(__dirname, './src/game'),
      '@renderer': path.resolve(__dirname, './src/renderer'),
      '@physics': path.resolve(__dirname, './src/physics'),
      '@audio': path.resolve(__dirname, './src/audio'),
      '@state': path.resolve(__dirname, './src/state'),
      '@procedural': path.resolve(__dirname, './src/procedural'),
      '@ui': path.resolve(__dirname, './src/ui'),
      '@shaders': path.resolve(__dirname, './src/shaders')
    }
  },
  server: {
    port: 3000,
    open: true,
    hmr: {
      overlay: true,
      // Log HMR errors to console
      clientPort: 3000
    },
    // Ensure all errors are logged
    strictPort: true,
    host: 'localhost',
    // NO CACHE! Prevent offline play and service workers
    headers: {
      'Cache-Control': 'no-store, no-cache, must-revalidate, proxy-revalidate',
      'Pragma': 'no-cache',
      'Expires': '0',
      'Surrogate-Control': 'no-store',
      'Clear-Site-Data': '"cache", "storage"'
    }
  },
  // Enable source maps for better error tracking
  build: {
    sourcemap: true,
    target: 'es2022',
    minify: 'terser',
    terserOptions: {
      compress: {
        drop_console: false, // Keep console logs in dev
        drop_debugger: true
      }
    },
    rollupOptions: {
      output: {
        manualChunks: {
          'vendor-react': ['react', 'react-dom'],
          'vendor-pixi': ['pixi.js'],
          'vendor-physics': ['matter-js'],
          'vendor-animation': ['gsap'],
          'vendor-audio': ['tone'],
          'vendor-state': ['zustand', 'immer']
        }
      }
    },
    chunkSizeWarningLimit: 1000
  },
  optimizeDeps: {
    include: ['react', 'react-dom', 'pixi.js', 'matter-js', 'gsap', 'tone', 'zustand']
  },
  // Log config for better debugging
  logLevel: 'info',
  clearScreen: false
});