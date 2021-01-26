const Player = (mark) => {
  const rowCounter = [0, 0, 0];
  const columnCounter = [0, 0, 0];
  const forwardCounter = [0, 0, 0];
  const backwardCounter = [0, 0, 0];

  const getMark = () => mark;
  const countRow = (row) => ++rowCounter[row];
  const countColumn = (col) => ++columnCounter[col];
  const countForward = (row) => {
    forwardCounter[row]++;
    return forwardCounter.reduce((sum, n) => sum += n, 0);
  };
  const countBackward = (col) => {
    backwardCounter[col]++;
    return backwardCounter.reduce((sum, n) => sum += n, 0);
  };

  return {
    getMark,
    countRow,
    countColumn,
    countForward,
    countBackward
  };
};

const board = (() => {
  const board = {
    0: [],
    1: [],
    2: []
  };
  let counter = 0;

  const setSpot = (row, column, mark) => {
    board[row][column] = mark;
    counter++;
  };
  const isFull = () => counter >= 9;

  return {
    setSpot,
    isFull
  };
})();

const game = (() => {
  const players = [Player("X"), Player("O")];
  let winner = false;

  const setWin = () => winner = true;

  const makeTurn = (row, col) => {
    const mark = players[0].getMark();
    board.setSpot(row, col, mark);

    if(players[0].countRow(row) === 3) setWin();
    if(players[0].countColumn(col) === 3) setWin();
    if(row === col && players[0].countForward(row) === 3) setWin();
    if(row + col + 1 === 3 && players[0].countBackward(col) === 3) setWin();

    players.reverse();
    return mark;
  };

  const getCurrentPlayer = () => players[0];
  const hasWin = () => winner;

  return {
    makeTurn,
    getCurrentPlayer,
    hasWin
  };
})();

const displayController = (() => {
  const winDiv = document.createElement("div");
  winDiv.textContent = "Wins!";

  const tieDiv = document.createElement("div");
  tieDiv.textContent = "It's a Tie";

  const makeTurn = (square) => {
    const row = Number(square.dataset.coords[0]);
    const column = Number(square.dataset.coords.slice(-1));
    const mark = game.makeTurn(row, column);
    square.classList.add(mark);
    square.textContent = mark;
    return mark;
  }

  const handleOutcome = (mark) => {
    const lastPlayer = document.querySelector(`#player-${mark}`);
    const nextPlayer = document.querySelector(
        `#player-${game.getCurrentPlayer().getMark()}`);

    if(game.hasWin()) {
      lastPlayer.appendChild(winDiv);
      // end the game, report winner
    }
    else if(board.isFull()) {
      lastPlayer.classList.remove("bold");
      lastPlayer.parentElement.appendChild(tieDiv);
      // end the game, report tie
    }
    else {
      lastPlayer.classList.remove("bold");
      nextPlayer.classList.add("bold");
    }
  }

  const squares = document.querySelectorAll("section > div");
  squares.forEach(square => square.addEventListener("click", () => {
    if(!square.textContent) {
      const mark = makeTurn(square);
      handleOutcome(mark);      
    }
  }));
})();