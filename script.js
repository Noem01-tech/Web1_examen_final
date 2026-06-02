/**
 * Point culture (en Français car je suis un peu obligé): 
 * Dans ce genre de jeu, un mot equivaut a 5 caractères, y compris les espaces. 
 * La precision, c'est le pourcentage de caractères tapées correctement sur toutes les caractères tapées.
 * 
 * Sur ce... Amusez-vous bien ! 
 */
const state = {
  difficulty: "easy",
  words: [],
  currentIndex: 0,
  startTime: null,
  wordStartTime: null,
  countdown: null,
  totalCharsTyped: 0, 
  totalErrors: 0,
  wordsTyped: 0,
  timerDuration: 30,
  timerRunning: false,
};

const wordLists = {
  easy: ["apple","banana","grape","orange","cherry","table","house","mouse","water","green"],
  medium: ["keyboard","monitor","printer","charger","battery","network","computer","browser","desktop","project"],
  hard: ["synchronize","complicated","development","extravagant","misconception","architecture","communication","implementation","responsibility","configuration"],
};

const wordDisplay  = document.getElementById("word-display");
const inputField   = document.getElementById("input-field");
const timeSelect   = document.getElementById("Time");
const btnRestart   = document.querySelector(".btn-restart");

const easyPill     = document.getElementById("easy-pill");
const mediumPill   = document.getElementById("medium-pill");
const hardPill     = document.getElementById("hard-pill");

const elWpm        = document.querySelector("#wpm .wpm");
const elAcc        = document.querySelector("#accuracy .accuracy");
const elTyped      = document.querySelector("#typed .typed");
const elTime       = document.querySelector("#time .time");

function updateDifficultyUI() {
  easyPill.classList.remove("active-easy");
  mediumPill.classList.remove("active-medium");
  hardPill.classList.remove("active-hard");

  const map = { easy: easyPill, medium: mediumPill, hard: hardPill };
  const cls = { easy: "active-easy", medium: "active-medium", hard: "active-hard" };
  map[state.difficulty].classList.add(cls[state.difficulty]);
}

easyPill.addEventListener("click",   () => changeDifficulty("easy"));
mediumPill.addEventListener("click", () => changeDifficulty("medium"));
hardPill.addEventListener("click",   () => changeDifficulty("hard"));

function changeDifficulty(level) {
  state.difficulty = level;
  updateDifficultyUI();
  startTest();
}


function startTest() {
  // Reset état
  clearInterval(state.countdown);
  Object.assign(state, {
    words: [],
    currentIndex: 0,
    startTime: null,
    wordStartTime: null,
    countdown: null,
    totalCharsTyped: 0,
    totalErrors: 0,
    wordsTyped: 0,
    timerDuration: parseInt(timeSelect.value),
    timerRunning: false,
  });

  // Reset UI
  elWpm.textContent   = "—";
  elAcc.textContent   = "—";
  elTyped.textContent = "0";
  elTime.innerHTML    = `${state.timerDuration}<span class="stat-unit">s</span>`;
  inputField.value    = "";
  inputField.disabled = false;
  inputField.focus();

  // Générer les mots
  const list = wordLists[state.difficulty];
  for (let i = 0; i < 50; i++) {
    state.words.push(list[Math.floor(Math.random() * list.length)]);
  }

  renderWords();
  highlightWord(0);
}

function renderWords() {
  wordDisplay.innerHTML = "";

  state.words.forEach((word, wi) => {
    const wordSpan = document.createElement("span");
    wordSpan.className = "word";
    wordSpan.dataset.index = wi;

    word.split("").forEach(char => {
      const charSpan = document.createElement("span");
      charSpan.className = "char";
      charSpan.textContent = char;
      wordSpan.appendChild(charSpan);
    });

    // Espace après chaque mot
    const space = document.createElement("span");
    space.className = "space";
    space.textContent = " ";
    wordSpan.appendChild(space);

    wordDisplay.appendChild(wordSpan);
  });
}

function highlightWord(index) {
  const wordEls = wordDisplay.querySelectorAll(".word");
  wordEls.forEach(el => el.classList.remove("current-word"));
  if (wordEls[index]) wordEls[index].classList.add("current-word");
}

function startTimer() {
  if (state.timerRunning) return;
  state.timerRunning = true;
  state.startTime    = Date.now();
  state.wordStartTime = Date.now();

  let remaining = state.timerDuration;

  state.countdown = setInterval(() => {
    remaining--;
    elTime.innerHTML = `${remaining}<span class="stat-unit">s</span>`;

    if (remaining <= 0) {
      clearInterval(state.countdown);
      endGame();
    }
  }, 1000);
}

inputField.addEventListener("input", () => {
  if (!state.timerRunning) startTimer();
  renderCurrentWordFeedback();
});

inputField.addEventListener("keydown", (e) => {
  if (e.key === " ") {
    e.preventDefault();
    validateWord();
  }
});

function renderCurrentWordFeedback() {
  const typed      = inputField.value;
  const currentWord = state.words[state.currentIndex];
  const wordEl     = wordDisplay.querySelectorAll(".word")[state.currentIndex];
  if (!wordEl) return;

  const charEls = wordEl.querySelectorAll(".char");

  charEls.forEach((charEl, i) => {
    charEl.classList.remove("char-correct", "char-wrong", "char-cursor");

    if (i < typed.length) {
      charEl.classList.add(typed[i] === currentWord[i] ? "char-correct" : "char-wrong");
    }

    if (i === typed.length) {
      charEl.classList.add("char-cursor");
    }
  });

  wordEl.classList.toggle("word-overflow", typed.length > currentWord.length);
}

function validateWord() {
  const typed       = inputField.value.trim();
  const currentWord = state.words[state.currentIndex];
  if (typed === "") return;

  let wordErrors = 0;
  for (let i = 0; i < Math.max(typed.length, currentWord.length); i++) {
    if (typed[i] !== currentWord[i]) wordErrors++;
  }

  state.totalCharsTyped += currentWord.length;
  state.totalErrors     += wordErrors;

  const wordEl = wordDisplay.querySelectorAll(".word")[state.currentIndex];
  if (wordEl) {
    wordEl.classList.add(wordErrors === 0 ? "word-correct" : "word-wrong");
    wordEl.classList.remove("current-word", "word-overflow");
  }

  state.wordsTyped++;
  state.currentIndex++;
  inputField.value = "";

  updateStats();
  highlightWord(state.currentIndex);
  scrollToCurrentWord();
}

function updateStats() {
  // WPM : mots tapés / minutes écoulées (1 mot = 5 chars)
  const elapsed = (Date.now() - state.startTime) / 1000 / 60; // en minutes
  const wpm = elapsed > 0
    ? Math.round((state.totalCharsTyped / 5) / elapsed)
    : 0;

  // Précision : chars corrects / chars totaux tapés
  const correctChars = state.totalCharsTyped - state.totalErrors;
  let accuracy;

    if (state.totalCharsTyped > 0) {
        accuracy = Math.round((correctChars / state.totalCharsTyped) * 100);
    } else {
        accuracy = 100;
    }

  elWpm.textContent   = wpm;
  elAcc.textContent   = `${accuracy}%`;
  elTyped.textContent = state.wordsTyped;
}

function endGame() {
  inputField.disabled = true;

  wordDisplay.querySelectorAll(".char-cursor").forEach(el => el.classList.remove("char-cursor"));

  updateStats();
}

function scrollToCurrentWord() {
  const wordEls = wordDisplay.querySelectorAll(".word");
  const current = wordEls[state.currentIndex];
  if (current) {
    current.scrollIntoView({ behavior: "smooth", block: "nearest" });
  }
}

btnRestart.addEventListener("click", startTest);
timeSelect.addEventListener("change", startTest);

updateDifficultyUI();
startTest();