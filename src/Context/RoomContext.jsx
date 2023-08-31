import React, { createContext, useReducer, useContext, useEffect } from 'react';

import { db } from '../config/fire';
import { doc, onSnapshot } from 'firebase/firestore';
import {
  apiCloseRoom,
  apiCreateRoom,
  apiJoinRoom,
  apiLeaveRoom,
  apiSendMessage,
} from '../config/api';

const DispatchContext = createContext();
const StateContext = createContext();

const initialState = {
  roomNumber: '',
  roomId: '',
  player1: '',
  player2: '',
  host: false,
  messages: [],
  actualGame: '',
};

function roomReducer(state, action) {
  switch (action.type) {
    case 'SET_ROOM': {
      return {
        ...state,
        roomNumber: action.payload.roomNumber,
        roomId: action.payload.roomId,
        player1: action.payload.player1,
        player2: action.payload.player2,
        host: action.payload.host,
        messages: action.payload.messages,
        actualGame: action.payload.actualGame,
      };
    }

    default: {
      return state;
    }
  }
}

/**
//  * Provides all children with the state and the dispatch of Room Provider
//  * @param { node } children
//  * @returns node
//  */
export default function RoomProvider({ children }) {
  const [state, dispatch] = useReducer(roomReducer, initialState);

  return (
    <DispatchContext.Provider value={dispatch}>
      <StateContext.Provider value={state}>{children}</StateContext.Provider>
    </DispatchContext.Provider>
  );
}
const useRoomContext = () => {
  const roomState = useContext(StateContext);
  const roomDispatch = useContext(DispatchContext);

  // EFFECTS  //////////////////////////

  /** Effect to update when there is a change in the db in the room data*/
  useEffect(() => {
    if (roomState.roomId) {
      const unsub = onSnapshot(doc(db, 'rooms', roomState.roomId), (doc) => {
        roomDispatch({
          type: 'SET_ROOM',
          payload: {
            roomId: roomState.roomId,
            roomNumber: doc.data().roomNumber,
            player1: doc.data().player1,
            player2: doc.data().player2,
            host: roomState.host,
            messages: doc.data().messages,
            actualGame: doc.data().actualGame,
          },
        });
      });

      return unsub;
    }
  }, [roomState.roomId]);

  // PUBLIC METHODS   //////////////////////////

  const createRoom = async (roomNumber, player1) => {
    try {
      const roomData = await apiCreateRoom(roomNumber, player1);
      roomDispatch({
        type: 'SET_ROOM',
        payload: {
          roomNumber: roomNumber,
          roomId: roomData.roomId,
          player1: player1,
          host: true,
          messages: [],
          actualGame: '',
        },
      });
    } catch (error) {
      console.error('Error desde el método:', error);
    }
  };

  const joinRoom = async (roomNumber, player2) => {
    try {
      const roomData = await apiJoinRoom(roomNumber, player2);
      roomDispatch({
        type: 'SET_ROOM',
        payload: {
          roomNumber: roomNumber,
          roomId: roomData.roomId,
          player1: roomData.player1,
          player2: player2,
          host: false,
          messages: roomData.messages,
          actualGame: roomData.actualGame,
        },
      });
    } catch (error) {
      console.error('Error al unirse a la sala:', error.message);
      throw error;
    }
  };

  const leaveRoom = async () => {
    try {
      if (roomState.host) {
        await apiCloseRoom(roomState.roomId);
      } else {
        await apiLeaveRoom(roomState.roomId);
        roomDispatch({
          type: 'SET_ROOM',
          payload: {
            roomNumber: '',
            roomId: '',
            player1: '',
            player2: '',
            host: false,
            messages: [],
            actualGame: '',
          },
        });
      }
    } catch (error) {
      console.error('Error al salir a la sala:', error.message);
      throw error;
    }
  };

  const sendMessage = async (newMessage) => {
    try {
      const localMessages = [...roomState.messages, newMessage];
      await apiSendMessage(roomState.roomId, localMessages);
    } catch (error) {
      throw error;
    }
  };
  return {
    roomState,
    createRoom,
    joinRoom,
    leaveRoom,
    sendMessage,
  };
};

export { RoomProvider, useRoomContext };
