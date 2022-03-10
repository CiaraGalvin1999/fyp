import React, { Component } from 'react';
import { View, Text, TextInput, TouchableOpacity } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const styles = require('../stylesheets/mainStylesheet');

class AddFic extends Component {
    //Constructor
    //States are set here
    constructor() {
        super();

        this.state = {
            title: '',
            author: '',
        }
    }

    //Functions that update each state as the search form is filled in
    updateTitle = (value) => {
        this.setState({ title: value })
    }
    updateAuthor = (value) => {
        this.setState({ author: value })
    }

    async getToken() {
        try {
            let item = await AsyncStorage.getItem('token');
            let json_token = JSON.parse(item);
            return json_token.token;

        } catch (error) {
            console.log("Something went wrong", error);
        }
    }

    //TODO: FINISH
    searchFics = async () => {
        let token = await this.getToken();

        fetch('http://10.0.2.2:8000/api/searchFic/?title=' + this.state.title + '&author=' + this.state.author, {
            method: 'GET',
            headers: {
                'Authorization': 'Token ' + token,
            }
        })
            .catch(function (error) {
                console.log("Error: " + error);
            })
            .then(response => response.json())
            .then(data => {
                this.props.navigation.navigate('ShowFics', data)
            });
    }


    render() {
        return (
            <View style={styles.container}>

                <View style={styles.spaceTop} />

                <View style={styles.fieldContainer}>
                    <View style={{ width: '80%', marginTop: 10 }}><Text style={{ color: 'white' }}>Title</Text></View>
                    <TextInput
                        style={styles.field}
                        placeholder="Enter title..."
                        placeholderTextColor='#53869d'
                        autoCorrect={false}
                        autoCapitalize="none"
                        onChangeText={this.updateTitle}
                    ></TextInput>
                </View>

                <View style={styles.fieldContainer}>
                    <View style={{ width: '80%', marginTop: 10 }}><Text style={{ color: 'white' }}>Author</Text></View>
                    <TextInput
                        style={styles.field}
                        autoCapitalize="none"
                        autoCorrect={false}
                        placeholder="Enter author..."
                        placeholderTextColor='#53869d'
                        onChangeText={this.updateAuthor}
                    ></TextInput>

                    <View style={styles.buttonContainer}>
                        <TouchableOpacity style={styles.buttonStyle} onPress={this.searchFics}>
                            <Text style={styles.buttonText}>Search</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </View>
        )
    }
}

export default AddFic