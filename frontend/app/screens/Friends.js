import React, { Component } from 'react'
import { View, Text, TouchableOpacity, ScrollView, ActivityIndicator, Image, TextInput } from 'react-native'
import helpers from '../components/helpers'
import Ionicons from 'react-native-vector-icons/Ionicons'

const styles = require('../stylesheets/mainStylesheet')
const pageStyle = require('../stylesheets/friendsStyle')
const userCardStyle = require('../stylesheets/userCardStyle')

class Friends extends Component {
    //Constructor
    //States are set here
    constructor() {
        super();

        this.state = {
            friends: [],
            isLoading: true,
        }
    }

    getFriends = async () => {
        // Gets token associated with user
        let token = await helpers.getToken();

        let data = null
        try {
            const response = await fetch('http://10.0.2.2:8000/api/getFriends/', {
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
                this.setState({ friends: data })
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

    async removeFriend(friend) {
        // Set isLoading to true
        this.setState({ isLoading: true })

        // Gets user token
        let token = await helpers.getToken();

        try {
            const response = await fetch('http://10.0.2.2:8000/api/removeFriend/', {
                method: 'POST',
                headers: {
                    Accept: 'application/json',
                    'Content-Type': 'application/json',
                    'Authorization': 'Token ' + token,
                },
                body: JSON.stringify({
                    'id': friend.id,
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
                    friends: this.state.friends.filter(function (f) {
                        return f !== friend
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

    async componentDidMount() {
        this.getFriends()
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
                            <Text style={styles.pageTitleText}>Friends</Text>
                        </View>

                        <View style={styles.rightButton}>
                            <TouchableOpacity
                                onPress={() => this.props.navigation.navigate('AddFriends')}
                            >
                                <Ionicons name={'person-add'} size={24} color={'#FFFFFF'} />
                            </TouchableOpacity>
                        </View>

                    </View>

                    <ScrollView>
                        {this.state.friends.length == 0 && <Text style={styles.emptyMessage}>You have no friends.</Text>}
                        <View style={userCardStyle.mainContainer}>
                            {this.state.friends.length > 0 && !this.state.isLoading && (this.state.friends).map((friend) => (
                                <TouchableOpacity
                                    key={friend.id}
                                    style={userCardStyle.userContainer}
                                    onPress={() => this.props.navigation.navigate('Profile', friend.username)}
                                >
                                    <Image
                                        style={userCardStyle.userAvatar}
                                        source={{ uri: 'https://api.multiavatar.com/' + friend.username + '.png' }}
                                    />
                                    <View style={userCardStyle.usernameContainer}>
                                        <Text style={userCardStyle.username}>{friend.username} </Text>
                                    </View>
                                    <View style={userCardStyle.singleButtonContainer}>
                                        <TouchableOpacity
                                            style={userCardStyle.removeFriendButton}
                                            onPress={() => this.removeFriend(friend)}
                                        >
                                            <Text style={userCardStyle.buttonText}>Remove Friend</Text>
                                        </TouchableOpacity>
                                    </View>

                                </TouchableOpacity>
                            ))}
                        </View>
                    </ScrollView>
                </View>
            )
    }
}

export default Friends