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

    async getFriends() {
        // Gets token associated with user
        let token = await helpers.getToken();

        // GET request - requests catalogues from db for logged in user
        fetch('http://10.0.2.2:8000/api/getFriends', {
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
            .then(data => JSON.parse(data))
            .then(data => {
                this.setState({ friends: data, isLoading: false })
            });
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
                        {this.state.friends.length > 0 && !this.state.isLoading && (this.state.friends).map((friend) => (
                            <TouchableOpacity
                                key={friend.id}
                                style={userCardStyle.userContainer}
                            //onPress={() => this.props.navigation.navigate('Catalogue', catalogue)}
                            >
                                <Image
                                    style={userCardStyle.userAvatar}
                                    source={{ uri: 'https://api.multiavatar.com/' + friend.username + '.png' }}
                                />
                                <View style={userCardStyle.usernameContainer}>
                                    <Text style={userCardStyle.username}>{friend.username} </Text>
                                </View>
                                <TouchableOpacity
                                    style={userCardStyle.addOrRemoveFriendButton}
                                    onPress={() => this.sayHi()}
                                >
                                    <Ionicons name={'person-remove'} size={20} color={'#FFFFFF'} />
                                </TouchableOpacity>

                            </TouchableOpacity>
                        ))}
                    </ScrollView>
                </View>
            )
    }
}

export default Friends