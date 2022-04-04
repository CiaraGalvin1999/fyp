import React, { Component } from 'react'
import { View, Text, TouchableOpacity, TextInput } from 'react-native'
import Ionicons from 'react-native-vector-icons/Ionicons'
import helpers from '../components/helpers'

const styles = require('../stylesheets/mainStylesheet')

class ChangeUsername extends Component {
    //Constructor
    //States are set here
    constructor() {
        super();
        this.state = {
            newUsername: '',
            password: '',
            updatedSuccessfully: false,
            usernameExists: false,
        }
    }

    //Functions that update each state as the registration form is filled in
    updateNewUsername = (value) => {
        this.setState({ newUsername: value })
    }
    updatePassword = (value) => {
        this.setState({ password: value })
    }

    async updateUsername() {
        // Gets token associated with user
        let token = await helpers.getToken();

        try {
            const response = await fetch('http://10.0.2.2:8000/api/changeUsername/', {
                method: 'POST',
                headers: {
                    Accept: 'application/json',
                    'Content-Type': 'application/json',
                    'Authorization': 'Token ' + token,
                },
                body: JSON.stringify({
                    'newUsername': this.state.newUsername,
                    'password': this.state.password
                })
            })

            // Get status
            const statusCode = response.status

            // If unauthorised, clear token and log user out
            if (statusCode == 401) {
                helpers.clearToken()
            }
            // 409 is returned if username already exists
            else if (statusCode == 409) {
                this.setState({ usernameExists: true })
            }
            else if (statusCode >= 200 && statusCode < 300) {
                this.setState({ updatedSuccessfully: true, newUsername: '', password: '', usernameExists: false})
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
                        <Text style={styles.pageTitleText}>Change Username</Text>
                    </View>
                </View>

                <View style={styles.spaceTop} />

                {this.state.usernameExists &&

                        <Text style={styles.requiredErrorMessage}>Sorry! This username is taken.</Text>

                }

                <View style={styles.fieldContainer}>
                    <TextInput
                        style={styles.field}
                        placeholder="Enter new username..."
                        placeholderTextColor='#CBCBCB'
                        autoCorrect={false}
                        autoCapitalize="none"
                        onChangeText={this.updateNewUsername}
                    ></TextInput>
                </View>

                <View style={styles.fieldContainer}>
                    <TextInput
                        style={styles.field}
                        autoCapitalize="none"
                        autoCorrect={false}
                        placeholder="Enter password..."
                        placeholderTextColor='#CBCBCB'
                        onChangeText={this.updatePassword}
                        secureTextEntry
                    ></TextInput>

                    <View style={styles.buttonContainer}>
                        <TouchableOpacity style={styles.buttonStyle} onPress={() => this.updateUsername()}>
                            <Text style={styles.buttonText}>Update</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </View>
        )
    }
}

export default ChangeUsername