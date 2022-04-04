import React, { Component } from 'react'
import { View, Text, TouchableOpacity } from 'react-native'
import Ionicons from 'react-native-vector-icons/Ionicons'
import helpers from '../components/helpers'

const styles = require('../stylesheets/mainStylesheet')
const pageStyle = require('../stylesheets/settingsStyle')

class Settings extends Component {
    //Constructor
    //States are set here
    constructor() {
        super();
    }

    async logout() {
       // Gets user token
       let token = await helpers.getToken()

        try {
            const response = await fetch('http://10.0.2.2:8000/api/auth/logout/', {
                method: 'GET',
                headers: {
                    Accept: 'application/json',
                    'Content-Type': 'application/json',
                    'Authorization': 'Token ' + token,
                },
            })

            // Get status
            const statusCode = response.status

            // If unauthorised, clear token and log user out
            if (statusCode == 401) {
                helpers.clearToken()
            }
            // If success, logout user
            else if (statusCode >= 200 && statusCode < 300) {
                helpers.clearToken()
            }
            else if (statusCode >= 400 && statusCode < 500) {
                console.log('Client error.')
            }
            else if (statusCode >= 500 && statusCode < 600) {
                console.log('Server error.')
            }
        } catch (err) {
            console.log(err)
        }
    }

    render() {
        return (
            <View style={styles.container}>
                <View style={styles.headerContainer}>
                    <TouchableOpacity
                        style={styles.leftButton}
                        onPress={() => this.props.navigation.goBack()}
                    >
                        <Ionicons name={'chevron-back-outline'} size={22} color={'#FFFFFF'} />
                    </TouchableOpacity>

                    <View style={[styles.pageTitleContainer, styles.containsLeftButton]}>
                        <Text style={styles.pageTitleText}>Settings</Text>
                    </View>
                </View>

                <TouchableOpacity
                    style={pageStyle.buttonContainer}
                    onPress={() => this.props.navigation.navigate('ChangeUsername')}
                >
                    <View style={pageStyle.button}>
                        <Text style={pageStyle.buttonText}>Change Username</Text>
                    </View>
                    <View style={pageStyle.changePageIcon}>
                        <Ionicons name={'chevron-forward-outline'} size={22} color={'#FFFFFF'} />
                    </View>
                </TouchableOpacity>
                <TouchableOpacity
                    style={pageStyle.buttonContainer}
                    onPress={() => this.props.navigation.navigate('ChangePassword')}
                >
                    <View style={pageStyle.button}>
                        <Text style={pageStyle.buttonText}>Change Password</Text>
                    </View>
                    <View style={pageStyle.changePageIcon}>
                        <Ionicons name={'chevron-forward-outline'} size={22} color={'#FFFFFF'} />
                    </View>
                </TouchableOpacity>
                <TouchableOpacity
                    style={pageStyle.buttonContainer}
                    onPress={() => this.logout()}
                >
                    <View style={pageStyle.button}>
                        <Text style={pageStyle.buttonText}>Logout</Text>
                    </View>
                    <View style={pageStyle.changePageIcon}>
                        <Ionicons name={'chevron-forward-outline'} size={22} color={'#FFFFFF'} />
                    </View>
                </TouchableOpacity>
            </View>
        )
    }
}

export default Settings