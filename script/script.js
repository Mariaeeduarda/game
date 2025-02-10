// Game configuration
const CONFIG = {
  jumpDuration: 500,
  jumpHeight: 150,
  pipeSpeed: 3,
  initialLives: 3,
  pointsPerJump: 10,
  invincibilityDuration: 1500,
  speedIncreaseInterval: 30000, // 30 seconds
  speedMultiplier: 1.2
};

class MarioGame {
  constructor() {
    this.mario = document.querySelector(".super-mario");
    this.pipe = document.querySelector(".pipe-game");
    this.lives = CONFIG.initialLives;
    this.score = 0;
    this.isJumping = false;
    this.isInvincible = false;
    this.gameActive = true;
    this.currentSpeed = CONFIG.pipeSpeed;
    
    // Audio elements
    this.jumpSound = new Audio("./sounds/jump.mp3");
    this.coinSound = new Audio("./sounds/coin.mp3");
    this.gameOverSound = new Audio("./sounds/gameover.mp3");
    
    this.init();
  }

  init() {
    this.setupEventListeners();
    this.startGameLoop();
    this.startSpeedIncrease();
    this.updateUI();
  }

  setupEventListeners() {
    document.addEventListener("keydown", (event) => {
      if (event.code === "Space" || event.code === "ArrowUp") {
        this.jump();
      }
      if (event.code === "KeyR" && !this.gameActive) {
        this.resetGame();
      }
    });

    // Mobile support
    document.addEventListener("touchstart", () => this.jump());
  }

  jump() {
    if (!this.isJumping && this.gameActive) {
      this.isJumping = true;
      this.jumpSound.play();
      
      this.mario.classList.add("jump-mario");
      
      setTimeout(() => {
        this.mario.classList.remove("jump-mario");
        this.isJumping = false;
      }, CONFIG.jumpDuration);
    }
  }

  updateUI() {
    // Update hearts
    const heartElements = document.querySelectorAll(".heart");
    heartElements.forEach((heart, index) => {
      heart.style.display = index < this.lives ? "inline" : "none";
    });

    // Update score and lives text
    document.querySelector(".num-vidas").textContent = `Vidas: ${this.lives}`;
    document.querySelector(".pontuacao").textContent = `Pontuação: ${this.score}`;
    
    // Update high score
    const highScore = localStorage.getItem("marioHighScore") || 0;
    if (this.score > highScore) {
      localStorage.setItem("marioHighScore", this.score);
    }
    document.querySelector(".high-score").textContent = `Recorde: ${Math.max(highScore, this.score)}`;
  }

  startSpeedIncrease() {
    setInterval(() => {
      if (this.gameActive) {
        this.currentSpeed *= CONFIG.speedMultiplier;
        this.updatePipeAnimation();
      }
    }, CONFIG.speedIncreaseInterval);
  }

  updatePipeAnimation() {
    this.pipe.style.animationDuration = `${3 / this.currentSpeed}s`;
  }

  handleCollision() {
    if (!this.isInvincible) {
      this.lives--;
      this.updateUI();
      
      if (this.lives <= 0) {
        this.gameOver();
      } else {
        this.activateInvincibility();
      }
    }
  }

  activateInvincibility() {
    this.isInvincible = true;
    this.mario.style.opacity = "0.5";
    
    setTimeout(() => {
      this.isInvincible = false;
      this.mario.style.opacity = "1";
    }, CONFIG.invincibilityDuration);
  }

  gameOver() {
    this.gameActive = false;
    this.gameOverSound.play();
    this.mario.src = "./imagens/mario-game-over.png";
    this.mario.style.width = "75px";
    this.mario.style.marginLeft = "45px";
    
    // Show game over screen
    const gameOverScreen = document.createElement("div");
    gameOverScreen.className = "game-over-screen";
    gameOverScreen.innerHTML = `
      <h2>Game Over!</h2>
      <p>Pontuação Final: ${this.score}</p>
      <button onclick="game.resetGame()">Jogar Novamente</button>
    `;
    document.body.appendChild(gameOverScreen);
  }

  resetGame() {
    this.lives = CONFIG.initialLives;
    this.score = 0;
    this.gameActive = true;
    this.currentSpeed = CONFIG.pipeSpeed;
    
    // Reset Mario
    this.mario.src = "./imagens/mario.gif";
    this.mario.style.width = "150px";
    this.mario.style.marginLeft = "0";
    
    // Remove game over screen
    const gameOverScreen = document.querySelector(".game-over-screen");
    if (gameOverScreen) {
      gameOverScreen.remove();
    }
    
    this.updateUI();
    this.updatePipeAnimation();
    this.startGameLoop();
  }

  startGameLoop() {
    let gameLoop = setInterval(() => {
      if (!this.gameActive) {
        clearInterval(gameLoop);
        return;
      }

      const pipePosition = this.pipe.offsetLeft;
      const marioPosition = +window.getComputedStyle(this.mario).bottom.replace("px", "");

      // Collision detection
      if (pipePosition <= 120 && pipePosition > 0 && marioPosition < 80) {
        this.handleCollision();
      } else if (pipePosition <= 0 && this.gameActive) {
        // Successfully jumped over pipe
        this.score += CONFIG.pointsPerJump;
        this.coinSound.play();
        this.updateUI();
      }
    }, 10);
  }
}
const game = new MarioGame();
