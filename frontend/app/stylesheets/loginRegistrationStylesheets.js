'use strict';
import { StyleSheet } from 'react-native';

module.exports = StyleSheet.create({
    container: {
        backgroundColor: '#202226',
        height: '100%',
    },
    spaceTop: {
        height: '8%',
    },
    logoContainer: {
        justifyContent: 'center',
    },
    logo: {
        width: 180,
        height: 180,
        alignSelf: 'center',
    },
    fieldContainer: {
        alignItems: 'center',
    },
    field: {
        width: '80%',
        borderColor: '#53869d',
        borderBottomWidth: 1,
        color: 'white',
    },
    buttonStyle: {
        width: '60%',
        height: 45,
        backgroundColor: '#53869d',
        borderWidth: 1,
        borderColor: '#53869d',
        alignItems: 'center',
        justifyContent: 'center',
    },
    buttonContainer: {
        width: '80%',
        marginTop: 15,
        alignItems:'center',
    },
    buttonText: {
        color: 'white',
        fontSize: 16,
        fontWeight: 'bold',
    }
});