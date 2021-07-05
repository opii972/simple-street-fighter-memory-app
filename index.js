let isCardAnimationRunning;
let gameCardsArray;
let gameStateArray;
const compareCardArray = [];

const generateCardsArray = totalCells => {
  const arr = Array(totalCells).fill(null).map((_, i) => Math.floor(i/2));
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

const handleCardClick = event => {
  if (isCardAnimationRunning || compareCardArray.length > 1) return;

  const index = +event.target.closest('.card').getAttribute("data-id");

  if (compareCardArray.includes(index) || gameStateArray[index]) return;

  flipCard(index);
  compareCardArray.push(index);

  if (compareCardArray.length > 1) {
    if (gameCardsArray[compareCardArray[0]] === gameCardsArray[compareCardArray[1]]) {
      gameStateArray[compareCardArray[0]] = gameStateArray[compareCardArray[1]] = true;
      compareCardArray.length = 0;
      checkGameState();
    } else {
      isCardAnimationRunning = true;
      shakeCard(compareCardArray[0]);
      shakeCard(compareCardArray[1]);

      setTimeout(() => {
        flipCard(compareCardArray[0]);
        flipCard(compareCardArray[1]);
        compareCardArray.length = 0;
        isCardAnimationRunning = false;
      }, 1200);
    }
  }
}

const checkGameState = () => {
  if (gameStateArray.every(state => state)) {
    setTimeout(() => alert('You win!'), 600);
  }
}

const shakeCard = cardIndex => {
  setTimeout(() => document.querySelector(`[data-id='${cardIndex}']`).classList.add("card--shaked"), 600);
  setTimeout(() => document.querySelector(`[data-id='${cardIndex}']`).classList.remove("card--shaked"), 1200);
}

const flipCard = cardIndex => {
  const cardElement = document.querySelector(`[data-id='${cardIndex}']`);

  if (!cardElement.classList.contains("card--selected")) {
    cardElement.classList.add("card--selected");
    cardElement.querySelector(".card-back").style.backgroundImage = cardCharacterMapper(gameCardsArray[cardIndex]);
  } else {
    cardElement.classList.remove("card--selected");
    cardElement.querySelector(".card-back").removeAttribute("style")
  }
}

const cardCharacterMapper = cardIndex => {
  switch(cardIndex) {
    case 0: return "url('file:images/ryu.jpg')";
    case 1: return "url('file:images/ken.jpg')";
    case 2: return "url('file:images/chun-li.jpg')";
    case 3: return "url('file:images/honda.jpg')";
    case 4: return "url('file:images/balrog.jpg')";
    case 5: return "url('file:images/sagat.jpg')";
    case 6: return "url('file:images/vega.jpg')";
    case 7: return "url('file:images/bison.jpg')";
  }
}

const drawBoardGame = totalCells => {
  let index = 0;
  while(index < totalCells) {
    const cardFrontElement = document.createElement("div");
    cardFrontElement.classList.add("card-front");

    const cardBackElement = document.createElement("div");
    cardBackElement.classList.add("card-back");
    cardBackElement.style.backgroundImage = cardCharacterMapper(gameCardsArray[index]);

    const cardInnerElement = document.createElement("div");
    cardInnerElement.classList.add("card-inner");
    cardInnerElement.appendChild(cardFrontElement);
    cardInnerElement.appendChild(cardBackElement);

    const cardElement = document.createElement("div");
    cardElement.classList.add("card");
    cardElement.classList.add("card--selected");
    cardElement.setAttribute('data-id', index);
    cardElement.addEventListener('click', handleCardClick);
    cardElement.appendChild(cardInnerElement);

    document.querySelector("#container").appendChild(cardElement);

    index++;
  }
}

const startGame = () => {
  isCardAnimationRunning = true;
  setTimeout(() => {
    gameCardsArray.forEach((_,cardIndex) => flipCard(cardIndex));
    isCardAnimationRunning = false;
  }, 2000);
}

const loadGame = numberOfPairCards => {
  gameCardsArray = generateCardsArray(numberOfPairCards * 2);
  gameStateArray = new Array(numberOfPairCards * 2).fill(false);
  drawBoardGame(numberOfPairCards * 2);
}

loadGame(8);
startGame();