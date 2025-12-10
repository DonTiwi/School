function drawRandomFrom(list) {
    return list[Math.floor(Math.random() * list.length)];
}

function getRandomIntBetween(min, max) {
    return Math.floor(Math.random() * (max - min)) + min;
}

function clamp(value, min, max) {
    return Math.min(Math.max(value, min), max);
}

function getTextBounds(ctx, text) {
    const metrics = ctx.measureText(text);
    return {
        width: metrics.actualBoundingBoxRight + metrics.actualBoundingBoxLeft,
        height: metrics.actualBoundingBoxAscent + metrics.actualBoundingBoxDescent
    };
}


const Tools = {
    drawRandomFrom,
    clamp,
    getRandomIntBetween,
    getTextBounds
}

export default Tools