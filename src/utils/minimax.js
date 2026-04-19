import { calculateWinner } from './gameLogic';

function minimax(squares, isMaximizing, depth) {
  const result = calculateWinner(squares);
  if (result?.winner === 'O') return 10 - depth;
  if (result?.winner === 'X') return depth - 10;
  if (squares.every(Boolean)) return 0;

  if (isMaximizing) {
    let best = -Infinity;
    for (let i = 0; i < squares.length; i++) {
      if (!squares[i]) {
        const next = [...squares];
        next[i] = 'O';
        best = Math.max(best, minimax(next, false, depth + 1));
      }
    }
    return best;
  } else {
    let best = Infinity;
    for (let i = 0; i < squares.length; i++) {
      if (!squares[i]) {
        const next = [...squares];
        next[i] = 'X';
        best = Math.min(best, minimax(next, true, depth + 1));
      }
    }
    return best;
  }
}

export function getBestMove(squares) {
  let bestScore = -Infinity;
  let bestIndex = -1;
  for (let i = 0; i < squares.length; i++) {
    if (!squares[i]) {
      const next = [...squares];
      next[i] = 'O';
      const score = minimax(next, false, 1);
      if (score > bestScore) {
        bestScore = score;
        bestIndex = i;
      }
    }
  }
  return bestIndex;
}
