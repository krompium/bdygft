// Game variables
let isJumping = false;
let isGameOver = false;
let score = 0;
let gameSpeed = 1;
let speedIncreaseTimer;
let dinoBottom = 0; // Lebih aman dari getComputedStyle

// DOM elements
const loadingScreen = document.getElementById('loadingScreen');
const loadingBar = document.getElementById('loadingBar');
const fallbackGame = document.getElementById('fallbackGame');
const dinoIframe = document.getElementById('dinoIframe');
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

function startLoading() {
    loadingScreen.style.display = 'flex';
    loadingBar.style.width = '0%';
    setTimeout(() => { loadingBar.style.width = '100%'; }, 100);
    setTimeout(() => {
        loadingScreen.style.opacity = '0';
        setTimeout(() => { loadingScreen.style.display = 'none'; }, 500);
    }, 3000);
}

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

const message = "Ngga deh, Aku mau bilang aja selamat ulang tahun yaa jinan semoga dengan bertambahnyaa umur ini kamu bisa tumbuh lebih tinggi lagii yeaayyy, ehh maksudnya tumbuh dewasa dan lebih baik lagi yaa dari sebelumnya, semoga kamu selalu ceria dan excited seperti biasanya soalnyaa kamuu kalo senyum lucuuuu akuu sukaaa mwaah mwaah 😙, apalagi yaa? hmm hmm, semoga kamuu diberi umur yang panjang sepanjang panjangnyaaa yaaa, gapapaa kok kamuu pendek yang penting umur kamuu panjang 😙, terus semogaa kamuu sehat selaluu, soalnyaa kalo kamu sakit nantii akuu gaada teman berceritaa 😔 apalagiii yaa akuu bingung, hmm gituu gituu deh pokoknyaaa love youu mwaah mwaah😘";
let charIndex = 0;
let typingInterval = null;
let slideInterval;
let isSlideShowActive = false;

// Fallback Game Logic (FIXED FOR MOBILE/RESPONSIVE)
function useFallbackGame() {
    dinoIframe.style.display = "none";
    fallbackGame.style.display = "block";
    startFallbackGame();
}

function startFallbackGame() {
    isGameOver = false;
    score = 0;
    gameSpeed = 1;
    scoreDisplay.textContent = `Score: 0`;
    gameOverText.style.display = 'none';
    motivationalMessage.textContent = '';
    cactus.style.right = '-50px';
    dino.style.bottom = '0px';
    
    moveCactus();
    
    clearInterval(speedIncreaseTimer);
    speedIncreaseTimer = setInterval(() => {
        if (!isGameOver && gameSpeed < 3) gameSpeed += 0.1;
    }, 5000);
}

function jump() {
    if (isJumping) return;
    isJumping = true;
    let jumpCount = 0;
    dinoBottom = 0;
    
    const jumpInterval = setInterval(() => {
        if (jumpCount < 15) {
            dinoBottom += 6;
        } else if (jumpCount >= 15 && jumpCount < 30) {
            dinoBottom -= 6;
        } else {
            clearInterval(jumpInterval);
            isJumping = false;
            dinoBottom = 0;
        }
        dino.style.bottom = dinoBottom + 'px';
        jumpCount++;
    }, 20);
}

function moveCactus() {
    let position = -50;
    const moveInterval = setInterval(() => {
        if (isGameOver) {
            clearInterval(moveInterval);
            return;
        }
        
        const containerWidth = fallbackGame.clientWidth;
        
        if (position > containerWidth + 50) {
            position = -50;
            score += 10;
            scoreDisplay.textContent = `Score: ${score}`;
        }
        
        position += 5 * gameSpeed;
        cactus.style.right = position + 'px';
        
        // COLLISION FIX: Gunakan getBoundingClientRect agar akurat di layar HP maupun Desktop
        const dinoRect = dino.getBoundingClientRect();
        const cactusRect = cactus.getBoundingClientRect();
        const hitPadding = 15; // Beri ruang toleransi agar game tidak terlalu sulit

        if (
            dinoRect.right - hitPadding > cactusRect.left + hitPadding &&
            dinoRect.left + hitPadding < cactusRect.right - hitPadding &&
            dinoRect.bottom > cactusRect.top + hitPadding
        ) {
            clearInterval(moveInterval);
            clearInterval(speedIncreaseTimer);
            gameOver();
        }
    }, 20);
}

function gameOver() {
    isGameOver = true;
    gameOverText.style.display = 'block';
    const randomIndex = Math.floor(Math.random() * motivationalMessages.length);
    motivationalMessage.textContent = motivationalMessages[randomIndex];
}

function showGameboyScreen() {
    gameboyScreen.style.transform = 'translateX(0)';
    gameScreen.style.transform = 'translateX(100vw)';
    messageScreen.style.transform = 'translateX(200vw)';
    galleryScreen.style.transform = 'translateX(300vw)';
}

bgMusic.loop = true;

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
            messageProgress.style.width = `${(charIndex / message.length) * 100}%`;
            typingText.scrollTop = typingText.scrollHeight;
        } else {
            clearInterval(typingInterval);
        }
    }, 50);
}

function skipTypingMessage() {
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

// Gallery Functions
let currentSlide = 0;
const slides = document.querySelectorAll('.gallery-slide');

function initGallery() {
    showSlide(currentSlide);
}

function showSlide(index) {
    document.querySelectorAll('.gallery-slide video').forEach(video => {
        video.pause();
    });
    slides.forEach(slide => {
        slide.classList.remove('active', 'sliding-in', 'sliding-out');
    });
    const current = slides[index];
    current.classList.add('active', 'sliding-in');
    const video = current.querySelector('video');
    if (video) {
        video.play().catch(e => console.log("Video Autoplay Error:", e));
    }
}

function stopSlideshow() {
    isSlideShowActive = false;
    if (slideInterval) clearInterval(slideInterval);
}

function nextSlide() {
    slides[currentSlide].classList.add('sliding-out');
    currentSlide = (currentSlide + 1) % slides.length;
    setTimeout(() => { showSlide(currentSlide); }, 300);
}

function prevSlide() {
    slides[currentSlide].classList.add('sliding-out');
    currentSlide = (currentSlide - 1 + slides.length) % slides.length;
    setTimeout(() => { showSlide(currentSlide); }, 300);
}

// Audio Control
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

// Setup & Initialize
window.onload = function() {
    startLoading();
    createHearts();
    setTimeout(() => { showGameboyScreen(); }, 3000);
    useFallbackGame();
    showSlide(0);
    
    // Auto unlock music on first click to bypass browser restrictions
    const unlockAudio = () => {
        bgMusic.play().then(() => {
            audioToggle.innerHTML = '<i class="bi bi-volume-up-fill"></i>';
            audioToggle.style.color = "#00ffff";
        }).catch(() => {}); // Abaikan jika error
        document.removeEventListener('click', unlockAudio);
    };
    document.addEventListener('click', unlockAudio);

    // Event Listeners
    document.addEventListener('keydown', (event) => {
        if (event.code === 'Space') {
            event.preventDefault();
            if (!isGameOver && gameScreen.style.transform === 'translateX(0px)') {
                jump();
            } else if (isGameOver && gameScreen.style.transform === 'translateX(0px)') {
                goToMessageScreen();
            }
        } else if (event.code === 'ArrowRight') {
            if (gameScreen.style.transform === 'translateX(0px)') goToMessageScreen();
            else if (messageScreen.style.transform === 'translateX(0px)') goToGalleryScreen();
            else if (galleryScreen.style.transform === 'translateX(0px)') nextSlide();
        } else if (event.code === 'ArrowLeft' && galleryScreen.style.transform === 'translateX(0px)') {
            prevSlide();
        }
    });
    
    dino.addEventListener('click', () => { if (!isGameOver) jump(); });
    gameOverText.addEventListener('click', () => { if (isGameOver) goToMessageScreen(); });
    startButton.addEventListener('click', goToGameScreen);
    nextFromGameBtn.addEventListener('click', goToMessageScreen);
    skipMsgBtn.addEventListener('click', skipTypingMessage);
    resetGameBtn.addEventListener('click', startFallbackGame);
    nextFromMessageBtn.addEventListener('click', goToGalleryScreen);
    homeFromGalleryBtn.addEventListener('click', restartExperience);
    playDinoBtn.addEventListener('click', goToGameScreen);
    playMessageBtn.addEventListener('click', goToMessageScreen);
    playGalleryBtn.addEventListener('click', goToGalleryScreen);
    if(prevBtn) prevBtn.addEventListener('click', prevSlide);
    if(nextBtn) nextBtn.addEventListener('click', nextSlide);
    audioToggle.addEventListener('click', toggleAudio);
};

// Konami Code Easter Egg
let konamiCode = ['ArrowUp', 'ArrowUp', 'ArrowDown', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'ArrowLeft', 'ArrowRight', 'b', 'a'];
let konamiIndex = 0;
document.addEventListener('keydown', (e) => {
    if (e.key === konamiCode[konamiIndex] || e.code === konamiCode[konamiIndex]) {
        konamiIndex++;
        if (konamiIndex === konamiCode.length) {
            document.body.style.animation = 'gradientAnimation 5s ease infinite';
            alert('KONAMI CODE ACTIVATED: Valentine Power Up! ❤️');
            konamiIndex = 0;
            document.querySelectorAll('.neon-title').forEach(title => {
                title.style.color = '#ff00ff';
            });
            createHearts(); // Tambah lebih banyak heart
        }
    } else {
        konamiIndex = 0;
    }
});
