import React, { Component, useReducer } from 'react'
import { Text, View, TouchableOpacity, ActivityIndicator, TextInput, ScrollView, Image } from 'react-native'
import helpers from '../components/helpers'
import Ionicons from 'react-native-vector-icons/Ionicons'

const styles = require('../stylesheets/mainStylesheet')
const pageStyle = require('../stylesheets/addFriendsStyle')
const userCardStyle = require('../stylesheets/userCardStyle')

class AddFriends extends Component {
    //Constructor
    //States are set here
    constructor() {
        super();

        this.state = {
            users: [],
            hasSearched: false,
            hasFriendRequests: false,
            username: '',
            isLoading: false,
        }
    }

    updateUsername = (value) => {
        this.setState({ username: value })
    }

    searchUser = async () => {
        // Gets user token
        let token = await helpers.getToken();

        let data = null
        try {
            const response = await fetch('http://10.0.2.2:8000/api/searchUsers/?username=' + this.state.username, {
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
                this.setState({ users: data, hasSearched: true })

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

    // Send friend request to another user
    sendFriendRequest = async (user, index) => {
        // Set isLoading to true
        this.setState({ isLoading: true })

        // Gets user token
        let token = await helpers.getToken();

        try {
            const response = await fetch('http://10.0.2.2:8000/api/sendFriendRequest/', {
                method: 'POST',
                headers: {
                    Accept: 'application/json',
                    'Content-Type': 'application/json',
                    'Authorization': 'Token ' + token,
                },
                body: JSON.stringify({
                    'id': user.id,
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
                user.requestStatus = 's'
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

    acceptFriendRequest = async (request) => {
        // Set isLoading to true
        this.setState({ isLoading: true })

        // Gets user token
        let token = await helpers.getToken();

        try {
            const response = await fetch('http://10.0.2.2:8000/api/acceptFriendRequest/', {
                method: 'POST',
                headers: {
                    Accept: 'application/json',
                    'Content-Type': 'application/json',
                    'Authorization': 'Token ' + token,
                },
                body: JSON.stringify({
                    'id': request.id,
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
                    users: this.state.users.filter(function (r) {
                        return r !== request
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

    denyFriendRequest = async (request) => {
        // Set isLoading to true
        this.setState({ isLoading: true })

        // Gets user token
        let token = await helpers.getToken();

        try {
            const response = await fetch('http://10.0.2.2:8000/api/denyFriendRequest/', {
                method: 'POST',
                headers: {
                    Accept: 'application/json',
                    'Content-Type': 'application/json',
                    'Authorization': 'Token ' + token,
                },
                body: JSON.stringify({
                    'id': request.id,
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
                request.requestStatus = 'n'
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
        this.checkHasFriendRequests()
    }

    async checkHasFriendRequests() {
        // Set isLoading to true
        this.setState({ isLoading: true })

        // Gets user token
        let token = await helpers.getToken();

        let data = null
        try {
            const response = await fetch('http://10.0.2.2:8000/api/hasFriendRequests/', {
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
                if(data.hasFriendRequests == 'true') {
                    this.setState({ hasFriendRequests: true })
                }
                else this.setState({ hasFriendRequests: false })
               
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
    return (
        <View style={styles.container}>

            {/* HEADER - BACK BUTTON, PAGE TITLE, FRIEND REQUESTS BUTTON */}
            <View style={styles.headerContainer}>
                <TouchableOpacity
                    style={styles.leftButton}
                    onPress={() => this.props.navigation.goBack()}
                >
                    <Ionicons name={'chevron-back-outline'} size={22} color={'#FFFFFF'} />
                </TouchableOpacity>

                <View style={[styles.pageTitleContainer, styles.containsLeftButton]}>
                    <Text style={styles.pageTitleText}>Add Friends</Text>
                </View>

                <View style={styles.rightButton}>
                    <TouchableOpacity
                        onPress={() => this.props.navigation.navigate('FriendRequests')}
                    >
                        {!this.state.hasFriendRequests && <Ionicons name={'mail-outline'} size={22} color={'#FFFFFF'} />}
                        {this.state.hasFriendRequests && <Ionicons name={'mail-unread-outline'} size={22} color={'#FFFFFF'} />}
                    </TouchableOpacity>
                </View>
            </View>

            {/* MAIN CONTENT - SEARCH FUNCTIONALITY TO FIND USERS */}
            <ScrollView>
                <View style={styles.spaceTop} />
                <View style={styles.fieldContainer}>
                    <TextInput
                        style={styles.field}
                        autoCapitalize="none"
                        autoCorrect={false}
                        placeholder="Search user by username..."
                        placeholderTextColor='#CBCBCB'
                        onChangeText={this.updateUsername}
                    ></TextInput>

                    <View style={styles.buttonContainer}>
                        <TouchableOpacity style={styles.buttonStyle} onPress={this.searchUser}>
                            <Text style={styles.buttonText}>Search</Text>
                        </TouchableOpacity>
                    </View>

                </View>

                {/* RESULTS */}
                {this.state.users.length == 0 && this.state.hasSearched && <Text style={styles.emptyMessage}>No results</Text>}
                <View style={userCardStyle.mainContainer}>
                    {this.state.users.length > 0 && this.state.hasSearched && (this.state.users).map((user) => (
                        <TouchableOpacity
                            key={user.id}
                            style={userCardStyle.userContainer}
                            onPress={() => this.props.navigation.navigate('OtherUserProfile', {userID: user.id})}
                        >
                            <Image
                                style={userCardStyle.userAvatar}
                                source={{ uri: 'https://api.multiavatar.com/' + user.username + '.png' }}
                            />
                            <View style={userCardStyle.usernameContainer}>
                                <Text style={userCardStyle.username}>{user.username} </Text>
                            </View>

                            {(user.requestStatus == 'n' || user.requestStatus == 's') && <View style={userCardStyle.singleButtonContainer}>
                                {/* If no friend request has been sent/received between these two users - create a Send Request button */}
                                {user.requestStatus == 'n' &&
                                    <TouchableOpacity
                                        style={userCardStyle.sendRequestButton}
                                        onPress={() => this.sendFriendRequest(user)}
                                    >
                                        <Text style={userCardStyle.buttonText}>Send Request</Text>

                                    </TouchableOpacity>}
                                {user.requestStatus == 's' &&
                                    <View style={userCardStyle.requestSentButton}>
                                        <Text style={userCardStyle.buttonText}>Request Sent</Text>
                                    </View>}

                            </View>}
                            {user.requestStatus == 'r' &&
                                <View style={userCardStyle.acceptDenyRequest}>
                                    <View style={userCardStyle.acceptButtonContainer}>
                                        <TouchableOpacity
                                            style={userCardStyle.acceptButton}
                                            onPress={() => this.acceptFriendRequest(user)}
                                        >
                                            <Text style={userCardStyle.buttonText}>Accept</Text>
                                        </TouchableOpacity>
                                    </View>
                                    <View style={userCardStyle.denyButtonContainer}>
                                        <TouchableOpacity
                                            style={userCardStyle.denyButton}
                                            onPress={() => this.denyFriendRequest(user)}
                                        >
                                            <Text style={userCardStyle.buttonText}>Delete</Text>
                                        </TouchableOpacity>
                                    </View>
                                </View>}
                        </TouchableOpacity>
                    ))}
                </View>
            </ScrollView>

        </View>
    )
}
}

export default AddFriends