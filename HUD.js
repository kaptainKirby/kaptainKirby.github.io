import { Deck, MoveCards } from "./MoveCards.js";
import GameManager from "./Managers/GameManager.js";

//Declares image variables
var matrixImage, discardPile;
var card;
var rulesImage1, rulesImage2, rulesImage3;

//Delcares Variables
const canvas = document.querySelector("canvas");
var context;
var screenWidth, screenHeight;
var gameManager;
var deck;
var deckRef;
var size;
var discardSize;
var moveCards;
var lastDiscarded;
var matrix1, matrix2;
var width;
var height;

export class HUD {
  constructor() {
    //Initializes Variables
    gameManager = new GameManager();
    moveCards = new MoveCards();
    deckRef = new Deck();
    deckRef.create(true);
    deckRef.shuffle();
    deckRef.printDeck();
    deck = deckRef.getDeck();
    size = deckRef.getSize();
    discardSize = moveCards.getDiscardCount();
    lastDiscarded = moveCards.getLastDiscarded();

    //Initializes Images
    card = new Image();
    matrixImage = new Image();
    discardPile = new Image();
    rulesImage1 = new Image();
    rulesImage2 = new Image();
    rulesImage3 = new Image();

    //Loads the images
    card.src = "Pictures/AllCards.png";
    matrixImage.src = "Pictures/MatrixOutline.png";
    discardPile.src = "Pictures/DiscardPile.png";

    rulesImage1.src = "Pictures/RulesImage1.png";
    rulesImage2.src = "Pictures/RulesImage2.png";
    rulesImage3.src = "Pictures/RulesImage3.png";

    //Sets up the canvas
    context = context = canvas.getContext("2d");
    screenWidth = innerWidth;
    screenHeight = innerHeight;
    canvas.width = screenWidth;
    canvas.height = screenHeight;

    //Gets the matrices
    matrix1 = moveCards.getMatrix1();
    matrix2 = moveCards.getMatrix2();
    
    //Disables some mouse functions
    context.mozImageSmoothingEnabled = false;
    context.webkitImageSmoothingEnabled = false;
    context.msImageSmoothingEnabled = false;
    context.imageSmoothingEnabled = false;
  }

  /** 
  Draws everything needed onto the canvas
  */
  draw() {
    //Update Window Dimensions
    screenWidth = innerWidth;
    screenHeight = innerHeight;
    canvas.width = screenWidth;
    canvas.height = screenHeight;
    //Clears the canvas
    context.clearRect(0, 0, canvas.width, canvas.height);
    //While in Rules
    if (gameManager.getState() == "Rules") {
      context.fillStyle = "#FFFFFF";

      //Highlights Matrix Box
      context.strokeStyle = "#FFFFFF";
      context.beginPath();
      context.moveTo(screenWidth / 3, 0);
      context.lineTo(screenWidth / 3, screenHeight);
      context.stroke();

      context.beginPath();
      context.moveTo(screenWidth * 2 / 3, 0);
      context.lineTo(screenWidth * 2 / 3, screenHeight);
      context.stroke();

      width = rulesImage1.width;
      height = rulesImage1.height;
      
      context.drawImage(rulesImage1, screenWidth / 6 - (width * 3 / 4) / 2, 20, width * 3 / 4, height * 3 / 4);
      context.drawImage(rulesImage2, screenWidth / 2 - (width * 3 / 4) / 2, 20, width * 3 / 4, height * 3 / 4);
      context.drawImage(rulesImage3, screenWidth * 5 / 6 - (width * 3 / 4) / 2, 20, width * 3 / 4, height * 3 / 4);

      //context.fillText("Place cards in matrices", screenWidth / 8, screenHeight - 200, 200);
    }
    //While in Game Loop
    else if (gameManager.getState() == "Game" || gameManager.getState() == "Win" || gameManager.getState() == "Lose") {
      //Updates values
      matrix1 = moveCards.getMatrix1();
      matrix2 = moveCards.getMatrix2();
      size = deckRef.getSize();
      discardSize = moveCards.getDiscardCount();

      //Update card positions if window size changes
      if (screenWidth != innerWidth) {
        if (size > 0)
          deckRef.setXPos(deck[0], screenWidth / 2 - 110);
        if (size > 1)
          deckRef.setXPos(deck[1], screenWidth / 2 + 10);
      }
      if (screenHeight != innerHeight) {
        if (size > 0)
          deckRef.setYPos(deck[0], screenHeight - 200);
        if (size > 1)
          deckRef.setYPos(deck[1], screenHeight - 200);
      }

      lastDiscarded = moveCards.getLastDiscarded();

      //314 is half the size of the 3x3 Matrix Image
      context.drawImage(matrixImage, screenWidth / 2 - 100 - 314, 20);
      context.drawImage(matrixImage, screenWidth / 2 + 100, 20);

      //Draws the discard pile
      if (discardSize == 0)
        context.drawImage(discardPile, screenWidth - 150, screenHeight - 200);
        //Draws a silhouette of the cards underneath the top card in the discard pile 
      else if (lastDiscarded != null && discardSize != 0) {
        if (discardSize > 1) {
          context.strokeStyle = "#000000";
          context.beginPath();
          context.moveTo(screenWidth - 148, screenHeight - 55);
          context.lineTo(screenWidth - 48, screenHeight - 55);
          context.stroke();

          for (var i = 1; i < discardSize / 2; i++) {
            context.beginPath();
            context.moveTo(screenWidth - 150, screenHeight - 55 - i);
            context.lineTo(screenWidth - 50, screenHeight - 55 - i);
            context.stroke();
          }
        
          var id = lastDiscarded.ID - 101;
          context.drawImage(card, (id % 100) * 100, Math.round(id / 100) * 145, 100, 145, screenWidth - 150,
                            screenHeight - 200 - (discardSize / 2), 100, 145);
        }
      }

      //Gets the top card in the deck if it exists
      if (size > 0) {
        var cardID = deck[0].ID - 101;
        var xPos = deck[0].xPos;
        var yPos = deck[0].yPos;
      }

      //Gets the second top card in the deck if it exists
      if (size > 1) {
        var cardID2 = deck[1].ID - 101;
        var xPos2 = deck[1].xPos;
        var yPos2 = deck[1].yPos;
      }

      //Draws silhouette of the cards in the deck
      if (size > 0) {
        context.strokeStyle = "#000000";
        context.beginPath();
        context.moveTo(52, screenHeight - 55);
        context.lineTo(148, screenHeight - 55);
        context.stroke();

        for (var i = 1; i < size / 2; i++) {
          context.beginPath();
          context.moveTo(50, screenHeight - 55 - i);
          context.lineTo(150, screenHeight - 55 - i);
          context.stroke();
        }
      }

      //Draws a face down card to represent the deck
      if (size > 2)
        context.drawImage(card, 0, 580, 100, 145, 50, screenHeight - 200 - (size / 2), 100, 145);


      //Draws the cards in Matrix1
      for (var i = 0; i < 3; i++) {
        for (var j = 0; j < 3; j++) {
          if (matrix1[i][j].card != null) {
            var id = matrix1[i][j].ID - 101;
            context.drawImage(card, (id % 100) * 100, Math.round(id / 100) * 145, 100, 145, screenWidth / 2 - 414 + 107 * i, 152 * j + 20, 100, 145);
          }
        }
      }

      //Draws the cards in Matrix2
      for (var i = 0; i < 3; i++) {
        for (var j = 0; j < 3; j++) {
          if (matrix2[i][j].card != null) {
            var id = matrix2[i][j].ID - 101;
            context.drawImage(card, (id % 100) * 100, Math.round(id / 100) * 145, 100, 145, screenWidth / 2 + 100 + 107 * i, 152 * j + 20, 100, 145);
          }
        }
      }

      //Makes the card that was most recently clicked on drawn on top of the other cards
      if (moveCards.getClickedCard() == deck[1]) {
        //Shows the second top card on top of the top card
        if (size > 0)
          context.drawImage(card, (cardID % 100) * 100, Math.round(cardID / 100) * 145, 100, 145, xPos, yPos, 100, 145);
        if (size > 1)
          context.drawImage(card, (cardID2 % 100) * 100, Math.round(cardID2 / 100) * 145, 100, 145, xPos2, yPos2, 100, 145);
      } else {
        //Shows the top card of the deck above the previous card
        if (size > 1)
          context.drawImage(card, (cardID2 % 100) * 100, Math.round(cardID2 / 100) * 145, 100, 145, xPos2, yPos2, 100, 145);
        if (size > 0)
          context.drawImage(card, (cardID % 100) * 100, Math.round(cardID / 100) * 145, 100, 145, xPos, yPos, 100, 145);
      }
    }
    if (gameManager.getState() == "Win") {
      context.fillStyle = "#000000";
      
      context.font = "50px serif";
      context.globalAlpha = 0.7;
      context.fillRect(0, 0, screenWidth, screenHeight);
      context.fillStyle = "#FFFFFF";
      context.textAlign = "center";
      context.fillText("VICTORY!", screenWidth / 2, screenHeight / 2);      
      context.globalAlpha = 1;
    } else if (gameManager.getState() == "Lose") {
      context.fillStyle = "#0000000";
      context.font = "50px serif";
      context.globalAlpha = 0.7;
      context.fillRect(0, 0, screenWidth, screenHeight);
      context.fillStyle = "#FFFFFF";
      context.textAlign = "center";
      context.fillText("DEFEAT!", screenWidth / 2, screenHeight / 2);      
      context.globalAlpha = 1;
    }
  }
  
  /** 
  Returns the AllCards Image
  */
  getCardImage() {
    return card;
  }

  /** 
  Returns the Matrix Image
  */
  getMatrixImage() {
    return matrix2;
  }

  restartHUD() {
    deckRef.deleteDeck();
    deckRef.create(true);
    deckRef.shuffle();
    deckRef.printDeck();
    deck = deckRef.getDeck();
    size = deckRef.getSize();
    discardSize = moveCards.getDiscardCount();
    lastDiscarded = moveCards.getLastDiscarded();

    context = context = canvas.getContext("2d");
    screenWidth = innerWidth;
    screenHeight = innerHeight;
    canvas.width = screenWidth;
    canvas.height = screenHeight;

    //Gets the matrices
    matrix1 = moveCards.getMatrix1();
    matrix2 = moveCards.getMatrix2();
  }
}
/** 
Quality of life print function
@Parameter text - the text to print into the console
*/
function print(text) {
  console.log(text);
}

export {
  Deck,
  MoveCards
}
