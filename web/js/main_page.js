const inputName = document.getElementById("name");

const playButton = document.getElementById("btn-play");

playButton.addEventListener("click", doSomething);

function doSomething() {
  localStorage.setItem("name", inputName.value)
  localStorage.setItem("score", 0);
  localStorage.setItem("time", 0);

  window.location.href = "exercise.html";
}