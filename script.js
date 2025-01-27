document.addEventListener("DOMContentLoaded", () => {
  const board = document.getElementById("board");
  const restartButton = document.getElementById("restartButton");
  const resultPopup = document.getElementById("resultPopup");
  const resultText = document.getElementById("resultText");
  const continueButton = document.getElementById("continueButton");

  let currentPlayer = "X"; // Manual player starts as "X"
  let gameBoard = ["", "", "", "", "", "", "", "", ""];
  let playerXWins = 0;
  let playerOWins = 0;
  let draws = 0;
  let isBotTurn = false;

  function createBoard() {
      board.innerHTML = "";
      gameBoard.forEach((cell, index) => {
          const cellElement = document.createElement("div");
          cellElement.classList.add("cell");
          cellElement.textContent = cell;
          cellElement.addEventListener("click", () => makeMove(index));
          board.appendChild(cellElement);
      });
  }

  function makeMove(index) {
      if (gameBoard[index] === "" && !isBotTurn) {
          gameBoard[index] = currentPlayer;
          currentPlayer = currentPlayer === "X" ? "O" : "X";
          checkWinner();
          createBoard();

          if (currentPlayer === "O") {
              isBotTurn = true;
              setTimeout(botMove, 500); // Simulate a delay for the bot
          }
      }
  }

  function checkWinner() {
      const winPatterns = [
          [0, 1, 2],
          [3, 4, 5],
          [6, 7, 8],
          [0, 3, 6],
          [1, 4, 7],
          [2, 5, 8],
          [0, 4, 8],
          [2, 4, 6],
      ];

      let winner = null;

      winPatterns.forEach(pattern => {
          const [a, b, c] = pattern;
          if (gameBoard[a] && gameBoard[a] === gameBoard[b] && gameBoard[a] === gameBoard[c]) {
              winner = gameBoard[a];
          }
      });

      if (winner) {
          if (winner === "X") {
              playerXWins++;
              resultText.textContent = "Player X Wins!";
          } else {
              playerOWins++;
              resultText.textContent = "Player O Wins!";
          }
          updateScoreboard();
          showResultPopup();
      } else if (!gameBoard.includes("")) {
          draws++;
          resultText.textContent = "It's a Draw!";
          updateScoreboard();
          showResultPopup();
      }
  }

  function showResultPopup() {
      resultPopup.style.display = "flex";
  }

  continueButton.addEventListener("click", () => {
      gameBoard = ["", "", "", "", "", "", "", "", ""];
      createBoard();
      resultPopup.style.display = "none";
      currentPlayer = "X"; // Reset to Player X starting
      isBotTurn = false;  // Ensure bot doesn't start immediately
  });

  restartButton.addEventListener("click", () => {
      gameBoard = ["", "", "", "", "", "", "", "", ""];
      createBoard();
      currentPlayer = "X";
      isBotTurn = false;
  });

  function updateScoreboard() {
      document.getElementById("playerXWins").textContent = playerXWins;
      document.getElementById("playerOWins").textContent = playerOWins;
      document.getElementById("draws").textContent = draws;
  }

  function botMove() {
      let bestMove = getBestMove();
      gameBoard[bestMove] = "O"; // Bot plays "O"
      currentPlayer = "X"; // Switch back to manual player
      isBotTurn = false;
      checkWinner();
      createBoard();
  }

  function getBestMove() {
      // Winning Move: Check if the bot can win
      for (let i = 0; i < gameBoard.length; i++) {
          if (gameBoard[i] === "") {
              gameBoard[i] = "O";
              if (checkForWinner("O")) {
                  gameBoard[i] = "";
                  return i;
              }
              gameBoard[i] = "";
          }
      }

      // Blocking Move: Check if the player can win, and block them
      for (let i = 0; i < gameBoard.length; i++) {
          if (gameBoard[i] === "") {
              gameBoard[i] = "X";
              if (checkForWinner("X")) {
                  gameBoard[i] = "";
                  return i;
              }
              gameBoard[i] = "";
          }
      }

      // Take the center if it's available
      if (gameBoard[4] === "") {
          return 4;
      }

      // Otherwise, take a random move from the available spots
      let availableMoves = [];
      for (let i = 0; i < gameBoard.length; i++) {
          if (gameBoard[i] === "") {
              availableMoves.push(i);
          }
      }
      return availableMoves[Math.floor(Math.random() * availableMoves.length)];
  }

  function checkForWinner(player) {
      const winPatterns = [
          [0, 1, 2],
          [3, 4, 5],
          [6, 7, 8],
          [0, 3, 6],
          [1, 4, 7],
          [2, 5, 8],
          [0, 4, 8],
          [2, 4, 6],
      ];

      return winPatterns.some(pattern => {
          const [a, b, c] = pattern;
          return gameBoard[a] === player && gameBoard[b] === player && gameBoard[c] === player;
      });
  }

  createBoard();
});
