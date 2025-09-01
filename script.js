import Player from "./models/Player.js";
import Enemy from "./models/Enemy.js";
import SpaceObject from "./models/SpaceObject.js";
import { isColliding } from "./lib/isColliding.js";

let player, enemy, spaceObject, keys = [];

let timeLeft = 0, timeInterval, score = 0, animationFrameId, isPaused = false;

const canvas = document.querySelector('canvas');
const ctx = canvas.getContext('2d');
const canvasWidth = canvas.width;
const canvasHeight = canvas.height;

const nameDisplay = document.querySelector('.top-bar #name');
const timeDisplay = document.querySelector('.top-bar #time');
const scoreDisplay = document.querySelector('.top-bar #score');

const startMenu = document.querySelector('.start-menu');
const inGame = document.querySelector('.in-game');

const menuConditionNotification = document.querySelector('.menu-condition');

// Init awal
player = new Player(100, 100, 20);
enemy = new Enemy(canvasWidth / 2, canvasHeight / 2, 20);

function initGame(e){
    e.preventDefault();

    // ambil input value
    const nameInput = document.querySelector('.start-menu #name').value;
    const durationInput = parseInt(document.querySelector('.start-menu #duration').value) || 60;
    const spaceObjectsInput = parseInt(document.querySelector('.start-menu #space-objects').value) || 20;

    // defines variables
    timeLeft = durationInput;
    score = 0;
    isPaused = false;

    // display input values
    nameDisplay.textContent = 'name: ' + nameInput;
    timeDisplay.textContent = 'time: ' + durationInput;
    scoreDisplay.textContent = 'score: ' + score;

    // change page
    startMenu.style.display = 'none';
    inGame.style.display = 'grid';

    // init model game
    player = new Player(100, 100, 20);
    enemy = new Enemy(canvasWidth / 2, canvasHeight / 2, 20);
    spaceObject = Array.from({length: spaceObjectsInput}, (_, i) => new SpaceObject(
        Math.random() * canvasWidth,
        Math.random() * canvasHeight,
        5,
        i % 4 === 0 ? 20 : 5,
    ));

    // set time ticking
    timeInterval = setInterval(() => {
        if (!isPaused) {
            timeLeft--;
            timeDisplay.textContent = 'time: ' + timeLeft;
            if (timeLeft === 0) {
                endGame();
                notification('Waktu kamu habis! Kamu kalah!');
                return;
            }
        }
    }, 1000);

    // canvas draw loop
    gameLoop()
}

function gameLoop() {
    if (isPaused) return;

    ctx.clearRect(0, 0, canvasWidth, canvasHeight);

    player.move();
    player.draw(ctx);
    enemy.moveTowards(player);
    enemy.draw(ctx, player);

    // defines collisions
    if (isColliding(player, enemy)) {
        endGame();
        notification('Kamu tertangkap musuh! Kamu kalah!');
        return;
    }

    spaceObject = spaceObject.filter(object => {
        if (isColliding(player, object)) {
            score += object.score;
            scoreDisplay.textContent = 'score: ' + score;
            return false; 
        }
        object.draw(ctx);
        return true;
    })

    // defines win
    if (spaceObject.length === 0) {
        endGame();
        notification('Kamu mengumpulkan semua object! Kamu menang!');
        return;
    }

    // looping draw (fps)
    animationFrameId = requestAnimationFrame(gameLoop);
}


// condition functions
function endGame() {
    isPaused = true;
    cancelAnimationFrame(animationFrameId);
    clearInterval(timeInterval);
}

function notification(text) {
    const notification = document.querySelector('.notification');
    const h2 = document.querySelector('.notification h2');
    const scoreDisplay = document.querySelector('.notification #score');

    scoreDisplay.textContent = 'score: ' + score; 
    h2.textContent = text;
    notification.style.display = 'grid'
}

function menuCondition(text) {
    menuConditionNotification.querySelector('p').textContent = text;
    menuConditionNotification.style.display = 'grid';
}


// button functions
function pause() {
    isPaused = true;
    cancelAnimationFrame(animationFrameId);
    menuCondition('Game Paused');
}

function resume() {
    isPaused = false;
    gameLoop();
    menuConditionNotification.style.display = 'none';
}

function reset() {
    isPaused = true;
    cancelAnimationFrame(animationFrameId);
    startMenu.style.display = 'grid';
    inGame.style.display = 'none';
}

function exit() {
    location.reload();
}

// button click events
document.querySelector('.paused-menu #pause').addEventListener('click', pause);
document.querySelector('.paused-menu #resume').addEventListener('click', resume);
document.querySelector('.paused-menu #reset').addEventListener('click', reset);
document.querySelectorAll('#exit')[0].addEventListener('click', exit);
document.querySelectorAll('#exit')[1].addEventListener('click', exit);
document.querySelector('.start-menu form').addEventListener('submit', initGame);

// game controls
document.addEventListener('keydown', (e) => {
    keys[e.key] = true;
    const key = e.key.toLowerCase();
    if (['arrowup', 'w'].includes(key)) player.dy = -player.speed;
    if (['arrowdown', 's'].includes(key)) player.dy = player.speed;
    if (['arrowleft', 'a'].includes(key)) player.dx = -player.speed;
    if (['arrowright', 'd'].includes(key)) player.dx = player.speed;

    // pause control
    if (['p'].includes(e.key) && !isPaused) pause();
    if (['p'].includes(e.key) && isPaused) resume();
});

document.addEventListener('keyup', (e) => {
    keys[e.key] = false;
    const movingHorizontally = keys['ArrowLeft'] || keys['ArrowRight'] || keys['d'] || keys['a']; 
    const movingVertically = keys['ArrowUp'] || keys['ArrowDown'] || keys['w'] || keys['s']; 

    if (!movingHorizontally) player.dx = 0;
    if (!movingVertically) player.dy = 0;
});
