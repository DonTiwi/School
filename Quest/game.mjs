import { debug, displayDebugInfo } from "./debug.mjs";
import DIMENSIONS from "./dimensions.mjs";
import GAME_STATES from "./gameStates.mjs";
import { SPRITES, TILE_KEYS, TILES } from "./tiles.mjs";
import getGameLevelDataFrom from "./level.mjs";
import KEYS from "./io.mjs";
import {
  addComment,
  drawComments,
  getComments,
  updateComments,
} from "./commentator.mjs";
import Zombie from "./components/zombie.mjs";
import Component from "./components/component.mjs";
import Player from "./components/player.mjs";
import Potion from "./components/potion.mjs";
import Tools from "./util.mjs";

const _td = DIMENSIONS.tileDimension;
const _rows = DIMENSIONS.screenRows; // Remember that rows are y (vertical)
const _cols = DIMENSIONS.screenColumns; // Remember that cols are x (horizontal)
const _sx = DIMENSIONS.startX;
const _sy = DIMENSIONS.startY;
const _width = DIMENSIONS.totalWidth;
const _height = DIMENSIONS.totalHeight;

const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");

canvas.setAttribute("width", DIMENSIONS.totalWidth);
canvas.setAttribute("height", DIMENSIONS.totalHeight);

const PLAYER_SYMBOLE = "H";

let level = null;
let background = null;
let player = null;
let components = [];

let isGameOver = false;

const LEVEL_FILES = [
  "./levels/level1.lvl",
  "./levels/level2.lvl",
  "./levels/level3.lvl",
];
let currentLevelIndex = 0;

let gameState = GAME_STATES.idle;
let splashTimer = 180;

const MENU_OPTIONS = ["Start Game", "Instructions", "Quit to Splash"];
let selectedMenuIndex = 0;
let showInstructions = false;

//#region GAME ENGINE

async function init() {
  level = await getGameLevelDataFrom(LEVEL_FILES[currentLevelIndex]);
  background = renderStructure(level.structure); // This is a solution to save us drawing later, It draws the full map to the background variable.

  // The following loop creates all the game components.
  // It is messy and could be simpler
  for (let i = 0; i < level.components.length; i++) {
    if (level.components[i][0].trim() == PLAYER_SYMBOLE) {
      player = Player.createPlayer(level.components[i]);
    } else {
      let comp = null;
      switch (level.components[i][0]) {
        case Component.ids.zombie:
          comp = Zombie.createZombie(level.components[i]);
          break;

        case Component.ids.potion:
          comp = Potion.createPotion(level.components[i]);
          break;

        default:
          comp = Component.createComponent(level.components[i]);
          break;
      }

      components.push(comp);
    }
  }

  // Start from splash screen when game is initialised
  gameState = GAME_STATES.idle;

  loop();
}

async function loadNextLevel() {
  currentLevelIndex++;
  if (currentLevelIndex >= LEVEL_FILES.length) {
    addComment("You escaped the dungeon!");
    isGameOver = true;
    return;
  }
  level = await getGameLevelDataFrom(LEVEL_FILES[currentLevelIndex]);
  background = renderStructure(level.structure);
  player = Player.createPlayer([
    "H",
    player.row,
    player.col,
    "health",
    player.health,
  ]); // keep player stats
  components = [];

  for (let i = 0; i < level.components.length; i++) {
    if (level.components[i][0].trim() === PLAYER_SYMBOLE) continue; // skip extra player lines
    let comp = null;
    switch (level.components[i][0]) {
      case Component.ids.zombie:
        comp = Zombie.createZombie(level.components[i]);
        break;
      case Component.ids.potion:
        comp = Potion.createPotion(level.components[i]);
        break;
      default:
        comp = Component.createComponent(level.components[i]);
        break;
    }
    components.push(comp);
  }

  addComment("Loaded Level " + (currentLevelIndex + 1));
}

function loop() {
  update();
  draw();
  requestAnimationFrame(loop);
}

async function update() {
  if (isGameOver) {
    return;
  }

  // Splash screen state, shown for a little while before the menu is shown.
  if (gameState === GAME_STATES.idle) {
    splashTimer--;
    if (splashTimer <= 0) {
      gameState = GAME_STATES.menu;
    }

    updateComments();
    return;
  }

  // Menu state. Use Up/Down to select, Left/Right to confirm.
  if (gameState === GAME_STATES.menu) {
    // Move the selection cursor
    if (KEYS.ArrowDown) {
      selectedMenuIndex = (selectedMenuIndex + 1) % MENU_OPTIONS.length;
    } else if (KEYS.ArrowUp) {
      selectedMenuIndex =
        (selectedMenuIndex - 1 + MENU_OPTIONS.length) % MENU_OPTIONS.length;
    }

    // Confirm the current option with Left or Right arrow
    if (KEYS.ArrowLeft || KEYS.ArrowRight) {
      handleMenuSelection();
    }

    updateComments();
    return;
  }

  // Only update the game when we are actually playing
  if (gameState !== GAME_STATES.play) {
    return;
  }

  let dr = 0;
  let dc = 0;

  if (KEYS.ArrowDown) {
    dr = 1;
  } else if (KEYS.ArrowUp) {
    dr = -1;
  }

  if (KEYS.ArrowLeft) {
    dc = -1;
  } else if (KEYS.ArrowRight) {
    dc = 1;
  }

  let tr = player.row + dr;
  let tc = player.col + dc;

  // Do not walk through walls.
  if (level.structure[tr][tc] !== TILES["."].symbole) {
    tr = player.row;
    tc = player.col;
  }

  // Interactions between player and components
  let keep = [];
  for (let component of components) {
    if (component.row == tr && component.col == tc) {
      if (component.symbole == "K") {
        Player.addToInventory("Key");
        addComment("Found a shiny new key");
      } else if (component.symbole == "D" && Player.hasItemInInventory("Key")) {
        Player.removeFromInventory("Key");

        if (
          component.row === 0 ||
          component.row === _rows - 1 ||
          component.col === 0 ||
          component.col === _cols - 1
        ) {
          addComment("You found the staircase!");
          await loadNextLevel();
          return;
        }

        addComment("Door unlocked to next room!");
      } else if (component.symbole == Component.ids.zombie) {
        tr = player.row;
        tc = player.col;

        Zombie.fightZombie(component, player);

        if (component.health > 0) {
          keep.push(component);
        }
      } else if (component.symbole == Component.ids.potion) {
        console.log(component);
        player[component.attribute] += component.effect;
        addComment(
          "You drank " + component.name + " effect is " + component.effect
        );
      } else {
        keep.push(component);
        tr = player.row;
        tc = player.col;
      }
    } else {
      if (component.symbole == "Z") {
        Zombie.update(component, level.structure);
      }

      keep.push(component);
    }
  }

  components = keep;

  player.row = tr;
  player.col = tc;

  if (player.health <= 0) {
    isGameOver = true;
  }

  updateComments();
}

function draw() {
  ctx.clearRect(0, 0, canvas.clientWidth, canvas.clientHeight);

  ctx.save();

  // Draw splash screen
  if (gameState === GAME_STATES.idle) {
    ctx.fillStyle = "black";
    ctx.fillRect(0, 0, _width, _height);

    ctx.fillStyle = "white";
    ctx.font = "60px 'Jacquard 12'";
    let txt = "QUEST";
    let bounds = Tools.getTextBounds(ctx, txt);
    let x = _width * 0.5 - bounds.width * 0.5;
    let y = _height * 0.5 - bounds.height * 0.5;
    ctx.fillText(txt, x, y);

    // Optional small subtitle
    ctx.font = "20px 'Jacquard 12'";
    let subTxt = "A tiny dungeon crawler";
    let subBounds = Tools.getTextBounds(ctx, subTxt);
    let sx = _width * 0.5 - subBounds.width * 0.5;
    ctx.fillText(subTxt, sx, y + 40);

    drawComments(ctx);

    // Code after this point is for debuging suport.
    if (debug) {
      displayDebugInfo(ctx);
    }

    ctx.restore();
    return;
  }

  // Draw menu screen
  if (gameState === GAME_STATES.menu) {
    ctx.fillStyle = "black";
    ctx.fillRect(0, 0, _width, _height);

    ctx.fillStyle = "white";
    ctx.font = "48px 'Jacquard 12'";
    let title = "Main Menu";
    let titleBounds = Tools.getTextBounds(ctx, title);
    let titleX = _width * 0.5 - titleBounds.width * 0.5;
    let titleY = DIMENSIONS.padding * 2;
    ctx.fillText(title, titleX, titleY);

    // Draw menu options
    ctx.font = "24px 'Jacquard 12'";
    let optionY = titleY + 60;

    for (let i = 0; i < MENU_OPTIONS.length; i++) {
      let label = MENU_OPTIONS[i];
      let prefix = i === selectedMenuIndex ? "> " : "  ";
      ctx.fillText(prefix + label, DIMENSIONS.padding * 2, optionY + i * 40);
    }

    // Small hint text
    let hintY = optionY + MENU_OPTIONS.length * 40 + 40;
    ctx.font = "18px 'Jacquard 12'";
    ctx.fillText(
      "Use Up/Down to choose, Left/Right to confirm.",
      DIMENSIONS.padding,
      hintY
    );

    // Optional instructions panel when the menu option is toggled
    if (showInstructions) {
      ctx.font = "18px 'Jacquard 12'";
      let infoY = hintY + 40;
      ctx.fillText(
        "In game: Arrow keys move your hero.",
        DIMENSIONS.padding,
        infoY
      );
      ctx.fillText(
        "Find keys, unlock doors, avoid zombies and traps.",
        DIMENSIONS.padding,
        infoY + 30
      );
    }

    drawComments(ctx);

    // Code after this point is for debugging support.
    if (debug) {
      displayDebugInfo(ctx);
    }

    ctx.restore();
    return;
  }

  // Game drawing (play state)
  ctx.drawImage(background, 0, 0);
  Player.draw(ctx);
  drawHUD(ctx);

  // The following loop draws all the remaning items.
  // It can be done much cleaner, infact there are clues in the current loop as to how it could be made cleaner.
  for (let item of components) {
    let y = item.row * _td + _sx;
    let x = item.col * _td + _sy;

    try {
      if (item.symbole == "P") {
        Potion.draw(ctx, item);
      } else {
        TILES[item.symbole].draw(ctx, x, y, _td, _td);
      }
    } catch (error) {
      console.warn("No draw function for ", type);
    }
  }

  if (isGameOver) {
    ctx.fillStyle = "White";
    ctx.font = "60px 'Jacquard 12'";
    let txt = "GAME OVER";
    let bounds = Tools.getTextBounds(ctx, txt);
    let x = _width * 0.5 - bounds.width * 0.5;
    let y = _height * 0.5 - bounds.height * 0.5;
    ctx.fillText(txt, x, y);
  } else {
    drawComments(ctx);
  }

  // Code after this point is for debuging suport.
  if (debug) {
    displayDebugInfo(ctx);
  }

  ctx.restore();
}

//#endregion

function drawHUD(ctx) {
  let healthDisplay = [
    "❤️",
    "❤️",
    "💛",
    "💛",
    "💛",
    "💚",
    "💚",
    "💚",
    "💚",
    "💚",
  ]
    .slice(0, player.health)
    .join("");
  healthDisplay = healthDisplay.padEnd(Player.MAX_HEALTH * 2, "💀");
  ctx.fillText(healthDisplay, DIMENSIONS.padding, DIMENSIONS.padding * 0.75);

  // Simple inventory display in HUD.
  // Shows if the player has a Key in their inventory.
  let inventoryItems = [];
  if (Player.hasItemInInventory && Player.hasItemInInventory("Key")) {
    inventoryItems.push("Key");
  }

  if (inventoryItems.length > 0) {
    let invText = "Inventory: " + inventoryItems.join(", ");
    ctx.fillText(invText, DIMENSIONS.padding, DIMENSIONS.padding * 1.5);
  }
}

function handleMenuSelection() {
  switch (selectedMenuIndex) {
    case 0: // Start Game
      gameState = GAME_STATES.play;
      addComment("Use arrow keys to move.");
      break;

    case 1: // Instructions (toggle help text)
      showInstructions = !showInstructions;
      addComment(
        showInstructions ? "Showing instructions." : "Hiding instructions."
      );
      break;

    case 2: // Quit to splash screen
      gameState = GAME_STATES.idle;
      splashTimer = 180;
      addComment("Returning to splash screen...");
      break;
  }
}

//#region utility functions

function renderStructure(structure) {
  const offscreen = new OffscreenCanvas(_width, _height);
  const ctx = offscreen.getContext("2d");

  for (let i = 0; i < _rows; i++) {
    for (let j = 0; j < _cols; j++) {
      if (structure.length > i && structure[i].length > j) {
        let type = structure[i][j];
        if (TILES[type]) {
          try {
            TILES[type].draw(ctx, _sx + j * _td, _sy + i * _td, _td, _td);
          } catch (err) {
            console.warn("No draw function for ", type);
          }
        } else {
          console.warn("Tile type is not defined ", type);
        }
      }
    }
  }

  return offscreen.transferToImageBitmap();
}

//#endregion

// Start game.
await init();
