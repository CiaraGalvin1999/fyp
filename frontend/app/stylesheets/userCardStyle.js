'use strict'
import { StyleSheet } from 'react-native'

module.exports = StyleSheet.create({
    userContainer: {
        margin: 10,
        marginTop: 16,
        borderRadius: 5,
        borderColor: '#3D3D3D',
        borderWidth: 1,
        backgroundColor: '#121212',
        alignItems: 'center',
        padding: 8,
        flexDirection: 'row'
    },
    userAvatar: {
        width: '12%',
        aspectRatio: 1,
    },
    usernameContainer: {
        width: '45%',
        padding: 8,
    },
    username:{
        color: '#FFFFFF',
        fontFamily: 'Roboto',
        fontSize: 15,
    },
    addOrRemoveFriendButton: {
        
    },
    acceptDenyRequest: {
        flexDirection: 'row',
        alignItems: 'flex-end',
    },
    acceptButton: {
        padding: 8,
        margin: 8,
        borderWidth: 1,
        borderColor: '#2F7571',
        borderRadius: 5,
    },
    denyButton: {
        padding: 8,
        margin: 8,
        borderWidth: 1,
        borderColor: '#3D3D3D',
        borderRadius: 5,
    },
    buttonText: {
        color: '#FFFFFF',
        fontFamily: 'Roboto',
        fontSize: 15,
    }
    /*
    userContainer: {
        flexDirection: 'row',
        padding: '2.5%',
    },
    userAvatar: {
        width: '12%',
        aspectRatio: 1,
    },
    usernameContainer: {
        width: '73%',
        paddingLeft: 12,
        justifyContent: 'center',
        alignItems: 'flex-start',
    },
    username:{
        color: '#FFFFFF',
        fontFamily: 'Roboto',
        fontSize: 16,
    },
    addOrRemoveFriendButton: {
        width:'15%',
        alignItems: 'flex-end',
        paddingRight: '2.5%',
        justifyContent: 'center'

    }
    */
})