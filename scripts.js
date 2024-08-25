const canvas = document.getElementById('gameCanvas'); // Get the canvas element for the game
const ctx = canvas.getContext('2d'); // Get the context for drawing on the canvas
const scoreElement = document.getElementById('score'); // Get the score display element
const livesElement = document.getElementById('lives'); // Get the lives display element
const gameOverElement = document.getElementById('gameOver'); // Get the game over display element
const restartBtn = document.getElementById('restartBtn'); // Get the restart button element
const exitBtn = document.getElementById('exitBtn'); // Get the exit button element
const upBtn = document.getElementById('upBtn'); // Get the up arrow button element
const downBtn = document.getElementById('downBtn'); // Get the down arrow button element
const leftBtn = document.getElementById('leftBtn'); // Get the left arrow button element
const rightBtn = document.getElementById('rightBtn'); // Get the right arrow button element

const box = 20; // Size of each grid square on the canvas
let snake = []; // Array to hold the snake's body parts
snake[0] = {x: 9 * box, y: 10 * box}; // Initial position of the snake

let food = {
    x: Math.floor(Math.random() * 19 + 1) * box, // Random X position for the food
    y: Math.floor(Math.random() * 19 + 1) * box  // Random Y position for the food
};

let obstacle = {
    x: Math.floor(Math.random() * 19 + 1) * box, // Random X position for the obstacle
    y: Math.floor(Math.random() * 19 + 1) * box  // Random Y position for the obstacle
};

let score = 0; // Initial score
let lives = 4; // Initial number of lives
let d; // Variable to store the direction of the snake's movement
let speed = 200; // Initial speed of the snake (in milliseconds)

// Event listeners for arrow key presses and button clicks
document.addEventListener('keydown', direction); // Listen for keyboard arrow key presses
restartBtn.addEventListener('click', restartGame); // Listen for click on restart button
exitBtn.addEventListener('click', exitGame); // Listen for click on exit button
upBtn.addEventListener('click', () => { if (d !== 'DOWN') d = 'UP'; }); // Set direction to up
downBtn.addEventListener('click', () => { if (d !== 'UP') d = 'DOWN'; }); // Set direction to down
leftBtn.addEventListener('click', () => { if (d !== 'RIGHT') d = 'LEFT'; }); // Set direction to left
rightBtn.addEventListener('click', () => { if (d !== 'LEFT') d = 'RIGHT'; }); // Set direction to right

function direction(event) {
    if (event.keyCode === 37 && d !== 'RIGHT') { // Left arrow key
        d = 'LEFT';
    } else if (event.keyCode === 38 && d !== 'DOWN') { // Up arrow key
        d = 'UP';
    } else if (event.keyCode === 39 && d !== 'LEFT') { // Right arrow key
        d = 'RIGHT';
    } else if (event.keyCode === 40 && d !== 'UP') { // Down arrow key
        d = 'DOWN';
    }
}

function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height); // Clear the canvas for redrawing
    for (let i = 0; i < snake.length; i++) {
        ctx.fillStyle = 'black'; // Snake color
        ctx.fillRect(snake[i].x, snake[i].y, box, box); // Draw the snake's body part
        ctx.strokeStyle = 'white'; // Snake border color
        ctx.strokeRect(snake[i].x, snake[i].y, box, box); // Draw the border around the snake's body part
    }

    ctx.fillStyle = 'red'; // Food color
    ctx.fillRect(food.x, food.y, box, box); // Draw the food

    ctx.fillStyle = 'gray'; // Obstacle color
    ctx.fillRect(obstacle.x, obstacle.y, box, box); // Draw the obstacle

    let snakeX = snake[0].x; // Get the current X position of the snake's head
    let snakeY = snake[0].y; // Get the current Y position of the snake's head

    if (d === 'LEFT') snakeX -= box; // Move left
    if (d === 'UP') snakeY -= box; // Move up
    if (d === 'RIGHT') snakeX += box; // Move right
    if (d === 'DOWN') snakeY += box; // Move down

    if (snakeX === food.x && snakeY === food.y) {
        score += 5; // Increase score by 5 when the snake eats the food
        scoreElement.textContent = 'Score: ' + score; // Update the score display
        food = {
            x: Math.floor(Math.random() * 19 + 1) * box, // Generate new random X position for food
            y: Math.floor(Math.random() * 19 + 1) * box  // Generate new random Y position for food
        };

        // Increase speed of snake as score increases
        if (speed > 50) {
            speed -= 10; // Decrease the interval for the draw function to increase speed
        }
    } else {
        snake.pop(); // Remove the last part of the snake's body if no food is eaten
    }

    let newHead = {
        x: snakeX, // New X position for the snake's head
        y: snakeY  // New Y position for the snake's head
    };

    // Check if the snake hits the wall, itself, or the obstacle
    if (snakeX < 0 || snakeY < 0 || snakeX >= canvas.width || snakeY >= canvas.height || collision(newHead, snake) || (snakeX === obstacle.x && snakeY === obstacle.y)) {
        lives--; // Deduct a life if the snake hits the wall, itself, or the obstacle
        livesElement.textContent = 'Lives: ' + lives; // Update the lives display

        if (lives === 0) {
            clearInterval(game); // Stop the game loop
            gameOverElement.classList.remove('hidden'); // Show the game over screen
            return;
        } else {
            // Respawn the snake at the initial position with reduced speed
            snake = [{x: 9 * box, y: 10 * box}];
            d = null; // Reset direction
            speed = 200; // Reset speed
        }
    }

    snake.unshift(newHead); // Add the new head to the beginning of the snake's body
}

// Function to check for collision between the snake and itself
function collision(head, array) {
    for (let i = 0; i < array.length; i++) {
        if (head.x === array[i].x && head.y === array[i].y) {
            return true;
        }
    }
    return false;
}

// Function to restart the game
function restartGame() {
    location.reload(); // Reload the page to restart the game
}

// Function to exit the game
function exitGame() {
    // Redirect to a different page or close the game
    window.location.href = 'https://www.google.com'; // Example redirect to Google
}

// Start the game loop
let game = setInterval(draw, speed); // Set the game loop interval to the initial speed