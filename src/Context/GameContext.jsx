import React, { createContext, useReducer, useContext, useEffect, useCallback } from 'react';

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
        roundNumber: 0,
        player1Cards: [],
        player2Cards: [],
        playedCardsInRound: [],
        lives: 3,
        jokers: 3,
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
        roundNumber: action.payload.roundNumber,
      };
    }
    case 'LIVES_CHANGE': {
      return {
        ...state,
        lives: action.payload.lives,
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

  const lossGame = useCallback(() => {
    updateGame(roomState.roomId, gameState.gameId, { gameStatus: 'Derrota', lives: 0 });
  }, [roomState.roomId, gameState.gameId]);

  const winGame = useCallback(() => {
    updateGame(roomState.roomId, gameState.gameId, { gameStatus: 'Victoria' });
  }, [roomState.roomId, gameState.gameId]);
  // EFFECTS  //////////////////////////

  /** Effect to update when there is a change in the db in the game data*/
  useEffect(() => {
    if (roomState.actualGame) {
      gameDispatch({
        type: 'START_GAME',
        payload: { gameId: roomState.actualGame },
      });
    }
  }, [roomState.actualGame, gameDispatch]);

  useEffect(() => {
    if (gameState.gameId) {
      const unsubscribe = onSnapshot(
        doc(db, 'rooms', roomState.roomId, 'games', gameState.gameId),
        (doc) => {
          const newData = doc.data();

          const changedFields = [];

          if (newData.gameStatus !== gameState.gameStatus) {
            changedFields.push('gameStatus');
          }

          if (newData.roundNumber !== gameState.roundNumber) {
            changedFields.push('roundNumber');
          }

          if (newData.lives !== gameState.lives) {
            changedFields.push('lives');
          }

          if (newData.player1Cards !== gameState.player1Cards) {
            changedFields.push('player1Cards');
          }

          if (newData.player2Cards !== gameState.player2Cards) {
            changedFields.push('player2Cards');
          }

          if (newData.playedCardsInRound !== gameState.playedCardsInRound) {
            changedFields.push('playedCardsInRound');
          }

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

                case 'roundNumber':
                  gameDispatch({
                    type: 'NEXT_ROUND',
                    payload: {
                      roundNumber: newData.roundNumber,
                    },
                  });
                  break;

                case 'lives':
                  gameDispatch({
                    type: 'LIVES_CHANGE',
                    payload: {
                      lives: newData.lives,
                    },
                  });
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
                  gameDispatch({
                    type: 'PLAY_CARD',
                    payload: {
                      playedCardsInRound: newData.playedCardsInRound,
                    },
                  });

                  break;

                default:
                  break;
              }
            });
          }
        },
        (error) => {
          console.error(error);
        },
      );

      return () => {
        // Limpiar la suscripción cuando el componente se desmonta
        unsubscribe();
      };
    }
  }, [gameState.gameId]);

  useEffect(() => {
    if (roomState.host && gameState.lives === 0) {
      lossGame();
    }
  }, [lossGame, gameState.lives, roomState.host]);

  useEffect(() => {
    if (
      roomState.host &&
      gameState.roundNumber === 3 &&
      gameState.player1Cards.length === 0 &&
      gameState.player2Cards.length === 0
    ) {
      winGame();
    }
  }, [
    winGame,
    gameState.roundNumber,
    roomState.host,
    gameState.player1Cards,
    gameState.player2Cards,
  ]);

  // PUBLIC METHODS   //////////////////////////

  const startGame = async () => {
    try {
      const payload = {
        player1: roomState.player1,
        player2: roomState.player2,
        gameStatus: 'Active',
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
      console.error(error);
    }
  };

  const nextRound = async () => {
    const hands = dealCards(2, gameState.roundNumber + 1);
    try {
      const payload = {
        roundNumber: gameState.roundNumber + 1,
        player1Cards: hands[0],
        player2Cards: hands[1],
        playedCardsInRound: [],
      };

      await updateGame(roomState.roomId, gameState.gameId, payload);
    } catch (error) {
      console.error(error);
    }
  };

  const playCard = async (card) => {
    const host = roomState.host;

    const localHand = host
      ? gameState.player1Cards.filter((c) => c !== card)
      : gameState.player2Cards.filter((c) => c !== card);

    const playedCardsInRound = [...gameState.playedCardsInRound, card];

    let lives = gameState.lives;

    if (playedCardsInRound.length > 1) {
      const lastPlayedCard = playedCardsInRound[playedCardsInRound.length - 1];
      const prevPlayedCard = playedCardsInRound[playedCardsInRound.length - 2];

      if (lastPlayedCard.id <= prevPlayedCard.id) {
        lives -= 1;
      }
    }

    const payload = {
      playedCardsInRound: playedCardsInRound,
      lives: lives,
    };

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
