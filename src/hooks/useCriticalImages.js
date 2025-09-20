// hooks/useCriticalImages.js
import { useEffect } from 'react';
import imageCache from '../utils/ImageCache';
import projectsData from '../data/projectsData.js';

// Define critical images that should load immediately when app starts
const CRITICAL_IMAGES = [
  // About page hero images
  '/assets/Team/imagenew.jpg',
  '/assets/Team/image1.jpg',
  '/assets/Team/team3.jpg',
  
  // Project display images (first few projects)
  ...projectsData.slice(0, 4).map(project => project.displayImage),
  
  // Add any hero images, logos, or other critical assets here
];

// Hook to preload critical images
export function useCriticalImages() {
  useEffect(() => {
    // Start preloading critical images immediately
    console.log('Starting critical image preload...');
    imageCache.preloadCritical(CRITICAL_IMAGES);
  }, []);
}

// Hook for route-specific preloading
export function useRoutePreloader(routeImages = [], priority = 'normal') {
  useEffect(() => {
    if (routeImages.length === 0) return;

    const preloadRouteImages = async () => {
      try {
        console.log(`Preloading ${routeImages.length} route images with ${priority} priority`);
        await imageCache.preloadImages(routeImages);
      } catch (error) {
        console.warn('Route preloading failed:', error);
      }
    };

    if (priority === 'high') {
      // High priority - start immediately
      preloadRouteImages();
    } else {
      // Normal priority - wait a bit to not interfere with critical loading
      const timeout = setTimeout(preloadRouteImages, 1000);
      return () => clearTimeout(timeout);
    }
  }, [routeImages, priority]);
}