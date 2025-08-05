// Single Page Application Navigation System
// Optimized for performance with no URL changes and minimal console logging

(function() {
    'use strict';

    // Configuration
    const SPA_CONFIG = {
        enableConsoleLogging: false, // Set to false for production
        enableURLChanges: false,     // Set to false for true SPA behavior
        transitionDuration: 300,
        enableAnalytics: true,
        enableLoadingOverlay: true
    };

    // Current state
    let currentSection = 'home';
    let isTransitioning = false;

    // Utility functions
    const utils = {
        log: function(message, data = null) {
            if (SPA_CONFIG.enableConsoleLogging) {
                console.log('[SPA]', message, data);
            }
        },

        debounce: function(func, wait) {
            let timeout;
            return function executedFunction(...args) {
                const later = () => {
                    clearTimeout(timeout);
                    func(...args);
                };
                clearTimeout(timeout);
                timeout = setTimeout(later, wait);
            };
        }
    };

    // Navigation system
    const Navigation = {
        init: function() {
            this.bindEvents();
            this.setInitialSection();
            utils.log('Navigation system initialized');
        },

        bindEvents: function() {
            // Navigation links
            const navLinks = document.querySelectorAll('.nav a');
            navLinks.forEach(link => {
                link.addEventListener('click', (e) => {
                    e.preventDefault();
                    const targetSection = link.getAttribute('href').replace('#', '');
                    this.navigateToSection(targetSection);
                });
            });

            // Mobile navigation
            this.initMobileNavigation();

            // Keyboard navigation
            document.addEventListener('keydown', (e) => {
                if (e.key === 'Escape') {
                    this.closeMobileNavigation();
                }
            });
        },

        initMobileNavigation: function() {
            const navToggler = document.querySelector('.nav-toggler');
            const aside = document.querySelector('.aside');

            if (navToggler && aside) {
                navToggler.addEventListener('click', (e) => {
                    e.stopPropagation();
                    this.toggleMobileNavigation();
                });

                // Close on outside click
                document.addEventListener('click', (e) => {
                    if (aside.classList.contains('open') && 
                        !aside.contains(e.target) && 
                        !navToggler.contains(e.target)) {
                        this.closeMobileNavigation();
                    }
                });

                // Prevent closing when clicking inside navigation
                aside.addEventListener('click', (e) => {
                    e.stopPropagation();
                });
            }
        },

        toggleMobileNavigation: function() {
            const aside = document.querySelector('.aside');
            const navToggler = document.querySelector('.nav-toggler');
            const sections = document.querySelectorAll('.section');

            if (aside && navToggler) {
                aside.classList.toggle('open');
                navToggler.classList.toggle('open');
                sections.forEach(section => {
                    section.classList.toggle('open');
                });
            }
        },

        closeMobileNavigation: function() {
            const aside = document.querySelector('.aside');
            const navToggler = document.querySelector('.nav-toggler');
            const sections = document.querySelectorAll('.section');

            if (aside && navToggler) {
                aside.classList.remove('open');
                navToggler.classList.remove('open');
                sections.forEach(section => {
                    section.classList.remove('open');
                });
            }
        },

        setInitialSection: function() {
            // Don't use URL hash, always start with home
            currentSection = 'home';
            this.showSection('home', false);
            this.updateNavigation('home');
        },

        navigateToSection: function(sectionId) {
            if (sectionId === currentSection || isTransitioning) {
                return;
            }

            isTransitioning = true;
            utils.log('Navigating to section:', sectionId);

            // Show loading overlay if enabled
            if (SPA_CONFIG.enableLoadingOverlay) {
                this.showLoadingOverlay();
            }

            // Update navigation immediately for visual feedback
            this.updateNavigation(sectionId);

            // Perform section transition
            setTimeout(() => {
                this.showSection(sectionId);
                currentSection = sectionId;

                // Track analytics if enabled
                if (SPA_CONFIG.enableAnalytics && window.AnalyticsTracker) {
                    window.AnalyticsTracker.ga4.trackSectionView(sectionId);
                }

                // Hide loading overlay
                if (SPA_CONFIG.enableLoadingOverlay) {
                    setTimeout(() => {
                        this.hideLoadingOverlay();
                        isTransitioning = false;
                    }, SPA_CONFIG.transitionDuration);
                } else {
                    isTransitioning = false;
                }
            }, 50);

            // Close mobile navigation if open
            if (window.innerWidth < 1200) {
                this.closeMobileNavigation();
            }
        },

        showSection: function(sectionId, animate = true) {
            const targetSection = document.querySelector(`#${sectionId}`);
            if (!targetSection) {
                utils.log('Section not found:', sectionId);
                return;
            }

            const allSections = document.querySelectorAll('.section');
            const currentActiveSection = document.querySelector('.section.active');

            // Remove active and back-section classes from all sections
            allSections.forEach(section => {
                section.classList.remove('active', 'back-section');
            });

            // Add back-section to previous active section for smooth transition
            if (currentActiveSection && animate) {
                currentActiveSection.classList.add('back-section');
            }

            // Activate target section
            if (animate) {
                requestAnimationFrame(() => {
                    targetSection.classList.add('active');
                });
            } else {
                targetSection.classList.add('active');
            }

            utils.log('Section shown:', sectionId);
        },

        updateNavigation: function(sectionId) {
            const navLinks = document.querySelectorAll('.nav a');
            
            navLinks.forEach(link => {
                link.classList.remove('active');
                const linkSection = link.getAttribute('href').replace('#', '');
                if (linkSection === sectionId) {
                    link.classList.add('active');
                }
            });
        },

        showLoadingOverlay: function() {
            const overlay = document.getElementById('loadingOverlay');
            if (overlay) {
                overlay.classList.add('active');
            }
        },

        hideLoadingOverlay: function() {
            const overlay = document.getElementById('loadingOverlay');
            if (overlay) {
                overlay.classList.remove('active');
            }
        },

        getCurrentSection: function() {
            return currentSection;
        }
    };

    // Performance optimized analytics integration
    const AnalyticsIntegration = {
        init: function() {
            if (!SPA_CONFIG.enableAnalytics) return;

            this.setupSectionTracking();
            this.setupInteractionTracking();
            utils.log('Analytics integration initialized');
        },

        setupSectionTracking: function() {
            // Use debounced intersection observer for better performance
            const debouncedTracker = utils.debounce((sectionName) => {
                if (window.AnalyticsTracker) {
                    window.AnalyticsTracker.ga4.trackSectionView(sectionName);
                }
            }, 1000);

            const observer = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting && entry.intersectionRatio > 0.5) {
                        debouncedTracker(entry.target.id);
                    }
                });
            }, {
                threshold: 0.5,
                rootMargin: '0px 0px -10% 0px'
            });

            document.querySelectorAll('section[id]').forEach(section => {
                observer.observe(section);
            });
        },

        setupInteractionTracking: function() {
            // Debounced click tracking to avoid excessive events
            const debouncedClickTracker = utils.debounce((eventData) => {
                if (window.AnalyticsTracker) {
                    window.AnalyticsTracker.ga4.trackCustomEvent('interaction', eventData);
                }
            }, 500);

            document.addEventListener('click', (e) => {
                const target = e.target.closest('[data-track]');
                if (target) {
                    const trackingData = {
                        element: target.tagName.toLowerCase(),
                        action: target.dataset.track,
                        section: currentSection
                    };
                    debouncedClickTracker(trackingData);
                }
            });
        }
    };

    // Optimized lazy loading integration
    const LazyLoadingIntegration = {
        init: function() {
            this.setupImageOptimization();
            utils.log('Lazy loading integration initialized');
        },

        setupImageOptimization: function() {
            // Convert images to lazy loading format without excessive logging
            const images = document.querySelectorAll('img:not([data-src]):not(.no-lazy)');
            
            images.forEach(img => {
                if (img.dataset.processed || img.dataset.critical === 'true') {
                    return;
                }

                if (img.src && !img.src.startsWith('data:')) {
                    img.dataset.src = img.src;
                    img.dataset.processed = 'true';
                    
                    // Simple placeholder without canvas for better performance
                    img.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMzAwIiBoZWlnaHQ9IjIwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjZjBmMGYwIi8+PHRleHQgeD0iNTAlIiB5PSI1MCUiIGZvbnQtZmFtaWx5PSJBcmlhbCIgZm9udC1zaXplPSIxNCIgZmlsbD0iIzk5OSIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZHk9Ii4zZW0iPkxvYWRpbmcuLi48L3RleHQ+PC9zdmc+';
                    img.classList.add('lazy-placeholder');
                }
            });

            // Listen for lazy loading events (without excessive logging)
            document.addEventListener('lazyloaded', (event) => {
                if (SPA_CONFIG.enableAnalytics && window.AnalyticsTracker) {
                    window.AnalyticsTracker.ga4.trackCustomEvent('image_loaded', {
                        format: event.detail.format
                    });
                }
            });
        }
    };

    // Initialize SPA system
    const initSPA = () => {
        utils.log('Initializing SPA system');
        
        Navigation.init();
        AnalyticsIntegration.init();
        LazyLoadingIntegration.init();
        
        utils.log('SPA system initialized successfully');
    };

    // Export for global access
    window.SPANavigation = {
        navigateToSection: Navigation.navigateToSection.bind(Navigation),
        getCurrentSection: Navigation.getCurrentSection.bind(Navigation),
        config: SPA_CONFIG,
        utils: utils
    };

    // Auto-initialize when DOM is ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initSPA);
    } else {
        initSPA();
    }

})();