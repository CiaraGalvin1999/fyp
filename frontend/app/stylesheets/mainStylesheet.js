'use strict';
import { StyleSheet } from 'react-native';

module.exports = StyleSheet.create({
    container: {
        backgroundColor: '#0A0A0A',
        flex: 1,
    },
    pageTitleContainer: {
        padding: 20,
        borderBottomWidth: 1,
        borderBottomColor: '#FFFFFF',
        justifyContent: 'center',
    },
    pageTitleText: {
        textAlign: 'center',
        fontSize: 20,
        color: '#FFFFFF',
        fontFamily: 'Roboto',
    },
    loadingView: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#0A0A0A'
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
    fieldTitle: {
        color: '#FFFFFF',
        fontSize: 15,
        fontFamily: 'Roboto'
    },
    field: {
        width: '80%',
        borderColor: '#CBCBCB',
        borderBottomWidth: 1,
        fontSize: 14,
        color: '#FFFFFF'
    },
    buttonStyle: {
        minWidth: '60%',
        height: 45,
        backgroundColor: '#2F7571',
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 15,
    },
    buttonContainer: {
        width: '80%',
        marginTop: 15,
        alignItems: 'center',
    },
    buttonText: {
        color: '#FFFFFF',
        fontSize: 16,
        fontWeight: 'bold',
    },
    textInputTitle: {
        color: '#FFFFFF',
        paddingLeft: 4,
        paddingTop: 4,
    },
    required: {
        color: '#FF6C0A',
    },
    redirectText: {
        margin: 5,
        color: '#FFFFFF',
    },
    linkText: {
        color: '#5DCDE9',
    },
    modalContent: {
        flex: 1,
        justifyContent: 'center',
        margin: '5%',
    },
    modalOverlay: {
        position: 'absolute',
        top: 0,
        bottom: 0,
        left: 0,
        right: 0,
        backgroundColor: 'rgba(0,0,0,0.9)'
    },
    modalMain: {
        backgroundColor: '#121212',
    },
    modalHeader: {
        backgroundColor: '#121212',
        paddingTop: 10,
        paddingBottom: 10,
        borderBottomWidth: StyleSheet.hairlineWidth,
        borderBottomColor: '#FFFFFF'

    },
    modalHeaderText: {
        color: '#FFFFFF',
        fontSize: 16,
        textAlign: 'center'
    },
    modalMainContent: {
        maxHeight: 250,
    },
    modalFooter: {
        flexDirection: 'row',
    },
    modalHalfButton: {
        width: '50%',
        height: 40,
        backgroundColor: '#2F7571',
        alignItems: 'center',
        justifyContent: 'center',
    },
    modalFullButton: {
        width: '100%',
        height: 40,
        backgroundColor: '#2F7571',
        alignItems: 'center',
        justifyContent: 'center',
    },
    modalCloseButton: {
        width: '50%',
        height: 40,
        backgroundColor: '#0A0A0A',
        alignItems: 'center',
        justifyContent: 'center',
    },
    requiredErrorMessage: {
        paddingTop: 8,
        paddingLeft: 4,
        color: '#FF6C0A',
    },
    // When there are no results for a fanfic, no fanfics in a catalogue, no catalogues, no summary, etc.
    emptyMessage: {
        padding: 10,
        color: '#FFFFFF',
        fontStyle: 'italic',
        opacity: 0.75,
        textAlign: 'center'
    },
});