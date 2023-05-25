const gameBoard = (() => {
  const boardSize = 3;
  const board = [];

  function fillBoard() {
    for (let i = 0; i < boardSize; i += 1) {
      board[i] = [];
      for (let j = 0; j < boardSize; j += 1) {
        /* By filling the board with empty strings, we can later use
         * a conditional that will allow the player to place their markers
         * ONLY if the slot they're trying to modify is an empty string.
         */
        board[i].push('');
      }
    }
  }
  fillBoard();

  const getBoard = () => board;

  return { getBoard, fillBoard };
})();

function Player(name, marker) {
  return { name, marker };
}

const gameController = (() => {
  const board = gameBoard.getBoard();
  // Create users using the factory function Player
  const firstUser = Player('Player One', 'X');
  const secondUser = Player('Player Two', 'O');

  // Set what player is going to go first. ** firstUser is set by default as a placeholder **
  let activePlayer = firstUser;

  // This function expression sets activePlayer back to firstUser.
  // When activePlayer is updated to be dynamically set, this function will also require updating.
  const resetActivePlayer = () => {
    activePlayer = firstUser;
  };

  const switchPlayerTurn = () => {
    activePlayer = activePlayer === firstUser ? secondUser : firstUser;
  };

  let matchStatus = 0; // 0 = no winner | 1 = winner
  let movesMade = 0; // when movesMade reach 9 and matchStatus is still 0, the result is a tie.

  const isMatchOver = () => matchStatus;

  const resetValues = () => {
    matchStatus = 0;
    movesMade = 0;
  };

  // Helper function used as a comparison callback for the .every() method.
  const isPlayerMarker = (match) => match === activePlayer.marker;

  const playRound = (row, column) => {
    board[row][column] = activePlayer.marker;
    movesMade += 1;
    /* By using .map(), we create modified arrays that represent
     * the different win conditions. We can then use .every()
     * on the modified arrays to check if every element matches the
     * active player's marker.
     * By nesting the modified arrays inside another array (winConditions)
     * we can use .some() on it to check if any of its arrays return true,
     * indicating that the active player has won.
     */
    const winConditions = [
      board[row], // Represents the horizontal line at the specified row and doesn't need .map().
      board.map((array) => array[column]), // Represents the vertical line at the specified column.
      board.map((array, i) => array[i]), // Represents the left diagonal line.
      board.map((array, i) => array[board.length - 1 - i]), // Represents the right diagonal line.
    ];

    if (winConditions.some((condition) => condition.every(isPlayerMarker))) {
      console.log(`${activePlayer.name} wins`);
      matchStatus = 1;
    } else if (movesMade === 9 && matchStatus === 0) {
      console.log('Tie');
    }

    switchPlayerTurn();
  };
  return {
    playRound, isMatchOver, resetActivePlayer, resetValues,
  };
})();

const screenController = (() => {
  const board = gameBoard.getBoard();
  const onScreenBoard = document.querySelector('.board');

  // Create the visually available cells where players can make their moves.
  const updateScreen = () => {
    onScreenBoard.textContent = ''; // Set the HTML element to an empty string to update the board.
    board.forEach((row, rowIndex) => {
      row.forEach((col, colIndex) => {
        const column = document.createElement('button');
        column.classList.add('col');
        column.textContent = col;
        column.dataset.row = rowIndex;
        column.dataset.col = colIndex;
        onScreenBoard.appendChild(column);
      });
    });
  };

  // We invoke this function to create the board for the first time.
  // **Needs updating-- A button is needed to let the user start the game**
  updateScreen();

  return { onScreenBoard, updateScreen };
})();

const eventHandlers = (() => {
  const playGame = (e) => {
    const rowIndex = e.target.dataset.row;
    const colIndex = e.target.dataset.col;
    if (!rowIndex && !colIndex) return;
    // The event handlers are only gonna work while no winner is announced.
    // And as long as the cell they're trying to access is empty.
    if (e.target.textContent === '' && gameController.isMatchOver() === 0) {
      gameController.playRound(rowIndex, colIndex);
      screenController.updateScreen();
    }
  };

  const resetBoard = () => {
    gameBoard.fillBoard();
    // resetActivePlayer & resetValues could be merged together depending on
    // the functionality of resetActivePlayer once it's dynamically set.
    gameController.resetActivePlayer();
    gameController.resetValues();
    screenController.updateScreen();
  };

  return { playGame, resetBoard };
})();

screenController.onScreenBoard.addEventListener('click', eventHandlers.playGame);
const btn = document.querySelector('.board + button')
  .addEventListener('click', eventHandlers.resetBoard);

// Basic logic to let player decide what mark they wanna pick
/*
  let activePlayer = prompt('Enter your user');
  if (activePlayer === '1') {
    activePlayer = firstUser;
  } else {
    activePlayer = secondUser;
  }
*/

// This was my first "win logic" attempt.
// I'm leaving it here for educational purposes.
/*
  const winConditions = {
    horizontal: [],
    vertical: [],
    leftDiagonal: [],
    rightDiagonal: [],
  };

  for (let i = 0; i < board.length; i += 1) {
    const currentIndex = i; // this is here to improve the code's readability

    winConditions.horizontal.push(board[row][i]);
    winConditions.vertical.push(board[i][column]);
    winConditions.leftDiagonal.push(board[i][currentIndex]);
    winConditions.rightDiagonal.push(board[i][board.length - 1 - currentIndex]);
  }

  if (winConditions.horizontal.every(isPlayerMarker)
    || winConditions.vertical.every(isPlayerMarker)
    || winConditions.leftDiagonal.every(isPlayerMarker)
    || winConditions.rightDiagonal.every(isPlayerMarker)) {
    console.log(`${activePlayer.name} wins`);
  } else {
    switchPlayerTurn();
  }
*/
