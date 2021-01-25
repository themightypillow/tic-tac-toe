const Player = (mark) => {
  const getMark = () => mark;

  return {
    getMark
  };
};

const board = (() => {
  const board = {
    0: [],
    1: [],
    2: []
  };

  const setSpot = (row, column, mark) => board[row][column] = mark;
  const getBoard = () => board;

  return {
    setSpot,
    getBoard
  };
})();

const game = (() => {
  const players = [Player("X"), Player("O")];

  const makeTurn = (row, column) => {
    const mark = players[0].getMark();
    board.setSpot(row, column, mark);
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

      const lastPlayerDisplay = document.querySelector(`#player-${mark}`);
      const nextPlayerDisplay = document.querySelector(
          `#player-${game.getCurrentPlayer().getMark()}`);
      lastPlayerDisplay.classList.remove("bold");
      nextPlayerDisplay.classList.add("bold");
    }
  }));
})();