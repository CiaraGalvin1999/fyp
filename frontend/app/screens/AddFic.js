import React, { Component } from 'react';
import { View, Text, TextInput, TouchableOpacity } from 'react-native';
import helpers from '../components/helpers';

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

    //TODO: FINISH
    searchFics = async () => {
        let token = await helpers.getToken();
        let data = null
        try {
            const response = await fetch('http://10.0.2.2:8000/api/searchFic/?title=' + this.state.title + '&author=' + this.state.author, {
                method: 'GET',
                headers: {
                    'Authorization': 'Token ' + token,
                }
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
                data = JSON.parse(json)
                this.props.navigation.navigate('ShowFics', data)
                
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
                    <View style={styles.pageTitleContainer}>
                        <Text style={styles.pageTitleText}>Add Fanfiction</Text>
                    </View>
                </View>
                <View style={styles.spaceTop} />

                <View style={styles.fieldContainer}>
                    <TextInput
                        style={styles.field}
                        placeholder="Enter title..."
                        placeholderTextColor='#CBCBCB'
                        autoCorrect={false}
                        autoCapitalize="none"
                        onChangeText={this.updateTitle}
                    ></TextInput>
                </View>

                <View style={styles.fieldContainer}>
                    <TextInput
                        style={styles.field}
                        autoCapitalize="none"
                        autoCorrect={false}
                        placeholder="Enter author..."
                        placeholderTextColor='#CBCBCB'
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