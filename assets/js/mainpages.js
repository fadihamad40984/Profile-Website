/* document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function (e) {
      e.preventDefault();
      document.querySelector(this.getAttribute('href')).scrollIntoView({
          behavior: 'smooth',
          block: 'start'
      });
  });
});

function navigateTo(url) {
  window.open(url, '_blank');
}

const navMenu = document.getElementById('myNavMenu');
const navToggle = document.createElement('div');
navToggle.className = 'nav-toggle';
navToggle.innerHTML = '<i class="uil uil-bars"></i>';
document.querySelector('nav').appendChild(navToggle);

navToggle.addEventListener('click', () => {
  navMenu.classList.toggle('active');
});

window.addEventListener('resize', () => {
  if (window.innerWidth > 768) {
      navMenu.classList.remove('active');
  }
});
 */


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

});

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


window.onscroll = function () { headerShadow() };

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
  strings: ["Developer"],
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
sr.reveal('.top-header', {});

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
document.addEventListener("DOMContentLoaded", function () {
  document.body.style.transition = 'background-color 0.5s ease, color 0.5s ease';

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

  const links = document.querySelectorAll('.nav-menu a');
  links.forEach(link => {
    link.addEventListener('mouseover', () => {
      link.style.color = '#007bff';
      link.style.transition = 'color 0.3s ease';
    });
    link.addEventListener('mouseout', () => {
      link.style.color = '';
    });
  });
});
