'use strict';
import { StyleSheet } from 'react-native';

module.exports = StyleSheet.create({
    container: {
        backgroundColor: '#121212',
        flex: 1,
    },
    pageTitleContainer: {
        padding: 20,
        borderBottomWidth: 1,
        borderBottomColor: '#F3F8F2',
        justifyContent: 'center',
    },
    pageTitleText: {
        textAlign: 'center',
        fontSize: 20,
        color: '#F3F8F2',
        fontFamily: 'Roboto',
    },
    loadingView: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#121212'
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
        borderColor: '#57a5c9',
        borderBottomWidth: 1,
        color: '#F3F8F2',
    },
    buttonStyle: {
        minWidth: '60%',
        height: 45,
        backgroundColor: '#28617B',
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
        color: '#F3F8F2',
        fontSize: 16,
        fontWeight: 'bold',
    },
    textInputTitle: {
        color: '#F3F8F2',
        paddingLeft: 4,
        paddingTop: 4,
    },
    required: {
        color: '#52FFB8',
    },
    redirectText: {
        margin: 5,
        color: '#F3F8F2',
    },
    linkText: {
        color: '#57a5c9',
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
        backgroundColor: '#202226',
    },
    modalHeader: {
        backgroundColor: '#202226',
        paddingTop: 10,
        paddingBottom: 10,
        borderBottomWidth: StyleSheet.hairlineWidth,
        borderBottomColor: '#F3F8F2'

    },
    modalHeaderText: {
        color: '#F3F8F2',
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
        backgroundColor: '#28617B',
        alignItems: 'center',
        justifyContent: 'center',
    },
    modalFullButton: {
        width: '100%',
        height: 40,
        backgroundColor: '#28617B',
        alignItems: 'center',
        justifyContent: 'center',
    },
    modalCloseButton: {
        width: '50%',
        height: 40,
        backgroundColor: '#181818',
        alignItems: 'center',
        justifyContent: 'center',
    },
    requiredErrorMessage: {
        paddingTop: 8,
        paddingLeft: 4,
        color: '#52FFB8',
    },
    // When there are no results for a fanfic, no fanfics in a catalogue, no catalogues, no summary, etc.
    emptyMessage: {
        padding: 10,
        color: '#F3F8F2',
        fontStyle: 'italic',
        opacity: 0.75,
        textAlign: 'center'
    },
});