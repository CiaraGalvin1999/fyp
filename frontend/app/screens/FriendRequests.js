import React, { Component } from 'react'
import { Text, View, TouchableOpacity, ActivityIndicator, ScrollView, Image } from 'react-native'
import Ionicons from 'react-native-vector-icons/Ionicons'
import helpers from '../components/helpers'

const styles = require('../stylesheets/mainStylesheet')
//const pageStyle = require('../stylesheets/friendRequestStyle')
const userCardStyle = require('../stylesheets/userCardStyle')

class FriendRequests extends Component {
    //Constructor
    //States are set here
    constructor() {
        super();

        this.state = {
            friendRequests: [],
            isLoading: true,
        }
    }

    componentDidMount = async () => {
        this.getFriendRequests()
    }

    getFriendRequests = async () => {
        // Set isLoading to true
        this.setState({ isLoading: true })

        // Gets user token
        let token = await helpers.getToken();

        let data = null
        try {
            const response = await fetch('http://10.0.2.2:8000/api/getFriendRequests', {
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
                this.setState({ friendRequests: data })
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

        let data = null
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
                this.setState({friendRequests: this.state.friendRequests.filter(function(r) { 
                    return r !== request
                })});
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

    let data = null
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
            this.setState({friendRequests: this.state.friendRequests.filter(function(r) { 
                return r !== request
            })});
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

                    {/* HEADER - CONTAINS BACK BUTTON AND PAGE TITLE */}
                    <View style={styles.headerContainer}>
                        <TouchableOpacity
                            style={styles.leftButton}
                            onPress={() => this.props.navigation.goBack()}
                        >
                            <Ionicons name={'chevron-back-outline'} size={24} color={'#FFFFFF'} />
                        </TouchableOpacity>

                        <View style={[styles.pageTitleContainer, styles.containsLeftButton]}>
                            <Text style={styles.pageTitleText}>Friend Requests</Text>
                        </View>
                    </View>

                    {/* MAIN CONTENT - SHOWS LIST OF FRIEND REQUESTS, IF ANY */}
                    <ScrollView>
                        {this.state.friendRequests.length == 0 && <Text style={styles.emptyMessage}>You have no friends requests</Text>}
                        <View style={userCardStyle.mainContainer}>
                            {this.state.friendRequests.length > 0 && !this.state.isLoading && (this.state.friendRequests).map((request) => (
                                <TouchableOpacity
                                    key={request.id}
                                    style={userCardStyle.userContainer}
                                //onPress={}    
                                >
                                    <Image
                                        style={userCardStyle.userAvatar}
                                        source={{ uri: 'https://api.multiavatar.com/' + request.username + '.png' }}
                                    />
                                    <View style={userCardStyle.usernameContainer}>
                                        <Text style={userCardStyle.username}>{request.username} </Text>
                                    </View>

                                    <View style={userCardStyle.acceptDenyRequest}>
                                        <View style={userCardStyle.acceptButtonContainer}>
                                        <TouchableOpacity
                                            style={userCardStyle.acceptButton}
                                            onPress={() => this.acceptFriendRequest(request)}
                                        >
                                            <Text style={userCardStyle.buttonText}>Accept</Text>
                                        </TouchableOpacity>
                                        </View>
                                        <View style={userCardStyle.denyButtonContainer}>
                                        <TouchableOpacity
                                            style={userCardStyle.denyButton}
                                            onPress={() => this.denyFriendRequest(request)}
                                        >
                                            <Text style={userCardStyle.buttonText}>Delete</Text>
                                        </TouchableOpacity>
                                        </View>
                                    </View>
                                </TouchableOpacity>

                            ))}
                        </View>

                    </ScrollView>
                </View>
            )
    }
}


export default FriendRequests



/*
<TouchableOpacity
    key={request.requestID}
    style={userCardStyle.userContainer}
//onPress={() => this.props.navigation.navigate('Catalogue', catalogue)}
>
    <Image
        style={userCardStyle.userAvatar}
        source={{ uri: 'https://api.multiavatar.com/' + request.username + '.png' }}
    />
    <View style={userCardStyle.usernameContainer}>
        <Text style={userCardStyle.username}>{request.username} </Text>
    </View>
    <TouchableOpacity
        style={userCardStyle.addOrRemoveFriendButton}
        onPress={() => this.sayHi()}
    >
        <Ionicons name={'person-remove'} size={20} color={'#FFFFFF'} />
    </TouchableOpacity>

</TouchableOpacity>
 */