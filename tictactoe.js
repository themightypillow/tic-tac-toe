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

  const reset = () => {
    for(let i = 0; i < 3; i++) {
      rowCounter[i] = 0;
      columnCounter[i] = 0;
      forwardCounter[i] = 0;
      backwardCounter[i] = 0;
    }
  }

  return {
    getMark,
    countRow,
    countColumn,
    countForward,
    countBackward,
    reset
  };
};

const board = (() => {
  const container = {
    0: [],
    1: [],
    2: []
  };
  let counter = 0;

  const setSpot = (row, column, mark) => {
    container[row][column] = mark;
    counter++;
  };
  const isFull = () => counter >= 9;
  const reset = () => {
    container[0] = [];
    container[1] = [];
    container[2] = [];
    counter = 0;
  };

  return {
    setSpot,
    isFull,
    reset
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
  const reset = () => {
    players.forEach(player => player.reset());
    winner = false;
    if(players[0].getMark() === "O") players.reverse();
  };

  return {
    makeTurn,
    getCurrentPlayer,
    hasWin,
    reset
  };
})();

const displayController = (() => {
  const winDiv = document.createElement("div");
  winDiv.textContent = "Wins!";

  const tieDiv = document.createElement("div");
  tieDiv.textContent = "It's a Tie!";
  tieDiv.classList.add("bold");

  const squares = document.querySelectorAll("section > div");
  const boardDisplay = document.querySelector("main > section");
  const startOverlay = document.querySelector("#startOverlay");
  
  const reset = () => {
    squares.forEach(square => {
      square.textContent = "";
      square.className = "";
    });
    boardDisplay.classList.remove("disabled");
    if(winDiv.parentElement) winDiv.parentElement.removeChild(winDiv);
    if(tieDiv.parentElement) tieDiv.parentElement.removeChild(tieDiv);
    document.querySelector("#player-X").classList.remove("bold");
    document.querySelector("#player-O").classList.remove("bold");
    board.reset();
    game.reset();
  };

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
      boardDisplay.classList.add("disabled");
    }
    else if(board.isFull()) {
      lastPlayer.classList.remove("bold");
      lastPlayer.parentElement.parentElement.appendChild(tieDiv);
      boardDisplay.classList.add("disabled");
    }
    else {
      lastPlayer.classList.remove("bold");
      nextPlayer.classList.add("bold");
    }
  };

  squares.forEach(square => square.addEventListener("click", () => {
    if(!square.textContent) {
      const mark = makeTurn(square);
      handleOutcome(mark);      
    }
  }));

  document.querySelector("#startOverlay > button").addEventListener("click", () => {
    document.querySelector("#player-X > :first-child").textContent = 
        document.querySelector("#player1").value;
    document.querySelector("#player-O > :first-child").textContent = 
        document.querySelector("#player2").value;
    startOverlay.style.display = "none";
    document.querySelector("#player-X").classList.add("bold");
  });

  document.querySelector("#restart").addEventListener("click", () => {
    reset();
    startOverlay.style.display = "flex";
  });

})();