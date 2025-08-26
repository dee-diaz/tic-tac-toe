import "./style.css";

// Gameboard module. Data storage
const gameboard = (function () {
  const boardSize = 3 * 3;
  let gameboard = [];

  function createBoard() {
    for (let i = 0; i < boardSize; i++) {
      gameboard.push("");
    }
  }

  function getBoard() {
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
      displayController.renderCell(symbol);
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
  let isThereWinner = false;
  const player1 = createPlayer("Diana", SYMBOL.X);
  const player2 = createPlayer("Computer", SYMBOL.O);
  const playerX = player1.symbol === SYMBOL.X ? player1 : player2;
  const playerO = player1.symbol === SYMBOL.O ? player1 : player2;
  let nextTurn = playerX.name; // The player using the 'X' symbol always goes first

  function switchPlayer() {
    nextTurn === player1.name
      ? (nextTurn = player2.name)
      : (nextTurn = player1.name);
  }

  function playRound(cellNum) {
    if (nextTurn === player1.name) {
      player1.makeMove(cellNum);
      console.log(`${player1.name} made a move`);
    } else {
      player2.makeMove(cellNum);
      console.log(`${player2.name} made a move`);
    }
    switchPlayer();
    console.log(`Next turn: ${nextTurn}`);
    checkGameStatus();
  }

  function checkGameStatus() {
    const isGameboardFull = gameboard.isFull();
    const board = gameboard.getBoard();
    const rows = [];
    const cols = [];
    const diagonals = [];
    const xWin = SYMBOL.X.repeat(3);
    const oWin = SYMBOL.O.repeat(3);

    // Rows
    for (let i = 0; i < board.length; i++) {
      if (i === 0 || i === 3 || i === 6) rows.push([]);
      if (i <= 2) rows[0].push(board[i]);
      if (i > 2 && i <= 5) rows[1].push(board[i]);
      if (i > 5 && i <= 8) rows[2].push(board[i]);
    }

    // Columns
    for (let i = 0; i < board.length; i++) {
      if (i === 0 || i === 1 || i === 2) cols.push([]);
      if (i === 0 || i % 3 === 0) cols[0].push(board[i]);
      if (i === 1 || (i - 1) % 3 === 0) cols[1].push(board[i]);
      if (i === 2 || (i - 2) % 3 === 0) cols[2].push(board[i]);
    }

    // Diagonals
    for (let i = 0; i < board.length; i++) {
      if (i === 0 || i === 2) diagonals.push([]);
      if (i === 0 || i % 4 === 0) diagonals[0].push(board[i]);
      if (i === 2 || i === 4 || i === 6) diagonals[1].push(board[i]);
    }

    rows.forEach((row) => {
      const str = row.join("");

      if (str === xWin) {
        defineWinner(playerX);
      } else if (str === oWin) {
        defineWinner(playerO);
      }
    });

    cols.forEach((col) => {
      const str = col.join("");

      if (str === xWin) {
        defineWinner(playerX);
      } else if (str === oWin) {
        defineWinner(playerO);
      }
    });

    diagonals.forEach((diagonal) => {
      const str = diagonal.join("");

      if (str === xWin) {
        defineWinner(playerX);
      } else if (str === oWin) {
        defineWinner(playerO);
      }
    });

    if (isGameboardFull && !isThereWinner) defineWinner();
  }

  function defineWinner(player) {
    if (!player) {
      console.log("It's a tie!");
    } else {
      console.log(player.name, "won!");
      isThereWinner = true;
    }

    displayController.disableButtons();
  }

  return {
    playRound,
  };
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

// Display controller module
const displayController = (function () {
  const grid = document.querySelector(".grid");
  const buttons = document.querySelectorAll("button");
  let clickedCell;

  grid.addEventListener("click", handleClick);

  function handleClick(e) {
    const cellNumber = Number(e.target.getAttribute("data-cell"));
    const board = gameboard.getBoard();
    const isFull = gameboard.isFull();

    if (board[cellNumber] === "") {
      clickedCell = e.target;
      gameController.playRound(cellNumber);
    }
  }

  function renderCell(symbol) {
    clickedCell.innerText = symbol;
  }

  function disableButtons() {
    buttons.forEach((button) => (button.disabled = true));
  }

  // function highlightCells(cells) {

  // }

  return {
    renderCell,
    disableButtons,
  };
})();
