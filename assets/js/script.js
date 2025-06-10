document.addEventListener("DOMContentLoaded", () => {
  AOS.init();

  // Initialize stars animation
  initStarsAnimation();

  // Initialize shooting stars
  initShootingStars();

  // Initialize smooth scrolling for navigation links
  initSmoothScrolling();

  // Initialize carousel
  initCarousel();

  // Initialize typewriter effect for "HOME"
  typeEffect();

  // Initialize typewriter effect for "ABOUT"
  initAboutTypewriter();
});

// Hamburger menu functions
function hamburg() {
  const navbar = document.querySelector(".dropdown");
  navbar.style.transform = "translateY(0px)";
}

function cancel() {
  const navbar = document.querySelector(".dropdown");
  navbar.style.transform = "translateY(-1000px)";
}

// Typewriter effect - HOME
const texts = ["Video Editor", "Graphics Designer", "Web Developer"];
let count = 0;
let index = 0;
let isDeleting = false;
const speed = 150;
const pause = 2000;

function typeEffect() {
  const span = document.getElementById("typing-text");
  const currentText = texts[count];

  span.textContent = isDeleting
    ? currentText.substring(0, index--)
    : currentText.substring(0, index++);

  if (!isDeleting && index === currentText.length + 1) {
    isDeleting = true;
    setTimeout(typeEffect, pause);
  } else if (isDeleting && index === 0) {
    isDeleting = false;
    count = (count + 1) % texts.length;
    setTimeout(typeEffect, 300);
  } else {
    setTimeout(typeEffect, isDeleting ? speed / 2 : speed);
  }
}

// Stars animation
function initStarsAnimation() {
  const sectionsWithStars = document.querySelectorAll(".stars-container");
  const numberOfStars = 100;

  sectionsWithStars.forEach((starsContainer) => {
    for (let i = 0; i < numberOfStars; i++) {
      const star = document.createElement("div");
      star.classList.add("star");

      star.style.left = `${Math.random() * 100}vw`;
      star.style.top = `${Math.random() * 100}vh`;
      star.style.animationDuration = `${Math.random() * 5 + 5}s`;
      star.style.animationDelay = `${Math.random() * 5}s`;

      starsContainer.appendChild(star);
    }
  });
}

// Shooting stars animation
function initShootingStars() {
  const shootingStarsContainer = document.querySelector(".shooting-stars-container");

  function createShootingStar() {
    const star = document.createElement("div");
    star.classList.add("shooting-star");

    star.style.left = `${Math.random() * window.innerWidth}px`;
    star.style.top = `${Math.random() * window.innerHeight / 2}px`;
    star.style.animationDuration = `${Math.random() * 2 + 1}s`;

    shootingStarsContainer.appendChild(star);

    setTimeout(() => star.remove(), 1500 * parseFloat(star.style.animationDuration));
  }

  setInterval(createShootingStar, 300);
}

// Smooth scrolling for navigation links
function initSmoothScrolling() {
  const navLinks = document.querySelectorAll("nav .links a");

  navLinks.forEach((link) => {
    link.addEventListener("click", (event) => {
      const targetId = link.getAttribute("href").substring(1);
      const targetSection = document.getElementById(targetId);

      if (targetSection) {
        targetSection.scrollIntoView({
          behavior: "smooth",
          block: "start",
        });
      }
    });
  });
}



// Typewriter effect - ABOUT
function initAboutTypewriter() {
  const aboutSection = document.querySelector("#about");
  const typewriterText = document.querySelector("#typewriter-text");
  const aboutDesc = document.querySelector("#about-desc");
  const text = "Hello, I'm Strona. And this is me. xd";
  let index = 0;

  function typeWriter() {
    if (index < text.length) {
      typewriterText.textContent += text.charAt(index);
      index++;
      setTimeout(typeWriter, 100);
    } else {
      setTimeout(() => (aboutDesc.style.opacity = 1), 1200);
    }
  }

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting && typewriterText.textContent === "") {
          typeWriter();
          observer.unobserve(aboutSection);
        }
      });
    },
    { threshold: 0.5 }
  );

  observer.observe(aboutSection);
}



  // Carousel
function initCarousel() {
  const track = document.querySelector(".carousel-track");
  const items = Array.from(track.children);
  const prevButton = document.querySelector(".carousel-button.prev");
  const nextButton = document.querySelector(".carousel-button.next");
  let currentIndex = 0;

  function updateCarousel() {
    const itemWidth = items[0].getBoundingClientRect().width;
    track.style.transform = `translateX(-${currentIndex * itemWidth}px)`;
  }

  nextButton.addEventListener("click", () => {
    currentIndex = (currentIndex + 1) % items.length;
    updateCarousel();
  });

  prevButton.addEventListener("click", () => {
    currentIndex = (currentIndex - 1 + items.length) % items.length;
    updateCarousel();
  });

  updateCarousel();
}


