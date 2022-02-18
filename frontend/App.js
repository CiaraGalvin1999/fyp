import React from 'react';
import { View } from 'react-native';
import Login from './app/screens/Login';
import Registration from './app/screens/Registration';
import Dashboard from './app/screens/Dashboard';
import Profile from './app/screens/Profile';
import Catalogue from './app/screens/Catalogue'
import AddFic from './app/screens/AddFic'
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Ionicons from 'react-native-vector-icons/Ionicons'

const Tab = createBottomTabNavigator();

const App = () => {
  return (
    <NavigationContainer>
      <Tab.Navigator
        initialRouteName={Dashboard}
        screenOptions={({ route }) => ({
          tabBarIcon: ({ focused, color, size }) => {
            let iconName;

            if (route.name === 'Dashboard') {
              iconName = focused ? 'planet-outline' : 'planet';
            } else if (route.name === 'Catalogue') {
              iconName = focused ? 'library-outline' : 'library';
            } else if (route.name === 'Profile') {
              iconName = focused ? 'person-outline' : 'person';
            } else if (route.name === 'AddFic') {
              iconName = focused ? 'add-outline' : 'add';
              //Made add button larger because it looked very small compared to other icons
              return <Ionicons name={iconName} size={36} color={color} />;
            }

            // You can return any component that you like here!
            return <Ionicons name={iconName} size={size} color={color} />;
          },
          tabBarActiveTintColor: '#53869d',
          tabBarInactiveTintColor: 'white',
          tabBarActiveBackgroundColor: "#202226",
          tabBarInactiveBackgroundColor: '#202226',
  
        })}
      >
        <Tab.Screen name="Dashboard" component={Dashboard}  options={{tabBarShowLabel: false}} />
        <Tab.Screen name="AddFic" component={AddFic} options={{tabBarShowLabel: false}} />
        <Tab.Screen name="Catalogue" component={Catalogue}  options={{tabBarShowLabel: false}} />
        <Tab.Screen name="Profile" component={Profile} options={{tabBarShowLabel: false}} />
      </Tab.Navigator>
    </NavigationContainer>
  )
}
export default App;