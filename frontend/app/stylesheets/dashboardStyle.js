'use strict'
import { StyleSheet } from 'react-native'

module.exports = StyleSheet.create({
    recentActivityContainer: {
        width: '100%',
        paddingLeft: '1%',
        paddingRight: '1%',
    },
    itemContainer: {
        padding: 16,
        borderTopWidth: 1,
        borderColor: '#3D3D3D',
    },
    userContainer: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        width: '100%',
        paddingBottom: 16,
        alignItems: 'center'
    },
    activityContainer: {
        width: '100%',
        flexDirection: 'row',
        flexWrap: 'wrap',
    },
    activityText: {
        color:'#FFFFFF', 
        fontFamily: 'Roboto',
        fontSize: 14,
        textAlign: 'left',
        lineHeight: 22,
    },
    activityIcon: {
        width: 30,
        justifyContent: 'center'
    },
    activityDescription: {
        flex: 1, // Fills width of remaining parent
        flexDirection: 'row',
        flexWrap: 'wrap',
    },
    avatar: {
        width: 25,
        height: 25,
    },
    usernameLink: {
        fontWeight: 'bold',
        fontSize: 15,
        paddingLeft: 8,
        color:'#FFFFFF', 
        fontFamily: 'Roboto',
    },
    catalogueLink: {
        color: '#5DCDE9',
    },
    linkText: {
        color: '#5DCDE9',
        fontStyle: 'italic',
    }
})