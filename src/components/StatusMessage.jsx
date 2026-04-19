export default function StatusMessage({ winner, draw, xIsNext }) {
  if (winner) {
    return (
      <div className={`status status-winner status-${winner.toLowerCase()}`}>
        ¡{winner} gana!
      </div>
    );
  }
  if (draw) {
    return <div className="status status-draw">¡Empate!</div>;
  }
  return (
    <div className="status">
      Turno de{' '}
      <span className={`turn-player turn-${xIsNext ? 'x' : 'o'}`}>
        {xIsNext ? 'X' : 'O'}
      </span>
    </div>
  );
}
