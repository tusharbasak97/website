/**
 * Professional Preloader Script
 * Cybersecurity Portfolio Theme
 * Supports both light and dark modes
 */

class ProfessionalPreloader {
  constructor() {
    // Check if preloader should be shown immediately before creating elements
    if (this.shouldSkipPreloader()) {
      return;
    }

    this.preloader = null;
    this.progressBar = null;
    this.loadingText = null;
    this.currentProgress = 0;
    this.targetProgress = 0;
    this.animationFrame = null;
    this.loadingMessages = [
      'Initializing Security Protocols...',
      'Loading Cybersecurity Portfolio...',
      'Establishing Secure Connection...',
      'Verifying Digital Certificates...',
      'Preparing Professional Content...',
      'Almost Ready...'
    ];
    this.currentMessageIndex = 0;

    this.init();
  }

  shouldSkipPreloader() {
    // More reliable check for preloader state
    const preloaderShown = sessionStorage.getItem('preloaderShown');
    const isMobile = this.detectMobile();
    const isError = document.body.classList.contains('error-page-body') ||
                    document.body.classList.contains('offline-page-body');

    // Log for debugging
    console.debug('Preloader check:', { preloaderShown, isMobile, isError });

    return preloaderShown === 'true' || isMobile || isError;
  }

  detectMobile() {
    return window.innerWidth <= 768 ||
           /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
  }

  isErrorPage() {
    return document.body.classList.contains('error-page-body') ||
           document.body.classList.contains('offline-page-body');
  }

  init() {
    // Set sessionStorage as early as possible to prevent race conditions
    // Mark that we've started showing the preloader for this session
    sessionStorage.setItem('preloaderStarted', 'true');

    this.createPreloader();
    this.startLoading();
    this.bindEvents();
  }

  createPreloader() {
    // Create main preloader container
    this.preloader = document.createElement('div');
    this.preloader.className = 'preloader';
    this.preloader.id = 'preloader';

    // Create spinner container
    const spinnerContainer = document.createElement('div');
    spinnerContainer.className = 'preloader-spinner';

    // Create spinner rings
    const primaryRing = document.createElement('div');
    primaryRing.className = 'spinner-ring primary';

    const secondaryRing = document.createElement('div');
    secondaryRing.className = 'spinner-ring secondary';

    // Create center dot
    const spinnerDot = document.createElement('div');
    spinnerDot.className = 'spinner-dot';

    // Assemble spinner
    spinnerContainer.appendChild(primaryRing);
    spinnerContainer.appendChild(secondaryRing);
    spinnerContainer.appendChild(spinnerDot);

    // Create loading text
    this.loadingText = document.createElement('div');
    this.loadingText.className = 'preloader-text';
    this.loadingText.textContent = this.loadingMessages[0];

    // Create progress bar container
    const progressContainer = document.createElement('div');
    progressContainer.className = 'preloader-progress';

    // Create progress bar
    this.progressBar = document.createElement('div');
    this.progressBar.className = 'preloader-progress-bar';

    progressContainer.appendChild(this.progressBar);

    // Create security themed floating elements
    const securityElements = this.createSecurityElements();

    // Assemble preloader
    this.preloader.appendChild(securityElements);
    this.preloader.appendChild(spinnerContainer);
    this.preloader.appendChild(this.loadingText);
    this.preloader.appendChild(progressContainer);

    // Insert preloader into DOM
    document.body.insertBefore(this.preloader, document.body.firstChild);
  }

  createSecurityElements() {
    const container = document.createElement('div');
    container.className = 'security-elements';

    const icons = ['🔒', '🛡️', '🔐', '⚡'];

    icons.forEach((icon, index) => {
      const element = document.createElement('div');
      element.className = 'security-icon';
      element.textContent = icon;
      container.appendChild(element);
    });

    return container;
  }

  startLoading() {
    // Simulate loading progress
    const loadingSteps = [
      { progress: 15, delay: 300, message: 0 },
      { progress: 35, delay: 600, message: 1 },
      { progress: 55, delay: 400, message: 2 },
      { progress: 75, delay: 500, message: 3 },
      { progress: 90, delay: 300, message: 4 },
      { progress: 100, delay: 400, message: 5 }
    ];

    let currentStep = 0;

    const executeStep = () => {
      if (currentStep < loadingSteps.length) {
        const step = loadingSteps[currentStep];

        setTimeout(() => {
          this.updateProgress(step.progress);
          this.updateMessage(step.message);
          currentStep++;
          executeStep();
        }, step.delay);
      } else {
        // Wait for actual page load
        this.waitForPageLoad();
      }
    };

    executeStep();
  }

  updateProgress(targetProgress) {
    this.targetProgress = targetProgress;
    this.animateProgress();
  }

  animateProgress() {
    const animate = () => {
      if (this.currentProgress < this.targetProgress) {
        this.currentProgress += (this.targetProgress - this.currentProgress) * 0.1;

        if (this.progressBar) {
          this.progressBar.style.width = `${this.currentProgress}%`;
        }

        if (Math.abs(this.targetProgress - this.currentProgress) > 0.1) {
          this.animationFrame = requestAnimationFrame(animate);
        }
      }
    };

    if (this.animationFrame) {
      cancelAnimationFrame(this.animationFrame);
    }

    animate();
  }

  updateMessage(messageIndex) {
    if (this.loadingText && messageIndex < this.loadingMessages.length) {
      // Fade out current message
      this.loadingText.style.opacity = '0';

      setTimeout(() => {
        this.loadingText.textContent = this.loadingMessages[messageIndex];
        this.loadingText.style.opacity = '1';
      }, 200);
    }
  }

  waitForPageLoad() {
    const checkPageLoad = () => {
      if (document.readyState === 'complete') {
        // Add small delay to ensure smooth transition
        setTimeout(() => {
          this.hidePreloader();
        }, 500);
      } else {
        setTimeout(checkPageLoad, 100);
      }
    };

    if (document.readyState === 'complete') {
      setTimeout(() => {
        this.hidePreloader();
      }, 500);
    } else {
      checkPageLoad();
    }
  }

  hidePreloader() {
    if (this.preloader) {
      // Set preloader as shown - this is key for persistence
      sessionStorage.setItem('preloaderShown', 'true');

      // Log for debugging
      console.debug('Preloader hidden, sessionStorage set');

      // Final progress update
      this.updateProgress(100);
      this.updateMessage(5);

      // Add fade out class
      setTimeout(() => {
        this.preloader.classList.add('fade-out');

        // Remove from DOM after animation
        setTimeout(() => {
          if (this.preloader && this.preloader.parentNode) {
            this.preloader.parentNode.removeChild(this.preloader);
          }

          // Trigger custom event for other scripts
          document.dispatchEvent(new CustomEvent('preloaderComplete'));
        }, 600);
      }, 200);
    }
  }

  bindEvents() {
    // Handle page visibility changes
    document.addEventListener('visibilitychange', () => {
      if (document.hidden) {
        // Pause animations when tab is not visible
        if (this.preloader) {
          this.preloader.style.animationPlayState = 'paused';
        }
      } else {
        // Resume animations when tab becomes visible
        if (this.preloader) {
          this.preloader.style.animationPlayState = 'running';
        }
      }
    });

    // Handle window resize
    window.addEventListener('resize', () => {
      // Check if device became mobile and hide preloader if needed
      if (this.detectMobile() && this.preloader) {
        this.hidePreloader();
      }
    });

    // Force hide preloader if it takes too long (fallback)
    setTimeout(() => {
      if (this.preloader && !this.preloader.classList.contains('fade-out')) {
        console.warn('Preloader timeout - forcing hide');
        this.hidePreloader();
      }
    }, 10000); // 10 second timeout
  }

  // Public method to manually hide preloader
  static hide() {
    const preloader = document.getElementById('preloader');
    if (preloader) {
      preloader.classList.add('fade-out');
      setTimeout(() => {
        if (preloader.parentNode) {
          preloader.parentNode.removeChild(preloader);
        }
      }, 600);
    }
  }

  // Public method to update progress manually
  static updateProgress(progress) {
    const progressBar = document.querySelector('.preloader-progress-bar');
    if (progressBar) {
      progressBar.style.width = `${Math.min(100, Math.max(0, progress))}%`;
    }
  }
}

// Initialize preloader when DOM is ready
if (!sessionStorage.getItem('preloaderShown')) {
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
      new ProfessionalPreloader();
    });
  } else {
    new ProfessionalPreloader();
  }
} else {
  console.debug('Preloader already shown this session, skipping');
}

// Export for potential external use
window.ProfessionalPreloader = ProfessionalPreloader;

