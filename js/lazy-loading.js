// Lazy Loading Implementation with WebP Support
// Tushar Basak Portfolio - Performance Enhancement

(function() {
    'use strict';

    // Configuration
    const LAZY_CONFIG = {
        rootMargin: '50px 0px',
        threshold: 0.01,
        enableWebP: true,
        fallbackDelay: 300,
        retryAttempts: 3,
        placeholderColor: '#f0f0f0',
        fadeInDuration: 300,
        enableConsoleLogging: false // Production - logging disabled
    };

    // WebP support detection
    let webpSupported = null;

    const checkWebPSupport = () => {
        return new Promise((resolve) => {
            if (webpSupported !== null) {
                resolve(webpSupported);
                return;
            }

            const webP = new Image();
            webP.onload = webP.onerror = () => {
                webpSupported = (webP.height === 2);
                resolve(webpSupported);
            };
            webP.src = 'data:image/webp;base64,UklGRjoAAABXRUJQVlA4IC4AAACyAgCdASoCAAIALmk0mk0iIiIiIgBoSygABc6WWgAA/veff/0PP8bA//LwYAAA';
        });
    };

    // Utility functions
    const utils = {
        // Create placeholder for image
        createPlaceholder: (width, height) => {
            const canvas = document.createElement('canvas');
            const ctx = canvas.getContext('2d');
            canvas.width = width || 300;
            canvas.height = height || 200;

            // Create gradient placeholder
            const gradient = ctx.createLinearGradient(0, 0, canvas.width, canvas.height);
            gradient.addColorStop(0, '#f0f0f0');
            gradient.addColorStop(1, '#e0e0e0');

            ctx.fillStyle = gradient;
            ctx.fillRect(0, 0, canvas.width, canvas.height);

            // Add loading text
            ctx.fillStyle = '#999';
            ctx.font = '16px Arial';
            ctx.textAlign = 'center';
            ctx.fillText('Loading...', canvas.width / 2, canvas.height / 2);

            return canvas.toDataURL();
        },

        // Get WebP version of image URL
        getWebPUrl: (originalUrl) => {
            if (!LAZY_CONFIG.enableWebP || !webpSupported) {
                return originalUrl;
            }

            // Replace extension with .webp
            return originalUrl.replace(/\.(jpg|jpeg|png)$/i, '.webp');
        },

        // Get fallback URL
        getFallbackUrl: (webpUrl) => {
            return webpUrl.replace(/\.webp$/i, (match, offset, string) => {
                // Try to determine original extension
                const img = document.querySelector(`img[data-webp="${webpUrl}"]`);
                if (img && img.dataset.fallback) {
                    return img.dataset.fallback.match(/\.(jpg|jpeg|png)$/i)[0];
                }
                return '.jpg'; // Default fallback
            });
        },

        // Fade in animation
        fadeIn: (element, duration = LAZY_CONFIG.fadeInDuration) => {
            element.style.opacity = '0';
            element.style.transition = `opacity ${duration}ms ease-in-out`;

            requestAnimationFrame(() => {
                element.style.opacity = '1';
            });
        },

        // Log debug information
        log: (message, data = null) => {
            if (LAZY_CONFIG.enableConsoleLogging) {
                console.log('[LazyLoading]', message, data);
            }
        }
    };

    // Image loading with retry mechanism
    const loadImageWithRetry = (src, retries = LAZY_CONFIG.retryAttempts) => {
        return new Promise((resolve, reject) => {
            const img = new Image();

            img.onload = () => {
                utils.log('Image loaded successfully', src);
                resolve(img);
            };

            img.onerror = () => {
                if (retries > 0) {
                    utils.log(`Image load failed, retrying... (${retries} attempts left)`, src);
                    setTimeout(() => {
                        loadImageWithRetry(src, retries - 1).then(resolve).catch(reject);
                    }, 1000);
                } else {
                    utils.log('Image load failed after all retries', src);
                    reject(new Error(`Failed to load image: ${src}`));
                }
            };

            img.src = src;
        });
    };

    // Load image with WebP fallback
    const loadImageWithWebPFallback = async (element) => {
        const originalSrc = element.dataset.src;
        const webpSrc = utils.getWebPUrl(originalSrc);

        try {
            // Try WebP first if supported
            if (webpSupported && webpSrc !== originalSrc) {
                utils.log('Attempting to load WebP version', webpSrc);
                try {
                    await loadImageWithRetry(webpSrc);
                    element.src = webpSrc;
                    element.dataset.format = 'webp';
                    utils.log('WebP image loaded successfully', webpSrc);
                    return;
                } catch (webpError) {
                    utils.log('WebP failed, falling back to original', originalSrc);
                }
            }

            // Fallback to original format
            await loadImageWithRetry(originalSrc);
            element.src = originalSrc;
            element.dataset.format = 'original';
            utils.log('Original image loaded successfully', originalSrc);

        } catch (error) {
            utils.log('All image loading attempts failed', error);

            // Set error placeholder
            element.src = utils.createPlaceholder(element.width || 300, element.height || 200);
            element.alt = 'Image failed to load';
            element.classList.add('lazy-error');
        }
    };

    // Process lazy image
    const processLazyImage = async (element) => {
        if (element.classList.contains('lazy-loading') || element.classList.contains('lazy-loaded')) {
            return;
        }

        element.classList.add('lazy-loading');
        utils.log('Processing lazy image', element.dataset.src);

        try {
            await loadImageWithWebPFallback(element);

            // Apply fade-in effect
            utils.fadeIn(element);

            // Update classes
            element.classList.remove('lazy-loading');
            element.classList.add('lazy-loaded');

            // Remove data attributes to clean up
            delete element.dataset.src;

            // Trigger custom event
            element.dispatchEvent(new CustomEvent('lazyloaded', {
                detail: { element, format: element.dataset.format }
            }));

            utils.log('Lazy image loaded successfully', element.src);

        } catch (error) {
            element.classList.remove('lazy-loading');
            element.classList.add('lazy-error');
            utils.log('Lazy image loading failed', error);
        }
    };

    // Intersection Observer for lazy loading
    let lazyImageObserver;

    const createLazyImageObserver = () => {
        lazyImageObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    processLazyImage(img);
                    lazyImageObserver.unobserve(img);
                }
            });
        }, {
            rootMargin: LAZY_CONFIG.rootMargin,
            threshold: LAZY_CONFIG.threshold
        });
    };

    // Initialize lazy loading for existing images
    const initializeLazyImages = () => {
        const lazyImages = document.querySelectorAll('img[data-src]');

        if (lazyImages.length === 0) {
            utils.log('No lazy images found');
            return;
        }

        utils.log(`Found ${lazyImages.length} lazy images`);

        // Set up placeholders
        lazyImages.forEach(img => {
            if (!img.src || img.src === window.location.href) {
                img.src = utils.createPlaceholder(img.width, img.height);
                img.classList.add('lazy-placeholder');
            }
        });

        // Use Intersection Observer if available
        if ('IntersectionObserver' in window) {
            createLazyImageObserver();
            lazyImages.forEach(img => lazyImageObserver.observe(img));
        } else {
            // Fallback for older browsers
            utils.log('IntersectionObserver not supported, loading all images');
            lazyImages.forEach(processLazyImage);
        }
    };

    // Convert existing images to lazy loading
    const convertImagesToLazy = () => {
        const images = document.querySelectorAll('img:not([data-src]):not(.no-lazy)');

        images.forEach(img => {
            if (img.src && !img.src.startsWith('data:')) {
                img.dataset.src = img.src;
                img.src = utils.createPlaceholder(img.width || img.naturalWidth, img.height || img.naturalHeight);
                img.classList.add('lazy-placeholder');
            }
        });

        utils.log(`Converted ${images.length} images to lazy loading`);
    };

    // Handle dynamic content
    const observeNewImages = () => {
        if ('MutationObserver' in window) {
            const observer = new MutationObserver((mutations) => {
                mutations.forEach(mutation => {
                    mutation.addedNodes.forEach(node => {
                        if (node.nodeType === 1) { // Element node
                            // Check if the node itself is a lazy image
                            if (node.tagName === 'IMG' && node.dataset.src) {
                                if (lazyImageObserver) {
                                    lazyImageObserver.observe(node);
                                } else {
                                    processLazyImage(node);
                                }
                            }

                            // Check for lazy images within the node
                            const lazyImages = node.querySelectorAll('img[data-src]');
                            lazyImages.forEach(img => {
                                if (lazyImageObserver) {
                                    lazyImageObserver.observe(img);
                                } else {
                                    processLazyImage(img);
                                }
                            });
                        }
                    });
                });
            });

            observer.observe(document.body, {
                childList: true,
                subtree: true
            });

            utils.log('MutationObserver set up for dynamic content');
        }
    };

    // Preload critical images
    const preloadCriticalImages = () => {
        const criticalImages = document.querySelectorAll('img[data-critical="true"]');

        criticalImages.forEach(async (img) => {
            if (img.dataset.src) {
                utils.log('Preloading critical image', img.dataset.src);
                await processLazyImage(img);
            }
        });
    };

    // Initialize lazy loading system
    const initLazyLoading = async () => {
        utils.log('Initializing lazy loading system');

        // Check WebP support
        await checkWebPSupport();
        utils.log('WebP supported:', webpSupported);

        // Convert existing images to lazy loading (optional)
        // convertImagesToLazy();

        // Initialize lazy loading for images with data-src
        initializeLazyImages();

        // Preload critical images
        preloadCriticalImages();

        // Observe for new images
        observeNewImages();

        // Add CSS for lazy loading effects
        addLazyLoadingCSS();

        utils.log('Lazy loading system initialized');
    };

    // Add CSS for lazy loading effects
    const addLazyLoadingCSS = () => {
        if (document.getElementById('lazy-loading-styles')) {
            return;
        }

        const style = document.createElement('style');
        style.id = 'lazy-loading-styles';
        style.textContent = `
            .lazy-placeholder {
                background: linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%);
                background-size: 200% 100%;
                animation: lazy-loading 1.5s infinite;
            }

            .lazy-loading {
                opacity: 0.7;
                filter: blur(1px);
                transition: all 0.3s ease;
            }

            .lazy-loaded {
                opacity: 1;
                filter: none;
            }

            .lazy-error {
                opacity: 0.5;
                filter: grayscale(100%);
            }

            @keyframes lazy-loading {
                0% { background-position: 200% 0; }
                100% { background-position: -200% 0; }
            }

            /* Responsive image improvements */
            img[data-src] {
                max-width: 100%;
                height: auto;
            }
        `;

        document.head.appendChild(style);
    };

    // Public API
    window.LazyLoading = {
        init: initLazyLoading,
        processImage: processLazyImage,
        checkWebPSupport: checkWebPSupport,
        config: LAZY_CONFIG,
        utils: utils
    };

    // Auto-initialize when DOM is ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initLazyLoading);
    } else {
        initLazyLoading();
    }

})();
