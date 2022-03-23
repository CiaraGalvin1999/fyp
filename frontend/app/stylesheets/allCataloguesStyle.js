'use strict';
import { StyleSheet } from 'react-native';

module.exports = StyleSheet.create({
    allCataloguesContainer: {
        width: '100%',
        alignItems: 'center',
        justifyContent: 'center'
    },
    catalogueContainer: {
        backgroundColor: '#181818',
        width: '95%',
        paddingTop: 20,
        paddingBottom: 20,
        marginBottom: 20,
        borderRadius: 5,
        borderWidth: 1,
    },
    buttonStyle: {
        width: '95%',
        height: 45,
        backgroundColor: '#28617B',
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 15,
    },
    buttonContainer: {
        width: '100%',
        alignItems: 'center',
        justifyContent: 'center',
        paddingTop: 16
    },
    catalogueTitle: {
        color: '#f3f8f2',
        textAlign: 'center',
        fontSize: 16,
    }
});