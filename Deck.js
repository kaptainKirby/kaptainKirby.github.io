//Declares Variables for the creation of Cards
var numCards;
var numDecks;
const suits = ["Black Joker", "Red Joker", "Clubs", "Spades", "Hearts", "Diamonds"];
const rank = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13];
var deck = [];

var screenWidth = innerWidth;
var screenHeight = innerHeight;

var Card;

//Creates Cards
export default class Deck {
  //Constructs a deck. If numDecks is not specified, it will create 1 deck
  constructor(numberOfDecks) {

    //Singleton
    if (Deck.instance instanceof Deck) {
      return Deck.instance;
    }

    if (numberOfDecks == null) numberOfDecks = 1;
    numDecks = numberOfDecks;
    numCards = 0;

    //Initializes variables for canvas
    Object.freeze(Card);

    //makes singleton unable to be changed. Sets instance to this.
    Object.freeze(this);
    Deck.instance = this;
  }

  /** 
  Creates a deck of Cards
  @Parameter includeJokers - whether Jokers are included or not in the deck
  */
  create(includeJokers) {
    if (includeJokers) {
      numCards = parseInt(numDecks * 54);
      //Adds the Jokers
      deck.push({
        rank: rank[0],
        suit: suits[0],
        ID: 502,
        xPos: screenWidth / 2 - 50,
        yPos: screenHeight - 200,
        clicked: false
      });

      deck.push({
        rank: rank[0],
        suit: suits[1],
        ID: 503,
        xPos: screenWidth / 2 - 50,
        yPos: screenHeight - 200,
        clicked: false
      });
    }
    else
      numCards += parseInt(numDecks * 52);
    //Loop for each deck requested to create
    for (var deckCounter = 0; deckCounter < numDecks; deckCounter++) {
      //Loop for each Suit needed
      for (var suitCounter = 2; suitCounter < suits.length; suitCounter++) {
        //Loop for each Rank needed
        for (var rankCounter = 1; rankCounter < rank.length; rankCounter++) {
          //Adds a new card with the specified rank, suit, and unique ID into the deck
          deck.push({
            rank: rank[rankCounter],
            suit: suits[suitCounter],
            //Offset ID by the extra suits and rank reserved for the Jokers
            ID: (suitCounter + 1) * 100 + rankCounter - 200,
            xPos: 50,
            yPos: screenHeight - 200,
            clicked: false
          });
        }
      }
    }

    //TODO: Delete after testing
    //deck.splice(0, numCards / 2);
    //numCards = numCards / 2;
  }

  /** 
  Uses the riffle shuffle once to shuffle the deck
  It's recommended to use this funcion numerous times for a better shuffle
  */
  riffleShuffle() {
    //Splits the deck into two even packets
    var topHalf = deck.slice(0, numCards / 2);
    var bottomHalf = deck.slice(numCards / 2);
    //Empties original deck
    deck.splice(0, deck.length);

    //Loops through the two packets, weaving packets into each other
    for (var i = numCards / 2 - 1; i > -1; i--) {
      deck.push(bottomHalf[i]);
      deck.push(topHalf[i]);
    }
  }

  //Uses the Over Hand Shuffle to once shuffle the deck
  //It's recommended to use this funcion numerous times for a better shuffle
  overHandShuffle() {
    //Gets a random starting value
    const index = Math.floor(Math.random() * 5) + 1;

    //Gets the bottom packet
    var bottomHalf = deck.slice(index);

    //Removes all cards in the packet from the deck
    deck.splice(index);

    //How many cards are in the packet
    var inBottom = numCards - index;
    //How many cards should be added from the packet back onto the top of the deck
    var putIn;

    //Loops until all cards have been transfered from bottom packet to the deck
    while (inBottom > 0) {

      //If there are less than 6 cards in the packet, transfer remaining cards, transfer remaining cards into the deck
      if (inBottom <= 5) putIn = inBottom;

      //Otherwise, put in a random amount of cards from the packet into the deck
      //Generates a random number one through six
      else putIn = Math.floor(Math.random() * 5) + 1;

      //Reverses the order of cards being added into deck
      for (var i = putIn - 1; i >= 0; i--) {
        deck.unshift(bottomHalf[i]);
        bottomHalf.splice(i, 1);
      }

      //Subtracts the amount of cards in the packet from the amount put in the deck
      inBottom -= putIn;
    }
  }

  /** 
  Cuts the deck in half and put the bottom half on top.
  @Parameter index - The location where to cut
  */
  cut(index) {
    //If index is not specified, index equals the middle card index of the
    //deck
    if (index == null) index = numCards / 2;
    //Makes sure the index is in bounds
    if (index > 0 && index < numCards) {

      //Takes the bottom packet of the deck, puts it at the top.
      var topHalf = deck.slice(0, index);
      deck.splice(0, index);
      deck = deck.concat(topHalf);
    } else print("CANNOT CUT! Index " + index + " is out of bounds");
  }

  //Uses shuffle methods the specified number of times to get a shuffled
  //deck
  //If not specified, it shuffles a random amount of times
  shuffle(numTimes) {
    //If numTimes is not specified, choose a random value
    if (numTimes == null)
      numTimes = Math.floor(Math.random() * 3) + 9;

    var numShuffleTimes;
    //Shuffle Loops the specified number of times
    for (var i = 0; i < numTimes; i++) {
      numShuffleTimes = Math.floor(Math.random() * 10) + 4;
      for (var j = 0; j < numShuffleTimes; j++)
        this.overHandShuffle();

      numShuffleTimes = Math.floor(Math.random() * 10) + 4;
      for (var j = 0; j < numShuffleTimes; j++) {
        this.riffleShuffle();
      }

      this.cut(Math.floor(Math.random() * (numCards - 1)) + 1);
    }
  }

  /** 
  Gets the xPos of the specified card
  @Parameter card - The card to get the x position of
  */
  getXPos(card) {
    //Finds the card inside the deck
    for (var i = 0; i < numCards; i++) {
      if (deck[i] == card)
        //Returns the x position of the card
        return deck[i].xPos;
    }
    print("CARD COULD NOT BE FOUND in getXPos(card)");
  }

  /** 
  Gets the y position of the card
  @Parameter card - The card to get the y position of
  */
  getYPos(card) {
    //Finds the card inside the deck
    for (var i = 0; i < numCards; i++) {
      if (deck[i] == card)
        //Returns the y position of the card
        return deck[i].yPos;
    }
    print("CARD COULD NOT BE FOUND in getYPos(card)");
  }

  /** 
  Sets the specified card's x position to the x position specified 
  @Parameter card - The card to change the x position of
  @Parameter x - The new x position the card should be located at
  */
  setXPos(card, x) {
    //Finds the card inside the deck
    for (var i = 0; i < numCards; i++) {
      if (deck[i] == card) {
        //Sets the x position of the card, then quits.
        deck[i].xPos = x;
        return;
      }
    }
    print("CARD COULD NOT BE FOUND in (setXPos(card, x)");
  }

  /** 
  Sets the specified card's y position to the y position specified 
  @Parameter card - The card to change the y position of
  @Parameter y - The new y position the card should be located at
  */
  setYPos(card, y) {
    //Searches for the card inside the deck
    for (var i = 0; i < numCards; i++) {
      if (deck[i] == card) {
        //Sets the position of the card, then quits
        deck[i].yPos = y;
        return;
      }
    }
    print("CARD COULD NOT BE FOUND in setYPos(card, y)");
  }

  /** 
  Sets the specified card's position to the specified (x,y) position 
  @Parameter card - The card to change the (x,y) position of
  @Parameter x - The new x position the card should be located at
  @Parameter y - The new y position the card should be located at
  */
  setPos(card, x, y) {
    //Searches for the card inside the deck
    for (var i = 0; i < numCards; i++) {
      if (deck[i] == card) {
        //Sets the position of the card, then quits
        deck[i].xPos = x;
        deck[i].yPos = y;
        return;
      }
    }
    print("CARD COULD NOT BE FOUND in setPos(card, x, y)");
  }

  /** 
  Returns the card's ID
  @Parameter card - the card to get the ID from
  */
  getID(card) {
    //Searches for the card
    for (var i = 0; i < numCards; i++) {
      if (deck[i] == card) {
        //Returns the ID of the card
        return deck[i].ID;
      }
    }
    print("CARD COULD NOT BE FOUND in getID(card)");
  }

  /** 
  Sets if the card has been clicked or not
  @Parameter card - the card to change the click value of
  @Parameter clicked - the boolean value to change to
  */
  setClicked(card, clicked) {
    //Searches for the card inside the deck
    for (var i = 0; i < numCards; i++) {
      if (deck[i] == card) {
        //Sets the value of click to the specified value
        deck[i].click = clicked;
        return;
      }
    }
    print("CARD COULD NOT BE FOUND in setClicked(card)");
  }

  /** 
  Gets the Click value of the specified card
  @Parameter card - the card to change the click value of
  */
  getClicked(card) {
    //Searches for the card inside the deck
    for (var i = 0; i < numCards; i++) {
      if (deck[i] == card) {
        //Gets if the card has been clicked or not
        return deck[i].click;
      }
    }
    print("CARD COULD NOT BE FOUND IN getClicked(card)");
  }

  /** 
  Adds a card at the specified index
  @param card - the card to be added into the deck
  @param index - the location where the card should be added
  */
  addCard(card, index) {
    deck.splice(index, 0, card);
  }
  /** 
  Removes the specified card of the deck
  @Parameter index - The specified card to remove. Default is the first card in the deck
  */
  drawCard(index) {
    //If index was not given, set the index to 0
    if (index == null)
      index = 0;
    //Removes the specified card and reshifts the deck to remove the empty space
    deck.splice(index, 1);
    numCards--;
  }

  /** 
  Deletes all the contents inside the deck
  */
  deleteDeck() {
    screenWidth = innerWidth;
    screenHeight = innerHeight;
    deck.splice(0, deck.length);
  }

  /** 
  Swaps the two specified cards in the deck
  @Parameter card1 - the index of the card to be swapped
  @Parameter card2 - the index of the card to trade places with card1
  */
  swap(card1, card2) {
    var tempCard = deck[card1];
    deck[card1] = deck[card2];
    deck[card2] = tempCard;

  }

  /** 
  Returns the deck array
  */
  getDeck() {
    return deck;
  }

  /** 
  Returns specified card in deck array
  */
  getCard(card) {
    return deck[card];
  }
  /** 
  Gets the amount of cards inside the deck
  */
  getSize() {
    return numCards;
  }

  /** 
  Prints the deck into the console.
  */
  printDeck() {
    for (var i = 0; i < numCards; i++) {
      printCard(deck[i]);
    }
  }

  /** 
  Prints the specified card into the console
  @Parameter card - The card object to have its values printed
  */
  printCard(text, card) {
    if (card.rank == 0)
      print(text + " " + card.suit + " ID: " + card.ID);
    else
      print(text + " " + card.rank + " of " + card.suit + "; ID: " + card.ID);
  }
}

function printCard(card) {
  if (card.rank == 0)
    print(card.suit + " ID: " + card.ID);
  else
    print(card.rank + " of " + card.suit + "; ID: " + card.ID);
}

/** 
Quality of life print function
@Parameter text - the text to print into the console
*/
function print(text) {
  console.log(text);
};
