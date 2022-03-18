import React, { Component } from 'react';
import { View, ActivityIndicator, Text } from 'react-native';
import helpers from '../components/helpers';
import { ScrollView } from 'react-native-gesture-handler';
import { TOUCHABLE_STATE } from 'react-native-gesture-handler/lib/typescript/components/touchables/GenericTouchable';

// Stylesheets
const styles = require('../stylesheets/mainStylesheet');
const pageStyle = require('../stylesheets/catalogueStyle')

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
        return (
            <View style={styles.container}>
                {!this.state.isLoading &&
                    <View>
                        <Text style={pageStyle.catalogueTitle}>{this.props.route.params.title}</Text>
                        <ScrollView>
                            {this.state.fics.length == 0 && <Text style={pageStyle.noFics}>There are no fanfictions currently in this catalogue</Text>}
                            {this.state.fics.length > 0 && !this.state.isLoading && (this.state.fics).map((fic, index) => (
                                <View key={index} style={pageStyle.ficContainer}>
                                    <View style={pageStyle.ficHeader}>
                                        {/* Title of catalogue*/}
                                        <Text style={pageStyle.ficTitle}>{fic.title} </Text>
                                        {/* Authors of fic */}
                                        {fic.authors.map((author, index) => (
                                            <Text style={pageStyle.ficAuthors} key={index}>{author}</Text>
                                        ))}
                                    </View>
                                    {/* Summary of fic */}
                                    <View style={pageStyle.summaryContainer}>
                                        {/* If empty - no summary available */}
                                        {fic.summary == '' && <Text style={pageStyle.ficSummaryEmpty}>No summary available ...</Text>}

                                        {fic.summary != '' && <Text style={pageStyle.ficSummary}>{fic.summary}</Text>}
                                    </View>
                                </View>
                            ))}
                        </ScrollView>
                    </View>}
            </View>
        )
    }
}

export default Catalogue