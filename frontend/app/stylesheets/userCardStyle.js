'use strict'
import { StyleSheet } from 'react-native'

module.exports = StyleSheet.create({

    mainContainer: {
        padding: '2%',
    },
    userContainer: {
        padding: '2%',
        borderRadius: 5,
        borderColor: '#3D3D3D',
        borderWidth: 1,
        backgroundColor: '#121212',
        alignItems: 'center',
        flexDirection: 'row',
        marginTop: 8,
        marginBottom: 8,
    },
    userAvatar: {
        width: '10%',
        aspectRatio: 1
    },
    usernameContainer: {
        width: '46%',
        padding: '2%',
    },
    username:{
        color: '#FFFFFF',
        fontFamily: 'Roboto',
        fontSize: 15,
    },
    acceptDenyRequest: {
        width: '44%',
        flexDirection: 'row',
    },
    acceptButtonContainer: {
        width: '50%',
        alignItems: 'flex-start',
    },
    acceptButton: {
        borderWidth: 1,
        borderColor: '#2F7571',
        borderRadius: 5,
        padding: 8,
        width: '90%'
    },
    denyButtonContainer: {
        width: '50%',
        alignItems: 'center',
    },
    denyButton: {
        borderWidth: 1,
        borderColor: '#3D3D3D',
        borderRadius: 5,
        padding: 8,
        width: '90%'
    },
    buttonText: {
        color: '#FFFFFF',
        fontFamily: 'Roboto',
        fontSize: 14,
        textAlign: 'center'
    },
    singleButtonContainer: {
        width: '44%',
        alignItems: 'flex-end',
        paddingRight: '2%'
    },
    sendRequestButton: {
        width: '100%',
        padding: 8,
        borderWidth: 1,
        borderColor: '#2F7571',
        borderRadius: 5,
    },
    acceptRequestButton: {
        width: '100%',
        padding: 8,
        borderWidth: 1,
        borderColor: '#2F7571',
        backgroundColor: '#2F7571',
        borderRadius: 5,
    },
    requestSentButton: {
        width: '100%',
        padding: 8,
        borderWidth: 1,
        borderColor: '#3D3D3D',
        borderRadius: 5,
    },
    removeFriendButton: {
        minWidth: '80%',
        padding: 8,
        borderWidth: 1,
        borderColor: '#3D3D3D',
        borderRadius: 5,
    },
    
})