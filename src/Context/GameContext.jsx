import React, { createContext, useReducer, useContext } from 'react';
import { apiCreateRoom, apiJoinRoom } from '../config/api';

const DispatchContext = createContext();
const StateContext = createContext();

const initialState = {
  room: 0,
  player1: '',
  player2: '',
  host: false,
  messages: [],
  isGameActive: false,
  isRoundActive: false,
  roundNumber: 0,
  playedCardsInRound: [],
  lives: 3,
  jokers: 3,
};

function gameReducer(state, action) {
  switch (action.type) {
    case 'SET_ROOM': {
      return {
        ...state,
        room: action.payload.room,
        player1: action.payload.player1,
        player2: action.payload.player2,
        messages: action.payload.messages,
      };
    }

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
export default function GameProvider({ children }) {
  const [state, dispatch] = useReducer(gameReducer, initialState);

  return (
    <DispatchContext.Provider value={dispatch}>
      <StateContext.Provider value={state}>{children}</StateContext.Provider>
    </DispatchContext.Provider>
  );
}
const useGameContext = () => {
  const gameState = useContext(StateContext);
  const gameDispatch = useContext(DispatchContext);

  const createRoom = async (roomId, player1) => {
    try {
      await apiCreateRoom(roomId, player1);
      gameDispatch({
        type: 'SET_ROOM',
        payload: {
          room: roomId,
          player1: player1,
          player2: 'waiting',
          messages: [],
        },
      });
    } catch (error) {
      console.error('Error desde el método:', error);
    }
  };

  const joinRoom = async (roomId, player2) => {
    try {
      const roomData = await apiJoinRoom(roomId, player2);
      gameDispatch({
        type: 'SET_ROOM',
        payload: {
          room: roomId,
          player1: roomData.player1,
          player2: player2,
          messages: roomData.messages,
        },
      });
    } catch (error) {
      console.error('Error al unirse a la sala:', error.message);
      throw error;
    }
  };

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
    createRoom,
    joinRoom,
    startGame,
    nextRound,
    playCard,
  };
};

export { GameProvider, useGameContext };
