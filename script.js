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
let lives = 30;
let highScore = 0;
let score = 0;
let powerups = [];
let activePowerups = [];
let pauseButton = {
  x: 720,
  y: 20,
  width: 60,
  height: 30,
};
let flashValue = 0;
let flashDirection = 1;
let gameOverAngle = 0;
let particleSystem = [];
let tumbleweed;
let dustParticles = [];
let finalTreasure = null;

function setup() {
  createCanvas(800, 595);
  player = new Player();
  tumbleweed = { x: -50, y: height - 50 };
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
        { x: 100, y: 300, type: "invincibility" },
        { x: 500, y: 200, type: "speed" },
        { x: 400, y: 300, type: "gun" },
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
        attackPattern: 0,
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
    this.duration = this.type === "invincibility" ? 10000 : 5000;
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
    this.hasGun = false;
    this.bullets = [];
    this.bulletSpeed = 8;
    this.shootCooldown = 20;
    this.shootTimer = 0;
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

    if (this.shootTimer > 0) {
      this.shootTimer--;
    }

    // Update bullets
    for (let i = this.bullets.length - 1; i >= 0; i--) {
      let bullet = this.bullets[i];
      bullet.x += this.bulletSpeed * bullet.dir;

      // Remove bullets that are off screen
      if (bullet.x < 0 || bullet.x > width) {
        this.bullets.splice(i, 1);
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
      case "gun":
        fill(255, 69, 0); // Bright orange-red for gun powerup
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
      case "gun":
        this.hasGun = false;
        this.bullets = [];
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

    if (this.hasGun) {
      // Draw bullets
      fill(255, 255, 0);
      for (let bullet of this.bullets) {
        ellipse(bullet.x, bullet.y, 8, 8);
      }
    }
  }

  shoot() {
    if (this.hasGun && this.shootTimer <= 0) {
      this.bullets.push({
        x: this.x + this.width / 2,
        y: this.y + this.height / 2,
        dir: keyIsDown(LEFT_ARROW) ? -1 : 1,
      });
      this.shootTimer = this.shootCooldown;
    }
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
  background(255, 87, 51);

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

      if (player.hitsEnemy(enemy)) {
        if (
          player.isInvincible ||
          (player.y + player.height <= enemy.y + 5 && player.velocityY > 0)
        ) {
          score += 100;
          enemies.splice(i, 1);
          player.velocityY = -player.jumpStrength / 1.5;

          if (enemies.length === 0 && coins.length === 0) {
            level++;
            if (level < levels.length) {
              loadLevel();
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

  // Handle coins
  for (let i = coins.length - 1; i >= 0; i--) {
    let coin = coins[i];
    coin.show();

    if (player.collectsCoin(coin)) {
      coins.splice(i, 1);
      score += 50;

      if (coins.length === 0 && level < 3) {
        level++;
        if (level < levels.length) {
          loadLevel();
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
      boss.projectiles.push(
        new BossProjectile(
          boss.x + boss.size / 2,
          boss.y + boss.size / 2,
          player.x,
          player.y
        )
      );
    }

    // Different movement patterns
    switch (boss.attackPattern) {
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
      if (
        !player.isInvincible &&
        dist(
          proj.x,
          proj.y,
          player.x + player.width / 2,
          player.y + player.height / 2
        ) <
          proj.size + player.width / 2
      ) {
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
    rect(boss.x, boss.y - 20, boss.size * (boss.health / 5), 10);

    // Boss collision check
    if (
      player.x < boss.x + boss.size &&
      player.x + player.width > boss.x &&
      player.y < boss.y + boss.size &&
      player.y + player.height > boss.y
    ) {
      if (player.y + player.height <= boss.y + 10 && player.velocityY > 0) {
        boss.health--;
        score += 200;
        player.velocityY = -player.jumpStrength / 1.5;

        // Visual feedback for successful hit
        fill(255, 255, 0, 150);
        rect(0, 0, width, height);

        if (boss.health <= 0) {
          finalTreasure = {
            x: boss.x,
            y: boss.y,
            size: 40,
            collected: false,
            angle: 0,
          };
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

  // Handle final treasure
  if (finalTreasure && !finalTreasure.collected) {
    push();
    translate(
      finalTreasure.x + finalTreasure.size / 2,
      finalTreasure.y + finalTreasure.size / 2
    );
    finalTreasure.angle += 0.05;
    rotate(finalTreasure.angle);
    textSize(40);
    text("💎", -20, 20);
    pop();

    if (
      player.x < finalTreasure.x + finalTreasure.size &&
      player.x + player.width > finalTreasure.x &&
      player.y < finalTreasure.y + finalTreasure.size &&
      player.y + player.height > finalTreasure.y
    ) {
      finalTreasure.collected = true;
      score += 1000;
      setTimeout(() => {
        gameState = "win";
        saveHighScore();
      }, 500);
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

  // Draw pause button with pause symbol
  fill(0, 0, 0, 180);
  rect(pauseButton.x, pauseButton.y, pauseButton.width, pauseButton.height);

  // Draw pause symbol (two white rectangles)
  fill(255);
  rect(pauseButton.x + 20, pauseButton.y + 5, 6, 20);
  rect(pauseButton.x + 34, pauseButton.y + 5, 6, 20);
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

  if (key === "t" || key === "T") {
    player.shoot();
  }

  if ((key === "r" || key === "R") && gameState === "paused") {
    resetGame();
    gameState = "playing";
  }
}

// function to handle mouse clicks
function mouseClicked() {
  if (gameState === "playing" || gameState === "paused") {
    if (
      mouseX > pauseButton.x &&
      mouseX < pauseButton.x + pauseButton.width &&
      mouseY > pauseButton.y &&
      mouseY < pauseButton.y + pauseButton.height
    ) {
      gameState = gameState === "playing" ? "paused" : "playing";
    }
  }
  if (gameState === "paused") {
    // Check for resume button click
    if (
      mouseX > width / 2 - 100 &&
      mouseX < width / 2 + 100 &&
      mouseY > height / 2 - 20 &&
      mouseY < height / 2 + 20
    ) {
      gameState = "playing";
    }
    // Check for restart button click
    if (
      mouseX > width / 2 - 100 &&
      mouseX < width / 2 + 100 &&
      mouseY > height / 2 + 40 &&
      mouseY < height / 2 + 80
    ) {
      resetGame();
      gameState = "playing";
    }
  }
}

function resetGame() {
  gameState = "title";
  lives = 30;
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
  background(255, 223, 0); // Yellow background

  // Flash effect
  flashValue += flashDirection * 5;
  if (flashValue > 255 || flashValue < 0) {
    flashDirection *= -1;
  }

  textAlign(CENTER);
  textStyle(BOLD);

  // Main title with shadow effect
  fill(0, 0, 0, 50);
  textSize(52);
  text("GOLD RUSH", width / 2 + 3, height / 3 + 3);

  // Flashing main title
  fill(139, 69, 19, flashValue); // Brown color with flash effect
  textSize(52);
  text("GOLD RUSH", width / 2, height / 3);

  // Subtitle
  fill(0);
  textStyle(NORMAL);
  textSize(24);
  text("Press ENTER to Start", width / 2, height / 2);
}

function showInstructions() {
  background(255, 223, 0); // Matching yellow background

  // Rotating coin effect at the top
  push();
  translate(width / 2, 100);
  rotate(frameCount * 0.05);
  textSize(60);
  text("🪙", 0, 0);
  pop();

  // Main instructions with visual flair
  textAlign(CENTER);
  fill(139, 69, 19); // Rich brown color
  textSize(36);
  text("HOW TO PLAY", width / 2, 180);

  // Instructions with icons
  textSize(24);
  fill(0);
  text("🏃 LEFT/RIGHT Arrows to Move", width / 2, height / 2 - 80);
  text("⬆️ SPACE/UP to Jump", width / 2, height / 2 - 40);
  text("💰 Collect Gold for Points", width / 2, height / 2);
  text("⚡ Grab Power-ups for Abilities", width / 2, height / 2 + 40);
  text("💀 Jump on Enemies to Defeat Them", width / 2, height / 2 + 80);
  text("⏸️ Press P to Pause", width / 2, height / 2 + 120);

  // Pulsing start prompt
  let pulseValue = sin(frameCount * 0.05) * 127 + 128;
  fill(139, 69, 19, pulseValue);
  textSize(28);
  text("Press ENTER to Start Your Adventure!", width / 2, height - 100);
}

function showGameOverScreen() {
  // Dark gradient background
  let c1 = color(40, 0, 0);
  let c2 = color(0, 0, 0);
  for (let y = 0; y < height; y++) {
    let inter = map(y, 0, height, 0, 1);
    let c = lerpColor(c1, c2, inter);
    stroke(c);
    line(0, y, width, y);
  }

  // Rotating skull emoji
  gameOverAngle += 0.02;
  push();
  translate(width / 2, height / 3 - 40);
  rotate(gameOverAngle);
  textSize(60);
  text("💀", 0, 0);
  pop();

  // Game Over text with glow effect
  textAlign(CENTER);
  textSize(48);

  // Glow effect
  fill(255, 0, 0, 50);
  text("GAME OVER", width / 2 + 4, height / 3 + 4);
  text("GAME OVER", width / 2 - 4, height / 3 - 4);

  fill(255, 0, 0);
  text("GAME OVER", width / 2, height / 3);

  // Score display with golden color
  fill(255, 215, 0);
  textSize(32);
  text(`Final Score: ${score}`, width / 2, height / 2);
  text(`High Score: ${highScore}`, width / 2, height / 2 + 50);

  // Pulsing restart text
  let pulseValue = sin(frameCount * 0.05) * 127 + 128;
  fill(255, pulseValue);
  textSize(24);
  text("Press ENTER to Try Again", width / 2, height - 100);

  // Add particles
  if (frameCount % 10 === 0) {
    particleSystem.push({
      x: random(width),
      y: height + 10,
      speed: random(2, 5),
      size: random(3, 8),
    });
  }

  // Update and display particles
  for (let i = particleSystem.length - 1; i >= 0; i--) {
    let p = particleSystem[i];
    p.y -= p.speed;
    fill(255, 0, 0, 150);
    noStroke();
    ellipse(p.x, p.y, p.size);

    if (p.y < -10) {
      particleSystem.splice(i, 1);
    }
  }
}

function showWinScreen() {
  // Desert sunset gradient background
  let c1 = color(255, 140, 0); // Orange sky
  let c2 = color(139, 69, 19); // Brown ground
  for (let y = 0; y < height; y++) {
    let inter = map(y, 0, height, 0, 1);
    let c = lerpColor(c1, c2, inter);
    stroke(c);
    line(0, y, width, y);
  }

  // Rolling tumbleweed
  tumbleweed.x += 3;
  if (tumbleweed.x > width + 50) tumbleweed.x = -50;
  push();
  translate(tumbleweed.x, tumbleweed.y);
  rotate(frameCount * 0.1);
  textSize(40);
  text("🌵", 0, 0);
  pop();

  // Generate dust particles
  if (frameCount % 5 === 0) {
    dustParticles.push({
      x: random(width),
      y: height - 20,
      size: random(3, 8),
      speedX: random(1, 3),
      speedY: random(-0.5, -2),
      life: 255,
    });
  }

  // Update and show dust particles
  for (let i = dustParticles.length - 1; i >= 0; i--) {
    let p = dustParticles[i];
    p.x += p.speedX;
    p.y += p.speedY;
    p.life -= 2;
    fill(210, 180, 140, p.life);
    noStroke();
    ellipse(p.x, p.y, p.size);

    if (p.life <= 0) dustParticles.splice(i, 1);
  }

  // Main victory text with western font style
  textAlign(CENTER);
  textSize(60);

  // Text shadow
  fill(139, 69, 19);
  text("YEEHAW!", width / 2 + 4, height / 3 + 4);

  // Main text with gold color
  fill(255, 215, 0);
  text("YEEHAW!", width / 2, height / 3);

  // Score display in wanted poster style
  drawWantedPoster();

  // Bouncing replay text
  let bounceY = sin(frameCount * 0.1) * 10;
  fill(255);
  textSize(24);
  text("Press ENTER to Ride Again, Partner!", width / 2, height - 80 + bounceY);
}

function drawWantedPoster() {
  // Wanted poster background
  fill(255, 233, 175);
  rect(width / 2 - 150, height / 2, 300, 200);

  // Poster border
  stroke(139, 69, 19);
  strokeWeight(3);
  rect(width / 2 - 145, height / 2 + 5, 290, 190);

  // Poster text
  noStroke();
  fill(139, 69, 19);
  textSize(32);
  text("REWARD", width / 2, height / 2 + 40);

  textSize(28);
  text(`${score} GOLD`, width / 2, height / 2 + 100);

  textSize(24);
  text(`High Score: ${highScore}`, width / 2, height / 2 + 150);
}

function showPauseMenu() {
  // Semi-transparent dark overlay
  fill(0, 0, 0, 150);
  rect(0, 0, width, height);

  // Centered menu box
  fill(255, 233, 175);
  stroke(139, 69, 19);
  strokeWeight(4);
  rect(width / 2 - 200, height / 2 - 150, 400, 300);

  // Menu title
  textAlign(CENTER);
  noStroke();
  fill(139, 69, 19);
  textSize(48);
  text("PAUSED", width / 2, height / 2 - 80);

  // Menu options with hover effects
  textSize(24);

  // Resume button
  if (
    mouseX > width / 2 - 100 &&
    mouseX < width / 2 + 100 &&
    mouseY > height / 2 - 20 &&
    mouseY < height / 2 + 20
  ) {
    fill(255, 140, 0);
    text("Resume (P)", width / 2, height / 2);
  } else {
    fill(139, 69, 19);
    text("Resume (P)", width / 2, height / 2);
  }

  // Restart button
  if (
    mouseX > width / 2 - 100 &&
    mouseX < width / 2 + 100 &&
    mouseY > height / 2 + 40 &&
    mouseY < height / 2 + 80
  ) {
    fill(255, 140, 0);
    text("Restart (R)", width / 2, height / 2 + 60);
  } else {
    fill(139, 69, 19);
    text("Restart (R)", width / 2, height / 2 + 60);
  }
}
