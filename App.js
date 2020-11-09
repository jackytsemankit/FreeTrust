
import 'react-native-gesture-handler';
import { StatusBar } from 'expo-status-bar';
import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import ProfilePage from './pages/ProfilePage'
//import SearchPage from './pages/SearchPage'
import RegistrationPage from './pages/RegistrationPage'
import LoginPage from './pages/LoginPage'
import ApiKeys from './constants/ApiKeys';
import * as firebase from 'firebase';

import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';


export default class App extends React.Component {

  constructor(props){
    super(props);

    if (!firebase.apps.length) { firebase.initializeApp(ApiKeys.FirebaseConfig); }

    
  };
  
  render() {
      return (

<<<<<<< HEAD
      <NavigationContainer>
        <Stack.Navigator>
          <Stack.Screen name="SearchPage" component={SearchPage} />
          <Stack.Screen name="ProfilePage" component={ProfilePage} />
        </Stack.Navigator>
      </NavigationContainer>
=======
        <View style={styles.container}>                 
          <LoginPage />
        </View>
>>>>>>> bc9ea205e29b1e632f5d4f485c33aebf0b883991
      );
  }
}
const Stack = createStackNavigator();
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
