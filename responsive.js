(function() {
  // Check for mobile viewport
  const isMobile = window.innerWidth <= 768;

  if (isMobile) {
    // Override startFallbackGame to use dynamic collision detection
    const originalStart = window.startFallbackGame;
    window.startFallbackGame = function() {
      // Reset game state
      isGameOver = false;
      score = 0;
      gameSpeed = 1;
      scoreDisplay.textContent = `Score: ${score}`;
      gameOverText.style.display = 'none';
      motivationalMessage.textContent = '';
      cactus.style.right = '-50px';

      // Start the mobile-specific cactus movement
      startCactusMobile();

      // Speed increase timer
      clearInterval(speedIncreaseTimer);
      speedIncreaseTimer = setInterval(() => {
        if (!isGameOver && gameSpeed < 3) gameSpeed += 0.1;
      }, 5000);
    };

    // Mobile version of moveCactus with dynamic widths
    function startCactusMobile() {
      const container = document.querySelector('.dino-fallback');
      const containerWidth = container.clientWidth;
      let pos = -50;
      const interval = setInterval(() => {
        if (isGameOver) { clearInterval(interval); return; }

        // Loop cactus and update score
        if (pos > containerWidth + 50) {
          pos = -50;
          score += 10;
          scoreDisplay.textContent = `Score: ${score}`;
        }

        // Move cactus
        pos += 5 * gameSpeed;
        cactus.style.right = pos + 'px';

        // Collision detection based on dynamic width & heights
        const dinoBottom = parseInt(window.getComputedStyle(dino).bottom);
        const cactusRight = parseInt(cactus.style.right);
        const actualCactusPos = containerWidth - cactusRight;
        const hitRangeStart = dino.offsetWidth * 0.5;
        const hitRangeEnd = hitRangeStart + cactus.offsetWidth;

        if (actualCactusPos > hitRangeStart && actualCactusPos < hitRangeEnd && dinoBottom < cactus.offsetHeight) {
          clearInterval(interval);
          clearInterval(speedIncreaseTimer);
          gameOver();
        }
      }, 20);
    }
  }

  // Reinforce gallery navigation clicks for mobile
  ['nextBtn', 'prevBtn'].forEach(id => {
    document.getElementById(id)?.addEventListener('click', function(e) {
      e.preventDefault();
      if (id === 'nextBtn') nextSlide();
      else prevSlide();
    });
  });
})();
