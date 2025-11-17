//#region CONSTANTS ------------------------------------------------------------------
const FPS = 1000 / 60;
const STATES = { MENU: 1, PLAY: 2, GAMEOVER: 3 };
const INVADER_ROWS = 4;

//#endregion

//#region Game variables -------------------------------------------------------------
const scene = document.getElementById("scene");
const brush = getBrush();

let currentState = STATES.MENU;

// ------ SCORE & HIGHSCORE

let score = 0;
let highScore = 0;
let showHighScoreScreen = false;

// ------

const MENU = {
  currentIndex: 0,
  buttons: [
    { text: "Play", action: startPlay },
    { text: "High Scores", action: showHigScores },
  ],
};

// ------

const ship = {
  x: scene.width * 0.5 - 50,
  y: scene.height - 30,
  width: 50,
  height: 20,
  velocityX: 0,
  velocityY: 0,
  maxVelocity: 3,
};

// ------

const projectieWidth = 3;
const projectileHeight = 5;
const projectileSpeed = 2;
const projectileCooldown = 40;
let cooldown = 0;
let projectiles = [];

// ------ INVADERS

const NPC = {
  width: 50,
  height: 20,
  padding: 20,
  sx: 50,
  sy: 20,
  speed: 1,
  direction: 1,
  enteties: [],
};

const npcPerRow = Math.floor(
  (scene.width - NPC.height) / (NPC.width + NPC.height)
);

// ------ MOVEMENT STEPS

// Movment back and forth of NPC´s are govered by counting up to a level
const maxMovmentSteps = 50;
let movmentSteps = maxMovmentSteps;

// ------ INPUT
// The following is a simple way of
let controllKeys = {
  ArrowDown: false,
  ArrowUp: false,
  ArrowLeft: false,
  ArrowRight: false,
  " ": false, // space
};

window.addEventListener("keydown", function (e) {
  controllKeys[e.key] = true;
});

window.addEventListener("keyup", function (e) {
  controllKeys[e.key] = false;
});

// ------ UFO (Bonus)

const UFO = {
  active: false,
  x: 0,
  y: 30,
  width: 60,
  height: 20,
  speed: 2,
  dir: 1,
  score: 100,
};

let ufoSpawnTimer = 0;

function getRandomUfoTime() {
  // random time between ~3 and 8 seconds (assuming 60fps)
  return 60 * (3 + Math.random() * 5);
}

//#endregion

//#region Game engine ----------------------------------------------------------------

function init() {
  loadHighScore();
  currentState = STATES.MENU;
  update();
}

function update(time) {
  if (currentState === STATES.MENU) {
    updateMenu(time);
  } else if (currentState === STATES.PLAY) {
    updateGame(time);
  } else if (currentState === STATES.GAMEOVER) {
    updateGameOver(time);
  }

  draw();
  requestAnimationFrame(update);
}

function draw() {
  clearScreen();

  if (currentState === STATES.MENU) {
    drawMenu();
  } else if (currentState === STATES.PLAY) {
    drawGameState();
  } else if (currentState === STATES.GAMEOVER) {
    drawGameOver();
  }
}

init(); // Starts the game

//#endregion

//#region Game functions

function updateMenu(dt) {
  if (showHighScoreScreen) {
    if (controllKeys[" "]) {
      showHighScoreScreen = false;
    }
    return;
  }

  if (controllKeys[" "]) {
    MENU.buttons[MENU.currentIndex].action();
  }

  if (controllKeys.ArrowUp) {
    MENU.currentIndex--;
  } else if (controllKeys.ArrowDown) {
    MENU.currentIndex++;
  }

  MENU.currentIndex = clamp(MENU.currentIndex, 0, MENU.buttons.length - 1);
}

function drawMenu() {
  if (showHighScoreScreen) {
    brush.font = "40px serif";
    brush.fillStyle = "Black";
    brush.fillText("High Score", 100, 100);
    brush.font = "30px serif";
    brush.fillText(highScore.toString(), 100, 150);
    brush.font = "20px serif";
    brush.fillText("Press SPACE to return", 100, 200);
    return;
  }

  let sy = 100;
  for (let i = 0; i < MENU.buttons.length; i++) {
    let text = MENU.buttons[i].text;
    if (i == MENU.currentIndex) {
      text = `* ${text} *`;
    }

    brush.font = "50px serif";
    brush.fillStyle = "Black";
    brush.fillText(text, 100, sy);
    sy += 50;
  }
}

function updateGame(dt) {
  updateShip();
  updateProjectiles();
  updateInvaders();
  updateUFO();

  if (didInvaderReachPlayer()) {
    startGameOver();
  } else if (allInvadersDead()) {
    startNextWave();
  }
}

function updateInvaders() {
  let ty = 0;

  if (NPC.direction == 1 && movmentSteps >= maxMovmentSteps * 2) {
    movmentSteps = 0;
    NPC.direction *= -1;
  } else if (NPC.direction == -1 && movmentSteps >= maxMovmentSteps * 2) {
    movmentSteps = 0;
    NPC.direction *= -1;
    ty += NPC.height;
  }

  let tx = NPC.speed * NPC.direction;

  // UPDATED: loop over all enteties
  for (let i = 0; i < NPC.enteties.length; i++) {
    let invader = NPC.enteties[i];

    if (invader.active) {
      invader.x += tx;
      invader.y += ty;

      if (isShot(invader)) {
        invader.active = false;
      }
    }
  }

  movmentSteps++;
}

// check if any invader reached the ship level -> GAME OVER
function didInvaderReachPlayer() {
  for (let invader of NPC.enteties) {
    if (invader.active) {
      if (invader.y + invader.height >= ship.y) {
        return true;
      }
    }
  }
  return false;
}

// check if all invaders are dead to start next wave
function allInvadersDead() {
  for (let invader of NPC.enteties) {
    if (invader.active) {
      return false;
    }
  }
  return true;
}

// UFO movement and collision
function updateUFO() {
  if (!UFO.active) {
    ufoSpawnTimer--;
    if (ufoSpawnTimer <= 0) {
      UFO.active = true;
      UFO.dir = Math.random() < 0.5 ? 1 : -1;
      if (UFO.dir === 1) {
        UFO.x = -UFO.width;
      } else {
        UFO.x = scene.width;
      }
      UFO.y = 30;
    }
    return;
  }

  UFO.x += UFO.speed * UFO.dir;

  // off-screen -> inactive and reset timer
  if (
    (UFO.dir === 1 && UFO.x > scene.width) ||
    (UFO.dir === -1 && UFO.x + UFO.width < 0)
  ) {
    UFO.active = false;
    ufoSpawnTimer = getRandomUfoTime();
  }

  // check if shot
  for (let i = 0; i < projectiles.length; i++) {
    let projectile = projectiles[i];
    if (
      projectile.active &&
      overlaps(
        UFO.x,
        UFO.y,
        UFO.width,
        UFO.height,
        projectile.x,
        projectile.y,
        projectile.width,
        projectile.height
      )
    ) {
      projectile.active = false;
      UFO.active = false;
      score += UFO.score;
      ufoSpawnTimer = getRandomUfoTime();
      break;
    }
  }
}

function isShot(target) {
  for (let i = 0; i < projectiles.length; i++) {
    let projectile = projectiles[i];
    if (
      projectile.active &&
      overlaps(
        target.x,
        target.y,
        target.width,
        target.height,
        projectile.x,
        projectile.y,
        projectile.width,
        projectile.height
      )
    ) {
      projectile.active = false;

      //use target.score if present, otherwise default
      if (typeof target.score === "number") {
        score += target.score;
      } else {
        score += 10;
      }

      return true;
    }
  }

  return false;
}

function updateShip() {
  if (controllKeys.ArrowLeft) {
    ship.velocityX--;
  } else if (controllKeys.ArrowRight) {
    ship.velocityX++;
  }

  ship.velocityX = clamp(
    ship.velocityX,
    ship.maxVelocity * -1,
    ship.maxVelocity
  );

  let tmpX = ship.x + ship.velocityX;
  tmpX = clamp(tmpX, 0, scene.width - ship.width);

  ship.x = tmpX;

  cooldown--;

  if (controllKeys[" "] && cooldown <= 0) {
    projectiles.push({
      x: ship.x + ship.width * 0.5,
      y: ship.y,
      dir: -1,
      active: true,
      width: projectieWidth,
      height: projectileHeight,
    });
    cooldown = projectileCooldown;
  }
}

function updateProjectiles() {
  let activeProjectiles = [];
  for (let i = 0; i < projectiles.length; i++) {
    let projectile = projectiles[i];
    projectile.y += projectileSpeed * projectile.dir;
    if (projectile.y + projectileHeight > 0 && projectile.active) {
      activeProjectiles.push(projectile);
    }
  }
  projectiles = activeProjectiles;
}

function drawGameState() {
  // HUD
  brush.font = "20px serif";
  brush.fillStyle = "Black";
  brush.fillText("Score: " + score, 10, 20);
  brush.fillText("High: " + highScore, 10, 40);

  // Ship
  brush.fillStyle = "Black";
  brush.fillRect(ship.x, ship.y, ship.width, ship.height);

  // Projectiles
  for (let projectile of projectiles) {
    if (projectile.active) {
      brush.fillRect(
        projectile.x,
        projectile.y,
        projectieWidth,
        projectileHeight
      );
    }
  }

  // Invaders
  for (let i = 0; i < NPC.enteties.length; i++) {
    let invader = NPC.enteties[i];
    if (invader.active) {
      brush.fillStyle = invader.color;
      brush.fillRect(invader.x, invader.y, NPC.width, NPC.height);
    }
  }

  // UFO
  if (UFO.active) {
    brush.fillStyle = "Purple";
    brush.fillRect(UFO.x, UFO.y, UFO.width, UFO.height);
  }
}

// GAME OVER STATE

function startPlay() {
  resetGame();
  currentState = STATES.PLAY;
}

function startNextWave() {
  // slightly faster each wave
  NPC.speed += 0.2;
  movmentSteps = maxMovmentSteps;
  resetShipPosition();
  createWave();
}

function startGameOver() {
  saveHighScore();
  currentState = STATES.GAMEOVER;
}

function updateGameOver(dt) {
  // Wait for SPACE to return to menu
  if (controllKeys[" "]) {
    currentState = STATES.MENU;
  }
}

function drawGameOver() {
  brush.font = "50px serif";
  brush.fillStyle = "Black";
  brush.fillText("GAME OVER", 100, 150);

  brush.font = "25px serif";
  brush.fillText("Score: " + score, 100, 200);
  brush.fillText("High Score: " + highScore, 100, 230);
  brush.fillText("Press SPACE for Menu", 100, 270);
}

function showHigScores() {
  showHighScoreScreen = true;
}

//#endregion

//#region Utility functions ----------------------------------------------------------

function getBrush() {
  return scene.getContext("2d");
}

function clearScreen() {
  if (brush) {
    brush.clearRect(0, 0, scene.width, scene.height);
  }
}

function clamp(val, min, max) {
  return Math.min(Math.max(val, min), max);
}

function overlaps(x1, y1, w1, h1, x2, y2, w2, h2) {
  if (x1 + w1 < x2 || x2 + w2 < x1) {
    return false;
  }

  if (y1 + h1 < y2 || y2 + h2 < y1) {
    return false;
  }

  return true;
}

// create a new wave of invaders with multiple rows
function createWave() {
  NPC.enteties = [];

  let colors = ["Yellow", "Red", "Green", "Blue"];
  let y = NPC.sy;

  for (let row = 0; row < INVADER_ROWS; row++) {
    let x = NPC.sx;
    for (let i = 0; i < npcPerRow; i++) {
      NPC.enteties.push({
        x,
        y,
        color: colors[row % colors.length],
        active: true,
        width: NPC.width,
        height: NPC.height,
        row: row,
        // higher rows worth more points
        score: (INVADER_ROWS - row) * 10,
      });
      x += NPC.width + NPC.padding;
    }
    y += NPC.height + NPC.padding;
  }
}

// resets everything for a NEW game
function resetGame() {
  score = 0;
  cooldown = 0;
  projectiles = [];
  NPC.speed = 1;
  NPC.direction = 1;
  movmentSteps = maxMovmentSteps;
  resetShipPosition();
  createWave();
  UFO.active = false;
  ufoSpawnTimer = getRandomUfoTime();
}

function resetShipPosition() {
  ship.x = scene.width * 0.5 - ship.width;
  ship.velocityX = 0;
}

// high score helpers
function loadHighScore() {
  try {
    const stored = localStorage.getItem("highScore");
    if (stored !== null) {
      highScore = parseInt(stored) || 0;
    }
  } catch (e) {
    highScore = 0;
  }
}

function saveHighScore() {
  if (score > highScore) {
    highScore = score;
    try {
      localStorage.setItem("highScore", highScore);
    } catch (e) {
      // ignore if localStorage not available
    }
  }
}

//#endregion
