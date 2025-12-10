
// This is where we deal with the keyboard interaction, you probably do not need to change anything in this file.


const KEY_STATES = {
    "ArrowUp": false,
    "ArrowLeft": false,
    "ArrowRight": false,
    "ArrowDown": false
}


document.addEventListener("keydown", (e) => {
    KEY_STATES[e.key] = true;
});

document.addEventListener("keyup", (e) => {
    KEY_STATES[e.key] = false;
});


const keysHandler = {
    get(target, property) {
        if (property in target) {
            const value = target[property];
            target[property] = false;
            return value;
        }
        return undefined;
    }
};

// This makes it so that evrytime a key state is read in our game, it is automaticly set to false afterwards
// If you want to se when this is not the case, switch witch line is commented out.
const KEYS = new Proxy(KEY_STATES, keysHandler);
//const KEYS = KEY_STATES;

export default KEYS 