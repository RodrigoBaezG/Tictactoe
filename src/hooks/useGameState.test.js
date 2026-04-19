import { describe, it, expect } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useGameState } from './useGameState';

describe('useGameState', () => {
  it('starts with an empty board', () => {
    const { result } = renderHook(() => useGameState());
    expect(result.current.currentSquares).toEqual(Array(9).fill(null));
    expect(result.current.xIsNext).toBe(true);
    expect(result.current.currentMove).toBe(0);
    expect(result.current.history).toHaveLength(1);
  });

  it('handlePlay updates the board and advances the turn', () => {
    const { result } = renderHook(() => useGameState());
    const next = [...Array(9).fill(null)];
    next[0] = 'X';

    act(() => result.current.handlePlay(next));

    expect(result.current.currentSquares[0]).toBe('X');
    expect(result.current.xIsNext).toBe(false);
    expect(result.current.currentMove).toBe(1);
    expect(result.current.history).toHaveLength(2);
  });

  it('jumpTo moves to a specific point in history', () => {
    const { result } = renderHook(() => useGameState());
    const s1 = Array(9).fill(null); s1[0] = 'X';
    const s2 = [...s1]; s2[1] = 'O';

    act(() => result.current.handlePlay(s1));
    act(() => result.current.handlePlay(s2));
    act(() => result.current.jumpTo(1));

    expect(result.current.currentMove).toBe(1);
    expect(result.current.currentSquares[1]).toBeNull();
    expect(result.current.xIsNext).toBe(false);
  });

  it('reset returns to the initial state', () => {
    const { result } = renderHook(() => useGameState());
    const s1 = Array(9).fill(null); s1[0] = 'X';

    act(() => result.current.handlePlay(s1));
    act(() => result.current.reset());

    expect(result.current.currentSquares).toEqual(Array(9).fill(null));
    expect(result.current.currentMove).toBe(0);
    expect(result.current.history).toHaveLength(1);
  });

  it('handlePlay truncates future history when playing from the past', () => {
    const { result } = renderHook(() => useGameState());
    const s1 = Array(9).fill(null); s1[0] = 'X';
    const s2 = [...s1]; s2[1] = 'O';
    const alt = Array(9).fill(null); alt[4] = 'X'; // alternative branch

    act(() => result.current.handlePlay(s1));
    act(() => result.current.handlePlay(s2));
    act(() => result.current.jumpTo(1));
    act(() => result.current.handlePlay(alt));

    // history should be: [empty, s1, alt]
    expect(result.current.history).toHaveLength(3);
    expect(result.current.currentSquares[4]).toBe('X');
  });

  it('alternates xIsNext correctly over multiple moves', () => {
    const { result } = renderHook(() => useGameState());

    for (let i = 0; i < 4; i++) {
      const squares = result.current.currentSquares.slice();
      squares[i] = result.current.xIsNext ? 'X' : 'O';
      act(() => result.current.handlePlay(squares));
    }

    expect(result.current.xIsNext).toBe(true); // 4 moves → back to X
  });
});
