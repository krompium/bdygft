// ============================================================
// STATE MANAGEMENT
// ============================================================
const State = {
  currentScreen: 'gameboy', // 'gameboy' | 'game' | 'message' | 'gallery'
  isJumping: false,
  isGameOver: false,
  score: 0,
  gameSpeed: 1,
  dinoBottom: 0,
  charIndex: 0,
  typingInterval: null,
  speedIncreaseTimer: null,
  cactusInterval: null,
  currentSlide: 0,
  konamiIndex: 0,
};

// ============================================================
// DOM ELEMENTS
// ============================================================
const $ = (id) => document.getElementById(id);

const loadingScreen   = $('loadingScreen');
const loadingBar      = $('loadingBar');
const fallbackGame    = $('fallbackGame');
const dino            = $('dino');
const cactus          = $('cactus');
const scoreDisplay    = $('score');
const gameOverText    = $('gameOver');
const motivMsg        = $('motivationalMessage');
const gameScreen      = $('gameScreen');
const messageScreen   = $('messageScreen');
const galleryScreen   = $('galleryScreen');
const gameboyScreen   = $('gameboyScreen');
const typingText      = $('typingText');
const messageProgress = $('messageProgress');
const audioToggle     = $('audioToggle');
const bgMusic         = $('bgMusic');
const hearts          = $('hearts');

const slides = document.querySelectorAll('.gallery-slide');

// ============================================================
// CONSTANTS
// ============================================================
const SCREEN_ORDER = ['gameboy', 'game', 'message', 'gallery'];

const SCREEN_EL = {
  gameboy: gameboyScreen,
  game:    gameScreen,
  message: messageScreen,
  gallery: galleryScreen,
};

const motivationalMessages = [
  "MWAAHHH 😙",
  "YIPPIIEEE",
  "AYO KAK COBA LAGII! ❤️",
  "HMM HMM",
  "GA KALAH ITU ITUNGANNYA",
  "DI HATI AKU MENANG KOK",
];

const birthdayMessage =
  "Ngga deh, Aku mau bilang aja selamat ulang tahun yaa jinan semoga dengan bertambahnyaa umur ini " +
  "kamu bisa tumbuh lebih tinggi lagii yeaayyy, ehh maksudnya tumbuh dewasa dan lebih baik lagi yaa " +
  "dari sebelumnya, semoga kamu selalu ceria dan excited seperti biasanya soalnyaa kamuu kalo senyum " +
  "lucuuuu akuu sukaaa mwaah mwaah 😙, apalagi yaa? hmm hmm, semoga kamuu diberi umur yang panjang " +
  "sepanjang panjangnyaaa yaaa, gapapaa kok kamuu pendek yang penting umur kamuu panjang 😙, terus " +
  "semogaa kamuu sehat selaluu, soalnyaa kalo kamu sakit nantii akuu gaada teman berceritaa 😔 " +
  "apalagiii yaa akuu bingung, hmm gituu gituu deh pokoknyaaa love youu mwaah mwaah😘";

// ============================================================
// SCREEN NAVIGATION
// ============================================================
function goToScreen(name) {
  const idx = SCREEN_ORDER.indexOf(name);
  if (idx === -1) return;

  SCREEN_ORDER.forEach((key, i) => {
    const offset = (i - idx) * 100;
    SCREEN_EL[key].style.transform = `translateX(${offset}vw)`;
  });

  State.currentScreen = name;

  // Screen-specific init
  if (name === 'game')    initGame();
  if (name === 'message') initMessage();
  if (name === 'gallery') initGallery();
}

// ============================================================
// LOADING
// ============================================================
function startLoading() {
  loadingScreen.style.display = 'flex';
  loadingBar.style.width = '0%';
  setTimeout(() => { loadingBar.style.width = '100%'; }, 100);
  setTimeout(() => {
    loadingScreen.style.opacity = '0';
    setTimeout(() => { loadingScreen.style.display = 'none'; }, 500);
  }, 3000);
}

// ============================================================
// FLOATING HEARTS
// ============================================================
function createHearts(count = 20) {
  for (let i = 0; i < count; i++) {
    const heart = document.createElement('div');
    heart.classList.add('heart');
    heart.style.left              = Math.random() * 100 + 'vw';
    heart.style.animationDuration = (Math.random() * 10 + 10) + 's';
    heart.style.animationDelay    = (Math.random() * 10) + 's';
    heart.style.opacity           = String(Math.random() * 0.5 + 0.1);
    hearts.appendChild(heart);
  }
}

// ============================================================
// DINO GAME
// ============================================================
function initGame() {
  resetGame();
}

function resetGame() {
  // Clear previous intervals
  clearInterval(State.cactusInterval);
  clearInterval(State.speedIncreaseTimer);

  State.isGameOver = false;
  State.isJumping  = false;
  State.score      = 0;
  State.gameSpeed  = 1;
  State.dinoBottom = 0;

  scoreDisplay.textContent      = 'Score: 0';
  gameOverText.style.display    = 'none';
  motivMsg.textContent          = '';
  cactus.style.right            = '-50px';
  dino.style.bottom             = '0px';

  moveCactus();

  State.speedIncreaseTimer = setInterval(() => {
    if (!State.isGameOver && State.gameSpeed < 3) State.gameSpeed += 0.1;
  }, 5000);
}

function jump() {
  if (State.isJumping || State.isGameOver) return;
  State.isJumping = true;
  let jumpCount = 0;
  State.dinoBottom = 0;

  const jumpInterval = setInterval(() => {
    if (jumpCount < 15) {
      State.dinoBottom += 6;
    } else if (jumpCount < 30) {
      State.dinoBottom -= 6;
    } else {
      clearInterval(jumpInterval);
      State.isJumping  = false;
      State.dinoBottom = 0;
    }
    dino.style.bottom = State.dinoBottom + 'px';
    jumpCount++;
  }, 20);
}

function moveCactus() {
  let position = -50;
  State.cactusInterval = setInterval(() => {
    if (State.isGameOver) {
      clearInterval(State.cactusInterval);
      return;
    }

    const containerWidth = fallbackGame.clientWidth;
    if (position > containerWidth + 50) {
      position = -50;
      State.score += 10;
      scoreDisplay.textContent = `Score: ${State.score}`;
    }

    position += 5 * State.gameSpeed;
    cactus.style.right = position + 'px';

    // Collision detection
    const dinoRect   = dino.getBoundingClientRect();
    const cactusRect = cactus.getBoundingClientRect();
    const pad        = 12;

    if (
      dinoRect.right  - pad > cactusRect.left  + pad &&
      dinoRect.left   + pad < cactusRect.right - pad &&
      dinoRect.bottom      > cactusRect.top    + pad
    ) {
      clearInterval(State.cactusInterval);
      clearInterval(State.speedIncreaseTimer);
      triggerGameOver();
    }
  }, 20);
}

function triggerGameOver() {
  State.isGameOver = true;
  gameOverText.style.display = 'block';
  const idx = Math.floor(Math.random() * motivationalMessages.length);
  motivMsg.textContent = motivationalMessages[idx];
}

// ============================================================
// MESSAGE / TYPING
// ============================================================
function initMessage() {
  State.charIndex = 0;
  typingText.innerHTML = '';
  messageProgress.style.width = '0%';
  startTyping();
}

function startTyping() {
  if (State.typingInterval) clearInterval(State.typingInterval);
  State.typingInterval = setInterval(() => {
    if (State.charIndex < birthdayMessage.length) {
      typingText.innerHTML += birthdayMessage.charAt(State.charIndex);
      State.charIndex++;
      messageProgress.style.width = `${(State.charIndex / birthdayMessage.length) * 100}%`;
      typingText.scrollTop = typingText.scrollHeight;
    } else {
      clearInterval(State.typingInterval);
    }
  }, 50);
}

function skipTyping() {
  if (State.typingInterval) clearInterval(State.typingInterval);
  typingText.innerHTML    = birthdayMessage;
  State.charIndex         = birthdayMessage.length;
  messageProgress.style.width = '100%';
}

// ============================================================
// GALLERY
// ============================================================
function initGallery() {
  State.currentSlide = 0;
  showSlide(0);
}

function showSlide(index) {
  // Pause all videos
  document.querySelectorAll('.gallery-slide video').forEach(v => v.pause());

  slides.forEach(s => s.classList.remove('active', 'slide-enter'));
  const current = slides[index];
  current.classList.add('active', 'slide-enter');

  // Update dot indicators
  document.querySelectorAll('.gallery-dot').forEach((dot, i) => {
    dot.classList.toggle('active', i === index);
  });

  const video = current.querySelector('video');
  if (video) video.play().catch(() => {});
}

function nextSlide() {
  State.currentSlide = (State.currentSlide + 1) % slides.length;
  showSlide(State.currentSlide);
}

function prevSlide() {
  State.currentSlide = (State.currentSlide - 1 + slides.length) % slides.length;
  showSlide(State.currentSlide);
}

// Build dot indicators
function buildGalleryDots() {
  const dotsContainer = $('galleryDots');
  if (!dotsContainer) return;
  slides.forEach((_, i) => {
    const dot = document.createElement('div');
    dot.className = 'gallery-dot' + (i === 0 ? ' active' : '');
    dot.addEventListener('click', () => {
      State.currentSlide = i;
      showSlide(i);
    });
    dotsContainer.appendChild(dot);
  });
}

// ============================================================
// AUDIO
// ============================================================
bgMusic.loop = true;

function toggleAudio() {
  if (bgMusic.paused) {
    bgMusic.play().catch(() => {});
    audioToggle.innerHTML = '<i class="bi bi-volume-up-fill"></i>';
    audioToggle.style.color = '#ff6b6b';
  } else {
    bgMusic.pause();
    audioToggle.innerHTML = '<i class="bi bi-volume-mute-fill"></i>';
    audioToggle.style.color = '#888';
  }
}

// ============================================================
// SWIPE GESTURE SUPPORT
// ============================================================
function addSwipeSupport(el, onLeft, onRight) {
  let startX = null;
  el.addEventListener('touchstart', e => {
    startX = e.touches[0].clientX;
  }, { passive: true });
  el.addEventListener('touchend', e => {
    if (startX === null) return;
    const diff = startX - e.changedTouches[0].clientX;
    if (Math.abs(diff) > 50) {
      if (diff > 0) onLeft && onLeft();
      else          onRight && onRight();
    }
    startX = null;
  }, { passive: true });
}

// ============================================================
// KEYBOARD
// ============================================================
document.addEventListener('keydown', (e) => {
  // Konami Code
  const konamiCode = ['ArrowUp','ArrowUp','ArrowDown','ArrowDown','ArrowLeft','ArrowRight','ArrowLeft','ArrowRight','b','a'];
  if (e.key === konamiCode[State.konamiIndex]) {
    State.konamiIndex++;
    if (State.konamiIndex === konamiCode.length) {
      activateKonami();
      State.konamiIndex = 0;
    }
  } else {
    State.konamiIndex = 0;
  }

  if (e.code === 'Space') {
    e.preventDefault();
    if (State.currentScreen === 'game') {
      if (!State.isGameOver) jump();
      else goToScreen('message');
    }
  }

  if (e.code === 'ArrowRight') {
    if (State.currentScreen === 'game')    goToScreen('message');
    if (State.currentScreen === 'message') goToScreen('gallery');
    if (State.currentScreen === 'gallery') nextSlide();
  }
  if (e.code === 'ArrowLeft') {
    if (State.currentScreen === 'gallery') prevSlide();
  }
});

function activateKonami() {
  createHearts(30);
  document.querySelectorAll('.neon-title').forEach(t => {
    t.style.color = '#ff00ff';
    t.style.textShadow = '0 0 20px #ff00ff, 0 0 40px #ff00ff';
  });
  alert('KONAMI CODE ACTIVATED: Valentine Power Up! ❤️');
}

// ============================================================
// INIT
// ============================================================
window.onload = function () {
  startLoading();
  createHearts();
  buildGalleryDots();

  // Set initial positions
  goToScreen('gameboy');

  // Show gameboy after loading
  setTimeout(() => goToScreen('gameboy'), 3000);

  // Auto-unlock audio on first interaction
  const unlockAudio = () => {
    bgMusic.play().then(() => {
      audioToggle.innerHTML   = '<i class="bi bi-volume-up-fill"></i>';
      audioToggle.style.color = '#ff6b6b';
    }).catch(() => {});
    document.removeEventListener('click', unlockAudio);
    document.removeEventListener('touchstart', unlockAudio);
  };
  document.addEventListener('click',      unlockAudio);
  document.addEventListener('touchstart', unlockAudio, { passive: true });

  // ── Button Events ──
  $('startButton').addEventListener('click',       () => goToScreen('game'));
  $('playDinoBtn').addEventListener('click',       () => goToScreen('game'));
  $('playMessageBtn').addEventListener('click',    () => goToScreen('message'));
  $('playGalleryBtn').addEventListener('click',    () => goToScreen('gallery'));
  $('nextFromGameBtn').addEventListener('click',   () => goToScreen('message'));
  $('nextFromMessageBtn').addEventListener('click',() => goToScreen('gallery'));
  $('homeFromGalleryBtn').addEventListener('click',() => goToScreen('gameboy'));
  $('skipMsgBtn').addEventListener('click',        skipTyping);
  $('resetGameBtn').addEventListener('click',      resetGame);
  $('prevBtn').addEventListener('click',           prevSlide);
  $('nextBtn').addEventListener('click',           nextSlide);
  $('audioToggle').addEventListener('click',       toggleAudio);

  // ── Dino jump inputs ──
  dino.addEventListener('click',        () => jump());
  dino.addEventListener('touchstart',   () => jump(), { passive: true });
  gameOverText.addEventListener('click', () => { if (State.isGameOver) goToScreen('message'); });

  // ── Swipe gestures ──
  addSwipeSupport(gameScreen,
    () => goToScreen('message'),  // swipe left → next
    null
  );
  addSwipeSupport(messageScreen,
    () => goToScreen('gallery'),
    () => goToScreen('game')
  );
  addSwipeSupport(galleryScreen,
    nextSlide,
    prevSlide
  );
};
