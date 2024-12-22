import GameManager from "./GameManager.js";
import { setUseIndividualValues, restartGame } from "../MatrixScript.js";
import { MoveCards } from "../MoveCards.js";

//Initializes objects
var gameManager = new GameManager();
var moveCards = new MoveCards();

//Initializes buttons
const individualButton = document.getElementById("Individualbutton");
const tenButton = document.getElementById("Tenbutton");
const rulesButton = document.getElementById("Rulesbutton");
const rulesButton2 = document.getElementById("Rulesbutton2");
const creditsButton = document.getElementById("Creditsbutton");
const backButton = document.getElementById("Backbutton");
const nextButton = document.getElementById("Nextbutton");
const undoButton = document.getElementById("Undobutton");
const restartButton = document.getElementById("Restartbutton");

const rulesText1 = document.getElementById("RulesText1");
const rulesText2 = document.getElementById("RulesText2");
const rulesText3 = document.getElementById("RulesText3");
const rulesText4 = document.getElementById("RulesText4");
const creditsText = document.getElementById("CreditsText");

const table = document.getElementById("Table");

var lastState = "Menu";
changeActiveButtons(0);

function individualClicked() {
  gameManager.changeGameState("Game");
  changeActiveButtons(3);
  setUseIndividualValues(true);
}
function tenClicked() {
  gameManager.changeGameState("Game");
  changeActiveButtons(3);
  setUseIndividualValues(false);
}
function rulesClicked() {
  gameManager.changeGameState("Rules");
  changeActiveButtons(1);
}

function creditsClicked() {
  gameManager.changeGameState("Credits");
  changeActiveButtons(4);
}

function backClicked() {
  if (gameManager.getState() == "Rules" || gameManager.getState() == "Credits") {
    if (lastState == "Menu" || lastState == "Credits") {
      gameManager.changeGameState("Menu");
      changeActiveButtons(0);
    } else if (lastState == "Game") {
      gameManager.changeGameState("Game");
      changeActiveButtons(3);
    }
  } else if (gameManager.getState() == "Rules2") {
    gameManager.changeGameState("Rules");
    changeActiveButtons(1);
  } else if (gameManager.getState() == "Win" || gameManager.getState() == "Lose") {
    console.clear();
    gameManager.changeGameState("Menu");
    changeActiveButtons(0);
    restartGame();
  }
}

function nextClicked() {
  gameManager.changeGameState("Rules2");
  changeActiveButtons(2);
}

function undoClicked() {
  moveCards.undo();
}

function undoOver() {
  if (moveCards.getUndo()) {
    undoButton.style.color = "#3A3B3C";
    undoButton.style.backgroundColor = "#FFFFFF";
    undoButton.style.borderColor = "#3A3B3C";

  }
}

function undoLeave() {
  undoButton.style.color = "#FFFFFF";
  undoButton.style.backgroundColor = "#3A3B3C";
  undoButton.style.borderColor = "#FFFFFF";
}

function restart() {
  console.clear();
  gameManager.changeGameState("Menu");
  changeActiveButtons(0);
  restartGame();
}

function changeActiveButtons(active) {
  /** 
  Active
  0 = Menu
  1 = Rules
  2 = Rules2
  3 = Game
  */

  //Menu
  if (active == 0) {
    individualButton.style.display = "inline-block";
    tenButton.style.display = "inline-block";
    rulesButton.style.display = "inline-block";
    rulesButton2.style.display = "none";
    creditsButton.style.display = "inline-block";
    backButton.style.display = "none";
    nextButton.style.display = "none";
    undoButton.style.display = "none";
    restartButton.style.display = "none";

    rulesText1.style.display = "none";
    rulesText2.style.display = "none";
    rulesText3.style.display = "none";
    rulesText4.style.display = "none";
    creditsText.style.display = "none";

    table.style.display = "none";

    lastState = "Menu";
    //Rules
  } else if (active == 1) {
    individualButton.style.display = "none";
    tenButton.style.display = "none";
    rulesButton.style.display = "none";
    rulesButton2.style.display = "none";
    creditsButton.style.display = "none";
    backButton.style.display = "inline-block";
    nextButton.style.display = "inline-block";
    undoButton.style.display = "none";
    restartButton.style.display = "none";

    rulesText1.style.display = "inline-block";
    rulesText2.style.display = "inline-block";
    rulesText3.style.display = "inline-block";
    rulesText4.style.display = "none";
    creditsText.style.display = "none";

    table.style.display = "none";
    //Rules2
  } else if (active == 2) {
    individualButton.style.display = "none";
    tenButton.style.display = "none";
    rulesButton.style.display = "none";
    rulesButton2.style.display = "none";
    creditsButton.style.display = "none";
    backButton.style.display = "inline-block";
    nextButton.style.display = "none";
    undoButton.style.display = "none";
    restartButton.style.display = "none";

    rulesText1.style.display = "none";
    rulesText2.style.display = "none";
    rulesText3.style.display = "none";
    rulesText4.style.display = "inline-block";
    creditsText.style.display = "none";

    table.style.display = "table";
    //Game
  } else if (active == 3) {
    individualButton.style.display = "none";
    tenButton.style.display = "none";
    rulesButton.style.display = "none";
    rulesButton2.style.display = "inline-block";
    creditsButton.style.display = "none";
    backButton.style.display = "none";
    nextButton.style.display = "none";
    undoButton.style.display = "inline-block";
    restartButton.style.display = "inline-block";

    rulesText1.style.display = "none";
    rulesText2.style.display = "none";
    rulesText3.style.display = "none";
    rulesText4.style.display = "none";
    creditsText.style.display = "none";

    table.style.display = "none";

    lastState = "Game";
  }
  //Credits
  else if (active == 4) {
    individualButton.style.display = "none";
    tenButton.style.display = "none";
    rulesButton.style.display = "none";
    rulesButton2.style.display = "none";
    creditsButton.style.display = "none";
    backButton.style.display = "inline-block";
    nextButton.style.display = "none";
    undoButton.style.display = "none";
    restartButton.style.display = "none";

    rulesText1.style.display = "none";
    rulesText2.style.display = "none";
    rulesText3.style.display = "none";
    rulesText4.style.display = "none";
    creditsText.style.display = "none";

    table.style.display = "none";

    lastState = "Credits";
  }
  else {
    individualButton.style.display = "none";
    tenButton.style.display = "none";
    rulesButton.style.display = "none";
    rulesButton2.style.display = "none";
    creditsButton.style.display = "none";
    backButton.style.display = "none";
    nextButton.style.display = "none";
    undoButton.style.display = "none";
    restartButton.style.display = "inline-block";

    rulesText1.style.display = "none";
    rulesText2.style.display = "none";
    rulesText3.style.display = "none";
    rulesText4.style.display = "none";

    table.style.display = "none";

    lastState = "Game";
  }
}

function loop() {
  if (moveCards.getUndo()) {
    undoButton.style.opacity = "1";
  } else {
    undoButton.style.opacity = "0.2";
    undoButton.style.color = "#FFFFFF";
    undoButton.style.backgroundColor = "#3A3B3C";
    undoButton.style.borderColor = "#FFFFFF";
  }

  if (gameManager.getState() == "Win" || gameManager.getState() == "Lose") {
    changeActiveButtons(4);
  }
}

//Adds Listeners to listen for the buttons being clicked
individualButton.addEventListener("click", individualClicked);
tenButton.addEventListener("click", tenClicked);
rulesButton.addEventListener("click", rulesClicked);
rulesButton2.addEventListener("click", rulesClicked);
creditsButton.addEventListener("click", creditsClicked);
backButton.addEventListener("click", backClicked);
nextButton.addEventListener("click", nextClicked);
undoButton.addEventListener("click", undoClicked);
undoButton.addEventListener("mouseover", undoOver);
undoButton.addEventListener("mouseleave", undoLeave);
restartButton.addEventListener("click", restart);

window.onload = setInterval(loop, 1000 / 3);

/** 
Quality of life print function
@Parameter text - the text to print into the console
*/
function print(text) {
  console.log(text);
};
