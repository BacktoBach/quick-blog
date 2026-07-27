/* eslint-disable react-refresh/only-export-components */
import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useReducer,
} from "react";
import {
  getCurrentUser,
  loginUser,
  registerUser,
} from "../services/authService";

const AuthContext = createContext(null);

const TOKEN_KEY = "accessToken";
const USER_KEY = "user";

function readStoredUser() {
  try {
    return JSON.parse(localStorage.getItem(USER_KEY) || "null");
  } catch {
    localStorage.removeItem(USER_KEY);
    return null;
  }
}

const initialState = {
  token: localStorage.getItem(TOKEN_KEY),
  user: readStoredUser(),
  isInitializing: Boolean(localStorage.getItem(TOKEN_KEY)),
};

function reducer(state, action) {
  switch (action.type) {
    case "LOGIN":
      return {
        token: action.payload.token,
        user: action.payload.user,
        isInitializing: false,
      };
    case "LOGOUT":
      return { token: null, user: null, isInitializing: false };
    case "SYNC":
      return action.payload;
    case "UPDATE_USER":
      return { ...state, user: action.payload, isInitializing: false };
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
    const syncAuth = () => {
      const token = localStorage.getItem(TOKEN_KEY);
      dispatch({
        type: "SYNC",
        payload: {
          token,
          user: readStoredUser(),
          isInitializing: false,
        },
      });
    };

    const handleStorage = (event) => {
      if ([TOKEN_KEY, USER_KEY].includes(event.key)) syncAuth();
    };

    window.addEventListener("storage", handleStorage);
    window.addEventListener("auth:logout", syncAuth);
    return () => {
      window.removeEventListener("storage", handleStorage);
      window.removeEventListener("auth:logout", syncAuth);
    };
  }, []);

  useEffect(() => {
    let mounted = true;
    const token = localStorage.getItem(TOKEN_KEY);

    if (!token) {
      dispatch({ type: "LOGOUT" });
      return undefined;
    }

    getCurrentUser()
      .then((user) => {
        if (!mounted) return;
        localStorage.setItem(USER_KEY, JSON.stringify(user));
        dispatch({ type: "UPDATE_USER", payload: user });
      })
      .catch(() => {
        persistAuth({ token: null, user: null });
        dispatch({ type: "LOGOUT" });
      });

    return () => {
      mounted = false;
    };
  }, []);

  const value = useMemo(
    () => ({
      ...state,
      isAuthenticated: Boolean(
        !state.isInitializing && state.token && state.user,
      ),
      isAdmin: !state.isInitializing && state.user?.role === "admin",
      async login(credentials) {
        const payload = await loginUser(credentials);
        if (!payload.token || !payload.user) {
          throw new Error("Login response is missing token or user.");
        }
        persistAuth(payload);
        dispatch({ type: "LOGIN", payload });
        return payload;
      },
      async register(payload) {
        const auth = await registerUser(payload);
        if (!auth.token || !auth.user) {
          throw new Error("Register response is missing token or user.");
        }
        persistAuth(auth);
        dispatch({ type: "LOGIN", payload: auth });
        return auth;
      },
      logout() {
        persistAuth({ token: null, user: null });
        dispatch({ type: "LOGOUT" });
      },
    }),
    [state],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used inside AuthProvider");
  return context;
}
