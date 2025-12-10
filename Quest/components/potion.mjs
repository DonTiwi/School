import Component from "./component.mjs"
import { SPRITES } from "../tiles.mjs"

/*

    Note that Potions are extremly flexible, they are defined in the level file.
    They work as long as we understand that we must be able to do a lookup uf this kind player[potion.attribute].
    i.e. it works if the player has that type of attribute.

*/


function createPotion(data) {

    return {
        ...Component.createComponent(data),
        sprite: Number.parseInt(data[3]), // This works because in items.png all the potions are in row 0. NB! there are only 4 difrent potions in this row
        name: data[4].trim(), // What we display when the potion is drunk.
        attribute: data[5].trim(), // This is the attribute that the potion will effect.
        effect: Number.parseInt(data[6]) // This is the value that will impact the attribute.
    }

}

function draw(ctx, potion) {
    Component.draw(ctx, potion, SPRITES.items, potion.sprite, 0);
}


const Potion = {
    createPotion,
    draw
}


export default Potion