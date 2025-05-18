// Game variables
let isJumping = false;
let isGameOver = false;
let score = 0;
let gameSpeed = 1; // Initial game speed
let speedIncreaseTimer;

// DOM elements
const loadingScreen = document.getElementById('loadingScreen');
const loadingBar = document.getElementById('loadingBar');
const dinoIframe = document.getElementById('dinoIframe');
const fallbackGame = document.getElementById('fallbackGame');
const dino = document.getElementById('dino');
const cactus = document.getElementById('cactus');
const scoreDisplay = document.getElementById('score');
const gameOverText = document.getElementById('gameOver');
const motivationalMessage = document.getElementById('motivationalMessage');
const gameScreen = document.getElementById('gameScreen');
const messageScreen = document.getElementById('messageScreen');
const galleryScreen = document.getElementById('galleryScreen');
const typingText = document.getElementById('typingText');
const nextFromMessageBtn = document.getElementById('nextFromMessageBtn');
const nextFromGameBtn = document.getElementById('nextFromGameBtn');
const skipMsgBtn = document.getElementById('skipMsgBtn');
const resetGameBtn = document.getElementById('resetGameBtn');
const homeFromGalleryBtn = document.getElementById('homeFromGalleryBtn');
const prevBtn = document.getElementById('prevBtn');
const nextBtn = document.getElementById('nextBtn');
const messageProgress = document.getElementById('messageProgress');
const audioToggle = document.getElementById('audioToggle');
const bgMusic = document.getElementById('bgMusic');
const gameboyScreen = document.getElementById('gameboyScreen');
const playDinoBtn = document.getElementById('playDinoBtn');
const playMessageBtn = document.getElementById('playMessageBtn');
const playGalleryBtn = document.getElementById('playGalleryBtn');
const hearts = document.getElementById('hearts');
const startButton = document.getElementById('startButton');

// Motivational messages array
const motivationalMessages = [
    "MWAAHHH 😙",
    "YIPPIIEEE",
    "AYO KAK COBA LAGII! ❤️",
    "HMM HMM",
    "GA KALAH ITU ITUNGANNYA",
    "DI HATI AKU MENANG KOK",
];

// Create loading animation
function startLoading() {
    loadingScreen.style.display = 'flex';
    loadingBar.style.width = '0%';
    
    setTimeout(() => {
        loadingBar.style.width = '100%';
    }, 100);
    
    setTimeout(() => {
        loadingScreen.style.opacity = '0';
        setTimeout(() => {
            loadingScreen.style.display = 'none';
        }, 500);
    }, 3000);
}

// Create floating hearts
function createHearts() {
    for (let i = 0; i < 20; i++) {
        const heart = document.createElement('div');
        heart.classList.add('heart');
        heart.style.left = Math.random() * 100 + 'vw';
        heart.style.animationDuration = (Math.random() * 10 + 10) + 's';
        heart.style.animationDelay = (Math.random() * 10) + 's';
        heart.style.opacity = Math.random() * 0.5 + 0.1;
        hearts.appendChild(heart);
    }
}

// The message to type
const message = "Ngga deh, Aku mau bilang aja selamat ulang tahun yaa jinan semoga dengan bertambahnyaa umur ini kamu  bisa tumbuh lebih tinggi lagii yeaayyy, ehh maksudnya tumbuh dewasa dan lebih baik lagi yaa dari sebelumnya, semoga kamu selalu ceria dan excited seperti biasanya soalnyaa kamuu kalo senyum lucuuuu akuu sukaaa mwaah mwaah 😙, apalagi yaa? hmm hmm, semoga kamuu diberi umur yang panjang sepanjang panjangnyaaa yaaa, gapapaa kok kamuu pendek yang penting umur kamuu panjang 😙, terus semogaa kamuu sehat selaluu, soalnyaa kalo kamu sakit nantii akuu gaada teman berceritaa 😔 apalagiii yaa akuu bingung, hmm gituu gituu deh pokoknyaaa love youu mwaah mwaah😘";
let charIndex = 0;
let typingInterval = null;

// Gallery slideshow variables
let slideInterval;
let isSlideShowActive = false;

// Attempt to load Chrome Dino game
function loadChromeDino() {
    useFallbackGame(); // We'll always use our custom dino game
}

function useFallbackGame() {
    dinoIframe.style.display = "none";
    fallbackGame.style.display = "block";
    startFallbackGame();
}

// Fallback Game Functions
function startFallbackGame() {
    // Reset game state
    isGameOver = false;
    score = 0;
    gameSpeed = 1;
    scoreDisplay.textContent = `Score: 0`;
    gameOverText.style.display = 'none';
    motivationalMessage.textContent = '';
    
    // Reset cactus position (start from outside the right edge)
    cactus.style.right = '-50px';
    
    // Start the game
    moveCactus();
    
    // Set timer to increase speed gradually
    clearInterval(speedIncreaseTimer);
    speedIncreaseTimer = setInterval(() => {
        if (!isGameOver && gameSpeed < 3) {
            gameSpeed += 0.1;
        }
    }, 5000);
}

function jump() {
    if (isJumping) return;
    isJumping = true;
    
    let jumpCount = 0;
    const jumpInterval = setInterval(() => {
        // Jump up
        if (jumpCount < 15) {
            dino.style.bottom = (parseInt(window.getComputedStyle(dino).getPropertyValue('bottom')) + 5) + 'px';
        }
        // Fall down
        else if (jumpCount >= 15 && jumpCount < 30) {
            dino.style.bottom = (parseInt(window.getComputedStyle(dino).getPropertyValue('bottom')) - 5) + 'px';
        }
        // End jump
        else {
            clearInterval(jumpInterval);
            isJumping = false;
            dino.style.bottom = '0px';
        }
        jumpCount++;
    }, 20);
}

function moveCactus() {
    // Start cactus off-screen to the right
    let position = -50;
    const moveInterval = setInterval(() => {
        if (position > 650) {
            if (isGameOver) {
                clearInterval(moveInterval);
                return;
            }
            position = -50; // Reset to start off-screen
            score += 10;
            scoreDisplay.textContent = `Score: ${score}`;
        }
        
        position += 5 * gameSpeed; // Speed based on gameSpeed
        cactus.style.right = position + 'px';
        
        // Collision detection
        const dinoBottom = parseInt(window.getComputedStyle(dino).getPropertyValue('bottom'));
        const cactusRight = parseInt(window.getComputedStyle(cactus).getPropertyValue('right'));
        
        // Calculate actual position for collision detection
        const actualCactusPos = 600 - cactusRight;
        
        if (actualCactusPos > 50 && actualCactusPos < 110 && dinoBottom < 40) {
            clearInterval(moveInterval);
            clearInterval(speedIncreaseTimer);
            gameOver();
        }
    }, 20);
}

function gameOver() {
    isGameOver = true;
    gameOverText.style.display = 'block';
    
    // Show random motivational message
    const randomIndex = Math.floor(Math.random() * motivationalMessages.length);
    motivationalMessage.textContent = motivationalMessages[randomIndex];
    
    // No auto continue - player must click NEXT or press SPACE
}

function showGameboyScreen() {
    gameboyScreen.style.transform = 'translateX(0)';
    gameScreen.style.transform = 'translateX(100vw)';
    messageScreen.style.transform = 'translateX(200vw)';
    galleryScreen.style.transform = 'translateX(300vw)';
    
    // Play background music
    setTimeout(() => {
        bgMusic.play().catch(error => {
            console.log("Audio couldn't autoplay:", error);
        });
    }, 1000);
}

bgMusic.addEventListener('ended', () => {
  // pastikan file sudah selesai diputar
  bgMusic.currentTime = 0;
  bgMusic.play();
});

function goToGameScreen() {
    gameboyScreen.style.transform = 'translateX(-100vw)';
    gameScreen.style.transform = 'translateX(0)';
    messageScreen.style.transform = 'translateX(100vw)';
    galleryScreen.style.transform = 'translateX(200vw)';
    startFallbackGame();
}

function goToMessageScreen() {
    gameboyScreen.style.transform = 'translateX(-200vw)';
    gameScreen.style.transform = 'translateX(-100vw)';
    messageScreen.style.transform = 'translateX(0)';
    galleryScreen.style.transform = 'translateX(100vw)';
    charIndex = 0;
    typingText.innerHTML = "";
    messageProgress.style.width = "0%";
    startTypingMessage();
}

function startTypingMessage() {
    if (typingInterval) clearInterval(typingInterval);

    typingInterval = setInterval(() => {
        if (charIndex < message.length) {
            typingText.innerHTML += message.charAt(charIndex);
            charIndex++;

            const progressPercentage = (charIndex / message.length) * 100;
            messageProgress.style.width = `${progressPercentage}%`;

            // SCROLL OTOMATIS KE BAWAH
            typingText.scrollTop = typingText.scrollHeight;
        } else {
            clearInterval(typingInterval);
        }
    }, 50);
}

function skipTypingMessage() {
    // Clear typing interval and show full message
    if (typingInterval) clearInterval(typingInterval);
    typingText.innerHTML = message;
    charIndex = message.length;
    messageProgress.style.width = "100%";
}

function goToGalleryScreen() {
    gameboyScreen.style.transform = 'translateX(-300vw)';
    gameScreen.style.transform = 'translateX(-200vw)';
    messageScreen.style.transform = 'translateX(-100vw)';
    galleryScreen.style.transform = 'translateX(0)';
    initGallery();
    stopSlideshow();
}

function restartExperience() {
    gameboyScreen.style.transform = 'translateX(0)';
    gameScreen.style.transform = 'translateX(100vw)';
    messageScreen.style.transform = 'translateX(200vw)';
    galleryScreen.style.transform = 'translateX(300vw)';
    stopSlideshow();
}

// Gallery functions
let currentSlide = 0;
const slides = document.querySelectorAll('.gallery-slide');

function initGallery() {
    showSlide(currentSlide);
}

function showSlide(index) {
    // Pause all videos sebelum pindah slide
    document.querySelectorAll('.gallery-slide video').forEach(video => {
        video.pause();
        video.currentTime = 0; // Reset ke awal (opsional)
    });

    // Sembunyikan semua slide
    slides.forEach(slide => {
        slide.classList.remove('active', 'sliding-in', 'sliding-out');
    });

    // Tampilkan slide saat ini
    const current = slides[index];
    current.classList.add('active', 'sliding-in');

    // Jika ada video di dalam slide, autoplay
    const video = current.querySelector('video');
    if (video) {
        const playPromise = video.play();
        if (playPromise !== undefined) {
            playPromise.catch(error => {
                console.log("Autoplay video gagal:", error);
            });
        }
    }
}

function startSlideshow() {
    if (isSlideShowActive) return;
    isSlideShowActive = true;
    
    // Clear any existing interval
    if (slideInterval) clearInterval(slideInterval);
    
    // Start slideshow
    slideInterval = setInterval(() => {
        nextSlide();
    }, 5000); // Change slide every 5 seconds
}

function stopSlideshow() {
    isSlideShowActive = false;
    if (slideInterval) {
        clearInterval(slideInterval);
        slideInterval = null;
    }
}

function nextSlide() {
    // Add sliding-out animation to current slide
    slides[currentSlide].classList.add('sliding-out');
    
    // Update current slide index
    currentSlide = (currentSlide + 1) % slides.length;
    
    // Show next slide with sliding-in animation
    setTimeout(() => {
        showSlide(currentSlide);
    }, 300); // Short delay for animation
}

function prevSlide() {
    // Add sliding-out animation to current slide
    slides[currentSlide].classList.add('sliding-out');
    
    // Update current slide index
    currentSlide = (currentSlide - 1 + slides.length) % slides.length;
    
    // Show next slide with sliding-in animation
    setTimeout(() => {
        showSlide(currentSlide);
    }, 300); // Short delay for animation
    
    // Reset slideshow timer when manually changing slides
    if (isSlideShowActive) {
        stopSlideshow();
        stopSlideshow();
    }
}

// Audio controls
function toggleAudio() {
    if (bgMusic.paused) {
        bgMusic.play();
        audioToggle.innerHTML = '<i class="bi bi-volume-up-fill"></i>';
        audioToggle.style.color = "#00ffff";
    } else {
        bgMusic.pause();
        audioToggle.innerHTML = '<i class="bi bi-volume-mute-fill"></i>';
        audioToggle.style.color = "#ff00ff";
    }
}

// Initialize
window.onload = function() {
    // Show loading screen first
    startLoading();
    
    // Create floating hearts
    createHearts();
    
    // Show GameBoy screen after loading
    setTimeout(() => {
        showGameboyScreen();
    }, 3000);
    
    // Try to load Chrome Dino game (will likely fall back to our version)
    loadChromeDino();
    
    // Show the first slide
    showSlide(0);
    
    // Setup event listeners
    document.addEventListener('keydown', (event) => {
        if (event.code === 'Space') {
            event.preventDefault();
            if (!isGameOver && gameScreen.style.transform === 'translateX(0px)') {
                jump();
            } else if (isGameOver && gameScreen.style.transform === 'translateX(0px)') {
                goToMessageScreen();
            }
        }
    });
    
    // Game controls
    dino.addEventListener('click', () => {
        if (!isGameOver) {
            jump();
        }
    });
    
    gameOverText.addEventListener('click', () => {
        if (isGameOver) {
            goToMessageScreen();
        }
    });
    
    // Start button functionality
    startButton.addEventListener('click', goToGameScreen);
    
    // Navigation buttons
    nextFromGameBtn.addEventListener('click', goToMessageScreen);
    skipMsgBtn.addEventListener('click', skipTypingMessage);
    resetGameBtn.addEventListener('click', startFallbackGame);
    nextFromMessageBtn.addEventListener('click', goToGalleryScreen);
    homeFromGalleryBtn.addEventListener('click', restartExperience);
    
    // Gameboy menu buttons
    playDinoBtn.addEventListener('click', goToGameScreen);
    playMessageBtn.addEventListener('click', goToMessageScreen);
    playGalleryBtn.addEventListener('click', goToGalleryScreen);
    
    // Gallery navigation
    prevBtn?.addEventListener('click', prevSlide);
    nextBtn?.addEventListener('click', nextSlide);
    
    // Audio toggle
    audioToggle.addEventListener('click', toggleAudio);
};

// Add some additional visual effects
document.addEventListener('mousemove', (e) => {
    const mouseX = e.clientX / window.innerWidth;
    const mouseY = e.clientY / window.innerHeight;
    
    // Subtle reactive background effect
    document.querySelector('.bg-gradient').style.backgroundPosition = 
        `${mouseX * 100}% ${mouseY * 100}%`;
});

// Add keyboard shortcuts for navigation
document.addEventListener('keydown', (e) => {
    // Right arrow key - for manual navigation to next screen
    if (e.code === 'ArrowRight') {
        if (gameScreen.style.transform === 'translateX(0px)') {
            goToMessageScreen();
        } else if (messageScreen.style.transform === 'translateX(0px)') {
            goToGalleryScreen();
        } else if (galleryScreen.style.transform === 'translateX(0px)' && isSlideShowActive) {
            nextSlide();
        }
    }
    // Left arrow key - only for gallery navigation
    else if (e.code === 'ArrowLeft') {
        if (galleryScreen.style.transform === 'translateX(0px)' && isSlideShowActive) {
            prevSlide();
        }
    }
});

// Easter egg - Konami code detector
let konamiCode = ['ArrowUp', 'ArrowUp', 'ArrowDown', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'ArrowLeft', 'ArrowRight', 'b', 'a'];
let konamiIndex = 0;

document.addEventListener('keydown', (e) => {
    if (e.key === konamiCode[konamiIndex] || e.code === konamiCode[konamiIndex]) {
        konamiIndex++;
        if (konamiIndex === konamiCode.length) {
            // Easter egg activated!
            document.body.style.animation = 'gradientAnimation 5s ease infinite';
            alert('KONAMI CODE ACTIVATED: Valentine Power Up! ❤️');
            konamiIndex = 0;
            
            // Add some rainbow effects
            document.querySelectorAll('.neon-title').forEach(title => {
                title.style.animation = 'rainbow 3s linear infinite';
            });
            
            // Add rainbow animation if it doesn't exist
            let hasRainbowAnimation = false;
            for (let i = 0; i < document.styleSheets[0].cssRules.length; i++) {
                if (document.styleSheets[0].cssRules[i].name === 'rainbow') {
                    hasRainbowAnimation = true;
                    break;
                }
            }
            
            if (!hasRainbowAnimation) {
                const styleSheet = document.styleSheets[0];
                styleSheet.insertRule(`
                    @keyframes rainbow {
                        0% { color: #ff0000; text-shadow: 0 0 10px #ff0000; }
                        16% { color: #ff8000; text-shadow: 0 0 10px #ff8000; }
                        33% { color: #ffff00; text-shadow: 0 0 10px #ffff00; }
                        50% { color: #00ff00; text-shadow: 0 0 10px #00ff00; }
                        66% { color: #00ffff; text-shadow: 0 0 10px #00ffff; }
                        83% { color: #0080ff; text-shadow: 0 0 10px #0080ff; }
                        100% { color: #ff00ff; text-shadow: 0 0 10px #ff00ff; }
                    }
                `, styleSheet.cssRules.length);
            }
            
            // Add more hearts
            for (let i = 0; i < 30; i++) {
                const heart = document.createElement('div');
                heart.classList.add('heart');
                heart.style.left = Math.random() * 100 + 'vw';
                heart.style.animationDuration = (Math.random() * 5 + 5) + 's';
                heart.style.opacity = Math.random() * 0.7 + 0.3;
                hearts.appendChild(heart);
            }
        }
    } else {
        konamiIndex = 0;
    }
});
