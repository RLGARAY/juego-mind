import React, { createContext, useReducer, useContext, useEffect, useCallback } from 'react';

import { useRoomContext } from '../Context/RoomContext';
import { dealCards } from '../Features/HandGenerator';

import { db } from '../config/fire';
import { doc, onSnapshot } from 'firebase/firestore';
import { updateGame, createGame, updateActualGame } from '../config/api';
import { lives, jokers, max_round } from '../config/global';
const DispatchContext = createContext();
const StateContext = createContext();

const initialState = {
  gameId: '',
  gameStatus: false,
  roundNumber: 0,
  player1Cards: [],
  player2Cards: [],
  playedCardsInRound: [],
  lives: lives,
  jokers: jokers,
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
        lives: lives,
        jokers: jokers,
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

    case 'JOKERS_CHANGE': {
      return {
        ...state,
        jokers: action.payload.jokers,
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

/**
 * Hook to access and manage the state of the Game Context
 */
const useGameContext = () => {
  const gameState = useContext(StateContext);
  const gameDispatch = useContext(DispatchContext);

  const { roomState } = useRoomContext();

  // PRIVATE METHODS  //////////////////////////

  /** Callback to send DB that is a game loss */
  const lossGame = useCallback(() => {
    updateGame(roomState.roomId, gameState.gameId, { gameStatus: 'Derrota', lives: 0 });
  }, [roomState.roomId, gameState.gameId]);

  /** Callback to send DB that is a game win */
  const winGame = useCallback(() => {
    updateGame(roomState.roomId, gameState.gameId, { gameStatus: 'Victoria' });
  }, [roomState.roomId, gameState.gameId]);

  // EFFECTS  //////////////////////////

  /** Effect to start the when the actual game changes*/
  useEffect(() => {
    if (roomState.actualGame) {
      gameDispatch({
        type: 'START_GAME',
        payload: { gameId: roomState.actualGame },
      });
    }
  }, [roomState.actualGame, gameDispatch]);

  /** Effect to listen the changes in the actual game and control the action*/
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

          if (newData.jokers !== gameState.jokers) {
            changedFields.push('jokers');
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
            // Actions for the changed fields
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

                case 'jokers':
                  gameDispatch({
                    type: 'JOKERS_CHANGE',
                    payload: {
                      jokers: newData.jokers,
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
        //stop listen when component dismounts
        unsubscribe();
      };
    }
  }, [gameState.gameId]);

  /** Effect to control game loss */
  useEffect(() => {
    if (roomState.host && gameState.lives === 0) {
      lossGame();
    }
  }, [lossGame, gameState.lives, roomState.host]);

  /** Effect to control game win */
  useEffect(() => {
    if (
      roomState.host &&
      gameState.roundNumber === max_round &&
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

  /**
   * Method to start the game (for the host)
   */
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
        lives: lives,
        jokers: jokers,
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

  /**
   * Method to start the next round (for the host)
   * It also uses dealCard that
   */
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

  /**
   * Method to play a Card and update BE
   * It also controls if the card played is higher or lower to update the lives.
   */
  const playCard = async (card) => {
    const { player1Cards, player2Cards, playedCardsInRound, lives, gameId } = gameState;
    const host = roomState.host;

    const localHand = host
      ? player1Cards.filter((c) => c !== card)
      : player2Cards.filter((c) => c !== card);

    const newPlayedCardsInRound = [...playedCardsInRound, card];

    let newLives = lives;

    if (newPlayedCardsInRound.length > 1) {
      const lastPlayedCard = newPlayedCardsInRound[newPlayedCardsInRound.length - 1];

      for (let i = 0; i < newPlayedCardsInRound.length - 1; i++) {
        const prevCard = newPlayedCardsInRound[i];
        if (lastPlayedCard.id <= prevCard.id) {
          newLives -= 1;
          break;
        }
      }
    }

    const payload = {
      playedCardsInRound: newPlayedCardsInRound,
      lives: newLives,
    };

    if (host) {
      payload.player1Cards = localHand;
    } else {
      payload.player2Cards = localHand;
    }

    await updateGame(roomState.roomId, gameId, payload);
  };

  /**
   * Method to use the joker
   * It finds the 2 lowest card in both player hands and plays them
   */
  const playJoker = async () => {
    const { player1Cards, player2Cards, playedCardsInRound, gameId, jokers } = gameState;

    const allCards = [...player1Cards, ...player2Cards];
    const sortedCards = allCards.sort((a, b) => a.id - b.id);

    if (sortedCards.length >= 2) {
      const card1 = sortedCards[0];
      const card2 = sortedCards[1];

      // Filter both hand cards to remove the 2 lowest cards
      const newPlayer1Cards = player1Cards.filter((card) => card !== card1 && card !== card2);
      const newPlayer2Cards = player2Cards.filter((card) => card !== card1 && card !== card2);

      // Play the cards
      const newPlayedCardsInRound = [...playedCardsInRound, card1, card2];

      const payload = {
        player1Cards: newPlayer1Cards,
        player2Cards: newPlayer2Cards,
        playedCardsInRound: newPlayedCardsInRound,
        jokers: jokers - 1,
      };

      await updateGame(roomState.roomId, gameId, payload);
    }
  };
  return {
    gameState,
    startGame,
    nextRound,
    playCard,
    playJoker,
  };
};

export { GameProvider, useGameContext };
