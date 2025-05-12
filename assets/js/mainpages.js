document.addEventListener("DOMContentLoaded", function () {
  function toggleMobileMenu() {
    const menu = document.getElementById("myNavMenu");
    menu.classList.toggle("responsive");
    const icon = document.querySelector(".nav-menu-btn i");

    // Toggle between bars and close icon
    if (menu.classList.contains("responsive")) {
      icon.classList.remove("uil-bars");
      icon.classList.add("uil-times");
    } else {
      icon.classList.remove("uil-times");
      icon.classList.add("uil-bars");
    }

    icon.setAttribute("aria-expanded", menu.classList.contains("responsive"));

    // Prevent body scrolling when menu is open
    if (menu.classList.contains("responsive")) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
  }

  document
    .querySelector(".nav-menu-btn")
    .addEventListener("click", toggleMobileMenu);

  // Close menu when clicking on a link
  document.querySelectorAll(".nav_menu_list a").forEach((link) => {
    link.addEventListener("click", function () {
      if (window.innerWidth <= 768) {
        toggleMobileMenu();
      }
    });
  });

  // Close menu when clicking outside
  document.addEventListener("click", function(event) {
    const menu = document.getElementById("myNavMenu");
    const menuBtn = document.querySelector(".nav-menu-btn");

    if (menu.classList.contains("responsive") &&
        !menu.contains(event.target) &&
        !menuBtn.contains(event.target)) {
      toggleMobileMenu();
    }
  });

  const darkModeToggle = document.getElementById("toggle-switch");
  const body = document.body;

  function toggleDarkMode() {
    body.classList.toggle("dark");
    localStorage.setItem("darkMode", body.classList.contains("dark"));
    updateDarkModeIcon();
  }

  function updateDarkModeIcon() {
    const isDark = body.classList.contains("dark");
    darkModeToggle.setAttribute(
      "aria-label",
      isDark ? "Switch to light mode" : "Switch to dark mode"
    );
  }

  darkModeToggle.addEventListener("click", toggleDarkMode);

  if (localStorage.getItem("darkMode") === "true") {
    body.classList.add("dark");
    updateDarkModeIcon();
  }

  document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener("click", function (e) {
      e.preventDefault();

      const targetId = this.getAttribute("href");
      const targetElement = document.querySelector(targetId);

      if (targetElement) {
        window.scrollTo({
          top: targetElement.offsetTop - 80,
          behavior: "smooth",
        });

        if (history.pushState) {
          history.pushState(null, null, targetId);
        }
      }
    });
  });

  function handleExternalLinks(event) {
    const url =
      this.getAttribute("data-url") ||
      this.getAttribute("onclick").match(/'([^']+)'/)[1];
    if (url) {
      event.preventDefault();
      window.open(url, "_blank", "noopener,noreferrer");
      console.log(`External link clicked: ${url}`);
    }
  }

  document.querySelectorAll('[onclick^="navigateTo"]').forEach((link) => {
    link.addEventListener("click", handleExternalLinks);
  });

  function updateHeaderOnScroll() {
    const header = document.getElementById("header");
    if (window.scrollY > 50) {
      header.style.boxShadow = "0 4px 10px rgba(0, 0, 0, 0.15)";
      header.style.height = "70px";
      header.style.lineHeight = "70px";
    } else {
      header.style.boxShadow = "none";
      header.style.height = "90px";
      header.style.lineHeight = "90px";
    }
  }

  window.addEventListener("scroll", updateHeaderOnScroll);
  updateHeaderOnScroll(); // Initialize

  document.getElementById("year").textContent = new Date().getFullYear();

  document.querySelectorAll(".project-screenshot").forEach((img) => {
    img.addEventListener("click", function () {
      this.classList.toggle("zoomed");
    });
  });

  document.querySelectorAll(".btn").forEach((button) => {
    button.addEventListener("mouseenter", function () {
      this.style.transform = "translateY(-2px)";
      this.style.boxShadow = "0 6px 12px rgba(0, 0, 0, 0.15)";
    });

    button.addEventListener("mouseleave", function () {
      this.style.transform = "";
      this.style.boxShadow = "";
    });
  });

  setTimeout(() => {
    const projectContent = document.querySelector(".project-content");
    if (projectContent) {
      projectContent.style.opacity = "1";
      projectContent.style.transform = "translateY(0)";
    }
  }, 300);

  if (typeof VanillaTilt !== "undefined") {
    VanillaTilt.init(document.querySelectorAll(".tilt-effect"), {
      max: 15,
      speed: 400,
      glare: true,
      "max-glare": 0.3,
      scale: 1.05,
    });
  }
});

function navigateTo(url) {
  window.open(url, "_blank", "noopener,noreferrer");
}
