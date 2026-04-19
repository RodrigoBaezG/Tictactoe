export default function MoveHistory({ history, currentMove, onJump }) {
  if (history.length <= 1) return null;

  return (
    <div>
      <p className="history-title">Historial</p>
      <ol className="history-list">
        {history.map((_, move) => {
          const label = move === 0 ? 'Inicio del juego' : `Movimiento #${move}`;
          return (
            <li key={move}>
              <button
                className={`history-button${move === currentMove ? ' current' : ''}`}
                onClick={() => onJump(move)}
              >
                {label}
              </button>
            </li>
          );
        })}
      </ol>
    </div>
  );
}
