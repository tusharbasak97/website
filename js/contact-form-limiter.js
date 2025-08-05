/* ============================== Contact Form Submission Limiter ============================ */

(function() {
    'use strict';

    // Configuration
    const FORM_CONFIG = {
        cooldownPeriod: 5 * 60 * 1000, // 5 minutes in milliseconds
        maxSubmissionsPerHour: 3,
        storageKey: 'contactFormSubmissions',
        enableLogging: true
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

        formatTime: function(timestamp) {
            return new Date(timestamp).toLocaleTimeString();
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
            const oneHourAgo = utils.getCurrentTime() - (60 * 60 * 1000);
            return submissions.filter(timestamp => timestamp > oneHourAgo);
        }
    };

    // Form limiter functionality
    const FormLimiter = {
        init: function() {
            this.bindFormEvents();
            this.createStatusDisplay();
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

            // Update status display periodically
            this.updateStatusDisplay();
            setInterval(() => {
                this.updateStatusDisplay();
            }, 30000); // Update every 30 seconds
        },

        canSubmitForm: function() {
            const submissions = utils.getStoredSubmissions();
            const cleanSubmissions = utils.cleanOldSubmissions(submissions);
            const currentTime = utils.getCurrentTime();

            // Check if within cooldown period
            if (cleanSubmissions.length > 0) {
                const lastSubmission = Math.max(...cleanSubmissions);
                const timeSinceLastSubmission = currentTime - lastSubmission;
                
                if (timeSinceLastSubmission < FORM_CONFIG.cooldownPeriod) {
                    utils.log('Form submission blocked: within cooldown period');
                    return false;
                }
            }

            // Check hourly limit
            if (cleanSubmissions.length >= FORM_CONFIG.maxSubmissionsPerHour) {
                utils.log('Form submission blocked: hourly limit reached');
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
            
            utils.log('Form submission recorded:', utils.formatTime(currentTime));
        },

        createStatusDisplay: function() {
            const contactForm = document.querySelector('.contact-form-inner');
            if (!contactForm) return;

            // Create status display element
            const statusDisplay = document.createElement('div');
            statusDisplay.className = 'form-status-display';
            statusDisplay.innerHTML = `
                <div class="form-status-info">
                    <i class="fas fa-info-circle"></i>
                    <span class="status-text">Form ready</span>
                </div>
                <div class="form-limits-info">
                    <small>Limit: ${FORM_CONFIG.maxSubmissionsPerHour} submissions per hour, 5-minute cooldown between submissions</small>
                </div>
            `;

            // Add CSS styles
            const style = document.createElement('style');
            style.textContent = `
                .form-status-display {
                    margin-bottom: 15px;
                    padding: 10px 15px;
                    border-radius: 5px;
                    background: rgba(var(--skin-color), 0.1);
                    border: 1px solid rgba(var(--skin-color), 0.2);
                    font-size: 14px;
                }
                
                .form-status-info {
                    display: flex;
                    align-items: center;
                    gap: 8px;
                    margin-bottom: 5px;
                }
                
                .form-status-info i {
                    color: var(--skin-color);
                }
                
                .form-limits-info {
                    color: var(--text-black-600);
                    font-size: 12px;
                }
                
                .form-status-display.warning {
                    background: rgba(255, 193, 7, 0.1);
                    border-color: rgba(255, 193, 7, 0.3);
                }
                
                .form-status-display.warning .form-status-info i {
                    color: #ffc107;
                }
                
                .form-status-display.error {
                    background: rgba(220, 53, 69, 0.1);
                    border-color: rgba(220, 53, 69, 0.3);
                }
                
                .form-status-display.error .form-status-info i {
                    color: #dc3545;
                }
                
                .form-status-display.success {
                    background: rgba(40, 167, 69, 0.1);
                    border-color: rgba(40, 167, 69, 0.3);
                }
                
                .form-status-display.success .form-status-info i {
                    color: #28a745;
                }
            `;
            
            document.head.appendChild(style);

            // Insert status display before the form
            contactForm.parentNode.insertBefore(statusDisplay, contactForm);
            this.statusDisplay = statusDisplay;
        },

        updateStatusDisplay: function() {
            if (!this.statusDisplay) return;

            const submissions = utils.getStoredSubmissions();
            const cleanSubmissions = utils.cleanOldSubmissions(submissions);
            const currentTime = utils.getCurrentTime();
            const canSubmit = this.canSubmitForm();

            let statusClass = 'ready';
            let statusIcon = 'fas fa-check-circle';
            let statusText = 'Form ready';

            if (!canSubmit) {
                if (cleanSubmissions.length >= FORM_CONFIG.maxSubmissionsPerHour) {
                    statusClass = 'error';
                    statusIcon = 'fas fa-exclamation-triangle';
                    statusText = 'Hourly limit reached. Please try again later.';
                } else {
                    const lastSubmission = Math.max(...cleanSubmissions);
                    const timeRemaining = FORM_CONFIG.cooldownPeriod - (currentTime - lastSubmission);
                    const minutesRemaining = Math.ceil(timeRemaining / (60 * 1000));
                    
                    statusClass = 'warning';
                    statusIcon = 'fas fa-clock';
                    statusText = `Please wait ${minutesRemaining} minute${minutesRemaining !== 1 ? 's' : ''} before submitting again`;
                }
            }

            // Update display
            this.statusDisplay.className = `form-status-display ${statusClass}`;
            const statusInfo = this.statusDisplay.querySelector('.form-status-info');
            statusInfo.innerHTML = `
                <i class="${statusIcon}"></i>
                <span class="status-text">${statusText}</span>
            `;

            // Update submission count info
            const limitsInfo = this.statusDisplay.querySelector('.form-limits-info');
            limitsInfo.innerHTML = `
                <small>
                    Submissions in last hour: ${cleanSubmissions.length}/${FORM_CONFIG.maxSubmissionsPerHour} | 
                    Limit: ${FORM_CONFIG.maxSubmissionsPerHour} submissions per hour, 5-minute cooldown between submissions
                </small>
            `;
        },

        showLimitMessage: function() {
            this.updateStatusDisplay();
            
            // Scroll to form to show the status
            const contactForm = document.querySelector('.contact-form-inner');
            if (contactForm) {
                contactForm.scrollIntoView({ behavior: 'smooth', block: 'center' });
            }

            // Show temporary notification
            this.showNotification('Form submission limit reached. Please check the status above the form.', 'warning');
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

        // Public methods for external access
        getSubmissionStatus: function() {
            const submissions = utils.getStoredSubmissions();
            const cleanSubmissions = utils.cleanOldSubmissions(submissions);
            const currentTime = utils.getCurrentTime();
            const canSubmit = this.canSubmitForm();

            return {
                canSubmit: canSubmit,
                submissionsInLastHour: cleanSubmissions.length,
                maxSubmissionsPerHour: FORM_CONFIG.maxSubmissionsPerHour,
                cooldownPeriod: FORM_CONFIG.cooldownPeriod,
                lastSubmission: cleanSubmissions.length > 0 ? Math.max(...cleanSubmissions) : null
            };
        },

        resetSubmissions: function() {
            localStorage.removeItem(FORM_CONFIG.storageKey);
            this.updateStatusDisplay();
            utils.log('Form submissions reset');
        }
    };

    // Initialize when DOM is ready
    const initFormLimiter = () => {
        FormLimiter.init();
    };

    // Export for global access
    window.ContactFormLimiter = {
        getStatus: FormLimiter.getSubmissionStatus.bind(FormLimiter),
        reset: FormLimiter.resetSubmissions.bind(FormLimiter),
        config: FORM_CONFIG
    };

    // Auto-initialize when DOM is ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initFormLimiter);
    } else {
        initFormLimiter();
    }

})();