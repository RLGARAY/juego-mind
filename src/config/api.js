import { collection, doc, getDoc, getDocs, setDoc, updateDoc } from 'firebase/firestore';
import { db } from './fire';
import { getStorage } from 'firebase/storage';
import { usersCollection, roomCollection } from './global';

export const storage = getStorage();

export async function saveUser(user, data) {
  try {
    const usersRef = collection(db, usersCollection);
    await setDoc(doc(usersRef, user), data);
  } catch (e) {
    console.error('Error adding document: ', e);
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

export async function removeAnon(uid) {
  const docRef = doc(db, usersCollection, uid);
  const docSnap = await getDoc(docRef);
  return docSnap.data();
}

export async function apiCreateRoom(uid, player1) {
  const roomRef = collection(db, roomCollection);

  try {
    const roomDocs = await getDocs(roomRef);
    let roomDoc = null;
    roomDocs.forEach((doc) => {
      if (doc.data().id === uid) {
        roomDoc = doc;
      }
    });

    if (roomDoc) {
      // La sala ya existe, actualizar sala
      await updateDoc(doc(roomRef, roomDoc.id), {
        id: uid,
        player1: player1,
        player2: '',
        messages: [],
      });
    } else {
      // La sala no existe, crear sala
      await setDoc(doc(roomRef), {
        id: uid,
        player1: player1,
        messages: [],
      });
    }
  } catch (error) {
    throw error;
  }
}

export async function apiJoinRoom(uid, player2) {
  const roomRef = collection(db, roomCollection);

  try {
    const roomDocs = await getDocs(roomRef);
    let roomDoc = null;
    roomDocs.forEach((doc) => {
      if (doc.data().id === uid) {
        roomDoc = doc;
      }
    });

    if (roomDoc) {
      const roomData = roomDoc.data();

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
