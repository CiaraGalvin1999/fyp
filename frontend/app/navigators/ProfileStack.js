// Imports
import React from 'react'
import { createStackNavigator } from '@react-navigation/stack'

// Import screens
import Profile from '../screens/Profile'
import Friends from '../screens/Friends'
import AddFriends from '../screens/AddFriends'
import FriendRequests from '../screens/FriendRequests'
import Settings from '../screens/Settings'
import ChangePassword from '../screens/ChangePassword'
import ChangeUsername from '../screens/ChangeUsername'

// Stack of screens for when user is not authorised i.e., not logged in
// Will contain login and registration screens
const ProfileStack = createStackNavigator()

const ProfileStackScreen = () => (
    <ProfileStack.Navigator initialRouteName={Profile} screenOptions={() => ({
        headerShown: false,
      })}>
        <ProfileStack.Screen name='Profile' component={Profile} initialParams={{ username: '' }}/>
        <ProfileStack.Screen name='Friends' component={Friends}/>
        <ProfileStack.Screen name='AddFriends' component={AddFriends}/>
        <ProfileStack.Screen name='FriendRequests' component={FriendRequests}/>
        <ProfileStack.Screen name='Settings' component={Settings}/>
        <ProfileStack.Screen name='ChangeUsername' component={ChangeUsername}/>
        <ProfileStack.Screen name='ChangePassword' component={ChangePassword}/>
    </ProfileStack.Navigator>
);

export default ProfileStackScreen;