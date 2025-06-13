// Function to close dropdown
function closeDropdown() {
  const navbar = document.querySelector(".dropdown");
  if (navbar) {
    navbar.classList.remove("active");
    document.body.style.overflow = ""; // Restore scrolling
  }
}

document.addEventListener("DOMContentLoaded", () => {
  AOS.init();

  // Initialize stars animation
  initStarsAnimation();

  // Initialize shooting stars
  const shootingStarsContainer = document.querySelector(".shooting-stars-container");
  if (shootingStarsContainer) {
    initShootingStars();
  }

  // Initialize smooth scrolling for navigation links
  initSmoothScrolling();

  // Initialize carousel if on works page
  const carousel = document.querySelector(".carousel");
  if (carousel) {
    initCarousel();
  }

  // Initialize typewriter effects based on current page
  const typingText = document.getElementById("typing-text");
  if (typingText) {
    setTimeout(typeEffect, 1000); // Delay to ensure proper initialization
  }

  const aboutSection = document.querySelector("#about");
  if (aboutSection) {
    initAboutTypewriter();
  }

  // Add click event listener to close dropdown when clicking outside
  document.addEventListener('click', (e) => {
    const navbar = document.querySelector(".dropdown");
    const logo = document.querySelector(".logo");
    
    if (navbar && navbar.classList.contains("active")) {
      // Only close if click is outside both the dropdown and logo
      if (!navbar.contains(e.target) && !logo.contains(e.target)) {
        closeDropdown();
      }
    }
  });
});

// Dropdown menu functions
function hamburg(event) {
  event.stopPropagation(); // Prevent click from bubbling to document
  const navbar = document.querySelector(".dropdown");
  const isOpen = navbar.classList.contains("active");
  
  if (isOpen) {
    closeDropdown();
  } else {
    navbar.classList.add("active");
    document.body.style.overflow = "hidden"; // Prevent scrolling when menu is open
  }
}

function cancel(event) {
  event.stopPropagation(); // Prevent click from bubbling
  closeDropdown();
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
  if (!span) return;  // Safety check
  
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
  const navLinks = document.querySelectorAll("nav .links a, .dropdown .links a");

  navLinks.forEach((link) => {
    link.addEventListener("click", (event) => {
      event.preventDefault(); // Prevent default for all links first
      
      const href = link.getAttribute("href");
      
      // Close dropdown menu first
      closeDropdown();

      // Handle external links (like works.html)
      if (href.includes(".html")) {
        window.location.href = href; // Navigate to the new page
        return;
      }

      const targetId = href.substring(1);
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

// Carousel
function initCarousel() {
  const track = document.querySelector(".carousel-track");
  const items = Array.from(track.children);
  const prevButton = document.querySelector(".carousel-button.prev");
  const nextButton = document.querySelector(".carousel-button.next");
  let currentIndex = 0;
  let isTransitioning = false;
  let autoplayInterval;

  function updateCarousel(smooth = true) {
    if (isTransitioning) return;
    
    const itemWidth = items[0].getBoundingClientRect().width;
    isTransitioning = true;
    
    if (!smooth) {
      track.style.transition = 'none';
    }
    
    track.style.transform = `translateX(-${currentIndex * itemWidth}px)`;
    
    if (!smooth) {
      // Force reflow
      track.offsetHeight;
      track.style.transition = '';
    }

    setTimeout(() => {
      isTransitioning = false;
    }, 500);
  }

  function goToSlide(index) {
    currentIndex = (index + items.length) % items.length;
    updateCarousel();
  }

  function nextSlide() {
    goToSlide(currentIndex + 1);
  }

  function prevSlide() {
    goToSlide(currentIndex - 1);
  }

  // Event Listeners
  nextButton.addEventListener("click", () => {
    nextSlide();
    resetAutoplay();
  });

  prevButton.addEventListener("click", () => {
    prevSlide();
    resetAutoplay();
  });

  // Window resize handler
  let resizeTimer;
  window.addEventListener('resize', () => {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(() => {
      updateCarousel(false);
    }, 250);
  });

  // Touch support
  let touchStartX = 0;
  let touchEndX = 0;

  track.addEventListener('touchstart', (e) => {
    touchStartX = e.changedTouches[0].screenX;
    pauseAutoplay();
  });

  track.addEventListener('touchend', (e) => {
    touchEndX = e.changedTouches[0].screenX;
    handleSwipe();
    resumeAutoplay();
  });

  function handleSwipe() {
    const diff = touchStartX - touchEndX;
    const threshold = 50;

    if (Math.abs(diff) > threshold) {
      if (diff > 0) nextSlide();
      else prevSlide();
    }
  }

  // Autoplay
  function startAutoplay() {
    autoplayInterval = setInterval(nextSlide, 5000);
  }

  function pauseAutoplay() {
    clearInterval(autoplayInterval);
  }

  function resumeAutoplay() {
    startAutoplay();
  }

  function resetAutoplay() {
    pauseAutoplay();
    resumeAutoplay();
  }

  // Initialize
  updateCarousel(false);
  startAutoplay();

  // Pause autoplay when tab/window is not visible
  document.addEventListener('visibilitychange', () => {
    if (document.hidden) pauseAutoplay();
    else resumeAutoplay();
  });
}

// Typewriter effect - ABOUT
function initAboutTypewriter() {
  const aboutSection = document.querySelector("#about");
  const typewriterText = document.querySelector("#typewriter-text");
  const aboutDesc = document.querySelector("#about-desc");
  
  if (!aboutSection || !typewriterText || !aboutDesc) return; // Safety check
  
  const text = "Hello, I'm Strona.";
  let index = 0;
  let isTyping = false;

  function typeWriter() {
    if (!typewriterText) return; // Additional safety check
    
    if (index < text.length) {
      typewriterText.textContent += text.charAt(index);
      index++;
      setTimeout(typeWriter, 200);
    } else if (!isTyping) {
      isTyping = true;
      aboutDesc.style.opacity = "1";
    }
  }

  // Start observing with a delay to ensure proper initialization
  setTimeout(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && !isTyping && typewriterText && typewriterText.textContent === "") {
            typeWriter();
            observer.unobserve(aboutSection);
          }
        });
      },
      { threshold: 0.5 }
    );

    observer.observe(aboutSection);
  }, 500);
}
