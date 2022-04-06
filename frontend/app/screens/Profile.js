import React, { Component } from 'react'
import { View, Text, Image, ActivityIndicator, ScrollView, TouchableOpacity, Linking } from 'react-native'
import helpers from '../components/helpers'
import Ionicons from 'react-native-vector-icons/Ionicons'
import Divider from '../components/Divider'

const styles = require('../stylesheets/mainStylesheet')
const pageStyle = require('../stylesheets/profileStyle')
const ra = require('../stylesheets/recentActivityStyle')

class Profile extends Component {
    //Constructor
    //States are set here
    constructor() {
        super();

        this.state = {
            username: '',
            avatar: null,
            isLoading: true,
            numCatalogues: 0,
            numFriends: 0,
            recentCatalogues: [],
            recentActivity: []
        }
    }

    async getUserInfo() {
        // Gets token associated with user
        let token = await helpers.getToken();

        // null as it is the profile of the current user
        username = ''
        try {
            const response = await fetch('http://10.0.2.2:8000/api/getUserInfo/?id=0', {
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
                this.setState({
                    username: data.username,
                    numCatalogues: data.numCatalogues,
                    numFriends: data.numFriends,
                    recentCatalogues: data.recentCatalogues,
                    recentActivity: JSON.parse(data.recentActivity)
                })
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
    async componentDidMount() {
        // Add event listener so that catalogues are retrieved each time screen is focused
        const { navigation } = this.props;
        this.focusListener = navigation.addListener("focus", async () => {
            // Get info about user to be shown on profile
            this.getUserInfo()
        });

        this.focusListener = navigation.addListener("blur", async () => {
            this.setState({ isLoading: true })
        });
    }

    componentWillUnmount() {
        // Remove the event listeners
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
                            onPress={() => this.props.navigation.navigate('Friends')}
                        >
                            <Ionicons name={'people'} size={22} color={'#FFFFFF'} />
                        </TouchableOpacity>
                        <View style={[styles.pageTitleContainer, styles.containsLeftButton]}>
                            <Text style={styles.pageTitleText}>Profile</Text>
                        </View>
                        <TouchableOpacity
                            style={styles.rightButton}
                            onPress={() => this.props.navigation.navigate('Settings')}
                        >
                            <Ionicons name={'settings'} size={22} color={'#FFFFFF'} />
                        </TouchableOpacity>
                    </View>
                    <ScrollView>
                        <View style={pageStyle.profileContainer}>
                            <Image
                                style={pageStyle.avatar}
                                source={{ uri: 'https://api.multiavatar.com/' + this.state.username + '.png' }}
                            />

                            <Text style={pageStyle.username}>@{this.state.username}</Text>
                        </View>
                        <View style={pageStyle.infoContainer}>
                            <View style={pageStyle.count}>
                                <Text style={pageStyle.countText}>Catalogues{'\n'}{this.state.numCatalogues}</Text>
                            </View>
                            <View style={pageStyle.count}>
                                <Text style={pageStyle.countText}>Friends{'\n'}{this.state.numFriends}</Text>
                            </View>
                        </View>


                        {/* ABOUT SECTION IF I EVER WANT IT - PUT ABOUT BACK IN STATE */}
                        {/*this.state.about.length > 0 && <View style={pageStyle.aboutContainer}>
                            <Text style={pageStyle.aboutText}>{this.state.about}</Text>
                        </View>*/}


                        <Divider />
                        <Text style={pageStyle.sectionTitle}>Recent Catalogues</Text>
                        <ScrollView horizontal={true} style={pageStyle.cataloguesContainer}>
                            {this.state.recentCatalogues.length > 0 && !this.state.isLoading && (this.state.recentCatalogues).map((catalogue) => (
                                <TouchableOpacity
                                    key={catalogue.id}
                                    style={pageStyle.catalogueContainer}
                                    onPress={() => this.props.navigation.navigate('CatalogueStack', {
                                        screen: 'Catalogue',
                                        params: { 'id': catalogue.id },
                                        initial: false
                                    })}
                                >
                                    {/* Title of catalogue*/}
                                    <Text style={pageStyle.catalogueTitle}>{catalogue.title} </Text>
                                </TouchableOpacity>

                            ))}
                        </ScrollView>
                        <View style={pageStyle.buttonContainer}>
                            <TouchableOpacity
                                style={pageStyle.buttonStyle}
                                onPress={() => this.props.navigation.navigate('CatalogueStack', { screen: 'AllCatalogues' })}
                            >
                                <Text style={styles.buttonText}>View all catalogues</Text>
                            </TouchableOpacity>
                        </View>
                        <Divider />
                        <Text style={pageStyle.sectionTitle}>Recent Activity</Text>
                        <View style={ra.recentActivityContainer}>
                            {this.state.recentActivity.length > 0 && !this.state.isLoading && (this.state.recentActivity).map((activity, index) => (
                                (
                                    activity.type === 'New Catalogue' &&
                                    <View key={index} style={ra.activityContainer}>
                                        <View style={ra.activityIcon}>
                                            <Ionicons name={'book-outline'} size={18} color={'#FFFFFF'} />
                                        </View>
                                        <View style={ra.activityDescription}>
                                            <Text style={ra.activityText}>created a new catalogue
                                                <Text style={ra.catalogueLink} onPress={() => this.props.navigation.navigate('CatalogueStack', {
                                                    screen: 'Catalogue',
                                                    params: { 'id': activity.id },
                                                    initial: false
                                                })}> {activity.title}</Text>
                                            </Text>
                                        </View>
                                    </View>
                                ) ||
                                (
                                    activity.type === 'New Fic' &&
                                    <View key={index} style={ra.activityContainer}>
                                        <View style={ra.activityIcon}>
                                            <Ionicons name={'add'} size={18} color={'#FFFFFF'} />
                                        </View>
                                        <View style={ra.activityDescription}>
                                            <Text style={ra.activityText}>added
                                                <Text style={ra.linkText} onPress={() => Linking.openURL('https://archiveofourown.org/works/' + activity.ficID + '/')}> {activity.ficTitle} </Text>
                                                to catalogue
                                                <Text style={ra.catalogueLink} onPress={() => this.props.navigation.navigate('CatalogueStack', {
                                                    screen: 'Catalogue',
                                                    params: { 'id': activity.catalogueID },
                                                    initial: false
                                                })}> {activity.catalogueTitle}</Text>
                                            </Text>
                                        </View>
                                    </View>
                                )
                            ))}
                        </View>
                    </ScrollView>
                </View>
            )
    }
}

export default Profile