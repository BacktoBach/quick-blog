/* eslint-disable react-refresh/only-export-components */
import { createContext, useContext, useEffect, useMemo, useReducer } from 'react';
import { loginUser, registerUser } from '../api/mockApi';

const AuthContext = createContext(null);

const TOKEN_KEY = 'token';
const USER_KEY = 'user';

function readStoredUser() {
  try {
    return JSON.parse(localStorage.getItem(USER_KEY) || 'null');
  } catch {
    localStorage.removeItem(USER_KEY);
    return null;
  }
}

const initialState = {
  token: localStorage.getItem(TOKEN_KEY),
  user: readStoredUser(),
};

function reducer(state, action) {
  switch (action.type) {
    case 'LOGIN':
      return { token: action.payload.token, user: action.payload.user };
    case 'LOGOUT':
      return { token: null, user: null };
    case 'SYNC':
      return action.payload;
    default:
      return state;
  }
}

function persistAuth({ token, user }) {
  if (token && user) {
    localStorage.setItem(TOKEN_KEY, token);
    localStorage.setItem(USER_KEY, JSON.stringify(user));
    return;
  }

  localStorage.removeItem(TOKEN_KEY);
  localStorage.removeItem(USER_KEY);
}

export function AuthProvider({ children }) {
  const [state, dispatch] = useReducer(reducer, initialState);

  useEffect(() => {
    const handleStorage = (event) => {
      if (![TOKEN_KEY, USER_KEY].includes(event.key)) return;
      dispatch({
        type: 'SYNC',
        payload: {
          token: localStorage.getItem(TOKEN_KEY),
          user: readStoredUser(),
        },
      });
    };

    window.addEventListener('storage', handleStorage);
    return () => window.removeEventListener('storage', handleStorage);
  }, []);

  const value = useMemo(
    () => ({
      ...state,
      isAuthenticated: Boolean(state.token && state.user),
      isAdmin: state.user?.role === 'admin',
      async login(credentials) {
        const payload = await loginUser(credentials);
        persistAuth(payload);
        dispatch({ type: 'LOGIN', payload });
        return payload;
      },
      async register(payload) {
        const auth = await registerUser(payload);
        persistAuth(auth);
        dispatch({ type: 'LOGIN', payload: auth });
        return auth;
      },
      logout() {
        persistAuth({ token: null, user: null });
        dispatch({ type: 'LOGOUT' });
      },
    }),
    [state],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used inside AuthProvider');
  return context;
}
