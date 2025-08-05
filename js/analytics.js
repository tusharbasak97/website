// Enhanced Analytics and Conversion Tracking
// Tushar Basak Portfolio - Analytics Enhancement

(function() {
    'use strict';

    // Analytics configuration
    const ANALYTICS_CONFIG = {
        GA_MEASUREMENT_ID: 'GA_MEASUREMENT_ID', // Replace with actual GA4 ID
        LINKEDIN_PARTNER_ID: 'LINKEDIN_PARTNER_ID', // Replace with actual LinkedIn Partner ID
        DEBUG_MODE: false, // Disabled for better performance
        ENABLE_CONSOLE_LOGGING: false // Disabled for production performance
    };

    // Utility functions
    const utils = {
        // Debounce function to prevent excessive event firing
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

        // Get section name from element
        getSectionName: function(element) {
            const section = element.closest('section');
            return section ? section.id || section.className.split(' ')[0] : 'unknown';
        },

        // Log debug information
        log: function(message, data = null) {
            if (ANALYTICS_CONFIG.ENABLE_CONSOLE_LOGGING) {
                console.log('[Analytics]', message, data);
            }
        }
    };

    // Google Analytics 4 Enhanced Tracking
    const ga4Tracking = {
        // Track page views with enhanced data
        trackPageView: function(pageName = null) {
            if (typeof gtag === 'function') {
                const pageData = {
                    page_title: pageName || document.title,
                    page_location: window.location.href,
                    page_referrer: document.referrer,
                    user_agent: navigator.userAgent,
                    screen_resolution: `${screen.width}x${screen.height}`,
                    viewport_size: `${window.innerWidth}x${window.innerHeight}`,
                    color_depth: screen.colorDepth,
                    language: navigator.language,
                    timezone: Intl.DateTimeFormat().resolvedOptions().timeZone
                };

                gtag('event', 'page_view', pageData);
                utils.log('Page view tracked', pageData);
            }
        },

        // Track section views (scroll-based)
        trackSectionView: function(sectionName, element) {
            if (typeof gtag === 'function') {
                const eventData = {
                    event_category: 'engagement',
                    event_label: sectionName,
                    section_name: sectionName,
                    scroll_depth: Math.round((window.scrollY / (document.body.scrollHeight - window.innerHeight)) * 100),
                    time_on_page: Math.round((Date.now() - window.pageLoadTime) / 1000),
                    custom_parameter_1: sectionName
                };

                gtag('event', 'section_view', eventData);
                utils.log('Section view tracked', eventData);
            }
        },

        // Track certificate interactions
        trackCertificateView: function(certificateName, certificateProvider) {
            if (typeof gtag === 'function') {
                const eventData = {
                    event_category: 'certificates',
                    event_label: certificateName,
                    certificate_name: certificateName,
                    certificate_provider: certificateProvider,
                    custom_parameter_2: certificateName
                };

                gtag('event', 'certificate_view', eventData);
                utils.log('Certificate view tracked', eventData);
            }
        },

        // Track project interactions
        trackProjectView: function(projectName, projectType) {
            if (typeof gtag === 'function') {
                const eventData = {
                    event_category: 'projects',
                    event_label: projectName,
                    project_name: projectName,
                    project_type: projectType,
                    custom_parameter_3: projectName
                };

                gtag('event', 'project_view', eventData);
                utils.log('Project view tracked', eventData);
            }
        },

        // Track contact form interactions
        trackContactInteraction: function(interactionType, details = {}) {
            if (typeof gtag === 'function') {
                const eventData = {
                    event_category: 'contact',
                    event_label: interactionType,
                    interaction_type: interactionType,
                    custom_parameter_4: interactionType,
                    ...details
                };

                gtag('event', 'contact_interaction', eventData);
                utils.log('Contact interaction tracked', eventData);
            }
        },

        // Track file downloads
        trackFileDownload: function(fileName, fileType) {
            if (typeof gtag === 'function') {
                const eventData = {
                    event_category: 'downloads',
                    event_label: fileName,
                    file_name: fileName,
                    file_type: fileType,
                    file_extension: fileName.split('.').pop()
                };

                gtag('event', 'file_download', eventData);
                utils.log('File download tracked', eventData);
            }
        },

        // Track external link clicks
        trackExternalLink: function(url, linkText) {
            if (typeof gtag === 'function') {
                const eventData = {
                    event_category: 'external_links',
                    event_label: url,
                    link_url: url,
                    link_text: linkText,
                    link_domain: new URL(url).hostname
                };

                gtag('event', 'click', eventData);
                utils.log('External link tracked', eventData);
            }
        },

        // Track scroll depth
        trackScrollDepth: function(percentage) {
            if (typeof gtag === 'function') {
                const eventData = {
                    event_category: 'engagement',
                    event_label: `${percentage}%`,
                    scroll_depth: percentage,
                    page_height: document.body.scrollHeight,
                    viewport_height: window.innerHeight
                };

                gtag('event', 'scroll', eventData);
                utils.log('Scroll depth tracked', eventData);
            }
        },

        // Track time on page milestones
        trackTimeOnPage: function(seconds) {
            if (typeof gtag === 'function') {
                const eventData = {
                    event_category: 'engagement',
                    event_label: `${seconds}s`,
                    time_on_page: seconds,
                    page_url: window.location.href
                };

                gtag('event', 'timing_complete', eventData);
                utils.log('Time on page tracked', eventData);
            }
        }
    };

    // LinkedIn Insight Tag Enhanced Tracking
    const linkedinTracking = {
        // Track conversions
        trackConversion: function(conversionId, value = null) {
            if (typeof lintrk === 'function') {
                const conversionData = {
                    conversion_id: conversionId
                };

                if (value) {
                    conversionData.conversion_value = value;
                }

                lintrk('track', conversionData);
                utils.log('LinkedIn conversion tracked', conversionData);
            }
        },

        // Track custom events
        trackCustomEvent: function(eventName, eventData = {}) {
            if (typeof lintrk === 'function') {
                lintrk('track', {
                    event_name: eventName,
                    ...eventData
                });
                utils.log('LinkedIn custom event tracked', { eventName, eventData });
            }
        }
    };

    // Intersection Observer for section tracking
    const sectionObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting && entry.intersectionRatio > 0.5) {
                const sectionName = entry.target.id || entry.target.className.split(' ')[0];
                ga4Tracking.trackSectionView(sectionName, entry.target);

                // Track LinkedIn custom event for section views
                linkedinTracking.trackCustomEvent('section_view', {
                    section_name: sectionName
                });
            }
        });
    }, {
        threshold: [0.5],
        rootMargin: '0px 0px -10% 0px'
    });

    // Scroll depth tracking
    let scrollDepthMarkers = [25, 50, 75, 90, 100];
    let trackedScrollDepths = new Set();

    const trackScrollDepth = utils.debounce(() => {
        const scrollPercent = Math.round((window.scrollY / (document.body.scrollHeight - window.innerHeight)) * 100);

        scrollDepthMarkers.forEach(marker => {
            if (scrollPercent >= marker && !trackedScrollDepths.has(marker)) {
                trackedScrollDepths.add(marker);
                ga4Tracking.trackScrollDepth(marker);
            }
        });
    }, 250);

    // Time on page tracking
    let timeOnPageMarkers = [30, 60, 120, 300, 600]; // 30s, 1m, 2m, 5m, 10m
    let trackedTimeMarkers = new Set();

    const trackTimeOnPage = () => {
        const timeOnPage = Math.round((Date.now() - window.pageLoadTime) / 1000);

        timeOnPageMarkers.forEach(marker => {
            if (timeOnPage >= marker && !trackedTimeMarkers.has(marker)) {
                trackedTimeMarkers.add(marker);
                ga4Tracking.trackTimeOnPage(marker);
            }
        });
    };

    // Initialize analytics
    const initAnalytics = () => {
        // Set page load time
        window.pageLoadTime = Date.now();

        // Track initial page view
        ga4Tracking.trackPageView();

        // Observe all sections for intersection tracking
        document.querySelectorAll('section').forEach(section => {
            sectionObserver.observe(section);
        });

        // Add scroll event listener
        window.addEventListener('scroll', trackScrollDepth, { passive: true });

        // Add time tracking interval
        setInterval(trackTimeOnPage, 10000); // Check every 10 seconds

        // Track external links
        document.addEventListener('click', (e) => {
            const link = e.target.closest('a');
            if (link && link.href) {
                const url = new URL(link.href, window.location.origin);

                // Check if it's an external link
                if (url.hostname !== window.location.hostname) {
                    ga4Tracking.trackExternalLink(link.href, link.textContent.trim());
                    linkedinTracking.trackCustomEvent('external_link_click', {
                        link_url: link.href,
                        link_domain: url.hostname
                    });
                }

                // Check if it's a file download
                const fileExtensions = ['pdf', 'doc', 'docx', 'xls', 'xlsx', 'ppt', 'pptx', 'zip', 'rar'];
                const extension = url.pathname.split('.').pop().toLowerCase();
                if (fileExtensions.includes(extension)) {
                    const fileName = url.pathname.split('/').pop();
                    ga4Tracking.trackFileDownload(fileName, extension);
                    linkedinTracking.trackConversion('file_download');
                }
            }
        });

        // Track certificate interactions
        document.addEventListener('click', (e) => {
            const certificateCard = e.target.closest('.certificate-item, .cert-card');
            if (certificateCard) {
                const certificateName = certificateCard.querySelector('h3, .cert-title')?.textContent?.trim() || 'Unknown Certificate';
                const certificateProvider = certificateCard.querySelector('.cert-provider, .provider')?.textContent?.trim() || 'Unknown Provider';

                ga4Tracking.trackCertificateView(certificateName, certificateProvider);
                linkedinTracking.trackCustomEvent('certificate_view', {
                    certificate_name: certificateName,
                    certificate_provider: certificateProvider
                });
            }
        });

        // Track project interactions
        document.addEventListener('click', (e) => {
            const projectCard = e.target.closest('.portfolio-item, .project-card');
            if (projectCard) {
                const projectName = projectCard.querySelector('h3, .project-title')?.textContent?.trim() || 'Unknown Project';
                const projectType = projectCard.querySelector('.project-type, .category')?.textContent?.trim() || 'Unknown Type';

                ga4Tracking.trackProjectView(projectName, projectType);
                linkedinTracking.trackCustomEvent('project_view', {
                    project_name: projectName,
                    project_type: projectType
                });
            }
        });

        // Track contact form interactions
        document.addEventListener('submit', (e) => {
            if (e.target.matches('form')) {
                ga4Tracking.trackContactInteraction('form_submit', {
                    form_id: e.target.id || 'contact_form'
                });
                linkedinTracking.trackConversion('contact_form_submit');
            }
        });

        // Track navigation clicks
        document.addEventListener('click', (e) => {
            const navLink = e.target.closest('nav a, .nav a');
            if (navLink) {
                const sectionName = navLink.getAttribute('href')?.replace('#', '') || 'unknown';
                ga4Tracking.trackContactInteraction('navigation_click', {
                    section_name: sectionName
                });
            }
        });

        utils.log('Analytics initialized successfully');
    };

    // Initialize when DOM is ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initAnalytics);
    } else {
        initAnalytics();
    }

    // Export for global access
    window.AnalyticsTracker = {
        ga4: ga4Tracking,
        linkedin: linkedinTracking,
        utils: utils
    };

})();
