import { collection, doc, getDoc, setDoc } from 'firebase/firestore';
import { db } from './fire';
import { getStorage } from 'firebase/storage';

const usersCollection = 'users';

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
