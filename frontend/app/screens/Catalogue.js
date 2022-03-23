import React, { Component } from 'react'
import { Pressable, View, ActivityIndicator, Text, TouchableOpacity } from 'react-native'
import helpers from '../components/helpers'
import { ScrollView } from 'react-native-gesture-handler'

// Stylesheets
const styles = require('../stylesheets/mainStylesheet')
const pageStyle = require('../stylesheets/catalogueStyle')
const ficCardStyle = require('../stylesheets/fanficCardStyle')

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

                    <View style={pageStyle.headerContainer}>
                        <View style={pageStyle.buttonContainer}>
                            <TouchableOpacity
                                style={pageStyle.buttonStyle}
                                onPress={() => this.props.navigation.goBack()}
                            >
                                <Text style={styles.buttonText}>Back</Text>
                            </TouchableOpacity>
                        </View>
                        <View style={pageStyle.pageTitleContainer}>
                            <Text style={styles.pageTitleText}>{this.props.route.params.title}</Text>
                        </View>
                    </View>




                    <ScrollView>
                        {this.state.fics.length == 0 && <Text style={styles.emptyMessage}>There are no fanfictions currently in this catalogue</Text>}
                        {this.state.fics.length > 0 && !this.state.isLoading && (this.state.fics).map((fic, index) => (
                            <Pressable
                                key={index}
                                style={({ pressed }) => [ficCardStyle.ficContainer, pressed && ficCardStyle.ficContainerPressed]}>
                                <View style={ficCardStyle.ficHeader}>
                                    {/* Title of catalogue*/}
                                    <Text style={ficCardStyle.ficTitle}>{fic.title} </Text>
                                    {/* Authors of fic */}
                                    {fic.authors.map((author, index) => (
                                        <Text style={ficCardStyle.ficAuthors} key={index}>{author}</Text>
                                    ))}
                                </View>
                                {/* Summary of fic */}
                                <View style={ficCardStyle.summaryContainer}>
                                    {/* If empty - no summary available */}
                                    {fic.summary == '' && <Text style={ficCardStyle.ficSummaryEmpty}>No summary available ...</Text>}

                                    {fic.summary != '' && <Text style={ficCardStyle.ficSummary}>{fic.summary}</Text>}
                                </View>
                            </Pressable>
                        ))}
                    </ScrollView>
                </View>
            )
    }
}

export default Catalogue