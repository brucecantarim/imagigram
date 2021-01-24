import React, { useState, useEffect } from 'react';
import { View } from 'react-native';
import {
  DefaultTheme,
  Provider as PaperProvider,
  ActivityIndicator,
  Colors,
} from 'react-native-paper';
import * as firebase from 'firebase';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';

import { Provider } from 'react-redux';
import { createStore, applyMiddleware } from 'redux';
import rootReducers from './redux/reducers';
import thunk from 'redux-thunk';

const store = createStore(rootReducers, applyMiddleware(thunk));

import HeaderBar from './components/HeaderBar';
import Landing from './components/auth/Landing';
import Register from './components/auth/Register';
import Login from './components/auth/Login';
import Main from './components/Main';
import Add from './components/main/Add';
import Save from './components/main/Save';
import Comment from './components/main/Comment';

const firebaseConfig = {
  apiKey: process.env.EXPO_FIREBASE_KEY,
  authDomain: process.env.EXPO_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.EXPO_FIREBASE_PROJECT_ID,
  storageBucket: process.env.EXPO_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.EXPO_FIREBASE_SENDER_ID,
  appId: process.env.EXPO_FIREBASE_APP_ID,
};

if (firebase.apps.length === 0) {
  firebase.initializeApp(firebaseConfig);
}

const Stack = createStackNavigator();

const theme = {
  ...DefaultTheme,
  roundness: 2,
  colors: {
    ...DefaultTheme.colors,
    primary: '#ff7300',
    accent: '#ffffff',
  },
};

const App = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    firebase.auth().onAuthStateChanged((user) => {
      if (!user) {
        setIsLoggedIn(false);
      } else {
        setIsLoggedIn(true);
      }
      setIsLoading(false);
    });
  }, []);

  const Loading = () => (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <ActivityIndicator
        animating={true}
        color={Colors.orange500}
        size='large'
      />
    </View>
  );

  const LoggedOut = () => (
    <PaperProvider theme={theme}>
      <NavigationContainer theme={theme}>
        <Stack.Navigator initialRouteName='Landing'>
          <Stack.Screen
            name='Landing'
            component={Landing}
            options={{ headerShown: false }}
          />
          <Stack.Screen name='Register' component={Register} />
          <Stack.Screen name='Login' component={Login} />
        </Stack.Navigator>
      </NavigationContainer>
    </PaperProvider>
  );

  const LoggedIn = () => (
    <Provider store={store}>
      <PaperProvider theme={theme}>
        <NavigationContainer theme={theme}>
          <Stack.Navigator initialRouteName='Main'>
            <Stack.Screen
              name='Main'
              component={Main}
              options={{ header: (props) => <HeaderBar {...props} /> }}
            />
            <Stack.Screen name='Add' component={Add} />
            <Stack.Screen name='Save' component={Save} />
            <Stack.Screen name='Comment' component={Comment} />
          </Stack.Navigator>
        </NavigationContainer>
      </PaperProvider>
    </Provider>
  );

  if (isLoading) {
    return <Loading />;
  }
  if (isLoggedIn) {
    return <LoggedIn />;
  }

  return <LoggedOut />;
};

export default App;
