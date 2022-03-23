'use strict';
import { StyleSheet } from 'react-native';

module.exports = StyleSheet.create({
    headerContainer:{
        flexDirection: 'row',
        paddingTop: 12,
        paddingBottom: 12,
        borderBottomWidth: 1,
        borderBottomColor: '#F3F8F2',
    },
    pageTitleContainer: {
        width: '70%',
        justifyContent: 'center',
        alignItems: 'flex-start',
        marginLeft: '7%',
        marginRight: '5%',
    },
    pageTitleText: {
        fontSize: 20,
        color: '#F3F8F2',
        fontFamily: 'Roboto',
    },
    buttonStyle: {
        width: '100%',
        backgroundColor: '#28617B',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 10,
        marginLeft: 15,
        marginTop: 1.5
    },
    buttonContainer: {
        width: '20%',
    },
});