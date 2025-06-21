const player = document.getElementById("player");
const gameArea = document.getElementById("game-area");
const coinsDisplay = document.getElementById("coins");
const multDisplay = document.getElementById("mult");
const banner = document.getElementById("magic-date-banner");

let coins = 0;
let mult = 1;
let posicionX = 130;
let velocidad = 4;
let corazonIntervalo = 2000;
let bombaIntervalo = 3000;

let timeSinceHit = 0;
const maxMult = 5;

const objetos = [];

// Leer coins guardados
const savedCoins = localStorage.getItem("coins");
if (savedCoins !== null) coins = parseInt(savedCoins);
coinsDisplay.textContent = coins;
multDisplay.textContent = `x${mult}`;

// Mostrar u ocultar cartel modo cita magica
function actualizarBanner() {
  if (mult === maxMult) {
    banner.style.display = "block";
  } else {
    banner.style.display = "none";
  }
}
const moveStep = 30;

// Mover jugador
document.addEventListener("keydown", e => {
  if (e.key === "ArrowLeft") {
    posicionX = Math.max(0, posicionX - moveStep);
  } else if (e.key === "ArrowRight") {
    posicionX = Math.min(gameArea.clientWidth - player.clientWidth, posicionX + moveStep);
  }
  player.style.left = posicionX + "px";
});

// Actualizar coins y multiplicador
function actualizarCoins() {
  coinsDisplay.textContent = coins;
  localStorage.setItem("coins", coins);
}
function actualizarMultiplicador() {
  multDisplay.textContent = `x${mult}`;
  actualizarBanner();
}

// Crear objetos
function crearObjeto(esCorazon) {
  const obj = document.createElement("div");
  obj.classList.add(esCorazon ? "corazon" : "bomba");
  obj.innerText = esCorazon ? "❤️" : "💣";
  const posX = Math.floor(Math.random() * (gameArea.clientWidth - 34));
  obj.style.left = `${posX}px`;
  obj.style.top = `0px`;
  gameArea.appendChild(obj);
  objetos.push({ elem: obj, esCorazon, posY: 0, posX });
}

// Animación de caída y colisiones
function animar() {
  const H = gameArea.clientHeight;
  const PW = player.clientWidth;
  const PH = player.clientHeight;

  for (let i = objetos.length - 1; i >= 0; i--) {
    const o = objetos[i];
    o.posY += velocidad;
    o.elem.style.top = `${o.posY}px`;

    const hitX = o.posX + 34 > posicionX && o.posX < posicionX + PW;
    const hitY = o.posY + 34 > H - PH;

    if (hitX && hitY) {
      if (o.esCorazon) {
        coins += mult;
        actualizarCoins();
      } else {
        // choque bomba
        mult = 1;
        actualizarMultiplicador();
        velocidad = 4;
        corazonIntervalo = 2000;
        bombaIntervalo = 3000;
        timeSinceHit = 0;
        reiniciarTimers();
      }
      o.elem.remove();
      objetos.splice(i, 1);
      continue;
    }

    if (o.posY > H) {
      o.elem.remove();
      objetos.splice(i, 1);
    }
  }

  requestAnimationFrame(animar);
}

let heartTimer, bombTimer;

function reiniciarTimers() {
  clearInterval(heartTimer);
  clearInterval(bombTimer);
  heartTimer = setInterval(() => crearObjeto(true), corazonIntervalo);
  bombTimer = setInterval(() => crearObjeto(false), bombaIntervalo);
}

// Incrementar multiplicador y dificultad si no chocas 10 segundos
setInterval(() => {
  timeSinceHit++;
  if (timeSinceHit >= 10 && mult < maxMult) {
    mult++;
    actualizarMultiplicador();
    timeSinceHit = 0;

    velocidad++;
    corazonIntervalo = Math.max(800, corazonIntervalo - 300);
    bombaIntervalo = Math.max(1000, bombaIntervalo - 400);

    reiniciarTimers();
  }
}, 1000);

// Iniciar todo
reiniciarTimers();
actualizarMultiplicador();
requestAnimationFrame(animar);
