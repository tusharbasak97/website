/* ============================== Main Portfolio Script ============================ */

// Initialize the application
document.addEventListener('DOMContentLoaded', function() {
  try {
    initialize404Handling();
    initializeApp();
    initializePageLoading();
    registerServiceWorker();
    initializeOfflineDetection();
  } catch (error) {
    console.error('Error initializing application:', error);
    // Ensure basic functionality works even if some features fail
    document.body.classList.remove('page-loading');
  }
});

// Global error handler
window.addEventListener('error', function(event) {
  console.error('Global error:', event.error);
  // You can add error reporting here
});

// Unhandled promise rejection handler
window.addEventListener('unhandledrejection', function(event) {
  console.error('Unhandled promise rejection:', event.reason);
  // You can add error reporting here
});

function initializeApp() {
  initializeTyping();
  initializeNavigation();
  initializeStyleSwitcher();
  initializeCursor();
  initializeAge();
  initializeYear();
  initializeCertificates();
  initializeHistoryManagement();
  initializePerformanceMonitoring();
}

/* ============================== Typing Animation ============================ */
function initializeTyping() {
  try {
    if (typeof Typed !== 'undefined') {
      new Typed(".typing", {
        strings: [
          "Cybersecurity Analyst",
          "Penetration Tester",
          "Network Administrator",
          "System Administrator",
          "Network Engineer",
          "IT Manager",
          "IT Security Analyst",
          "IT Support Specialist",
          "Cloud Security Analyst",
          "Security Engineer",
          "Security Consultant",
          "Security Architect",
        ],
        startDelay: 300,
        typeSpeed: 100,
        backSpeed: 60,
        backDelay: 700,
        smartBackspace: true,
        loop: true,
      });
    } else {
      // Fallback if Typed.js fails to load
      const typingElement = document.querySelector('.typing');
      if (typingElement) {
        typingElement.textContent = 'Cybersecurity Analyst';
      }
    }
  } catch (error) {
    console.error('Error initializing typing animation:', error);
    // Fallback
    const typingElement = document.querySelector('.typing');
    if (typingElement) {
      typingElement.textContent = 'Cybersecurity Analyst';
    }
  }
}

/* ============================== Navigation System ============================ */
let currentSection = 'home'; // Track current section

// Mobile navigation control function (global scope)
function closeMobileNavigation() {
  const aside = document.querySelector(".aside");
  const navTogglerBtn = document.querySelector(".nav-toggler");
  const allSection = document.querySelectorAll(".section");

  aside.classList.remove("open");
  navTogglerBtn.classList.remove("open");
  for (let i = 0; i < allSection.length; i++) {
    allSection[i].classList.remove("open");
  }
}

function initializeNavigation() {
  const nav = document.querySelector(".nav");
  const navList = nav.querySelectorAll("li");
  const totalNavList = navList.length;
  const allSection = document.querySelectorAll(".section");
  const totalSection = allSection.length;

  // Add click listeners to navigation links
  for (let i = 0; i < totalNavList; i++) {
    const a = navList[i].querySelector("a");
    a.addEventListener("click", function (e) {
      e.preventDefault();
      const targetSection = this.getAttribute("href").split("#")[1];
      navigateToSection(targetSection);
    });
  }

  // Mobile navigation toggle
  const navTogglerBtn = document.querySelector(".nav-toggler");
  const aside = document.querySelector(".aside");

  navTogglerBtn.addEventListener("click", (e) => {
    e.stopPropagation(); // Prevent event bubbling
    asideSectionTogglerBtn();
  });

  // Close mobile navigation when clicking outside
  document.addEventListener("click", (e) => {
    // Check if mobile navigation is open
    if (aside.classList.contains("open")) {
      // Check if click is outside the aside navigation
      if (!aside.contains(e.target) && !navTogglerBtn.contains(e.target)) {
        closeMobileNavigation();
      }
    }
  });

  // Prevent closing when clicking inside the navigation
  aside.addEventListener("click", (e) => {
    e.stopPropagation();
  });

  // Close mobile navigation when pressing Escape key
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && aside.classList.contains("open")) {
      closeMobileNavigation();
    }
  });

  function asideSectionTogglerBtn() {
    aside.classList.toggle("open");
    navTogglerBtn.classList.toggle("open");
    for (let i = 0; i < totalSection; i++) {
      allSection[i].classList.toggle("open");
    }
  }
}

function navigateToSection(sectionId) {
  if (sectionId === currentSection) return; // Don't navigate to same section

  const targetSection = document.querySelector(`#${sectionId}`);
  if (!targetSection) return;

  // Show loading overlay for smooth transition
  showLoadingOverlay();

  // Update navigation immediately for visual feedback
  updateNavigation(sectionId);

  // Delay the section transition to allow loading overlay to appear
  setTimeout(() => {
    showSection(sectionId);
    currentSection = sectionId;

    // Update browser history
    const newUrl = `${window.location.pathname}${window.location.search}#${sectionId}`;
    history.pushState({ section: sectionId }, '', newUrl);

    // Hide loading overlay after section is shown
    setTimeout(() => {
      hideLoadingOverlay();
    }, 300);
  }, 150);

  // Close mobile menu if open
  if (window.innerWidth < 1200) {
    closeMobileNavigation();
  }
}

function showSection(sectionId) {
  const allSection = document.querySelectorAll(".section");
  const targetSection = document.querySelector(`#${sectionId}`);

  if (!targetSection) return;

  // Find current active section before removing classes
  const currentActiveSection = document.querySelector(".section.active");

  // If it's the same section, don't do anything
  if (currentActiveSection === targetSection) return;

  // Remove active and back-section classes from all sections
  allSection.forEach(section => {
    section.classList.remove("active", "back-section");
  });

  // Add back-section to previous active section (for smooth transition)
  if (currentActiveSection) {
    currentActiveSection.classList.add("back-section");
  }

  // Use requestAnimationFrame to ensure smooth transition
  requestAnimationFrame(() => {
    // Activate target section
    targetSection.classList.add("active");
  });
}

function updateNavigation(sectionId) {
  const navLinks = document.querySelectorAll(".nav a");

  navLinks.forEach(link => {
    link.classList.remove("active");
    const linkSection = link.getAttribute("href").split("#")[1];
    if (linkSection === sectionId) {
      link.classList.add("active");
    }
  });
}

/* ============================== History Management ============================ */
function initializeHistoryManagement() {
  // Handle initial page load
  const initialHash = window.location.hash.slice(1) || 'home';
  currentSection = initialHash;

  // Handle browser back/forward buttons
  window.addEventListener('popstate', function(event) {
    const sectionId = event.state ? event.state.section : (window.location.hash.slice(1) || 'home');

    // Use loading overlay for back/forward navigation too
    showLoadingOverlay();
    updateNavigation(sectionId);

    setTimeout(() => {
      showSection(sectionId);
      currentSection = sectionId;

      setTimeout(() => {
        hideLoadingOverlay();
      }, 300);
    }, 150);
  });

  // Set initial history state
  if (!history.state) {
    history.replaceState({ section: currentSection }, '', `${window.location.pathname}${window.location.search}#${currentSection}`);
  }
}

/* ============================== Page Loading Management ============================ */
function initializePageLoading() {
  const loadingOverlay = document.getElementById('loadingOverlay');

  // Show loading overlay immediately
  showLoadingOverlay();

  // Wait for all resources to load
  window.addEventListener('load', function() {
    // Additional delay to ensure smooth experience
    setTimeout(() => {
      // Remove page-loading class and show initial section
      document.body.classList.remove('page-loading');

      const initialHash = window.location.hash.slice(1) || 'home';
      showSection(initialHash);
      updateNavigation(initialHash);
      currentSection = initialHash;

      // Hide loading overlay
      setTimeout(() => {
        hideLoadingOverlay();
      }, 400);
    }, 800);
  });
}

/* ============================== Loading Overlay Functions ============================ */
function showLoadingOverlay() {
  const loadingOverlay = document.getElementById('loadingOverlay');
  if (loadingOverlay) {
    loadingOverlay.classList.add('active');
  }
}

function hideLoadingOverlay() {
  const loadingOverlay = document.getElementById('loadingOverlay');
  if (loadingOverlay) {
    loadingOverlay.classList.remove('active');
  }
}

/* ============================== Style Switcher ============================ */
function initializeStyleSwitcher() {
  const styleSwitcherToggle = document.querySelector(".style-switcher-toggler");
  const styleSwitcher = document.querySelector(".style-switcher");
  const dayNight = document.querySelector(".day-night");

  // Style switcher toggle
  styleSwitcherToggle.addEventListener("click", (event) => {
    event.stopPropagation();
    styleSwitcher.classList.toggle("open");
  });

  // Close style switcher when clicking outside
  document.addEventListener("click", () => {
    if (styleSwitcher.classList.contains("open")) {
      styleSwitcher.classList.remove("open");
    }
  });

  // Prevent closing when clicking inside style switcher
  styleSwitcher.addEventListener("click", (event) => {
    event.stopPropagation();
  });

  // Day/Night mode toggle
  dayNight.addEventListener("click", () => {
    const isDarkMode = document.body.classList.contains('dark');

    if (isDarkMode) {
      // Switch to light mode
      document.body.classList.remove('dark');
      document.body.classList.add('theme-override');
      dayNight.querySelector("i").classList.remove("fa-sun");
      dayNight.querySelector("i").classList.add("fa-moon");
      localStorage.setItem('theme', 'light');
    } else {
      // Switch to dark mode
      document.body.classList.add('dark');
      document.body.classList.add('theme-override');
      dayNight.querySelector("i").classList.remove("fa-moon");
      dayNight.querySelector("i").classList.add("fa-sun");
      localStorage.setItem('theme', 'dark');
    }
  });

  // Load theme preference (saved theme or system default)
  const savedTheme = localStorage.getItem('theme');
  const systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;

  let shouldUseDarkMode = false;

  if (savedTheme) {
    // Use saved preference if available
    shouldUseDarkMode = savedTheme === 'dark';
  } else {
    // Use system preference if no saved preference
    shouldUseDarkMode = systemPrefersDark;
  }

  if (shouldUseDarkMode) {
    document.body.classList.add('dark');
    dayNight.querySelector("i").classList.add("fa-sun");
  } else {
    document.body.classList.remove('dark');
    dayNight.querySelector("i").classList.add("fa-moon");
  }

  // Add theme-override class if user has manually set a preference
  if (savedTheme) {
    document.body.classList.add('theme-override');
  }

  // Listen for system theme changes
  window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', (e) => {
    // Only auto-switch if user hasn't manually set a preference
    if (!localStorage.getItem('theme')) {
      if (e.matches) {
        document.body.classList.add('dark');
        dayNight.querySelector("i").classList.remove("fa-moon");
        dayNight.querySelector("i").classList.add("fa-sun");
      } else {
        document.body.classList.remove('dark');
        dayNight.querySelector("i").classList.remove("fa-sun");
        dayNight.querySelector("i").classList.add("fa-moon");
      }
    }
  });

  // Load saved color scheme
  const savedColor = localStorage.getItem('colorScheme');
  if (savedColor) {
    setActiveStyle(savedColor);
  }
}

// Global function for color switching (called from HTML)
function setActiveStyle(color) {
  const alternateStyles = document.querySelectorAll(".alternative-style");
  alternateStyles.forEach((style) => {
    if (color === style.getAttribute("title")) {
      style.removeAttribute("disabled");
    } else {
      style.setAttribute("disabled", "true");
    }
  });

  // Save color preference
  localStorage.setItem('colorScheme', color);
}

/* ============================== Cursor Animation ============================ */
function initializeCursor() {
  const cursor1 = document.querySelector(".cursor-1");
  const cursor2 = document.querySelector(".cursor-2");

  if (!cursor1 || !cursor2) return;

  function setCursorCoordinates(e) {
    cursor1.style.top = e.pageY + "px";
    cursor1.style.left = e.pageX + "px";
    cursor2.style.top = e.pageY + "px";
    cursor2.style.left = e.pageX + "px";
  }

  window.addEventListener('mousemove', setCursorCoordinates);

  function toggleCursorActivity() {
    cursor1.classList.toggle("active");
    cursor2.classList.toggle("active");
  }

  document.querySelectorAll("a").forEach((link) => {
    link.addEventListener('mouseenter', toggleCursorActivity);
    link.addEventListener('mouseleave', toggleCursorActivity);
  });
}

/* ============================== Age Calculator ============================ */
function initializeAge() {
  const birthDate = new Date("1997-10-02");
  const ageElement = document.getElementById("age");

  if (!ageElement) return;

  function calculateAge() {
    const currentDate = new Date();
    let years = currentDate.getFullYear() - birthDate.getFullYear();
    let months = currentDate.getMonth() - birthDate.getMonth();

    if (currentDate.getDate() < birthDate.getDate()) {
      months--;
    }

    if (months < 0) {
      years--;
      months += 12;
    }

    ageElement.textContent = `${years} yrs & ${months} months`;
  }

  calculateAge();
  // Update age daily
  setInterval(calculateAge, 1000 * 60 * 60 * 24);
}

/* ============================== Current Year ============================ */
function initializeYear() {
  const yearElement = document.getElementById("current-year");
  if (yearElement) {
    yearElement.textContent = new Date().getFullYear();
  }
}

/* ============================== Certificates Management ============================ */
// Certificate data structure for dynamic management
const certificateData = {
  'cybersecurity-trainee': {
    name: 'Cybersecurity Trainee',
    issuer: 'Tata Strive | SAP India',
    issued: '2024-09-15',
    expires: 'lifetime',
    verifyUrl: './assets/Strive.pdf'
  },
  'python-cybersecurity': {
    name: 'Python for Cybersecurity',
    issuer: 'Coursera',
    issued: '2024-08-20',
    expires: '2027-09-15',
    verifyUrl: '#'
  },
  'aws-cloud-security': {
    name: 'AWS Cloud Security',
    issuer: 'Amazon Web Services',
    issued: '2024-07-10',
    expires: '2027-07-10',
    verifyUrl: '#'
  },
  'penetration-testing': {
    name: 'Penetration Testing Essentials',
    issuer: 'EC-Council',
    issued: '2023-12-05',
    expires: '2025-12-05',
    verifyUrl: '#'
  },
  'network-security': {
    name: 'Network Security Fundamentals',
    issuer: 'Cisco Networking Academy',
    issued: '2024-06-15',
    expires: '2027-06-15',
    verifyUrl: '#'
  },
  'soc-analyst': {
    name: 'SOC Analyst Level 1',
    issuer: 'SANS Institute',
    issued: '2024-05-30',
    expires: '2026-05-30',
    verifyUrl: '#'
  }
};

function initializeCertificates() {
  updateCertificateStatuses();
  initializeCertificateFilters();
  setupCertificateAutoUpdate();
  // Initial count update
  setTimeout(() => {
    updateFilterCounts();
  }, 100);
}

function setupCertificateAutoUpdate() {
  // Update certificate statuses every hour
  setInterval(updateCertificateStatuses, 3600000);

  // Update at midnight every day for date changes
  const now = new Date();
  const tomorrow = new Date(now);
  tomorrow.setDate(tomorrow.getDate() + 1);
  tomorrow.setHours(0, 0, 0, 0);

  const msUntilMidnight = tomorrow.getTime() - now.getTime();

  setTimeout(() => {
    updateCertificateStatuses();
    checkExpiringCertificates();
    // Then update every 24 hours
    setInterval(() => {
      updateCertificateStatuses();
      checkExpiringCertificates();
    }, 24 * 60 * 60 * 1000);
  }, msUntilMidnight);

  // Also update when page becomes visible (user returns to tab)
  document.addEventListener('visibilitychange', () => {
    if (!document.hidden) {
      updateCertificateStatuses();
    }
  });
}

function checkExpiringCertificates() {
  const certificates = document.querySelectorAll('.certificate-item');
  const expiringCerts = [];

  certificates.forEach(cert => {
    const statusElement = cert.querySelector('.certificate-status');
    if (statusElement && statusElement.classList.contains('expiring')) {
      const titleElement = cert.querySelector('.certificate-title');
      if (titleElement) {
        expiringCerts.push(titleElement.textContent);
      }
    }
  });

  if (expiringCerts.length > 0) {
    console.log(`⚠️ ${expiringCerts.length} certificate(s) expiring soon:`, expiringCerts);
    // You can add notification logic here if needed
  }
}

function initializeCertificateFilters() {
  const filterButtons = document.querySelectorAll('.filter-btn');

  filterButtons.forEach(button => {
    button.addEventListener('click', function() {
      // Remove active class from all buttons
      filterButtons.forEach(btn => btn.classList.remove('active'));
      // Add active class to clicked button
      this.classList.add('active');

      // Filter certificates
      const filter = this.getAttribute('data-filter');
      filterCertificates(filter);
    });
  });
}

function updateCertificateStatuses() {
  const certificates = document.querySelectorAll('.certificate-item');
  const currentDate = new Date();

  certificates.forEach(cert => {
    const dateElements = cert.querySelectorAll('.date-value');
    const statusElement = cert.querySelector('.certificate-status');
    let expiryElement = null;

    // Find the expiry date element
    dateElements.forEach(el => {
      const parent = el.parentElement;
      const label = parent.querySelector('.date-label');
      if (label && (label.textContent.includes('Expires') || label.textContent.includes('Validity') || el.textContent.includes('Lifetime'))) {
        expiryElement = el;
      }
    });

    if (statusElement) {
      // Handle lifetime certificates
      if (expiryElement && expiryElement.textContent.includes('Lifetime')) {
        updateCertificateStatus(statusElement, 'active', 'Active', 'fas fa-check-circle', 'Active Certificate - Lifetime Validity');
        expiryElement.classList.remove('expiring', 'expired');
        expiryElement.classList.add('lifetime');
        return;
      }

      // Handle dated certificates
      if (expiryElement && expiryElement.getAttribute('datetime')) {
        const expiryDate = new Date(expiryElement.getAttribute('datetime'));
        const daysUntilExpiry = Math.ceil((expiryDate - currentDate) / (1000 * 60 * 60 * 24));

        // Remove all status classes first
        expiryElement.classList.remove('expiring', 'expired', 'lifetime');

        if (daysUntilExpiry < 0) {
          // Expired
          updateCertificateStatus(statusElement, 'expired', 'Expired', 'fas fa-times-circle', `Certificate expired ${Math.abs(daysUntilExpiry)} days ago`);
          expiryElement.classList.add('expired');
        } else if (daysUntilExpiry <= 30) {
          // Expiring soon (within 30 days)
          updateCertificateStatus(statusElement, 'expiring', 'Expiring', 'fas fa-exclamation-triangle', `Certificate expires in ${daysUntilExpiry} days`);
          expiryElement.classList.add('expiring');
        } else {
          // Active
          updateCertificateStatus(statusElement, 'active', 'Active', 'fas fa-check-circle', `Certificate expires in ${daysUntilExpiry} days`);
        }
      }
    }
  });

  // Update filter counts after status update
  updateFilterCounts();
}

function updateCertificateStatus(statusElement, statusClass, statusText, iconClass, title) {
  statusElement.className = `certificate-status ${statusClass}`;
  statusElement.innerHTML = `<i class="${iconClass}"></i><span>${statusText}</span>`;
  statusElement.title = title;
}

function formatCertificateDate(dateString) {
  if (dateString === 'lifetime') {
    return 'Lifetime';
  }

  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: '2-digit'
  });
}

function getDaysUntilExpiry(expiryDate) {
  if (expiryDate === 'lifetime') {
    return Infinity;
  }

  const currentDate = new Date();
  const expiry = new Date(expiryDate);
  return Math.ceil((expiry - currentDate) / (1000 * 60 * 60 * 24));
}

function getCertificateStatusInfo(expiryDate) {
  const days = getDaysUntilExpiry(expiryDate);

  if (days === Infinity) {
    return {
      status: 'active',
      text: 'Active',
      icon: 'fas fa-check-circle',
      title: 'Active Certificate - Lifetime Validity',
      class: 'lifetime'
    };
  }

  if (days < 0) {
    return {
      status: 'expired',
      text: 'Expired',
      icon: 'fas fa-times-circle',
      title: `Certificate expired ${Math.abs(days)} days ago`,
      class: 'expired'
    };
  }

  if (days <= 30) {
    return {
      status: 'expiring',
      text: 'Expiring',
      icon: 'fas fa-exclamation-triangle',
      title: `Certificate expires in ${days} days`,
      class: 'expiring'
    };
  }

  return {
    status: 'active',
    text: 'Active',
    icon: 'fas fa-check-circle',
    title: `Certificate expires in ${days} days`,
    class: 'active'
  };
}

// Certificate verification functionality
function verifyCertificate(certificateId, verificationUrl) {
  if (verificationUrl && verificationUrl !== '#') {
    window.open(verificationUrl, '_blank', 'noopener,noreferrer');
  } else {
    // Show modal or notification for verification
    showCertificateVerificationModal(certificateId);
  }
}

function showCertificateVerificationModal(certificateId) {
  // This could be expanded to show a modal with verification details
  alert(`Certificate verification for ${certificateId} - Feature coming soon!`);
}

// Add certificate filtering functionality
function filterCertificates(filter) {
  const certificates = document.querySelectorAll('.certificate-item');

  certificates.forEach((cert, index) => {
    const status = cert.querySelector('.certificate-status').classList;
    const dataStatus = cert.getAttribute('data-status');
    let show = true;

    switch(filter) {
      case 'active':
        show = status.contains('active') || dataStatus === 'active';
        break;
      case 'expiring':
        show = status.contains('expiring');
        break;
      case 'expired':
        show = status.contains('expired');
        break;
      case 'coming-soon':
        show = dataStatus === 'coming-soon' || status.contains('pending');
        break;
      case 'all':
      default:
        show = true;
        break;
    }

    if (show) {
      cert.style.display = 'block';
      cert.style.opacity = '0';
      cert.style.transform = 'translateY(20px)';

      // Staggered animation
      setTimeout(() => {
        cert.style.transition = 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)';
        cert.style.opacity = '1';
        cert.style.transform = 'translateY(0)';
      }, index * 100);
    } else {
      cert.style.transition = 'all 0.3s ease';
      cert.style.opacity = '0';
      cert.style.transform = 'translateY(-20px)';

      setTimeout(() => {
        cert.style.display = 'none';
      }, 300);
    }
  });

  // Update filter button counts
  updateFilterCounts();
}

function updateFilterCounts() {
  // Wait a bit for status updates to complete
  setTimeout(() => {
    const certificates = document.querySelectorAll('.certificate-item');
    const activeCount = document.querySelectorAll('.certificate-status.active').length;
    const expiringCount = document.querySelectorAll('.certificate-status.expiring').length;
    const expiredCount = document.querySelectorAll('.certificate-status.expired').length;
    const comingSoonCount = document.querySelectorAll('[data-status="coming-soon"]').length;
    const totalCount = certificates.length;

    // Update count displays
    const allBtn = document.querySelector('[data-filter="all"] .count');
    const activeBtn = document.querySelector('[data-filter="active"] .count');
    const expiredBtn = document.querySelector('[data-filter="expired"] .count');
    const comingSoonBtn = document.querySelector('[data-filter="coming-soon"] .count');

    if (allBtn) allBtn.textContent = totalCount;
    if (activeBtn) activeBtn.textContent = activeCount;
    if (expiredBtn) expiredBtn.textContent = expiredCount;
    if (comingSoonBtn) comingSoonBtn.textContent = comingSoonCount;

    console.log('Filter counts updated:', {
      total: totalCount,
      active: activeCount,
      expiring: expiringCount,
      expired: expiredCount,
      comingSoon: comingSoonCount
    });
  }, 50);
}

/* ============================== Service Worker Registration ============================ */
function registerServiceWorker() {
  if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
      navigator.serviceWorker.register('/sw.js')
        .then((registration) => {
          console.log('Service Worker registered successfully:', registration.scope);
          console.log('Complete offline support enabled');

          // Check for updates
          registration.addEventListener('updatefound', () => {
            const newWorker = registration.installing;
            console.log('Service Worker update found, installing...');

            newWorker.addEventListener('statechange', () => {
              if (newWorker.state === 'installed') {
                if (navigator.serviceWorker.controller) {
                  // New content is available, show update notification
                  console.log('New service worker installed, update available');
                  showUpdateNotification();
                } else {
                  // First time installation
                  console.log('Service Worker installed for the first time');
                  showInstallNotification();
                }
              }
            });
          });

          // Check cache status
          checkCacheStatus();
        })
        .catch((error) => {
          console.log('Service Worker registration failed:', error);
        });
    });
  }
}

function checkCacheStatus() {
  if ('serviceWorker' in navigator && navigator.serviceWorker.controller) {
    // Create a message channel to communicate with service worker
    const messageChannel = new MessageChannel();
    messageChannel.port1.onmessage = (event) => {
      const { caches, version } = event.data;
      console.log('Cache Status:', {
        version: version,
        caches: caches,
        totalCaches: caches.length
      });
    };

    // Send message to service worker
    navigator.serviceWorker.controller.postMessage(
      { type: 'GET_CACHE_STATUS' },
      [messageChannel.port2]
    );
  }
}

function showUpdateNotification() {
  console.log('New content is available! Please refresh the page.');
  showConnectionStatus('🔄 Update available! Refresh for latest version.', 'info');
}

function showInstallNotification() {
  console.log('Website is now available offline!');
  showConnectionStatus('✅ Website cached! Now available offline.', 'success');
}

/* ============================== Offline Detection ============================ */
function initializeOfflineDetection() {
  // Check initial online status
  updateOnlineStatus();

  // Listen for online/offline events
  window.addEventListener('online', handleOnline);
  window.addEventListener('offline', handleOffline);

  // More frequent connectivity checking
  setInterval(checkConnectivity, 5000); // Check every 5 seconds

  // Also check on page visibility change
  document.addEventListener('visibilitychange', () => {
    if (!document.hidden) {
      setTimeout(checkConnectivity, 1000);
    }
  });

  // Initial connectivity check
  setTimeout(checkConnectivity, 2000);
}

function updateOnlineStatus() {
  if (navigator.onLine) {
    document.body.classList.remove('offline');
    document.body.classList.add('online');
  } else {
    document.body.classList.remove('online');
    document.body.classList.add('offline');
  }
}

function handleOnline() {
  console.log('Connection restored');
  updateOnlineStatus();
  showConnectionStatus('You\'re back online!', 'success');

  // Redirect to main site if we're on the offline page
  if (window.location.pathname === '/offline.html') {
    setTimeout(() => {
      window.location.href = 'https://tusharbasak97.github.io/website/';
    }, 1000);
  }
}

function handleOffline() {
  console.log('Connection lost');
  updateOnlineStatus();
  showConnectionStatus('You\'re offline. Redirecting to offline page...', 'warning');

  // Redirect to offline page after a short delay if not already there
  setTimeout(() => {
    if (!navigator.onLine && window.location.pathname !== '/offline.html') {
      console.log('Redirecting to offline page');
      window.location.href = '/offline.html';
    }
  }, 2000);
}

function checkConnectivity() {
  // More robust connectivity check with timeout
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 3000); // 3 second timeout

  fetch('/favicon.ico?' + Date.now(), {
    method: 'HEAD',
    cache: 'no-cache',
    signal: controller.signal
  })
  .then((response) => {
    clearTimeout(timeoutId);
    if (response.ok) {
      if (document.body.classList.contains('offline')) {
        handleOnline();
      }
    } else {
      if (!document.body.classList.contains('offline')) {
        handleOffline();
      }
    }
  })
  .catch((error) => {
    clearTimeout(timeoutId);
    console.log('Connectivity check failed:', error.name);
    if (!document.body.classList.contains('offline')) {
      handleOffline();
    }
  });
}

function showConnectionStatus(message, type) {
  // Remove any existing status notifications
  const existingNotification = document.querySelector('.connection-status');
  if (existingNotification) {
    existingNotification.remove();
  }

  // Create status notification
  const notification = document.createElement('div');
  notification.className = `connection-status ${type}`;
  notification.innerHTML = `
    <div class="status-content">
      <i class="fas ${type === 'success' ? 'fa-wifi' : 'fa-exclamation-triangle'}"></i>
      <span>${message}</span>
    </div>
  `;

  // Add to page
  document.body.appendChild(notification);

  // Auto-remove after 5 seconds
  setTimeout(() => {
    if (notification.parentNode) {
      notification.classList.add('fade-out');
      setTimeout(() => {
        notification.remove();
      }, 300);
    }
  }, 5000);
}

/* ============================== 404 Route Handling ============================ */
function initialize404Handling() {
  // Check if current URL is a valid route
  const currentPath = window.location.pathname;
  const validRoutes = [
    '/',
    '/index.html',
    '/offline.html',
    '/404.html',
    '/test-offline.html',
    '/test-404.html',
    '/test-complete-offline.html',
    // GitHub Pages paths
    '/website/',
    '/website/index.html',
    '/website/offline.html',
    '/website/404.html',
    '/website/test-offline.html',
    '/website/test-404.html',
    '/website/test-complete-offline.html'
  ];

  // Check if it's a valid file extension (assets)
  const validExtensions = ['.css', '.js', '.png', '.jpg', '.jpeg', '.webp', '.ico', '.pdf', '.svg', '.woff', '.woff2', '.ttf', '.webmanifest', '.xml', '.txt'];
  const isAssetFile = validExtensions.some(ext => currentPath.endsWith(ext));

  // Check if it's a valid GitHub Pages asset path
  const isGitHubPagesAsset = currentPath.startsWith('/website/') && isAssetFile;

  // If it's not a valid route and not an asset file, redirect to 404
  if (!validRoutes.includes(currentPath) && !isAssetFile && !isGitHubPagesAsset && currentPath !== '/404.html' && currentPath !== '/website/404.html') {
    console.log('Invalid route detected:', currentPath);
    // Redirect to the appropriate 404 page based on current path
    if (currentPath.startsWith('/website/')) {
      window.location.replace('/website/404.html');
    } else {
      window.location.replace('/404.html');
    }
  }
}

/* ============================== Utility Functions ============================ */
// Debounce function for performance optimization
function debounce(func, wait) {
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

// Smooth scroll to section (fallback for older browsers)
function smoothScrollTo(element) {
  if (element.scrollIntoView) {
    element.scrollIntoView({ behavior: 'smooth' });
  }
}

// Performance monitoring
function initializePerformanceMonitoring() {
  if ('performance' in window) {
    window.addEventListener('load', () => {
      setTimeout(() => {
        const perfData = performance.getEntriesByType('navigation')[0];
        console.log('Page Load Performance:', {
          'DNS Lookup': perfData.domainLookupEnd - perfData.domainLookupStart,
          'TCP Connection': perfData.connectEnd - perfData.connectStart,
          'Request': perfData.responseStart - perfData.requestStart,
          'Response': perfData.responseEnd - perfData.responseStart,
          'DOM Processing': perfData.domContentLoadedEventStart - perfData.responseEnd,
          'Total Load Time': perfData.loadEventEnd - perfData.navigationStart
        });
      }, 0);
    });
  }
}
