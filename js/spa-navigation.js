// Single Page Application Navigation System
// Optimized for performance with no URL changes and minimal console logging

(function() {
    'use strict';

    // Configuration
    const SPA_CONFIG = {
        enableConsoleLogging: false, // Production - logging disabled
        enableURLChanges: false,     // Set to false for true SPA behavior
        transitionDuration: 300,
        enableAnalytics: false,
        enableLoadingOverlay: true,
        enableStatePersistence: true, // Remember last visited section
        stateStorageKey: 'spaCurrentSection'
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
        },

        // State persistence utilities
        saveState: function(section) {
            if (SPA_CONFIG.enableStatePersistence) {
                try {
                    localStorage.setItem(SPA_CONFIG.stateStorageKey, section);
                    utils.log('State saved:', section);
                } catch (error) {
                    utils.log('Error saving state:', error);
                }
            }
        },

        loadState: function() {
            if (SPA_CONFIG.enableStatePersistence) {
                try {
                    const savedSection = localStorage.getItem(SPA_CONFIG.stateStorageKey);
                    utils.log('State loaded:', savedSection);
                    return savedSection || 'home';
                } catch (error) {
                    utils.log('Error loading state:', error);
                    return 'home';
                }
            }
            return 'home';
        },

        clearState: function() {
            if (SPA_CONFIG.enableStatePersistence) {
                try {
                    localStorage.removeItem(SPA_CONFIG.stateStorageKey);
                    utils.log('State cleared');
                } catch (error) {
                    utils.log('Error clearing state:', error);
                }
            }
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

            // Handle page visibility change (when user returns to tab)
            document.addEventListener('visibilitychange', () => {
                if (!document.hidden) {
                    // Restore the current section state when user returns
                    const currentSection = this.getCurrentSection();
                    this.updateNavigation(currentSection);
                }
            });

            // Handle browser refresh or navigation
            window.addEventListener('beforeunload', () => {
                // State is already saved in navigateToSection, but ensure it's saved on page unload
                utils.saveState(currentSection);
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
            // Check for restore parameter from offline/404 pages
            const urlParams = new URLSearchParams(window.location.search);
            const restoreSection = urlParams.get('restore');

            let initialSection = 'home';

            if (restoreSection) {
                // Prioritize restore parameter
                const targetSection = document.querySelector(`#${restoreSection}`);
                if (targetSection) {
                    initialSection = restoreSection;
                    // Save this as the current state
                    utils.saveState(restoreSection);
                    utils.log('Restoring section from URL parameter:', restoreSection);
                }
            } else {
                // Load last visited section or default to home
                const savedSection = utils.loadState();
                const targetSection = document.querySelector(`#${savedSection}`);
                initialSection = targetSection ? savedSection : 'home';
            }

            currentSection = initialSection;

            // Ensure all sections are hidden first
            const allSections = document.querySelectorAll('.section');
            allSections.forEach(section => {
                section.classList.remove('active', 'back-section');
            });

            // Show the correct initial section
            this.showSection(initialSection, false);
            this.updateNavigation(initialSection);

            // Clean up URL - remove restore parameter and hash
            const cleanUrl = window.location.pathname;
            if (window.location.search || window.location.hash) {
                history.replaceState(null, null, cleanUrl);
            }

            // Mark that SPA navigation has initialized
            document.body.setAttribute('data-spa-initialized', 'true');

            utils.log('Initial section set to:', initialSection);
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

                // Save current state
                utils.saveState(sectionId);

                // Analytics tracking disabled for individual portfolio

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
            if (currentActiveSection && animate && currentActiveSection !== targetSection) {
                currentActiveSection.classList.add('back-section');
            }

            // Activate target section with higher priority
            const activateSection = () => {
                targetSection.classList.add('active');
                // Ensure this section stays active by setting a data attribute
                targetSection.setAttribute('data-spa-active', 'true');

                // Remove the attribute from other sections
                allSections.forEach(section => {
                    if (section !== targetSection) {
                        section.removeAttribute('data-spa-active');
                    }
                });
            };

            if (animate) {
                requestAnimationFrame(activateSection);
            } else {
                activateSection();
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
            // Section tracking disabled for individual portfolio

            // Intersection observer tracking removed for individual portfolio
        },

        setupInteractionTracking: function() {
            // Click tracking removed for individual portfolio
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

            // Lazy loading event tracking removed for individual portfolio
        }
    };

    // State protection system
    const StateProtection = {
        init: function() {
            // Check every 100ms for the first 5 seconds to ensure state is maintained
            let checkCount = 0;
            const maxChecks = 50; // 5 seconds

            const protectionInterval = setInterval(() => {
                this.enforceCurrentState();
                checkCount++;

                if (checkCount >= maxChecks) {
                    clearInterval(protectionInterval);
                    // After initial protection period, check less frequently
                    setInterval(() => {
                        this.enforceCurrentState();
                    }, 1000); // Check every second
                }
            }, 100);
        },

        enforceCurrentState: function() {
            const expectedSection = currentSection;
            const expectedSectionElement = document.querySelector(`#${expectedSection}`);

            if (expectedSectionElement && !expectedSectionElement.classList.contains('active')) {
                utils.log('State protection: Restoring section', expectedSection);

                // Remove active from all sections
                document.querySelectorAll('.section').forEach(section => {
                    section.classList.remove('active', 'back-section');
                });

                // Restore the correct section
                expectedSectionElement.classList.add('active');
                expectedSectionElement.setAttribute('data-spa-active', 'true');

                // Update navigation
                Navigation.updateNavigation(expectedSection);
            }
        }
    };

    // Initialize SPA system
    const initSPA = () => {
        utils.log('Initializing SPA system');

        Navigation.init();
        AnalyticsIntegration.init();
        LazyLoadingIntegration.init();

        // Add protection against other scripts overriding our state
        StateProtection.init();

        utils.log('SPA system initialized successfully');
    };

    // Export for global access
    window.SPANavigation = {
        navigateToSection: Navigation.navigateToSection.bind(Navigation),
        getCurrentSection: Navigation.getCurrentSection.bind(Navigation),
        saveState: utils.saveState.bind(utils),
        loadState: utils.loadState.bind(utils),
        clearState: utils.clearState.bind(utils),
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
