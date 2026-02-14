/**
 * Authentication Context
 * Global state for user authentication
 */

import React, {
  createContext,
  useContext,
  useReducer,
  useEffect,
  type ReactNode,
} from "react";
import type { User, AuthState, LoginCredentials, AuthTokens } from "@/types";
import { authService } from "@/services/auth";

// ============================================================================
// Context Types
// ============================================================================

interface AuthContextType extends AuthState {
  login: (credentials: LoginCredentials) => Promise<void>;
  logout: () => Promise<void>;
  checkAuth: () => Promise<void>;
}

type AuthAction =
  | { type: "AUTH_LOADING" }
  | { type: "AUTH_SUCCESS"; payload: { user: User; tokens: AuthTokens } }
  | { type: "AUTH_FAILURE" }
  | { type: "LOGOUT" };

// ============================================================================
// Initial State & Reducer
// ============================================================================

const initialState: AuthState = {
  user: null,
  tokens: null,
  isAuthenticated: false,
  isLoading: true,
};

function authReducer(state: AuthState, action: AuthAction): AuthState {
  switch (action.type) {
    case "AUTH_LOADING":
      return { ...state, isLoading: true };
    case "AUTH_SUCCESS":
      return {
        ...state,
        user: action.payload.user,
        tokens: action.payload.tokens,
        isAuthenticated: true,
        isLoading: false,
      };
    case "AUTH_FAILURE":
      return {
        ...state,
        user: null,
        tokens: null,
        isAuthenticated: false,
        isLoading: false,
      };
    case "LOGOUT":
      return {
        ...state,
        user: null,
        tokens: null,
        isAuthenticated: false,
        isLoading: false,
      };
    default:
      return state;
  }
}

// ============================================================================
// Context & Provider
// ============================================================================

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

export function AuthProvider({
  children,
}: AuthProviderProps): React.JSX.Element {
  const [state, dispatch] = useReducer(authReducer, initialState);

  // Check for existing authentication on mount
  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async (): Promise<void> => {
    try {
      dispatch({ type: "AUTH_LOADING" });

      const storedAuth = await authService.getStoredAuth();

      if (storedAuth) {
        dispatch({
          type: "AUTH_SUCCESS",
          payload: storedAuth,
        });
      } else {
        dispatch({ type: "AUTH_FAILURE" });
      }
    } catch {
      dispatch({ type: "AUTH_FAILURE" });
    }
  };

  const login = async (credentials: LoginCredentials): Promise<void> => {
    dispatch({ type: "AUTH_LOADING" });

    try {
      const result = await authService.login(credentials);

      dispatch({
        type: "AUTH_SUCCESS",
        payload: result,
      });
    } catch (error) {
      dispatch({ type: "AUTH_FAILURE" });
      throw error; // Re-throw for UI error handling
    }
  };

  const logout = async (): Promise<void> => {
    await authService.logout();
    dispatch({ type: "LOGOUT" });
  };

  const value: AuthContextType = {
    ...state,
    login,
    logout,
    checkAuth,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

// ============================================================================
// Hook
// ============================================================================

export function useAuth(): AuthContextType {
  const context = useContext(AuthContext);

  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }

  return context;
}

export default AuthContext;
