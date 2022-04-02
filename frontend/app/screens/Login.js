// Imports
import React, { Component } from 'react';
import { View, Text, TextInput, TouchableOpacity, Image } from 'react-native';
import helpers from '../components/helpers';

// Stylesheet
const styles = require('../stylesheets/mainStylesheet');

class Login extends Component {

    //Constructor
    //States are set here
    constructor() {
        super();
        this.state = {
            username: '',
            password: '',
            incorrectDetails: false
        }
    }

    //Functions that update each state as the login form is filled in
    updateUsername = (value) => {
        this.setState({ username: value })
    }
    updatePassword = (value) => {
        this.setState({ password: value })
    }

    //Function that is called when button is clicked, sends POST request to server to login/authenticate user
    //TODO: Must add in checks here 
    loginUser = async () => {
        try {
            const response = await fetch('http://10.0.2.2:8000/api/auth/login/', {
                method: 'POST',
                headers: {
                    Accept: 'application/json',
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    'username': this.state.username,
                    'password': this.state.password,
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
                const json = await response.json()
                console.log(json)
                helpers.storeToken(json)
            }
            else if (statusCode == 400) {
               this.setState({ incorrectDetails: true })
            }
            else if (statusCode > 400 && statusCode < 500) {
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

            <View style={styles.spaceTop} />

            <View styles={styles.logoContainer}>
                <Image style={styles.logo} source={require('../assets/logo_colour_transparent.png')} />
            </View>

            {this.state.incorrectDetails && <Text style={styles.requiredErrorMessage}>Sorry, you entered incorrect login details. Please try again.</Text>}

            <View style={styles.fieldContainer}>
                <TextInput
                    style={styles.field}
                    placeholder="Enter username..."
                    placeholderTextColor='#CBCBCB'
                    autoCorrect={false}
                    autoCapitalize="none"
                    onChangeText={this.updateUsername}
                ></TextInput>
            </View>

            <View style={styles.fieldContainer}>
                <TextInput
                    style={styles.field}
                    secureTextEntry
                    autoCapitalize="none"
                    autoCorrect={false}
                    placeholder="Enter password..."
                    placeholderTextColor='#CBCBCB'
                    onChangeText={this.updatePassword}
                ></TextInput>

                <View style={styles.buttonContainer}>
                    <TouchableOpacity style={styles.buttonStyle} onPress={this.loginUser}>
                        <Text style={styles.buttonText}>Login</Text>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => this.props.navigation.navigate('RegistrationScreen')}>
                        <Text style={styles.redirectText}>Don't have an account? <Text style={styles.linkText}>Register here</Text></Text>
                    </TouchableOpacity>
                </View>

            </View>


        </View>
    )
}
}

export default Login