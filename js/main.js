/* ============================== Main Portfolio Script ============================ */

// Initialize the application
document.addEventListener("DOMContentLoaded", function () {
  try {
    initialize404Handling();

    // Wait a bit for SPA navigation to initialize first
    setTimeout(() => {
      initializeApp();
      initializePageLoading();
    }, 50);

    registerServiceWorker();
    initializeOfflineDetection();
  } catch (error) {
    console.error("Error initializing application:", error);
    // Ensure basic functionality works even if some features fail
    document.body.classList.remove("page-loading");
  }
});

// Global error handler
window.addEventListener("error", function (event) {
  console.error("Global error:", event.error);
  // You can add error reporting here
});

// Unhandled promise rejection handler
window.addEventListener("unhandledrejection", function (event) {
  console.error("Unhandled promise rejection:", event.reason);
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
  initializeLazyLoadingIntegration();
  initializeAnalyticsIntegration();
}

/* ============================== Typing Animation ============================ */
function initializeTyping() {
  try {
    if (typeof Typed !== "undefined") {
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
      const typingElement = document.querySelector(".typing");
      if (typingElement) {
        typingElement.textContent = "Cybersecurity Analyst";
      }
    }
  } catch (error) {
    console.error("Error initializing typing animation:", error);
    // Fallback
    const typingElement = document.querySelector(".typing");
    if (typingElement) {
      typingElement.textContent = "Cybersecurity Analyst";
    }
  }
}

/* ============================== Navigation System ============================ */
// Navigation is now handled by spa-navigation.js for better performance
// This section is kept for backward compatibility

function initializeNavigation() {
  // Navigation is handled by SPA system
  // This function is kept for backward compatibility but does minimal work
  // The actual navigation is handled by spa-navigation.js

  // Wait for SPA system to initialize, then sync navigation state
  setTimeout(() => {
    if (window.SPANavigation) {
      const currentSection = window.SPANavigation.getCurrentSection();
      const navLinks = document.querySelectorAll(".nav a");
      navLinks.forEach((link) => {
        link.classList.remove("active");
        const linkSection = link.getAttribute("href").replace("#", "");
        if (linkSection === currentSection) {
          link.classList.add("active");
        }
      });
    }
  }, 100);
}

/* ============================== History Management ============================ */
function initializeHistoryManagement() {
  // History management disabled for true SPA behavior
  // No URL changes for better performance
}

/* ============================== Page Loading Management ============================ */
function initializePageLoading() {
  // Show loading overlay immediately
  showLoadingOverlay();

  // Wait for all resources to load
  window.addEventListener("load", function () {
    // Additional delay to ensure smooth experience
    setTimeout(() => {
      // Remove page-loading class
      document.body.classList.remove("page-loading");

      // Don't force home section - let SPA navigation handle initial section
      // The SPA navigation system will load the correct section based on saved state

      // Hide loading overlay
      setTimeout(() => {
        hideLoadingOverlay();
      }, 400);
    }, 800);
  });
}

/* ============================== Loading Overlay Functions ============================ */
function showLoadingOverlay() {
  const loadingOverlay = document.getElementById("loadingOverlay");
  if (loadingOverlay) {
    loadingOverlay.classList.add("active");
  }
}

function hideLoadingOverlay() {
  const loadingOverlay = document.getElementById("loadingOverlay");
  if (loadingOverlay) {
    loadingOverlay.classList.remove("active");
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
    const isDarkMode = document.body.classList.contains("dark");

    if (isDarkMode) {
      // Switch to light mode
      document.body.classList.remove("dark");
      document.body.classList.add("theme-override");
      dayNight.querySelector("i").classList.remove("fa-sun");
      dayNight.querySelector("i").classList.add("fa-moon");
      localStorage.setItem("theme", "light");
    } else {
      // Switch to dark mode
      document.body.classList.add("dark");
      document.body.classList.add("theme-override");
      dayNight.querySelector("i").classList.remove("fa-moon");
      dayNight.querySelector("i").classList.add("fa-sun");
      localStorage.setItem("theme", "dark");
    }
  });

  // Load theme preference (saved theme or system default)
  const savedTheme = localStorage.getItem("theme");
  const systemPrefersDark = window.matchMedia(
    "(prefers-color-scheme: dark)"
  ).matches;

  let shouldUseDarkMode = false;

  if (savedTheme) {
    // Use saved preference if available
    shouldUseDarkMode = savedTheme === "dark";
  } else {
    // Use system preference if no saved preference
    shouldUseDarkMode = systemPrefersDark;
  }

  if (shouldUseDarkMode) {
    document.body.classList.add("dark");
    dayNight.querySelector("i").classList.add("fa-sun");
  } else {
    document.body.classList.remove("dark");
    dayNight.querySelector("i").classList.add("fa-moon");
  }

  // Add theme-override class if user has manually set a preference
  if (savedTheme) {
    document.body.classList.add("theme-override");
  }

  // Listen for system theme changes
  window
    .matchMedia("(prefers-color-scheme: dark)")
    .addEventListener("change", (e) => {
      // Only auto-switch if user hasn't manually set a preference
      if (!localStorage.getItem("theme")) {
        if (e.matches) {
          document.body.classList.add("dark");
          dayNight.querySelector("i").classList.remove("fa-moon");
          dayNight.querySelector("i").classList.add("fa-sun");
        } else {
          document.body.classList.remove("dark");
          dayNight.querySelector("i").classList.remove("fa-sun");
          dayNight.querySelector("i").classList.add("fa-moon");
        }
      }
    });

  // Load saved color scheme
  const savedColor = localStorage.getItem("colorScheme");
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
  localStorage.setItem("colorScheme", color);
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

  window.addEventListener("mousemove", setCursorCoordinates);

  function toggleCursorActivity() {
    cursor1.classList.toggle("active");
    cursor2.classList.toggle("active");
  }

  document.querySelectorAll("a").forEach((link) => {
    link.addEventListener("mouseenter", toggleCursorActivity);
    link.addEventListener("mouseleave", toggleCursorActivity);
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
  "cybersecurity-trainee": {
    name: "Cybersecurity Trainee",
    issuer: "Tata Strive | SAP India",
    issued: "2024-09-15",
    expires: "lifetime",
    verifyUrl: "./assets/Strive.pdf",
  },
  "python-cybersecurity": {
    name: "Python for Cybersecurity",
    issuer: "Coursera",
    issued: "2024-08-20",
    expires: "2027-09-15",
    verifyUrl: "#",
  },
  "aws-cloud-security": {
    name: "AWS Cloud Security",
    issuer: "Amazon Web Services",
    issued: "2024-07-10",
    expires: "2027-07-10",
    verifyUrl: "#",
  },
  "penetration-testing": {
    name: "Penetration Testing Essentials",
    issuer: "EC-Council",
    issued: "2023-12-05",
    expires: "2025-12-05",
    verifyUrl: "#",
  },
  "network-security": {
    name: "Network Security Fundamentals",
    issuer: "Cisco Networking Academy",
    issued: "2024-06-15",
    expires: "2027-06-15",
    verifyUrl: "#",
  },
  "soc-analyst": {
    name: "SOC Analyst Level 1",
    issuer: "SANS Institute",
    issued: "2024-05-30",
    expires: "2026-05-30",
    verifyUrl: "#",
  },
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
  document.addEventListener("visibilitychange", () => {
    if (!document.hidden) {
      updateCertificateStatuses();
    }
  });
}

function checkExpiringCertificates() {
  const certificates = document.querySelectorAll(".certificate-item");
  const expiringCerts = [];

  certificates.forEach((cert) => {
    const statusElement = cert.querySelector(".certificate-status");
    if (statusElement && statusElement.classList.contains("expiring")) {
      const titleElement = cert.querySelector(".certificate-title");
      if (titleElement) {
        expiringCerts.push(titleElement.textContent);
      }
    }
  });

  if (expiringCerts.length > 0) {
    console.log(
      `⚠️ ${expiringCerts.length} certificate(s) expiring soon:`,
      expiringCerts
    );
    // You can add notification logic here if needed
  }
}

function initializeCertificateFilters() {
  const filterButtons = document.querySelectorAll(".filter-btn");

  filterButtons.forEach((button) => {
    button.addEventListener("click", function () {
      // Remove active class from all buttons
      filterButtons.forEach((btn) => btn.classList.remove("active"));
      // Add active class to clicked button
      this.classList.add("active");

      // Filter certificates
      const filter = this.getAttribute("data-filter");
      filterCertificates(filter);
    });
  });
}

function updateCertificateStatuses() {
  const certificates = document.querySelectorAll(".certificate-item");
  const currentDate = new Date();

  certificates.forEach((cert) => {
    const dateElements = cert.querySelectorAll(".date-value");
    const statusElement = cert.querySelector(".certificate-status");
    let expiryElement = null;

    // Find the expiry date element
    dateElements.forEach((el) => {
      const parent = el.parentElement;
      const label = parent.querySelector(".date-label");
      if (
        label &&
        (label.textContent.includes("Expires") ||
          label.textContent.includes("Validity") ||
          el.textContent.includes("Lifetime"))
      ) {
        expiryElement = el;
      }
    });

    if (statusElement) {
      // Handle lifetime certificates
      if (expiryElement && expiryElement.textContent.includes("Lifetime")) {
        updateCertificateStatus(
          statusElement,
          "active",
          "Active",
          "fas fa-check-circle",
          "Active Certificate - Lifetime Validity"
        );
        expiryElement.classList.remove("expiring", "expired");
        expiryElement.classList.add("lifetime");
        return;
      }

      // Handle dated certificates
      if (expiryElement && expiryElement.getAttribute("datetime")) {
        const expiryDate = new Date(expiryElement.getAttribute("datetime"));
        const daysUntilExpiry = Math.ceil(
          (expiryDate - currentDate) / (1000 * 60 * 60 * 24)
        );

        // Remove all status classes first
        expiryElement.classList.remove("expiring", "expired", "lifetime");

        if (daysUntilExpiry < 0) {
          // Expired
          updateCertificateStatus(
            statusElement,
            "expired",
            "Expired",
            "fas fa-times-circle",
            `Certificate expired ${Math.abs(daysUntilExpiry)} days ago`
          );
          expiryElement.classList.add("expired");
        } else if (daysUntilExpiry <= 30) {
          // Expiring soon (within 30 days)
          updateCertificateStatus(
            statusElement,
            "expiring",
            "Expiring",
            "fas fa-exclamation-triangle",
            `Certificate expires in ${daysUntilExpiry} days`
          );
          expiryElement.classList.add("expiring");
        } else {
          // Active
          updateCertificateStatus(
            statusElement,
            "active",
            "Active",
            "fas fa-check-circle",
            `Certificate expires in ${daysUntilExpiry} days`
          );
        }
      }
    }
  });

  // Update filter counts after status update
  updateFilterCounts();
}

function updateCertificateStatus(
  statusElement,
  statusClass,
  statusText,
  iconClass,
  title
) {
  statusElement.className = `certificate-status ${statusClass}`;
  statusElement.innerHTML = `<i class="${iconClass}"></i><span>${statusText}</span>`;
  statusElement.title = title;
}

function formatCertificateDate(dateString) {
  if (dateString === "lifetime") {
    return "Lifetime";
  }

  const date = new Date(dateString);
  return date.toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "2-digit",
  });
}

function getDaysUntilExpiry(expiryDate) {
  if (expiryDate === "lifetime") {
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
      status: "active",
      text: "Active",
      icon: "fas fa-check-circle",
      title: "Active Certificate - Lifetime Validity",
      class: "lifetime",
    };
  }

  if (days < 0) {
    return {
      status: "expired",
      text: "Expired",
      icon: "fas fa-times-circle",
      title: `Certificate expired ${Math.abs(days)} days ago`,
      class: "expired",
    };
  }

  if (days <= 30) {
    return {
      status: "expiring",
      text: "Expiring",
      icon: "fas fa-exclamation-triangle",
      title: `Certificate expires in ${days} days`,
      class: "expiring",
    };
  }

  return {
    status: "active",
    text: "Active",
    icon: "fas fa-check-circle",
    title: `Certificate expires in ${days} days`,
    class: "active",
  };
}

// Certificate verification functionality
function verifyCertificate(certificateId, verificationUrl) {
  if (verificationUrl && verificationUrl !== "#") {
    window.open(verificationUrl, "_blank", "noopener,noreferrer");
  } else {
    // Show modal or notification for verification
    showCertificateVerificationModal(certificateId);
  }
}

function showCertificateVerificationModal(certificateId) {
  // This could be expanded to show a modal with verification details
  console.log(
    `Certificate verification for ${certificateId} - Feature coming soon!`
  );
}

// Add certificate filtering functionality
function filterCertificates(filter) {
  const certificates = document.querySelectorAll(".certificate-item");

  certificates.forEach((cert, index) => {
    const status = cert.querySelector(".certificate-status").classList;
    const dataStatus = cert.getAttribute("data-status");
    let show = true;

    switch (filter) {
      case "active":
        show = status.contains("active") || dataStatus === "active";
        break;
      case "expiring":
        show = status.contains("expiring");
        break;
      case "expired":
        show = status.contains("expired");
        break;
      case "coming-soon":
        show = dataStatus === "coming-soon" || status.contains("pending");
        break;
      case "all":
      default:
        show = true;
        break;
    }

    if (show) {
      cert.style.display = "block";
      cert.style.opacity = "0";
      cert.style.transform = "translateY(20px)";

      // Staggered animation
      setTimeout(() => {
        cert.style.transition = "all 0.4s cubic-bezier(0.4, 0, 0.2, 1)";
        cert.style.opacity = "1";
        cert.style.transform = "translateY(0)";
      }, index * 100);
    } else {
      cert.style.transition = "all 0.3s ease";
      cert.style.opacity = "0";
      cert.style.transform = "translateY(-20px)";

      setTimeout(() => {
        cert.style.display = "none";
      }, 300);
    }
  });

  // Update filter button counts
  updateFilterCounts();
}

function updateFilterCounts() {
  // Wait a bit for status updates to complete
  setTimeout(() => {
    const certificates = document.querySelectorAll(".certificate-item");
    const activeCount = document.querySelectorAll(
      ".certificate-status.active"
    ).length;
    const expiringCount = document.querySelectorAll(
      ".certificate-status.expiring"
    ).length;
    const expiredCount = document.querySelectorAll(
      ".certificate-status.expired"
    ).length;
    const comingSoonCount = document.querySelectorAll(
      '[data-status="coming-soon"]'
    ).length;
    const totalCount = certificates.length;

    // Update count displays
    const allBtn = document.querySelector('[data-filter="all"] .count');
    const activeBtn = document.querySelector('[data-filter="active"] .count');
    const expiredBtn = document.querySelector('[data-filter="expired"] .count');
    const comingSoonBtn = document.querySelector(
      '[data-filter="coming-soon"] .count'
    );

    if (allBtn) allBtn.textContent = totalCount;
    if (activeBtn) activeBtn.textContent = activeCount;
    if (expiredBtn) expiredBtn.textContent = expiredCount;
    if (comingSoonBtn) comingSoonBtn.textContent = comingSoonCount;

    console.log("Filter counts updated:", {
      total: totalCount,
      active: activeCount,
      expiring: expiringCount,
      expired: expiredCount,
      comingSoon: comingSoonCount,
    });
  }, 50);
}

/* ============================== Service Worker Registration ============================ */
function registerServiceWorker() {
  if ("serviceWorker" in navigator) {
    window.addEventListener("load", () => {
      // Use correct service worker path for GitHub Pages
      const swPath = window.location.pathname.startsWith("/website/")
        ? "/website/js/sw.js"
        : "/js/sw.js";
      navigator.serviceWorker
        .register(swPath, {
          // Explicitly set scope to ensure service worker controls entire site
          scope: window.location.pathname.startsWith("/website/")
            ? "/website/"
            : "/",
        })
        .then((registration) => {
          console.log(
            "Service Worker registered successfully:",
            registration.scope
          );
          console.log("Complete offline support enabled");

          // Check for updates
          registration.addEventListener("updatefound", () => {
            const newWorker = registration.installing;
            console.log("Service Worker update found, installing...");

            newWorker.addEventListener("statechange", () => {
              if (newWorker.state === "installed") {
                if (navigator.serviceWorker.controller) {
                  // New content is available
                  console.log("New service worker installed, update available");
                } else {
                  // First time installation
                  console.log("Service Worker installed for the first time");
                }
              }
            });
          });

          // Check cache status
          checkCacheStatus();
        })
        .catch((error) => {
          console.log("Service Worker registration failed:", error);
        });
    });
  }
}

function checkCacheStatus() {
  if ("serviceWorker" in navigator && navigator.serviceWorker.controller) {
    // Create a message channel to communicate with service worker
    const messageChannel = new MessageChannel();
    messageChannel.port1.onmessage = (event) => {
      const { caches, version } = event.data;
      console.log("Cache Status:", {
        version: version,
        caches: caches,
        totalCaches: caches.length,
      });
    };

    // Send message to service worker
    navigator.serviceWorker.controller.postMessage(
      { type: "GET_CACHE_STATUS" },
      [messageChannel.port2]
    );

    // Also check if offline page is cached
    const offlineCheckChannel = new MessageChannel();
    offlineCheckChannel.port1.onmessage = (event) => {
      const { offlineCached, url } = event.data;
      console.log("Offline Cache Status:", {
        cached: offlineCached,
        url: url,
      });

      if (!offlineCached) {
        console.warn(
          "Offline page not cached! This may cause issues when going offline."
        );
      }
    };

    navigator.serviceWorker.controller.postMessage(
      { type: "CHECK_OFFLINE_CACHE" },
      [offlineCheckChannel.port2]
    );
  }
}

// Notification functions removed to eliminate banner popups

/* ============================== Offline Detection ============================ */
// Offline notification tracking removed

function initializeOfflineDetection() {
  // Check initial online status
  updateOnlineStatus();

  // Listen for online/offline events
  window.addEventListener("online", handleOnline);
  window.addEventListener("offline", handleOffline);

  // Less frequent connectivity checking to avoid banner spam
  setInterval(checkConnectivity, 30000); // Check every 30 seconds instead of 5

  // Also check on page visibility change
  document.addEventListener("visibilitychange", () => {
    if (!document.hidden) {
      setTimeout(checkConnectivity, 2000);
    }
  });

  // Initial connectivity check - delayed to avoid immediate banner
  setTimeout(checkConnectivity, 5000);
}

function updateOnlineStatus() {
  if (navigator.onLine) {
    document.body.classList.remove("offline");
    document.body.classList.add("online");
  } else {
    document.body.classList.remove("online");
    document.body.classList.add("offline");
  }
}

function handleOnline() {
  console.log("Connection restored");
  updateOnlineStatus();

  // Redirect to main site if we're on the offline page
  const currentPath = window.location.pathname;
  const isOnOfflinePage = currentPath.endsWith("/offline.html");

  if (isOnOfflinePage) {
    // Get the appropriate base URL
    const currentOrigin = window.location.origin;
    let baseUrl;

    if (
      currentOrigin.includes("localhost") ||
      currentOrigin.includes("127.0.0.1")
    ) {
      baseUrl =
        currentOrigin + (currentPath.includes("/website/") ? "/website/" : "/");
    } else if (currentPath.startsWith("/website/")) {
      baseUrl = currentOrigin + "/website/";
    } else {
      baseUrl = currentOrigin + "/";
    }

    // Preserve user's last visited section
    const savedSection = localStorage.getItem("spaCurrentSection");
    let redirectUrl = baseUrl;

    if (savedSection && savedSection !== "home") {
      redirectUrl += "?restore=" + savedSection;
    }

    console.log("Redirecting from offline page to:", redirectUrl);
    setTimeout(() => {
      window.location.href = redirectUrl;
    }, 1000);
  }
}

function handleOffline() {
  console.log("Connection lost");
  updateOnlineStatus();

  // Save current section before going offline
  if (window.SPANavigation) {
    const currentSection = window.SPANavigation.getCurrentSection();
    localStorage.setItem("spaCurrentSection", currentSection);
    console.log("Saved current section before going offline:", currentSection);
  }

  // Redirect to offline page after a short delay if not already there
  setTimeout(() => {
    const currentPath = window.location.pathname;
    const isOnOfflinePage = currentPath.endsWith("/offline.html");
    const isOn404Page = currentPath.endsWith("/404.html");

    if (!navigator.onLine && !isOnOfflinePage && !isOn404Page) {
      console.log("Redirecting to offline page");

      // Determine the correct offline page path based on current environment
      let offlineUrl;
      const currentOrigin = window.location.origin;

      if (
        currentOrigin.includes("localhost") ||
        currentOrigin.includes("127.0.0.1")
      ) {
        offlineUrl = currentPath.includes("/website/")
          ? "/website/offline.html"
          : "/offline.html";
      } else if (currentPath.startsWith("/website/")) {
        offlineUrl = "/website/offline.html";
      } else {
        offlineUrl = "/offline.html";
      }

      console.log("Navigating to offline page:", offlineUrl);
      window.location.href = offlineUrl;
    }
  }, 2000);
}

function checkConnectivity() {
  // More robust connectivity check with timeout
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 3000); // 3 second timeout

  // Use the correct path based on current environment
  const currentPath = window.location.pathname;
  const currentOrigin = window.location.origin;
  let testUrl;

  if (
    currentOrigin.includes("localhost") ||
    currentOrigin.includes("127.0.0.1")
  ) {
    testUrl = currentPath.includes("/website/")
      ? "/website/favicon.ico"
      : "/favicon.ico";
  } else if (currentPath.startsWith("/website/")) {
    testUrl = "/website/favicon.ico";
  } else {
    testUrl = "/favicon.ico";
  }

  fetch(testUrl + "?" + Date.now(), {
    method: "HEAD",
    cache: "no-cache",
    signal: controller.signal,
  })
    .then((response) => {
      clearTimeout(timeoutId);
      if (response.ok) {
        if (document.body.classList.contains("offline")) {
          handleOnline();
        }
      } else {
        if (!document.body.classList.contains("offline")) {
          handleOffline();
        }
      }
    })
    .catch((error) => {
      clearTimeout(timeoutId);
      console.log("Connectivity check failed:", error.name);
      if (!document.body.classList.contains("offline")) {
        handleOffline();
      }
    });
}

// showConnectionStatus function removed to eliminate banner popups

/* ============================== 404 Route Handling ============================ */
function initialize404Handling() {
  // Check if current URL is a valid route
  const currentPath = window.location.pathname;
  const validRoutes = [
    "/",
    "/index.html",
    "/offline.html",
    "/404.html",
    // GitHub Pages paths
    "/website/",
    "/website/index.html",
    "/website/offline.html",
    "/website/404.html",
  ];

  // Check if it's a valid file extension (assets)
  const validExtensions = [
    ".css",
    ".js",
    ".png",
    ".jpg",
    ".jpeg",
    ".webp",
    ".ico",
    ".pdf",
    ".svg",
    ".woff",
    ".woff2",
    ".ttf",
    ".webmanifest",
    ".xml",
    ".txt",
  ];
  const isAssetFile = validExtensions.some((ext) => currentPath.endsWith(ext));

  // Check if it's a valid GitHub Pages asset path
  const isGitHubPagesAsset = currentPath.startsWith("/website/") && isAssetFile;

  // For SPA - allow any path without extension (let the app handle routing)
  const isSPARoute = !currentPath.includes(".") && !currentPath.includes("?");

  // If it's not a valid route, not an asset file, and not a potential SPA route, redirect to 404
  if (
    !validRoutes.includes(currentPath) &&
    !isAssetFile &&
    !isGitHubPagesAsset &&
    !isSPARoute &&
    !currentPath.endsWith("/404.html")
  ) {
    console.log("Invalid route detected:", currentPath);

    // Save current section before redirecting
    if (window.SPANavigation) {
      const currentSection = window.SPANavigation.getCurrentSection();
      localStorage.setItem("spaCurrentSection", currentSection);
    }

    // Determine the correct 404 page path based on current environment
    let notFoundUrl;
    const currentOrigin = window.location.origin;

    if (
      currentOrigin.includes("localhost") ||
      currentOrigin.includes("127.0.0.1")
    ) {
      notFoundUrl = currentPath.includes("/website/")
        ? "/website/404.html"
        : "/404.html";
    } else if (currentPath.startsWith("/website/")) {
      notFoundUrl = "/website/404.html";
    } else {
      notFoundUrl = "/404.html";
    }

    console.log("Redirecting to 404 page:", notFoundUrl);
    window.location.replace(notFoundUrl);
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
    element.scrollIntoView({ behavior: "smooth" });
  }
}

// Performance monitoring
function initializePerformanceMonitoring() {
  if ("performance" in window) {
    window.addEventListener("load", () => {
      setTimeout(() => {
        const perfData = performance.getEntriesByType("navigation")[0];
        const metrics = {
          "DNS Lookup": perfData.domainLookupEnd - perfData.domainLookupStart,
          "TCP Connection": perfData.connectEnd - perfData.connectStart,
          Request: perfData.responseStart - perfData.requestStart,
          Response: perfData.responseEnd - perfData.responseStart,
          "DOM Processing":
            perfData.domContentLoadedEventStart - perfData.responseEnd,
          "Total Load Time": perfData.loadEventEnd - perfData.navigationStart,
        };

        console.log("Page Load Performance:", metrics);

        // Performance metrics logged to console only
      }, 0);
    });
  }
}

// Lazy loading integration
function initializeLazyLoadingIntegration() {
  // Convert existing images to lazy loading format
  const images = document.querySelectorAll("img:not([data-src]):not(.no-lazy)");

  images.forEach((img) => {
    // Skip if already processed or is a critical image
    if (img.dataset.processed || img.dataset.critical === "true") {
      return;
    }

    // Convert to lazy loading
    if (img.src && !img.src.startsWith("data:")) {
      img.dataset.src = img.src;
      img.dataset.processed = "true";

      // Create placeholder
      const canvas = document.createElement("canvas");
      const ctx = canvas.getContext("2d");
      canvas.width = img.width || img.naturalWidth || 300;
      canvas.height = img.height || img.naturalHeight || 200;

      // Simple gradient placeholder
      const gradient = ctx.createLinearGradient(
        0,
        0,
        canvas.width,
        canvas.height
      );
      gradient.addColorStop(0, "#f0f0f0");
      gradient.addColorStop(1, "#e0e0e0");
      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      img.src = canvas.toDataURL();
      img.classList.add("lazy-placeholder");
    }
  });

  // Listen for lazy loading events
  document.addEventListener("lazyloaded", (event) => {
    const img = event.detail.element;
    console.log("Image lazy loaded:", img.src, "Format:", event.detail.format);

    // Image lazy loading completed (no tracking needed for individual portfolio)
  });

  console.log("Lazy loading integration initialized");
}

// Analytics integration - optimized for performance
function initializeAnalyticsIntegration() {
  // Debounced tracking to reduce excessive events
  const debounce = (func, wait) => {
    let timeout;
    return function executedFunction(...args) {
      const later = () => {
        clearTimeout(timeout);
        func(...args);
      };
      clearTimeout(timeout);
      timeout = setTimeout(later, wait);
    };
  };

  // Track section visibility with debouncing (no console logging)
  const sections = document.querySelectorAll("section[id]");
  // Section tracking removed - not needed for individual portfolio

  const sectionObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting && entry.intersectionRatio > 0.5) {
          // Section tracking removed - not needed for individual portfolio
        }
      });
    },
    {
      threshold: 0.5,
      rootMargin: "0px 0px -10% 0px",
    }
  );

  sections.forEach((section) => {
    sectionObserver.observe(section);
  });

  // Debounced click tracking
  // Click tracking removed - not needed for individual portfolio

  // Single optimized click handler for all interactions
  document.addEventListener("click", (e) => {
    // Certificate interactions
    const certificateCard = e.target.closest(
      ".certificate-item, .cert-card, [data-certificate]"
    );
    if (certificateCard) {
      const certificateName =
        certificateCard.dataset.certificate ||
        certificateCard.querySelector("h3, .cert-title")?.textContent?.trim() ||
        "Certificate";
      // Certificate click tracking removed - not needed for individual portfolio
      return;
    }

    // Project interactions
    const projectCard = e.target.closest(
      ".portfolio-item, .project-card, [data-project]"
    );
    if (projectCard) {
      const projectName =
        projectCard.dataset.project ||
        projectCard.querySelector("h3, .project-title")?.textContent?.trim() ||
        "Project";
      // Project click tracking removed - not needed for individual portfolio
      return;
    }

    // External links (no console warnings)
    const link = e.target.closest("a[href]");
    if (link && link.href) {
      try {
        const url = new URL(link.href);
        if (url.hostname !== window.location.hostname) {
          // External link tracking removed - not needed for individual portfolio
        }
      } catch (error) {
        // Silently handle URL parsing errors for better performance
      }
    }
  });
}

/* ============================== Error Pages Functionality ============================ */
// Centralized JavaScript for 404 and offline pages

class ErrorPageManager {
  constructor() {
    this.init();
  }

  init() {
    // Check if we're on an error page
    const isErrorPage = document.body.classList.contains("error-page-body");
    const isOfflinePage = document.body.classList.contains("offline-page-body");

    if (isErrorPage) {
      this.init404Page();
    } else if (isOfflinePage) {
      this.initOfflinePage();
    }
  }

  // Smart URL detection for different environments
  getBaseUrl() {
    const currentPath = window.location.pathname;
    const currentOrigin = window.location.origin;

    // Local development
    if (
      currentOrigin.includes("localhost") ||
      currentOrigin.includes("127.0.0.1")
    ) {
      return (
        currentOrigin + (currentPath.includes("/website/") ? "/website/" : "/")
      );
    }

    // GitHub Pages
    if (currentPath.startsWith("/website/")) {
      return currentOrigin + "/website/";
    }

    // Default fallback
    return currentOrigin + "/";
  }

  // Initialize 404 page functionality
  init404Page() {
    let countdownTime = 5;
    const countdownElement = document.getElementById("countdown");
    const returnBtn = document.getElementById("returnBtn");
    const baseUrl = this.getBaseUrl();

    // Preserve user's last visited section when redirecting
    const savedSection = localStorage.getItem("spaCurrentSection");
    let redirectUrl = baseUrl;

    if (savedSection && savedSection !== "home") {
      redirectUrl += "?restore=" + savedSection;
    }

    // Update the button href
    if (returnBtn) {
      returnBtn.href = redirectUrl;
    }

    // Update countdown display
    const updateCountdown = () => {
      if (countdownElement) {
        countdownElement.textContent = countdownTime;
      }

      if (countdownTime <= 0) {
        window.location.href = redirectUrl;
        return;
      }

      countdownTime--;
    };

    // Start countdown
    const countdownInterval = setInterval(updateCountdown, 1000);

    // Clear countdown if user clicks the button
    if (returnBtn) {
      returnBtn.addEventListener("click", function (e) {
        clearInterval(countdownInterval);
      });
    }

    // Clear countdown if user interacts with the page
    document.addEventListener("click", function () {
      clearInterval(countdownInterval);
    });

    document.addEventListener("keydown", function () {
      clearInterval(countdownInterval);
    });

    // Accessibility: Allow Enter key on button
    if (returnBtn) {
      returnBtn.addEventListener("keydown", function (e) {
        if (e.key === "Enter") {
          clearInterval(countdownInterval);
          window.location.href = redirectUrl;
        }
      });
    }

    // Handle page visibility change (user switches tabs)
    document.addEventListener("visibilitychange", function () {
      if (document.hidden) {
        clearInterval(countdownInterval);
      }
    });
  }

  // Initialize offline page functionality
  initOfflinePage() {
    const statusElement = document.getElementById("statusText");
    const statusContainer = document.getElementById("connectionStatus");
    let isRedirecting = false;
    const redirectUrl = this.getBaseUrl();

    // Update connection status display
    const updateConnectionStatus = (status, message) => {
      if (statusContainer && statusElement) {
        statusContainer.className = `connection-status ${status}`;
        statusElement.textContent = message;
      }
    };

    // Simple connectivity check using navigator.onLine
    const checkConnectivity = () => {
      if (isRedirecting) return;

      if (navigator.onLine) {
        console.log("Browser reports online status");
        handleOnlineDetected();
      } else {
        console.log("Browser reports offline status");
        if (statusContainer) {
          statusContainer.style.display = "none";
        }
      }
    };

    // Handle when connection is restored
    const handleOnlineDetected = () => {
      if (isRedirecting) return;

      isRedirecting = true;
      updateConnectionStatus(
        "online",
        "🎉 Connection restored! Redirecting to main site..."
      );

      console.log("Connection restored, redirecting to main site");

      // Preserve user's last visited section when redirecting
      const savedSection = localStorage.getItem("spaCurrentSection");
      let finalRedirectUrl = redirectUrl;

      if (savedSection && savedSection !== "home") {
        finalRedirectUrl += "?restore=" + savedSection;
      }

      // Redirect after a short delay to show the message
      setTimeout(() => {
        window.location.href = finalRedirectUrl;
      }, 2000);
    };

    // Function to redirect to main site
    window.redirectToMainSite = () => {
      const savedSection = localStorage.getItem("spaCurrentSection");
      let finalRedirectUrl = redirectUrl;

      if (savedSection && savedSection !== "home") {
        finalRedirectUrl += "?restore=" + savedSection;
      }

      window.location.href = finalRedirectUrl;
    };

    // Listen for browser online event
    window.addEventListener("online", () => {
      console.log("Browser online event detected");
      setTimeout(checkConnectivity, 500);
    });

    // Listen for browser offline event
    window.addEventListener("offline", () => {
      console.log("Browser offline event detected");
      if (statusContainer) {
        statusContainer.style.display = "none";
      }
      isRedirecting = false;
    });

    // Lightweight periodic connectivity check
    const startConnectivityMonitoring = () => {
      setTimeout(checkConnectivity, 2000);

      setInterval(() => {
        if (!isRedirecting) {
          checkConnectivity();
        }
      }, 10000);
    };

    // Handle page visibility change (when user returns to tab)
    document.addEventListener("visibilitychange", () => {
      if (!document.hidden && !isRedirecting) {
        setTimeout(checkConnectivity, 500);
      }
    });

    // Auto-redirect countdown
    let countdownSeconds = 5;
    const countdownElement = document.getElementById("countdown");

    const startCountdown = () => {
      const countdownInterval = setInterval(() => {
        countdownSeconds--;
        if (countdownElement) {
          countdownElement.textContent = countdownSeconds;
        }

        if (countdownSeconds <= 0) {
          clearInterval(countdownInterval);
          window.redirectToMainSite();
        }
      }, 1000);
    };

    // Initialize when page loads
    console.log(
      "Offline page loaded, starting countdown and connectivity monitoring"
    );
    startCountdown();
    startConnectivityMonitoring();
  }
}

// Initialize error page manager when DOM is ready
if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", () => {
    new ErrorPageManager();
  });
} else {
  new ErrorPageManager();
}
