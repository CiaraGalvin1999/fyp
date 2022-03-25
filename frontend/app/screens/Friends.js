import React, { Component } from 'react'
import { View, Text, TouchableOpacity, ScrollView, ActivityIndicator} from 'react-native'
import helpers from '../components/helpers'

const styles = require('../stylesheets/mainStylesheet')
const pageStyle = require('../stylesheets/friendsStyle')

class Friends extends Component {
    //Constructor
    //States are set here
    constructor() {
        super();

        this.state = {
            friends: [],
            isLoading: true,
        }
    }

    async getFriends() {
        // Gets token associated with user
        let token = await helpers.getToken();

        // GET request - requests catalogues from db for logged in user
        fetch('http://10.0.2.2:8000/api/getFriends', {
            method: 'GET',
            headers: {
                'Authorization': 'Token ' + token,
            }
        })
            // Catches errors
            .catch(function (error) {
                console.log("Error: " + error);
            })
            // Finds json data in response
            .then(response => response.json())
            .then(data => JSON.parse(data))
            .then(data => {
                this.setState({ friends: data, isLoading: false })
                console.log(this.state.friends)
            });
    }

    async componentDidMount() {
        this.getFriends()
    }



    render() {
        if (this.state.isLoading) {
            return (
                <View style={styles.loadingView}>
                    <ActivityIndicator size='large' />
                </View>
            )
        }
        else
            return (
                <View style={styles.container}>

                    <View style={pageStyle.headerContainer}>
                        <TouchableOpacity
                            style={pageStyle.buttonStyle}
                            onPress={() => this.props.navigation.goBack()}
                        >
                            <Text style={styles.buttonText}>Back</Text>
                        </TouchableOpacity>
                        <View style={pageStyle.pageTitleContainer}>
                            <Text style={styles.pageTitleText}>Friends</Text>
                        </View>
                    </View>




                    <ScrollView>
                        <Text style={{color:'white'}}>hello</Text>
                    </ScrollView>
                </View>
            )
    }
}

export default Friends