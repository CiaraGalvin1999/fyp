// Imports
import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';

// Import screens
import AddFic from './AddFic';
import ShowFics from './ShowFics';

// Stack of screens for when user is not authorised i.e., not logged in
// Will contain login and registration screens
const AddStack = createStackNavigator();

const AddFicStackScreen = ({navigation}) => (
    <AddStack.Navigator initialRouteName={AddFic} screenOptions={({ route, navigation }) => ({
        headerShown: false,
      })}>
        <AddStack.Screen name='AddFic' component={AddFic}/>
        <AddStack.Screen name='ShowFics' component={ShowFics}/>
    </AddStack.Navigator>
);

export default AddFicStackScreen;