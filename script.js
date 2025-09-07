import Player from './models/Player.js';
import Enemy from './models/Enemy.js';
import SpaceObject from './models/SpaceObject.js';
import { isColliding } from './lib/isColliding.js';

let player,
  enemy,
  spaceObject,
  keys = [];

let timeLeft = 0,
  timeInterval,
  score = 0,
  animationFrameId,
  isPaused = false;

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

const startMenuBgMusic = new Audio(
  'public/audios/retro-game-arcade-236133.mp3'
);
const inGameBgMusic = new Audio(
  'public/audios/game-gaming-minecraft-background-music-379533.mp3'
);
const startGameSFX = new Audio('public/audios/game-start-6104.mp3');
const itemCollectSFX = new Audio('public/audios/game-bonus-02-294436.mp3');
const gameOverSFX = new Audio('public/audios/game-over.mp3');
const gameWinSFX = new Audio('public/audios/game-win.mp3');

const pauseBtn = document.querySelector('#pause');
const resumeBtn = document.querySelector('#resume');

// Init awal
player = new Player(100, 100, 20);
enemy = new Enemy(canvasWidth / 2, canvasHeight / 2, 20);

document.addEventListener(
  'click',
  () => {
    startMenuBgMusic.play();
  },
  { once: true }
);

function initGame(e) {
  e.preventDefault();

  // ambil input value
  const nameInput = document.querySelector('.start-menu #name').value;
  const durationInput =
    parseInt(document.querySelector('.start-menu #duration').value) || 60;
  const spaceObjectsInput =
    parseInt(document.querySelector('.start-menu #space-objects').value) || 20;

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
  enemy = new Enemy(canvasWidth / 2, canvasHeight / 2, 30);
  spaceObject = Array.from(
    { length: spaceObjectsInput },
    (_, i) =>
      new SpaceObject(
        Math.random() * (canvasWidth - 25),
        Math.random() * (canvasHeight - 25),
        5,
        i % 4 === 0 ? 20 : i % 2 === 0 ? 10 : 5
      )
  );

  // set time ticking
  timeInterval = setInterval(() => {
    if (!isPaused) {
      timeLeft--;
      timeDisplay.textContent = 'time: ' + timeLeft;
      if (timeLeft === 0) {
        endGame();
        notification('Waktu kamu habis! Kamu kalah!');
        gameOverSFX.play();
        return;
      }
    }
  }, 1000);

  startMenuBgMusic.pause();
  startGameSFX.play();
  inGameBgMusic.play();

  // canvas draw loop
  gameLoop();
}

function gameLoop() {
  if (isPaused) return;

  ctx.clearRect(0, 0, canvasWidth, canvasHeight);

  player.move();
  player.draw(ctx);
  enemy.moveTowards(player);
  enemy.draw(ctx, player);
  spaceObject.forEach((obj) => obj.update());

  // defines collisions
  if (isColliding(player, enemy)) {
    endGame();
    notification('Kamu tertangkap musuh! Kamu kalah!');
    gameOverSFX.play();
    return;
  }

  spaceObject = spaceObject.filter((object) => {
    if (isColliding(player, object)) {
      score += object.score;
      scoreDisplay.textContent = 'score: ' + score;
      itemCollectSFX.pause();
      itemCollectSFX.currentTime = 0;
      itemCollectSFX.play();
      return false;
    }
    object.draw(ctx);
    return true;
  });

  // defines win
  if (spaceObject.length === 0) {
    endGame();
    notification('Kamu mengumpulkan semua object! Kamu menang!');
    gameWinSFX.play();
    return;
  }

  // looping draw (fps)
  animationFrameId = requestAnimationFrame(gameLoop);
}

// condition functions
function endGame() {
  isPaused = true;
  cancelAnimationFrame(animationFrameId);
  inGameBgMusic.pause();
  clearInterval(timeInterval);
}

function notification(text) {
  const notification = document.querySelector('.notification');
  const h2 = document.querySelector('.notification h2');
  const scoreDisplay = document.querySelector('.notification #score');

  scoreDisplay.textContent = 'score: ' + score;
  h2.textContent = text;
  notification.style.display = 'grid';
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
  resumeBtn.disabled = !isPaused;
  pauseBtn.disabled = isPaused;
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
document
  .querySelector('.paused-menu #resume')
  .addEventListener('click', resume);
document.querySelector('.paused-menu #reset').addEventListener('click', reset);
document.querySelectorAll('#exit')[0].addEventListener('click', exit);
document.querySelectorAll('#exit')[1].addEventListener('click', exit);
document.querySelector('.start-menu form').addEventListener('submit', initGame);

// game controls
document.addEventListener('keydown', (e) => {
  const key = e.key.toLowerCase();
  keys[key] = true;

  // pause control
  if (key === 'p') {
    if (!isPaused) pause();
    else resume();
  }

  updatePlayerVelocity();
});

document.addEventListener('keyup', (e) => {
  const key = e.key.toLowerCase();
  keys[key] = false;

  updatePlayerVelocity();
});
function updatePlayerVelocity() {
  let dx = 0;
  let dy = 0;

  if (keys['arrowup'] || keys['w']) dy -= 1;
  if (keys['arrowdown'] || keys['s']) dy += 1;
  if (keys['arrowleft'] || keys['a']) dx -= 1;
  if (keys['arrowright'] || keys['d']) dx += 1;

  if (dx !== 0 || dy !== 0) {
    const length = Math.sqrt(dx * dx + dy * dy);
    dx = (dx / length) * player.speed;
    dy = (dy / length) * player.speed;
  }

  player.dx = dx;
  player.dy = dy;
}
