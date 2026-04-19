import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent, act, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import Game from './App';

// Helper: returns only the 9 board squares (excludes reset + history buttons)
function getBoardSquares() {
  return screen.getAllByRole('button').filter((btn) =>
    ['X', 'O', ''].includes(btn.textContent)
  );
}

// Switch to PvP mode so tests can place O manually
async function switchToPvP(user) {
  await user.click(screen.getByText(/2 jugadores/i));
}

describe('Game — integration', () => {
  it('renders the title', () => {
    render(<Game />);
    expect(screen.getByText('Tres en Raya')).toBeInTheDocument();
  });

  it('starts in CPU mode by default', () => {
    render(<Game />);
    expect(screen.getByText(/vs cpu/i)).toHaveClass('active');
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

  it('places X then O on consecutive clicks in PvP mode', async () => {
    const user = userEvent.setup();
    render(<Game />);
    await switchToPvP(user);
    const squares = getBoardSquares();

    await user.click(squares[0]);
    await user.click(squares[1]);

    expect(squares[0]).toHaveTextContent('X');
    expect(squares[1]).toHaveTextContent('O');
  });

  it('detects X winning in PvP mode', async () => {
    const user = userEvent.setup();
    render(<Game />);
    await switchToPvP(user);
    const squares = getBoardSquares();

    // X wins top row: 0, 1, 2  |  O plays 3, 4
    await user.click(squares[0]); // X
    await user.click(squares[3]); // O
    await user.click(squares[1]); // X
    await user.click(squares[4]); // O
    await user.click(squares[2]); // X wins

    expect(screen.getByText(/X gana/i)).toBeInTheDocument();
  });

  it('increments X score after a win in PvP mode', async () => {
    const user = userEvent.setup();
    render(<Game />);
    await switchToPvP(user);
    const squares = getBoardSquares();

    await user.click(squares[0]);
    await user.click(squares[3]);
    await user.click(squares[1]);
    await user.click(squares[4]);
    await user.click(squares[2]); // X wins

    expect(screen.getByText('1')).toBeInTheDocument();
  });

  it('detects a draw in PvP mode', async () => {
    const user = userEvent.setup();
    render(<Game />);
    await switchToPvP(user);
    const squares = getBoardSquares();

    // Known draw sequence: X=0,2,5,6,7  O=1,3,4,8
    const moves = [0, 1, 2, 3, 5, 4, 6, 8, 7];
    for (const idx of moves) {
      await user.click(squares[idx]);
    }

    expect(screen.getByText('¡Empate!')).toBeInTheDocument();
  });

  it('shows move history buttons after moves in PvP mode', async () => {
    const user = userEvent.setup();
    render(<Game />);
    await switchToPvP(user);
    const squares = getBoardSquares();

    await user.click(squares[0]);
    await user.click(squares[1]);

    expect(screen.getByText(/movimiento #1/i)).toBeInTheDocument();
    expect(screen.getByText(/movimiento #2/i)).toBeInTheDocument();
  });

  it('time-travels to a previous move', async () => {
    const user = userEvent.setup();
    render(<Game />);
    await switchToPvP(user);
    const squares = getBoardSquares();

    await user.click(squares[0]); // X at 0
    await user.click(squares[1]); // O at 1
    await user.click(squares[2]); // X at 2

    const histBtn = screen.getByText(/movimiento #1/i);
    await user.click(histBtn);

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
    await switchToPvP(user);
    const squares = getBoardSquares();

    await user.click(squares[0]); // make a move

    const resetBtn = screen.getByText(/reiniciar/i);
    await user.click(resetBtn);

    expect(confirmSpy).toHaveBeenCalledOnce();
    expect(squares[0]).toHaveTextContent('X'); // not reset

    confirmSpy.mockRestore();
  });

  it('switches between 2-player and CPU modes', async () => {
    const user = userEvent.setup();
    render(<Game />);

    const pvpBtn = screen.getByText(/2 jugadores/i);
    await user.click(pvpBtn);
    expect(pvpBtn).toHaveClass('active');

    const cpuBtn = screen.getByText(/vs cpu/i);
    await user.click(cpuBtn);
    expect(cpuBtn).toHaveClass('active');
  });
});

describe('Game — CPU mode', () => {
  it('blocks the board on O turn so the user cannot place O manually', async () => {
    const user = userEvent.setup();
    render(<Game />);
    const squares = getBoardSquares();

    await user.click(squares[0]); // X plays

    // Board is now disabled for O turn — click should be ignored
    await user.click(squares[1]);
    expect(squares[1]).toHaveTextContent('');
  });

  it('CPU plays O after the 500ms delay', async () => {
    vi.useFakeTimers();
    render(<Game />);
    const squares = getBoardSquares();

    act(() => { fireEvent.click(squares[0]); }); // X plays

    // Before delay fires: only X is placed
    expect(squares.filter((sq) => sq.textContent !== '').length).toBe(1);

    await act(async () => { vi.advanceTimersByTime(600); });

    expect(squares.filter((sq) => sq.textContent !== '').length).toBeGreaterThanOrEqual(2);
    vi.useRealTimers();
  });

  it('CPU places an O, not an X', async () => {
    vi.useFakeTimers();
    render(<Game />);
    const squares = getBoardSquares();

    act(() => { fireEvent.click(squares[0]); }); // X plays at 0

    await act(async () => { vi.advanceTimersByTime(600); });

    const oSquares = squares.filter((sq) => sq.textContent === 'O');
    expect(oSquares.length).toBe(1);
    vi.useRealTimers();
  });
});
