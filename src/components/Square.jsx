export default function Square({ value, onSquareClick, className }) {
  return (
    <button
      className={`${className}${value ? ' has-value' : ''}`}
      data-value={value ?? ''}
      onClick={onSquareClick}
    >
      {value}
    </button>
  );
}
