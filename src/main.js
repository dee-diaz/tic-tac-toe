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

  function divideByRows() {
    const board = getBoard();
    const rows = [];

    for (let i = 0; i < board.length; i++) {
      if (i === 0 || i === 3 || i === 6) rows.push([]);
      if (i <= 2) rows[0].push(board[i]);
      if (i > 2 && i <= 5) rows[1].push(board[i]);
      if (i > 5 && i <= 8) rows[2].push(board[i]);
    }

    return rows;
  }

  function divideByColumns() {
    const board = getBoard();
    const cols = [];

    for (let i = 0; i < board.length; i++) {
      if (i === 0 || i === 1 || i === 2) cols.push([]);
      if (i === 0 || i % 3 === 0) cols[0].push(board[i]);
      if (i === 1 || (i - 1) % 3 === 0) cols[1].push(board[i]);
      if (i === 2 || (i - 2) % 3 === 0) cols[2].push(board[i]);
    }

    return cols;
  }

  function divideByDiagonals() {
    const board = getBoard();
    const diagonals = [];

    for (let i = 0; i < board.length; i++) {
      if (i === 0 || i === 2) diagonals.push([]);
      if (i === 0 || i % 4 === 0) diagonals[0].push(board[i]);
      if (i === 2 || i === 4 || i === 6) diagonals[1].push(board[i]);
    }

    return diagonals;
  }

  function getBoard() {
    return gameboard;
  }

  function resetBoard() {
    gameboard = [];
    createBoard();
    console.clear();
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
    divideByRows,
    divideByColumns,
    divideByDiagonals,
  };
})();

// Game controller module. Game logic
const gameController = (function () {
  const SYMBOL = {
    X: "X",
    O: "O",
  };
  let isThereWinner = false;
  let player1;
  let player2;
  let playerX;
  let playerO;
  let nextTurn; // The player using the 'X' symbol always goes first
  let scoreX = 0;
  let scoreO = 0;

  function switchPlayer() {
    nextTurn === player1.name
      ? (nextTurn = player2.name)
      : (nextTurn = player1.name);
  }

  function playRound(cellNum) {
    if (!nextTurn) return;
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
    const rows = gameboard.divideByRows();
    const cols = gameboard.divideByColumns();
    const diagonals = gameboard.divideByDiagonals();
    const xWinPattern = SYMBOL.X.repeat(3);
    const oWinPattern = SYMBOL.O.repeat(3);

    function loopThroughDirections(directions, identificator) {
      directions.forEach((direction, index) => {
        const str = direction.join("");

        if (str === xWinPattern) {
          defineWinner(playerX);
          displayController.highlightDirection(identificator, index);
        } else if (str === oWinPattern) {
          defineWinner(playerO);
          displayController.highlightDirection(identificator, index);
        }
      });
    }

    loopThroughDirections(rows, "rows");
    loopThroughDirections(cols, "cols");
    loopThroughDirections(diagonals, "diagonals");

    if (isGameboardFull && !isThereWinner) defineWinner();
  }

  function defineWinner(player) {
    if (!player) {
      console.log("It's a tie!");
    } else {
      console.log(player.name, "won!");
      isThereWinner = true;
      updateScore(player);
    }

    displayController.disableButtons();
  }

  function updateScore(player) {
    (player.symbol === SYMBOL.X) ? scoreX++ : scoreO++;
    displayController.updateScore(scoreX, scoreO);
  }

  function setPlayers(userChoice) {
    console.log("User choice: ", userChoice);
    if (userChoice === SYMBOL.X) {
      player1 = createPlayer("Player", SYMBOL.X);
      player2 = createPlayer("Computer", SYMBOL.O);
    } else if (userChoice === SYMBOL.O) {
      player1 = createPlayer("Player", SYMBOL.O);
      player2 = createPlayer("Computer", SYMBOL.X);
    }

    playerX = player1.symbol === SYMBOL.X ? player1 : player2;
    playerO = player1.symbol === SYMBOL.O ? player1 : player2;
    nextTurn = playerX.name;
  }

  function resetRound() {
    player1 = undefined;
    player2 = undefined;
    playerX = undefined;
    playerO = undefined;
    nextTurn = undefined;
    isThereWinner = false;
    scoreX = 0;
    scoreO = 0;
  }

  return {
    playRound,
    setPlayers,
    resetRound,
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
  const rows = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
  ];
  const columns = [
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
  ];
  const diagonals = [
    [0, 4, 8],
    [2, 4, 6],
  ];

  const grid = document.querySelector(".grid");
  const buttons = grid.querySelectorAll("button");
  const btnRestart = document.querySelector(".btn-restart");
  const choiceButtons = document.querySelectorAll(
    ".symbol-choice button[data-choice]"
  );
  const choiceText = document.querySelector(".symbol-choice > p");
  const scores = document.querySelectorAll(".score");
  let clickedCell;

  grid.addEventListener("click", handleClick);
  btnRestart.addEventListener("click", resetDisplay);
  choiceButtons.forEach((button) =>
    button.addEventListener("click", highlightUserChoice)
  );

  function handleClick(e) {
    const cellNumber = Number(e.target.getAttribute("data-cell"));
    const board = gameboard.getBoard();

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

  function highlightDirection(id, index) {
    switch (id) {
      case "rows":
        const winnerRow = rows[index];
        winnerRow.forEach((cellId) => {
          const btn = grid.querySelector(`[data-cell="${cellId}"]`);
          btn.classList.add("highlight");
        });
        break;

      case "cols":
        const winnerCol = columns[index];
        winnerCol.forEach((cellId) => {
          const btn = grid.querySelector(`[data-cell="${cellId}"]`);
          btn.classList.add("highlight");
        });
        break;

      case "diagonals":
        const winnerDiagonal = diagonals[index];
        winnerDiagonal.forEach((cellId) => {
          const btn = grid.querySelector(`[data-cell="${cellId}"]`);
          btn.classList.add("highlight");
        });
        break;
    }
  }

  function resetDisplay() {
    buttons.forEach((button) => {
      button.classList.remove("highlight");
      button.textContent = "";
      button.disabled = false;
    });

    choiceButtons.forEach((button) => {
      button.classList.remove("highlight");
    });

    choiceText.innerHTML = `Choose your symbol <br>(X goes first)`;

    scores.forEach(score => score.innerText = ": 0");

    gameboard.resetBoard();
    gameController.resetRound();
  }

  function highlightUserChoice(e) {
    const btn = e.target;
    const value = btn.getAttribute("data-choice");
    choiceButtons.forEach((button) => button.classList.remove("highlight"));
    btn.classList.add("highlight");
    choiceText.textContent = `Your symbol is ${value}`;
    gameController.setPlayers(value);
  }

  function updateScore(xScore, oScore) {
    scores[0].textContent = `: ${xScore}`;
    scores[1].textContent = `: ${oScore}`;
  }

  return {
    renderCell,
    disableButtons,
    highlightDirection,
    updateScore,
  };
})();
