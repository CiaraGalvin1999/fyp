'use strict';
import { StyleSheet } from 'react-native';

module.exports = StyleSheet.create({
    buttonStyle: {
        width: '100%',
        height: 45,
        backgroundColor: '#28617B',
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 15,
    },
    buttonContainer: {
        width: '25%',
        marginTop: 15,
        marginLeft: 15,
    },
    allResultsContainer: {
        width: '100%',
        alignItems: 'center',
        justifyContent: 'center'
    },
    resultContainer: {
        backgroundColor: '#181818',
        width: '95%',
        marginBottom: 20,
        borderRadius: 5
    },
    summaryContainer: {
        paddingTop: 0,
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
        color: '#F3F8F2',
        paddingTop: 6,
        paddingBottom: 6
    },
    noCatalogues: {
        color: '#f3f8f2',
        padding: 10,
        paddingBottom: 16,
        textAlign: 'center',
        fontStyle: 'italic'
    },
    createCatalogueButton: {
        color: '#28617B',
        padding: 10,
        paddingTop: 0,
        textAlign: 'center'

    },
    headingText: {
        color: '#57a5c9',
        fontFamily: 'Roboto',
        fontSize: 16,
        paddingLeft: 6,
        paddingTop: 4,
    },
    subheadingText: {
        color: '#57a5c9',
        fontFamily: 'Roboto',
        paddingLeft: 6,
        paddingBottom: 1,
        opacity: 0.75
    },
    mainTextContainer: {
        backgroundColor: '#1f1f1f',
        borderBottomLeftRadius: 5,
        borderBottomRightRadius: 5,
        paddingBottom: 8,
        paddingTop: 6,
    },
    mainText: {
        color: '#F3F8F2',
        fontFamily: 'Roboto',
        paddingLeft: 6,
    },
    mainTextEmpty: {
        color: '#F3F8F2',
        fontFamily: 'Roboto',
        paddingLeft: 6,
        paddingTop: 10,
        paddingBottom: 10,
        fontStyle: 'italic',
        opacity: 0.75
    },
});