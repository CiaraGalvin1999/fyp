// Imports
import React, { Component } from 'react';
import { ActivityIndicator, View } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import UnauthStackScreen from './app/screens/UnauthScreensStack';
import AuthStackScreen from './app/screens/AuthScreensStack';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Parent navigator
import { createStackNavigator } from '@react-navigation/stack';
const parentStack = createStackNavigator();

// Ignore warning
import { LogBox } from 'react-native';
LogBox.ignoreLogs([
  "[react-native-gesture-handler] Seems like you\'re using an old API with gesture components, check out new Gestures system!",
]);

class App extends Component {
  constructor() {
    super();
    this.state = {
      isLoading: true,
      token: false,
    }
  }

  componentDidMount() {
    AsyncStorage.clear();
    AsyncStorage.getItem('token').then((t) => {
      this.setState({ token: t !== null, isLoading:false })
    })
  }

  render() {
    const auth = false;
    // Loading screen while checking if user is logged in already or not
    if (this.state.isLoading) {
      return (
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
          <ActivityIndicator size='large' />
        </View>
      )
    }
    return (
      <NavigationContainer>
        <parentStack.Navigator 
          initialRouteName={this.state.token ? 'authNav' : 'unauthNav'} 
          screenOptions={({ route, navigation }) => ({
            headerShown: false,
          })}
        >
          <parentStack.Screen name='unauthNav' component={UnauthStackScreen}></parentStack.Screen>
          <parentStack.Screen name='authNav' component={AuthStackScreen}></parentStack.Screen>
        </parentStack.Navigator>
      </NavigationContainer>
    )
  }
}
export default App;