'use strict'
import { StyleSheet } from 'react-native'

module.exports = StyleSheet.create({
    ficContainer: {
        margin: 10,
        borderRadius: 5,
        borderColor: '#3D3D3D',
        borderWidth: 1,
        backgroundColor: '#121212'
    },
    ficContainerPressed: {
        backgroundColor: '#404040'
    },
    ficHeader: {
        padding: 6,
    },
    ficTitle: {
        color: '#FFFFFF',
        fontWeight: 'bold',
        fontFamily: 'Roboto',
        fontSize: 18,
        textAlign: 'center'
    },
    ficAuthors: {
        color: '#FFFFFF',
        fontFamily: 'Roboto',
        fontSize: 15,
        opacity: 0.9,
        textAlign: 'center'
    },
    summaryContainer: {
        padding: 6
    },
    ficSummary: {
        color: '#FFFFFF',
        fontFamily: 'Roboto',
        fontSize: 15,
        textAlign: 'center',
    },
    ficSummaryEmpty: {
        color: '#FFFFFF',
        fontFamily: 'Roboto',
        fontStyle: 'italic',
        opacity: 0.95,
        paddingTop: 16,
        paddingBottom: 16,
        textAlign: 'center',
    },
    ficFooter: {
        padding: 6,
    },
    openFicLink: {
        color: '#5DCDE9',
        // color: '#FF6C0A', -> orange option
        textDecorationLine: 'underline',
        fontSize: 14,
        textAlign: 'center'
    },
});