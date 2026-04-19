import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent, act } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import Game from './App';

function getBoardSquares() {
  return screen.getAllByRole('button').filter((btn) =>
    ['X', 'O', ''].includes(btn.textContent)
  );
}

async function switchToPvP(user) {
  await user.click(screen.getByText(/2 players/i));
}

describe('Game — integration', () => {
  it('renders the title', () => {
    render(<Game />);
    expect(screen.getByText('Tic-Tac-Toe')).toBeInTheDocument();
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

    await user.click(squares[0]);
    await user.click(squares[3]);
    await user.click(squares[1]);
    await user.click(squares[4]);
    await user.click(squares[2]); // X wins

    expect(screen.getByText(/X wins/i)).toBeInTheDocument();
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
    await user.click(squares[2]);

    expect(screen.getByText('1')).toBeInTheDocument();
  });

  it('detects a draw in PvP mode', async () => {
    const user = userEvent.setup();
    render(<Game />);
    await switchToPvP(user);
    const squares = getBoardSquares();

    const moves = [0, 1, 2, 3, 5, 4, 6, 8, 7];
    for (const idx of moves) {
      await user.click(squares[idx]);
    }

    expect(screen.getByText('Draw!')).toBeInTheDocument();
  });

  it('shows move history buttons after moves in PvP mode', async () => {
    const user = userEvent.setup();
    render(<Game />);
    await switchToPvP(user);
    const squares = getBoardSquares();

    await user.click(squares[0]);
    await user.click(squares[1]);

    expect(screen.getByText(/move #1/i)).toBeInTheDocument();
    expect(screen.getByText(/move #2/i)).toBeInTheDocument();
  });

  it('time-travels to a previous move', async () => {
    const user = userEvent.setup();
    render(<Game />);
    await switchToPvP(user);
    const squares = getBoardSquares();

    await user.click(squares[0]);
    await user.click(squares[1]);
    await user.click(squares[2]);

    await user.click(screen.getByText(/move #1/i));

    expect(squares[0]).toHaveTextContent('X');
    expect(squares[1]).toHaveTextContent('');
    expect(squares[2]).toHaveTextContent('');
  });

  it('resets the game without confirmation when board is empty', async () => {
    const user = userEvent.setup();
    render(<Game />);

    await user.click(screen.getByText(/restart game/i));

    getBoardSquares().forEach((sq) => expect(sq).toHaveTextContent(''));
  });

  it('asks for confirmation before resetting a game in progress', async () => {
    const user = userEvent.setup();
    const confirmSpy = vi.spyOn(window, 'confirm').mockReturnValue(false);
    render(<Game />);
    await switchToPvP(user);
    const squares = getBoardSquares();

    await user.click(squares[0]);
    await user.click(screen.getByText(/restart game/i));

    expect(confirmSpy).toHaveBeenCalledOnce();
    expect(squares[0]).toHaveTextContent('X');

    confirmSpy.mockRestore();
  });

  it('switches between 2-player and CPU modes', async () => {
    const user = userEvent.setup();
    render(<Game />);

    const pvpBtn = screen.getByText(/2 players/i);
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

    await user.click(squares[0]);

    await user.click(squares[1]);
    expect(squares[1]).toHaveTextContent('');
  });

  it('CPU plays O after the 500ms delay', async () => {
    vi.useFakeTimers();
    render(<Game />);
    const squares = getBoardSquares();

    act(() => { fireEvent.click(squares[0]); });

    expect(squares.filter((sq) => sq.textContent !== '').length).toBe(1);

    await act(async () => { vi.advanceTimersByTime(600); });

    expect(squares.filter((sq) => sq.textContent !== '').length).toBeGreaterThanOrEqual(2);
    vi.useRealTimers();
  });

  it('CPU places an O, not an X', async () => {
    vi.useFakeTimers();
    render(<Game />);
    const squares = getBoardSquares();

    act(() => { fireEvent.click(squares[0]); });

    await act(async () => { vi.advanceTimersByTime(600); });

    expect(squares.filter((sq) => sq.textContent === 'O').length).toBe(1);
    vi.useRealTimers();
  });
});
