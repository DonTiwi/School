import DIMENSIONS from "./dimensions.mjs";

let debug = false;
const debugHighlightColor = "rgba(0, 255, 0, .8)";
const debugerLineWidth = 1;

let mouse = {
    row: undefined,
    col: undefined,
    x: undefined,
    y: undefined
}


const _td = DIMENSIONS.tileDimension;
const _rows = DIMENSIONS.screenRows;        // Remember that rows are y (vertical)
const _cols = DIMENSIONS.screenColumns;     // Remember that cols are x (horizontal)
const _sx = DIMENSIONS.startX;
const _sy = DIMENSIONS.startY;
const _width = DIMENSIONS.totalWidth;
const _height = DIMENSIONS.totalHeight;

document.getElementById("debug").addEventListener("click", () => {
    debug = !debug;
});

document.querySelector("canvas").addEventListener("mousemove", (e) => {

    if (!debug) {
        return;
    }

    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    let row = Math.floor((y - DIMENSIONS.padding) / DIMENSIONS.tileDimension);
    let col = Math.floor((x - DIMENSIONS.padding) / DIMENSIONS.tileDimension);

    mouse = { row, col, x, y };

});


document.querySelector("canvas").addEventListener("mousedown", (e) => {
    if (debug) {
        console.log(mouse.row, mouse.col);
    }
});


function displayDebugInfo(ctx) {
    ctx.save();
    ctx.strokeStyle = debugHighlightColor;
    ctx.fillStyle = debugHighlightColor;
    ctx.lineWidth = 0.2;
    for (let i = 0; i < _rows; i++) {
        for (let j = 0; j < _cols; j++) {

            if (i == mouse.row && j == mouse.col) {
                ctx.fillRect(_sx + j * _td, _sy + i * _td, _td, _td)
            } else {
                ctx.strokeRect(_sx + j * _td, _sy + i * _td, _td, _td);
            }
        }
    }

    if (mouse.row < _rows && mouse.col < _cols && mouse.col >= 0 && mouse.row >= 0) {
        ctx.font = '14px Courier';
        ctx.fillText(`[${mouse.row},${mouse.col}]`, mouse.x + 15, mouse.y + 15);
    }
    ctx.restore();
}

export { debug, displayDebugInfo }