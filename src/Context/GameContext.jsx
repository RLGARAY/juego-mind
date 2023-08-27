import React, { createContext, useReducer, useContext } from 'react';

const DispatchContext = createContext();
const StateContext = createContext();

const initialState = {
  room: 0,
  players: 0,
  chatMessages: [],
  isGameActive: false,
  isRoundActive: false,
  roundNumber: 0,
  playedCardsInRound: [],
  lives: 3,
  jokers: 3,
};

function gameReducer(state, action) {
  switch (action.type) {
    case 'START_GAME': {
      return {
        ...state,
        isGameActive: true,
      };
    }

    case 'FINISH_GAME': {
      return {
        ...state,
        isGameActive: false,
      };
    }

    case 'NEXT_ROUND': {
      return {
        ...state,
        isRoundActive: true,
        roundNumber: action.payload.roundNumber,
        playedCardsInRound: [],
      };
    }

    case 'FINISH_ROUND': {
      return {
        ...state,
        isRoundActive: false,
      };
    }

    default: {
      return state;
    }
  }
}

/**
//  * Provides all children with the state and the dispatch of Game Provider
//  * @param { node } children
//  * @returns node
//  */
export default function GameProvider(props) {
  const [state, dispatch] = useReducer(gameReducer, initialState);

  return (
    <DispatchContext.Provider value={dispatch}>
      <StateContext.Provider value={state}>{props.children}</StateContext.Provider>
    </DispatchContext.Provider>
  );
}
const useGameContext = () => {
  const gameState = useContext(StateContext);
  const gameDispatch = useContext(DispatchContext);

  const startGame = () => {
    // Activar partida
    // activar y subir Ronda
    // repartir cartas
  };

  const nextRound = () => {
    // activar y subir ronda
    //repartir cartas
  };

  const playCard = () => {
    // Lógica para jugar una carta
    // ...
  };

  return {
    gameState,
    startGame,
    nextRound,
    playCard,
  };
};

export { GameProvider, useGameContext };
