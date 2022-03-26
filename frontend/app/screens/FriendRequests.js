import React, { Component } from 'react'
import { Text, View, TouchableOpacity, ActivityIndicator, ScrollView, Image } from 'react-native'
import Ionicons from 'react-native-vector-icons/Ionicons'
import helpers from '../components/helpers'
import Divider from '../components/Divider'

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
        // Gets token associated with user
        let token = await helpers.getToken();

        // GET request - requests catalogues
        fetch('http://10.0.2.2:8000/api/getFriendRequests', {
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
                this.setState({ friendRequests: JSON.parse(data), isLoading: false })
            });
    }

    acceptFriendRequest = async (id) => {
        // Gets user token
        let token = await helpers.getToken()

        fetch('http://10.0.2.2:8000/api/acceptFriendRequest/', {
            method: 'POST',
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json',
                'Authorization': 'Token ' + token,
            },
            body: JSON.stringify({
                'id': id,
            })
        })

            .catch(function (error) {
                console.log("Error: " + error);
            });
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
                                        <TouchableOpacity
                                            style={userCardStyle.acceptButton}
                                            onPress={() => this.acceptFriendRequest(request.id)}
                                        >
                                            <Text style={userCardStyle.buttonText}>Accept</Text>
                                        </TouchableOpacity>
                                        <TouchableOpacity
                                            style={userCardStyle.denyButton}
                                        //onPress={}
                                        >
                                            <Text style={userCardStyle.buttonText}>Delete</Text>
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