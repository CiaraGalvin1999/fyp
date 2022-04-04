import React, { Component } from 'react'
import { Text, View, TouchableOpacity, Modal, TouchableWithoutFeedback, TextInput, ActivityIndicator } from 'react-native'
import helpers from '../components/helpers'
import { ScrollView } from 'react-native-gesture-handler'
import Ionicons from 'react-native-vector-icons/Ionicons'

// Stylesheets
const styles = require('../stylesheets/mainStylesheet');
const pageStyle = require('../stylesheets/allCataloguesStyle')

class AllOtherUserCatalogues extends Component {
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
        }
    }

    getCatalogues = async (userID) => {
        // Gets token associated with user
        let token = await helpers.getToken();

        let data = null
        try {
            const response = await fetch('http://10.0.2.2:8000/api/getCatalogues/?userID=' + userID, {
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
        userID = this.props.route.params.userID
        this.focusListener = navigation.addListener("focus", async () => {
            this.getCatalogues(userID)
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
                 <View style={styles.headerContainer}>
                        <TouchableOpacity
                            style={styles.leftButton}
                            onPress={() => this.props.navigation.goBack()}
                        >
                            <Ionicons name={'chevron-back-outline'} size={22} color={'#FFFFFF'} />
                        </TouchableOpacity>

                        <View style={[styles.pageTitleContainer, styles.containsLeftButton]}>
                            <Text style={styles.pageTitleText}>{this.props.route.params.username}'s catalogues</Text>
                        </View>
                    </View>

                <ScrollView contentContainerStyle={pageStyle.allCataloguesContainer}>
                    {this.state.catalogues.length == 0 && <Text style={styles.emptyMessage}>This user has no catalogues</Text>}
                    {this.state.catalogues.length > 0 && !this.state.isLoading && (this.state.catalogues).map((catalogue) => (

                        <TouchableOpacity
                            key={catalogue.id}
                            style={pageStyle.catalogueContainer}
                            onPress={() => this.props.navigation.navigate('OtherUserCatalogue', {userID: this.props.route.params.userID, username: this.props.route.params.username, catalogueID: catalogue.id, title: catalogue.title})}
                        >
                            {/* Title of catalogue*/}
                            <View style={pageStyle.title}>
                                <Text style={pageStyle.titleText}>{catalogue.title}</Text>
                            </View>
                            <View style={pageStyle.buttonsContainer}>
                                <View style={pageStyle.changePageIcon}>
                                    <Ionicons name={'chevron-forward-outline'} size={22} color={'#FFFFFF'} />
                                </View>

                            </View>
                        </TouchableOpacity>

                    ))}
                </ScrollView>
            </View>
        )
    }
}

export default AllOtherUserCatalogues