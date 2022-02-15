import React, { Component } from 'react';
import { View, TextInput, Button } from 'react-native';


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
    registerUser = () => {
        console.log("User is being registered");
        console.log(this.state.username);
        console.log(this.state.email);
        console.log(this.state.password);
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
            <View>
                <View>
                    <TextInput
                        placeholder="Username"
                        autoCorrect={false}
                        autoCapitalize="none"
                        onChangeText={this.updateUsername}
                    ></TextInput>
                </View>
                <View>
                    <TextInput
                        placeholder="Email Address"
                        autoCorrect={false}
                        autoCapitalize="none"
                        onChangeText={this.updateEmail}
                    ></TextInput>
                </View>
                <View>
                    <TextInput
                        secureTextEntry
                        autoCapitalize="none"
                        autoCorrect={false}
                        placeholder="Password"
                        onChangeText={this.updatePassword}
                    ></TextInput>
                </View>
                <View>
                    <TextInput
                        autoCapitalize="none"
                        autoCorrect={false}
                        placeholder="First Name"
                        onChangeText={this.updateFirstName}
                    ></TextInput>
                </View>
                <View>
                    <TextInput
                        autoCapitalize="none"
                        autoCorrect={false}
                        placeholder="Last Name"
                        onChangeText={this.updateLastName}
                    ></TextInput>
                </View>
                <Button title='Register' onPress={this.registerUser} />
            </View>
        )
    }

}

export default Registration