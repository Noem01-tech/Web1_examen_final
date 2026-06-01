/**
 * Point culture (en Français car je suis un peu obligé): 
 * Dans ce genre de jeu, un mot equivaut a 5 caractères, y compris les espaces. 
 * La precision, c'est le pourcentage de caractères tapées correctement sur toutes les caractères tapées.
 * 
 * Sur ce... Amusez-vous bien ! 
 */
let startTime = null, previousEndTime = null;
let currentWordIndex = 0;
let letterindex=0;
let totalErrors = 0;
let totalLetters = 0;
let countdown=null;
const wordsToType = [];

const modeSelect = document.getElementById("mode");
const wordDisplay = document.getElementById("word-display");
const inputField = document.getElementById("input-field");



const wordMinute=document.querySelector("#wpm .wpm");
const acc=document.querySelector("#accuracy .accuracy");
let typedDisplay=document.querySelector("#typed .typed");
let count=0;
let time=document.querySelector("#time .time");
let sixty=60;
let thirty=30;
const timeSelect=document.getElementById("Time");
const resatrt=document.getElementById("restart");

const words = {
    easy: ["apple", "banana", "grape", "orange", "cherry"],
    medium: ["keyboard", "monitor", "printer", "charger", "battery"],
    hard: ["synchronize", "complicated", "development", "extravagant", "misconception"]
};

// Generate a random word from the selected mode
const getRandomWord = (mode) => {
    const wordList = words[mode];
    return wordList[Math.floor(Math.random() * wordList.length)];
};


// Initialize the typing test
const startTest = (wordCount = 50) => {
    wordsToType.length = 0; // Clear previous words
    wordDisplay.innerHTML = ""; // Clear display
    currentWordIndex = 0;
    startTime = null;
    clearInterval(countdown);
    countdown=null;
    previousEndTime = null;

    for (let i = 0; i < wordCount; i++) {
        wordsToType.push(getRandomWord(modeSelect.value));
    }

    wordsToType.forEach((word, index) => {
        const span = document.createElement("span");
        // span.textContent = word + " ";
        word.split("").forEach(letter=>{
            const letterSpan=document.createElement("span");
            letterSpan.textContent=letter;
            span.appendChild(letterSpan);
        });

        const spaceSpan=document.createElement("span")
        spaceSpan.textContent=" ";
        span.appendChild(spaceSpan);
        if (index === 0) span.style.color = "red"; // Highlight first word
        wordDisplay.appendChild(span);
    });

    inputField.value = "";
};


// Start the timer when user begins typing
const startTimer = () => {
    if (!startTime) startTime = Date.now();
};

// Calculate and return WPM & accuracy
const getCurrentStats = () => {
    const elapsedTime = (Date.now() - previousEndTime) / 1000; // Seconds
    const wpm = (wordsToType[currentWordIndex].length / 5) / (elapsedTime / 60); // 5 chars = 1 word 
const accuracy = ((totalLetters - totalErrors) / totalLetters) * 100;
    return { wpm: wpm.toFixed(2), accuracy: accuracy.toFixed(2) };
};

// Move to the next word and update stats only on spacebar press
const updateWord = (event) => {
    totalLetters += wordsToType[currentWordIndex].length;
const { wpm, accuracy } = getCurrentStats();
    if (event.key === " ") { // Check if spacebar is pressed
        if (inputField.value.trim() === wordsToType[currentWordIndex]) {
            count++;
            typedDisplay.textContent=count;
            if (!previousEndTime) previousEndTime = startTime;

            const { wpm, accuracy } = getCurrentStats();
            wordMinute.textContent=wpm;
            wordMinute.style.transform = "scale(1)";
            wordMinute.style.fontWeight = "700";
            wordMinute.style.textShadow = "1px 1px 0px black";
            
            acc.textContent=accuracy;
            acc.style.transform = "scale(1)";
            acc.style.fontWeight = "700";
            acc.style.textShadow = "1px 1px 0px black";


            
            currentWordIndex++;
            previousEndTime = Date.now();
            highlightNextWord();

            inputField.value = ""; // Clear input field after space
            event.preventDefault(); // Prevent adding extra spaces
        }
    }
        
};

// Highlight the current word in red
// const highlightNextWord = (event) => {
//     const wordElements = wordDisplay.children;


const highlightNextWord = () => { 
    const wordElements = wordDisplay.children;
    if (currentWordIndex < wordElements.length) {
        if (currentWordIndex > 0) {
            wordElements[currentWordIndex - 1].style.color = "lime";
        }
        wordElements[currentWordIndex].style.color = "red";
    }


};

    inputField.addEventListener("keydown",(event)=>{
          const wordElements = wordDisplay.children;

    setTimeout(() => {
        const typed = inputField.value;
        const currentWord = wordsToType[currentWordIndex];

        for (let i = 0; i < currentWord.length; i++) {
            wordElements[currentWordIndex].children[i].style.color = "";
        }
        for (let i = 0; i < currentWord.length; i++) {
            wordElements[currentWordIndex].children[i].style.borderLeft = "";
            
        }

        const cursorIndex = typed.length;
        if (cursorIndex < currentWord.length) {
            wordElements[currentWordIndex].children[cursorIndex].style.borderLeft = "2px solid white";
        }

        for (let i = 0; i < currentWord.length; i++) {
    const letter = wordElements[currentWordIndex].children[i];
    
    if (i < typed.length) {
        if (typed[i] === currentWord[i]) {
            letter.style.color = "lime";
        } else if (currentWord.includes(typed[i])) {
            letter.style.color = "yellow";
            totalErrors++;
        } else {
            letter.style.color = "red";
            totalErrors++;
        }
    } else {
        letter.style.color = ""; 
    }
}

        if (typed === currentWord) {
            wordElements[currentWordIndex].style.color = "lime";
        }else{
            wordElements[currentWordIndex].style.color = "red";
        }
        
        if (typed.length > currentWord.length) {
    wordElements[currentWordIndex].style.outline = "3px solid orange";
    totalErrors++;
} else {
    wordElements[currentWordIndex].style.outline = "";
}

    }, 0);

    if (!startTime) {
        startTimer();

        if (timeSelect.value.includes("30")) time.textContent = thirty;
        else if (timeSelect.value.includes("60")) time.textContent = sixty;
        
        countdown = setInterval(() => {
            const current = parseInt(time.textContent);
            if (current > 0) {
                time.textContent = current - 1;
            } else {
                clearInterval(countdown);
                alert("Temps écoulé !");
            }
        }, 1000);
    }

    startTimer();
    updateWord(event);
       
    })

// Event listeners
// Attach `updateWord` to `keydown` instead of `input`
// inputField.addEventListener("keydown", (event) => {
//     startTimer();
//     updateWord(event);
// });
modeSelect.addEventListener("change", () => startTest());

// Start the test
startTest();


























































// let startTime = null, previousEndTime = null;
// let currentWordIndex = 0;
// const wordsToType = [];

// const modeSelect = document.getElementById("mode");
// const wordDisplay = document.getElementById("word-display");
// const inputField = document.getElementById("input-field");
// const results = document.getElementById("results");

// const words = {
//     easy: ["apple", "banana", "grape", "orange", "cherry"],
//     medium: ["keyboard", "monitor", "printer", "charger", "battery"],
//     hard: ["synchronize", "complicated", "development", "extravagant", "misconception"]
// };

// // Generate a random word from the selected mode
// const getRandomWord = (mode) => {
//     const wordList = words[mode];
//     return wordList[Math.floor(Math.random() * wordList.length)];
// };

// Initialize the typing test
// const startTest = (wordCount = 50) => {
//     wordsToType.length = 0; // Clear previous words
//     wordDisplay.innerHTML = ""; // Clear display
//     currentWordIndex = 0;
//     startTime = null;
//     previousEndTime = null;

//     for (let i = 0; i < wordCount; i++) {
//         wordsToType.push(getRandomWord(modeSelect.value));
//     }

//     wordsToType.forEach((word, index) => {
//         const span = document.createElement("span");
//         span.textContent = word + " ";
//         if (index === 0) span.style.color = "red"; // Highlight first word
//         wordDisplay.appendChild(span);
//     });

//     inputField.value = "";
//     results.textContent = "";
// };

// // Start the timer when user begins typing
// const startTimer = () => {
//     if (!startTime) startTime = Date.now();
// };

// // Calculate and return WPM & accuracy
// const getCurrentStats = () => {
//     const elapsedTime = (Date.now() - previousEndTime) / 1000; // Seconds
//     const wpm = (wordsToType[currentWordIndex].length / 5) / (elapsedTime / 60); // 5 chars = 1 word
//     const accuracy = (wordsToType[currentWordIndex].length / inputField.value.length) * 100;

//     return { wpm: wpm.toFixed(2), accuracy: accuracy.toFixed(2) };
// };

// // Move to the next word and update stats only on spacebar press
// const updateWord = (event) => {
//     if (event.key === " ") { // Check if spacebar is pressed
//         if (inputField.value.trim() === wordsToType[currentWordIndex]) {
//             if (!previousEndTime) previousEndTime = startTime;

//             const { wpm, accuracy } = getCurrentStats();
//             results.textContent = `WPM: ${wpm}, Accuracy: ${accuracy}%`;

//             currentWordIndex++;
//             previousEndTime = Date.now();
//             highlightNextWord();

//             inputField.value = ""; // Clear input field after space
//             event.preventDefault(); // Prevent adding extra spaces
//         }
//     }
// };

// // Highlight the current word in red
// const highlightNextWord = () => {
//     const wordElements = wordDisplay.children;

//     if (currentWordIndex < wordElements.length) {
//         if (currentWordIndex > 0) {
//             wordElements[currentWordIndex - 1].style.color = "black";
//         }
//         wordElements[currentWordIndex].style.color = "red";
//     }
// };

// // Event listeners
// // Attach `updateWord` to `keydown` instead of `input`
// inputField.addEventListener("keydown", (event) => {
//     startTimer();
//     updateWord(event);
// });
// modeSelect.addEventListener("change", () => startTest());

// // Start the test
// startTest();