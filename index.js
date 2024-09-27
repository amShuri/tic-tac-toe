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
      board[i].push(0);
    }
  }

  const getBoard = () => board;

  const getCell = (row, col) => board[row][col];

  const placeMarker = (row, col, player) => {
    if (board[row][col] === 0) {
      board[row][col] = player;
    }
  };

  const printBoard = () => {
    console.log(board);
  };

  return { getBoard, getCell, printBoard, placeMarker };
}

function gameController() {
  const board = gameboard();
  const playerOne = createPlayer("Player One", 1);
  const playerTwo = createPlayer("Player Two", 2);
  let activePlayer = playerOne;
  let turnCount = 0;

  const switchPlayerTurn = () => {
    activePlayer = activePlayer === playerOne ? playerTwo : playerOne;
  };

  const getActivePlayer = () => activePlayer;

  const increaseTurnCount = () => {
    turnCount++;
  };

  const printNewRound = () => {
    board.printBoard();
    console.log(`${getActivePlayer().name}'s turn.`);
  };

  const playRound = (row, col) => {
    if (board.getCell(row, col) !== 0) {
      console.log("Occupied by another player. Try a different cell.");
      return;
    }

    const activePlayer = getActivePlayer();

    console.log(`Move ${activePlayer.name}'s marker to row ${row} col ${col}.`);
    board.placeMarker(row, col, activePlayer.marker);
    increaseTurnCount();

    // Win conditions
    const updatedBoard = board.getBoard();
    const winConditions = {
      horizontal: Array.from({ length: 3 }, () => []),
      vertical: Array.from({ length: 3 }, () => []),
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

    // Check for a winner and stop the function if winner is found.
    if (
      isWin(winConditions.leftDiagonal, activePlayer.marker) ||
      isWin(winConditions.rightDiagonal, activePlayer.marker) ||
      winConditions.horizontal.some((row) => isWin(row, activePlayer.marker)) ||
      winConditions.vertical.some((row) => isWin(row, activePlayer.marker))
    ) {
      console.log("Game Over!");
      console.log(`${activePlayer.name} wins!`);
      return;
    }

    // If there is no winner and turn count is equal to 9 the game is a tie.
    if (turnCount === 9) {
      console.log("Game Over!");
      console.log("That is a tie!");
      return;
    }

    // Switch player turn
    switchPlayerTurn();
    printNewRound();
  };

  return { playRound };
}

const game = gameController();
console.warn(`use game.playRound(row, col) to play the game.`);
