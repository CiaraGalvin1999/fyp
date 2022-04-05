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

class OtherUserCatalogue extends Component {
    //Constructor
    //States are set here
    constructor() {
        super();
        this.state = {
            fics: [],
            isLoading: true,
            title: ''
        }
    }

    getCatalogue = async (catalogueID) => {
        // Gets token associated with user
        let token = await helpers.getToken()

        let data = null
        try {
            const response = await fetch('http://10.0.2.2:8000/api/getCatalogue/?catalogueID=' + catalogueID, {
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
                this.setState({ title: data.title, fics: data.fics})
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
        userID = this.props.route.params.userID
        catalogueID = this.props.route.params.catalogueID
        this.getCatalogue(catalogueID)
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
                            <Ionicons name={'chevron-back-outline'} size={22} color={'#FFFFFF'} />
                        </TouchableOpacity>

                        <View style={[styles.pageTitleContainer, styles.containsLeftButton]}>
                            <Text style={styles.pageTitleText}>{this.state.title} {'\n'}<Text style={styles.pageSubtitleText}>created by {this.props.route.params.username}</Text></Text>
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
                            </View>
                        ))}
                    </ScrollView>
                </View>
            )
    }
}

export default OtherUserCatalogue