//Rocco Ali
//218008847
//11/30/2024
// DATT 2400: Final project

let player;
let platforms = [];
let coins = [];
let enemies = [];
let level = 0;
let levels = [];
let gravity = 0.6;
let gameState = "title";
let lives = 3;
let highScore = 0;
let score = 0;
let powerups = [];
let activePowerups = [];

function setup() {
  createCanvas(800, 595);
  player = new Player();
  highScore = localStorage.getItem("highScore")
    ? int(localStorage.getItem("highScore"))
    : 0;

  levels = [
    // Level 1: Introductory level
    {
      platforms: [
        new Platform(50, 500, 200, 20),
        new Platform(300, 400, 150, 20),
        new Platform(550, 300, 200, 20),
        new Platform(700, 200, 100, 20),
      ],
      enemies: [
        { x: 400, y: 560, speed: 1 },
        { x: 200, y: 525, speed: 1.2 },
        { x: 150, y: 450, speed: 1.5 },
        { x: 600, y: 250, speed: -1.3 },
      ],
      coins: [
        { x: 100, y: 450 },
        { x: 350, y: 350 },
        { x: 600, y: 250 },
        { x: 200, y: 400 },
        { x: 450, y: 200 },
        { x: 700, y: 150 },
        { x: 150, y: 300 },
      ],
      powerups: [
        { x: 300, y: 350, type: "speed" },
        { x: 600, y: 200, type: "jump" },
      ],
    },

    // Level 2: Moderate difficulty
    {
      platforms: [
        new Platform(100, 550, 150, 20),
        new Platform(300, 450, 200, 20),
        new Platform(550, 350, 150, 20),
        new Platform(400, 250, 100, 20),
        new Platform(150, 150, 200, 20),
      ],
      enemies: [
        { x: 250, y: 530, speed: 1.5 },
        { x: 500, y: 320, speed: -1 },
        { x: 100, y: 575, speed: 1.3 },
        { x: 600, y: 375, speed: -1.2 },
        { x: 200, y: 400, speed: 1.8 },
        { x: 400, y: 200, speed: -1.5 },
        { x: 300, y: 175, speed: 1.4 },
      ],
      coins: [
        { x: 120, y: 500 },
        { x: 320, y: 400 },
        { x: 500, y: 300 },
        { x: 700, y: 200 },
        { x: 250, y: 350 },
        { x: 450, y: 300 },
        { x: 600, y: 160 },
        { x: 150, y: 100 },
        { x: 380, y: 150 },
      ],
      powerups: [
        { x: 400, y: 400, type: "invincibility" },
        { x: 200, y: 100, type: "speed" },
        { x: 550, y: 250, type: "jump" },
      ],
    },

    // Level 3: High difficulty
    {
      platforms: [
        new Platform(150, 500, 200, 20),
        new Platform(400, 400, 150, 20),
        new Platform(250, 300, 100, 20),
        new Platform(600, 250, 200, 20),
        new Platform(300, 150, 150, 20),
      ],
      enemies: [
        { x: 300, y: 480, speed: 2 },
        { x: 550, y: 175, speed: -1.5 },
        { x: 200, y: 450, speed: 1.8 },
        { x: 450, y: 225, speed: -1.7 },
        { x: 650, y: 125, speed: 1.5 },
        { x: 150, y: 350, speed: 2.1 },
        { x: 400, y: 325, speed: -1.9 },
        { x: 250, y: 200, speed: 1.6 },
        { x: 500, y: 375, speed: -2.0 },
      ],
      coins: [
        { x: 200, y: 450 },
        { x: 400, y: 350 },
        { x: 550, y: 250 },
        { x: 700, y: 200 },
        { x: 300, y: 100 },
        { x: 150, y: 250 },
        { x: 450, y: 150 },
        { x: 600, y: 100 },
        { x: 250, y: 200 },
        { x: 500, y: 50 },
        { x: 350, y: 300 },
      ],
      powerups: [
        { x: 350, y: 250, type: "invincibility" },
        { x: 500, y: 150, type: "speed" },
        { x: 650, y: 350, type: "jump" },
      ],
    },

    // Level 4: Boss level
    {
      platforms: [
        new Platform(100, 500, 200, 20),
        new Platform(350, 400, 200, 20),
        new Platform(600, 300, 200, 20),
      ],
      enemies: [],
      coins: [
        { x: 150, y: 450 },
        { x: 400, y: 350 },
        { x: 650, y: 250 },
        { x: 250, y: 425 },
        { x: 500, y: 325 },
        { x: 700, y: 200 },
        { x: 300, y: 150 },
        { x: 450, y: 100 },
      ],
      powerups: [
        { x: 200, y: 300, type: "invincibility" },
        { x: 500, y: 200, type: "speed" },
      ],
      boss: {
        x: 400,
        y: 500,
        speed: 2,
        health: 5,
        size: 60,
        attackCooldown: 120,
        attackTimer: 0,
        projectiles: [],
        attackPattern: 0
      },
    },
  ];

  loadLevel();
}

class Powerup {
  constructor(x, y, type) {
    this.x = x;
    this.y = y;
    this.size = 20;
    this.type = type;
    this.active = false;
    this.duration = 5000;
  }

  show() {
    switch (this.type) {
      case "speed":
        fill(0, 191, 255);
        break;
      case "jump":
        fill(147, 112, 219);
        break;
      case "invincibility":
        fill(255, 215, 0);
        break;
    }
    rect(this.x, this.y, this.size, this.size);
  }
}

class Player {
  constructor() {
    this.x = 50;
    this.y = height - 50;
    this.width = 20;
    this.height = 20;
    this.baseSpeed = 5;
    this.speed = this.baseSpeed;
    this.baseJumpStrength = 15;
    this.jumpStrength = this.baseJumpStrength;
    this.velocityY = 0;
    this.onGround = false;
    this.isInvincible = false;
  }

  update() {
    if (keyIsDown(LEFT_ARROW)) {
      this.x -= this.speed;
    }
    if (keyIsDown(RIGHT_ARROW)) {
      this.x += this.speed;
    }

    this.velocityY += gravity;
    this.y += this.velocityY;

    if (this.y + this.height > height) {
      this.y = height - this.height;
      this.velocityY = 0;
      this.onGround = true;
    } else {
      this.onGround = false;
    }

    for (let platform of platforms) {
      if (
        this.y + this.height >= platform.y &&
        this.y <= platform.y + platform.height &&
        this.x + this.width > platform.x &&
        this.x < platform.x + platform.width
      ) {
        this.y = platform.y - this.height;
        this.velocityY = 0;
        this.onGround = true;
      }
    }
  }

  applyPowerup(powerup) {
    switch (powerup.type) {
      case "speed":
        this.speed = this.baseSpeed * 2;
        break;
      case "jump":
        this.jumpStrength = this.baseJumpStrength * 1.5;
        break;
      case "invincibility":
        this.isInvincible = true;
        break;
    }

    powerup.active = true;
    activePowerups.push(powerup);

    setTimeout(() => {
      this.removePowerup(powerup);
    }, powerup.duration);
  }

  removePowerup(powerup) {
    switch (powerup.type) {
      case "speed":
        this.speed = this.baseSpeed;
        break;
      case "jump":
        this.jumpStrength = this.baseJumpStrength;
        break;
      case "invincibility":
        this.isInvincible = false;
        break;
    }

    const index = activePowerups.indexOf(powerup);
    if (index > -1) {
      activePowerups.splice(index, 1);
    }
  }

  jump() {
    if (this.onGround) {
      this.velocityY = -this.jumpStrength;
      this.onGround = false;
    }
  }

  collectsCoin(coin) {
    return (
      this.x < coin.x + coin.size &&
      this.x + this.width > coin.x &&
      this.y < coin.y + coin.size &&
      this.y + this.height > coin.y
    );
  }

  hitsEnemy(enemy) {
    return (
      this.x < enemy.x + enemy.size &&
      this.x + this.width > enemy.x &&
      this.y < enemy.y + enemy.size &&
      this.y + this.height > enemy.y
    );
  }

  show() {
    fill(255, 0, 0);
    if (this.isInvincible) {
      fill(255, 215, 0); // Gold color when invincible
    }
    rect(this.x, this.y, this.width, this.height);
  }
}

class Platform {
  constructor(x, y, width, height) {
    this.x = x;
    this.y = y;
    this.width = width;
    this.height = height;
  }

  show() {
    fill(0, 255, 0);
    rect(this.x, this.y, this.width, this.height);
  }
}

class Coin {
  constructor(x, y) {
    this.x = x;
    this.y = y;
    this.size = 15;
  }

  show() {
    fill(255, 223, 0);
    ellipse(this.x, this.y, this.size);
  }
}

class Enemy {
  constructor(x, y, speed) {
    this.x = x;
    this.y = y;
    this.size = 20;
    this.speed = speed;
  }

  update() {
    this.x += this.speed;
    if (this.x < 0 || this.x > width - this.size) {
      this.speed *= -1;
    }
  }

  show() {
    fill(255, 0, 0);
    rect(this.x, this.y, this.size, this.size);
  }
}

class BossProjectile {
  constructor(x, y, targetX, targetY) {
    this.x = x;
    this.y = y;
    this.size = 15;
    let angle = atan2(targetY - y, targetX - x);
    this.speedX = cos(angle) * 5;
    this.speedY = sin(angle) * 5;
  }

  update() {
    this.x += this.speedX;
    this.y += this.speedY;
  }

  show() {
    fill(255, 0, 0);
    ellipse(this.x, this.y, this.size);
  }
}

function draw() {
  background(135, 206, 235);

  if (gameState === "title") {
    showTitleScreen();
  } else if (gameState === "instructions") {
    showInstructions();
  } else if (gameState === "playing") {
    playGame();
  } else if (gameState === "paused") {
    showPauseMenu();
  } else if (gameState === "gameOver") {
    showGameOverScreen();
  } else if (gameState === "win") {
    showWinScreen();
  }

  if (gameState === "playing" || gameState === "paused") {
    drawHUD();
  }
}

function playGame() {
  player.update();
  player.show();

  for (let platform of platforms) {
    platform.show();
  }

  // Draw and check collisions with powerups
  for (let i = powerups.length - 1; i >= 0; i--) {
    let powerup = powerups[i];
    if (!powerup.active) {
      powerup.show();

      if (
        player.x < powerup.x + powerup.size &&
        player.x + player.width > powerup.x &&
        player.y < powerup.y + powerup.size &&
        player.y + player.height > powerup.y
      ) {
        player.applyPowerup(powerup);
        powerups.splice(i, 1);
      }
    }
  }

  // Handle enemies and collisions
  if (level < 3) {
    for (let i = enemies.length - 1; i >= 0; i--) {
      let enemy = enemies[i];
      enemy.update();
      enemy.show();

      if (player.hitsEnemy(enemy) && !player.isInvincible) {
        if (player.y + player.height <= enemy.y + 5 && player.velocityY > 0) {
          score += 100;
          enemies.splice(i, 1);
          player.velocityY = -player.jumpStrength / 1.5;

          if (enemies.length === 0 && coins.length === 0) {
            level++;
            if (level < levels.length) {
              loadLevel();
            } else {
              gameState = "win";
              saveHighScore();
            }
          }
        } else {
          lives--;
          if (lives <= 0) {
            gameState = "gameOver";
            saveHighScore();
          } else {
            loadLevel();
          }
        }
      }
    }
  }

  // Handle coins and boss level
  for (let i = coins.length - 1; i >= 0; i--) {
    let coin = coins[i];
    coin.show();

    if (player.collectsCoin(coin)) {
      coins.splice(i, 1);
      score += 50;

      if (coins.length === 0) {
        level++;
        if (level < levels.length) {
          loadLevel();
        } else {
          gameState = "win";
          saveHighScore();
        }
      }
    }
  }

  // Boss level logic (Level 3)
  if (level === 3) {
      let boss = levels[level].boss;

      // Boss movement patterns
      boss.attackTimer++;
      if (boss.attackTimer >= boss.attackCooldown) {
          boss.attackTimer = 0;
          boss.attackPattern = (boss.attackPattern + 1) % 3;

          // Add projectile attack
          boss.projectiles.push(new BossProjectile(boss.x + boss.size/2, boss.y + boss.size/2, player.x, player.y));
      }

      // Different movement patterns
      switch(boss.attackPattern) {
          case 0: // Horizontal movement
              boss.x += boss.speed;
              if (boss.x < 0 || boss.x > width - boss.size) boss.speed *= -1;
              break;
          case 1: // Diagonal movement
              boss.x += boss.speed;
              boss.y += sin(frameCount * 0.05) * 3;
              if (boss.x < 0 || boss.x > width - boss.size) boss.speed *= -1;
              break;
          case 2: // Chase player
              let dx = player.x - boss.x;
              boss.x += dx * 0.02;
              break;
      }

      // Update and show projectiles
      for (let i = boss.projectiles.length - 1; i >= 0; i--) {
          let proj = boss.projectiles[i];
          proj.update();
          proj.show();

          // Check projectile collision with player
          if (!player.isInvincible && 
              dist(proj.x, proj.y, player.x + player.width/2, player.y + player.height/2) < proj.size + player.width/2) {
              lives--;
              boss.projectiles.splice(i, 1);
              if (lives <= 0) {
                  gameState = "gameOver";
                  saveHighScore();
              } else {
                  loadLevel();
              }
          }

          // Remove projectiles that are off screen
          if (proj.x < 0 || proj.x > width || proj.y < 0 || proj.y > height) {
              boss.projectiles.splice(i, 1);
          }
      }

      // Visual feedback for boss health
      fill(128, 0, 128);
      rect(boss.x, boss.y, boss.size, boss.size);

      // Health bar
      fill(255, 0, 0);
      rect(boss.x, boss.y - 20, boss.size * (boss.health/5), 10);

      // Boss collision check
      if (player.x < boss.x + boss.size && player.x + player.width > boss.x &&
          player.y < boss.y + boss.size && player.y + player.height > boss.y) {
          if (player.y + player.height <= boss.y + 10 && player.velocityY > 0) {
              boss.health--;
              score += 200;
              player.velocityY = -player.jumpStrength/1.5;

              // Visual feedback for successful hit
              fill(255, 255, 0, 150);
              rect(0, 0, width, height);

              if (boss.health <= 0) {
                  gameState = "win";
                  saveHighScore();
              }
          } else if (!player.isInvincible) {
              lives--;
              if (lives <= 0) {
                  gameState = "gameOver";
                  saveHighScore();
              } else {
                  loadLevel();
              }
          }
      }
  }

  if (player.y > height) {
    lives--;
    if (lives > 0) {
      loadLevel();
    } else {
      gameState = "gameOver";
      saveHighScore();
    }
  }
}

function loadLevel() {
  player.x = 50;
  player.y = height - 50;
  player.velocityY = 0;

  let currentLevel = levels[level];

  // Load platforms from the current level
  platforms = currentLevel.platforms;

  // Load enemies from the current level
  enemies = [];
  for (let enemyData of currentLevel.enemies) {
    enemies.push(new Enemy(enemyData.x, enemyData.y, enemyData.speed));
  }

  // Load coins from the current level
  coins = [];
  for (let coinData of currentLevel.coins) {
    coins.push(new Coin(coinData.x, coinData.y));
  }

  // Load powerups from the current level
  powerups = [];
  for (let powerupData of currentLevel.powerups) {
    powerups.push(new Powerup(powerupData.x, powerupData.y, powerupData.type));
  }

  // Reset boss health for the boss level (Level 4)
  if (level === 3) {
    levels[3].boss.health = 5;
  }
}

function drawHUD() {
  fill(0, 0, 0, 180);
  noStroke();
  rect(0, 0, 200, 120); // Made panel slightly taller
  
  textAlign(LEFT);
  textSize(20);
  
  fill(255, 50, 50);
  text("♥ " + lives, 20, 30);
  
  fill(255, 215, 0);
  text("★ " + score, 20, 55);
  
  fill(255, 140, 0);
  text("🏆 " + highScore, 20, 80);
  
  fill(100, 255, 255);
  text("Level " + (level + 1), 120, 30);

 
  fill(255, 223, 0);
  text("🪙 " + coins.length, 120, 55);

  // Display active powerups
  let powerupY = 140;
  for (let powerup of activePowerups) {
    fill(255);
    text(powerup.type.toUpperCase(), 20, powerupY);
    powerupY += 25;
  }
}


function keyPressed() {
  if (key === " " || keyCode === UP_ARROW) {
    player.jump();
  }

  if (keyCode === ENTER) {
    if (gameState === "title") {
      gameState = "instructions";
    } else if (gameState === "instructions") {
      gameState = "playing";
    } else if (gameState === "gameOver" || gameState === "win") {
      resetGame();
    }
  }

  if (key === "p" || key === "P") {
    if (gameState === "playing") {
      gameState = "paused";
    } else if (gameState === "paused") {
      gameState = "playing";
    }
  }
}

function resetGame() {
  gameState = "title";
  lives = 3;
  score = 0;
  level = 0;
  levels[3].boss.health = 5;
  loadLevel();
}

function saveHighScore() {
  highScore = max(highScore, score);
  localStorage.setItem("highScore", highScore);
}

function showTitleScreen() {
  textAlign(CENTER);
  fill(0);
  textSize(32);
  text("Platformer Game", width / 2, height / 3);
  textSize(24);
  text("Press ENTER to Start", width / 2, height / 2);
}

function showInstructions() {
  textAlign(CENTER);
  fill(0);
  textSize(24);
  text("Instructions:", width / 2, height / 3);
  textSize(18);
  text("Use LEFT and RIGHT arrows to move", width / 2, height / 2 - 40);
  text("Press SPACE or UP arrow to jump", width / 2, height / 2 - 10);
  text("Collect coins and powerups", width / 2, height / 2 + 20);
  text("Avoid or jump on enemies", width / 2, height / 2 + 50);
  text("Press P to Pause/Resume", width / 2, height / 2 + 80);
  text("Press ENTER to Start", width / 2, height / 2 + 120);
}

function showGameOverScreen() {
  background(0);
  textAlign(CENTER);
  fill(255);
  textSize(32);
  text("Game Over", width / 2, height / 3);
  textSize(24);
  text(`Your Score: ${score}`, width / 2, height / 2 - 20);
  text(`High Score: ${highScore}`, width / 2, height / 2 + 20);
  text("Press ENTER to Restart", width / 2, height / 2 + 80);
}

function showWinScreen() {
  background(0, 153, 0);
  textAlign(CENTER);
  fill(255);
  textSize(32);
  text("Congratulations! You Beat the Game!", width / 2, height / 3);
  textSize(24);
  text(`Final Score: ${score}`, width / 2, height / 2 - 20);
  text(`High Score: ${highScore}`, width / 2, height / 2 + 20);
  text("Press ENTER to Play Again", width / 2, height / 2 + 80);
}

function showPauseMenu() {
  textAlign(CENTER);
  fill(0);
  textSize(32);
  text("Paused", width / 2, height / 2);
  textSize(24);
  text("Press P to Resume", width / 2, height / 2 + 40);
}
