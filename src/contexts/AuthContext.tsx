import React, { createContext, useContext, useReducer, useEffect, ReactNode } from 'react';
import { authService, User, LoginCredentials, AuthResponse } from '../services/AuthService';

// Authentication state interface
interface AuthState {
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  error: string | null;
  lastActivity: number;
  sessionTimeout: number;
}

// Authentication actions
type AuthAction =
  | { type: 'AUTH_START' }
  | { type: 'AUTH_SUCCESS'; payload: { user: User } }
  | { type: 'AUTH_FAILURE'; payload: { error: string } }
  | { type: 'AUTH_LOGOUT' }
  | { type: 'AUTH_REFRESH_SUCCESS'; payload: { user: User } }
  | { type: 'UPDATE_ACTIVITY' }
  | { type: 'CLEAR_ERROR' };

// Authentication context interface
interface AuthContextType {
  // State
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  error: string | null;
  
  // Actions
  login: (credentials: LoginCredentials) => Promise<AuthResponse>;
  logout: () => void;
  refreshAuth: () => Promise<boolean>;
  clearError: () => void;
  
  // Authorization checks
  hasPermission: (permission: string) => boolean;
  hasRole: (role: string) => boolean;
  canAccessMachine: (machineId: string) => boolean;
  
  // Emergency access
  requestEmergencyAccess: (code: string, reason: string) => Promise<boolean>;
}

// Initial state
const initialState: AuthState = {
  user: null,
  isLoading: false,
  isAuthenticated: false,
  error: null,
  lastActivity: Date.now(),
  sessionTimeout: 30 * 60 * 1000, // 30 minutes
};

// Authentication reducer
function authReducer(state: AuthState, action: AuthAction): AuthState {
  switch (action.type) {
    case 'AUTH_START':
      return {
        ...state,
        isLoading: true,
        error: null,
      };
      
    case 'AUTH_SUCCESS':
      return {
        ...state,
        isLoading: false,
        isAuthenticated: true,
        user: action.payload.user,
        error: null,
        lastActivity: Date.now(),
      };
      
    case 'AUTH_FAILURE':
      return {
        ...state,
        isLoading: false,
        isAuthenticated: false,
        user: null,
        error: action.payload.error,
      };
      
    case 'AUTH_LOGOUT':
      return {
        ...initialState,
        lastActivity: Date.now(),
      };
      
    case 'AUTH_REFRESH_SUCCESS':
      return {
        ...state,
        user: action.payload.user,
        isAuthenticated: true,
        lastActivity: Date.now(),
      };
      
    case 'UPDATE_ACTIVITY':
      return {
        ...state,
        lastActivity: Date.now(),
      };
      
    case 'CLEAR_ERROR':
      return {
        ...state,
        error: null,
      };
      
    default:
      return state;
  }
}

// Create context
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Authentication provider component
interface AuthProviderProps {
  children: ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps) {
  const [state, dispatch] = useReducer(authReducer, initialState);

  // Check for existing authentication on mount
  useEffect(() => {
    const initializeAuth = () => {
      if (authService.isAuthenticated()) {
        const user = authService.getCurrentUser();
        if (user) {
          dispatch({ type: 'AUTH_SUCCESS', payload: { user } });
        } else {
          // Token exists but user data is corrupted
          authService.logout();
          dispatch({ type: 'AUTH_LOGOUT' });
        }
      }
    };

    initializeAuth();
  }, []);

  // Session timeout management
  useEffect(() => {
    const checkSession = () => {
      if (state.isAuthenticated && state.user) {
        const timeSinceActivity = Date.now() - state.lastActivity;
        
        if (timeSinceActivity > state.sessionTimeout) {
          console.warn('Session expired due to inactivity');
          logout();
        }
      }
    };

    const interval = setInterval(checkSession, 60000); // Check every minute
    return () => clearInterval(interval);
  }, [state.isAuthenticated, state.lastActivity, state.sessionTimeout]);

  // Activity tracking
  useEffect(() => {
    const updateActivity = () => {
      if (state.isAuthenticated) {
        dispatch({ type: 'UPDATE_ACTIVITY' });
      }
    };

    // Track user activity
    const events = ['mousedown', 'keydown', 'scroll', 'touchstart'];
    events.forEach(event => {
      document.addEventListener(event, updateActivity, true);
    });

    return () => {
      events.forEach(event => {
        document.removeEventListener(event, updateActivity, true);
      });
    };
  }, [state.isAuthenticated]);

  // Automatic token refresh
  useEffect(() => {
    let refreshTimer: number;

    if (state.isAuthenticated) {
      // Refresh token 5 minutes before expiry
      refreshTimer = window.setTimeout(async () => {
        const success = await authService.refreshToken();
        if (success) {
          const user = authService.getCurrentUser();
          if (user) {
            dispatch({ type: 'AUTH_REFRESH_SUCCESS', payload: { user } });
          }
        } else {
          console.warn('Token refresh failed, logging out');
          logout();
        }
      }, 55 * 60 * 1000); // 55 minutes
    }

    return () => {
      if (refreshTimer) {
        clearTimeout(refreshTimer);
      }
    };
  }, [state.isAuthenticated]);

  // Authentication methods
  const login = async (credentials: LoginCredentials): Promise<AuthResponse> => {
    dispatch({ type: 'AUTH_START' });

    try {
      const response = await authService.login(credentials);
      
      if (response.success && response.user) {
        dispatch({ type: 'AUTH_SUCCESS', payload: { user: response.user } });
        
        // Log successful authentication
        console.info('User authenticated:', {
          username: response.user.username,
          role: response.user.role,
          timestamp: new Date().toISOString()
        });
      } else {
        dispatch({ type: 'AUTH_FAILURE', payload: { error: response.message || 'Login failed' } });
      }
      
      return response;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Authentication error';
      dispatch({ type: 'AUTH_FAILURE', payload: { error: errorMessage } });
      
      return {
        success: false,
        message: errorMessage
      };
    }
  };

  const logout = () => {
    authService.logout();
    dispatch({ type: 'AUTH_LOGOUT' });
    
    console.info('User logged out:', {
      timestamp: new Date().toISOString()
    });
  };

  const refreshAuth = async (): Promise<boolean> => {
    try {
      const success = await authService.refreshToken();
      
      if (success) {
        const user = authService.getCurrentUser();
        if (user) {
          dispatch({ type: 'AUTH_REFRESH_SUCCESS', payload: { user } });
          return true;
        }
      }
      
      return false;
    } catch (error) {
      console.error('Auth refresh error:', error);
      return false;
    }
  };

  const clearError = () => {
    dispatch({ type: 'CLEAR_ERROR' });
  };

  // Authorization methods
  const hasPermission = (permission: string): boolean => {
    return authService.hasPermission(permission);
  };

  const hasRole = (role: string): boolean => {
    return authService.hasRole(role);
  };

  const canAccessMachine = (machineId: string): boolean => {
    return authService.canAccessMachine(state.user, machineId);
  };

  const requestEmergencyAccess = async (code: string, reason: string): Promise<boolean> => {
    try {
      const granted = await authService.emergencyAccess(code, reason);
      
      if (granted) {
        // Log emergency access
        console.warn('Emergency access granted:', {
          user: state.user?.username || 'unknown',
          reason,
          timestamp: new Date().toISOString()
        });
        
        // In production, this would also:
        // 1. Send alerts to supervisors
        // 2. Create audit trail entry
        // 3. Set temporary elevated permissions
      }
      
      return granted;
    } catch (error) {
      console.error('Emergency access error:', error);
      return false;
    }
  };

  // Context value
  const contextValue: AuthContextType = {
    // State
    user: state.user,
    isLoading: state.isLoading,
    isAuthenticated: state.isAuthenticated,
    error: state.error,
    
    // Actions
    login,
    logout,
    refreshAuth,
    clearError,
    
    // Authorization
    hasPermission,
    hasRole,
    canAccessMachine,
    
    // Emergency
    requestEmergencyAccess,
  };

  return (
    <AuthContext.Provider value={contextValue}>
      {children}
    </AuthContext.Provider>
  );
}

// Custom hook to use authentication context
export function useAuth(): AuthContextType {
  const context = useContext(AuthContext);
  
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  
  return context;
}

// Higher-order component for authentication requirements
export function withAuth<P extends object>(
  Component: React.ComponentType<P>,
  requiredRole?: string,
  requiredPermissions?: string[]
) {
  return function AuthenticatedComponent(props: P) {
    const { isAuthenticated, hasRole, hasPermission } = useAuth();
    
    if (!isAuthenticated) {
      return <div>Access denied: Authentication required</div>;
    }
    
    if (requiredRole && !hasRole(requiredRole)) {
      return <div>Access denied: Insufficient role privileges</div>;
    }
    
    if (requiredPermissions) {
      const hasAllPermissions = requiredPermissions.every(permission => 
        hasPermission(permission)
      );
      
      if (!hasAllPermissions) {
        return <div>Access denied: Insufficient permissions</div>;
      }
    }
    
    return <Component {...props} />;
  };
}

export type { AuthContextType, User };