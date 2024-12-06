const boardSize = 8;
let board = Array.from(Array(boardSize), () => new Array(boardSize).fill(0)); // 0: 空, 1: 白, 2: 黒
board[3][3] = board[4][4] = 1;
board[3][4] = board[4][3] = 2;
let currentPlayer = 2; // 黒から始める

const directions = [[-1, -1], [-1, 0], [-1, 1], [0, -1], [0, 1], [1, -1], [1, 0], [1, 1]];

function renderBoard() {
  const boardElement = document.getElementById('board');
  boardElement.innerHTML = '';
  for (let i = 0; i < boardSize; i++) {
    for (let j = 0; j < boardSize; j++) {
      const cell = document.createElement('div');
      cell.classList.add('cell');
      if (board[i][j] === 1) cell.classList.add('white');
      if (board[i][j] === 2) cell.classList.add('black');
      cell.dataset.row = i;
      cell.dataset.col = j;
      cell.addEventListener('click', handleClick);
      boardElement.appendChild(cell);
    }
  }
}

function isValidMove(row, col, player) {
  if (board[row][col] !== 0) return false;
  for (const [dr, dc] of directions) {
    let r = row + dr;
    let c = col + dc;
    let opponentFound = false;
    while (r >= 0 && r < boardSize && c >= 0 && c < boardSize && board[r][c] === 3 - player) {
      opponentFound = true;
      r += dr;
      c += dc;
    }
    if (opponentFound && r >= 0 && r < boardSize && c >= 0 && c < boardSize && board[r][c] === player) return true;
  }
  return false;
}

function getValidMoves(player) {
  const moves = [];
  for (let i = 0; i < boardSize; i++) {
    for (let j = 0; j < boardSize; j++) {
      if (isValidMove(i, j, player)) moves.push([i, j]);
    }
  }
  return moves;
}

function flipDiscs(row, col, player) {
  for (const [dr, dc] of directions) {
    let r = row + dr;
    let c = col + dc;
    let toFlip = [];
    while (r >= 0 && r < boardSize && c >= 0 && c < boardSize && board[r][c] === 3 - player) {
      toFlip.push([r, c]);
      r += dr;
      c += dc;
    }
    if (r >= 0 && r < boardSize && c >= 0 && c < boardSize && board[r][c] === player && toFlip.length > 0) {
      toFlip.forEach(([r, c]) => board[r][c] = player);
    }
  }
}

function handleClick(event) {
    const row = parseInt(event.target.dataset.row);
    const col = parseInt(event.target.dataset.col);
    const validMoves = getValidMoves(currentPlayer);

    const isValidClick = validMoves.some(move => move[0] === row && move[1] === col);

    if (isValidClick) {
        board[row][col] = currentPlayer;
        flipDiscs(row, col, currentPlayer);
        currentPlayer = 3 - currentPlayer;
    } else {
        alert("そこには置けません。");
        return;
    }

    const currentValidMoves = getValidMoves(currentPlayer);
    const nextValidMoves = getValidMoves(3 - currentPlayer);

    if (currentValidMoves.length === 0) {
        if (nextValidMoves.length === 0) {
            alert("ゲーム終了！" + determineWinner());
            return;
        } else {
            alert("合法手がないため、次のプレイヤーにターンが移ります。");
            currentPlayer = 3 - currentPlayer;
        }
    }

    renderBoard();
}

function determineWinner() {
    const count1 = board.flat().filter(x => x === 1).length;
    const count2 = board.flat().filter(x => x === 2).length;
    if (count1 > count2) return "白の勝ち";
    if (count2 > count1) return "黒の勝ち";
    return "引き分け";
}

renderBoard();