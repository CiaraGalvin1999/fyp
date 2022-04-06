// Imports
import React from 'react'
import { createStackNavigator } from '@react-navigation/stack'

// Import screens
import Dashboard from '../screens/Dashboard'
import OtherUserProfile from '../screens/OtherUserProfile'
import OtherUserCatalogue from '../screens/OtherUserCatalogue'

// Stack of screens for when user is not authorised i.e., not logged in
// Will contain login and registration screens
const DashboardStack = createStackNavigator();

const DashboardStackScreen = ({navigation}) => (
    <DashboardStack.Navigator initialRouteName={Dashboard} screenOptions={({ route, navigation }) => ({
        headerShown: false,
      })}>
        <DashboardStack.Screen name='Dashboard' component={Dashboard}/>
        <DashboardStack.Screen name='OtherUserProfile' component={OtherUserProfile}/>
        <DashboardStack.Screen name='OtherUserCatalogue' component={OtherUserCatalogue}/>
    </DashboardStack.Navigator>
);

export default DashboardStackScreen;