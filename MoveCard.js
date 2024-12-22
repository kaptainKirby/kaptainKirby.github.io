import Deck from "./Deck.js";

//Declares variables
const canvas = document.querySelector("canvas");
var deckRef, deck;
var size;
var discardCount;
var mouse;
var origXMousePos, origYMousePos;
var screenWidth, screenHeight;
var matrix1;
var matrix2;
var clickedCard;
var lastDiscarded;

//Undo variables
var lastCardPlaced;
var lastCardLocation;
var canUndo;

/** 
Returns a boolean if the mouse is over the designated rectangular area
@Parameter mx - the x position of the mouse
@Parameter my - the y position of the mouse
@Parameter x - the left most coordinate for the mouse to check
@Parameter y - the top most coordinate for the mouse to check
@Parameter width - the length of the area to check
@Parameter height - the height of the area to check
*/
function mouseOver(mx, my, x, y, width, height) {
  //Checks if the x mouse position is in bounds for the x axis
  if (mx > x && mx < x + width) {
    //Checks if the y mouse position is in bounds for the y axis
    if (my > y && my < y + height) {
      //Returns true if both are true
      return true;
    }
  }
  //Returns false if any condition fails
  return false;
}

export class MoveCards {
  constructor() {
    //Initializes variables
    deckRef = new Deck();
    deck = deckRef.getDeck();
    size = deckRef.getSize();
    discardCount = 0;
    origXMousePos = 0;
    origYMousePos = 0;
    screenWidth = innerWidth;
    screenHeight = innerHeight;
    clickedCard = null;
    lastDiscarded = null;
    matrix1 = [[], [], []];
    matrix2 = [[], [], []];

    lastCardPlaced = { card: null, deckPosition: null };
    lastCardLocation = { matrix: null, x: null, y: null };
    canUndo = false;

    //Matrix 1

    //Adds 107 to x position per column (distance from left-most pixel in one column to left most pixel in another column)
    //Adds 152 to the y position per row (distance from upper most pixel in one row to upper most pixel in another row)

    //First Row
    matrix1[0][0] = { card: null, ID: null, cardValue: null, x: screenWidth / 2 - 414, y: 0, width: 100, height: 145 };
    matrix1[0][1] = { card: null, ID: null, cardValue: null, x: screenWidth / 2 - 307, y: 0, width: 100, height: 145 };
    matrix1[0][2] = { card: null, ID: null, cardValue: null, x: screenWidth / 2 - 200, y: 0, width: 100, height: 145 };

    //Second Row
    matrix1[1][0] = { card: null, ID: null, cardValue: null, x: screenWidth / 2 - 414, y: 152, width: 100, height: 145 };
    matrix1[1][1] = { card: null, ID: null, cardValue: null, x: screenWidth / 2 - 307, y: 152, width: 100, height: 145 };
    matrix1[1][2] = { card: null, ID: null, cardValue: null, x: screenWidth / 2 - 200, y: 152, width: 100, height: 145 };

    //Third Row
    matrix1[2][0] = { card: null, ID: null, cardValue: null, x: screenWidth / 2 - 414, y: 304, width: 100, height: 145 };
    matrix1[2][1] = { card: null, ID: null, cardValue: null, x: screenWidth / 2 - 307, y: 304, width: 100, height: 145 };
    matrix1[2][2] = { card: null, ID: null, cardValue: null, x: screenWidth / 2 - 200, y: 304, width: 100, height: 145 };


    //Matrix 2

    //Adds 107 to x position per column (distance from left-most pixel in one column to left most pixel in another column)
    //Adds 152 to the y position per row (distance from upper most pixel in one row to upper most pixel in another row)

    //First Row
    matrix2[0][0] = { card: null, ID: null, cardValue: null, x: screenWidth / 2 + 100, y: 0, width: 100, height: 145 };
    matrix2[0][1] = { card: null, ID: null, cardValue: null, x: screenWidth / 2 + 207, y: 0, width: 100, height: 145 };
    matrix2[0][2] = { card: null, ID: null, cardValue: null, x: screenWidth / 2 + 314, y: 0, width: 100, height: 145 };

    //Second Row
    matrix2[1][0] = { card: null, ID: null, cardValue: null, x: screenWidth / 2 + 100, y: 152, width: 100, height: 145 };
    matrix2[1][1] = { card: null, ID: null, cardValue: null, x: screenWidth / 2 + 207, y: 152, width: 100, height: 145 };
    matrix2[1][2] = { card: null, ID: null, cardValue: null, x: screenWidth / 2 + 314, y: 152, width: 100, height: 145 };

    //Third Row
    matrix2[2][0] = { card: null, ID: -1, cardValue: null, x: screenWidth / 2 + 100, y: 304, width: 100, height: 145 };
    matrix2[2][1] = { card: null, ID: -1, cardValue: null, x: screenWidth / 2 + 207, y: 304, width: 100, height: 145 };
    matrix2[2][2] = { card: null, ID: -1, cardValue: null, x: screenWidth / 2 + 314, y: 304, width: 100, height: 145 };
  }

  /** 
  Moves the specified card to the specified location
  @Parameter cardID - the ID of the card
  @Parameter x - the x position to move the card
  @Parameter y - the y position to move the card
  */
  moveCard(e) {
    //Updates screen dimensions
    screenWidth = innerWidth;
    screenHeight = innerHeight;

    //Gets Mouse position
    mouse = { x: e.clientX, y: e.clientY };

    //Updates the size of the deck
    size = deckRef.getSize();

    //Checks if there is a card remaining in the deck and if the card clicked was the first one in the deck
    if (size > 0 && deckRef.getClicked(deck[0])) {
      //Updates variables
      deckRef.setPos(deck[0], deckRef.getXPos(deck[0]) - (origXMousePos - mouse.x), deckRef.getYPos(deck[0]) - (origYMousePos - mouse.y));
      origXMousePos = mouse.x;
      origYMousePos = mouse.y;
      //Checks if there are two cards remaining in the deck and if the card clicked was the second one in the deck
    } else if (size > 1 && deckRef.getClicked(deck[1])) {
      //Updates variables
      deckRef.setPos(deck[1], deckRef.getXPos(deck[1]) - (origXMousePos - mouse.x), deckRef.getYPos(deck[1]) - (origYMousePos - mouse.y));
      origXMousePos = mouse.x;
      origYMousePos = mouse.y;
    }
  }

  /** 
  Activates when the left mouse button is pressed down
  @Param e - The event
  */
  mouseDown(e) {
    //If left button on mouse is pressed
    if (e.button == 0) {

      //Gets Mouse Position
      mouse = { x: e.clientX, y: e.clientY };

      //Gets the starting x and y position for the mouse
      origXMousePos = mouse.x;
      origYMousePos = mouse.y;

      //If mouse over the first card
      if (mouseOver(mouse.x, mouse.y, deckRef.getXPos(deck[0]), deckRef.getYPos(deck[0]), 100, 145)) {
        //Change Clicked to true and sets clickedCard to the card clicked
        deckRef.setClicked(deck[0], true);
        clickedCard = deck[0];

        //If mouse over the second card
      } else if (size > 1 && mouseOver(mouse.x, mouse.y, deckRef.getXPos(deck[1]), deckRef.getYPos(deck[1]), 100, 145)) {
        //Chnage Clicked to true and sets clicked to teh card clicked
        deckRef.setClicked(deck[1], true);
        clickedCard = deck[1];
      } else
        //If no card was clicked, set clickedCard to null
        clickedCard = null;
    }
  }

  /** 
  Activates when the left mouse button is released
  @Param e - The event
  */
  mouseUp(e) {
    size = deckRef.getSize();
    ////If left button on mouse is pressed
    if (e.button == 0) {
      //Gets Mouse Position
      mouse = { x: e.clientX, y: e.clientY };
      //Sets card to not clicked
      deckRef.setClicked(deck[0], false);
      if (size > 1)
        deckRef.setClicked(deck[1], false);

      if (clickedCard != null) {
        //If Mouse if on the left half of the screen
        var counter = 0;

        //Checks Matrix1
        if (mouse.x < screenWidth / 2) {
          //Checks each possible position for the row
          for (var i = 0; i < 3; i++) {
            //Checks each possible position for the column
            for (var j = 0; j < 3; j++) {

              //Checks to see if mouse is over a card
              if (mouseOver(mouse.x, mouse.y, deckRef.getXPos(clickedCard), deckRef.getYPos(clickedCard), 100, 145)) {
                //Checks to see if mouse is over a Matrix1 slot
                if (mouseOver(mouse.x, mouse.y, screenWidth / 2 - 414 + 107 * i, 152 * j + 20, 100, 145) && matrix1[i][j].card == null) {

                  //Sets the card's position to the Matrix Slot position
                  deckRef.setPos(clickedCard, screenWidth / 2 - 414 + 107 * i + 20, 152 * j);

                  //Finds the Matrix slot and puts the card inside
                  matrix1[i][j].card = clickedCard;
                  matrix1[i][j].ID = clickedCard.ID;
                  matrix1[i][j].value = clickedCard.rank;

                  canUndo = true;
                  lastCardPlaced.card = clickedCard;
                  lastCardLocation.matrix = 1;
                  lastCardLocation.x = j;
                  lastCardLocation.y = i;

                  //Checks if the first card in the deck was the last card clicked
                  if (clickedCard == deck[0]) {
                    lastCardPlaced.deckPosition = 0;
                    deckRef.drawCard();
                    //Updates the size of the deck
                    size = deckRef.getSize();
                    //If there are at least two cards remaining in the deck
                    if (size > 1) {
                      //Swap the first and second card (so the second card does not swap locations visually)
                      deckRef.swap(0, 1);
                      //Sets the second card's position
                      deckRef.setXPos(deck[1], screenWidth / 2 + 10);
                    }
                    //Checks if there is at least 1 card in the deck
                    if (size > 0)
                      //Sets the first card's position
                      deckRef.setXPos(deck[0], screenWidth / 2 - 110);
                  }
                  //Checks if the second card in the deck was the last card clicked
                  else if (size > 1 && clickedCard == deck[1]) {
                    lastCardPlaced.deckPosition = 1;
                    //Removes the second card from the deck
                    deckRef.drawCard(1);

                    //Updates the size of the deck
                    size = deckRef.getSize();
                    //There had to be at least two cards in the deck
                    //We do not need to check if there is at least 1
                    deckRef.setXPos(deck[0], screenWidth / 2 - 110);
                    //Checks if there is at least 2 cards remaining in the deck
                    if (size > 0)
                      deckRef.setXPos(deck[1], screenWidth / 2 + 10);
                  }
                  return;
                } else {
                  //If card was not put in any available spot, reset its position
                  counter++;
                  if (counter >= 9) {
                    if (clickedCard == deck[0])
                      deckRef.setPos(clickedCard, screenWidth / 2 - 110, screenHeight - 200);
                    else if (clickedCard == deck[1])
                      deckRef.setPos(clickedCard, screenWidth / 2 + 10, screenHeight - 200);
                  }
                }
              }
            }
          }

          //Checks Matrix2
        } else {
          //Checks each possible position for the row
          for (var i = 0; i < 3; i++) {
            //Checks each possible position for the column
            for (var j = 0; j < 3; j++) {

              //Checks to see if mouse is over a card
              if (mouseOver(mouse.x, mouse.y, deckRef.getXPos(clickedCard), deckRef.getYPos(clickedCard), 100, 145)) {
                //Checks to see if mouse is over a Matrix2 slot
                //Checks to see if the Matrix slot is vacant
                if (mouseOver(mouse.x, mouse.y, screenWidth / 2 + 100 + 107 * i, 152 * j + 20, 100, 145) && matrix2[i][j].card == null) {
                  //Sets the card's position to the Matrix Slot position
                  deckRef.setPos(clickedCard, screenWidth / 2 + 100 + 107 * i, 152 * j + 20);

                  //Finds the Matrix slot and puts the card inside
                  matrix2[i][j].card = clickedCard;
                  matrix2[i][j].ID = clickedCard.ID;
                  matrix2[i][j].value = clickedCard.rank;

                  canUndo = true;
                  lastCardPlaced.card = clickedCard;
                  lastCardLocation.matrix = 2;
                  lastCardLocation.x = j;
                  lastCardLocation.y = i;

                  //Checks if the first card in the deck was the last card clicked
                  if (clickedCard == deck[0]) {
                    lastCardPlaced.deckPosition = 0;
                    deckRef.drawCard();

                    //Updates the size of the deck
                    size = deckRef.getSize();

                    //Checks if there are at least two card remaining in the deck
                    if (size > 1) {
                      //Swap the first and second card (so the second card does not swap locations visually)
                      deckRef.swap(0, 1);
                      //Sets the second card's position
                      deckRef.setXPos(deck[1], screenWidth / 2 + 10);
                    }
                    //Checks if there is at least one card remaining in the deck
                    if (size > 0)
                      //Sets the first card's position
                      deckRef.setXPos(deck[0], screenWidth / 2 - 110);
                  }
                  //Checks if the second card in the deck was the last card clicked
                  else if (size > 1 && clickedCard == deck[1]) {
                    lastCardPlaced.deckPosition = 1;
                    //Removes the second card from the deck
                    deckRef.drawCard(1);

                    //Updates the size of the deck
                    size = deckRef.getSize();

                    //There had to be at least two cards in the deck
                    //We do not need to check if there is at least 1
                    deckRef.setXPos(deck[0], screenWidth / 2 - 110);

                    //Checks if there are at least two cards in the deck
                    if (size > 1)
                      deckRef.setXPos(deck[1], screenWidth / 2 + 10);
                  }
                  return;
                } else {
                  //If card was not put in any available spot, reset its position
                  counter++;
                  if (counter >= 9) {
                    if (clickedCard == deck[0])
                      deckRef.setPos(clickedCard, screenWidth / 2 - 110, screenHeight - 200);
                    else if (clickedCard == deck[1])
                      deckRef.setPos(clickedCard, screenWidth / 2 + 10, screenHeight - 200);
                  }
                }
              }
            }
          }
        }
      }
    }
  }

  /** 
  Attempts to undo the last placed card.
  Fails if there has been no placed card
  Fails if the undo button has already been pressed
  Fails if the card that was placed cleared a row or column
  */
  undo() {
    if (canUndo) {
      print("UNDO");
      if (lastCardPlaced.deckPosition == 0) {
        deckRef.addCard(lastCardPlaced.card, 0);
        deckRef.setXPos(deck[0], screenWidth / 2 - 110);
        deckRef.setYPos(deck[0], screenHeight - 200);
        deckRef.setXPos(deck[1], screenWidth / 2 + 10);
        deckRef.swap(1, 2);
      } else {
        deckRef.addCard(lastCardPlaced.card, 1);
        deckRef.setXPos(deck[0], screenWidth / 2 - 110);
        deckRef.setXPos(deck[1], screenWidth / 2 + 10);
        deckRef.setYPos(deck[1], screenHeight - 200);
      }

      if (lastCardLocation.matrix == 1) {
        matrix1[lastCardLocation.y][lastCardLocation.x].card = null;
        matrix1[lastCardLocation.y][lastCardLocation.x].ID = null;
        matrix1[lastCardLocation.y][lastCardLocation.x].cardValue = null;
      } else {
        matrix2[lastCardLocation.y][lastCardLocation.x].card = null;
        matrix2[lastCardLocation.y][lastCardLocation.x].ID = null;
        matrix2[lastCardLocation.y][lastCardLocation.x].cardValue = null;
      }



      canUndo = false;
    }
  }

  /** 
  Gets if it is possible to undo or not
  @Return canUndo - the undo button can or cannot be clicked
  */
  getUndo() {
    return canUndo;
  }

  /** 
  Returns the card that has been clicked
  @Return clickedCard - the last card that has been clicked
  */
  getClickedCard() {
    return clickedCard;
  }

  /** 
  Returns matrix1
  @Return matrix1 - the left-most Matrix
  */
  getMatrix1() {
    return matrix1;
  }

  /** 
  Returns matrix2
  @Return matrix2 - the right-most matrix
  */
  getMatrix2() {
    return matrix2;
  }

  /** 
  Clears the specified row of the specified Matrix
  @Parameter matrix - which matrix to clear the row from determined by an integer of either 1 or 2
  @Parameter row  the row to clear in the matrix
  */
  clearMatrixRow(matrix, row) {
    if (row != 0 && row != 1 && row != 2) {
      print("ERROR: INCORRECT VALUE FOR ROW (MUST BE 0, 1, OR 2)");
      return;
    }
    //Edits matrix1
    if (matrix == 1) {
      //Clears the specified row values inside the Matrix1 location

      //Debug
      deckRef.printCard("matrix1[0][row]", matrix1[0][row].card);
      deckRef.printCard("matrix1[1][row]", matrix1[1][row].card);
      deckRef.printCard("matrix1[2][row]", matrix1[2][row].card);

      matrix1[0][row].card = null;
      matrix1[0][row].ID = null;
      matrix1[0][row].cardValue = null;

      matrix1[1][row].card = null;
      matrix1[1][row].ID = null;
      matrix1[1][row].cardValue = null;

      matrix1[2][row].card = null;
      matrix1[2][row].ID = null;
      matrix1[2][row].cardValue = null;

      discardCount += 6;
      //Row is cleared, can not undo
      canUndo = false;
    } else if (matrix == 2) {
      //Sets the last discarded card
      lastDiscarded = { card: matrix2[2][row].card, ID: matrix2[2][row].ID };

      //Debug
      deckRef.printCard("matrix2[0][row]", matrix2[0][row].card);
      deckRef.printCard("matrix2[1][row]", matrix2[1][row].card);
      deckRef.printCard("matrix2[2][row]", matrix2[2][row].card);

      //Clears the specified row values inside the Matrix2 location
      matrix2[0][row].card = null;
      matrix2[0][row].ID = null;
      matrix2[0][row].cardValue = null;

      matrix2[1][row].card = null;
      matrix2[1][row].ID = null;
      matrix2[1][row].cardValue = null;

      matrix2[2][row].card = null;
      matrix2[2][row].ID = null;
      matrix2[2][row].cardValue = null;

      discardCount += 6;
      //Row is cleared, can not undo
      canUndo = false;
    } else {
      print("ERROR: INCORRECT VALUE FOR MATRIX (MUST BE A VALUE OF 1 OR 2)");
    }
  }

  /** 
  Clears the specified column of the specified Matrix
  @Parameter matrix - which matrix to clear the column from determined by an integer of either 1 or 2
  @Parameter column - the column to clear in the matrix
  */
  clearMatrixColumn(matrix, column) {
    if (column != 0 && column != 1 && column != 2) {
      print("ERROR: INCORRECT VALUE FOR COLUMN (MUST BE 0, 1, OR 2)");
      return;
    }
    if (matrix == 1) {
      //Clears the specified column values inside the Matrix1 location

      //Debug
      deckRef.printCard("matrix1[column][0]", matrix1[column][0].card);
      deckRef.printCard("matrix1[column][1]", matrix1[column][1].card);
      deckRef.printCard("matrix1[column][2]", matrix1[column][2].card);

      matrix1[column][0].card = null;
      matrix1[column][0].ID = null;
      matrix1[column][0].cardValue = null;

      matrix1[column][1].card = null;
      matrix1[column][1].ID = null;
      matrix1[column][1].cardValue = null;

      matrix1[column][2].card = null;
      matrix1[column][2].ID = null;
      matrix1[column][2].cardValue = null;

      discardCount += 6;
      //Column is cleared, can not undo
      canUndo = false;
    } else if (matrix == 2) {
      //Sets the last discarded card
      lastDiscarded = { card: matrix2[column][2].card, ID: matrix2[column][2].ID };

      //Debug
      deckRef.printCard("matrix2[column][0]", matrix2[column][0].card);
      deckRef.printCard("matrix2[column][1]", matrix2[column][1].card);
      deckRef.printCard("matrix2[column][2]", matrix2[column][2].card);

      //Clears all the specified column values inside the Matrix2 location
      matrix2[column][0].card = null;
      matrix2[column][0].ID = null;
      matrix2[column][0].cardValue = null;

      matrix2[column][1].card = null;
      matrix2[column][1].ID = null;
      matrix2[column][1].cardValue = null;

      matrix2[column][2].card = null;
      matrix2[column][2].ID = null;
      matrix2[column][2].cardValue = null;

      discardCount += 6;
      //Column is cleared, can not undo
      canUndo = false;
    } else {
      print("ERROR: INCORRECT VALUE FOR MATRIX");
    }
  }

  /** 
  Returns the last discarded card
  @Return lastDiscarded - the last card that was removed from the matrix
  */
  getLastDiscarded() {
    return lastDiscarded;
  }

  /** 
  Returns the amount of cards discarded
  @Return discardCount - the amount of cards discarded
  */
  getDiscardCount() {
    return discardCount
  }

  /** 
  Resets all variables to their value before the game started
  */
  restartMoveCards() {
    deck = deckRef.getDeck();
    size = deckRef.getSize();
    discardCount = 0;
    origXMousePos = 0;
    origYMousePos = 0;
    screenWidth = innerWidth;
    screenHeight = innerHeight;
    clickedCard = null;
    lastDiscarded = null;

    deckRef.setPos(deck[0], screenWidth / 2 - 110, screenHeight - 200);
    deckRef.setPos(deck[1], screenWidth / 2 + 10, screenHeight - 200);
    matrix1 = [[], [], []];
    matrix2 = [[], [], []];

    lastCardPlaced = { card: null, deckPosition: null };
    lastCardLocation = { matrix: null, x: null, y: null };
    canUndo = false;

    //Matrix 1

    //Adds 107 to x position per column (distance from left-most pixel in one column to left most pixel in another column)
    //Adds 152 to the y position per row (distance from upper most pixel in one row to upper most pixel in another row)

    //First Row
    matrix1[0][0] = { card: null, ID: null, cardValue: null, x: screenWidth / 2 - 414, y: 0, width: 100, height: 145 };
    matrix1[0][1] = { card: null, ID: null, cardValue: null, x: screenWidth / 2 - 307, y: 0, width: 100, height: 145 };
    matrix1[0][2] = { card: null, ID: null, cardValue: null, x: screenWidth / 2 - 200, y: 0, width: 100, height: 145 };

    //Second Row
    matrix1[1][0] = { card: null, ID: null, cardValue: null, x: screenWidth / 2 - 414, y: 152, width: 100, height: 145 };
    matrix1[1][1] = { card: null, ID: null, cardValue: null, x: screenWidth / 2 - 307, y: 152, width: 100, height: 145 };
    matrix1[1][2] = { card: null, ID: null, cardValue: null, x: screenWidth / 2 - 200, y: 152, width: 100, height: 145 };

    //Third Row
    matrix1[2][0] = { card: null, ID: null, cardValue: null, x: screenWidth / 2 - 414, y: 304, width: 100, height: 145 };
    matrix1[2][1] = { card: null, ID: null, cardValue: null, x: screenWidth / 2 - 307, y: 304, width: 100, height: 145 };
    matrix1[2][2] = { card: null, ID: null, cardValue: null, x: screenWidth / 2 - 200, y: 304, width: 100, height: 145 };


    //Matrix 2

    //Adds 107 to x position per column (distance from left-most pixel in one column to left most pixel in another column)
    //Adds 152 to the y position per row (distance from upper most pixel in one row to upper most pixel in another row)

    //First Row
    matrix2[0][0] = { card: null, ID: null, cardValue: null, x: screenWidth / 2 + 100, y: 0, width: 100, height: 145 };
    matrix2[0][1] = { card: null, ID: null, cardValue: null, x: screenWidth / 2 + 207, y: 0, width: 100, height: 145 };
    matrix2[0][2] = { card: null, ID: null, cardValue: null, x: screenWidth / 2 + 314, y: 0, width: 100, height: 145 };

    //Second Row
    matrix2[1][0] = { card: null, ID: null, cardValue: null, x: screenWidth / 2 + 100, y: 152, width: 100, height: 145 };
    matrix2[1][1] = { card: null, ID: null, cardValue: null, x: screenWidth / 2 + 207, y: 152, width: 100, height: 145 };
    matrix2[1][2] = { card: null, ID: null, cardValue: null, x: screenWidth / 2 + 314, y: 152, width: 100, height: 145 };

    //Third Row
    matrix2[2][0] = { card: null, ID: -1, cardValue: null, x: screenWidth / 2 + 100, y: 304, width: 100, height: 145 };
    matrix2[2][1] = { card: null, ID: -1, cardValue: null, x: screenWidth / 2 + 207, y: 304, width: 100, height: 145 };
    matrix2[2][2] = { card: null, ID: -1, cardValue: null, x: screenWidth / 2 + 314, y: 304, width: 100, height: 145 };
  }
}

/** 
Quality of life print function
@Parameter text - the text to print into the console
*/
function print(text) {
  console.log(text);
}

export { default as Deck } from "./Deck.js";
