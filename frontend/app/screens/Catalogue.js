import React, { Component, useCallback } from 'react'
import { View, ActivityIndicator, Text, TouchableOpacity, Linking, Alert } from 'react-native'
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
            fics: [],
            isLoading: true
        }
    }

    // Fetches list of catalogues associated with the user when the screen is first opened
    async componentDidMount() {
        // Add event listener so that catalogues are retrieved each time screen is focused
        const { navigation } = this.props;
        this.focusListener = navigation.addListener("focus", async () => {
            // Gets token associated with user
            let token = await helpers.getToken();

            // GET request - requests catalogues
            fetch('http://10.0.2.2:8000/api/getCatalogue/?id=' + this.props.route.params.id, {
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
                    this.setState({ fics: JSON.parse(data), isLoading: false })
                });
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

                    <View style={styles.headerContainer}>
                        <TouchableOpacity
                            style={styles.leftButton}
                            onPress={() => this.props.navigation.goBack()}
                        >
                            <Ionicons name={'chevron-back-outline'} size={24} color={'#FFFFFF'} />
                        </TouchableOpacity>
                        
                        <View style={[styles.pageTitleContainer, styles.containsLeftButton]}>
                            <Text style={styles.pageTitleText}>{this.props.route.params.title}</Text>
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
                                        <Text style={ficCardStyle.ficAuthors} key={index}>{author}</Text>
                                    ))}
                                </View>
                                <Divider />
                                {/* Summary of fic */}
                                <View style={ficCardStyle.summaryContainer}>
                                    {/* If empty - no summary available */}
                                    {fic.summary == '' && <Text style={ficCardStyle.ficSummaryEmpty}>No summary available ...</Text>}

                                    {fic.summary != '' && <Text style={ficCardStyle.ficSummary}>{fic.summary}</Text>}
                                </View>
                                <OpenFic ficID={fic.workid}></OpenFic>
                            </View>
                        ))}
                    </ScrollView>
                </View>
            )
    }
}

export default Catalogue