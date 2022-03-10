// Imports
import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';

// Import screens
import Login from './Login';
import Registration from './Registration';

// Stack of screens for when user is not authorised i.e., not logged in
// Will contain login and registration screens
const UnauthStack = createStackNavigator();

const UnauthStackScreen = ({navigation}) => (
    <UnauthStack.Navigator screenOptions={({ route, navigation }) => ({
        headerShown: false,
      })}>
        <UnauthStack.Screen name='LoginScreen' component={Login}/>
        <UnauthStack.Screen name='RegistrationScreen' component={Registration}/>
    </UnauthStack.Navigator>
);

export default UnauthStackScreen;