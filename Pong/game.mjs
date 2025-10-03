// HTML interaksjon -----------------------------------------------------------
const canvas = document.getElementById("canvas"); // GI meg et ark
const brush = canvas.getContext("2d"); // Gi meg en malekost.

// GAME VARIABLES -------------------------------------------------------------
let aiFrozen = false;
let aiFreezeTimeout = null;
const BALL_MIN_RADIUS = 5;
const BALL_MAX_RADIUS = 100;
let timer = 90;
let gameActive = true;
let animationId = null;
let retryButton = {
  x: canvas.width * 0.5 - 80,
  y: canvas.height * 0.5 + 60,
  width: 160,
  height: 50,
  color: "#333",
  text: "Retry",
};
const MIN_SPEED = 3;
const MAX_SPEED = 5;

const PADDLE_PADDING = 10;
const PADDLE_WIDTH = 20;
const PADDLE_HEIGHT = 75;

let scorePlayer = 0;
let scoreAi = 0;

const ball = {
  x: 310,
  y: 230,
  radius: 10,
  color: "#FFFFFF",
  speedX: 0,
  speedY: 0,
};

const paddle = {
  x: PADDLE_PADDING,
  y: 220,
  width: PADDLE_WIDTH,
  height: PADDLE_HEIGHT,
  color: "#daff33",
};
const aiPaddle = {
  x: canvas.width - PADDLE_PADDING - PADDLE_WIDTH,
  y: 220,
  width: PADDLE_WIDTH,
  height: PADDLE_HEIGHT,
  color: "#e033ffff",
};
const centerLine = {
  x: 310,
  y: 0,
  width: 5,
  height: canvas.height,
  color: "#ffffff",
};

// GAME ENGINE ----------------------------------------------------------------
function update() {
  if (!gameActive) {
    draw();
    scoreText();
    drawTimer();
    drawGameOver();
    drawRetryButton();
    return;
  }
  moveBall(ball);
  moveAi(aiPaddle);
  keepBallOnPitch(ball);
  dealWithColision(paddle, ball);
  draw();
  scoreText();
  drawTimer();
  animationId = requestAnimationFrame(update);
}

function draw() {
  drawPitch();
  drawBall(ball);
  drawPaddle(paddle);
  drawPaddle(aiPaddle);
  scoreText();
}

function init() {
  centerVerticallyItemIn(paddle, canvas);
  centerVerticallyItemIn(aiPaddle, canvas);
  giveBallRandomSpeed(ball);
  update();
}

init();

// GAME FUNCTIONS -------------------------------------------------------------
function keepBallOnPitch(ball) {
  const leftBorder = ball.radius;
  const rightBorder = canvas.width - ball.radius;
  const topBorder = 0 + ball.radius;
  const bottomBorder = canvas.height - ball.radius;

  if (ball.x < leftBorder) {
    scoreAi++;
    putBallInCenterOfPitch(ball);
    giveBallRandomSpeed(ball);
  } else if (ball.x > rightBorder) {
    scorePlayer++;
    putBallInCenterOfPitch(ball);
    giveBallRandomSpeed(ball);
  }

  if (ball.y <= topBorder || ball.y >= bottomBorder) {
    ball.speedY = ball.speedY * -1;
  }
}

function putBallInCenterOfPitch(ball) {
  ball.x = (canvas.width - ball.radius * 2) * 0.5;
  ball.y = (canvas.height - ball.radius * 2) / 2;
}

function giveBallRandomSpeed(ball) {
  ball.speedX = randomNumberBetween(MAX_SPEED, MIN_SPEED);
  ball.speedY = randomNumberBetween(MAX_SPEED, MIN_SPEED);

  if (Math.random() > 0.5) {
    ball.speedX = ball.speedX * -1;
  }
  if (Math.random() > 0.5) {
    ball.speedY = ball.speedY * -1;
  }
}

function dealWithColision(paddle, ball) {
  const paddleRight = paddle.x + paddle.width + ball.radius;
  const paddleTop = paddle.y;
  const paddleBottom = paddle.y + paddle.height;

  const aiPaddleLeft = aiPaddle.x - ball.radius;
  const aiPaddleTop = aiPaddle.y;
  const aiPaddleBottom = aiPaddle.y + paddle.height;

  // Player paddle collision
  if (ball.x < paddleRight && ball.y > paddleTop && ball.y < paddleBottom) {
    // Calculate deflection: relative intersect Y (-1 to 1)
    let relativeIntersectY = paddle.y + paddle.height / 2 - ball.y;
    let normalized = relativeIntersectY / (paddle.height / 2);
    // Max bounce angle in radians (e.g. 60 deg)
    let maxBounceAngle = Math.PI / 3;
    let bounceAngle = normalized * maxBounceAngle;
    let speed =
      Math.sqrt(ball.speedX * ball.speedX + ball.speedY * ball.speedY) * 1.05;
    ball.speedX = speed * Math.cos(bounceAngle);
    ball.speedY = -speed * Math.sin(bounceAngle);
    // Always send ball to the right
    if (ball.speedX < 0) ball.speedX *= -1;
  }
  // AI paddle collision
  else if (
    ball.x > aiPaddleLeft &&
    ball.y > aiPaddleTop &&
    ball.y < aiPaddleBottom
  ) {
    let relativeIntersectY = aiPaddle.y + aiPaddle.height / 2 - ball.y;
    let normalized = relativeIntersectY / (aiPaddle.height / 2);
    let maxBounceAngle = Math.PI / 3;
    let bounceAngle = normalized * maxBounceAngle;
    let speed =
      Math.sqrt(ball.speedX * ball.speedX + ball.speedY * ball.speedY) * 1.05;
    ball.speedX = -speed * Math.cos(bounceAngle);
    ball.speedY = -speed * Math.sin(bounceAngle);
    // Always send ball to the left
    if (ball.speedX > 0) ball.speedX *= -1;
  }
}

function moveBall(ball) {
  ball.x = ball.x + ball.speedX;
  ball.y = ball.y + ball.speedY;
}

function drawBall(ball) {
  brush.beginPath();
  brush.fillStyle = ball.color;
  brush.arc(ball.x, ball.y, ball.radius, 0, 2 * Math.PI);
  brush.fill();
}

function drawPaddle(paddle) {
  brush.fillStyle = paddle.color;
  brush.fillRect(paddle.x, paddle.y, paddle.width, paddle.height);
}

function drawPitch() {
  brush.clearRect(0, 0, canvas.width, canvas.height);
  brush.fillStyle = "#000";
  brush.fillRect(0, 0, canvas.width, canvas.height);
  brush.fillStyle = centerLine.color;
  brush.fillRect(
    centerLine.x,
    centerLine.y,
    centerLine.width,
    centerLine.height
  );
}

function moveAi(paddle) {
  if (aiFrozen) return;
  let delta = ball.y - (paddle.y + paddle.height * 0.5);
  paddle.y += delta * 0.1;
  if (paddle.y < 0) {
    paddle.y = 0;
  } else if (paddle.y + paddle.height > canvas.height) {
    paddle.y = canvas.height - paddle.height;
  }
}

function scoreText() {
  brush.fillStyle = "#fff";
  brush.font = "48px monospace";
  brush.fillText(scorePlayer, canvas.width * 0.25, 50);
  brush.fillText(scoreAi, canvas.width * 0.75, 50);
}

// TIMER LOGIC
setInterval(() => {
  if (gameActive && timer > 0) {
    timer--;
    if (timer === 0) {
      gameActive = false;
      if (animationId) {
        cancelAnimationFrame(animationId);
      }
      draw();
      scoreText();
      drawTimer();
      drawGameOver();
      drawRetryButton();
    }
  }
  function drawRetryButton() {
    brush.fillStyle = retryButton.color;
    brush.fillRect(
      retryButton.x,
      retryButton.y,
      retryButton.width,
      retryButton.height
    );
    brush.fillStyle = "#fff";
    brush.font = "32px monospace";
    brush.textAlign = "center";
    brush.textBaseline = "middle";
    brush.fillText(
      retryButton.text,
      retryButton.x + retryButton.width / 2,
      retryButton.y + retryButton.height / 2
    );
    brush.textAlign = "start";
    brush.textBaseline = "alphabetic";
  }

  canvas.addEventListener("mousedown", function (evt) {
    if (!gameActive) {
      const rect = canvas.getBoundingClientRect();
      const mouseX = evt.clientX - rect.left;
      const mouseY = evt.clientY - rect.top;
      if (
        mouseX >= retryButton.x &&
        mouseX <= retryButton.x + retryButton.width &&
        mouseY >= retryButton.y &&
        mouseY <= retryButton.y + retryButton.height
      ) {
        resetGame();
      }
    }
  });

  function resetGame() {
    scorePlayer = 0;
    scoreAi = 0;
    timer = 90;
    gameActive = true;
    putBallInCenterOfPitch(ball);
    giveBallRandomSpeed(ball);
    centerVerticallyItemIn(paddle, canvas);
    centerVerticallyItemIn(aiPaddle, canvas);
    update();
  }
}, 1000);

function drawTimer() {
  brush.fillStyle = "#fff";
  brush.font = "16px monospace";
  brush.fillText(`Time: ${timer}`, 550, 30);
}

function drawGameOver() {
  if (!gameActive) {
    brush.fillStyle = "#ff3333";
    brush.font = "64px monospace";
    brush.fillText("Game Over!", canvas.width * 0.5 - 180, canvas.height * 0.5);
  }
}

// UTILITY FUNCTIONS ----------------------------------------------------------

// CHEAT KEYS -------------------------------------------------------------------
document.addEventListener("keydown", function (e) {
  if (!gameActive) return;
  if (e.key === "l" || e.key === "L") {
    if (!aiFrozen) {
      aiFrozen = true;
      if (aiFreezeTimeout) clearTimeout(aiFreezeTimeout);
      aiFreezeTimeout = setTimeout(() => {
        aiFrozen = false;
      }, 2000);
    }
  } else if (e.key === "c" || e.key === "C") {
    // Teleport player paddle to perfect Y to intersect ball
    paddle.y = ball.y - paddle.height / 2;
    if (paddle.y < 0) paddle.y = 0;
    if (paddle.y + paddle.height > canvas.height)
      paddle.y = canvas.height - paddle.height;
  } else if (e.key === "+") {
    // Grow ball
    ball.radius = Math.min(ball.radius + 5, BALL_MAX_RADIUS);
  } else if (e.key === "-") {
    // Shrink ball
    ball.radius = Math.max(ball.radius - 5, BALL_MIN_RADIUS);
  }
});

// MOUSE INTERACTIONS ----------------------------------------------------------
canvas.addEventListener("mousemove", onMouseMove);

function onMouseMove(event) {
  paddle.y = event.offsetY;
}

function randomNumberBetween(max, min) {
  return Math.round(Math.random() * (max - min)) + min;
}

function centerVerticallyItemIn(item, target) {
  item.y = target.height * 0.5 - PADDLE_HEIGHT * 0.5;
}
