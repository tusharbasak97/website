/* ============================== typing animation ============================ */
let typed = new Typed(".typing", {
  strings: [
    "Data Scientist",
    "Data Analyst",
    "Data Engineer",
    "BigData Engineer",
    "DataBase Administrator",
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
  a.addEventListener("click", function () {
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

/* ============================== Cursor Animation ============================ */
const cursor1 = document.querySelector(".cursor-1");
const cursor2 = document.querySelector(".cursor-2");
function setCursorCoordinates(e) {
  cursor1.style.top = e.pageY + "px";
  cursor1.style.left = e.pageX + "px";
  cursor2.style.top = e.pageY + "px";
  cursor2.style.left = e.pageX + "px";
}

window.onmousemove = setCursorCoordinates;

function toggleCursorActivity() {
  cursor1.classList.toggle("active");
  cursor2.classList.toggle("active");
}

document.querySelectorAll("a").forEach((links) => {
  links.onmouseenter = toggleCursorActivity;
  links.onmouseleave = toggleCursorActivity;
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
