import React, { useContext, useEffect } from 'react';

import { auth } from '../config/fire';
import { saveUser, userExists, getUserData } from '../config/api';

import {
  signInAnonymously,
  onAuthStateChanged,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
} from 'firebase/auth';

const DispatchContext = React.createContext();
const StateContext = React.createContext();

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
 * Hook to access and manage the state of the Auth Context
 */
const useAuthContext = () => {
  const authState = useContext(StateContext);
  const authDispatch = useContext(DispatchContext);

  // EFFECTS  //////////////////////////

  /**
   * Effect to update when there is a change in the auth state
   * For the logged user it gets the data from DB
   */
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        const uid = user.uid;
        const exists = await userExists(user.uid);

        if (exists) {
          const loggedUser = await getUserData(uid);
          authDispatch({
            type: 'USER_LOGIN_SUCCESS',
            payload: {
              token: uid,
              username: loggedUser.username,
              email: loggedUser.email,
              error: null,
            },
          });
        } else {
          // save anon to db
          // saveUser(uid, { email: authState.email, username: authState.username });
        }
      } else {
        logout();
      }
    });

    return () => {
      //stop listen when component dismounts
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
        authDispatch({
          type: 'USER_LOGIN_ERROR',
          payload: { error: error.message },
        });
      });
  };

  /** Method to sing in with email and password */
  const createUser = async (email, password, username) => {
    createUserWithEmailAndPassword(auth, email, password)
      .then((userCredential) => {
        const user = userCredential.user;
        saveUser(user.uid, { email: email, username: username });
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
        authDispatch({
          type: 'USER_LOGIN_ERROR',
          payload: { error: error.message },
        });
      });
  };

  /** Method to log in with email and password */
  const login = async (email, password) => {
    signInWithEmailAndPassword(auth, email, password)
      .then((userCredential) => {
        const user = userCredential.user;

        authDispatch({
          type: 'USER_LOGIN_SUCCESS',
          payload: {
            token: user.uid,
            email: email,
            error: null,
          },
        });
      })
      .catch((error) => {
        authDispatch({
          type: 'USER_LOGIN_ERROR',
          payload: { error: error.message },
        });
      });
  };

  /** Method to log out */
  const logout = async () => {
    signOut(auth)
      .then(() => {
        // Sign-out successful.
        authDispatch({
          type: 'USER_NOT_LOGGED',
        });
      })
      .catch((error) => {});
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
