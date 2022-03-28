import React, { Component } from 'react'
import { View, Text, TextInput, TouchableOpacity, Image, SafeAreaView, ScrollView } from 'react-native'
import helpers from '../components/helpers';

const styles = require('../stylesheets/mainStylesheet');


class Registration extends Component {
    //Constructor
    //States are set here
    constructor() {
        super();
        this.state = {
            username: '',
            password: '',
            email: '',
            firstName: '',
            lastName: ''
        }
    }

    //Functions that update each state as the registration form is filled in
    updateUsername = (value) => {
        this.setState({ username: value })
    }
    updatePassword = (value) => {
        this.setState({ password: value })
    }
    updateEmail = (value) => {
        this.setState({ email: value })
    }
    updateFirstName = (value) => {
        this.setState({ firstName: value })
    }
    updateLastName = (value) => {
        this.setState({ lastName: value })
    }
    //Function that is called when button is clicked, sends POST request to server to register user
    //TODO: Must add in checks here
    registerUser = () => {
        fetch('http://10.0.2.2:8000/api/auth/register/', {
            method: 'POST',
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                'username': this.state.username,
                'email': this.state.email,
                'password': this.state.password,
                'first_name': this.state.firstName,
                'last_name': this.state.lastName,
            })
        }).catch(function (error) {
            console.log("Error: " + error);
        });
    }


    render() {

        return (

            <SafeAreaView style={styles.container}>
                <ScrollView style={{flex: 1}}>
                    <View style={styles.spaceTop} />
                    <View style={styles.logoContainer}>
                        <Image style={styles.logo} source={require('../assets/logo_colour_transparent.png')} />
                    </View>

                    <View style={styles.fieldContainer}>
                        <TextInput
                            style={styles.field}
                            placeholder="Enter a username..."
                            placeholderTextColor='#CBCBCB'
                            autoCorrect={false}
                            autoCapitalize="none"
                            onChangeText={this.updateUsername}
                        ></TextInput>
                    </View>

                    <View style={styles.fieldContainer}>
                        <TextInput
                            style={styles.field}
                            placeholder="Enter your email address..."
                            placeholderTextColor='#CBCBCB'
                            autoCorrect={false}
                            autoCapitalize="none"
                            onChangeText={this.updateEmail}
                        ></TextInput>
                    </View>

                    <View style={styles.fieldContainer}>
                        <TextInput
                            style={styles.field}
                            secureTextEntry
                            autoCapitalize="none"
                            autoCorrect={false}
                            placeholder="Enter a password..."
                            placeholderTextColor='#CBCBCB'
                            onChangeText={this.updatePassword}
                        ></TextInput>
                    </View>

                    <View style={styles.fieldContainer}>
                        <TextInput
                            style={styles.field}
                            autoCapitalize="none"
                            autoCorrect={false}
                            placeholder="Enter first name..."
                            placeholderTextColor='#CBCBCB'
                            onChangeText={this.updateFirstName}
                        ></TextInput>
                    </View>

                    <View style={styles.fieldContainer}>
                        <TextInput
                            style={styles.field}
                            autoCapitalize="none"
                            autoCorrect={false}
                            placeholder="Enter last name..."
                            placeholderTextColor='#CBCBCB'
                            onChangeText={this.updateLastName}
                        ></TextInput>

                        <View style={styles.buttonContainer}>
                            <TouchableOpacity style={styles.buttonStyle} onPress={this.registerUser}>
                                <Text style={styles.buttonText}>Register</Text>
                            </TouchableOpacity>
                            <TouchableOpacity onPress={() => this.props.navigation.navigate('LoginScreen')}>
                            <Text style={styles.redirectText}>Already a user? <Text style={styles.linkText}>Login here</Text></Text>
                        </TouchableOpacity>
                        </View>
                    </View>
                    <View style={{height:100}}></View>
                </ScrollView>
            </SafeAreaView>

        )
    }
}

export default Registration