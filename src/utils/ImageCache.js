// utils/ImageCache.js
class ImageCache {
  constructor() {
    this.cache = new Map();
    this.loadingPromises = new Map();
    this.observers = new Set();
  }

  // Preload a single image
  async preloadImage(url) {
    // If already cached, return immediately
    if (this.cache.has(url)) {
      return this.cache.get(url);
    }

    // If currently loading, return the existing promise
    if (this.loadingPromises.has(url)) {
      return this.loadingPromises.get(url);
    }

    // Start loading the image
    const loadPromise = new Promise((resolve, reject) => {
      const img = new Image();
      
      img.onload = () => {
        this.cache.set(url, img);
        this.loadingPromises.delete(url);
        this.notifyObservers(url, 'loaded', img);
        resolve(img);
      };
      
      img.onerror = (error) => {
        this.loadingPromises.delete(url);
        this.notifyObservers(url, 'error', error);
        reject(error);
      };
      
      img.src = url;
    });

    this.loadingPromises.set(url, loadPromise);
    return loadPromise;
  }

  // Preload multiple images with progress tracking
  async preloadImages(urls, onProgress) {
    if (urls.length === 0) return { loaded: 0, failed: 0, total: 0 };

    let loadedCount = 0;
    let failedCount = 0;

    const results = await Promise.allSettled(
      urls.map(async (url) => {
        try {
          const result = await this.preloadImage(url);
          loadedCount++;
          if (onProgress) onProgress(loadedCount, failedCount, urls.length);
          return result;
        } catch (error) {
          failedCount++;
          if (onProgress) onProgress(loadedCount, failedCount, urls.length);
          throw error;
        }
      })
    );
    
    return {
      loaded: loadedCount,
      failed: failedCount,
      total: urls.length
    };
  }

  // Check if image is cached
  isImageCached(url) {
    return this.cache.has(url);
  }

  // Get cached image
  getCachedImage(url) {
    return this.cache.get(url);
  }

  // Add observer for cache events
  addObserver(callback) {
    this.observers.add(callback);
    return () => this.observers.delete(callback);
  }

  // Notify observers of cache events
  notifyObservers(url, event, data) {
    this.observers.forEach(callback => {
      try {
        callback({ url, event, data });
      } catch (error) {
        console.error('Observer error:', error);
      }
    });
  }

  // Get cache stats
  getStats() {
    return {
      cached: this.cache.size,
      loading: this.loadingPromises.size
    };
  }

  // Clear cache (useful for memory management)
  clearCache() {
    this.cache.clear();
    this.loadingPromises.clear();
  }

  // Preload critical images immediately when app starts
  preloadCritical(urls) {
    urls.forEach(url => {
      this.preloadImage(url).catch(error => {
        console.warn(`Failed to preload critical image: ${url}`, error);
      });
    });
  }
}

// Create singleton instance
const imageCache = new ImageCache();

export default imageCache;