// Imports
import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Ionicons from 'react-native-vector-icons/Ionicons';

// Import screens
import Dashboard from './Dashboard';
import Profile from './Profile';
import CatalogueStackScreen from './CatalogueStack';
import AddFicStackScreen from './AddFicStack';

// Create bottom tab navigator
const Tab = createBottomTabNavigator();

const AuthStackScreen = ({ navigation }) => (
    <Tab.Navigator
        initialRouteName={Dashboard}
        screenOptions={({ route, navigation }) => ({
            headerShown: false,
            tabBarIcon: ({ focused, color, size }) => {
                let iconName;

                if (route.name === 'Dashboard') {
                    iconName = focused ? 'planet-outline' : 'planet';
                } else if (route.name === 'CatalogueStack') {
                    iconName = focused ? 'book-outline' : 'book';
                } else if (route.name === 'Profile') {
                    iconName = focused ? 'person-outline' : 'person';
                } else if (route.name === 'AddFicStack') {
                    iconName = focused ? 'add-outline' : 'add';
                    //Made add button larger because it looked very small compared to other icons
                    return <Ionicons name={iconName} size={36} color={color} />;
                }

                // You can return any component that you like here!
                return <Ionicons name={iconName} size={size} color={color} />;
            },
            tabBarActiveTintColor: '#57a5c9',
            tabBarInactiveTintColor: '#F3F8F2',
            tabBarActiveBackgroundColor: "#202226",
            tabBarInactiveBackgroundColor: '#202226',
        })}
    >
        <Tab.Screen name="Dashboard" component={Dashboard} options={{ tabBarShowLabel: false }} />
        <Tab.Screen name="AddFicStack" component={AddFicStackScreen} options={{ tabBarShowLabel: false }} />
        <Tab.Screen name="CatalogueStack" component={CatalogueStackScreen} options={{ tabBarShowLabel: false }} />
        <Tab.Screen name="Profile" component={Profile} options={{ tabBarShowLabel: false }} />
    </Tab.Navigator>
);

export default AuthStackScreen;

