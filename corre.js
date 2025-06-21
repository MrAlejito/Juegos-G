const player = document.getElementById("player");
const coinsDisplay = document.getElementById("coins");
const multDisplay = document.getElementById("mult");
const timerDisplay = document.getElementById("cosecha-timer");
const game = document.getElementById("game");

let coins = parseInt(localStorage.getItem("coins")) || 0;
let coinsTemporales = 0;
let y = 150;
let velocity = 0;
let gravity = 0.6;
let lift = -10;
let mult = 1;
let speed = 4;
let obstacleRate = 2000;
let heartRate = 1500;
let citaMagicaActiva = false;
let lastHitTime = Date.now();
let obstacleInterval, heartInterval;

let cosechaCountdown = 30; // segundos

coinsDisplay.textContent = coins;
multDisplay.textContent = "x" + mult;
timerDisplay.textContent = cosechaCountdown;

// Volar
document.addEventListener("keydown", () => velocity = lift);
document.addEventListener("click", () => velocity = lift);

// Movimiento
function update() {
  velocity += gravity;
  y += velocity;
  if (y < 0) y = 0;
  if (y > 360) y = 360;
  player.style.top = y + "px";
  requestAnimationFrame(update);
}
update();

// Obstáculos
function spawnObstacle() {
  const spike = document.createElement("div");
  spike.classList.add("obstacle");
  spike.innerText = "💣";
  spike.style.top = Math.random() * 360 + "px";
  spike.style.left = "600px";
  game.appendChild(spike);

  let posX = 600;
  const interval = setInterval(() => {
    posX -= speed;
    spike.style.left = posX + "px";

    if (checkCollision(player, spike)) {
      mult = 1;
      multDisplay.textContent = "x1";
      lastHitTime = Date.now();
      resetDificultad();

      // ❌ Perdés los coins acumulados en este intervalo
      coinsTemporales = 0;
      cosechaCountdown = 30;
      timerDisplay.textContent = cosechaCountdown;

      spike.remove();
      clearInterval(interval);
    }

    if (posX < -50) {
      spike.remove();
      clearInterval(interval);
    }
  }, 20);
}

// Corazones
function spawnHeart() {
  const heart = document.createElement("div");
  heart.classList.add("heart");
  heart.innerText = "❤️";
  heart.style.top = Math.random() * 360 + "px";
  heart.style.left = "600px";
  game.appendChild(heart);

  let posX = 600;
  const interval = setInterval(() => {
    posX -= speed;
    heart.style.left = posX + "px";

    if (checkCollision(player, heart)) {
      coinsTemporales += 5 * mult;
      heart.remove();
      clearInterval(interval);
    }

    if (posX < -50) {
      heart.remove();
      clearInterval(interval);
    }
  }, 20);
}

// Cita mágica
function activarCitaMagica() {
  if (citaMagicaActiva) return;
  citaMagicaActiva = true;

  const banner = document.getElementById("cita-magica-banner");
  banner.innerText = "✨ ¡Modo DIAVLO Activo! ✨";
  banner.style.display = "block";
  game.style.background = "linear-gradient(to bottom, #ffe6f0, #ffaad4)";

  setInterval(() => {
    if (citaMagicaActiva) spawnHeart();
  }, 1000);
}

// Reinicio dificultad
function resetDificultad() {
  speed = 4;
  obstacleRate = 2000;
  heartRate = 1500;
  citaMagicaActiva = false;
  game.style.background = "white";

  const banner = document.getElementById("cita-magica-banner");
  banner.style.display = "none";
  banner.innerText = "";

  clearInterval(obstacleInterval);
  clearInterval(heartInterval);
  obstacleInterval = setInterval(spawnObstacle, obstacleRate);
  heartInterval = setInterval(spawnHeart, heartRate);
}

// Multiplicador + dificultad
setInterval(() => {
  const now = Date.now();
  if (now - lastHitTime >= 10000 && mult < 5) {
    mult++;
    multDisplay.textContent = "x" + mult;
    lastHitTime = now;

    speed += 1;
    obstacleRate = Math.max(800, obstacleRate - 300);
    heartRate = Math.max(700, heartRate - 200);

    clearInterval(obstacleInterval);
    clearInterval(heartInterval);
    obstacleInterval = setInterval(spawnObstacle, obstacleRate);
    heartInterval = setInterval(spawnHeart, heartRate);

    if (mult === 5) activarCitaMagica();
  }
}, 1000);

// ⏱️ Temporizador de cosecha de coins
setInterval(() => {
  if (cosechaCountdown > 0) {
    cosechaCountdown--;
    timerDisplay.textContent = cosechaCountdown;
  } else {
    if (coinsTemporales > 0) {
      coins += coinsTemporales;
      localStorage.setItem("coins", coins);
      coinsDisplay.textContent = coins;
      coinsTemporales = 0;
    }
    cosechaCountdown = 30;
    timerDisplay.textContent = cosechaCountdown;
  }
}, 1000);

// Iniciar juego
obstacleInterval = setInterval(spawnObstacle, obstacleRate);
heartInterval = setInterval(spawnHeart, heartRate);

// Colisión
function checkCollision(a, b) {
  const aRect = a.getBoundingClientRect();
  const bRect = b.getBoundingClientRect();
  return !(
    aRect.top > bRect.bottom ||
    aRect.bottom < bRect.top ||
    aRect.right < bRect.left ||
    aRect.left > bRect.right
  );
}
