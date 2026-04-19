import { useReducer } from 'react';

const initialState = {
  history: [Array(9).fill(null)],
  currentMove: 0,
};

function gameReducer(state, action) {
  switch (action.type) {
    case 'PLAY': {
      const nextHistory = [
        ...state.history.slice(0, state.currentMove + 1),
        action.squares,
      ];
      return { history: nextHistory, currentMove: nextHistory.length - 1 };
    }
    case 'JUMP':
      return { ...state, currentMove: action.move };
    case 'RESET':
      return initialState;
    default:
      return state;
  }
}

export function useGameState() {
  const [state, dispatch] = useReducer(gameReducer, initialState);
  const { history, currentMove } = state;

  return {
    currentSquares: history[currentMove],
    xIsNext: currentMove % 2 === 0,
    history,
    currentMove,
    handlePlay: (squares) => dispatch({ type: 'PLAY', squares }),
    jumpTo: (move) => dispatch({ type: 'JUMP', move }),
    reset: () => dispatch({ type: 'RESET' }),
  };
}
