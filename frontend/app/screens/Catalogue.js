import React, { Component, useCallback } from 'react'
import { View, ActivityIndicator, Text, TouchableOpacity, Linking, Alert, Modal, TouchableWithoutFeedback } from 'react-native'
import helpers from '../components/helpers'
import { ScrollView } from 'react-native-gesture-handler'
import Divider from '../components/Divider'
import Ionicons from 'react-native-vector-icons/Ionicons'

// Stylesheets
const styles = require('../stylesheets/mainStylesheet')
const pageStyle = require('../stylesheets/catalogueStyle')
const ficCardStyle = require('../stylesheets/fanficCardStyle')

const OpenFic = ({ ficID }) => {
    const handlePress = useCallback(async () => {
        // Create url - add work ID to end of link
        url = 'https://archiveofourown.org/works/' + ficID + '/'

        // Use Linking to open url
        const supported = await Linking.canOpenURL(url);
        if (supported) {
            await Linking.openURL(url);
        } else {
            Alert.alert(`Unable to open ${url}`);
        }

    }, [ficID]);

    return (
        <View style={ficCardStyle.ficFooter}>
            <TouchableOpacity onPress={handlePress}>
                <Text style={ficCardStyle.openFicLink}>Click here to open fanfiction on AO3</Text>
            </TouchableOpacity>
        </View>

    )
};

class Catalogue extends Component {
    //Constructor
    //States are set here
    constructor() {
        super();
        this.state = {
            title: '',
            fics: [],
            isLoading: true,
            removeModalVisible: false,
            ficToBeRemoved: null,
            ficToBeRemovedTitle: ''
        }
    }

    getCatalogue = async () => {
        // Gets token associated with user
        let token = await helpers.getToken()

        let data = null
        try {
            const response = await fetch('http://10.0.2.2:8000/api/getCatalogue/?userid=0&catalogueID=' + this.props.route.params.id, {
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
                this.setState({ title: data.title, fics: data.fics })
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
            this.getCatalogue()
        });

        // TO DO
        // This is a workaround to make it not look funky when a catalogue is navigated to from profile
        // Works fine actually but not sure that it is the best way to do this
        // Must make state reset when catalogue is blurred or smth idk
        // React native navigation reset can be used
        this.focusListener = navigation.addListener("blur", async () => {
            this.setState({ fics: [], isLoading: true })
        });
    }

    componentWillUnmount() {
        // Remove the event listener
        this.focusListener();
    }

    verifyRemove(fic) {
        // Opens modal
        this.setState({ ficToBeRemoved: fic, ficToBeRemovedTitle: fic.title, removeModalVisible: true})
    }

    closeModal() {
        this.setState({ removeModalVisible: false, ficToBeRemoved: null, ficToBeRemovedTitle: '' })
    }

    async removeFic() {
        // Set isLoading to true
        this.setState({ isLoading: true })
        fic = this.state.ficToBeRemoved

        // Gets user token
        let token = await helpers.getToken();

        try {
            const response = await fetch('http://10.0.2.2:8000/api/removeFic/', {
                method: 'POST',
                headers: {
                    Accept: 'application/json',
                    'Content-Type': 'application/json',
                    'Authorization': 'Token ' + token,
                },
                body: JSON.stringify({
                    'ficID': fic.workid,
                    'catalogueID': this.props.route.params.id
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
                    fics: this.state.fics.filter(function (f) {
                        return f !== fic
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
            this.setState({ isLoading: false, removeModalVisible: false, ficToBeRemoved: null, ficToBeRemovedTitle: '' })
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
        else
            return (

                <View style={styles.container}>

                    {/* REMOVE FIC MODAL */}
                    <Modal
                        visible={this.state.removeModalVisible}
                        animationType="slide"
                        transparent={true}
                        onRequestClose={() => this.setState({ removeModalVisible: false })}
                    >
                        <TouchableWithoutFeedback onPress={() => this.closeModal()}>
                            <View style={styles.modalOverlay} />
                        </TouchableWithoutFeedback>

                        <View style={styles.modalContent}>
                            <View style={styles.modalMain}>
                                <View style={styles.modalHeader}>
                                    <Text style={styles.modalHeaderText}>Are you sure you want to remove this fanfiction? </Text>
                                </View>
                                <Divider />
                                <View style={styles.modalMainContent}>
                                    <Text style={pageStyle.removeFicTitle}>{this.state.ficToBeRemovedTitle}</Text>
                                </View>
                                <View style={styles.modalFooter}>
                                    <TouchableOpacity
                                        style={styles.modalHalfButton}
                                        onPress={() => this.removeFic()}
                                    >
                                        <Text style={styles.buttonText}>Confirm</Text>
                                    </TouchableOpacity>
                                    <TouchableOpacity
                                        style={styles.modalCloseButton}
                                        onPress={() => this.closeModal()}
                                    >
                                        <Text style={styles.buttonText}>Cancel</Text>
                                    </TouchableOpacity>
                                </View>
                            </View>

                        </View>
                    </Modal>




                    <View style={styles.headerContainer}>
                        <TouchableOpacity
                            style={styles.leftButton}
                            onPress={() => this.props.navigation.goBack()}
                        >
                            <Ionicons name={'chevron-back-outline'} size={22} color={'#FFFFFF'} />
                        </TouchableOpacity>

                        <View style={[styles.pageTitleContainer, styles.containsLeftButton]}>
                            <Text style={styles.pageTitleText}>{this.state.title}</Text>
                        </View>
                    </View>

                    <ScrollView>
                        {this.state.fics.length == 0 && <Text style={styles.emptyMessage}>There are currently no fanfictions in this catalogue</Text>}
                        {this.state.fics.length > 0 && !this.state.isLoading && (this.state.fics).map((fic, index) => (

                            <View
                                key={index}
                                style={ficCardStyle.ficContainer}>
                                <View style={ficCardStyle.ficHeader}>
                                    {/* Title of catalogue*/}
                                    <Text style={ficCardStyle.ficTitle}>{fic.title} </Text>
                                    {/* Authors of fic */}
                                    {fic.authors.map((author, index) => (
                                        <Text style={ficCardStyle.ficAuthors} key={index}>{author.username}</Text>
                                    ))}
                                </View>
                                <Divider />
                                {/* Summary of fic */}
                                <View style={ficCardStyle.summaryContainer}>
                                    {/* If empty - no summary available */}
                                    {fic.summary == '' && <Text style={ficCardStyle.ficSummaryEmpty}>No summary available ...</Text>}

                                    {fic.summary != '' && <Text style={ficCardStyle.ficSummary}>{fic.summary}</Text>}
                                </View>
                                <Divider />
                                <OpenFic ficID={fic.workid}></OpenFic>
                                <View style={ficCardStyle.removeFicContainer}>
                                    <TouchableOpacity
                                        style={ficCardStyle.removeButton}
                                        onPress={() => this.verifyRemove(fic)}
                                    >
                                        <Text style={ficCardStyle.buttonText}>Remove from catalogue</Text>

                                    </TouchableOpacity>
                                </View>
                            </View>
                        ))}
                    </ScrollView>
                </View>
            )
    }
}

export default Catalogue