const mario = document.querySelector(".super-mario");
const pipe = document.querySelector(".pipe-game");
let numVidas = 3;
let pontuacao = 0;

const jump = () => {
  mario.classList.add("jump-mario");

  setTimeout(() => {
    mario.classList.remove("jump-mario");
  }, 500);
};

const updateGame = () => {
  // atualiza a tela do jogo com o número de vidas e a pontuação atual
  const heartElements = document.querySelectorAll(".heart");
  for (let i = 0; i < heartElements.length; i++) {
    if (i < numVidas) {
      heartElements[i].style.display = "inline";
    } else {
      heartElements[i].style.display = "none";
    }
  }
  const numVidasElement = document.querySelector(".num-vidas");
  numVidasElement.textContent = `Vidas: ${numVidas}`;

  const pontuacaoElement = document.querySelector(".pontuacao");
  pontuacaoElement.textContent = `Pontuação: ${pontuacao}`;
};

const loopGame = setInterval(() => {
  const pipePosition = pipe.offsetLeft;
  const marioPosition = +window
    .getComputedStyle(mario)
    .bottom.replace("px", "");

  if (pipePosition <= 120 && pipePosition > 0 && marioPosition < 80) {
    numVidas -= 1;
    if (numVidas > 0) {
      updateGame();
      pipe.style.animation = "none";
      pipe.style.left = `${pipePosition}px`;

      mario.style.animation = "none";
      mario.style.bottom = `${marioPosition}px`;

      pontuacao += 10;
    } else {
      mario.src = "./imagens/mario-game-over.png";
      mario.style.width = "75px";
      mario.style.marginLeft = "45px";
      clearInterval(loopGame);
    }
  } else if (numVidas > 0) { // added a condition to check if numVidas is greater than 0 before updating the game
    updateGame();
  } else {
    clearInterval(loopGame);
  }
}, 10);

document.addEventListener("keydown", jump);
updateGame();
