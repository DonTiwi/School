import DIMENSIONS from "./dimensions.mjs";

let comments = [];

function updateComments() {
    let keep = [];
    for (let m of comments) {
        m.time--;
        if (m.time > 0) {
            keep.push(m);
        }
    }
    comments = keep;
}

function addComment(txt) {
    comments.push(makeMsg(txt));
}

function makeMsg(msg, time = 500) {
    return { msg, time };
}

function getComments() {
    return [...comments];
}

function drawComments(ctx) {
    let com = getComments().reverse();
    if (com.length > 0) {
        ctx.fillStyle = "white";
        let cy = DIMENSIONS.totalHeight - DIMENSIONS.padding * 0.5;
        for (let i = 0; i < com.length; i++) {
            ctx.fillText(com[i].msg, DIMENSIONS.padding, cy);
            cy -= 30;
        }
    }
}

export { addComment, getComments, updateComments, drawComments };