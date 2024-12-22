import { Deck, HUD, MoveCards } from "./HUD.js";
import GameManager from "./Managers/GameManager.js";

//Creates References
var gameManager = new GameManager();
var deckRef = new Deck();
var hud = new HUD();
var moveCards = new MoveCards();

var screenWidth = innerWidth;

var deck = deckRef.getDeck();


deckRef.setXPos(deck[0], screenWidth / 2 - 110);
deckRef.setXPos(deck[1], screenWidth / 2 + 10);

//Initializes images
var image = hud.getCardImage();

//Initializes Variables
const canvas = document.querySelector("canvas");
var size = deckRef.getSize();

//Creates references to the matrices that update as soon as possible
var matrix1 = moveCards.getMatrix1();
var matrix2 = moveCards.getMatrix2();
//Creates deep copies to the matrices that do not update until explicitly told to do so
var matrix1Clone = structuredClone(moveCards.getMatrix1());
var matrix2Clone = structuredClone(moveCards.getMatrix2());

var useIndividualValues = false;
var loseTimer = 0;
//Game Loop
function loop() {
  //Draws the Cards
  image.onload = hud.draw();

  //When Game Starts - begin Game Loop
  if (gameManager.getState() == "Game") {
    matrix1 = moveCards.getMatrix1();
    matrix2 = moveCards.getMatrix2();

    //Updates the deep copies clones
    matrix1Clone = structuredClone(matrix1);
    matrix2Clone = structuredClone(matrix2);


    //Checks if cards in the matrices
    //Checks the first row
    if (matrix1Clone[0][0].card != null && matrix1Clone[1][0].card != null && matrix1Clone[2][0].card != null &&
      matrix2Clone[0][0].card != null && matrix2Clone[1][0].card != null && matrix2Clone[2][0].card != null) {

      //Checks if the values match, if so clear the cards
      if (compareValues(true, 0)) {
        print("Cards Removed:");
        moveCards.clearMatrixRow(1, 0);
        moveCards.clearMatrixRow(2, 0);
      }
    }
    //Checks the second row
    if (matrix1Clone[0][1].card != null && matrix1Clone[1][1].card != null && matrix1Clone[2][1].card != null &&
      matrix2Clone[0][1].card != null && matrix2Clone[1][1].card != null && matrix2Clone[2][1].card != null) {
      //Checks if the values match, if so clear the cards
      if (compareValues(true, 1)) {
        print("Cards Removed:");
        moveCards.clearMatrixRow(1, 1);
        moveCards.clearMatrixRow(2, 1);
      }
    }
    //Checks the third row
    if (matrix1Clone[0][2].card != null && matrix1Clone[1][2].card != null && matrix1Clone[2][2].card != null &&
      matrix2Clone[0][2].card != null && matrix2Clone[1][2].card != null && matrix2Clone[2][2].card != null) {
      //Checks if the values match, if so clear the cards
      if (compareValues(true, 2)) {
        print("Cards Removed:");
        moveCards.clearMatrixRow(1, 2);
        moveCards.clearMatrixRow(2, 2);
      }
    }

    //Checks the first column
    if (matrix1Clone[0][0].card != null && matrix1Clone[0][1].card != null && matrix1Clone[0][2].card != null &&
      matrix2Clone[0][0].card != null && matrix2Clone[0][1].card != null && matrix2Clone[0][2].card != null) {
      //Checks if the values match, if so clear the cards
      if (compareValues(false, 0)) {
        print("Cards Removed:");
        moveCards.clearMatrixColumn(1, 0);
        moveCards.clearMatrixColumn(2, 0);
      }
    }
    //Checks the second column
    if (matrix1Clone[1][0].card != null && matrix1Clone[1][1].card != null && matrix1Clone[1][2].card != null &&
      matrix2Clone[1][0].card != null && matrix2Clone[1][1].card != null && matrix2Clone[1][2].card != null) {
      //Checks if the values match, if so clear the cards
      if (compareValues(false, 1)) {
        print("Cards Removed:");
        moveCards.clearMatrixColumn(1, 1);
        moveCards.clearMatrixColumn(2, 1);
      }
    }
    //Checks the third column
    if (matrix1Clone[2][0].card != null && matrix1Clone[2][1].card != null && matrix1Clone[2][2].card != null &&
      matrix2Clone[2][0].card != null && matrix2Clone[2][1].card != null && matrix2Clone[2][2].card != null) {
      //Checks if the values match, if so clear the cards
      if (compareValues(false, 2)) {
        print("Cards Removed:");
        moveCards.clearMatrixColumn(1, 2);
        moveCards.clearMatrixColumn(2, 2);
      }
    }

    //Ending the Game

    //If the deck is empty, win the game
    if (deckRef.getSize() == 0)
      gameManager.changeGameState("Win");
    //Check for how many Matrix slots are filled with a card
    else {
      var occupiedSlot = 0;
      for (var i = 0; i < 3; i++) {
        for (var j = 0; j < 3; j++) {
          //Counts each nonempty matrix slot
          if (matrix1Clone[i][j].card != null)
            occupiedSlot++;
          if (matrix2Clone[i][j].card != null)
            occupiedSlot++;
        }
      }
      //If all slots are filled and cards remain in the deck, lose the game
      if (occupiedSlot == 18 && deckRef.getSize() != 0) {
        if (loseTimer > 1)
          gameManager.changeGameState("Lose");
        else
          loseTimer++;
      } else
        loseTimer = 0;
    }
  }
}

/** 
Compares the values in the two matrices specified row or column.
@Parameter useRows - Boolean if the rows should be checked or not
@Parameter index - The index of the row/column to be checked
@Return - returns if the values in each matrix are the same or not.
*/
function compareValues(useRows, index) {
  //Declares local Variables
  var numAceMatrix1 = 0;
  var numAceMatrix2 = 0;

  var matrix1Index0;
  var matrix1Index1;
  var matrix1Index2;

  var matrix2Index0;
  var matrix2Index1;
  var matrix2Index2;

  var matrixValue1;
  var matrixValue2;

  if (useRows) {
    //Calculates the row values
    matrix1Index0 = matrix1Clone[0][index].value;
    matrix1Index1 = matrix1Clone[1][index].value;
    matrix1Index2 = matrix1Clone[2][index].value;

    matrix2Index0 = matrix2Clone[0][index].value;
    matrix2Index1 = matrix2Clone[1][index].value;
    matrix2Index2 = matrix2Clone[2][index].value;
  } else {
    //Calculates the Column Values
    matrix1Index0 = matrix1Clone[index][0].value;
    matrix1Index1 = matrix1Clone[index][1].value;
    matrix1Index2 = matrix1Clone[index][2].value;

    matrix2Index0 = matrix2Clone[index][0].value;
    matrix2Index1 = matrix2Clone[index][1].value;
    matrix2Index2 = matrix2Clone[index][2].value;
  }

  //Checks for Aces and increases the numAceMatrix1 Counter
  if (matrix1Index0 == 1)
    numAceMatrix1++;
  if (matrix1Index1 == 1)
    numAceMatrix1++;
  if (matrix1Index2 == 1)
    numAceMatrix1++;

  //Checks for Aces and increases the numAceMatrix2 Counter
  if (matrix2Index0 == 1)
    numAceMatrix2++;
  if (matrix2Index1 == 1)
    numAceMatrix2++;
  if (matrix2Index2 == 1)
    numAceMatrix2++;


  //Changes the sum of values if all face cards are considered 10.
  if (!useIndividualValues) {
    if (matrix1Index0 == 11 || matrix1Index0 == 12 || matrix1Index0 == 13)
      matrix1Index0 = 10;
    if (matrix1Index1 == 11 || matrix1Index1 == 12 || matrix1Index1 == 13)
      matrix1Index1 = 10;
    if (matrix1Index2 == 11 || matrix1Index2 == 12 || matrix1Index2 == 13)
      matrix1Index2 = 10;
    if (matrix2Index0 == 11 || matrix2Index0 == 12 || matrix2Index0 == 13)
      matrix2Index0 = 10;
    if (matrix2Index1 == 11 || matrix2Index1 == 12 || matrix2Index1 == 13)
      matrix2Index1 = 10;
    if (matrix2Index2 == 11 || matrix2Index2 == 12 || matrix2Index2 == 13)
      matrix2Index2 = 10;
  }

  //matrixValue1 = matrix1Index0 + matrix1Index1 + matrix1Index2;
  //matrixValue2 = matrix2Index0 + matrix2Index1 + matrix2Index2;

  //If using Individual Values (Ace = 1 / 14)
  if (useIndividualValues) {
    for (var i = 0; i < numAceMatrix1 + 1; i++) {
      //Takes the values of all 3 cards in Matrix1, then adds 10 for each Ace present
      matrixValue1 = parseInt(matrix1Index0) + parseInt(matrix1Index1) + parseInt(matrix1Index2) + parseInt(i * 13);
      for (var j = 0; j < numAceMatrix2 + 1; j++) {
        //Takes the values of all 3 cards in Matrix1, then adds 10 for each Ace present
        matrixValue2 = parseInt(matrix2Index0) + parseInt(matrix2Index1) + parseInt(matrix2Index2) + parseInt(j * 13);

        //Compares the values of the Matrices
        if (matrixValue1 == matrixValue2)
          return true;
      }
    }
    //If all face cards are 10 (Ace = 1 / 11)
  } else {
    for (var i = 0; i < numAceMatrix1 + 1; i++) {
      //Takes the values of all 3 cards in Matrix1, then adds 10 for each Ace present
      matrixValue1 = parseInt(matrix1Index0) + parseInt(matrix1Index1) + parseInt(matrix1Index2) + parseInt(i * 10);
      for (var j = 0; j < numAceMatrix2 + 1; j++) {
        //Takes the values of all 3 cards in Matrix1, then adds 10 for each Ace present
        matrixValue2 = parseInt(matrix2Index0) + parseInt(matrix2Index1) + parseInt(matrix2Index2) + parseInt(j * 10);

        //Compares the values of the Matrices
        if (matrixValue1 == matrixValue2)
          return true;
      }
    }
  }
  return false;
}

/** 
Sets useIndividualValues to either true or false
@Param useIndivValues - the boolean to set useIndividualValues to
*/
export function setUseIndividualValues(useIndivVals) {
  useIndividualValues = useIndivVals;
}

export function restartGame() {
  hud.restartHUD();
  moveCards.restartMoveCards();

  deck = deckRef.getDeck();
  size = deckRef.getSize();

  //Creates references to the matrices that update as soon as possible
  matrix1 = moveCards.getMatrix1();
  matrix2 = moveCards.getMatrix2();
  //Creates deep copies to the matrices that do not update until explicitly told to do so
  matrix1Clone = structuredClone(moveCards.getMatrix1());
  matrix2Clone = structuredClone(moveCards.getMatrix2());

  useIndividualValues = false;
  loseTimer = 0;
}

//Attempts to call the method at designated fps
window.onload = setInterval(loop, 1000 / 15);

//Adds Mouse Listeners
canvas.addEventListener("mousemove", moveCards.moveCard);
canvas.addEventListener("mousedown", moveCards.mouseDown);
canvas.addEventListener("mouseup", moveCards.mouseUp);


/** 
Quality of life print function
@Parameter text - the text to print into the console
*/
function print(text) {
  console.log(text);
}
