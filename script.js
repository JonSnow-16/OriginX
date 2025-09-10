// Birthday Celebration Page JavaScript

document.addEventListener('DOMContentLoaded', function() {
    initializeBootLoader();
});

// Boot Loader System
function initializeBootLoader() {
  const loader = document.getElementById('boot-loader');
  const progressFill = document.getElementById('progress-fill');
  const progressText = document.getElementById('progress-text');

  if (!loader || !progressFill || !progressText) return;

  const totalDuration = 4000;
  const steps = [
    { text: 'Initializing...', progress: 20 },
    { text: 'Loading images...', progress: 50 },
    { text: 'Setting up animations...', progress: 80 },
    { text: 'Complete!', progress: 100 }
  ];

  let current = 0;
  const stepDuration = totalDuration / steps.length;

  function update() {
    if (current < steps.length) {
      const step = steps[current];
      progressText.textContent = step.text;
      progressFill.style.width = step.progress + '%';
      current++;
      setTimeout(update, stepDuration);
    } else {
      setTimeout(() => {
        // show the tap screen immediately (so it covers content)
        const tapScreen = document.getElementById('tap-screen');
        if (tapScreen) {
          tapScreen.style.display = 'flex';
          // ensure it's above the loader while loader fades
          tapScreen.style.zIndex = '20001';
        }

        // make sure tap handlers / audio init are attached
        // showTapScreen() sets display and calls initializeMusic()
        if (typeof showTapScreen === 'function') {
          showTapScreen();
        } else if (typeof initializeMusic === 'function') {
          initializeMusic();
        }

        // now fade out the loader
        loader.classList.add('hidden');
        setTimeout(() => {
          loader.style.display = 'none';
        }, 800);
      }, 300);
    }
  }
  update();
}


function showTapScreen() {
  const tapScreen = document.getElementById('tap-screen');
  const music = document.getElementById('bg-music');

  if (tapScreen && music) {
    tapScreen.style.display = 'flex';
    
    // Use a 'once' event listener to ensure this only runs one time.
    tapScreen.addEventListener('click', () => {
      // Hide the tap screen
      tapScreen.style.display = 'none';
      
      // Play the music
      music.play().catch(error => {
        console.error("Audio playback failed:", error);
      });
      
      // Initialize the rest of the application
      initializeApp();
    }, { once: true });
  }
}


function initializeApp() {
    initializeImages();
    initializeConfetti();
    initializeBalloons();
    setCollageGrid();
    buildInlineSlideshow();
    startInlineSlideshow();
    initializeEmojis();
    // The line below is no longer needed here as music is started on tap
    // initializeMusic(); 
    
    // Add welcome animation
    setTimeout(() => {
        createWelcomeConfetti();
    }, 1000);
}

// Image sources and builders
const imageUrls = [
    'img1.jpg',
    'img2.jpg',
    'img3.jpg',
    'img4.jpg',
    'img5.jpg',
    'img6.jpg',
    'img7.jpg',
    'img8.jpg',
    'img9.jpg',
    'img10.jpg',
    'img11.jpg',
    'img12.jpg',
    'img13.jpg',
    'img14.jpg'
];

function initializeImages() {
    buildCollage();
    lazyPreloadImages();
}

function buildCollage() {
    const collage = document.getElementById('collage-background');
    if (!collage) return;
    collage.innerHTML = '';
    const vw = Math.max(document.documentElement.clientWidth, window.innerWidth || 0);
    const vh = Math.max(document.documentElement.clientHeight, window.innerHeight || 0);
    const isSmall = vw <= 480;
    const tile = isSmall ? 60 : 80;
    const gap = isSmall ? 3 : 4;
    const cols = Math.ceil((vw - gap) / (tile + gap));
    const rows = Math.ceil((vh - gap) / (tile + gap));
    const needed = cols * rows;
    
    const collageImages = imageUrls.slice(0, 4);
    
    for (let i = 0; i < needed; i++) {
        const url = collageImages[i % collageImages.length];
        const tileEl = document.createElement('div');
        tileEl.className = 'collage-tile';
        tileEl.style.backgroundImage = `url('${url}')`;
        collage.appendChild(tileEl);
    }
}

function setCollageGrid() {
    const collage = document.getElementById('collage-background');
    if (!collage) return;
    buildCollage();
}

function lazyPreloadImages() {
    imageUrls.slice(1).forEach(src => {
        const img = new Image();
        img.loading = 'lazy';
        img.decoding = 'async';
        img.src = src;
    });
}

// Inline slideshow
let inlineSlideIndex = 0;
let inlineSlideInterval;

function buildInlineSlideshow() {
    const container = document.getElementById('inline-slideshow');
    if (!container) return;
    container.innerHTML = '';
    
    imageUrls.forEach((url, idx) => {
        const slide = document.createElement('div');
        slide.className = 'inline-slide' + (idx === 0 ? ' active' : '');
        slide.style.backgroundImage = `url('${url}')`;
        container.appendChild(slide);
    });
    
    startInlineSlideshow();
    
    imageUrls.slice(1).forEach(url => {
        const img = new Image();
        img.loading = 'lazy';
        img.src = url;
    });
}

function startInlineSlideshow() {
    const slides = document.querySelectorAll('.inline-slide');
    if (!slides.length) return;
    inlineSlideIndex = 0;
    if (inlineSlideInterval) clearInterval(inlineSlideInterval);
    
    inlineSlideInterval = setInterval(() => {
        slides[inlineSlideIndex].classList.remove('active');
        inlineSlideIndex = (inlineSlideIndex + 1) % slides.length;
        slides[inlineSlideIndex].classList.add('active');
    }, 2500);
}

window.addEventListener('load', function() {
    console.log('Page fully loaded, slideshow should be running');
});

// Confetti system
function initializeConfetti() {
    const confettiContainer = document.getElementById('confetti');
    
    window.createConfetti = function(count = 50) {
        for (let i = 0; i < count; i++) {
            setTimeout(() => {
                createConfettiPiece();
            }, i * 50);
        }
    };
    
    function createConfettiPiece() {
        const confetti = document.createElement('div');
        confetti.className = 'confetti-piece';
        confetti.style.left = Math.random() * 100 + '%';
        confetti.style.animationDelay = Math.random() * 2 + 's';
        confetti.style.animationDuration = (Math.random() * 2 + 2) + 's';
        const rotation = Math.random() * 360;
        confetti.style.transform = `rotate(${rotation}deg)`;
        confettiContainer.appendChild(confetti);
        setTimeout(() => {
            if (confetti.parentNode) {
                confetti.parentNode.removeChild(confetti);
            }
        }, 4000);
    }
}

function createWelcomeConfetti() {
    createConfetti(100);
}

// Balloon animations
function initializeBalloons() {
    const balloons = document.querySelectorAll('.balloon');
    balloons.forEach((balloon) => {
        const colors = ['🎈', '🎆', '🎊', '✨', '🌟'];
        balloon.textContent = colors[Math.floor(Math.random() * colors.length)];
        balloon.style.animationDelay = (Math.random() * 5) + 's';
    });
    
    setInterval(() => {
        addRandomBalloon();
    }, 8000);
}

function addRandomBalloon() {
    const balloonsContainer = document.querySelector('.balloons-container');
    const balloon = document.createElement('div');
    balloon.className = 'balloon';
    const balloonEmojis = ['🎈', '🎆', '🎊', '✨', '🌟', '💫', '🎯'];
    balloon.textContent = balloonEmojis[Math.floor(Math.random() * balloonEmojis.length)];
    balloon.style.left = Math.random() * 90 + '%';
    balloon.style.fontSize = (Math.random() * 2 + 2) + 'rem';
    balloon.style.animationDuration = (Math.random() * 4 + 6) + 's';
    balloonsContainer.appendChild(balloon);
    setTimeout(() => {
        if (balloon.parentNode) {
            balloon.parentNode.removeChild(balloon);
        }
    }, 10000);
}

// Flash birthday message
function flashBirthdayMessage() {
    const message = document.querySelector('.birthday-message');
    const originalTextShadow = message.style.textShadow;
    message.style.textShadow = '0 0 50px rgba(255, 255, 255, 1), 0 0 100px rgba(255, 215, 0, 1), 0 0 150px rgba(255, 105, 180, 0.8)';
    setTimeout(() => {
        message.style.textShadow = originalTextShadow;
    }, 500);
}

// Touch interactions
if ('ontouchstart' in window) {
    document.addEventListener('touchstart', function(e) {
        if (e.target.closest('.birthday-message-container')) {
            createConfetti(30);
        }
    });
}

// Responsive text sizing
function adjustTextSize() {
    const message = document.querySelector('.birthday-message');
    const viewportWidth = window.innerWidth;
    if (viewportWidth < 400) {
        message.style.fontSize = '1.8rem';
    } else if (viewportWidth < 600) {
        message.style.fontSize = '2.5rem';
    }
}

window.addEventListener('orientationchange', function() {
    setTimeout(() => {
        adjustTextSize();
        setCollageGrid();
    }, 500);
});

let resizeTimeoutId;
window.addEventListener('resize', () => {
    if (resizeTimeoutId) clearTimeout(resizeTimeoutId);
    resizeTimeoutId = setTimeout(() => {
        adjustTextSize();
        setCollageGrid();
    }, 150);
}, { passive: true });
adjustTextSize();

// Keyboard interactions
document.addEventListener('keydown', function(e) {
    switch(e.key) {
        case 'c':
        case 'C':
            createConfetti(50);
            break;
        case ' ':
            e.preventDefault();
            flashBirthdayMessage();
            createConfetti(25);
            break;
    }
});

// Click-triggered confetti
let lastClickTime = 0;
document.addEventListener('click', function(e) {
    if (e.target.closest('.controls')) return;
    const now = Date.now();
    if (now - lastClickTime > 400) {
        createConfetti(20);
        lastClickTime = now;
    }
});

// Performance optimization
function optimizeAnimations() {
    // This function is intended to pause non-critical animations when the tab is not visible.
    document.addEventListener('visibilitychange', () => {
        const isVisible = document.visibilityState === 'visible';
        const music = document.getElementById('bg-music');

        if (isVisible) {
            // Resume animations and music if they were paused
            if (music && music.paused) {
                music.play().catch(e => console.error("Could not resume music.", e));
            }
            // You could add logic here to restart CSS animations if needed
        } else {
            // Pause music when tab is hidden
            if (music) {
                music.pause();
            }
        }
    });
}

// Call the optimization function
optimizeAnimations();

// Emoji celebration
function initializeEmojis() {
    const layer = document.getElementById('emoji-layer');
    if (!layer) return;
    const emojiSet = ['🎉','🎊','✨','🎈','🎁','🥳','🎂','💖','🌟','💫'];
    function spawnEmojiBurst(count = 12) {
        const vw = Math.max(document.documentElement.clientWidth, window.innerWidth || 0);
        for (let i = 0; i < count; i++) {
            const el = document.createElement('div');
            el.className = 'emoji-item';
            el.textContent = emojiSet[Math.floor(Math.random() * emojiSet.length)];
            const left = Math.random() * vw;
            el.style.left = left + 'px';
            el.style.bottom = '-20px';
            el.style.animationDuration = (2.5 + Math.random() * 2) + 's';
            el.style.animationDelay = (Math.random() * 0.5) + 's';
            layer.appendChild(el);
            setTimeout(() => { el.remove(); }, 4000);
        }
    }
    setInterval(() => spawnEmojiBurst(10), 6000);
    const msg = document.querySelector('.birthday-message-container');
    if (msg) {
        msg.addEventListener('click', () => spawnEmojiBurst(18), { passive: true });
        msg.addEventListener('touchstart', () => spawnEmojiBurst(18), { passive: true });
    }
}

// Background music with Tap-to-Start
function initializeMusic() {
  const audio = document.getElementById('bg-music');
  const tapScreen = document.getElementById('tap-screen');
  if (!audio || !tapScreen) return;

  audio.volume = 1.0;

  // direct tap handler
  const startEverything = (event) => {
    event.preventDefault();

    audio.play().then(() => {
      console.log("🎶 Music started on Android/iOS");
    }).catch(err => {
      console.error("⚠️ Music play blocked:", err);
      alert("Please tap again to start music 🎶");
    });

    tapScreen.style.display = "none"; 
    initializeApp();  // start your celebration immediately
  };

  // Attach only once
  tapScreen.addEventListener("click", startEverything, { once: true });
  tapScreen.addEventListener("touchstart", startEverything, { once: true });
}





