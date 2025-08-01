// MINIMAL OFFLINE MANAGER - ONLY ACTIVATES WHEN USER OPTS IN
export class OfflineManager {
  private swRegistration: ServiceWorkerRegistration | null = null;
  private enabled: boolean = false;
  
  constructor() {
    // Check if user previously enabled offline mode
    this.enabled = localStorage.getItem('offline-mode-enabled') === 'true';
    
    if (this.enabled) {
      this.enable();
    }
  }
  
  async enable() {
    if (!('serviceWorker' in navigator)) {
      console.warn('[OFFLINE] Service workers not supported');
      return;
    }
    
    try {
      this.swRegistration = await navigator.serviceWorker.register('/sw.js', {
        scope: '/'
      });
      
      localStorage.setItem('offline-mode-enabled', 'true');
      this.enabled = true;
      
      console.warn('[OFFLINE] Service worker registered for minimal offline support');
    } catch (error) {
      console.error('[OFFLINE] Service worker registration failed:', error);
    }
  }
  
  async disable() {
    if (this.swRegistration) {
      await this.swRegistration.unregister();
      this.swRegistration = null;
    }
    
    // Clear all caches
    if ('caches' in window) {
      const cacheNames = await caches.keys();
      for (const cacheName of cacheNames) {
        await caches.delete(cacheName);
      }
    }
    
    localStorage.removeItem('offline-mode-enabled');
    this.enabled = false;
    
    console.warn('[OFFLINE] Offline mode disabled and caches cleared');
  }
  
  isEnabled() {
    return this.enabled;
  }
}

export const offlineManager = new OfflineManager();