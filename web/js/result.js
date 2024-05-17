const scoreTag = document.getElementById("score-result");
const timeTag = document.getElementById("time-result");
const difficultyTag = document.getElementById("difficulty-result");
// const placeTag = document.getElementById("place-result");

const score = localStorage.getItem("score");
const namennn = localStorage.getItem("name");
const time = localStorage.getItem("time");
let difficulty;

scoreTag.innerHTML = '<span class="result-tag-span">Punkte:</span> ' + score;

const minutes = Math.floor(time / 60);
const seconds = time % 60;

if (minutes < 1) {
  timeTag.innerHTML = `<span class="result-tag-span">Zeit:</span> ${seconds}s`;
} else {
  timeTag.innerHTML = `<span class="result-tag-span">Zeit:</span> ${minutes}min ${seconds}s`;
}

// placeTag.innerHTML = '<span class="result-tag-span">Platz:</span> #' + "1";


const replayBtn = document.getElementById("btn-replay");


function clear_local_storage() {
  localStorage.setItem("exerciseCounter", 1);
  localStorage.setItem("score", 0);
  localStorage.setItem("time", 0);
}

function form(namennn, score, time) {
  difficulty = "leicht";

  // TODO check for improper input (santize before sending to server)
  let rt = `/api/v1/new/?name=${namennn}&difficulty=1&time=${time}&score=${score}`;

  fetch(rt, {
    method: 'GET',
  })
    .then(response => console.log(response))
    .then(data => console.log(data))
    .catch(error => console.error('Error:', error));

    localStorage.setItem("req", true);
}

form(namennn, score, seconds, 1);
clear_local_storage();

replayBtn.addEventListener("click", () => {
  clear_local_storage();

  localStorage.setItem("req", false);
  window.location.href = "/index.html";
});
