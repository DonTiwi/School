import Component from "./component.mjs";
import { SPRITES, TILES } from "../tiles.mjs";

const MAX_HEALTH = 10;
const MIN_HEALTH = 0;

let player = {} // There can only be one player, and this is them. 

let animationTimer = 0; // Lazy animation solution 
const cells = [12, 13, 14] // these refere to a sequence of cells in heros.png, together they make an animation
let cellIndex = 0; // The current cell that we are rendering 
let cellRow = 3; // this is the row in heros.png that we are collecting the image from 

function createPlayer(data) {

    player = {
        ...Component.createComponent(data),
        // We have added all the random attributes that we considerd nessasary for the player to have. 
        // Maybe these are to many, or maybe they are to few.
        inventory: {},
        health: MAX_HEALTH,
        strength: 1.0,
        dodge: 0.2,
        dexterity: 0.5,
        force: { min: 1, max: 5 },
    }

    return player;
}

function draw(ctx) {

    // The following is a messy lazy way of animating the player (this is not movment).
    let cell = cells[cellIndex];
    animationTimer++;
    if (animationTimer > 100) {
        animationTimer = 0;
        cellIndex++;
        if (cellIndex >= cells.length) {
            cellIndex = 0;
        }
    }

    // And now we actualy draw the players representation
    Component.draw(ctx, player, SPRITES.heros, cell, cellRow);

}


const Player = {
    createPlayer,
    addToInventory: (item) => { player.inventory[item] = (player.inventory[item] || 0) + 1; },
    removeFromInventory: (item) => { player.inventory[item] = Math.max(0, (player.inventory[item] || 0) - 1); },
    hasItemInInventory: (item) => { return player.inventory[item] != undefined && player.inventory[item] > 0 },
    draw,
    MAX_HEALTH,
    MIN_HEALTH
}

export default Player