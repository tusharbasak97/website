// Critical CSS Inlining System
// Tushar Basak Portfolio - Performance Enhancement

(function() {
    'use strict';

    // Critical CSS that should be inlined for above-the-fold content
    const CRITICAL_CSS = `
        /* Critical CSS - Above the fold styles */
        :root {
            --bg-black-900: #f2f2fc;
            --bg-black-100: #fdf9ff;
            --bg-black-50: #e8dfec;
            --text-black-900: #1a1a1a;
            --text-black-700: #333333;
            --skin-color: #ec1839;
            --skin-color-rgb: 236, 24, 57;
        }

        /* Dark mode variables */
        body.dark {
            --bg-black-900: #151515;
            --bg-black-100: #222222;
            --bg-black-50: #393939;
            --text-black-900: #ffffff;
            --text-black-700: #e9e9e9;
        }

        @media (prefers-color-scheme: dark) {
            body:not(.theme-override) {
                --bg-black-900: #151515;
                --bg-black-100: #222222;
                --bg-black-50: #393939;
                --text-black-900: #ffffff;
                --text-black-700: #e9e9e9;
            }
        }

        /* Base styles */
        * {
            margin: 0;
            padding: 0;
            outline: none;
            text-decoration: none;
            box-sizing: border-box;
        }

        body {
            line-height: 1.5;
            font-size: 16px;
            font-family: "Poppins", sans-serif;
            background-color: var(--bg-black-900);
            color: var(--text-black-900);
            transition: all 0.3s ease;
        }

        /* Loading overlay - critical for initial render */
        .loading-overlay {
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: linear-gradient(135deg, var(--bg-black-900), var(--bg-black-100));
            display: flex;
            flex-direction: column;
            justify-content: center;
            align-items: center;
            z-index: 10000;
            transition: opacity 0.5s ease, visibility 0.5s ease;
        }

        .loading-overlay.hidden {
            opacity: 0;
            visibility: hidden;
        }

        .loading-spinner {
            width: 50px;
            height: 50px;
            border: 3px solid var(--bg-black-50);
            border-top: 3px solid var(--skin-color);
            border-radius: 50%;
            animation: spin 1s linear infinite;
            margin-bottom: 20px;
        }

        .loading-text {
            color: var(--text-black-700);
            font-size: 18px;
            font-weight: 500;
        }

        @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
        }

        /* Main container - critical layout */
        .main-container {
            background-color: var(--bg-black-900);
            min-height: 100vh;
            transition: all 0.3s ease;
        }

        /* Aside navigation - critical for layout */
        .aside {
            width: 270px;
            background: var(--bg-black-100);
            position: fixed;
            left: 0;
            top: 0;
            padding: 30px;
            height: 100%;
            border-right: 1px solid var(--bg-black-50);
            display: flex;
            justify-content: space-between;
            flex-direction: column;
            z-index: 10;
            transition: all 0.3s ease;
        }

        /* Logo - critical for branding */
        .aside .logo {
            position: absolute;
            top: 50px;
            font-size: 30px;
            text-transform: capitalize;
        }

        .aside .logo a {
            color: var(--text-black-900);
            font-weight: 700;
            padding: 15px 20px;
            font-size: 30px;
            letter-spacing: 5px;
            position: relative;
            text-decoration: none;
        }

        /* Main content area - critical layout */
        .main-content {
            padding-left: 270px;
            transition: all 0.3s ease;
        }

        .section {
            background: var(--bg-black-900);
            min-height: 100vh;
            display: block;
            padding: 0 30px;
            opacity: 1;
            position: fixed;
            left: 270px;
            top: 0;
            right: 0;
            bottom: 0;
            z-index: 0;
            overflow-y: auto;
            overflow-x: hidden;
            transition: all 0.3s ease;
        }

        .section.active {
            z-index: 2;
            opacity: 1;
            animation: slideInRight 0.5s ease;
        }

        /* Home section - critical above-the-fold */
        .home {
            color: var(--text-black-900);
            min-height: 100vh;
            display: flex;
            align-items: center;
        }

        .home .home-info {
            flex: 0 0 60%;
            max-width: 60%;
        }

        .home .home-img {
            flex: 0 0 40%;
            max-width: 40%;
            text-align: center;
            position: relative;
        }

        .home .home-img::after {
            content: '';
            position: absolute;
            height: 80px;
            width: 80px;
            border-bottom: 10px solid var(--skin-color);
            border-right: 10px solid var(--skin-color);
            right: 20px;
            bottom: -40px;
        }

        .home .home-img::before {
            content: '';
            position: absolute;
            height: 80px;
            width: 80px;
            border-top: 10px solid var(--skin-color);
            border-left: 10px solid var(--skin-color);
            left: 20px;
            top: -40px;
        }

        .home .home-img img {
            margin: auto;
            border-radius: 5px;
            height: 400px;
            max-width: 100%;
            object-fit: cover;
        }

        /* Typography - critical for readability */
        .home .home-info h3 {
            font-size: 25px;
            margin: 15px 0;
            font-weight: 700;
            color: var(--text-black-700);
        }

        .home .home-info h1 {
            font-size: 40px;
            font-weight: 700;
            margin: 0 0 5px;
            color: var(--text-black-900);
        }

        .home .home-info p {
            margin-bottom: 70px;
            font-size: 20px;
            color: var(--text-black-700);
            line-height: 1.6;
        }

        /* Responsive design - critical for mobile */
        @media (max-width: 1199px) {
            .aside {
                left: -270px;
            }
            .main-content {
                padding-left: 0;
            }
            .section {
                left: 0;
            }
        }

        @media (max-width: 991px) {
            .home .home-info,
            .home .home-img {
                flex: 0 0 100%;
                max-width: 100%;
            }
            .home .home-img {
                display: block;
                margin-bottom: 40px;
            }
        }

        @media (max-width: 767px) {
            .home .home-info h1 {
                font-size: 30px;
            }
            .home .home-info h3 {
                font-size: 20px;
            }
            .home .home-info p {
                font-size: 18px;
                margin-bottom: 50px;
            }
        }

        /* Animation for smooth entrance */
        @keyframes slideInRight {
            0% {
                transform: translateX(100px);
                opacity: 0;
            }
            100% {
                transform: translateX(0px);
                opacity: 1;
            }
        }

        /* Prevent flash of unstyled content */
        .page-loading * {
            visibility: hidden;
        }

        .page-loading .loading-overlay {
            visibility: visible;
        }
    `;

    // Utility functions
    const utils = {
        // Inject critical CSS into head
        injectCriticalCSS: () => {
            const style = document.createElement('style');
            style.id = 'critical-css';
            style.textContent = CRITICAL_CSS;

            // Insert at the beginning of head for highest priority
            const firstLink = document.head.querySelector('link[rel="stylesheet"]');
            if (firstLink) {
                document.head.insertBefore(style, firstLink);
            } else {
                document.head.appendChild(style);
            }
        },

        // Load non-critical CSS asynchronously
        loadNonCriticalCSS: () => {
            const stylesheets = [
                'css/style.css',
                'css/preloader.css',
                'css/style-switcher.css'
            ];

            stylesheets.forEach(href => {
                const link = document.createElement('link');
                link.rel = 'stylesheet';
                link.href = href;
                link.media = 'print';
                link.onload = function() {
                    this.media = 'all';
                    console.log('[CriticalCSS] Non-critical CSS loaded:', href);
                };

                // Fallback for browsers that don't support onload on link elements
                link.onerror = function() {
                    this.media = 'all';
                };

                document.head.appendChild(link);
            });
        },

        // Preload fonts
        preloadFonts: () => {
            const fonts = [
                'https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;600;700&family=Kaushan+Script&display=swap'
            ];

            fonts.forEach(href => {
                const link = document.createElement('link');
                link.rel = 'preload';
                link.as = 'style';
                link.href = href;
                link.onload = function() {
                    this.onload = null;
                    this.rel = 'stylesheet';
                };

                document.head.appendChild(link);

                // Fallback
                const noscript = document.createElement('noscript');
                const fallbackLink = document.createElement('link');
                fallbackLink.rel = 'stylesheet';
                fallbackLink.href = href;
                noscript.appendChild(fallbackLink);
                document.head.appendChild(noscript);
            });
        },

        // Remove render-blocking resources
        optimizeResourceLoading: () => {
            // Find all stylesheets and make them non-render-blocking
            const stylesheets = document.querySelectorAll('link[rel="stylesheet"]:not(#critical-css)');

            stylesheets.forEach(link => {
                if (!link.media || link.media === 'all') {
                    link.media = 'print';
                    link.onload = function() {
                        this.media = 'all';
                    };
                }
            });
        },

        // Monitor performance
        measurePerformance: () => {
            if ('performance' in window) {
                window.addEventListener('load', () => {
                    setTimeout(() => {
                        const perfData = performance.getEntriesByType('navigation')[0];
                        const metrics = {
                            domContentLoaded: perfData.domContentLoadedEventEnd - perfData.domContentLoadedEventStart,
                            loadComplete: perfData.loadEventEnd - perfData.loadEventStart,
                            firstPaint: performance.getEntriesByType('paint').find(entry => entry.name === 'first-paint')?.startTime,
                            firstContentfulPaint: performance.getEntriesByType('paint').find(entry => entry.name === 'first-contentful-paint')?.startTime
                        };

                        console.log('[CriticalCSS] Performance metrics:', metrics);
                    }, 0);
                });
            }
        }
    };

    // Initialize critical CSS system
    const initCriticalCSS = () => {
        console.log('[CriticalCSS] Initializing critical CSS system');

        // Inject critical CSS immediately
        utils.injectCriticalCSS();

        // Preload fonts
        utils.preloadFonts();

        // Load non-critical CSS asynchronously
        utils.loadNonCriticalCSS();

        // Optimize resource loading
        utils.optimizeResourceLoading();

        // Monitor performance
        utils.measurePerformance();

        console.log('[CriticalCSS] Critical CSS system initialized');
    };

    // Export for global access
    window.CriticalCSS = {
        init: initCriticalCSS,
        utils: utils,
        criticalCSS: CRITICAL_CSS
    };

    // Auto-initialize immediately (before DOM ready for critical CSS)
    initCriticalCSS();

})();
