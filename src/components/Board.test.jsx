import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import Board from './Board';

const empty = Array(9).fill(null);

describe('Board', () => {
  it('renders 9 squares', () => {
    render(<Board squares={empty} onPlay={() => {}} xIsNext={true} />);
    expect(screen.getAllByRole('button')).toHaveLength(9);
  });

  it('shows X turn status at the start', () => {
    render(<Board squares={empty} onPlay={() => {}} xIsNext={true} />);
    expect(screen.getByText(/turn/i)).toBeInTheDocument();
    expect(screen.getByText('X')).toBeInTheDocument();
  });

  it('shows O turn status when xIsNext is false', () => {
    render(<Board squares={empty} onPlay={() => {}} xIsNext={false} />);
    expect(screen.getByText('O')).toBeInTheDocument();
  });

  it('calls onPlay when an empty square is clicked', async () => {
    const user = userEvent.setup();
    const handlePlay = vi.fn();
    render(<Board squares={empty} onPlay={handlePlay} xIsNext={true} />);
    await user.click(screen.getAllByRole('button')[0]);
    expect(handlePlay).toHaveBeenCalledTimes(1);
  });

  it('places X in the clicked square', async () => {
    const user = userEvent.setup();
    const handlePlay = vi.fn();
    render(<Board squares={empty} onPlay={handlePlay} xIsNext={true} />);
    await user.click(screen.getAllByRole('button')[4]);
    expect(handlePlay).toHaveBeenCalledWith(
      expect.arrayContaining([
        ...Array(4).fill(null),
        'X',
        ...Array(4).fill(null),
      ])
    );
  });

  it('does not call onPlay when an occupied square is clicked', async () => {
    const user = userEvent.setup();
    const handlePlay = vi.fn();
    const squares = ['X', null, null, null, null, null, null, null, null];
    render(<Board squares={squares} onPlay={handlePlay} xIsNext={false} />);
    await user.click(screen.getAllByRole('button')[0]);
    expect(handlePlay).not.toHaveBeenCalled();
  });

  it('shows winner message when X wins', () => {
    const squares = ['X', 'X', 'X', null, null, null, null, null, null];
    render(<Board squares={squares} onPlay={() => {}} xIsNext={false} />);
    expect(screen.getByText(/X wins/i)).toBeInTheDocument();
  });

  it('shows winner message when O wins', () => {
    const squares = ['O', 'O', 'O', null, null, null, null, null, null];
    render(<Board squares={squares} onPlay={() => {}} xIsNext={true} />);
    expect(screen.getByText(/O wins/i)).toBeInTheDocument();
  });

  it('shows draw message when the board is full with no winner', () => {
    const squares = ['X', 'O', 'X', 'O', 'X', 'X', 'O', 'X', 'O'];
    render(<Board squares={squares} onPlay={() => {}} xIsNext={true} />);
    expect(screen.getByText('Draw!')).toBeInTheDocument();
  });

  it('marks the three winning squares with winning-square class', () => {
    const squares = ['X', 'X', 'X', null, null, null, null, null, null];
    render(<Board squares={squares} onPlay={() => {}} xIsNext={false} />);
    const buttons = screen.getAllByRole('button');
    expect(buttons[0]).toHaveClass('winning-square');
    expect(buttons[1]).toHaveClass('winning-square');
    expect(buttons[2]).toHaveClass('winning-square');
    expect(buttons[3]).not.toHaveClass('winning-square');
  });

  it('does not call onPlay after the game is won', async () => {
    const user = userEvent.setup();
    const handlePlay = vi.fn();
    const squares = ['X', 'X', 'X', null, null, null, null, null, null];
    render(<Board squares={squares} onPlay={handlePlay} xIsNext={false} />);
    await user.click(screen.getAllByRole('button')[3]);
    expect(handlePlay).not.toHaveBeenCalled();
  });

  it('does not call onPlay after a draw', async () => {
    const user = userEvent.setup();
    const handlePlay = vi.fn();
    const squares = ['X', 'O', 'X', 'O', 'X', 'X', 'O', 'X', 'O'];
    render(<Board squares={squares} onPlay={handlePlay} xIsNext={true} />);
    await user.click(screen.getAllByRole('button')[0]);
    expect(handlePlay).not.toHaveBeenCalled();
  });
});
