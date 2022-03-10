import React from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

const authTokenFunctions = {
    async storeToken(token) {
        try {
            await AsyncStorage.setItem('token', JSON.stringify(token));
            console.log(token)
        } catch (error) {
            console.log("Something went wrong", error);
        }
    },

    async getToken() {
        try {
            token = await AsyncStorage.getItem('token');
            data = JSON.parse(token);
            return data;
            
        } catch (error) {
            console.log("Something went wrong", error);
        }
    },
}    
export default authTokenFunctions;