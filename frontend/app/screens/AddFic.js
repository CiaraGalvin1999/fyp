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
                <View style={styles.headerContainer}>
                    <View style={styles.pageTitleContainer}>
                        <Text style={styles.pageTitleText}>Add Fanfiction</Text>
                    </View>
                </View>
                <View style={styles.spaceTop}/>

                <View style={styles.fieldContainer}>
                    <View style={{ width: '80%', marginTop: 10 }}><Text style={styles.fieldTitle}>Title</Text></View>
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
                    <View style={{ width: '80%', marginTop: 10 }}><Text style={styles.fieldTitle}>Author</Text></View>
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