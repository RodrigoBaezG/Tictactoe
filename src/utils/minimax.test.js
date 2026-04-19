import { describe, it, expect } from 'vitest';
import { getBestMove } from './minimax';

describe('getBestMove', () => {
  it('takes the winning move when available for O', () => {
    // O can win at index 8
    const squares = ['O', 'O', null, 'X', 'X', null, null, null, null];
    // O is at [0,1], can win at [2]
    const squares2 = ['O', 'O', null, null, null, null, null, null, null];
    expect(getBestMove(squares2)).toBe(2);
  });

  it('blocks X from winning', () => {
    // X threatens to win at index 2
    const squares = ['X', 'X', null, 'O', null, null, null, null, null];
    expect(getBestMove(squares)).toBe(2);
  });

  it('returns a valid index on an empty board', () => {
    // All moves are equivalent (draw with perfect play), any valid index is acceptable
    const idx = getBestMove(Array(9).fill(null));
    expect(idx).toBeGreaterThanOrEqual(0);
    expect(idx).toBeLessThanOrEqual(8);
  });

  it('returns -1 when the board is full', () => {
    const squares = ['X', 'O', 'X', 'O', 'X', 'O', 'O', 'X', 'O'];
    expect(getBestMove(squares)).toBe(-1);
  });

  it('takes an immediate win over blocking', () => {
    // O can win at index 6 (column 0), X threatens at index 8 (diagonal)
    const squares = ['O', 'X', null, 'O', 'X', null, null, null, null];
    expect(getBestMove(squares)).toBe(6);
  });
});
