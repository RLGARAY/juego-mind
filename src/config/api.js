import { collection, doc, getDoc, getDocs, setDoc, addDoc, updateDoc } from 'firebase/firestore';
import { db } from './fire';
import { usersCollection, roomCollection, gamesCollection } from './global';

// USERS  //////////////////////////

export async function saveUser(user, data) {
  try {
    const usersRef = collection(db, usersCollection);
    await setDoc(doc(usersRef, user), data);
  } catch (error) {
    throw error;
  }
}

export async function userExists(uid) {
  const docRef = doc(db, usersCollection, uid);
  const docSnap = await getDoc(docRef);

  return docSnap.exists();
}

export async function getUserData(uid) {
  const docRef = doc(db, usersCollection, uid);
  const docSnap = await getDoc(docRef);
  return docSnap.data();
}

// ROOMS  //////////////////////////

export async function apiCreateRoom(roomNumber, player1) {
  const roomRef = collection(db, roomCollection);

  try {
    const roomDocs = await getDocs(roomRef);
    let roomDoc = null;
    roomDocs.forEach((doc) => {
      if (doc.data().roomNumber === roomNumber) {
        roomDoc = doc;
      }
    });
    if (roomDoc) {
      // La sala ya existe, actualizar sala
      await updateDoc(doc(roomRef, roomDoc.id), {
        roomNumber: roomNumber,
        player1: player1,
        player2: '',
        messages: [],
        actualGame: '',
      });
      return { roomId: roomDoc.id };
    } else {
      // La sala no existe, crear sala
      const docRef = await addDoc(roomRef, {
        roomNumber: roomNumber,
        player1: player1,
        messages: [],
        actualGame: '',
      });
      return { roomId: docRef.id };
    }
  } catch (error) {
    throw error;
  }
}

export async function apiJoinRoom(roomNumber, player2) {
  const roomRef = collection(db, roomCollection);

  try {
    const roomDocs = await getDocs(roomRef);
    let roomDoc = null;
    roomDocs.forEach((doc) => {
      if (doc.data().roomNumber === roomNumber) {
        roomDoc = doc;
      }
    });

    if (roomDoc) {
      const roomData = { ...roomDoc.data(), roomId: roomDoc.id };

      if (!roomData.player1) {
        // La sala existe pero no tiene player1
        throw new Error('La sala no esta creada.');
      }

      if (!roomData.player2) {
        // La sala existe y no tiene player2, unirse a la sala
        await updateDoc(doc(roomRef, roomDoc.id), {
          player2: player2,
        });
        return roomData;
      } else {
        // La sala ya tiene player2
        throw new Error('La sala ya tiene dos jugadores.');
      }
    } else {
      // La sala no existe
      throw new Error('La sala no esta creada.');
    }
  } catch (error) {
    throw error;
  }
}
export async function apiCloseRoom(roomId) {
  const roomRef = collection(db, roomCollection);

  try {
    await updateDoc(doc(roomRef, roomId), {
      player1: '',
      player2: '',
      messages: [],
      actualGame: '',
    });
  } catch (error) {
    throw error;
  }
}
export async function apiLeaveRoom(roomId) {
  const roomRef = collection(db, roomCollection);

  try {
    await updateDoc(doc(roomRef, roomId), {
      player2: '',
    });
  } catch (error) {
    throw error;
  }
}

export async function updateActualGame(roomId, gameId) {
  const roomRef = collection(db, roomCollection);

  try {
    await updateDoc(doc(roomRef, roomId), {
      actualGame: gameId,
    });
  } catch (error) {
    throw error;
  }
}

export async function apiSendMessage(roomId, messages) {
  const roomRef = collection(db, roomCollection);

  try {
    await updateDoc(doc(roomRef, roomId), {
      messages: messages,
    });
  } catch (error) {
    throw error;
  }
}

// GAME  ///////////////////////////

export async function createGame(roomId, data) {
  const gamesRef = collection(db, roomCollection, roomId, gamesCollection);
  try {
    const gameRef = await addDoc(gamesRef, data);
    return { gameId: gameRef.id };
  } catch (error) {
    throw error;
  }
}

export async function updateGame(roomId, gameId, data) {
  const gamesRef = collection(db, roomCollection, roomId, gamesCollection);
  try {
    await updateDoc(doc(gamesRef, gameId), data);
  } catch (error) {
    throw error;
  }
}
