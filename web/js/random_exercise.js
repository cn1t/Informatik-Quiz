import { changeScore, resetScoreTag, resetTimeCounter } from "./stats.js";

let exercises;
let difficulty;


fetch('/exercises/exercises.json')
  .then(response => response.json())
  .then(data => {
    exercises = data;

    if (localStorage.getItem("exerciseCounter") <= 5) {
      difficulty = "leicht";
    } else if (localStorage.getItem("exerciseCounter") <= 8) {
      difficulty = "mittel";
    } else {
      difficulty = "schwer";
    }

    displayRandomExercise(getRandomExercise(exercises, difficulty));
  })
  .catch(error => {
    console.error('Error loading exercise data: ', error);
  });

const hist = [];

function getRandomExercise(exercises, difficulty) {
  const difficultyExercises = exercises[difficulty];

  if (!difficultyExercises) {
    return null;
  }

  const exerciseKeys = Object.keys(difficultyExercises).filter((key) => !hist.includes(key));
  const randomIndex = Math.floor(Math.random() * exerciseKeys.length);
  const randomExerciseKey = exerciseKeys[randomIndex];
  hist.push(randomExerciseKey)
  return {
    title: randomExerciseKey,
    ...difficultyExercises[randomExerciseKey]
  };
}

const exerciseCounter = document.getElementById("exercise-counter");

if (!localStorage.getItem("exerciseCounter")) {
  localStorage.setItem("exerciseCounter", 1);
}

function displayRandomExercise(exercise) {
  resetTimeCounter();

  const title = exercise.title;
  const text1 = exercise.text1;
  const text2 = exercise.text2;
  const image = exercise.image;
  const options = exercise.options;

  let exerciseCounterNumber = parseInt(localStorage.getItem("exerciseCounter"));

  exerciseCounter.innerText = exerciseCounterNumber + " / 10";

  const titleElement = document.getElementById("title");
  titleElement.innerText = title;

  const text1Element = document.getElementById("text1");
  text1Element.innerHTML = text1;

  const imageElement = document.getElementById("exercise-image");
  imageElement.src = "/exercises/images/" + image;

  const text2Element = document.getElementById("text2");
  text2Element.innerHTML = text2;

  const optionsContainer = document.getElementById("options-container");
  optionsContainer.innerHTML = "";

  resetScoreTag();

  options.forEach((option, index) => {
    const button = document.createElement("button");
    button.classList.add("exercise-btn");

    if (option.includes("RICHTIG")) {
      button.classList.add("correct");
    }

    button.textContent = option.replace("RICHTIG", "");
    button.addEventListener("click", () => {
      if (button.classList.contains("correct")) {
        button.classList.add("correct-answer");

        changeScore("correct");

        setTimeout(() => {
          if (exerciseCounterNumber < 10) {
            localStorage.setItem("exerciseCounter", exerciseCounterNumber + 1);

            if (localStorage.getItem("exerciseCounter") <= 5) {
              difficulty = "leicht";
            } else if (localStorage.getItem("exerciseCounter") <= 8) {
              difficulty = "mittel";
            } else {
              difficulty = "schwer";
            }
            
            displayRandomExercise(getRandomExercise(exercises, difficulty));
          } else {
            window.location.href = "/result.html";
          }
        }, 1500);
      } else {
        button.classList.add("wrong-answer");

        const correctButton = document.querySelector(".correct");
        correctButton.classList.add("correct-answer");

        changeScore("wrong");

        setTimeout(() => {
          if (exerciseCounterNumber < 10) {
            localStorage.setItem("exerciseCounter", exerciseCounterNumber + 1);

            if (localStorage.getItem("exerciseCounter") <= 5) {
              difficulty = "leicht";
            } else if (localStorage.getItem("exerciseCounter") <= 8) {
              difficulty = "mittel";
            } else {
              difficulty = "schwer";
            }

            displayRandomExercise(getRandomExercise(exercises, difficulty));
          } else {
            window.location.href = "/result.html";
          }
        }, 1500);
      }

      const buttons = document.querySelectorAll(".exercise-btn");
      buttons.forEach(button => {
        button.disabled = true;
      });
    });
    optionsContainer.appendChild(button);
  });
}