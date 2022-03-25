// Imports
import React from 'react'
import { createStackNavigator } from '@react-navigation/stack'

// Import screens
import AllCatalogues from '../screens/AllCatalogues'
import Catalogue from '../screens/Catalogue'

// Stack of screens for when user is not authorised i.e., not logged in
// Will contain login and registration screens
const CatalogueStack = createStackNavigator();

const CatalogueStackScreen = ({navigation}) => (
    <CatalogueStack.Navigator initialRouteName={AllCatalogues} screenOptions={({ route, navigation }) => ({
        headerShown: false,
      })}>
        <CatalogueStack.Screen name='AllCatalogues' component={AllCatalogues}/>
        <CatalogueStack.Screen name='Catalogue' component={Catalogue}/>
    </CatalogueStack.Navigator>
);

export default CatalogueStackScreen;