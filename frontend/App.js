// Imports
import React, { Component } from 'react';
import { ActivityIndicator, View } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import UnauthStackScreen from './app/navigators/UnauthScreensStack';
import AuthStackScreen from './app/navigators/AuthScreensStack';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Parent navigator
import { createStackNavigator } from '@react-navigation/stack';
const parentStack = createStackNavigator();

// Ignore warning
import { LogBox } from 'react-native';
LogBox.ignoreLogs([
  "[react-native-gesture-handler] Seems like you\'re using an old API with gesture components, check out new Gestures system!",
]);

// Stylesheets
const styles = require('./app/stylesheets/mainStylesheet');

class App extends Component {
  constructor() {
    super();
    this.state = {
      isLoading: true,
      token: false,
    }
  }

  componentDidMount() {
    AsyncStorage.getItem('token').then((t) => {
      this.setState({ token: t !== null, isLoading: false })
    })
  }

  componentDidUpdate() {
    AsyncStorage.getItem('token').then((t) => {
      this.setState({ token: t !== null })
    })
  }

  render() {
    let authorised = this.state.token

    // Loading screen while checking if user is logged in already or not
    if (this.state.isLoading) {
      return (
        <View style={styles.loadingView}>
          <ActivityIndicator size='large' />
        </View>
      )
    }
    return (

      <NavigationContainer>
        <parentStack.Navigator

          screenOptions={({ route, navigation }) => ({
            headerShown: false,
          })}
        >


          {authorised ? (
            <parentStack.Screen name='authNav' component={AuthStackScreen}></parentStack.Screen>
          ) : (
            <parentStack.Screen name='unauthNav' component={UnauthStackScreen}></parentStack.Screen>
          )}

        </parentStack.Navigator>
      </NavigationContainer>
    )
  }
}
export default App;