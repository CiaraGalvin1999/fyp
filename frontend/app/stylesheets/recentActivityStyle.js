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
        borderColor: '#3D3D3D',
        borderTopWidth:1,
        paddingTop: 16
    },
    activityText: {
        color: '#FFFFFF',
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
    catalogueLink: {
        color: '#5DCDE9',
    },
    linkText: {
        color: '#5DCDE9',
        fontStyle: 'italic',
    }
})
