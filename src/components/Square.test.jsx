import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import Square from './Square';

describe('Square', () => {
  it('renders empty when value is null', () => {
    render(<Square value={null} onSquareClick={() => {}} className="square" />);
    expect(screen.getByRole('button')).toHaveTextContent('');
  });

  it('renders X when value is "X"', () => {
    render(<Square value="X" onSquareClick={() => {}} className="square" />);
    expect(screen.getByRole('button')).toHaveTextContent('X');
  });

  it('renders O when value is "O"', () => {
    render(<Square value="O" onSquareClick={() => {}} className="square" />);
    expect(screen.getByRole('button')).toHaveTextContent('O');
  });

  it('calls onSquareClick when clicked', async () => {
    const user = userEvent.setup();
    const handleClick = vi.fn();
    render(<Square value={null} onSquareClick={handleClick} className="square" />);
    await user.click(screen.getByRole('button'));
    expect(handleClick).toHaveBeenCalledTimes(1);
  });

  it('applies the winning-square class when passed', () => {
    render(<Square value="X" onSquareClick={() => {}} className="square winning-square" />);
    expect(screen.getByRole('button')).toHaveClass('winning-square');
  });

  it('sets data-value attribute to the piece value', () => {
    render(<Square value="O" onSquareClick={() => {}} className="square" />);
    expect(screen.getByRole('button')).toHaveAttribute('data-value', 'O');
  });

  it('adds has-value class when value is set', () => {
    render(<Square value="X" onSquareClick={() => {}} className="square" />);
    expect(screen.getByRole('button')).toHaveClass('has-value');
  });

  it('does not add has-value class when value is null', () => {
    render(<Square value={null} onSquareClick={() => {}} className="square" />);
    expect(screen.getByRole('button')).not.toHaveClass('has-value');
  });
});
