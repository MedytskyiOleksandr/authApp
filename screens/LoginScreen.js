import AsyncStorage from '@react-native-async-storage/async-storage';
import { useContext, useState } from 'react';
import { Alert } from 'react-native';
import * as LocalAuthentication from 'expo-local-authentication';

import AuthContent from '../components/Auth/AuthContent';
import LoadingOverlay from '../components/ui/LoadingOverlay';
import { AuthContext } from '../store/auth-context';
import { login } from '../util/auth';

function LoginScreen() {

  async function loginWithFingerprint() {
    const getEnrollment = async () => {
      const isEnrolled = await LocalAuthentication.isEnrolledAsync();
      if (isEnrolled) {
        const { success } = await LocalAuthentication.authenticateAsync({ promptMessage: 'Authenticate', cancelLabel: 'Cancel', disableDeviceFallback: true });
        if (success) {
          authWithFingerPrint();
        }
      }
    };
    getEnrollment();
  }

  async function authWithFingerPrint() {
    const email = await AsyncStorage.getItem("email")
    const password = await AsyncStorage.getItem("password");
    if (email === null || password === null) {
      Alert.alert(
        'Authentication failed!',
        'No data found! Try input your data again!'
      );
      return;
    }

    verify(email, password);
  }

  async function verify(email, password) {
    const token = await login(email, password);
    authCtx.authenticate(token, email, password);
  }

  const [isAuthenticating, setIsAuthenticating] = useState(false);

  const authCtx = useContext(AuthContext);

  async function loginHandler({ email, password }) {
    setIsAuthenticating(true);
    try {
      verify(email, password);
    } catch (error) {
      Alert.alert(
        'Authentication failed!',
        'Could not log you in. Please check your credentials or try again later!'
      );
      setIsAuthenticating(false);
    }
  }

  if (isAuthenticating) {
    return <LoadingOverlay message="Logging you in..." />;
  }

  return <AuthContent isLogin onAuthenticate={loginHandler} loginWithFingerPrint={loginWithFingerprint} />;
}

export default LoginScreen;
