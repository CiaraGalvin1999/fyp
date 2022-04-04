'use strict';
import { StyleSheet } from 'react-native';

module.exports = StyleSheet.create({
    container: {
        backgroundColor: '#0A0A0A',
        flex: 1,
    },
    headerContainer: {
        width: '100%',
        flexDirection: 'row',
        paddingTop: 12,
        paddingBottom: 12,
        borderBottomWidth: 1,
        borderBottomColor: '#FFFFFF',
    },
    leftButton: {
        width: '15%',
        alignItems: 'flex-start',
        paddingLeft: '4%',
    },
    rightButton: {
        width: '15%',
        alignItems: 'flex-end',
        paddingRight: '4%',
    },
    pageTitleContainer: {
        width: '100%',
        justifyContent: 'center',
        alignItems: 'flex-start',
        paddingLeft: 16,
        alignItems: 'center'
    },
    containsLeftButton: {
        width: '70%',
    },
    pageTitleText: {
        fontSize: 18,
        color: '#FFFFFF',
        fontFamily: 'Roboto',
        textAlign: 'center'
    },
    pageSubtitleText: {
        fontSize: 16,
        color: '#FFFFFF',
        fontFamily: 'Roboto',
        textAlign: 'center',
        opacity: 0.75,
        fontStyle: 'italic',
    },
    loadingView: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#0A0A0A'
    },
    spaceTop: {
        height: 16,
    },
    logoContainer: {
        justifyContent: 'center',
    },
    logo: {
        width: 160,
        height: 160,
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
        width: '70%',
        borderColor: '#CBCBCB',
        borderBottomWidth: 1,
        fontSize: 14,
        color: '#FFFFFF',
        margin: 16,
        marginTop: 8,
    },
    buttonStyle: {
        minWidth: '60%',
        height: 45,
        borderWidth: 1,
        borderColor: '#2F7571',
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 15,
        borderRadius: 5,
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
        width: '80%',
        color: '#FF6C0A',
        alignSelf: 'center',
        textAlign: 'center',
    },
    // When there are no results for a fanfic, no fanfics in a catalogue, no catalogues, no summary, etc.
    emptyMessage: {
        padding: 10,
        color: '#FFFFFF',
        fontStyle: 'italic',
        opacity: 0.75,
        textAlign: 'center'
    },
    updatedSuccessfullyContainer: {
        width: '100%',
        alignItems: 'center'
    },
    updatedSuccessfullyMessage: {
        width: '80%',
        fontFamily: 'Roboto',
        color: '#FFFFFF',
        fontSize: 16,
    }
});