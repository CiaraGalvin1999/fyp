import React, { Component } from 'react';
import { View, Text } from 'react-native';

const styles = require('../stylesheets/mainStylesheet');

class Dashboard extends Component {
    //Constructor
    //States are set here
    constructor() {
        super();
    }

    render() {
        return (
            <View style={styles.container}>
                <Text style={{color:'#F3F8F2'}}> Dashboard! </Text>
            </View>
        )
    }
}

export default Dashboard