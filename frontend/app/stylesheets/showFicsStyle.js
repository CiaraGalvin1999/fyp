'use strict';
import { StyleSheet } from 'react-native';

module.exports = StyleSheet.create({
    catalogueContainer: {
        alignItems: 'center',
        justifyContent: 'center',
        paddingTop: 16,
        paddingBottom: 16,
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