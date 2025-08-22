import "./style.css";

// Gameboard module
const gameboard = (function () {
  const boardSize = 3 * 3;
  let gameboard = [];

  function createBoard() {
    for (let i = 0; i < boardSize; i++) {
      gameboard.push("");
    }
    console.log(gameboard);
  }

  function placeMark(index, symbol) {
    gameboard[index] = symbol;
    console.log(gameboard);
  }

  createBoard();

  return { placeMark };
})();


// Player factory function
function createPlayer(name, symbol) {
  const playerName = name || "Player";
  const playerSymbol = symbol;

  function makeMove(cellNumber) {
    gameboard.placeMark(cellNumber, playerSymbol);
  }

  return {
    playerName,
    playerSymbol,
    makeMove,
  };
}

// const player1 = createPlayer("Diana", "X");
// const player2 = createPlayer("John", "O");
// console.log(player1);
// console.log(player2);

// player1.makeMove(2);
