let quotes = [];
const quoteElement = document.getElementById('quote');
const authorElement = document.getElementById('author');
const newQuoteButton = document.getElementById('newQuote');
let currentQuoteIndex = -1;

// Load quotes from the JSON file
async function loadQuotes() {
    try {
        const response = await fetch('assets/data/quotes.json');
        const data = await response.json();
        quotes = data.quotes;
            
        // Display initial quote once quotes are loaded
        displayQuote();
    } catch (error) {
        console.error('Error loading quotes:', error);
        quoteElement.textContent = 'Error loading quotes...';
    }
}

function getRandomQuote() {
    let newIndex;
    do {
        newIndex = Math.floor(Math.random() * quotes.length);
    } while (newIndex === currentQuoteIndex);
    
    currentQuoteIndex = newIndex;
    return quotes[currentQuoteIndex];
}

function displayQuote() {
    // Fade out
    quoteElement.style.opacity = '0';
    authorElement.style.opacity = '0';
    
    setTimeout(() => {
        const { text, author } = getRandomQuote();
        quoteElement.textContent = `"${text}"`;
        authorElement.textContent = `- ${author}`;
        
        // Reset animations
        quoteElement.style.animation = 'none';
        authorElement.style.animation = 'none';
        
        // Trigger reflow
        void quoteElement.offsetWidth;
        void authorElement.offsetWidth;
        
        // Add animation classes back
        quoteElement.style.animation = 'fadeIn 0.8s ease-out forwards';
        authorElement.style.animation = 'fadeIn 0.8s ease-out 0.3s forwards';
    }, 300);
}

// Load quotes and initialize the app
loadQuotes();

// Add click event listener for new quote button
newQuoteButton.addEventListener('click', () => {
    newQuoteButton.style.transform = 'scale(0.95)';
    setTimeout(() => {
        newQuoteButton.style.transform = 'scale(1)';
    }, 150);
    displayQuote();

    // Add shooting star effect on button click
    createShootingStar();
});

// Add mouse move effect to quote container
const quoteContainer = document.querySelector('.quote-container');

document.addEventListener('mousemove', (e) => {
    if (quoteContainer) {
        const rect = quoteContainer.getBoundingClientRect();
        const x = ((e.clientX - rect.left) / rect.width) * 100;
        const y = ((e.clientY - rect.top) / rect.height) * 100;
        
        quoteContainer.style.setProperty('--x', `${x}%`);
        quoteContainer.style.setProperty('--y', `${y}%`);
        
        // Subtle 3D rotation effect
        const rotateX = (e.clientY - rect.top - rect.height / 2) / rect.height * 10;
        const rotateY = -(e.clientX - rect.left - rect.width / 2) / rect.width * 10;
        
        quoteContainer.style.transform = `rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
    }
});

// Enhanced shooting star creation
function createShootingStar() {
    const star = document.createElement('div');
    star.classList.add('shooting-star');

    // Random start and end positions with improved distribution
    const startX = 0.8 + Math.random() * 0.2; // Start from the right side
    const startY = Math.random() * 0.3; // Start from top third
    const endX = startX - 0.4 - Math.random() * 0.4;
    const endY = startY + 0.4 + Math.random() * 0.4;

    star.style.setProperty('--start-x', startX);
    star.style.setProperty('--start-y', startY);
    star.style.setProperty('--end-x', endX);
    star.style.setProperty('--end-y', endY);

    document.body.appendChild(star);

    // Remove the star after animation
    setTimeout(() => {
        star.remove();
    }, 2500);
}

// Add button hover effect
newQuoteButton.addEventListener('mouseover', () => {
    createShootingStar();
});

// Improved random star creation
function createRandomStars() {
    if (Math.random() < 0.3) { // 30% chance to create a shooting star
        setTimeout(createShootingStar, Math.random() * 500);
    }
}

// Create shooting stars at random intervals
setInterval(createRandomStars, 2000);

// Create initial stars with staggered timing
for (let i = 0; i < 3; i++) {
    setTimeout(() => createShootingStar(), i * 1000);
}