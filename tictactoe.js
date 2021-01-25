const Player = () => {
  
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
  let turn;
  const toggleTurn = () => {
    turn === "X" ? turn = "O" : turn = "X";
    return turn;
  };

  return {
    toggleTurn
  };
})();

const displayController = (() => {
  const squares = document.querySelectorAll("main > div");
  squares.forEach(square => square.addEventListener("click", () => {
    if(!square.textContent) {
      const row = Number(square.dataset.coords[0]);
      const column = Number(square.dataset.coords.slice(-1));
      const turn = game.toggleTurn();
      board.setSpot(row, column, turn);
      square.textContent = turn;
    }
  }));
})();