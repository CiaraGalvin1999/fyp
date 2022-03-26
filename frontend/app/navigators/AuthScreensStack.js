// Imports
import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Ionicons from 'react-native-vector-icons/Ionicons';

// Import screens
import Dashboard from '../screens/Dashboard'
import ProfileStackScreen from './ProfileStack'
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
                    iconName = focused ? 'home-outline' : 'home';
                } else if (route.name === 'CatalogueStack') {
                    iconName = focused ? 'book-outline' : 'book';
                } else if (route.name === 'ProfileStack') {
                    iconName = focused ? 'person-outline' : 'person';
                } else if (route.name === 'AddFicStack') {
                    iconName = focused ? 'add-outline' : 'add';
                    //Made add button larger because it looked very small compared to other icons
                    return <Ionicons name={iconName} size={36} color={color} />;
                }

                // You can return any component that you like here!
                return <Ionicons name={iconName} size={size} color={color} />;
            },
            tabBarActiveTintColor: '#50B9B6',
            tabBarInactiveTintColor: '#FFFFFF',
            tabBarActiveBackgroundColor: "#0A0A0A",
            tabBarInactiveBackgroundColor: '#0A0A0A',
        })}
    >
        <Tab.Screen name="Dashboard" component={Dashboard} options={{ tabBarShowLabel: false }} />
        <Tab.Screen name="AddFicStack" component={AddFicStackScreen} options={{ tabBarShowLabel: false }} />
        <Tab.Screen name="CatalogueStack" component={CatalogueStackScreen} options={{ tabBarShowLabel: false }} />
        <Tab.Screen name="ProfileStack" component={ProfileStackScreen} options={{ tabBarShowLabel: false }} />
    </Tab.Navigator>
);

export default AuthStackScreen;