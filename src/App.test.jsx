import { describe, it, expect, vi } from 'vitest';
import { render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import Game from './App';

// Helper: returns only the 9 board squares (excludes reset + history buttons)
function getBoardSquares() {
  return screen.getAllByRole('button').filter((btn) =>
    ['X', 'O', ''].includes(btn.textContent)
  );
}

describe('Game — integration', () => {
  it('renders the title', () => {
    render(<Game />);
    expect(screen.getByText('Tres en Raya')).toBeInTheDocument();
  });

  it('renders 9 empty squares at the start', () => {
    render(<Game />);
    const squares = getBoardSquares();
    expect(squares).toHaveLength(9);
    squares.forEach((sq) => expect(sq).toHaveTextContent(''));
  });

  it('renders the scoreboard with zeros', () => {
    render(<Game />);
    const zeros = screen.getAllByText('0');
    expect(zeros.length).toBeGreaterThanOrEqual(3);
  });

  it('places X then O on consecutive clicks', async () => {
    const user = userEvent.setup();
    render(<Game />);
    const squares = getBoardSquares();

    await user.click(squares[0]);
    await user.click(squares[1]);

    expect(squares[0]).toHaveTextContent('X');
    expect(squares[1]).toHaveTextContent('O');
  });

  it('detects X winning', async () => {
    const user = userEvent.setup();
    render(<Game />);
    const squares = getBoardSquares();

    // X wins top row: 0, 1, 2  |  O plays 3, 4
    await user.click(squares[0]); // X
    await user.click(squares[3]); // O
    await user.click(squares[1]); // X
    await user.click(squares[4]); // O
    await user.click(squares[2]); // X wins

    expect(screen.getByText(/X gana/i)).toBeInTheDocument();
  });

  it('increments X score after a win', async () => {
    const user = userEvent.setup();
    render(<Game />);
    const squares = getBoardSquares();

    await user.click(squares[0]);
    await user.click(squares[3]);
    await user.click(squares[1]);
    await user.click(squares[4]);
    await user.click(squares[2]); // X wins

    // Score for X should now be 1
    const xScore = screen.getByText('1');
    expect(xScore).toBeInTheDocument();
  });

  it('detects a draw', async () => {
    const user = userEvent.setup();
    render(<Game />);
    const squares = getBoardSquares();

    // Known draw sequence (indices): X=0,2,5,6,7  O=1,3,4,8
    const moves = [0, 1, 2, 3, 5, 4, 6, 8, 7];
    for (const idx of moves) {
      await user.click(squares[idx]);
    }

    expect(screen.getByText('¡Empate!')).toBeInTheDocument();
  });

  it('shows move history buttons after moves', async () => {
    const user = userEvent.setup();
    render(<Game />);
    const squares = getBoardSquares();

    await user.click(squares[0]);
    await user.click(squares[1]);

    expect(screen.getByText(/movimiento #1/i)).toBeInTheDocument();
    expect(screen.getByText(/movimiento #2/i)).toBeInTheDocument();
  });

  it('time-travels to a previous move', async () => {
    const user = userEvent.setup();
    render(<Game />);
    const squares = getBoardSquares();

    await user.click(squares[0]); // X at 0
    await user.click(squares[1]); // O at 1
    await user.click(squares[2]); // X at 2

    const histBtn = screen.getByText(/movimiento #1/i);
    await user.click(histBtn);

    // After jumping to move 1: only square[0] has X, rest empty
    expect(squares[0]).toHaveTextContent('X');
    expect(squares[1]).toHaveTextContent('');
    expect(squares[2]).toHaveTextContent('');
  });

  it('resets the game without confirmation when board is empty', async () => {
    const user = userEvent.setup();
    render(<Game />);

    const resetBtn = screen.getByText(/reiniciar/i);
    await user.click(resetBtn);

    getBoardSquares().forEach((sq) => expect(sq).toHaveTextContent(''));
  });

  it('asks for confirmation before resetting a game in progress', async () => {
    const user = userEvent.setup();
    const confirmSpy = vi.spyOn(window, 'confirm').mockReturnValue(false);
    render(<Game />);
    const squares = getBoardSquares();

    await user.click(squares[0]); // make a move

    const resetBtn = screen.getByText(/reiniciar/i);
    await user.click(resetBtn);

    expect(confirmSpy).toHaveBeenCalledOnce();
    // Cancelled → board should still have the piece
    expect(squares[0]).toHaveTextContent('X');

    confirmSpy.mockRestore();
  });

  it('switches between 2-player and CPU modes', async () => {
    const user = userEvent.setup();
    render(<Game />);

    const cpuBtn = screen.getByText(/vs cpu/i);
    await user.click(cpuBtn);
    expect(cpuBtn).toHaveClass('active');

    const pvpBtn = screen.getByText(/2 jugadores/i);
    await user.click(pvpBtn);
    expect(pvpBtn).toHaveClass('active');
  });
});
