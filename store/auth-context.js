import AsyncStorage from '@react-native-async-storage/async-storage';

import { createContext, useState } from 'react';

export const AuthContext = createContext({
  token: '',
  email: '',
  password: '',
  isAuthenticated: false,
  authenticate: (token, email, password) => { },
  logout: () => { },
});

function AuthContextProvider({ children }) {
  const [authToken, setAuthToken] = useState();
  const [email, setEmail] = useState();
  const [password, setPassword] = useState();

  function authenticate(token, email, password) {
    setAuthToken(token);
    setEmail(email);
    setPassword(password);
    AsyncStorage.setItem('token', token);
    AsyncStorage.setItem('email', email);
    AsyncStorage.setItem('password', password);
  }

  function logout() {
    setAuthToken(null);
    AsyncStorage.removeItem('token');
  }

  const value = {
    token: authToken,
    email: email,
    password: password,
    isAuthenticated: !!authToken,
    authenticate: authenticate,
    logout: logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export default AuthContextProvider;
