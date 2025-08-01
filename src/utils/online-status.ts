export class OnlineStatusManager {
  private isOnline: boolean = navigator.onLine;
  private isUsingOfflineCache: boolean = false;
  private statusElement: HTMLDivElement | null = null;
  private listeners: Set<(online: boolean) => void> = new Set();
  
  constructor() {
    this.init();
  }
  
  private init() {
    // Monitor online/offline status
    window.addEventListener('online', () => this.updateStatus(true));
    window.addEventListener('offline', () => this.updateStatus(false));
    
    // Create status indicator UI
    this.createStatusIndicator();
    
    // Check if we're using cached version
    this.checkCacheStatus();
    
    // Force online check every 5 seconds
    setInterval(() => this.checkOnlineStatus(), 5000);
  }
  
  private async checkOnlineStatus() {
    try {
      // Try to fetch a small resource to verify we're truly online
      await fetch('/api/health', { 
        method: 'HEAD',
        cache: 'no-cache',
        mode: 'no-cors'
      });
      this.updateStatus(true);
    } catch {
      this.updateStatus(false);
    }
  }
  
  private async checkCacheStatus() {
    // Check if page was loaded from cache
    if ('performance' in window && 'getEntriesByType' in window.performance) {
      const navigationEntry = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming;
      if (navigationEntry && navigationEntry.transferSize === 0) {
        this.isUsingOfflineCache = true;
        this.updateUI();
      }
    }
    
    // Also check service worker status
    if ('serviceWorker' in navigator && navigator.serviceWorker.controller) {
      this.isUsingOfflineCache = true;
      this.updateUI();
    }
  }
  
  private updateStatus(online: boolean) {
    this.isOnline = online;
    this.updateUI();
    
    // Notify listeners
    this.listeners.forEach(listener => listener(online));
    
    // If we're back online, force reload to get latest version
    if (online && this.isUsingOfflineCache) {
      this.showUpdateNotification();
    }
  }
  
  private createStatusIndicator() {
    this.statusElement = document.createElement('div');
    this.statusElement.id = 'online-status';
    this.statusElement.style.cssText = `
      position: fixed;
      bottom: 20px;
      left: 20px;
      z-index: 10000;
      font-family: 'Orbitron', monospace;
      font-size: 12px;
      display: flex;
      flex-direction: column;
      gap: 8px;
    `;
    document.body.appendChild(this.statusElement);
    this.updateUI();
  }
  
  private updateUI() {
    if (!this.statusElement) return;
    
    this.statusElement.innerHTML = '';
    
    // Online/Offline indicator
    const statusBadge = document.createElement('div');
    statusBadge.style.cssText = `
      padding: 8px 16px;
      border-radius: 20px;
      display: flex;
      align-items: center;
      gap: 8px;
      backdrop-filter: blur(10px);
      transition: all 0.3s ease;
    `;
    
    if (this.isOnline) {
      statusBadge.style.background = 'rgba(0, 255, 0, 0.2)';
      statusBadge.style.border = '1px solid rgba(0, 255, 0, 0.5)';
      statusBadge.innerHTML = `
        <div style="width: 8px; height: 8px; background: #00ff00; border-radius: 50%; animation: pulse 2s infinite;"></div>
        <span style="color: #00ff00;">ONLINE</span>
      `;
    } else {
      statusBadge.style.background = 'rgba(255, 0, 0, 0.2)';
      statusBadge.style.border = '1px solid rgba(255, 0, 0, 0.5)';
      statusBadge.innerHTML = `
        <div style="width: 8px; height: 8px; background: #ff0000; border-radius: 50%;"></div>
        <span style="color: #ff0000;">OFFLINE</span>
      `;
    }
    
    this.statusElement.appendChild(statusBadge);
    
    // Offline cache indicator
    if (this.isUsingOfflineCache) {
      const cacheWarning = document.createElement('div');
      cacheWarning.style.cssText = `
        padding: 8px 16px;
        background: rgba(255, 165, 0, 0.2);
        border: 1px solid rgba(255, 165, 0, 0.5);
        border-radius: 8px;
        color: #ffa500;
        display: flex;
        flex-direction: column;
        gap: 8px;
      `;
      cacheWarning.innerHTML = `
        <div style="font-weight: bold;">⚠️ USING OFFLINE VERSION</div>
        <button id="delete-offline" style="
          background: rgba(255, 0, 0, 0.3);
          border: 1px solid rgba(255, 0, 0, 0.5);
          color: #ff6666;
          padding: 4px 12px;
          border-radius: 4px;
          cursor: pointer;
          font-family: inherit;
          font-size: 11px;
          transition: all 0.2s;
        ">DELETE OFFLINE VERSION</button>
      `;
      this.statusElement.appendChild(cacheWarning);
      
      // Add click handler for delete button
      const deleteButton = document.getElementById('delete-offline');
      if (deleteButton) {
        deleteButton.addEventListener('click', () => this.deleteOfflineVersion());
        deleteButton.addEventListener('mouseenter', () => {
          deleteButton.style.background = 'rgba(255, 0, 0, 0.5)';
        });
        deleteButton.addEventListener('mouseleave', () => {
          deleteButton.style.background = 'rgba(255, 0, 0, 0.3)';
        });
      }
    }
    
    // Add pulse animation
    const style = document.createElement('style');
    style.textContent = `
      @keyframes pulse {
        0% { opacity: 1; }
        50% { opacity: 0.5; }
        100% { opacity: 1; }
      }
    `;
    document.head.appendChild(style);
  }
  
  private showUpdateNotification() {
    const notification = document.createElement('div');
    notification.style.cssText = `
      position: fixed;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      background: rgba(0, 0, 0, 0.9);
      border: 2px solid #00ff00;
      padding: 32px;
      border-radius: 16px;
      z-index: 10001;
      text-align: center;
      font-family: 'Orbitron', monospace;
    `;
    notification.innerHTML = `
      <h2 style="color: #00ff00; margin: 0 0 16px 0;">🔄 NEW VERSION AVAILABLE</h2>
      <p style="color: #ffffff; margin: 0 0 24px 0;">Click below to load the latest online version</p>
      <button id="reload-online" style="
        background: rgba(0, 255, 0, 0.2);
        border: 2px solid #00ff00;
        color: #00ff00;
        padding: 12px 24px;
        border-radius: 8px;
        cursor: pointer;
        font-family: inherit;
        font-size: 16px;
        font-weight: bold;
      ">LOAD ONLINE VERSION</button>
    `;
    document.body.appendChild(notification);
    
    const reloadButton = document.getElementById('reload-online');
    if (reloadButton) {
      reloadButton.addEventListener('click', () => {
        window.location.reload();
      });
    }
  }
  
  private async deleteOfflineVersion() {
    try {
      // Unregister all service workers
      if ('serviceWorker' in navigator) {
        const registrations = await navigator.serviceWorker.getRegistrations();
        for (const registration of registrations) {
          await registration.unregister();
          console.warn('[OFFLINE DELETE] Unregistered service worker:', registration.scope);
        }
      }
      
      // Delete all caches
      if ('caches' in window) {
        const cacheNames = await caches.keys();
        for (const cacheName of cacheNames) {
          await caches.delete(cacheName);
          console.warn('[OFFLINE DELETE] Deleted cache:', cacheName);
        }
      }
      
      // Clear all storage
      localStorage.clear();
      sessionStorage.clear();
      
      // Clear IndexedDB
      if ('indexedDB' in window) {
        const databases = await indexedDB.databases();
        for (const db of databases) {
          if (db.name) {
            indexedDB.deleteDatabase(db.name);
            console.warn('[OFFLINE DELETE] Deleted IndexedDB:', db.name);
          }
        }
      }
      
      // Show success message
      alert('✅ Offline version deleted! Reloading...');
      
      // Force reload
      window.location.reload();
    } catch (error) {
      console.error('[OFFLINE DELETE] Error:', error);
      alert('❌ Failed to delete offline version. Please try again.');
    }
  }
  
  public onStatusChange(callback: (online: boolean) => void) {
    this.listeners.add(callback);
  }
  
  public getStatus() {
    return {
      online: this.isOnline,
      usingCache: this.isUsingOfflineCache
    };
  }
}

// Create singleton instance
export const onlineStatus = new OnlineStatusManager();