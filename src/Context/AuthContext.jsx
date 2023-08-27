import React, { useContext, useEffect } from 'react';
import { auth, db } from '../config/fire';
import {
  signInAnonymously,
  onAuthStateChanged,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
} from 'firebase/auth';

// Crea el contexto de autenticación
const DispatchContext = React.createContext();
const StateContext = React.createContext();
// The initial state tries to fill the token and
// user profile data from the local or session storage.
// This way we make the login state persistent.
const initialState = {
  token: null,
  email: null,
  username: null,
  error: null,
};

function authReducer(state, action) {
  switch (action.type) {
    case 'USER_LOGIN_SUCCESS': {
      return {
        ...state,
        ...action.payload,
      };
    }

    case 'USER_LOGIN_ERROR': {
      return {
        ...state,
        error: action.payload.error,
      };
    }

    case 'LOCAL_TOKEN_RECOVER': {
      return {
        ...state,
        token: action.payload.token,
      };
    }

    case 'USER_NOT_LOGGED': {
      return {
        ...state,
        token: null,
        email: null,
        username: null,
        error: null,
      };
    }

    default: {
      return state;
    }
  }
}
/**
 * Provides all children with the state and the dispatch of Auth Provider
 * @param { node } children
 * @returns node
 */
export default function AuthProvider({ children }) {
  const [state, dispatch] = React.useReducer(authReducer, initialState);

  return (
    <DispatchContext.Provider value={dispatch}>
      <StateContext.Provider value={state}>{children}</StateContext.Provider>
    </DispatchContext.Provider>
  );
}

/**
 * Hook to access and manage the state of the Cost Models Context
 */
const useAuthContext = () => {
  const authState = useContext(StateContext);
  const authDispatch = useContext(DispatchContext);

  // EFFECTS  //////////////////////////

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        // User is signed in, see docs for a list of available properties
        // https://firebase.google.com/docs/reference/js/auth.user
        const uid = user.uid;
        console.log(uid);
        // ...
      } else {
        authDispatch({
          type: 'USER_NOT_LOGGED',
        });
      }
    });

    return () => {
      // Desuscribirse del listener al desmontar el componente
      unsubscribe();
    };
  }, []);

  // PUBLIC METHODS   //////////////////////////

  // Función para iniciar sesión anonimamente y guardar el username
  const loginAsGuest = async (username) => {
    signInAnonymously(auth)
      .then((userCredential) => {
        const user = userCredential.user;

        authDispatch({
          type: 'USER_LOGIN_SUCCESS',
          payload: {
            token: user.uid,
            username: username,
            error: null,
          },
        });
      })
      .catch((error) => {
        const errorCode = error.code;
        const errorMessage = error.message;
        authDispatch({
          type: 'USER_LOGIN_ERROR',
          payload: { error: errorMessage },
        });
      });
  };

  // Funcion para crear un usuario a partir de un email, contraseña y username
  const createUser = async (email, password, username) => {
    createUserWithEmailAndPassword(auth, email, password)
      .then((userCredential) => {
        const user = userCredential.user;

        authDispatch({
          type: 'USER_LOGIN_SUCCESS',
          payload: {
            token: user.uid,
            username: username,
            email: email,
            error: null,
          },
        });
      })
      .catch((error) => {
        // Ocurrió un error durante la creación del usuario
        authDispatch({
          type: 'USER_LOGIN_ERROR',
          payload: { error: error.message },
        });
      });
  };

  // Función para iniciar sesión con correo electrónico y contraseña
  const login = async (email, password) => {
    signInWithEmailAndPassword(auth, email, password)
      .then((userCredential) => {
        const user = userCredential.user;
        const accessToken = user.accessToken;

        authDispatch({
          type: 'USER_LOGIN_SUCCESS',
          payload: {
            token: accessToken,
            email: email,
            error: null,
          },
        });

        // Get User Data from BE
        return db.collection('users').doc(user.uid).get();
      })
      .then((userDB) => {
        const userData = userDB.data();

        authDispatch({
          type: 'USER_LOGIN_SUCCESS',
          payload: {
            username: userData.username,
            error: null,
          },
        });
      })
      .catch((error) => {
        const errorCode = error.code;
        const errorMessage = error.message;
        authDispatch({
          type: 'USER_LOGIN_ERROR',
          payload: { error: errorMessage },
        });
      });
  };

  // Función para cerrar sesión
  const logout = async () => {
    signOut(auth)
      .then(() => {
        // Sign-out successful.
        authDispatch({
          type: 'USER_NOT_LOGGED',
        });
      })
      .catch((error) => {
        // An error happened.
      });
  };

  return {
    loginAsGuest,
    createUser,
    login,
    logout,
    authState,
  };
};

export { AuthProvider, useAuthContext };
