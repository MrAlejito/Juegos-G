const board = document.getElementById("memory-board");
const coinsDisplay = document.getElementById("coins");
const timerDisplay = document.getElementById("timer");
const levelDisplay = document.getElementById("level");

const allSymbols = ['💖', '❤️', '💕', '💘', '💝', '💗', '💓', '💞', '💟', '💌'];

let coins = parseInt(localStorage.getItem("coins")) || 0;
coinsDisplay.textContent = coins;

let cardsArray = [];
let flippedCards = [];
let matchedCards = 0;
let timeLeft = 60;
let timerInterval;

let level = 1;
const maxLevel = 3;

function shuffle(array) {
  for (let i = array.length - 1; i > 0; i--) {
    let j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
}

function updateCoins() {
  coinsDisplay.textContent = coins;
  localStorage.setItem("coins", coins);
}

function updateLevel() {
  levelDisplay.textContent = `Nivel: ${level}`;
}

function startTimer() {
  clearInterval(timerInterval);
  timeLeft = 30;
  timerDisplay.textContent = `Tiempo: ${timeLeft}s`;

  timerInterval = setInterval(() => {
    timeLeft--;
    timerDisplay.textContent = `Tiempo: ${timeLeft}s`;
    if (timeLeft <= 0) {
      clearInterval(timerInterval);
      alert("Se acabó el tiempo! Mezclando de nuevo...");
      createBoard();
    }
  }, 1000);
}

function createBoard() {
  updateLevel();
  board.innerHTML = "";
  board.className = "";
  board.classList.add(`level-${level}`);

  flippedCards = [];
  matchedCards = 0;

const numPairs = level === 1 ? 4 : level === 2 ? 6 : 10;
  const selectedSymbols = allSymbols.slice(0, numPairs);
  cardsArray = shuffle([...selectedSymbols, ...selectedSymbols]);

  for (let i = 0; i < cardsArray.length; i++) {
    const card = document.createElement("div");
    card.classList.add("card");

    card.innerHTML = `
      <div class="card-inner">
        <div class="card-front">${cardsArray[i]}</div>
        <div class="card-back">?</div>
      </div>
    `;

    card.addEventListener("click", () => flipCard(card));
    board.appendChild(card);
  }

  startTimer();
}

function flipCard(card) {
  if (flippedCards.length === 2 || card.classList.contains("flipped")) return;

  card.classList.add("flipped");
  flippedCards.push(card);

  if (flippedCards.length === 2) {
    checkMatch();
  }
}

function checkMatch() {
  const [card1, card2] = flippedCards;
  const symbol1 = card1.querySelector(".card-front").textContent;
  const symbol2 = card2.querySelector(".card-front").textContent;

  if (symbol1 === symbol2) {
    matchedCards += 2;
    flippedCards = [];

    if (matchedCards === cardsArray.length) {
      clearInterval(timerInterval);
      if (level < maxLevel) {
        alert(`¡Nivel ${level} superado!`);
        level++;
        setTimeout(createBoard, 1000);
      } else {
        alert("🌟 ¡Ganaste! Recibís 25 coins.");
        coins += 25;
        updateCoins();
        level = 1;
        setTimeout(createBoard, 1000);
      }
    }
  } else {
    setTimeout(() => {
      card1.classList.remove("flipped");
      card2.classList.remove("flipped");
      flippedCards = [];
    }, 1000);
  }
}

createBoard();