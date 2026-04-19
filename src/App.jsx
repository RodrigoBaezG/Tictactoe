import { useState, useEffect, useRef } from 'react';
import { useGameState } from './hooks/useGameState';
import { calculateWinner, isDraw } from './utils/gameLogic';
import { getBestMove } from './utils/minimax';
import Board from './components/Board';
import MoveHistory from './components/MoveHistory';

export default function Game() {
  const { currentSquares, xIsNext, history, currentMove, handlePlay, jumpTo, reset } =
    useGameState();
  const [score, setScore] = useState({ X: 0, O: 0, draw: 0 });
  const [gameMode, setGameMode] = useState('cpu');
  const [cpuThinking, setCpuThinking] = useState(false);
  const gameScored = useRef(false);
  const handlePlayRef = useRef(handlePlay);
  handlePlayRef.current = handlePlay;

  const winnerInfo = calculateWinner(currentSquares);
  const winner = winnerInfo?.winner ?? null;
  const gameDraw = isDraw(currentSquares);
  const gameOver = Boolean(winner || gameDraw);

  // Score tracking — only count once per game
  useEffect(() => {
    if (winner && !gameScored.current) {
      gameScored.current = true;
      setScore((prev) => ({ ...prev, [winner]: prev[winner] + 1 }));
    } else if (gameDraw && !gameScored.current) {
      gameScored.current = true;
      setScore((prev) => ({ ...prev, draw: prev.draw + 1 }));
    }
  }, [winner, gameDraw]);

  // CPU move — fires when it's O's turn in cpu mode
  useEffect(() => {
    if (gameMode !== 'cpu' || xIsNext || gameOver) return;
    setCpuThinking(true);
    const timer = setTimeout(() => {
      const idx = getBestMove(currentSquares);
      if (idx !== -1) {
        const next = [...currentSquares];
        next[idx] = 'O';
        handlePlayRef.current(next);
      }
      setCpuThinking(false);
    }, 500);
    return () => clearTimeout(timer);
  }, [currentSquares, gameMode, xIsNext, gameOver]);

  function handleReset() {
    if (history.length > 1 && !gameOver) {
      if (!window.confirm('¿Abandonar la partida actual y reiniciar?')) return;
    }
    gameScored.current = false;
    reset();
  }

  function handleModeChange(mode) {
    gameScored.current = false;
    setGameMode(mode);
    reset();
  }

  return (
    <div className="game-container">
      <h1 className="game-title">Tres en Raya</h1>

      <div className="mode-selector">
        <button
          className={`mode-button${gameMode === 'pvp' ? ' active' : ''}`}
          onClick={() => handleModeChange('pvp')}
        >
          2 Jugadores
        </button>
        <button
          className={`mode-button${gameMode === 'cpu' ? ' active' : ''}`}
          onClick={() => handleModeChange('cpu')}
        >
          vs CPU
        </button>
      </div>

      <div className="scoreboard">
        <div className="score-item">
          <div className="score-label">{gameMode === 'cpu' ? 'Tú (X)' : 'Jugador X'}</div>
          <div className="score-value x">{score.X}</div>
        </div>
        <div className="score-item">
          <div className="score-label">Empates</div>
          <div className="score-value draw">{score.draw}</div>
        </div>
        <div className="score-item">
          <div className="score-label">{gameMode === 'cpu' ? 'CPU (O)' : 'Jugador O'}</div>
          <div className="score-value o">{score.O}</div>
        </div>
      </div>

      <div className="player-turn">
        <span className={`player-badge x${xIsNext && !gameOver ? ' active' : ''}`}>X</span>
        <span className="vs-text">VS</span>
        <span className={`player-badge o${!xIsNext && !gameOver ? ' active' : ''}`}>O</span>
        {cpuThinking && <span className="cpu-thinking">CPU pensando…</span>}
      </div>

      <div className="game">
        <div className="game-board">
          <Board xIsNext={xIsNext} squares={currentSquares} onPlay={handlePlay} />
        </div>
        <div className="game-info">
          <button className="reset-button" onClick={handleReset}>
            Reiniciar Juego
          </button>
          <MoveHistory history={history} currentMove={currentMove} onJump={jumpTo} />
        </div>
      </div>
    </div>
  );
}
