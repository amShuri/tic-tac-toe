function createPlayer(name, marker) {
  return { name, marker };
}

function gameboard() {
  const rows = 3;
  const columns = 3;
  const board = [];

  for (let i = 0; i < rows; i++) {
    board[i] = [];
    for (let j = 0; j < columns; j++) {
      board[i].push("");
    }
  }

  const getBoard = () => board;

  const getCell = (row, col) => board[row][col];

  const getBoardRows = () => rows;

  const placeMarker = (row, col, player) => {
    if (board[row][col] === "") {
      board[row][col] = player;
    }
  };

  return { getBoard, getCell, getBoardRows, placeMarker };
}

function gameController(playerOne = "Player One", playerTwo = "Player Two") {
  const board = gameboard();
  const players = [
    {
      name: playerOne,
      marker: "X",
    },
    {
      name: playerTwo,
      marker: "O",
    },
  ];
  let activePlayer = players[0];
  let turnCount = 0;
  let isGameOver = 0;

  const switchPlayerTurn = () => {
    activePlayer = activePlayer === players[0] ? players[1] : players[0];
  };

  const getActivePlayer = () => activePlayer;

  // The game result will be represented by 0, 1 and 2:
  // 0: game is till going
  // 1: game is over with a Winner
  // 2: game is over with a Tie
  const getGameResult = () => isGameOver;

  const increaseTurnCount = () => {
    turnCount++;
  };

  const playRound = (row, col) => {
    if (isGameOver) {
      console.log("Game over. Restart the game!");
      return;
    }
    if (board.getCell(row, col) !== "") {
      console.log("Occupied by another player. Try a different cell.");
      return;
    }

    const activePlayer = getActivePlayer();

    board.placeMarker(row, col, activePlayer.marker);
    increaseTurnCount();

    // Win conditions
    const updatedBoard = board.getBoard();
    const boardRows = board.getBoardRows();
    const winConditions = {
      horizontal: Array.from({ length: boardRows }, () => []),
      vertical: Array.from({ length: boardRows }, () => []),
      leftDiagonal: [],
      rightDiagonal: [],
    };

    for (let i = 0; i < updatedBoard.length; i++) {
      winConditions.leftDiagonal.push(updatedBoard[i][i]);
      winConditions.rightDiagonal.push(updatedBoard[i][2 - i]);
      for (let j = 0; j < updatedBoard.length; j++) {
        winConditions.horizontal[i].push(updatedBoard[i][j]);
        winConditions.vertical[j].push(updatedBoard[i][j]);
      }
    }

    const isWin = (cells, player) => cells.every((cell) => cell === player);
    if (
      isWin(winConditions.leftDiagonal, activePlayer.marker) ||
      isWin(winConditions.rightDiagonal, activePlayer.marker) ||
      winConditions.horizontal.some((row) => isWin(row, activePlayer.marker)) ||
      winConditions.vertical.some((row) => isWin(row, activePlayer.marker))
    ) {
      isGameOver = 1;
      return;
    }

    // It's a tie when the turn count equals the board size (3x3 in this case)
    if (turnCount === boardRows * boardRows) {
      isGameOver = 2;
      return;
    }

    // Switch player turn
    switchPlayerTurn();
  };

  return {
    playRound,
    getActivePlayer,
    getGameResult,
    getBoard: board.getBoard,
    getCell: board.getCell,
  };
}

function screenController() {
  const game = gameController(
    prompt("Enter player name", "Player One") || "Player One",
    prompt("Enter player name", "Player Two") || "Player Two"
  );
  const boardDiv = document.querySelector(".board");
  const playerTurnDiv = document.querySelector(".player-turn");

  const updateScreen = () => {
    boardDiv.innerHTML = "";

    // get the updated board
    const board = game.getBoard();
    const activePlayer = game.getActivePlayer();
    const gameResult = game.getGameResult();

    // change the text color depending on the player
    playerTurnDiv.classList.remove("blue", "red");
    playerTurnDiv.classList.add(activePlayer.marker === "X" ? "blue" : "red");

    // display each players turn
    playerTurnDiv.textContent = `${activePlayer.name}'s Turn`;

    switch (gameResult) {
      case 1:
        playerTurnDiv.textContent = `${activePlayer.name} WINS`;
        break;
      case 2:
        playerTurnDiv.textContent = "TIE";
    }

    for (let i = 0; i < board.length; i++) {
      const $container = document.createElement("div");
      $container.classList.add("container");

      for (let j = 0; j < board.length; j++) {
        $container.insertAdjacentHTML(
          "beforeend",
          `
          <div class="cell" data-row="${i}" data-col="${j}">
            ${game.getCell(i, j)}
          </div>
          `
        );
      }
      boardDiv.appendChild($container);
    }
  };

  const clickHandlerBoard = (e) => {
    const selectedCell = e.target;
    if (!selectedCell.classList.contains("cell")) return;

    game.playRound(selectedCell.dataset.row, selectedCell.dataset.col);
    updateScreen();
  };
  boardDiv.addEventListener("click", clickHandlerBoard);

  updateScreen();
}

document.querySelector("#start").addEventListener("click", (e) => {
  const button = e.target;
  if (button.textContent === "RESTART GAME") {
    if (!confirm("Restart game?")) return;
  }

  button.textContent = "RESTART GAME";
  screenController();
});
