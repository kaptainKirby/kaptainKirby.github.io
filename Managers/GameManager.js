//Creates an enum to keep track of the current Game State
const STATE = Object.freeze({
  Menu: "Menu",
  Rules: "Rules",
  Rules2: "Rules2",
  Credits: "Credits",
  Game: "Game",
  Win: "Win",
  Lose: "Lose"
});

//Declares Variables
var gameState;

export default class GameManager {
  constructor() {
    //Singleton
    if (GameManager.instance instanceof GameManager) {
      return GameManager.instance;
    }

    //Sets the Game State to the Menu
    gameState = STATE.Menu;

    //Makes singleton unable to be changed. Sets instance to this instance
    Object.freeze(this);
    GameManager.instance = this;
  }

  /** 
  Changes the Game State
  @Parameter State - The STATE to switch the Game State to. Does nothing if an invalid state is entered.
  */
  changeGameState(State) {
    switch (State) {
      case "Menu":
        gameState = STATE.Menu;
        break;
      case "Game":
        gameState = STATE.Game;
        break;
      case "Rules":
        gameState = STATE.Rules;
        break;
      case "Rules2":
        gameState = STATE.Rules2;
        break;
      case "Credits":
        gameState = STATE.Credits;
        break;
      case "Win":
        gameState = STATE.Win;
        print("VICTORY!");
        break;
      case "Lose":
        gameState = STATE.Lose;
        print("DEFEAT!");
        break;
      default:
        print("FAILED TO CHANGE STATE");
    }
  }

  /** 
  Returns the current State of the game
  @Returns gameState - the current game state
  */
  getState() {
    return gameState;
  }
}

/** 
Quality of life print function
@Parameter text - the text to print into the console
*/
function print(text) {
  console.log(text);
}
