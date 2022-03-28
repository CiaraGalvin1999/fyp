import React from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

const helpers = {
    async storeToken(token) {
        try {
            await AsyncStorage.setItem('token', JSON.stringify(token));
        } catch (error) {
            console.log("Something went wrong", error);
        }
    },

    async getToken() {
        try {
            let item = await AsyncStorage.getItem('token');
            let json_token = JSON.parse(item);
            return json_token.token;

        } catch (error) {
            console.log("Something went wrong", error);
        }
    },
    
    async clearToken() {
        AsyncStorage.clear()
    }
}    
export default helpers;