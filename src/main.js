import "./style.css";

// Gameboard module. Data storage
const gameboard = (function () {
  const boardSize = 3 * 3;
  let gameboard = [];

  function createBoard() {
    for (let i = 0; i < boardSize; i++) {
      gameboard.push("");
    }
    console.log(gameboard);
  }

  function getBoard() {
    console.log(gameboard);
    return gameboard;
  }

  function resetBoard() {
    gameboard = [];
    createBoard();
  }

  function isFull() {
    return gameboard.includes("") ? false : true;
  }

  function placeMark(index, symbol) {
    if (gameboard[index] === "") {
      gameboard[index] = symbol;
      console.log(gameboard);
    } else {
      return;
    }
  }

  createBoard();

  return {
    placeMark,
    getBoard,
    resetBoard,
    isFull,
  };
})();

// Game controller module. Game logic
const gameController = (function () {
  const SYMBOL = {
    X: "X",
    O: "O",
  };
  const player1 = createPlayer("Diana", SYMBOL.X);
  const player2 = createPlayer("Computer", SYMBOL.O);
  let nextTurn = (player1.symbol === SYMBOL.X) ? player1.name : player2.name; // The player using the 'X' symbol always goes first

  function switchPlayer() {
    (nextTurn === player1.name) ? nextTurn = player2.name : nextTurn = player1.name;
  }

  function playRound() {
    const isGameboardFull = gameboard.isFull();
    if (!isGameboardFull) {
      if (nextTurn === player1.name) {
        player1.makeMove(2);
        console.log(`${player1.name} made a move`);
      } else {
        player2.makeMove(2);
        console.log(`${player2.name} made a move`);
      }
      switchPlayer();
    } else {
      console.log("Game over");
    }
  }

  playRound();
})();

// Player factory function
function createPlayer(playerName, playerSymbol) {
  const name = playerName;
  const symbol = playerSymbol;

  function makeMove(cellNumber) {
    gameboard.placeMark(cellNumber, symbol);
  }

  return {
    name,
    symbol,
    makeMove,
  };
}
