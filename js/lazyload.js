/**
 * Lazy Loading implementation for images on Mesón Santa Rosa website
 * This script improves page load performance by loading images only when they're about to enter the viewport
 */

document.addEventListener("DOMContentLoaded", function() {
  // Check if the browser supports native lazy loading
  const nativeLazySupported = 'loading' in HTMLImageElement.prototype;
  
  // Get all images that should be lazy-loaded
  const lazyImages = document.querySelectorAll('img[loading="lazy"]');
  
  if (nativeLazySupported) {
    // Browser supports native lazy loading, no need for additional code
    console.log('Using native lazy loading');
  } else {
    // Fallback for browsers that don't support native lazy loading
    console.log('Using IntersectionObserver for lazy loading');
    
    // Use Intersection Observer to implement lazy loading
    if ('IntersectionObserver' in window) {
      const imageObserver = new IntersectionObserver(function(entries, observer) {
        entries.forEach(function(entry) {
          // If the image is in the viewport
          if (entry.isIntersecting) {
            const img = entry.target;
            
            // Replace the data-src attribute with src
            if (img.dataset.src) {
              img.src = img.dataset.src;
              img.removeAttribute('data-src');
            }
            
            // Replace the data-srcset attribute with srcset
            if (img.dataset.srcset) {
              img.srcset = img.dataset.srcset;
              img.removeAttribute('data-srcset');
            }
            
            // Stop watching this image
            imageObserver.unobserve(img);
          }
        });
      });
      
      // Apply the observer to each image
      lazyImages.forEach(function(img) {
        // Store original source in data-src attribute if not already set
        if (!img.dataset.src && img.src) {
          img.dataset.src = img.src;
          // Use a transparent placeholder
          img.src = "data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7";
        }
        
        imageObserver.observe(img);
      });
    } else {
      // Fallback for browsers without IntersectionObserver support
      // Simple implementation that loads all images after a delay
      setTimeout(function() {
        lazyImages.forEach(function(img) {
          if (img.dataset.src) {
            img.src = img.dataset.src;
          }
          if (img.dataset.srcset) {
            img.srcset = img.dataset.srcset;
          }
        });
      }, 1000);
    }
  }
});