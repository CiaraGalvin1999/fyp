import React, { Component } from 'react'
import { View, Text } from 'react-native'

const styles = require('../stylesheets/mainStylesheet')

class Profile extends Component {
    //Constructor
    //States are set here
    constructor() {
        super();
    }


    render() {
        return (
            <View style={styles.container}>
                <View style={styles.pageTitleContainer}>
                    <Text style={styles.pageTitleText}> Profile </Text>
                </View>
            </View>
        )
    }
}

export default Profile