let words = document.querySelector(".display");
let timerElement = document.getElementById("timer");
let statusElement = document.querySelector(".status");
let startButton = document.querySelector(".startGame");
let container = document.querySelector(".container");
let example = document.querySelector(".example");
let input = document.querySelector("input");
let youSurvived = document.querySelector(".you-survived");
let changeSpeed = document.querySelector(".change-speed");
let youKilled = document.querySelector(".you-killed");
let yourSpeed = document.querySelector(".your-speed");

let gameSpeed = changeSpeed.value;

changeSpeed.oninput = (e) => {
  document.documentElement.style.setProperty(
    "--animation-speed",
    e.target.value + "s"
  );
};

const alphabetArray = Array.from({ length: 26 }, (_, index) =>
  String.fromCharCode("a".charCodeAt(0) + index)
);

let wordsArray = [
  "skateboard",
  "icecream",
  "child",
  "awful",
  "creative",
  "option",
  "line",
  "set",
  "then",
  "only",
  "small",
  "however",
  "consider",
  "computer",
  "good",
  "public",
  "place",
  "while",
  "year",
  "interest",
  "glamorous",
  "kiss",
  "love",
  "baby",
  "taxi",
  "octopus",
];
let delayedArray = [
  0, 0.5, 1, 1.5, 2, 2.5, 3, 3.5, 4, 4.5, 5, 5.5, 6, 6.5, 7, 7.5, 8, 8.5, 9,
  9.5, 10, 10.5, 11, 11.5, 12, 12.5,
];
console.log(delayedArray.length);

changeSpeed.onchange = () => {};

function customRandom(seed) {
  let x = Math.sin(seed++);
  return x - Math.floor(x);
}

function uniqueRandomDelay(index, arrayLength, seed) {
  const normalizedIndex = index / arrayLength;
  const randomSeed = seed + normalizedIndex;
  return customRandom(randomSeed);
}

const seed = new Date().getTime();
let lastChoice;
let startGameInterval;

function startGame() {
  startButton.remove();

  let index = 0;
  input.focus();

  document.querySelectorAll(".word").forEach((div) => {
    div.remove();
  });

  function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]];
    }
  }
  shuffleArray(wordsArray);
  startGameInterval = setInterval(() => {
    if (index < wordsArray.length) {
      let wordParent = document.createElement("div");
      wordParent.classList.add("word");
      const delayIndex = index % delayedArray.length;
      wordParent.style.animationDelay = `${delayedArray[delayIndex]}s`;

      wordsArray[index].split("").forEach((character) => {
        let span = document.createElement("span");
        span.classList.add("span");
        span.innerText = character;
        wordParent.appendChild(span);
      });

      wordParent.classList.add("move");
      container.appendChild(wordParent);

      index++;
    } else {
      clearInterval(startGameInterval);
    }
  }, 500);

  startTimer();
}

container.onclick = () => {
  input.focus();
};
container.ontouchstart = () => {
  input.focus();
};

startButton.addEventListener("click", startGame, { once: true });
let wordCount = 0;
let keysArray = [];
input.oninput = (e) => {
  const key = e.key;
  const keyCode = e.keyCode;
  if (keyCode === 8) {
    keysArray.pop();
  }
  for (let i = 0; i < alphabetArray.length; i++) {
    if (alphabetArray[i] === key) {
      keysArray.push(key);
    }
  }
  console.log(keysArray);
  const arrayInput = input.value.split("");

  let correct = true;
  const spans = container.querySelectorAll("span");
  spans.forEach((characterSpan, index) => {
    const character = arrayInput[index];

    if (character == null) {
      characterSpan.classList.remove("correct");
      characterSpan.classList.remove("incorrect");
      const correctChildren =
        characterSpan.parentElement.querySelectorAll("span.correct");
      const children = characterSpan.parentElement.querySelectorAll("span");

      if (children.length === correctChildren.length) {
        characterSpan.parentElement.classList.add("complete");
      } else {
        characterSpan.parentElement.classList.remove("complete");
      }
      correct = false;
    } else if (character === characterSpan.innerText) {
      characterSpan.classList.add("correct");
      characterSpan.classList.remove("incorrect");
      characterSpan.parentElement.classList.add("focus");
      const correctChildren =
        characterSpan.parentElement.querySelectorAll("span.correct");
      const children = characterSpan.parentElement.querySelectorAll("span");

      if (children.length === correctChildren.length) {
        characterSpan.parentElement.classList.add("complete");
        wordCount += 1;
        input.value = "";
        characterSpan.parentElement.remove();
        keysArray = [];
      } else {
        characterSpan.parentElement.classList.remove("complete");
      }
    } else {
      characterSpan.classList.remove("correct");
      characterSpan.classList.add("incorrect");
      correct = false;
    }
  });
};

function startTimer() {
  let count = 0;
  timerElement.innerText = 0;
  startTime = new Date();
  let interval = setInterval(() => {
    timerElement.innerText = getTimerTime();
    count += 1;

    let words = document.querySelectorAll(".word");
    let completeWords = document.querySelectorAll(".word.complete");
    words.forEach((word) => {
      console.log(word.getBoundingClientRect().x);

      word.addEventListener("animationend", function () {
        if (
          word.offsetLeft >= container.offsetWidth - word.offsetWidth &&
          !word.classList.contains("complete")
        ) {
          clearInterval(startGameInterval);
          document.querySelectorAll(".word").forEach((div) => {
            div.remove();
          });
          clearInterval(interval);
          let playAgain = document.createElement("button");
          playAgain.classList.add("playAgain");
          playAgain.onclick = (e) => {
            startGame();
            e.target.remove();
            statusElement.innerText = "";
            youSurvived.innerText = "";
            youKilled.innerText = "";
            yourSpeed.innerText = "";
            wordCount = 0;
          };
          playAgain.innerText = "Play Again";
          document.body.appendChild(playAgain);
          statusElement.innerText = "You Lost!";
          youSurvived.innerText =
            "You survived " + timerElement.innerText + " seconds";
          youKilled.innerText =
            wordCount === 1
              ? "You killed " + wordCount + "word"
              : "You killed " + wordCount + " words";
          yourSpeed.innerText =
            "WPM: " + Math.round(wordCount / (timerElement.innerText / 60));
          container.appendChild(statusElement);
          container.appendChild(youSurvived);
          container.appendChild(youKilled);
          container.appendChild(yourSpeed);
        }
      });
    });
    if (container.children.length === 0) {
      clearInterval(startGameInterval);
      clearInterval(interval);
      let playAgain = document.createElement("button");
      playAgain.classList.add("playAgain");
      playAgain.onclick = (e) => {
        startGame();
        e.target.remove();
        statusElement.innerText = "";
        youSurvived.innerText = "";
        wordCount = 0;
      };
      playAgain.innerText = "Play Again";
      document.body.appendChild(playAgain);
      statusElement.innerText = "You Won!";
      youSurvived.innerText =
        "You survived " + timerElement.innerText + " seconds";
      container.appendChild(statusElement);
      container.appendChild(youSurvived);
    }
  }, 1000);
}
function getTimerTime() {
  return Math.floor((new Date() - startTime) / 1000);
}
