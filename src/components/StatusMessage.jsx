export default function StatusMessage({ winner, draw, xIsNext }) {
  if (winner) {
    return (
      <div className={`status status-winner status-${winner.toLowerCase()}`}>
        {winner} wins!
      </div>
    );
  }
  if (draw) {
    return <div className="status status-draw">Draw!</div>;
  }
  return (
    <div className="status">
      {'Turn: '}
      <span className={`turn-player turn-${xIsNext ? 'x' : 'o'}`}>
        {xIsNext ? 'X' : 'O'}
      </span>
    </div>
  );
}
