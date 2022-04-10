import React, { Component } from 'react'
import { View, Text, FlatList, Linking, ActivityIndicator, Image, TouchableOpacity } from 'react-native'
import helpers from '../components/helpers'

const styles = require('../stylesheets/mainStylesheet')
const pageStyle = require('../stylesheets/dashboardStyle')

class Dashboard extends Component {
    //Constructor
    //States are set here
    constructor() {
        super();

        this.state = {
            isLoading: true,
            recentActivity: [],
            page: 1,
            endOfDash: false, // Becomes true when there is no more recent activity being received
        }
    }

    increasePage() {
        this.setState({ page: (this.state.page + 1) })
        this.getDashboardData()
    }

    async getDashboardData() {
        // Gets token associated with user
        let token = await helpers.getToken();

        // If there is no more recent activity to be received, don't call fetch again
        if (!this.state.endOfDash) {
            try {
                const response = await fetch('http://10.0.2.2:8000/api/getDashboardData/?page=' + this.state.page, {
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
                    if (this.state.page == 1) {
                        this.setState({ recentActivity: data })
                    }
                    else {
                        for (i in data) {
                            this.state.recentActivity.push(data[i])
                        }
                        if (data.length == 0) {
                            this.setState({ endOfDash: true })
                        }
                    }

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
                setTimeout(() => {
                    this.setState({ isLoading: false })
                }, 1);

            }
        }
    }

    componentDidMount = async () => {
        this.getDashboardData()
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
                        <View style={styles.pageTitleContainer}>
                            <Text style={styles.pageTitleText}>Dashboard</Text>
                        </View>
                    </View>

                    <FlatList
                        contentContainerStyle={pageStyle.recentActivityContainer}
                        onEndReached={() => this.increasePage()}
                        onEndReachedThreshold={2}
                        initialNumToRender={10}
                        data={this.state.recentActivity}
                        keyExtractor={(item, index) => index.toString()}
                        renderItem={({ item }) =>
                        (
                            (
                                item.type === 'New Catalogue' &&
                                <View style={pageStyle.itemContainer}>
                                    <TouchableOpacity
                                        style={pageStyle.userContainer}
                                        onPress={() => this.props.navigation.navigate('OtherUserProfile', { userID: item.userID })}
                                    >
                                        <Image
                                            style={pageStyle.avatar}
                                            source={{ uri: 'https://api.multiavatar.com/' + item.username + '.png' }}
                                        />
                                        <Text style={pageStyle.usernameLink}>{item.username}</Text>
                                    </TouchableOpacity>
                                    <View style={pageStyle.activityContainer}>

                                        <View style={pageStyle.activityDescription}>
                                            <Text style={pageStyle.activityText}>created a new catalogue
                                                <Text style={pageStyle.catalogueLink}
                                                    onPress={() => this.props.navigation.navigate('OtherUserCatalogue', { userID: item.userID, username: item.username, catalogueID: item.id, title: item.title })}
                                                > {item.title}</Text>
                                            </Text>
                                        </View>
                                    </View>
                                </View>

                            ) ||

                            (
                                item.type === 'New Fic' &&
                                <View style={pageStyle.itemContainer}>
                                    <TouchableOpacity
                                        style={pageStyle.userContainer}
                                        onPress={() => this.props.navigation.navigate('OtherUserProfile', { userID: item.userID })}
                                    >
                                        <Image
                                            style={pageStyle.avatar}
                                            source={{ uri: 'https://api.multiavatar.com/' + item.username + '.png' }}
                                        />
                                        <Text style={pageStyle.usernameLink}>{item.username}</Text>
                                    </TouchableOpacity>
                                    <View style={pageStyle.activityContainer}>
                                        <View style={pageStyle.activityDescription}>
                                            <Text style={pageStyle.activityText}>added
                                                <Text style={pageStyle.linkText} onPress={() => Linking.openURL('https://archiveofourown.org/works/' + item.ficID + '/')}> {item.ficTitle} </Text>
                                                to catalogue
                                                <Text
                                                    style={pageStyle.catalogueLink}
                                                    onPress={() => this.props.navigation.navigate('OtherUserCatalogue', { userID: item.userID, username: item.username, catalogueID: item.catalogueID, title: item.catalogueTitle})}
                                                > {item.catalogueTitle}</Text>
                                            </Text>
                                        </View>
                                    </View>
                                </View>
                            )
                        )}
                    />
                </View>
            )
    }
}

export default Dashboard