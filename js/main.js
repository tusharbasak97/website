/* ============================== Main Portfolio Script ============================ */

// Initialize the application
document.addEventListener('DOMContentLoaded', function() {
  initializeApp();
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
}

/* ============================== Typing Animation ============================ */
function initializeTyping() {
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
  }
}

/* ============================== Navigation System ============================ */
let currentSection = 'home'; // Track current section

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

  navTogglerBtn.addEventListener("click", () => {
    asideSectionTogglerBtn();
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

  // Update browser history
  const newUrl = `${window.location.pathname}${window.location.search}#${sectionId}`;
  history.pushState({ section: sectionId }, '', newUrl);

  // Update the UI
  showSection(sectionId);
  updateNavigation(sectionId);
  currentSection = sectionId;

  // Close mobile menu if open
  if (window.innerWidth < 1200) {
    const aside = document.querySelector(".aside");
    const navTogglerBtn = document.querySelector(".nav-toggler");
    const allSection = document.querySelectorAll(".section");

    aside.classList.remove("open");
    navTogglerBtn.classList.remove("open");
    allSection.forEach(section => section.classList.remove("open"));
  }
}

function showSection(sectionId) {
  const allSection = document.querySelectorAll(".section");

  // Remove active and back-section classes from all sections
  allSection.forEach(section => {
    section.classList.remove("active", "back-section");
  });

  // Add back-section to current section before switching
  const currentActiveSection = document.querySelector(".section.active");
  if (currentActiveSection) {
    currentActiveSection.classList.add("back-section");
  }

  // Activate target section
  const targetSection = document.querySelector(`#${sectionId}`);
  if (targetSection) {
    targetSection.classList.add("active");
  }
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
  showSection(initialHash);
  updateNavigation(initialHash);
  currentSection = initialHash;

  // Handle browser back/forward buttons
  window.addEventListener('popstate', function(event) {
    const sectionId = event.state ? event.state.section : (window.location.hash.slice(1) || 'home');
    showSection(sectionId);
    updateNavigation(sectionId);
    currentSection = sectionId;
  });

  // Set initial history state
  if (!history.state) {
    history.replaceState({ section: currentSection }, '', `${window.location.pathname}${window.location.search}#${currentSection}`);
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
    dayNight.querySelector("i").classList.toggle("fa-sun");
    dayNight.querySelector("i").classList.toggle("fa-moon");
    document.body.classList.toggle("dark");

    // Save theme preference
    localStorage.setItem('theme', document.body.classList.contains('dark') ? 'dark' : 'light');
  });

  // Load saved theme
  const savedTheme = localStorage.getItem('theme');
  if (savedTheme === 'dark') {
    document.body.classList.add('dark');
    dayNight.querySelector("i").classList.add("fa-sun");
  } else {
    dayNight.querySelector("i").classList.add("fa-moon");
  }

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
function initializeCertificates() {
  updateCertificateStatuses();
  // Update certificate statuses every hour
  setInterval(updateCertificateStatuses, 3600000);
}

function updateCertificateStatuses() {
  const certificates = document.querySelectorAll('.certificate-item');
  const currentDate = new Date();

  certificates.forEach(cert => {
    const expiryElement = cert.querySelector('.date-value[datetime]');
    const statusElement = cert.querySelector('.certificate-status');

    if (expiryElement && statusElement && expiryElement.getAttribute('datetime')) {
      const expiryDate = new Date(expiryElement.getAttribute('datetime'));
      const daysUntilExpiry = Math.ceil((expiryDate - currentDate) / (1000 * 60 * 60 * 24));

      // Update status based on expiry
      if (daysUntilExpiry < 0) {
        // Expired
        statusElement.className = 'certificate-status expired';
        statusElement.innerHTML = '<i class="fas fa-times-circle"></i>';
        statusElement.title = 'Certificate Expired';
        expiryElement.classList.add('expired');
      } else if (daysUntilExpiry <= 90) {
        // Expiring within 90 days
        statusElement.className = 'certificate-status expiring';
        statusElement.innerHTML = '<i class="fas fa-exclamation-triangle"></i>';
        statusElement.title = `Expires in ${daysUntilExpiry} days`;
        expiryElement.classList.add('expiring');
      } else {
        // Active
        statusElement.className = 'certificate-status active';
        statusElement.innerHTML = '<i class="fas fa-check-circle"></i>';
        statusElement.title = 'Active Certificate';
        expiryElement.classList.remove('expiring', 'expired');
      }
    }
  });
}

function formatCertificateDate(dateString) {
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: '2-digit'
  });
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

  certificates.forEach(cert => {
    const status = cert.querySelector('.certificate-status').classList;
    let show = true;

    switch(filter) {
      case 'active':
        show = status.contains('active');
        break;
      case 'expiring':
        show = status.contains('expiring');
        break;
      case 'expired':
        show = status.contains('expired');
        break;
      case 'all':
      default:
        show = true;
        break;
    }

    cert.style.display = show ? 'block' : 'none';
  });
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
