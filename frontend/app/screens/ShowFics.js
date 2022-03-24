// Imports
import React, { Component } from 'react'
import { Pressable, View, Text, TouchableOpacity, Modal, TouchableWithoutFeedback, ActivityIndicator } from 'react-native'
import { ScrollView } from 'react-native-gesture-handler'
import helpers from '../components/helpers';
// Stylesheets
const styles = require('../stylesheets/mainStylesheet')
const pageStyle = require('../stylesheets/showFicsStyle')
const ficCardStyle = require('../stylesheets/fanficCardStyle')

class ShowFics extends Component {
    //Constructor
    //States are set here
    constructor() {
        super();
        this.state = {
            // After user searches, they choose a fanfic to add to a catalogue
            selectedFic: null,
            // If true, modal is visible. If false, modal is invisible
            selectCatalogueModalVisible: false,
            // Catalogues to choose from
            catalogues: [],
            // isLoading if catalogues are still being retrieved from the db
            isLoading: false,
        }
    }

    async getCatalogues() {
        // Gets token associated with user
        let token = await helpers.getToken();

        // GET request - requests catalogues from db for logged in user
        fetch('http://10.0.2.2:8000/api/getCatalogues', {
            method: 'GET',
            headers: {
                'Authorization': 'Token ' + token,
            }
        })
            // Catches errors
            .catch(function (error) {
                console.log("Error: " + error);
            })
            // Finds json data in response
            .then(response => response.json())
            // Saves catalogues to state and changes isLoading boolean to false
            .then(data => {
                this.setState({ catalogues: JSON.parse(data), isLoading: false })
            });
    }


    openSelectCatalogueModal(fic) {
        // Save chosen fic and open modal
        this.setState({ selectedFic: fic, selectCatalogueModalVisible: true, isLoading: true })
        // Get user's catalogues from db
        this.getCatalogues()
    }

    // Close modal makes modal invisible
    // ID of chosen fanfic is made null
    closeModal() {
        this.setState({ selectCatalogueModalVisible: false, selectedFic: null })
    }

    // TO FINISH
    catalogueFic = async (catalogueID) => {
        let token = await helpers.getToken()
        workid = this.state.selectedFic.id
        title = this.state.selectedFic.title
        authors = this.state.selectedFic.authors
        summary = this.state.selectedFic.summary

        fetch('http://10.0.2.2:8000/api/addFic/', {
            method: 'POST',
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json',
                'Authorization': 'Token ' + token,
            },
            body: JSON.stringify({
                'workid': workid,
                'title': title,
                'summary': summary,
                'authors': authors,
                'catalogueID': catalogueID,
            })
        })
            .then(this.setState({ selectedFic: null, selectCatalogueModalVisible: false }))
            .catch(function (error) {
                console.log("Error: " + error);
            });
    }

    render() {
        // Fics that are sent from previous screen - i.e., AddFic
        results = JSON.parse(this.props.route.params)

        return (
            <View style={styles.container}>
                {/* Modal for showing catalogues - opened when user selects a fanfiction button */}
                <Modal
                    visible={this.state.selectCatalogueModalVisible}
                    animationType="slide"
                    transparent={true}
                    onRequestClose={() => this.setState({ selectCatalogueModalVisible: false })}
                >
                    {/* Allows for modal to be closed when user clicks area outside modal */}
                    <TouchableWithoutFeedback onPress={() => this.closeModal()}>
                        <View style={styles.modalOverlay} />
                    </TouchableWithoutFeedback>

                    <View style={styles.modalContent}>
                        <View style={styles.modalMain}>

                            {/* Loading circle while getting catalogues */}
                            {this.state.isLoading &&
                                <View style={styles.loadingView}>
                                    <ActivityIndicator size='large' />
                                </View>}
                            {/* Loading circle disappears once catalogues are retrieved - displays catalogues */}
                            {!this.state.isLoading &&
                                <View>
                                    {/* Modal Header */}
                                    <View style={styles.modalHeader}>
                                        <Text style={styles.modalHeaderText}>Choose catalogue</Text>
                                    </View>

                                    {/* Catalogue titles */}
                                    <ScrollView style={styles.modalMainContent}>
                                        {this.state.catalogues.length == 0 && !this.state.isLoading &&
                                            <View>
                                                <Text style={pageStyle.noCatalogues}> You have no catalogues </Text>
                                                <TouchableOpacity
                                                    onPress={() => this.props.navigation.navigate('authNav', { screen: 'Catalogue' })}>
                                                    <Text style={pageStyle.createCatalogueButton}>Create a catalogue here</Text>
                                                </TouchableOpacity>
                                            </View>

                                        }
                                        {this.state.catalogues.length > 0 && !this.state.isLoading && (this.state.catalogues).map((catalogue, index) => (
                                            <TouchableOpacity
                                                key={catalogue.id}
                                                onPress={() => this.catalogueFic(catalogue.id)}
                                                style={index % 2 == 1 && pageStyle.catalogueContainer1 || index % 2 == 0 && pageStyle.catalogueContainer2}
                                            >
                                                <Text style={pageStyle.catalogueText}>{catalogue.title} </Text>
                                            </TouchableOpacity>
                                        ))}
                                    </ScrollView>

                                    {/* Modal footer - contains close button to cancel add fic to catalogue */}
                                    <View style={styles.modalFooter}>
                                        <TouchableOpacity
                                            style={styles.modalFullButton}
                                            onPress={() => this.closeModal()}
                                        >
                                            <Text style={styles.buttonText}>Cancel</Text>
                                        </TouchableOpacity>
                                    </View>
                                </View>
                            }
                        </View>
                    </View>
                </Modal>
                {/* Back button to go back to search screen (i.e., AddFic) */}
                <View style={pageStyle.buttonContainer}>
                    <TouchableOpacity
                        style={pageStyle.buttonStyle}
                        onPress={() => this.props.navigation.goBack()}
                    >
                        <Text style={styles.buttonText}>Back</Text>
                    </TouchableOpacity>
                </View>

                {/* Displays fanfics from search on previous screen */}
                <ScrollView>
                    {results.length == 0 && <Text style={styles.emptyMessage}>There are no results. Try search again with different parameters!</Text>}
                    {results.length > 0 && results.map((res) => (
                        <Pressable
                            key={res.id}
                            style={({ pressed }) => [ficCardStyle.ficContainer, pressed && ficCardStyle.ficContainerPressed]}
                            onPress={() => this.openSelectCatalogueModal(res)}
                        >
                            <View style={ficCardStyle.ficHeader}>
                                {/* Title of fic*/}
                                <Text style={ficCardStyle.ficTitle}>{res.title} </Text>
                                {/* Authors of fic */}
                                {res.authors.map((author, index) => (
                                    <Text style={ficCardStyle.ficAuthors} key={index}>{author}</Text>
                                ))}
                            </View>
                            <View style={ficCardStyle.dividerContainer}><View style={ficCardStyle.divider}></View></View>
                            {/* Summary of fic */}
                            <View style={ficCardStyle.summaryContainer}>
                                {/* If empty - no summary available */}
                                {res.summary == '' && <Text style={ficCardStyle.ficSummaryEmpty}>No summary available ...</Text>}

                                {res.summary != '' && <Text style={ficCardStyle.ficSummary}>{res.summary}</Text>}
                            </View>

                        </Pressable>
                    ))}
                </ScrollView>
            </View>
        )
    }
}

export default ShowFics