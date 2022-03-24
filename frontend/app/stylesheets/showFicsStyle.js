'use strict';
import { StyleSheet } from 'react-native';

module.exports = StyleSheet.create({
    buttonStyle: {
        width: '100%',
        backgroundColor: '#2F7571',
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 10,
        padding: 9.5,
        marginLeft: 15,
        marginTop: 14
    },
    buttonContainer: {
        width: '20%',
    },
    catalogueContainer1: {
        alignItems: 'center',
        justifyContent: 'center',
        height: 50
    },
    catalogueContainer2: {
        backgroundColor: '#2E3138',
        alignItems: 'center',
        justifyContent: 'center',
        height: 50
    },
    catalogueText: {
        fontSize: 14,
        color: '#FFFFFF',
        paddingTop: 6,
        paddingBottom: 6
    },
    noCatalogues: {
        color: '#FFFFFF',
        padding: 10,
        paddingBottom: 16,
        textAlign: 'center',
        fontStyle: 'italic'
    },
    createCatalogueButton: {
        color: '#2F7571',
        padding: 10,
        paddingTop: 0,
        textAlign: 'center'

    },
});