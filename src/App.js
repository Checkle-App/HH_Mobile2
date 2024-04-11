import 'react-native-gesture-handler';
import React, {useEffect} from 'react';
import {LogBox} from 'react-native';
import {SafeAreaProvider} from 'react-native-safe-area-context';
/* Redux */
import {Functions} from './utils/constants';
import {connect} from 'react-redux';
import * as actions from './utils/redux/actions';
import auth from '@react-native-firebase/auth';
// import {GoogleSignin} from '@react-native-google-signin/google-signin';

import Main from './Main';

/* Nav */
import {NavigationContainer, DefaultTheme} from '@react-navigation/native';
import {createStackNavigator} from '@react-navigation/stack';
import {
  Provider as PaperProvider,
  DefaultTheme as PaperDefault,
} from 'react-native-paper';

import {enableScreens} from 'react-native-screens';
enableScreens();

/* SmartLook */
// import Smartlook from 'smartlook-react-native-wrapper';
// Smartlook.setupAndStartRecording('3bc209a45ebb1ddc06076144fc4c2eebb241b634');

const navigationTheme = DefaultTheme;
const Stack = createStackNavigator();

function App(props) {
  // Set an initializing state whilst Firebase connects

  // Handle user state changes
  async function onAuthStateChanged(userValue) {
    if (userValue) {
      const user = await Functions.readConsumer(userValue.uid, userValue._user);
      props.dispatchSetUser({user});
    } else {
      props.dispatchSetUser({user: null});
    }
  }

  useEffect(() => {
    const subscriber = auth().onAuthStateChanged(onAuthStateChanged);
    return subscriber; // unsubscribe on unmount
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    /* Ignore warnings in DEV */
    LogBox.ignoreLogs([
      'Animated: `useNativeDriver`',
      'Animated.event now requires',
      'Non-serializable values were found in the navigation state',
    ]);

    // GoogleSignin.configure({
    //   webClientId:
    //     '598272945249-utbr4n6ur0lnvqcpv0c56a8fnvn98e40.apps.googleusercontent.com', // prod
    //   // webClientId: '1010474855746-frg38covbpvd7a0sv4qd7ieaengn92ar.apps.googleusercontent.com', // dev
    //   offlineAccess: false,
    // });
  }, []);

  return (
    <>
      <SafeAreaProvider>
        <PaperProvider
          theme={{
            ...PaperDefault,
            colors: {...PaperDefault.colors, primary: '#624185'},
          }}>
          <NavigationContainer theme={navigationTheme}>
            <Stack.Navigator>
              <Stack.Screen
                name="Main"
                component={Main}
                options={{gestureEnabled: false, headerShown: false}}
              />
            </Stack.Navigator>
          </NavigationContainer>
        </PaperProvider>
      </SafeAreaProvider>
    </>
  );
}

const mapDispatchToProps = {
  dispatchSetUser: actions.setUser,
  dispatchSetDeeplink: actions.setDeeplink,
};

export default connect(null, mapDispatchToProps)(App);
