import { useState } from "react";

// Componente Square: Ahora acepta una prop `className` para los estilos.
function Square({ value, onSquareClick, className }) {
  return (
    <button className={className} onClick={onSquareClick}>
      {value}
    </button>
  );
}

// Componente Board: La lógica de renderizado del tablero se ha simplificado.
function Board({ xIsNext, squares, onPlay }) {
  function handleClick(i) {
    if (squares[i] || calculateWinner(squares)) {
      return;
    }
    const nextSquare = squares.slice();

    if (xIsNext) {
      nextSquare[i] = "X";
    } else {
      nextSquare[i] = "O";
    }

    onPlay(nextSquare);
  }

  // Obtenemos el resultado de la función calculateWinner.
  const winnerInfo = calculateWinner(squares);
  const winner = winnerInfo ? winnerInfo.winner : null;
  const winningSquares = winnerInfo ? winnerInfo.winningSquares : [];

  let status;
  // Comprobamos si no hay ganador y si todas las casillas están llenas.
  const isDraw = !winner && squares.every((square) => square !== null);

  if (winner) {
    status = "El ganador es: " + winner;
  } else if (isDraw) {
    status = "¡El resultado es un empate!";
  } else {
    status = "Es el turno de: " + (xIsNext ? "X" : "O");
  }

  // Función auxiliar para determinar la clase CSS de cada cuadrado.
  const getClass = (i) =>
    `square ${winningSquares.includes(i) ? "winning-square" : ""}`;

  return (
    <>
      <div className="status">{status}</div>
      <div className="board-row">
        <Square
          value={squares[0]}
          onSquareClick={() => handleClick(0)}
          className={getClass(0)}
        />
        <Square
          value={squares[1]}
          onSquareClick={() => handleClick(1)}
          className={getClass(1)}
        />
        <Square
          value={squares[2]}
          onSquareClick={() => handleClick(2)}
          className={getClass(2)}
        />
      </div>
      <div className="board-row">
        <Square
          value={squares[3]}
          onSquareClick={() => handleClick(3)}
          className={getClass(3)}
        />
        <Square
          value={squares[4]}
          onSquareClick={() => handleClick(4)}
          className={getClass(4)}
        />
        <Square
          value={squares[5]}
          onSquareClick={() => handleClick(5)}
          className={getClass(5)}
        />
      </div>
      <div className="board-row">
        <Square
          value={squares[6]}
          onSquareClick={() => handleClick(6)}
          className={getClass(6)}
        />
        <Square
          value={squares[7]}
          onSquareClick={() => handleClick(7)}
          className={getClass(7)}
        />
        <Square
          value={squares[8]}
          onSquareClick={() => handleClick(8)}
          className={getClass(8)}
        />
      </div>
    </>
  );
}

// La función ahora devuelve un objeto si hay un ganador, con el ganador y los índices.
function calculateWinner(squares) {
  const lines = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6],
  ];

  for (let i = 0; i < lines.length; i++) {
    const [a, b, c] = lines[i];

    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
      return { winner: squares[a], winningSquares: [a, b, c] };
    }
  }
  return null;
}

// Componente Game: La lógica principal del juego.
export default function Game() {
  const [history, setHistory] = useState([Array(9).fill(null)]);
  const [currentMove, setCurrentMove] = useState(0);
  const xIsNext = currentMove % 2 === 0;
  const currentSquares = history[currentMove];

  function handlePlay(nextSquares) {
    const nextHistory = [...history.slice(0, currentMove + 1), nextSquares];
    setHistory(nextHistory);
    setCurrentMove(nextHistory.length - 1);
  }

  function jumpTo(nextMove) {
    setCurrentMove(nextMove);
  }

  // Nueva función para reiniciar el juego.
  function handleReset() {
    setHistory([Array(9).fill(null)]);
    setCurrentMove(0);
  }

  const moves = history.map((squares, move) => {
    let description;
    if (move > 0) {
      description = "Ir al movimiento #" + move;
    } else {
      description = "Ir al inicio del juego";
    }
    return (
      <li key={move}>
        <button onClick={() => jumpTo(move)} className="history-button">
          {description}
        </button>
      </li>
    );
  });

  return (
    <div className="game-container">
      <div className="game">
        <div className="game-board">
          <Board
            xIsNext={xIsNext}
            squares={currentSquares}
            onPlay={handlePlay}
          />
        </div>
        <div className="game-info">
          <button className="reset-button" onClick={handleReset}>
            Reiniciar Juego
          </button>
          <ol>{moves}</ol>
        </div>
      </div>
    </div>
  );
}
