import React, { createContext, useReducer, useContext, useEffect } from 'react';

import { useRoomContext } from '../Context/RoomContext';
import { dealCards } from '../Features/Card';

import { db } from '../config/fire';
import { doc, onSnapshot } from 'firebase/firestore';
import { updateGame, createGame, updateActualGame } from '../config/api';

const DispatchContext = createContext();
const StateContext = createContext();

const initialState = {
  gameId: '',
  gameStatus: false,
  isRoundActive: false,
  roundNumber: 0,
  player1Cards: [],
  player2Cards: [],
  playedCardsInRound: [],
  lives: 3,
  jokers: 3,
};

function gameReducer(state, action) {
  switch (action.type) {
    case 'START_GAME': {
      return {
        ...state,
        gameId: action.payload.gameId,
        gameStatus: 'Active',
      };
    }

    case 'FINISH_GAME': {
      return {
        ...state,
        gameStatus: action.payload.gameStatus,
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

    case 'PLAYER1_HAND': {
      return {
        ...state,
        player1Cards: action.payload.player1Cards,
      };
    }

    case 'PLAYER2_HAND': {
      return {
        ...state,
        player2Cards: action.payload.player2Cards,
      };
    }

    case 'PLAY_CARD': {
      return {
        ...state,
        playedCardsInRound: action.payload.playedCardsInRound,
        lives: action.payload.lives,
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

  const { roomState } = useRoomContext();

  // EFFECTS  //////////////////////////

  /** Effect to update when there is a change in the db in the game data*/
  useEffect(() => {
    if (roomState.actualGame) {
      gameDispatch({
        type: 'START_GAME',
        payload: { gameId: roomState.actualGame },
      });
    }
  }, [roomState.actualGame]);

  useEffect(() => {
    if (gameState.gameId) {
      const unsubscribe = onSnapshot(
        doc(db, 'rooms', roomState.roomId, 'games', gameState.gameId),
        (doc) => {
          const newData = doc.data();

          const changedFields = Object.keys(newData).filter((field) => {
            if (['player1Cards', 'player2Cards', 'playedCardsInRound'].includes(field)) {
              return JSON.stringify(newData[field]) !== JSON.stringify(gameState[field]);
            }
            return newData[field] !== gameState[field];
          });

          if (changedFields.length > 0) {
            // Realizar acciones según los campos cambiados en game Data
            changedFields.forEach((field) => {
              switch (field) {
                case 'gameStatus':
                  gameDispatch({
                    type: 'FINISH_GAME',
                    payload: {
                      gameStatus: newData.gameStatus,
                    },
                  });
                  break;

                case 'isRoundActive':
                  if (newData.isRoundActive) {
                    gameDispatch({
                      type: 'NEXT_ROUND',
                      payload: {
                        roundNumber: gameState.roundNumber + 1,
                      },
                    });
                  } else {
                    gameDispatch({
                      type: 'FINISH_ROUND',
                    });
                  }
                  break;

                case 'player1Cards':
                  gameDispatch({
                    type: 'PLAYER1_HAND',
                    payload: {
                      player1Cards: newData.player1Cards,
                    },
                  });
                  break;

                case 'player2Cards':
                  gameDispatch({
                    type: 'PLAYER2_HAND',
                    payload: {
                      player2Cards: newData.player2Cards,
                    },
                  });
                  break;

                case 'playedCardsInRound':
                  // Comprobar si la última carta es mayor que la anterior
                  const lastPlayedCard =
                    newData.playedCardsInRound[newData.playedCardsInRound.length - 1];
                  const prevPlayedCard =
                    newData.playedCardsInRound[newData.playedCardsInRound.length - 2];
                  let lives = gameState.lives;

                  if (lastPlayedCard && prevPlayedCard && lastPlayedCard.id <= prevPlayedCard.id) {
                    lives = lives - 1;
                  }

                  gameDispatch({
                    type: 'PLAY_CARD',
                    payload: {
                      playedCardsInRound: newData.playedCardsInRound,
                      lives: lives,
                    },
                  });

                  break;

                default:
                  // Acción por defecto si el campo no se reconoce
                  break;
              }
            });
          }
        },
        (error) => {
          console.error('Error fetching game data:', error);
        },
      );

      return () => {
        // Limpiar la suscripción cuando el componente se desmonta
        unsubscribe();
      };
    }
  }, [gameState.gameId]);

  useEffect(() => {
    console.log('entra fin ronda');
    if (
      roomState.host &&
      gameState.isRoundActive &&
      gameState.playedCardsInRound.length === gameState.roundNumber * 2
    ) {
      console.log('fin ronda');
      updateGame(roomState.roomId, gameState.gameId, { isRoundActive: false });
    }
  }, [gameState.isRoundActive, gameState.playedCardsInRound, gameState.roundNumber]);

  useEffect(() => {
    console.log('entra vidas');
    if (roomState.host && gameState.lives === 0) {
      console.log('fin Partida');

      updateGame(roomState.roomId, gameState.gameId, { gameStatus: 'Derrota', lives: 0 });
    }
  }, [gameState.lives]);

  // PUBLIC METHODS   //////////////////////////

  const startGame = async () => {
    try {
      const payload = {
        player1: roomState.player1,
        player2: roomState.player2,
        gameStatus: 'Active',
        isRoundActive: false,
        roundNumber: 0,
        player1Cards: [],
        player2Cards: [],
        playedCardsInRound: [],
        lives: 3,
        jokers: 3,
      };

      const roomData = await createGame(roomState.roomId, payload);
      await updateActualGame(roomState.roomId, roomData.gameId);
      gameDispatch({
        type: 'START_GAME',
        payload: { gameId: roomData.gameId },
      });
    } catch (error) {
      console.error('Error desde el método:', error);
    }
  };

  const nextRound = async () => {
    const hands = dealCards(2, gameState.roundNumber + 1);
    console.log('nuevaRonda');
    try {
      const payload = {
        isRoundActive: true,
        roundNumber: gameState.roundNumber + 1,
        player1Cards: hands[0],
        player2Cards: hands[1],
        playedCardsInRound: [],
      };

      await updateGame(roomState.roomId, gameState.gameId, payload);
    } catch (error) {
      console.error('Error desde el método:', error);
    }
  };

  const playCard = async (card) => {
    const host = roomState.host;

    const localHand = host
      ? gameState.player1Cards.filter((c) => c !== card)
      : gameState.player2Cards.filter((c) => c !== card);

    const payload = { playedCardsInRound: [...gameState.playedCardsInRound, card] };
    if (host) {
      payload.player1Cards = localHand;
    } else {
      payload.player2Cards = localHand;
    }

    await updateGame(roomState.roomId, gameState.gameId, payload);
  };

  return {
    gameState,
    startGame,
    nextRound,
    playCard,
  };
};

export { GameProvider, useGameContext };
