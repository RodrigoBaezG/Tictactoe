import { describe, it, expect } from 'vitest';
import { calculateWinner, isDraw } from './gameLogic';

describe('calculateWinner', () => {
  it('returns null for an empty board', () => {
    expect(calculateWinner(Array(9).fill(null))).toBeNull();
  });

  it('detects a horizontal win on row 0', () => {
    const squares = ['X', 'X', 'X', null, null, null, null, null, null];
    const result = calculateWinner(squares);
    expect(result.winner).toBe('X');
    expect(result.winningSquares).toEqual([0, 1, 2]);
  });

  it('detects a horizontal win on row 1', () => {
    const squares = [null, null, null, 'O', 'O', 'O', null, null, null];
    const result = calculateWinner(squares);
    expect(result.winner).toBe('O');
    expect(result.winningSquares).toEqual([3, 4, 5]);
  });

  it('detects a horizontal win on row 2', () => {
    const squares = [null, null, null, null, null, null, 'X', 'X', 'X'];
    expect(calculateWinner(squares).winner).toBe('X');
  });

  it('detects a vertical win on column 0', () => {
    const squares = ['O', null, null, 'O', null, null, 'O', null, null];
    const result = calculateWinner(squares);
    expect(result.winner).toBe('O');
    expect(result.winningSquares).toEqual([0, 3, 6]);
  });

  it('detects a vertical win on column 1', () => {
    const squares = [null, 'X', null, null, 'X', null, null, 'X', null];
    expect(calculateWinner(squares).winner).toBe('X');
  });

  it('detects a vertical win on column 2', () => {
    const squares = [null, null, 'O', null, null, 'O', null, null, 'O'];
    expect(calculateWinner(squares).winner).toBe('O');
  });

  it('detects the main diagonal win (0-4-8)', () => {
    const squares = ['X', null, null, null, 'X', null, null, null, 'X'];
    const result = calculateWinner(squares);
    expect(result.winner).toBe('X');
    expect(result.winningSquares).toEqual([0, 4, 8]);
  });

  it('detects the anti-diagonal win (2-4-6)', () => {
    const squares = [null, null, 'O', null, 'O', null, 'O', null, null];
    const result = calculateWinner(squares);
    expect(result.winner).toBe('O');
    expect(result.winningSquares).toEqual([2, 4, 6]);
  });

  it('returns null when no winner', () => {
    const squares = ['X', 'O', 'X', 'O', 'X', 'O', 'O', 'X', null];
    expect(calculateWinner(squares)).toBeNull();
  });
});

describe('isDraw', () => {
  it('returns true when the board is full with no winner', () => {
    // X O X / O X X / O X O  — draw
    const squares = ['X', 'O', 'X', 'O', 'X', 'X', 'O', 'X', 'O'];
    expect(isDraw(squares)).toBe(true);
  });

  it('returns false when empty squares remain', () => {
    const squares = ['X', 'O', 'X', 'O', 'X', 'O', 'O', 'X', null];
    expect(isDraw(squares)).toBe(false);
  });

  it('returns false when there is a winner even if board is full', () => {
    // Row 0 is all X
    const squares = ['X', 'X', 'X', 'O', 'O', 'X', 'O', 'X', 'O'];
    expect(isDraw(squares)).toBe(false);
  });

  it('returns false for an empty board', () => {
    expect(isDraw(Array(9).fill(null))).toBe(false);
  });
});
