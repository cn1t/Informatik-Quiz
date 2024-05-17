const nameTag = document.getElementById("name-info-tag");
const scoreTag = document.getElementById("score-info-tag");
const timeTag = document.getElementById("time-info-tag");
const timeTotalTag = document.getElementById("time-total-info-tag");

const username = localStorage.getItem("name");
const score = localStorage.getItem("score");
const time = localStorage.getItem("time");

nameTag.innerText = username;
scoreTag.innerText = "Punkte: " + score;

let timeCounter = 0;

setInterval(() => {
  const minutes = Math.floor(timeCounter / 60);
  const seconds = timeCounter % 60;

  if (minutes < 1) {
    timeTag.innerText = `Zeit: ${seconds}s`;
  } else {
    timeTag.innerText = `Zeit: ${minutes}min ${seconds}s`;
  }

  timeCounter++;
}, 1000);

function resetTimeCounter() {
  timeCounter = 0;
}

let totalTimeCounter = localStorage.getItem("time") || 0;

setInterval(() => {
  const minutes = Math.floor(totalTimeCounter / 60);
  const seconds = totalTimeCounter % 60;

  if (minutes < 1) {
    timeTotalTag.innerText = `Zeit (insgesamt): ${seconds}s`;
  } else {
    timeTotalTag.innerText = `Zeit (insgesamt): ${minutes}min ${seconds}s`;
  }

  if (totalTimeCounter % 3 === 0) {
    localStorage.setItem("time", totalTimeCounter);
  }

  totalTimeCounter++;
}, 1000);

function changeScore(rating) {
  if (rating == "correct") {
    const score = localStorage.getItem("score") || 0;

    const newScore = Math.round(100 - timeCounter * 0.7);

    localStorage.setItem("score", parseInt(score) + newScore);

    scoreTag.innerHTML = "Punkte: " + score + ' <span style="color: green;">(+' + newScore + ')</span>';
  } else {
    const score = localStorage.getItem("score") || 0;
    scoreTag.innerHTML = "Punkte: " + score + ' <span style="color: red;">(+0)</span>';
  }
}

function resetScoreTag() {
  const score = localStorage.getItem("score") || 0;

  scoreTag.innerHTML = "Punkte: " + score;
}

export { changeScore, resetScoreTag, resetTimeCounter };