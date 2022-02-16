import React, { Component } from 'react';
import { View, Text, TextInput, TouchableOpacity, Image } from 'react-native';

const s = require('../stylesheets/loginRegistrationStylesheets');


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
            <View style={s.container}>

                <View style={s.spaceTop} />

                <View style={s.logoContainer}>
                    <Image style={s.logo} source={require('../assets/logo_colour_transparent.png')} />
                </View>

                <View style={s.fieldContainer}>
                    <View style={{ width: '80%', marginTop: 10 }}><Text style={{ color: 'white' }}>Username</Text></View>
                    <TextInput
                        style={s.field}
                        placeholder="Choose a username..."
                        placeholderTextColor='#53869d'
                        autoCorrect={false}
                        autoCapitalize="none"
                        onChangeText={this.updateUsername}
                    ></TextInput>
                </View>

                <View style={s.fieldContainer}>
                    <View style={{ width: '80%', marginTop: 10 }}><Text style={{ color: 'white' }}>Email Address</Text></View>
                    <TextInput
                        style={s.field}
                        placeholder="Enter your email..."
                        placeholderTextColor='#53869d'
                        autoCorrect={false}
                        autoCapitalize="none"
                        onChangeText={this.updateEmail}
                    ></TextInput>
                </View>

                <View style={s.fieldContainer}>
                    <View style={{ width: '80%', marginTop: 10 }}><Text style={{ color: 'white' }}>Password</Text></View>
                    <TextInput
                        style={s.field}
                        secureTextEntry
                        autoCapitalize="none"
                        autoCorrect={false}
                        placeholder="Enter a password..."
                        placeholderTextColor='#53869d'
                        onChangeText={this.updatePassword}
                    ></TextInput>
                </View>

                <View style={s.fieldContainer}>
                    <View style={{ width: '80%', marginTop: 10 }}><Text style={{ color: 'white' }}>First Name</Text></View>
                    <TextInput
                        style={s.field}
                        autoCapitalize="none"
                        autoCorrect={false}
                        placeholder="Enter your first name..."
                        placeholderTextColor='#53869d'
                        onChangeText={this.updateFirstName}
                    ></TextInput>
                </View>

                <View style={s.fieldContainer}>
                    <View style={{ width: '80%', marginTop: 10 }}><Text style={{ color: 'white' }}>Surname</Text></View>
                    <TextInput
                        style={s.field}
                        autoCapitalize="none"
                        autoCorrect={false}
                        placeholder="Enter your surname..."
                        placeholderTextColor='#53869d'
                        onChangeText={this.updateLastName}
                    ></TextInput>

                    <View style={s.buttonContainer}>
                        <TouchableOpacity style={s.buttonStyle} onPress={this.registerUser}>
                            <Text style={s.buttonText}>Register</Text>
                        </TouchableOpacity>
                    </View>

                </View>


            </View>
        )
    }
}

export default Registration