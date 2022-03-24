'use strict';
import { StyleSheet } from 'react-native';

module.exports = StyleSheet.create({
    headerContainer:{
        width: '100%',
        flexDirection: 'row',
        paddingTop: 12,
        paddingBottom: 12,
        borderBottomWidth: 1,
        borderBottomColor: '#FFFFFF',
    },
    pageTitleContainer: {
        width: '60%',
        justifyContent: 'center',
        alignItems: 'flex-start',
        paddingLeft: 16,
        alignItems: 'center'
    },
    pageTitleText: {
        fontSize: 20,
        color: '#FFFFFF',
        fontFamily: 'Roboto',
    },
    buttonStyle: {
        backgroundColor: '#2F7571',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 10,
        marginLeft: 15,
        marginTop: 1.5
    },
    buttonContainer: {
        width: '20%',
    },
});