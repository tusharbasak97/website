const styleSwitcherToggle = document.querySelector(".style-switcher-toggler");
const styleSwitcher = document.querySelector(".style-switcher");

styleSwitcherToggle.addEventListener("click", (event) => {
  event.stopPropagation();
  styleSwitcher.classList.toggle("open");
});

document.addEventListener("click", () => {
  if (styleSwitcher.classList.contains("open")) {
    styleSwitcher.classList.remove("open");
  }
});

styleSwitcher.addEventListener("click", (event) => {
  event.stopPropagation();
});

const alternateStyles = document.querySelectorAll(".alternative-style");
function setActiveStyle(color) {
  alternateStyles.forEach((style) => {
    if (color === style.getAttribute("title")) {
      style.removeAttribute("disabled");
    } else {
      style.setAttribute("disabled", "true");
    }
  });
}

const dayNight = document.querySelector(".day-night");
dayNight.addEventListener("click", () => {
  // Add switching animation class
  dayNight.classList.add("switching");

  // Toggle icons and dark mode after a short delay
  setTimeout(() => {
    dayNight.querySelector("i").classList.toggle("fa-sun");
    dayNight.querySelector("i").classList.toggle("fa-moon");
    document.body.classList.toggle("dark");
  }, 400);

  // Remove switching class after animation completes
  setTimeout(() => {
    dayNight.classList.remove("switching");
  }, 800);
});
window.addEventListener("load", () => {
  if (document.body.classList.contains("dark")) {
    dayNight.querySelector("i").classList.add("fa-sun");
  } else {
    dayNight.querySelector("i").classList.add("fa-moon");
  }
});
