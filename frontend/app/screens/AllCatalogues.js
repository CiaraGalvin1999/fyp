import React, { Component } from 'react'
import { Text, View, TouchableOpacity, Modal, TouchableWithoutFeedback, TextInput, ActivityIndicator } from 'react-native'
import helpers from '../components/helpers'
import { ScrollView } from 'react-native-gesture-handler'
import Ionicons from 'react-native-vector-icons/Ionicons'

// Stylesheets
const styles = require('../stylesheets/mainStylesheet');
const pageStyle = require('../stylesheets/allCataloguesStyle')

class AllCatalogues extends Component {
    //Constructor
    //States are set here
    constructor() {
        super();
        this.state = {
            // True if catalogues are still being retrieved from the db
            // Loading screen is shown if true
            // If false, list of catalogues are shown
            isLoading: true,
            // Store list of catalogues
            catalogues: [],
            // Boolean that describes whether the create new catalogue modal is visible or not
            catalogueModalVisible: false,
            // Store new title of catalogue that user is creating
            newTitle: '',
            // This becomes true if the user tries to create a catalogue with an empty title - shows an error message
            titleNullError: false,
            // This becomes true if the user tries to create a catalogue with a title they already used - shows an error message
            notUniqueTitleError: false,
        }
    }

    getCatalogues = async () => {
        // Gets token associated with user
        let token = await helpers.getToken();

        let data = null
        try {
            const response = await fetch('http://10.0.2.2:8000/api/getCatalogues/', {
                method: 'GET',
                headers: {
                    'Authorization': 'Token ' + token,
                }
            })

            // Get status
            const statusCode = response.status

            // If unauthorised, clear token and log user out
            if (statusCode == 401) {
                helpers.clearToken()
            }
            // If success, parse data and update users
            else if (statusCode >= 200 && statusCode < 300) {
                const json = await response.json()
                data = JSON.parse(json)
                this.setState({ catalogues: data })
            }
            else if (statusCode >= 400 && statusCode < 500) {
                console.log('Client error.')
            }
            else if (statusCode >= 500 && statusCode < 600) {
                console.log('Server error.')
            }
        } catch (err) {
            console.log(err)
        } finally {
            this.setState({ isLoading: false })
        }
    }

    // Fetches list of catalogues associated with the user when the screen is first opened
    async componentDidMount() {
        // Add event listener so that catalogues are retrieved each time screen is focused
        const { navigation } = this.props;
        this.focusListener = navigation.addListener("focus", async () => {
            this.getCatalogues()
        });
    }

    componentWillUnmount() {
        // Remove the event listener
        this.focusListener();
    }

    // Sets state of title of new catalogue as user inputs it
    updateNewTitle = (value) => {
        this.setState({ newTitle: value })
    }

    // Checks that title of catalogue that user is currently trying to create is unique
    // If it is - returns true
    // If it is not - returns false
    checkUniqueTitle() {
        if (this.state.catalogues.length == 0) return true

        for (let i = 0; i < this.state.catalogues.length; i++) {
            let catalogue = this.state.catalogues[i]
            if (catalogue.title == this.state.newTitle) return false
        }
        return true
    }

    // Close modal makes modal invisible
    //  Null and not unique title errors are changed to false so that they are not shown when the modal is next opened
    closeModal() {
        this.setState({ catalogueModalVisible: false, titleNullError: false, notUniqueTitleError: false })
    }

    // Creates catalogue
    createCatalogue = async () => {

        // Gets user token
        let token = await helpers.getToken();

        // Ensure that user has entered a title
        // If it doesn't - creates an error message telling user that title cannot be null
        if (this.state.newTitle == '') {
            this.setState({ titleNullError: true, notUniqueTitleError: false })

        }

        // Ensures that user does not already have a title with that name
        else if (!this.checkUniqueTitle()) {
            this.setState({ notUniqueTitleError: true, titleNullError: false })
        }

        // If title isn't null or not unique, add catalogue to db 
        else {
            // Set loading to true when catalogue is being created 
            this.setState({ isLoading: true })

            let data = null
            try {
                const response = await fetch('http://10.0.2.2:8000/api/createCatalogue/', {
                    method: 'POST',
                    headers: {
                        Accept: 'application/json',
                        'Content-Type': 'application/json',
                        'Authorization': 'Token ' + token,
                    },
                    body: JSON.stringify({
                        'title': this.state.newTitle,
                    })
                })

                // Get status
                const statusCode = response.status

                // If unauthorised, clear token and log user out
                if (statusCode == 401) {
                    helpers.clearToken()
                }
                // If success, parse data and update users
                else if (statusCode >= 200 && statusCode < 300) {
                    const json = await response.json()
                    data = JSON.parse(json)

                    // Modal is no longer visible, newTitle is made null, and errors are removed from modal
                    this.setState({ catalogues: data, catalogueModalVisible: false, newTitle: '', titleNullError: false, notUniqueTitleError: false})
                }
                else if (statusCode >= 400 && statusCode < 500) {
                    console.log('Client error.')
                }
                else if (statusCode >= 500 && statusCode < 600) {
                    console.log('Server error.')
                }
            } catch (err) {
                console.log(err)
            } finally {
                this.setState({ isLoading: false })
            }
        }
    }

    async deleteCatalogue(catalogue) {
        // Set isLoading to true
        this.setState({ isLoading: true })

        // Gets user token
        let token = await helpers.getToken();

        try {
            const response = await fetch('http://10.0.2.2:8000/api/deleteCatalogue/', {
                method: 'POST',
                headers: {
                    Accept: 'application/json',
                    'Content-Type': 'application/json',
                    'Authorization': 'Token ' + token,
                },
                body: JSON.stringify({
                    'id': catalogue.id,
                })
            })


            // Get status
            const statusCode = response.status

            // If unauthorised, clear token and log user out
            if (statusCode == 401) {
                helpers.clearToken()
            }
            // If success, parse data and update users
            else if (statusCode >= 200 && statusCode < 300) {
                this.setState({
                    catalogues: this.state.catalogues.filter(function (c) {
                        return c !== catalogue
                    })
                });
            }
            else if (statusCode >= 400 && statusCode < 500) {
                console.log('Client error.')
            }
            else if (statusCode >= 500 && statusCode < 600) {
                console.log('Server error.')
            }
        } catch (err) {
            console.log(err)
        } finally {
            this.setState({ isLoading: false })
        }
    }


    render() {
        if (this.state.isLoading) {
            return (
                <View style={styles.loadingView}>
                    <ActivityIndicator size='large' />
                </View>
            )
        }
        return (
            <View style={styles.container}>

                {/* Modal for creating new catalogue - opened when user presses 'Create new catalogue' button */}
                <Modal
                    visible={this.state.catalogueModalVisible}
                    animationType="slide"
                    transparent={true}
                    onRequestClose={() => this.setState({ catalogueModalVisible: false })}
                >
                    <TouchableWithoutFeedback onPress={() => this.closeModal()}>
                        <View style={styles.modalOverlay} />
                    </TouchableWithoutFeedback>

                    <View style={styles.modalContent}>
                        <View style={styles.modalMain}>
                            <View style={styles.modalHeader}>
                                <Text style={styles.modalHeaderText}>Create new catalogue</Text>
                            </View>
                            <View style={styles.modalMainContent}>
                                {this.state.titleNullError && <Text style={styles.requiredErrorMessage}>Please enter a title</Text>}
                                {this.state.notUniqueTitleError && <Text style={styles.requiredErrorMessage}>You cannot have two catalogues with the same name</Text>}
                                <View style={styles.fieldContainer}>
                                    <TextInput
                                        style={{ color: '#FFFFFF' }}
                                        autoCapitalize="none"
                                        autoCorrect={false}
                                        placeholder="Enter title..."
                                        placeholderTextColor='#CBCBCB'
                                        onChangeText={this.updateNewTitle}
                                        maxLength={100}
                                        multiline={true}
                                    ></TextInput>
                                </View>
                            </View>
                        </View>
                        <View style={styles.modalFooter}>
                            <TouchableOpacity
                                style={styles.modalHalfButton}
                                onPress={this.createCatalogue}
                            >
                                <Text style={styles.buttonText}>Create</Text>
                            </TouchableOpacity>
                            <TouchableOpacity
                                style={styles.modalCloseButton}
                                onPress={() => this.closeModal()}
                            >
                                <Text style={styles.buttonText}>Close</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </Modal>

                <View style={styles.headerContainer}>
                    <View style={styles.pageTitleContainer}>
                        <Text style={styles.pageTitleText}>Catalogues</Text>
                    </View>
                </View>

                <ScrollView contentContainerStyle={pageStyle.allCataloguesContainer}>
                    <View style={pageStyle.buttonContainer}>
                        <TouchableOpacity
                            style={pageStyle.buttonStyle}
                            onPress={() => this.setState({ catalogueModalVisible: true })}
                        >
                            <Text style={styles.buttonText}><Ionicons name={'create-outline'} size={18} color={'#FFFFFF'} />  Create new catalogue</Text>
                        </TouchableOpacity>
                    </View>
                    {this.state.catalogues.length == 0 && <Text style={styles.emptyMessage}>You have no catalogues</Text>}
                    {this.state.catalogues.length > 0 && !this.state.isLoading && (this.state.catalogues).map((catalogue) => (

                        <TouchableOpacity
                            key={catalogue.id}
                            style={pageStyle.catalogueContainer}
                            onPress={() => this.props.navigation.navigate('Catalogue', catalogue)}
                        >
                            {/* Title of catalogue*/}
                            <View style={pageStyle.title}>
                                <Text style={pageStyle.titleText}>{catalogue.title}</Text>
                            </View>
                            <View style={pageStyle.buttonsContainer}>
                                <View style={pageStyle.changePageIcon}>
                                    <Ionicons name={'chevron-forward-outline'} size={22} color={'#FFFFFF'} />
                                </View>
                                <TouchableOpacity
                                    style={pageStyle.deleteCatalogueButton}
                                    onPress={() => this.deleteCatalogue(catalogue)}
                                >
                                    <Ionicons name={'trash-outline'} size={22} color={'#FFFFFF'} />
                                </TouchableOpacity>

                            </View>
                        </TouchableOpacity>

                    ))}
                </ScrollView>
            </View>
        )
    }
}

export default AllCatalogues