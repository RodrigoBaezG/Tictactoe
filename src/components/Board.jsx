import { calculateWinner, isDraw as checkDraw } from '../utils/gameLogic';
import Square from './Square';
import StatusMessage from './StatusMessage';

export default function Board({ xIsNext, squares, onPlay }) {
  const winnerInfo = calculateWinner(squares);
  const winner = winnerInfo?.winner ?? null;
  const winningSquares = winnerInfo?.winningSquares ?? [];
  const draw = checkDraw(squares);

  function handleClick(i) {
    if (squares[i] || winner || draw) return;
    const next = squares.slice();
    next[i] = xIsNext ? 'X' : 'O';
    onPlay(next);
  }

  const getClass = (i) =>
    `square${winningSquares.includes(i) ? ' winning-square' : ''}`;

  return (
    <>
      <StatusMessage winner={winner} draw={draw} xIsNext={xIsNext} />
      {[0, 1, 2].map((row) => (
        <div key={row} className="board-row">
          {[0, 1, 2].map((col) => {
            const i = row * 3 + col;
            return (
              <Square
                key={i}
                value={squares[i]}
                onSquareClick={() => handleClick(i)}
                className={getClass(i)}
              />
            );
          })}
        </div>
      ))}
    </>
  );
}
