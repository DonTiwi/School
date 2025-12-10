import { addComment } from "../commentator.mjs";
import Component from "./component.mjs";
import Tools from "../util.mjs";
import { TILE_KEYS } from "../tiles.mjs";
import Player from "./player.mjs";

const HEALTH = { min: 5, max: 10 }

function createZombie(data) {

    return {
        ...Component.createComponent(data), // This adds the base attributes of a component (symbole,row,col) to our zombie
        health: Tools.getRandomIntBetween(HEALTH.min, HEALTH.max),
        moveColDown: 0,
        dodge: Math.random() * 0.5,
        strength: 5,
        direction: 1,
    }
}

function update(zombie, map) {

    // This is the code that makes the Zombie shamble around.
    // The type of motion is known as a random walk.

    // this variable is just to add some time between the changes in location.
    zombie.moveColDown--;

    // decide what directions to move.
    let possibleMoves = [-1, 0, 1];
    let dr = Tools.drawRandomFrom(possibleMoves); // d is used as the greek delta meaning change, this therefor reads as the change in row.
    let dc = Tools.drawRandomFrom(possibleMoves); // same, but this reads as change in column,

    let tc = zombie.col + dc; // t is for temp, so it is the new temporary column
    let tr = zombie.row + dr; // new temporary row

    // Now we check that the temp location is not a wall, this is a ugly test. 
    // if it is empty and if enough time has elapsed, the zombie moves to that location.
    if (map[tr][tc] == "." && zombie.moveColDown <= 0) {
        zombie.row = tr;
        zombie.col = tc;
        zombie.moveColDown = Math.floor(Math.random() * 100) + 50;
    } else {
        // The zombie colides with a wall, so we do not update.
    }

}


function fightZombie(zombie, player) {

    // This long function only servers to figure out how much damage is dealt to the player and how much is delat to the zombie per interaction.

    let damageToPlayer = 0;
    // The Zombie is now going to fight the player, but the player might have a high enough dodge stat to avoid getting hit.
    if (Math.random() <= player.dodge) {
        // The player was skilled enough to dodge the attack.
        addComment("You dodged the zombies atack");
    } else {
        // The player moved to slow and gets mauled by the zombie
        damageToPlayer = Math.floor(Math.random() * zombie.strength);
        addComment("Zombie did " + damageToPlayer + " amount of damage");
    }

    // The player attacks the zombie
    let damageToZombie = player.strength * ((Math.floor(Math.random() * player.force.max)) + player.force.min);
    if (Math.random() <= zombie.dodge) {
        // The zombie dodged your counter atack.
        damageToZombie = 0;
        addComment("The zombie avoided your attack")
    }

    // Is the player good enough to preform the attack ?
    if (player.dexterity < Math.random()) {
        // No, the player is incompetent and possibly damaged them selfe. 
        damageToZombie = 0;
        damageToPlayer += Math.floor(Math.random() * 1);
        addComment("You fumble and miss")
    } else {
        // The attack was successfull. 
        addComment("You dealt " + damageToZombie + " damage to the Zombie")
    }

    //Update the stats
    player.health = Tools.clamp(player.health - damageToPlayer, Player.MIN_HEALTH, Player.MAX_HEALTH); // Player can never have negative health or more than max
    zombie.health -= damageToZombie; // Yes zombies can be realy dead.
}

const Zombie = {
    fightZombie,
    createZombie,
    update
}

export default Zombie