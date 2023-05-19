const gameBoard = (() => {
  const boardSize = 3;
  const board = [];

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

  const getBoard = () => board;

  return { getBoard };
})();

function Player(name, marker) {
  return { name, marker };
}

const gameController = (() => {
  const board = gameBoard.getBoard();
  // Create users
  const firstUser = Player('Player One', 'X');
  const secondUser = Player('Player Two', 'O');

  // Set active user and switch turns accordingly.
  let activePlayer = firstUser;
  const switchPlayerTurn = () => {
    activePlayer = activePlayer === firstUser ? secondUser : firstUser;
  };

  // Helper function used as a comparison callback for the .every() method.
  const isPlayerMarker = (match) => match === activePlayer.marker;

  const playRound = (row, column) => {
    // If the slot isn't empty, the move is not valid.
    if (board[row][column] === '') {
      board[row][column] = activePlayer.marker;
    } else {
      // ***logic that warns the player about their move being invalid***
    }

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
      return;
    }

    switchPlayerTurn();
    // Only needed for the console-based version of the game
    console.log(`It is now ${activePlayer.marker}'s turn--`);
  };
  return { playRound };
})();

// Only needed for the console-based version of the game
console.log(
  'The array below this message is updated with each move.\nTo make a move use gameController.playRound(rowNumber, cellNumber)\nAI is not yet implemented.',
);
console.log(gameBoard.getBoard());

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
