// Constants
const TYPING_SPEED = 150;
const TYPING_PAUSE = 2000;
const TYPING_TEXTS = ["Video Editor", "Graphics Designer", "Web Developer"];

// DOM Elements state
let typingCount = 0;
let typingIndex = 0;
let isDeleting = false;

// Dropdown Menu Functions
function closeDropdown() {
    const navbar = document.querySelector(".dropdown");
    if (navbar) {
        navbar.classList.remove("active");
        document.body.style.overflow = ""; // Restore scrolling
        
        navbar.addEventListener('transitionend', function handler() {
            if (!navbar.classList.contains('active')) {
                navbar.style.display = 'none';
            }
            navbar.removeEventListener('transitionend', handler);
        });
    }
}

function hamburg(event) {
    if (event) {
        event.stopPropagation(); // Prevent click from bubbling
    }
    
    // Only handle dropdown in mobile view
    if (window.innerWidth <= 768) {
        const navbar = document.querySelector(".dropdown");
        const isOpen = navbar.classList.contains("active");
        
        if (isOpen) {
            closeDropdown();
        } else {
            navbar.classList.add("active");
            navbar.style.display = 'flex';
            document.body.style.overflow = "hidden";
        }
    } else {
        // In desktop mode, directly navigate to home.html
        window.location.href = 'home.html';
    }
}

function cancel(event) {
    event.stopPropagation();
    closeDropdown();
}

// Typewriter Effects
function typeEffect() {
    const span = document.getElementById("typing-text");
    if (!span) return;
    
    const currentText = TYPING_TEXTS[typingCount];
    span.textContent = isDeleting
        ? currentText.substring(0, typingIndex--)
        : currentText.substring(0, typingIndex++);

    if (!isDeleting && typingIndex === currentText.length + 1) {
        isDeleting = true;
        setTimeout(typeEffect, TYPING_PAUSE);
    } else if (isDeleting && typingIndex === 0) {
        isDeleting = false;
        typingCount = (typingCount + 1) % TYPING_TEXTS.length;
        setTimeout(typeEffect, 300);
    } else {
        setTimeout(typeEffect, isDeleting ? TYPING_SPEED / 2 : TYPING_SPEED);
    }
}

// Animation Functions
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

function initShootingStars() {
    const container = document.querySelector(".shooting-stars-container");
    if (!container) return;

    function createShootingStar() {
        const star = document.createElement("div");
        star.classList.add("shooting-star");
        star.style.left = `${Math.random() * window.innerWidth}px`;
        star.style.top = `${Math.random() * window.innerHeight / 2}px`;
        star.style.animationDuration = `${Math.random() * 2 + 1}s`;
        
        container.appendChild(star);
        setTimeout(() => star.remove(), 1500 * parseFloat(star.style.animationDuration));
    }

    setInterval(createShootingStar, 300);
}

// Navigation
function initSmoothScrolling() {
    const navLinks = document.querySelectorAll("nav .links a, .dropdown .links a");

    navLinks.forEach((link) => {
        link.addEventListener("click", (event) => {
            event.preventDefault();
            const href = link.getAttribute("href");
            
            closeDropdown();

            if (href.includes(".html")) {
                window.location.href = href;
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

// About Page Typewriter
function initAboutTypewriter() {
    const aboutSection = document.querySelector("#about");
    const typewriterText = document.querySelector("#typewriter-text");
    const aboutDesc = document.querySelector("#about-desc");
    
    if (!aboutSection || !typewriterText || !aboutDesc) return;
    
    const text = "Hello, I'm Strona.";
    let index = 0;
    let isTyping = false;

    function typeWriter() {
        if (!typewriterText) return;
        
        if (index < text.length) {
            typewriterText.textContent += text.charAt(index);
            index++;
            setTimeout(typeWriter, 200);
        } else if (!isTyping) {
            isTyping = true;
            aboutDesc.style.opacity = "1";
        }
    }

    setTimeout(() => {
        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting && !isTyping && typewriterText.textContent === "") {
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

// Initialize everything on DOM load
document.addEventListener("DOMContentLoaded", () => {
    // Initialize AOS library
    AOS.init();

    // Initialize animations
    initStarsAnimation();
    
    const shootingStarsContainer = document.querySelector(".shooting-stars-container");
    if (shootingStarsContainer) {
        initShootingStars();
    }

    // Initialize navigation
    initSmoothScrolling();

    // Initialize carousel if on works page
    const carousel = document.querySelector(".carousel");
    if (carousel) {
        initCarousel();
    }

    // Initialize typewriter effects
    const typingText = document.getElementById("typing-text");
    if (typingText) {
        setTimeout(typeEffect, 1000);
    }

    const aboutSection = document.querySelector("#about");
    if (aboutSection) {
        initAboutTypewriter();
    }

    // Setup dropdown click outside handler
    document.addEventListener('click', (e) => {
        const navbar = document.querySelector(".dropdown");
        const logo = document.querySelector(".logo");
        
        if (navbar?.classList.contains("active")) {
            if (!navbar.contains(e.target) && !logo.contains(e.target)) {
                closeDropdown();
            }
        }
    });
});

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

  // Autoplay
  function startAutoplay() {
    if (autoplayInterval) {
      clearInterval(autoplayInterval);
    }
    autoplayInterval = setInterval(nextSlide, 5000);
  }

  function pauseAutoplay() {
    if (autoplayInterval) {
      clearInterval(autoplayInterval);
      autoplayInterval = null;
    }
  }

  function resumeAutoplay() {
    if (!autoplayInterval) {
      startAutoplay();
    }
  }

  function resetAutoplay() {
    pauseAutoplay();
    setTimeout(() => {
      startAutoplay();
    }, 500); // Wait for transition to complete before starting new timer
  }

  // Event Listeners
  nextButton.addEventListener("click", () => {
    pauseAutoplay();
    nextSlide();
    resetAutoplay();
  });

  prevButton.addEventListener("click", () => {
    pauseAutoplay();
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

  // Initialize
  updateCarousel(false);
  startAutoplay();

  // Pause autoplay when tab/window is not visible
  document.addEventListener('visibilitychange', () => {
    if (document.hidden) pauseAutoplay();
    else resumeAutoplay();
  });
}
