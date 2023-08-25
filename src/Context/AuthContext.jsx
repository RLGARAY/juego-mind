// import React, { useContext } from 'react';
// import firebase from 'firebase/app';
// import { auth } from '../config/fire';
// import {
//   createUserWithEmailAndPassword,
//   signInWithEmailAndPassword,
//   signOut,
//   signInWithCustomToken,
// } from 'firebase/auth';

// // Crea el contexto de autenticación
// const DispatchContext = React.createContext();
// const StateContext = React.createContext();
// // The initial state tries to fill the token and
// // user profile data from the local or session storage.
// // This way we make the login state persistent.
// const initialState = {
//   token: sessionStorage.getItem('auth_token') || localStorage.getItem('auth_token') || null,
//   remember: null,
//   email: null,
//   username: null,
//   error: null,
// };

// function authReducer(state, action) {
//   switch (action.type) {
//     case 'USER_LOGIN_SUCCESS': {
//       return {
//         ...state,
//         ...action.payload,
//       };
//     }

//     case 'USER_LOGIN_ERROR': {
//       return {
//         ...state,
//         error: action.payload.error,
//       };
//     }

//     case 'LOCAL_TOKEN_RECOVER': {
//       return {
//         ...state,
//         token: action.payload.token,
//       };
//     }

//     case 'USER_NOT_LOGGED': {
//       return {
//         ...state,
//         token: null,
//       };
//     }

//     default: {
//       return state;
//     }
//   }
// }
// /**
//  * Provides all children with the state and the dispatch of Auth Provider
//  * @param { node } children
//  * @returns node
//  */
// export default function AuthProvider({ children }) {
//   const [state, dispatch] = React.useReducer(authReducer, initialState);

//   return (
//     <DispatchContext.Provider value={dispatch}>
//       <StateContext.Provider value={state}>{children}</StateContext.Provider>
//     </DispatchContext.Provider>
//   );
// }

// /**
//  * Hook to access and manage the state of the Cost Models Context
//  */
// const useAuthContext = () => {
//   const authState = useContext(StateContext);
//   const authDispatch = useContext(DispatchContext);
//   const db = firebase.firestore();

//   // EFFECTS  //////////////////////////

//   // PUBLIC METHODS   //////////////////////////

//   const createUser = async (email, password, username) => {
//     createUserWithEmailAndPassword(auth, email, password)
//       .then((userCredential) => {
//         const user = userCredential.user;
//         const accessToken = user.accessToken;

//         authDispatch({
//           type: 'USER_LOGIN_SUCCESS',
//           payload: {
//             token: accessToken,
//             username: username,
//             email: email,
//             error: null,
//           },
//         });

//         // Guarda información adicional en Firestore
//         const creationDate = new Date();
//         const userData = {
//           username: username,
//           creationDate: creationDate,
//         };
//         return db.collection('users').doc(user.uid).set(userData);
//       })
//       .then(() => {
//         // La información adicional se guardó correctamente en Firestore
//         console.log('Usuario creado y datos guardados en Firestore');
//       })
//       .catch((error) => {
//         // Ocurrió un error durante la creación del usuario o el guardado en Firestore
//         console.error('Error al crear usuario y guardar en Firestore:', error);
//         authDispatch({
//           type: 'USER_LOGIN_ERROR',
//           payload: { error: error.message },
//         });
//       });
//   };

//   // Función para iniciar sesión con correo electrónico y contraseña
//   const login = async (email, password, remember) => {
//     signInWithEmailAndPassword(auth, email, password)
//       .then((userCredential) => {
//         const user = userCredential.user;
//         const accessToken = user.accessToken;

//         authDispatch({
//           type: 'USER_LOGIN_SUCCESS',
//           payload: {
//             token: accessToken,
//             email: email,
//             error: null,
//           },
//         });

//         // if (remember) {
//         //   localStorage.setItem('auth_token', accessToken);
//         // }

//         // Get User Data from BE
//         return db.collection('users').doc(user.uid).get();
//       })
//       .then((userDB) => {
//         const userData = userDB.data();

//         authDispatch({
//           type: 'USER_LOGIN_SUCCESS',
//           payload: {
//             username: userData.username,
//             error: null,
//           },
//         });
//       })
//       .catch((error) => {
//         const errorCode = error.code;
//         const errorMessage = error.message;
//         authDispatch({
//           type: 'USER_LOGIN_ERROR',
//           payload: { error: errorMessage },
//         });
//       });
//   };

//   // Función para cerrar sesión
//   const logout = async () => {
//     signOut(auth)
//       .then(() => {
//         // Sign-out successful.
//         authDispatch({
//           type: 'USER_NOT_LOGGED',
//         });
//       })
//       .catch((error) => {
//         // An error happened.
//       });
//   };

//   return {
//     createUser,
//     login,
//     logout,
//     authState,
//   };
// };

// export { AuthProvider, useAuthContext };
