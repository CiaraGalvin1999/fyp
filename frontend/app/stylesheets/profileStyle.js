'use strict'
import { StyleSheet } from 'react-native'

module.exports = StyleSheet.create({
    headerContainer: {
        flexDirection: 'row',
        paddingTop: 20,
        paddingBottom: 20,
        borderBottomWidth: 1,
        borderBottomColor: '#FFFFFF',
    },
    addFriendsButton:{
        width: '15%',
        alignItems: 'flex-start',
        paddingLeft: 10,
    },
    settingsButton:{
        width: '15%',
        alignItems: 'flex-end',
        paddingRight: 10,
    },
    pageTitleContainer: {
        width: '70%',
        justifyContent: 'center',
        alignItems: 'center',
    },
    pageTitleText: {
        fontSize: 20,
        color: '#FFFFFF',
        fontFamily: 'Roboto',
    },
    profileContainer: {
        paddingTop: 20,
        paddingBotom: 20,
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
        width: '100%',
        flexDirection: 'row',
        justifyContent: 'center',
    },
    count: {
        padding: 16,
        paddingTop: 6,
        color: '#FFFFFF',
    },
    countText: {
        color: '#FFFFFF',
        fontSize: 14,
        fontFamily: 'Roboto',
        textAlign: 'center',
        lineHeight: 22,
    },
    aboutContainer: {
        paddingBottom: 20,
        paddingLeft: 8,
        borderBottomWidth: StyleSheet.hairlineWidth,
        borderBottomColor: '#FFFFFF',
        alignItems: 'center',
    },
    aboutText: {
        color: '#FFFFFF',
        fontSize: 14,
        fontFamily: 'Roboto',
        textAlign: 'center',
        opacity: 0.85,
    },
    catalogueSectionTitle: {
        color:'#FFFFFF', 
        padding: 8,
        fontFamily: 'Roboto',
        fontSize: 15,
        textAlign: 'center',
    },
    cataloguesContainer: {
        flexDirection: 'row',
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
        margin: 6

    },
    catalogueTitle: {
        color: '#FFFFFF',
        textAlign: 'center'
    }
})