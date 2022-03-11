'use strict';
import { StyleSheet } from 'react-native';
import { withSafeAreaInsets } from 'react-native-safe-area-context';

module.exports = StyleSheet.create({
    buttonStyle: {
        width: '100%',
        height: 45,
        backgroundColor: '#53869d',
        borderColor: '#53869d',
        borderWidth: 1,
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
    authorText: {
        color: '#57a5c9',
        fontFamily: 'Roboto',
        paddingLeft: 6,
        paddingBottom: 1,
        opacity: 0.75
    },
    titleText: {
        color: '#57a5c9',
        fontFamily: 'Roboto',
        fontSize: 17,
        paddingLeft: 6,
        paddingTop: 2
    },
    summaryText: {
        color: '#F3F8F2',
        backgroundColor: '#1f1f1f',
        fontFamily: 'Roboto',
        paddingLeft: 6,
        borderBottomLeftRadius: 5,
        borderBottomRightRadius: 5,
        minHeight: 50,
    },
    summaryTextEmpty: {
        color: '#F3F8F2',
        backgroundColor: '#1f1f1f',
        fontFamily: 'Roboto',
        paddingLeft: 6,
        borderBottomLeftRadius: 5,
        borderBottomRightRadius: 5,
        minHeight: 50,
        fontStyle: 'italic',
        opacity: 0.75
    }

});