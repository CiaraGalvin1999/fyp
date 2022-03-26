'use strict';
import { StyleSheet } from 'react-native';

module.exports = StyleSheet.create({
    allCataloguesContainer: {
        width: '100%',
        alignItems: 'center',
        justifyContent: 'center'
    },
    catalogueContainer: {
        backgroundColor: '#121212',
        width: '95%',
        paddingTop: 20,
        paddingBottom: 20,
        marginBottom: 20,
        borderRadius: 5,
        borderWidth: 1,
        borderColor: '#3D3D3D',
    },
    buttonStyle: {
        width: '95%',
        height: 40,
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 15,
        borderRadius: 5,
        borderWidth: 1,
        borderColor:'#2F7571'
    },
    buttonContainer: {
        width: '100%',
        alignItems: 'center',
        justifyContent: 'center',
        paddingTop: 16
    },
    catalogueTitle: {
        color: '#FFFFFF',
        textAlign: 'center',
        fontSize: 16,
    }
});