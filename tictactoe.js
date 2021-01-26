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

  const setSpot = (row, column, mark) => {
    board[row][column] = mark;
  };

  return {
    setSpot
  };
})();

const game = (() => {
  const players = [Player("X"), Player("O")];

  const makeTurn = (row, col) => {
    const mark = players[0].getMark();
    board.setSpot(row, col, mark);
    players.reverse();
    return mark;
  };

  const getCurrentPlayer = () => players[0];

  return {
    makeTurn,
    getCurrentPlayer
  };
})();

const displayController = (() => {
  const squares = document.querySelectorAll("section > div");
  squares.forEach(square => square.addEventListener("click", () => {
    if(!square.textContent) {
      const row = Number(square.dataset.coords[0]);
      const column = Number(square.dataset.coords.slice(-1));
      const mark = game.makeTurn(row, column);
      square.classList.add(mark);
      square.textContent = mark;

      const lastPlayer = document.querySelector(`#player-${mark}`);
      const nextPlayer = document.querySelector(
          `#player-${game.getCurrentPlayer().getMark()}`);
      lastPlayer.classList.remove("bold");
      nextPlayer.classList.add("bold");
    }
  }));
})();