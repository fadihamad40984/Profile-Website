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
toggleSwitch.addEventListener('click', () => {
  body.classList.toggle("dark");
  localStorage.setItem('darkMode', body.classList.contains('dark'));
});

if (localStorage.getItem('darkMode') === 'true') {
  body.classList.add('dark');
}

document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function (e) {
    e.preventDefault();
    document.querySelector(this.getAttribute('href')).scrollIntoView({
      behavior: 'smooth'
    });
  });
});

function navigateTo(url) {
  window.open(url, '_blank');
}

window.onscroll = function() { headerShadow() };
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
  backDelay: 2000
});


const sr = ScrollReveal({
  origin: 'top',
  distance: '80px',
  duration: 2000,
  reset: true
});

sr.reveal('.featured-text-card', {});
sr.reveal('.featured-name', { delay: 100 });
sr.reveal('.featured-text-info', { delay: 200 });
sr.reveal('.featured-text-btn', { delay: 200 });
sr.reveal('.social_icons', { delay: 200 });
sr.reveal('.featured-image', { delay: 300 });
sr.reveal('.project-box', { interval: 200 });
sr.reveal('.testimonial-box', { interval: 200 });
sr.reveal('.certificate-box', { interval: 200 });
sr.reveal('.top-header', {});
sr.reveal('#back-to-top', { delay: 500 });

const srLeft = ScrollReveal({
  origin: 'left',
  distance: '80px',
  duration: 2000,
  reset: true
});

srLeft.reveal('.about-info', { delay: 100 });
srLeft.reveal('.contact-info', { delay: 100 });

const srRight = ScrollReveal({
  origin: 'right',
  distance: '80px',
  duration: 2000,
  reset: true
});

srRight.reveal('.skills-box', { delay: 100 });
srRight.reveal('.form-control', { delay: 100 });

const sections = document.querySelectorAll('section[id]');
function scrollActive() {
  const scrollY = window.scrollY;
  sections.forEach(current => {
    const sectionHeight = current.offsetHeight,
      sectionTop = current.offsetTop - 50,
      sectionId = current.getAttribute('id');
    if (scrollY > sectionTop && scrollY <= sectionTop + sectionHeight) {
      document.querySelector('.nav-menu a[href*=' + sectionId + ']').classList.add('active-link');
    } else {
      document.querySelector('.nav-menu a[href*=' + sectionId + ']').classList.remove('active-link');
    }
  });
}
window.addEventListener('scroll', scrollActive);

document.addEventListener("DOMContentLoaded", function() {
  document.getElementById('year').textContent = new Date().getFullYear();
  (function() {
    // Initialize with your EmailJS public key
    emailjs.init("lqz2D9PwjMH72CcRY");

    // Contact form submission
    const contactForm = document.getElementById('contact-form');
    const formStatus = document.getElementById('form-status');

    if (contactForm) {
      contactForm.addEventListener('submit', function(event) {
        event.preventDefault();

        // Show loading state
        const submitBtn = contactForm.querySelector('button[type="submit"]');
        const originalBtnText = submitBtn.innerHTML;
        submitBtn.innerHTML = `<span class="code-brackets">&lt;</span><span class="code-text">Sending...</span><span class="code-brackets">/&gt;</span>`;
        submitBtn.disabled = true;

        // Send the email
        emailjs.sendForm('service_us2fyzf', 'template_gru51ti', this)
          .then(function() {
            // Success message
            formStatus.textContent = '// Message sent successfully!';
            formStatus.className = 'form-status success';

            // Reset form
            contactForm.reset();

            // Reset button after 2 seconds
            setTimeout(() => {
              submitBtn.innerHTML = originalBtnText;
              submitBtn.disabled = false;

              // Hide success message after 5 seconds
              setTimeout(() => {
                formStatus.className = 'form-status';
              }, 5000);
            }, 2000);
          }, function(error) {
            // Error message
            console.error('EmailJS error:', error);
            formStatus.textContent = '/* Error: ' + (error.text || 'Failed to send message') + ' */';
            formStatus.className = 'form-status error';

            // Reset button
            setTimeout(() => {
              submitBtn.innerHTML = originalBtnText;
              submitBtn.disabled = false;

              // Hide error message after 5 seconds
              setTimeout(() => {
                formStatus.className = 'form-status';
              }, 5000);
            }, 2000);
          });
      });
    }
  })();

  // Add smooth transitions
  document.body.style.transition = 'background-color 0.5s ease, color 0.5s ease';

  // Initialize 3D background with code-themed particles
  if (typeof VANTA !== 'undefined') {
    const isDarkMode = document.body.classList.contains('dark');
    const bgColor = isDarkMode ? 0x0a0a0a : 0xf5f5f5;
    const pointColor = isDarkMode ? 0x50fa7b : 0x50fa7b; // Green code color

    VANTA.NET({
      el: "#vanta-background",
      mouseControls: true,
      touchControls: true,
      gyroControls: false,
      minHeight: 200.00,
      minWidth: 200.00,
      scale: 1.00,
      scaleMobile: 1.00,
      color: pointColor,
      backgroundColor: bgColor,
      points: 15,
      maxDistance: 20.00,
      spacing: 15.00,
      showDots: true
    });

    // Add floating code elements to the background
    const vantaBackground = document.getElementById('vanta-background');
    const codeElements = ['{', '}', '()', '=>', '[]', '<>', '&&', '||', '==', '!=', '+=', '/*', '*/', '//'];

    for (let i = 0; i < 20; i++) {
      const codeEl = document.createElement('div');
      codeEl.className = 'floating-code';
      codeEl.textContent = codeElements[Math.floor(Math.random() * codeElements.length)];
      codeEl.style.left = `${Math.random() * 100}%`;
      codeEl.style.top = `${Math.random() * 100}%`;
      codeEl.style.animationDuration = `${Math.random() * 10 + 10}s`;
      codeEl.style.animationDelay = `${Math.random() * 5}s`;
      codeEl.style.opacity = `${Math.random() * 0.5 + 0.1}`;
      vantaBackground.appendChild(codeEl);
    }

    // Update background on theme change
    document.getElementById('toggle-switch').addEventListener('click', () => {
      setTimeout(() => {
        const isDarkMode = document.body.classList.contains('dark');
        const bgColor = isDarkMode ? 0x0a0a0a : 0xf5f5f5;
        const pointColor = isDarkMode ? 0x3a3aff : 0x6e57e0;

        if (typeof VANTA.NET.updateColor === 'function') {
          VANTA.NET.updateColor(pointColor);
          VANTA.NET.updateBackgroundColor(bgColor);
        }
      }, 100);
    });
  }

  // Initialize 3D tilt effect
  if (typeof VanillaTilt !== 'undefined') {
    VanillaTilt.init(document.querySelectorAll(".tilt-effect"), {
      max: 15,
      speed: 400,
      glare: true,
      "max-glare": 0.2,
    });

    // Add interactive 3D effect to laptop
    const laptop = document.querySelector('.laptop');
    if (laptop) {
      // Add mouse move event to rotate laptop
      document.querySelector('.laptop-wrapper').addEventListener('mousemove', function(e) {
        const rect = this.getBoundingClientRect();
        const x = e.clientX - rect.left; // x position within the element
        const y = e.clientY - rect.top;  // y position within the element

        // Calculate rotation based on mouse position
        const rotateY = ((x / rect.width) - 0.5) * 20; // -10 to 10 degrees
        const rotateX = ((y / rect.height) - 0.5) * -20; // 10 to -10 degrees

        // Apply rotation
        laptop.style.transform = `rotateX(${rotateX}deg) rotateY(${rotateY}deg) rotateZ(0deg)`;
      });

      // Reset rotation when mouse leaves
      document.querySelector('.laptop-wrapper').addEventListener('mouseleave', function() {
        laptop.style.transform = 'rotateX(10deg) rotateY(0deg) rotateZ(0deg)';
      });

      // Add typing animation to laptop keys
      const keys = document.querySelector('.laptop-keys');
      if (keys) {
        setInterval(() => {
          const randomKey = document.createElement('div');
          randomKey.className = 'key-press';
          randomKey.style.gridColumn = Math.floor(Math.random() * 14) + 1;
          randomKey.style.gridRow = Math.floor(Math.random() * 4) + 1;
          randomKey.style.background = 'rgba(255, 255, 255, 0.5)';
          randomKey.style.borderRadius = '2px';
          keys.appendChild(randomKey);

          // Remove key press effect after animation
          setTimeout(() => {
            randomKey.remove();
          }, 300);
        }, 500);
      }
    }
  }

  // Initialize particles
  if (typeof particlesJS !== 'undefined') {
    particlesJS("particles-js", {
      "particles": {
        "number": {
          "value": 80,
          "density": {
            "enable": true,
            "value_area": 800
          }
        },
        "color": {
          "value": "#6e57e0"
        },
        "shape": {
          "type": "circle",
          "stroke": {
            "width": 0,
            "color": "#000000"
          },
          "polygon": {
            "nb_sides": 5
          }
        },
        "opacity": {
          "value": 0.5,
          "random": false,
          "anim": {
            "enable": false,
            "speed": 1,
            "opacity_min": 0.1,
            "sync": false
          }
        },
        "size": {
          "value": 3,
          "random": true,
          "anim": {
            "enable": false,
            "speed": 40,
            "size_min": 0.1,
            "sync": false
          }
        },
        "line_linked": {
          "enable": true,
          "distance": 150,
          "color": "#6e57e0",
          "opacity": 0.4,
          "width": 1
        },
        "move": {
          "enable": true,
          "speed": 3,
          "direction": "none",
          "random": false,
          "straight": false,
          "out_mode": "out",
          "bounce": false,
          "attract": {
            "enable": false,
            "rotateX": 600,
            "rotateY": 1200
          }
        }
      },
      "interactivity": {
        "detect_on": "canvas",
        "events": {
          "onhover": {
            "enable": true,
            "mode": "grab"
          },
          "onclick": {
            "enable": true,
            "mode": "push"
          },
          "resize": true
        },
        "modes": {
          "grab": {
            "distance": 140,
            "line_linked": {
              "opacity": 1
            }
          },
          "bubble": {
            "distance": 400,
            "size": 40,
            "duration": 2,
            "opacity": 8,
            "speed": 3
          },
          "repulse": {
            "distance": 200,
            "duration": 0.4
          },
          "push": {
            "particles_nb": 4
          },
          "remove": {
            "particles_nb": 2
          }
        }
      },
      "retina_detect": true
    });

    // Update particles color on theme change
    document.getElementById('toggle-switch').addEventListener('click', () => {
      setTimeout(() => {
        const isDarkMode = document.body.classList.contains('dark');
        const particleColor = isDarkMode ? "#7c4dff" : "#6e57e0";

        if (typeof pJSDom !== 'undefined' && pJSDom.length > 0) {
          pJSDom[0].pJS.particles.color.value = particleColor;
          pJSDom[0].pJS.particles.line_linked.color = particleColor;
          pJSDom[0].pJS.fn.particlesRefresh();
        }
      }, 100);
    });
  }

  // Handle preloader
  const preloader = document.getElementById('preloader');
  if (preloader) {
    window.addEventListener('load', () => {
      preloader.style.opacity = '0';
      setTimeout(() => {
        preloader.style.display = 'none';
      }, 500);
    });

    // If window already loaded, hide preloader
    if (document.readyState === 'complete') {
      preloader.style.opacity = '0';
      setTimeout(() => {
        preloader.style.display = 'none';
      }, 500);
    }
  }

  // Back to top button functionality
  const backToTopButton = document.getElementById('back-to-top');
  if (backToTopButton) {
    window.addEventListener('scroll', () => {
      if (window.scrollY > 300) {
        backToTopButton.classList.add('visible');
      } else {
        backToTopButton.classList.remove('visible');
      }
    });

    backToTopButton.addEventListener('click', () => {
      window.scrollTo({
        top: 0,
        behavior: 'smooth'
      });
    });
  }

  // Animate skill progress bars when they come into view
  const progressBars = document.querySelectorAll('.progress');
  const animateProgress = () => {
    progressBars.forEach(bar => {
      const rect = bar.getBoundingClientRect();
      const isInView = rect.top <= window.innerHeight && rect.bottom >= 0;

      if (isInView && !bar.classList.contains('animated')) {
        bar.classList.add('animated');
        bar.style.width = bar.style.width; // Trigger animation
      }
    });
  };

  window.addEventListener('scroll', animateProgress);
  animateProgress(); // Initial check

  // Button hover effects
  const buttons = document.querySelectorAll('.btn');
  buttons.forEach(button => {
    button.addEventListener('mouseover', () => {
      button.style.transform = 'scale(1.05)';
      button.style.transition = 'transform 0.3s ease';
    });
    button.addEventListener('mouseout', () => {
      button.style.transform = 'scale(1)';
    });
  });

  // Navigation link hover effects
  const links = document.querySelectorAll('.nav-menu a, .footer-menu a');
  links.forEach(link => {
    link.addEventListener('mouseover', () => {
      link.style.color = 'var(--first-color)';
      link.style.transition = 'color 0.3s ease';
    });
    link.addEventListener('mouseout', () => {
      if (!link.classList.contains('active-link')) {
        link.style.color = '';
      }
    });
  });
});