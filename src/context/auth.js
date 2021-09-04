import React, { createContext, useReducer, useContext } from 'react';

const AuthStateContext = createContext();
const AuthDispatchContext = createContext();

let user = null;

const authReducer = (state, action) => {
  switch(action.type) {
    case 'LOGIN':
      localStorage.setItem('token', action.payload.token);
      localStorage.setItem('_id', action.payload.user._id);
      localStorage.setItem('name', action.payload.user.name);
      localStorage.setItem('email', action.payload.user.email);
      return {
        ...state,
        user: action.payload.user
      }
    case 'LOGOUT':
      localStorage.removeItem('token');
      localStorage.removeItem('_id');
      localStorage.removeItem('name');
      localStorage.removeItem('email');

      return {
        ...state,
        user: null
      }
    default:
      throw new Error(`Unknown action type: ${action.type}`);
  }
}

export const AuthProvider = ({ children }) => {
  const [state, dispatch] = useReducer(authReducer, { user });
  return (
    <AuthDispatchContext.Provider value={dispatch}>
      <AuthStateContext.Provider value={state}>
        {children}
      </AuthStateContext.Provider>
    </AuthDispatchContext.Provider>
  )
}

export const useAuthState = () => useContext(AuthStateContext);
export const useAuthDispatch = () => useContext(AuthDispatchContext);