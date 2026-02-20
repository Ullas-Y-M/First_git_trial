// ====== Configuration ======
const EMOJIS = ['🍎','🍌','🍇','🍓','🍒','🥝','🍍','🍉']; // 8 pairs -> 16 cards

// ====== State ======
let cardsArr = [];
let firstCard = null;
let secondCard = null;
let moves = 0;
let matchedPairs = 0;
let timer = 0;
let interval = null;
let canClick = true;

// ====== DOM ======
const board = document.querySelector('.game-board');
const movesDisplay = document.getElementById('moves');
const timerDisplay = document.getElementById('timer');
const restartBtn = document.getElementById('restart');

// ====== Helpers ======
function shuffle(array) {
  return array.sort(() => Math.random() - 0.5);
}

function startTimer() {
  if (interval) return;
  interval = setInterval(() => {
    timer++;
    timerDisplay.textContent = timer;
  }, 1000);
}

function stopTimer() {
  clearInterval(interval);
  interval = null;
}

function resetState() {
  firstCard = null;
  secondCard = null;
  moves = 0;
  matchedPairs = 0;
  timer = 0;
  canClick = true;
  movesDisplay.textContent = moves;
  timerDisplay.textContent = timer;
  stopTimer();
}

// ====== Build Board ======
function buildBoard() {
  board.innerHTML = '';
  // create duplicated array for pairs and shuffle
  cardsArr = shuffle([...EMOJIS, ...EMOJIS]);

  cardsArr.forEach((emoji, idx) => {
    const el = document.createElement('div');
    el.className = 'card';
    el.setAttribute('data-emoji', emoji);
    el.setAttribute('data-index', idx);

    el.innerHTML = `
      <div class="card-inner">
        <div class="card-front" aria-hidden="true">❓</div>
        <div class="card-back" aria-hidden="true">${emoji}</div>
      </div>
    `;

    el.addEventListener('click', onCardClick);
    board.appendChild(el);
  });
}

// ====== Card Click Handler ======
function onCardClick(e) {
  if (!canClick) return;

  const card = e.currentTarget;

  // prevent clicking already matched or same card twice
  if (card.classList.contains('matched') || card === firstCard) return;

  // start timer on first action
  startTimer();

  // flip visually
  card.classList.add('flip');

  if (!firstCard) {
    firstCard = card;
    return;
  }

  // second selection
  secondCard = card;
  canClick = false; // temporarily disable further clicks
  moves++;
  movesDisplay.textContent = moves;

  // compare by data attribute
  const a = firstCard.getAttribute('data-emoji');
  const b = secondCard.getAttribute('data-emoji');

  if (a === b) {
    // match
    firstCard.classList.add('matched');
    secondCard.classList.add('matched');
    matchedPairs++;
    // reset picks
    firstCard = null;
    secondCard = null;
    canClick = true;

    // check win
    if (matchedPairs === EMOJIS.length) {
      stopTimer();
      setTimeout(() => {
        alert(`You won in ${moves} moves and ${timer} seconds!`);
      }, 300);
    }
  } else {
    // not a match -> flip back after a short delay
    setTimeout(() => {
      firstCard.classList.remove('flip');
      secondCard.classList.remove('flip');
      firstCard = null;
      secondCard = null;
      canClick = true;
    }, 800);
  }
}

// ====== Restart Handler (reset board without page reload) ======
restartBtn.addEventListener('click', () => {
  resetState();
  buildBoard();
});

// ====== Init ======
resetState();
buildBoard();

