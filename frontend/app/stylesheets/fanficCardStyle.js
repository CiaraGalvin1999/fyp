'use strict';
import { StyleSheet } from 'react-native';

module.exports = StyleSheet.create({
    ficContainer: {
        margin: 10,
        backgroundColor: '#181818',
        margin: 10,
        borderRadius: 5
    },
    ficContainerPressed: {
        backgroundColor: '#404040'
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
});