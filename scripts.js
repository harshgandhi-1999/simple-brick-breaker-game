const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");

let score = 0;
const scoreUnit = 5;
let lives = 3;
let gameStarted = false;
let GAME_OVER = false;

// brick
const brick = {
  w: 55,
  h: 20,
};

//number of bricks in 1 row
const sidemargin = 20;
const topmargin = 50;
const rows = 3;
const columns = 5;
const gap = 20;

let bricks = [];

function createBricks() {
  for (var row = 0; row < rows; row++) {
    bricks[row] = [];
    for (var col = 0; col < columns; col++) {
      bricks[row][col] = {
        x: (gap + brick.w) * col + sidemargin,
        y: (gap + brick.h) * row + topmargin,
        status: true,
      };
    }
  }
}

createBricks();

function showBricks() {
  ctx.fillStyle = "orange";
  for (var row = 0; row < rows; row++) {
    for (var col = 0; col < columns; col++) {
      if (bricks[row][col].status === true) {
        ctx.fillRect(
          (gap + brick.w) * col + sidemargin,
          (gap + brick.h) * row + topmargin,
          brick.w,
          brick.h
        );
      }
    }
  }
}
//show paddle
const paddle = {
  x: (canvas.width - 100) / 2,
  y: canvas.height - 50,
  w: 100,
  h: 10,
  speed: 5,
  dx: 0,
};
function showPaddle() {
  ctx.fillStyle = "blue";
  ctx.fillRect(paddle.x, paddle.y, paddle.w, paddle.h);
}

//show ball
const ballRadius = 8;
const ball = {
  x: canvas.width / 2,
  y: paddle.y - ballRadius,
  r: ballRadius,
  speed: 5,
  dx: 5 * Math.sin(Math.PI / 3),
  dy: -5 * Math.cos(Math.PI / 3),
};

function showBall() {
  //   console.log("err");
  ctx.beginPath();
  ctx.arc(ball.x, ball.y, ball.r, 0, Math.PI * 2);
  ctx.fill();
}

function clear() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
}

function detectWalls() {
  //left wall
  if (paddle.x < 0) {
    paddle.x = 0;
  }
  //right wall
  if (paddle.x + paddle.w > canvas.width) {
    paddle.x = canvas.width - paddle.w;
  }
}

function movePaddle() {
  paddle.x += paddle.dx;
  detectWalls();
}

function movePlatformRight() {
  if (gameStarted === true) paddle.dx += paddle.speed;
}
function movePlatformLeft() {
  if (gameStarted === true) paddle.dx -= paddle.speed;
}

function keyDown(e) {
  if (e.key === "ArrowRight" || e.key === "Right") {
    movePlatformRight();
  } else if (e.key === "ArrowLeft" || e.key === "Left") {
    movePlatformLeft();
  }
}

function keyUp(e) {
  if (
    e.key === "ArrowRight" ||
    e.key === "Right" ||
    e.key === "ArrowLeft" ||
    e.key === "Left"
  ) {
    paddle.dx = 0;
  }
}

function reset() {
  ball.x = paddle.x + paddle.w / 2;
  ball.y = paddle.y - ballRadius;
  ball.dx = 3 * (Math.random() * 2 - 1);
  ball.dy = -3;
  gameStarted = false;
}

function wallCollision() {
  if (ball.x - ball.r < 0 || ball.x + ball.r > canvas.width) {
    ball.dx *= -1;
  }
  if (ball.y - ball.r < 0) {
    ball.dy *= -1;
  }
  if (ball.y + ball.r > canvas.height) {
    lives--;
    reset();
  }
}

function paddleCollision() {
  if (
    ball.y + ball.r > paddle.y &&
    ball.y + ball.r < paddle.y + paddle.h &&
    ball.x + ball.r > paddle.x &&
    ball.x - ball.r < paddle.x + paddle.w
  ) {
    let collidepoint = ball.x - (paddle.x + paddle.w / 2);
    collidepoint = collidepoint / (paddle.w / 2); //normalizing to -1 to 1
    let angle = collidepoint * (Math.PI / 3);
    ball.dx = Math.sin(angle) * ball.speed;
    ball.dy = -Math.cos(angle) * ball.speed;
  }
}

function brickCollision() {
  for (var row = 0; row < rows; row++) {
    for (var col = 0; col < columns; col++) {
      let b = bricks[row][col];
      if (b.status === true) {
        if (
          ball.x + ball.r > b.x &&
          ball.x - ball.r < b.x + brick.w &&
          ball.y + ball.r > b.y &&
          ball.y - ball.r < b.y + brick.h
        ) {
          b.status = false;
          ball.dy = -ball.dy;
          score += scoreUnit;
        }
      }
    }
  }
}

function detectCollisionForBall() {
  wallCollision();
  paddleCollision();
  brickCollision();
}

function moveBall() {
  if (gameStarted === true) {
    ball.x += ball.dx;
    ball.y += ball.dy;
  }
  detectCollisionForBall();
}

function mouseDown(e) {
  gameStarted = true;
}

function showGameStatus() {
  ctx.font = "20px Arial";
  ctx.fillText(`Score: ${score}`, 20, 20);
  ctx.fillText(`Lives: ${lives}`, canvas.width - 100, 20);
}

function gameOver() {
  if (lives <= 0) {
    GAME_OVER = true;
    gameStarted = false;
    console.log("game over");
  }
}

function update() {
  clear();
  showBricks();
  showPaddle();
  showBall();
  showGameStatus();
  movePaddle();
  moveBall();
  gameOver();
  if (!GAME_OVER) {
    requestAnimationFrame(update);
  }
}

update();

document.addEventListener("keydown", keyDown);
document.addEventListener("keyup", keyUp);
document.addEventListener("click", mouseDown);

console.log(bricks);