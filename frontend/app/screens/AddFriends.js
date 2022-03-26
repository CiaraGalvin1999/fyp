import React, { Component } from 'react'
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
        }
    }

    updateUsername = (value) => {
        this.setState({ username: value })
    }

    searchUser = async () => {
        let token = await helpers.getToken();

        // GET request - requests catalogues
        fetch('http://10.0.2.2:8000/api/searchUsers/?username=' + this.state.username, {
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
            // Saves users in result as state
            .then(data => {
                this.setState({ users: JSON.parse(data), hasSearched: true })
            });
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
                        <Ionicons name={'chevron-back-outline'} size={24} color={'#FFFFFF'} />
                    </TouchableOpacity>

                    <View style={[styles.pageTitleContainer, styles.containsLeftButton]}>
                        <Text style={styles.pageTitleText}>Add Friends</Text>
                    </View>

                    <View style={styles.rightButton}>
                        <TouchableOpacity
                            onPress={() => this.props.navigation.navigate('FriendRequests')}
                        >
                            {!this.state.hasFriendRequests && <Ionicons name={'mail-outline'} size={24} color={'#FFFFFF'} />}
                            {this.state.hasFriendRequests && <Ionicons name={'mail-unread-outline'} size={24} color={'#FFFFFF'} />}
                        </TouchableOpacity>
                    </View>
                </View>

                {/* MAIN CONTENT - SEARCH FUNCTIONALITY TO FIND USERS */}
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
                <ScrollView>
                    {this.state.users.length == 0 && this.state.hasSearched && <Text style={styles.emptyMessage}>No results</Text>}
                    {this.state.users.length > 0 && this.state.hasSearched && (this.state.users).map((user) => (
                        <TouchableOpacity
                            key={user.id}
                            style={userCardStyle.userContainer}
                        //onPress={() => this.props.navigation.navigate('Catalogue', catalogue)}
                        >
                            <Image
                                style={userCardStyle.userAvatar}
                                source={{ uri: 'https://api.multiavatar.com/' + user.username + '.png' }}
                            />
                            <View style={userCardStyle.usernameContainer}>
                                <Text style={userCardStyle.username}>{user.username} </Text>
                            </View>

                            <TouchableOpacity
                                style={userCardStyle.addOrRemoveFriendButton}
                                onPress={() => this.sayHi()}
                            >
                                <Ionicons name={'person-add'} size={20} color={'#FFFFFF'} />
                            </TouchableOpacity>
                        </TouchableOpacity>
                    ))}
                </ScrollView>

            </View>
        )
    }
}

export default AddFriends