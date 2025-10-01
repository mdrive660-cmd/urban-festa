const canvas = document.getElementById("pongCanvas");
const ctx = canvas.getContext("2d");

// Game settings
const paddleWidth = 12;
const paddleHeight = 90;
const paddleSpeed = 6;
const ballRadius = 10;

// Paddle positions
let playerY = canvas.height/2 - paddleHeight/2;
let computerY = canvas.height/2 - paddleHeight/2;
let playerVelocity = 0;

// Ball
let ballX = canvas.width/2;
let ballY = canvas.height/2;
let ballSpeedX = 6 * (Math.random() > 0.5 ? 1 : -1);
let ballSpeedY = 4 * (Math.random() > 0.5 ? 1 : -1);

// Score
let playerScore = 0;
let computerScore = 0;

// Control paddle with keyboard
document.addEventListener("keydown", function(e) {
    if (e.key === "ArrowUp") playerVelocity = -paddleSpeed;
    if (e.key === "ArrowDown") playerVelocity = paddleSpeed;
});
document.addEventListener("keyup", function(e) {
    if (e.key === "ArrowUp" || e.key === "ArrowDown") playerVelocity = 0;
});

// Control paddle with mouse
canvas.addEventListener("mousemove", function(e) {
    const rect = canvas.getBoundingClientRect();
    const mouseY = e.clientY - rect.top;
    playerY = mouseY - paddleHeight/2;
    clampPlayerPaddle();
});

function clampPlayerPaddle() {
    if (playerY < 0) playerY = 0;
    if (playerY > canvas.height - paddleHeight) playerY = canvas.height - paddleHeight;
}

function drawRect(x, y, w, h, color) {
    ctx.fillStyle = color;
    ctx.fillRect(x, y, w, h);
}

function drawCircle(x, y, r, color) {
    ctx.fillStyle = color;
    ctx.beginPath();
    ctx.arc(x, y, r, 0, Math.PI * 2, false);
    ctx.closePath();
    ctx.fill();
}

function drawNet() {
    ctx.fillStyle = "#444";
    for(let i = 0; i < canvas.height; i += 30) {
        ctx.fillRect(canvas.width/2 - 2, i, 4, 18);
    }
}

function resetBall() {
    ballX = canvas.width/2;
    ballY = canvas.height/2;
    ballSpeedX *= -1;
    ballSpeedY = (Math.random() - 0.5) * 8;
}

function update() {
    // Move player paddle with keyboard
    playerY += playerVelocity;
    clampPlayerPaddle();

    // Computer AI: follow the ball
    let computerCenter = computerY + paddleHeight/2;
    if (computerCenter < ballY - 10) computerY += paddleSpeed * 0.7;
    else if (computerCenter > ballY + 10) computerY -= paddleSpeed * 0.7;

    // Clamp computer paddle
    if (computerY < 0) computerY = 0;
    if (computerY > canvas.height - paddleHeight) computerY = canvas.height - paddleHeight;

    // Move ball
    ballX += ballSpeedX;
    ballY += ballSpeedY;

    // Collision with top/bottom
    if (ballY - ballRadius < 0 || ballY + ballRadius > canvas.height) {
        ballSpeedY = -ballSpeedY;
    }

    // Collision with player paddle
    if (ballX - ballRadius < paddleWidth) {
        if (ballY > playerY && ballY < playerY + paddleHeight) {
            ballSpeedX = -ballSpeedX;
            // Add some spin
            let collidePoint = (ballY - (playerY + paddleHeight/2)) / (paddleHeight/2);
            ballSpeedY = collidePoint * 5;
        } else if (ballX - ballRadius < 0) {
            // Missed paddle
            computerScore++;
            updateScore();
            resetBall();
        }
    }
    // Collision with computer paddle
    if (ballX + ballRadius > canvas.width - paddleWidth) {
        if (ballY > computerY && ballY < computerY + paddleHeight) {
            ballSpeedX = -ballSpeedX;
            // Add some spin
            let collidePoint = (ballY - (computerY + paddleHeight/2)) / (paddleHeight/2);
            ballSpeedY = collidePoint * 5;
        } else if (ballX + ballRadius > canvas.width) {
            // Missed paddle
            playerScore++;
            updateScore();
            resetBall();
        }
    }
}

function updateScore() {
    document.getElementById("playerScore").innerText = playerScore;
    document.getElementById("computerScore").innerText = computerScore;
}

function draw() {
    // Clear
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Net
    drawNet();

    // Paddles
    drawRect(0, playerY, paddleWidth, paddleHeight, "#5df");
    drawRect(canvas.width - paddleWidth, computerY, paddleWidth, paddleHeight, "#fa2");

    // Ball
    drawCircle(ballX, ballY, ballRadius, "#fff");
}

function gameLoop() {
    update();
    draw();
    requestAnimationFrame(gameLoop);
}

// Start
updateScore();
gameLoop();