const canvas = document.getElementById("scene");
const ctx = canvas.getContext("2d");

const PADDING = 10;
const LINE_WIDTH = 5;

ctx.lineWidth = LINE_WIDTH;

const bounds = {
  left: PADDING,
  right: canvas.width - PADDING,
  top: PADDING,
  bottom: canvas.height - PADDING,
};

const width = bounds.right - bounds.left;
const height = bounds.bottom - bounds.top;
const midX = (bounds.left + bounds.right) / 2;

function drawTriangle(points) {
  if (!points || points.length < 3) return;
  ctx.beginPath();
  ctx.moveTo(points[0].x, points[0].y);
  for (let i = 1; i < points.length; i++) {
    ctx.lineTo(points[i].x, points[i].y);
  }
  ctx.closePath();
  ctx.stroke();
}

// Ytre triangel
drawTriangle([
  { x: bounds.left, y: bounds.bottom },
  { x: bounds.right, y: bounds.bottom },
  { x: midX, y: bounds.top },
]);

// Indre Triangel
const quarter = width / 4;
const halfHeight = height / 2;

const prevStroke = ctx.strokeStyle;
ctx.strokeStyle = "green";

drawTriangle([
  { x: bounds.left + quarter, y: bounds.bottom - halfHeight },
  { x: bounds.right - quarter, y: bounds.bottom - halfHeight },
  { x: midX, y: bounds.bottom },
]);

ctx.strokeStyle = prevStroke;
