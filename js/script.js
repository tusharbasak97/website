/* ============================== typing animation ============================ */
let typed = new Typed(".typing", {
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
/* ============================== Aside ============================ */
const nav = document.querySelector(".nav"),
  navList = nav.querySelectorAll("li"),
  totalNavList = navList.length,
  allSection = document.querySelectorAll(".section"),
  totalSection = allSection.length;
for (let i = 0; i < totalNavList; i++) {
  const a = navList[i].querySelector("a");

  // Hide URL from status bar for SPA navigation links
  const originalHref = a.href;
  a.addEventListener('mouseenter', function() {
    this.setAttribute('data-href', originalHref);
    this.removeAttribute('href');
  });

  a.addEventListener('mouseleave', function() {
    this.href = this.getAttribute('data-href');
    this.removeAttribute('data-href');
  });

  a.addEventListener("click", function (e) {
    // Restore href if needed for SPA navigation
    if (!this.href && this.getAttribute('data-href')) {
      this.href = this.getAttribute('data-href');
    }

    removeBackSection();
    for (let j = 0; j < totalNavList; j++) {
      if (navList[j].querySelector("a").classList.contains("active")) {
        addBackSection(j);
        allSection[j].classList.add("back-section");
      }
      navList[j].querySelector("a").classList.remove("active");
    }
    this.classList.add("active");
    showSection(this);
    if (window.innerWidth < 1200) {
      asideSectionTogglerBtn();
    }
  });

  // Handle keyboard navigation for SPA links
  a.addEventListener('keydown', function(e) {
    if (e.key === 'Enter' && !this.href && this.getAttribute('data-href')) {
      this.href = this.getAttribute('data-href');
    }
  });
}
function removeBackSection() {
  for (let i = 0; i < totalSection; i++) {
    allSection[i].classList.remove("back-section");
  }
}
function addBackSection(num) {
  allSection[num].classList.add("back-section");
}
function showSection(element) {
  for (let i = 0; i < totalSection; i++) {
    allSection[i].classList.remove("active");
  }
  const target = element.getAttribute("href").split("#")[1];
  document.querySelector("#" + target).classList.add("active");
}
function updateNav(element) {
  for (let i = 0; i < totalNavList; i++) {
    navList[i].querySelector("a").classList.remove("active");
    const target = element.getAttribute("href").split("#")[1];
    if (
      target ===
      navList[i].querySelector("a").getAttribute("href").split("#")[1]
    ) {
      navList[i].querySelector("a").classList.add("active");
    }
  }
}
// document.querySelector(".hire-me").addEventListener("click", function () {
//   const sectionIndex = this.getAttribute("data-section-index");
//   console.log(sectionIndex);
//   showSection(this);
//   updateNav(this);
//   removeBackSection();
//   addBackSection(sectionIndex);
// });
const navTogglerBtn = document.querySelector(".nav-toggler"),
  aside = document.querySelector(".aside");

navTogglerBtn.addEventListener("click", (e) => {
  e.stopPropagation(); // Prevent event bubbling

  // Add switching animation class
  navTogglerBtn.classList.add("switching");

  // Toggle the navigation after a short delay
  setTimeout(() => {
    asideSectionTogglerBtn();
  }, 400);

  // Remove switching class after animation completes
  setTimeout(() => {
    navTogglerBtn.classList.remove("switching");
  }, 800);
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

function closeMobileNavigation() {
  aside.classList.remove("open");
  navTogglerBtn.classList.remove("open");
  for (let i = 0; i < totalSection; i++) {
    allSection[i].classList.remove("open");
  }
}

/* ============================== Cursor Animation ============================ */
const cursor1 = document.querySelector(".cursor-1");
const cursor2 = document.querySelector(".cursor-2");

// Check if device supports custom cursor (desktop only)
function isDesktopDevice() {
  return window.innerWidth > 1024 && !('ontouchstart' in window || navigator.maxTouchPoints > 0);
}

function setCursorCoordinates(e) {
  if (!isDesktopDevice()) return;
  cursor1.style.top = e.pageY + "px";
  cursor1.style.left = e.pageX + "px";
  cursor2.style.top = e.pageY + "px";
  cursor2.style.left = e.pageX + "px";
}

function toggleCursorActivity() {
  if (!isDesktopDevice()) return;
  cursor1.classList.toggle("active");
  cursor2.classList.toggle("active");
}

// Only enable cursor functionality on desktop
if (isDesktopDevice()) {
  window.onmousemove = setCursorCoordinates;
}

// Handle window resize to enable/disable cursor functionality
window.addEventListener('resize', function() {
  if (isDesktopDevice()) {
    window.onmousemove = setCursorCoordinates;
    // Re-enable cursor hover effects for links
    document.querySelectorAll("a").forEach((links) => {
      if (!links.onmouseenter) {
        links.onmouseenter = toggleCursorActivity;
        links.onmouseleave = toggleCursorActivity;
      }
    });
  } else {
    window.onmousemove = null;
    // Remove cursor hover effects for links
    document.querySelectorAll("a").forEach((links) => {
      links.onmouseenter = null;
      links.onmouseleave = null;
    });
  }
});

document.querySelectorAll("a").forEach((links) => {
  // Only add cursor hover effects on desktop
  if (isDesktopDevice()) {
    links.onmouseenter = toggleCursorActivity;
    links.onmouseleave = toggleCursorActivity;
  }

  // Skip URL hiding for SPA navigation links as they're handled separately
  const isSpaNavLink = links.closest('.nav');
  if (!isSpaNavLink) {
    // Hide link URLs from status bar for non-SPA links
    const originalHref = links.href;
    links.addEventListener('mouseenter', function() {
      this.setAttribute('data-href', originalHref);
      this.removeAttribute('href');
    });

    links.addEventListener('mouseleave', function() {
      this.href = this.getAttribute('data-href');
      this.removeAttribute('data-href');
    });

    // Handle clicks properly
    links.addEventListener('click', function(e) {
      if (!this.href && this.getAttribute('data-href')) {
        this.href = this.getAttribute('data-href');
      }
    });

    // Handle keyboard navigation (Enter key)
    links.addEventListener('keydown', function(e) {
      if (e.key === 'Enter' && !this.href && this.getAttribute('data-href')) {
        this.href = this.getAttribute('data-href');
        this.click();
      }
    });
  }
});

/* ====================== Progress animation ====================== */

/* ============================== Age ============================ */
window.addEventListener("DOMContentLoaded", function () {
  var birthDate = new Date("1997-10-02");
  var ageElement = document.getElementById("age");

  function calculateAge() {
    var currentDate = new Date();

    var years = currentDate.getFullYear() - birthDate.getFullYear();
    var months = currentDate.getMonth() - birthDate.getMonth();

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

  setInterval(calculateAge, 1000 * 60 * 60 * 24);
});

/* ============================== Year ============================ */
document.addEventListener("DOMContentLoaded", (event) => {
  const yearElement = document.getElementById("current-year");
  const currentYear = new Date().getFullYear();
  yearElement.textContent = currentYear;
});

