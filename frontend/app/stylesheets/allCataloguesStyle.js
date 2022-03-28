'use strict';
import { StyleSheet } from 'react-native';

module.exports = StyleSheet.create({
    allCataloguesContainer: {
        width: '100%',
        alignItems: 'center',
        justifyContent: 'center'
    },
    catalogueContainer: {
        width: '100%',
        padding: 8,
        paddingTop: 16,
        paddingBottom: 16,
        flexDirection: 'row',
    },
    buttonContainer: {
        width: '100%',
        alignItems: 'center',
        justifyContent: 'center',
        paddingTop: 16
    },
    title: {
        width: '70%'
    },
    titleText: {
        color: '#FFFFFF',
        fontFamily: 'Roboto',
        fontSize: 14,
        textAlign: 'left'
    },
    buttonsContainer: {
        width: '30%',
        flexDirection: 'row-reverse',
    },
    deleteCatalogueButton: {
        paddingRight: 8,
    },
    changePageIcon: {
        paddingRight: 8,
    },
    buttonStyle: {
        width: '95%',
        height: 40,
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 12,
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
});


