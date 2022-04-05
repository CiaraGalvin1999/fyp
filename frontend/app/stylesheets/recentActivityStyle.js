'use strict'
import { StyleSheet } from 'react-native'

module.exports = StyleSheet.create({
    recentActivityContainer: {
        width: '100%',
        paddingLeft: '1%',
        paddingRight: '1%',
    },
    activityContainer: {
        width: '100%',
        flexDirection: 'row',
        flexWrap: 'wrap',
        paddingBottom: 16,
        paddingTop: 8
    },
    activityText: {
        color:'#FFFFFF', 
        fontFamily: 'Roboto',
        fontSize: 14,
        textAlign: 'left',
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
    catalogueLink: {
        color: '#F9B9F2'
    }
})

