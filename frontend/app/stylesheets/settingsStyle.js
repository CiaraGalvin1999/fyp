'use strict'
import { StyleSheet } from 'react-native'

module.exports = StyleSheet.create({
    buttonText: {
        color: '#FFFFFF',
        fontFamily: 'Roboto',
        fontSize: 14,
        textAlign: 'left'
    },
    buttonContainer: {
        width: '100%',
        padding: 8,
        paddingTop: 16,
        flexDirection: 'row',
    },
    button: {
        width: '80%',
    },
    changePageIcon: {
        width: '20%',
        alignItems: 'flex-end'
    },
})