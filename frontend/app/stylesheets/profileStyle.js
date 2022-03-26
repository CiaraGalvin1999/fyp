'use strict'
import { StyleSheet } from 'react-native'

module.exports = StyleSheet.create({
    profileContainer: {
        paddingTop: 16,
        paddingBottom: 8,
        alignItems: 'center',
    },
    avatar: {
        width: 120,
        height: 120,
    },
    username: {
        padding: 8,
        color: '#FFFFFF',
        fontSize: 16,
        fontFamily: 'Roboto',
    },
    infoContainer: {
        flexDirection: 'row',
        justifyContent: 'center',
    },
    count: {
        minWidth: '25%',
        padding: 16,
        paddingTop: 0,
        color: '#FFFFFF',
        alignItems: 'center',
        justifyContent: 'center'
    },
    countText: {
        color: '#FFFFFF',
        fontSize: 14,
        fontFamily: 'Roboto',
        textAlign: 'center',
        lineHeight: 22,
    },
    aboutContainer: {
        paddingBottom: 16,
        paddingLeft: 8,
        paddingRight: 8,
        alignItems: 'center',
    },
    aboutText: {
        color: '#FFFFFF',
        fontSize: 14,
        fontFamily: 'Roboto',
        textAlign: 'center',
        opacity: 0.85,
    },
    sectionTitle: {
        color:'#FFFFFF', 
        padding: 8,
        paddingBottom: 12,
        fontFamily: 'Roboto',
        fontSize: 15,
        textAlign: 'center',
    },
    cataloguesContainer: {
        flexDirection: 'row',
        paddingLeft: '1%',
    },
    catalogueContainer: {
        width: 120,
        height: 100,
        borderRadius: 5,
        borderColor: '#3D3D3D',
        borderWidth: 1,
        backgroundColor: '#121212',
        justifyContent: 'center',
        padding: 6,
        marginRight: 6,

    },
    catalogueTitle: {
        color: '#FFFFFF',
        textAlign: 'center'
    },
    buttonContainer: {
        alignItems: 'center',
        justifyContent: 'center',
        paddingTop: 16,
        paddingBottom: 16,
    },
    buttonStyle: {
        width: '98%',
        paddingLeft: '1%',
        paddingRight: '1%',
        height: 40,
        borderWidth: 1,
        borderColor: '#2F7571',
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 5,
    }
})

