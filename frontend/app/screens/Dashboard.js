import React, { Component } from 'react'
import { View, Text } from 'react-native'

const styles = require('../stylesheets/mainStylesheet')

class Dashboard extends Component {
    //Constructor
    //States are set here
    constructor() {
        super();
    }

    render() {
        return (
            <View style={styles.container}>
                 <View style={styles.headerContainer}>
                    <View style={styles.pageTitleContainer}>
                        <Text style={styles.pageTitleText}>Dashboard</Text>
                    </View>
                </View>
            </View>
        )
    }
}

export default Dashboard