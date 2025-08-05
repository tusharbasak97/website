/* ============================== Contact Form Submission Limiter ============================ */

(function() {
    'use strict';

    // Configuration - Hidden from users for security
    const FORM_CONFIG = {
        cooldownPeriod: 24 * 60 * 60 * 1000, // 24 hours in milliseconds
        maxSubmissionsPerWeek: 2, // 2 submissions per 7 days
        weekPeriod: 7 * 24 * 60 * 60 * 1000, // 7 days in milliseconds
        storageKey: 'contactFormSubmissions',
        enableLogging: false // Disabled for security
    };

    // Utility functions
    const utils = {
        log: function(message, data = null) {
            if (FORM_CONFIG.enableLogging) {
                console.log('[ContactForm]', message, data);
            }
        },

        getCurrentTime: function() {
            return new Date().getTime();
        },

        getStoredSubmissions: function() {
            try {
                const stored = localStorage.getItem(FORM_CONFIG.storageKey);
                return stored ? JSON.parse(stored) : [];
            } catch (error) {
                utils.log('Error reading stored submissions:', error);
                return [];
            }
        },

        storeSubmissions: function(submissions) {
            try {
                localStorage.setItem(FORM_CONFIG.storageKey, JSON.stringify(submissions));
            } catch (error) {
                utils.log('Error storing submissions:', error);
            }
        },

        cleanOldSubmissions: function(submissions) {
            const oneWeekAgo = utils.getCurrentTime() - FORM_CONFIG.weekPeriod;
            return submissions.filter(timestamp => timestamp > oneWeekAgo);
        }
    };

    // Form limiter functionality - Silent protection
    const FormLimiter = {
        init: function() {
            this.bindFormEvents();
            utils.log('Contact form limiter initialized');
        },

        bindFormEvents: function() {
            const contactForm = document.querySelector('.contact-form-inner');
            if (!contactForm) {
                utils.log('Contact form not found');
                return;
            }

            // Add event listener for form submission
            contactForm.addEventListener('submit', (e) => {
                if (!this.canSubmitForm()) {
                    e.preventDefault();
                    this.showLimitMessage();
                    return false;
                }

                // If submission is allowed, record it
                this.recordSubmission();
                this.showSuccessMessage();
            });
        },

        canSubmitForm: function() {
            const submissions = utils.getStoredSubmissions();
            const cleanSubmissions = utils.cleanOldSubmissions(submissions);
            const currentTime = utils.getCurrentTime();

            // Check if within cooldown period (24 hours)
            if (cleanSubmissions.length > 0) {
                const lastSubmission = Math.max(...cleanSubmissions);
                const timeSinceLastSubmission = currentTime - lastSubmission;

                if (timeSinceLastSubmission < FORM_CONFIG.cooldownPeriod) {
                    utils.log('Form submission blocked: within cooldown period');
                    return false;
                }
            }

            // Check weekly limit (2 submissions per 7 days)
            if (cleanSubmissions.length >= FORM_CONFIG.maxSubmissionsPerWeek) {
                utils.log('Form submission blocked: weekly limit reached');
                return false;
            }

            return true;
        },

        recordSubmission: function() {
            const submissions = utils.getStoredSubmissions();
            const cleanSubmissions = utils.cleanOldSubmissions(submissions);
            const currentTime = utils.getCurrentTime();

            cleanSubmissions.push(currentTime);
            utils.storeSubmissions(cleanSubmissions);

            utils.log('Form submission recorded');
        },

        showLimitMessage: function() {
            // Simple, non-revealing message
            this.showNotification('Please wait before submitting another message. Thank you for your patience.', 'warning');
        },

        showSuccessMessage: function() {
            this.showNotification('Message sent successfully! Thank you for contacting me.', 'success');
        },

        showNotification: function(message, type = 'info') {
            // Create notification element
            const notification = document.createElement('div');
            notification.className = `form-notification ${type}`;
            notification.innerHTML = `
                <div class="notification-content">
                    <i class="fas ${type === 'success' ? 'fa-check-circle' : type === 'warning' ? 'fa-exclamation-triangle' : 'fa-info-circle'}"></i>
                    <span>${message}</span>
                    <button class="notification-close" onclick="this.parentElement.parentElement.remove()">
                        <i class="fas fa-times"></i>
                    </button>
                </div>
            `;

            // Add notification styles if not already added
            if (!document.querySelector('#notification-styles')) {
                const style = document.createElement('style');
                style.id = 'notification-styles';
                style.textContent = `
                    .form-notification {
                        position: fixed;
                        top: 20px;
                        right: 20px;
                        max-width: 400px;
                        padding: 15px;
                        border-radius: 5px;
                        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
                        z-index: 10000;
                        animation: slideInRight 0.3s ease-out;
                    }

                    .form-notification.success {
                        background: #d4edda;
                        border: 1px solid #c3e6cb;
                        color: #155724;
                    }

                    .form-notification.warning {
                        background: #fff3cd;
                        border: 1px solid #ffeaa7;
                        color: #856404;
                    }

                    .form-notification.info {
                        background: #d1ecf1;
                        border: 1px solid #bee5eb;
                        color: #0c5460;
                    }

                    .notification-content {
                        display: flex;
                        align-items: center;
                        gap: 10px;
                    }

                    .notification-close {
                        background: none;
                        border: none;
                        cursor: pointer;
                        padding: 0;
                        margin-left: auto;
                        opacity: 0.7;
                        transition: opacity 0.2s;
                    }

                    .notification-close:hover {
                        opacity: 1;
                    }

                    @keyframes slideInRight {
                        from {
                            transform: translateX(100%);
                            opacity: 0;
                        }
                        to {
                            transform: translateX(0);
                            opacity: 1;
                        }
                    }
                `;
                document.head.appendChild(style);
            }

            // Add to page
            document.body.appendChild(notification);

            // Auto-remove after 5 seconds
            setTimeout(() => {
                if (notification.parentNode) {
                    notification.style.animation = 'slideInRight 0.3s ease-out reverse';
                    setTimeout(() => {
                        if (notification.parentNode) {
                            notification.remove();
                        }
                    }, 300);
                }
            }, 5000);
        },

        // Minimal public methods for debugging (admin only)
        resetSubmissions: function() {
            localStorage.removeItem(FORM_CONFIG.storageKey);
            utils.log('Form submissions reset');
        }
    };

    // Initialize when DOM is ready
    const initFormLimiter = () => {
        FormLimiter.init();
    };

    // Minimal export for admin debugging only
    window.ContactFormLimiter = {
        reset: FormLimiter.resetSubmissions.bind(FormLimiter)
    };

    // Auto-initialize when DOM is ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initFormLimiter);
    } else {
        initFormLimiter();
    }

})();