import React, { Component } from 'react'
import { View, Text, TouchableOpacity, TextInput } from 'react-native'
import Ionicons from 'react-native-vector-icons/Ionicons'
import helpers from '../components/helpers'

const styles = require('../stylesheets/mainStylesheet')

class ChangePassword extends Component {
    //Constructor
    //States are set here
    constructor() {
        super();
        this.state = {
            newPassword: '',
            confirmNewPassword: '',
            oldPassword: '',
            updatedSuccessfully: false,
        }
    }

    //Functions that update each state as the registration form is filled in
    updateNewPassword = (value) => {
        this.setState({ newPassword: value })
    }
    updateConfirmNewPassword = (value) => {
        this.setState({ confirmNewPassword: value })
    }
    updateOldPassword = (value) => {
        this.setState({ oldPassword: value })
    }

    async updatePassword() {
        // Gets token associated with user
        let token = await helpers.getToken();

        try {
            const response = await fetch('http://10.0.2.2:8000/api/changePassword/', {
                method: 'POST',
                headers: {
                    Accept: 'application/json',
                    'Content-Type': 'application/json',
                    'Authorization': 'Token ' + token,
                },
                body: JSON.stringify({
                    'newPassword': this.state.newPassword,
                    'confirmNewPassword': this.state.confirmNewPassword,
                    'oldPassword': this.state.oldPassword
                })
            })

            // Get status
            const statusCode = response.status

            // If unauthorised, clear token and log user out
            if (statusCode == 401) {
                helpers.clearToken()
            }
            // If success, parse data and update users
            else if (statusCode >= 200 && statusCode < 300) {
                this.setState({ updatedSuccessfully: true, newPassword: '', confirmNewPassword: '', oldPassword: '' })
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
                        <Ionicons name={'chevron-back-outline'} size={24} color={'#FFFFFF'} />
                    </TouchableOpacity>

                    <View style={[styles.pageTitleContainer, styles.containsLeftButton]}>
                        <Text style={styles.pageTitleText}>Change Password</Text>
                    </View>
                </View>

                <View style={styles.spaceTop} />

                <View style={styles.fieldContainer}>

                    <TextInput
                        style={styles.field}
                        placeholder="Enter new password..."
                        placeholderTextColor='#CBCBCB'
                        autoCorrect={false}
                        autoCapitalize="none"
                        onChangeText={this.updateNewPassword}
                        secureTextEntry
                    ></TextInput>
                </View>
                <View style={styles.fieldContainer}>

                    <TextInput
                        style={styles.field}
                        placeholder="Re-enter new password..."
                        placeholderTextColor='#CBCBCB'
                        autoCorrect={false}
                        autoCapitalize="none"
                        onChangeText={this.updateConfirmNewPassword}
                        secureTextEntry
                    ></TextInput>
                </View>


                <View style={styles.fieldContainer}>

                    <TextInput
                        style={styles.field}
                        autoCapitalize="none"
                        autoCorrect={false}
                        placeholder="Current Password..."
                        placeholderTextColor='#CBCBCB'
                        onChangeText={this.updateOldPassword}
                        secureTextEntry
                    ></TextInput>

                    <View style={styles.buttonContainer}>
                        <TouchableOpacity
                            style={styles.buttonStyle}
                            onPress={() => this.updatePassword()}
                        >
                            <Text style={styles.buttonText}>Update</Text>
                        </TouchableOpacity>
                    </View>
                </View>
                {this.state.updatedSuccessfully &&
                    <View style={styles.updatedSuccessfullyContainer}>
                        <Text style={styles.updatedSuccessfullyMessage}>Your password has been updated successfully!</Text>
                    </View>
                }
            </View>
        )
    }
}

export default ChangePassword