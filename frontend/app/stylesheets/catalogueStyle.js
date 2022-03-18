'use strict';
import { StyleSheet } from 'react-native';

module.exports = StyleSheet.create({
    catalogueTitle: {
        textAlign: 'center',
        fontSize: 20,
        color: '#F3F8F2',
        padding: 20,
        borderBottomWidth: 1,
        borderBottomColor: '#F3F8F2',
        fontFamily: 'Roboto',

    },
    ficContainer: {
        margin: 10,
        backgroundColor: '#181818',
        margin: 10,
        borderWidth: 1,
        borderColor: '#0f0f0f',
        borderRadius: 5


    },
    ficHeader: {
        padding: 6,
        borderBottomWidth: StyleSheet.hairlineWidth,
        borderColor: '#F3F8F2'
    },
    ficTitle: {
        color: '#57a5c9',
        fontFamily: 'Roboto',
        fontSize: 16,

    },
    ficAuthors: {
        color: '#57a5c9',
        fontFamily: 'Roboto',
        opacity: 0.75
    },
    summaryContainer: {
        padding: 6
    },
    ficSummary: {
        color: '#F3F8F2',
        fontFamily: 'Roboto'

    },
    ficSummaryEmpty: {
        color: '#F3F8F2',
        fontFamily: 'Roboto',
        fontStyle: 'italic',
        opacity: 0.75
    },
    noFics: {
        padding: 10,
        color: '#F3F8F2',
        fontStyle: 'italic',
        opacity: 0.75,
        textAlign: 'center'
    }

});