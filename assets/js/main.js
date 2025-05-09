function myMenuFunction() {
  var menuBtn = document.getElementById("myNavMenu");
  if (menuBtn.className === "nav-menu") {
    menuBtn.className += " responsive";
  } else {
    menuBtn.className = "nav-menu";
  }
}

const body = document.querySelector("body"),
  toggleSwitch = document.getElementById("toggle-switch");

toggleSwitch.addEventListener("click", () => {
  const flash = document.createElement("div");
  flash.style.position = "fixed";
  flash.style.top = "0";
  flash.style.left = "0";
  flash.style.width = "100%";
  flash.style.height = "100%";
  flash.style.backgroundColor = body.classList.contains("dark")
    ? "rgba(255, 255, 255, 0.1)"
    : "rgba(0, 0, 0, 0.1)";
  flash.style.zIndex = "9999";
  flash.style.pointerEvents = "none";
  flash.style.opacity = "0";
  flash.style.transition = "opacity 0.3s ease";
  document.body.appendChild(flash);

  setTimeout(() => {
    flash.style.opacity = "1";

    setTimeout(() => {
      body.classList.toggle("dark");
      localStorage.setItem("darkMode", body.classList.contains("dark"));

      flash.style.opacity = "0";
      setTimeout(() => {
        document.body.removeChild(flash);
      }, 300);
    }, 50);
  }, 0);

  const rect = toggleSwitch.getBoundingClientRect();
  const ripple = document.createElement("div");
  ripple.style.position = "fixed";
  ripple.style.top = `${rect.top + rect.height / 2}px`;
  ripple.style.left = `${rect.left + rect.width / 2}px`;
  ripple.style.width = "0";
  ripple.style.height = "0";
  ripple.style.borderRadius = "50%";
  ripple.style.backgroundColor = body.classList.contains("dark")
    ? "rgba(255, 255, 255, 0.2)"
    : "rgba(0, 0, 0, 0.2)";
  ripple.style.transform = "translate(-50%, -50%)";
  ripple.style.zIndex = "9998";
  ripple.style.pointerEvents = "none";
  ripple.style.transition = "all 0.6s cubic-bezier(0.4, 0, 0.2, 1)";
  document.body.appendChild(ripple);

  setTimeout(() => {
    ripple.style.width = "300px";
    ripple.style.height = "300px";
    ripple.style.opacity = "0";

    setTimeout(() => {
      document.body.removeChild(ripple);
    }, 600);
  }, 0);
});

if (localStorage.getItem("darkMode") === "true") {
  body.classList.add("dark");
}

document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
  anchor.addEventListener("click", function (e) {
    e.preventDefault();
    document.querySelector(this.getAttribute("href")).scrollIntoView({
      behavior: "smooth",
    });
  });
});

function navigateTo(url) {
  window.open(url, "_blank");
}

window.onscroll = function () {
  headerShadow();
};
function headerShadow() {
  const navHeader = document.getElementById("header");
  if (document.body.scrollTop > 50 || document.documentElement.scrollTop > 50) {
    navHeader.style.boxShadow = "0 4px 10px rgba(0, 0, 0, 0.15)";
    navHeader.style.height = "70px";
    navHeader.style.lineHeight = "70px";
  } else {
    navHeader.style.boxShadow = "none";
    navHeader.style.height = "90px";
    navHeader.style.lineHeight = "90px";
  }
}

var typingEffect = new Typed(".typedText", {
  strings: ["Developer", "Programmer", "Engineer"],
  loop: true,
  typeSpeed: 100,
  backSpeed: 80,
  backDelay: 2000,
});

const sr = ScrollReveal({
  origin: "top",
  distance: "80px",
  duration: 2000,
  reset: true,
});

sr.reveal(".featured-text-card", {});
sr.reveal(".featured-name", { delay: 100 });
sr.reveal(".featured-text-info", { delay: 200 });
sr.reveal(".featured-text-btn", { delay: 200 });
sr.reveal(".social_icons", { delay: 200 });
sr.reveal(".featured-image", { delay: 300 });
sr.reveal(".project-box", { interval: 200 });
sr.reveal(".testimonial-box", { interval: 200 });
sr.reveal(".certificate-box", { interval: 200 });
sr.reveal(".top-header", {});
sr.reveal("#back-to-top", { delay: 500 });

const srLeft = ScrollReveal({
  origin: "left",
  distance: "80px",
  duration: 2000,
  reset: true,
});

srLeft.reveal(".about-info", { delay: 100 });
srLeft.reveal(".contact-info", { delay: 100 });

const srRight = ScrollReveal({
  origin: "right",
  distance: "80px",
  duration: 2000,
  reset: true,
});

srRight.reveal(".skills-box", { delay: 100 });
srRight.reveal(".form-control", { delay: 100 });

const sections = document.querySelectorAll("section[id]");
function scrollActive() {
  const scrollY = window.scrollY;
  sections.forEach((current) => {
    const sectionHeight = current.offsetHeight,
      sectionTop = current.offsetTop - 50,
      sectionId = current.getAttribute("id");
    if (scrollY > sectionTop && scrollY <= sectionTop + sectionHeight) {
      document
        .querySelector(".nav-menu a[href*=" + sectionId + "]")
        .classList.add("active-link");
    } else {
      document
        .querySelector(".nav-menu a[href*=" + sectionId + "]")
        .classList.remove("active-link");
    }
  });
}
window.addEventListener("scroll", scrollActive);

document.addEventListener("DOMContentLoaded", function () {
  document.getElementById("year").textContent = new Date().getFullYear();
  (function () {
    emailjs.init("lqz2D9PwjMH72CcRY");

    const contactForm = document.getElementById("contact-form");
    const formStatus = document.getElementById("form-status");

    if (contactForm) {
      contactForm.addEventListener("submit", function (event) {
        event.preventDefault();

        const submitBtn = contactForm.querySelector('button[type="submit"]');
        const originalBtnText = submitBtn.innerHTML;
        submitBtn.innerHTML = `<span class="code-brackets">&lt;</span><span class="code-text">Sending...</span><span class="code-brackets">/&gt;</span>`;
        submitBtn.disabled = true;

        emailjs.sendForm("service_us2fyzf", "template_gru51ti", this).then(
          function () {
            formStatus.textContent = "// Message sent successfully!";
            formStatus.className = "form-status success";

            contactForm.reset();

            setTimeout(() => {
              submitBtn.innerHTML = originalBtnText;
              submitBtn.disabled = false;

              setTimeout(() => {
                formStatus.className = "form-status";
              }, 5000);
            }, 2000);
          },
          function (error) {
            console.error("EmailJS error:", error);
            formStatus.textContent =
              "/* Error: " + (error.text || "Failed to send message") + " */";
            formStatus.className = "form-status error";

            setTimeout(() => {
              submitBtn.innerHTML = originalBtnText;
              submitBtn.disabled = false;

              setTimeout(() => {
                formStatus.className = "form-status";
              }, 5000);
            }, 2000);
          }
        );
      });
    }
  })();

  document.body.style.transition =
    "background-color 0.5s ease, color 0.5s ease";

  if (typeof VANTA !== "undefined") {
    const isDarkMode = document.body.classList.contains("dark");
    const bgColor = isDarkMode ? 0x0a0a0a : 0xf5f5f5;
    const pointColor = isDarkMode ? 0x50fa7b : 0x50fa7b;

    VANTA.NET({
      el: "#vanta-background",
      mouseControls: true,
      touchControls: true,
      gyroControls: false,
      minHeight: 200.0,
      minWidth: 200.0,
      scale: 1.0,
      scaleMobile: 1.0,
      color: pointColor,
      backgroundColor: bgColor,
      points: 15,
      maxDistance: 20.0,
      spacing: 15.0,
      showDots: true,
    });

    const vantaBackground = document.getElementById("vanta-background");
    const codeElements = [
      "{",
      "}",
      "()",
      "=>",
      "[]",
      "<>",
      "&&",
      "||",
      "==",
      "!=",
      "+=",
      "/*",
      "*/",
      "//",
    ];

    for (let i = 0; i < 20; i++) {
      const codeEl = document.createElement("div");
      codeEl.className = "floating-code";
      codeEl.textContent =
        codeElements[Math.floor(Math.random() * codeElements.length)];
      codeEl.style.left = `${Math.random() * 100}%`;
      codeEl.style.top = `${Math.random() * 100}%`;
      codeEl.style.animationDuration = `${Math.random() * 10 + 10}s`;
      codeEl.style.animationDelay = `${Math.random() * 5}s`;
      codeEl.style.opacity = `${Math.random() * 0.5 + 0.1}`;
      vantaBackground.appendChild(codeEl);
    }

    document.getElementById("toggle-switch").addEventListener("click", () => {
      setTimeout(() => {
        const isDarkMode = document.body.classList.contains("dark");
        const bgColor = isDarkMode ? 0x0a0a0a : 0xf5f5f5;
        const pointColor = isDarkMode ? 0x3a3aff : 0x6e57e0;

        if (typeof VANTA.NET.updateColor === "function") {
          VANTA.NET.updateColor(pointColor);
          VANTA.NET.updateBackgroundColor(bgColor);
        }
      }, 100);
    });
  }

  if (typeof VanillaTilt !== "undefined") {
    VanillaTilt.init(document.querySelectorAll(".tilt-effect"), {
      max: 15,
      speed: 400,
      glare: true,
      "max-glare": 0.2,
    });

    const laptop = document.querySelector(".laptop");
    if (laptop) {
      document
        .querySelector(".laptop-wrapper")
        .addEventListener("mousemove", function (e) {
          const rect = this.getBoundingClientRect();
          const x = e.clientX - rect.left;
          const y = e.clientY - rect.top;

          const rotateY = (x / rect.width - 0.5) * 20;
          const rotateX = (y / rect.height - 0.5) * -20;

          laptop.style.transform = `rotateX(${rotateX}deg) rotateY(${rotateY}deg) rotateZ(0deg)`;
        });

      document
        .querySelector(".laptop-wrapper")
        .addEventListener("mouseleave", function () {
          laptop.style.transform = "rotateX(10deg) rotateY(0deg) rotateZ(0deg)";
        });

      const keys = document.querySelector(".laptop-keys");
      if (keys) {
        setInterval(() => {
          const randomKey = document.createElement("div");
          randomKey.className = "key-press";
          randomKey.style.gridColumn = Math.floor(Math.random() * 14) + 1;
          randomKey.style.gridRow = Math.floor(Math.random() * 4) + 1;
          randomKey.style.background = "rgba(255, 255, 255, 0.5)";
          randomKey.style.borderRadius = "2px";
          keys.appendChild(randomKey);

          setTimeout(() => {
            randomKey.remove();
          }, 300);
        }, 500);
      }
    }
  }

  if (typeof particlesJS !== "undefined") {
    particlesJS("particles-js", {
      particles: {
        number: {
          value: 80,
          density: {
            enable: true,
            value_area: 800,
          },
        },
        color: {
          value: "#6e57e0",
        },
        shape: {
          type: "circle",
          stroke: {
            width: 0,
            color: "#000000",
          },
          polygon: {
            nb_sides: 5,
          },
        },
        opacity: {
          value: 0.5,
          random: false,
          anim: {
            enable: false,
            speed: 1,
            opacity_min: 0.1,
            sync: false,
          },
        },
        size: {
          value: 3,
          random: true,
          anim: {
            enable: false,
            speed: 40,
            size_min: 0.1,
            sync: false,
          },
        },
        line_linked: {
          enable: true,
          distance: 150,
          color: "#6e57e0",
          opacity: 0.4,
          width: 1,
        },
        move: {
          enable: true,
          speed: 3,
          direction: "none",
          random: false,
          straight: false,
          out_mode: "out",
          bounce: false,
          attract: {
            enable: false,
            rotateX: 600,
            rotateY: 1200,
          },
        },
      },
      interactivity: {
        detect_on: "canvas",
        events: {
          onhover: {
            enable: true,
            mode: "grab",
          },
          onclick: {
            enable: true,
            mode: "push",
          },
          resize: true,
        },
        modes: {
          grab: {
            distance: 140,
            line_linked: {
              opacity: 1,
            },
          },
          bubble: {
            distance: 400,
            size: 40,
            duration: 2,
            opacity: 8,
            speed: 3,
          },
          repulse: {
            distance: 200,
            duration: 0.4,
          },
          push: {
            particles_nb: 4,
          },
          remove: {
            particles_nb: 2,
          },
        },
      },
      retina_detect: true,
    });

    document.getElementById("toggle-switch").addEventListener("click", () => {
      setTimeout(() => {
        const isDarkMode = document.body.classList.contains("dark");
        const particleColor = isDarkMode ? "#7c4dff" : "#6e57e0";

        if (typeof pJSDom !== "undefined" && pJSDom.length > 0) {
          pJSDom[0].pJS.particles.color.value = particleColor;
          pJSDom[0].pJS.particles.line_linked.color = particleColor;
          pJSDom[0].pJS.fn.particlesRefresh();
        }
      }, 100);
    });
  }

  const preloader = document.getElementById("preloader");
  if (preloader) {
    window.addEventListener("load", () => {
      preloader.style.opacity = "0";
      setTimeout(() => {
        preloader.style.display = "none";
      }, 500);
    });

    if (document.readyState === "complete") {
      preloader.style.opacity = "0";
      setTimeout(() => {
        preloader.style.display = "none";
      }, 500);
    }
  }

  const backToTopButton = document.getElementById("back-to-top");
  if (backToTopButton) {
    window.addEventListener("scroll", () => {
      if (window.scrollY > 300) {
        backToTopButton.classList.add("visible");
      } else {
        backToTopButton.classList.remove("visible");
      }
    });

    backToTopButton.addEventListener("click", () => {
      window.scrollTo({
        top: 0,
        behavior: "smooth",
      });
    });
  }

  const progressBars = document.querySelectorAll(".progress");
  const animateProgress = () => {
    progressBars.forEach((bar) => {
      const rect = bar.getBoundingClientRect();
      const isInView = rect.top <= window.innerHeight && rect.bottom >= 0;

      if (isInView && !bar.classList.contains("animated")) {
        bar.classList.add("animated");
        bar.style.width = bar.style.width;
      }
    });
  };

  window.addEventListener("scroll", animateProgress);
  animateProgress();

  const addCursorSpotlight = () => {
    const spotlight = document.createElement("div");
    spotlight.classList.add("cursor-spotlight");
    document.body.appendChild(spotlight);

    document.addEventListener("mousemove", (e) => {
      spotlight.style.left = `${e.clientX}px`;
      spotlight.style.top = `${e.clientY}px`;
    });

    const style = document.createElement("style");
    style.textContent = `
      .cursor-spotlight {
        position: fixed;
        width: 300px;
        height: 300px;
        border-radius: 50%;
        background: radial-gradient(circle, rgba(110, 87, 224, 0.1) 0%, rgba(110, 87, 224, 0) 70%);
        transform: translate(-50%, -50%);
        pointer-events: none;
        z-index: 9999;
        opacity: 0;
        transition: opacity 0.3s ease;
      }
      body:hover .cursor-spotlight {
        opacity: 1;
      }
    `;
    document.head.appendChild(style);
  };

  if (window.innerWidth > 768) {
    addCursorSpotlight();
  }

  const formInputs = document.querySelectorAll("input, textarea");
  formInputs.forEach((input) => {
    input.addEventListener("focus", () => {
      input.parentElement.classList.add("input-focused");
    });
    input.addEventListener("blur", () => {
      input.parentElement.classList.remove("input-focused");
    });
  });

  const inputFocusStyle = document.createElement("style");
  inputFocusStyle.textContent = `
    .input-focused {
      transform: scale(1.02);
      transition: transform 0.3s ease;
    }
  `;
  document.head.appendChild(inputFocusStyle);

  const animateSections = () => {
    const sections = document.querySelectorAll("section");
    sections.forEach((section) => {
      const rect = section.getBoundingClientRect();
      const isInView = rect.top <= window.innerHeight * 0.75;

      if (isInView) {
        section.classList.add("section-visible");
      }
    });
  };

  const sectionAnimStyle = document.createElement("style");
  sectionAnimStyle.textContent = `
    section {
      opacity: 0.8;
      transform: translateY(20px);
      transition: opacity 0.6s ease, transform 0.6s ease;
    }
    section.section-visible {
      opacity: 1;
      transform: translateY(0);
    }
  `;
  document.head.appendChild(sectionAnimStyle);

  window.addEventListener("scroll", animateSections);
  animateSections();

  const buttons = document.querySelectorAll(".btn");
  buttons.forEach((button) => {
    button.addEventListener("click", function (e) {
      const rect = button.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;

      const ripple = document.createElement("span");
      ripple.classList.add("btn-ripple");
      ripple.style.left = `${x}px`;
      ripple.style.top = `${y}px`;

      button.appendChild(ripple);

      setTimeout(() => {
        ripple.remove();
      }, 600);
    });
  });

  const rippleStyle = document.createElement("style");
  rippleStyle.textContent = `
    .btn {
      position: relative;
      overflow: hidden;
    }
    .btn-ripple {
      position: absolute;
      background: rgba(255, 255, 255, 0.5);
      border-radius: 50%;
      transform: scale(0);
      animation: ripple 0.6s linear;
      pointer-events: none;
    }
    @keyframes ripple {
      to {
        transform: scale(4);
        opacity: 0;
      }
    }
  `;
  document.head.appendChild(rippleStyle);

  const links = document.querySelectorAll(".nav-menu a, .footer-menu a");
  links.forEach((link) => {
    link.addEventListener("mouseover", () => {
      link.style.color = "var(--first-color)";
      link.style.transition = "all 0.3s cubic-bezier(0.68, -0.55, 0.27, 1.55)";
      link.style.transform = "translateY(-3px)";
    });
    link.addEventListener("mouseout", () => {
      if (!link.classList.contains("active-link")) {
        link.style.color = "";
      }
      link.style.transform = "translateY(0)";
    });
  });

  const addTextHighlightEffect = () => {
    const headings = document.querySelectorAll("h1, h2, h3");

    headings.forEach((heading) => {
      if (
        heading.closest(".code-terminal") ||
        heading.closest(".mini-site-header")
      ) {
        return;
      }

      const wrapper = document.createElement("span");
      wrapper.classList.add("highlight-text-wrapper");
      wrapper.innerHTML = heading.innerHTML;
      heading.innerHTML = "";
      heading.appendChild(wrapper);

      heading.addEventListener("mouseover", () => {
        wrapper.classList.add("highlight-text-active");
      });

      heading.addEventListener("mouseout", () => {
        wrapper.classList.remove("highlight-text-active");
      });
    });

    const highlightStyle = document.createElement("style");
    highlightStyle.textContent = `
      .highlight-text-wrapper {
        position: relative;
        display: inline-block;
        transition: all 0.3s ease;
      }

      .highlight-text-wrapper::after {
        content: '';
        position: absolute;
        bottom: 0;
        left: 0;
        width: 0;
        height: 30%;
        background-color: rgba(110, 87, 224, 0.2);
        z-index: -1;
        transition: width 0.3s ease;
      }

      .highlight-text-active::after {
        width: 100%;
      }
    `;
    document.head.appendChild(highlightStyle);
  };

  addTextHighlightEffect();
});
